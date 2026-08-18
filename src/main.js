import './style.css';
import Peer from 'peerjs';

// Global State
const state = {
  peer: null,
  myPeerId: '',
  myUsername: localStorage.getItem('cc_username') || ('Usuário_' + Math.floor(Math.random() * 8999 + 1000)),
  roomCode: '',
  roomPassword: '',
  isHost: false,
  isAuthenticated: false,
  roomMembers: new Map(), // peerId -> username
  dataConnections: new Map(), // peerId -> connection
  mediaCalls: new Map(), // peerId -> call
  cameraCalls: new Map(), // peerId -> call
  myScreenStream: null,
  myCameraStream: null,
  activeRemoteStreams: new Map(), // streamKey -> { stream, call, peerId, username }
  screenSettings: {
    resolution: '480',
    fps: '30'
  },
  autoSyncInterval: null,
  autoQualityInterval: null,
  heartbeatInterval: null,
  lastHeartbeat: new Map(), // peerId -> timestamp
  isToolbarHidden: false
};

// Render Shell
document.getElementById('app').innerHTML = `
  <header id="main-header">
    <h1>compartilhamento compartilhado</h1>
    <div id="header-status" style="font-size: 0.9rem; color: var(--text-muted);">Status: Desconectado</div>
  </header>

  <main class="main-content" id="main-content">
  </main>

  <button id="floating-toggle-btn" class="btn btn-secondary floating-toggle-btn" style="display: none;">Mostrar Interface</button>
  <div id="modal-container"></div>
  <div class="toast-container" id="toast-container" style="display: none;"></div>
`;

// Toast Notification - Silenced per user request ("evite as notificação pra num ficar alertando tudo toda hr")
function showToast(msg, duration = 4000) {
  // Notifications silenced
}

// Floating Bar Toggle
const floatBtn = document.getElementById('floating-toggle-btn');
floatBtn.addEventListener('click', () => {
  toggleToolbar(false);
});

function toggleToolbar(hide) {
  state.isToolbarHidden = hide;
  const header = document.getElementById('main-header');
  const roomBar = document.getElementById('main-room-bar');

  if (hide) {
    if (header) header.classList.add('hidden-bar');
    if (roomBar) roomBar.classList.add('hidden-bar');
    floatBtn.style.display = 'block';
  } else {
    if (header) header.classList.remove('hidden-bar');
    if (roomBar) roomBar.classList.remove('hidden-bar');
    floatBtn.style.display = 'none';
  }
}

// Cryptographically Secure High-Entropy Room Code Generator
function generateSecureCode() {
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'sec-';
  for (let i = 0; i < 24; i++) {
    code += chars.charAt(array[i] % chars.length);
  }
  return code;
}

// Get URL Parameters
function getUrlParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    room: p.get('room') || p.get('join') || '',
    pwd: p.get('pwd') || ''
  };
}

// Render Lobby
function renderLobby() {
  stopAutoSync();
  stopAutoQualityMonitor();
  stopHeartbeat();
  toggleToolbar(false);
  state.roomCode = '';
  state.roomPassword = '';
  state.isHost = false;
  state.isAuthenticated = false;
  document.getElementById('header-status').innerText = 'Status: Desconectado';

  const urlParams = getUrlParams();

  if (urlParams.room) {
    enterRoom(urlParams.room, urlParams.pwd);
    return;
  }

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="lobby-container">
      <div class="card">
        <h2 style="font-size: 1.1rem; margin-bottom: 1rem;">Entrar ou Criar Sala</h2>

        <div class="field-group">
          <label>Seu Nome / Apelido</label>
          <input type="text" id="input-username" placeholder="Digite seu nome" value="${state.myUsername}">
        </div>

        <div class="field-group">
          <label>Senha da Sala (Opcional)</label>
          <input type="password" id="input-password" placeholder="Digite uma senha personalizada se desejar">
        </div>

        <div style="margin-top: 1.25rem;">
          <button class="btn" id="btn-create" style="width: 100%;">Criar Sala e Compartilhar Link</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-create').addEventListener('click', () => {
    const usernameInput = document.getElementById('input-username').value.trim();
    if (usernameInput) {
      state.myUsername = usernameInput;
      localStorage.setItem('cc_username', usernameInput);
    }
    const code = generateSecureCode();
    const password = document.getElementById('input-password').value.trim();
    enterRoom(code, password);
  });
}

