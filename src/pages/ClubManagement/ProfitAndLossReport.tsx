import {
  ThemeProvider,
  createTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { NotepadText, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Custom theme for MUI components - matching ManualJournalDetails
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "36px",
            "@media (min-width: 768px)": {
              height: "45px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            "@media (min-width: 768px)": {
              padding: "12px 14px",
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
  },
});

interface Ledger {
  ledger_id: number;
  ledger_name: string;
  total: number;
  fixed_type: string | null;
}

interface Group {
  group_id: number;
  group_name: string;
  total: number;
  children: Group[];
  ledgers: Ledger[];
}

interface Totals {
  income_total: number;
  expense_total: number;
  net_profit: number;
  net_loss: number;
  net_profit_loss: number;
}

interface PnlResponse {
  lock_account_id: number;
  lock_account_name: string;
  period: {
    start_date: string;
    end_date: string;
  };
  expenditure: Group;
  income: Group;
  totals: Totals;
}

const ProfitAndLossReport: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [pnlData, setPnlData] = useState<PnlResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const balanceTabs = ["Expenditure", "Income"];
  const [activeBalanceTab, setActiveBalanceTab] = useState<
    "Expenditure" | "Income"
  >("Expenditure");

  // Recursive component to render groups and their children/ledgers
  const GroupTable = ({
    group,
    title,
  }: {
    group: Group | undefined;
    title: string;
  }) => {
    if (!group) return null;

    const renderGroupRows = (currentGroup: Group, depth: number = 0) => {
      const rows: React.ReactNode[] = [];

      // Render ledgers of the current group
      if (currentGroup.ledgers) {
        currentGroup.ledgers.forEach((ledger) => {
          rows.push(
            <tr key={`ledger-${ledger.ledger_id}`} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
              <td
                className="border border-gray-300 px-4 py-3"
                style={{ paddingLeft: `${(depth + 1) * 20}px` }}
              >
                {ledger.ledger_name}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {/* {Math.abs(ledger.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {Number(ledger.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}

              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
            </tr>,
          );
        });
      }

      // Render child groups recursively
      if (currentGroup.children) {
        currentGroup.children.forEach((child) => {
          rows.push(
            <tr
              key={`group-${child.group_id}`}
              className="bg-gray-50 font-semibold"
            >
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
              <td
                className="border border-gray-300 px-4 py-3"
                style={{ paddingLeft: `${depth * 20}px` }}
              >
                {child.group_name}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {/* {Math.abs(child.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {Number(child.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
            </tr>,
          );
          rows.push(...renderGroupRows(child, depth + 1));
        });
      }

      return rows;
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#E5E0D3]">
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-1/4">
                Previous Year
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-1/2">
                {title}
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-1/8">
                Total
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-1/8">
                Current Year
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
              <td className="border border-gray-300 px-4 py-3">
                {group.group_name}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {/* {Math.abs(group.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {Number(group.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
            </tr>
            {renderGroupRows(group)}
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
              <td className="border border-gray-300 px-4 py-3">
                Total {title}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                {/* {Math.abs(group.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {Number(group.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const [filters, setFilters] = useState({
    fromDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0], // Default to start of year
    toDate: new Date().toISOString().split("T")[0], // Default to today
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPnlData = async () => {
    if (!baseUrl || !token) return;
    if (!filters.fromDate || !filters.toDate) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/1/lock_account_transactions/pnl.json`,
        {
          params: {
            start_date: filters.fromDate,
            end_date: filters.toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPnlData(response.data);
    } catch (error) {
      console.error("API error", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when filters change (debouncing can be added if needed, but standard for report pages)
  useEffect(() => {
    fetchPnlData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.fromDate, filters.toDate]);

  return (
    <ThemeProvider theme={muiTheme}>
      <div
        className="w-full bg-[#f9f7f2] p-6"
        style={{ minHeight: "100vh", boxSizing: "border-box" }}
      >
        <div className="bg-white rounded-lg border-2 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <NotepadText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              Profit and Loss Report
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleDateChange}
              fullWidth
            />

            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleDateChange}
              fullWidth
            />

            <Button
              type="button"
              className="bg-[#C72030] hover:bg-[#A01020] text-white h-[45px]"
              onClick={fetchPnlData}
              disabled={loading}
            >
              {loading ? "Loading..." : "View"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="grid grid-cols-2 border-b mb-6">
            {balanceTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveBalanceTab(tab as "Expenditure" | "Income")
                }
                className={`px-4 py-3 text-sm font-semibold transition-colors
                  ${activeBalanceTab === tab
                    ? "text-[#C72030] border-b-2 border-[#C72030] bg-[#f9f7f2]/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
              </div>
            ) : (
              <>
                {activeBalanceTab === "Income" && (
                  <GroupTable group={pnlData?.income} title="Income" />
                )}
                {activeBalanceTab === "Expenditure" && (
                  <GroupTable
                    group={pnlData?.expenditure}
                    title="Expenditure"
                  />
                )}
              </>
            )}
          </div>

          {/* Totals Section matching ManualJournalDetails style */}
          {/* {pnlData && !loading && (
            <div className="flex justify-end mt-10">
              <div className="bg-white rounded-lg border-2 p-6 min-w-[320px] max-w-[500px] w-full space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Summary</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Income Total</span>
                  <span className="font-semibold text-green-600">
                    {Math.abs(pnlData.totals.income_total).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Expense Total</span>
                  <span className="font-semibold text-red-600">
                    {Math.abs(pnlData.totals.expense_total).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-bold text-lg text-gray-900">
                    {pnlData.totals.net_profit_loss >= 0
                      ? "Net Profit"
                      : "Net Loss"}
                  </span>
                  <span
                    className={`font-bold text-lg ${pnlData.totals.net_profit_loss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    ₹{" "}
                    {Math.abs(pnlData.totals.net_profit_loss).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    )}
                  </span>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProfitAndLossReport;
