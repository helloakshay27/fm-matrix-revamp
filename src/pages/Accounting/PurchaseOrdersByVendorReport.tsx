import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PurchaseOrderByVendorAPI {
  // id?: number | string;
  // vendor_name?: string;
  // supplier_name?: string;
  // name?: string;
  // purchase_order_count?: string | number;
  // order_count?: string | number;
  // count?: string | number;
  // amount?: string | number;
  // total_amount?: string | number;
  // purchase_order_amount?: string | number;

  id?: number | string;
  vendor_name?: string;
  supplier_name?: string;
  name?: string;

  expense_count?: string | number;
  bill_count?: string | number;
  vendor_credit_count?: string | number;
  journal_count?: string | number;

  amount?: string | number;
  amount_with_tax?: string | number;

}

type VendorPORow = {
  // id: string;
  // vendor_name: string;
  // purchase_order_count: number;
  // amount: number;

   id: string;
  vendor_name: string;

  expense_count: number;
  bill_count: number;
  vendor_credit_count: number;
  journal_count: number;

  amount: number;
  amount_with_tax: number;
};

const columns: ColumnConfig[] = [
  // { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  // { key: "purchase_order_count", label: "PURCHASE ORDER COUNT", sortable: true, hideable: false, draggable: true },
  // { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },

  { key: "vendor_name", label: "VENDOR NAME", sortable: true },
  { key: "expense_count", label: "EXPENSE COUNT", sortable: true },
  { key: "bill_count", label: "BILL COUNT", sortable: true },
  { key: "vendor_credit_count", label: "VENDOR CREDIT COUNT", sortable: true },
  { key: "journal_count", label: "JOURNAL COUNT", sortable: true },
  { key: "amount", label: "AMOUNT", sortable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true },
];

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

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const PurchaseOrdersByVendorReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<VendorPORow[]>([]);
  const [loading, setLoading] = useState(false);

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
        `https://${baseUrl}/pms/suppliers/purchase_orders_by_vendor_and_others.json`,
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
      let list: PurchaseOrderByVendorAPI[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      // const mapped: VendorPORow[] = list.map((item, i) => ({
      //   id: String(item.id ?? i),
      //   vendor_name: item.vendor_name || item.supplier_name || item.name || "-",
      //   purchase_order_count: toNumber(item.purchase_order_count ?? item.order_count ?? item.count),
      //   amount: toNumber(item.amount ?? item.total_amount ?? item.purchase_order_amount),
      // }));


      const mapped: VendorPORow[] = list.map((item, i) => ({
  id: String(item.id ?? i),

  vendor_name:
    item.vendor_name ||
    item.supplier_name ||
    item.name ||
    "-",

  expense_count: toNumber(item.expense_count),
  bill_count: toNumber(item.bill_count),
  vendor_credit_count: toNumber(item.vendor_credit_count),
  journal_count: toNumber(item.journal_count),

  amount: toNumber(item.amount),
  amount_with_tax: toNumber(item.amount_with_tax),
}));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch purchase orders by vendor", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchData]);

  // const totals = useMemo(
  //   () =>
  //     rows.reduce(
  //       (acc, row) => ({
  //         purchase_order_count: acc.purchase_order_count + row.purchase_order_count,
  //         amount: acc.amount + row.amount,
  //       }),
  //       { purchase_order_count: 0, amount: 0 }
  //     ),
  //   [rows]
  // );


  const totals = useMemo(
  () =>
    rows.reduce(
      (acc, r) => ({
        expense_count: acc.expense_count + r.expense_count,
        bill_count: acc.bill_count + r.bill_count,
        vendor_credit_count:
          acc.vendor_credit_count + r.vendor_credit_count,
        journal_count: acc.journal_count + r.journal_count,

        amount: acc.amount + r.amount,
        amount_with_tax:
          acc.amount_with_tax + r.amount_with_tax,
      }),
      {
        expense_count: 0,
        bill_count: 0,
        vendor_credit_count: 0,
        journal_count: 0,

        amount: 0,
        amount_with_tax: 0,
      }
    ),
  [rows]
);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        vendor_name: "__total__",
        // purchase_order_count: totals.purchase_order_count,
        // amount: totals.amount,

         expense_count: totals.expense_count,
  bill_count: totals.bill_count,
  vendor_credit_count: totals.vendor_credit_count,
  journal_count: totals.journal_count,

  amount: totals.amount,
  amount_with_tax: totals.amount_with_tax,
      },
    ];
  }, [rows, totals]);

  // const renderRow = (row: VendorPORow) => {
  //   const isTotal = row.id === "__total__";
  //   return {
  //     vendor_name: isTotal ? (
  //       <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
  //     ) : (
  //       <span className="text-sm font-medium text-blue-600">{row.vendor_name}</span>
  //     ),
  //     purchase_order_count: (
  //       <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
  //         {row.purchase_order_count}
  //       </span>
  //     ),
  //     amount: (
  //       <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
  //         {formatCurrency(row.amount)}
  //       </span>
  //     ),
  //   };
  // };


  const renderRow = (row: VendorPORow) => {
  const isTotal = row.id === "__total__";

  return {
    vendor_name: isTotal ? (
      <span className="font-bold">Total</span>
    ) : (
      <span className="text-blue-600 font-medium">
        {row.vendor_name}
      </span>
    ),

    expense_count: <span>{row.expense_count}</span>,
    bill_count: <span>{row.bill_count}</span>,
    vendor_credit_count: <span>{row.vendor_credit_count}</span>,
    journal_count: <span>{row.journal_count}</span>,

    amount: (
      <span className="font-medium">
        {formatCurrency(row.amount)}
      </span>
    ),

    amount_with_tax: (
      <span className="font-medium">
        {formatCurrency(row.amount_with_tax)}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Purchase Orders by Vendor</h3>
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
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Purchase Orders by Vendor</h1>
          <p className="mt-1 text-sm text-[#475467]">
            {filters.fromDate && filters.toDate
              ? `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`
              : "All dates"}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchases-by-vendor-report-v2"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no purchase orders during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersByVendorReport;
