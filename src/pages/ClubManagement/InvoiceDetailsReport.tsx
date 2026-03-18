import React from "react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface InvoiceDetailRow {
  id: string;
  status: "Overdue" | "Sent";
  invoiceDate: string;
  dueDate: string;
  invoiceNo: string;
  orderNumber: string;
  customerName: string;
  total: number;
  balance: number;
}

const rows: InvoiceDetailRow[] = [
  {
    id: "1",
    status: "Overdue",
    invoiceDate: "09/03/2026",
    dueDate: "09/03/2026",
    invoiceNo: "INV-0393",
    orderNumber: "",
    customerName: "Lockated",
    total: 525.0,
    balance: 244.75,
  },
  {
    id: "2",
    status: "Overdue",
    invoiceDate: "10/03/2026",
    dueDate: "10/03/2026",
    invoiceNo: "INV-0395",
    orderNumber: "",
    customerName: "Lockated",
    total: 475.5,
    balance: 475.5,
  },
  {
    id: "3",
    status: "Overdue",
    invoiceDate: "10/03/2026",
    dueDate: "10/03/2026",
    invoiceNo: "INV-0396",
    orderNumber: "",
    customerName: "Lockated",
    total: 315.0,
    balance: 315.0,
  },
  {
    id: "4",
    status: "Overdue",
    invoiceDate: "16/03/2026",
    dueDate: "16/03/2026",
    invoiceNo: "INV-0397",
    orderNumber: "223322",
    customerName: "Lockated",
    total: 315.0,
    balance: 315.0,
  },
  {
    id: "5",
    status: "Overdue",
    invoiceDate: "16/03/2026",
    dueDate: "16/03/2026",
    invoiceNo: "INV-0398",
    orderNumber: "44",
    customerName: "Lockated",
    total: 1030.0,
    balance: 1030.0,
  },
  {
    id: "6",
    status: "Overdue",
    invoiceDate: "16/03/2026",
    dueDate: "16/03/2026",
    invoiceNo: "INV-0399",
    orderNumber: "",
    customerName: "Lockated",
    total: 1337.25,
    balance: 1337.25,
  },
  {
    id: "7",
    status: "Sent",
    invoiceDate: "18/03/2026",
    dueDate: "18/03/2026",
    invoiceNo: "INV-0394",
    orderNumber: "",
    customerName: "Lockated",
    total: 86.19,
    balance: 86.19,
  },
];

const statusColorMap: Record<InvoiceDetailRow["status"], string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
};

const columns: ColumnConfig[] = [
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "invoiceDate", label: "Invoice Date", sortable: true, hideable: true, draggable: true },
  { key: "dueDate", label: "Due Date", sortable: true, hideable: true, draggable: true },
  { key: "invoiceNo", label: "Invoice#", sortable: true, hideable: true, draggable: true },
  { key: "orderNumber", label: "Order Number", sortable: true, hideable: true, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "total", label: "Total", sortable: true, hideable: true, draggable: true },
  { key: "balance", label: "Balance", sortable: true, hideable: true, draggable: true },
];

const formatCurrency = (value: number): string => {
  const formatted = Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `₹${formatted}`;
};

const InvoiceDetailsReport: React.FC = () => {
  const totals = rows.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      balance: acc.balance + item.balance,
    }),
    { total: 0, balance: 0 }
  );

  const loading = false;

  const renderRow = (row: InvoiceDetailRow) => ({
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColorMap[row.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {row.status}
      </span>
    ),
    invoiceDate: (
      <span className="text-sm text-gray-600">
        {row.invoiceDate}
      </span>
    ),
    dueDate: (
      <span className="text-sm text-gray-600">
        {row.dueDate}
      </span>
    ),
    invoiceNo: (
      <span className="text-sm font-medium text-blue-600">
        {row.invoiceNo}
      </span>
    ),
    orderNumber: (
      <span className="text-sm text-gray-600">
        {row.orderNumber || "--"}
      </span>
    ),
    customerName: (
      <span className="text-sm font-medium text-blue-600">
        {row.customerName}
      </span>
    ),
    total: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.total)}
      </span>
    ),
    balance: (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(row.balance)}
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
            Invoice Details
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
            storageKey="invoice-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />

          {/* Totals row */}
          <div className="mt-2 flex justify-end rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <span>
              Total Amount: {" "}
              <span className="text-blue-600">
                {formatCurrency(totals.total)}
              </span>
              {" | "}
              Balance: {" "}
              <span className="text-gray-900">
                {formatCurrency(totals.balance)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsReport;
