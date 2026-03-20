import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type CustomerBalanceRow = {
  id: string;
  customerName: string;
  invoicedAmount: number;
  amountReceived: number;
  closingBalance: string;
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

const seedRows: CustomerBalanceRow[] = [
  {
    id: "1",
    customerName: "Lockated",
    invoicedAmount: 3666.19,
    amountReceived: 1017.75,
    closingBalance: "₹1,798.19 Dr",
  },
];

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "invoicedAmount", label: "Invoiced Amount", sortable: true, hideable: true, draggable: true },
  { key: "amountReceived", label: "Amount Received", sortable: true, hideable: true, draggable: true },
  { key: "closingBalance", label: "Closing Balance", sortable: true, hideable: true, draggable: true },
];

const CustomerBalanceSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows] = useState<CustomerBalanceRow[]>(seedRows);
  const [loading] = useState(false);

  const reportTotals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({
          invoicedAmount: acc.invoicedAmount + row.invoicedAmount,
          amountReceived: acc.amountReceived + row.amountReceived,
          closingBalance: row.closingBalance,
        }),
        {
          invoicedAmount: 0,
          amountReceived: 0,
          closingBalance: "₹0.00",
        }
      ),
    [reportRows]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const renderRow = (row: CustomerBalanceRow) => ({
    customerName: (
      <span className="text-sm font-medium text-blue-600">
        {row.customerName}
      </span>
    ),
    invoicedAmount: (
      <span className="text-sm font-medium text-gray-900">
        ₹{formatAmount(row.invoicedAmount)}
      </span>
    ),
    amountReceived: (
      <span className="text-sm font-medium text-gray-900">
        ₹{formatAmount(row.amountReceived)}
      </span>
    ),
    closingBalance: (
      <span className="text-sm font-medium text-gray-900">
        {row.closingBalance}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Customer Balance Summary
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
          >
            View
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Customer Balance Summary
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        {/* EnhancedTaskTable */}
        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="customer-balance-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
          />

          {/* Totals row */}
          {reportRows.length > 0 && (
            <div className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-[#1A1A1A]">Total</div>
                <div className="text-right text-gray-900">
                  ₹{formatAmount(reportTotals.invoicedAmount)}
                </div>
                <div className="text-right text-gray-900">
                  ₹{formatAmount(reportTotals.amountReceived)}
                </div>
                <div className="text-right text-gray-900">
                  {reportTotals.closingBalance}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBalanceSummaryReport;
