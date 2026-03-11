import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const salesByCustomerData = [
    {
        name: "John Doe",
        invoiceCount: 5,
        sales: 15000.0,
        salesWithTax: 17250.0,
    },
    {
        name: "Jane Smith",
        invoiceCount: 8,
        sales: 22000.0,
        salesWithTax: 25300.0,
    },
    {
        name: "Bob Johnson",
        invoiceCount: 3,
        sales: 8500.0,
        salesWithTax: 9775.0,
    },
    {
        name: "Alice Brown",
        invoiceCount: 12,
        sales: 32000.0,
        salesWithTax: 36800.0,
    },
    {
        name: "Charlie Wilson",
        invoiceCount: 6,
        sales: 18000.0,
        salesWithTax: 20700.0,
    },
];

const SalesByCustomerReport: React.FC = () => {
    const navigate = useNavigate();

    const balanceTabs = ["Sales by Customer"];
    const [activeBalanceTab, setActiveBalanceTab] = useState<"Sales by Customer">("Sales by Customer");

    const SalesTable = () => {
        const totalInvoiceCount = salesByCustomerData.reduce((sum, row) => sum + row.invoiceCount, 0);
        const totalSales = salesByCustomerData.reduce((sum, row) => sum + row.sales, 0);
        const totalSalesWithTax = salesByCustomerData.reduce((sum, row) => sum + row.salesWithTax, 0);

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
                                        {row.invoiceCount}
                                    </button>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.sales.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.salesWithTax.toFixed(2)}
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
        console.log('From Date:', filters.fromDate);
        console.log('To Date:', filters.toDate);
        // later you can call API here
        // fetchBalanceSheet(form.fromDate, form.toDate, form.financialYear)
    };

    const handleInvoiceCountClick = (customerName: string) => {
        navigate(`/accounting/reports/sales-by-customer/details/${encodeURIComponent(customerName)}`);
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} >
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

        </form>
    );
};

export default SalesByCustomerReport;