// Render Active Room View
function renderRoomView() {
  document.getElementById('header-status').innerText = `Status: Na Sala (${state.myUsername})`;

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="room-bar" id="main-room-bar">
      <div class="room-info">
        <span>Link da Sala:</span>
        ${state.roomPassword ? '<span style="font-size: 0.8rem; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Protegida por Senha</span>' : ''}
        <span id="member-count-label" style="font-size: 0.9rem; color: var(--text-muted);">(1 pessoa na sala)</span>
      </div>

      <div class="room-actions">
        <button class="btn" id="btn-toggle-share">Compartilhar Minha Tela</button>
        <button class="btn btn-secondary" id="btn-toggle-cam">Ligar Câmera</button>
        <button class="btn btn-secondary" id="btn-reset-layout">Resetar Layout</button>
        <button class="btn btn-secondary" id="btn-sync-streams">Sincronizar Transmissões</button>
        <button class="btn btn-secondary" id="btn-toggle-toolbar">Esconder Interface</button>
        <button class="btn btn-secondary" id="btn-copy">Copiar Link</button>
        <button class="btn btn-danger" id="btn-leave">Sair</button>
      </div>
    </div>

    <div id="video-grid" class="video-grid">
    </div>

    <div id="empty-state" class="empty-state">
      Nenhuma tela ou câmera está sendo compartilhada no momento.<br>
      Qualquer pessoa conectada pode clicar em <strong>"Compartilhar Minha Tela"</strong> ou <strong>"Ligar Câmera"</strong> para transmitir.
    </div>
  `;

  document.getElementById('btn-copy').addEventListener('click', () => {
    let url = `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`;
    if (state.roomPassword) {
      url += `&pwd=${encodeURIComponent(state.roomPassword)}`;
    }
    navigator.clipboard.writeText(url);
  });

  document.getElementById('btn-toggle-toolbar').addEventListener('click', () => {
    toggleToolbar(true);
  });

  document.getElementById('btn-reset-layout').addEventListener('click', () => {
    resetBoardLayout();
  });

  document.getElementById('btn-sync-streams').addEventListener('click', () => {
    syncStreams();
  });

  document.getElementById('btn-leave').addEventListener('click', () => {
    leaveRoom();
  });

  document.getElementById('btn-toggle-share').addEventListener('click', () => {
    if (state.myScreenStream) {
      stopMyScreenShare();
    } else {
      startMyScreenShare();
    }
  });

  document.getElementById('btn-toggle-cam').addEventListener('click', () => {
    if (state.myCameraStream) {
      stopMyWebcam();
    } else {
      startMyWebcam();
    }
  });

  startAutoSync();
  startAutoQualityMonitor();
  startHeartbeat();
  updateVideoGrid();
}

// Reset Board Layout to mathematically optimal arrangement based on screen size & stream count
function resetBoardLayout() {
  const cards = document.querySelectorAll('.video-card');
  if (!cards.length) return;

  const streamCount = cards.length;
  let targetClass = 'size-small';

  if (streamCount === 1) {
    targetClass = 'size-large';
  } else if (streamCount === 2) {
    targetClass = 'size-medium';
  }

  cards.forEach(card => {
    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.width = '';
    card.style.height = '';
    card.style.zIndex = '';

    card.classList.remove('size-small', 'size-medium', 'size-large');
    card.classList.add(targetClass);

    const sizeSel = card.querySelector(`select[id^="size-sel-"]`);
    if (sizeSel) {
      sizeSel.value = targetClass;
    }
  });
}

// Auto Sync Background Loop
function startAutoSync() {
  stopAutoSync();
  state.autoSyncInterval = setInterval(() => {
    if (state.activeRemoteStreams.size === 0 && !state.myScreenStream && !state.myCameraStream) {
      syncStreams();
    }
  }, 6000);
}

function stopAutoSync() {
  if (state.autoSyncInterval) {
    clearInterval(state.autoSyncInterval);
    state.autoSyncInterval = null;
  }
}

// Host Quality Monitor Algorithm
let consecutivePristineCount = 0;
let currentAutoRes = '480';

function startAutoQualityMonitor() {
  stopAutoQualityMonitor();
  state.autoQualityInterval = setInterval(async () => {
    if (!state.myScreenStream || state.screenSettings.resolution !== 'auto') return;

    let totalPacketsLost = 0;
    let totalPacketsSent = 0;

    for (const call of state.mediaCalls.values()) {
      if (call && call.peerConnection) {
        try {
          const stats = await call.peerConnection.getStats();
          stats.forEach(report => {
            if (report.type === 'outbound-rtp' && report.kind === 'video') {
              totalPacketsSent += report.packetsSent || 0;
            }
            if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
              totalPacketsLost += report.packetsLost || 0;
            }
          });
        } catch (e) {}
      }
    }

    if (totalPacketsSent > 50) {
      const lossRatio = totalPacketsLost / totalPacketsSent;

      if (lossRatio > 0.02) {
        consecutivePristineCount = 0;
        if (currentAutoRes !== '480') {
          currentAutoRes = '480';
          applyRealtimeQuality(state.myScreenStream, '480', '30');
        }
      } else {
        consecutivePristineCount++;
        if (consecutivePristineCount >= 5) {
          consecutivePristineCount = 0;
          if (currentAutoRes === '480') {
            currentAutoRes = '720';
            applyRealtimeQuality(state.myScreenStream, '720', '30');
          } else if (currentAutoRes === '720') {
            currentAutoRes = '1080';
            applyRealtimeQuality(state.myScreenStream, '1080', '60');
          }
        }
      }
    }
  }, 3000);
}

function stopAutoQualityMonitor() {
  if (state.autoQualityInterval) {
    clearInterval(state.autoQualityInterval);
    state.autoQualityInterval = null;
  }
}

// Connection Heartbeat & Anti-Ghost Cleanup
function startHeartbeat() {
  stopHeartbeat();
  state.heartbeatInterval = setInterval(() => {
    const now = Date.now();
    
    state.dataConnections.forEach((conn, peerId) => {
      if (conn && conn.open) {
        conn.send({ type: 'PING' });
      } else {
        removePeer(peerId);
      }
    });

    state.lastHeartbeat.forEach((lastTime, peerId) => {
      if (now - lastTime > 12000) {
        removePeer(peerId);
      }
    });

    // Check remote stream track health
    state.activeRemoteStreams.forEach((data, streamKey) => {
      if (!data.stream) {
        removeRemoteStream(streamKey);
        return;
      }
      const tracks = data.stream.getVideoTracks();
      if (!tracks.length || tracks.every(t => t.readyState === 'ended')) {
        removeRemoteStream(streamKey);
      }
    });
  }, 4000);
}

function stopHeartbeat() {
  if (state.heartbeatInterval) {
    clearInterval(state.heartbeatInterval);
    state.heartbeatInterval = null;
  }
}

function removePeer(peerId) {
  state.dataConnections.delete(peerId);
  state.roomMembers.delete(peerId);
  state.lastHeartbeat.delete(peerId);
  
  if (state.mediaCalls.has(peerId)) {
    try { state.mediaCalls.get(peerId).close(); } catch(e){}
    state.mediaCalls.delete(peerId);
  }
  if (state.cameraCalls.has(peerId)) {
    try { state.cameraCalls.get(peerId).close(); } catch(e){}
    state.cameraCalls.delete(peerId);
  }

  removePeerStreams(peerId);
  updateMemberCountLabel();
  broadcastMemberList();
  updateVideoGrid();
}

// WebAudio & LocalStorage Persistence System for Chrome compatibility
let globalAudioCtx = null;

function getAudioContext() {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      globalAudioCtx = new AudioContextClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

document.addEventListener('pointerdown', () => { getAudioContext(); }, { passive: true });
document.addEventListener('keydown', () => { getAudioContext(); }, { passive: true });

const STORAGE_VOLUMES_KEY = 'cc_saved_volumes';

function getSavedVolumeState(streamKey, username = '', isCam = false) {
  const type = isCam ? 'cam' : 'screen';
  try {
    const raw = localStorage.getItem(STORAGE_VOLUMES_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data[streamKey] && typeof data[streamKey].volume === 'number') {
        return data[streamKey];
      }
      if (username) {
        const userTypeKey = `${username}-${type}`;
        if (data[userTypeKey] && typeof data[userTypeKey].volume === 'number') {
          return data[userTypeKey];
        }
        if (data[username] && typeof data[username].volume === 'number') {
          return data[username];
        }
      }
      if (data['global_default'] && typeof data['global_default'].volume === 'number') {
        return data['global_default'];
      }
    }
  } catch (e) {}

  return { volume: 100, muted: false };
}

function saveVolumeState(streamKey, username, isCam, volume, muted) {
  const type = isCam ? 'cam' : 'screen';
  const volInt = Math.max(0, Math.min(100, parseInt(volume, 10) || 0));
  const isMuted = !!muted;
  const stateObj = { volume: volInt, muted: isMuted, updatedAt: Date.now() };

  try {
    const raw = localStorage.getItem(STORAGE_VOLUMES_KEY);
    const data = raw ? JSON.parse(raw) : {};

    if (streamKey) data[streamKey] = stateObj;
    if (username) {
      data[`${username}-${type}`] = stateObj;
      data[username] = stateObj;
    }
    data['global_default'] = stateObj;

    localStorage.setItem(STORAGE_VOLUMES_KEY, JSON.stringify(data));
  } catch (e) {}
}

const remoteAudioNodes = new Map(); // streamKey -> { sourceNode, gainNode, stream }

function cleanupRemoteAudioNodes(streamKey) {
  const nodes = remoteAudioNodes.get(streamKey);
  if (nodes) {
    if (nodes.sourceNode) {
      try { nodes.sourceNode.disconnect(); } catch (e) {}
    }
    if (nodes.gainNode) {
      try { nodes.gainNode.disconnect(); } catch (e) {}
    }
    remoteAudioNodes.delete(streamKey);
  }
}

function removeRemoteStream(streamKey) {
  cleanupRemoteAudioNodes(streamKey);
  const data = state.activeRemoteStreams.get(streamKey);
  if (data) {
    if (data.call) {
      try { data.call.close(); } catch(e){}
    }
    if (data.stream) {
      data.stream.getTracks().forEach(t => t.stop());
    }
    state.activeRemoteStreams.delete(streamKey);
  }
  
  // Directly remove DOM node if present
  const tile = document.getElementById(`tile-stream-${streamKey}`);
  if (tile) {
    tile.remove();
  }
  updateVideoGrid();
}

// Broadcast Stream Sync Request
function syncStreams() {
  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      conn.send({ type: 'REQUEST_STREAMS' });
    }
  });
}

// Apply Constraints in Real-Time to active stream track
async function applyRealtimeQuality(stream, resVal, fpsVal) {
  if (!stream) return;
  const track = stream.getVideoTracks()[0];
  if (!track) return;

  const constraints = {};

  if (resVal === '480') {
    constraints.width = { ideal: 854, max: 854 };
    constraints.height = { ideal: 480, max: 480 };
  } else if (resVal === '720') {
    constraints.width = { ideal: 1280, max: 1280 };
    constraints.height = { ideal: 720, max: 720 };
  } else if (resVal === '1080') {
    constraints.width = { ideal: 1920, max: 1920 };
    constraints.height = { ideal: 1080, max: 1080 };
  } else if (resVal === '1440') {
    constraints.width = { ideal: 2560, max: 2560 };
    constraints.height = { ideal: 1440, max: 1440 };
  } else if (resVal === '4k') {
    constraints.width = { ideal: 3840, max: 3840 };
    constraints.height = { ideal: 2160, max: 2160 };
  }

  const fps = parseInt(fpsVal, 10) || 30;
  constraints.frameRate = { ideal: fps, max: fps };

  try {
    await track.applyConstraints(constraints);
  } catch (err) {}
}

// Drag-to-Reorder Tiles (Strict Zero-Overlap Flex Flow Layout)
function makeCardDraggable(card, header) {
  let isDragging = false;

  header.addEventListener('pointerdown', (e) => {
    const targetTag = e.target.tagName;
    if (targetTag === 'BUTTON' || targetTag === 'SELECT' || targetTag === 'INPUT' || targetTag === 'LABEL') {
      return;
    }

    isDragging = true;
    card.classList.add('dragging');
    header.setPointerCapture(e.pointerId);
  });

  header.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const grid = document.getElementById('video-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.video-card:not(.dragging)'));
    const targetCard = cards.find(other => {
      const rect = other.getBoundingClientRect();
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
    });

    if (targetCard) {
      const rect = targetCard.getBoundingClientRect();
      const nextSibling = (e.clientX > rect.left + rect.width / 2) ? targetCard.nextSibling : targetCard;
      if (nextSibling !== card) {
        grid.insertBefore(card, nextSibling);
      }
    }
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      card.classList.remove('dragging');
      try {
        header.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  header.addEventListener('pointerup', stopDrag);
  header.addEventListener('pointercancel', stopDrag);
}

// In-Flow Interactive Card Resizer (Strict Zero-Overlap)
function makeCardResizable(card) {
  const directions = ['tl', 'tr', 'bl', 'br'];

  directions.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resizer resizer-${dir}`;
    card.appendChild(handle);

    let isResizing = false;
    let startX = 0, startY = 0;
    let startW = 0, startH = 0;

    handle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;

      const rect = card.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;
      startX = e.clientX;
      startY = e.clientY;

      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener('pointermove', (e) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newW = startW;
      let newH = startH;

      if (dir.includes('r')) {
        newW = startW + dx;
      } else if (dir.includes('l')) {
        newW = startW - dx;
      }

      if (dir.includes('b')) {
        newH = startH + dy;
      } else if (dir.includes('t')) {
        newH = startH - dy;
      }

      const grid = document.getElementById('video-grid');
      const maxW = grid ? grid.clientWidth - 40 : 1600;

      newW = Math.max(320, Math.min(maxW, newW));
      newH = Math.max(220, newH);

      card.style.width = `${newW}px`;
      card.style.height = `${newH}px`;
      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
    });

    const stopResize = (e) => {
      if (isResizing) {
        isResizing = false;
        try {
          handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    };

    handle.addEventListener('pointerup', stopResize);
    handle.addEventListener('pointercancel', stopResize);
  });
}


