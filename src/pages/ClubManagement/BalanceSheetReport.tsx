import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";

const assetData = [
    {
        groupName: "Cash and Bank Balances",
        previousYearTotal: 0,
        amount: 0,
        currentYearTotal: 0,
        children: [
            {
                accountName: "Cash in Banks",
                previousYear: 0,
                amount: 0,
                currentYear: 0,
            },
            {
                accountName: "Savings Bank Account",
                previousYear: 20,
                amount: 100,
                currentYear: 0,
            },
        ],
    },
];

const liabilityData = [
    {
        groupName: "Share Capital",
        previousYearTotal: 0,
        amount: 0,
        currentYearTotal: 0,
        children: [
            {
                accountName: "Issued Subscribed & Paid up Capital",
                previousYear: 0,
                amount: 0,
                currentYear: 0,
            },
            {
                accountName: "Purchased by Individuals",
                previousYear: 0,
                amount: 0,
                currentYear: 0,
            },
        ],
    },
];

const BalanceSheetReport: React.FC = () => {

    const balanceTabs = ["Liabilities", "Assets"];
    const [activeBalanceTab, setActiveBalanceTab] = useState<"Assets" | "Liabilities">("Liabilities");

    const AssetsTable = () => (
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
                        {assetData.map((section) => (
                            <React.Fragment key={section.groupName}>
                                {/* SECTION HEADER */}
                                <tr className="bg-gray-50 font-semibold">
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.previousYearTotal.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        {section.groupName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.amount.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.currentYearTotal.toFixed(2)}
                                    </td>
                                </tr>

                                {/* CHILD ROWS */}
                                {section.children.map((item) => (
                                    <tr key={item.accountName} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-center">
                                            {item.previousYear.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 pl-8">
                                            {item.accountName}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center">
                                            {item.amount.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center">
                                            {item.currentYear.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}

                                {/* TOTAL ROW */}
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.previousYearTotal.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">
                                        Total
                                        {/* {section.groupName} */}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.amount.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {section.currentYearTotal.toFixed(2)}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );

    const LiabilitiesTable = () => (
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
                    {liabilityData.map((section) => (
                        <React.Fragment key={section.groupName}>
                            {/* SECTION HEADER */}
                            <tr className="bg-gray-50 font-semibold">
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.previousYearTotal.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {section.groupName}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.amount.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.currentYearTotal.toFixed(2)}
                                </td>
                            </tr>

                            {/* CHILD ROWS */}
                            {section.children.map((item) => (
                                <tr key={item.accountName} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {item.previousYear.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 pl-8">
                                        {item.accountName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {item.amount.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        {item.currentYear.toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            {/* TOTAL ROW */}
                            <tr className="bg-gray-100 font-semibold">
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.previousYearTotal.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    Total
                                    {/* {section.groupName} */}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.amount.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {section.currentYearTotal.toFixed(2)}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>


    );

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
    });
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleView = () => {
        // console.log('View clicked', form);
        if (!filters.fromDate || !filters.toDate) {
            alert('Please select From Date and To Date');
            return;
        }
        console.log('From Date:', filters.fromDate);
        console.log('To Date:', filters.toDate);
        // later you can call API here
        // fetchBalanceSheet(form.fromDate, form.toDate, form.financialYear)
    };

    return (
        <form className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: '100vh', boxSizing: 'border-box' }} >
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
                    {activeBalanceTab === "Assets" && <AssetsTable />}
                    {activeBalanceTab === "Liabilities" && <LiabilitiesTable />}
                </div>


            </div>

        </form>
    );
};

export default BalanceSheetReport;
