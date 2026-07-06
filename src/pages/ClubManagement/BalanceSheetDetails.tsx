import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const getClosingStockRows = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const candidates = [
        payload?.rows,
        payload?.closing_stock_ledger,
        payload?.closing_stock_ledgers,
        payload?.closing_stock_ledger_records,
        payload?.records,
        payload?.data,
    ];

    const rows = candidates.find(Array.isArray);
    return rows || [];
};

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

export const BalanceSheetDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [ledgerLoading, setLedgerLoading] = useState(false);
    const [ledgerDetails, setLedgerDetails] = useState<any | null>(null);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [closingBalance, setClosingBalance] = useState(0);
    const [description, setDescription] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [closingStockLoading, setClosingStockLoading] = useState(false);
    const [closingStockRows, setClosingStockRows] = useState<any[]>([]);
    const [closingStockMeta, setClosingStockMeta] = useState<{ as_of_date?: string; closing_qty?: number; closing_value?: number } | null>(null);
    const [date, setDate] = useState("");
    const lock_account_id = localStorage.getItem("lock_account_id");

    const showClosingStockLedger = new URLSearchParams(location.search).get("is_drill_down_supported") === "true";

    // Fetch ledger details from correct API
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        const normalized = dateString.trim();
        const ddmmyyyyMatch = /^([0-3]\d)-([0-1]\d)-([0-9]{4})$/.exec(normalized);
        if (ddmmyyyyMatch) {
            const [, day, month, year] = ddmmyyyyMatch;
            return `${day}-${month}-${year}`;
        }

        const parsed = new Date(normalized);
        if (isNaN(parsed.getTime())) {
            return "-";
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const fetchClosingStockLedger = async () => {
        if (!baseUrl || !token || !lock_account_id) return;

        setClosingStockLoading(true);
        try {
            const res = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/closing_stock_ledger.json`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const rows = getClosingStockRows(res.data);
            setClosingStockRows(rows);
            setClosingStockMeta({
                as_of_date: res.data?.as_of_date,
                closing_qty: res.data?.closing_qty,
                closing_value: res.data?.closing_value,
            });
        } catch (err) {
            console.error(err);
            setClosingStockRows([]);
            setClosingStockMeta(null);
        } finally {
            setClosingStockLoading(false);
        }
    };
    const fetchLedgerDetails = async () => {
        setLedgerLoading(true);
        try {
            const res = await axios.get(
                `https://club-uat-api.lockated.com/lock_accounts/${lock_account_id}/lock_account_ledgers/${id}.json`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLedgerDetails(res.data);
            setAccountName(res.data.name || "");
            setAccountType(res.data.account_type || "");
            setDescription(res.data.description || "");
            setClosingBalance(res.data.current_total || 0);

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

            const debitTotal = rows.reduce((s, r) => s + r.debit, 0);
            const creditTotal = rows.reduce((s, r) => s + r.credit, 0);
            const data = res.data.lock_account_transaction_records;
            setDate(
                data.created_at
                    ? data.created_at.split("-").reverse().join("-")
                    : ""
            );
            setTransactions(rows)
        } catch (err) {
            console.error(err);
            setLedgerDetails(null);
        } finally {
            setLedgerLoading(false);
        }
    };

    // Existing transaction fetch
    // const fetchAccountDetails = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await axios.get(
    //             `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/${id}.json`,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );

    //         const data = res.data;

    //         setDate(
    //             data.transaction_date
    //                 ? data.transaction_date.split("-").reverse().join("-")
    //                 : ""
    //         );
    //         // Don't override description from ledger

    //         const rows = Array.isArray(data.lock_account_transaction_records)
    //             ? data.records.map((r: any) => ({
    //                 debit: r.tr_type === "dr" ? r.amount : 0,
    //                 credit: r.tr_type === "cr" ? r.amount : 0,
    //             }))
    //             : [];

    //         const debitTotal = rows.reduce((s, r) => s + r.debit, 0);
    //         const creditTotal = rows.reduce((s, r) => s + r.credit, 0);

    //         // Don't override closingBalance from ledger
    //         // setTransactions(data.lock_account_transaction_records || rows);
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        fetchLedgerDetails();
        if (showClosingStockLedger) {
            fetchClosingStockLedger();
        }
        // fetchAccountDetails();
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
                onClick={() => navigate("/accounting/reports/balance-sheet")}
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
            {/* <div className="bg-[#F9FBFF] border rounded-md p-5 mb-6">
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
            </div> */}

            {/* Recent Transactions */}
            <div className="border rounded-md">
                <div className="flex justify-center items-center px-4 py-3 border-b bg-gray-50">
                    <h1 className="font-medium text-gray-800">Account  Transactions</h1>
                    {/* <div className="flex gap-2">
                        <Button size="sm" variant="outline">FCY</Button>
                        <Button size="sm" variant="secondary">BCY</Button>
                    </div> */}
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

            {showClosingStockLedger && (
                <div className="border rounded-md mt-8">
                    <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                        <div>
                            <h2 className="font-medium text-gray-800">Closing Stock Ledger</h2>
                            {closingStockMeta?.as_of_date && (
                                <p className="text-sm text-gray-500">As of {formatDate(closingStockMeta.as_of_date)}</p>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#E5E0D3]">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Transaction Type</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Item Name</th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Qty</th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Rate</th>
                                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Value</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Transaction#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {closingStockLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4 text-gray-500">Loading closing stock ledger...</td>
                                    </tr>
                                ) : closingStockRows.length > 0 ? (
                                    closingStockRows.map((row, i) => (
                                        <tr key={row.id || `${row.item_name || ''}-${i}`} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">{formatDate(row.date || row.transaction_date)}</td>
                                            <td className="border border-gray-300 px-4 py-3">{row.transaction_type || '-'}</td>
                                            <td className="border border-gray-300 px-4 py-3">{row.item_name || row.ledger_name || '-'}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-right">{row.qty != null ? Number(row.qty).toFixed(2) : '-'}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-right">{row.rate != null ? Number(row.rate).toFixed(2) : '-'}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-right">{row.value != null ? Number(row.value).toFixed(2) : '-'}</td>
                                            <td className="border border-gray-300 px-4 py-3">{row.transaction_number || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-400">No closing stock ledger entries</td>
                                    </tr>
                                )}
                            </tbody>
                            {closingStockMeta && (
                                <tfoot>
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="border border-gray-300 px-4 py-3" colSpan={3}>Totals</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">{closingStockMeta.closing_qty != null ? Number(closingStockMeta.closing_qty).toFixed(2) : '-'}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">-</td>
                                        <td className="border border-gray-300 px-4 py-3 text-right">{closingStockMeta.closing_value != null ? Number(closingStockMeta.closing_value).toFixed(2) : '-'}</td>
                                        <td className="border border-gray-300 px-4 py-3">&nbsp;</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            )}
        </div >
    );
};
