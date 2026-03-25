import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface TimeToGetPaidRow {
  id: string;
  customerId: string | number;
  customer_name: string;
  bucket_0_15: number;
  bucket_16_30: number;
  bucket_31_45: number;
  bucket_above_45: number;
  average_days: number;
}

const columns: ColumnConfig[] = [
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "bucket_0_15", label: "0 - 15 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "bucket_16_30", label: "16 - 30 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "bucket_31_45", label: "31 - 45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "bucket_above_45", label: "ABOVE 45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "average_days", label: "AVERAGE DAYS TO GET PAID", sortable: true, hideable: false, draggable: true },
];

const toFilterDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const TimeToGetPaidReport: React.FC = () => {
  const navigate = useNavigate();
  const lockAccountId = localStorage.getItem("lock_account_id");
  const [rows, setRows] = useState<TimeToGetPaidRow[]>([]);
  const [loading, setLoading] = useState(false);
  const defaultDateRange = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      fromDate: toFilterDate(firstDay),
      toDate: toFilterDate(lastDay),
    };
  })[0];
  const [filters, setFilters] = useState({
    fromDate: defaultDateRange.fromDate,
    toDate: defaultDateRange.toDate,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const fetchPayments = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${baseUrl}/lock_account_customers/time_to_get_paid.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData: any[] = response.data || [];
      const mapped: TimeToGetPaidRow[] = apiData.map((item: any, i: number) => ({
        id: String(item.id || i),
        customerId: item.customer_id || item.id || "",
        customer_name: item.customer_name || item.name || "--",
        bucket_0_15: item["0_15"] ?? item.bucket_0_15 ?? 0,
        bucket_16_30: item["16_30"] ?? item.bucket_16_30 ?? 0,
        bucket_31_45: item["31_45"] ?? item.bucket_31_45 ?? 0,
        bucket_above_45: item["gt_45"] ?? item.bucket_above_45 ?? item.above_45 ?? 0,
        average_days: item.average_days ?? item.avg_days ?? 0,
      }));

      setRows(mapped);
    } catch (error) {
      console.error("Failed to load Time to Get Paid report", error);
    } finally {
      setLoading(false);
    }
  }, [lockAccountId]);

  useEffect(() => {
    fetchPayments(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPayments]);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    const totals = rows.reduce(
      (acc, r) => ({
        bucket_0_15: acc.bucket_0_15 + r.bucket_0_15,
        bucket_16_30: acc.bucket_16_30 + r.bucket_16_30,
        bucket_31_45: acc.bucket_31_45 + r.bucket_31_45,
        bucket_above_45: acc.bucket_above_45 + r.bucket_above_45,
        average_days: acc.average_days + r.average_days,
      }),
      { bucket_0_15: 0, bucket_16_30: 0, bucket_31_45: 0, bucket_above_45: 0, average_days: 0 }
    );
    return [
      ...rows,
      {
        id: "__total__",
        customerId: "",
        customer_name: "__total__",
        ...totals,
      },
    ];
  }, [rows]);

  const renderRow = (row: TimeToGetPaidRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`;
    return {
      customer_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <button
          onClick={() => navigate(`/accounting/customers/details/${row.customerId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customer_name}
        </button>
      ),
      bucket_0_15: <span className={amtClass}>{formatCurrency(row.bucket_0_15)}</span>,
      bucket_16_30: <span className={amtClass}>{formatCurrency(row.bucket_16_30)}</span>,
      bucket_31_45: <span className={amtClass}>{formatCurrency(row.bucket_31_45)}</span>,
      bucket_above_45: <span className={amtClass}>{formatCurrency(row.bucket_above_45)}</span>,
      average_days: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">{row.average_days ? `${row.average_days} Days` : "--"}</span>
      ) : (
        <span className="text-sm text-gray-900">{row.average_days ? `${row.average_days} Days` : "--"}</span>
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Time to Get Paid</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchPayments(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Time to Get Paid</h1>
          <p className="mt-1 text-sm text-[#475467]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="time-to-get-paid-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            loading={loading}
            emptyMessage="No customer payment data found"
            hideColumnsButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeToGetPaidReport;