import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface CustomerReviewRow {
  id: string;
  /** Optional ISO date for filtering when wired to API */
  recordedAt?: string;
  customerName: string;
  fiveStars: number;
  fourStars: number;
  lessThan4Stars: number;
  averageRating: string;
  totalRating: number;
}

const columns: ColumnConfig[] = [
  {
    key: "customerName",
    label: "CUSTOMER NAME",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "fiveStars",
    label: "5 STARS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "fourStars",
    label: "4 STARS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "lessThan4Stars",
    label: "LESS THAN 4 STARS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "averageRating",
    label: "AVERAGE RATING",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "totalRating",
    label: "TOTAL RATING",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

/** Replace with API response; empty array matches the reference empty state. */
const MOCK_ROWS: CustomerReviewRow[] = [];

const CustomerReviews: React.FC = () => {
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
      if (!row.recordedAt) return true;
      const t = new Date(row.recordedAt).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });
  }, [applied.fromDate, applied.toDate]);

  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => ({
        five: acc.five + row.fiveStars,
        four: acc.four + row.fourStars,
        less: acc.less + row.lessThan4Stars,
      }),
      { five: 0, four: 0, less: 0 }
    );
  }, [filteredData]);

  const renderRow = (row: CustomerReviewRow) => ({
    customerName: (
      <span className="text-[13px] font-medium text-[#111827]">
        {row.customerName}
      </span>
    ),
    fiveStars: (
      <span className="text-[13px] text-[#111827]">{row.fiveStars}</span>
    ),
    fourStars: (
      <span className="text-[13px] text-[#111827]">{row.fourStars}</span>
    ),
    lessThan4Stars: (
      <span className="text-[13px] text-[#111827]">{row.lessThan4Stars}</span>
    ),
    averageRating: (
      <span className="text-[13px] text-[#111827]">{row.averageRating}</span>
    ),
    totalRating: (
      <span className="text-[13px] text-[#111827]">{row.totalRating}</span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Star className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Customer Reviews
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
            Customer Reviews
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

        <div className="border-b border-[#EAECF0] px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#EAECF0] bg-[#FAFAFA] px-6 py-5 text-center">
              <p className="text-3xl font-semibold tabular-nums text-emerald-600">
                {summary.five}
              </p>
              <p className="mt-2 text-sm font-medium text-[#475467]">5 Stars</p>
            </div>
            <div className="rounded-lg border border-[#EAECF0] bg-[#FAFAFA] px-6 py-5 text-center">
              <p className="text-3xl font-semibold tabular-nums text-blue-600">
                {summary.four}
              </p>
              <p className="mt-2 text-sm font-medium text-[#475467]">4 Stars</p>
            </div>
            <div className="rounded-lg border border-[#EAECF0] bg-[#FAFAFA] px-6 py-5 text-center">
              <p className="text-3xl font-semibold tabular-nums text-orange-500">
                {summary.less}
              </p>
              <p className="mt-2 text-sm font-medium text-[#475467]">
                Less Than 4 Stars
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={filteredData}
            columns={columns}
            renderRow={renderRow}
            storageKey="customer-reviews-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="There are no activities recorded during this date range"
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

export default CustomerReviews;