// Track current physical delay targets for each video element
const currentStreamDelays = new Map();

// Apply Delay Playout Buffer to WebRTC stream (default set to 5.0 seconds)
function applyStreamPlayoutBuffer(videoElement, peerCall, bufferSeconds = 5.0) {
  if (!videoElement) return;

  const seconds = parseFloat(bufferSeconds) || 5.0;
  const ms = seconds * 1000;
  const elementId = videoElement.id;
  const prevSeconds = currentStreamDelays.get(elementId) || 5.0;

  currentStreamDelays.set(elementId, seconds);

  // Configure WebRTC RTP Receiver targets
  if (peerCall && peerCall.peerConnection) {
    try {
      const receivers = peerCall.peerConnection.getReceivers();
      receivers.forEach(receiver => {
        if ('jitterBufferTarget' in receiver) {
          receiver.jitterBufferTarget = ms;
        }
        if ('playoutDelayHint' in receiver) {
          receiver.playoutDelayHint = seconds;
        }
      });
    } catch (e) {}
  }

  if ('playoutDelayHint' in videoElement) {
    try {
      videoElement.playoutDelayHint = seconds;
    } catch (e) {}
  }

  if (seconds > prevSeconds && videoElement.srcObject) {
    const diffMs = Math.min(5000, (seconds - prevSeconds) * 1000);
    videoElement.pause();
    setTimeout(() => {
      videoElement.play().catch(() => {});
    }, diffMs);
  }
}

