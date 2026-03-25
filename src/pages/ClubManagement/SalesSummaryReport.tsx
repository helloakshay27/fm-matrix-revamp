import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface SalesSummaryItem {
  date: string;
  invoice_count: number;
  total_sales: number;
  total_sales_with_tax: number;
  total_tax_amount: number;
  credit_note_count: number;
  quantity_sold: number;
}

const SalesSummaryReport = () => {
  const [salesSummaryData, setSalesSummaryData] = useState<SalesSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const lock_account_id = localStorage.getItem('lock_account_id') || "1";

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Fetch sales summary data from API
  const fetchSalesSummary = async (fromDate?: string, toDate?: string) => {
    setLoading(true);
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL or token');
        setLoading(false);
        return;
      }

      let url = `https://${baseUrl}/lock_account_invoices/sales_summary.json?lock_account_id=${lock_account_id}`;

      if (fromDate && toDate) {
        url += `&q[date_gteq]=${fromDate}&q[date_lteq]=${toDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setSalesSummaryData(data);
      console.log('Fetched sales summary:', data);

    } catch (error) {
      console.error('Error fetching sales summary:', error);
      toast.error('Failed to fetch sales summary data');
      setSalesSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load (without date filter)
  useEffect(() => {
    fetchSalesSummary();
  }, [baseUrl, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    // Convert YYYY-MM-DD to DD/MM/YYYY format for API
    const formatDate = (date: string): string => {
      const [yyyy, mm, dd] = date.split('-');
      return `${dd}/${mm}/${yyyy}`;
    };

    const fromDateFormatted = formatDate(filters.fromDate);
    const toDateFormatted = formatDate(filters.toDate);

    fetchSalesSummary(fromDateFormatted, toDateFormatted);
  };

  // Calculate totals
  const totals = salesSummaryData.reduce(
    (acc, item) => {
      acc.invoiceCount += item.invoice_count || 0;
      acc.totalSales += item.total_sales || 0;
      acc.totalSalesWithTax += item.total_sales_with_tax || 0;
      acc.taxAmount += item.total_tax_amount || 0;
      acc.creditNoteCount += item.credit_note_count || 0;
      acc.quantitySold += item.quantity_sold || 0;
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
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      ) : (
        <>
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

          {/* TABLE SECTION */}
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
                    <td className="p-3">
                      {new Date(row.date).toLocaleDateString('en-GB')} {/* Converts YYYY-MM-DD to DD/MM/YYYY */}
                    </td>
                    <td className="p-3 text-center">{row.invoice_count}</td>
                    <td className="p-3 text-right">₹{row.total_sales.toFixed(2)}</td>
                    <td className="p-3 text-right">₹{row.total_sales_with_tax.toFixed(2)}</td>
                    <td className="p-3 text-right">₹{row.total_tax_amount.toFixed(2)}</td>
                    <td className="p-3 text-center">{row.credit_note_count}</td>
                    <td className="p-3 text-center">{row.quantity_sold}</td>
                  </tr>
                ))}

                {/* TOTAL ROW */}
                <tr className="border-t font-semibold bg-gray-100">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-center">{totals.invoiceCount}</td>
                  <td className="p-3 text-right">₹{totals.totalSales.toFixed(2)}</td>
                  <td className="p-3 text-right">₹{totals.totalSalesWithTax.toFixed(2)}</td>
                  <td className="p-3 text-right">₹{totals.taxAmount.toFixed(2)}</td>
                  <td className="p-3 text-center">{totals.creditNoteCount}</td>
                  <td className="p-3 text-center">{totals.quantitySold}</td>
                </tr>

                {salesSummaryData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesSummaryReport;