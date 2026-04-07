import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface RawDeliveryChallanItem {
  delivery_challan_number?: string;
  date?: string;
  status?: string;
  invoice_status?: string;
  customer_name?: string;
  amount?: number;
}

type DeliveryChallanRow = {
  id: string;
  deliveryChallanNo: string;
  date: string;
  status: string;
  invoiceStatus: string;
  customerName: string;
  amount: number;
};

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const formatDisplayDate = (value: string) => {
  if (!value) return "--/--/----";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
};

const columns: ColumnConfig[] = [
  { key: "deliveryChallanNo", label: "Delivery Challan#", sortable: true, hideable: true, draggable: true },
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "invoiceStatus", label: "Invoice Status", sortable: true, hideable: true, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, draggable: true },
];

const DeliveryChallanDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<DeliveryChallanRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchDeliveryChallanDetails = useCallback(async () => {
    setLoading(true);
    try {
      // const response = await axios.get(
      //   `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_delivery_challans/delivery_challan_details.json`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //     params: {
      //       from_date: filters.fromDate,
      //       to_date: filters.toDate,
      //     },
      //   }
      // );

      const data =  [];
      const mapped: DeliveryChallanRow[] = (
        Array.isArray(data) ? data : ( [])
      ).map((item: RawDeliveryChallanItem, idx: number) => ({
        id: String(idx),
        deliveryChallanNo: item.delivery_challan_number || "",
        date: item.date || "",
        status: item.status || "",
        invoiceStatus: item.invoice_status || "",
        customerName: item.customer_name || "",
        amount: item.amount || 0,
      }));

      setReportRows(mapped);
    } catch (error) {
      console.error("Error fetching delivery challan details", error);
      setReportRows([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, lock_account_id, token, filters.fromDate, filters.toDate]);

  useEffect(() => {
    fetchDeliveryChallanDetails();
  }, [fetchDeliveryChallanDetails]);

  const reportTotals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({ amount: acc.amount + row.amount }),
        { amount: 0 }
      ),
    [reportRows]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((curr) => ({ ...curr, [name]: value }));
  };

  const handleViewReport = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    fetchDeliveryChallanDetails();
  };

  const renderRow = (row: DeliveryChallanRow) => ({
    deliveryChallanNo: (
      <span className="text-sm font-medium text-blue-600">
        {row.deliveryChallanNo}
      </span>
    ),
    date: (
      <span className="text-sm text-gray-600">
        {formatDisplayDate(row.date)}
      </span>
    ),
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColorMap[row.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {row.status}
      </span>
    ),
    invoiceStatus: (
      <span className="text-sm text-gray-600">
        {row.invoiceStatus}
      </span>
    ),
    customerName: (
      <span className="text-sm font-medium text-blue-600">
        {row.customerName}
      </span>
    ),
    amount: (
      <span className="text-sm font-medium text-gray-900">
        {formatAmount(row.amount)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Delivery Challan Details
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            onClick={handleViewReport}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Delivery Challan Details
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To{" "}
            {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        {/* EnhancedTaskTable */}
        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="delivery-challan-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
            hideColumnsButton={true}
          />

          {/* Totals row */}
          {reportRows.length > 0 && (
            <div className="mt-2 flex justify-end rounded-md bg-[#f9f7f2] px-4 py-3 text-sm font-semibold text-[#1A1A1A] border border-gray-200">
              <span>
                Total Amount:{" "}
                <span className="text-gray-900">
                  {formatAmount(reportTotals.amount)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryChallanDetailsReport;
