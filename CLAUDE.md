# FM Matrix Revamp — Design System & Architecture Guide

> Living reference for structure, UI colors, components, and table patterns used across this project.
> Generated from a full-codebase analysis on 2026-07-21. Update this file whenever conventions change.

---

## 1. Tech Stack

| Layer | Library | Notes |
|---|---|---|
| Framework | React 18.3.1 + TypeScript 5.5.3 | — |
| Build tool | Vite 5.4.1 (`@vitejs/plugin-react-swc`) | package name `vite_react_shadcn_ts` — originated from a shadcn/Lovable scaffold |
| UI primitives | shadcn/ui (Radix-based) **and** MUI 7.2 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) | Both are used side by side — many pages mix shadcn `<Select>`/`<Table>` with MUI `<TextField>`/`<DatePicker>` |
| Styling | Tailwind CSS 3.4.11 + CSS variables (`src/styles/theme.css`) | `tailwindcss-animate`, `@tailwindcss/typography`; plus raw per-feature CSS files |
| State (legacy/primary) | Redux Toolkit 2.8.2 + react-redux 9.2 | `src/store/slices/*.ts` — 85 slices |
| State (newer) | Zustand 5.0.12 | `src/stores/*Store.ts` — used by `src/features/*` |
| Data fetching (newer) | TanStack React Query 5.56.2 | Used in `src/features/*` only |
| Data fetching (legacy) | Manual `fetch`/`axios` in page files or `src/services/*API.ts` | Dominant pattern across `src/pages/*` |
| Forms (newer) | react-hook-form 7.58 + `@hookform/resolvers` + Zod 4.0 | `src/schemas/*`, `src/features/*` |
| Forms (legacy) | Plain controlled `useState` per field | Dominant across `Add*Modal/Dialog/Page/Form.tsx` |
| Tables | Custom in-house `EnhancedTable` (no 3rd-party table lib) | Built on shadcn `Table` + `@dnd-kit` + `@tanstack/react-virtual` |
| Routing | react-router-dom 6.26.2 | Declared almost entirely inline in `src/App.tsx` (7000+ lines) |
| Icons | `lucide-react` (dominant, 1740+ files) + `@mui/icons-material` (88 files) | `react-icons` not used |
| Charts | `recharts` 2.15, `chart.js` 4.5 | Palette in `src/styles/chartPalette.ts` |
| Misc | `xlsx`, `jspdf`/`jspdf-autotable`/`html2pdf.js` (exports), `@dnd-kit/*`, `dhtmlx-gantt`, `@fullcalendar/*`, `react-big-calendar`, `leaflet`/`react-leaflet`, `face-api.js`/TF models, `framer-motion`/`gsap`, `sonner` (toasts), Electron packaging | App also ships as a desktop app via Electron |

---

## 2. Project Structure

```
src/
├── api/              Low-level API modules (axios client, inbox messages) — used by newer "features" code
├── assets/
├── components/
│   ├── ui/            shadcn-style primitives (button, dialog, table, badge, select, tabs, ...)
│   ├── enhanced-table/ Shared generic data-table system (EnhancedTable.tsx + helpers)
│   ├── common/         Newer shared set used by src/features/* (Modal, Spinner, ErrorState, ThemeToggle)
│   └── ...             ~650 custom, domain-specific components (modals, forms, dashboards, sidebars)
├── config/            apiConfig.ts (multi-tenant API config), queryClient.ts, navigationConfig.ts, companyLayouts.ts
├── contexts/          LayoutContext, PermissionsContext, ActionLayoutContext, SpeechContext, ...
├── data/
├── examples/          Reference/example components
├── features/          Newer "feature folder" modules (customers, settings, tickets, inbox, auth, superadmin) —
│                       uses react-query + react-hook-form + zod. Treat as the target pattern going forward.
├── hooks/             useEnhancedTable, useDynamicPermissions, useDebounce, useWebSocket, ...
├── lib/               utils.ts (shadcn `cn()` helper)
├── pages/             ~688 files — the bulk of the app, legacy/primary pattern, mostly flat file-per-page
│                       (some subfolders: ClubManagement/, BusinessCompass/, settings/, pulse/, vendor/, Accounting/)
├── providers/         EnhancedSelectProvider, etc.
├── redux/             A SECOND, older Redux setup (store.ts, createApiSlice.ts, login/loginSlice.ts) —
│                       predates/coexists with src/store/. Avoid adding new slices here.
├── routes/            Only performanceRoutes.tsx — most routing lives inline in App.tsx instead
├── schemas/           Zod schemas (buildingSchema.ts, wingSchema.ts) — sparse, used by newer code only
├── scripts/
├── services/          ~85+ API-service modules, one per domain (visitorAPI.ts, amcAnalyticsAPI.ts, ...)
├── store/             PRIMARY Redux Toolkit store — store.ts (configureStore) + slices/*.ts (85 files) + api/apiSlice.ts
├── stores/            Zustand stores (authStore.ts, notificationStore.ts, themeStore.ts)
├── styles/            theme.css (real design-token source), chartPalette.ts, datepicker.css, grid-layout.css, ...
├── types/
├── utils/             auth.ts, embeddedMode.ts, moduleDetection.ts, permissionHelpers.ts, statusUtils.ts
├── App.tsx            7000+ lines — contains almost the entire route tree
├── index.css          Tailwind entry + shadcn HSL CSS variables + global overrides
└── main.tsx
```

### Architectural note: two coexisting generations

This codebase has **two parallel architectures** living side by side:

1. **Legacy (dominant)** — Redux Toolkit (`src/store`, 85 slices) + a second, older `src/redux/store.ts`. Pages call REST APIs directly via `fetch`/axios inside the component or via `src/services/*API.ts`, with local `useState` for data/loading/pagination.
2. **Newer (cleaner, smaller footprint)** — Zustand (`src/stores/*`) + React Query + react-hook-form + zod, used in `src/features/*` (customers, settings, tickets, inbox, auth, superadmin, embedded).

**When building new functionality, prefer the `src/features/*` pattern** (Zustand + React Query + RHF + Zod) unless you are extending an existing legacy page, in which case stay consistent with that page's existing pattern.

### Multi-tenant layout switching

`src/components/Layout.tsx` swaps the entire Sidebar/Header component set based on `window.location.hostname` and `localStorage.userType` — there are ~15 tenant-specific sidebar/header pairs (Oman, Vi, Prime Support, Employee, Vendor, Pulse, Zycus, Club Management, Business Compass, Admin Compass, etc.).

### Redux slice convention deviation

`store/slices/*.ts` frequently export **multiple named reducers per file** rather than one default reducer (the standard RTK convention), e.g. `momSlice.ts` exports `createMoMReducer, updateMoMReducer, fetchMoMsReducer, fetchMoMDetailReducer`, each individually registered in `store/store.ts`'s `configureStore({ reducer: {...} })` map. Follow this existing convention when adding to an existing domain slice; don't silently "fix" it mid-feature.

### Housekeeping note

Stray backup/duplicate files exist untracked by any convention (e.g. `AddBannerModal.tsx.backup`, `TicketDashboardbackup.tsx`, `VisitorsDashboardBackup.tsx`). Don't treat these as canonical references.

---

## 3. UI Colors & Theming

**Source of truth: `src/styles/theme.css`** — header comment explicitly states *"LOCKATED BRAND THEME SYSTEM — Edit ONLY this file for color changes."* Do not hardcode new brand colors elsewhere.

### 3.1 Core tokens (`:root` in `theme.css`)

```css
/* Primary brand — coral/terracotta */
--color-primary: #da7756;
--color-primary-hover: rgba(218, 119, 86, 0.85);
--color-primary-light: rgba(218, 119, 86, 0.15);
--color-primary-selected: rgba(218, 119, 86, 0.08);

/* App surface */
--color-bg: #f6f4ee;           /* warm off-white background */
--color-text: #2c2c2c;
--color-text-light: #888780;

/* Secondary brand accents */
--color-secondary-green: #798c5e;   /* olive green */
--color-secondary-purple: #cecbf6;  /* lavender */
--color-secondary-teal: #9ec8ba;    /* mint/teal */

/* Semantic / status colors */
--color-info: #6b9bcc;
--color-success-solid: #798c5e;
--color-success-bg: rgba(121, 140, 94, 0.15);
--color-warning: #edc488;
--color-warning-light: #f8e4c7;
--color-error: #e7848e;
--color-error-bg: rgba(231, 132, 142, 0.15);
--color-danger: #e49191;
--color-growth-solid: #108c72;

/* Surfaces */
--color-card-border: #c4b89d;
--color-card-bg: #f6f4ee;
--color-card-white: #ffffff;
--color-border-subtle: #d5dbdb;
--color-sidebar: #c4b89d;
```

