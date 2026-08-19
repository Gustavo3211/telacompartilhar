import './style.css';
import Peer from 'peerjs';

// SVG Vector Icons System
const icons = {
  settings: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  volHigh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  volMed: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  volLow: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>`,
  volMute: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  maximize: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  close: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  grip: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  monitor: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  camera: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  rotate: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  flask: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55A1 1 0 0 0 5.607 22h12.786a1 1 0 0 0 .886-1.45l-5.068-10.126A2 2 0 0 1 14 9.527V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><path d="M8.5 14h7"/></svg>`,
  size: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>`,
  share: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  layout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  leave: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  cursorClick: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>`,
  user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
};

// i18n Translation System
const translations = {
  pt: {
    appTitle: 'compartilhamento compartilhado',
    statusDisconnected: 'Status: Desconectado',
    statusInRoom: 'Status: Na Sala ({username})',
    showInterface: 'Mostrar Interface',
    hideInterface: 'Esconder Interface',
    joinOrCreateRoom: 'Entrar ou Criar Sala',
    yourName: 'Seu Nome / Apelido',
    placeholderName: 'Digite seu nome',
    roomPasswordOptional: 'Senha da Sala (Opcional)',
    placeholderPassword: 'Digite uma senha personalizada se desejar',
    createRoomBtn: 'Criar Sala e Compartilhar Link',
    defaultUserPrefix: 'Usuário_',
    roomLink: 'Sala:',
    protectedByPassword: 'Protegida por Senha',
    peopleInRoom: '{count} {label} na sala',
    person: 'pessoa',
    people: 'pessoas',
    shareScreen: 'Compartilhar Minha Tela',
    stopShareScreen: 'Parar de Compartilhar',
    turnOnCam: 'Ligar Câmera',
    turnOffCam: 'Desligar Câmera',
    resetLayout: 'Resetar Layout',
    syncStreams: 'Sincronizar Transmissões',
    searchStreams: 'Procurar Tela',
    searchingToast: 'Procurando transmissões na sala...',
    moveHere: 'Ir pra cá',
    emptySlot: 'Espaço Vazio',
    connectedUsersTitle: 'Usuários na Sala',
    youTag: 'Você',
    hideRoomCode: 'Ocultar Código',
    showRoomCode: 'Mostrar Código',
    copyLink: 'Copiar Link',
    leave: 'Sair',
    emptyState: 'Nenhuma tela ou câmera está sendo compartilhada no momento.<br>Qualquer pessoa conectada pode clicar em <strong>"Compartilhar Minha Tela"</strong> ou <strong>"Ligar Câmera"</strong> para transmitir.',
    yourScreen: 'Sua Tela (Você)',
    yourCam: 'Sua Câmera (Você)',
    screenOf: 'Tela de {username}',
    camOf: 'Câmera de {username}',
    size: 'Tam:',
    broadcastRes: 'Res. Envio:',
    displayRes: 'Res. Exibição:',
    res: 'Res:',
    fps: 'FPS:',
    delay: 'Delay:',
    vol: 'Vol:',
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    nativeRes: 'Nativa (Original)',
    delay5s: '5.0s (Padrão)',
    delay3s: '3.0s (Médio)',
    delay1s: '1.0s (Baixo)',
    delay025s: '0.25s (Mínimo)',
    mute: 'Mutar',
    unmute: 'Desmutar',
    fullscreen: 'Tela Cheia',
    closeStream: 'Fechar Tela',
    watchStream: 'Assistir Transmissão',
    protectedRoomModalTitle: 'Sala Protegida por Senha',
    protectedRoomModalDesc: 'Digite a senha correta para acessar a sala:',
    placeholderRoomPasswordModal: 'Senha da sala',
    cancel: 'Cancelar',
    enter: 'Entrar',
    incorrectPassword: 'Senha incorreta!',
    defaultUsername: 'Usuário',
    devToolBtn: 'Testar Layouts',
    devModalTitle: 'Testador de Layouts & Telas Falsas',
    devModalSubtitle: 'Simule transmissões falsas e teste a interface em múltiplos tamanhos de tela em tempo real.',
    sectionFakeStreams: '1. Telas / Transmissões Falsas (Grid)',
    add1FakeStream: '+1 Tela Falsa (16:9)',
    add4FakeStreams: '+4 Telas (Grade)',
    add6FakeStreams: '+6 Telas (Grade)',
    addMobileFakeStream: '+1 Mobile (9:16)',
    addCamFakeStream: '+1 Câmera Falsa (4:3)',
    clearFakeStreams: 'Limpar Telas Falsas',
    sectionDeviceViewport: '2. Simulador de Dispositivo / Viewport',
    presetDesktop: 'Desktop Full HD (1920x1080)',
    presetLaptop: 'Laptop (1366x768)',
    presetTabletPort: 'Tablet Em Pé (768x1024)',
    presetTabletLand: 'Tablet Deitado (1024x768)',
    presetMobilePort: 'Celular Em Pé (375x812)',
    presetMobileLand: 'Celular Deitado (812x375)',
    presetUltrawide: 'Ultrawide (2560x1080)',
    applyDeviceViewport: 'Ativar Simulador de Tela',
    resetDeviceViewport: 'Restaurar Tela Normal',
    simulatingDevice: 'Simulando:',
    rotateDevice: 'Girar',
    zoomFit: 'Ajustar Zoom',
    closeDevModal: 'Fechar',
    settings: 'Configurações',
    tileSettingsTitle: 'Configurações',
    cardSizeLabel: 'Tamanho no Grid',
    displayResLabel: 'Escala de Exibição (Local)',
    displayResDesc: 'Reduz o consumo local da GPU sem alterar o apresentador.',
    delayLabel: 'Buffer de Delay',
    delayDesc: 'Previne travamentos de vídeo/áudio.',
    broadcastResLabel: 'Resolução de Envio',
    broadcastResDesc: 'Qualidade transmitida para os espectadores.',
    fpsLabel: 'Taxa de FPS',
  },
  en: {
    appTitle: 'Shared Screen Share',
    statusDisconnected: 'Status: Disconnected',
    statusInRoom: 'Status: In Room ({username})',
    showInterface: 'Show Interface',
    hideInterface: 'Hide Interface',
    joinOrCreateRoom: 'Join or Create Room',
    yourName: 'Your Name / Nickname',
    placeholderName: 'Enter your name',
    roomPasswordOptional: 'Room Password (Optional)',
    placeholderPassword: 'Enter a custom password if desired',
    createRoomBtn: 'Create Room & Share Link',
    defaultUserPrefix: 'User_',
    roomLink: 'Room:',
    protectedByPassword: 'Password Protected',
    peopleInRoom: '{count} {label} in room',
    person: 'person',
    people: 'people',
    shareScreen: 'Share My Screen',
    stopShareScreen: 'Stop Sharing',
    turnOnCam: 'Turn On Camera',
    turnOffCam: 'Turn Off Camera',
    resetLayout: 'Reset Layout',
    syncStreams: 'Sync Streams',
    searchStreams: 'Find Streams',
    searchingToast: 'Scanning for active streams...',
    moveHere: 'Move here',
    emptySlot: 'Empty Space',
    connectedUsersTitle: 'Users in Room',
    youTag: 'You',
    hideRoomCode: 'Hide Code',
    showRoomCode: 'Show Code',
    copyLink: 'Copy Link',
    leave: 'Leave',
    emptyState: 'No screen or camera is currently being shared.<br>Anyone connected can click <strong>"Share My Screen"</strong> or <strong>"Turn On Camera"</strong> to stream.',
    yourScreen: 'Your Screen (You)',
    yourCam: 'Your Camera (You)',
    screenOf: '{username}\'s Screen',
    camOf: '{username}\'s Camera',
    size: 'Size:',
    broadcastRes: 'Broadcast Res:',
    displayRes: 'Display Res:',
    res: 'Res:',
    fps: 'FPS:',
    delay: 'Delay:',
    vol: 'Vol:',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    nativeRes: 'Native (Original)',
    delay5s: '5.0s (Default)',
    delay3s: '3.0s (Medium)',
    delay1s: '1.0s (Low)',
    delay025s: '0.25s (Min)',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    closeStream: 'Close Stream',
    watchStream: 'Watch Stream',
    protectedRoomModalTitle: 'Password Protected Room',
    protectedRoomModalDesc: 'Enter the correct password to join the room:',
    placeholderRoomPasswordModal: 'Room password',
    cancel: 'Cancel',
    enter: 'Enter',
    incorrectPassword: 'Incorrect password!',
    defaultUsername: 'User',
    devToolBtn: 'Test Layouts',
    devModalTitle: 'Layout & Fake Screen Tester',
    devModalSubtitle: 'Simulate mock video streams and test the interface across multiple screen sizes in real-time.',
    sectionFakeStreams: '1. Fake Streams (Grid Test)',
    add1FakeStream: '+1 Fake Screen (16:9)',
    add4FakeStreams: '+4 Screens (Grid)',
    add6FakeStreams: '+6 Screens (Grid)',
    addMobileFakeStream: '+1 Mobile (9:16)',
    addCamFakeStream: '+1 Fake Camera (4:3)',
    clearFakeStreams: 'Clear Fake Streams',
    sectionDeviceViewport: '2. Device Viewport Simulator',
    presetDesktop: 'Desktop Full HD (1920x1080)',
    presetLaptop: 'Laptop (1366x768)',
    presetTabletPort: 'Tablet Portrait (768x1024)',
    presetTabletLand: 'Tablet Landscape (1024x768)',
    presetMobilePort: 'Mobile Portrait (375x812)',
    presetMobileLand: 'Mobile Landscape (812x375)',
    presetUltrawide: 'Ultrawide (2560x1080)',
    applyDeviceViewport: 'Apply Device Viewport',
    resetDeviceViewport: 'Reset Full Screen',
    simulatingDevice: 'Simulating:',
    rotateDevice: 'Rotate',
    zoomFit: 'Fit Zoom',
    closeDevModal: 'Close',
    settings: 'Settings',
    tileSettingsTitle: 'Settings',
    cardSizeLabel: 'Card Size in Grid',
    displayResLabel: 'Display Scale (Local)',
    displayResDesc: 'Reduces rendering load locally without touching host video.',
    delayLabel: 'Buffer Delay',
    delayDesc: 'Prevents video/audio stuttering.',
    broadcastResLabel: 'Broadcast Resolution',
    broadcastResDesc: 'Sets quality sent to viewers.',
    fpsLabel: 'FPS Rate',
  }
};

