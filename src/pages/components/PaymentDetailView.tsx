{/* =========================================
   PAYMENT MADE DETAILS PAGE
   Separate Details View + PDF View
   Similar to Payment Received Page
========================================= */}

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit2,
  Download,
  Printer,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import PaymentMadePdf from "../ClubManagement/PaymentMadePdfTemplate";

interface PaymentMade {
  id: number;
  payment_number: string;
  date: string;
  vendor_name: string;
  payment_mode: string;
  reference_number: string;
  paid_through_account: string;
  amount: number;
  tds_amount?: number;
  tds_percentage?: number;
  net_amount?: number;
  status: "PAID" | "DRAFT" | "VOID";
  notes?: string;
}

interface BillPayment {
  id: number;
  formatted_number?: string;
  payment_date?: string;
  amount: number;
  resource_id: number;
}

interface JournalEntry {
  id: number | string;
  account: string;
  debit: number;
  credit: number;
}

interface PaymentMadeDetailsPageProps {
  selectedPaymentId?: string | null;
  onClose?: () => void;
  onSelectPayment?: (id: string) => void;
  payments?: unknown[];
}

const toAmount = (value: any): number => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
};

const normalizeBillPayments = (data: any): BillPayment[] => {
  const rows =
    data?.bill_payments ||
    data?.lock_bill_payments ||
    data?.lock_bill_payments_attributes ||
    data?.payment_bills ||
    data?.bills ||
    [];

  return Array.isArray(rows)
    ? rows.map((row: any, index: number) => ({
        id: Number(row.id || row.resource_id || index),
        formatted_number:
          row.formatted_number ||
          row.bill_number ||
          row.invoice_number ||
          row.resource_number ||
          row.number,
        payment_date:
          row.payment_date ||
          row.bill_date ||
          row.invoice_date ||
          row.date ||
          data?.payment_date,
        amount:
          Number(
            row.amount ||
              row.payment_amount ||
              row.bill_amount ||
              row.invoice_amount ||
              0
          ) || 0,
        resource_id: Number(row.resource_id || row.id || 0) || 0,
      }))
    : [];
};

const normalizeJournalEntries = (data: any): JournalEntry[] => {
  const transactionRecords =
    data?.transaction_records ||
    data?.lock_account_transaction_records ||
    [];
  const nestedTransactionRecords = Array.isArray(
    data?.lock_account_transactions
  )
    ? data.lock_account_transactions.flatMap(
        (txn: any) => txn?.transaction_records || []
      )
    : [];
  const rows = [
    ...(Array.isArray(transactionRecords)
      ? transactionRecords
      : []),
    ...nestedTransactionRecords,
    ...(Array.isArray(data?.journal_entries)
      ? data.journal_entries
      : []),
    ...(Array.isArray(data?.journal_entry_lines)
      ? data.journal_entry_lines
      : []),
    ...(Array.isArray(data?.journal_items)
      ? data.journal_items
      : []),
    ...(Array.isArray(data?.ledger_entries)
      ? data.ledger_entries
      : []),
    ...(Array.isArray(data?.transaction_entries)
      ? data.transaction_entries
      : []),
    ...(Array.isArray(data?.transactions)
      ? data.transactions
      : []),
    ...(Array.isArray(data?.lock_journal_entries)
      ? data.lock_journal_entries
      : []),
    ...(Array.isArray(data?.journal?.journal_entries)
      ? data.journal.journal_entries
      : []),
    ...(Array.isArray(data?.journal?.journal_entry_lines)
      ? data.journal.journal_entry_lines
      : []),
    ...(Array.isArray(
      data?.accounting_transaction?.journal_entries
    )
      ? data.accounting_transaction.journal_entries
      : []),
  ];

  if (!Array.isArray(rows)) return [];

  return rows
    .map((row: any, index: number) => {
      const account =
        row.account_name ||
        row.account ||
        row.ledger_name ||
        row.lock_account_ledger_name ||
        row.account_ledger_name ||
        row.particular ||
        row.particulars ||
        row.name ||
        "";

      const type = String(
        row.tr_type ||
          row.entry_type ||
          row.transaction_type ||
          row.type ||
          row.dr_cr ||
          row.debit_credit ||
          ""
      ).toLowerCase();

      let debit = toAmount(
        row.debit ||
          row.dr ||
          row.debit_amount ||
          row.dr_amount ||
          row.debit_value
      );
      let credit = toAmount(
        row.credit ||
          row.cr ||
          row.credit_amount ||
          row.cr_amount ||
          row.credit_value
      );

      if (row.tr_type && row.amount) {
        if (type === "cr") {
          debit = 0;
          credit = Math.abs(toAmount(row.amount));
        } else if (type === "dr") {
          debit = Math.abs(toAmount(row.amount));
          credit = 0;
        }
      }

      if (!debit && !credit && row.amount) {
        if (type.includes("credit") || type === "cr") {
          credit = toAmount(row.amount);
        } else {
          debit = toAmount(row.amount);
        }
      }

      return {
        id: row.id || `${account || "journal"}-${index}`,
        account,
        debit,
        credit,
      };
    })
    .filter(
      (row) =>
        row.account || row.debit > 0 || row.credit > 0
    );
};

