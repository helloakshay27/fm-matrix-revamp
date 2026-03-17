import React from "react";
import { useLocation } from "react-router-dom";

interface ExpenseListItem {
  title: string;
  date: string;
  amount: string;
  muted?: string;
}

const expenseList: ExpenseListItem[] = [
  { title: "Goods cost", date: "03/03/2026", amount: "₹100.00" },
  { title: "Goods cost", date: "03/03/2026", amount: "₹100.00" },
  { title: "Goods cost", date: "24/02/2026", amount: "₹100.00" },
  { title: "Goods cost", date: "17/02/2026", amount: "₹100.00" },
  { title: "Materials", date: "12/02/2026", amount: "₹122.00", muted: "Gophygital" },
  { title: "Subcontractor", date: "11/02/2026", amount: "₹1,000.00", muted: "Gophygital" },
  { title: "Automobile Expense", date: "11/02/2026", amount: "₹1,000.00", muted: "Gophygital" },
  { title: "Cost of Goods Sold", date: "12/11/2025", amount: "₹100.00" },
];

const formatCurrency = (value: string) => {
  const number = parseFloat(value || "0") || 0;
  return `₹${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AccountTransactionsDetailPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const account = query.get("account") || "Goods cost";
  const date = query.get("date") || "03/03/2026";
  const transactionDetails = query.get("transactionDetails") || "Lockated";
  const transactionType = query.get("transactionType") || "Expense";
  const transactionNo = query.get("transactionNo") || "-";
  const debit = query.get("debit") || "100";
  const credit = query.get("credit") || "0";
  const amount = query.get("amount") || "100.00 Dr";
  const clickedOn = query.get("clickedOn") || "amount";

  return (
    <div className="min-h-screen bg-[#f3f4f7] px-3 py-4 sm:px-4">
      <div className="mx-auto w-full overflow-hidden rounded-md border border-[#d8dce5] bg-white">
        <div className="flex min-h-[80vh]">
          {/* Left List Panel */}
          <aside className="hidden w-[280px] border-r border-[#e5e7eb] bg-[#fafbfc] lg:block">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
              <h3 className="text-[22px] font-semibold text-[#202938]">All Expenses</h3>
              <div className="text-lg text-[#7b8190]">⋯</div>
            </div>
            <div className="max-h-[78vh] overflow-y-auto">
              {expenseList.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={`cursor-pointer border-b border-[#eceef3] px-4 py-3 hover:bg-[#eef2fb] ${index === 1 ? "bg-[#eef2fb]" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#2d3748]">{item.title}</p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">{item.date}</p>
                      {item.muted ? <p className="text-xs text-[#9aa1af]">{item.muted}</p> : null}
                    </div>
                    <p className="text-sm font-semibold text-[#2d3748]">{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right Detail Panel */}
          <section className="flex-1">
            <div className="border-b border-[#e5e7eb] px-4 py-3 sm:px-6">
              <h2 className="text-[28px] font-semibold text-[#202938]">Expense Details</h2>
            </div>

            <div className="border-b border-[#e5e7eb] bg-[#f7f8fc] px-4 py-2 text-sm text-[#4b5563] sm:px-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="cursor-pointer hover:text-[#1f2937]">Edit</span>
                <span className="cursor-pointer hover:text-[#1f2937]">Make Recurring</span>
                <span className="cursor-pointer hover:text-[#1f2937]">PDF/Print</span>
              </div>
            </div>

            <div className="space-y-8 px-4 py-6 sm:px-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <p className="text-sm text-[#6b7280]">Expense Amount</p>
                    <p className="text-3xl font-semibold text-[#ef4444]">{formatCurrency(debit || credit)}</p>
                    <p className="text-xs text-[#9ca3af]">on {date}</p>
                  </div>

                  <div className="inline-block rounded-sm bg-[#d6eef9] px-2 py-1 text-xs font-semibold text-[#3b82a0]">
                    {account}
                  </div>

                  <div>
                    <p className="text-sm text-[#6b7280]">Paid Through</p>
                    <p className="text-sm font-medium text-[#111827]">{transactionDetails}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#6b7280]">Transaction</p>
                    <p className="text-sm font-medium text-[#111827]">{transactionType} · {transactionNo}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-[#d9dde7] bg-[#fafbff] p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-[#dbeafe]" />
                  <p className="text-sm font-semibold text-[#374151]">Drag or Drop your Receipts</p>
                  <p className="mt-1 text-xs text-[#9ca3af]">Maximum file size allowed is 10MB</p>
                  <button
                    type="button"
                    className="mt-4 rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-xs font-medium text-[#374151]"
                  >
                    Upload your Files
                  </button>
                </div>
              </div>

              <div className="border-t border-[#e5e7eb] pt-5">
                <p className="text-sm font-semibold text-[#1f2937]">Journal</p>
                <p className="mt-1 text-xs text-[#6b7280]">Amount is displayed in your base currency INR</p>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#E5E0D3] text-xs uppercase text-[#5b5b7e]">
                        <th className="border-b border-[#d1d5db] px-3 py-3 text-left">Account</th>
                        <th className="border-b border-[#d1d5db] px-3 py-3 text-right">Debit</th>
                        <th className="border-b border-[#d1d5db] px-3 py-3 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-[#ececec] px-3 py-2 text-sm text-[#111827]">{account}</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">
                          {parseFloat(debit || "0").toFixed(2)}
                        </td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">0.00</td>
                      </tr>
                      <tr>
                        <td className="border-b border-[#ececec] px-3 py-2 text-sm text-[#111827]">Undeposited Funds</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">0.00</td>
                        <td className="border-b border-[#ececec] px-3 py-2 text-right text-sm text-[#111827]">
                          {parseFloat(credit || "0").toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="px-3 py-2 text-sm text-[#111827]" />
                        <td className="px-3 py-2 text-right text-sm text-[#111827]">
                          {parseFloat(debit || "0").toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-sm text-[#111827]">
                          {parseFloat(credit || "0").toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-[#6b7280]">
                  Source amount: <span className="font-medium text-[#111827]">{amount}</span> · Clicked on: <span className="font-medium text-[#111827] capitalize">{clickedOn}</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountTransactionsDetailPage;
