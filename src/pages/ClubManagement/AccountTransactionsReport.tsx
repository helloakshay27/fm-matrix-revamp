import React from "react";
import { useNavigate } from "react-router-dom";

interface AccountTransactionRow {
  date: string;
  account: string;
  transactionDetails: string;
  transactionType: string;
  transactionNo?: string;
  referenceNo?: string;
  debit?: number;
  credit?: number;
  amount: string;
}

const accountTransactionsData: AccountTransactionRow[] = [
  {
    date: "03/03/2026",
    account: "Undeposited Funds",
    transactionDetails: "Goods cost",
    transactionType: "Expense",
    credit: 100,
    amount: "100.00 Cr",
  },
  {
    date: "03/03/2026",
    account: "Goods cost",
    transactionDetails: "Undeposited Funds",
    transactionType: "Expense",
    debit: 100,
    amount: "100.00 Dr",
  },
  {
    date: "09/03/2026",
    account: "Accounts Receivable",
    transactionDetails: "Lockated",
    transactionType: "Invoice",
    transactionNo: "INV-0393",
    debit: 525,
    amount: "525.00 Dr",
  },
  {
    date: "09/03/2026",
    account: "Sales",
    transactionDetails: "Lockated",
    transactionType: "Invoice",
    transactionNo: "INV-0393",
    credit: 500,
    amount: "500.00 Cr",
  },
  {
    date: "09/03/2026",
    account: "Output CGST",
    transactionDetails: "Lockated",
    transactionType: "Invoice",
    transactionNo: "INV-0393",
    credit: 12.5,
    amount: "12.50 Cr",
  },
  {
    date: "09/03/2026",
    account: "Output SGST",
    transactionDetails: "Lockated",
    transactionType: "Invoice",
    transactionNo: "INV-0393",
    credit: 12.5,
    amount: "12.50 Cr",
  },
  {
    date: "09/03/2026",
    account: "Petty Cash",
    transactionDetails: "Lockated",
    transactionType: "Customer Payment",
    transactionNo: "7",
    debit: 500,
    amount: "500.00 Dr",
  },
  {
    date: "09/03/2026",
    account: "Unearned Revenue",
    transactionDetails: "Lockated",
    transactionType: "Customer Payment",
    transactionNo: "7",
    credit: 500,
    amount: "500.00 Cr",
  },
];

const formatValue = (value?: number) => {
  if (value === undefined) return "";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AccountTransactionsReport: React.FC = () => {
  const navigate = useNavigate();

  const openDetails = (
    row: AccountTransactionRow,
    clickedOn: "debit" | "credit" | "amount",
  ) => {
    const params = new URLSearchParams({
      date: row.date,
      account: row.account,
      transactionDetails: row.transactionDetails,
      transactionType: row.transactionType,
      transactionNo: row.transactionNo || "",
      referenceNo: row.referenceNo || "",
      debit: row.debit?.toString() || "",
      credit: row.credit?.toString() || "",
      amount: row.amount,
      clickedOn,
    });

    navigate(`/accounting/reports/account-transactions/details?${params.toString()}`);
  };

  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen">
      <div className="bg-white rounded-md border border-[#d7d7d7] overflow-hidden">
        <div className="px-4 py-6 border-b border-[#e5e5e5] text-center">
          <p className="text-sm text-[#6b7280]">Lockated</p>
          <h1 className="text-2xl font-semibold text-[#111827]">Account Transactions</h1>
          <p className="text-sm text-[#374151] mt-1">Basis : Accrual</p>
          <p className="text-sm text-[#111827] mt-1">From 01/03/2026 To 31/03/2026</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-[#5b5b7e] text-xs uppercase">
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Date</th>
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Account</th>
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Transaction Details</th>
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Transaction Type</th>
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Transaction#</th>
                <th className="text-left px-4 py-3 border-b border-[#d1d5db]">Reference#</th>
                <th className="text-right px-4 py-3 border-b border-[#d1d5db]">Debit</th>
                <th className="text-right px-4 py-3 border-b border-[#d1d5db]">Credit</th>
                <th className="text-right px-4 py-3 border-b border-[#d1d5db]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {accountTransactionsData.map((row, index) => (
                <tr key={`${row.date}-${row.account}-${index}`} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.date}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.account}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.transactionDetails}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.transactionType}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.transactionNo || ""}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-[#111827]">{row.referenceNo || ""}</td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-right text-[#1463df] font-medium">
                    {row.debit !== undefined ? (
                      <button
                        type="button"
                        className="text-[#1463df] hover:underline"
                        onClick={() => openDetails(row, "debit")}
                      >
                        {formatValue(row.debit)}
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-right text-[#1463df] font-medium">
                    {row.credit !== undefined ? (
                      <button
                        type="button"
                        className="text-[#1463df] hover:underline"
                        onClick={() => openDetails(row, "credit")}
                      >
                        {formatValue(row.credit)}
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-[#ececec] text-sm text-right text-[#1463df] font-semibold">
                    <button
                      type="button"
                      className="text-[#1463df] hover:underline"
                      onClick={() => openDetails(row, "amount")}
                    >
                      {row.amount}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTransactionsReport;
