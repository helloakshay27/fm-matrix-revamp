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

  const renderRow = (row: PurchaseOrderRow) => ({
    status: (
      <span className={`text-[13px] ${row.status.toLowerCase() === "closed" ? "text-[#059669]" : "text-[#6B7280]"}`}>
        {row.status}
      </span>
    ),
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    delivery_date: <span className="text-[13px] text-[#111827]">{formatDate(row.delivery_date)}</span>,
    po_number: (
      <button
        onClick={() => navigate(`/accounting/purchase-order/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb]"
      >
        {row.po_number}
      </button>
    ),
    vendor_name: (
      <button
        onClick={() => navigate(`/accounting/purchase-order/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb]"
      >
        {row.vendor_name}
      </button>
    ),
    amount: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount)}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Purchase Order Details</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
              onClick={() => fetchPurchaseOrderDetails(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Purchase Order Details</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchase-order-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no purchase orders during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-middle"
          />

          <div
            className="grid border-b border-[#EAECF0] bg-white px-8 py-3 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div>Total</div>
            <div />
            <div />
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailsReport;
