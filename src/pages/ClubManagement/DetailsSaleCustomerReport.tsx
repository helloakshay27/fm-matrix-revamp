import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// transaction data for details page
const transactionData = [
    {
        date: "2024-01-15",
        type: "Invoice",
        status: "Paid",
        number: "INV-2024-001",
        sales: 3000.0,
        salesWithTax: 3450.0,
        balanceDue: 0.0,
    },
    {
        date: "2024-01-20",
        type: "Invoice",
        status: "Paid",
        number: "INV-2024-002",
        sales: 5000.0,
        salesWithTax: 5750.0,
        balanceDue: 0.0,
    },
    {
        date: "2024-02-10",
        type: "Invoice",
        status: "Pending",
        number: "INV-2024-003",
        sales: 4000.0,
        salesWithTax: 4600.0,
        balanceDue: 4600.0,
    },
    {
        date: "2024-02-25",
        type: "Credit Note",
        status: "Paid",
        number: "CN-2024-001",
        sales: -500.0,
        salesWithTax: -575.0,
        balanceDue: 0.0,
    },
    {
        date: "2024-03-05",
        type: "Invoice",
        status: "Paid",
        number: "INV-2024-005",
        sales: 2000.0,
        salesWithTax: 2300.0,
        balanceDue: 0.0,
    },
];

const DetailsSaleCustomerReport: React.FC = () => {
    const navigate = useNavigate();
    const { customerName } = useParams<{ customerName: string }>();

    const balanceTabs = ["Transactions"];
    const [activeBalanceTab, setActiveBalanceTab] = useState<"Invoice Details">("Invoice Details");

    const InvoiceDetailsTable = () => {
        const totalSales = transactionData.reduce((sum, row) => sum + row.sales, 0);
        const totalSalesWithTax = transactionData.reduce((sum, row) => sum + row.salesWithTax, 0);
        const totalBalanceDue = transactionData.reduce((sum, row) => sum + row.balanceDue, 0);

        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Date
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Type
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                                Status
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                Number
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Sales
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Sales with Tax
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Balance Due
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactionData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.date}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.type}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        row.status === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.number}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    ₹{row.sales.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    ₹{row.salesWithTax.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    ₹{row.balanceDue.toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="bg-[#E5E0D3] font-semibold">
                            <td className="border border-gray-300 px-4 py-3 font-semibold" colSpan={4}>
                                Total
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                ₹{totalSales.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                ₹{totalSalesWithTax.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                ₹{totalBalanceDue.toFixed(2)}
                            </td>
                        </tr>

                        {transactionData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
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
    };

    const handleBack = () => {
        navigate('/accounting/reports/sales-by-customer');
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} >
            <div className="bg-white rounded-lg border-2 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        onClick={handleBack}
                        className="mr-4 bg-gray-500 hover:bg-gray-600 text-white p-2"
                        size="sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <FileCog className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                        Invoice Details - {customerName || 'Customer'}
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
                    <InvoiceDetailsTable />
                </div>
            </div>
        </form>
    );
};

export default DetailsSaleCustomerReport;