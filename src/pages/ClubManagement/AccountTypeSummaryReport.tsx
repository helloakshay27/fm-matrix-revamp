import React from "react";
import { useNavigate } from "react-router-dom";

interface AccountTypeSummaryRow {
  type: "group" | "item";
  label: string;
  debit?: number;
  credit?: number;
}

const accountTypeSummaryData: AccountTypeSummaryRow[] = [
  { type: "group", label: "Asset" },
  { type: "item", label: "Accounts Receivable", debit: 1401.69, credit: 1035.5 },
  { type: "item", label: "Cash", debit: 600, credit: 200 },
  { type: "item", label: "Fixed Asset", debit: 0, credit: 0 },
  { type: "item", label: "Other Asset", debit: 0, credit: 0 },
  { type: "item", label: "Other Current Asset", debit: 49, credit: 0 },
  { type: "item", label: "Stock", debit: 0, credit: 0 },
  { type: "group", label: "Equity" },
  { type: "item", label: "Equity", debit: 0, credit: 0 },
  { type: "group", label: "Expense" },
  { type: "item", label: "Cost Of Goods Sold", debit: 200, credit: 0 },
  { type: "item", label: "Expense", debit: 0, credit: 0 },
  { type: "item", label: "Other Expense", debit: 0, credit: 0 },
  { type: "group", label: "Income" },
  { type: "item", label: "Income", debit: 530, credit: 1410 },
  { type: "group", label: "Liability" },
  { type: "item", label: "Accounts Payable", debit: 0, credit: 0 },
  { type: "item", label: "Non Current Liability", debit: 0, credit: 0 },
  { type: "item", label: "Other Current Liability", debit: 535.5, credit: 670.69 },
];

const formatValue = (value?: number) => {
  if (value === undefined) return "";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AccountTypeSummaryReport: React.FC = () => {
  const navigate = useNavigate();

  const openDetails = (accountName: string, side: "debit" | "credit") => {
    navigate(
      `/accounting/reports/account-type-summary/details/${encodeURIComponent(accountName)}?side=${side}`,
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#e7e7e7]">
        <div className="border-b border-[#e5e5e5] px-4 py-6 text-center sm:px-6">
          <p className="text-sm text-[#6b7280]">Lockated</p>
          <h1 className="text-2xl font-semibold text-[#111827]">Account Type Summary</h1>
          <p className="mt-1 text-sm text-[#111827]">From 01/03/2026 To 31/03/2026</p>
          <p className="mt-2 text-sm text-[#374151]">Basis : Accrual</p>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-xs uppercase text-[#5b5b7e]">
                <th className="border-b border-[#d1d5db] px-4 py-3 text-left sm:px-5">Account Type</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-right sm:px-5">Debit</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-right sm:px-5">Credit</th>
              </tr>
            </thead>
            <tbody>
              {accountTypeSummaryData.map((row, index) =>
                row.type === "group" ? (
                  <tr key={`${row.label}-${index}`} className="bg-[#fafafa]">
                    <td className="border-b border-[#ececec] px-4 py-3 text-sm font-semibold text-[#111827] sm:px-5">
                      {row.label}
                    </td>
                    <td className="border-b border-[#ececec] px-4 py-3" />
                    <td className="border-b border-[#ececec] px-4 py-3" />
                  </tr>
                ) : (
                  <tr key={`${row.label}-${index}`} className="hover:bg-[#fafafa]">
                    <td className="border-b border-[#ececec] px-4 py-3 text-sm text-[#111827] sm:px-5">
                      {row.label}
                    </td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-right text-sm font-medium text-[#1463df] sm:px-5">
                      <button
                        type="button"
                        onClick={() => openDetails(row.label, "debit")}
                        className="text-[#1463df] hover:underline"
                      >
                        {formatValue(row.debit)}
                      </button>
                    </td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-right text-sm font-medium text-[#1463df] sm:px-5">
                      <button
                        type="button"
                        onClick={() => openDetails(row.label, "credit")}
                        className="text-[#1463df] hover:underline"
                      >
                        {formatValue(row.credit)}
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSummaryReport;
