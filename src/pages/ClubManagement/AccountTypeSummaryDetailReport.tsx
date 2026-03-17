import React from "react";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

interface LedgerRow {
  account: string;
  accountCode: string;
  debit: number;
  credit: number;
}

const ledgerData: Record<string, LedgerRow[]> = {
  "Accounts Receivable": [
    {
      account: "Accounts Receivable",
      accountCode: "AR-1001",
      debit: 1401.69,
      credit: 1035.5,
    },
  ],
  Cash: [
    {
      account: "Cash",
      accountCode: "CA-1002",
      debit: 600,
      credit: 200,
    },
  ],
  "Other Current Asset": [
    {
      account: "Other Current Asset",
      accountCode: "OCA-1023",
      debit: 49,
      credit: 0,
    },
  ],
  Income: [
    {
      account: "Income",
      accountCode: "IN-2001",
      debit: 530,
      credit: 1410,
    },
  ],
  "Other Current Liability": [
    {
      account: "Other Current Liability",
      accountCode: "OCL-3007",
      debit: 535.5,
      credit: 670.69,
    },
  ],
};

const formatValue = (value: number) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const AccountTypeSummaryDetailReport: React.FC = () => {
  const { accountName = "Accounts Receivable" } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const side = query.get("side") || "debit";

  const decodedName = decodeURIComponent(accountName);

  const rows = useMemo(() => {
    if (ledgerData[decodedName]) return ledgerData[decodedName];

    return [
      {
        account: decodedName,
        accountCode: "N/A",
        debit: 0,
        credit: 0,
      },
    ];
  }, [decodedName]);

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#e7e7e7]">
        <div className="border-b border-[#e5e5e5] px-4 py-6 text-center sm:px-6">
          <p className="text-sm text-[#6b7280]">Lockated</p>
          <h1 className="text-2xl font-semibold text-[#111827]">General Ledger</h1>
          <p className="mt-1 text-sm text-[#111827]">From 01/03/2026 To 31/03/2026</p>
          <p className="mt-2 text-sm text-[#374151]">Basis : Accrual</p>
          <p className="mt-2 text-xs text-[#6b7280] capitalize">
            Account: {decodedName} ({side})
          </p>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-xs uppercase text-[#5b5b7e]">
                <th className="border-b border-[#d1d5db] px-4 py-3 text-left sm:px-5">Account</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-left sm:px-5">Account Code</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-right sm:px-5">Debit</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-right sm:px-5">Credit</th>
                <th className="border-b border-[#d1d5db] px-4 py-3 text-right sm:px-5">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const balance = row.debit - row.credit;

                return (
                  <tr key={`${row.account}-${index}`} className="hover:bg-[#fafafa]">
                    <td className="border-b border-[#ececec] px-4 py-3 text-sm text-[#111827] sm:px-5">{row.account}</td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-sm text-[#111827] sm:px-5">{row.accountCode}</td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-right text-sm font-medium text-[#1463df] sm:px-5">
                      {formatValue(row.debit)}
                    </td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-right text-sm font-medium text-[#1463df] sm:px-5">
                      {formatValue(row.credit)}
                    </td>
                    <td className="border-b border-[#ececec] px-4 py-3 text-right text-sm font-semibold text-[#1463df] sm:px-5">
                      {formatValue(balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSummaryDetailReport;
