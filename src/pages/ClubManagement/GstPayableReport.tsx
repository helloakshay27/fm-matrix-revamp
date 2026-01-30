import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileCog, NotepadText } from "lucide-react";


const taxSummaryData = [
    {
        ledgerId: 2606,
        name: "Sinking Fund",
        taxPercentage: 0.0,
        transactionAmount: 0.0,
        taxAmount: 0.0,
    },
    {
        ledgerId: 2607,
        name: "Repair Fund",
        taxPercentage: 0.0,
        transactionAmount: 0.0,
        taxAmount: 0.0,
    },
    {
        ledgerId: 2608,
        name: "Common Maintenance Charges",
        taxPercentage: 18.0,
        transactionAmount: 50000,
        taxAmount: 9000,
    },
    {
        ledgerId: 2615,
        name: "CGST",
        taxPercentage: 9.0,
        transactionAmount: 4500,
        taxAmount: 0.0,
    },
    {
        ledgerId: 2616,
        name: "SGST",
        taxPercentage: 9.0,
        transactionAmount: 4500,
        taxAmount: 0.0,
    },
];

const gstTableData = [
  {
    name: "Maintenance Charges",
    taxPercentage: 18.0,
    transactionAmount: 50000.0,   // Total Amount
    taxAmount: 9000.0,             // GST Amount
  },
  {
    name: "Parking Charges",
    taxPercentage: 12.0,
    transactionAmount: 20000.0,
    taxAmount: 2400.0,
  },
  {
    name: "Club Membership Fees",
    taxPercentage: 5.0,
    transactionAmount: 10000.0,
    taxAmount: 500.0,
  },
  {
    name: "CGST Payable",
    taxPercentage: 9.0,
    transactionAmount: 5950.0,
    taxAmount: 5950.0,
  },
  {
    name: "SGST Payable",
    taxPercentage: 9.0,
    transactionAmount: 5950.0,
    taxAmount: 5950.0,
  },
];


const GstPayableReport: React.FC = () => {

    const balanceTabs = ["GST Payable"];
    const [activeBalanceTab, setActiveBalanceTab] = useState<"GST Payable">("GST Payable");

    const TaxSummaryTable = () => {
        return (
            <div className="overflow-x-auto">
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
                                Transaction Amount
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                Tax Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {taxSummaryData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.ledgerId}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                    {row.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    {row.taxPercentage.toFixed(2)} %
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.transactionAmount.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right">
                                    {row.taxAmount.toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {taxSummaryData.length === 0 && (
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
const GstTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#E5E0D3]">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              Ledger Name
            </th>
            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
              GST %
            </th>
            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
              Total Amount
            </th>
            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
              GST Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {gstTableData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3">
                {row.name}
              </td>

              <td className="border border-gray-300 px-4 py-3 text-center">
                {row.taxPercentage.toFixed(2)}
              </td>

              <td className="border border-gray-300 px-4 py-3 text-right">
                {row.transactionAmount.toFixed(2)}
              </td>

              <td className="border border-gray-300 px-4 py-3 text-right">
                {row.taxAmount.toFixed(2)}
              </td>
            </tr>
          ))}

          {taxSummaryData.length === 0 && (
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
                        GST Payable
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
                    <GstTable />
                </div>


            </div>

        </form>
    );
};

export default GstPayableReport;
