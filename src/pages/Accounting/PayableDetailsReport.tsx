import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface BillItemApi {
  id?: number;
  item_name?: string;
  name?: string;
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
  bill_number?: string;
  reference_number?: string;
  vendor_name?: string;
  resident_name?: string;
  transaction_type?: string;
  lock_account_bill_items?: BillItemApi[];
  lock_account_bill_charges?: BillItemApi[];
  item_details?: BillItemApi[];
  bill_items?: BillItemApi[];
}

interface PayableDetailsRow {
  id: string;
  status: string;
  date: string;
  transaction_number: string;
  vendor_name: string;
  transaction_type: string;
  item_name: string;
  quantity_ordered: number;
  item_price_bcy: number;
  item_amount_bcy: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "transaction_type", label: "TRANSACTION TYPE", sortable: true, hideable: false, draggable: true },
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "quantity_ordered", label: "QUANTITY ORDERED", sortable: true, hideable: false, draggable: true },
  { key: "item_price_bcy", label: "ITEM PRICE (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "item_amount_bcy", label: "ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

const normalizeStatus = (status?: string) => {
  const value = (status || "open").toString().trim().toLowerCase();
  if (!value) return "Open";
  return value.charAt(0).toUpperCase() + value.slice(1);
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

const PayableDetailsReport: React.FC = () => {
  const [rows, setRows] = useState<PayableDetailsRow[]>([]);
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

  const fetchPayableDetails = useCallback(async (fromDate: string, toDate: string) => {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bills: BillApi[] = response.data?.data || response.data?.lock_account_bills || response.data || [];

      const getBillItems = (bill: BillApi): BillItemApi[] => {
        return (
          bill.lock_account_bill_items ||
          bill.lock_account_bill_charges ||
          bill.item_details ||
          bill.bill_items ||
          []
        );
      };

      const mappedRows: PayableDetailsRow[] = (bills || [])
        .filter((bill) => isWithinRange(bill.bill_date || bill.date || bill.created_at || "", fromDate, toDate))
        .flatMap((bill) => {
          const billDate = bill.bill_date || bill.date || bill.created_at || "";
          const billItems = getBillItems(bill);

          if (!billItems.length) {
            return [
              {
                id: `${bill.id}-fallback`,
                status: normalizeStatus(bill.status),
                date: billDate,
                transaction_number: bill.bill_number || bill.reference_number || String(bill.id),
                vendor_name: bill.vendor_name || bill.resident_name || "-",
                transaction_type: bill.transaction_type || "Bill",
                item_name: "-",
                quantity_ordered: 0,
                item_price_bcy: 0,
                item_amount_bcy: 0,
              },
            ];
          }

          return billItems.map((item, index) => {
            const quantity = parseAmount(item.quantity ?? item.qty);
            const rate = parseAmount(item.rate ?? item.unit_price);
            const amount = parseAmount(item.amount ?? item.total_amount) || quantity * rate;

            return {
              id: `${bill.id}-${item.id || index}`,
              status: normalizeStatus(bill.status),
              date: billDate,
              transaction_number: bill.bill_number || bill.reference_number || String(bill.id),
              vendor_name: bill.vendor_name || bill.resident_name || "-",
              transaction_type: bill.transaction_type || "Bill",
              item_name: item.item_name || item.name || "-",
              quantity_ordered: quantity,
              item_price_bcy: rate,
              item_amount_bcy: amount,
            };
          });
        });

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch payable details report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayableDetails(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPayableDetails]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          quantity_ordered: acc.quantity_ordered + row.quantity_ordered,
          item_amount_bcy: acc.item_amount_bcy + row.item_amount_bcy,
        }),
        { quantity_ordered: 0, item_amount_bcy: 0 }
      ),
    [rows]
  );

  const renderRow = (row: PayableDetailsRow) => ({
    status: (
      <span className={`text-[13px] ${row.status.toLowerCase() === "paid" ? "text-[#059669]" : "text-[#2563eb]"}`}>
        {row.status}
      </span>
    ),
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    transaction_number: <span className="text-[13px] font-semibold text-[#2563eb]">{row.transaction_number}</span>,
    vendor_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>,
    transaction_type: <span className="text-[13px] text-[#111827]">{row.transaction_type}</span>,
    item_name: <span className="text-[13px] text-[#111827]">{row.item_name}</span>,
    quantity_ordered: <span className="text-[13px] text-[#111827]">{row.quantity_ordered.toFixed(2)}</span>,
    item_price_bcy: <span className="text-[13px] text-[#111827]">{formatCurrency(row.item_price_bcy)}</span>,
    item_amount_bcy: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.item_amount_bcy)}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Payable Details</h3>
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
              onClick={() => fetchPayableDetails(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Payable Details</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="payable-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
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
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{totals.quantity_ordered.toFixed(2)}</div>
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.item_amount_bcy)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayableDetailsReport;
