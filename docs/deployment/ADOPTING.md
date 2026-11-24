# Adopting the Production Readiness Kit

This kit gives any frontend repo the same production release checklist, automated report and sign-off. It needs Node 18 or later and no new npm dependencies.

## 1. Copy the kit files

Copy these files into the target repo at the same paths:

| File | What it does |
|---|---|
| `readiness.config.json` | Per-repo settings. This is the only file you have to edit. |
| `scripts/readiness/check.mjs` | Runs the checks and writes the Markdown report. |
| `.github/workflows/production-readiness.yml` | Runs build, lint, typecheck, tests and the report on PRs into production branches. |
| `.github/pull_request_template.md` | The manual checklist and the three sign-off boxes. |
| `docs/deployment/PRODUCTION_CHECKLIST.md` | The full checklist and the release and rollback steps. |
| `docs/deployment/ADOPTING.md` | This guide. |

## 2. Edit for the target repo

**`readiness.config.json`:**

| Key | Set it to |
|---|---|
| `productionBranches` | That repo's production branches. |
| `branding.title`, `branding.themeColor`, `branding.icons` | That app's title, brand color and logo/favicon paths. |
| `environment.requiredEnvVars` | Build-time env vars that must be set for production, for example `["VITE_API_BASE_URL"]`. |
| `scan.sourceGlobs` | The source folders to scan, for example `["src/", "index.html"]`. |
| `scan.allowedHostSuffixes` | The API and CDN domains the app legitimately calls. |

**`.github/workflows/production-readiness.yml`:** set `on.pull_request.branches` to the same list as `productionBranches`.

**`package.json`:** make sure these scripts exist. The workflow calls them.

```json
"build": "vite build",
"lint": "eslint .",
"typecheck": "tsc --noEmit -p tsconfig.app.json",
"readiness": "node scripts/readiness/check.mjs"
```

For a CRA or Next.js repo, use that tool's build command. Also change the env-var prefix in the checklist from `VITE_*` to `REACT_APP_*` or `NEXT_PUBLIC_*`.

**Recommended for Vite repos:** strip logs from production bundles in `vite.config.ts`:

```ts
esbuild: {
  drop: mode === "production" ? ["debugger"] : [],
  pure: mode === "production" ? ["console.log"] : [],
},
```

## 3. Branch protection

These are GitHub settings, not code. Someone with admin access must apply them. Go to **Settings → Branches → Add rule** and create a rule for each production branch:

- [x] Require a pull request before merging, with **2 required approvals** (QA and Frontend Lead).
- [x] Dismiss stale approvals when new commits are pushed.
- [x] Require status checks to pass, and add **`production-readiness`**. In report mode the job always succeeds, so this only ensures that the report ran.
- [x] Do not allow bypassing the above settings.

Optionally, add `.github/CODEOWNERS` so the right reviewers are requested automatically:

```
# Replace with your real GitHub teams or users
*  @your-org/frontend-leads @your-org/qa
```

Then also tick **Require review from Code Owners** in the branch rule.

## 4. Verify the setup

1. Run `npm run readiness -- --base origin/main` locally. You should see a report, and the command should exit with code 0.
2. Open a draft PR into a production branch. Confirm that the **Production Readiness** workflow runs and posts one comment, and that the comment is updated on each push.
3. Tick a sign-off box in the PR description. The report should rerun and show that box as ✅.

## Switching to enforce mode

Report mode never blocks a merge or deploy. Once a repo's existing debt is cleaned up, switch it to enforce mode in either of two ways:

- Set `"mode": "enforce"` in `readiness.config.json`.
- Or set the repository variable **`READINESS_MODE`** to `enforce` under **Settings → Secrets and variables → Actions → Variables**. This overrides the config file without a code change.

In enforce mode, any ❌ item fails the `production-readiness` check. With the branch rule above, that blocks the merge.

You can also enforce one repo at a time: switch a repo once its report shows no ❌ items in report mode.
