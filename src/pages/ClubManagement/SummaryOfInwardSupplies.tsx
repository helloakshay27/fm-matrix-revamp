import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface InwardSupplyRow {
  id: string;
  description: string;
  igstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  billTotal?: number;
}

const columns: ColumnConfig[] = [
  { key: "description", label: "DESCRIPTION", sortable: true },
  { key: "igstAmount", label: "IGST AMOUNT", sortable: true },
  { key: "cgstAmount", label: "CGST AMOUNT", sortable: true },
  { key: "sgstAmount", label: "SGST AMOUNT", sortable: true },
  { key: "billTotal", label: "BILL TOTAL", sortable: true },
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

const SummaryOfInwardSupplies: React.FC = () => {
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

  const [rows] = useState<InwardSupplyRow[]>([
    {
      id: "1",
      description: "Purchases Received From Registered taxpayers",
      igstAmount: 0,
      cgstAmount: 1383.5,
      sgstAmount: 1383.5,
      billTotal: 57967,
    },
    {
      id: "2",
      description: "Purchases Received From Unregistered taxpayers",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      billTotal: 0,
    },
    {
      id: "3",
      description: "Details of Credit/Debit Notes/Refund Voucher",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      billTotal: 0,
    },
    {
      id: "4",
      description:
        "Details of Credit/Debit Notes/Refund Voucher for Unregistered Vendor",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      billTotal: 0,
    },
    {
      id: "5",
      description: "Goods /Capital goods received from Overseas",
      igstAmount: 0,
      billTotal: 0,
    },
    {
      id: "6",
      description: "Services received from Overseas",
      igstAmount: 0,
      billTotal: 0,
    },
    {
      id: "7",
      description:
        "Supplies received from compounding dealer & other exempt/nil/non GST supplies",
      billTotal: 0,
    },
    {
      id: "8",
      description: "HSN-wise summary of inward supplies",
      igstAmount: 0,
      cgstAmount: 1383.5,
      sgstAmount: 1383.5,
      billTotal: 57967,
    },
    {
      id: "9",
      description: "TDS Credit received",
    },
    {
      id: "10",
      description: "ISD credit received",
    },
    {
      id: "11",
      description: "Inwards Supplies on which tax is to be paid on reverse charge",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
    },
    {
      id: "12",
      description: "Advances paid on account of receipt of supply",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      billTotal: 0,
    },
    {
      id: "13",
      description: "Advance adjusted on account of receipt of supply",
      igstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      billTotal: 0,
    },
  ]);

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

  const renderRow = (row: InwardSupplyRow) => ({
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
    billTotal: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {row.billTotal !== undefined ? formatCurrency(row.billTotal) : ""}
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
            Summary of Inward Supplies (GSTR-2)
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
            Summary of Inward Supplies (GSTR-2)
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
            storageKey="summary-of-inward-supplies"
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

export default SummaryOfInwardSupplies;