import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { TicketPagination } from "@/components/TicketPagination";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PaymentReceived {
  id: number;
  payment_number: string;
  payment_number_display: string;
  date: string;
  reference_number: string;
  customer_name: string;
  payment_mode: string;
  notes: string;
  invoice_number: string;
  deposit_to: string;
  amount_fcy: number;
  unused_amount_fcy: number;
  amount_bcy: number;
  unused_amount_bcy: number;
  place_of_supply: string;
  destination_of_supply: string ;
  status: "Paid" | "Draft" | "Void";
}

interface BillPaymentAPI {
  id: number;
  payment_date?: string;
  formatted_number?: string;
}

interface LockPaymentAPI {
  id: number;
  order_number?: string;
  receipt_number?: string;
  payment_number?: string;
  payment_of?: string;
  payment_mode?: string;
  payment_method?: string;
  payment_status?: string;
  created_at?: string;
  paid_amount?: string | number;
  total_amount?: string | number;
  payment_amount?: string | number;
  excess_amount?: string | number;
  place_of_supply?: string;
  destination_of_supply:string;
  neft_reference?: string;
  resident_name?: string;
  notes?: string;
  deposit_to_ledger_id?: number | null;
  bill_payments?: BillPaymentAPI[];
}

const mapLockPayment = (payment: LockPaymentAPI): PaymentReceived => {
  const statusRaw = (payment.payment_status || "").toLowerCase();
  let status: PaymentReceived["status"] = "Draft";

  if (statusRaw === "paid" || statusRaw === "success") {
    status = "Paid";
  } else if (statusRaw === "void" || statusRaw === "failed") {
    status = "Void";
  }

  const rawDate = payment.bill_payments?.[0]?.payment_date || payment.created_at || "";
  const paymentNumber = payment.payment_number || payment.receipt_number || String(payment.id);
  const mode = payment.payment_mode || payment.payment_method || "";
  const amount =
    parseFloat(
      String(payment.paid_amount || payment.payment_amount || payment.total_amount || "0")
    ) || 0;
  const unusedAmount = parseFloat(String(payment.excess_amount || "0")) || 0;

  const invoiceNumbers = (payment.bill_payments || [])
    .map((billPayment) => billPayment.formatted_number)
    .filter(Boolean)
    .join(", ");

  return {
    id: payment.id,
    payment_number: paymentNumber,
    payment_number_display: String(payment.id),
    date: rawDate,
    reference_number: payment.order_number || payment.neft_reference || "",
    customer_name: payment.resident_name || "",
    payment_mode: mode,
    notes: payment.notes || "",
    invoice_number: invoiceNumbers,
    deposit_to: "",
    amount_fcy: amount,
    unused_amount_fcy: unusedAmount,
    amount_bcy: amount,
    unused_amount_bcy: unusedAmount,
    destination_of_supply: payment.destination_of_supply || "",
    status,
  };
};

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const columns: ColumnConfig[] = [
  {
    key: "payment_number_display",
    label: "PAYMENT NUMBER",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  {
    key: "reference_number",
    label: "REFERENCE NUMBER",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "payment_mode", label: "PAYMENT MODE", sortable: true, hideable: false, draggable: true },
  { key: "notes", label: "NOTES", sortable: true, hideable: false, draggable: true },
  { key: "invoice_number", label: "INVOICE#", sortable: true, hideable: false, draggable: true },
  { key: "deposit_to", label: "DEPOSIT TO", sortable: true, hideable: false, draggable: true },
  { key: "amount_fcy", label: "AMOUNT (FCY)", sortable: true, hideable: false, draggable: true },
  {
    key: "unused_amount_fcy",
    label: "UNUSED AMOUNT (FCY)",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  { key: "amount_bcy", label: "AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
  {
    key: "unused_amount_bcy",
    label: "UNUSED AMOUNT (BCY)",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "destination_of_supply",
    label: "PLACE OF SUPPLY",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const PaymentsRecievedReport: React.FC = () => {
  const navigate = useNavigate();
  const lockAccountId = localStorage.getItem("lock_account_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paymentData, setPaymentData] = useState<PaymentReceived[]>([]);
  const [loading, setLoading] = useState(false);
  const [ledgerNameMap, setLedgerNameMap] = useState<Record<string, string>>({});
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false,
  });

  useEffect(() => {
    const fetchLedgerNames = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${baseUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ledgers = response.data?.data || response.data || [];
        const nextLedgerMap = ledgers.reduce(
          (accumulator: Record<string, string>, ledger: { id?: number; name?: string }) => {
            if (ledger?.id) {
              accumulator[String(ledger.id)] = ledger.name || "";
            }
            return accumulator;
          },
          {}
        );

        setLedgerNameMap(nextLedgerMap);
      } catch (error) {
        console.error("Failed to load deposit ledgers", error);
      }
    };

    if (lockAccountId) {
      fetchLedgerNames();
    }
  }, [lockAccountId]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[payment_made_eq]": 0,
          "q[payment_date_gteq]": toApiDate(filters.fromDate),
          "q[payment_date_lteq]": toApiDate(filters.toDate),
          page: currentPage,
          per_page: perPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        const data = response.data;
        const list: LockPaymentAPI[] = data.lock_payments || data || [];
        const mapped = list.map((payment) => {
          const mappedPayment = mapLockPayment(payment);
          return {
            ...mappedPayment,
            deposit_to:
              ledgerNameMap[String(payment.deposit_to_ledger_id || "")] || "Petty Cash",
          };
        });

        setPaymentData(mapped);

        if (data.pagination) {
          setPagination({
            current_page: data.pagination.current_page || currentPage,
            per_page: data.pagination.per_page || perPage,
            total_pages: data.pagination.total_pages || 1,
            total_count: data.pagination.total_count || mapped.length,
            has_next_page:
              (data.pagination.current_page || currentPage) < (data.pagination.total_pages || 1),
            has_prev_page: (data.pagination.current_page || currentPage) > 1,
          });
        } else {
          setPagination((previous) => ({
            ...previous,
            total_count: mapped.length,
            current_page: currentPage,
            per_page: perPage,
            total_pages: 1,
            has_next_page: false,
            has_prev_page: currentPage > 1,
          }));
        }
    } catch (error) {
      console.error("Failed to load payments received report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, perPage, lockAccountId, ledgerNameMap]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totals = useMemo(
    () =>
      paymentData.reduce(
        (accumulator, payment) => ({
          amount_bcy: accumulator.amount_bcy + payment.amount_bcy,
          unused_amount_bcy: accumulator.unused_amount_bcy + payment.unused_amount_bcy,
          amount_fcy: accumulator.amount_fcy + payment.amount_fcy,
          unused_amount_fcy: accumulator.unused_amount_fcy + payment.unused_amount_fcy,
        }),
        { amount_bcy: 0, unused_amount_bcy: 0, amount_fcy: 0, unused_amount_fcy: 0 }
      ),
    [paymentData]
  );

  const tableData = useMemo(() => {
    if (paymentData.length === 0) return paymentData;
    return [
      ...paymentData,
      {
        id: -1,
        payment_number: "",
        payment_number_display: "Total",
        date: "__total__",
        reference_number: "",
        customer_name: "",
        payment_mode: "",
        notes: "",
        invoice_number: "",
        deposit_to: "",
        amount_fcy: totals.amount_fcy,
        unused_amount_fcy: totals.unused_amount_fcy,
        amount_bcy: totals.amount_bcy,
        unused_amount_bcy: totals.unused_amount_bcy,
        destination_of_supply: "",
        status: "__total__" as PaymentReceived["status"],
      },
    ];
  }, [paymentData, totals]);

  const renderRow = (payment: PaymentReceived) => {
    const isTotal = payment.date === "__total__";
    return {
      payment_number_display: (
        <span className={`text-[13px] font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-[#111827]"}`}>
          {payment.payment_number_display}
        </span>
      ),
      date: <span className="text-[13px] text-[#111827]">{isTotal ? "" : formatDate(payment.date)}</span>,
      status: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.status}</span>,
      reference_number: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.reference_number}</span>,
      customer_name: isTotal ? <span /> : (
        <button
          onClick={() => navigate(`/accounting/payments-received/${payment.id}`)}
          className="text-[13px] font-semibold text-[#2563eb]"
        >
          {payment.customer_name || "-"}
        </button>
      ),
      payment_mode: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.payment_mode || "-"}</span>,
      notes: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.notes}</span>,
      invoice_number: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.invoice_number}</span>,
      deposit_to: <span className="text-[13px] text-[#111827]">{isTotal ? "" : payment.deposit_to || "Petty Cash"}</span>,
      amount_fcy: (
        <span className={`text-[13px] font-semibold ${isTotal ? "text-[#1A1A1A]" : "text-[#2563eb]"}`}>
          {formatCurrency(payment.amount_fcy)}
        </span>
      ),
      unused_amount_fcy: (
        <span className={`text-[13px] font-semibold ${isTotal ? "text-[#1A1A1A]" : "text-[#2563eb]"}`}>
          {formatCurrency(payment.unused_amount_fcy)}
        </span>
      ),
      amount_bcy: (
        <span className={`text-[13px] font-semibold ${isTotal ? "text-[#1A1A1A]" : "text-[#2563eb]"}`}>
          {formatCurrency(payment.amount_bcy)}
        </span>
      ),
      unused_amount_bcy: (
        <span className={`text-[13px] font-semibold ${isTotal ? "text-[#1A1A1A]" : "text-[#2563eb]"}`}>
          {formatCurrency(payment.unused_amount_bcy)}
        </span>
      ),
      destination_of_supply : <span className="text-[13px] text-[#111827]">{ payment?.destination_of_supply || "--"}</span>,
    };
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">

      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Payments Received</h3>
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
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => { setCurrentPage(1); fetchPayments(); }}
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Payments Received</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {new Date(`${filters.fromDate}T00:00:00`).toLocaleDateString("en-GB")} To {new Date(`${filters.toDate}T00:00:00`).toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="payments-recieved-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            loading={loading}
            emptyMessage="No payments received found"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-top"
            hideColumnsButton={true}
          />

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

export default PaymentsRecievedReport;