import React from "react";
import { useNavigate } from "react-router-dom";

interface TransactionRow {
  date?: string;
  account?: string;
  transactionDetails?: string;
  transactionType?: string;
  transactionNo?: string;
  referenceNo?: string;
  debit?: number;
  credit?: number;
  amount?: string;
}

interface TransactionSection {
  title: string;
  rows: TransactionRow[];
}

const transactionSections: TransactionSection[] = [
  {
    title: "Accounts Receivable",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", debit: 249.75 },
      { date: "09/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0393", debit: 525, amount: "525.00 Dr" },
      { date: "09/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "INV-000003", credit: 400, amount: "400.00 Cr" },
      { date: "09/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "INV-0393", credit: 100, amount: "100.00 Cr" },
      { date: "09/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Credit Note", transactionNo: "CN-00002", credit: 535.5, amount: "535.50 Cr" },
      { date: "10/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", debit: 475.5, amount: "475.50 Dr" },
      { date: "10/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0396", debit: 315, amount: "315.00 Dr" },
      { date: "18/03/2026", account: "Accounts Receivable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", debit: 86.19, amount: "86.19 Dr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", debit: 615.94 },
    ],
  },
  {
    title: "Cash",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", debit: 2434.87 },
      { date: "03/03/2026", account: "Undeposited Funds", transactionDetails: "Goods cost", transactionType: "Expense", credit: 100, amount: "100.00 Cr" },
      { date: "09/03/2026", account: "Petty Cash", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "7", debit: 500, amount: "500.00 Dr" },
      { date: "09/03/2026", account: "Petty Cash", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "10", debit: 100, amount: "100.00 Dr" },
      { date: "10/03/2026", account: "Undeposited Funds", transactionDetails: "Goods cost", transactionType: "Expense", credit: 100, amount: "100.00 Cr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", debit: 2834.87 },
    ],
  },
  {
    title: "Cost Of Goods Sold",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", debit: 3072 },
      { date: "03/03/2026", account: "Goods cost", transactionDetails: "Undeposited Funds", transactionType: "Expense", debit: 100, amount: "100.00 Dr" },
      { date: "10/03/2026", account: "Goods cost", transactionDetails: "Undeposited Funds", transactionType: "Expense", debit: 100, amount: "100.00 Dr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", debit: 3272 },
    ],
  },
  {
    title: "Income",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", credit: 2640 },
      { date: "09/03/2026", account: "Sales", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0393", credit: 500, amount: "500.00 Cr" },
      { date: "09/03/2026", account: "Sales", transactionDetails: "Lockated", transactionType: "Credit Note", transactionNo: "CN-00002", debit: 500, amount: "500.00 Dr" },
      { date: "10/03/2026", account: "Sales", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", credit: 500, amount: "500.00 Cr" },
      { date: "10/03/2026", account: "Discount", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", debit: 10, amount: "10.00 Dr" },
      { date: "10/03/2026", account: "Other Charges", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", credit: 10, amount: "10.00 Cr" },
      { date: "10/03/2026", account: "Sales", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0396", credit: 300, amount: "300.00 Cr" },
      { date: "18/03/2026", account: "Discount", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", debit: 10, amount: "10.00 Dr" },
      { date: "18/03/2026", account: "Other Charges", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", credit: 10, amount: "10.00 Cr" },
      { date: "18/03/2026", account: "Shipping Charge", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", credit: 100, amount: "100.00 Cr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", credit: 3520 },
    ],
  },
  {
    title: "Other Current Asset",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", credit: 706.62 },
      { date: "10/03/2026", account: "TDS Receivable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", debit: 49, amount: "49.00 Dr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", credit: 657.62 },
    ],
  },
  {
    title: "Other Current Liability",
    rows: [
      { date: "As On 01/03/2026", transactionDetails: "Opening Balance", credit: 10110 },
      { date: "09/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0393", credit: 12.5, amount: "12.50 Cr" },
      { date: "09/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0393", credit: 12.5, amount: "12.50 Cr" },
      { date: "09/03/2026", account: "Unearned Revenue", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "7", credit: 500, amount: "500.00 Cr" },
      { date: "09/03/2026", account: "Unearned Revenue", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "INV-000003", debit: 400, amount: "400.00 Dr" },
      { date: "09/03/2026", account: "Unearned Revenue", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "INV-0393", debit: 100, amount: "100.00 Dr" },
      { date: "09/03/2026", account: "Unearned Revenue", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "10", credit: 81.3, amount: "81.30 Cr" },
      { date: "09/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "10", credit: 11.38, amount: "11.38 Cr" },
      { date: "09/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Customer Payment", transactionNo: "10", credit: 7.32, amount: "7.32 Cr" },
      { date: "09/03/2026", account: "TCS Payable", transactionDetails: "Lockated", transactionType: "Credit Note", transactionNo: "CN-00002", debit: 10.5, amount: "10.50 Dr" },
      { date: "09/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Credit Note", transactionNo: "CN-00002", debit: 12.5, amount: "12.50 Dr" },
      { date: "09/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Credit Note", transactionNo: "CN-00002", debit: 12.5, amount: "12.50 Dr" },
      { date: "10/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", credit: 12.25, amount: "12.25 Cr" },
      { date: "10/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0395", credit: 12.25, amount: "12.25 Cr" },
      { date: "10/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0396", credit: 7.5, amount: "7.50 Cr" },
      { date: "10/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0396", credit: 7.5, amount: "7.50 Cr" },
      { date: "18/03/2026", account: "TCS Payable", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", credit: 1.69, amount: "1.69 Cr" },
      { date: "18/03/2026", account: "Output CGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", credit: 2.25, amount: "2.25 Cr" },
      { date: "18/03/2026", account: "Output SGST", transactionDetails: "Lockated", transactionType: "Invoice", transactionNo: "INV-0394", credit: 2.25, amount: "2.25 Cr" },
      { date: "As On 31/03/2026", transactionDetails: "Closing Balance", credit: 10124.19 },
    ],
  },
];

const formatValue = (value?: number) => {
  if (value === undefined) return "";

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AccountTypeTransactionsReport: React.FC = () => {
  const navigate = useNavigate();

  const openDetails = (
    sectionTitle: string,
    row: TransactionRow,
    clickedOn: "debit" | "credit" | "amount",
  ) => {
    const params = new URLSearchParams({
      section: sectionTitle,
      date: row.date || "",
      account: row.account || "",
      transactionDetails: row.transactionDetails || "",
      transactionType: row.transactionType || "",
      transactionNo: row.transactionNo || "",
      referenceNo: row.referenceNo || "",
      debit: row.debit?.toString() || "",
      credit: row.credit?.toString() || "",
      amount: row.amount || "",
      clickedOn,
    });

    navigate(`/accounting/reports/account-type-transactions/details?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#e7e7e7]">
        <div className="border-b border-[#e5e5e5] px-4 py-6 text-center sm:px-6">
          <p className="text-sm text-[#6b7280]">Lockated</p>
          <h1 className="text-2xl font-semibold text-[#111827]">Account Type Transactions</h1>
          <p className="mt-1 text-sm text-[#374151]">Basis : Accrual</p>
          <p className="mt-1 text-sm text-[#111827]">From 01/03/2026 To 31/03/2026</p>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1220px] w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-xs uppercase text-[#5b5b7e]">
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Date</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Account</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Transaction Details</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Transaction Type</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Transaction#</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-left sm:px-4">Reference#</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-right sm:px-4">Debit</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-right sm:px-4">Credit</th>
                <th className="border-b border-[#d1d5db] px-3 py-3 text-right sm:px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionSections.map((section) => (
                <React.Fragment key={section.title}>
                  <tr className="bg-[#fafafa]">
                    <td
                      colSpan={9}
                      className="border-b border-[#e5e7eb] px-3 py-3 text-sm font-semibold text-[#111827] sm:px-4"
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map((row, index) => (
                    <tr key={`${section.title}-${index}`} className="hover:bg-[#fafafa]">
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.date || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.account || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.transactionDetails || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.transactionType || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.transactionNo || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-xs text-[#111827] sm:px-4 sm:text-sm">{row.referenceNo || ""}</td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-right text-xs font-medium text-[#1463df] sm:px-4 sm:text-sm">
                        {row.debit !== undefined ? (
                          <button
                            type="button"
                            className="text-[#1463df] hover:underline"
                            onClick={() => openDetails(section.title, row, "debit")}
                          >
                            {formatValue(row.debit)}
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-right text-xs font-medium text-[#1463df] sm:px-4 sm:text-sm">
                        {row.credit !== undefined ? (
                          <button
                            type="button"
                            className="text-[#1463df] hover:underline"
                            onClick={() => openDetails(section.title, row, "credit")}
                          >
                            {formatValue(row.credit)}
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="border-b border-[#ececec] px-3 py-2.5 text-right text-xs font-semibold text-[#1463df] sm:px-4 sm:text-sm">
                        {row.amount ? (
                          <button
                            type="button"
                            className="text-[#1463df] hover:underline"
                            onClick={() => openDetails(section.title, row, "amount")}
                          >
                            {row.amount}
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeTransactionsReport;
