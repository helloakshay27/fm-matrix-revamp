import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesOrderRow {
  id: string;
  salesOrderId: string | number;
  status: string;
  date: string;
  shipmentDate: string;
  salesOrderNo: string;
  customerName: string;
  amount: number;
}

const statusColorMap: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  closed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "shipmentDate", label: "SHIPMENT DATE", sortable: true, hideable: false, draggable: true },
  { key: "salesOrderNo", label: "SALES ORDER#", sortable: true, hideable: false, draggable: true },
  { key: "customerName", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [year, month, day] = dateStr.split("-");
  if (!day) return dateStr;
  return `${day}-${month}-${year}`;
};

const SalesOrderDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SalesOrderRow[]>([]);
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

  const fetchSalesOrders = useCallback(async (fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://${baseUrl}/sale_orders.json`, {
        params: {
          lock_account_id,
          "q[date_gteq]": fromDate,
          "q[date_lteq]": toDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData: any[] = res?.data || [];

      const mapped: SalesOrderRow[] = apiData.map((item: any, index: number) => ({
        id: item.id ? String(item.id) : `row-${index}`,
        salesOrderId: item.id || "",
        status: item.status || "--",
        date: formatDate(item.date),
        shipmentDate: formatDate(item.shipment_date || item.expected_shipment_date),
        salesOrderNo: item.sale_order_number || item.sales_order_number || "--",
        customerName: item.customer_name || "--",
        amount: Number(item.total_amount || item.amount || 0),
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, lock_account_id]);

  useEffect(() => {
    fetchSalesOrders(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchSalesOrders]);

  const totalAmount = useMemo(() => rows.reduce((acc, r) => acc + r.amount, 0), [rows]);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        salesOrderId: "",
        status: "__total__",
        date: "",
        shipmentDate: "",
        salesOrderNo: "",
        customerName: "",
        amount: totalAmount,
      },
    ];
  }, [rows, totalAmount]);

  const renderRow = (row: SalesOrderRow) => {
    const isTotal = row.id === "__total__";
    return {
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      date: <span className="text-sm text-gray-600">{isTotal ? "" : row.date}</span>,
      shipmentDate: <span className="text-sm text-gray-600">{isTotal ? "" : row.shipmentDate}</span>,
      salesOrderNo: isTotal ? <span /> : (
        <button
          onClick={() => navigate(`/accounting/sales-order/${row.salesOrderId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.salesOrderNo}
        </button>
      ),
      customerName: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.customerName}</span>
      ),
      amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.amount)}
        </span>
      ),
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Sales Order Details</h3>
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
            onClick={() => fetchSalesOrders(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Sales Order Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="sales-order-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            loading={loading}
            hideColumnsButton={true}
            emptyMessage="There are no sales orders during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetailsReport;
