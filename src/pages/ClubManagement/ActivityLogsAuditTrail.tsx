import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ActivityLogRow {
  id: string;
  /** ISO timestamp for sorting */
  date: string;
  /** Primary link label (sort key for ACTIVITY DETAILS column) */
  activityDetails: string;
  activityLinkHref?: string;
  /** Secondary lines (vendor, customer, notes) */
  activityMeta: string[];
  /** Summary line (sort key for DESCRIPTION column) */
  description: string;
  actorLabel: string;
  auditTrailHref?: string;
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
    key: "activityDetails",
    label: "ACTIVITY DETAILS",
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

const MOCK_ROWS: ActivityLogRow[] = [
  {
    id: "1",
    date: "2024-03-25T12:06:00.000Z",
    activityDetails: "Payment Made, 23",
    activityLinkHref: "#",
    activityMeta: ["Vendor: Gophygital"],
    description: "Bill '65829' Updated",
    actorLabel: "ajay.pitcher",
    auditTrailHref: "#",
  },
  {
    id: "2",
    date: "2024-03-25T11:20:00.000Z",
    activityDetails: "65829",
    activityLinkHref: "#",
    activityMeta: ["test the vendor advance"],
    description: "Bill '65829' Updated",
    actorLabel: "System",
    auditTrailHref: "#",
  },
  {
    id: "3",
    date: "2024-03-24T15:45:00.000Z",
    activityDetails: "INV-3337",
    activityLinkHref: "#",
    activityMeta: ["Customer: Lookated"],
    description: "Invoice 'INV-3337' Updated",
    actorLabel: "ajay.pitcher",
    auditTrailHref: "#",
  },
];

const ActivityLogsAuditTrail: React.FC = () => {
  const defaultFrom = "2024-03-01";
  const defaultTo = "2024-03-31";

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

  const renderRow = (row: ActivityLogRow) => ({
    date: (
      <span className="text-[13px] text-[#111827] whitespace-nowrap">
        {formatDateTime(row.date)}
      </span>
    ),
    activityDetails: (
      <div className="flex flex-col gap-1 text-left">
        <button
          type="button"
          className="text-left text-[13px] font-medium text-[#2563eb] hover:underline"
          onClick={() => {
            if (row.activityLinkHref && row.activityLinkHref !== "#") {
              window.location.href = row.activityLinkHref;
            }
          }}
        >
          {row.activityDetails}
        </button>
        {row.activityMeta.map((line) => (
          <span
            key={line}
            className="text-[12px] leading-snug text-[#6B7280]"
          >
            {line}
          </span>
        ))}
      </div>
    ),
    description: (
      <div className="flex w-full items-start justify-between gap-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-[#111827]">{row.description}</p>
          <p className="mt-1 text-[12px] text-[#6B7280]">
            by {row.actorLabel}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-[13px] font-medium text-[#2563eb] hover:underline"
          onClick={() => {
            if (row.auditTrailHref && row.auditTrailHref !== "#") {
              window.location.href = row.auditTrailHref;
            }
          }}
        >
          View Audit Trail
        </button>
      </div>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Activity Logs &amp; Audit Trail
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
          <h1 className="text-2xl font-semibold text-[#101828]">
            Activity Logs &amp; Audit Trail
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
            storageKey="activity-logs-audit-trail-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="No activity logs in this date range"
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

export default ActivityLogsAuditTrail;
