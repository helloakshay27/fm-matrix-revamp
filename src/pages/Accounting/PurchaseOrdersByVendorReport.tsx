import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PurchaseOrderApi {
  id: number;
  po_date?: string;
  total_amount?: string | number;
  total_amount_formatted?: string | number;
  supplier?: {
    company_name?: string;
  };
  vendor_name?: string;
  supplier_name?: string;
}

interface VendorSummaryRow {
  id: string;
  vendor_name: string;
  purchase_order_count: number;
  amount: number;
}

const columns: ColumnConfig[] = [
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "purchase_order_count", label: "PURCHASE ORDER COUNT", sortable: true, hideable: false, draggable: true },
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

const PurchaseOrdersByVendorReport: React.FC = () => {
  const [rows, setRows] = useState<VendorSummaryRow[]>([]);
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

  const fetchVendorSummary = useCallback(async (fromDate: string, toDate: string) => {
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

      const grouped = (list || [])
        .filter((item) => isWithinRange(item.po_date || "", fromDate, toDate))
        .reduce<Record<string, VendorSummaryRow>>((acc, item) => {
          const vendorName = item.supplier?.company_name || item.vendor_name || item.supplier_name || "Unknown Vendor";

          if (!acc[vendorName]) {
            acc[vendorName] = {
              id: vendorName,
              vendor_name: vendorName,
              purchase_order_count: 0,
              amount: 0,
            };
          }

          acc[vendorName].purchase_order_count += 1;
          acc[vendorName].amount += parseAmount(item.total_amount_formatted ?? item.total_amount);

          return acc;
        }, {});

      setRows(Object.values(grouped));
    } catch (error) {
      console.error("Failed to fetch purchase orders by vendor report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorSummary(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchVendorSummary]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          purchase_order_count: acc.purchase_order_count + row.purchase_order_count,
          amount: acc.amount + row.amount,
        }),
        { purchase_order_count: 0, amount: 0 }
      ),
    [rows]
  );

  const renderRow = (row: VendorSummaryRow) => ({
    vendor_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>,
    purchase_order_count: <span className="text-[13px] font-semibold text-[#2563eb]">{row.purchase_order_count}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Purchase Orders by Vendor</h3>
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
              onClick={() => fetchVendorSummary(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Purchase Orders by Vendor</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchase-orders-by-vendor-report-v1"
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
            <div className="text-left font-semibold text-[#111827]">{totals.purchase_order_count}</div>
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersByVendorReport;
