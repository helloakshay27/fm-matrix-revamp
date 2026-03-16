import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

interface Transaction {
    id: number;
    status: string;
    date: string | null;
    invoice_number: string;
    total_amount: number;
    type: string;
    sales: number;
    sales_with_tax: number;
}

interface SalesCustomer {
    id: number;
    name: string;
    invoice_count: number;
    sales: number;
    sales_with_tax: number;
    transactions?: Transaction[];
}

const SalesByCustomerReport: React.FC = () => {
    const navigate = useNavigate();
    const [salesByCustomerData, setSalesByCustomerData] = useState<SalesCustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const lock_account_id = localStorage.getItem('lock_account_id');

    const balanceTabs = ["Sales by Customer"];
    const [activeBalanceTab, setActiveBalanceTab] = useState<"Sales by Customer">("Sales by Customer");

    // Fetch sales data from API
    // API fetch with date filter
    const fetchSalesData = async (fromDate?: string, toDate?: string) => {
        setLoading(true);
        try {
            if (!baseUrl || !token) {
                toast.error('Missing base URL or token');
                setLoading(false);
                return;
            }
            const lockAccountId = localStorage.getItem("lock_account_id") || "1";
            let url = `https://${baseUrl}/lock_account_customers/sales_report.json?lock_account_id=${lockAccountId}`;
            if (fromDate && toDate) {
                // Format dates as DD/MM/YYYY
                url += `&q[date_gteq]=${fromDate}&q[date_lteq]=${toDate}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = Array.isArray(response.data) ? response.data : [];
            setSalesByCustomerData(data);
            console.log('Fetched sales by customer:', data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            toast.error('Failed to fetch sales data');
            setSalesByCustomerData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData(); // initial fetch without date filter
    }, [baseUrl, token]);

    const SalesTable = () => {
        const totalInvoiceCount = salesByCustomerData.reduce((sum, row) => sum + row.invoice_count, 0);
        const totalSales = salesByCustomerData.reduce((sum, row) => sum + row.sales, 0);
        const totalSalesWithTax = salesByCustomerData.reduce((sum, row) => sum + row.sales_with_tax, 0);

        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Name
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                                Invoice Count
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Sales
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Sales with Tax
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {salesByCustomerData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleInvoiceCountClick(row.name)}
                                        className="text-[#C72030] hover:text-[#A01020] underline cursor-pointer font-medium"
                                    >
                                        {row.invoice_count}
                                    </button>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.sales.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.sales_with_tax.toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="bg-[#E5E0D3] font-semibold">
                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                                Total
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                                {totalInvoiceCount}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                {totalSales.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                {totalSalesWithTax.toFixed(2)}
                            </td>
                        </tr>

                        {salesByCustomerData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
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
        // Convert YYYY-MM-DD to DD/MM/YYYY for API
        const formatDate = (date: string) => {
            const [yyyy, mm, dd] = date.split('-');
            return `${dd}/${mm}/${yyyy}`;
        };
        const fromDate = formatDate(filters.fromDate);
        const toDate = formatDate(filters.toDate);
        fetchSalesData(fromDate, toDate);
    };

    const handleInvoiceCountClick = (customerName: string) => {
        navigate(`/accounting/reports/sales-by-customer/details/${encodeURIComponent(customerName)}`);
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} >
            {loading && (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
                </div>
            )}
            {!loading && (
                <>
                    <div className="bg-white rounded-lg border-2 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <User className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                                Sales by Customer Report
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
                        <div className="grid grid-cols-1 border mb-4">
                            {balanceTabs.map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveBalanceTab(tab as any)}
                                    className={`px-4 py-2 text-sm font-medium
                            ${activeBalanceTab === tab
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
                            <SalesTable />
                        </div>


                    </div>
                </>
            )}
        </form>
    );
};

export default SalesByCustomerReport;