export const PaymentMadeDetailsPage: React.FC<PaymentMadeDetailsPageProps> = ({
  selectedPaymentId,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const detailsId = id;
  // selectedPaymentId || 

  const pdfRef = React.useRef<HTMLDivElement>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const [activeTab, setActiveTab] =
    React.useState("details");

  const [payment, setPayment] =
    React.useState<PaymentMade | null>(null);

  const [billPayments, setBillPayments] =
    React.useState<BillPayment[]>([]);

  const [journalEntries, setJournalEntries] =
    React.useState<JournalEntry[]>([]);

  React.useEffect(() => {
    if (!detailsId) return;

    const apiBase = baseUrl
      ? baseUrl.startsWith("http")
        ? baseUrl
        : `https://${baseUrl}`
      : "https://club-uat-api.lockated.com";
    const lockAccountId = localStorage.getItem("lock_account_id") || "3";

    axios
      .get(`${apiBase.replace(/\/+$/, "")}/lock_payments.json`, {
        headers: token ? authHeaders : undefined,
        params: {
          lock_account_id: lockAccountId,
          "q[payment_made_eq]": 1,
          "q[id_eq]": detailsId,
          page: 1,
          per_page: 10,
        },
      })
      .then((res) => {
        const list = Array.isArray(res.data?.lock_payments)
          ? res.data.lock_payments
          : Array.isArray(res.data)
          ? res.data
          : [];
        const data =
          list.find((row: any) => String(row?.id) === String(detailsId)) ||
          res.data?.lock_payment ||
          list[0] ||
          res.data ||
          {};

        setPayment({
          id: data.id,
          payment_number:
            data.payment_number ||
            data.receipt_number ||
            data.order_number ||
            String(data.id),

          date: data.payment_date
            ? new Date(
                data.payment_date
              ).toLocaleDateString("en-GB")
            : "-",

          vendor_name:
            data.vendor_name ||
            data.resident_name ||
            data.payment_to_name ||
            data.payment_of ||
            "Vendor",

          payment_mode:
            data.payment_mode || "",

          reference_number:
            data.reference_number ||
            data.neft_reference ||
            data.order_number ||
            data.pg_transaction_id ||
            "",

          paid_through_account:
            data.paid_through_account ||
            data.deposit_to_ledger_name ||
            data.deposit_to_ledger ||
            data.payment_gateway ||
            data.bank_name ||
            "Petty Cash",

          amount:
            Number(
              data.paid_amount ||
                data.payment_amount ||
                data.total_amount ||
                0
            ) || 0,

          tds_amount:
            Number(data.tds_amount || 0) || 0,

          tds_percentage:
            Number(data.tds_percentage || 0) || 0,

          net_amount:
            Number(data.net_amount || 0) || 0,

          notes: data.notes || "",

          status:
            data.payment_status === "paid"
              ? "PAID"
              : data.payment_status === "void"
              ? "VOID"
              : "DRAFT",
        });

        setBillPayments(normalizeBillPayments(data));

        const journalRows = normalizeJournalEntries(data);
        setJournalEntries(journalRows);

        if (!journalRows.length) {
          axios
            .get(
              `${apiBase.replace(
                /\/+$/,
                ""
              )}/lock_payments/${detailsId}.json`,
              {
                headers: token ? authHeaders : undefined,
                params: {
                  lock_account_id: lockAccountId,
                },
              }
            )
            .then((detailsRes) => {
              const detailsData =
                detailsRes.data?.lock_payment ||
                detailsRes.data ||
                {};
              setJournalEntries(
                normalizeJournalEntries(detailsData)
              );
            })
            .catch((detailsErr) => {
              console.error(detailsErr);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [detailsId, baseUrl, token]);

  const handleDownloadPdf = async () => {
    try {
      const input = pdfRef.current;

      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height * pdfWidth) /
        canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `payment-made-${
          payment?.payment_number || "payment"
        }.pdf`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const amountFormatted = `₹${Number(
    payment?.amount || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formatLedgerAmount = (amount: number) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const journalDebitTotal = journalEntries.reduce(
    (total, entry) => total + toAmount(entry.debit),
    0
  );
  const journalCreditTotal = journalEntries.reduce(
    (total, entry) => total + toAmount(entry.credit),
    0
  );

  return (
    <div className="p-6">
      <main className="flex-1">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              className="p-2"
              onClick={() => {
                // if (typeof onClose === "function") {
                //   onClose();
                // } else {
                  navigate("/accounting/payments-made");
                // }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-2xl font-semibold">
              Payment Made -{" "}
              {payment?.payment_number || "-"}
            </h2>

            {payment && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.status === "PAID"
                    ? "bg-green-100 text-green-700"
                    : payment.status === "VOID"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {payment.status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setActiveTab("pdf")
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>

            <Button
              onClick={handleDownloadPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/accounting/payments-made/edit/${payment?.id}`
                )
              }
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* TABS */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="details">
              Details View
            </TabsTrigger>

            <TabsTrigger value="pdf">
              PDF View
            </TabsTrigger>
          </TabsList>

          {/* ======================================
              DETAILS TAB
          ====================================== */}

          <TabsContent value="details">
            <div className="bg-white border rounded shadow-sm">
              <div className="p-10">
                {/* COMPANY + AMOUNT */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <h3 className="text-2xl font-bold">
                      Lockated
                    </h3>

                    <div className="mt-3 text-sm text-gray-500">
                      pune Maharashtra 411006
                      <br />
                      India
                      <br />
                      ajay.phulkar@lockated.com
                    </div>
                  </div>

                  <div className="col-span-4 flex justify-end">
                    <div className="bg-green-500 text-white p-6 rounded shadow text-center">
                      <div className="text-sm">
                        Amount Paid
                      </div>

                      <div className="text-2xl font-bold mt-2">
                        {amountFormatted}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-8" />

                <h3 className="text-center text-xl font-semibold mb-8 uppercase tracking-wider">
                  Payments Made
                </h3>

                {/* DETAILS */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6 space-y-5">
                    <div>
                      <div className="text-sm text-gray-500">
                        Payment Date
                      </div>

                      <div className="font-semibold">
                        {payment?.date || "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Reference Number
                      </div>

                      <div className="font-semibold">
                        {payment?.reference_number ||
                          "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Payment Mode
                      </div>

                      <div className="font-semibold">
                        {payment?.payment_mode ||
                          "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Paid Through
                      </div>

                      <div className="font-semibold">
                        {payment?.paid_through_account ||
                          "-"}
                      </div>
                    </div>

                    {(payment?.tds_amount || 0) >
                      0 && (
                      <div>
                        <div className="text-sm text-gray-500">
                          TDS Deducted
                        </div>

                        <div className="font-semibold text-red-500">
                          ₹
                          {Number(
                            payment?.tds_amount || 0
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VENDOR */}
                  <div className="col-span-6">
                    <div className="text-sm text-gray-500">
                      Paid To
                    </div>

                    <div className="mt-2">
                      <div className="text-blue-600 font-semibold">
                        {payment?.vendor_name ||
                          "-"}
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        India
                      </div>
                    </div>
                  </div>
                </div>

                {/* TABLE */}
                <div className="mt-10">
                  <div className="text-lg font-semibold mb-4">
                    Payment For
                  </div>

                  <div className="overflow-x-auto border rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">
                            Bill Number
                          </th>

                          <th className="p-3 text-left">
                            Bill Date
                          </th>

                          <th className="p-3 text-right">
                            Bill Amount
                          </th>

                          <th className="p-3 text-right">
                            Payment Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {billPayments.map((bp) => (
                          <tr
                            key={bp.id}
                            className="border-t"
                          >
                            <td className="p-3 text-blue-600">
                              {bp.formatted_number ||
                                `BILL-${bp.resource_id}`}
                            </td>

                            <td className="p-3">
                              {bp.payment_date
                                ? new Date(
                                    bp.payment_date
                                  ).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "-"}
                            </td>

                            <td className="p-3 text-right">
                              ₹
                              {Number(
                                bp.amount || 0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </td>

                            <td className="p-3 text-right">
                              ₹
                              {Number(
                                bp.amount || 0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MORE INFORMATION */}
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-8">
                    More Information
                  </h3>

                  <div className="grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-3 text-gray-500">
                      Notes
                    </div>

                    <div className="col-span-9 text-gray-800">
                      {payment?.notes || "-"}
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="inline-flex border-b-2 border-blue-500 px-4 pb-3 text-sm font-semibold text-gray-700">
                      Journal
                    </div>

                    <div className="border-t">
                      <div className="flex items-center justify-between py-3 text-xs text-gray-500">
                        <div>
                          Amount is displayed in your base currency{" "}
                          <span className="bg-green-700 text-white px-1.5 py-0.5 rounded-sm font-semibold">
                            INR
                          </span>
                        </div>

                        <div className="inline-flex overflow-hidden rounded border border-gray-300 text-xs">
                          <span className="bg-gray-200 px-2 py-1">
                            Accrual
                          </span>
                          <span className="bg-white px-2 py-1">
                            Cash
                          </span>
                        </div>
                      </div>

                      <div className="text-lg font-semibold mb-4">
                        Vendor Payment -{" "}
                        {payment?.payment_number || "-"}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                              <th className="py-2 text-left">
                                Account
                              </th>

                              <th className="py-2 text-right">
                                Debit
                              </th>

                              <th className="py-2 text-right">
                                Credit
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {journalEntries.length > 0 ? (
                              journalEntries.map((entry) => (
                                <tr
                                  key={entry.id}
                                  className="border-b last:border-b-0"
                                >
                                  <td className="py-2 pr-3">
                                    {entry.account || "-"}
                                  </td>

                                  <td className="py-2 text-right">
                                    {formatLedgerAmount(entry.debit)}
                                  </td>

                                  <td className="py-2 text-right">
                                    {formatLedgerAmount(entry.credit)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-4 text-center text-gray-500"
                                >
                                  No journal entries found.
                                </td>
                              </tr>
                            )}
                          </tbody>

                          {journalEntries.length > 0 && (
                            <tfoot>
                              <tr className="border-t font-semibold">
                                <td className="py-2" />

                                <td className="py-2 text-right">
                                  {formatLedgerAmount(
                                    journalDebitTotal
                                  )}
                                </td>

                                <td className="py-2 text-right">
                                  {formatLedgerAmount(
                                    journalCreditTotal
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ======================================
              PDF TAB
          ====================================== */}

          <TabsContent value="pdf">
            <div className="bg-white border rounded shadow-sm">
              {/* PDF HEADER */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-lg font-semibold">
                  Payment Made PDF
                </h3>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.print()
                    }
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>

                  <Button
                    onClick={
                      handleDownloadPdf
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* PDF PREVIEW */}
              <div className="bg-gray-100 p-6 overflow-auto">
                <div
                  ref={pdfRef}
                  className="flex justify-center"
                >
                  <PaymentMadePdf
                    data={{
                      status:
                        payment?.status,
                      amount:
                        payment?.amount,
                      payment_date:
                        payment?.date,
                      payment_mode:
                        payment?.payment_mode,
                      reference_number:
                        payment?.reference_number,
                      payment_number:
                        payment?.payment_number,
                      vendor_name:
                        payment?.vendor_name,
                      paid_through:
                        payment?.paid_through_account,
                      tds_amount:
                        payment?.tds_amount,
                    }}
                    bills={billPayments.map(
                      (bp) => ({
                        id: bp.id,
                        bill_number:
                          bp.formatted_number ||
                          `BILL-${bp.resource_id}`,
                        bill_date:
                          bp.payment_date,
                        bill_amount:
                          bp.amount,
                        payment_amount:
                          bp.amount,
                      })
                    )}
                    formatDate={(date) => {
                      if (!date) return "-";

                      return new Date(
                        date
                      ).toLocaleDateString(
                        "en-GB"
                      );
                    }}
                    formatCurrency={(
                      amount
                    ) =>
                      `₹${Number(
                        amount || 0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}`
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PaymentMadeDetailsPage;
