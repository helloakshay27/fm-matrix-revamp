# Frontend Production Deployment Checklist

Use this checklist for every release into a production branch (`main`, `Pulse-prod-main`, `Club-House-Main`).

- **[AUTO]** items are checked by the **Production Readiness** workflow (`.github/workflows/production-readiness.yml`). It posts a report as a comment on the PR. To run the same checks locally: `npm run readiness -- --base origin/main`.
- **[MANUAL]** items are ticked by a person in the PR description (`.github/pull_request_template.md`).

The automated checks are in **report** mode: they show ✅ / ⚠️ / ❌ but never block a merge. See [ADOPTING.md](ADOPTING.md#switching-to-enforce-mode) for how to make them blocking.

---

## 1. Branding
- [ ] **[AUTO]** The page `<title>` matches `branding.title` in `readiness.config.json`.
- [ ] **[AUTO]** `<meta name="theme-color">` matches the brand color (`--color-primary` in `src/styles/theme.css`).
- [ ] **[AUTO]** The favicon `<link>` exists and every logo/favicon file is present in `public/`.
- [ ] **[MANUAL]** The logo, favicon, title and theme look correct for every tenant layout the change touches.

## 2. Environment configuration
- [ ] **[AUTO]** The PR adds no `localhost`, `127.0.0.1`, `ngrok` or LAN URLs.
- [ ] **[AUTO]** New dev/UAT/staging hosts are flagged. These are allowed only as part of tenant routing in `src/utils/auth.ts`.
- [ ] **[AUTO]** New URLs use hosts from `scan.allowedHostSuffixes`.
- [ ] **[AUTO]** The required build-time env vars (`environment.requiredEnvVars`) are set.
- [ ] **[AUTO]** Production sourcemaps are off.
- [ ] **[MANUAL]** The production Base URL and API endpoints are verified for each affected tenant.
- [ ] **[MANUAL]** Env variables use the Vite prefix `VITE_*`, not CRA/Next prefixes such as `REACT_APP_*` or `NEXT_PUBLIC_*`.

## 3. Code quality
- [ ] **[AUTO]** The PR adds no `console.log` calls. In production builds, `vite.config.ts` also strips `console.log` and `debugger`, so leftovers never ship.
- [ ] **[AUTO]** The PR adds no `debugger` statements.
- [ ] **[AUTO]** ESLint (`npm run lint`) passes.
- [ ] **[AUTO]** TypeScript (`npm run typecheck`) passes.
- [ ] **[MANUAL]** Unused code, commented-out blocks and dead imports are removed from changed files.

## 4. Build verification
- [ ] **[AUTO]** The production build (`npm run build`) completes without errors. This is **critical**: a failing build cannot be deployed.

## 5. Functionality
- [ ] **[MANUAL]** Login, logout and session expiry work.
- [ ] **[MANUAL]** RBAC: every Add / Edit / View / bulk action is gated with `useDynamicPermissions().shouldShow(...)`.
- [ ] **[MANUAL]** Changed API integrations return success, and errors are shown to the user (no silent failures).
- [ ] **[MANUAL]** Forms validate and submit correctly.
- [ ] **[MANUAL]** Critical workflows of the touched module are verified end-to-end.

## 6. UI/UX
- [ ] **[MANUAL]** The UI is responsive at mobile, tablet and desktop widths.
- [ ] **[MANUAL]** There is no cut-off content, broken layout or broken pagination.
- [ ] **[MANUAL]** Images and icons load.
- [ ] **[MANUAL]** The change is checked on Chrome, Safari, Firefox and Edge.

## 7. Security
- [ ] **[AUTO]** The PR adds no hardcoded credentials, such as API keys, passwords, Bearer tokens, AWS keys, JWTs or private keys.
- [ ] **[AUTO]** No `.env` files are committed. `.env.example` is allowed.
- [ ] **[MANUAL]** No dev-only flags, test users or debug panels are enabled in production.
- [ ] **[MANUAL]** No third-party API that needs a secret key is called directly from the browser.

## 8. Testing
- [ ] **[AUTO]** Unit tests (`npm test`) pass. The report shows "not configured" until a test runner is added.
- [ ] **[MANUAL]** The developer has done functional testing.
- [ ] **[MANUAL]** QA has verified the change on UAT.

## 9. Deployment readiness
- [ ] **[AUTO]** The PR targets a production branch.
- [ ] **[AUTO]** `version` in `package.json` is bumped.
- [ ] **[AUTO]** A previous release tag exists to roll back to.
- [ ] **[MANUAL]** The PR is raised from the correct base branch and merges cleanly.
- [ ] **[MANUAL]** The rollback plan is written in the PR description (see [Rollback](#rollback)).

## 10. Final approval
- [ ] **[AUTO / MANUAL]** **Developer** sign-off is ticked in the PR description.
- [ ] **[AUTO / MANUAL]** **QA** sign-off is ticked in the PR description.
- [ ] **[AUTO / MANUAL]** **Frontend Lead** sign-off is ticked in the PR description.
- [ ] **[MANUAL]** Branch protection requires 2 approvals before merge. The setup is in [ADOPTING.md](ADOPTING.md#branch-protection).

The workflow reruns when the PR description is edited, so the report updates as people tick their sign-off.

---

## Release steps

1. Bump `version` in `package.json` (for example, `1.4.0`).
2. Open a PR into the production branch using the PR template. Wait for the readiness report.
3. Fix every ❌ item, or explain it in the PR. Review each ⚠️ item.
4. Get the three sign-offs and the required approvals, then merge.
5. Tag the merged commit: `git tag v1.4.0 && git push origin v1.4.0`.

## Rollback

| Deploy path | How to roll back |
|---|---|
| `main` (AWS CodeDeploy, `appspec.yml`) | In CodeDeploy, redeploy the previous successful revision. Or revert the merge commit on `main` so the pipeline redeploys. |
| EC2 via GitHub Actions (`deploy.yml`, `deploy_uat.yaml`) | Re-run the workflow for the previous release tag or commit. Or revert the merge commit and push. |
| Any | Check out the previous release tag (`git checkout vX.Y.Z`), build, and redeploy `dist/`. |

Write the tag or revision you would roll back to in the PR's **Rollback plan** field before you merge.
