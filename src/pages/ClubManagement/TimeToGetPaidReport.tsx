import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface BillPaymentAPI {
  id: number;
  payment_date?: string;
}

interface LockPaymentAPI {
  id: number;
  resident_name?: string;
  payment_status?: string;
  created_at?: string;
  paid_amount?: string | number;
  total_amount?: string | number;
  payment_amount?: string | number;
  bill_payments?: BillPaymentAPI[];
}

interface TimeToGetPaidRow {
  id: string;
  customer_name: string;
  bucket_0_15: number;
  bucket_16_30: number;
  bucket_31_45: number;
  bucket_above_45: number;
}

const columns: ColumnConfig[] = [
  {
    key: "customer_name",
    label: "CUSTOMER NAME",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "bucket_0_15",
    label: "0 - 15 DAYS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "bucket_16_30",
    label: "16 - 30 DAYS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "bucket_31_45",
    label: "31 - 45 DAYS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "bucket_above_45",
    label: "ABOVE 45 DAYS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const toFilterDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseFilterDate = (value: string) => {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

const formatPercent = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return "0%";
  }

  const fixed = value.toFixed(4);
  return `${fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")}%`;
};

const getPaymentAmount = (payment: LockPaymentAPI) => {
  return (
    parseFloat(
      String(payment.paid_amount || payment.payment_amount || payment.total_amount || "0")
    ) || 0
  );
};

const getPaymentDate = (payment: LockPaymentAPI) => {
  const rawDate = payment.bill_payments?.[0]?.payment_date || payment.created_at;
  return rawDate ? new Date(rawDate) : null;
};

const getBucketKey = (daysDifference: number) => {
  if (daysDifference <= 15) {
    return "bucket_0_15";
  }

  if (daysDifference <= 30) {
    return "bucket_16_30";
  }

  if (daysDifference <= 45) {
    return "bucket_31_45";
  }

  return "bucket_above_45";
};

const TimeToGetPaidReport: React.FC = () => {
  const navigate = useNavigate();
  const lockAccountId = localStorage.getItem("lock_account_id");
  const [rows, setRows] = useState<TimeToGetPaidRow[]>([]);
  const [loading, setLoading] = useState(false);
  const defaultDateRange = useState(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      fromDate: toFilterDate(firstDayOfMonth),
      toDate: toFilterDate(today),
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
      const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[payment_made_eq]": 0,
          "q[date_gteq]": fromDate,
          "q[date_lteq]": toDate,
          per_page: 500,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fromDateObj = parseFilterDate(fromDate);
      fromDateObj.setHours(0, 0, 0, 0);
      const toDateObj = parseFilterDate(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      const asOfDate = parseFilterDate(toDate);

      const list: LockPaymentAPI[] = response.data.lock_payments || response.data || [];
      const paidPayments = list.filter((payment) => {
        const status = (payment.payment_status || "").toLowerCase();
        const amountValid = status === "paid" || status === "success" || getPaymentAmount(payment) > 0;

        if (!amountValid) {
          return false;
        }

        const paymentDate = getPaymentDate(payment);
        if (!paymentDate) {
          return false;
        }

        return paymentDate >= fromDateObj && paymentDate <= toDateObj;
      });

      const grouped = paidPayments.reduce(
        (accumulator: Record<string, { customer_name: string; total: number; bucket_0_15: number; bucket_16_30: number; bucket_31_45: number; bucket_above_45: number }>, payment) => {
          const customerName = payment.resident_name || "Unknown Customer";
          const amount = getPaymentAmount(payment);
          const paymentDate = getPaymentDate(payment);

          if (!accumulator[customerName]) {
            accumulator[customerName] = {
              customer_name: customerName,
              total: 0,
              bucket_0_15: 0,
              bucket_16_30: 0,
              bucket_31_45: 0,
              bucket_above_45: 0,
            };
          }

          accumulator[customerName].total += amount;

          if (paymentDate) {
            const diffInMs = asOfDate.getTime() - paymentDate.getTime();
            const diffInDays = Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
            const bucketKey = getBucketKey(diffInDays);
            accumulator[customerName][bucketKey] += amount;
          }

          return accumulator;
        },
        {}
      );

      const nextRows = Object.values(grouped).map((group, index) => {
        const total = group.total || 0;

        return {
          id: `${index + 1}`,
          customer_name: group.customer_name,
          bucket_0_15: total ? (group.bucket_0_15 / total) * 100 : 0,
          bucket_16_30: total ? (group.bucket_16_30 / total) * 100 : 0,
          bucket_31_45: total ? (group.bucket_31_45 / total) * 100 : 0,
          bucket_above_45: total ? (group.bucket_above_45 / total) * 100 : 0,
        };
      });

      setRows(nextRows);
    } catch (error) {
      console.error("Failed to load Time to Get Paid report", error);
    } finally {
      setLoading(false);
    }
  }, [lockAccountId]);

  useEffect(() => {
    fetchPayments(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPayments]);

  const renderRow = (row: TimeToGetPaidRow) => ({
    customer_name: (
      <button
        onClick={() => navigate("/accounting/customers")}
        className="text-[13px] font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
      >
        {row.customer_name}
      </button>
    ),
    bucket_0_15: <span className="text-[13px] text-[#111827] font-medium">{formatPercent(row.bucket_0_15)}</span>,
    bucket_16_30: <span className="text-[13px] text-[#111827] font-medium">{formatPercent(row.bucket_16_30)}</span>,
    bucket_31_45: <span className="text-[13px] text-[#111827] font-medium">{formatPercent(row.bucket_31_45)}</span>,
    bucket_above_45: <span className="text-[13px] text-[#111827] font-medium">{formatPercent(row.bucket_above_45)}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Time to Get Paid</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
              onClick={() => fetchPayments(filters.fromDate, filters.toDate)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
            >
              View
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Time to Get Paid</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        {/* Table Section */}
        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="time-to-get-paid-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No customer payment data found"
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeToGetPaidReport;