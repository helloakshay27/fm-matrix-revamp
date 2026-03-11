import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const salesByItemData = [
  {
    itemName: "Cement Kg",
    sku: "100",
    quantitySold: 1,
    amount: 490,
    avgPrice: 490,
  },
  {
    itemName: "Purchase Invoice Test",
    sku: "PIN099",
    quantitySold: 1,
    amount: 90,
    avgPrice: 90,
  },
];

const SalesByItemReport: React.FC = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    console.log("From:", filters.fromDate);
    console.log("To:", filters.toDate);
  };

  const handleQuantityClick = (itemName: string) => {
    navigate(
      `/accounting/reports/sales-by-item/details/${encodeURIComponent(
        itemName
      )}`
    );
  };

  const totalQty = salesByItemData.reduce(
    (sum, row) => sum + row.quantitySold,
    0
  );

  const totalAmount = salesByItemData.reduce(
    (sum, row) => sum + row.amount,
    0
  );

  const SalesTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#E5E0D3]">
              <th className="border px-4 py-3 text-left font-semibold">
                Item Name
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                SKU
              </th>

              <th className="border px-4 py-3 text-center font-semibold">
                Quantity Sold
              </th>

              <th className="border px-4 py-3 text-right font-semibold">
                Amount
              </th>

              <th className="border px-4 py-3 text-right font-semibold">
                Average Price
              </th>
            </tr>
          </thead>

          <tbody>
            {salesByItemData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{row.itemName}</td>

                <td className="border px-4 py-3">{row.sku}</td>

                <td className="border px-4 py-3 text-center">
                  <button
                    onClick={() => handleQuantityClick(row.itemName)}
                    className="text-[#C72030] hover:text-[#A01020] underline font-medium"
                  >
                    {row.quantitySold.toFixed(2)}
                  </button>
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.amount.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{row.avgPrice.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* TOTAL ROW */}

            <tr className="bg-[#E5E0D3] font-semibold">
              <td className="border px-4 py-3">Total</td>

              <td className="border px-4 py-3"></td>

              <td className="border px-4 py-3 text-center">
                {totalQty.toFixed(2)}
              </td>

              <td className="border px-4 py-3 text-right">
                ₹{totalAmount.toFixed(2)}
              </td>

              <td className="border px-4 py-3"></td>
            </tr>

            {salesByItemData.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="border px-4 py-6 text-center text-gray-500"
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

  return (
    <form
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      {/* HEADER FILTER SECTION */}

      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Package className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Sales by Item Report
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

          <Button
            onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}

      <div className="bg-white rounded-lg border p-6">
        <SalesTable />
      </div>
    </form>
  );
};

export default SalesByItemReport;