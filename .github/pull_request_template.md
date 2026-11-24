## Summary

<!-- What does this PR change and why? Link the ticket. -->

**Module / pages affected:**
**Ticket:**

---

## Production readiness

> Required for PRs into `main`, `Pulse-prod-main` or `Club-House-Main`. For other branches, fill in what applies.
> Automated checks are posted as a comment by the **Production Readiness** workflow.
> Full checklist: `docs/deployment/PRODUCTION_CHECKLIST.md` in this repo

### Functionality
- [ ] Login / logout / session expiry work
- [ ] Every Add / Edit / View / bulk action is gated with `useDynamicPermissions().shouldShow(...)`
- [ ] Changed API integrations return success, and errors are shown to the user
- [ ] Forms validate and submit correctly
- [ ] Critical workflows of the module verified end-to-end

### UI/UX
- [ ] Responsive at mobile / tablet / desktop widths
- [ ] No cut-off content, broken layouts or pagination
- [ ] Checked on Chrome, Safari, Firefox and Edge

### Branding and environment
- [ ] Logo, favicon, title and theme correct for each affected tenant
- [ ] Production Base URL / API endpoints verified (no localhost, dev or UAT URLs)

### Deployment
- **Release version:** <!-- e.g. 1.4.0 (bump package.json) -->
- **Rollback plan:** <!-- previous tag / CodeDeploy revision to redeploy -->

---

## Sign-off

<!-- Each person ticks their own box. The readiness workflow reports any unticked box. -->
- [ ] **Developer**: @ — self-tested, checklist above complete
- [ ] **QA**: @ — verified on UAT
- [ ] **Frontend Lead**: @ — reviewed and approved for production
