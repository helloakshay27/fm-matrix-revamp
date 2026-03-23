import React, { useMemo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";

// ─── TYPES ─────────────────────────────────────────

interface ARAgingDetailRow {
  id: string;
  date: string;
  dueDate: string;
  transactionNo: string;
  type: string;
  status: string;
  customerName: string;
  age: string;
  amount: number;
  balanceDue: number;
  bucket: string;
}

interface BucketSection {
  key: string;
  label: string;
  rows: ARAgingDetailRow[];
}

// ─── COLUMNS ───────────────────────────────────────

const columns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "dueDate", label: "Due Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "age", label: "Age", sortable: true, hideable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, draggable: true },
  { key: "balanceDue", label: "Balance Due", sortable: true, hideable: true, draggable: true },
];

// ─── HELPERS ───────────────────────────────────────

const formatCurrency = (value: number): string =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
};

const BUCKET_LABELS: Record<string, string> = {
  current: "Current",
  "1_15": "1 - 15 Days",
  "16_30": "16 - 30 Days",
  "31_45": "31 - 45 Days",
  gt_45: "> 45 Days",
};

const BUCKET_ORDER = ["current", "1_15", "16_30", "31_45", "gt_45"];

// ─── COMPONENT ─────────────────────────────────────

const ARAgingDetailsReport: React.FC = () => {
  const [allRows, setAllRows] = useState<ARAgingDetailRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "12/03/2026",
  });

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  // ─── DATE CHANGE ────────────────────────────────
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  // ─── API CALL ──────────────────────────────────
  const fetchAgingDetails = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/aging_details.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": filters.fromDate,
            "q[date_lteq]": filters.toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res?.data || [];

      // API may return flat array or object with buckets
      // Handle flat array where each item has aging_bucket / days_overdue
      let mapped: ARAgingDetailRow[] = [];

      if (Array.isArray(apiData)) {
        mapped = apiData.map((d: any, i: number) => {
          const bucket = d.aging_bucket || "current";
          const daysOverdue = d.days_overdue ?? 0;
          return {
            id: String(d.id || i),
            date: formatDate(d.date),
            dueDate: formatDate(d.due_date),
            transactionNo: d.number || d.transaction_no || "--",
            type: d.type || "--",
            status: daysOverdue > 0 ? "Overdue" : "Sent",
            customerName: d.customer_name || d.name || "--",
            age: daysOverdue > 0 ? `${daysOverdue} Days` : "--",
            amount: d.total_amount ?? d.amount ?? 0,
            balanceDue: d.balance_due ?? 0,
            bucket,
          };
        });
      } else if (typeof apiData === "object") {
        // Handle object keyed by bucket: { current: [...], "1_15": [...], ... }
        Object.entries(apiData).forEach(([bucketKey, items]: [string, any]) => {
          const rows = Array.isArray(items) ? items : items?.data || [];
          rows.forEach((d: any, i: number) => {
            const daysOverdue = d.days_overdue ?? 0;
            mapped.push({
              id: `${bucketKey}-${d.id || i}`,
              date: formatDate(d.date),
              dueDate: formatDate(d.due_date),
              transactionNo: d.number || d.transaction_no || "--",
              type: d.type || "--",
              status: daysOverdue > 0 ? "Overdue" : "Sent",
              customerName: d.customer_name || d.name || "--",
              age: daysOverdue > 0 ? `${daysOverdue} Days` : "--",
              amount: d.total_amount ?? d.amount ?? 0,
              balanceDue: d.balance_due ?? 0,
              bucket: bucketKey,
            });
          });
        });
      }

      setAllRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgingDetails();
  }, []);

  // ─── SECTIONS ───────────────────────────────────
  const sections = useMemo<BucketSection[]>(() => {
    const grouped: Record<string, ARAgingDetailRow[]> = {};
    allRows.forEach((row) => {
      if (!grouped[row.bucket]) grouped[row.bucket] = [];
      grouped[row.bucket].push(row);
    });

    return BUCKET_ORDER.filter((k) => grouped[k]?.length > 0).map((k) => ({
      key: k,
      label: BUCKET_LABELS[k] || k,
      rows: grouped[k],
    }));
  }, [allRows]);

  const grandTotals = useMemo(
    () =>
      allRows.reduce(
        (acc, row) => ({
          amount: acc.amount + row.amount,
          balanceDue: acc.balanceDue + row.balanceDue,
        }),
        { amount: 0, balanceDue: 0 }
      ),
    [allRows]
  );

  // ─── RENDER ROW ─────────────────────────────────
  const renderRow = (row: ARAgingDetailRow) => ({
    date: <span className="text-sm text-gray-600">{row.date}</span>,
    dueDate: <span className="text-sm text-gray-600">{row.dueDate}</span>,
    transactionNo: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.transactionNo}
      </span>
    ),
    type: <span className="text-sm text-gray-600">{row.type}</span>,
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColorMap[row.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {row.status}
      </span>
    ),
    customerName: (
      <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
        {row.customerName}
      </span>
    ),
    age: <span className="text-sm text-gray-600">{row.age || "--"}</span>,
    amount: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.amount)}
      </span>
    ),
    balanceDue: (
      <span className="text-sm font-medium text-blue-600">
        {formatCurrency(row.balanceDue)}
      </span>
    ),
  });

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>

      {/* FILTER */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <div className="flex gap-4 mb-4">
          <NotepadText color="#C72030" />
          <h3 className="font-semibold">AR Aging Details</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
          />
          <Button onClick={fetchAgingDetails}>View</Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Page Header */}
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            AR Aging Details By Invoice Due Date
          </h1>
          <p className="mt-1 text-sm text-[#475467]">As of {today}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={allRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="ar-aging-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
            hideColumnsButton={true}
          />

          {/* Section Totals */}
          {sections.map((section) => {
            const sectionTotals = section.rows.reduce(
              (acc, row) => ({
                amount: acc.amount + row.amount,
                balanceDue: acc.balanceDue + row.balanceDue,
              }),
              { amount: 0, balanceDue: 0 }
            );
            return (
              <div
                key={section.key}
                className="mt-2 rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <span>{section.label}</span>
                  <div className="flex gap-6">
                    <span className="text-blue-600">
                      Amount: {formatCurrency(sectionTotals.amount)}
                    </span>
                    <span className="text-blue-600">
                      Balance Due: {formatCurrency(sectionTotals.balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Grand Total */}
          <div className="mt-2 rounded-md bg-[#E5E0D3] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
            <div className="flex justify-between items-center">
              <span>Total</span>
              <div className="flex gap-6">
                <span className="text-blue-600">
                  Amount: {formatCurrency(grandTotals.amount)}
                </span>
                <span className="text-blue-600">
                  Balance Due: {formatCurrency(grandTotals.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARAgingDetailsReport;