function detectLanguage() {
  const saved = localStorage.getItem('app_lang');
  if (saved && (saved === 'pt' || saved === 'en')) return saved;
  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (browserLang.startsWith('pt')) {
    return 'pt';
  }
  return 'en';
}

let currentLang = detectLanguage();

function t(key, params = {}) {
  const text = translations[currentLang]?.[key] || translations['en']?.[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
}

function setLanguage(lang) {
  if (lang !== 'pt' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('app_lang', lang);
  document.title = t('appTitle');

  const titleEl = document.querySelector('#main-header h1');
  if (titleEl) titleEl.innerText = t('appTitle');

  const floatBtn = document.getElementById('floating-toggle-btn');
  if (floatBtn) floatBtn.innerText = t('showInterface');

  const devFab = document.getElementById('dev-fab-btn');
  if (devFab) devFab.innerText = t('devToolBtn');

  if (state.isAuthenticated && state.roomCode) {
    renderRoomView();
  } else {
    renderLobby();
  }
}

// Global State
const state = {
  peer: null,
  myPeerId: '',
  myUsername: localStorage.getItem('cc_username') || (t('defaultUserPrefix') + Math.floor(Math.random() * 8999 + 1000)),
  roomCode: '',
  roomPassword: '',
  isHost: false,
  isAuthenticated: false,
  roomMembers: new Map(),
  dataConnections: new Map(),
  mediaCalls: new Map(),
  cameraCalls: new Map(),
  myScreenStream: null,
  myCameraStream: null,
  activeRemoteStreams: new Map(),
  screenSettings: {
    resolution: '480',
    fps: '30'
  },
  autoSyncInterval: null,
  autoQualityInterval: null,
  heartbeatInterval: null,
  lastHeartbeat: new Map(),
  isToolbarHidden: false,
  isRoomCodeHidden: false
};

// Render Shell
document.getElementById('app').innerHTML = `
  <header id="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 0.5rem;">
      <h1>${t('appTitle')}</h1>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div id="header-status" style="font-size: 0.9rem; color: var(--text-muted);">${t('statusDisconnected')}</div>
        <select id="lang-select" class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.85rem; cursor: pointer; background: var(--bg-card); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 6px;">
          <option value="pt" ${currentLang === 'pt' ? 'selected' : ''}>PT-BR</option>
          <option value="en" ${currentLang === 'en' ? 'selected' : ''}>EN-US</option>
        </select>
      </div>
    </div>
  </header>

  <main class="main-content" id="main-content">
  </main>

  <button id="floating-toggle-btn" class="btn btn-secondary floating-toggle-btn" style="display: none;">${t('showInterface')}</button>
  <button id="dev-fab-btn" class="dev-floating-fab" style="display: flex; align-items: center; gap: 0.4rem;">${icons.flask} <span>${t('devToolBtn')}</span></button>

  <div id="dev-modal-container"></div>
  <div id="modal-container"></div>
  <div class="toast-container" id="toast-container" style="display: none;"></div>
`;

document.title = t('appTitle');

document.getElementById('lang-select').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

// --- Dev Layout & Device Simulator Engine ---
let fakeStreamSeq = 0;
const fakeAnimFrames = new Map();

function createFakeStreamCanvas(opts = {}) {
  fakeStreamSeq++;
  const id = opts.id || `fake-${fakeStreamSeq}`;
  const width = opts.width || 1280;
  const height = opts.height || 720;
  const title = opts.title || `Tela Falsa #${fakeStreamSeq}`;
  const isCam = !!opts.isCam;
  const isMobile = !!opts.isMobile;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  let ballX = width / 2;
  let ballY = height / 2;
  let ballDX = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 4);
  let ballDY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 4);

  const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#0891b2'];
  const themeColor = colors[(fakeStreamSeq - 1) % colors.length];

  function draw() {
    // Canvas background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#111827');
    grad.addColorStop(1, '#1f2937');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Bouncing sphere
    ballX += ballDX;
    ballY += ballDY;
    if (ballX <= 35 || ballX >= width - 35) ballDX *= -1;
    if (ballY <= 35 || ballY >= height - 35) ballDY *= -1;

    ctx.fillStyle = themeColor;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Header bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, 54);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${isCam ? '📷' : '💻'} ${title}`, 20, 34);

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    ctx.textAlign = 'right';
    ctx.font = '16px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`SIMULATED LIVE • ${timeStr}`, width - 20, 34);

    // Center Info Card
    const cardW = Math.min(width - 40, isMobile ? 320 : 440);
    const cardH = 150;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    } else {
      ctx.rect(cardX, cardY, cardW, cardH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(title, width / 2, cardY + 42);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(isCam ? 'Transmissão Simulada de Câmera (4:3)' : (isMobile ? 'Transmissão Simulada Mobile (9:16)' : 'Transmissão Simulada de Tela (16:9)'), width / 2, cardY + 75);

    ctx.fillStyle = '#34d399';
    ctx.font = '13px monospace';
    ctx.fillText(`Resolução: ${width}x${height} • 60 FPS • Simulated`, width / 2, cardY + 110);

    // Audio Equalizer Waveform
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, height - 32, width, 32);

    const bars = Math.floor(width / 24);
    const barW = width / bars;
    ctx.fillStyle = themeColor;
    for (let i = 0; i < bars; i++) {
      const h = Math.sin(Date.now() / 180 + i) * 12 + 14;
      ctx.fillRect(i * barW + 2, height - h, barW - 4, h);
    }

    const frameId = requestAnimationFrame(draw);
    fakeAnimFrames.set(id, frameId);
  }

  draw();

  const stream = canvas.captureStream(30);
  return { id, stream };
}

function addFakeStreams(count = 1, type = 'screen') {
  if (!state.isAuthenticated || !state.roomCode) {
    enterRoom('dev-sandbox', '');
  }

  for (let i = 0; i < count; i++) {
    const isCam = type === 'cam';
    const isMobile = type === 'mobile';
    const width = isMobile ? 720 : (isCam ? 640 : 1280);
    const height = isMobile ? 1280 : (isCam ? 480 : 720);

    fakeStreamSeq++;
    const streamKey = `fake-peer-${fakeStreamSeq}-${isCam ? 'cam' : 'screen'}`;
    const uname = isCam ? `Câmera #${fakeStreamSeq}` : (isMobile ? `Mobile #${fakeStreamSeq}` : `Tela Falsa #${fakeStreamSeq}`);

    const fakeObj = createFakeStreamCanvas({
      id: streamKey,
      title: uname,
      width,
      height,
      isCam,
      isMobile
    });

    state.activeRemoteStreams.set(streamKey, {
      stream: fakeObj.stream,
      call: null,
      peerId: `fake-peer-${fakeStreamSeq}`,
      username: uname,
      isFake: true
    });
  }

  updateVideoGrid();
}

