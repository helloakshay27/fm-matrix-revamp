import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";

interface GSTR7Row {
  gstin: string;
  vendor: string;
  amountPaid: number;
  integratedTax: number;
  centralTax: number;
  stateTax: number;
  totalTax: number;
}

const GSTR7Report: React.FC = () => {

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Dummy data for UI preview
  const [data] = useState<GSTR7Row[]>([
    {
      gstin: "27ABCDE1234F1Z5",
      vendor: "ABC Vendor Pvt Ltd",
      amountPaid: 25000,
      integratedTax: 0,
      centralTax: 225,
      stateTax: 225,
      totalTax: 450,
    },
  ]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleView = () => {
    console.log("Filters:", filters);
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

      {/* HEADER */}
      <div className="text-center mb-6">

        <div className="text-sm text-gray-500">
          Lockated
        </div>

        <h2 className="text-xl font-semibold mt-2">
          GSTR-7 (Return for Tax Deducted at Source)
        </h2>

        <div className="text-sm text-gray-600 mt-1">
          From {filters.fromDate || "DD/MM/YYYY"} To {filters.toDate || "DD/MM/YYYY"}
        </div>

      </div>

      {/* FILTER SECTION */}

      <div className="bg-white border rounded-lg p-6 mb-6">

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
            onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-lg overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-[#E5E0D3] text-sm">

              <th className="border px-4 py-3 text-left">
                GSTIN OF DEDUCTEE
              </th>

              <th className="border px-4 py-3 text-left">
                VENDOR NAME
              </th>

              <th className="border px-4 py-3 text-right">
                AMOUNT PAID TO DEDUCTEE ON WHICH TAX IS DEDUCTED
              </th>

              <th className="border px-4 py-3 text-right">
                INTEGRATED TAX
              </th>

              <th className="border px-4 py-3 text-right">
                CENTRAL TAX
              </th>

              <th className="border px-4 py-3 text-right">
                STATE/UT TAX
              </th>

              <th className="border px-4 py-3 text-right">
                TOTAL TAX DEDUCTED AT SOURCE
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr key={index} className="hover:bg-gray-50">

                <td className="border px-4 py-3">
                  {row.gstin}
                </td>

                <td className="border px-4 py-3">
                  {row.vendor}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.amountPaid.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.integratedTax.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.centralTax.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.stateTax.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right font-semibold">
                  ₹{row.totalTax.toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default GSTR7Report;