import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const getTransactionRoute = (transactionType: string, transactionId: any): string | null => {
    if (!transactionId) return null;
    const type = (transactionType || '').toLowerCase();
    if (type === 'invoice') return `/accounting/dashboard/invoices/${transactionId}`;
    if (type === 'customer payment') return `/accounting/payments-received/${transactionId}`;
    if (type === 'credit note') return `/accounting/credit-note/${transactionId}`;
    if (type === 'expense') return `/accounting/expense/${transactionId}`;
    if (type === 'bill') return `/accounting/bills/${transactionId}`;
    if (type === 'sales order') return `/accounting/sales-order/${transactionId}`;
    if (type === 'purchase') return `/accounting/purchase-order/${transactionId}`;
    if (type === 'vendor credit') return `/accounting/vendor-credits/details/${transactionId}`;
    return null;
};

export const CashFlowDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");

    const [loading, setLoading] = useState(false);
    const [ledgerLoading, setLedgerLoading] = useState(false);
    const [ledgerDetails, setLedgerDetails] = useState<any | null>(null);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const fetchLedgerDetails = async () => {
        setLedgerLoading(true);
        try {
            const res = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_ledgers/${id}.json`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLedgerDetails(res.data);
            setAccountName(res.data.name || "");
            setAccountType(res.data.account_type || "");

            const rows = Array.isArray(res.data.lock_account_transaction_records)
                ? res.data.lock_account_transaction_records.map((r: any) => ({
                    date: r.transaction_detail?.date || r.created_at,
                    account: r.ledger_name || '-',
                    transaction_details: r.transaction_detail?.name || '-',
                    transaction_type: r.transaction_type || '-',
                    transaction_number: r.voucher_number || '-',
                    reference_number: r.transaction_detail?.reference_number || '-',
                    tr_type: r.tr_type,
                    debit: r.tr_type === "dr" ? r.amount : 0,
                    credit: r.tr_type === "cr" ? r.amount : 0,
                    amount: r.amount || 0,
                    transaction_id: r.transaction_detail?.id || null,
                }))
                : [];

            setTransactions(rows);
        } catch (err) {
            console.error(err);
            setLedgerDetails(null);
        } finally {
            setLedgerLoading(false);
        }
    };

    useEffect(() => {
        fetchLedgerDetails();
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
            <Button
                variant="ghost"
                className="mb-4 px-0"
                onClick={() => navigate("/accounting/reports/cash-flow-statement")}
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
                </div>
            </div>

            {/* Transactions Table */}
            <div className="border rounded-md">
                <div className="flex justify-center items-center px-4 py-3 border-b bg-gray-50">
                    <h1 className="font-medium text-gray-800">Account Transactions</h1>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#E5E0D3]">
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Account</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Transaction Details</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Transaction Type</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Transaction#</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Reference#</th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Debit</th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Credit</th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length ? (
                                transactions.map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">{formatDate(t.date)}</td>
                                        <td className="border border-gray-300 px-4 py-3">{t.account}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-gray-500">{t.transaction_details}</td>
                                        <td className="border border-gray-300 px-4 py-3">{t.transaction_type}</td>
                                        <td className="border border-gray-300 px-4 py-3">{t.transaction_number}</td>
                                        <td className="border border-gray-300 px-4 py-3">{t.reference_number}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">
                                            {t.debit ? (
                                                (() => { const route = getTransactionRoute(t.transaction_type, t.transaction_id); return route ? (
                                                    <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(route)}>₹{Number(t.debit).toFixed(2)}</span>
                                                ) : `₹${Number(t.debit).toFixed(2)}`; })()
                                            ) : '-'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">
                                            {t.credit ? (
                                                (() => { const route = getTransactionRoute(t.transaction_type, t.transaction_id); return route ? (
                                                    <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(route)}>₹{Number(t.credit).toFixed(2)}</span>
                                                ) : `₹${Number(t.credit).toFixed(2)}`; })()
                                            ) : '-'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                                            {(() => { const route = getTransactionRoute(t.transaction_type, t.transaction_id); return route ? (
                                                <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(route)}>₹{Number(t.amount).toFixed(2)}</span>
                                            ) : `₹${Number(t.amount).toFixed(2)}`; })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="border border-gray-300 text-center py-6 text-gray-400">
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
