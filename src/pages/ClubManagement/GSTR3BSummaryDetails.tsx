// import React, { useEffect, useState } from "react";
// import { API_CONFIG } from "@/config/apiConfig";
// import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const GSTR3BSummaryDetails: React.FC = () => {
//     const [columns, setColumns] = useState<string[]>([]);
//     const [rows, setRows] = useState<any[][]>([]);
//     const [totals, setTotals] = useState<Record<string, any>>({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const location = useLocation();
//     const navigate = useNavigate();

//     const searchParams = new URLSearchParams(location.search);
//     const boxType = searchParams.get("box_type") || "";
//     const startDate = searchParams.get("start_date") || "";
//     const endDate = searchParams.get("end_date") || "";

//     useEffect(() => {
//         if (!boxType || !startDate || !endDate) {
//             setError("Missing required query parameters.");
//             setLoading(false);
//             return;
//         }

//         const fetchTransactions = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const baseUrl = API_CONFIG.BASE_URL;
//                 const token = API_CONFIG.TOKEN;

//                 if (!baseUrl) {
//                     throw new Error("Base URL not configured.");
//                 }
//                 if (!token) {
//                     throw new Error("Auth token not found.");
//                 }

//                 const response = await axios.get(
//                     `${baseUrl}/lock_accounts/1/lock_account_transactions/gstr3b_transactions.json`,
//                     {
//                         params: {
//                             start_date: startDate,
//                             end_date: endDate,
//                             box_type: boxType,
//                         },
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 const transactions = response.data?.transactions;

//                 if (transactions) {
//                     setColumns(Array.isArray(transactions.columns) ? transactions.columns : []);
//                     setRows(Array.isArray(transactions.data) ? transactions.data : []);
//                     setTotals(transactions.totals || {});
//                 } else {
//                     setError("Unexpected response format from server.");
//                 }
//             } catch (err: any) {
//                 const status = err?.response?.status;
//                 const statusText = err?.response?.statusText;
//                 const responseData = err?.response?.data;

//                 console.error("GSTR3B details API error", {
//                     error: err,
//                     status,
//                     statusText,
//                     responseData,
//                 });

//                 setError(
//                     `Failed to load transaction details${
//                         status ? ` (${status} ${statusText || ""})` : ""
//                     }.`
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTransactions();
//     }, [boxType, endDate, startDate]);

//     const renderTable = () => {
//         if (!columns.length) {
//             return (
//                 <div className="p-6 text-center text-sm text-muted-foreground">
//                     No transaction columns available.
//                 </div>
//             );
//         }

//         return (
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300 text-sm">
//                     <thead>
//                         <tr className="bg-[#E5E0D3]">
//                             {columns.map((col, idx) => (
//                                 <th
//                                     key={idx}
//                                     className="border px-4 py-3 text-left font-semibold text-[#1A1A1A]"
//                                 >
//                                     {col}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {rows.map((row, rowIndex) => (
//                             <tr key={rowIndex} className="hover:bg-gray-50">
//                                 {row.map((cell: any, cellIndex: number) => (
//                                     <td key={cellIndex} className="border px-4 py-3">
//                                         {cell ?? ""}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}

//                         {Object.keys(totals).length > 0 ? (
//                             <tr className="bg-[#E5E0D3] font-semibold">
//                                 <td className="border px-4 py-3" colSpan={columns.length}>
//                                     Totals: {Object.entries(totals)
//                                         .map(([k, v]) => `${k}: ${v}`)
//                                         .join(" • ")}
//                                 </td>
//                             </tr>
//                         ) : null}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between gap-6">
//                 <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
//                         <FileText className="w-6 h-6" />
//                     </div>
//                     <div>
//                         <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
//                             GSTR-3B Summary Details
//                         </h3>
//                         <p className="text-sm text-muted-foreground">
//                             {boxType ? `Details for ${boxType}` : ""}
//                         </p>
//                     </div>
//                 </div>

//                 <Button
//                     variant="outline"
//                     onClick={() => navigate(-1)}
//                     className="h-[40px]"
//                 >
//                     Back
//                 </Button>
//             </div>

//             {loading ? (
//                 <div className="p-6 text-center text-sm text-muted-foreground">
//                     Loading transactions...
//                 </div>
//             ) : error ? (
//                 <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
//                     {error}
//                 </div>
//             ) : (
//                 <div className="bg-white rounded-lg border p-6">{renderTable()}</div>
//             )}
//         </div>
//     );
// };

// export default GSTR3BSummaryDetails;

import React, { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const GSTR3BSummaryDetails: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const boxType = searchParams.get("box_type") || "";
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";

  useEffect(() => {
    if (!boxType || !startDate || !endDate) {
      setError("Missing required query parameters.");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;
        const lockAccountId = localStorage.getItem("lock_account_id") || "1";

        const response = await axios.get(
          `${baseUrl}/lock_accounts/${lockAccountId}/lock_account_transactions/gstr3b_transactions.json`,
          {
            params: {
              start_date: startDate,
              end_date: endDate,
              box_type: boxType,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactions = response.data?.transactions;

        if (!transactions) {
          throw new Error("Invalid API response");
        }

        setColumns(transactions.columns || []);

        // Correctly map only required fields
        const formattedRows =
          Array.isArray(transactions.data) &&
          transactions.data.map((row: any) => [
            row.date,
            row.entry_number,
            row.transaction_type,
            row.amount_formatted ?? row.amount,
            row.igst_amount_formatted ?? row.igst_amount,
            row.cgst_amount_formatted ?? row.cgst_amount,
            row.sgst_amount_formatted ?? row.sgst_amount,
            row.cess_amount_formatted ?? row.cess_amount,
          ]);

        setRows(formattedRows || []);
        setTotals(transactions.totals || {});
      } catch (err: any) {
        console.error("GSTR3B details API error", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [boxType, startDate, endDate]);

  const renderTable = () => {
    if (!columns.length) {
      return (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No transaction columns available.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-[#E5E0D3]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="border px-4 py-3 text-left font-semibold text-[#1A1A1A]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* DATA ROWS */}
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="border px-4 py-3">
                      {cell ?? ""}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No transactions found for selected period.
                </td>
              </tr>
            )}

            {/* TOTALS ROW */}
            {Object.keys(totals).length > 0 && (
              <tr className="bg-[#E5E0D3] font-semibold">
                <td className="border px-4 py-3">Totals</td>
                <td className="border px-4 py-3"></td>
                <td className="border px-4 py-3"></td>
                <td className="border px-4 py-3">
                  {totals.amount_formatted ?? "₹0.00"}
                </td>
                <td className="border px-4 py-3">
                  {totals.igst_amount_formatted ?? "₹0.00"}
                </td>
                <td className="border px-4 py-3">
                  {totals.cgst_amount_formatted ?? "₹0.00"}
                </td>
                <td className="border px-4 py-3">
                  {totals.sgst_amount_formatted ?? "₹0.00"}
                </td>
                <td className="border px-4 py-3">
                  {totals.cess_amount_formatted ?? "₹0.00"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="w-6 h-6 cursor-pointer text-[#1A1A1A] hover:text-[#C72030]"
        />
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
          <FileText className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            GSTR-3B Summary Details
          </h3>

          <p className="text-sm text-muted-foreground">
            {boxType ? `Details for ${boxType}` : ""}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          Loading transactions...
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-6">{renderTable()}</div>
      )}
    </div>
  );
};

export default GSTR3BSummaryDetails;