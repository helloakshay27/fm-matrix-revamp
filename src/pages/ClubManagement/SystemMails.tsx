import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SystemMailRow {
  id: string;
  /** ISO date string for sorting */
  date: string;
  subject: string;
  mailType: string;
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
    key: "subject",
    label: "SUBJECT",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "mailType",
    label: "MAIL TYPE",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const formatDisplayDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const MOCK_ROWS: SystemMailRow[] = [
  {
    id: "1",
    date: "2026-03-23T10:00:00.000Z",
    subject: "Payment of ₹1,337.25 is outstanding for INV-0399",
    mailType: "Payment Reminder",
  },
  {
    id: "2",
    date: "2026-03-22T14:30:00.000Z",
    subject: "Payment of ₹2,100.00 is outstanding for INV-0401",
    mailType: "Payment Reminder",
  },
  {
    id: "3",
    date: "2026-03-21T09:15:00.000Z",
    subject: "Invoice INV-0395 — due in 3 days",
    mailType: "Payment Reminder",
  },
  {
    id: "4",
    date: "2026-03-20T11:45:00.000Z",
    subject: "Your statement for March 2026 is available",
    mailType: "Statement",
  },
];

const SystemMails: React.FC = () => {
  const today = new Date();
  const defaultTo = today.toISOString().slice(0, 10);
  const defaultFrom = new Date(
    today.getTime() - 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 10);

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

  const renderRow = (row: SystemMailRow) => ({
    date: (
      <span className="text-[13px] text-[#111827]">{formatDisplayDate(row.date)}</span>
    ),
    subject: (
      <span className="text-[13px] text-[#111827]">{row.subject}</span>
    ),
    mailType: (
      <span className="text-[13px] text-[#111827]">{row.mailType}</span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            System Mails
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
            System Mails
          </h1>
          <p className="mt-2 text-sm text-[#475467]">
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
            storageKey="system-mails-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="No system mails in this date range"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-top"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemMails;
