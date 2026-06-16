import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface SalesReport {
  id: number | null;
  name: string;
  invoice_count: number;
  invoice_sales: number;
  invoice_sales_with_tax: number;
  credit_note_count: number;
  credit_note_sales: number;
  credit_note_sales_with_tax: number;
  total_sales: number;
  total_sales_with_tax: number;
}

const SalesBySalesPersonReport = () => {
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Format date from YYYY-MM-DD to MM/DD/YYYY
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // Fetch sales report data from API
  const fetchSalesReport = async (fromDate?: string, toDate?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get token and baseURL from localStorage (matching other reports pattern)
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl");
      const lockAccountId = localStorage.getItem("lock_account_id");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      if (!baseUrl) {
        setError("Base URL not configured. Please check your settings.");
        return;
      }

      // Build URL with date filters if provided
      let url = `https://${baseUrl}/sales_persons/sales_report`;
      const params = new URLSearchParams();

      if (lockAccountId) {
        params.append("lock_account_id", lockAccountId);
      }

      if (fromDate && toDate) {
        const formattedFromDate = formatDateForAPI(fromDate);
        const formattedToDate = formatDateForAPI(toDate);
        params.append("from_date", formattedFromDate);
        params.append("to_date", formattedToDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: SalesReport[] = await response.json();
      setSalesData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching sales report:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSalesReport();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    fetchSalesReport(filters.fromDate, filters.toDate);
  };


  const totals = salesData.reduce(
    (acc, item) => {
      acc.invoiceCount += item.invoice_count;
      acc.invoiceSales += item.invoice_sales;
      acc.invoiceSalesWithTax += item.invoice_sales_with_tax;
      acc.creditNoteCount += item.credit_note_count;
      acc.creditNoteSales += item.credit_note_sales;
      acc.creditNoteSalesWithTax += item.credit_note_sales_with_tax;
      acc.totalSales += item.total_sales;
      acc.totalSalesWithTax += item.total_sales_with_tax;
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
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}

        {loading && (
          <div className="p-6 text-center">
            <p className="text-gray-600">Loading sales report...</p>
          </div>
        )}

        {!loading && !error && salesData.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-600">No sales data available</p>
          </div>
        )}

        {!loading && !error && salesData.length > 0 && (
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

                  <td className="p-3 text-center">{row.invoice_count}</td>

                  <td className="p-3 text-right">
                    ₹{row.invoice_sales.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    ₹{row.invoice_sales_with_tax.toFixed(2)}
                  </td>

                  <td className="p-3 text-center">{row.credit_note_count}</td>

                  <td className="p-3 text-right">
                    ₹{row.credit_note_sales.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    ₹{row.credit_note_sales_with_tax.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    ₹{row.total_sales.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    ₹{row.total_sales_with_tax.toFixed(2)}
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
        )}

      </div>

    </div>
  );
};

export default SalesBySalesPersonReport;