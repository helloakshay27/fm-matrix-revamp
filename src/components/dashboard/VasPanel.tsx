import {
  StatHeroCard,
  PieChartCard,
  BarChartCard,
  StatListCard,
  ProgressListCard,
  DataTableCard,
  TableBadge,
  HighlightStatCard,
  type DataTableColumn,
} from "@/components/charts";
import { VEDA_COLORS, VEDA_PIE_PROPS } from "@/styles/vedaTheme";
import { gridItem, ModuleSection, useSectionScroll } from "@/components/dashboard/moduleGrid";

const { purple, blue, growth, warning, danger, olive, mint } = VEDA_COLORS;

interface OsrRow {
  id: string;
  schedule: string;
  category: string;
  sub: string;
  client: string;
  flat: string;
  status: string;
  payment: string;
}

const OSR_COLUMNS: DataTableColumn<OsrRow>[] = [
  { key: "id", header: "ID", render: (r) => <span className="font-semibold text-brand-text">{r.id}</span> },
  { key: "schedule", header: "Schedule", render: (r) => r.schedule },
  { key: "category", header: "Category", render: (r) => r.category },
  { key: "sub", header: "Sub Category", render: (r) => r.sub },
  { key: "client", header: "Client", render: (r) => r.client },
  { key: "flat", header: "Flat", render: (r) => r.flat },
  { key: "status", header: "Status", render: (r) => <TableBadge tone={r.status === "Work Pending" ? "amber" : "red"}>{r.status}</TableBadge> },
  { key: "payment", header: "Payment", render: (r) => <TableBadge tone="red">{r.payment}</TableBadge> },
];

const OSR_ROWS: OsrRow[] = [
  { id: "1244", schedule: "24/06/2025 17:00–18:00", category: "Mosquito Mesh", sub: "Residential Apt", client: "Godrej Living", flat: "FM - Office", status: "Work Pending", payment: "Payment Pending" },
  { id: "1243", schedule: "24/06/2025 10:00–13:00", category: "Invisible Grill", sub: "Residential Apt", client: "Godrej Living", flat: "FM - Office", status: "Payment Pending", payment: "Payment Pending" },
  { id: "1242", schedule: "23/06/2025 15:00–16:00", category: "Pest Control", sub: "4D Cockroach", client: "Godrej Living", flat: "FM - Office", status: "Payment Pending", payment: "Payment Pending" },
  { id: "1238", schedule: "06/03/2025 06:00–08:00", category: "Pest Control", sub: "Residential Apt", client: "Deepak Gupta", flat: "—", status: "Payment Pending", payment: "Payment Pending" },
  { id: "1236", schedule: "26/02/2025 10:00–12:00", category: "Bathroom Cleaning", sub: "Sofa Cleaning", client: "Godrej Living", flat: "FM - Office", status: "Payment Pending", payment: "Payment Pending" },
];

interface VasPanelProps {
  activeSection: string;
  visibleKeys?: Set<string>;
}