function clearFakeStreams() {
  state.activeRemoteStreams.forEach((data, key) => {
    if (data.isFake || key.startsWith('fake-peer-')) {
      if (data.stream) {
        data.stream.getTracks().forEach(t => t.stop());
      }
      const frameId = fakeAnimFrames.get(key);
      if (frameId) {
        cancelAnimationFrame(frameId);
        fakeAnimFrames.delete(key);
      }
      state.activeRemoteStreams.delete(key);
    }
  });
  updateVideoGrid();
}

function openDevModal() {
  const container = document.getElementById('dev-modal-container');
  if (!container) return;

  const count = state.activeRemoteStreams.size;

  container.innerHTML = `
    <div class="modal-overlay">
      <div class="dev-modal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700;">${t('devModalTitle')}</h3>
          <button class="btn btn-secondary" id="dev-modal-close" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;">✕</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${t('devModalSubtitle')}
        </p>

        <!-- Fake Streams Simulator -->
        <div class="dev-section-title">
          <span>${t('sectionFakeStreams')}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${count} ativas)</span>
        </div>
        <div class="dev-btn-grid">
          <button class="btn" id="btn-add-1-fake">${t('add1FakeStream')}</button>
          <button class="btn" id="btn-add-4-fake">${t('add4FakeStreams')}</button>
          <button class="btn" id="btn-add-6-fake">${t('add6FakeStreams')}</button>
          <button class="btn btn-secondary" id="btn-add-mob-fake">${t('addMobileFakeStream')}</button>
          <button class="btn btn-secondary" id="btn-add-cam-fake">${t('addCamFakeStream')}</button>
          <button class="btn btn-danger" id="btn-clear-fakes">${t('clearFakeStreams')}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('dev-modal-close').addEventListener('click', () => {
    container.innerHTML = '';
  });

  document.getElementById('btn-add-1-fake').addEventListener('click', () => {
    addFakeStreams(1, 'screen');
    openDevModal();
  });
  document.getElementById('btn-add-4-fake').addEventListener('click', () => {
    addFakeStreams(4, 'screen');
    openDevModal();
  });
  document.getElementById('btn-add-6-fake').addEventListener('click', () => {
    addFakeStreams(6, 'screen');
    openDevModal();
  });
  document.getElementById('btn-add-mob-fake').addEventListener('click', () => {
    addFakeStreams(1, 'mobile');
    openDevModal();
  });
  document.getElementById('btn-add-cam-fake').addEventListener('click', () => {
    addFakeStreams(1, 'cam');
    openDevModal();
  });
  document.getElementById('btn-clear-fakes').addEventListener('click', () => {
    clearFakeStreams();
    openDevModal();
  });
}

document.getElementById('dev-fab-btn').addEventListener('click', () => {
  openDevModal();
});

function showToast(msg, duration = 4000) {
  // Notifications silenced
}

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

function getUrlParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    room: p.get('room') || p.get('join') || '',
    pwd: p.get('pwd') || ''
  };
}

function renderLobby() {
  stopAutoSync();
  stopAutoQualityMonitor();
  stopHeartbeat();
  toggleToolbar(false);
  state.roomCode = '';
  state.roomPassword = '';
  state.isHost = false;
  state.isAuthenticated = false;
  document.getElementById('header-status').innerText = t('statusDisconnected');

  const urlParams = getUrlParams();

  if (urlParams.room) {
    enterRoom(urlParams.room, urlParams.pwd);
    return;
  }

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="lobby-container">
      <div class="card">
        <h2 style="font-size: 1.1rem; margin-bottom: 1rem;">${t('joinOrCreateRoom')}</h2>

        <div class="field-group">
          <label>${t('yourName')}</label>
          <input type="text" id="input-username" placeholder="${t('placeholderName')}" value="${state.myUsername}">
        </div>

        <div class="field-group">
          <label>${t('roomPasswordOptional')}</label>
          <input type="password" id="input-password" placeholder="${t('placeholderPassword')}">
        </div>

        <div style="margin-top: 1.25rem;">
          <button class="btn" id="btn-create" style="width: 100%;">${t('createRoomBtn')}</button>
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

function renderRoomView() {
  document.getElementById('header-status').innerText = t('statusInRoom', { username: state.myUsername });

  const main = document.getElementById('main-content');
  const count = state.roomMembers.size;
  const label = count === 1 ? t('person') : t('people');

  main.innerHTML = `
    <div class="room-top-bar" id="main-room-bar">
      <div class="top-bar-left">
        <button class="top-bar-chip room-link-chip" id="top-bar-copy-link" title="${t('copyLink')}">
          <span class="chip-icon">${icons.link}</span>
          <span class="room-code-label">${t('roomLink')} <strong id="room-code-text">${state.isRoomCodeHidden ? '••••••••' : state.roomCode}</strong></span>
          <span class="toggle-room-visibility" id="btn-toggle-room-code" title="${state.isRoomCodeHidden ? t('showRoomCode') : t('hideRoomCode')}">
            ${state.isRoomCodeHidden ? icons.eyeOff : icons.eye}
          </span>
          ${state.roomPassword ? `<span class="pwd-badge" title="${t('protectedByPassword')}">${icons.lock}</span>` : ''}
          <span class="copy-badge">${t('copyLink')}</span>
        </button>
      </div>

      <div class="top-bar-right">
        <div class="users-popover-wrapper">
          <button class="top-bar-chip users-chip" id="top-bar-users-btn" title="${t('connectedUsersTitle')}">
            <span class="chip-icon">${icons.users}</span>
            <span id="member-count-label">${t('peopleInRoom', { count, label })}</span>
          </button>

          <div class="users-dropdown-popover" id="users-dropdown-popover">
            <div class="users-popover-header">
              <span style="font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; color: #f8fafc;">
                ${icons.users} ${t('connectedUsersTitle')} (<span id="popover-member-count">${count}</span>)
              </span>
            </div>
            <ul class="users-list-ul" id="users-list-ul">
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="video-grid" class="video-grid">
    </div>

    <div id="empty-state" class="empty-state">
      ${t('emptyState')}
    </div>

    <nav class="bottom-dock-toolbar" id="bottom-dock-toolbar">
      <button class="btn ${state.myScreenStream ? 'btn-danger' : 'btn-primary'} dock-btn" id="btn-toggle-share">
        ${icons.share} <span>${state.myScreenStream ? t('stopShareScreen') : t('shareScreen')}</span>
      </button>

      <button class="btn ${state.myCameraStream ? 'btn-danger' : 'btn-secondary'} dock-btn" id="btn-toggle-cam">
        ${icons.camera} <span>${state.myCameraStream ? t('turnOffCam') : t('turnOnCam')}</span>
      </button>

      <button class="btn btn-secondary dock-btn" id="btn-search-streams">
        ${icons.search} <span>${t('searchStreams')}</span>
      </button>

      <button class="btn btn-secondary dock-btn" id="btn-copy">
        ${icons.link} <span>${t('copyLink')}</span>
      </button>

      <button class="btn btn-secondary dock-btn" id="btn-reset-layout">
        ${icons.layout} <span>${t('resetLayout')}</span>
      </button>

      <button class="btn btn-danger dock-btn" id="btn-leave">
        ${icons.leave} <span>${t('leave')}</span>
      </button>
    </nav>
  `;

  // Copy Link in Top Bar
  const copyBtn = document.getElementById('top-bar-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      let url = `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`;
      if (state.roomPassword) {
        url += `&pwd=${encodeURIComponent(state.roomPassword)}`;
      }
      navigator.clipboard.writeText(url);
      showToast('Link da sala copiado!', 'info');
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1500);
    });
  }

  // Toggle Room Code Visibility
  const toggleVisibilityBtn = document.getElementById('btn-toggle-room-code');
  if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.isRoomCodeHidden = !state.isRoomCodeHidden;

      const textEl = document.getElementById('room-code-text');
      if (textEl) {
        textEl.innerText = state.isRoomCodeHidden ? '••••••••' : state.roomCode;
      }
      toggleVisibilityBtn.innerHTML = state.isRoomCodeHidden ? icons.eyeOff : icons.eye;
      toggleVisibilityBtn.title = state.isRoomCodeHidden ? t('showRoomCode') : t('hideRoomCode');
    });
  }

  // Connected Users Popover
  const usersBtn = document.getElementById('top-bar-users-btn');
  const usersPopover = document.getElementById('users-dropdown-popover');
  if (usersBtn && usersPopover) {
    usersBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      usersPopover.classList.toggle('active');
      renderUsersList();
    });

    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.users-popover-wrapper')) {
        usersPopover.classList.remove('active');
      }
    });
  }

  renderUsersList();

  document.getElementById('btn-search-streams').addEventListener('click', () => {
    const icon = document.querySelector('#btn-search-streams svg');
    if (icon) {
      icon.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      icon.style.transform = 'rotate(360deg)';
      setTimeout(() => { icon.style.transform = ''; icon.style.transition = ''; }, 650);
    }
    syncStreams();
    showToast(t('searchingToast'), 'info');
  });

  document.getElementById('btn-copy').addEventListener('click', () => {
    let url = `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`;
    if (state.roomPassword) {
      url += `&pwd=${encodeURIComponent(state.roomPassword)}`;
    }
    navigator.clipboard.writeText(url);
    showToast('Link da sala copiado!', 'info');
  });

  document.getElementById('btn-reset-layout').addEventListener('click', () => {
    resetBoardLayout();
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

const remoteAudioNodes = new Map();

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
  
  const tile = document.getElementById(`tile-stream-${streamKey}`);
  if (tile) {
    tile.remove();
  }
  updateVideoGrid();
}

function syncStreams() {
  state.dataConnections.forEach((conn) => {
    if (conn.open) {
      conn.send({ type: 'REQUEST_STREAMS' });
    }
  });
}

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

let activeSwapSourceCard = null;

function createSpacerCard() {
  const spacer = document.createElement('div');
  spacer.className = 'video-card spacer-card size-small';
  spacer.dataset.spacer = 'true';
  spacer.id = `spacer-${Math.random().toString(36).substring(2, 9)}`;
  spacer.innerHTML = `
    <div class="spacer-inner">
      <span class="spacer-icon">${icons.layout}</span>
      <span class="spacer-label">${t('emptySlot')}</span>
    </div>
  `;
  makeCardDraggable(spacer, spacer);
  return spacer;
}

function fillGridWithSpacers(grid) {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.video-card'));
  const realCards = cards.filter(c => !c.dataset.spacer);

  if (realCards.length === 0) return;

  const remainder = realCards.length % 3;
  if (remainder !== 0) {
    const needed = 3 - remainder;
    const lastCard = realCards[realCards.length - 1];

    let current = lastCard;
    for (let i = 0; i < needed; i++) {
      const next = current.nextElementSibling;
      if (!next || !next.dataset.spacer) {
        const newSpacer = createSpacerCard();
        grid.insertBefore(newSpacer, current.nextSibling);
        current = newSpacer;
      } else {
        current = next;
      }
    }
  }
}

function appendOrReplaceSpacer(grid, tile) {
  const firstSpacer = grid.querySelector('.video-card.spacer-card');
  if (firstSpacer) {
    grid.replaceChild(tile, firstSpacer);
  } else {
    grid.appendChild(tile);
  }
}

function cancelSwapMode() {
  const grid = document.getElementById('video-grid');
  if (grid) {
    grid.classList.remove('swap-mode-active');
    grid.querySelectorAll('.video-card').forEach(c => {
      c.classList.remove('swap-source');
      const badge = c.querySelector('.swap-target-badge');
      if (badge) badge.remove();
    });
    grid.querySelectorAll('.empty-slot-target').forEach(e => e.remove());
  }
  activeSwapSourceCard = null;
}

function activateSwapMode(sourceCard) {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  if (activeSwapSourceCard === sourceCard) {
    cancelSwapMode();
    return;
  }

  cancelSwapMode();
  activeSwapSourceCard = sourceCard;
  grid.classList.add('swap-mode-active');
  sourceCard.classList.add('swap-source');

  fillGridWithSpacers(grid);

  grid.querySelectorAll('.video-card:not(.swap-source)').forEach(c => {
    const badge = document.createElement('div');
    badge.className = 'swap-target-badge';
    badge.innerHTML = `
      <span class="badge-icon">${icons.cursorClick}</span>
      <span class="badge-text">${t('moveHere')}</span>
    `;
    c.appendChild(badge);
  });
}

function animateGridMoveToEmpty(sourceCard, emptySlot) {
  const grid = document.getElementById('video-grid');
  if (!grid || !sourceCard || !emptySlot) return;

  const allCards = Array.from(grid.querySelectorAll('.video-card:not(.empty-slot-target)'));

  // 1. Measure FIRST positions
  const firstPositions = new Map();
  allCards.forEach(c => firstPositions.set(c, c.getBoundingClientRect()));

  // 2. Insert sourceCard before emptySlot in DOM, then remove emptySlot
  grid.insertBefore(sourceCard, emptySlot);
  emptySlot.remove();

  // 3. FLIP LERP Animation
  allCards.forEach(c => {
    const first = firstPositions.get(c);
    const last = c.getBoundingClientRect();
    if (!first || !last) return;

    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx !== 0 || dy !== 0) {
      c.style.transition = 'none';
      c.style.transform = `translate(${dx}px, ${dy}px)`;

      void c.offsetHeight; // Force reflow

      c.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      c.style.transform = '';

      setTimeout(() => {
        c.style.transition = '';
      }, 360);
    }
  });
}

function animateGridSwap(cardA, cardB) {
  const grid = document.getElementById('video-grid');
  if (!grid || !cardA || !cardB || cardA === cardB) return;

  const allCards = Array.from(grid.querySelectorAll('.video-card'));

  // 1. Measure FIRST positions
  const firstPositions = new Map();
  allCards.forEach(c => firstPositions.set(c, c.getBoundingClientRect()));

  // 2. Perform DOM Swap
  const nextA = cardA.nextSibling === cardB ? cardA : cardA.nextSibling;
  grid.insertBefore(cardA, cardB);
  grid.insertBefore(cardB, nextA);

  // 3. FLIP LERP Animation
  allCards.forEach(c => {
    const first = firstPositions.get(c);
    const last = c.getBoundingClientRect();
    if (!first || !last) return;

    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx !== 0 || dy !== 0) {
      c.style.transition = 'none';
      c.style.transform = `translate(${dx}px, ${dy}px)`;

      void c.offsetHeight; // Force reflow

      c.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      c.style.transform = '';

      setTimeout(() => {
        c.style.transition = '';
      }, 360);
    }
  });
}

function moveCardToEmptyGridPosition(sourceCard, clientX, clientY) {
  const grid = document.getElementById('video-grid');
  if (!grid || !sourceCard) return;

  const realCards = Array.from(grid.querySelectorAll('.video-card:not(.empty-slot-target)'));
  if (!realCards.length) return;

  // 1. Measure FIRST positions
  const firstPositions = new Map();
  realCards.forEach(c => firstPositions.set(c, c.getBoundingClientRect()));

  // 2. Determine target position in grid based on clientX / clientY
  let targetRefCard = null;
  let insertBefore = false;

  for (const card of realCards) {
    if (card === sourceCard) continue;
    const rect = card.getBoundingClientRect();

    if (clientY < rect.bottom && clientX < rect.right) {
      targetRefCard = card;
      const isPastCenter = (clientX > rect.left + rect.width / 2) || (clientY > rect.top + rect.height / 2);
      insertBefore = !isPastCenter;
      break;
    }
  }

  // 3. Move sourceCard in DOM
  if (targetRefCard) {
    if (insertBefore) {
      grid.insertBefore(sourceCard, targetRefCard);
    } else {
      grid.insertBefore(sourceCard, targetRefCard.nextSibling);
    }
  } else {
    // Append to end of grid
    grid.appendChild(sourceCard);
  }

  // 4. Clean up any empty slot targets
  grid.querySelectorAll('.empty-slot-target').forEach(e => e.remove());

  // 5. FLIP LERP Animation
  realCards.forEach(c => {
    const first = firstPositions.get(c);
    const last = c.getBoundingClientRect();
    if (!first || !last) return;

    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx !== 0 || dy !== 0) {
      c.style.transition = 'none';
      c.style.transform = `translate(${dx}px, ${dy}px)`;

      void c.offsetHeight; // Force reflow

      c.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      c.style.transform = '';

      setTimeout(() => {
        c.style.transition = '';
      }, 360);
    }
  });
}

document.addEventListener('pointerdown', (e) => {
  if (activeSwapSourceCard) {
    const grid = document.getElementById('video-grid');
    const isInsideGrid = grid && grid.contains(e.target);

    if (isInsideGrid) {
      const clickedCard = e.target.closest('.video-card');
      const clickedEmptySlot = e.target.closest('.empty-slot-target');

      if (!clickedCard || clickedEmptySlot) {
        e.stopPropagation();
        e.preventDefault();
        const source = activeSwapSourceCard;
        cancelSwapMode();
        moveCardToEmptyGridPosition(source, e.clientX, e.clientY);
      }
    } else {
      cancelSwapMode();
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeSwapSourceCard) {
    cancelSwapMode();
  }
});

function makeCardDraggable(card, header) {
  let isPointerDown = false;
  let isDragging = false;
  let dragPlaceholder = null;
  let offsetX = 0;
  let offsetY = 0;
  let savedWidth = '';
  let savedHeight = '';
  let startX = 0;
  let startY = 0;
  let hasMovedFar = false;

  const dragHandle = header.querySelector('.drag-handle') || header;

  // Intercept click on target card when in Swap Mode
  card.addEventListener('pointerdown', (e) => {
    if (activeSwapSourceCard && activeSwapSourceCard !== card) {
      e.stopPropagation();
      e.preventDefault();
      const source = activeSwapSourceCard;
      cancelSwapMode();
      animateGridSwap(source, card);
    }
  }, true);

  dragHandle.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, select, input, .tile-settings-popover, .volume-popover')) {
      return;
    }

    if (activeSwapSourceCard && activeSwapSourceCard !== card) {
      return;
    }

    const grid = document.getElementById('video-grid');
    if (!grid) return;

    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    hasMovedFar = false;

    const rect = card.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    savedWidth = card.style.width;
    savedHeight = card.style.height;
  });

  dragHandle.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    if (activeSwapSourceCard && activeSwapSourceCard !== card) return;

    if (!hasMovedFar && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
      hasMovedFar = true;
      isDragging = true;
      if (activeSwapSourceCard) cancelSwapMode();

      const grid = document.getElementById('video-grid');
      if (grid) {
        const rect = card.getBoundingClientRect();
        dragPlaceholder = document.createElement('div');
        dragPlaceholder.className = `video-card drag-placeholder ${card.className}`;
        dragPlaceholder.style.width = savedWidth || `${rect.width}px`;
        dragPlaceholder.style.height = savedHeight || `${rect.height}px`;
        grid.insertBefore(dragPlaceholder, card);

        card.classList.add('dragging');
        card.style.width = `${rect.width}px`;
        card.style.height = `${rect.height}px`;

        try {
          dragHandle.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    if (!isDragging || !dragPlaceholder) return;

    const grid = document.getElementById('video-grid');
    if (!grid) return;

    card.style.left = `${e.clientX - offsetX}px`;
    card.style.top = `${e.clientY - offsetY}px`;

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elemBelow) return;

    const targetCard = elemBelow.closest('.video-card:not(.dragging):not(.drag-placeholder)');

    if (targetCard && targetCard !== dragPlaceholder) {
      const targetRect = targetCard.getBoundingClientRect();
      const isAfter = (e.clientX > targetRect.left + targetRect.width / 2) || (e.clientY > targetRect.top + targetRect.height / 2);

      if (isAfter) {
        grid.insertBefore(dragPlaceholder, targetCard.nextSibling);
      } else {
        grid.insertBefore(dragPlaceholder, targetCard);
      }
    }
  });

  const stopDrag = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;

    if (activeSwapSourceCard && activeSwapSourceCard !== card && !isDragging) {
      return;
    }

    if (isDragging) {
      isDragging = false;

      card.classList.remove('dragging');
      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
      card.style.width = savedWidth;
      card.style.height = savedHeight;
      card.style.zIndex = '';
      card.style.pointerEvents = '';

      const grid = document.getElementById('video-grid');
      if (grid && dragPlaceholder && dragPlaceholder.parentNode) {
        grid.insertBefore(card, dragPlaceholder);
        dragPlaceholder.remove();
        dragPlaceholder = null;
      }

      try {
        dragHandle.releasePointerCapture(e.pointerId);
      } catch (err) {}
    } else if (!hasMovedFar) {
      activateSwapMode(card);
    }
  };

  dragHandle.addEventListener('pointerup', stopDrag);
  dragHandle.addEventListener('pointercancel', stopDrag);
}

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

const currentStreamDelays = new Map();

function applyStreamPlayoutBuffer(videoElement, peerCall, bufferSeconds = 5.0) {
  if (!videoElement) return;

  const seconds = parseFloat(bufferSeconds) || 5.0;
  const ms = seconds * 1000;
  const elementId = videoElement.id;
  const prevSeconds = currentStreamDelays.get(elementId) || 5.0;

  currentStreamDelays.set(elementId, seconds);

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

function updateVideoGrid() {
  const grid = document.getElementById('video-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  const activeTileIds = new Set();

  if (state.myScreenStream) {
    const id = 'tile-my-local-screen';
    activeTileIds.add(id);
    if (!document.getElementById(id)) {
      const tile = createLocalVideoTile(id, t('yourScreen'), state.myScreenStream);
      appendOrReplaceSpacer(grid, tile);
    }
  }

  if (state.myCameraStream) {
    const id = 'tile-my-local-cam';
    activeTileIds.add(id);
    if (!document.getElementById(id)) {
      const tile = createLocalVideoTile(id, t('yourCam'), state.myCameraStream);
      appendOrReplaceSpacer(grid, tile);
    }
  }

  state.activeRemoteStreams.forEach((data, streamKey) => {
    const id = `tile-stream-${streamKey}`;
    activeTileIds.add(id);

    if (!document.getElementById(id)) {
      const peerId = data.peerId || streamKey.split('-')[0];
      const isCam = streamKey.includes('-cam');
      const uname = data.username || state.roomMembers.get(peerId) || peerId.substring(0, 8);
      const label = isCam ? t('camOf', { username: uname }) : t('screenOf', { username: uname });

      const tile = createRemoteVideoTile(id, label, data.stream, data.call, streamKey);
      appendOrReplaceSpacer(grid, tile);
    }
  });

  const existingTiles = Array.from(grid.querySelectorAll('.video-card:not(.spacer-card)'));
  existingTiles.forEach(tile => {
    if (!activeTileIds.has(tile.id)) {
      tile.remove();
    }
  });

  if (empty) {
    empty.style.display = activeTileIds.size === 0 ? 'block' : 'none';
  }
}

function getVolIconSymbol(vol, muted) {
  if (muted || vol === 0) return icons.volMute;
  if (vol < 30) return icons.volLow;
  if (vol < 70) return icons.volMed;
  return icons.volHigh;
}

// Presenter/Host Local Tile - Controls Broadcast Quality sent to everyone
function createLocalVideoTile(id, labelText, stream) {
  const card = document.createElement('div');
  card.className = 'video-card size-small';
  card.id = id;

  card.innerHTML = `
    <div class="video-header" id="header-${id}">
      <div style="display: flex; align-items: center; gap: 0.35rem; overflow: hidden;">
        <span class="drag-handle" title="Arrastar Card">${icons.grip}</span>
        <span class="video-header-title">${labelText}</span>
      </div>
      <div class="video-header-actions">
        <button class="icon-btn" id="btn-fullscreen-${id}" title="${t('fullscreen')}">${icons.maximize}</button>
        <div class="settings-popover-container">
          <button class="icon-btn gear-btn" id="btn-settings-${id}" title="${t('settings')}">${icons.settings}</button>
          <div class="tile-settings-popover" id="popover-${id}">
            <div class="popover-header">
              <span>${t('settings')}</span>
              <button class="icon-btn" id="popover-close-${id}" style="width:22px; height:22px; font-size:0.7rem;">${icons.close}</button>
            </div>
            
            <div class="popover-section">
              <label class="popover-label">${t('cardSizeLabel')}</label>
              <div class="popover-pill-group">
                <button class="popover-pill pill-size active" data-size="size-small">${t('small')}</button>
                <button class="popover-pill pill-size" data-size="size-medium">${t('medium')}</button>
                <button class="popover-pill pill-size" data-size="size-large">${t('large')}</button>
              </div>
            </div>

            <div class="popover-section">
              <label class="popover-label">${t('broadcastResLabel')}</label>
              <select id="popover-broadcast-res-${id}" class="popover-select">
                <option value="480" ${state.screenSettings.resolution === '480' ? 'selected' : ''}>480p (SD)</option>
                <option value="720" ${state.screenSettings.resolution === '720' ? 'selected' : ''}>720p (HD)</option>
                <option value="1080" ${state.screenSettings.resolution === '1080' ? 'selected' : ''}>1080p (FHD)</option>
                <option value="1440" ${state.screenSettings.resolution === '1440' ? 'selected' : ''}>1440p (2K)</option>
                <option value="4k" ${state.screenSettings.resolution === '4k' ? 'selected' : ''}>4K (UHD)</option>
              </select>
            </div>

            <div class="popover-section">
              <label class="popover-label">${t('fpsLabel')}</label>
              <select id="popover-fps-${id}" class="popover-select">
                <option value="15" ${state.screenSettings.fps === '15' ? 'selected' : ''}>15 FPS</option>
                <option value="30" ${state.screenSettings.fps === '30' ? 'selected' : ''}>30 FPS</option>
                <option value="60" ${state.screenSettings.fps === '60' ? 'selected' : ''}>60 FPS</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-wrapper">
      <video id="video-el-${id}" class="video-element" autoplay playsinline muted></video>
    </div>
  `;

  setTimeout(() => {
    const video = card.querySelector(`#video-el-${id}`);
    const fsBtn = card.querySelector(`#btn-fullscreen-${id}`);
    const settingsBtn = card.querySelector(`#btn-settings-${id}`);
    const popoverClose = card.querySelector(`#popover-close-${id}`);
    const popover = card.querySelector(`#popover-${id}`);
    const header = card.querySelector(`#header-${id}`);

    if (video) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }

    if (header) {
      makeCardDraggable(card, header);
    }
    makeCardResizable(card);

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          card.querySelector('.video-wrapper').requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Toggle popover settings
    if (settingsBtn && popover) {
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('active');
      });
    }

    if (popoverClose && popover) {
      popoverClose.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.remove('active');
      });
    }

    // Card size pills inside popover
    if (popover) {
      const sizePills = popover.querySelectorAll('.pill-size');
      sizePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          sizePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const sz = pill.getAttribute('data-size');
          card.style.width = '';
          card.style.height = '';
          card.classList.remove('size-small', 'size-medium', 'size-large');
          card.classList.add(sz);
        });
      });
    }

    // Broadcast Res & FPS changes
    const bResSel = card.querySelector(`#popover-broadcast-res-${id}`);
    const fpsSel = card.querySelector(`#popover-fps-${id}`);
    if (bResSel || fpsSel) {
      const handleBroadcastChange = () => {
        if (bResSel) state.screenSettings.resolution = bResSel.value;
        if (fpsSel) state.screenSettings.fps = fpsSel.value;
        applyRealtimeQuality(stream, state.screenSettings.resolution, state.screenSettings.fps);
      };
      if (bResSel) bResSel.addEventListener('change', handleBroadcastChange);
      if (fpsSel) fpsSel.addEventListener('change', handleBroadcastChange);
    }
  }, 50);

  return card;
}

