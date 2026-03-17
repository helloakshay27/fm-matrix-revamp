import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const salesSummaryData = [
  {
    date: "12/11/2025",
    invoiceCount: 1,
    totalSales: 1530,
    totalSalesWithTax: 1530,
    taxAmount: 0,
    creditNoteCount: 1,
    quantitySold: 5,
  },
  {
    date: "13/11/2025",
    invoiceCount: 2,
    totalSales: 1110,
    totalSalesWithTax: 1110,
    taxAmount: 0,
    creditNoteCount: 0,
    quantitySold: 4,
  },
  {
    date: "09/03/2026",
    invoiceCount: 1,
    totalSales: 0,
    totalSalesWithTax: 0,
    taxAmount: 0,
    creditNoteCount: 1,
    quantitySold: 0,
  },
  {
    date: "10/03/2026",
    invoiceCount: 1,
    totalSales: 500,
    totalSalesWithTax: 524.5,
    taxAmount: 24.5,
    creditNoteCount: 0,
    quantitySold: 1,
  },
  {
    date: "18/03/2026",
    invoiceCount: 1,
    totalSales: 80,
    totalSalesWithTax: 84.5,
    taxAmount: 4.5,
    creditNoteCount: 0,
    quantitySold: 1,
  },
];

const SalesSummaryReport = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    console.log(filters);
  };

  const totals = salesSummaryData.reduce(
    (acc, item) => {
      acc.invoiceCount += item.invoiceCount;
      acc.totalSales += item.totalSales;
      acc.totalSalesWithTax += item.totalSalesWithTax;
      acc.taxAmount += item.taxAmount;
      acc.creditNoteCount += item.creditNoteCount;
      acc.quantitySold += item.quantitySold;
      return acc;
    },
    {
      invoiceCount: 0,
      totalSales: 0,
      totalSalesWithTax: 0,
      taxAmount: 0,
      creditNoteCount: 0,
      quantitySold: 0,
    }
  );

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

      {/* FILTER SECTION */}

      <div className="bg-white rounded-lg border-2 p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <BarChart3 size={22} />
          </div>

          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Sales Summary Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
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

      <div className="bg-white rounded-lg border p-6 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-[#E5E0D3]">

            <tr>

              <th className="p-3 text-left">Date</th>

              <th className="p-3 text-center">Invoice Count</th>

              <th className="p-3 text-right">Total Sales</th>

              <th className="p-3 text-right">Total Sales With Tax</th>

              <th className="p-3 text-right">Total Tax Amount</th>

              <th className="p-3 text-center">Credit Note Count</th>

              <th className="p-3 text-center">Quantity Sold</th>

            </tr>

          </thead>

          <tbody>

            {salesSummaryData.map((row, index) => (

              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-3">{row.date}</td>

                <td className="p-3 text-center">
                  {row.invoiceCount}
                </td>

                <td className="p-3 text-right">
                  ₹{row.totalSales.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.totalSalesWithTax.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.taxAmount.toFixed(2)}
                </td>

                <td className="p-3 text-center">
                  {row.creditNoteCount}
                </td>

                <td className="p-3 text-center">
                  {row.quantitySold}
                </td>

              </tr>

            ))}

            {/* TOTAL ROW */}

            <tr className="border-t font-semibold bg-gray-100">

              <td className="p-3">Total</td>

              <td className="p-3 text-center">
                {totals.invoiceCount}
              </td>

              <td className="p-3 text-right">
                ₹{totals.totalSales.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.totalSalesWithTax.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.taxAmount.toFixed(2)}
              </td>

              <td className="p-3 text-center">
                {totals.creditNoteCount}
              </td>

              <td className="p-3 text-center">
                {totals.quantitySold}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SalesSummaryReport;