### 3.2 Typography scale (also token-based, in `theme.css`)

- `--font-size-h1: 26px`, `--font-size-h2: 24px`
- Body scale: `body-1: 20px`, `body-2: 18px`, `body-3: 16px`, `body-4: 14px`, `body-5: 12px`
- `--font-size-caption: 10px`
- Font family: `"Poppins", -apple-system, ...` (Work Sans/Inter also loaded via Google Fonts in `index.css`, used inconsistently)

### 3.3 Tailwind mapping (`tailwind.config.ts`)

All CSS variables above are exposed as Tailwind utilities under a `brand-*` namespace:

```ts
'brand':          { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)', light: 'var(--color-primary-light)', selected: 'var(--color-primary-selected)' },
'brand-green':    { DEFAULT: 'var(--color-secondary-green)', ... },
'brand-purple':   { DEFAULT: 'var(--color-secondary-purple)', ... },
'brand-success':  { DEFAULT: 'var(--color-success-solid)', light: 'var(--color-success)', bg: 'var(--color-success-bg)' },
'brand-warning':  { DEFAULT: 'var(--color-warning)', ... },
'brand-error':    { DEFAULT: 'var(--color-error)', ... },
```

**Use `brand-*` Tailwind classes (`bg-brand`, `text-brand-error`, `border-brand-success`) for all new code** rather than hex literals — this keeps colors theme-swappable.

A separate legacy HSL mapping also exists in `src/index.css` (`:root` / `.dark` blocks) for shadcn's own primitive theming, e.g.:
```css
--primary: 17 64% 60%;  /* #DA7756 */
```
This is a parallel system feeding shadcn primitives (Button, Card, etc.) — keep both in sync if the brand color ever changes.

### 3.4 ⚠️ Known color debt — three competing "brand reds"

Do not introduce a fourth. When touching a component that hardcodes color, migrate it to `brand-*` tokens instead of adding a new hex value.

| Color | Where it's used | Status |
|---|---|---|
| `#C72030` | Hardcoded across hundreds of legacy pages as Tailwind arbitrary values (`bg-[#C72030]`, `text-[#C72030]`, `border-[#C72030]`) — e.g. `BroadcastDashboard.tsx`, `AssetDashboard.tsx` | Old brand red. Actively overridden at runtime (see below) — **do not copy this pattern into new code.** |
| `#BF213E` / `#F2EEE9` | Hardcoded inside `src/components/ui/button.tsx` itself for `default`/`destructive`/`outline`/`secondary` variants | A third, undocumented red/bg pair baked into the shared Button component. |
| `#DA7756` (`--color-primary`) | The current, correct brand color | **Use this (`bg-brand`, `text-brand`, etc.) going forward.** |

`theme.css` (from ~line 772, section "OVERRIDE LEGACY RED COLORS (#C72030)") contains hundreds of `!important` CSS attribute-selector overrides that force any element using `#C72030`/`#c72030` (class, inline style, or SVG fill/stroke) to render as `var(--color-primary)` instead — including targeted overrides for MUI (`MuiButton-containedPrimary`, `MuiCheckbox`, `MuiRadio`, `MuiSwitch`, `MuiTabs`), Radix/shadcn state attributes (`[data-state="checked"]`), and Recharts/SVG fills. **This override layer, not the component code, is the actual source of truth for final rendered color in most of the app** — a fragile pattern to be aware of when debugging color issues that "don't match the source."

### 3.5 Chart palette

Duplicated in `theme.css` (second `:root` block, ~line 1480) and in `src/styles/chartPalette.ts`:
```css
--chart-green-olive:   #798c5e;
--chart-purple:        #cecbf6;
--chart-teal:          #9ec8ba;
--chart-info:          #6b9bcc;
--chart-danger:        #e49191;
--chart-warning:       #edc488;
--chart-growth-solid:  #108c72;
```

### 3.6 Status badge colors (`src/components/ui/status-badge.tsx`)

