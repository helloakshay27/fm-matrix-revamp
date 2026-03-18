import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { NotepadText, ArrowLeft } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ARAgingRow {
  id: string;
  customerName: string;
  current: number;
  day1to15: number;
  day16to30: number;
  day31to45: number;
  dayAbove45: number;
  total: number;
  totalFCY: number;
}

interface DetailRow {
  id: string;
  date: string;
  dueDate: string;
  transactionNo: string;
  type: string;
  status: "Overdue" | "Open" | "Sent" | "Paid";
  customerName: string;
  age: string;
  amount: number;
  balanceDue: number;
  section: string;
}

interface DetailSection {
  label: string;
  rows: DetailRow[];
}

// ─── Summary data ─────────────────────────────────────────────────────────────

const sampleRows: ARAgingRow[] = [
  {
    id: "1",
    customerName: "Lockated",
    current: 86.19,
    day1to15: 3717.5,
    day16to30: 0,
    day31to45: 0,
    dayAbove45: 0,
    total: 3803.69,
    totalFCY: 3803.69,
  },
  {
    id: "2",
    customerName: "Orion Towers",
    current: 250.0,
    day1to15: 1200.0,
    day16to30: 540.5,
    day31to45: 0,
    dayAbove45: 0,
    total: 1990.5,
    totalFCY: 1990.5,
  },
  {
    id: "3",
    customerName: "Greenfield Estates",
    current: 0,
    day1to15: 175.75,
    day16to30: 410.0,
    day31to45: 625.0,
    dayAbove45: 225.0,
    total: 1435.75,
    totalFCY: 1435.75,
  },
  {
    id: "4",
    customerName: "Skyline Residency",
    current: 920.0,
    day1to15: 0,
    day16to30: 0,
    day31to45: 180.0,
    dayAbove45: 95.5,
    total: 1195.5,
    totalFCY: 1195.5,
  },
];

// ─── Detail data keyed by bucket ─────────────────────────────────────────────

const detailData: Record<string, DetailSection[]> = {
  current: [
    {
      label: "Current",
      rows: [
        {
          id: "1",
          date: "18/03/2026",
          dueDate: "18/03/2026",
          transactionNo: "INV-0394",
          type: "Invoice",
          status: "Sent",
          customerName: "Lockated",
          age: "",
          amount: 86.19,
          balanceDue: 86.19,
          section: "Current",
        },
      ],
    },
  ],
  "1-15": [
    {
      label: "1 - 15 Days",
      rows: [
        {
          id: "2",
          date: "09/03/2026",
          dueDate: "09/03/2026",
          transactionNo: "INV-0393",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "9 Days",
          amount: 525.0,
          balanceDue: 244.75,
          section: "1 - 15 Days",
        },
        {
          id: "3",
          date: "10/03/2026",
          dueDate: "10/03/2026",
          transactionNo: "INV-0395",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "8 Days",
          amount: 475.5,
          balanceDue: 475.5,
          section: "1 - 15 Days",
        },
        {
          id: "4",
          date: "10/03/2026",
          dueDate: "10/03/2026",
          transactionNo: "INV-0396",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "8 Days",
          amount: 315.0,
          balanceDue: 315.0,
          section: "1 - 15 Days",
        },
        {
          id: "5",
          date: "16/03/2026",
          dueDate: "16/03/2026",
          transactionNo: "INV-0397",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "2 Days",
          amount: 315.0,
          balanceDue: 315.0,
          section: "1 - 15 Days",
        },
        {
          id: "6",
          date: "16/03/2026",
          dueDate: "16/03/2026",
          transactionNo: "INV-0398",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "2 Days",
          amount: 1030.0,
          balanceDue: 1030.0,
          section: "1 - 15 Days",
        },
        {
          id: "7",
          date: "16/03/2026",
          dueDate: "16/03/2026",
          transactionNo: "INV-0399",
          type: "Invoice",
          status: "Overdue",
          customerName: "Lockated",
          age: "2 Days",
          amount: 1337.25,
          balanceDue: 1337.25,
          section: "1 - 15 Days",
        },
      ],
    },
  ],
  "16-30": [{ label: "16 - 30 Days", rows: [] }],
  "31-45": [{ label: "31 - 45 Days", rows: [] }],
  "45+": [{ label: "> 45 Days", rows: [] }],
  all: [],
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
};

const summaryColumns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "current", label: "Current", sortable: true, hideable: true, draggable: true },
  { key: "day1to15", label: "1-15 Days", sortable: true, hideable: true, draggable: true },
  { key: "day16to30", label: "16-30 Days", sortable: true, hideable: true, draggable: true },
  { key: "day31to45", label: "31-45 Days", sortable: true, hideable: true, draggable: true },
  { key: "dayAbove45", label: "> 45 Days", sortable: true, hideable: true, draggable: true },
  { key: "total", label: "Total", sortable: true, hideable: true, draggable: true },
  { key: "totalFCY", label: "Total (FCY)", sortable: true, hideable: true, draggable: true },
];

