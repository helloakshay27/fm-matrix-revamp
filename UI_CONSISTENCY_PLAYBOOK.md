# UI Consistency Playbook — Accounting Module Color/Style Unification

> Generated from a multi-session cleanup effort. **Reference module: Quotes** (`QuotesAdd.tsx`, `QuotesEdit.tsx`, `QuotesDetails.jsx`, `QuotesDashboard.tsx`) — every other module was brought to visual/behavioral parity with Quotes. Items and Customers modules were unified earlier and are also valid references for base button/table/input conventions.

---

## 1. Changelog — what's been completed

### Modules fully unified (Add / Edit / Details / List, or Add/Edit/Details as applicable)
- **Items** — Add, Edit, Details, Dashboard (earliest reference implementation)
- **Customers** — Add, Edit, Details, Dashboard
- **Quotes** — Add, Edit, Details, Dashboard *(the canonical reference for everything below)*
- **Credit Note** — Add, Edit, Details, List
- **Recurring Invoice** — Create, Edit, Details, List
- **Payment Received** — List, Add (RecordPaymentPage), Edit, Details
- **Invoice** — Dashboard/List, Add, Edit, Details
- **Sales Order** — Create, Edit, Details, List

### Shared/systemic fixes (affect multiple modules at once)
- `src/index.css` `.fm-button-fix` rule — added `border-radius: 0 !important;` (MUI buttons using this class were still showing rounded corners).
- `src/components/accounting/AccountingDocumentPdf.jsx` — the shared PDF-rendering component used by Sales Order/Invoice/Recurring Invoice/Payment Received/Credit Note: flattened `getAccountingPdfStatusStyle` from a 12-status color map (green/blue/purple/amber/red) to one neutral gray/black style.
- Discovered several **duplicated local copies** of the same PDF status-style function that the shared-component fix did NOT cover, because they're independent copies, not imports:
  - `QuotesDetails.jsx` (own `getPdfStatusStyle`, used by its own inline `renderQuotePdf`) — fixed.
  - `PaymentReceivedPdfTemplate.tsx` (own `getAccountingPdfStatusStyle`) — fixed.
  - `PurchaseOrderPdfTemplate.tsx`, `purchasepdftamplate.tsx`, `PaymentMadePdfTemplate.tsx` — **same bug confirmed present, not yet fixed** (out of scope of the last request, flagged to the user).
- Fixed a recurring `text-blue-700` bug on the Bill-To/Ship-To customer name across `AccountingDocumentPdf.jsx`, `DocumentTemplatePreview.tsx`, `QuotesDetails.jsx`, and `PaymentReceivedPdfTemplate.tsx`.
- Fixed a recurring `text-red-600` "Amount Withheld" tax-deduction line rendering as brand-orange on screen (not red) due to a global `theme.css` override (`:not([data-semantic-colors]) > .text-red-600:not(.keep-red) { color: var(--color-primary) !important }`) — removed the color class entirely so it renders plain black like the rest of the PDF summary, in both `AccountingDocumentPdf.jsx` and `QuotesDetails.jsx`.

### Template Edit system (built earlier, applies to 11 document types)
Logo / Organization Address / Template Name / Signature / Terms & Conditions editor, with live side-by-side preview, isolated per-document-type settings (localStorage-keyed), save→redirect-to-PDF-tab flow. Built for: Quotes, Sales Order, Invoice, Recurring Invoice, Payment Received, Credit Note, Purchase Order, Bill, Recurring Bill, Payment Made, Vendor Credit, Vendor Statement.
- Core files: `src/utils/documentTemplate.ts`, `src/components/DocumentTemplateEditor.tsx`, `src/components/DocumentTemplatePreview.tsx`, `src/pages/ClubManagement/DocumentTemplateEditPage.tsx`, plus ~11 thin per-module wrapper pages/routes.

### Bank Master validation system (built earlier)
`src/pages/ClubManagement/bankMasterUtils.ts` — name/IFSC/SWIFT/account-number format validation, live (not just on-submit) validation, duplicate account-number detection, 422-error-to-toast mapping. Applied to `BankMasterAdd.tsx`, `BankMasterEdit.tsx`.

### Bank Details section (built earlier)
Dedicated "Bank Details" section (matching the Bill page pattern) added to Expense/Recurring Expense Add, Edit, and Details pages.

---

## 2. The Universal Prompt