// Incremental / Preservative DOM Video Grid Update
function updateVideoGrid() {
  const grid = document.getElementById('video-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  const activeTileIds = new Set();

  // Local Screen Stream
  if (state.myScreenStream) {
    const id = 'tile-my-local-screen';
    activeTileIds.add(id);
    if (!document.getElementById(id)) {
      const tile = createLocalVideoTile(id, 'Sua Tela (Você)', state.myScreenStream);
      grid.appendChild(tile);
    }
  }

  // Local Camera Stream
  if (state.myCameraStream) {
    const id = 'tile-my-local-cam';
    activeTileIds.add(id);
    if (!document.getElementById(id)) {
      const tile = createLocalVideoTile(id, 'Sua Câmera (Você)', state.myCameraStream);
      grid.appendChild(tile);
    }
  }

  // Remote Streams
  state.activeRemoteStreams.forEach((data, streamKey) => {
    const id = `tile-stream-${streamKey}`;
    activeTileIds.add(id);

    if (!document.getElementById(id)) {
      const peerId = data.peerId || streamKey.split('-')[0];
      const isCam = streamKey.includes('-cam');
      const uname = data.username || state.roomMembers.get(peerId) || peerId.substring(0, 8);
      const label = isCam ? `Câmera de ${uname}` : `Tela de ${uname}`;

      const tile = createRemoteVideoTile(id, label, data.stream, data.call, streamKey);
      grid.appendChild(tile);
    }
  });

  // Remove departed stream tiles without touching existing ones
  const existingTiles = Array.from(grid.querySelectorAll('.video-card'));
  existingTiles.forEach(tile => {
    if (!activeTileIds.has(tile.id)) {
      tile.remove();
    }
  });

  if (empty) {
    empty.style.display = activeTileIds.size === 0 ? 'block' : 'none';
  }
}

// Create Local Presenter Video Tile
function createLocalVideoTile(id, labelText, stream) {
  const card = document.createElement('div');
  card.className = 'video-card size-small';
  card.id = id;

  card.innerHTML = `
    <div class="video-header" id="header-${id}">
      <span>${labelText}</span>
      <div class="video-controls-inline">
        <label style="font-size: 0.75rem;">Tam:</label>
        <select id="size-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="size-small" selected>Pequeno</option>
          <option value="size-medium">Médio</option>
          <option value="size-large">Grande</option>
        </select>

        <label style="font-size: 0.75rem;">Res:</label>
        <select id="res-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="480" ${state.screenSettings.resolution === '480' ? 'selected' : ''}>480p (SD)</option>
          <option value="720" ${state.screenSettings.resolution === '720' ? 'selected' : ''}>720p (HD)</option>
          <option value="1080" ${state.screenSettings.resolution === '1080' ? 'selected' : ''}>1080p (FHD)</option>
          <option value="1440" ${state.screenSettings.resolution === '1440' ? 'selected' : ''}>1440p (2K)</option>
          <option value="4k" ${state.screenSettings.resolution === '4k' ? 'selected' : ''}>4K (UHD)</option>
        </select>
        <label style="font-size: 0.75rem;">FPS:</label>
        <select id="fps-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="30" ${state.screenSettings.fps === '30' ? 'selected' : ''}>30 FPS</option>
          <option value="60" ${state.screenSettings.fps === '60' ? 'selected' : ''}>60 FPS</option>
          <option value="15" ${state.screenSettings.fps === '15' ? 'selected' : ''}>15 FPS</option>
        </select>
        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" id="btn-fullscreen-${id}">Tela Cheia</button>
      </div>
    </div>
    <div class="video-wrapper">
      <video id="video-el-${id}" class="video-element" autoplay playsinline muted></video>
    </div>
  `;

  setTimeout(() => {
    const video = card.querySelector(`#video-el-${id}`);
    const fsBtn = card.querySelector(`#btn-fullscreen-${id}`);
    const resSel = card.querySelector(`#res-sel-${id}`);
    const fpsSel = card.querySelector(`#fps-sel-${id}`);
    const sizeSel = card.querySelector(`#size-sel-${id}`);
    const header = card.querySelector(`#header-${id}`);

    if (video) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }

    if (header) {
      makeCardDraggable(card, header);
    }

    makeCardResizable(card);

    if (sizeSel) {
      sizeSel.addEventListener('change', (e) => {
        card.style.width = '';
        card.style.height = '';
        card.classList.remove('size-small', 'size-medium', 'size-large');
        card.classList.add(e.target.value);
      });
    }

    if (resSel && fpsSel) {
      const handleQualityChange = () => {
        state.screenSettings.resolution = resSel.value;
        state.screenSettings.fps = fpsSel.value;
        applyRealtimeQuality(stream, resSel.value, fpsSel.value);
      };
      resSel.addEventListener('change', handleQualityChange);
      fpsSel.addEventListener('change', handleQualityChange);
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          card.querySelector('.video-wrapper').requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });
    }
  }, 50);

  return card;
}

