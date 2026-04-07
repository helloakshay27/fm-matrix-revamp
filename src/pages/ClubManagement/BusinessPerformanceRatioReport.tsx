import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";

export const BusinessPerformanceRatioReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const [loading, setLoading] = useState(false);
  const [ledgerDetails, setLedgerDetails] = useState<any>(null);

  const fetchLedgerDetails = async () => {
    try {
      // Dummy data for now
      setLedgerDetails({
        name: "Lockated",
        account_type: "Business Performance",
        current_total: 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  const chartData = [
  { month: "Mar", ratio: 0 },
  { month: "Apr", ratio: 0 },
  { month: "May", ratio: 0 },
  { month: "Jun", ratio: 0 },
  { month: "Jul", ratio: 0 },
  { month: "Aug", ratio: 0 },
  { month: "Sep", ratio: 0 },
  { month: "Oct", ratio: 0 },
  { month: "Nov", ratio: 7.5 }, // spike like screenshot
  { month: "Dec", ratio: 0 },
  { month: "Jan", ratio: 0 },
  { month: "Feb", ratio: -0.4 },
];

const ratioColumns: ColumnConfig[] = [
  {
    key: "month",
    label: "Month",
    sortable: true,
    draggable: true,
  },
  {
    key: "current_assets",
    label: "Current Assets",
    sortable: true,
    draggable: true,
  },
  {
    key: "current_liabilities",
    label: "Current Liabilities",
    sortable: true,
    draggable: true,
  },
  {
    key: "current_ratio",
    label: "Current Ratio",
    sortable: true,
    draggable: true,
  },
];

const ratioTableData = [
  { month: "Mar 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Apr 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "May 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Jun 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Jul 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Aug 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Sep 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Oct 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Nov 2025", current_assets: 7500, current_liabilities: 1000, current_ratio: 7.5 },
  { month: "Dec 2025", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Jan 2026", current_assets: 0, current_liabilities: 0, current_ratio: 0 },
  { month: "Feb 2026", current_assets: 200, current_liabilities: 500, current_ratio: -0.4 },
];
const renderRatioRow = (row: any) => ({
  month: (
    <span className="text-sm text-gray-900">{row.month}</span>
  ),
  current_assets: (
    <span className="text-sm text-gray-900">
      ₹{row.current_assets.toFixed(2)}
    </span>
  ),
  current_liabilities: (
    <span className="text-sm text-gray-900">
      ₹{row.current_liabilities.toFixed(2)}
    </span>
  ),
  current_ratio: (
    <span
      className={`text-sm font-medium ${
        row.current_ratio < 0 ? "text-red-500" : "text-green-600"
      }`}
    >
      {row.current_ratio}
    </span>
  ),
});

  return (
    <div className="p-6 bg-white space-y-6">
      {/* Back
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => navigate("/accounting/reports/balance-sheet")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button> */}

      {/* Header */}

      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Business Performance Ratio
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* FROM DATE */}
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            // value={filters.fromDate}
            // onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          {/* TO DATE */}
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            // value={filters.toDate}
            // onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          {/* VIEW BUTTON */}
          <Button
            // onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>
      <div>
      </div>

      {/* Summary Cards */}
      <div className="border rounded-lg bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {[
            "This Month",
            "Last Year",
            "Last 12 Months",
            "Last 6 Months",
            "Last Quarter",
          ].map((label, i) => (
            <div key={i}>
              <p className="text-xs text-gray-500 uppercase">{label}</p>
              <p className="text-xl font-semibold">
                ₹{(ledgerDetails?.current_total || 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Graph + Table Section */}
      <div className="border rounded-lg bg-white p-4">
        <div className="h-[260px] border-b">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={chartData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="ratio" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

        {/* TABLE */}
        <div className="overflow-x-auto mt-4">
       
          <div className="mt-4">
  <EnhancedTable
    data={ratioTableData}
    columns={ratioColumns}
    renderRow={renderRatioRow}
    storageKey="business-performance-ratio"
    hideTableExport={true}
    hideTableSearch={true}
    enableSearch={false}
    hideColumnsButton={true}
    isLoading={loading}
  />
</div>
        </div>
      </div>
    </div>
  );
};