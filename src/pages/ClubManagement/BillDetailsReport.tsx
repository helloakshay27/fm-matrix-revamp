import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
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

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  }
  return dateStr;
};

const statusColorMap: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-700",
  Void: "bg-red-100 text-red-700",
  Overdue: "bg-orange-100 text-orange-700",
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

const BillDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<BillRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lock_account_id = localStorage.getItem("lock_account_id");

      const res = await axios.get(`https://${baseUrl}/lock_account_bills.json`, {
        params: {
          lock_account_id,
          "q[date_gteq]": toApiDate(from),
          "q[date_lteq]": toApiDate(to),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData: any[] = res.data?.lock_account_bills || res.data || [];
      const mapped: BillRow[] = apiData.map((item: any, i: number) => ({
        id: String(item.id || i),
        status: item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "--",
        billDate: formatDate(item.date || item.bill_date || ""),
        dueDate: formatDate(item.due_date || ""),
        billNo: item.bill_number || item.number || "--",
        vendorName: item.vendor_name || item.contact_name || "--",
        billAmount: parseFloat(String(item.total_amount ?? item.amount ?? 0)) || 0,
        balanceAmount: parseFloat(String(item.balance_due ?? item.balance_amount ?? 0)) || 0,
        project: item.project_name || item.project || "",
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills(defaultRange.fromDate, defaultRange.toDate);
  }, [fetchBills]);

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

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "total-row",
        status: "__total__",
        billDate: "",
        dueDate: "",
        billNo: "Total",
        vendorName: "",
        billAmount: totals.billAmount,
        balanceAmount: totals.balanceAmount,
        project: "",
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: BillRow) => {
    const isTotal = row.id === "total-row";

    return {
      status: isTotal ? <span /> : (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[row.status] || "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ),
      billDate: <span className="text-sm text-gray-600">{isTotal ? "" : row.billDate}</span>,
      dueDate: <span className="text-sm text-gray-600">{isTotal ? "" : row.dueDate}</span>,
      billNo: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {row.billNo}
        </span>
      ),
      vendorName: <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.vendorName}</span>,
      billAmount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatAmount(row.billAmount)}
        </span>
      ),
      balanceAmount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatAmount(row.balanceAmount)}
        </span>
      ),
      project: <span className="text-sm text-gray-600">{isTotal ? "" : row.project}</span>,
    };
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Bill Details</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
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
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchBills(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Bill Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="bill-details-report"
            loading={loading}
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default BillDetailsReport;
