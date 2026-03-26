import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ExceptionReportRow {
  id: string;
  date: string;
  entry: string;
  entryHref?: string;
  description: string;
  reason: string;
  user: string;
}

const columns: ColumnConfig[] = [
  {
    key: "date",
    label: "DATE",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "entry",
    label: "ENTRY#",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "description",
    label: "DESCRIPTION",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "reason",
    label: "REASON",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "user",
    label: "USER",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time.replace(/(am|pm)/i, (m) => m.toUpperCase())}`;
};

const MOCK_ROWS: ExceptionReportRow[] = [
  {
    id: "1",
    date: "2026-03-24T14:31:00.000Z",
    entry: "INV-0397",
    entryHref: "#",
    description: "Invoice updated.",
    reason: "testing",
    user: "ajay.pihulkar",
  },
  {
    id: "2",
    date: "2026-03-23T10:15:00.000Z",
    entry: "INV-0395",
    entryHref: "#",
    description: "Invoice updated.",
    reason: "test",
    user: "ajay.pihulkar",
  },
  {
    id: "3",
    date: "2026-03-22T16:00:00.000Z",
    entry: "BILL-8821",
    entryHref: "#",
    description: "Bill voided.",
    reason: "duplicate entry",
    user: "system.admin",
  },
];

const ExceptionReport: React.FC = () => {
  const defaultFrom = "2026-03-01";
  const defaultTo = "2026-03-31";

  const [filters, setFilters] = useState({
    fromDate: defaultFrom,
    toDate: defaultTo,
  });
  const [applied, setApplied] = useState({
    fromDate: defaultFrom,
    toDate: defaultTo,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = useMemo(() => {
    const start = new Date(`${applied.fromDate}T00:00:00`);
    const end = new Date(`${applied.toDate}T23:59:59.999`);
    return MOCK_ROWS.filter((row) => {
      const t = new Date(row.date).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });
  }, [applied.fromDate, applied.toDate]);

  const renderRow = (row: ExceptionReportRow) => ({
    date: (
      <span className="text-[13px] text-[#111827] whitespace-nowrap">
        {formatDateTime(row.date)}
      </span>
    ),
    entry: (
      <button
        type="button"
        className="text-left text-[13px] font-medium text-[#2563eb] hover:underline"
        onClick={() => {
          if (row.entryHref && row.entryHref !== "#") {
            window.location.href = row.entryHref;
          }
        }}
      >
        {row.entry}
      </button>
    ),
    description: (
      <span className="text-[13px] text-[#111827]">{row.description}</span>
    ),
    reason: (
      <span className="text-[13px] text-[#111827]">{row.reason}</span>
    ),
    user: <span className="text-[13px] text-[#111827]">{row.user}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Exception Report
          </h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() =>
              setApplied({
                fromDate: filters.fromDate,
                toDate: filters.toDate,
              })
            }
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Exception Report
          </h1>
          <p className="mt-3 text-sm text-[#475467]">
            From{" "}
            {new Date(`${applied.fromDate}T00:00:00`).toLocaleDateString(
              "en-GB"
            )}{" "}
            To{" "}
            {new Date(`${applied.toDate}T00:00:00`).toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={filteredData}
            columns={columns}
            renderRow={renderRow}
            storageKey="exception-report-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="No exception entries in this date range"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-6 py-4 border-b border-[#EAECF0] hover:bg-transparent align-top"
          />
        </div>
      </div>
    </div>
  );
};

export default ExceptionReport;
