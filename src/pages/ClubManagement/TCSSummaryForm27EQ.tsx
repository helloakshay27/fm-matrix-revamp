import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { NotepadText } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface TCSSummaryRow {
  id: string;
  partyName: string;
  pan: string;
  tcsRate: number;
  collectionCode: string;
  reasonForCollection: string;
  collectionDate: string;
  paymentNumber: string;
  invoiceNumber: string;
  totalValue: number;
  taxCollected: number;
  amountReceived: number;
}

const columns: ColumnConfig[] = [
  { key: "partyName", label: "NAME OF THE PARTY", sortable: true },
  { key: "pan", label: "PAN OF THE PARTY", sortable: true },
  { key: "tcsRate", label: "TCS RATE (%)", sortable: true },
  { key: "collectionCode", label: "COLLECTION CODE", sortable: true },
  {
    key: "reasonForCollection",
    label: "REASON FOR COLLECTION",
    sortable: true,
  },
  { key: "collectionDate", label: "COLLECTION DATE", sortable: true },
  { key: "paymentNumber", label: "PAYMENT NUMBER", sortable: true },
  { key: "invoiceNumber", label: "INVOICE NUMBER", sortable: true },
  { key: "totalValue", label: "TOTAL VALUE", sortable: true },
  { key: "taxCollected", label: "TAX COLLECTED", sortable: true },
  { key: "amountReceived", label: "AMOUNT RECEIVED", sortable: true },
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

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const TCSSummaryForm27EQ: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);

  const [filters, setFilters] = useState({
    ...defaultRange,
    basis: "Cash",
  });

  // Keep empty for now to match report empty-state UI from design.
  const [reportRows, setReportRows] = useState<TCSSummaryRow[]>([]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBasisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, basis: event.target.value }));
  };

  const renderRow = (row: TCSSummaryRow) => ({
    partyName: <span className="text-[13px] font-medium text-[#101828]">{row.partyName}</span>,
    pan: <span className="text-[13px] text-[#344054]">{row.pan}</span>,
    tcsRate: <span className="text-[13px] text-[#101828]">{row.tcsRate.toFixed(2)}</span>,
    collectionCode: <span className="text-[13px] text-[#344054]">{row.collectionCode}</span>,
    reasonForCollection: <span className="text-[13px] text-[#344054]">{row.reasonForCollection}</span>,
    collectionDate: <span className="text-[13px] text-[#344054]">{row.collectionDate}</span>,
    paymentNumber: <span className="text-[13px] text-[#344054]">{row.paymentNumber}</span>,
    invoiceNumber: <span className="text-[13px] font-medium text-[#2563eb]">{row.invoiceNumber}</span>,
    totalValue: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.totalValue)}</span>,
    taxCollected: <span className="inline-flex w-full justify-end text-[13px] text-[#101828]">{formatCurrency(row.taxCollected)}</span>,
    amountReceived: <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#101828]">{formatCurrency(row.amountReceived)}</span>,
  });

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827]">TCS Summary (Form No. 27EQ)</h3>
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

          <TextField
            select
            label="Basis"
            value={filters.basis}
            onChange={handleBasisChange}
            fullWidth
            size="small"
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Accrual">Accrual</MenuItem>
          </TextField>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <p className="text-sm text-[#667085]">Lockated</p>
          <h1 className="text-3xl font-semibold text-[#111827]">TCS Summary (Form No. 27EQ)</h1>
          <p className="mt-1 text-sm text-[#667085]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
          <p className="mt-1 text-sm text-[#667085]">Basis : {filters.basis}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="tcs-summary-form-27eq"
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

export default TCSSummaryForm27EQ;