const detailColumns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "dueDate", label: "Due Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "age", label: "Age", sortable: true, hideable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, draggable: true },
  { key: "balanceDue", label: "Balance Due", sortable: true, hideable: true, draggable: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (value: number, withSymbol = true): string => {
  const formatted = Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return withSymbol ? `₹${formatted}` : formatted;
};

// ─── Component ───────────────────────────────────────────────────────────────

const ARAgingSummaryReport: React.FC = () => {
  const [groupBy, setGroupBy] = useState("none");
  const [showBy, setShowBy] = useState("outstanding_invoice_amount");
  const [agingIntervals, setAgingIntervals] = useState("4x15");
  const [summarySearchTerm, setSummarySearchTerm] = useState("");
  const [detailSearchTerm, setDetailSearchTerm] = useState("");

  // null = show summary; { bucket, customer } = show details inline
  const [detailView, setDetailView] = useState<{
    bucket: string;
    customer: string;
  } | null>(null);

  const totals = useMemo(
    () =>
      sampleRows.reduce(
        (acc, row) => ({
          current: acc.current + row.current,
          day1to15: acc.day1to15 + row.day1to15,
          day16to30: acc.day16to30 + row.day16to30,
          day31to45: acc.day31to45 + row.day31to45,
          dayAbove45: acc.dayAbove45 + row.dayAbove45,
          total: acc.total + row.total,
          totalFCY: acc.totalFCY + row.totalFCY,
        }),
        {
          current: 0,
          day1to15: 0,
          day16to30: 0,
          day31to45: 0,
          dayAbove45: 0,
          total: 0,
          totalFCY: 0,
        }
      ),
    []
  );

  const totalAmount = totals.total;

  const today = new Date().toLocaleDateString("en-GB");

  // ── Detail sections to render ──────────────────────────────────────────────
  const detailSections = useMemo((): DetailSection[] => {
    if (!detailView) return [];
    const { bucket } = detailView;
    if (bucket === "all") {
      // Show all buckets that have rows
      return Object.values(detailData).flat().filter((s) => s.rows.length > 0);
    }
    return detailData[bucket] ?? [];
  }, [detailView]);

  // Flatten all detail rows for enhanced table
  const allDetailRows = useMemo(() => {
    return detailSections.flatMap(section => 
      section.rows.map(row => ({ ...row, section: section.label }))
    );
  }, [detailSections]);

  const detailGrandTotals = useMemo(
    () =>
      detailSections.reduce(
        (acc, section) => {
          section.rows.forEach((r) => {
            acc.amount += r.amount;
            acc.balanceDue += r.balanceDue;
          });
          return acc;
        },
        { amount: 0, balanceDue: 0 }
      ),
    [detailSections]
  );

  const loading = false;

  const renderSummaryRow = (row: ARAgingRow) => {
    return {
      customerName: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("all", row.customerName)}
        >
          {row.customerName}
        </span>
      ),
      current: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("current", row.customerName)}
        >
          {formatCurrency(row.current)}
        </span>
      ),
      day1to15: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("1-15", row.customerName)}
        >
          {formatCurrency(row.day1to15)}
        </span>
      ),
      day16to30: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("16-30", row.customerName)}
        >
          {formatCurrency(row.day16to30)}
        </span>
      ),
      day31to45: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("31-45", row.customerName)}
        >
          {formatCurrency(row.day31to45)}
        </span>
      ),
      dayAbove45: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("45+", row.customerName)}
        >
          {formatCurrency(row.dayAbove45)}
        </span>
      ),
      total: (
        <span 
          className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => openDetail("all", row.customerName)}
        >
          {formatCurrency(row.total)}
        </span>
      ),
      totalFCY: (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(row.totalFCY, false)}
        </span>
      ),
    };
  };

  const renderDetailRow = (row: DetailRow) => ({
    date: (
      <span className="text-sm text-gray-600">
        {row.date}
      </span>
    ),
    dueDate: (
      <span className="text-sm text-gray-600">
        {row.dueDate}
      </span>
    ),
    transactionNo: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.transactionNo}
      </span>
    ),
    type: (
      <span className="text-sm text-gray-600">
        {row.type}
      </span>
    ),
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColorMap[row.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {row.status}
      </span>
    ),
    customerName: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.customerName}
      </span>
    ),
    age: (
      <span className="text-sm text-gray-600">
        {row.age || "--"}
      </span>
    ),
    amount: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.amount)}
      </span>
    ),
    balanceDue: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.balanceDue)}
      </span>
    ),
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openDetail = (bucket: string, customer: string) =>
    setDetailView({ bucket, customer });
  if (detailView) {
    return (
      <div
        className="w-full bg-[#f9f7f2] p-6"
        style={{ minHeight: "100vh", boxSizing: "border-box" }}
      >
        <div className="rounded-lg border bg-white overflow-hidden">
          {/* Page Header — matches other detail pages */}
          <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC] relative">
            <button
              onClick={() => setDetailView(null)}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-[#C72030] font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="text-sm font-medium text-[#667085]">Lockated</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
              AR Aging Details By Invoice Due Date
            </h1>
            <p className="mt-1 text-sm text-[#475467]">As of {today}</p>
          </div>

          {/* Enhanced Details Table */}
          <div className="p-4">
            <EnhancedTaskTable
              data={allDetailRows}
              columns={detailColumns}
              renderRow={renderDetailRow}
              storageKey="ar-aging-summary-detail-v2"
              hideTableExport={true}
              hideTableSearch={false}
              enableSearch={true}
              searchTerm={detailSearchTerm}
              onSearchChange={setDetailSearchTerm}
              loading={loading}
              emptyMessage="No records found."
            />

            {/* Section Totals */}
            {detailSections.map((section) => {
              const secTotals = section.rows.reduce(
                (a, r) => ({ amount: a.amount + r.amount, balanceDue: a.balanceDue + r.balanceDue }),
                { amount: 0, balanceDue: 0 }
              );
              return (
                <div key={section.label} className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span>{section.label}</span>
                    <div className="flex gap-6">
                      <span className="text-blue-600">
                        Amount: {formatCurrency(secTotals.amount)}
                      </span>
                      <span className="text-blue-600">
                        Balance Due: {formatCurrency(secTotals.balanceDue)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Grand Total */}
            {detailSections.length > 0 && (
              <div className="mt-2 rounded-md bg-[#E5E0D3] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
                <div className="flex justify-between items-center">
                  <span>Total</span>
                  <div className="flex gap-6">
                    <span className="text-blue-600">
                      Amount: {formatCurrency(detailGrandTotals.amount)}
                    </span>
                    <span className="text-blue-600">
                      Balance Due: {formatCurrency(detailGrandTotals.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Summary view ───────────────────────────────────────────────────
  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      {/* Filter Card */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            AR Aging Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <TextField
            select
            size="small"
            label="Group by"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value)}
            fullWidth
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Show by"
            value={showBy}
            onChange={(event) => setShowBy(event.target.value)}
            fullWidth
          >
            <MenuItem value="outstanding_invoice_amount">
              Outstanding Invoice Amount
            </MenuItem>
            <MenuItem value="invoice_amount">Invoice Amount</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Aging intervals"
            value={agingIntervals}
            onChange={(event) => setAgingIntervals(event.target.value)}
            fullWidth
          >
            <MenuItem value="4x15">4 x 15 Days</MenuItem>
            <MenuItem value="6x15">6 x 15 Days</MenuItem>
            <MenuItem value="3x30">3 x 30 Days</MenuItem>
          </TextField>

          <button
            type="button"
            className="h-10 px-4 rounded-md border border-gray-300 bg-white text-[#1A1A1A] text-sm font-medium hover:bg-gray-50"
          >
            Customize Report Columns
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-white p-6">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Lockated</p>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mt-1">
            AR Aging Summary By Invoice Due Date
          </h2>
          <p className="text-gray-600 text-sm mt-1">As of {today}</p>
        </div>

        {/* Enhanced Summary Table */}
        <div className="p-4">
          <EnhancedTaskTable
            data={sampleRows}
            columns={summaryColumns}
            renderRow={renderSummaryRow}
            storageKey="ar-aging-summary-report-v2"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            searchTerm={summarySearchTerm}
            onSearchChange={setSummarySearchTerm}
            loading={loading}
            emptyMessage="No data to display"
          />

          {/* Summary Totals */}
          <div className="mt-2 rounded-md bg-[#E5E0D3] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <div className="grid grid-cols-8 gap-4">
              <div className="text-[#1A1A1A]">Total</div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("current", "all")}
              >
                {formatCurrency(totals.current)}
              </div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("1-15", "all")}
              >
                {formatCurrency(totals.day1to15)}
              </div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("16-30", "all")}
              >
                {formatCurrency(totals.day16to30)}
              </div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("31-45", "all")}
              >
                {formatCurrency(totals.day31to45)}
              </div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("45+", "all")}
              >
                {formatCurrency(totals.dayAbove45)}
              </div>
              <div 
                className="text-right text-blue-600 cursor-pointer hover:underline"
                onClick={() => openDetail("all", "all")}
              >
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-right text-gray-900">
                {formatCurrency(totals.totalFCY, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARAgingSummaryReport;
