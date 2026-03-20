import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    place_of_supply: payment.place_of_supply || "",
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
    key: "place_of_supply",
    label: "PLACE OF SUPPLY",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const PaymentsRecievedReport: React.FC = () => {
  const navigate = useNavigate();
  const lockAccountId = localStorage.getItem("lock_account_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paymentData, setPaymentData] = useState<PaymentReceived[]>([]);
  const [loading, setLoading] = useState(false);
  const [ledgerNameMap, setLedgerNameMap] = useState<Record<string, string>>({});
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

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);

      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
          params: {
            lock_account_id: lockAccountId,
            "q[payment_made_eq]": 0,
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

    fetchPayments();
  }, [currentPage, perPage, lockAccountId, ledgerNameMap]);

  const reportDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return `${formatDate(firstDay.toISOString())} To ${formatDate(lastDay.toISOString())}`;
  }, []);

  const totals = useMemo(
    () =>
      paymentData.reduce(
        (accumulator, payment) => ({
          amount_bcy: accumulator.amount_bcy + payment.amount_bcy,
          unused_amount_bcy: accumulator.unused_amount_bcy + payment.unused_amount_bcy,
        }),
        { amount_bcy: 0, unused_amount_bcy: 0 }
      ),
    [paymentData]
  );

  const renderRow = (payment: PaymentReceived) => ({
    payment_number_display: <span className="text-[13px] font-medium text-[#111827]">{payment.payment_number_display}</span>,
    date: <span className="text-[13px] text-[#111827]">{formatDate(payment.date)}</span>,
    status: <span className="text-[13px] text-[#111827]">{payment.status}</span>,
    reference_number: <span className="text-[13px] text-[#111827]">{payment.reference_number || ""}</span>,
    customer_name: (
      <button
        onClick={() => navigate(`/accounting/payments-received/${payment.id}`)}
        className="text-[13px] font-semibold text-[#2563eb]"
      >
        {payment.customer_name || "-"}
      </button>
    ),
    payment_mode: <span className="text-[13px] text-[#111827]">{payment.payment_mode || "-"}</span>,
    notes: <span className="text-[13px] text-[#111827]">{payment.notes || ""}</span>,
    invoice_number: (
      <div className="text-[13px] text-[#111827] whitespace-pre-line break-words">{payment.invoice_number || ""}</div>
    ),
    deposit_to: <span className="text-[13px] text-[#111827]">{payment.deposit_to || "Petty Cash"}</span>,
    amount_fcy: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(payment.amount_fcy)}</span>
    ),
    unused_amount_fcy: (
      <span className="text-[13px] font-semibold text-[#2563eb]">
        {formatCurrency(payment.unused_amount_fcy)}
      </span>
    ),
    amount_bcy: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(payment.amount_bcy)}</span>
    ),
    unused_amount_bcy: (
      <span className="text-[13px] font-semibold text-[#2563eb]">
        {formatCurrency(payment.unused_amount_bcy)}
      </span>
    ),
    place_of_supply: <span className="text-[13px] text-[#111827]">{payment.place_of_supply || ""}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Payments Received</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {reportDateRange}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={paymentData}
            columns={columns}
            renderRow={renderRow}
            storageKey="payments-recieved-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No payments received found"
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
            <div />
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount_bcy)}</div>
            <div className="text-right font-semibold text-[#111827]">
              {formatCurrency(totals.unused_amount_bcy)}
            </div>
            <div />
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

export default PaymentsRecievedReport;