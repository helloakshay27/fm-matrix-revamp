import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Scale, ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type TrialBalanceRowKind =
  | "section"
  | "subgroup"
  | "account"
  | "subtotal"
  | "grand_total";

export interface TrialBalanceRow {
  id: string;
  kind: TrialBalanceRowKind;
  label: string;
  accountCode?: string;
  netDebit: number;
  netCredit: number;
  indent: number;
  ledgerId?: number;
}

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const ThSort = ({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) => (
  <th
    className={`border border-gray-300 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1A1A1A] ${
      align === "right" ? "text-right" : "text-left"
    }`}
  >
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" aria-hidden />
    </span>
  </th>
);

/** Demo structure aligned with reference UI — replace with API mapping. */
const buildRows = (): TrialBalanceRow[] => [
  { id: "s-assets", kind: "section", label: "Assets", netDebit: 0, netCredit: 0, indent: 0 },
  {
    id: "a-ar",
    kind: "account",
    label: "Accounts Receivable",
    netDebit: 1561.75,
    netCredit: 0,
    indent: 1,
    ledgerId: 1,
  },
  {
    id: "a-at",
    kind: "account",
    label: "Advance Tax",
    netDebit: 0,
    netCredit: 1003.0,
    indent: 1,
    ledgerId: 2,
  },
  {
    id: "a-furn",
    kind: "account",
    label: "Furniture and Equipment",
    netDebit: 29000.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 3,
  },
  {
    id: "sg-itc",
    kind: "subgroup",
    label: "Input Tax Credits",
    netDebit: 0,
    netCredit: 0,
    indent: 1,
  },
  {
    id: "a-icgst",
    kind: "account",
    label: "Input CGST",
    netDebit: 1433.5,
    netCredit: 0,
    indent: 2,
    ledgerId: 4,
  },
  {
    id: "a-isgst",
    kind: "account",
    label: "Input SGST",
    netDebit: 1433.5,
    netCredit: 0,
    indent: 2,
    ledgerId: 5,
  },
  {
    id: "t-itc",
    kind: "subtotal",
    label: "Total for Input Tax Credits",
    netDebit: 2867.0,
    netCredit: 0,
    indent: 1,
  },
  {
    id: "a-petty",
    kind: "account",
    label: "Petty Cash",
    netDebit: 0,
    netCredit: 32356.13,
    indent: 1,
    ledgerId: 6,
  },
  {
    id: "a-prepaid",
    kind: "account",
    label: "Prepaid Expenses",
    netDebit: 1128.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 7,
  },
  {
    id: "a-tdsr",
    kind: "account",
    label: "TDS Receivable",
    netDebit: 283.13,
    netCredit: 0,
    indent: 1,
    ledgerId: 8,
  },
  {
    id: "a-undep",
    kind: "account",
    label: "Undeposited Funds",
    netDebit: 0,
    netCredit: 922.0,
    indent: 1,
    ledgerId: 9,
  },

  { id: "s-liab", kind: "section", label: "Liabilities", netDebit: 0, netCredit: 0, indent: 0 },
  {
    id: "l-ap",
    kind: "account",
    label: "Accounts Payable",
    netDebit: 0,
    netCredit: 25262.5,
    indent: 1,
    ledgerId: 10,
  },
  {
    id: "l-emp",
    kind: "account",
    label: "Employee Reimbursements",
    netDebit: 100.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 11,
  },
  {
    id: "sg-gst",
    kind: "subgroup",
    label: "GST Payable",
    netDebit: 0,
    netCredit: 0,
    indent: 1,
  },
  {
    id: "l-ocgst",
    kind: "account",
    label: "Output CGST",
    netDebit: 0,
    netCredit: 108.88,
    indent: 2,
    ledgerId: 12,
  },
  {
    id: "l-osgst",
    kind: "account",
    label: "Output SGST",
    netDebit: 0,
    netCredit: 104.82,
    indent: 2,
    ledgerId: 13,
  },
  {
    id: "t-gst",
    kind: "subtotal",
    label: "Total for GST Payable",
    netDebit: 0,
    netCredit: 213.7,
    indent: 1,
  },
  {
    id: "l-sal",
    kind: "account",
    label: "Net Salary Payable",
    accountCode: "Payroll-005",
    netDebit: 0,
    netCredit: 99800.0,
    indent: 1,
    ledgerId: 14,
  },
  {
    id: "l-ptax",
    kind: "account",
    label: "Payroll Tax Payable",
    accountCode: "Payroll-002",
    netDebit: 0,
    netCredit: 200.0,
    indent: 1,
    ledgerId: 15,
  },
  {
    id: "l-tcs",
    kind: "account",
    label: "TCS Payable",
    netDebit: 3812.5,
    netCredit: 0,
    indent: 1,
    ledgerId: 16,
  },
  {
    id: "l-tds",
    kind: "account",
    label: "TDS Payable",
    netDebit: 0,
    netCredit: 351.5,
    indent: 1,
    ledgerId: 17,
  },
  {
    id: "l-unearned",
    kind: "account",
    label: "Unearned Revenue",
    netDebit: 0,
    netCredit: 3548.55,
    indent: 1,
    ledgerId: 18,
  },

  { id: "s-eq", kind: "section", label: "Equities", netDebit: 0, netCredit: 0, indent: 0 },
  {
    id: "e-cap",
    kind: "account",
    label: "Capital Stock",
    netDebit: 250.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 19,
  },
  {
    id: "e-draw",
    kind: "account",
    label: "Drawings",
    netDebit: 0,
    netCredit: 1000.0,
    indent: 1,
    ledgerId: 20,
  },

  { id: "s-inc", kind: "section", label: "Income", netDebit: 0, netCredit: 0, indent: 0 },
  {
    id: "i-disc",
    kind: "account",
    label: "Discount",
    netDebit: 0,
    netCredit: 10.0,
    indent: 1,
    ledgerId: 21,
  },
  {
    id: "i-int",
    kind: "account",
    label: "Interest Income",
    netDebit: 90.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 22,
  },
  {
    id: "i-sales",
    kind: "account",
    label: "Sales",
    netDebit: 0,
    netCredit: 6100.0,
    indent: 1,
    ledgerId: 23,
  },
  {
    id: "i-ship",
    kind: "account",
    label: "Shipping Charge",
    netDebit: 0,
    netCredit: 100.0,
    indent: 1,
    ledgerId: 24,
  },

  { id: "s-exp", kind: "section", label: "Expense", netDebit: 0, netCredit: 0, indent: 0 },
  {
    id: "x-auto",
    kind: "account",
    label: "Automobile Expense",
    netDebit: 1000.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 25,
  },
  {
    id: "x-bank",
    kind: "account",
    label: "Bank Fees and Charges",
    netDebit: 0,
    netCredit: 6000.0,
    indent: 1,
    ledgerId: 26,
  },
  {
    id: "x-cogs",
    kind: "account",
    label: "Cost of Goods Sold",
    netDebit: 31750.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 27,
  },
  {
    id: "x-goods",
    kind: "account",
    label: "Goods cost",
    netDebit: 3803.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 28,
  },
  {
    id: "x-job",
    kind: "account",
    label: "Job Costing",
    netDebit: 100.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 29,
  },
  {
    id: "x-mat",
    kind: "account",
    label: "Materials",
    netDebit: 122.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 30,
  },
  {
    id: "x-sal",
    kind: "account",
    label: "Salaries and Employee Wages",
    netDebit: 100000.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 31,
  },
  {
    id: "x-sub",
    kind: "account",
    label: "Subcontractor",
    netDebit: 1000.0,
    netCredit: 0,
    indent: 1,
    ledgerId: 32,
  },

  {
    id: "grand",
    kind: "grand_total",
    label: "Total for Trial Balance",
    netDebit: 176867.38,
    netCredit: 176867.38,
    indent: 0,
  },
];

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

function formatDisplayDate(value: string) {
  if (!value) return "";
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(d);
}

const TrialBalance: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows] = useState<TrialBalanceRow[]>(() => buildRows());

  const periodLabel = useMemo(
    () =>
      `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`,
    [filters.fromDate, filters.toDate]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const reportDateStr = useMemo(
    () => new Intl.DateTimeFormat("en-GB").format(new Date()),
    []
  );

  const handleView = () => {
    // Wire API: pass asOfDate
  };

  const openLedger = (id?: number) => {
    if (id != null) {
      navigate(`/accounting/reports/trial-balance/details/${id}`);
    }
  };

  const renderRow = (row: TrialBalanceRow) => {
    const pad = 8 + row.indent * 16;
    const debitStr = formatCurrency(row.netDebit);
    const creditStr = formatCurrency(row.netCredit);

    if (row.kind === "section") {
      return (
        <tr key={row.id} className="bg-white">
          <td
            colSpan={4}
            className="border border-gray-300 px-4 py-2.5 text-left text-sm font-bold text-[#111827]"
            style={{ paddingLeft: pad }}
          >
            {row.label}
          </td>
        </tr>
      );
    }

    if (row.kind === "subgroup") {
      return (
        <tr key={row.id} className="bg-white">
          <td
            className="border border-gray-300 px-4 py-2.5 text-left text-sm font-semibold text-[#111827]"
            style={{ paddingLeft: pad }}
          >
            <span className="inline-flex items-center gap-1 text-blue-600">
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
              {row.label}
            </span>
          </td>
          <td className="border border-gray-300 px-4 py-2.5" />
          <td className="border border-gray-300 px-4 py-2.5 text-right text-sm text-[#111827]">
            {debitStr}
          </td>
          <td className="border border-gray-300 px-4 py-2.5 text-right text-sm text-[#111827]">
            {creditStr}
          </td>
        </tr>
      );
    }

    if (row.kind === "subtotal") {
      return (
        <tr key={row.id} className="bg-gray-100">
          <td
            className="border border-gray-300 px-4 py-2.5 text-left text-sm font-bold text-[#111827]"
            style={{ paddingLeft: pad }}
          >
            {row.label}
          </td>
          <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-[#4a4a4a]">
            {row.accountCode || ""}
          </td>
          <td className="border border-gray-300 px-4 py-2.5 text-right text-sm font-bold text-[#111827]">
            {debitStr}
          </td>
          <td className="border border-gray-300 px-4 py-2.5 text-right text-sm font-bold text-[#111827]">
            {creditStr}
          </td>
        </tr>
      );
    }

    if (row.kind === "grand_total") {
      return (
        <tr key={row.id} className="bg-[#E5E0D3] font-bold">
          <td
            className="border border-gray-300 px-4 py-3 text-left text-sm text-[#111827]"
            style={{ paddingLeft: pad }}
          >
            {row.label}
          </td>
          <td className="border border-gray-300 px-4 py-3" />
          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-[#111827]">
            {debitStr}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-[#111827]">
            {creditStr}
          </td>
        </tr>
      );
    }

    return (
      <tr key={row.id} className="hover:bg-gray-50">
        <td
          className="border border-gray-300 px-4 py-2.5 text-left text-sm"
          style={{ paddingLeft: pad }}
        >
          {row.ledgerId != null ? (
            <button
              type="button"
              onClick={() => openLedger(row.ledgerId)}
              className="text-left text-blue-600 hover:text-blue-800 hover:underline"
            >
              {row.label}
            </button>
          ) : (
            <span className="text-[#111827]">{row.label}</span>
          )}
        </td>
        <td className="border border-gray-300 px-4 py-2.5 text-center text-sm text-[#4a4a4a]">
          {row.accountCode || ""}
        </td>
        <td className="border border-gray-300 px-4 py-2.5 text-right text-sm text-[#111827]">
          {debitStr}
        </td>
        <td className="border border-gray-300 px-4 py-2.5 text-right text-sm text-[#111827]">
          {creditStr}
        </td>
      </tr>
    );
  };

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 border-[#D5DbDB] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Trial Balance
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            onClick={handleView}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-[#D5DbDB] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-6 text-center">
          <p className="text-sm text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#111827]">Trial Balance</h1>
          <p className="mt-2 text-sm text-[#667085]">
            <span className="font-medium text-[#344054]">Basis</span> : Accrual
          </p>
          <p className="mt-1 text-sm text-[#667085]">{periodLabel}</p>
          <p className="mt-0.5 text-sm text-[#667085]">Report Date: {reportDateStr}</p>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#E5E0D3]">
                  <ThSort align="left">Account</ThSort>
                  <ThSort align="left">Account Code</ThSort>
                  <ThSort align="right">Net Debit</ThSort>
                  <ThSort align="right">Net Credit</ThSort>
                </tr>
              </thead>
              <tbody>{rows.map((row) => renderRow(row))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