Copy everything in the fenced block below and hand it to a fresh session/agent along with the target file(s) to bring any not-yet-covered module (e.g. Purchase Order, Bill, Recurring Bill, Payment Made, Vendor Credit, Vendor Statement) up to the same standard.

```
You are unifying [MODULE NAME]'s Add/Edit/Details/List pages to match the established
design conventions already applied across Quotes, Sales Order, Invoice, Recurring
Invoice, Payment Received, and Credit Note. Read the target file(s) fully, then apply
every rule below that's relevant. Grep first to locate patterns — don't assume line
numbers from any prior audit are still accurate.

BRAND COLOR
- Source of truth: CSS var --color-primary = #DA7756, hover shade #C45F40.
- Use Tailwind bg-brand / text-brand / border-brand / bg-brand-light where possible.
- For MUI `sx` props, use the hex directly (#DA7756 / #C45F40).

BUTTONS
- Primary Save/Submit/Update (shadcn): className="fm-button-fix fm-button-brand px-8 py-2"
- Primary Save/Submit/Update (MUI): same className PLUS sx={{ textTransform: 'none', fontWeight: 600 }}
  — and DELETE any stale conflicting sx color values (e.g. bgcolor:'#f8f1f1', color:'#C72030')
  even if currently masked by the className's !important rules; dead/misleading code.
- Cancel (shadcn outline): className="fm-button-fix px-8 py-2" is enough — shadcn's
  `outline` variant already bakes in brand-orange border/text.
- Cancel (MUI outlined): className="fm-button-fix px-8 py-2" PLUS
  sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#DA7756', color: '#DA7756',
  '&:hover': { borderColor: '#C45F40', bgcolor: '#F2EEE9', color: '#C45F40' } }}
- Destructive Delete/OK buttons must ALWAYS stay real red: backgroundColor '#dc2626',
  hover '#b91c1c', white text. NEVER convert these to orange, even during bulk find/replace.
  KNOWN BUG: the shared src/components/ui/button.tsx `variant="destructive"` renders
  brand-cream (bg-[#F2EEE9] text-brand), NOT red — if a delete dialog relies on that
  variant, add an explicit inline style/sx override forcing true red instead of trusting
  the variant.
- "Back to X" / neutral navigation buttons must stay plain black/gray, never orange or red.
  - shadcn <Button> with NO `variant` prop silently defaults to `default` (bg-[#C72030]
    !text-white, reads as legacy red/brand) — give it an explicit neutral/ghost variant.
  - MUI <Button variant="text"> with no `color` prop defaults to color="primary". A
    global theme.css rule `[class*="MuiButton-textPrimary"] { color: var(--color-primary)
    !important }` will force it orange, BEATING any inline sx={{color:'black'}} (importance
    ties are broken by specificity, and the attribute-selector rule wins over a plain sx
    class). Fix: add `color="inherit"` to the Button in addition to the sx.
- MUI Buttons with `startIcon` sometimes don't reliably pick up the forced brand color on
  the icon even when the button text is correctly orange. If the icon looks black/wrong,
  force it explicitly: sx={{ ..., '& .MuiSvgIcon-root': { color: '#DA7756' } }}.
- ALL action/status-transition buttons (Mark as Sent, Approve, Reject, Mark as Confirmed,
  Submit for Approval, etc.) must be brand orange — bg-[#DA7756] text-white
  hover:bg-[#C45F40]. This OVERRIDES any older "leave semantic colors alone" instinct —
  there are NO exceptions for these buttons anymore. The ONLY exception is genuine
  destructive Delete/Trash confirmations, which must stay red per above.

STATUS BADGES
- Every status pill (Draft/Confirmed/Approved/Paid/Sent/Shipped/Cancelled/etc.) collapses
  to ONE flat style: bg-gray-100 text-gray-800 (optionally border-gray-200) — zero
  per-status color variation.
- Watch for MULTIPLE parallel status-map functions in the same file (e.g. getStatusColor
  AND getApprovalStatusBadge, or a List page's getStatusBadge differing slightly from a
  Details page's getStatusColor) — flatten every one of them, at every call site.

TOGGLE SWITCHES (Active/Inactive sliders)
- "On" state = brand orange (bg-brand). "Off" state = gray (bg-gray-300).
- Common bug: on-state hardcoded to bg-red-500 — fix to bg-brand.

TABS (shadcn Tabs/TabsList/TabsTrigger)
- The shared src/components/ui/tabs.tsx TabsList primitive has ZERO active-state styling
  built in — every TabsTrigger needs:
  className="data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:text-brand"
- TabsList's base class also bakes in `justify-center`. If a page's TabsList uses a
  `flex flex-wrap` layout (not `grid`), the tabs will visually CENTER unless you
  explicitly append `justify-start` to the className.
- Any bespoke/boxed tab design (fixed pixel widths per tab, forced gray background,
  custom <style> blocks with raw CSS selectors) should be simplified down to the same
  plain underline pattern above — drop the custom styling entirely for consistency.

DETAILS-PAGE LAYOUT
- Must be full-width. Remove any `max-w-7xl mx-auto` (or similar `max-w-*`) constraint
  on the outer wrapper — match Add/Edit/List pages' plain `p-6 space-y-6` / `w-full
  space-y-6` wrapper.

RADIO BUTTONS (MUI, e.g. TDS/TCS pickers)
- Recurring bug: sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
  renders MUI's default BLUE, not brand orange (this app has no custom MUI theme, so
  'primary.main' really is MUI blue). Fix: replace 'primary.main' with
  'var(--color-primary)' in BOTH the base color and the '&.Mui-checked' entry.
- If a Radio has NO sx at all: the checked state is already forced to brand orange via a
  global theme.css rule (.MuiRadio-root.Mui-checked), so it's not strictly broken — but
  add the explicit sx anyway for robustness/consistency with the rest of the app.

LOADING SPINNERS (MUI CircularProgress)
- No color/sx prop = MUI default blue. Add sx={{ color: '#DA7756' }} explicitly.
- Exception: a spinner using color="error" (red) in a genuinely different semantic
  context (e.g. a specific customer-detail-loading indicator) may be intentional —
  flag it rather than silently converting.

TEXT COLOR ("all text orange" rule)
- Convert to brand orange: legacy hex #C72030, #a81a28, #A01020/#a01020,
  #A01926/#a01926, #bf213e, #7a0c0c, #1976d2, #1d4ed8, and text-blue-500/text-blue-600
  links or icons.
- Exception: text-red-600 used for a GENUINELY semantic negative-amount display
  (e.g. "-₹500" for a discount or withheld tax in the live app UI) should be left red —
  BUT check whether it's actually just decorative/arbitrary rather than meaningful
  (e.g. inside a PDF template's plain summary list where every other line is plain
  black) — in that case it should become plain black instead, not brand orange and not
  red. Use judgment: is this truly a "negative amount" signal the user relies on, or is
  it stray leftover styling?

PDF / PRINT TEMPLATES
- No colored status badges (green/blue/purple/amber per status) — flatten to ONE
  neutral style: backgroundColor #f3f4f6, color #1f2937, borderColor #e5e7eb.
- No blue customer-name text on Bill-To/Ship-To blocks (recurring text-blue-700 bug) —
  remove the color class entirely so it inherits plain black.
- No green "Amount Received"-style info boxes or diagonal "PAID" ribbon stamps inside
  the PDF — convert to neutral gray/black (NOT brand orange — orange is for the live
  app's interactive UI, black/gray is for anything that ends up in a printed/exported
  document).
- CRITICAL: check whether the PDF template has its OWN LOCAL COPY of a shared
  status-style helper function (several modules do, instead of importing from
  src/components/accounting/AccountingDocumentPdf.jsx) — fixing the shared file will
  NOT fix these silent duplicates. Grep for `getAccountingPdfStatusStyle` or
  `getPdfStatusStyle` definitions (not just call sites) in the target file itself.

GREEN/COLORED INFO BOXES IN THE LIVE APP UI (not PDF)
- Convert to brand orange, not black. The black-vs-orange distinction is specifically
  about PDF/print output vs. the live interactive page.

CSS SPECIFICITY TRAP TO WATCH FOR
- theme.css has typography overrides like
  `.text-2xl.font-semibold { color: var(--color-text) !important; }` — a COMPOUND
  two-class selector. This can silently defeat a single-class Tailwind `!important`
  utility (e.g. !text-white) on the same element, because among multiple !important
  rules, normal CSS specificity still decides the winner, and two classes beats one.
  Fix: don't fight specificity with more !important — remove one of the two colliding
  classes (e.g. swap the `font-semibold` utility class for an inline
  style={{ fontWeight: 600 }}) so the compound selector no longer matches at all.

WHILE YOU'RE IN THERE — LOOK FOR THESE RELATED BUGS TOO
- Edit pages sometimes fetch dropdown options (e.g. item search) from the WRONG API
  endpoint compared to their sibling Create page — always diff the fetch call against
  the Create page's equivalent (e.g. lock_account_items.json vs.
  lock_account_items/select_list.json?...&active=true).
- Edit pages sometimes have UI form sections (e.g. a Discount row) completely MISSING
  even though the calculation state/logic for it already exists — compare the full
  Summary/Pricing section structure against the Create page line-by-line, don't just
  spot-check colors.
- Count badges computing `.length` on what's actually a single object, not an array —
  always returns 0/undefined; use a simple ternary instead.
- Typos like `py-2P` (invalid, no-op Tailwind class) instead of `py-2` — harmless but
  should be cleaned up for consistency.
- Copy-pasted delete-confirmation dialog titles referencing the wrong module name.

CRITICAL: MUI vs shadcn `Button` — check before touching ANY Button
- This codebase imports a component literally named `Button` from TWO different
  places: MUI (`@mui/material`) and shadcn (`@/components/ui/button`). Which one a
  given file uses is NOT consistent across modules — e.g. Quotes/Sales Order/Invoice's
  Add/Edit pages import the REAL MUI Button, but Credit Note's Add/Edit pages import
  shadcn's Button instead (with the MUI one literally commented out in the import
  block: `// Button,`). List/Details pages across most modules use shadcn's Button.