// Create Remote Viewer Video Tile with WebAudio Volume Control & LocalStorage Persistence
function createRemoteVideoTile(id, labelText, stream, peerCall, streamKey) {
  const card = document.createElement('div');
  card.className = 'video-card size-small';
  card.id = id;

  const peerId = peerCall ? peerCall.peer : streamKey.split('-')[0];
  const isCam = streamKey.includes('-cam');
  const uname = state.activeRemoteStreams.get(streamKey)?.username || state.roomMembers.get(peerId) || peerId.substring(0, 8);

  // Load saved volume & mute state from localStorage for session continuity
  const savedState = getSavedVolumeState(streamKey, uname, isCam);
  let currentVolume = savedState.volume;
  let isMutedState = savedState.muted;
  let lastNonZeroVolume = currentVolume > 0 ? currentVolume : 100;

  card.innerHTML = `
    <div class="video-header" id="header-${id}">
      <span>${labelText}</span>
      <div class="video-controls-inline">
        <label style="font-size: 0.75rem;">Tam:</label>
        <select id="size-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="size-small" selected>Pequeno</option>
          <option value="size-medium">Médio</option>
          <option value="size-large">Grande</option>
        </select>

        <label style="font-size: 0.75rem;">Delay:</label>
        <select id="buf-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="5" selected>5.0s (Padrão)</option>
          <option value="3">3.0s (Médio)</option>
          <option value="1">1.0s (Baixo)</option>
          <option value="0.25">0.25s (Mínimo)</option>
        </select>

        <label style="font-size: 0.75rem;">Res:</label>
        <select id="res-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="480" selected>480p</option>
          <option value="720">720p</option>
          <option value="1080">1080p</option>
          <option value="1440">1440p</option>
          <option value="4k">4K</option>
        </select>

        <label style="font-size: 0.75rem;">FPS:</label>
        <select id="fps-sel-${id}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
          <option value="30" selected>30 FPS</option>
          <option value="60">60 FPS</option>
          <option value="15">15 FPS</option>
        </select>

        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" id="btn-mute-${id}">
          ${isMutedState || currentVolume === 0 ? 'Desmutar' : 'Mutar'}
        </button>
        
        <div class="volume-container">
          <label style="font-size: 0.75rem;">Vol:</label>
          <input type="range" id="vol-range-${id}" class="volume-slider" min="0" max="100" value="${currentVolume}">
          <input type="number" id="vol-num-${id}" class="volume-number-input" min="0" max="100" value="${currentVolume}">%
        </div>

        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" id="btn-fullscreen-${id}">Tela Cheia</button>
        <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" id="btn-close-${id}">Fechar Tela</button>
      </div>
    </div>
    <div class="video-wrapper">
      <video id="video-el-${id}" class="video-element" autoplay playsinline muted></video>
      <div class="audio-prompt-overlay" id="overlay-${id}" style="display: none;">
        <button class="btn" id="btn-watch-${id}" style="padding: 0.75rem 1.5rem; font-size: 1rem;">Assistir Transmissão</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const video = card.querySelector(`#video-el-${id}`);
    const overlay = card.querySelector(`#overlay-${id}`);
    const watchBtn = card.querySelector(`#btn-watch-${id}`);
    const fsBtn = card.querySelector(`#btn-fullscreen-${id}`);
    const closeBtn = card.querySelector(`#btn-close-${id}`);
    const volNum = card.querySelector(`#vol-num-${id}`);
    const volRange = card.querySelector(`#vol-range-${id}`);
    const muteBtn = card.querySelector(`#btn-mute-${id}`);
    const sizeSel = card.querySelector(`#size-sel-${id}`);
    const bufSel = card.querySelector(`#buf-sel-${id}`);
    const resSel = card.querySelector(`#res-sel-${id}`);
    const fpsSel = card.querySelector(`#fps-sel-${id}`);
    const header = card.querySelector(`#header-${id}`);

    // Set up WebAudio for Chrome/browser-compatible volume & muting
    cleanupRemoteAudioNodes(streamKey);

    let audioSourceNode = null;
    let gainNode = null;

    const setupAudioPipeline = () => {
      if (!stream) return;
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const audioStream = new MediaStream(audioTracks);
        audioSourceNode = ctx.createMediaStreamSource(audioStream);
        gainNode = ctx.createGain();
        audioSourceNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        remoteAudioNodes.set(streamKey, { sourceNode: audioSourceNode, gainNode, stream });
      } catch (err) {
        console.error('Error creating WebAudio node:', err);
      }
    };

    setupAudioPipeline();
    if (stream) {
      stream.onaddtrack = () => setupAudioPipeline();
    }

    // Attach ONLY video tracks to <video> element to prevent Chrome unattenuated WebRTC audio bypass
    if (video && stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        video.srcObject = new MediaStream(videoTracks);
      } else {
        video.srcObject = stream;
      }
      video.muted = true; // Video element stays muted; WebAudio outputs the audio cleanly

      applyStreamPlayoutBuffer(video, peerCall, 5.0);

      video.play().catch(() => {
        if (overlay) overlay.style.display = 'flex';
      });

      if (stream) {
        stream.getTracks().forEach(track => {
          track.onended = () => removeRemoteStream(streamKey);
        });
      }
    }

    // Apply Volume Function
    const applyVolume = (percent, isMuted) => {
      const clamped = Math.max(0, Math.min(100, parseInt(percent, 10) || 0));
      currentVolume = clamped;
      isMutedState = isMuted || clamped === 0;

      if (clamped > 0) {
        lastNonZeroVolume = clamped;
      }

      if (volNum) volNum.value = clamped;
      if (volRange) volRange.value = clamped;

      if (muteBtn) {
        muteBtn.innerText = isMutedState ? 'Desmutar' : 'Mutar';
      }

      // 1. WebAudio GainNode scaling
      if (gainNode) {
        const ctx = getAudioContext();
        const gainVal = isMutedState ? 0 : (clamped / 100);
        if (ctx) {
          gainNode.gain.setValueAtTime(gainVal, ctx.currentTime || 0);
        } else {
          gainNode.gain.value = gainVal;
        }
      }

      // 2. Hardware / stream track muting
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !isMutedState;
        });
      }

      // 3. Persist state to localStorage for session continuity
      saveVolumeState(streamKey, uname, isCam, currentVolume, isMutedState);
    };

    // Initialize with loaded localStorage values
    applyVolume(currentVolume, isMutedState);

    // Event listeners
    if (volNum) {
      volNum.addEventListener('input', (e) => applyVolume(e.target.value, false));
      volNum.addEventListener('change', (e) => applyVolume(e.target.value, false));
    }

    if (volRange) {
      volRange.addEventListener('input', (e) => applyVolume(e.target.value, false));
      volRange.addEventListener('change', (e) => applyVolume(e.target.value, false));
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        getAudioContext();
        if (isMutedState) {
          applyVolume(lastNonZeroVolume > 0 ? lastNonZeroVolume : 100, false);
        } else {
          applyVolume(currentVolume, true);
        }
      });
    }

    if (watchBtn) {
      watchBtn.addEventListener('click', () => {
        getAudioContext();
        if (video) video.play();
        applyVolume(currentVolume > 0 ? currentVolume : (lastNonZeroVolume || 100), false);
        if (overlay) overlay.style.display = 'none';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        removeRemoteStream(streamKey);
      });
    }

    if (header) {
      makeCardDraggable(card, header);
    }

    makeCardResizable(card);

    if (sizeSel) {
      sizeSel.addEventListener('change', (e) => {
        card.style.width = '';
        card.style.height = '';
        card.classList.remove('size-small', 'size-medium', 'size-large');
        card.classList.add(e.target.value);
      });
    }

    if (bufSel && video) {
      bufSel.addEventListener('change', (e) => {
        const seconds = parseFloat(e.target.value) || 5.0;
        applyStreamPlayoutBuffer(video, peerCall, seconds);
      });
    }

    if (resSel && fpsSel) {
      const sendQualityRequest = () => {
        const conn = state.dataConnections.get(peerId);
        if (conn && conn.open) {
          conn.send({
            type: 'REQUEST_QUALITY',
            res: resSel.value,
            fps: fpsSel.value
          });
        }
      };
      resSel.addEventListener('change', sendQualityRequest);
      fpsSel.addEventListener('change', sendQualityRequest);
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          card.querySelector('.video-wrapper').requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });
    }
  }, 50);

  return card;
}

