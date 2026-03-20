import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type BillRow = {
  id: string;
  status: string;
  billDate: string;
  dueDate: string;
  billNo: string;
  vendorName: string;
  billAmount: number;
  balanceAmount: number;
  project: string;
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
  if (!value) return "--";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`; 
};

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusColorMap: Record<string, string> = {
  Open: "text-blue-500",
  Paid: "text-green-500",
};

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true },
  { key: "billDate", label: "BILL DATE", sortable: true },
  { key: "dueDate", label: "DUE DATE", sortable: true },
  { key: "billNo", label: "BILL#", sortable: true },
  { key: "vendorName", label: "VENDOR NAME", sortable: true },
  { key: "billAmount", label: "BILL AMOUNT", sortable: true },
  { key: "balanceAmount", label: "BALANCE AMOUNT", sortable: true },
  { key: "project", label: "PROJECT", sortable: true },
];

const seedRows: BillRow[] = [
  {
    id: "1",
    status: "Open",
    billDate: "2026-03-11",
    dueDate: "2026-03-21",
    billNo: "45",
    vendorName: "Gophygital",
    billAmount: 262.50,
    balanceAmount: 262.50,
    project: "",
  },
  {
    id: "2",
    status: "Paid",
    billDate: "2026-03-17",
    dueDate: "2026-03-17",
    billNo: "1221",
    vendorName: "Gophygital",
    billAmount: 262.50,
    balanceAmount: 0.00,
    project: "",
  },
  {
    id: "3",
    status: "Paid",
    billDate: "2026-03-17",
    dueDate: "2026-03-17",
    billNo: "fgfgr",
    vendorName: "Gophygital",
    billAmount: 31616.00,
    balanceAmount: 0.00,
    project: "",
  },
];

const BillDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [appliedFilters, setAppliedFilters] = useState(defaultRange);
  const [rows] = useState<BillRow[]>(seedRows);
  const [loading] = useState(false);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          billAmount: acc.billAmount + row.billAmount,
          balanceAmount: acc.balanceAmount + row.balanceAmount,
        }),
        { billAmount: 0, balanceAmount: 0 }
      ),
    [rows]
  );

  const totalRow: BillRow = {
    id: "total-row",
    status: "Total",
    billDate: "",
    dueDate: "",
    billNo: "",
    vendorName: "",
    billAmount: totals.billAmount,
    balanceAmount: totals.balanceAmount,
    project: "",
  };

  const renderRow = (row: BillRow) => {
    const isTotal = row.id === "total-row";

    if (isTotal) {
      return {
        status: <span className="text-[13px] font-bold text-[#1A1A1A]">Total</span>,
        billDate: <span></span>,
        dueDate: <span></span>,
        billNo: <span></span>,
        vendorName: <span></span>,
        billAmount: <span className="font-bold text-[#1A1A1A]">{formatAmount(row.billAmount)}</span>,
        balanceAmount: <span className="font-bold text-[#1A1A1A]">{formatAmount(row.balanceAmount)}</span>,
        project: <span></span>,
      };
    }

    return {
      status: (
        <span className={`text-[13px] ${statusColorMap[row.status] || "text-gray-800"}`}>
          {row.status}
        </span>
      ),
      billDate: <span className="text-[13px] font-medium text-gray-900">{formatDisplayDate(row.billDate)}</span>,
      dueDate: <span className="text-[13px] font-medium text-gray-900">{formatDisplayDate(row.dueDate)}</span>,
      billNo: <span className="text-[13px] font-medium text-blue-600">{row.billNo}</span>,
      vendorName: <span className="text-[13px] font-medium text-blue-600">{row.vendorName}</span>,
      billAmount: <span className="text-[13px] font-medium text-blue-600">{formatAmount(row.billAmount)}</span>,
      balanceAmount: <span className="text-[13px] font-medium text-blue-600">{formatAmount(row.balanceAmount)}</span>,
      project: <span className="text-[13px] text-gray-900">{row.project}</span>,
    };
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">
      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#E5E0D3] rounded-full text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Bill Details</h3>
        </div>

        <div className="grid md:grid-cols-4 items-end gap-6">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          <Button
            onClick={() => setAppliedFilters(filters)}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px] w-full md:w-auto px-8"
          >
            View
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-5 text-center border-b bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Bill Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(appliedFilters.fromDate)} To{" "}
            {formatDisplayDate(appliedFilters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={[...rows, totalRow]}
            columns={columns}
            renderRow={renderRow}
            storageKey="bill-details-report"
            loading={loading}
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={false}
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
        </div>
      </div>
    </div>
  );
};

export default BillDetailsReport;
