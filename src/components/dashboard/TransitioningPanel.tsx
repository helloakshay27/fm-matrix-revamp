import {
  StatHeroCard,
  ProgressListCard,
  GaugeChartCard,
  DataTableCard,
  TableBadge,
  PieChartCard,
  BarChartCard,
  StatListCard,
  HighlightStatCard,
  type DataTableColumn,
} from "@/components/charts";
import { VEDA_COLORS, VEDA_PIE_PROPS } from "@/styles/vedaTheme";
import { gridItem, ModuleSection, useSectionScroll } from "@/components/dashboard/moduleGrid";

const { purple, blue, growth, warning, danger, olive } = VEDA_COLORS;

interface UnitRow {
  flat: string;
  tower: string;
  snags: string;
  cleaning: string;
  keys: string;
  docs: string;
  signoff: string;
  certificate: string;
  status: string;
}

const UNIT_COLUMNS: DataTableColumn<UnitRow>[] = [
  { key: "flat", header: "Flat", render: (r) => <span className="font-semibold text-brand-text">{r.flat}</span> },
  { key: "tower", header: "Tower", render: (r) => r.tower },
  { key: "snags", header: "Snags Cleared", render: (r) => <TableBadge tone="green">{r.snags}</TableBadge> },
  { key: "cleaning", header: "Cleaning", render: (r) => <TableBadge tone={r.cleaning === "Done" ? "green" : r.cleaning === "In progress" ? "amber" : "grey"}>{r.cleaning}</TableBadge> },
  { key: "keys", header: "Keys Issued", render: (r) => <TableBadge tone={r.keys === "Pending" ? "amber" : "grey"}>{r.keys}</TableBadge> },
  { key: "docs", header: "Docs Ready", render: (r) => <TableBadge tone={r.docs === "Not ready" ? "amber" : "grey"}>{r.docs}</TableBadge> },
  { key: "signoff", header: "Customer Sign-off", render: (r) => <TableBadge tone="grey">{r.signoff}</TableBadge> },
  { key: "certificate", header: "HOTO Certificate", render: (r) => <TableBadge tone="grey">{r.certificate}</TableBadge> },
  { key: "status", header: "Status", render: (r) => <TableBadge tone={r.status === "Blocked" ? "amber" : "red"}>{r.status}</TableBadge> },
];

const UNIT_ROWS: UnitRow[] = [
  { flat: "A01-01", tower: "A", snags: "Cleared", cleaning: "Done", keys: "Pending", docs: "Not ready", signoff: "Not started", certificate: "Not started", status: "Blocked" },
  { flat: "A01-02", tower: "A", snags: "Cleared", cleaning: "In progress", keys: "Not started", docs: "Not started", signoff: "Not started", certificate: "Not started", status: "Blocked" },
  { flat: "B02-01", tower: "B", snags: "Pending", cleaning: "Not started", keys: "Not started", docs: "Not started", signoff: "Not started", certificate: "Not started", status: "Blocked" },
];

interface RequestRow {
  id: string;
  resident: string;
  tower: string;
  flat: string;
  type: string;
  requested: string;
  status: string;
  contractor: string;
  expiry: string;
  refund: string;
}

const REQUEST_COLUMNS: DataTableColumn<RequestRow>[] = [
  { key: "id", header: "ID", render: (r) => <span className="font-semibold text-brand-text">{r.id}</span> },
  { key: "resident", header: "Resident", render: (r) => r.resident },
  { key: "tower", header: "Tower", render: (r) => r.tower },
  { key: "flat", header: "Flat", render: (r) => r.flat },
  { key: "type", header: "Type", render: (r) => <TableBadge tone={r.type === "Move In" ? "blue" : "terra"}>{r.type}</TableBadge> },
  { key: "requested", header: "Requested", render: (r) => r.requested },
  { key: "status", header: "Status", render: (r) => <TableBadge tone="amber">{r.status}</TableBadge> },
  { key: "contractor", header: "Contractor", render: (r) => r.contractor },
  { key: "expiry", header: "Expiry", render: (r) => r.expiry },
  { key: "refund", header: "Deposit Refund", render: (r) => (r.refund === "—" ? "—" : <TableBadge tone="amber">{r.refund}</TableBadge>) },
];

