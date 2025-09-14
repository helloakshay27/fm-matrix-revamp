## 🔁 Git Workflow Setup

This project uses a fork-based workflow to manage UI and API integration.

- ✅ Cloned original UI repo: [`lmahendra/fm-matrix-redesign`](https://github.com/lmahendra/fm-matrix-redesign)
- 🚀 Pushed to personal repo: [`helloakshay27/fm-matrix-revamp`](https://github.com/helloakshay27/fm-matrix-revamp)
- 🌿 Created working branch: `api-integration-ui`
- 🔁 Set up remotes:
  - `origin` → my repo (for pushing changes [`helloakshay27/fm-matrix-revamp`](https://github.com/helloakshay27/fm-matrix-revamp))
  - `upstream` → original repo (for pulling UI updates [`lmahendra/fm-matrix-redesign`](https://github.com/lmahendra/fm-matrix-redesign))
- ⬇️ Fetched updates from `upstream/main`
- 🔀 Merged into local `main`
- ☁️ Pushed updated `main` to `origin`
- 🔃 Rebased `api-integration-ui` on latest `main` for smooth integration

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
