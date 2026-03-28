
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileCog } from 'lucide-react';
import axios from "axios";
import { toast } from "sonner";

interface SalesItem {
  id: number;
  name: string;
  sku: string;
  quantity_sold: number;
  amount: number;
  amount_with_tax: number;
  average: number | null;
}

interface CustomerSale {
  customer: string;
  quantity: number;
  amount: number;
  avgPrice: number;
}


const DetailsSalesByItemReport = () => {
  const { itemName } = useParams<{ itemName: string }>();
  const navigate = useNavigate();
  const [itemSales, setItemSales] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem('lock_account_id');

  useEffect(() => {
    const fetchItemSales = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!baseUrl || !token) {
          setError("Missing base URL or token");
          setLoading(false);
          return;
        }
        const url = `https://${baseUrl}/lock_account_items/sales_report.json?lock_account_id=${lock_account_id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = Array.isArray(response.data) ? response.data : [];
        setItemSales(data);
      } catch (err) {
        setError("Failed to fetch item sales");
        toast.error("Failed to fetch item sales");
        setItemSales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItemSales();
  }, [baseUrl, token]);

  // Filter for the current itemName
  const filteredSales = itemSales.filter(
    (item) => item.name?.toLowerCase() === (itemName || "").toLowerCase()
  );

  // Map to table rows (simulate customer breakdown if needed)
  // For now, show one row per item (API does not provide customer breakdown)
  const tableData: CustomerSale[] = filteredSales.map((item) => ({
    customer: item.name,
    quantity: item.quantity_sold || 0,
    amount: item.amount || 0,
    avgPrice: item.average ?? 0,
  }));

  const totalQty = tableData.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalAmount = tableData.reduce((sum, r) => sum + (r.amount || 0), 0);

  const handleBack = () => {
    navigate('/accounting/reports/sales-by-item');
  };

  return (
    <div className="p-6 bg-[#f9f7f2] min-h-screen">
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
            Sales by Item - {itemName}
          </h3>
        </div>
      </div>
      {/* TABLE */}
      <div className="bg-white border rounded-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
        <table className="w-full border-collapse border border-gray-300">
            <thead >
            <tr className="bg-[#E5E0D3]">
                <th className="text-left p-3">Customer Name</th>
                <th className="text-center p-3">Quantity</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-right p-3">Average Price</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-black">
                      {row.customer}
                    </td>
                    <td className="p-3 text-center">
                      {(row.quantity || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      ₹{(row.amount || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      ₹{(row.avgPrice || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
              {/* TOTAL */}
              <tr className="border-t font-semibold bg-gray-50">
                <td className="p-3">Total</td>
                <td className="p-3 text-center">
                  {totalQty.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₹{totalAmount.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DetailsSalesByItemReport;