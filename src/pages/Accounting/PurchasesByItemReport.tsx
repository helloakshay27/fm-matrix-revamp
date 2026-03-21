import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

/* ─────────────────────────────── API Types ─────────────────────────────── */

interface BillItemApi {
  id?: number;
  item_name?: string;
  name?: string;
  sku?: string;
  item_sku?: string;
  hsn_sac_code?: string;
  quantity?: number | string;
  qty?: number | string;
  rate?: number | string;
  unit_price?: number | string;
  amount?: number | string;
  total_amount?: number | string;
}

interface BillApi {
  id: number;
  status?: string;
  bill_date?: string;
  date?: string;
  created_at?: string;
  lock_account_bill_items?: BillItemApi[];
  lock_account_bill_charges?: BillItemApi[];
  item_details?: BillItemApi[];
  bill_items?: BillItemApi[];
}

/* ─────────────────────────────── Row Shape ─────────────────────────────── */

interface PurchasesByItemRow {
  item_name: string;
  quantity_purchased: number;
  amount: number;
  average_price: number;
  sku: string;
}

/* ─────────────────────────────── Columns ─────────────────────────────── */

const columns: ColumnConfig[] = [
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "quantity_purchased", label: "QUANTITY PURCHASED", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "average_price", label: "AVERAGE PRICE", sortable: true, hideable: false, draggable: true },
  { key: "sku", label: "SKU", sortable: true, hideable: false, draggable: true },
];

/* ─────────────────────────────── Helpers ─────────────────────────────── */

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseAmount = (value?: string | number): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const isWithinRange = (dateValue: string, fromDate: string, toDate: string) => {
  if (!dateValue) return false;
  const rowDate = new Date(dateValue);
  const from = new Date(toApiDate(fromDate));
  const to = new Date(toApiDate(toDate));
  if ([rowDate, from, to].some((d) => Number.isNaN(d.getTime()))) return true;
  rowDate.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return rowDate >= from && rowDate <= to;
};

const getBillItems = (bill: BillApi): BillItemApi[] =>
  bill.lock_account_bill_items ||
  bill.lock_account_bill_charges ||
  bill.item_details ||
  bill.bill_items ||
  [];

/* ─────────────────────────────── Component ─────────────────────────────── */

const PurchasesByItemReport: React.FC = () => {
  const [rows, setRows] = useState<PurchasesByItemRow[]>([]);
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
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  const fetchPurchasesByItem = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/lock_account_bills.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[date_gteq]": toApiDate(fromDate),
          "q[date_lteq]": toApiDate(toDate),
          page: 1,
          per_page: 500,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const bills: BillApi[] =
        response.data?.data ||
        response.data?.lock_account_bills ||
        (Array.isArray(response.data) ? response.data : []);

      /* Group by item name */
      const grouped = new Map<
        string,
        { quantity: number; amount: number; sku: string }
      >();

      (bills || [])
        .filter((bill) =>
          isWithinRange(bill.bill_date || bill.date || bill.created_at || "", fromDate, toDate)
        )
        .forEach((bill) => {
          const items = getBillItems(bill);
          items.forEach((item) => {
            const name = (item.item_name || item.name || "Others").trim() || "Others";
            const qty = parseAmount(item.quantity ?? item.qty);
            const rate = parseAmount(item.rate ?? item.unit_price);
            const amt = parseAmount(item.amount ?? item.total_amount) || qty * rate;
            const sku =
              item.sku || item.item_sku || item.hsn_sac_code || "";

            const existing = grouped.get(name);
            if (existing) {
              existing.quantity += qty;
              existing.amount += amt;
              if (!existing.sku && sku) existing.sku = sku;
            } else {
              grouped.set(name, { quantity: qty, amount: amt, sku });
            }
          });
        });

      const result: PurchasesByItemRow[] = Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([item_name, data]) => ({
          item_name,
          quantity_purchased: data.quantity,
          amount: data.amount,
          average_price: data.quantity > 0 ? data.amount / data.quantity : 0,
          sku: data.sku,
        }));

      setRows(result);
    } catch (err) {
      console.error("Failed to fetch purchases by item", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchasesByItem(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPurchasesByItem]);

  /* ── Totals ── */
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

  /* ── Row renderer ── */
  const renderRow = (row: PurchasesByItemRow) => ({
    item_name: (
      <span className="text-[13px] font-semibold text-[#111827]">{row.item_name}</span>
    ),
    quantity_purchased: (
      <span className="text-[13px] text-[#111827]">{row.quantity_purchased.toFixed(2)}</span>
    ),
    amount: (
      <span className="text-[13px] font-semibold text-[#2563eb]">
        {formatCurrency(row.amount)}
      </span>
    ),
    average_price: (
      <span className="text-[13px] font-semibold text-[#2563eb]">
        {formatCurrency(row.average_price)}
      </span>
    ),
    sku: <span className="text-[13px] text-[#111827]">{row.sku || ""}</span>,
  });

  /* ── Total footer widths (5 columns) ── */
  const colWidths = ["40%", "20%", "15%", "15%", "10%"];

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">

        {/* ── Filter Bar ── */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Purchases by Item</h3>
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
              onClick={() => fetchPurchasesByItem(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        {/* ── Centered Header ── */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Purchases by Item</h1>
          <p className="mt-2 text-[14px] text-[#344054]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        {/* ── Table ── */}
        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchases-by-item-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No items found for the selected date range."
            toolbarClassName="hidden"
            headerCellClassName="bg-[#F9FAFB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide py-3 px-4"
            rowClassName="border-b border-[#EAECF0] hover:bg-[#F9FAFB] transition-colors"
            cellClassName="py-3 px-4"
          />
        </div>

        {/* ── Totals Row ── */}
        {rows.length > 0 && (
          <div className="border-t-2 border-[#EAECF0] bg-white px-0">
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: colWidths.join(" ") }}
            >
              <div className="py-3 px-4 text-[13px] font-bold text-[#111827]">Total</div>
              <div className="py-3 px-4 text-[13px] font-bold text-[#111827]">
                {totals.quantity_purchased.toFixed(2)}
              </div>
              <div className="py-3 px-4 text-[13px] font-bold text-[#111827]">
                {formatCurrency(totals.amount)}
              </div>
              <div className="py-3 px-4" />
              <div className="py-3 px-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesByItemReport;