// PeerJS Engine with Password Support & Username Identity
function enterRoom(roomCode, password = '') {
  state.roomCode = roomCode;
  state.roomPassword = password;

  let urlPath = `?room=${roomCode}`;
  if (password) {
    urlPath += `&pwd=${encodeURIComponent(password)}`;
  }
  window.history.pushState({}, '', urlPath);

  const hostPeerId = `ccroom-${roomCode}`;
  state.peer = new Peer(hostPeerId);

  state.peer.on('open', (id) => {
    state.myPeerId = id;
    state.isHost = true;
    state.isAuthenticated = true;
    state.roomMembers.set(id, state.myUsername);
    renderRoomView();
    setupHostListeners();
  });

  state.peer.on('error', (err) => {
    if (err.type === 'unavailable-id') {
      state.isHost = false;
      state.peer = new Peer();

      state.peer.on('open', (myId) => {
        state.myPeerId = myId;
        setupMemberListeners(hostPeerId, password);
      });
    }
  });
}

function setupHostListeners() {
  setupCommonPeerListeners();

  state.peer.on('connection', (conn) => {
    conn.on('data', (data) => {
      if (data.type === 'AUTH') {
        if (state.roomPassword && data.password !== state.roomPassword) {
          conn.send({ type: 'AUTH_FAILED', message: 'Senha incorreta!' });
          setTimeout(() => conn.close(), 300);
          return;
        }

        const peerUsername = data.username || 'Usuário';
        state.dataConnections.set(conn.peer, conn);
        state.roomMembers.set(conn.peer, peerUsername);
        state.lastHeartbeat.set(conn.peer, Date.now());

        conn.send({ type: 'AUTH_SUCCESS', username: state.myUsername });
        updateMemberCountLabel();
        broadcastMemberList();

        if (state.myScreenStream) {
          const call = state.peer.call(conn.peer, state.myScreenStream, { metadata: { type: 'screen', username: state.myUsername } });
          state.mediaCalls.set(conn.peer, call);
        }
        if (state.myCameraStream) {
          const call = state.peer.call(conn.peer, state.myCameraStream, { metadata: { type: 'camera', username: state.myUsername } });
          state.cameraCalls.set(conn.peer, call);
        }
      } else {
        handleDataMessage(conn.peer, data);
      }
    });

    conn.on('close', () => {
      removePeer(conn.peer);
    });
  });
}

