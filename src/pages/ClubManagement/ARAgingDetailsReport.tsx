import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ARAgingDetailRow {
  id: string;
  date: string;
  dueDate: string;
  transactionNo: string;
  type: string;
  status: "Overdue" | "Open" | "Sent" | "Paid";
  customerName: string;
  age: string;
  amount: number;
  balanceDue: number;
  section: string;
}

interface BucketSection {
  key: string;
  label: string;
  rows: ARAgingDetailRow[];
}

const formatCurrency = (value: number): string => {
  const formatted = Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
};

const allSections: BucketSection[] = [
  {
    key: "1-15",
    label: "1 - 15 Days",
    rows: [
      {
        id: "1",
        date: "09/03/2026",
        dueDate: "09/03/2026",
        transactionNo: "INV-0393",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "9 Days",
        amount: 525.0,
        balanceDue: 244.75,
        section: "1 - 15 Days",
      },
      {
        id: "2",
        date: "10/03/2026",
        dueDate: "10/03/2026",
        transactionNo: "INV-0395",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "8 Days",
        amount: 475.5,
        balanceDue: 475.5,
        section: "1 - 15 Days",
      },
      {
        id: "3",
        date: "10/03/2026",
        dueDate: "10/03/2026",
        transactionNo: "INV-0396",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "8 Days",
        amount: 315.0,
        balanceDue: 315.0,
        section: "1 - 15 Days",
      },
      {
        id: "4",
        date: "16/03/2026",
        dueDate: "16/03/2026",
        transactionNo: "INV-0397",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "2 Days",
        amount: 315.0,
        balanceDue: 315.0,
        section: "1 - 15 Days",
      },
      {
        id: "5",
        date: "16/03/2026",
        dueDate: "16/03/2026",
        transactionNo: "INV-0398",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "2 Days",
        amount: 1030.0,
        balanceDue: 1030.0,
        section: "1 - 15 Days",
      },
      {
        id: "6",
        date: "16/03/2026",
        dueDate: "16/03/2026",
        transactionNo: "INV-0399",
        type: "Invoice",
        status: "Overdue",
        customerName: "Lockated",
        age: "2 Days",
        amount: 1337.25,
        balanceDue: 1337.25,
        section: "1 - 15 Days",
      },
    ],
  },
  {
    key: "current",
    label: "Current",
    rows: [
      {
        id: "7",
        date: "18/03/2026",
        dueDate: "18/03/2026",
        transactionNo: "INV-0394",
        type: "Invoice",
        status: "Sent",
        customerName: "Lockated",
        age: "",
        amount: 86.19,
        balanceDue: 86.19,
        section: "Current",
      },
    ],
  },
];

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
};

const columns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "dueDate", label: "Due Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "age", label: "Age", sortable: true, hideable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, draggable: true },
  { key: "balanceDue", label: "Balance Due", sortable: true, hideable: true, draggable: true },
];

const ARAgingDetailsReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bucketParam = searchParams.get("bucket") || "";

  const sections = useMemo(() => {
    if (!bucketParam) return allSections;
    const filtered = allSections.filter((s) => s.key === bucketParam);
    return filtered.length > 0 ? filtered : allSections;
  }, [bucketParam]);

  // Flatten all rows for the enhanced table
  const allRows = useMemo(() => {
    return sections.flatMap(section => 
      section.rows.map(row => ({ ...row, section: section.label }))
    );
  }, [sections]);

  const grandTotals = useMemo(
    () =>
      sections.reduce(
        (acc, section) => {
          section.rows.forEach((row) => {
            acc.amount += row.amount;
            acc.balanceDue += row.balanceDue;
          });
          return acc;
        },
        { amount: 0, balanceDue: 0 }
      ),
    [sections]
  );

  const loading = false;

  const renderRow = (row: ARAgingDetailRow) => ({
    date: (
      <span className="text-sm text-gray-600">
        {row.date}
      </span>
    ),
    dueDate: (
      <span className="text-sm text-gray-600">
        {row.dueDate}
      </span>
    ),
    transactionNo: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.transactionNo}
      </span>
    ),
    type: (
      <span className="text-sm text-gray-600">
        {row.type}
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
    customerName: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.customerName}
      </span>
    ),
    age: (
      <span className="text-sm text-gray-600">
        {row.age || "--"}
      </span>
    ),
    amount: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.amount)}
      </span>
    ),
    balanceDue: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.balanceDue)}
      </span>
    ),
  });

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Page Header */}
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            AR Aging Details By Invoice Due Date
          </h1>
          <p className="mt-1 text-sm text-[#475467]">As of {today}</p>
        </div>

        {/* EnhancedTaskTable */}
        <div className="p-4">
          <EnhancedTaskTable
            data={allRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="ar-aging-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />

          {/* Section Totals */}
          {sections.map((section) => {
            const sectionTotals = section.rows.reduce(
              (acc, row) => ({
                amount: acc.amount + row.amount,
                balanceDue: acc.balanceDue + row.balanceDue,
              }),
              { amount: 0, balanceDue: 0 }
            );

            return (
              <div key={section.key} className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
                <div className="flex justify-between items-center">
                  <span>{section.label}</span>
                  <div className="flex gap-6">
                    <span className="text-blue-600">
                      Amount: {formatCurrency(sectionTotals.amount)}
                    </span>
                    <span className="text-blue-600">
                      Balance Due: {formatCurrency(sectionTotals.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Grand Total */}
          <div className="mt-2 rounded-md bg-[#E5E0D3] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <div className="flex justify-between items-center">
              <span>Total</span>
              <div className="flex gap-6">
                <span className="text-blue-600">
                  Amount: {formatCurrency(grandTotals.amount)}
                </span>
                <span className="text-blue-600">
                  Balance Due: {formatCurrency(grandTotals.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARAgingDetailsReport;
