import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppSelector } from "@/store/hooks";

interface ProfitabilityRow {
  id: string;
  /** Optional ISO date for filtering when wired to API */
  entryDate?: string;
  project: string;
  loggedHours: string;
  billingAmountFcy: string;
  totalCost: string;
  profit: string;
}

const columns: ColumnConfig[] = [
  {
    key: "project",
    label: "PROJECT",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "loggedHours",
    label: "LOGGED HOURS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "billingAmountFcy",
    label: "BILLING AMOUNT (FCY)",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "totalCost",
    label: "TOTAL COST",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "profit",
    label: "PROFIT",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

/** Replace with API response; empty array shows the reference empty state. */
const MOCK_ROWS: ProfitabilityRow[] = [];

const TimesheetProfitabilitySummary: React.FC = () => {
  const selectedCompany = useAppSelector((s) => s.project.selectedCompany);
  const companyLabel = selectedCompany?.name ?? "Company";

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
      if (!row.entryDate) return true;
      const t = new Date(row.entryDate).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });
  }, [applied.fromDate, applied.toDate]);

  const renderRow = (row: ProfitabilityRow) => ({
    project: (
      <span className="block text-left text-[13px] font-medium text-[#111827]">
        {row.project}
      </span>
    ),
    loggedHours: (
      <span className="block text-center text-[13px] tabular-nums text-[#111827]">
        {row.loggedHours}
      </span>
    ),
    billingAmountFcy: (
      <span className="block text-center text-[13px] tabular-nums text-[#111827]">
        {row.billingAmountFcy}
      </span>
    ),
    totalCost: (
      <span className="block text-center text-[13px] tabular-nums text-[#111827]">
        {row.totalCost}
      </span>
    ),
    profit: (
      <span className="block text-right text-[13px] tabular-nums text-[#111827]">
        {row.profit}
      </span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <PieChart className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Timesheet Profitability Summary
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
          <p className="text-sm font-medium text-[#667085]">{companyLabel}</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Timesheet Profitability Summary
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
            storageKey="timesheet-profitability-summary-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="No data to display"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-6 py-4 border-b border-[#EAECF0] hover:bg-transparent align-top"
          />
        </div>

        <div className="border-t border-[#EAECF0] px-6 py-6 text-left">
          <p className="text-sm font-semibold text-[#101828]">*Notes:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#475467]">
            <li>
              Billing amount will be computed based on the time entry and not
              the invoice for the time entry. Billing amount will be zero for
              time entries from fixed cost projects
            </li>
            <li>
              Time entries shown in this report are displayed based on the
              round-off format configured in Settings.
            </li>
          </ul>
          <p className="mt-6 text-sm text-[#475467]">
            Amount is displayed in your base currency{" "}
            <span className="ml-1 inline-block rounded bg-[#28a745] px-2 py-0.5 text-xs font-semibold text-white">
              INR
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimesheetProfitabilitySummary;
