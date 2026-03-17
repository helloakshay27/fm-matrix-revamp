import React from "react";
import { useLocation } from "react-router-dom";

interface InvoiceListItem {
  invoiceNo: string;
  date: string;
  amount: string;
  status: string;
}

const invoices: InvoiceListItem[] = [
  { invoiceNo: "INV-0396", date: "10/03/2026", amount: "₹315.00", status: "OVERDUE BY 3 DAYS" },
  { invoiceNo: "INV-0395", date: "10/03/2026", amount: "₹475.50", status: "OVERDUE BY 3 DAYS" },
  { invoiceNo: "INV-0394", date: "18/03/2026", amount: "₹86.19", status: "DUE IN 5 DAYS" },
  { invoiceNo: "INV-0393", date: "09/03/2026", amount: "₹525.00", status: "OVERDUE BY 4 DAYS" },
  { invoiceNo: "INV-000003", date: "13/11/2025", amount: "₹779.62", status: "OVERDUE BY 90 DAYS" },
];

const toAmount = (value?: string | null) => {
  const number = parseFloat(value || "0") || 0;
  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AccountTypeTransactionsDetailPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const section = params.get("section") || "Accounts Receivable";
  const account = params.get("account") || "Accounts Receivable";
  const date = params.get("date") || "09/03/2026";
  const transactionNo = params.get("transactionNo") || "INV-0393";
  const transactionType = params.get("transactionType") || "Invoice";
  const transactionDetails = params.get("transactionDetails") || "Lockated";
  const debit = params.get("debit") || "525";
  const credit = params.get("credit") || "0";
  const clickedOn = params.get("clickedOn") || "amount";

  const selectedInvoice = invoices.find((i) => i.invoiceNo === transactionNo) || invoices[3];

  return (
    <div className="min-h-screen bg-[#f3f4f7] px-3 py-3 sm:px-4">
      <div className="mx-auto w-full overflow-hidden rounded-md border border-[#d9dde8] bg-white">
        <div className="flex min-h-[82vh]">
          {/* Left invoice list */}
          <aside className="hidden w-[260px] border-r border-[#e5e7eb] bg-[#fbfcfe] lg:block">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-3 py-3">
              <h3 className="text-sm font-semibold text-[#1f2937]">All Invoices</h3>
              <div className="text-[#9ca3af]">⋯</div>
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              {invoices.map((item) => {
                const active = item.invoiceNo === selectedInvoice.invoiceNo;
                return (
                  <div
                    key={item.invoiceNo}
                    className={`border-b border-[#eceff4] px-3 py-2.5 ${active ? "bg-[#eef2fb]" : "hover:bg-[#f7f9fe]"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#374151]">Lockated</p>
                        <p className="text-[11px] text-[#6b7280]">{item.invoiceNo} · {item.date}</p>
                        <p className="mt-1 text-[10px] font-semibold text-[#f97316]">{item.status}</p>
                      </div>
                      <p className="text-xs font-semibold text-[#374151]">{item.amount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right details */}
          <section className="flex-1 bg-white">
            <div className="border-b border-[#e5e7eb] px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1f2937]">{selectedInvoice.invoiceNo}</h2>
                <div className="text-[#9ca3af]">✕</div>
              </div>
            </div>

            <div className="border-b border-[#e5e7eb] bg-[#f7f8fc] px-4 py-2 text-[11px] text-[#4b5563] sm:px-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="cursor-pointer hover:text-[#111827]">Edit</span>
                <span className="cursor-pointer hover:text-[#111827]">Send</span>
                <span className="cursor-pointer hover:text-[#111827]">Share</span>
                <span className="cursor-pointer hover:text-[#111827]">Reminders</span>
                <span className="cursor-pointer hover:text-[#111827]">PDF/Print</span>
                <span className="cursor-pointer rounded bg-[#3b82f6] px-2 py-0.5 text-white">Record Payment</span>
              </div>
            </div>

            <div className="space-y-5 px-4 py-4 sm:px-5">
              <div className="rounded border border-[#e5e7eb] bg-[#fcfcfe] p-3 text-[11px] text-[#4b5563]">
                <span className="font-semibold text-[#111827]">WHAT'S NEXT?</span> Payment reminder is scheduled.
              </div>

              <div className="rounded border border-[#e5e7eb] bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-[#374151]">Payments Received</p>
                <div className="mx-auto w-full max-w-[420px] rounded border border-[#d1d5db] bg-[#fafafa] p-4">
                  <div className="mb-2 text-center text-sm font-semibold text-[#1f2937]">TAX INVOICE</div>
                  <div className="space-y-1 text-[11px] text-[#4b5563]">
                    <p><span className="font-medium text-[#111827]">Customer:</span> {transactionDetails}</p>
                    <p><span className="font-medium text-[#111827]">Invoice No:</span> {selectedInvoice.invoiceNo}</p>
                    <p><span className="font-medium text-[#111827]">Date:</span> {date}</p>
                    <p><span className="font-medium text-[#111827]">Account:</span> {account || section}</p>
                    <p><span className="font-medium text-[#111827]">Type:</span> {transactionType}</p>
                  </div>

                  <div className="mt-3 rounded border border-[#e5e7eb] bg-white p-2 text-[11px]">
                    <div className="flex justify-between"><span>Sub Total</span><span>₹{toAmount(debit)}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>₹{toAmount(credit)}</span></div>
                    <div className="mt-1 border-t border-[#e5e7eb] pt-1 flex justify-between font-semibold text-[#111827]">
                      <span>Total</span><span>₹{toAmount((parseFloat(debit || "0") + parseFloat(credit || "0")).toString())}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#6b7280]">More Information</div>
              </div>

              <div className="border-t border-[#e5e7eb] pt-3">
                <p className="text-xs font-semibold text-[#1f2937]">Journal</p>
                <p className="mt-1 text-[11px] text-[#6b7280]">Amount is displayed in your base currency INR</p>

                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#E5E0D3] text-xs uppercase text-[#5b5b7e]">
                        <th className="border-b border-[#d1d5db] px-3 py-2 text-left">Account</th>
                        <th className="border-b border-[#d1d5db] px-3 py-2 text-right">Debit</th>
                        <th className="border-b border-[#d1d5db] px-3 py-2 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-[#ececec] px-3 py-2 text-sm text-[#111827]">{account || section}</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">{toAmount(debit)}</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">0.00</td>
                      </tr>
                      <tr>
                        <td className="border-b border-[#ececec] px-3 py-2 text-sm text-[#111827]">Sales</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">0.00</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">{toAmount(credit)}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="px-3 py-2 text-sm text-[#111827]" />
                        <td className="px-3 py-2 text-right text-sm text-[#111827]">{toAmount(debit)}</td>
                        <td className="px-3 py-2 text-right text-sm text-[#111827]">{toAmount(credit)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-[#6b7280]">Clicked: <span className="capitalize text-[#111827] font-medium">{clickedOn}</span></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeTransactionsDetailPage;
