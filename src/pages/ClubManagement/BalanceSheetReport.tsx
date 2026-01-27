import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, FileCog, NotepadText } from "lucide-react";
import axios from "axios";

// TypeScript Interfaces for API Response
interface Ledger {
  ledger_id: number;
  ledger_name: string;
  total: number;
  fixed_type: string | null;
}

interface ChildGroup {
  group_id: number;
  group_name: string;
  total: number;
  children: ChildGroup[];
  ledgers: Ledger[];
}

interface GroupData {
  group_id: number;
  group_name: string;
  total: number;
  children: ChildGroup[];
  ledgers: Ledger[];
}

interface BalanceSheetResponse {
  lock_account_id: number;
  lock_account_name: string;
  assets: GroupData;
  liabilities: GroupData;
  totals: {
    total_assets: number;
    total_liabilities: number;
    total_equity: number;
  };
}

const BalanceSheetReport: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const balanceTabs = ["Liabilities", "Assets"];
  const [activeBalanceTab, setActiveBalanceTab] = useState<
    "Assets" | "Liabilities"
  >("Liabilities");
  const [balanceSheetData, setBalanceSheetData] =
    useState<BalanceSheetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Fetch Balance Sheet Data
  const fetchBalanceSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching balance sheet with baseUrl:", baseUrl);
      console.log("Token present:", !!token);

      // Note: The balance sheet endpoint is on club-uat-api, not the regular baseUrl
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/1/lock_account_transactions/balance_sheet.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Balance sheet data received:", response.data);
      setBalanceSheetData(response.data);
    } catch (err: unknown) {
      console.error("Error fetching balance sheet:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: unknown; status?: number };
        };
        console.error("Error response:", axiosError.response?.data);
        console.error("Error status:", axiosError.response?.status);
      }
      setError("Failed to load balance sheet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    console.log("From Date:", filters.fromDate);
    console.log("To Date:", filters.toDate);
    // You can add date filtering to API call here if needed
    fetchBalanceSheet();
  };

  // Recursive function to render groups and ledgers
  const renderGroupRows = (
    group: ChildGroup,
    level: number = 0,
  ): JSX.Element[] => {
    const rows: JSX.Element[] = [];
    const indentClass = level > 0 ? `pl-${Math.min(level * 4, 16)}` : "";

    // Group header row
    rows.push(
      <tr key={`group-${group.group_id}`} className="bg-gray-50 font-semibold">
        <td className="border border-gray-300 px-4 py-3 text-center">
          {group.total.toFixed(2)}
        </td>
        <td className={`border border-gray-300 px-4 py-3 ${indentClass}`}>
          {group.group_name}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-center">
          {group.total.toFixed(2)}
        </td>
        <td className="border border-gray-300 px-4 py-3 text-center">
          {group.total.toFixed(2)}
        </td>
      </tr>,
    );

    // Render child groups recursively
    if (group.children && group.children.length > 0) {
      group.children.forEach((childGroup) => {
        rows.push(...renderGroupRows(childGroup, level + 1));
      });
    }

    // Render ledgers
    if (group.ledgers && group.ledgers.length > 0) {
      group.ledgers.forEach((ledger) => {
        rows.push(
          <tr key={`ledger-${ledger.ledger_id}`} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 text-center">
              {ledger.total.toFixed(2)}
            </td>
            <td
              className={`border border-gray-300 px-4 py-3 pl-${Math.min((level + 1) * 4, 16)}`}
            >
              {ledger.ledger_name}
            </td>
            <td className="border border-gray-300 px-4 py-3 text-center">
              {ledger.total.toFixed(2)}
            </td>
            <td className="border border-gray-300 px-4 py-3 text-center">
              {ledger.total.toFixed(2)}
            </td>
          </tr>,
        );
      });
    }

    return rows;
  };

  const AssetsTable = () => {
    if (!balanceSheetData) return null;

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#E5E0D3]">
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Previous Year
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Assets
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                  Current Year
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Main Assets Group */}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.assets.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {balanceSheetData.assets.group_name}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.assets.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.assets.total.toFixed(2)}
                </td>
              </tr>

              {/* Render child groups */}
              {balanceSheetData.assets.children.map((childGroup) =>
                renderGroupRows(childGroup, 1),
              )}

              {/* Render top-level ledgers */}
              {balanceSheetData.assets.ledgers.map((ledger) => (
                <tr
                  key={`asset-ledger-${ledger.ledger_id}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {ledger.total.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 pl-8">
                    {ledger.ledger_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {ledger.total.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {ledger.total.toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-200 font-bold">
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.totals.total_assets.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Total Assets
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.totals.total_assets.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {balanceSheetData.totals.total_assets.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const LiabilitiesTable = () => {
    if (!balanceSheetData) return null;

    return (
      <div className="overflow-x-auto mb-10">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#E5E0D3]">
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Previous Year
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Liabilities
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Current Year
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Main Liabilities Group */}
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.liabilities.total.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3">
                {balanceSheetData.liabilities.group_name}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.liabilities.total.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.liabilities.total.toFixed(2)}
              </td>
            </tr>

            {/* Render child groups */}
            {balanceSheetData.liabilities.children.map((childGroup) =>
              renderGroupRows(childGroup, 1),
            )}

            {/* Render top-level ledgers */}
            {balanceSheetData.liabilities.ledgers.map((ledger) => (
              <tr
                key={`liability-ledger-${ledger.ledger_id}`}
                className="hover:bg-gray-50"
              >
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {ledger.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 pl-8">
                  {ledger.ledger_name}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {ledger.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {ledger.total.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.totals.total_liabilities.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3">
                Total Liabilities
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.totals.total_liabilities.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {balanceSheetData.totals.total_liabilities.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Balance Sheet
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* FROM DATE */}
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

          {/* TO DATE */}
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

          {/* VIEW BUTTON */}
          <Button
            onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* Tabs for account types */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-2 border mb-4">
          {balanceTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveBalanceTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium
        ${
          activeBalanceTab === tab
            ? "bg-[#f9f7f2] text-[#C72030] border-b-2 border-[#C72030]"
            : "bg-white text-gray-600 hover:bg-[#f9f7f2]/40"
        }
      `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 border rounded-lg">
          {activeBalanceTab === "Assets" && <AssetsTable />}
          {activeBalanceTab === "Liabilities" && <LiabilitiesTable />}
        </div>
      </div>

      {/* Totals Summary - Hidden as per user request */}
      {/* {balanceSheetData && (
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-semibold mb-4">Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600 mb-1">Total Assets</div>
              <div className="text-xl font-bold">
                ₹ {balanceSheetData.totals.total_assets.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600 mb-1">
                Total Liabilities
              </div>
              <div className="text-xl font-bold">
                ₹ {balanceSheetData.totals.total_liabilities.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600 mb-1">Total Equity</div>
              <div className="text-xl font-bold">
                ₹ {balanceSheetData.totals.total_equity.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </form>
  );
};

export default BalanceSheetReport;
