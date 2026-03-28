import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const TrialBalanceReport: React.FC = () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");
    const navigate = useNavigate();
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
            const response = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/trial_balance_sheet.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            setBalanceSheetData(response.data);
        } catch (err: unknown) {
            console.error("Error fetching trial balance:", err);
            setError("Failed to load trial balance data");
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
        fetchBalanceSheet();
    };

    const renderGroupRows = (group: ChildGroup, level: number = 0): JSX.Element[] => {
        const rows: JSX.Element[] = [];
        const indent = level * 20;

        let fontClass = "font-normal";
        if (level === 0) fontClass = "font-bold";
        else if (level === 1) fontClass = "font-semibold";

        rows.push(
            <tr key={`group-${group.group_id}`}>
                <td className={`border border-gray-300 px-4 py-3 ${fontClass}`} style={{ paddingLeft: `${indent}px` }}>
                    {group.group_name}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                    {group.total_credits?.toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                    {group.total_debits?.toFixed(2) ?? "0.00"}
                </td>
            </tr>
        );

        group.children?.forEach((child) => {
            rows.push(...renderGroupRows(child, level + 1));
        });

        return rows;
    };

    const BalanceSheetTable = () => {
        if (!balanceSheetData) return null;

        const liabilitiesRows: JSX.Element[] = [];
        const assetsRows: JSX.Element[] = [];

        balanceSheetData.liabilities.children.forEach((group) => {
            liabilitiesRows.push(...renderGroupRows(group, 1));
        });

        balanceSheetData.assets.children.forEach((group) => {
            assetsRows.push(...renderGroupRows(group, 1));
        });

        const maxRows = Math.max(liabilitiesRows.length, assetsRows.length);

        const rows = [];

        for (let i = 0; i < maxRows; i++) {
            const left = liabilitiesRows[i];
            const right = assetsRows[i];

            rows.push(
                <tr key={i}>
                    {left ? left.props.children : (
                        <>
                            <td className="border px-4 py-3"></td>
                            <td className="border px-4 py-3"></td>
                            <td className="border px-4 py-3"></td>
                        </>
                    )}
                    {right ? right.props.children : (
                        <>
                            <td className="border px-4 py-3"></td>
                            <td className="border px-4 py-3"></td>
                            <td className="border px-4 py-3"></td>
                        </>
                    )}
                </tr>
            );
        }


        return (
            <div className="overflow-x-auto">

                <h3 className="text-center font-semibold mb-4">
                    Trial Balance
                </h3>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className="border px-4 py-3 text-left">Liabilities</th>
                            <th className="border px-4 py-3 text-center">Net Credits</th>
                            <th className="border px-4 py-3 text-center">Net Debits</th>
                            <th className="border px-4 py-3 text-left">Assets</th>
                            <th className="border px-4 py-3 text-center">Net Credits</th>
                            <th className="border px-4 py-3 text-center">Net Debits</th>
                        </tr>
                    </thead>

                    <tbody>{rows}</tbody>

                    <tfoot>
                        <tr className="bg-gray-200 font-bold">
                            <td className="border px-4 py-3">Total Liabilities</td>
                            <td className="border px-4 py-3 text-right">{balanceSheetData.totals.total_liabilities_credits?.toFixed(2)}</td>
                            <td className="border px-4 py-3 text-right">{balanceSheetData.totals.total_liabilities_debits?.toFixed(2)}</td>
                            <td className="border px-4 py-3">Total Assets</td>
                            <td className="border px-4 py-3 text-right">{balanceSheetData.totals.total_assets_credits?.toFixed(2)}</td>
                            <td className="border px-4 py-3 text-right">{balanceSheetData.totals.total_assets_debits?.toFixed(2)}</td>
                        </tr>
                    </tfoot>

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
                        Trial Balance
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

            <div className="bg-white rounded-lg border p-6 mb-6">
                <BalanceSheetTable />
            </div>
        </div>
    );
};

export default TrialBalanceReport;
