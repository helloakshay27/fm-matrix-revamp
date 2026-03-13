import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type TdsReceivableDetailRow = {
  customerName: string;
  pan: string;
  date: string;
  transactionNo: string;
  transactionType: string;
  reasonForHigherDeduction: string;
  deductedRate: number;
  totalAfterTdsDeduction: number;
  total: number;
  taxDeductedAtSource: number;
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDisplayDate = (value: string) => {
  if (!value) {
    return "--/--/----";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const TDSReceivablesSummaryDetails: React.FC = () => {
  const { sectionCode } = useParams();
  const [searchParams] = useSearchParams();

  const sectionName = searchParams.get("section_name") || "Dividend";
  const fromDate = searchParams.get("from_date") || "2026-03-01";
  const toDate = searchParams.get("to_date") || "2026-03-31";

  const rows = useMemo<TdsReceivableDetailRow[]>(
    () => [
      {
        customerName: "Lockated",
        pan: "AGOPL6958Q",
        date: "10/03/2026",
        transactionNo: "INV-0395",
        transactionType: "Invoice",
        reasonForHigherDeduction: "-",
        deductedRate: 10,
        totalAfterTdsDeduction: 441,
        total: 490,
        taxDeductedAtSource: 49,
      },
    ],
    []
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (accumulator, row) => ({
          totalAfterTdsDeduction:
            accumulator.totalAfterTdsDeduction + row.totalAfterTdsDeduction,
          total: accumulator.total + row.total,
          taxDeductedAtSource:
            accumulator.taxDeductedAtSource + row.taxDeductedAtSource,
        }),
        {
          totalAfterTdsDeduction: 0,
          total: 0,
          taxDeductedAtSource: 0,
        }
      ),
    [rows]
  );

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      <div className="rounded-lg border bg-white p-0">
        <div className="px-6 py-4 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#101828]">
            TDS Receivables Details for {sectionCode} - {sectionName}
          </h1>
          <p className="mt-2 text-base text-[#475467]">
            From {formatDisplayDate(fromDate)} To {formatDisplayDate(toDate)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1650px] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#E5E0D3] text-[13px] uppercase text-[#1A1A1A]">
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Customer Name</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Permanent Account Number (PAN)</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Date</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Transaction#</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Transaction Type</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Reason for Higher Deduction</th>
                <th className="border border-gray-300 px-5 py-4 text-left font-semibold">Rate at Which Deducted</th>
                <th className="border border-gray-300 px-5 py-4 text-right font-semibold">Total After TDS Deduction</th>
                <th className="border border-gray-300 px-5 py-4 text-right font-semibold">Total</th>
                <th className="border border-gray-300 px-5 py-4 text-right font-semibold">Tax Deducted at Source</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={`${row.transactionNo}-${row.date}`} className="border-b border-[#E6E8F0] bg-white">
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.customerName}</td>
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.pan}</td>
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.date}</td>
                  <td className="px-5 py-4 text-base font-semibold text-[#2563EB]">{row.transactionNo}</td>
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.transactionType}</td>
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.reasonForHigherDeduction}</td>
                  <td className="px-5 py-4 text-base text-[#1A1A1A]">{row.deductedRate}</td>
                  <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                    ₹{formatAmount(row.totalAfterTdsDeduction)}
                  </td>
                  <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                    ₹{formatAmount(row.total)}
                  </td>
                  <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                    ₹{formatAmount(row.taxDeductedAtSource)}
                  </td>
                </tr>
              ))}

              <tr className="border-b border-[#E6E8F0] bg-white">
                <td className="px-5 py-4 text-lg font-semibold text-[#1A1A1A]">Total</td>
                <td className="px-5 py-4" />
                <td className="px-5 py-4" />
                <td className="px-5 py-4" />
                <td className="px-5 py-4" />
                <td className="px-5 py-4" />
                <td className="px-5 py-4" />
                <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                  ₹{formatAmount(totals.totalAfterTdsDeduction)}
                </td>
                <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                  ₹{formatAmount(totals.total)}
                </td>
                <td className="px-5 py-4 text-right text-base font-semibold text-[#1A1A1A]">
                  ₹{formatAmount(totals.taxDeductedAtSource)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TDSReceivablesSummaryDetails;
