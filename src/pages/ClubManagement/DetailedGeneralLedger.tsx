import React, { useMemo, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { ScrollText, Settings, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DetailedLedgerRowKind = "group" | "opening" | "transaction" | "closing";

export interface DetailedGeneralLedgerRow {
  id: string;
  kind: DetailedLedgerRowKind;
  groupName?: string;
  date: string;
  account: string;
  transactionDetails: string;
  transactionType: string;
  transactionNo: string;
  reference: string;
  debit: number | null;
  credit: number | null;
  amount: number | null;
  amountDrCr: "Dr" | "Cr" | null;
}

const getQuarterRange = () => {
  const today = new Date();
  const quarter = Math.floor(today.getMonth() / 3);
  const startMonth = quarter * 3;
  const from = new Date(today.getFullYear(), startMonth, 1);
  const to = new Date(today.getFullYear(), startMonth + 3, 0);
  return {
    fromDate: from.toISOString().split("T")[0],
    toDate: to.toISOString().split("T")[0],
  };
};

const formatDisplayDate = (value: string) => {
  if (!value) return "";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const em = "—";

const ThSort = ({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) => (
  <th
    className={`border border-gray-300 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1A1A1A] ${
      align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
    }`}
  >
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" aria-hidden />
    </span>
  </th>
);

const buildDemoRows = (
  fromDate: string,
  toDate: string
): DetailedGeneralLedgerRow[] => {
  const asOnStart = `As On ${formatDisplayDate(fromDate)}`;
  const asOnEnd = `As On ${formatDisplayDate(toDate)}`;

  return [
    // Bank Fees and Charges
    {
      id: "g-bank",
      kind: "group",
      groupName: "Bank Fees and Charges",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "bank-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 500.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "bank-1",
      kind: "transaction",
      date: "05/01/2026",
      account: "Bank Charges",
      transactionDetails: "Monthly service fee",
      transactionType: "Expense",
      transactionNo: "EXP001",
      reference: "BANK001",
      debit: 25.0,
      credit: null,
      amount: 25.0,
      amountDrCr: "Dr",
    },
    {
      id: "bank-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 525.0,
      amount: null,
      amountDrCr: null,
    },

    // Cost of Goods Sold
    {
      id: "g-cogs",
      kind: "group",
      groupName: "Cost of Goods Sold",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "cogs-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 2500.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "cogs-1",
      kind: "transaction",
      date: "10/01/2026",
      account: "Raw Materials",
      transactionDetails: "Material purchase",
      transactionType: "Purchase",
      transactionNo: "PUR001",
      reference: "SUP001",
      debit: 750.0,
      credit: null,
      amount: 750.0,
      amountDrCr: "Dr",
    },
    {
      id: "cogs-2",
      kind: "transaction",
      date: "15/01/2026",
      account: "Direct Labor",
      transactionDetails: "Production wages",
      transactionType: "Payment",
      transactionNo: "PAY001",
      reference: "PAYR001",
      debit: 500.0,
      credit: null,
      amount: 500.0,
      amountDrCr: "Dr",
    },
    {
      id: "cogs-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 3750.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Discount
    {
      id: "g-discount",
      kind: "group",
      groupName: "Discount",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "discount-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "discount-1",
      kind: "transaction",
      date: "12/01/2026",
      account: "Sales Discount",
      transactionDetails: "Early payment discount",
      transactionType: "Discount",
      transactionNo: "DISC001",
      reference: "INV001",
      debit: null,
      credit: 100.0,
      amount: 100.0,
      amountDrCr: "Cr",
    },
    {
      id: "discount-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: 100.0,
      amount: null,
      amountDrCr: null,
    },

    // Employee Reimbursements
    {
      id: "g-emp",
      kind: "group",
      groupName: "Employee Reimbursements",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "emp-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 300.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "emp-1",
      kind: "transaction",
      date: "08/01/2026",
      account: "Travel Expenses",
      transactionDetails: "Business trip reimbursement",
      transactionType: "Reimbursement",
      transactionNo: "REIMB001",
      reference: "EMP001",
      debit: 150.0,
      credit: null,
      amount: 150.0,
      amountDrCr: "Dr",
    },
    {
      id: "emp-2",
      kind: "transaction",
      date: "20/01/2026",
      account: "Office Supplies",
      transactionDetails: "Employee purchase reimbursement",
      transactionType: "Reimbursement",
      transactionNo: "REIMB002",
      reference: "EMP002",
      debit: 75.0,
      credit: null,
      amount: 75.0,
      amountDrCr: "Dr",
    },
    {
      id: "emp-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 525.0,
      amount: null,
      amountDrCr: null,
    },

    // Furniture and Equipment
    {
      id: "g-furniture",
      kind: "group",
      groupName: "Furniture and Equipment",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "furniture-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 10000.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "furniture-1",
      kind: "transaction",
      date: "18/01/2026",
      account: "Office Furniture",
      transactionDetails: "New desk purchase",
      transactionType: "Asset",
      transactionNo: "AST001",
      reference: "VEND001",
      debit: 1200.0,
      credit: null,
      amount: 1200.0,
      amountDrCr: "Dr",
    },
    {
      id: "furniture-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 11200.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Goods Cost
    {
      id: "g-goods",
      kind: "group",
      groupName: "Goods cost",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "goods-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 3000.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "goods-1",
      kind: "transaction",
      date: "22/01/2026",
      account: "Inventory",
      transactionDetails: "Stock purchase",
      transactionType: "Purchase",
      transactionNo: "STK001",
      reference: "SUP002",
      debit: 800.0,
      credit: null,
      amount: 800.0,
      amountDrCr: "Dr",
    },
    {
      id: "goods-2",
      kind: "transaction",
      date: "25/01/2026",
      account: "Inventory",
      transactionDetails: "Wholesale purchase",
      transactionType: "Purchase",
      transactionNo: "STK002",
      reference: "SUP003",
      debit: 1200.0,
      credit: null,
      amount: 1200.0,
      amountDrCr: "Dr",
    },
    {
      id: "goods-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 5000.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    {
      id: "g-ap",
      kind: "group",
      groupName: "Accounts Payable",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "ap-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 1250.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "ap-1",
      kind: "transaction",
      date: "11/01/2026",
      account: "Accounts Payable",
      transactionDetails: "Geohospital",
      transactionType: "Bill",
      transactionNo: "45",
      reference: "OR300000",
      debit: 382.5,
      credit: null,
      amount: 382.5,
      amountDrCr: "Dr",
    },
    {
      id: "ap-2",
      kind: "transaction",
      date: "15/01/2026",
      account: "Accounts Payable",
      transactionDetails: "Lockwood",
      transactionType: "Vendor Payment",
      transactionNo: "1221",
      reference: "P2-C0033",
      debit: null,
      credit: 200.0,
      amount: 200.0,
      amountDrCr: "Cr",
    },
    {
      id: "ap-3",
      kind: "transaction",
      date: "18/01/2026",
      account: "Accounts Payable",
      transactionDetails: "Supplies Inc",
      transactionType: "Bill",
      transactionNo: "46",
      reference: "OR300011",
      debit: 150.0,
      credit: null,
      amount: 150.0,
      amountDrCr: "Dr",
    },
    {
      id: "ap-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 1067.5,
      amount: null,
      amountDrCr: null,
    },

    {
      id: "g-ar",
      kind: "group",
      groupName: "Accounts Receivable",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "ar-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 5000.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "ar-1",
      kind: "transaction",
      date: "20/01/2026",
      account: "Accounts Receivable",
      transactionDetails: "Acme Corp — Sales",
      transactionType: "Invoice",
      transactionNo: "INV-0383",
      reference: "SO-1001",
      debit: null,
      credit: 1500.0,
      amount: 1500.0,
      amountDrCr: "Cr",
    },
    {
      id: "ar-2",
      kind: "transaction",
      date: "21/01/2026",
      account: "Accounts Receivable",
      transactionDetails: "Return — damaged goods",
      transactionType: "Credit Note",
      transactionNo: "CN-0092",
      reference: "INV-0383-R",
      debit: 250.0,
      credit: null,
      amount: 250.0,
      amountDrCr: "Dr",
    },
    {
      id: "ar-3",
      kind: "transaction",
      date: "22/01/2026",
      account: "Undeposited Funds",
      transactionDetails: "Customer Y — cheque",
      transactionType: "Customer Payment",
      transactionNo: "PMT-88",
      reference: "CHQ-441",
      debit: 800.0,
      credit: null,
      amount: 800.0,
      amountDrCr: "Dr",
    },
    {
      id: "ar-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 4300.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    {
      id: "g-at",
      kind: "group",
      groupName: "Advance Tax",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "at-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "at-1",
      kind: "transaction",
      date: "25/01/2026",
      account: "Advance Tax",
      transactionDetails: "TDS on purchase",
      transactionType: "Journal",
      transactionNo: "JR-2001",
      reference: "TDS-Q4",
      debit: null,
      credit: 450.0,
      amount: 450.0,
      amountDrCr: "Cr",
    },
    {
      id: "at-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: 450.0,
      amount: null,
      amountDrCr: null,
    },

    // Unearned Revenue
    {
      id: "g-unearned",
      kind: "group",
      groupName: "Unearned Revenue",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "unearned-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 3548.55,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "unearned-1",
      kind: "transaction",
      date: "16/03/2026",
      account: "Unearned Revenue",
      transactionDetails: "Customer Payment",
      transactionType: "Lockated",
      transactionNo: "INV-000003",
      reference: "",
      debit: null,
      credit: 19.75,
      amount: 19.75,
      amountDrCr: "Cr",
    },
    {
      id: "unearned-2",
      kind: "transaction",
      date: "16/03/2026",
      account: "Unearned Revenue",
      transactionDetails: "Customer Payment",
      transactionType: "Lockated",
      transactionNo: "INV-0393",
      reference: "",
      debit: null,
      credit: 80.25,
      amount: 80.25,
      amountDrCr: "Cr",
    },
    {
      id: "unearned-3",
      kind: "transaction",
      date: "24/03/2026",
      account: "Unearned Revenue",
      transactionDetails: "Customer Payment",
      transactionType: "Lockated",
      transactionNo: "14",
      reference: "RFN83737",
      debit: null,
      credit: 3803.69,
      amount: 3803.69,
      amountDrCr: "Cr",
    },
    {
      id: "unearned-4",
      kind: "transaction",
      date: "24/03/2026",
      account: "Unearned Revenue",
      transactionDetails: "Customer Payment",
      transactionType: "Lockated",
      transactionNo: "INV-0393",
      reference: "RFN83737",
      debit: null,
      credit: 244.75,
      amount: 244.75,
      amountDrCr: "Cr",
    },
    {
      id: "unearned-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 7696.99,
      amount: null,
      amountDrCr: null,
    },

    // Interest Income
    {
      id: "g-interest",
      kind: "group",
      groupName: "Interest Income",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "interest-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "interest-1",
      kind: "transaction",
      date: "20/03/2026",
      account: "Interest Income",
      transactionDetails: "Bank interest",
      transactionType: "Income",
      transactionNo: "INT001",
      reference: "BANK002",
      debit: null,
      credit: 150.50,
      amount: 150.50,
      amountDrCr: "Cr",
    },
    {
      id: "interest-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: 150.50,
      amount: null,
      amountDrCr: null,
    },

    // Automobile Expense
    {
      id: "g-automobile",
      kind: "group",
      groupName: "Automobile Expense",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "automobile-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 2500.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "automobile-1",
      kind: "transaction",
      date: "12/03/2026",
      account: "Fuel Expense",
      transactionDetails: "Gasoline",
      transactionType: "Expense",
      transactionNo: "FUEL001",
      reference: "PUMP001",
      debit: 350.0,
      credit: null,
      amount: 350.0,
      amountDrCr: "Dr",
    },
    {
      id: "automobile-2",
      kind: "transaction",
      date: "18/03/2026",
      account: "Vehicle Maintenance",
      transactionDetails: "Oil change",
      transactionType: "Expense",
      transactionNo: "MAINT001",
      reference: "AUTO001",
      debit: 125.0,
      credit: null,
      amount: 125.0,
      amountDrCr: "Dr",
    },
    {
      id: "automobile-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 2975.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Salaries and Employee Wages
    {
      id: "g-salaries",
      kind: "group",
      groupName: "Salaries and Employee Wages",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "salaries-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 8500.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "salaries-1",
      kind: "transaction",
      date: "31/03/2026",
      account: "Monthly Salary",
      transactionDetails: "March salary payment",
      transactionType: "Payment",
      transactionNo: "SAL001",
      reference: "PAYR002",
      debit: 3200.0,
      credit: null,
      amount: 3200.0,
      amountDrCr: "Dr",
    },
    {
      id: "salaries-2",
      kind: "transaction",
      date: "31/03/2026",
      account: "Employee Wages",
      transactionDetails: "Hourly wages",
      transactionType: "Payment",
      transactionNo: "WAGE001",
      reference: "PAYR003",
      debit: 1800.0,
      credit: null,
      amount: 1800.0,
      amountDrCr: "Dr",
    },
    {
      id: "salaries-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 13500.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Drawings
    {
      id: "g-drawings",
      kind: "group",
      groupName: "Drawings",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "drawings-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "drawings-1",
      kind: "transaction",
      date: "15/03/2026",
      account: "Owner Drawings",
      transactionDetails: "Owner withdrawal",
      transactionType: "Drawing",
      transactionNo: "DRAW001",
      reference: "OWN001",
      debit: 2000.0,
      credit: null,
      amount: 2000.0,
      amountDrCr: "Dr",
    },
    {
      id: "drawings-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 2000.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Materials
    {
      id: "g-materials",
      kind: "group",
      groupName: "Materials",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "materials-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 4500.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "materials-1",
      kind: "transaction",
      date: "10/03/2026",
      account: "Raw Materials",
      transactionDetails: "Steel purchase",
      transactionType: "Purchase",
      transactionNo: "MAT001",
      reference: "SUP004",
      debit: 1200.0,
      credit: null,
      amount: 1200.0,
      amountDrCr: "Dr",
    },
    {
      id: "materials-2",
      kind: "transaction",
      date: "22/03/2026",
      account: "Office Supplies",
      transactionDetails: "Stationery",
      transactionType: "Purchase",
      transactionNo: "MAT002",
      reference: "SUP005",
      debit: 350.0,
      credit: null,
      amount: 350.0,
      amountDrCr: "Dr",
    },
    {
      id: "materials-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: 6050.0,
      credit: null,
      amount: null,
      amountDrCr: null,
    },

    // Subcontractor
    {
      id: "g-subcontractor",
      kind: "group",
      groupName: "Subcontractor",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "subcontractor-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 3200.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "subcontractor-1",
      kind: "transaction",
      date: "08/03/2026",
      account: "Subcontractor Services",
      transactionDetails: "IT consulting",
      transactionType: "Service",
      transactionNo: "SUB001",
      reference: "CON001",
      debit: 800.0,
      credit: null,
      amount: 800.0,
      amountDrCr: "Dr",
    },
    {
      id: "subcontractor-2",
      kind: "transaction",
      date: "20/03/2026",
      account: "Subcontractor Payment",
      transactionDetails: "Payment to contractor",
      transactionType: "Payment",
      transactionNo: "SUBP001",
      reference: "PAYR004",
      debit: null,
      credit: 1500.0,
      amount: 1500.0,
      amountDrCr: "Cr",
    },
    {
      id: "subcontractor-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 3900.0,
      amount: null,
      amountDrCr: null,
    },

    // Capital Stock
    {
      id: "g-capital",
      kind: "group",
      groupName: "Capital Stock",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "capital-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 25000.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "capital-1",
      kind: "transaction",
      date: "05/03/2026",
      account: "Capital Stock",
      transactionDetails: "New investment",
      transactionType: "Investment",
      transactionNo: "CAP001",
      reference: "INV001",
      debit: null,
      credit: 5000.0,
      amount: 5000.0,
      amountDrCr: "Cr",
    },
    {
      id: "capital-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 30000.0,
      amount: null,
      amountDrCr: null,
    },

    // Payroll Tax Payable
    {
      id: "g-payroll",
      kind: "group",
      groupName: "Payroll Tax Payable",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "payroll-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 1850.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "payroll-1",
      kind: "transaction",
      date: "31/03/2026",
      account: "Payroll Tax",
      transactionDetails: "Monthly payroll tax",
      transactionType: "Tax",
      transactionNo: "TAX001",
      reference: "TAXR001",
      debit: null,
      credit: 680.0,
      amount: 680.0,
      amountDrCr: "Cr",
    },
    {
      id: "payroll-2",
      kind: "transaction",
      date: "15/03/2026",
      account: "Payroll Tax Payment",
      transactionDetails: "Tax payment",
      transactionType: "Payment",
      transactionNo: "TAXP001",
      reference: "GOVT001",
      debit: 450.0,
      credit: null,
      amount: 450.0,
      amountDrCr: "Dr",
    },
    {
      id: "payroll-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 2080.0,
      amount: null,
      amountDrCr: null,
    },

    // Net Salary Payable
    {
      id: "g-net-salary",
      kind: "group",
      groupName: "Net Salary Payable",
      date: "",
      account: "",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: null,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "net-salary-ob",
      kind: "opening",
      date: asOnStart,
      account: "Opening Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 4200.0,
      amount: null,
      amountDrCr: null,
    },
    {
      id: "net-salary-1",
      kind: "transaction",
      date: "31/03/2026",
      account: "Net Salary",
      transactionDetails: "March net salary",
      transactionType: "Salary",
      transactionNo: "SAL002",
      reference: "PAYR005",
      debit: null,
      credit: 3800.0,
      amount: 3800.0,
      amountDrCr: "Cr",
    },
    {
      id: "net-salary-2",
      kind: "transaction",
      date: "25/03/2026",
      account: "Salary Payment",
      transactionDetails: "Salary advance payment",
      transactionType: "Payment",
      transactionNo: "SALP001",
      reference: "BANK003",
      debit: 2000.0,
      credit: null,
      amount: 2000.0,
      amountDrCr: "Dr",
    },
    {
      id: "net-salary-cb",
      kind: "closing",
      date: asOnEnd,
      account: "Closing Balance",
      transactionDetails: "",
      transactionType: "",
      transactionNo: "",
      reference: "",
      debit: null,
      credit: 6000.0,
      amount: null,
      amountDrCr: null,
    },
  ];
};

const DetailedGeneralLedger: React.FC = () => {
  const defaultRange = useMemo(() => getQuarterRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<DetailedGeneralLedgerRow[]>(() =>
    buildDemoRows(defaultRange.fromDate, defaultRange.toDate)
  );

  const rangeLabel = useMemo(() => {
    const from = formatDisplayDate(filters.fromDate);
    const to = formatDisplayDate(filters.toDate);
    return `From ${from} To ${to}`;
  }, [filters.fromDate, filters.toDate]);

  const reportDateStr = useMemo(
    () => new Intl.DateTimeFormat("en-GB").format(new Date()),
    []
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    setReportRows(buildDemoRows(filters.fromDate, filters.toDate));
  };

  const handleCustomizeReport = useCallback(() => {
    // Hook for customize dialog / navigation
  }, []);

  const onTxnClick = useCallback((_txn: string) => {
    // Wire navigation or detail modal when routes exist
  }, []);

  const linkBtn =
    "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium";

  const renderRow = (row: DetailedGeneralLedgerRow) => {
    if (row.kind === "group") {
      return (
        <tr key={row.id} className="bg-gray-100 font-bold">
          <td
            colSpan={9}
            className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]"
          >
            {row.groupName}
          </td>
        </tr>
      );
    }

    if (row.kind === "opening" || row.kind === "closing") {
      return (
        <tr key={row.id} className="bg-gray-50">
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
            {row.date}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
            {row.account}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#6b7280]">
            {em}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#6b7280]">
            {em}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#6b7280]">
            {em}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#6b7280]">
            {em}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-blue-600">
            {row.debit !== null ? formatCurrency(row.debit) : ""}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-blue-600">
            {row.credit !== null ? formatCurrency(row.credit) : ""}
          </td>
          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-[#6b7280]">
            {em}
          </td>
        </tr>
      );
    }

    return (
      <tr key={row.id} className="hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
          {row.date}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
          {row.account}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
          {row.transactionDetails}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#1A1A1A]">
          {row.transactionType}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-left text-sm">
          {row.transactionNo ? (
            <button
              type="button"
              className={linkBtn}
              onClick={() => onTxnClick(row.transactionNo)}
            >
              {row.transactionNo}
            </button>
          ) : (
            <span className="text-[#6b7280]">{em}</span>
          )}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-left text-sm text-[#4a4a4a]">
          {row.reference || em}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-right text-sm">
          {row.debit !== null ? (
            <button type="button" className={linkBtn}>
              {formatCurrency(row.debit)}
            </button>
          ) : (
            ""
          )}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-right text-sm">
          {row.credit !== null ? (
            <button type="button" className={linkBtn}>
              {formatCurrency(row.credit)}
            </button>
          ) : (
            ""
          )}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-right text-sm">
          {row.amount !== null && row.amountDrCr ? (
            <button type="button" className={linkBtn}>
              {formatCurrency(row.amount)} {row.amountDrCr}
            </button>
          ) : (
            ""
          )}
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
            <ScrollText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Detailed General Ledger
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
        <div className="relative border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCustomizeReport}
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-[#EEF2FF] hover:text-blue-800"
          >
            <Settings className="h-4 w-4" />
            Customize Report
          </Button>

          <div className="mx-auto max-w-3xl px-4 text-center md:px-12">
            <p className="text-sm text-[#667085]">Lockated</p>
            <h1 className="mt-1 text-3xl font-semibold text-[#111827]">
              Detailed General Ledger
            </h1>
            <p className="mt-2 text-sm text-[#667085]">
              <span className="font-medium text-[#344054]">Basis</span> : Accrual
            </p>
            <p className="mt-1 text-sm text-[#667085]">{rangeLabel}</p>
            <p className="mt-0.5 text-sm text-[#667085]">
              Report Date: {reportDateStr}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#E5E0D3]">
                  <ThSort align="left">Date</ThSort>
                  <ThSort align="left">Account</ThSort>
                  <ThSort align="left">Transaction Details</ThSort>
                  <ThSort align="left">Transaction Type</ThSort>
                  <ThSort align="left">Transaction #</ThSort>
                  <ThSort align="left">Reference</ThSort>
                  <ThSort align="right">Debit</ThSort>
                  <ThSort align="right">Credit</ThSort>
                  <ThSort align="right">Amount</ThSort>
                </tr>
              </thead>
              <tbody>
                {reportRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="border border-gray-300 px-4 py-6 text-center text-gray-500"
                    >
                      No data available for the selected date range.
                    </td>
                  </tr>
                ) : (
                  reportRows.map((row) => renderRow(row))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedGeneralLedger;
