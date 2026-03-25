import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";

interface ARAgingDetailRow {
  id: string;
  invoiceId?: string | number;
  customerId?: string | number;
  date: string;
  dueDate: string;
  transactionNo: string;
  type: string;
  status: string;
  customerName: string;
  age: string;
  amount: number;
  balanceDue: number;
  bucket: string;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: true, hideable: false, draggable: true },
  { key: "dueDate", label: "Due Date", sortable: true, hideable: false, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: false, draggable: true },
  { key: "type", label: "Type", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: false, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: false, draggable: true },
  { key: "age", label: "Age", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "Amount", sortable: true, hideable: false, draggable: true },
  { key: "balanceDue", label: "Balance Due", sortable: true, hideable: false, draggable: true },
];

const formatCurrency = (value: number): string =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
};

const BUCKET_LABELS: Record<string, string> = {
  current: "Current",
  "1_15": "1 - 15 Days",
  "16_30": "16 - 30 Days",
  "31_45": "31 - 45 Days",
  gt_45: "> 45 Days",
};

const BUCKET_ORDER = ["current", "1_15", "16_30", "31_45", "gt_45"];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const ARAgingDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState<ARAgingDetailRow[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  const fetchAgingDetails = useCallback(async (fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/aging_details.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res?.data || [];
      let mapped: ARAgingDetailRow[] = [];

      if (Array.isArray(apiData)) {
        mapped = apiData.map((d: any, i: number) => ({
          id: String(d.id || i),
          invoiceId: d.id || d.invoice_id || "",
          customerId: d.customer_id || "",
          date: formatDate(d.date),
          dueDate: formatDate(d.due_date),
          transactionNo: d.transaction_number || d.invoice_number || d.number || "--",
          type: d.transaction_type || "--",
          status: (d.days_overdue ?? 0) > 0 ? "Overdue" : "Sent",
          customerName: d.customer_name || d.name || "--",
          age: d.age || "--",
          amount: d.total_amount ?? d.amount ?? 0,
          balanceDue: d.balance_due ?? 0,
          bucket: d.aging_bucket || "current",
        }));
      } else if (typeof apiData === "object") {
        Object.entries(apiData).forEach(([bucketKey, items]: [string, any]) => {
          const rows = Array.isArray(items) ? items : items?.data || [];
          rows.forEach((d: any, i: number) => {
            mapped.push({
              id: `${bucketKey}-${d.id || i}`,
              invoiceId: d.id || d.invoice_id || "",
              customerId: d.customer_id || "",
              date: formatDate(d.date),
              dueDate: formatDate(d.due_date),
              transactionNo: d.transaction_number || d.invoice_number || d.number || "--",
              type: d.transaction_type || "--",
              status: (d.days_overdue ?? 0) > 0 ? "Overdue" : "Sent",
              customerName: d.customer_name || d.name || "--",
              // age: (d.days_overdue ?? 0) > 0 ? `${d.age} Days` : "--",
              age: d.age || "--",
              amount: d.total_amount ?? d.amount ?? 0,
              balanceDue: d.balance_due ?? 0,
              bucket: bucketKey,
            });
          });
        });
      }

      setAllRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, lock_account_id]);

  useEffect(() => {
    fetchAgingDetails(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchAgingDetails]);

  // Build tableData: inject section header + data rows + section total per bucket, then grand total
  const tableData = useMemo(() => {
    const grouped: Record<string, ARAgingDetailRow[]> = {};
    allRows.forEach((row) => {
      if (!grouped[row.bucket]) grouped[row.bucket] = [];
      grouped[row.bucket].push(row);
    });

    const result: any[] = [];

    BUCKET_ORDER.filter((k) => grouped[k]?.length > 0).forEach((k) => {
      const bucketRows = grouped[k];
      const bucketLabel = BUCKET_LABELS[k] || k;
      const bucketAmount = bucketRows.reduce((s, r) => s + r.amount, 0);
      const bucketBalance = bucketRows.reduce((s, r) => s + r.balanceDue, 0);

      // Section header row
      result.push({
        id: `__section__${k}`,
        bucket: k, date: "", dueDate: "", transactionNo: "", type: "",
        status: "__section__", customerName: bucketLabel,
        age: "", amount: 0, balanceDue: 0,
      });

      result.push(...bucketRows);

      // Section subtotal row
      result.push({
        id: `__subtotal__${k}`,
        bucket: k, date: "", dueDate: "", transactionNo: "", type: "",
        status: "__subtotal__", customerName: bucketLabel,
        age: "", amount: bucketAmount, balanceDue: bucketBalance,
      });
    });

    if (allRows.length > 0) {
      const grandAmount = allRows.reduce((s, r) => s + r.amount, 0);
      const grandBalance = allRows.reduce((s, r) => s + r.balanceDue, 0);
      result.push({
        id: "__total__",
        bucket: "", date: "", dueDate: "", transactionNo: "", type: "",
        status: "__total__", customerName: "",
        age: "", amount: grandAmount, balanceDue: grandBalance,
      });
    }

    return result;
  }, [allRows]);

  const renderRow = (row: ARAgingDetailRow) => {
    if (row.status === "__section__") {
      return {
        date: <span className="text-sm font-semibold text-[#1A1A1A]">{row.customerName}</span>,
        dueDate: <span />, transactionNo: <span />, type: <span />,
        status: <span />, customerName: <span />, age: <span />,
        amount: <span />, balanceDue: <span />,
      };
    }

    if (row.status === "__subtotal__") {
      return {
        date: <span className="text-sm font-bold text-[#1A1A1A]">Total — {row.customerName}</span>,
        dueDate: <span />, transactionNo: <span />, type: <span />,
        status: <span />, customerName: <span />, age: <span />,
        amount: <span className="text-sm font-bold text-blue-600">{formatCurrency(row.amount)}</span>,
        balanceDue: <span className="text-sm font-bold text-blue-600">{formatCurrency(row.balanceDue)}</span>,
      };
    }

    if (row.status === "__total__") {
      return {
        date: <span className="text-sm font-bold text-[#1A1A1A]">Total</span>,
        dueDate: <span />, transactionNo: <span />, type: <span />,
        status: <span />, customerName: <span />, age: <span />,
        amount: <span className="text-sm font-bold text-blue-600">{formatCurrency(row.amount)}</span>,
        balanceDue: <span className="text-sm font-bold text-blue-600">{formatCurrency(row.balanceDue)}</span>,
      };
    }

    return {
      date: <span className="text-sm text-gray-600">{row.date}</span>,
      dueDate: <span className="text-sm text-gray-600">{row.dueDate}</span>,
      transactionNo: (
        <button
          onClick={() => navigate(`/accounting/dashboard/invoices/${row.invoiceId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.transactionNo}
        </button>
      ),
      type: <span className="text-sm text-gray-600">{row.type}</span>,
      status: (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[row.status] || "bg-gray-100 text-gray-800"}`}>
          {row.status}
        </span>
      ),
      customerName: (
        <button
          onClick={() => navigate(`/accounting/customers/details/${row.customerId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customerName}
        </button>
      ),
      age: <span className="text-sm text-gray-600">{row.age || "--"}</span>,
      amount: (
        <button
          onClick={() => navigate(`/accounting/dashboard/invoices/${row.invoiceId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline"
        >
          {formatCurrency(row.amount)}
        </button>
      ),
      balanceDue: <span className="text-sm font-medium text-blue-600">{formatCurrency(row.balanceDue)}</span>,
    };
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>

      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">AR Aging Details</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchAgingDetails(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">AR Aging Details 
            {/* By Invoice Due Date */}
            </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="ar-aging-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
            hideColumnsButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ARAgingDetailsReport;