// Viewer Remote Tile - Controls Local Display Scale & Volume per viewer non-intrusively
function createRemoteVideoTile(id, labelText, stream, peerCall, streamKey) {
  const card = document.createElement('div');
  card.className = 'video-card size-small';
  card.id = id;

  const peerId = peerCall ? peerCall.peer : streamKey.split('-')[0];
  const isCam = streamKey.includes('-cam');
  const uname = state.activeRemoteStreams.get(streamKey)?.username || state.roomMembers.get(peerId) || peerId.substring(0, 8);

  const savedState = getSavedVolumeState(streamKey, uname, isCam);
  let currentVolume = savedState.volume;
  let isMutedState = savedState.muted;
  let lastNonZeroVolume = currentVolume > 0 ? currentVolume : 100;

  card.innerHTML = `
    <div class="video-header" id="header-${id}">
      <div style="display: flex; align-items: center; gap: 0.35rem; overflow: hidden;">
        <span class="drag-handle" title="Arrastar Card">${icons.grip}</span>
        <span class="video-header-title">${labelText}</span>
      </div>
      <div class="video-header-actions">
        <!-- Modern Volume Widget -->
        <div class="volume-widget-container" id="vol-container-${id}">
          <button class="icon-btn" id="btn-vol-icon-${id}" title="${t('vol')}">
            <span class="vol-icon-symbol" id="vol-symbol-${id}">${getVolIconSymbol(currentVolume, isMutedState)}</span>
          </button>
          <div class="volume-popover" id="vol-popover-${id}">
            <input type="range" id="vol-range-${id}" class="volume-slider-custom" min="0" max="100" value="${currentVolume}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: #a1a1aa;">Volume:</span>
              <span class="volume-badge" id="vol-badge-${id}">${isMutedState ? 'MUTE' : currentVolume + '%'}</span>
            </div>
            <div class="volume-presets">
              <button class="vol-preset-btn" data-vol="0">0%</button>
              <button class="vol-preset-btn" data-vol="50">50%</button>
              <button class="vol-preset-btn" data-vol="100">100%</button>
            </div>
          </div>
        </div>

        <!-- Fullscreen -->
        <button class="icon-btn" id="btn-fullscreen-${id}" title="${t('fullscreen')}">${icons.maximize}</button>
        
        <!-- Tile Popover Settings -->
        <div class="settings-popover-container">
          <button class="icon-btn gear-btn" id="btn-settings-${id}" title="${t('settings')}">${icons.settings}</button>
          <div class="tile-settings-popover" id="popover-${id}">
            <div class="popover-header">
              <span>${t('settings')}</span>
              <button class="icon-btn" id="popover-close-${id}" style="width:22px; height:22px; font-size:0.7rem;">${icons.close}</button>
            </div>

            <div class="popover-section">
              <label class="popover-label">${t('cardSizeLabel')}</label>
              <div class="popover-pill-group">
                <button class="popover-pill pill-size active" data-size="size-small">${t('small')}</button>
                <button class="popover-pill pill-size" data-size="size-medium">${t('medium')}</button>
                <button class="popover-pill pill-size" data-size="size-large">${t('large')}</button>
              </div>
            </div>

            <div class="popover-section">
              <label class="popover-label">${t('displayResLabel')}</label>
              <select id="popover-display-res-${id}" class="popover-select">
                <option value="native" selected>${t('nativeRes')}</option>
                <option value="1080">1080p (FHD)</option>
                <option value="720">720p (HD)</option>
                <option value="480">480p (SD)</option>
              </select>
            </div>

            <div class="popover-section">
              <label class="popover-label">${t('delayLabel')}</label>
              <select id="popover-delay-${id}" class="popover-select">
                <option value="0.25">${t('delay025s')}</option>
                <option value="1">${t('delay1s')}</option>
                <option value="3">${t('delay3s')}</option>
                <option value="5" selected>${t('delay5s')}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Close Stream -->
        <button class="icon-btn btn-close-card" id="btn-close-${id}" title="${t('closeStream')}">${icons.close}</button>
      </div>
    </div>
    <div class="video-wrapper">
      <video id="video-el-${id}" class="video-element" autoplay playsinline muted></video>
      <div class="audio-prompt-overlay" id="overlay-${id}" style="display: none;">
        <button class="btn" id="btn-watch-${id}" style="padding: 0.75rem 1.5rem; font-size: 1rem;">${t('watchStream')}</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const video = card.querySelector(`#video-el-${id}`);
    const overlay = card.querySelector(`#overlay-${id}`);
    const watchBtn = card.querySelector(`#btn-watch-${id}`);
    const fsBtn = card.querySelector(`#btn-fullscreen-${id}`);
    const closeBtn = card.querySelector(`#btn-close-${id}`);
    const settingsBtn = card.querySelector(`#btn-settings-${id}`);
    const popoverClose = card.querySelector(`#popover-close-${id}`);
    const popover = card.querySelector(`#popover-${id}`);
    const volIconBtn = card.querySelector(`#btn-vol-icon-${id}`);
    const volSymbol = card.querySelector(`#vol-symbol-${id}`);
    const volBadge = card.querySelector(`#vol-badge-${id}`);
    const volRange = card.querySelector(`#vol-range-${id}`);
    const volContainer = card.querySelector(`#vol-container-${id}`);
    const header = card.querySelector(`#header-${id}`);

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

    if (video && stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        video.srcObject = new MediaStream(videoTracks);
      } else {
        video.srcObject = stream;
      }
      video.muted = true;

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

    const applyVolume = (percent, isMuted) => {
      const clamped = Math.max(0, Math.min(100, parseInt(percent, 10) || 0));
      currentVolume = clamped;
      isMutedState = isMuted || clamped === 0;

      if (clamped > 0) {
        lastNonZeroVolume = clamped;
      }

      if (volRange) volRange.value = clamped;
      if (volBadge) volBadge.innerText = isMutedState ? 'MUTE' : `${clamped}%`;
      if (volSymbol) volSymbol.innerHTML = getVolIconSymbol(clamped, isMutedState);

      if (gainNode) {
        const ctx = getAudioContext();
        const gainVal = isMutedState ? 0 : (clamped / 100);
        if (ctx) {
          gainNode.gain.setValueAtTime(gainVal, ctx.currentTime || 0);
        } else {
          gainNode.gain.value = gainVal;
        }
      }

      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !isMutedState;
        });
      }

      saveVolumeState(streamKey, uname, isCam, currentVolume, isMutedState);
    };

    applyVolume(currentVolume, isMutedState);

    // Mute icon click toggle
    if (volIconBtn) {
      volIconBtn.addEventListener('click', (e) => {
        if (e.target.closest('.volume-popover')) return;
        getAudioContext();
        if (isMutedState) {
          applyVolume(lastNonZeroVolume > 0 ? lastNonZeroVolume : 100, false);
        } else {
          applyVolume(currentVolume, true);
        }
      });
    }

    // Volume Slider
    if (volRange) {
      volRange.addEventListener('input', (e) => applyVolume(e.target.value, false));
      volRange.addEventListener('change', (e) => applyVolume(e.target.value, false));
    }

    // Volume Presets
    if (volContainer) {
      volContainer.querySelectorAll('.vol-preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetVol = parseInt(btn.getAttribute('data-vol'), 10);
          applyVolume(targetVol, targetVol === 0);
        });
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

    // Toggle popover settings
    if (settingsBtn && popover) {
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('active');
      });
    }

    if (popoverClose && popover) {
      popoverClose.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.remove('active');
      });
    }

    // Card size pills inside popover
    if (popover) {
      const sizePills = popover.querySelectorAll('.pill-size');
      sizePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          sizePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const sz = pill.getAttribute('data-size');
          card.style.width = '';
          card.style.height = '';
          card.classList.remove('size-small', 'size-medium', 'size-large');
          card.classList.add(sz);
        });
      });
    }

    // Display Scale
    const dispSel = card.querySelector(`#popover-display-res-${id}`);
    if (dispSel && video) {
      dispSel.addEventListener('change', (e) => {
        const val = e.target.value;
        card.dataset.displayRes = val;
        if (val === '480') {
          video.style.maxWidth = '854px';
          video.style.maxHeight = '480px';
        } else if (val === '720') {
          video.style.maxWidth = '1280px';
          video.style.maxHeight = '720px';
        } else if (val === '1080') {
          video.style.maxWidth = '1920px';
          video.style.maxHeight = '1080px';
        } else {
          video.style.maxWidth = '100%';
          video.style.maxHeight = '100%';
        }
      });
    }

    // Delay Buffer
    const delaySel = card.querySelector(`#popover-delay-${id}`);
    if (delaySel && video) {
      delaySel.addEventListener('change', (e) => {
        const sec = parseFloat(e.target.value) || 5.0;
        card.dataset.delay = e.target.value;
        applyStreamPlayoutBuffer(video, peerCall, sec);
      });
    }

    if (header) {
      makeCardDraggable(card, header);
    }

    makeCardResizable(card);

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
          conn.send({ type: 'AUTH_FAILED', message: t('incorrectPassword') });
          setTimeout(() => conn.close(), 300);
          return;
        }

        const peerUsername = data.username || t('defaultUsername');
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
        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem;">${t('protectedRoomModalTitle')}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${t('protectedRoomModalDesc')}</p>
        <div class="field-group">
          <input type="password" id="modal-pass-input" placeholder="${t('placeholderRoomPasswordModal')}">
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
          <button class="btn btn-secondary" id="modal-cancel-btn">${t('cancel')}</button>
          <button class="btn" id="modal-submit-btn">${t('enter')}</button>
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
        const uname = typeof m === 'object' ? m.username : t('defaultUsername');

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

