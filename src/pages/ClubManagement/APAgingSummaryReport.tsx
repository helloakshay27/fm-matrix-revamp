import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type APAgingRow = {
  id: string;
  vendorName: string;
  current: number;
  days1To15: number;
  days16To30: number;
  days31To45: number;
  daysOver45: number;
  total: number;
  totalFcy: number;
};

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
  if (!value) {
    return "--/--/----";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const seedRows: APAgingRow[] = [
  {
    id: "1",
    vendorName: "Gophygital",
    current: 262.5,
    days1To15: 0.0,
    days16To30: 0.0,
    days31To45: 0.0,
    daysOver45: 0.0,
    total: 262.5,
    totalFcy: 262.5,
  },
];

const columns: ColumnConfig[] = [
  { key: "vendorName", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "current", label: "CURRENT", sortable: true, hideable: false, draggable: true },
  { key: "days1To15", label: "1-15 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "days16To30", label: "16-30 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "days31To45", label: "31-45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "daysOver45", label: "> 45 DAYS", sortable: true, hideable: false, draggable: true },
  { key: "total", label: "TOTAL", sortable: true, hideable: false, draggable: true },
  { key: "totalFcy", label: "TOTAL (FCY)", sortable: true, hideable: false, draggable: true },
];

const APAgingSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [appliedFilters, setAppliedFilters] = useState(defaultRange);
  const [reportRows] = useState<APAgingRow[]>(seedRows);
  const [loading] = useState(false);

  const totals = useMemo(() => {
    return reportRows.reduce(
      (acc, row) => ({
        current: acc.current + row.current,
        days1To15: acc.days1To15 + row.days1To15,
        days16To30: acc.days16To30 + row.days16To30,
        days31To45: acc.days31To45 + row.days31To45,
        daysOver45: acc.daysOver45 + row.daysOver45,
        total: acc.total + row.total,
        totalFcy: acc.totalFcy + row.totalFcy,
      }),
      {
        current: 0,
        days1To15: 0,
        days16To30: 0,
        days31To45: 0,
        daysOver45: 0,
        total: 0,
        totalFcy: 0,
      }
    );
  }, [reportRows]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const renderRow = (row: APAgingRow) => ({
    vendorName: (
      <span className="text-sm font-medium text-blue-600">
        {row.vendorName}
      </span>
    ),
    current: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.current)}
      </span>
    ),
    days1To15: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.days1To15)}
      </span>
    ),
    days16To30: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.days16To30)}
      </span>
    ),
    days31To45: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.days31To45)}
      </span>
    ),
    daysOver45: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.daysOver45)}
      </span>
    ),
    total: (
      <span className="text-sm font-medium text-blue-600">
        ₹{formatAmount(row.total)}
      </span>
    ),
    totalFcy: (
      <span className="text-sm font-medium text-gray-900">
        ₹{formatAmount(row.totalFcy)}
      </span>
    ),
  });

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            AP Aging Summary By Bill Due Date
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
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => setAppliedFilters(filters)}
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            AP Aging Summary By Bill Due Date
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(appliedFilters.fromDate)} To {formatDisplayDate(appliedFilters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={reportRows}
            columns={columns}
            renderRow={renderRow}
            storageKey="ap-aging-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={false}
            loading={loading}
            emptyMessage="There are no transactions as of the selected date."
            rightActions={
              <div className="text-sm font-medium text-[#475467]">
                Group By : None
              </div>
            }
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />

          {reportRows.length > 0 && (
            <div className="rounded-b-md border border-t-0 border-[#E5E7EB] bg-white px-6 py-4 text-sm font-semibold text-[#1A1A1A]">
              <div className="grid grid-cols-8 gap-4">
                <div>Total</div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.current)}
                </div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.days1To15)}
                </div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.days16To30)}
                </div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.days31To45)}
                </div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.daysOver45)}
                </div>
                <div className="text-blue-600">
                  ₹{formatAmount(totals.total)}
                </div>
                <div className="text-gray-900">
                  ₹{formatAmount(totals.totalFcy)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APAgingSummaryReport;
