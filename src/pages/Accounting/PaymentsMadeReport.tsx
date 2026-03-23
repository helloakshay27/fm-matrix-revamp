import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { TicketPagination } from "@/components/TicketPagination";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface PaymentMadeRow {
  id: number;
  date?: string;
  reference_number?: string;
  bill_numbers?: string;
  vendor_name?: string;
  payment_mode?: string;
  notes?: string;
  deposit_to?: string;
  amount_fcy?: number;
  amount_bcy?: number;
  status?: string;
}

interface BillPaymentAPI {
  formatted_number?: string;
  payment_date?: string;
}

interface LockPaymentAPI {
  id: number;
  order_number?: string;
  neft_reference?: string;
  resident_name?: string;
  vendor_name?: string;
  payment_mode?: string;
  payment_method?: string;
  notes?: string;
  deposit_to_ledger_name?: string;
  paid_amount?: string | number;
  payment_amount?: string | number;
  total_amount?: string | number;
  payment_status?: string;
  payment_status_text?: string;
  created_at?: string;
  bill_payments?: BillPaymentAPI[];
}

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "reference_number", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "bill_numbers", label: "BILL#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "payment_mode", label: "PAYMENT MODE", sortable: true, hideable: false, draggable: true },
  { key: "notes", label: "NOTES", sortable: true, hideable: false, draggable: true },
  { key: "deposit_to", label: "PAID THROUGH", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "amount_bcy", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_fcy", label: "AMOUNT (FCY)", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const PaymentsMadeReport: React.FC = () => {
  const navigate = useNavigate();
  const lockAccountId = localStorage.getItem("lock_account_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState<PaymentMadeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false,
  });

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

  const fetchPaymentsMade = useCallback(
    async (fromDate: string, toDate: string, page: number, pageSize: number) => {
      setLoading(true);
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
          params: {
            lock_account_id: lockAccountId,
            "q[payment_made_eq]": 1,
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
            page,
            per_page: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const list: LockPaymentAPI[] = response.data.lock_payments || response.data || [];

        const mapped: PaymentMadeRow[] = (list || []).map((p) => {
          const billNums = (p.bill_payments || [])
            .map((b) => b.formatted_number)
            .filter(Boolean)
            .join(",");

          return {
            id: p.id,
            date: p.bill_payments?.[0]?.payment_date || p.created_at,
            reference_number: p.order_number || p.neft_reference || "",
            bill_numbers: billNums,
            vendor_name: p.resident_name || p.vendor_name || "",
            payment_mode: p.payment_mode || p.payment_method || "",
            notes: p.notes || "",
            deposit_to: p.deposit_to_ledger_name || "Petty Cash",
            amount_fcy: parseFloat(String(p.paid_amount || p.payment_amount || p.total_amount || 0)) || 0,
            amount_bcy: parseFloat(String(p.paid_amount || p.payment_amount || p.total_amount || 0)) || 0,
            status: (p.payment_status || p.payment_status_text || "").toString(),
          };
        });

        setData(mapped);

        if (response.data.pagination) {
          const pg = response.data.pagination;
          setPagination({
            current_page: pg.current_page || page,
            per_page: pg.per_page || pageSize,
            total_pages: pg.total_pages || 1,
            total_count: pg.total_count || mapped.length,
            has_next_page: (pg.current_page || page) < (pg.total_pages || 1),
            has_prev_page: (pg.current_page || page) > 1,
          });
        } else {
          setPagination((prev) => ({ ...prev, total_count: mapped.length }));
        }
      } catch (err) {
        console.error("Failed to fetch payments made", err);
      } finally {
        setLoading(false);
      }
    },
    [lockAccountId]
  );

  useEffect(() => {
    fetchPaymentsMade(filters.fromDate, filters.toDate, currentPage, perPage);
  }, [currentPage, perPage, fetchPaymentsMade, filters.fromDate, filters.toDate]);

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, row) => ({ amount_bcy: acc.amount_bcy + (row.amount_bcy || 0), amount_fcy: acc.amount_fcy + (row.amount_fcy || 0) }),
        { amount_bcy: 0, amount_fcy: 0 }
      ),
    [data]
  );

  const renderRow = (row: PaymentMadeRow) => ({
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    reference_number: <span className="text-[13px] text-[#111827]">{row.reference_number || ""}</span>,
    bill_numbers: <span className="text-[13px] text-[#111827]">{row.bill_numbers || ""}</span>,
    vendor_name: (
      <button onClick={() => navigate(`/accounting/payments-made/${row.id}`)} className="text-[13px] font-semibold text-[#2563eb]">
        {row.vendor_name || "-"}
      </button>
    ),
    payment_mode: <span className="text-[13px] text-[#111827]">{row.payment_mode || "-"}</span>,
    notes: <span className="text-[13px] text-[#111827]">{row.notes || ""}</span>,
    deposit_to: <span className="text-[13px] text-[#111827]">{row.deposit_to || "Petty Cash"}</span>,
    status: <span className="text-[13px] text-[#111827]">{row.status || ""}</span>,
    amount_bcy: <span className="text-[13px] font-semibold text-[#111827]">{formatCurrency(row.amount_bcy || 0)}</span>,
    amount_fcy: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount_fcy || 0)}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Payments Made</h3>
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
              onClick={() => {
                setCurrentPage(1);
                fetchPaymentsMade(filters.fromDate, filters.toDate, 1, perPage);
              }}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Payments Made</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={data}
            columns={columns}
            renderRow={renderRow}
            storageKey="payments-made-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No payments made found"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-top"
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
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount_bcy)}</div>
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount_fcy)}</div>
          </div>

          {pagination.total_count > 0 && (
            <div className="px-6 py-4">
              <TicketPagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                totalRecords={pagination.total_count}
                perPage={pagination.per_page}
                isLoading={loading}
                onPageChange={setCurrentPage}
                onPerPageChange={(value) => {
                  setPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsMadeReport;
