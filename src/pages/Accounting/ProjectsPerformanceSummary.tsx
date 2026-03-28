import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppSelector } from "@/store/hooks";

interface ProjectsPerformanceSummaryRow {
  id: string;
  /** Optional ISO date for filtering when wired to API */
  entryDate?: string;
  project: string;
  customerName: string;
  budgetedCost: string;
  actualCost: string;
  differenceInCost: string;
  budgetedRevenue: string;
  actualRevenue: string;
  differenceInRevenue: string;
  profitPercent: string;
  profitMarginPercent: string;
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
    key: "customerName",
    label: "CUSTOMER NAME",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "budgetedCost",
    label: "BUDGETED COST",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "actualCost",
    label: "ACTUAL COST",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "differenceInCost",
    label: "DIFFERENCE IN COST",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "budgetedRevenue",
    label: "BUDGETED REVENUE",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "actualRevenue",
    label: "ACTUAL REVENUE",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "differenceInRevenue",
    label: "DIFFERENCE IN REVENUE",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "profitPercent",
    label: "PROFIT (%)",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "profitMarginPercent",
    label: "PROFIT MARGIN (%)",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

/** Replace with API response; empty array shows the reference empty state. */
const MOCK_ROWS: ProjectsPerformanceSummaryRow[] = [];

const numCell = (value: string) => (
  <span className="block text-right text-[13px] tabular-nums text-[#111827]">
    {value}
  </span>
);

const ProjectsPerformanceSummary: React.FC = () => {
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

  const renderRow = (row: ProjectsPerformanceSummaryRow) => ({
    project: (
      <span className="block text-left text-[13px] font-medium text-[#111827]">
        {row.project}
      </span>
    ),
    customerName: (
      <span className="block text-left text-[13px] text-[#111827]">
        {row.customerName}
      </span>
    ),
    budgetedCost: numCell(row.budgetedCost),
    actualCost: numCell(row.actualCost),
    differenceInCost: numCell(row.differenceInCost),
    budgetedRevenue: numCell(row.budgetedRevenue),
    actualRevenue: numCell(row.actualRevenue),
    differenceInRevenue: numCell(row.differenceInRevenue),
    profitPercent: numCell(row.profitPercent),
    profitMarginPercent: numCell(row.profitMarginPercent),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Gauge className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Projects Performance Summary
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
            Projects Performance Summary
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
            storageKey="projects-performance-summary-v1"
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
      </div>
    </div>
  );
};

export default ProjectsPerformanceSummary;
