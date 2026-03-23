import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface OutwardSupplyRow {
  id: string;
  description: string;
  igstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  taxableAmount?: number;
  invoiceTotal?: number;
}

const columns: ColumnConfig[] = [
  { key: "description", label: "DESCRIPTION", sortable: true },
  { key: "igstAmount", label: "IGST AMOUNT", sortable: true },
  { key: "cgstAmount", label: "CGST AMOUNT", sortable: true },
  { key: "sgstAmount", label: "SGST AMOUNT", sortable: true },
  { key: "taxableAmount", label: "TAXABLE AMOUNT", sortable: true },
  { key: "invoiceTotal", label: "INVOICE TOTAL", sortable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SummaryOfOutwardSuppliesGSTR1: React.FC = () => {
  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      fromDate: firstDay.toLocaleDateString("en-GB"),
      toDate: lastDay.toLocaleDateString("en-GB"),
    };
  }, []);

  const [filters, setFilters] = useState(defaultDateRange);

  const rows: OutwardSupplyRow[] = [
    {
      id: "1",
      description:
        "Taxable outward supplies made to registered persons (including UIN-holders)",
      igstAmount: 0,
      cgstAmount: 110,
      sgstAmount: 110,
      taxableAmount: 3980,
      invoiceTotal: 4201.69,
    },
    {
      id: "2",
      description:
        "Taxable outward inter-State supplies to un-registered persons where the invoice value is more than ₹1 lakh",
      igstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "3",
      description: "Zero rated supplies and Deemed Exports",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "4",
      description: "Taxable outward supplies to consumer",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "5",
      description: "Nil rated, Exempted and non GST outward supplies",
      invoiceTotal: 0,
    },
    {
      id: "6",
      description: "Details of Credit/Debit Notes and Refund Voucher",
      igstAmount: 0,
      cgstAmount: 12.5,
      sgstAmount: 12.5,
      taxableAmount: 500,
      invoiceTotal: 535.5,
    },
    {
      id: "7",
      description: "Details of Credit/Debit Notes and Refund Voucher (Unregistered)",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "8",
      description: "Consolidated Statement of Advances Received",
      igstAmount: 0,
      cgstAmount: 11.38,
      sgstAmount: 7.32,
      invoiceTotal: 100,
    },
    {
      id: "9",
      description:
        "Tax already paid (on advance receipt) on invoices issued in the current period",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "10",
      description: "HSN-wise summary of the B2B Supplies",
      igstAmount: 0,
      cgstAmount: 97.5,
      sgstAmount: 97.5,
      taxableAmount: 3480,
      invoiceTotal: 3675,
    },
    {
      id: "11",
      description: "HSN-wise summary of the B2C Supplies",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
    {
      id: "12",
      description: "Supplies made through E-Commerce Operators",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      taxableAmount: 0,
      invoiceTotal: 0,
    },
  ];

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const handleView = () => {
    return;
  };

  const renderRow = (row: OutwardSupplyRow) => ({
    description: (
      <span className="block max-w-[420px] text-[13px] font-medium leading-6 text-[#101828]">
        {row.description}
      </span>
    ),
    igstAmount: (
      <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#101828]">
        {row.igstAmount !== undefined ? formatCurrency(row.igstAmount) : ""}
      </span>
    ),
    cgstAmount: (
      <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#101828]">
        {row.cgstAmount !== undefined ? formatCurrency(row.cgstAmount) : ""}
      </span>
    ),
    sgstAmount: (
      <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#101828]">
        {row.sgstAmount !== undefined ? formatCurrency(row.sgstAmount) : ""}
      </span>
    ),
    taxableAmount: (
      <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#101828]">
        {row.taxableAmount !== undefined ? formatCurrency(row.taxableAmount) : ""}
      </span>
    ),
    invoiceTotal: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {row.invoiceTotal !== undefined ? formatCurrency(row.invoiceTotal) : ""}
      </span>
    ),
  });

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827]">
            Summary of Outward Supplies (GSTR-1)
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={toInputDate(filters.fromDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={toInputDate(filters.toDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          <Button
            onClick={handleView}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <h1 className="text-2xl font-semibold text-[#111827]">
            Summary of Outward Supplies (GSTR-1)
          </h1>
          <p className="text-sm text-[#667085]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="summary-of-outward-supplies-gstr-1"
            hideTableExport
            hideColumnsButton={true}
            hideTableSearch
            toolbarClassName="hidden"
            headerCellClassName="text-[11px] font-semibold uppercase text-[#667085]"
            tableWrapperClassName="border border-[#EAECF0]"
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryOfOutwardSuppliesGSTR1;