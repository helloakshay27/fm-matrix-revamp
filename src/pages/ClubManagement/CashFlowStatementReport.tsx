import { TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

interface Ledger {
  ledger_id: number;
  ledger_name: string;
  total: number;
  fixed_type: string | null;
}

// interface Group {
//   group_id: number;
//   group_name: string;
//   total: number;
//   children: Group[];
//   ledgers: Ledger[];
// }

interface Group {
  group_id: number;
  group_name: string;
  total: number;
  sub_groups: Group[];
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

interface CashFlowResponse {
  code: number;
  message: string;
  cash_flow: any;
  page_context: any;
}

const CashFlowStatementReport: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [pnlData, setPnlData] = useState<CashFlowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GroupTable = ({ pnlData }: { pnlData: any }) => {

    const renderAccounts = (accounts: any[], depth = 0) => {
      let rows: React.ReactNode[] = [];

      accounts.forEach((acc, index) => {

        if (acc.can_show_row) {
          rows.push(
            <tr key={index} className="hover:bg-gray-50">
              <td
                className="border px-4 py-2"
                style={{ paddingLeft: `${depth * 20}px` }}
              >
                {acc.ledger_id ? (
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/accounting/reports/cash-flow-statement/details/${acc.ledger_id}`)}
                  >
                    {acc.name}
                  </span>
                ) : (
                  acc.name
                )}
              </td>
              <td className="border px-4 py-2">
                {acc.account_code || "-"}
              </td>
              <td className="border px-4 py-2 text-right">
                {acc.values?.[0]?.total_formatted || "0.00"}
              </td>
            </tr>
          );
        }

        if (acc.accounts && acc.accounts.length > 0) {
          rows = [...rows, ...renderAccounts(acc.accounts, depth + 1)];
        }

        if (acc.can_show_footer) {
          rows.push(
            <tr key={`total-${index}`} className="bg-gray-200 font-semibold">
              <td className="border px-4 py-2">
                {acc.total_label}
              </td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2 text-right">
                {acc.values?.[0]?.total_sub_account_formatted}
              </td>
            </tr>
          );
        }

      });

      return rows;
    };

    return (
      <div className="overflow-x-auto">

        <h3 className="text-center font-semibold mb-4">
          Cash Flow Statement
        </h3>

        <table className="w-full border border-gray-300">

          <thead>
            <tr className="bg-[#E5E0D3]">
              <th className="border px-4 py-3 text-left">Account</th>
              <th className="border px-4 py-3 text-left">Account Code</th>
              <th className="border px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>

            {renderAccounts(pnlData?.cash_flow?.accounts)}

            {/* Ending Cash Balance */}
            <tr className="bg-gray-300 font-bold">
              <td className="border px-4 py-3">
                {pnlData?.cash_flow?.total_label}
              </td>

              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3 text-right">
                {pnlData?.cash_flow?.values?.[0]?.total_sub_account_formatted}
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
      const lockAccountId = localStorage.getItem("lock_account_id") || "1";
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/${lockAccountId}/lock_account_transactions/cash_flow.json`,
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
            Cash Flow Statement Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
            onClick={fetchPnlData}
            disabled={loading}
          >
            {loading ? "Loading..." : "View"}
          </Button>
        </div>
      </div>


      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      ) : (
        pnlData && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <GroupTable pnlData={pnlData} />
          </div>
        )
      )}
    </div>
  );
};

export default CashFlowStatementReport;
