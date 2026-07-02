import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpeningBalanceRow {
    id: number;
    bill_no: string;
    date: string;
    due_date: string | null;
    amount: number;
}

interface VendorOrCustomer {
    id: number;
    name: string;
    company_name: string;
    email: string;
    mobile: string;
    opening_balance_details: OpeningBalanceRow[];
}

interface LedgerDetail {
    id: number;
    name: string;
    vendors: VendorOrCustomer[];
    customers: VendorOrCustomer[];
}

const OpeningBalanceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const lock_account_id = localStorage.getItem("lock_account_id");

    const [ledger, setLedger] = useState<LedgerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            try {
                const url = `${baseUrl}/lock_accounts/${lock_account_id}/lock_account_ledgers/${id}.json`;
                const res = await axios.get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                setLedger(res.data);
            } catch (err) {
                console.error("Error fetching ledger detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, lock_account_id]);

    if (loading) {
        return (
            <div className="p-6 bg-white flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]" />
            </div>
        );
    }

    if (!ledger) {
        return (
            <div className="p-6 text-gray-500">Failed to load ledger details.</div>
        );
    }

    const isVendor = Array.isArray(ledger.vendors) && ledger.vendors.length > 0;
    const isCustomer = Array.isArray(ledger.customers) && ledger.customers.length > 0;
    const entityType = isVendor ? "Vendor" : "Customer";
    const entities: VendorOrCustomer[] = isVendor ? ledger.vendors : isCustomer ? ledger.customers : [];

    // Flatten rows: one row per opening_balance_details entry (or one empty row if none)
    const rows: { entity: VendorOrCustomer; detail: OpeningBalanceRow | null }[] = [];
    entities.forEach((entity) => {
        if (entity.opening_balance_details && entity.opening_balance_details.length > 0) {
            entity.opening_balance_details.forEach((detail) => {
                rows.push({ entity, detail });
            });
        } else {
            rows.push({ entity, detail: null });
        }
    });

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                        {ledger.name} — Opening Balance Details
                    </h2>
                </div>

                {rows.length === 0 ? (
                    <div className="text-gray-500 py-8 text-center">
                        No opening balance details found for this account.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 rounded-lg bg-white">
                            <thead>
                                <tr className="bg-[#E5E0D3]">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{entityType} Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Company</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Bill No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Due Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Amount (INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                                            {row.entity.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                            {row.entity.company_name || "—"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                            {row.detail?.bill_no || "—"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                            {row.detail?.date ? row.detail.date.split("-").reverse().join("-") : "—"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                            {row.detail?.due_date ? row.detail.due_date.split("-").reverse().join("-") : "—"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-sm text-right font-medium">
                                            {row.detail?.amount != null
                                                ? Number(row.detail.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-[#E5E0D3] font-semibold">
                                    <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">Total</td>
                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        {rows
                                            .reduce((sum, r) => sum + (r.detail?.amount ?? 0), 0)
                                            .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpeningBalanceDetail;