- BEFORE copying any MUI-flavored JSX onto a Button in a target file (sx={{...}},
  variant="outlined"/"text"/"contained", startIcon={...}, color="inherit"), grep that
  file's imports to confirm which Button it actually uses:
    grep -n "import.*Button" file.tsx
  and check whether the @mui/material import block includes `Button,` live (not
  commented out) vs. a separate `import { Button } from '@/components/ui/button'`.
- If it's shadcn's Button: use `variant="outline"` (no 'd'), `className="fm-button-fix
  px-8 py-2"` (+ `fm-button-brand` for solid/primary), and NEVER `sx`, `startIcon`, or
  `color="inherit"` — these are silently accepted as no-op/invalid props (TypeScript in
  this project does not flag them — see below) and will NOT produce the visual result
  you expect. Icons go inside the children as a manual `<span className="flex
  items-center gap-2"><Icon /> Label</span>`, not via `startIcon`.
- If it's the real MUI Button: `sx`, `variant="outlined"/"text"/"contained"`,
  `startIcon`, and `color="inherit"` all work as normal MUI props.
- Other MUI components (TextField, Select, FormControl, Radio, CircularProgress,
  Divider, Dialog, etc.) are unaffected by this — they're always the real MUI versions
  in every file observed so far, regardless of which Button is imported. Only `Button`
  itself is ambiguous.