| Status group | Background |
|---|---|
| pending / yellow / in-progress | `#F2EBC9` |
| rejected / red / closed / inactive / breakdown | `#F2C8C4` |
| accepted / green / open / active / in-use | `#C7EDDA` |

`StatusBadge` auto-normalizes a `status` string prop into one of 13 known variants; `size: "default" | "sm" | "lg"`.

---

## 4. Reusable Components

### 4.1 shadcn primitives — `src/components/ui/` (40 files)

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `comprehensive-date-picker`, `custom-text-field`, `date-picker-trigger`, `dialog`, `drawer`, `dropdown-menu`, `enhanced-select` (custom searchable select), `form`, `heading`, `hover-card`, `input`, `input-otp`, `label`, `material-date-picker` (MUI-wrapped), `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `responsive-date-picker`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `status-badge` (custom), `switch`, `table`, `tabs`, `textarea`, `toast`/`toaster`, `toggle`/`toggle-group`, `tooltip`.

Key prop shapes:

```ts
// Button — src/components/ui/button.tsx
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "icon"
size: "default" | "sm" | "lg" | "icon"
asChild?: boolean   // Radix Slot pattern
// Built with class-variance-authority (cva)

// Badge — src/components/ui/badge.tsx
variant: "default" | "secondary" | "destructive" | "outline"

