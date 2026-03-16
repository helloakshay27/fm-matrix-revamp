import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple details page for a Payment Received (uses existing theme / tailwind styles)
interface PaymentReceived {
  id: number;
  payment_number: string;
  date: string;
  type: string;
  reference_number: string;
  customer_name: string;
  invoice_number: string;
  mode: string;
  amount: number;
  unused_amount: number;
  excess_amount: number;
  bank_charges: number;
  payment_amount: number;
  tax_deducted: boolean;
  deposit_to_ledger_id: number | null;
  payment_of_id: number | null;
  status: "PAID" | "DRAFT" | "VOID";
  notes?: string;
}

interface TransactionRecord {
  id: number;
  ledger_id: number;
  ledger_name: string;
  tr_type: "dr" | "cr";
  amount: number;
}

interface LockAccountTransaction {
  id: number;
  transaction_date: string;
  transaction_type: string;
  description: string;
  transaction_records: TransactionRecord[];
}

interface BillPayment {
  id: number;
  payment_date: string;
  amount: number;
  resource_id: number;
  resource_type: string;
  formatted_number?: string;
  with_holding_tax?: number | null;
}

interface LockPaymentAPI {
  id: number;
  payment_number?: string;
  receipt_number?: string;
  order_number?: string;
  payment_of?: string;
  payment_of_id?: number;
  payment_status?: string;
  payment_date?: string;
  created_at?: string;
  payment_mode?: string;
  payment_method?: string;
  total_amount?: string;
  paid_amount?: string;
  payment_amount?: string;
  neft_reference?: string;
  pg_transaction_id?: string;
  payment_gateway?: string;
  bank_name?: string;
  bank_charges?: string;
  invoice_number?: string;
  notes?: string;
  payment_made?: boolean;
  tax_deducted?: boolean;
  tds_lock_account_ledger_id?: number;
  deposit_to_ledger_id?: number;
  excess_amount?: string;
  resident_name?: string;
  bill_payments?: BillPayment[];
  lock_account_transactions?: LockAccountTransaction[];
  lock_bill_payments?: Array<{
    id: number;
    resource_id: number;
    resource_type: string;
    amount: string;
    payment_date?: string;
  }>;
}

const mapLockPayment = (lp: LockPaymentAPI): PaymentReceived => {
  const statusRaw = (lp.payment_status || "").toLowerCase();
  let status: PaymentReceived["status"] = "DRAFT";
  if (statusRaw === "paid" || statusRaw === "success") status = "PAID";
  else if (statusRaw === "void" || statusRaw === "failed") status = "VOID";
  // If payment_status is null but paid_amount > 0, treat as PAID
  else if (!lp.payment_status && parseFloat(lp.paid_amount || "0") > 0)
    status = "PAID";

  // Prefer payment_date, fallback to created_at
  const rawDate = lp.payment_date || lp.created_at;
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  return {
    id: lp.id,
    payment_number:
      lp.payment_number ||
      lp.receipt_number ||
      lp.order_number ||
      String(lp.id),
    date,
    type: lp.payment_of || "Invoice Payment",
    reference_number: lp.order_number || "",
    customer_name: "", // Will be fetched separately via payment_of_id
    invoice_number: lp.invoice_number || "",
    mode: lp.payment_mode || lp.payment_method || "",
    amount: parseFloat(lp.paid_amount || lp.total_amount || "0") || 0,
    unused_amount: 0,
    excess_amount: parseFloat(lp.excess_amount || "0") || 0,
    bank_charges: parseFloat(lp.bank_charges || "0") || 0,
    payment_amount: parseFloat(lp.payment_amount || lp.paid_amount || "0") || 0,
    tax_deducted: lp.tax_deducted || false,
    deposit_to_ledger_id: lp.deposit_to_ledger_id || null,
    payment_of_id: lp.payment_of_id || null,
    status,
    notes: lp.notes || "",
  };
};

