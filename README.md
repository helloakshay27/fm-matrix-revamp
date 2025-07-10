## 🔁 Git Workflow Setup

This project uses a fork-based workflow to manage UI and API integration.

- ✅ Cloned original UI repo: [`lmahendra/fm-matrix-redesign`](https://github.com/lmahendra/fm-matrix-redesign)
- 🚀 Pushed to personal repo: [`helloakshay27/fm-matrix-revamp`](https://github.com/helloakshay27/fm-matrix-revamp)
- 🌿 Created working branch: `api-integration-ui`
- 🔁 Set up remotes:
  - `origin` → my repo (for pushing changes)
  - `upstream` → original repo (for pulling UI updates)
- ⬇️ Fetched updates from `upstream/main`
- 🔀 Merged into local `main`
- ☁️ Pushed updated `main` to `origin`
- 🔃 Rebased `api-integration-ui` on latest `main` for smooth integration

📂 Script available: `sync-upstream.sh` — automates syncing from upstream.
