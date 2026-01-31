import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ChartOfAccountDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [ledgerLoading, setLedgerLoading] = useState(false);
    const [ledgerDetails, setLedgerDetails] = useState<any | null>(null);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [closingBalance, setClosingBalance] = useState(0);
    const [description, setDescription] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [date, setDate] = useState("");

    // Fetch ledger details from correct API
    const fetchLedgerDetails = async () => {
        setLedgerLoading(true);
        try {
            const res = await axios.get(
                `https://club-uat-api.lockated.com/lock_accounts/1/lock_account_ledgers/${id}.json`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLedgerDetails(res.data);
            setAccountName(res.data.name || "");
            setAccountType(res.data.account_type || "");
            setDescription(res.data.description || "");
            setClosingBalance(res.data.current_total || 0);
        } catch (err) {
            console.error(err);
            setLedgerDetails(null);
        } finally {
            setLedgerLoading(false);
        }
    };

    // Existing transaction fetch
    const fetchAccountDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://${baseUrl}/lock_accounts/1/lock_account_transactions/${id}.json`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = res.data;

            setDate(
                data.transaction_date
                    ? data.transaction_date.split("-").reverse().join("-")
                    : ""
            );
            // Don't override description from ledger

            const rows = Array.isArray(data.records)
                ? data.records.map((r: any) => ({
                    debit: r.tr_type === "dr" ? r.amount : 0,
                    credit: r.tr_type === "cr" ? r.amount : 0,
                }))
                : [];

            const debitTotal = rows.reduce((s, r) => s + r.debit, 0);
            const creditTotal = rows.reduce((s, r) => s + r.credit, 0);

            // Don't override closingBalance from ledger
            setTransactions(rows);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedgerDetails();
        fetchAccountDetails();
    }, [id]);

    if (loading || ledgerLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-white">
            {/* Back */}
            <Button
                variant="ghost"
                className="mb-4 px-0"
                onClick={() => navigate("/settings/chart-journal")}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Ledger Details Section */}
            <div className="border-b pb-4 mb-6">
                <p className="text-sm text-gray-500">{ledgerDetails?.account_type || accountType}</p>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {ledgerDetails?.name || accountName}
                    </h1>
                    {/* <Button variant="outline" className="text-blue-600 border-blue-600">
            Edit
          </Button> */}
                </div>
                {/* <div className="mt-2 flex flex-wrap gap-6">
          <div>
            <span className="text-xs text-gray-500">Account Code:</span>
            <span className="ml-2 text-sm text-gray-700">{ledgerDetails?.account_code ?? "--"}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Ledger ID:</span>
            <span className="ml-2 text-sm text-gray-700">{ledgerDetails?.id ?? id}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Group ID:</span>
            <span className="ml-2 text-sm text-gray-700">{ledgerDetails?.lock_account_group_id ?? "--"}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Active:</span>
            <span className="ml-2 text-sm text-gray-700">{ledgerDetails?.active ? "Yes" : "No"}</span>
          </div>
        </div> */}
            </div>

            {/* Closing Balance */}
            <div className="bg-[#F9FBFF] border rounded-md p-5 mb-6">
                <p className="text-xs text-gray-500 uppercase mb-1">Closing Balance</p>
                <p className="text-xl font-semibold text-blue-600">
                    ₹{Math.abs(ledgerDetails?.current_total ?? closingBalance).toFixed(2)}{' '}
                    <span className="text-sm">
                        {(ledgerDetails?.current_total ?? closingBalance) >= 0 ? 'Dr' : 'Cr'}
                    </span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    {ledgerDetails?.description || description || 'No description available.'}
                </p>
            </div>

            {/* Recent Transactions */}
            <div className="border rounded-md">
                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-800">Recent Transactions</h3>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">FCY</Button>
                        <Button size="sm" variant="secondary">BCY</Button>
                    </div>
                </div>

                {/* <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Transaction Details</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-right px-4 py-2">Debit</th>
              <th className="text-right px-4 py-2">Credit</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{date || '-'}</td>
                  <td className="px-4 py-2 text-gray-500">--</td>
                  <td className="px-4 py-2">Journal</td>
                  <td className="px-4 py-2 text-right">{t.debit ? `₹${t.debit.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-2 text-right">{t.credit ? `₹${t.credit.toFixed(2)}` : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table> */}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#E5E0D3]">
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                    Date
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                    Transaction Details
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                    Type
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                    Debit
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                                    Credit
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length ? (
                                transactions.map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3">
                                            {date || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-gray-500">
                                            --
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            Journal
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">
                                            {t.debit ? `₹${t.debit.toFixed(2)}` : "-"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">
                                            {t.credit ? `₹${t.credit.toFixed(2)}` : "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="border border-gray-300 text-center py-6 text-gray-400"
                                    >
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};
