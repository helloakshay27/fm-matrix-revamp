import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface DayBookRow {
  id: string;
  date: string;
  account: string;
  transactionDetails: string;
  transactionType: string;
  transactionNo: string;
  referenceNo: string;
  debit: number | null;
  credit: number | null;
  amount: number;
  amountType: "Dr" | "Cr";
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true },
  { key: "account", label: "ACCOUNT", sortable: true },
  { key: "transactionDetails", label: "TRANSACTION DETAILS", sortable: true },
  { key: "transactionType", label: "TRANSACTION TYPE", sortable: true },
  { key: "transactionNo", label: "TRANSACTION#", sortable: true },
  { key: "referenceNo", label: "REFERENCE#", sortable: true },
  { key: "debit", label: "DEBIT", sortable: true },
  { key: "credit", label: "CREDIT", sortable: true },
  { key: "amount", label: "AMOUNT", sortable: true },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const formatDisplayDate = (value: string) => {
  if (!value) return "";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const today = new Date();
const todayStr = new Intl.DateTimeFormat("en-GB").format(today);

const initialRows: DayBookRow[] = [
  {
    id: "1",
    date: todayStr,
    account: "Undeposited Funds",
    transactionDetails: "Goods cost",
    transactionType: "Expense",
    transactionNo: "",
    referenceNo: "",
    debit: null,
    credit: 100,
    amount: 100,
    amountType: "Cr",
  },
  {
    id: "2",
    date: todayStr,
    account: "Goods cost",
    transactionDetails: "Undeposited Funds",
    transactionType: "Expense",
    transactionNo: "",
    referenceNo: "",
    debit: 100,
    credit: null,
    amount: 100,
    amountType: "Dr",
  },
];

const DayBook: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows] = useState<DayBookRow[]>(initialRows);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    // In production: fetch filtered data from API
  };

  const renderRow = (row: DayBookRow) => ({
    date: (
      <span className="text-[13px] font-medium text-[#101828]">{row.date}</span>
    ),
    account: (
      <span className="text-[13px] font-medium text-[#101828]">
        {row.account}
      </span>
    ),
    transactionDetails: (
      <span className="text-[13px] font-medium text-[#101828]">
        {row.transactionDetails}
      </span>
    ),
    transactionType: (
      <span className="text-[13px] font-medium text-[#101828]">
        {row.transactionType}
      </span>
    ),
    transactionNo: (
      <span className="text-[13px] text-[#667085]">{row.transactionNo || "—"}</span>
    ),
    referenceNo: (
      <span className="text-[13px] text-[#667085]">{row.referenceNo || "—"}</span>
    ),
    debit: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {row.debit !== null ? formatCurrency(row.debit) : ""}
      </span>
    ),
    credit: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {row.credit !== null ? formatCurrency(row.credit) : ""}
      </span>
    ),
    amount: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {row.amount !== null
          ? `${formatCurrency(row.amount)} ${row.amountType}`
          : ""}
      </span>
    ),
  });

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Filter Card */}
      <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827]">Day Book</h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
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
            onClick={handleView}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      {/* Report Card */}
      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <p className="text-sm text-[#667085]">Lockated</p>
          <h1 className="text-3xl font-semibold text-[#111827]">Day Book</h1>
          <p className="mt-1 text-sm text-[#667085]">
            <span className="font-medium text-[#344054]">Basis</span> : Accrual
          </p>
          <p className="mt-0.5 text-sm text-[#667085]">
            Report Date: {todayStr}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="day-book-report"
            hideTableSearch
            hideTableExport
            hideColumnsButton
            toolbarClassName="hidden"
            emptyMessage="There are no transactions during the selected date range."
            tableWrapperClassName="min-h-[520px] border border-[#EAECF0]"
            headerCellClassName="text-[11px] font-semibold uppercase text-[#667085]"
          />
        </div>
      </div>
    </div>
  );
};

export default DayBook;