export function VasPanel({ activeSection, visibleKeys }: VasPanelProps) {
  const registerRef = useSectionScroll(activeSection);

  const fnbItems = [
    gridItem("vas-osr-kpi", 0, 0, 4, 3, <StatHeroCard tone="peach" label="OSR Pending" value="9" accent="error" subtitle="All pending · oldest Feb 2025 (15mo)" className="h-full" />),
    gridItem("vas-fnb-kpi", 4, 0, 4, 3, <StatHeroCard tone="purple" label="F&B Orders" value="190" accent="neutral" subtitle="3 restaurants · 42 pending" className="h-full" />),
    gridItem("vas-parking-kpi", 8, 0, 4, 3, <StatHeroCard tone="blue" label="Parking Utilisation" value="6%" accent="warning" subtitle="6 of 99 slots · 93 vacant" progress={6} className="h-full" />),
    gridItem(
      "vas-fnb-status",
      0,
      3,
      12,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="F&B Order Status"
        subtitle="190 orders · Confirmed / Accepted / Pending"
        data={[
          { name: "Confirmed", value: 96 },
          { name: "Accepted", value: 52 },
          { name: "Pending", value: 42 },
        ]}
        centerLabel="190"
        className="h-full overflow-auto"
      />
    ),
  ];

  const osrItems = [
    gridItem(
      "vas-osr-trend",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="OSR Backlog Trend"
        subtitle="Not a backlog — a complete collection failure"
        data={[
          { month: "Feb", pending: 2 },
          { month: "Mar", pending: 3 },
          { month: "Apr", pending: 5 },
          { month: "May", pending: 7 },
          { month: "Jun", pending: 9 },
        ]}
        categoryKey="month"
        series={[{ dataKey: "pending", name: "Pending" }]}
        seriesColors={[danger]}
        insight="100% of records are payment-pending. The oldest is 15 months old."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-osr-split",
      7,
      0,
      5,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Work Pending vs Payment Pending"
        subtitle="Two failures inside one 100% pending number"
        showInfoIcon
        data={[
          { name: "Work never done", value: 3 },
          { name: "Work done, unpaid", value: 6 },
        ]}
        centerLabel="9"
        insight="Operations and finance each own a different slice of this number."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-osr-table",
      0,
      6,
      12,
      7,
      <DataTableCard
        title="OSR Records"
        subtitle="Schedule · Amount · Payment · Flat · Category · Status"
        columns={OSR_COLUMNS}
        data={OSR_ROWS}
        getRowKey={(r) => r.id}
        className="h-full overflow-auto"
      />
    ),
  ];

  const parkingItems = [
    gridItem(
      "vas-parking-use",
      0,
      0,
      5,
      5,
      <ProgressListCard
        title="Parking Utilisation"
        subtitle="93 of 99 slots vacant"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "Occupied", value: "6", percent: 6, color: warning },
              { label: "Vacant", value: "93", percent: 94, color: growth },
            ],
          },
        ]}
      />
    ),
    gridItem(
      "vas-parking-free",
      5,
      0,
      7,
      5,
      <BarChartCard
        title="Free vs Paid allocation, by client"
        subtitle="Who is holding free space they may not need"
        data={[
          { client: "Client A", free: 22, paid: 4 },
          { client: "Client B", free: 14, paid: 8 },
          { client: "Client C", free: 18, paid: 1 },
          { client: "FM", free: 6, paid: 2 },
        ]}
        categoryKey="client"
        stacked
        series={[
          { dataKey: "free", name: "Free" },
          { dataKey: "paid", name: "Paid" },
        ]}
        seriesColors={[olive, purple]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-parking-bookings",
      0,
      5,
      12,
      3,
      <HighlightStatCard
        title="Site-wise Parking Bookings — never used"
        subtitle="76 tracked slots, wired to floors and employees"
        value="0"
        valueCaption="of 76 slots booked"
        tone="error"
        description="This is a feature that has never been used once. That is an adoption failure, not a missing configuration."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-parking-floors",
      0,
      8,
      6,
      6,
      <BarChartCard
        title="Floor-wise Occupancy"
        subtitle="This day vs last day"
        showInfoIcon
        data={[
          { floor: "B1 Upper", today: 82, yesterday: 64 },
          { floor: "B1 Lower", today: 41, yesterday: 44 },
          { floor: "B2", today: 18, yesterday: 22 },
          { floor: "Podium", today: 9, yesterday: 11 },
        ]}
        categoryKey="floor"
        orientation="horizontal"
        series={[
          { dataKey: "today", name: "Today" },
          { dataKey: "yesterday", name: "Yesterday" },
        ]}
        seriesColors={[purple, blue]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-parking-2w",
      6,
      8,
      6,
      6,
      <BarChartCard
        title="2W / 4W Occupancy Split"
        subtitle="Is capacity allocated to match demand?"
        showInfoIcon
        data={[
          { type: "2W occupied", count: 12 },
          { type: "2W vacant", count: 40 },
          { type: "4W occupied", count: 28 },
          { type: "4W vacant", count: 4 },
        ]}
        categoryKey="type"
        series={[{ dataKey: "count", name: "Slots" }]}
        categoryColors={[growth, mint, danger, warning]}
        insight="4W is near saturation while 2W has spare capacity."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-parking-peak",
      0,
      14,
      12,
      5,
      <BarChartCard
        title="Peak Hour Trends"
        subtitle="When during the day does parking peak?"
        data={[
          { hour: "7", n: 12 },
          { hour: "8", n: 40 },
          { hour: "9", n: 68 },
          { hour: "12", n: 22 },
          { hour: "17", n: 30 },
          { hour: "18", n: 61 },
          { hour: "19", n: 24 },
        ]}
        categoryKey="hour"
        series={[{ dataKey: "n", name: "Arrivals" }]}
        seriesColors={[blue]}
        insight="Two peaks — morning arrival and evening departure — with a long flat trough between."
        className="h-full overflow-auto"
      />
    ),
  ];

  const bookingItems = [
    gridItem(
      "vas-booking-charges",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="Facility Booking — real activity"
        subtitle="Conference Room, Client Meeting, Test facilities"
        data={[
          { facility: "Conference", bookings: 42 },
          { facility: "Client Mtg", bookings: 28 },
          { facility: "Training", bookings: 16 },
          { facility: "Test", bookings: 9 },
        ]}
        categoryKey="facility"
        series={[{ dataKey: "bookings", name: "Bookings" }]}
        categoryColors={[purple, blue, growth, warning]}
        insight="The live system has an active booking engine with charges. This replaces the old dummy Meeting Room card."
        insightTone="success"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-booking-status",
      7,
      0,
      5,
      6,
      <StatListCard
        title="Booking Status Breakdown"
        subtitle="Sample of 10"
        className="h-full overflow-auto"
        rows={[
          { label: "Pending", badge: { tone: "amber", label: "5 of 10" } },
          { label: "Confirmed", badge: { tone: "green", label: "4 of 10" } },
          { label: "Cancelled", badge: { tone: "red", label: "1 of 10" } },
        ]}
      />
    ),
  ];

  const spaceItems = [
    gridItem(
      "vas-seat-util",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="Seat utilisation by category"
        subtitle="Confirmed and occupied vs available"
        showInfoIcon
        data={[
          { cat: "Linear WS", pct: 72 },
          { cat: "Angular", pct: 48 },
          { cat: "Flexi", pct: 21 },
          { cat: "Circular", pct: 8 },
          { cat: "Cubical", pct: 55 },
        ]}
        categoryKey="cat"
        series={[{ dataKey: "pct", name: "Utilisation %" }]}
        insight="Seat Booking is in use — confirmed and occupied seats with real employee data."
        insightTone="success"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "vas-seat-reject",
      7,
      0,
      5,
      6,
      <HighlightStatCard
        title="Seat request rejection rate"
        subtitle="3 of 10 total requests rejected outright"
        value="30%"
        valueCaption="rejection rate"
        tone="warning"
        description="Ask why: a confusing request form, or a real capacity shortage. Those need different fixes."
        className="h-full overflow-auto"
      />
    ),
  ];

  const mailItems = [
    gridItem(
      "vas-mailroom",
      0,
      0,
      7,
      5,
      <StatListCard
        title="Mailroom"
        subtitle="Inbound and outbound · configured, no records yet"
        className="h-full overflow-auto"
        rows={[
          { label: "Inbound Packages", badge: { tone: "grey", label: "0" } },
          { label: "Outbound Packages", badge: { tone: "grey", label: "0" } },
          { label: "Pending Collection", badge: { tone: "grey", label: "0" } },
          { label: "Overdue (>48h)", badge: { tone: "grey", label: "0" } },
        ]}
      />
    ),
    gridItem(
      "vas-loyalty",
      7,
      0,
      5,
      5,
      <StatListCard
        title="Loyalty"
        subtitle="Points and tier"
        className="h-full overflow-auto"
        rows={[
          { label: "Tier", badge: { tone: "amber", label: "Silver" } },
          { label: "Points Available", value: "99,500 pts" },
          { label: "Points to Gold", badge: { tone: "amber", label: "500 remaining" } },
        ]}
      />
    ),
  ];

  return (
    <div className="space-y-6">
      <ModuleSection id="F&B" storageKey="vasFnbGrid" moduleKey="vas" subTab="F&B" items={fnbItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="OSR" storageKey="vasOsrGrid" moduleKey="vas" subTab="OSR" items={osrItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Parking" storageKey="vasParkingGrid" moduleKey="vas" subTab="Parking" items={parkingItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Booking" storageKey="vasBookingGrid" moduleKey="vas" subTab="Booking" items={bookingItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Space Management" storageKey="vasSpaceGrid" moduleKey="vas" subTab="Space Management" items={spaceItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Mailroom" storageKey="vasMailGrid" moduleKey="vas" subTab="Mailroom" items={mailItems} visibleKeys={visibleKeys} registerRef={registerRef} />
    </div>
  );
}
