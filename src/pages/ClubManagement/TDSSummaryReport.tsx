import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { CalendarRange, Columns3, ChevronDown, NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";

type TdsSummaryRow = {
  section: string;
  total: number;
  totalAfterDeduction: number;
  taxDeductedAtSource: number;
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

const TDSSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows] = useState<TdsSummaryRow[]>([]);

  const reportTotals = useMemo(
    () =>
      reportRows.reduce(
        (accumulator, row) => ({
          total: accumulator.total + row.total,
          totalAfterDeduction:
            accumulator.totalAfterDeduction + row.totalAfterDeduction,
          taxDeductedAtSource:
            accumulator.taxDeductedAtSource + row.taxDeductedAtSource,
        }),
        {
          total: 0,
          totalAfterDeduction: 0,
          taxDeductedAtSource: 0,
        }
      ),
    [reportRows]
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleViewReport = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
    }
  };

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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            TDS Summary
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
            onClick={handleViewReport}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-[#667085]">Lockated</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#101828]">
              TDS Summary
            </h1>
            <p className="mt-2 text-base text-[#344054]">
              From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
            </p>
            <p className="mt-3 text-sm font-medium text-[#667085]">
              Basis : <span className="text-[#344054]">Accrual</span>
            </p>
          </div>

         {/* <div className="flex flex-wrap items-center justify-end gap-3">
  <Button
    type="button"
    variant="outline"
    className="h-10 rounded-md border-[#D0D5DD] px-4 text-[#344054] hover:bg-[#F9FAFB]"
  >
    <CalendarRange className="h-4 w-4" />
    Group By : TDS Section.                            
    <ChevronDown className="h-4 w-4" />
  </Button> */}

            {/* <Button
  type="button"
  variant="outline"
  className="h-10 rounded-md border-[#D0D5DD] px-4 text-[#344054] hover:bg-[#F9FAFB]"
>
  <Columns3 className="h-4 w-4" />
  Customize Report Columns
</Button> */}
</div>
</div>

        <div className="overflow-x-auto">
          <h1 className="text-center font-semibold mb-4">TDS Summary</h1>
          <table className="w-full min-w-[900px] border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#E5E0D3]">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                      TDS Section
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      Total
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      Total After TDS Deduction
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      Tax Deducted At Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reportRows.length > 0 ? (
                    <>
                      {reportRows.map((row) => (
                        <tr key={row.section} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium">
                            {row.section}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            {formatAmount(row.total)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            {formatAmount(row.totalAfterDeduction)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            {formatAmount(row.taxDeductedAtSource)}
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-[#f9f7f2] font-semibold">
                        <td className="border border-gray-300 px-4 py-3">Total</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {formatAmount(reportTotals.total)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {formatAmount(reportTotals.totalAfterDeduction)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {formatAmount(reportTotals.taxDeductedAtSource)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="border border-gray-300 px-4 py-6 text-center text-gray-500 h-[420px]"
                      >
                        There are no transactions during the selected date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
        </div>
      </div>
    
  );
};

export default TDSSummaryReport;