export const PaymentReceivedDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const lock_account_id = localStorage.getItem("lock_account_id");
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [payment, setPayment] = React.useState<PaymentReceived | null>(null);
  const [sidebarList, setSidebarList] = React.useState<PaymentReceived[]>([]);
  const [customerName, setCustomerName] = React.useState<string>("");
  const [depositLedgerName, setDepositLedgerName] = React.useState<string>("");
  const [transactionRecords, setTransactionRecords] = React.useState<
    TransactionRecord[]
  >([]);
  const [billPayments, setBillPayments] = React.useState<BillPayment[]>([]);

  // fetch payment details
  React.useEffect(() => {
    if (!id) return;
    axios
      .get(`https://${baseUrl}/lock_payments/${id}.json`, {
        headers: authHeaders,
      })
      .then((res) => {
        const data: LockPaymentAPI = res.data.lock_payment || res.data || {};
        const mapped = mapLockPayment(data);
        setPayment(mapped);

        // Store bill_payments from API
        if (data.bill_payments && data.bill_payments.length > 0) {
          setBillPayments(data.bill_payments);
        }

        // Store transaction_records from lock_account_transactions
        if (
          data.lock_account_transactions &&
          data.lock_account_transactions.length > 0
        ) {
          const allRecords = data.lock_account_transactions.flatMap(
            (txn) => txn.transaction_records || []
          );
          setTransactionRecords(allRecords);
        }

        // Fetch customer name if payment_of_id exists
        if (mapped.payment_of_id) {
          axios
            .get(
              `https://${baseUrl}/lock_account_customers/${mapped.payment_of_id}.json?lock_account_id=${lock_account_id}`,
              { headers: authHeaders }
            )
            .then((custRes) => {
              const cust =
                custRes.data?.lock_account_customer || custRes.data || {};
              const name =
                [cust.salutation, cust.first_name, cust.last_name]
                  .filter(Boolean)
                  .join(" ") ||
                cust.company_name ||
                cust.email ||
                "";
              setCustomerName(name);
            })
            .catch(() => setCustomerName("Customer #" + mapped.payment_of_id));
        }

        // Fetch deposit ledger name if deposit_to_ledger_id exists
        if (mapped.deposit_to_ledger_id) {
          axios
            .get(
              `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_ledgers.json`,
              { headers: authHeaders }
            )
            .then((ledgerRes) => {
              const ledgers = ledgerRes.data?.data || ledgerRes.data || [];
              const found = ledgers.find(
                (l: any) => l.id === mapped.deposit_to_ledger_id
              );
              setDepositLedgerName(found?.name || "Petty Cash");
            })
            .catch(() => setDepositLedgerName("Petty Cash"));
        } else {
          setDepositLedgerName("Petty Cash");
        }
      })
      .catch((e) => console.error("Failed to fetch payment detail", e));
  }, [id]);

  // fetch sidebar list of recent received payments
  React.useEffect(() => {
    axios
      .get(`https://${baseUrl}/lock_payments.json`, {
        params: {
          lock_account_id: lock_account_id,
          "q[payment_made_eq]": 0,
          per_page: 20,
        },
        headers: authHeaders,
      })
      .then((res) => {
        const list: LockPaymentAPI[] = res.data.lock_payments || res.data || [];
        setSidebarList(list.map(mapLockPayment));
      })
      .catch((e) => console.error("Failed to load sidebar payments", e));
  }, []);

  const selected = payment || sidebarList[0] || null;

  const amountFormatted = selected
    ? `₹${selected.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "₹0.00";

  const notesText = selected?.notes || "";

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Left sidebar - static for now, clickable items navigate to detail route */}

        {/* Main content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-semibold">
                Payment Received - {selected ? selected.payment_number : "-"}
              </h2>
              {selected && (
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                    selected.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : selected.status === "VOID"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selected.status}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white shadow-sm border rounded">
            {/* Ribbon */}
            <div className="relative">
              {selected && (
                <div className="absolute -top-3 left-0 z-10">
                  <div
                    className={`text-white px-4 py-1 rotate-[-45deg] transform origin-left shadow text-sm font-medium ${
                      selected.status === "PAID"
                        ? "bg-green-500"
                        : selected.status === "VOID"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    {selected.status === "PAID"
                      ? "Paid"
                      : selected.status === "VOID"
                        ? "Void"
                        : "Draft"}
                  </div>
                </div>
              )}
              <div className="p-10">
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-8">
                    <h3 className="text-xl font-semibold">Lockated</h3>
                    <div className="text-sm text-gray-500 mt-2">
                      pune Maharashtra 411006
                      <br />
                      India
                      <br />
                      ajay.pihulkar@lockated.com
                    </div>
                  </div>

                  <div className="col-span-4 flex justify-end">
                    <div className="bg-green-500 text-white p-6 rounded shadow text-center">
                      <div className="text-sm">Amount Received</div>
                      <div className="text-2xl font-semibold mt-2">
                        {amountFormatted}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />

                <h4 className="text-center text-lg font-semibold mb-6">
                  PAYMENT RECEIPT
                </h4>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 space-y-4 text-sm text-gray-600">
                    <div>
                      <div className="text-gray-500">Payment Date</div>
                      <div className="font-semibold">
                        {selected?.date || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Notes</div>
                      <div className="font-semibold">{notesText || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Reference Number</div>
                      <div className="font-semibold">
                        {selected ? selected.reference_number || "-" : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Payment Mode</div>
                      <div className="font-semibold">
                        {selected ? selected.mode : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">
                        Amount Received In Words
                      </div>
                      <div className="font-semibold">
                        {/* Simple placeholder; in real app convert number to words */}
                        {selected ? `Indian Rupee ${selected.amount} Only` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="text-sm text-gray-600">Received From</div>
                    <div className="mt-2">
                      <a className="text-blue-600 font-medium">
                        {customerName ||
                          (selected
                            ? `Customer #${selected.payment_of_id}`
                            : "")}
                      </a>
                    </div>
                    <div className="mt-8 text-gray-400 text-sm text-right">
                      Authorized Signature
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-lg font-semibold mb-3">Payment for</div>
                  <div className="overflow-x-auto border rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">Invoice Number</th>
                          <th className="p-3 text-left">Invoice Date</th>
                          <th className="p-3 text-right">Invoice Amount</th>
                          <th className="p-3 text-right">Payment Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billPayments.map((bp) => (
                          <tr key={bp.id} className="border-t">
                            <td className="p-3 text-blue-600">
                              {bp.formatted_number || `INV-${bp.resource_id}`}
                            </td>
                            <td className="p-3">
                              {bp.payment_date
                                ? new Date(bp.payment_date).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </td>
                            <td className="p-3 text-right">
                              ₹
                              {Math.abs(bp.amount).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="p-3 text-right">
                              ₹
                              {Math.abs(bp.amount).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="text-lg font-semibold mb-4">
                    More Information
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4 text-sm text-gray-600">
                      Deposit To:{" "}
                      <span className="font-medium text-gray-900">
                        {depositLedgerName}
                      </span>
                    </div>
                    <div className="col-span-4 text-sm text-gray-600">
                      Bank Charges:{" "}
                      <span className="font-medium text-gray-900">
                        ₹
                        {(selected?.bank_charges || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="col-span-4 text-sm text-gray-600">
                      Tax Deducted:{" "}
                      <span className="font-medium text-gray-900">
                        {selected?.tax_deducted ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  {(selected?.excess_amount || 0) > 0 && (
                    <div className="mb-4 text-sm text-orange-600 font-medium">
                      ⚠ Excess Amount: ₹
                      {selected!.excess_amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}

                  <div className="mt-6 overflow-x-auto border rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Account</th>
                          <th className="p-3 text-right">Debit</th>
                          <th className="p-3 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionRecords.map((rec) => {
                          const absAmount = Math.abs(rec.amount);
                          const formatted = `₹${absAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                          return (
                            <tr key={rec.id} className="border-t">
                              <td className="p-3">{rec.ledger_name}</td>
                              <td className="p-3 text-right">
                                {rec.tr_type === "dr" ? formatted : "0.00"}
                              </td>
                              <td className="p-3 text-right">
                                {rec.tr_type === "cr" ? formatted : "0.00"}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="border-t font-semibold">
                          <td className="p-3">Total</td>
                          <td className="p-3 text-right">
                            ₹
                            {transactionRecords
                              .filter((r) => r.tr_type === "dr")
                              .reduce((sum, r) => sum + Math.abs(r.amount), 0)
                              .toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </td>
                          <td className="p-3 text-right">
                            ₹
                            {transactionRecords
                              .filter((r) => r.tr_type === "cr")
                              .reduce((sum, r) => sum + Math.abs(r.amount), 0)
                              .toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentReceivedDetailsPage;
