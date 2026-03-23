import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface BillableExpenseRow {
  date: string;
  transaction_no: string;
  vendor_name: string;
  item_name: string;
  item_amount_bcy: number;
  markup_percent: number;
  invoice_item_amount_bcy: number;
  marked_up_amount: number;
  gross_profit: number;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_no", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "item_amount_bcy", label: "ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "markup_percent", label: "MARKUP (%)", sortable: true, hideable: false, draggable: true },
  { key: "invoice_item_amount_bcy", label: "INVOICE ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "marked_up_amount", label: "MARKED UP AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "gross_profit", label: "GROSS PROFIT", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDateRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    fromDate: firstDay.toLocaleDateString("en-GB"),
    toDate: lastDay.toLocaleDateString("en-GB"),
  };
};

const BillableExpenseDetails: React.FC = () => {
  const [rows] = useState<BillableExpenseRow[]>([]);
  const [filters, setFilters] = useState(formatDateRange);
  const [loading] = useState(false);

  const headerDateRangeText = useMemo(
    () => `From ${filters.fromDate} To ${filters.toDate}`,
    [filters.fromDate, filters.toDate]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const renderRow = (row: BillableExpenseRow) => ({
    date: <span className="text-[13px] font-medium text-[#111827]">{row.date}</span>,
    transaction_no: <span className="text-[13px] font-medium text-[#111827]">{row.transaction_no}</span>,
    vendor_name: <span className="text-[13px] font-medium text-[#111827]">{row.vendor_name}</span>,
    item_name: <span className="text-[13px] font-medium text-[#111827]">{row.item_name}</span>,
    item_amount_bcy: <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#111827]">{row.item_amount_bcy}</span>,
    markup_percent: <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#111827]">{row.markup_percent}</span>,
    invoice_item_amount_bcy: (
      <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#111827]">{row.invoice_item_amount_bcy}</span>
    ),
    marked_up_amount: <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#111827]">{row.marked_up_amount}</span>,
    gross_profit: <span className="inline-flex w-full justify-end text-[13px] font-medium text-[#111827]">{row.gross_profit}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">

        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Billable Expense Details</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={toInputDate(filters.fromDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />

            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={toInputDate(filters.toDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />

            <Button className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]">View</Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Billable Expense Details</h1>
          <p className="mt-2 text-[14px] text-[#344054]">{headerDateRangeText}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="billable-expense-details-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No data to display"
            toolbarClassName="hidden"
            headerCellClassName="bg-[#F9FAFB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide py-3 px-4"
            rowClassName="border-b border-[#EAECF0] hover:bg-[#F9FAFB] transition-colors"
            cellClassName="py-3 px-4"
          />
        </div>
      </div>
    </div>
  );
};

export default BillableExpenseDetails;