CRITICAL: the correct `tsc` command for this repo
- Running `npx tsc --noEmit -p .` against the ROOT `tsconfig.json` is a SILENT NO-OP —
  that file is a project-references "solution" (`"files": []` + `"references": [...]`)
  and plain `tsc` does not build/check referenced projects without `--build`. It will
  always print zero errors regardless of what's actually wrong in your code. Do NOT
  trust a clean result from this command.
- The real command that actually type-checks `src/` is:
    npx tsc --noEmit -p tsconfig.app.json
- Before relying on "no errors" as your verification signal, first run this against
  the unmodified repo to see the pre-existing baseline (a handful of syntax errors in
  known dead/backup files like `*Backup.tsx`, `*Old.tsx` are expected and NOT yours to
  fix) — then diff your result against that baseline rather than expecting literal zero.

VERIFICATION (do this for every file you touch)
1. Grep the file afterward for any of the legacy patterns you were supposed to remove,
   to confirm nothing was missed.
2. Run `npx tsc --noEmit -p tsconfig.app.json` from the repo root (NOT `-p .`, see
   above) and filter output for the filenames you touched, to confirm no new type
   errors were introduced beyond the pre-existing backup-file baseline.
3. Explicitly double-check you did NOT accidentally recolor any genuine destructive
   Delete/Trash button to orange, and did NOT touch any confirmed-semantic exception.
4. Double-check every Button element you touched against the MUI-vs-shadcn rule above.
5. Report a concise per-file summary of every change made, and flag anything you found
   ambiguous rather than silently guessing.
```
