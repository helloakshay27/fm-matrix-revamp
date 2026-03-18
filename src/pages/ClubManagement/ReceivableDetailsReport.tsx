import React from "react";
import { ChevronDown, SlidersHorizontal, SquareGanttChart } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ReceivableDetailsRow {
  id: string;
  customerName: string;
  date: string;
  transactionNo: string;
  referenceNo: string;
  status: "Overdue" | "Open" | "Sent";
  transactionType: "Invoice" | "Credit Note";
  itemName: string;
  quantityOrdered: number;
  itemPriceBcy: number;
  totalBcy: number;
}

const rows: ReceivableDetailsRow[] = [
  {
    id: "1",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0398",
    referenceNo: "44",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Air Drop",
    quantityOrdered: 1,
    itemPriceBcy: 1000,
    totalBcy: 1000,
  },
  {
    id: "2",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0399",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Air Drop",
    quantityOrdered: 1,
    itemPriceBcy: 1000,
    totalBcy: 1000,
  },
  {
    id: "3",
    customerName: "Lockated",
    date: "10/03/2026",
    transactionNo: "INV-0396",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Cement",
    quantityOrdered: 1,
    itemPriceBcy: 300,
    totalBcy: 300,
  },
  {
    id: "4",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0397",
    referenceNo: "223322",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Cement",
    quantityOrdered: 1,
    itemPriceBcy: 300,
    totalBcy: 300,
  },
  {
    id: "5",
    customerName: "Lockated",
    date: "16/03/2026",
    transactionNo: "INV-0399",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Cement",
    quantityOrdered: 1,
    itemPriceBcy: 300,
    totalBcy: 300,
  },
  {
    id: "6",
    customerName: "Lockated",
    date: "09/03/2026",
    transactionNo: "INV-0393",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Cement Kg",
    quantityOrdered: 1,
    itemPriceBcy: 500,
    totalBcy: 500,
  },
  {
    id: "7",
    customerName: "Lockated",
    date: "09/03/2026",
    transactionNo: "CN-00002",
    referenceNo: "",
    status: "Open",
    transactionType: "Credit Note",
    itemName: "Cement Kg",
    quantityOrdered: -1,
    itemPriceBcy: 500,
    totalBcy: -500,
  },
  {
    id: "8",
    customerName: "Lockated",
    date: "10/03/2026",
    transactionNo: "INV-0395",
    referenceNo: "",
    status: "Overdue",
    transactionType: "Invoice",
    itemName: "Cement Kg",
    quantityOrdered: 1,
    itemPriceBcy: 500,
    totalBcy: 490,
  },
  {
    id: "9",
    customerName: "Lockated",
    date: "18/03/2026",
    transactionNo: "INV-0394",
    referenceNo: "",
    status: "Sent",
    transactionType: "Invoice",
    itemName: "Purchase Invoice Test",
    quantityOrdered: 1,
    itemPriceBcy: 100,
    totalBcy: 90,
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

const statusColorMap: Record<ReceivableDetailsRow["status"], string> = {
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
  { key: "itemName", label: "Item Name", sortable: true, hideable: true, draggable: true },
  { key: "quantityOrdered", label: "Quantity Ordered", sortable: true, hideable: true, draggable: true },
  { key: "itemPriceBcy", label: "Item Price (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "totalBcy", label: "Total (BCY)", sortable: true, hideable: true, draggable: true },
];

const ReceivableDetailsReport: React.FC = () => {
  const totals = rows.reduce(
    (acc, item) => ({
      quantityOrdered: acc.quantityOrdered + item.quantityOrdered,
      totalBcy: acc.totalBcy + item.totalBcy,
    }),
    { quantityOrdered: 0, totalBcy: 0 }
  );

  const loading = false;

  const renderRow = (row: ReceivableDetailsRow) => ({
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
    itemName: (
      <span className="text-sm text-gray-600">
        {row.itemName}
      </span>
    ),
    quantityOrdered: (
      <span className="text-sm font-medium text-gray-900">
        {row.quantityOrdered.toFixed(2)}
      </span>
    ),
    itemPriceBcy: (
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(row.itemPriceBcy)}
      </span>
    ),
    totalBcy: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.totalBcy)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2]"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="border-b border-[#EAECF0] bg-white px-6 py-3 flex justify-end">
        <div className="flex items-center gap-5 text-sm text-[#667085]">
          <button className="flex items-center gap-2 hover:text-[#475467]">
            <SquareGanttChart className="h-4 w-4" />
            <span>
              Group By : <span className="font-semibold text-[#1A1A1A]">None</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 hover:text-[#475467]">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-[#1A1A1A]">Customize Report Columns</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E7EEF9] px-1.5 text-xs font-semibold text-[#2563EB]">
              10
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden m-6 mt-0">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Receivable Details
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From 01/03/2026 To 31/03/2026
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="receivable-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />

          <div className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7 text-[#1A1A1A]">Total</div>
              <div className="text-right text-gray-900">
                {totals.quantityOrdered.toFixed(2)}
              </div>
              <div className="text-right text-gray-900">
                --
              </div>
              <div className="text-right text-blue-600">
                {formatCurrency(totals.totalBcy)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivableDetailsReport;
