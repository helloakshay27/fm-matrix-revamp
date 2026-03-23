import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type VendorBalanceRow = {
  id: string;
  vendorName: string;
  billedAmount: number;
  amountPaid: number;
  closingBalanceAmount: number;
  closingBalanceType: "Dr" | "Cr";
};

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
  if (!value) {
    return "--/--/----";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatClosingBalance = (amount: number, type: "Dr" | "Cr") =>
  `₹${formatAmount(amount)} ${type}`;

const seedRows: VendorBalanceRow[] = [
  {
    id: "1",
    vendorName: "Gophygital",
    billedAmount: 32445,
    amountPaid: 32732.5,
    closingBalanceAmount: 987.5,
    closingBalanceType: "Dr",
  },
];

const columns: ColumnConfig[] = [
  { key: "vendorName", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "billedAmount", label: "BILLED AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amountPaid", label: "AMOUNT PAID", sortable: true, hideable: false, draggable: true },
  { key: "closingBalance", label: "CLOSING BALANCE", sortable: true, hideable: false, draggable: true },
];

const VendorBalanceSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [appliedFilters, setAppliedFilters] = useState(defaultRange);
  const [reportRows] = useState<VendorBalanceRow[]>(seedRows);
  const [loading] = useState(false);

  const totals = useMemo(() => {
    const summary = reportRows.reduce(
      (acc, row) => ({
        billedAmount: acc.billedAmount + row.billedAmount,
        amountPaid: acc.amountPaid + row.amountPaid,
        signedClosingBalance:
          acc.signedClosingBalance +
          (row.closingBalanceType === "Dr"
            ? row.closingBalanceAmount
            : -row.closingBalanceAmount),
      }),
      {
        billedAmount: 0,
        amountPaid: 0,
        signedClosingBalance: 0,
      }
    );

    return {
      billedAmount: summary.billedAmount,
      amountPaid: summary.amountPaid,
      closingBalanceAmount: Math.abs(summary.signedClosingBalance),
      closingBalanceType: (summary.signedClosingBalance >= 0 ? "Dr" : "Cr") as
        | "Dr"
        | "Cr",
    };
  }, [reportRows]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const renderRow = (row: VendorBalanceRow) => ({
    vendorName: (
      <span className="text-sm font-medium text-blue-600">
        {row.vendorName}
      </span>
    ),
    billedAmount: (
      <span className="text-sm font-medium text-gray-900">
        ₹{formatAmount(row.billedAmount)}
      </span>
    ),
    amountPaid: (
      <span className="text-sm font-medium text-gray-900">
        ₹{formatAmount(row.amountPaid)}
      </span>
    ),
    closingBalance: (
      <span className="text-sm font-medium text-gray-900">
        {formatClosingBalance(row.closingBalanceAmount, row.closingBalanceType)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            Vendor Balance Summary
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
            onClick={() => setAppliedFilters(filters)}
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Vendor Balance Summary
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(appliedFilters.fromDate)} To {formatDisplayDate(appliedFilters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="vendor-balance-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={false}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
            rightActions={
              <div className="text-sm font-medium text-[#475467]">
                Group By : None
              </div>
            }
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />

          {reportRows.length > 0 && (
            <div className="rounded-b-md border border-t-0 border-[#E5E7EB] bg-white px-6 py-4 text-sm font-semibold text-[#1A1A1A]">
              <div className="grid grid-cols-4 gap-4">
                <div>Total</div>
                <div className="text-right text-gray-900">
                  ₹{formatAmount(totals.billedAmount)}
                </div>
                <div className="text-right text-gray-900">
                  ₹{formatAmount(totals.amountPaid)}
                </div>
                <div className="text-right text-gray-900">
                  {formatClosingBalance(totals.closingBalanceAmount, totals.closingBalanceType)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorBalanceSummaryReport;