// StatusBadge — src/components/ui/status-badge.tsx
status?: string     // auto-normalized (see §3.6)
size?: "default" | "sm" | "lg"
```

`Card` / `CardHeader` / `CardTitle` / `CardContent` / `CardFooter` follow standard shadcn composition.

> **Note:** shadcn's `Breadcrumb` primitive exists but is used in only 1 file across the whole app — pages do not use it in practice (see §6).

### 4.2 Custom domain components — `src/components/` (~650 files)

Organized by feature/domain, not by component type. Dominant naming pattern: `Add<Entity>Modal.tsx` / `Add<Entity>Form.tsx` / `Add<Entity>Dialog.tsx` (mirrored by `Edit<Entity>...`).

**Layout shell:**
- `Layout.tsx` — main app shell, swaps Sidebar/Header per tenant
- `Sidebar.tsx`, `Header.tsx`, `DynamicHeader.tsx`
- `AdminLayout.tsx` / `AdminSidebar.tsx`, `BackendLayout.tsx`
- ~15 tenant-specific pairs: `OmanSidebar`/`OmanDynamicHeader`, `ViSidebar`/`ViDynamicHeader`, `EmployeeSidebar`/`EmployeeDynamicHeader`, `VendorSidebar`/`VendorDynamicHeader`, `PulseSidebar`, `ZycusSidebar`, `ClubSidebar`, `PrimeSupportSidebar`, `BusinessCompassSidebar`, `AdminCompassSidebar`

**Data/table helpers:**
- `AssetDataTable.tsx` — domain-specific wrapper around `EnhancedTable`
- `*SelectionPanel.tsx` — bulk-action floating panels (`VisitorSelectionPanel`, `AssetSelectionPanel`, `ActionSelectionPanel`)
- `*FilterDialog.tsx` / `*FilterModal.tsx` — per-module filter UI

**Newer shared set — `src/components/common/`** (used by `src/features/*`): `Modal.tsx`, `Spinner.tsx`, `ErrorState.tsx`, `ThemeToggle.tsx` — smaller, cleaner, distinct from legacy `components/ui`.

---

## 5. Table Patterns

### 5.1 The standard: `EnhancedTable`

**Location:** `src/components/enhanced-table/EnhancedTable.tsx` (1500+ lines)
**Supporting hook:** `src/hooks/useEnhancedTable.ts` — manages column visibility/order/sort state, persisted to `localStorage` via a `storageKey`.

Built on: shadcn `Table` + `@dnd-kit` (draggable/sortable column headers via `SortableColumnHeader`) + `ColumnVisibilityMenu` + sticky/frozen columns (`stickyColumnUtils`) + in-file Excel/CSV export (`exportToExcel`).

**Every new data-table view should use `EnhancedTable`** rather than a bespoke `<table>` — it's the shared system for column config, search, pagination, export, and bulk actions.

#### `ColumnConfig` type

```ts
export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  draggable?: boolean;
  defaultVisible?: boolean;
  hideable?: boolean;
}
```

#### `EnhancedTable` props (key subset)

```ts
// Core
data: T[];
columns: ColumnConfig[];
renderCell?, renderRow?, renderActions?, onRowClick?, onSort?
storageKey?: string;          // persists column state to localStorage
className?, emptyMessage?

// Selection
selectable?, selectedItems?, onSelectAll?, onSelectItem?, getItemId?, selectAllLabel?

// Search
searchTerm?, onSearchChange?, searchPlaceholder?
enableSearch?, enableGlobalSearch?, onGlobalSearch?, disableClientSearch?

// Export
enableExport?, exportFileName?, onExport?, handleExport?, isExporting?

// Bulk actions
bulkActions?: BulkAction<T>[];
showBulkActions?: boolean;

// Pagination
pagination?, pageSize?, currentPage?, totalPages?, onPageChange?

// Loading
loading?, loadingMessage?

// Header action slots
leftActions?: ReactNode;
rightActions?: ReactNode;
onFilterClick?: () => void;
filterAdjacentActions?: ReactNode;

// Inline add-row editing
canAddRow?, onAddRow?, renderEditableCell?, newRowPlaceholder?, readonlyColumns?

// Row styling
rowClassName?, isRowDisabled?

// Expandable parent/child rows
collapsible?, getChildrenKey?, renderChildrenRows?

// Frozen/sticky columns
enableFreeze?, freezeColumnsCount?
```

#### Example usage — `src/pages/BroadcastDashboard.tsx`

```tsx
const columns: ColumnConfig[] = [
  { key: "sr_no", label: "Sr. No.", sortable: true, hideable: true, defaultVisible: true },
  { key: "notice_heading", label: "Title", sortable: true, hideable: true, defaultVisible: true },
  { key: "createdBy", label: "Created by", sortable: true, hideable: true, defaultVisible: true },
];

<EnhancedTable
  data={broadcasts}
  columns={columns}
  renderCell={renderCell}
  renderActions={renderActions}
  storageKey="broadcast-table"
  enableSearch={true}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search notices..."
  emptyMessage="No notices found"
  pagination={true}
  pageSize={10}
  onFilterClick={() => setIsFilterModalOpen(true)}
  leftActions={
    shouldShow("Broadcast", "create") ? (
      <Button className="bg-brand hover:bg-brand-hover text-white" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
    ) : null
  }
/>
```

> Note: the original source for this example hardcodes `bg-[#C72030]` — shown above using the recommended `brand-*` token instead. Prefer the token form in new code (see §3.4).

`src/pages/VisitorsDashboard.tsx` uses **multiple `EnhancedTable` instances**, one per tab (`unexpectedVisitorColumns`, `expectedVisitorColumns`, `visitorOutColumns`, `visitorHistoryColumns`), each with its own column set inside a `TabsContent`.

### 5.2 Other table-adjacent components

- `src/components/AssetDataTable.tsx` — domain wrapper around `EnhancedTable`
- `src/components/document/DocumentEnhancedTable.tsx` — a variant
- `src/components/ui/pagination.tsx` — shadcn `Pagination`/`PaginationContent`/`PaginationItem`/`PaginationPrevious`/`PaginationNext`, often rendered manually below a table **in addition to** `EnhancedTable`'s own built-in pager (a minor inconsistency to be aware of — check whether the page already renders a manual pager before enabling `pagination` again).

---

## 6. Page Structure Pattern

There is **no shared `<PageLayout>` wrapper component**. Each page is a self-contained top-level component rendered inside the router's `<Layout>` (sidebar + header) via `<Outlet>`. The common shape, observed across `VisitorsDashboard.tsx`, `AssetDashboard.tsx`, and `BroadcastDashboard.tsx`:

1. **Root wrapper** — `<div className="p-6 bg-gray-50 min-h-screen">` (or `p-4 sm:p-6`) directly in the page file.
2. **No standardized breadcrumb** — shadcn's `Breadcrumb` is barely used; most pages skip it or render ad-hoc "Home / Module / Page" text.
3. **Top-level `Tabs`** (shadcn/Radix) for major page sections:
   ```tsx
   <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
     <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
       <TabsTrigger value="visitor">...</TabsTrigger>
       <TabsTrigger value="analytics">...</TabsTrigger>
     </TabsList>
     <TabsContent value="visitor" className="pt-4 min-h-[400px]"> ... </TabsContent>
     <TabsContent value="analytics" className="mt-4"> ... </TabsContent>
   </Tabs>
   ```
4. **Header action row** — left-aligned "Add" buttons (often gated by `useDynamicPermissions().shouldShow(...)`), right-aligned filter/export/search controls — either passed into `EnhancedTable`'s `leftActions`/`rightActions`/`onFilterClick`, or rendered standalone above a table wrapper.
5. **Active-filter chip row** — conditionally rendered pills for each active filter with a remove (×) button, plus "Clear all" / "Edit filters" (see `AssetDashboard.tsx` ~lines 878-943).
6. **Data table** — `EnhancedTable` directly, or a domain-specific wrapper (e.g. `AssetDataTable`).
7. **Selection/bulk-action panel** — floating panel appears when rows are selected (`VisitorSelectionPanel`, `AssetSelectionPanel`, `ActionSelectionPanel`).
8. **Manual `Pagination`** — sometimes rendered separately below the table in addition to `EnhancedTable`'s built-in pager.
9. **Modals/dialogs** at the bottom of the JSX tree for create/edit/export flows, e.g. `<NewVisitorDialog isOpen={...} onClose={...} />`, `<VisitorFilterDialog .../>`, or ad-hoc:
   ```tsx
   <Dialog><DialogContent><DialogHeader><DialogTitle>Export Visitor History</DialogTitle></DialogHeader>...</DialogContent></Dialog>
   ```
10. **Data fetching** — done via local async functions at module scope in the page file, calling `getFullUrl`/`getAuthenticatedFetchOptions`/`getAuthHeader` from `src/config/apiConfig.ts`, with manual `useState` for `loading`/`data`/`page`/`filters` (legacy pattern). `src/features/*` pages use `useQuery`/`useMutation` instead.

---

## 7. Routing

- **Library:** React Router v6 (`BrowserRouter as Router`).
- **Location:** almost the entire route tree (1300+ `<Route>` entries) is declared inline inside one giant `<Routes>` block in `src/App.tsx`. `src/routes/performanceRoutes.tsx` is the only standalone route file and is not wired in the same way as the rest — treat `App.tsx` as the actual routing source of truth.
- **Code-splitting:** most pages are wrapped in `lazy(() => import("./pages/..."))`.
- **Nested/layout routes:** parent routes like
  ```tsx
  <Route path="/ops-console" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route path="master/location/account" element={<OpsAccountPage />} />
    ...
  </Route>
  ```
  wrap children rendered via `<Outlet>` inside `AdminLayout`/`BackendLayout`.
- **Module/prefix grouping** (flat URL-prefix based, not folder-nested):
  - `/vendor/*` — dashboard, po, grn, wo, invoice, supplier-details/:id, other-bills, permits
  - `/finance/*` — po, wo
  - `/vas/*` — todo, add-mom, osr, fnb, booking/setup
  - `/crm/*` — polls, lead
  - `/product/*` — qc, rhb, ptw, hrms, esg
  - `/maintenance/*` — schedule, sac-hsn
  - `/safety/*` — m-safe
  - `/settings/*`, `/master/*`, `/admin/*` — under the `/ops-console` layout route
  - Standalone: `/visitor/gatepass`, `/document/share/:id`, `/thepdf`, `/dailypdf`, `/sitemap`, `/ask-ai`, `/tickets`, `/contests`, `/scratchcards`, `/flipcard`, `/mobile/*`
- **Auth gating:** `<ProtectedRoute>` (`src/components/ProtectedRoute.tsx`) wraps auth-gated layout routes.
- **Catch-all:** `<Route path="*" element={<NotFound />} />`.

---

## 8. Forms

Two coexisting approaches — **prefer the modern approach for new forms.**

### 8.1 Modern (preferred) — `src/features/*`, `src/schemas/*`

`react-hook-form` + `@hookform/resolvers/zod` + Zod, schema colocated or in `src/schemas/*.ts`.

```ts
// src/schemas/buildingSchema.ts
export const buildingSchema = z.object({
  name: z.string().min(1, 'Building name is required').max(100, '...'),
  site_id: z.string().min(1, 'Site selection is required'),
  has_wing: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type BuildingFormData = z.infer<typeof buildingSchema>;
```

```ts
// src/features/customers/CustomersPage.tsx
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
```

(`useForm` appears in 58 files; `zodResolver` in 31; `yup` in only 13 — Zod is the dominant validation library where RHF is used.)

### 8.2 Legacy (dominant by file count) — `pages/Add*Page.tsx`, `components/Add*Modal.tsx`/`Add*Dialog.tsx`/`Add*Form.tsx`

Plain controlled components: one `useState` per field, manual validation, manual submit handlers calling Redux thunks/services directly. No RHF/Zod.

### 8.3 Dialogs vs. full pages

- **Quick-add / lightweight entities** → modal dialogs: `Add*Modal.tsx`, `Add*Dialog.tsx` (100+ files) — e.g. `AddCountryDialog`, `AddCurrencyModal`, `AddCommentModal`.
- **Larger, multi-step, heavily-configured entities** → dedicated full pages: `Add*Page.tsx`/`Add*Dashboard.tsx` — e.g. `AddAssetPage.tsx`, `AddAMCPage.tsx`, `AddPermitPage.tsx`, `AddSurveyPage.tsx`.

---

## 9. Icons

- **`lucide-react`** — the dominant icon library, imported in 1740+ files. Use this by default for any new icon need.
  - Example (`VisitorsDashboard.tsx`): `RefreshCw, Plus, Search, RotateCcw, Eye, Edit, Trash2, Filter, Flag`
- **`@mui/icons-material`** — secondary, used in 88 files, mostly alongside MUI form components (date pickers, text fields).
- `react-icons` is **not used** — don't introduce it.

---

## 10. Naming & File Conventions

| Concern | Convention |
|---|---|
| Components/pages | PascalCase filename matching exported component (`VisitorsDashboard.tsx`) |
| Create/edit modals & pages | `Add<Entity>Modal.tsx`, `Add<Entity>Dialog.tsx`, `Add<Entity>Page.tsx`, `Add<Entity>Form.tsx`, `Add<Entity>Dashboard.tsx`; mirrored as `Edit<Entity>...` |
| Pages folder | Mostly flat (688 files); domain subfolders only for large modules: `ClubManagement/`, `BusinessCompass/`, `settings/`, `pulse/`, `vendor/`, `Accounting/`, `PATMCeoDashboard/` |
| Redux slices | `src/store/slices/<domain>Slice.ts`, camelCase + `Slice` suffix; often exports multiple named reducers (see §2 architectural note) |
| Services | `src/services/<domain><Kind>API.ts` / `<domain>Service.ts` — one file per REST resource/domain (casing is inconsistent — match the existing sibling file in that domain) |
| Zustand stores | `src/stores/<domain>Store.ts` (`authStore`, `notificationStore`, `themeStore`) |
| CSS/theme files | kebab-case in `src/styles/`; the one authoritative token file is `theme.css` |
| Feature-folder modules | `src/features/<domain>/<Domain>Page.tsx` — the intended direction for future refactors |

**Housekeeping:** ignore/avoid stray `.backup` files and ad-hoc "Backup" suffixed components found in the tree (`AddBannerModal.tsx.backup`, `VisitorsDashboardBackup.tsx`, etc.) — they are not canonical references and should eventually be deleted.

---

## 11. Quick Reference Checklist (for new work)

When building a new page or feature, default to:

- [ ] Data: React Query (`useQuery`/`useMutation`) + Zustand if state is needed — unless extending an existing legacy page
- [ ] Forms: `react-hook-form` + `zodResolver` + a schema in `src/schemas/` or colocated
- [ ] Table: `EnhancedTable` from `src/components/enhanced-table/` with a `ColumnConfig[]` and a unique `storageKey`
- [ ] Colors: Tailwind `brand-*` classes (`bg-brand`, `text-brand-error`, etc.) — never introduce a new hex brand color
- [ ] Icons: `lucide-react`
- [ ] Buttons/badges/dialogs: shadcn primitives from `src/components/ui/`
- [ ] Routing: add the route inline in `src/App.tsx`, `lazy`-imported, grouped under the correct module URL prefix
- [ ] Permissions: gate create/edit actions with `useDynamicPermissions().shouldShow(...)`
