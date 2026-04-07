import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PurchaseOrderApi {
  id: number;
  po_date?: string;
  expected_delivery_date?: string;
  external_id?: string | number;
  reference_number?: string | number;
  status?: string;
  status_label?: string;
  approve_status?: string;
  all_level_approved?: boolean;
  total_amount?: string | number;
  total_amount_formatted?: string | number;
  supplier?: {
    company_name?: string;
  };
  vendor_name?: string;
  supplier_name?: string;
}

interface PurchaseOrderRow {
  id: number;
  status: string;
  date: string;
  delivery_date: string;
  po_number: string;
  vendor_name: string;
  amount: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "delivery_date", label: "DELIVERY DATE", sortable: true, hideable: false, draggable: true },
  { key: "po_number", label: "P.O#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const parseAmount = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const isWithinRange = (dateValue: string, fromDate: string, toDate: string) => {
  if (!dateValue) return false;

  const rowDate = new Date(dateValue);
  const from = new Date(toApiDate(fromDate));
  const to = new Date(toApiDate(toDate));

  if (Number.isNaN(rowDate.getTime()) || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return true;
  }

  rowDate.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  return rowDate >= from && rowDate <= to;
};

const normalizeStatus = (item: PurchaseOrderApi) => {
  const raw = (item.status || item.status_label || item.approve_status || "").toString().trim().toLowerCase();

  if (raw) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  if (item.all_level_approved) {
    return "Closed";
  }

  return "Draft";
};

const PurchaseOrderDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PurchaseOrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      fromDate: firstDay.toLocaleDateString("en-GB"),
      toDate: lastDay.toLocaleDateString("en-GB"),
    };
  }, []);

  const [filters, setFilters] = useState(defaultDateRange);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const fetchPurchaseOrderDetails = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/pms/purchase_orders.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[po_date_gteq]": toApiDate(fromDate),
          "q[po_date_lteq]": toApiDate(toDate),
          page: 1,
          per_page: 500,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list: PurchaseOrderApi[] = response.data.purchase_orders || response.data.data || response.data || [];

      const mappedRows: PurchaseOrderRow[] = (list || [])
        .filter((item) => isWithinRange(item.po_date || "", fromDate, toDate))
        .map((item) => ({
          id: item.id,
          status: normalizeStatus(item),
          date: item.po_date || "",
          delivery_date: item.expected_delivery_date || "",
          po_number: `PO-${String(item.external_id || item.id).padStart(5, "0")}`,
          vendor_name: item.supplier?.company_name || item.vendor_name || item.supplier_name || "-",
          amount: parseAmount(item.total_amount_formatted ?? item.total_amount),
        }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch purchase order details report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseOrderDetails(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPurchaseOrderDetails]);

  const totalAmount = useMemo(() => rows.reduce((acc, row) => acc + row.amount, 0), [rows]);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: -1,
        status: "__total__",
        date: "",
        delivery_date: "",
        po_number: "",
        vendor_name: "",
        amount: totalAmount,
      },
    ];
  }, [rows, totalAmount]);

  const statusBadgeMap: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    open: "bg-blue-100 text-blue-700",
    closed: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    void: "bg-red-100 text-red-700",
  };

  const renderRow = (row: PurchaseOrderRow) => {
    const isTotal = row.status === "__total__";
    return {
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ),
      date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.date)}</span>,
      delivery_date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.delivery_date)}</span>,
      po_number: isTotal ? <span /> : (
        <button
          onClick={() => navigate(`/accounting/purchase-order/${row.id}`)}
          className="text-sm font-medium text-blue-600"
        >
          {row.po_number}
        </button>
      ),
      vendor_name: isTotal ? <span /> : (
        <button
          onClick={() => navigate(`/accounting/purchase-order/${row.id}`)}
          className="text-sm font-medium text-blue-600"
        >
          {row.vendor_name}
        </button>
      ),
      amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.amount)}
        </span>
      ),
    };
  };

  const formatDisplayDate = (value: string) => {
    if (!value) return "--";
    // value is in dd/mm/yyyy
    const parts = value.split("/");
    if (parts.length === 3) return `${parts[0]}/${parts[1]}/${parts[2]}`;
    return value;
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Purchase Order Details</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={toInputDate(filters.fromDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={toInputDate(filters.toDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchPurchaseOrderDetails(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Purchase Order Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchase-order-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no purchase orders during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailsReport;
