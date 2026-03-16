import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import { NotepadText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaxSummaryReport: React.FC = () => {

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [gstData, setGstData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTaxSummary = async () => {
        try {
            setLoading(true);
            const lockAccountId = localStorage.getItem("lock_account_id") || "1";

            const response = await axios.get(
                `https://${baseUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers/tax_summary_report.json`,
                {
                    params: {
                        start_date: filters.fromDate,
                        end_date: filters.toDate,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setGstData(response.data || []);

        } catch (error) {
            console.error("Tax summary API error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxSummary();
    }, []);
    const TaxSummaryTable = () => {
        return (
            <div className="overflow-x-auto">
                <h1 className="text-center font-semibold mb-4">
                    Tax Summary
                </h1>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Ledger ID
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Ledger & Tax Name
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                                Tax Percentage
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {gstData?.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">
                                    {row?.id}
                                </td>

                                <td className="border px-4 py-3">
                                    <span
                                        className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
                                        onClick={() => navigate(`/accounting/reports/tax-summary/details/${row.id}`)}
                                    >
                                        {row.name}
                                    </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {row?.tax_rate_per?.toFixed(2)} %
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row?.current_total?.toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {gstData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="border border-gray-300 px-4 py-6 text-center text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };


    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
    });
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleView = () => {
        if (!filters.fromDate || !filters.toDate) {
            alert('Please select From Date and To Date');
            return;
        }
        fetchTaxSummary();
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} >
            <div className="bg-white rounded-lg border-2 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <NotepadText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                        Tax Summary
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
            <div className="bg-white rounded-lg border p-6">
                <TaxSummaryTable />
            </div>

        </form>
    );
};

export default TaxSummaryReport;