function renderUsersList() {
  const ul = document.getElementById('users-list-ul');
  if (!ul) return;

  ul.innerHTML = '';
  if (state.roomMembers.size === 0 && state.myUsername) {
    state.roomMembers.set(state.myPeerId || 'local', state.myUsername);
  }

  state.roomMembers.forEach((uname, peerId) => {
    const isMe = peerId === state.myPeerId || uname === state.myUsername;
    const li = document.createElement('li');
    li.className = 'user-list-item';

    const hasScreen = isMe ? !!state.myScreenStream : Array.from(state.activeRemoteStreams.values()).some(s => s.peerId === peerId && !s.streamKey?.includes('-cam'));
    const hasCam = isMe ? !!state.myCameraStream : Array.from(state.activeRemoteStreams.values()).some(s => s.peerId === peerId && s.streamKey?.includes('-cam'));

    li.innerHTML = `
      <div class="user-info">
        <span class="user-icon">${icons.user}</span>
        <span class="user-name">${uname} ${isMe ? `<span class="you-tag">${t('youTag')}</span>` : ''}</span>
      </div>
      <div class="user-status-badges">
        ${hasScreen ? `<span class="stream-badge screen-badge" title="${t('shareScreen')}">${icons.share}</span>` : ''}
        ${hasCam ? `<span class="stream-badge cam-badge" title="${t('turnOnCam')}">${icons.camera}</span>` : ''}
      </div>
    `;
    ul.appendChild(li);
  });
}

