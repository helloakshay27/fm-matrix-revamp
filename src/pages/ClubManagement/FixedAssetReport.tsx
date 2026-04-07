import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface FixedAssetRow {
  id: string;
  fixedAssetNumber: string;
  name: string;
  status: string;
  fixedAssetType: string;
  purchaseDate: string;
  purchaseValue: number;
  currentAssetValue: number;
  openingAssetValue: number;
  depreciationValue: number;
  closingAssetValue: number;
}

const columns: ColumnConfig[] = [
  {
    key: "fixedAssetNumber",
    label: "FIXED ASSET #",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  { key: "name", label: "NAME", sortable: true, hideable: true, draggable: true },
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "fixedAssetType",
    label: "FIXED ASSET TYPE",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "purchaseDate",
    label: "PURCHASE DATE",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "purchaseValue",
    label: "PURCHASE VALUE",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "currentAssetValue",
    label: "CURRENT ASSET VALUE",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "openingAssetValue",
    label: "OPENING ASSET VALUE (CURRENT PERIOD)",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "depreciationValue",
    label: "DEPRECIATION VALUE (CURRENT PERIOD)",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "closingAssetValue",
    label: "CLOSING ASSET VALUE (CURRENT PERIOD)",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

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

/** Indian FY: 1 Apr → 31 Mar */
const getDefaultFiscalYearRange = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  let startYear: number;
  let endYear: number;
  if (m >= 3) {
    startYear = y;
    endYear = y + 1;
  } else {
    startYear = y - 1;
    endYear = y;
  }
  return {
    fromDate: `${startYear}-04-01`,
    toDate: `${endYear}-03-31`,
  };
};

const FixedAssetReport: React.FC = () => {
  const defaultRange = useMemo(() => getDefaultFiscalYearRange(), []);
  const [filters, setFilters] = useState({
    fromDate: defaultRange.fromDate,
    toDate: defaultRange.toDate,
  });
  const [rows] = useState<FixedAssetRow[]>([]);
  const [loading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const headerLine = useMemo(() => {
    const from = formatDisplayDate(filters.fromDate);
    const to = formatDisplayDate(filters.toDate);
    return `From ${from} To ${to}`;
  }, [filters.fromDate, filters.toDate]);

  const handleView = () => {
    // Hook for API: load fixed assets for filters.fromDate / filters.toDate
  };

  const renderRow = (row: FixedAssetRow) => ({
    fixedAssetNumber: (
      <span className="text-[13px] font-medium text-[#101828]">
        {row.fixedAssetNumber}
      </span>
    ),
    name: <span className="text-[13px] text-[#101828]">{row.name}</span>,
    status: <span className="text-[13px] text-[#101828]">{row.status}</span>,
    fixedAssetType: (
      <span className="text-[13px] text-[#101828]">{row.fixedAssetType}</span>
    ),
    purchaseDate: (
      <span className="text-[13px] tabular-nums text-[#101828]">
        {formatDisplayDate(row.purchaseDate)}
      </span>
    ),
    purchaseValue: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
        {formatCurrency(row.purchaseValue)}
      </span>
    ),
    currentAssetValue: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
        {formatCurrency(row.currentAssetValue)}
      </span>
    ),
    openingAssetValue: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
        {formatCurrency(row.openingAssetValue)}
      </span>
    ),
    depreciationValue: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
        {formatCurrency(row.depreciationValue)}
      </span>
    ),
    closingAssetValue: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
        {formatCurrency(row.closingAssetValue)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 border-[#D5DbDB] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Fixed Asset Register
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
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-6">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-12">
            <p className="text-sm text-[#667085]">Lockated</p>
            <h1 className="mt-1 text-3xl font-semibold text-[#111827]">
              Fixed Asset Register
            </h1>
            <p className="mt-2 text-sm text-[#667085]">{headerLine}</p>
          </div>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            getItemId={(r) => r.id}
            storageKey="fixed-asset-register-v1"
            enableSearch
            hideTableExport
            loading={loading}
            emptyMessage="No data to display"
            tableWrapperClassName="min-h-[360px] border border-[#EAECF0]"
            headerCellClassName="text-[11px] font-semibold uppercase text-[#667085]"
            cellClassName="py-2.5 align-middle border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default FixedAssetReport;