function setupMemberListeners(hostPeerId, passwordAttempt) {
  setupCommonPeerListeners();

  const hostConn = state.peer.connect(hostPeerId);

  hostConn.on('open', () => {
    hostConn.send({ type: 'AUTH', password: passwordAttempt, username: state.myUsername });
  });

  hostConn.on('data', (data) => {
    if (data.type === 'AUTH_SUCCESS') {
      state.isAuthenticated = true;
      state.dataConnections.set(hostPeerId, hostConn);
      if (data.username) {
        state.roomMembers.set(hostPeerId, data.username);
      }
      renderRoomView();
    } else if (data.type === 'AUTH_FAILED') {
      promptForPassword(hostPeerId);
    } else {
      handleDataMessage(hostPeerId, data);
    }
  });

  hostConn.on('close', () => {
    if (state.isAuthenticated) {
      removePeer(hostPeerId);
      setTimeout(() => {
        attemptHostTakeover(hostPeerId);
      }, 1000);
    }
  });
}

function attemptHostTakeover(hostPeerId) {
  if (state.isHost) return;

  const oldPeer = state.peer;
  if (oldPeer) oldPeer.destroy();

  state.peer = new Peer(hostPeerId);

  state.peer.on('open', (id) => {
    state.myPeerId = id;
    state.isHost = true;
    state.roomMembers.set(id, state.myUsername);
    setupHostListeners();
  });

  state.peer.on('error', (err) => {
    if (err.type === 'unavailable-id') {
      state.isHost = false;
      state.peer = new Peer();
      state.peer.on('open', (myId) => {
        state.myPeerId = myId;
        setupMemberListeners(hostPeerId, state.roomPassword);
      });
    }
  });
}

function removePeerStreams(peerId) {
  state.activeRemoteStreams.forEach((val, key) => {
    if (key.startsWith(peerId)) {
      removeRemoteStream(key);
    }
  });
}

function promptForPassword(hostPeerId) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-card">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem;">Sala Protegida por Senha</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">Digite a senha correta para acessar a sala:</p>
        <div class="field-group">
          <input type="password" id="modal-pass-input" placeholder="Senha da sala">
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancelar</button>
          <button class="btn" id="modal-submit-btn">Entrar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-cancel-btn').addEventListener('click', () => {
    container.innerHTML = '';
    leaveRoom();
  });

  document.getElementById('modal-submit-btn').addEventListener('click', () => {
    const pwd = document.getElementById('modal-pass-input').value.trim();
    container.innerHTML = '';
    
    if (state.peer) state.peer.destroy();
    state.peer = new Peer();
    state.peer.on('open', (myId) => {
      state.myPeerId = myId;
      setupMemberListeners(hostPeerId, pwd);
    });
  });
}

function setupCommonPeerListeners() {
  state.peer.on('call', (call) => {
    call.answer();

    const isCam = call.metadata && call.metadata.type === 'camera';
    const streamKey = isCam ? `${call.peer}-cam` : `${call.peer}-screen`;
    const username = (call.metadata && call.metadata.username) || state.roomMembers.get(call.peer) || call.peer.substring(0, 8);

    // Deduplicate existing calls
    if (state.activeRemoteStreams.has(streamKey)) {
      removeRemoteStream(streamKey);
    }

    call.on('stream', (remoteStream) => {
      state.activeRemoteStreams.set(streamKey, { stream: remoteStream, call, peerId: call.peer, username });
      updateVideoGrid();
    });

    call.on('close', () => {
      removeRemoteStream(streamKey);
    });
  });
}

function handleDataMessage(fromPeer, data) {
  if (typeof data !== 'object') return;

  state.lastHeartbeat.set(fromPeer, Date.now());

  if (data.type === 'PING') {
    const conn = state.dataConnections.get(fromPeer);
    if (conn && conn.open) {
      conn.send({ type: 'PONG' });
    }
  } else if (data.type === 'PONG') {
    // Heartbeat confirmed
  } else if (data.type === 'MEMBER_LIST') {
    if (Array.isArray(data.members)) {
      data.members.forEach((m) => {
        const peerId = typeof m === 'object' ? m.peerId : m;
        const uname = typeof m === 'object' ? m.username : 'Usuário';

        if (peerId !== state.myPeerId) {
          state.roomMembers.set(peerId, uname);
          if (!state.dataConnections.has(peerId)) {
            connectToPeer(peerId);
          }
        }
      });
    }
    updateMemberCountLabel();
  } else if (data.type === 'REQUEST_STREAMS') {
    if (state.myScreenStream) {
      const call = state.peer.call(fromPeer, state.myScreenStream, { metadata: { type: 'screen', username: state.myUsername } });
      state.mediaCalls.set(fromPeer, call);
    }
    if (state.myCameraStream) {
      const call = state.peer.call(fromPeer, state.myCameraStream, { metadata: { type: 'camera', username: state.myUsername } });
      state.cameraCalls.set(fromPeer, call);
    }
  } else if (data.type === 'REQUEST_QUALITY') {
    if (state.myScreenStream) {
      applyRealtimeQuality(state.myScreenStream, data.res, data.fps);
    }
  } else if (data.type === 'STOPPED_SHARE') {
    removeRemoteStream(`${fromPeer}-screen`);
  } else if (data.type === 'STOPPED_CAM') {
    removeRemoteStream(`${fromPeer}-cam`);
  } else if (data.type === 'PEER_LEAVING') {
    removePeer(fromPeer);
  }
}