function updateMemberCountLabel() {
  const count = state.roomMembers.size;
  const label = count === 1 ? t('person') : t('people');
  const lbl = document.getElementById('member-count-label');
  if (lbl) {
    lbl.innerText = t('peopleInRoom', { count, label });
  }
  const popoverCount = document.getElementById('popover-member-count');
  if (popoverCount) {
    popoverCount.innerText = count;
  }
  renderUsersList();
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

function hideRoomCodeAutomatically() {
  if (!state.isRoomCodeHidden) {
    state.isRoomCodeHidden = true;
    const textEl = document.getElementById('room-code-text');
    if (textEl) {
      textEl.innerText = '••••••••';
    }
    const toggleVisibilityBtn = document.getElementById('btn-toggle-room-code');
    if (toggleVisibilityBtn) {
      toggleVisibilityBtn.innerHTML = icons.eyeOff;
      toggleVisibilityBtn.title = t('showRoomCode');
    }
  }
}

async function startMyScreenShare() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: getQualityVideoConstraints(),
      audio: true,
      systemAudio: 'exclude',
      windowAudio: 'window'
    });

    state.myScreenStream = stream;
    hideRoomCodeAutomatically();

    state.dataConnections.forEach((conn, peerId) => {
      const call = state.peer.call(peerId, stream, { metadata: { type: 'screen', username: state.myUsername } });
      state.mediaCalls.set(peerId, call);
    });

    stream.getVideoTracks()[0].onended = () => {
      stopMyScreenShare();
    };

    const btn = document.getElementById('btn-toggle-share');
    if (btn) {
      btn.innerHTML = `${icons.share} <span>${t('stopShareScreen')}</span>`;
      btn.className = 'btn btn-danger dock-btn';
    }

    updateVideoGrid();

  } catch (err) {}
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
    btn.innerHTML = `${icons.share} <span>${t('shareScreen')}</span>`;
    btn.className = 'btn btn-primary dock-btn';
  }

  const tile = document.getElementById('tile-my-local-screen');
  if (tile) tile.remove();

  updateVideoGrid();
}

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
    hideRoomCodeAutomatically();

    state.dataConnections.forEach((conn, peerId) => {
      const call = state.peer.call(peerId, stream, { metadata: { type: 'camera', username: state.myUsername } });
      state.cameraCalls.set(peerId, call);
    });

    stream.getVideoTracks()[0].onended = () => {
      stopMyWebcam();
    };

    const btn = document.getElementById('btn-toggle-cam');
    if (btn) {
      btn.innerHTML = `${icons.camera} <span>${t('turnOffCam')}</span>`;
      btn.className = 'btn btn-danger dock-btn';
    }

    updateVideoGrid();

  } catch (err) {}
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
    btn.innerHTML = `${icons.camera} <span>${t('turnOnCam')}</span>`;
    btn.className = 'btn btn-secondary dock-btn';
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
