import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const salesData = [
  {
    name: "Rahul Sharma",
    invoiceCount: 3,
    invoiceSales: 15000,
    invoiceSalesWithTax: 17700,
    creditNoteCount: 1,
    creditNoteSales: 2000,
    creditNoteSalesWithTax: 2360,
    totalSales: 13000,
    totalSalesWithTax: 15340,
  },
];

const SalesBySalesPersonReport = () => {
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

  const totals = salesData.reduce(
    (acc, item) => {
      acc.invoiceCount += item.invoiceCount;
      acc.invoiceSales += item.invoiceSales;
      acc.invoiceSalesWithTax += item.invoiceSalesWithTax;
      acc.creditNoteCount += item.creditNoteCount;
      acc.creditNoteSales += item.creditNoteSales;
      acc.creditNoteSalesWithTax += item.creditNoteSalesWithTax;
      acc.totalSales += item.totalSales;
      acc.totalSalesWithTax += item.totalSalesWithTax;
      return acc;
    },
    {
      invoiceCount: 0,
      invoiceSales: 0,
      invoiceSalesWithTax: 0,
      creditNoteCount: 0,
      creditNoteSales: 0,
      creditNoteSalesWithTax: 0,
      totalSales: 0,
      totalSalesWithTax: 0,
    }
  );

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

      {/* FILTER CARD */}

      <div className="bg-white rounded-lg border p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Users size={22} />
          </div>

          <h3 className="text-lg font-semibold uppercase">
            Sales by Sales Person
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

      <div className="bg-white rounded-lg border overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-[#E5E0D3]">

            <tr>

              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-center">Invoice Count</th>

              <th className="p-3 text-right">Invoice Sales</th>

              <th className="p-3 text-right">Invoice Sales With Tax</th>

              <th className="p-3 text-center">Credit Note Count</th>

              <th className="p-3 text-right">Credit Note Sales</th>

              <th className="p-3 text-right">Credit Note Sales With Tax</th>

              <th className="p-3 text-right">Total Sales</th>

              <th className="p-3 text-right">Total Sales With Tax</th>

            </tr>

          </thead>

          <tbody>

            {salesData.map((row, index) => (

              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-3 text-blue-600">{row.name}</td>

                <td className="p-3 text-center">{row.invoiceCount}</td>

                <td className="p-3 text-right">
                  ₹{row.invoiceSales.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.invoiceSalesWithTax.toFixed(2)}
                </td>

                <td className="p-3 text-center">{row.creditNoteCount}</td>

                <td className="p-3 text-right">
                  ₹{row.creditNoteSales.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.creditNoteSalesWithTax.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.totalSales.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.totalSalesWithTax.toFixed(2)}
                </td>

              </tr>

            ))}

            {/* TOTAL ROW */}

            <tr className="border-t font-semibold bg-gray-100">

              <td className="p-3">Total</td>

              <td className="p-3 text-center">{totals.invoiceCount}</td>

              <td className="p-3 text-right">
                ₹{totals.invoiceSales.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.invoiceSalesWithTax.toFixed(2)}
              </td>

              <td className="p-3 text-center">{totals.creditNoteCount}</td>

              <td className="p-3 text-right">
                ₹{totals.creditNoteSales.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.creditNoteSalesWithTax.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.totalSales.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totals.totalSalesWithTax.toFixed(2)}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SalesBySalesPersonReport;