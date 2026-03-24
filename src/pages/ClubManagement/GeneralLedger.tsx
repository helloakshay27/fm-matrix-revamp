import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

export interface GeneralLedgerRow {
  id: string;
  account: string;
  accountCode: string;
  debit: number;
  credit: number;
  balance: number;
  indentLevel: number;
  isTotal: boolean;
}

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const formatDisplayDate = (value: string) => {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/** Negative balances in parentheses (ledger style). */
const formatBalance = (value: number) => {
  const abs = Math.abs(value);
  const formatted = formatCurrency(abs);
  if (value < 0) return `(${formatted})`;
  return formatted;
};

/** Demo data — hierarchical accounts, totals, sub-accounts (matches reference layout). */
const buildDemoRows = (): GeneralLedgerRow[] => [
  {
    id: "1",
    account: "GST/HST Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "2",
    account: "Consultant Loans",
    accountCode: "",
    debit: 2125.0,
    credit: 0,
    balance: 2125.0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "3",
    account: "Cost of Goods Sold",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "4",
    account: "Depreciation Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "5",
    account: "Depreciation and Amortisation",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "6",
    account: "Depreciation Expense",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "7",
    account: "Dividends Paid",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "8",
    account: "Donations",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "9",
    account: "Employee Benefits",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "10",
    account: "Employee Medical Benefits",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "11",
    account: "Rent",
    accountCode: "",
    debit: 2000.0,
    credit: 0,
    balance: 2000.0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "12",
    account: "Furniture and Equipment",
    accountCode: "",
    debit: 3000.0,
    credit: 0,
    balance: 3000.0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "13",
    account: "Interest Income",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "14",
    account: "GST/HST Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "15",
    account: "Output CGST",
    accountCode: "",
    debit: 0,
    credit: 1530.0,
    balance: -1530.0,
    indentLevel: 1,
    isTotal: false,
  },
  {
    id: "16",
    account: "Output SGST",
    accountCode: "",
    debit: 0,
    credit: 765.0,
    balance: -765.0,
    indentLevel: 1,
    isTotal: false,
  },
  {
    id: "17",
    account: "Total for GST Payable",
    accountCode: "",
    debit: 0,
    credit: 2295.0,
    balance: -2295.0,
    indentLevel: 0,
    isTotal: true,
  },
  {
    id: "18",
    account: "Micro Salary Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "19",
    account: "Total for Micro Salary Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: true,
  },
  {
    id: "20",
    account: "Inventory Asset",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "21",
    account: "Investments",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "22",
    account: "IT and Internet Expenses",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "23",
    account: "General Expenses",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "24",
    account: "HR/Recruitment",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "25",
    account: "Total for Job Costing",
    accountCode: "",
    debit: 1500.0,
    credit: 0,
    balance: 1500.0,
    indentLevel: 0,
    isTotal: true,
  },
  {
    id: "26",
    account: "Job Costing",
    accountCode: "",
    debit: 1500.0,
    credit: 0,
    balance: 1500.0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "27",
    account: "Loans",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "28",
    account: "Loss on Assets",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "29",
    account: "Utilities",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "30",
    account: "Wages and Salaries",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "31",
    account: "Membership",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "32",
    account: "Due from Payee",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "33",
    account: "GST Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "34",
    account: "Opening Balance Adjustments",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "35",
    account: "Opening Balance O/E",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "36",
    account: "GST 415",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "37",
    account: "Other Income",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "38",
    account: "Owner's Equity",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "39",
    account: "Payroll Tax Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "40",
    account: "Every.com",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "41",
    account: "Prepaid",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "42",
    account: "Rounding",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "43",
    account: "Sales",
    accountCode: "",
    debit: 0,
    credit: 8500.0,
    balance: -8500.0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "44",
    account: "Sales Discounts",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "45",
    account: "Sales Tax Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "46",
    account: "GST/HST Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "47",
    account: "Statutory Deductions Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "48",
    account: "Subcontractor",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "49",
    account: "Tax Payable",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "50",
    account: "Telephone",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "51",
    account: "Unearned Revenue",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "52",
    account: "Uncategorised",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "53",
    account: "Unpaid Bills",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "54",
    account: "Unpresented Cheques",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
  {
    id: "55",
    account: "Government Remittances",
    accountCode: "",
    debit: 0,
    credit: 0,
    balance: 0,
    indentLevel: 0,
    isTotal: false,
  },
];

const columns: ColumnConfig[] = [
  { key: "account", label: "Account", sortable: true, defaultVisible: true },
  { key: "accountCode", label: "Account Code", sortable: true, defaultVisible: true },
  { key: "debit", label: "Debit", sortable: true, defaultVisible: true },
  { key: "credit", label: "Credit", sortable: true, defaultVisible: true },
  { key: "balance", label: "Balance", sortable: true, defaultVisible: true },
];

const GeneralLedger: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows] = useState<GeneralLedgerRow[]>(() => buildDemoRows());

  const reportDateStr = useMemo(
    () => new Intl.DateTimeFormat("en-GB").format(new Date()),
    []
  );

  const periodLabel = useMemo(
    () =>
      `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`,
    [filters.fromDate, filters.toDate]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    // Wire to API; periodLabel / filters reflect selected range
  };

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 border-[#D5DbDB] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            General Ledger
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
          <h1 className="mt-1 text-3xl font-semibold text-[#111827]">General Ledger</h1>
          <p className="mt-2 text-sm text-[#667085]">
            <span className="font-medium text-[#344054]">Basis</span> : Accrual
          </p>
          <p className="mt-1 text-sm text-[#667085]">{periodLabel}</p>
          <p className="mt-0.5 text-sm text-[#667085]">Report Date: {reportDateStr}</p>
        </div>

        <div className="p-6">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            storageKey="general-ledger"
            enableSearch={true}
            enableExport={true}
            exportFileName="general-ledger"
            searchPlaceholder="Search accounts..."
            emptyMessage="No data available for the selected date range."
            renderCell={(item, columnKey) => {
              switch (columnKey) {
                case "account":
                  return (
                    <div
                      className={`text-sm ${
                        item.isTotal ? "font-bold text-[#1A1A1A]" : "font-medium text-[#1A1A1A]"
                      }`}
                      style={{ paddingLeft: 12 + (item.indentLevel || 0) * 20 }}
                    >
                      {item.account}
                    </div>
                  );
                case "accountCode":
                  return (
                    <div className="text-center text-sm text-[#4a4a4a]">
                      {item.accountCode || ""}
                    </div>
                  );
                case "debit":
                  return (
                    <div className="text-right text-sm font-medium text-blue-600">
                      {formatCurrency(item.debit)}
                    </div>
                  );
                case "credit":
                  return (
                    <div className="text-right text-sm font-medium text-blue-600">
                      {formatCurrency(item.credit)}
                    </div>
                  );
                case "balance":
                  return (
                    <div className="text-right text-sm font-medium text-blue-600">
                      {formatBalance(item.balance)}
                    </div>
                  );
                default:
                  return item[columnKey];
              }
            }}
            getRowClassName={(item) => {
              if (item.isTotal) {
                return "bg-gray-200 font-semibold";
              }
              return "";
            }}
            headerCellClassName="bg-[#E5E0D3] text-xs font-semibold uppercase tracking-wide text-[#1A1A1A]"
            cellClassName="border border-gray-300 px-4 py-3"
            tableWrapperClassName="border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralLedger;
