import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PurchasesByItemRow {
  id: string;
  item_name: string;
  quantity_purchased: number;
  amount: number;
  average_price: number;
  sku: string;
  vendors: VendorDetailRow[];
}

interface VendorDetailRow {
  id: string;
  vendorId: string | number;
  vendor_name: string;
  quantity: number;
  amount: number;
  average_price: number;
}

const listColumns: ColumnConfig[] = [
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "quantity_purchased", label: "QUANTITY PURCHASED", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "average_price", label: "AVERAGE PRICE", sortable: true, hideable: false, draggable: true },
  { key: "sku", label: "SKU", sortable: true, hideable: false, draggable: true },
];

const detailColumns: ColumnConfig[] = [
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "quantity", label: "QUANTITY", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "average_price", label: "AVERAGE PRICE", sortable: true, hideable: false, draggable: true },
];

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

const formatDisplayDate = (iso: string) => {
  if (!iso) return "--";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (v?: string | number) => parseFloat(String(v ?? 0)) || 0;

const PurchasesByItemReport: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<PurchasesByItemRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail view state
  const [detailItem, setDetailItem] = useState<{ id: string; name: string; vendors: VendorDetailRow[] } | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/lock_account_items/purchases_by_item.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let list: any[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const mapped: PurchasesByItemRow[] = list.map((item: any, i: number) => ({
        id: String(item.item_id ?? item.id ?? i),
        item_name: item.item_name || item.name || "--",
        quantity_purchased: toNumber(item.quantity_purchased ?? item.quantity ?? item.qty),
        amount: toNumber(item.amount ?? item.total_amount),
        average_price: toNumber(item.average_price ?? item.avg_price ?? item.rate),
        sku: item.sku || item.item_sku || item.hsn_sac_code || "--",
        vendors: (item.vendors || []).map((v: any, vi: number) => ({
          id: String(v.id ?? vi),
          vendorId: v.vendor_id || v.id || "",
          vendor_name: v.vendor_name || v.name || "--",
          quantity: toNumber(v.quantity),
          amount: toNumber(v.amount),
          average_price: toNumber(v.average_price ?? v.avg_price),
        })),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch purchases by item", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchData(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchData]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          quantity_purchased: acc.quantity_purchased + row.quantity_purchased,
          amount: acc.amount + row.amount,
        }),
        { quantity_purchased: 0, amount: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        item_name: "__total__",
        quantity_purchased: totals.quantity_purchased,
        amount: totals.amount,
        average_price: 0,
        sku: "",
      },
    ];
  }, [rows, totals]);

  const detailVendors = detailItem?.vendors ?? [];

  const detailTotals = useMemo(
    () =>
      detailVendors.reduce(
        (acc, r) => ({ quantity: acc.quantity + r.quantity, amount: acc.amount + r.amount }),
        { quantity: 0, amount: 0 }
      ),
    [detailVendors]
  );

  const detailTableData = useMemo(() => {
    if (detailVendors.length === 0) return detailVendors;
    return [
      ...detailVendors,
      {
        id: "__total__",
        vendorId: "",
        vendor_name: "__total__",
        quantity: detailTotals.quantity,
        amount: detailTotals.amount,
        average_price: 0,
      },
    ];
  }, [detailVendors, detailTotals]);

  const handleOpenDetail = (row: PurchasesByItemRow) => {
    setDetailItem({ id: row.id, name: row.item_name, vendors: row.vendors });
  };

  const renderRow = (row: PurchasesByItemRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      item_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm font-medium text-gray-900">{row.item_name}</span>
      ),
      quantity_purchased: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {row.quantity_purchased.toFixed(2)}
        </span>
      ),
      amount: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">{formatCurrency(row.amount)}</span>
      ) : (
        <button
          onClick={() => handleOpenDetail(row)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {formatCurrency(row.amount)}
        </button>
      ),
      average_price: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">--</span>
      ) : (
        <button
          onClick={() => handleOpenDetail(row)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {formatCurrency(row.average_price)}
        </button>
      ),
      sku: <span className="text-sm text-gray-600">{isTotal ? "" : (row.sku || "--")}</span>,
    };
  };

  const renderDetailRow = (row: VendorDetailRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      vendor_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <button
          onClick={() => navigate(`/maintenance/vendor/view/${row.vendorId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.vendor_name}
        </button>
      ),
      quantity: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {row.quantity.toFixed(2)}
        </span>
      ),
      amount: <span className={amtClass}>{formatCurrency(row.amount)}</span>,
      average_price: (
        <span className="text-sm font-medium text-gray-900">
          {isTotal ? "--" : formatCurrency(row.average_price)}
        </span>
      ),
    };
  };

  // ── Detail View ──────────────────────────────────────────────────────────
  if (detailItem) {
    return (
      <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-[#EAECF0] bg-[#F8F9FC]">
            <button
              onClick={() => setDetailItem(null)}
              className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#101828]">
                Purchases by Item — {detailItem.name}
              </h1>
              <p className="mt-1 text-sm text-[#475467]">
                From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
              </p>
            </div>
          </div>

          <div className="p-4">
            <EnhancedTaskTable
              data={detailTableData}
              columns={detailColumns}
              renderRow={renderDetailRow}
              storageKey="purchases-by-item-detail-v1"
              hideTableExport={true}
              hideTableSearch={false}
              hideColumnsButton={true}
              loading={false}
              emptyMessage="No vendor data found for this item."
            />
          </div>
        </div>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Purchases by Item</h3>
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
            onClick={() => fetchData(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Purchases by Item</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={listColumns}
            renderRow={renderRow}
            storageKey="purchases-by-item-report-v2"
            hideTableExport={true}
            hideTableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No items found for the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default PurchasesByItemReport;
