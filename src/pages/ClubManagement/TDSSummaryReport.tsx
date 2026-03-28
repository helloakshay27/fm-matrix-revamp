import React, { useMemo, useState,useEffect } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";


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
  // const [reportRows] = useState<TdsSummaryRow[]>([]);
  const [reportRows, setReportRows] = useState<TdsSummaryRow[]>([]);
   const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");
const fetchTDSSummary = async () => {
  try {
    const response = await axios.get(
      `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/payable_summary.json`,
      {
        // headers: {
        //   Authorization:
        //     "Bearer z0Vz7MWHrLM59gu-ureFRdkqq1x8L0nSiKOcaM1pumE",
        // },

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        params: {
          from_date: filters.fromDate,
          to_date: filters.toDate,
        },
      }
    );

    const data = response.data || [];

    const mappedData: TdsSummaryRow[] = data?.tdspayablesummary.map((item: any) => ({
      section: item.tds_section,
      total: item.bcyamount_without_tds_deduction || 0,
      totalAfterDeduction: item.bcyamount|| 0,
      taxDeductedAtSource: item.tds_bcyamount || 0,
    }));

    setReportRows(mappedData);
  } catch (error) {
    console.error("Error fetching TDS summary", error);
  }
};

useEffect(() => {
  fetchTDSSummary();
}, []);

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

  // const handleViewReport = () => {
  //   if (!filters.fromDate || !filters.toDate) {
  //     alert("Please select From Date and To Date");
  //   }
  // };

  const handleViewReport = () => {
  if (!filters.fromDate || !filters.toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  fetchTDSSummary();
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
        <div className="overflow-x-auto">
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
    </div>
  );
};

export default TDSSummaryReport;
