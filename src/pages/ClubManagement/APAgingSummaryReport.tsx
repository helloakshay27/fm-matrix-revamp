import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SupplierAgingAPI {
  id?: number | string;
  vendor_name?: string;
  supplier_name?: string;
  name?: string;
  current?: string | number;
  days_1_15?: string | number;
  days_1_to_15?: string | number;
  bucket_1_15?: string | number;
  days_16_30?: string | number;
  days_16_to_30?: string | number;
  bucket_16_30?: string | number;
  days_31_45?: string | number;
  days_31_to_45?: string | number;
  bucket_31_45?: string | number;
  days_above_45?: string | number;
  days_over_45?: string | number;
  bucket_above_45?: string | number;
  total?: string | number;
  total_fcy?: string | number;
}

type APAgingRow = {
  id: string;
  vendorName: string;
  current: number;
  days1To15: number;
  days16To30: number;
  days31To45: number;
  daysOver45: number;
  total: number;
};

const columns: ColumnConfig[] = [
  { key: "vendorName", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "current", label: "CURRENT", sortable: true, hideable: false, draggable: true },
  { key: "days1To15", label: "1-15 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "days16To30", label: "16-30 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "days31To45", label: "31-45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "daysOver45", label: "> 45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "total", label: "TOTAL", sortable: true, hideable: false, draggable: true },
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

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (v?: string | number) => parseFloat(String(v ?? 0)) || 0;

const APAgingSummaryReport: React.FC = () => {
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [rows, setRows] = useState<APAgingRow[]>([]);
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
        `https://${baseUrl}/pms/suppliers/supplier_aging_summary.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            ...(fromDate && { "q[date_gteq]": toApiDate(fromDate) }),
            ...(toDate && { "q[date_lteq]": toApiDate(toDate) }),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let list: SupplierAgingAPI[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const mapped: APAgingRow[] = list.map((item, i) => ({
        id: String(item.id ?? i),
        vendorName: item.vendor_name || item.supplier_name || item.name || "-",
        current: toNumber(item.current),
        days1To15: toNumber(item.days_1_15 ?? item.days_1_to_15 ?? item.bucket_1_15),
        days16To30: toNumber(item.days_16_30 ?? item.days_16_to_30 ?? item.bucket_16_30),
        days31To45: toNumber(item.days_31_45 ?? item.days_31_to_45 ?? item.bucket_31_45),
        daysOver45: toNumber(item.days_above_45 ?? item.days_over_45 ?? item.bucket_above_45),
        total: toNumber(item.total),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch AP aging summary", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData("", "");
  }, [fetchData]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          current: acc.current + row.current,
          days1To15: acc.days1To15 + row.days1To15,
          days16To30: acc.days16To30 + row.days16To30,
          days31To45: acc.days31To45 + row.days31To45,
          daysOver45: acc.daysOver45 + row.daysOver45,
          total: acc.total + row.total,
        }),
        { current: 0, days1To15: 0, days16To30: 0, days31To45: 0, daysOver45: 0, total: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        vendorName: "__total__",
        current: totals.current,
        days1To15: totals.days1To15,
        days16To30: totals.days16To30,
        days31To45: totals.days31To45,
        daysOver45: totals.daysOver45,
        total: totals.total,
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: APAgingRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      vendorName: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm font-medium text-blue-600">{row.vendorName}</span>
      ),
      current: <span className={amtClass}>{formatAmount(row.current)}</span>,
      days1To15: <span className={amtClass}>{formatAmount(row.days1To15)}</span>,
      days16To30: <span className={amtClass}>{formatAmount(row.days16To30)}</span>,
      days31To45: <span className={amtClass}>{formatAmount(row.days31To45)}</span>,
      daysOver45: <span className={amtClass}>{formatAmount(row.daysOver45)}</span>,
      total: <span className={amtClass}>{formatAmount(row.total)}</span>,
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">AP Aging Summary By Bill Due Date</h3>
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
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">AP Aging Summary By Bill Due Date</h1>
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
            storageKey="ap-aging-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default APAgingSummaryReport;
