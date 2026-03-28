import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { FileCog, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

interface TransactionData {
  id: number;
  status: string;
  date: string | null;
  invoice_number: string;
  number: string;
  type: string;
  sales: number;
  sales_with_tax: number;
  balance_due: number;
  total_amount?: number;
  discount_amount?: number;
  charge_amount?: number;
}

interface SalesCustomer {
  id: number;
  name: string;
  invoice_count: number;
  sales: number;
  sales_with_tax: number;
  transactions?: TransactionData[];
}

const DetailsSaleCustomerReport: React.FC = () => {
  const navigate = useNavigate();
  const { customerName } = useParams<{ customerName: string }>();

  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem('lock_account_id');

  useEffect(() => {
    const fetchCustomerTransactions = async () => {
      if (!customerName) return;

      setLoading(true);

      try {
        if (!baseUrl || !token) {
          toast.error("Missing base URL or token");
          return;
        }

        const url = `https://${baseUrl}/lock_account_customers/sales_report.json?lock_account_id=${lock_account_id}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const customersData = Array.isArray(response.data)
          ? response.data
          : [];

        const customer = customersData.find(
          (cust: SalesCustomer) =>
            cust.name === decodeURIComponent(customerName)
        );

        if (customer && customer.transactions) {
          const mappedTransactions = customer.transactions.map((txn: any) => ({
            id: txn.id,
            status: txn.status,
            date: txn.date,
            invoice_number: txn.invoice_number,
            number: txn.number || txn.invoice_number,
            type: txn.type,
            sales: txn.sales || 0,
            sales_with_tax: txn.sales_with_tax || 0,
            balance_due: txn.balance_due || 0,
            total_amount: txn.total_amount || 0,
            discount_amount: txn.discount_amount || 0,
            charge_amount: txn.charge_amount || 0,
          }));

          setTransactionData(mappedTransactions);
        } else {
          setTransactionData([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTransactions();
  }, [customerName, baseUrl, token]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }

    console.log(filters);
  };

  const handleBack = () => {
    navigate("/accounting/reports/sales-by-customer");
  };

  const InvoiceDetailsTable = () => {
    const totalSales = transactionData.reduce(
      (sum, row) => sum + (row.sales || 0),
      0
    );

    const totalSalesWithTax = transactionData.reduce(
      (sum, row) => sum + (row.sales_with_tax || 0),
      0
    );

    const totalTotalAmount = transactionData.reduce(
      (sum, row) => sum + (row.total_amount || 0),
      0
    );

    const totalBalanceDue = transactionData.reduce(
      (sum, row) => sum + (row.balance_due || 0),
      0
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#E5E0D3]">
              <th className="border px-4 py-3 text-left">Date</th>
              <th className="border px-4 py-3 text-left">Type</th>
              <th className="border px-4 py-3 text-center">Status</th>
              <th className="border px-4 py-3 text-left">Number</th>
              <th className="border px-4 py-3 text-right">Sales</th>
              <th className="border px-4 py-3 text-right">Sales with Tax</th>
              <th className="border px-4 py-3 text-right">Total Amount</th>
              <th className="border px-4 py-3 text-right">Balance Due</th>
            </tr>
          </thead>

          <tbody>
            {transactionData.length > 0 ? (
              transactionData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">
                    {row.date ? row.date : "-"}
                  </td>

                  <td className="border px-4 py-3">{row.type}</td>

                  <td className="border px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status?.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td className="border px-4 py-3">{row.number}</td>

                  <td className="border px-4 py-3 text-right">
                    ₹{Number(row.sales || 0).toFixed(2)}
                  </td>

                  <td className="border px-4 py-3 text-right">
                    ₹{Number(row.sales_with_tax || 0).toFixed(2)}
                  </td>

                  <td className="border px-4 py-3 text-right">
                    ₹{Number(row.total_amount || 0).toFixed(2)}
                  </td>

                  <td className="border px-4 py-3 text-right">
                    ₹{Number(row.balance_due || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="border px-4 py-6 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}

            {transactionData.length > 0 && (
              <tr className="bg-[#E5E0D3] font-semibold">
                <td colSpan={4} className="border px-4 py-3">
                  Total
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{totalSales.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{totalSalesWithTax.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{totalTotalAmount.toFixed(2)}
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹{totalBalanceDue.toFixed(2)}
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
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]" />
        </div>
      ) : (
        <>
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

              <h3 className="text-lg font-semibold uppercase">
                Invoice Details - {customerName || "Customer"}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <InvoiceDetailsTable />
          </div>
        </>
      )}
    </form>
  );
};

export default DetailsSaleCustomerReport;