function connectToPeer(peerId) {
  if (state.dataConnections.has(peerId) || peerId === state.myPeerId) return;

  const conn = state.peer.connect(peerId);
  conn.on('open', () => {
    state.dataConnections.set(peerId, conn);
    conn.on('data', (d) => handleDataMessage(peerId, d));

    if (state.myScreenStream) {
      const call = state.peer.call(peerId, state.myScreenStream, { metadata: { type: 'screen', username: state.myUsername } });
      state.mediaCalls.set(peerId, call);
    }
    if (state.myCameraStream) {
      const call = state.peer.call(peerId, state.myCameraStream, { metadata: { type: 'camera', username: state.myUsername } });
      state.cameraCalls.set(peerId, call);
    }
  });

  conn.on('close', () => {
    removePeer(peerId);
  });
}

function broadcastMemberList() {
  if (!state.isHost) return;
  const list = [];
  state.roomMembers.forEach((username, peerId) => {
    list.push({ peerId, username });
  });

  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      conn.send({ type: 'MEMBER_LIST', members: list });
    }
  });
}

function updateMemberCountLabel() {
  const lbl = document.getElementById('member-count-label');
  if (lbl) {
    const count = state.roomMembers.size;
    lbl.innerText = `(${count} pessoa${count === 1 ? '' : 's'} na sala)`;
  }
}

function getQualityVideoConstraints() {
  const videoConstraints = {
    displaySurface: 'window',
    cursor: 'always'
  };

  const res = state.screenSettings.resolution || '480';
  if (res === '480') {
    videoConstraints.width = { ideal: 854, max: 854 };
    videoConstraints.height = { ideal: 480, max: 480 };
  } else if (res === '720') {
    videoConstraints.width = { ideal: 1280, max: 1280 };
    videoConstraints.height = { ideal: 720, max: 720 };
  } else if (res === '1080') {
    videoConstraints.width = { ideal: 1920, max: 1920 };
    videoConstraints.height = { ideal: 1080, max: 1080 };
  } else if (res === '1440') {
    videoConstraints.width = { ideal: 2560, max: 2560 };
    videoConstraints.height = { ideal: 1440, max: 1440 };
  } else if (res === '4k') {
    videoConstraints.width = { ideal: 3840, max: 3840 };
    videoConstraints.height = { ideal: 2160, max: 2160 };
  }

  const fps = parseInt(state.screenSettings.fps, 10) || 30;
  videoConstraints.frameRate = { ideal: fps, max: fps };

  return videoConstraints;
}

// Screen Sharing - Default 5s delay, 480p, 30 FPS
async function startMyScreenShare() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: getQualityVideoConstraints(),
      audio: true,
      systemAudio: 'exclude',
      windowAudio: 'window'
    });

    state.myScreenStream = stream;

    state.dataConnections.forEach((conn, peerId) => {
      const call = state.peer.call(peerId, stream, { metadata: { type: 'screen', username: state.myUsername } });
      state.mediaCalls.set(peerId, call);
    });

    stream.getVideoTracks()[0].onended = () => {
      stopMyScreenShare();
    };

    const btn = document.getElementById('btn-toggle-share');
    if (btn) {
      btn.innerText = 'Parar de Compartilhar';
      btn.className = 'btn btn-danger';
    }

    updateVideoGrid();

  } catch (err) {
    // Silenced error toasts per user request
  }
}

function stopMyScreenShare() {
  if (state.myScreenStream) {
    state.myScreenStream.getTracks().forEach(t => t.stop());
    state.myScreenStream = null;
  }

  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      conn.send({ type: 'STOPPED_SHARE' });
    }
  });

  const btn = document.getElementById('btn-toggle-share');
  if (btn) {
    btn.innerText = 'Compartilhar Minha Tela';
    btn.className = 'btn';
  }

  const tile = document.getElementById('tile-my-local-screen');
  if (tile) tile.remove();

  updateVideoGrid();
}

// Webcam Sharing
async function startMyWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 854 },
        height: { ideal: 480 },
        frameRate: { ideal: 30 }
      },
      audio: false
    });

    state.myCameraStream = stream;

    state.dataConnections.forEach((conn, peerId) => {
      const call = state.peer.call(peerId, stream, { metadata: { type: 'camera', username: state.myUsername } });
      state.cameraCalls.set(peerId, call);
    });

    stream.getVideoTracks()[0].onended = () => {
      stopMyWebcam();
    };

    const btn = document.getElementById('btn-toggle-cam');
    if (btn) {
      btn.innerText = 'Desligar Câmera';
      btn.className = 'btn btn-danger';
    }

    updateVideoGrid();

  } catch (err) {
    // Silenced per request
  }
}

function stopMyWebcam() {
  if (state.myCameraStream) {
    state.myCameraStream.getTracks().forEach(t => t.stop());
    state.myCameraStream = null;
  }

  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      conn.send({ type: 'STOPPED_CAM' });
    }
  });

  const btn = document.getElementById('btn-toggle-cam');
  if (btn) {
    btn.innerText = 'Ligar Câmera';
    btn.className = 'btn btn-secondary';
  }

  const tile = document.getElementById('tile-my-local-cam');
  if (tile) tile.remove();

  updateVideoGrid();
}

function leaveRoom() {
  stopAutoSync();
  stopAutoQualityMonitor();
  stopHeartbeat();

  remoteAudioNodes.forEach((v, k) => {
    cleanupRemoteAudioNodes(k);
  });

  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      try { conn.send({ type: 'PEER_LEAVING' }); } catch(e){}
    }
  });

  stopMyScreenShare();
  stopMyWebcam();

  if (state.peer) {
    state.peer.destroy();
    state.peer = null;
  }

  state.dataConnections.clear();
  state.mediaCalls.clear();
  state.cameraCalls.clear();
  state.activeRemoteStreams.clear();
  state.roomMembers.clear();
  state.lastHeartbeat.clear();

  if (window.location.search) {
    window.history.pushState({}, '', window.location.pathname);
  }

  renderLobby();
}

window.addEventListener('beforeunload', () => {
  leaveRoom();
});

renderLobby();
