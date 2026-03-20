import React, { useMemo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText, ChevronDown, SlidersHorizontal, SquareGanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ReceivableDetailsRow {
  id: string;
  customerName: string;
  date: string;
  transactionNo: string;
  referenceNo: string;
  status: string;
  transactionType: string;
  itemName: string;
  quantityOrdered: number;
  itemPriceBcy: number;
  totalBcy: number;
}

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDisplayDate = (value: string) => {
  if (!value) return "--/--/----";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const formatCurrency = (value: number): string => {
  const sign = value < 0 ? "-" : "";
  const formatted = Math.abs(Number(value || 0)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}₹${formatted}`;
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Open: "bg-gray-100 text-gray-700",
  Sent: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
};

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "referenceNo", label: "Reference#", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "transactionType", label: "Transaction Type", sortable: true, hideable: true, draggable: true },
  { key: "itemName", label: "Item Name", sortable: true, hideable: true, draggable: true },
  { key: "quantityOrdered", label: "Quantity Ordered", sortable: true, hideable: true, draggable: true },
  { key: "itemPriceBcy", label: "Item Price (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "totalBcy", label: "Total (BCY)", sortable: true, hideable: true, draggable: true },
];

const ReceivableDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<ReceivableDetailsRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://${baseUrl}/lock_account_items/receivable_details.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": toApiDate(filters.fromDate),
            "q[date_lteq]": toApiDate(filters.toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res?.data || [];
      // API returns grouped by item: [{ item_id, item_name, rows: [...] }]
      const mapped: ReceivableDetailsRow[] = apiData.flatMap((group: any, gi: number) =>
        (group.rows || []).map((row: any, ri: number) => ({
          id: `${gi}-${ri}`,
          customerName: row.customer_name || "--",
          date: formatDate(row.date),
          transactionNo: row.transaction_number || "--",
          referenceNo: row.reference_number || "",
          status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "--",
          transactionType: row.transaction_type || "--",
          itemName: row.item_name || group.item_name || "--",
          quantityOrdered: row.quantity_ordered ?? 0,
          itemPriceBcy: row.item_price ?? 0,
          totalBcy: row.total ?? 0,
        }))
      );

      setReportRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({
          quantityOrdered: acc.quantityOrdered + row.quantityOrdered,
          totalBcy: acc.totalBcy + row.totalBcy,
        }),
        { quantityOrdered: 0, totalBcy: 0 }
      ),
    [reportRows]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Append totals as last row inside the table
  const tableData = useMemo(() => {
    if (reportRows.length === 0) return reportRows;
    return [
      ...reportRows,
      {
        id: "__total__",
        customerName: "Total",
        date: "",
        transactionNo: "",
        referenceNo: "",
        status: "",
        transactionType: "",
        itemName: "",
        quantityOrdered: totals.quantityOrdered,
        itemPriceBcy: 0,
        totalBcy: totals.totalBcy,
      },
    ];
  }, [reportRows, totals]);

  const renderRow = (row: ReceivableDetailsRow) => {
    const isTotal = row.id === "__total__";
    return {
      customerName: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {row.customerName}
        </span>
      ),
      date: <span className="text-sm text-gray-600">{row.date}</span>,
      transactionNo: (
        <span className="text-sm font-medium text-blue-600">{row.transactionNo}</span>
      ),
      referenceNo: (
        <span className="text-sm text-gray-600">{row.referenceNo || "--"}</span>
      ),
      status: row.status ? (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ) : <span />,
      transactionType: (
        <span className="text-sm text-gray-600">{row.transactionType}</span>
      ),
      itemName: (
        <span className="text-sm text-gray-600">{row.itemName}</span>
      ),
      quantityOrdered: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {isTotal ? row.quantityOrdered.toFixed(2) : row.quantityOrdered.toFixed(2)}
        </span>
      ),
      itemPriceBcy: (
        <span className="text-sm font-medium text-gray-900">
          {isTotal ? "--" : formatCurrency(row.itemPriceBcy)}
        </span>
      ),
      totalBcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.totalBcy)}
        </span>
      ),
    };
  };

  return (
    <div
      className="w-full bg-[#f9f7f2]"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      {/* Filter Bar */}
      <div className="border-b border-[#EAECF0] bg-white px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-5 w-5" />
          </div>
          <span className="font-semibold text-[#1A1A1A]">Receivable Details</span>
        </div>

        <div className="flex items-center gap-4">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={fetchData}
          >
            View
          </Button>
        </div>

        <div className="flex items-center gap-5 text-sm text-[#667085]">
          <button className="flex items-center gap-2 hover:text-[#475467]">
            <SquareGanttChart className="h-4 w-4" />
            <span>
              Group By : <span className="font-semibold text-[#1A1A1A]">None</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 hover:text-[#475467]">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-[#1A1A1A]">Customize Report Columns</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E7EEF9] px-1.5 text-xs font-semibold text-[#2563EB]">
              10
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden m-6 mt-4">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Receivable Details
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="receivable-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />
        </div>
      </div>
    </div>
  );
};

export default ReceivableDetailsReport;