const REQUEST_ROWS: RequestRow[] = [
  { id: "3019", resident: "Dinesh Chshinda", tower: "FM", flat: "Office", type: "Fitout", requested: "22 May 2026", status: "Pending", contractor: "AJ", expiry: "23 May 2026", refund: "Pending" },
  { id: "2963", resident: "Komal Shinde", tower: "FM", flat: "Offices", type: "Fitout", requested: "14 May 2026", status: "Pending", contractor: "—", expiry: "16 May 2026", refund: "—" },
  { id: "2941", resident: "Aarav Mehta", tower: "T1", flat: "402", type: "Move In", requested: "11 May 2026", status: "Pending", contractor: "—", expiry: "—", refund: "—" },
  { id: "2918", resident: "Priya Nair", tower: "T2", flat: "1108", type: "Fitout", requested: "08 May 2026", status: "Pending", contractor: "Sharma Contractors", expiry: "10 May 2026", refund: "Pending" },
  { id: "2902", resident: "Rohan Gupta", tower: "T3", flat: "705", type: "Fitout", requested: "04 May 2026", status: "Pending", contractor: "—", expiry: "06 May 2026", refund: "—" },
];

interface ViolationRow {
  ref: string;
  location: string;
  type: string;
  raisedBy: string;
  date: string;
  days: string;
  status: string;
}

const VIOLATION_COLUMNS: DataTableColumn<ViolationRow>[] = [
  { key: "ref", header: "Ref", render: (r) => <span className="font-semibold text-brand-text">{r.ref}</span> },
  { key: "location", header: "Location", render: (r) => r.location },
  { key: "type", header: "Violation Type", render: (r) => r.type },
  { key: "raisedBy", header: "Raised By", render: (r) => r.raisedBy },
  { key: "date", header: "Date", render: (r) => r.date },
  { key: "days", header: "Days Open", render: (r) => r.days },
  { key: "status", header: "Status", render: (r) => <TableBadge tone={r.status === "Resolved" ? "green" : r.status === "Under Review" ? "amber" : "red"}>{r.status}</TableBadge> },
];

const VIOLATION_ROWS: ViolationRow[] = [
  { ref: "VL-101", location: "Tower A · Level 3", type: "Structural modification without permit", raisedBy: "Site Engineer", date: "18 May 2026", days: "29d", status: "Open" },
  { ref: "VL-103", location: "Basement Parking", type: "Electrical work without PTW", raisedBy: "Security", date: "25 May 2026", days: "22d", status: "Open" },
  { ref: "VL-105", location: "Tower C · Level 7", type: "Core drilling without approval", raisedBy: "Site Incharge", date: "29 May 2026", days: "18d", status: "Open" },
  { ref: "VL-102", location: "B Wing · Ground", type: "Fire exit blockage during fitout", raisedBy: "Safety Officer", date: "22 May 2026", days: "25d", status: "Under Review" },
  { ref: "VL-104", location: "Lobby", type: "Debris disposal in common area", raisedBy: "Housekeeping", date: "28 May 2026", days: "19d", status: "Resolved" },
];

interface TransitioningPanelProps {
  activeSection: string;
  visibleKeys?: Set<string>;
}

export function TransitioningPanel({ activeSection, visibleKeys }: TransitioningPanelProps) {
  const registerRef = useSectionScroll(activeSection);

  const hotoItems = [
    gridItem("tr-hoto-ready", 0, 0, 3, 3, <StatHeroCard tone="purple" label="HOTO Ready" value="6" accent="success" subtitle="Units cleared for handover" className="h-full" />),
    gridItem("tr-hoto-scheduled", 3, 0, 3, 3, <StatHeroCard tone="teal" label="HOTO Scheduled" value="9" accent="info" subtitle="Date confirmed" className="h-full" />),
    gridItem("tr-hoto-completed", 6, 0, 3, 3, <StatHeroCard tone="peach" label="HOTO Completed" value="13" accent="green" subtitle="Vendor → FM done" className="h-full" />),
    gridItem("tr-hoto-docs", 9, 0, 3, 3, <StatHeroCard tone="blue" label="Docs Pending" value="12" accent="warning" subtitle="Certificate not issued" className="h-full" />),
    gridItem(
      "tr-hoto-progress",
      0,
      3,
      6,
      7,
      <ProgressListCard
        title="HOTO Progress"
        subtitle="Handover Take Over · All types"
        className="h-full overflow-auto"
        sections={[
          { heading: "Vendor → FM · on pace", rows: [{ label: "Completed", value: "65%", percent: 65, color: growth }] },
          { heading: "FM → User · behind pace", rows: [{ label: "Completed", value: "40%", percent: 40, color: danger }] },
        ]}
        footnote="13 of 20 vendor handovers done. 8 of 20 user handovers done."
      />
    ),
    gridItem(
      "tr-hoto-vendors",
      6,
      3,
      6,
      7,
      <StatListCard
        title="Pending Vendors"
        subtitle="Still blocking handover"
        className="h-full overflow-auto"
        rows={[
          { label: "Oizom Instruments Pvt. Ltd. — 22d", badge: { tone: "amber", label: "Pending" } },
          { label: "Reliance Digital — 8d", badge: { tone: "amber", label: "Pending" } },
          { label: "PowerTech Metering", badge: { tone: "red", label: "Bidding Open" } },
        ]}
      />
    ),
    gridItem(
      "tr-hoto-towers",
      0,
      10,
      6,
      6,
      <ProgressListCard
        title="Tower-wise HOTO progress"
        subtitle="4 towers · % complete"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "Tower A", value: "75%", percent: 75, color: growth },
              { label: "Tower B", value: "60%", percent: 60, color: growth },
              { label: "Tower C", value: "30%", percent: 30, color: warning },
              { label: "Tower D", value: "10%", percent: 10, color: danger },
            ],
          },
        ]}
        footnote="Tower D is far behind the other three — check for a vendor or blocker unique to that tower."
      />
    ),
    gridItem(
      "tr-hoto-gate",
      6,
      10,
      6,
      6,
      <GaugeChartCard
        title="HOTO Gate — Blocked vs Ready"
        subtitle="28 units total"
        segments={[
          { value: 6, color: growth },
          { value: 22, color: danger },
        ]}
        centerValue="21%"
        centerLabel="Ready"
        showInfoIcon
        insight="Most units are still blocked — pending docs or vendor sign-off is the usual gate, not a physical readiness issue."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "tr-hoto-units",
      0,
      16,
      12,
      7,
      <DataTableCard
        title="Unit HOTO status"
        subtitle="Illustrative structure — full table after DB connection"
        columns={UNIT_COLUMNS}
        data={UNIT_ROWS}
        getRowKey={(r) => r.flat}
        className="h-full overflow-auto"
      />
    ),
  ];

  const snagItems = [
    gridItem(
      "tr-snag-status",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="Snagging Status"
        subtitle="84 total"
        data={[
          { status: "Open", count: 38 },
          { status: "In Progress", count: 29 },
          { status: "Resolved", count: 17 },
        ]}
        categoryKey="status"
        series={[{ dataKey: "count", name: "Snags" }]}
        categoryColors={[danger, warning, growth]}
        insight="Open (38) is more than double Resolved (17) — the imbalance is the headline."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "tr-snag-type",
      7,
      0,
      5,
      6,
      <ProgressListCard
        title="By Check Type"
        subtitle="All statuses · 84 total"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "Permit Type", value: "54", percent: 65, color: danger },
              { label: "Survey Type", value: "30", percent: 36, color: warning },
            ],
          },
        ]}
      />
    ),
  ];

  const insightItems = [
    gridItem(
      "tr-design-insights",
      0,
      0,
      12,
      6,
      <ProgressListCard
        title="Design Insights"
        subtitle="Open observations by discipline"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "Civil Infra", value: "13", percent: 50, color: purple },
              { label: "Security", value: "8", percent: 25, color: danger },
              { label: "Landscape", value: "6", percent: 18, color: olive },
              { label: "Electrical", value: "5", percent: 10, color: warning },
            ],
          },
        ]}
      />
    ),
  ];

  const fitoutItems = [
    gridItem(
      "tr-fitout-hero",
      0,
      0,
      12,
      3,
      <HighlightStatCard
        title="Fitout requests"
        subtitle="24 Pending · 0 closed this month · 7 deviations open"
        value="38"
        valueCaption="requests"
        tone="warning"
        description="No fitout request has been closed this month. Requests are being raised, but approval and execution are stalling."
        className="h-full overflow-auto"
      />
    ),
    gridItem("tr-fitout-total", 0, 3, 3, 3, <StatHeroCard tone="purple" label="Total Requests" value="38" accent="neutral" subtitle="All types" className="h-full" />),
    gridItem("tr-fitout-pending", 3, 3, 3, 3, <StatHeroCard tone="peach" label="Pending" value="24" accent="error" subtitle="None closed this month" className="h-full" />),
    gridItem("tr-fitout-deviations", 6, 3, 3, 3, <StatHeroCard tone="blue" label="Open Deviations" value="7" accent="warning" subtitle="Need inspection" className="h-full" />),
    gridItem("tr-fitout-movein", 9, 3, 3, 3, <StatHeroCard tone="teal" label="Move In Requests" value="6" accent="info" subtitle="New occupants" className="h-full" />),
    gridItem(
      "tr-fitout-actions",
      0,
      6,
      12,
      4,
      <StatListCard
        title="What needs a decision"
        className="h-full overflow-auto"
        rows={[
          { label: "24 pending requests — 0 closed this month", badge: { tone: "red", label: "Action" } },
          { label: "7 open deviations — structural work needs inspection", badge: { tone: "amber", label: "High risk" } },
          { label: "6 Move In requests — new residents waiting", badge: { tone: "blue", label: "Monitor" } },
        ]}
      />
    ),
    gridItem(
      "tr-fitout-split",
      0,
      10,
      6,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Request type split — Fitout vs Move In"
        data={[
          { name: "Fitout", value: 32 },
          { name: "Move In", value: 6 },
        ]}
        centerLabel="38"
        insight="84% are Fitout renovations and 16% are Move In. Prioritise Move In — new residents feel the delay first."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "tr-fitout-deviation-types",
      6,
      10,
      6,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Deviation types — 7 open"
        data={[
          { name: "Structural", value: 3 },
          { name: "Electrical", value: 2 },
          { name: "Aesthetic", value: 2 },
        ]}
        centerLabel="7"
        insight="Structural deviations carry the highest risk. Issue stop-work until an engineer inspects."
        insightTone="warning"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "tr-fitout-requests",
      0,
      16,
      12,
      7,
      <DataTableCard
        title="Pending requests"
        subtitle="24 pending · latest shown · illustrative until live fitout records are connected"
        columns={REQUEST_COLUMNS}
        data={REQUEST_ROWS}
        getRowKey={(r) => r.id}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "tr-fitout-violations",
      0,
      23,
      12,
      7,
      <DataTableCard
        title="Violation Log"
        subtitle="Fitout rule violations"
        columns={VIOLATION_COLUMNS}
        data={VIOLATION_ROWS}
        getRowKey={(r) => r.ref}
        className="h-full overflow-auto"
      />
    ),
  ];

  return (
    <div className="space-y-6">
      <ModuleSection id="HOTO" storageKey="transitioningHotoGrid" moduleKey="transitioning" subTab="HOTO" items={hotoItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Snagging" storageKey="transitioningSnagGrid" moduleKey="transitioning" subTab="Snagging" items={snagItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Insights" storageKey="transitioningInsightsGrid" moduleKey="transitioning" subTab="Insights" items={insightItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Fitout" storageKey="transitioningFitoutGrid" moduleKey="transitioning" subTab="Fitout" items={fitoutItems} visibleKeys={visibleKeys} registerRef={registerRef} />
    </div>
  );
}
