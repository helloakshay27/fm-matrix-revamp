import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

interface SalesDetail {
    date: string;
    type: string;
    status: string;
    due_date: string;
    number: string;
    customer_name: string;
    sales: number;
    sales_with_tax: number;
    balance_due: number;
}

const SalesBySalesPersonDetails: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const salespersonId = searchParams.get("salesperson_id");
    const salespersonName = searchParams.get("salesperson_name") ?? "";
    const fromDate = searchParams.get("from_date") ?? "";
    const toDate = searchParams.get("to_date") ?? "";

    const [details, setDetails] = useState<SalesDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDateForAPI = (dateString: string): string => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${month}/${day}/${year}`;
    };

    const formatDateForDisplay = (dateString: string): string => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError(null);

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

            const params = new URLSearchParams();
            if (lockAccountId) params.append("lock_account_id", lockAccountId);
            if (salespersonId !== null) params.append("sales_person_id", String(salespersonId));
            if (fromDate) params.append("from_date", formatDateForAPI(fromDate));
            if (toDate) params.append("to_date", formatDateForAPI(toDate));

            const url = `https://${baseUrl}/sales_persons/sales_report_details?${params.toString()}`;

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

            const data: SalesDetail[] = await response.json();
            setDetails(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setError(errorMessage);
            console.error("Error fetching sales details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [salespersonId, fromDate, toDate]);

    const totals = details.reduce(
        (acc, item) => {
            acc.sales += item.sales;
            acc.salesWithTax += item.sales_with_tax;
            acc.balanceDue += item.balance_due;
            return acc;
        },
        { sales: 0, salesWithTax: 0, balanceDue: 0 }
    );

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "text-green-600";
            case "open":
                return "text-blue-500";
            case "overdue":
                return "text-red-600";
            case "draft":
                return "text-gray-500";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

            {/* HEADER CARD */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <Users size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold uppercase">
                            Sales by Sales Person - {salespersonName || "Others"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            From{" "}
                            <span className="font-medium text-gray-700">
                                {fromDate ? formatDateForDisplay(fromDate) : "—"}
                            </span>{" "}
                            To{" "}
                            <span className="font-medium text-gray-700">
                                {toDate ? formatDateForDisplay(toDate) : "—"}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="ml-auto text-sm text-[#C72030] hover:underline font-medium"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-lg border overflow-x-auto">
                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-200">
                        <p className="text-red-700 text-sm">Error: {error}</p>
                    </div>
                )}

                {loading && (
                    <div className="p-6 text-center">
                        <p className="text-gray-600">Loading details...</p>
                    </div>
                )}

                {!loading && !error && details.length === 0 && (
                    <div className="p-6 text-center">
                        <p className="text-gray-600">No data available</p>
                    </div>
                )}

                {!loading && !error && details.length > 0 && (
                    <table className="w-full text-sm">

                        <thead className="bg-[#E5E0D3]">
                            <tr>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Due Date</th>
                                <th className="p-3 text-left">Number</th>
                                <th className="p-3 text-left">Customer Name</th>
                                <th className="p-3 text-right">Sales</th>
                                <th className="p-3 text-right">Sales With Tax</th>
                                <th className="p-3 text-right">Balance Due</th>
                            </tr>
                        </thead>

                        <tbody>
                            {details.map((row, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{row.date}</td>
                                    <td className="p-3">{row.type}</td>
                                    <td className={`p-3 font-medium ${getStatusStyle(row.status)}`}>
                                        {row.status}
                                    </td>
                                    <td className="p-3">{row.due_date || ""}</td>
                                    <td className="p-3 text-blue-600">{row.number}</td>
                                    <td className="p-3 text-blue-600">{row.customer_name}</td>
                                    <td className="p-3 text-right">₹{row.sales.toFixed(2)}</td>
                                    <td className="p-3 text-right">₹{row.sales_with_tax.toFixed(2)}</td>
                                    <td className="p-3 text-right">₹{row.balance_due.toFixed(2)}</td>
                                </tr>
                            ))}

                            {/* TOTAL ROW */}
                            <tr className="border-t font-semibold bg-gray-100">
                                <td className="p-3" colSpan={6}>Total</td>
                                <td className="p-3 text-right">₹{totals.sales.toFixed(2)}</td>
                                <td className="p-3 text-right">₹{totals.salesWithTax.toFixed(2)}</td>
                                <td className="p-3 text-right">₹{totals.balanceDue.toFixed(2)}</td>
                            </tr>
                        </tbody>

                    </table>
                )}
            </div>

        </div>
    );
};

export default SalesBySalesPersonDetails;