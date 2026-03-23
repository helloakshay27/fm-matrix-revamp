import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SelfInvoiceRow {
  id: string;
  date: string;
  selfInvoiceNumber: string;
  transactionType: string;
  transactionNumber: string;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  cessAmount: number;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true },
  { key: "selfInvoiceNumber", label: "SELF-INVOICE NUMBER", sortable: true },
  { key: "transactionType", label: "TRANSACTION TYPE", sortable: true },
  { key: "transactionNumber", label: "TRANSACTION#", sortable: true },
  { key: "igstAmount", label: "IGST AMOUNT", sortable: true },
  { key: "cgstAmount", label: "CGST AMOUNT", sortable: true },
  { key: "sgstAmount", label: "SGST AMOUNT", sortable: true },
  { key: "cessAmount", label: "CESS AMOUNT", sortable: true },
];

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

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SelfInvoiceSummary: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows] = useState<SelfInvoiceRow[]>([]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleView = () => {
    return;
  };

  const renderRow = (row: SelfInvoiceRow) => ({
    date: <span className="text-[13px] font-medium text-[#101828]">{row.date}</span>,
    selfInvoiceNumber: <span className="text-[13px] font-medium text-[#101828]">{row.selfInvoiceNumber}</span>,
    transactionType: <span className="text-[13px] text-[#344054]">{row.transactionType}</span>,
    transactionNumber: <span className="text-[13px] text-[#344054]">{row.transactionNumber}</span>,
    igstAmount: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.igstAmount)}</span>,
    cgstAmount: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.cgstAmount)}</span>,
    sgstAmount: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.sgstAmount)}</span>,
    cessAmount: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.cessAmount)}</span>,
  });

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827]">Self-invoice Summary</h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
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

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <p className="text-sm text-[#667085]">Lockated</p>
          <h1 className="text-3xl font-semibold text-[#111827]">Self-invoice Summary</h1>
          <p className="mt-1 text-sm text-[#344054]">
            A summary of self-invoices that were generated on your purchase where reverse charge was applied
          </p>
          <p className="mt-1 text-sm text-[#667085]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="self-invoice-summary"
            hideTableSearch
            hideTableExport
            hideColumnsButton
            toolbarClassName="hidden"
            emptyMessage="There are no transactions during the selected date range."
            tableWrapperClassName="min-h-[520px] border border-[#EAECF0]"
            headerCellClassName="text-[11px] font-semibold uppercase text-[#667085]"
          />
        </div>
      </div>
    </div>
  );
};

export default SelfInvoiceSummary;