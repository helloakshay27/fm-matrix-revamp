import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type CustomerBalanceRow = {
  id: string;
  customerId: string | number;
  customerName: string;
  invoicedAmount: number;
  amountReceived: number;
  closingBalance: number;
};

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDisplayDate = (value: string) => {
  if (!value) return "--/--/----";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: false, draggable: true },
  { key: "invoicedAmount", label: "Invoiced Amount", sortable: true, hideable: false, draggable: true },
  { key: "amountReceived", label: "Amount Received", sortable: true, hideable: false, draggable: true },
  { key: "closingBalance", label: "Closing Balance", sortable: true, hideable: false, draggable: true },
];

const CustomerBalanceSummaryReport: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<CustomerBalanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/customer_balance_summary.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res?.data || [];
      const mapped: CustomerBalanceRow[] = apiData.map((item: any, i: number) => ({
        id: String(item.id || i),
        customerId: item.id || "",
        customerName: item.name || item.customer_name || "--",
        invoicedAmount: item.invoiced_amount ?? item.total_invoiced ?? 0,
        amountReceived: item.amount_received ?? item.total_received ?? 0,
        closingBalance: item.closing_balance ?? item.balance_due ?? 0,
      }));

      setReportRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, lock_account_id]);

  useEffect(() => {
    fetchData(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchData]);

  const totals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({
          invoicedAmount: acc.invoicedAmount + row.invoicedAmount,
          amountReceived: acc.amountReceived + row.amountReceived,
          closingBalance: acc.closingBalance + row.closingBalance,
        }),
        { invoicedAmount: 0, amountReceived: 0, closingBalance: 0 }
      ),
    [reportRows]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const tableData = useMemo(() => {
    if (reportRows.length === 0) return reportRows;
    return [
      ...reportRows,
      {
        id: "__total__",
        customerId: "",
        customerName: "__total__",
        invoicedAmount: totals.invoicedAmount,
        amountReceived: totals.amountReceived,
        closingBalance: totals.closingBalance,
      },
    ];
  }, [reportRows, totals]);

  const renderRow = (row: CustomerBalanceRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      customerName: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <button
          onClick={() => navigate(`/accounting/customers/details/${row.customerId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customerName}
        </button>
      ),
      invoicedAmount: <span className={amtClass}>{formatAmount(row.invoicedAmount)}</span>,
      amountReceived: <span className={amtClass}>{formatAmount(row.amountReceived)}</span>,
      closingBalance: <span className={amtClass}>{formatAmount(row.closingBalance)}</span>,
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
            onClick={() => fetchData(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Customer Balance Summary
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="customer-balance-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            loading={loading}
            hideColumnsButton={true}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerBalanceSummaryReport;
