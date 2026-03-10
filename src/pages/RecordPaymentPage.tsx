import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    X,
    ChevronDown,
    Check,
    Calendar as CalendarIcon,
    Upload,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Customer {
    id: number;
    salutation: string;
    first_name: string;
    last_name: string;
    company_name: string;
    email: string;
    mobile: string;
    pan: string;
}

interface Ledger {
    id: number;
    name: string;
}

interface UnpaidInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    total: number;
    balance_due: number;
    // optional field that might be provided by the API later
    payment_received_on?: string;
}

interface InvoicePaymentRow extends UnpaidInvoice {
    paymentReceivedOn: string;
    withholdingTax: string;
    payment: string;
}

const PAYMENT_MODES = [
    "Bank Remittance",
    "Bank Transfer",
    "Cash",
    "Cheque",
    "Credit Card",
    "UPI",
];

export const RecordPaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [customerOpen, setCustomerOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [date, setDate] = useState<Date | null>(new Date());

    const [amountReceived, setAmountReceived] = useState("");
    const [bankCharges, setBankCharges] = useState("");
    const [paymentNumber, setPaymentNumber] = useState("7");
    const [paymentMode, setPaymentMode] = useState("");
    const [depositTo, setDepositTo] = useState("");
    const [reference, setReference] = useState("");
    const [taxDeducted, setTaxDeducted] = useState(false);
    const [tdsAccount, setTdsAccount] = useState("Advance Tax");
    const [notes, setNotes] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    const [receivedFullAmount, setReceivedFullAmount] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [ledgers, setLedgers] = useState<Ledger[]>([]);
    const [invoiceRows, setInvoiceRows] = useState<InvoicePaymentRow[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [invoiceError, setInvoiceError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // Fetch customers on mount
    useEffect(() => {
        axios
            .get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=1`, {
                headers: authHeaders,
            })
            .then((res) => {
                const data: Customer[] = res.data?.data || res.data || [];
                setCustomers(data);
            })
            .catch(() => setCustomers([]));
    }, []);

    // Fetch ledgers on mount
    useEffect(() => {
        axios
            .get(`https://${baseUrl}/lock_accounts/1/lock_account_ledgers.json`, {
                headers: authHeaders,
            })
            .then((res) => {
                const data: Ledger[] = res.data?.data || res.data || [];
                setLedgers(data);
            })
            .catch(() => setLedgers([]));
    }, []);

    // Fetch unpaid invoices when "Received full amount" is checked
    useEffect(() => {
        if (!receivedFullAmount || !selectedCustomerId) {
            if (!receivedFullAmount) {
                setInvoiceRows([]);
            }
            return;
        }

        // sanity checks before issuing request
        if (!baseUrl || !token) {
            setInvoiceError("Missing base URL or auth token");
            return;
        }

        setInvoiceError(null);
        setInvoicesLoading(true);
        axios
            .get(`https://${baseUrl}/lock_account_invoices.json`, {
                params: {
                    lock_account_id: 1,
                    "q[lock_account_customer_id_eq]": selectedCustomerId,
                    // "q[sent_eq]": 1,
                    "q[status_not_eq]": "paid",
                },
                headers: authHeaders,
                timeout: 10000, // 10 seconds, avoid hanging indefinitely
            })
            .then((res) => {
                const data: UnpaidInvoice[] = res.data?.data || res.data || [];
                const today = format(new Date(), "dd/MM/yyyy");
                const rows = data.map((inv) => ({
                    ...inv,
                    // prefer an existing saved date if API returns it
                    paymentReceivedOn: inv.payment_received_on || today,
                    payment: inv.balance_due?.toString() ?? "",
                }));
                setInvoiceRows(rows);
                const total = rows.reduce((s, r) => s + (parseFloat(r.payment) || 0), 0);
                setAmountReceived(total.toFixed(2));
            })
            .catch((err) => {
                console.error("Invoice fetch error", err);
                setInvoiceError("Failed to load invoices. Please try again later.");
                setInvoiceRows([]);
            })
            .finally(() => setInvoicesLoading(false));
    }, [receivedFullAmount, selectedCustomerId]);

    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) ?? null;

    const getCustomerDisplayName = (c: Customer) =>
        [c.salutation, c.first_name, c.last_name].filter(Boolean).join(" ") || c.company_name || c.email;

    const totalPayment = invoiceRows.reduce(
        (sum, r) => sum + (parseFloat(r.payment) || 0),
        0
    );

    // if we're in "received full amount" mode, keep the amountReceived synced with invoice payments
    useEffect(() => {
        if (receivedFullAmount) {
            setAmountReceived(totalPayment.toFixed(2));
        }
    }, [invoiceRows, receivedFullAmount, totalPayment]);

    const handlePayInFull = (id: number) => {
        setInvoiceRows((rows) =>
            rows.map((r) =>
                r.id === id ? { ...r, payment: r.balance_due?.toString() ?? "" } : r
            )
        );
    };

    const handleInvoiceRowChange = (id: number, field: keyof InvoicePaymentRow, value: string) => {
        setInvoiceRows((rows) =>
            rows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
    };

    const handleSubmit = async (status: "draft" | "paid") => {
        if (!selectedCustomerId) return;
        setSubmitting(true);
        try {
            const excessAmount = Math.max(0, (parseFloat(amountReceived) || 0) - totalPayment);
            const payload: any = {
                lock_payment: {
                    payment_of: "LockAccountCustomer",
                    payment_of_id: selectedCustomerId,
                    payment_made: false,
                    paid_amount: parseFloat(amountReceived) || 0,
                    bank_charges: parseFloat(bankCharges) || 0,
                    payment_date: date ? format(date, "dd/MM/yyyy") : "",
                    payment_mode: paymentMode,
                    order_number: reference,
                    deposit_to_ledger_id: depositTo ? parseInt(depositTo) : null,
                    tax_deducted: taxDeducted,
                    tds_lock_account_ledger_id: taxDeducted && tdsAccount ? tdsAccount : null,
                    notes,
                    payment_amount: totalPayment,
                    excess_amount: excessAmount,
                    status,
                    lock_bill_payments_attributes: invoiceRows
                        .filter((r) => parseFloat(r.payment) > 0)
                        .map((r) => ({
                            resource_id: r.id,
                            resource_type: "LockAccountInvoice",
                            amount: parseFloat(r.payment) || 0,
                            payment_date: r.paymentReceivedOn,
                        })),
                    attachments_attributes: [],
                },
            };
            // include attachments if user selected any
            if (attachments.length > 0) {
                payload.lock_payment.attachments_attributes = attachments.map((f) => ({
                    filename: f.name,
                    // TODO: convert `f` to required upload format
                }));
            }

            await axios.post(
                `https://${baseUrl}/lock_payments.json?lock_account_id=1`,
                payload,
                { headers: { ...authHeaders, "Content-Type": "application/json" } }
            );
            navigate(-1);
        } catch (err) {
            console.error("Failed to save payment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full">
                {/* Header - customer select on light gray */}
                <div className="bg-[#f9f9fa] border-b border-gray-200 px-6 pb-6 pt-6 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-6 top-6 z-10 hover:bg-gray-200 rounded-full h-8 w-8 text-gray-500"
                        onClick={() => navigate(-1)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="flex justify-start items-end border-b border-gray-200 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 px-0 py-2">Record Payment</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-red-500 font-medium text-sm">Customer Name*</Label>
                            <div className="col-span-8 relative flex items-center gap-4">
                                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={customerOpen}
                                            className={cn(
                                                "w-full justify-between text-left font-normal border-gray-300 text-gray-700 h-9 bg-white hover:bg-white focus:ring-0 focus:border-blue-500 rounded-[4px]",
                                                !selectedCustomerId && "border-red-300 text-gray-400"
                                            )}
                                        >
                                            {selectedCustomer
                                                ? getCustomerDisplayName(selectedCustomer)
                                                : "Select Customer"}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search" />
                                            <CommandList>
                                                <CommandEmpty>No customer found.</CommandEmpty>
                                                <CommandGroup>
                                                    {customers.map((c) => {
                                                        const displayName = getCustomerDisplayName(c);
                                                        return (
                                                            <CommandItem
                                                                key={c.id}
                                                                value={displayName}
                                                                onSelect={() => {
                                                                    setSelectedCustomerId(c.id);
                                                                    setCustomerOpen(false);
                                                                }}
                                                                className="flex items-center gap-3 p-2 cursor-pointer aria-selected:bg-blue-50"
                                                            >
                                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                                                                    {displayName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-blue-600 text-sm">{displayName}</span>
                                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                                        <span>{c.email}</span>
                                                                    </div>
                                                                </div>
                                                                {selectedCustomerId === c.id && (
                                                                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                                                                )}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {selectedCustomer && (
                                    <Button className="bg-[#404b69] hover:bg-[#353f5a] text-white text-xs h-9 px-4 flex items-center gap-2 rounded-md shrink-0">
                                        <span>{getCustomerDisplayName(selectedCustomer)}'s Details</span>
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            <div className="col-span-2 text-sm text-gray-500">
                                PAN:{" "}
                                {selectedCustomer?.pan ? (
                                    <span className="text-gray-700">{selectedCustomer.pan}</span>
                                ) : (
                                    <span className="text-blue-500 cursor-pointer">Add PAN</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main white content area */}
                <div className="px-6 py-6 bg-white">
                    <div className={cn("space-y-6 transition-all duration-300", !selectedCustomerId && "opacity-50 blur-[2px] pointer-events-none select-none grayscale-[0.3]")}>
                        {/* Amount Received */}
                        <div className="grid grid-cols-12 gap-8 items-start">
                            <Label className="col-span-2 text-red-500 font-medium text-sm pt-2">Amount Received*</Label>
                            <div className="col-span-5">
                                <div className="flex items-center gap-0">
                                    <div className="px-3 border border-r-0 rounded-l-md h-9 flex items-center justify-center bg-[#f9f9fa] text-gray-500 text-sm border-gray-200 min-w-[50px]">INR</div>
                                    <Input
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        className="flex-1 border-gray-200 bg-white rounded-l-none h-9 text-sm focus:border-blue-400"
                                    />
                                </div>
                                <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={receivedFullAmount}
                                        onChange={(e) => {
                                            setReceivedFullAmount(e.target.checked);
                                            if (!e.target.checked) {
                                                setAmountReceived("");
                                                setInvoiceRows([]);
                                            }
                                        }}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-xs text-gray-600">
                                        Received full amount
                                        {invoiceRows.length > 0 && (
                                            <span className="text-gray-500"> (₹{totalPayment.toFixed(2)})</span>
                                        )}
                                    </span>
                                </label>
                            </div>

                            <div className="col-span-2 text-sm text-gray-500 pt-2">Bank Charges (if any)</div>
                            <div className="col-span-3 pt-0">
                                <Input value={bankCharges} onChange={(e) => setBankCharges(e.target.value)} className="h-9 text-sm" />
                            </div>
                        </div>

                        {/* Payment Date & Payment # */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-red-500 font-medium text-sm">Payment Date*</Label>
                            <div className="col-span-5">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-gray-200 bg-white h-9 text-sm", !date && "text-muted-foreground")}>
                                            {date ? format(date, "dd/MM/yyyy") : "dd/MM/yyyy"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* <Label className="col-span-2 text-red-500 font-medium text-sm">Payment #*</Label>
                            <div className="col-span-3">
                                <Input value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)} className="h-9 text-sm pr-8" />
                            </div> */}
                        </div>

                        {/* Payment Mode & Deposit To & Reference */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Payment Mode</Label>
                            <div className="col-span-3">
                                <Select value={paymentMode} onValueChange={setPaymentMode}>
                                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_MODES.map((mode) => (
                                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Label className="col-span-2 text-red-500 font-medium text-sm">Deposit To*</Label>
                            <div className="col-span-3">
                                <Select value={depositTo} onValueChange={setDepositTo}>
                                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ledgers.map((l) => (
                                            <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Reference#</Label>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <Input value={reference} onChange={(e) => setReference(e.target.value)} className="h-9 text-sm" />
                            </div>
                        </div>

                        {/* Tax Deducted? */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Tax deducted?</Label>
                            <div className="col-span-10 flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="tax" checked={!taxDeducted} onChange={() => setTaxDeducted(false)} />
                                    <span className="ml-1">No Tax deducted</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="tax" checked={taxDeducted} onChange={() => setTaxDeducted(true)} />
                                    <span className="ml-1">Yes, TDS (Income Tax)</span>
                                </label>
                            </div>
                        </div>

                        {/* TDS Tax Account (conditional) */}
                        {taxDeducted && (
                            <div className="grid grid-cols-12 gap-8 items-center">
                                <Label className="col-span-2 text-red-500 font-medium text-sm">TDS Tax Account*</Label>
                                <div className="col-span-5 relative">
                                    <Select value={tdsAccount} onValueChange={setTdsAccount}>
                                        <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Advance Tax">Advance Tax</SelectItem>
                                            <SelectItem value="Employee Advance">Employee Advance</SelectItem>
                                            <SelectItem value="Prepaid Expenses">Prepaid Expenses</SelectItem>
                                            <SelectItem value="TDS Receivable">TDS Receivable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Unpaid Invoices */}
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Unpaid Invoices</h4>
                                <div
                                    className="text-sm text-blue-500 cursor-pointer"
                                    onClick={() =>
                                        setInvoiceRows((rows) =>
                                            rows.map((r) => ({ ...r, payment: "" }))
                                        )
                                    }
                                >
                                    Clear Applied Amount
                                </div>
                            </div>

                            {invoicesLoading ? (
                                <div className="py-6 text-center text-sm text-gray-500">Loading invoices…</div>
                            ) : invoiceError ? (
                                <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center text-red-600 text-sm">
                                    {invoiceError}
                                </div>
                            ) : invoiceRows.length === 0 ? (
                                <div className="bg-white border border-gray-100 rounded-sm p-6 text-center text-gray-500">
                                    There are no unpaid invoices associated with this customer.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">Date</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">Invoice Number</th>
                                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">Invoice Amount</th>
                                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">Amount Due</th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">
                                                    Payment Received On
                                                </th>
                                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2 pr-4">Withholding Tax</th>
                                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceRows.map((row) => (
                                                <tr key={row.id} className="border-b border-gray-100">
                                                    <td className="py-3 pr-4 align-top">
                                                        <div className="text-gray-800">
                                                            {row.invoice_date ? format(new Date(row.invoice_date), "dd/MM/yyyy") : "—"}
                                                        </div>
                                                        {row.due_date && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                Due Date:<br />
                                                                {format(new Date(row.due_date), "dd/MM/yyyy")}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 pr-4 align-top text-blue-600">{row.invoice_number}</td>
                                                    <td className="py-3 pr-4 align-top text-right">{row.total?.toFixed(2)}</td>
                                                    <td className="py-3 pr-4 align-top text-right text-blue-600">{row.balance_due?.toFixed(2)}</td>
                                                    <td className="py-3 pr-4 align-top">
                                                        <Input
                                                            value={row.paymentReceivedOn}
                                                            onChange={(e) =>
                                                                handleInvoiceRowChange(row.id, "paymentReceivedOn", e.target.value)
                                                            }
                                                            className="h-8 text-sm w-32"
                                                        />
                                                    </td>
                                                    <td className="py-3 pr-4 align-top">
                                                        <Input
                                                            value={row.withholdingTax}
                                                            onChange={(e) =>
                                                                handleInvoiceRowChange(row.id, "withholdingTax", e.target.value)
                                                            }
                                                            className="h-8 text-sm w-32"
                                                        />
                                                    </td>
                                                    <td className="py-3 align-top text-right">
                                                        <Input
                                                            value={row.payment}
                                                            onChange={(e) =>
                                                                handleInvoiceRowChange(row.id, "payment", e.target.value)
                                                            }
                                                            className="h-8 text-sm w-28 text-right ml-auto"
                                                        />
                                                        <div
                                                            className="text-xs text-blue-500 cursor-pointer mt-1 text-right"
                                                            onClick={() => handlePayInFull(row.id)}
                                                        >
                                                            Pay in Full
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4} className="pt-3 text-xs text-gray-500 italic">
                                                    **List contains only SENT invoices
                                                </td>
                                                <td className="pt-3 text-right font-medium text-gray-700">Total</td>
                                                <td></td>
                                                <td className="pt-3 text-right font-medium text-gray-700">{totalPayment.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Bottom area with notes, attachments, summary and actions */}
                        <div className="grid grid-cols-12 gap-6 items-start">
                            <div className="col-span-12 lg:col-span-8">
                                <div className="mb-4">
                                    <Label className="text-sm font-medium">Notes (Internal use. Not visible to customer)</Label>
                                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 h-24" />
                                </div>

                                <div className="mb-4">
                                    <Label className="text-sm font-medium">Attachments</Label>
                                    <div className="mt-2 flex items-center gap-3">
                                        <label className="h-9 flex items-center gap-2 cursor-pointer">
                                            <Upload className="h-4 w-4" />
                                            <span>Upload File</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        setAttachments(Array.from(e.target.files));
                                                    }
                                                }}
                                            />
                                        </label>
                                        <div className="text-sm text-gray-500">You can upload a maximum of 5 files, 5MB each</div>
                                    </div>
                                    {attachments.length > 0 && (
                                        <ul className="mt-2 text-sm list-disc list-inside">
                                            {attachments.map((f, idx) => (
                                                <li key={idx}>{f.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" defaultChecked />
                                        <span className="text-sm">Send a "Thank you" note for this payment</span>
                                    </label>

                                    {selectedCustomer && (
                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center gap-2">
                                                <input type="checkbox" defaultChecked />
                                                <span>
                                                    {getCustomerDisplayName(selectedCustomer)} &lt;{selectedCustomer.email}&gt;
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="px-4"
                                        disabled={submitting}
                                        onClick={() => handleSubmit("draft")}
                                    >
                                        {submitting ? "Saving…" : "Save as Draft"}
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                        disabled={submitting}
                                        onClick={() => handleSubmit("paid")}
                                    >
                                        {submitting ? "Saving…" : "Save as Paid"}
                                    </Button>
                                    <Button variant="ghost" className="px-4" onClick={() => navigate(-1)}>Cancel</Button>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4">
                                <div className="bg-[#fafafa] border border-gray-100 rounded-md p-6">
                                    <div className="text-sm text-gray-600 mb-3">Total</div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount Received :</div>
                                        <div className="text-sm font-medium">{amountReceived || "0.00"}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount used for Payments :</div>
                                        <div className="text-sm font-medium">{totalPayment.toFixed(2)}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount Refunded :</div>
                                        <div className="text-sm font-medium">0.00</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 border-t pt-3">
                                        <div className="text-sm text-red-500 flex items-center gap-1">
                                            ⚠ Amount in Excess:
                                        </div>
                                        <div className="text-sm font-medium">
                                            ₹ {Math.max(0, (parseFloat(amountReceived) || 0) - totalPayment).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordPaymentPage;
