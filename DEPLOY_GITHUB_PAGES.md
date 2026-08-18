# Vite to Live in 5 Minutes! The Lazy Dev’s Guide to GitHub Pages

*By Deepak Surya (Published in Level Up Coding)*

Deploy your Vite app to GitHub Pages quickly, easily, and with minimal fuss.

---

## 5 Easy Steps to Get Your Vite App Online

### 1. Set Up Git & GitHub
Ensure you have Git installed and your project connected to a GitHub repository.

### 2. Tell Vite Where to Look
Open or create `vite.config.js` in your project root and add the `base` option, setting it to `"/{repo-name}/"` or `'./'` for relative paths.

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // if using React

export default defineConfig({
  plugins: [react()], // optional: your plugins
  base: "/my-vite-site/" // or './' for relative root
});
```

### 3. Install `gh-pages`
Install `gh-pages` as a development dependency:

```bash
npm install gh-pages --save-dev
```

This package handles automated deployments to the `gh-pages` branch.

### 4. Update `package.json`
Add deployment scripts inside the `"scripts"` section of `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

*(Optional)* Set the `"homepage"` field to your GitHub Pages URL:
```json
"homepage": "https://{username}.github.io/{repo-name}/"
```

### 5. Deploy It!
Run the deployment command:

```bash
npm run deploy
```

This builds your Vite project (`npm run build`) and publishes the `dist` output directory to the `gh-pages` branch on GitHub.

---

## Final Steps on GitHub

1. Head over to your repository settings on GitHub.
2. Navigate to the **Pages** section in the side menu.
3. Under **Build and deployment**, set the source branch to `gh-pages` (folder: `/ (root)`).
4. Save the settings. Your app will be live at:
   `https://{username}.github.io/{repo-name}/`

---

## Client-Side Routing (e.g., `react-router-dom`)

If you are using `createBrowserRouter` with `RouterProvider`, add a `basename` so routing does not result in 404s:

```javascript
const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/projects/:projectId", element: <ProjectDetail /> }
  ],
  { basename: "/my-vite-site" } // Matches your repo name
);
```

> **Troubleshooting 404s after deploy:** Double-check that your `base` setting in `vite.config.js` and `basename` in your router match your repository name exactly.
