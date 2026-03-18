import React from "react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ReceivableSummaryRow {
  id: string;
  customerName: string;
  date: string;
  transactionNo: string;
  referenceNo: string;
  status: "Overdue" | "Open" | "Sent";
  transactionType: "Invoice" | "Credit Note";
  totalBcy: number;
  totalFcy: number;
  balanceBcy: number;
  balanceFcy: number;
}

const rows: ReceivableSummaryRow[] = [
  {
    id: "1",
    customerName: "Lockated",
    date: "09/03/2026",
    transactionNo: "INV-0393",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 525.0,
    totalFcy: 525.0,
    balanceBcy: 244.75,
    balanceFcy: 244.75,
  },
  {
    id: "2",
    customerName: "Lockated",
    date: "09/03/2026",
    transactionNo: "CN-00002",
    referenceNo: "",
    status: "Open",
    transactionType: "Credit Note",
    totalBcy: -535.5,
    totalFcy: -535.5,
    balanceBcy: -535.5,
    balanceFcy: -535.5,
  },
  {
    id: "3",
    customerName: "Lockated",
    date: "10/03/2026",
    transactionNo: "INV-0395",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 475.5,
    totalFcy: 475.5,
    balanceBcy: 475.5,
    balanceFcy: 475.5,
  },
  {
    id: "4",
    customerName: "Lockated",
    date: "10/03/2026",
    transactionNo: "INV-0396",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 315.0,
    totalFcy: 315.0,
    balanceBcy: 315.0,
    balanceFcy: 315.0,
  },
  {
    id: "5",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0397",
    referenceNo: "223322",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 315.0,
    totalFcy: 315.0,
    balanceBcy: 315.0,
    balanceFcy: 315.0,
  },
  {
    id: "6",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0398",
    referenceNo: "44",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 1030.0,
    totalFcy: 1030.0,
    balanceBcy: 1030.0,
    balanceFcy: 1030.0,
  },
  {
    id: "7",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0399",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    totalBcy: 1337.25,
    totalFcy: 1337.25,
    balanceBcy: 1337.25,
    balanceFcy: 1337.25,
  },
  {
    id: "8",
    customerName: "Lockated",
    date: "18/03/2026",
    transactionNo: "INV-0394",
    referenceNo: "",
    status: "Sent",
    transactionType: "Invoice",
    totalBcy: 86.19,
    totalFcy: 86.19,
    balanceBcy: 86.19,
    balanceFcy: 86.19,
  },
];

const formatCurrency = (value: number): string => {
  const sign = value < 0 ? "-" : "";
  const formatted = Math.abs(Number(value || 0)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}₹${formatted}`;
};

const statusColorMap: Record<ReceivableSummaryRow["status"], string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Open: "bg-blue-100 text-blue-700",
  Sent: "bg-blue-100 text-blue-700",
};

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "referenceNo", label: "Reference#", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "transactionType", label: "Transaction Type", sortable: true, hideable: true, draggable: true },
  { key: "totalBcy", label: "Total (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "totalFcy", label: "Total (FCY)", sortable: true, hideable: true, draggable: true },
  { key: "balanceBcy", label: "Balance (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "balanceFcy", label: "Balance (FCY)", sortable: true, hideable: true, draggable: true },
];

const ReceivableSummaryReport: React.FC = () => {
  const totals = rows.reduce(
    (acc, item) => ({
      totalBcy: acc.totalBcy + item.totalBcy,
      totalFcy: acc.totalFcy + item.totalFcy,
      balanceBcy: acc.balanceBcy + item.balanceBcy,
      balanceFcy: acc.balanceFcy + item.balanceFcy,
    }),
    { totalBcy: 0, totalFcy: 0, balanceBcy: 0, balanceFcy: 0 }
  );

  const loading = false;

  const renderRow = (row: ReceivableSummaryRow) => ({
    customerName: (
      <span className="text-sm font-medium text-blue-600">
        {row.customerName}
      </span>
    ),
    date: (
      <span className="text-sm text-gray-600">
        {row.date}
      </span>
    ),
    transactionNo: (
      <span className="text-sm font-medium text-blue-600">
        {row.transactionNo}
      </span>
    ),
    referenceNo: (
      <span className="text-sm text-gray-600">
        {row.referenceNo || "--"}
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
    transactionType: (
      <span className="text-sm text-gray-600">
        {row.transactionType}
      </span>
    ),
    totalBcy: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.totalBcy)}
      </span>
    ),
    totalFcy: (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(row.totalFcy)}
      </span>
    ),
    balanceBcy: (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(row.balanceBcy)}
      </span>
    ),
    balanceFcy: (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(row.balanceFcy)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Receivable Summary
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From 01/03/2026 To 31/03/2026
          </p>
        </div>

        {/* EnhancedTaskTable */}
        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="receivable-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />

          {/* Totals row */}
          <div className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-6 text-[#1A1A1A]">Total</div>
              <div className="text-right text-blue-600">
                {formatCurrency(totals.totalBcy)}
              </div>
              <div className="text-right text-gray-900">
                {formatCurrency(totals.totalFcy)}
              </div>
              <div className="text-right text-gray-900">
                {formatCurrency(totals.balanceBcy)}
              </div>
              <div className="text-right text-gray-900">
                {formatCurrency(totals.balanceFcy)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivableSummaryReport;
