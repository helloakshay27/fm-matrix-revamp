import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const GSTR3BSummaryDetails: React.FC = () => {
    const [filters, setFilters] = useState({ fromDate: "", toDate: "" });

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const mockData = [
        {
            date: "09/03/2026",
            entryNumber: "INV-0393",
            transactionType: "Invoice",
            amount: "₹500.00",
            igst: "₹0.00",
            cgst: "₹12.50",
            sgst: "₹12.50",
            cess: "₹0.00",
        },
        {
            date: "09/03/2026",
            entryNumber: "10",
            transactionType: "Customer Payment",
            amount: "₹81.30",
            igst: "₹0.00",
            cgst: "₹11.38",
            sgst: "₹7.32",
            cess: "₹0.00",
        },
        {
            date: "09/03/2026",
            entryNumber: "CN-00002",
            transactionType: "Credit Note",
            amount: "₹-500.00",
            igst: "₹0.00",
            cgst: "₹-12.50",
            sgst: "₹-12.50",
            cess: "₹0.00",
        },
        {
            date: "10/03/2026",
            entryNumber: "INV-0395",
            transactionType: "Invoice",
            amount: "₹490.00",
            igst: "₹0.00",
            cgst: "₹12.25",
            sgst: "₹12.25",
            cess: "₹0.00",
        },
        {
            date: "10/03/2026",
            entryNumber: "INV-0396",
            transactionType: "Invoice",
            amount: "₹300.00",
            igst: "₹0.00",
            cgst: "₹7.50",
            sgst: "₹7.50",
            cess: "₹0.00",
        },
        {
            date: "18/03/2026",
            entryNumber: "INV-0394",
            transactionType: "Invoice",
            amount: "₹90.00",
            igst: "₹0.00",
            cgst: "₹2.25",
            sgst: "₹2.25",
            cess: "₹0.00",
        },
    ];

    return (
        <div
            className="w-full bg-[#f9f7f2] p-6"
            style={{ minHeight: "100vh", boxSizing: "border-box" }}
        >
            {/* FILTER CARD */}
            <div className="bg-white rounded-lg border-2 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                        GSTR-3B Summary Details
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
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]">
                        View
                    </Button>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-lg border p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-[#E5E0D3]">
                                <th className="border px-4 py-3 text-left font-semibold text-[#1A1A1A]">Date</th>
                                <th className="border px-4 py-3 text-left font-semibold text-[#1A1A1A]">Entry Number</th>
                                <th className="border px-4 py-3 text-left font-semibold text-[#1A1A1A]">Transaction Type</th>
                                <th className="border px-4 py-3 text-right font-semibold text-[#1A1A1A]">Amount</th>
                                <th className="border px-4 py-3 text-right font-semibold text-[#1A1A1A]">IGST Amount</th>
                                <th className="border px-4 py-3 text-right font-semibold text-[#1A1A1A]">CGST Amount</th>
                                <th className="border px-4 py-3 text-right font-semibold text-[#1A1A1A]">SGST Amount</th>
                                <th className="border px-4 py-3 text-right font-semibold text-[#1A1A1A]">Cess Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mockData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border px-4 py-3">{row.date}</td>
                                    <td className="border px-4 py-3">
                                        <button className="text-[#1565C0] hover:underline font-medium">
                                            {row.entryNumber}
                                        </button>
                                    </td>
                                    <td className="border px-4 py-3">{row.transactionType}</td>
                                    <td className="border px-4 py-3 text-right">{row.amount}</td>
                                    <td className="border px-4 py-3 text-right">{row.igst}</td>
                                    <td className="border px-4 py-3 text-right">{row.cgst}</td>
                                    <td className="border px-4 py-3 text-right">{row.sgst}</td>
                                    <td className="border px-4 py-3 text-right">{row.cess}</td>
                                </tr>
                            ))}

                            {/* TOTAL ROW */}
                            <tr className="bg-[#E5E0D3] font-semibold">
                                <td className="border px-4 py-3" colSpan={3}>Total</td>
                                <td className="border px-4 py-3 text-right">₹961.30</td>
                                <td className="border px-4 py-3 text-right">₹0.00</td>
                                <td className="border px-4 py-3 text-right">₹33.38</td>
                                <td className="border px-4 py-3 text-right">₹29.32</td>
                                <td className="border px-4 py-3 text-right">₹0.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GSTR3BSummaryDetails;