import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    FileText,
    Package,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Edit,
    Trash2,
    Download,
    Printer,
    Send,
    Copy,
    Share2,
    ShoppingCart,
    Receipt,
    DollarSign,
    Paperclip,
    CirclePlus,
    Eye,
    ClipboardList,
    X,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast as sonnerToast } from "sonner";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import axios from "axios";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

export const InvoiceDashboardDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("invoice-details");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showApprovalLog, setShowApprovalLog] = useState(false);
    const [hasInvoiceApproval, setHasInvoiceApproval] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchInvoiceDetails();
            fetchLockAccount();
        }
    }, [id, baseUrl, token]);

    const fetchLockAccount = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/get_lock_account.json`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const hasApproval = Array.isArray(response.data?.approvals) &&
                response.data.approvals.some((a) => a.approval_type === "invoice" && a.active);
            setHasInvoiceApproval(hasApproval);
        } catch (e) {
            console.error("Failed to fetch lock account", e);
        }
    };

    const updateStatus = async (status) => {
        try {
            setActionLoading(true);
            const response = await axios.patch(
                `https://${baseUrl}/lock_account_invoices/${id}.json`,
                { lock_account_invoice: { status } },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, validateStatus: () => true }
            );
            if (response.status === 422) {
                const { message, errors } = response.data;
                const msg = Array.isArray(errors) && errors.length > 0
                    ? errors.map((e) => `${e.id}: ${e.message}`).join(", ")
                    : message || "Failed to update status";
                sonnerToast.error(msg);
                return;
            }
            sonnerToast.success(`Invoice ${status.replace("_", " ")} successfully`);
            fetchInvoiceDetails();
        } catch (error) {
            sonnerToast.error("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const updateApprovalStatus = async (status) => {
        try {
            setActionLoading(true);
            await axios.post(
                `https://${baseUrl}/lock_account_invoices/${id}/update_approval_status.json`,
                { status, comment: "" },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            sonnerToast.success(`Invoice ${status.replace("_", " ")} successfully`);
            fetchInvoiceDetails();
        } catch (error) {
            sonnerToast.error("Failed to update approval status");
        } finally {
            setActionLoading(false);
        }
    };

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/lock_account_invoices/${id}.json?lock_account_id=${lock_account_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setInvoiceData(response.data);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            sonnerToast.error("Failed to fetch invoice details");
        } finally {
            setLoading(false);
        }
    };

    const selectMenuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                zIndex: 9999,
            },
        },
        disablePortal: true,
        container: document.body,
    };

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        "& .MuiInputBase-input, & .MuiSelect-select": {
            padding: { xs: "8px", sm: "10px", md: "12px" },
        },
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 border-gray-200",
            sent: "bg-blue-100 text-blue-800 border-blue-200",
            approved: "bg-green-100 text-green-800 border-green-200",
            pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-200",
            confirmed: "bg-blue-100 text-blue-800 border-blue-200",
            processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    // Helper: returns true when the invoice is fully approved (main status OR approval_status object)
    const isFullyApproved = (data) => {
        if (!data) return false;
        if (data.status === "approved") return true;
        const approvalStatus = String(data.approval_status?.status || "").toLowerCase();
        if (approvalStatus === "approved") return true;
        const levels = data.approval_status?.approval_levels;
        if (Array.isArray(levels) && levels.length > 0) {
            return levels.every((lvl) => String(lvl?.status || "").toLowerCase() === "approved");
        }
        return false;
    };

    const getApprovalStatusBadge = (status) => {
        const s = String(status || "").toLowerCase();
        if (s === "approved") return "bg-green-100 text-green-800";
        if (s === "rejected") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const handleEdit = () => {
        navigate(`/accounting/invoices/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `https://${baseUrl}/lock_account_invoices/${id}.json?lock_account_id=${lock_account_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            sonnerToast.success("Invoice deleted successfully");
            navigate("/accounting/invoices/list");
        } catch (error) {
            console.error("Error deleting invoice:", error);
            sonnerToast.error("Failed to delete invoice");
        }
        setShowDeleteDialog(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        sonnerToast.success("Downloading invoice PDF...");
    };

    const handleSendEmail = () => {
        sonnerToast.success("Email sent successfully");
    };

    const handleClone = () => {
        sonnerToast.success("Invoice cloned successfully");
        navigate("/accounting/invoices/add");
    };

    const formatCurrency = (amount) => {
        const currencySymbol = localStorage.getItem("currencySymbol") || "₹";
        return `${currencySymbol}${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd/MM/yyyy");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (!invoiceData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Invoice not found</p>
                    <Button className="mt-4" onClick={() => navigate("/accounting/invoices/list")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Invoices
                    </Button>
                </div>
            </div>
        );
    }

    const taxBreakdown = {};
    invoiceData?.item_details?.forEach((item) => {
        if (item.tax_type === "tax_group" && item.tax_group?.tax_rates) {
            item.tax_group.tax_rates.forEach((tax) => {
                const taxAmount = (item.total_amount * tax.rate) / 100;
                if (!taxBreakdown[tax.name]) {
                    taxBreakdown[tax.name] = { rate: tax.rate, amount: 0 };
                }
                taxBreakdown[tax.name].amount += taxAmount;
            });
        }
    });
    const taxRows = Object.entries(taxBreakdown);
    const mapTransactionsToJournal = (transactions = []) => {
        return transactions.map((t) => ({
            account: t.ledger_name,
            debit: t.tr_type === "dr" ? t.amount : 0,
            credit: t.tr_type === "cr" ? t.amount : 0,
        }));
    };

    const journalData = mapTransactionsToJournal(invoiceData?.transactions || []);

    const totalDebit = journalData.reduce((sum, r) => sum + r.debit, 0);
    const totalCredit = journalData.reduce((sum, r) => sum + r.credit, 0);
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/invoices/list")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <Receipt className="h-6 w-6 text-primary" />
                                Invoice #{invoiceData.invoice_number}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {formatDate(invoiceData.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(invoiceData.status)} border`}>
                            {invoiceData.status?.toUpperCase()}
                        </Badge>

                        {invoiceData?.approval_status?.approval_levels?.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowApprovalLog(true)}
                                className="gap-2"
                            >
                                <ClipboardList className="h-4 w-4" />
                                Approval Log
                            </Button>
                        )}

                        {/* ── WITHOUT APPROVAL ── */}
                        {!hasInvoiceApproval && (
                            <>
                                {/* Draft → Mark as Sent */}
                                {invoiceData.status === "draft" && (
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("sent")}
                                    >
                                        Mark as Sent
                                    </Button>
                                )}
                            </>
                        )}

                        {/* ── WITH APPROVAL ── */}
                        {hasInvoiceApproval && (
                            <>
                                {/* Draft → Submit for Approval */}
                                {invoiceData.status === "draft" && (
                                    <Button
                                        size="sm"
                                        className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("pending_approval")}
                                    >
                                        Submit for Approval
                                    </Button>
                                )}

                                {/* Pending Approval + can_approve → Approve / Reject */}
                                {invoiceData.status === "pending_approval" && invoiceData.can_approve && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 text-white hover:bg-green-700"
                                            disabled={actionLoading}
                                            onClick={() => updateApprovalStatus("approved")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-600 text-white hover:bg-red-700"
                                            disabled={actionLoading}
                                            onClick={() => updateApprovalStatus("rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {/* Approved → Mark as Sent */}
                                {isFullyApproved(invoiceData) && (
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("sent")}
                                    >
                                        Mark as Sent
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {/* <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="default" onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </Button>
                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={handleSendEmail}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                            <Button variant="outline" onClick={handleClone}>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone
                            </Button>
                            <Button variant="outline">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                        <TabsTrigger value="invoice-details">Invoice Details</TabsTrigger>
                        <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments & Comms</TabsTrigger>
                        <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
                    </TabsList>

                    {/* Invoice Details Tab */}
                    <TabsContent value="invoice-details" className="space-y-6">




                        {invoiceData?.sale_order && (
                            <Accordion type="single" collapsible 
                            // defaultValue="sales-order"
                            >
                                <AccordionItem value="sales-order" className="border rounded-lg px-4">
                                    <AccordionTrigger className="py-3 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-base">
                                                Associated Sales Orders
                                            </span>

                                            <Badge
                                                variant="secondary"
                                                className="h-5 px-2 text-xs rounded-full"
                                            >
                                                1
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="border rounded-lg overflow-hidden mt-2">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Sales Order#</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Shipment Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            {formatDate(invoiceData.sale_order.date)}
                                                        </TableCell>

                                                        <TableCell>
                                                            <button
                                                                className="text-blue-600 hover:underline font-medium"
                                                                onClick={() =>
                                                                    navigate(`/accounting/sales-order/${invoiceData.sale_order.id}`)
                                                                }
                                                            >
                                                                {invoiceData.sale_order.sale_order_number}
                                                            </button>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Badge className={getStatusColor(invoiceData.sale_order.status)}>
                                                                {invoiceData.sale_order.status?.toUpperCase()}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(invoiceData.sale_order.shipment_date)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}


                        {/* Invoice Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Invoice Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                                        <p className="text-base font-semibold mt-1">{invoiceData.invoice_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                                        <p className="text-base font-semibold mt-1">{invoiceData.order_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {formatDate(invoiceData.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {formatDate(invoiceData.due_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                                        <p className="text-base font-semibold mt-1">{invoiceData.payment_term || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Salesperson</p>
                                        <p className="text-base font-semibold mt-1">{invoiceData.sales_person_name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                        <p className="text-base font-semibold mt-1 break-all">{invoiceData.subject || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Tax Type</p>
                                        <p className="text-base font-semibold mt-1">{invoiceData.tax_type?.toUpperCase() || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge className={`${getStatusColor(invoiceData.status)} border mt-1`}>
                                            {invoiceData.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Invoice Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {invoiceData.item_details && invoiceData.item_details.length > 0 ? (
                                    <>
                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead>Item Details</TableHead>
                                                        <TableHead className="text-right">Quantity</TableHead>
                                                        <TableHead className="text-right">Rate</TableHead>
                                                        <TableHead className="text-right">Tax</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {invoiceData.item_details.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-semibold">{item.name || item.item_name || "N/A"}</p>
                                                                    {item.description && (
                                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">{item.quantity || 0}</TableCell>
                                                            <TableCell className="text-right">{formatCurrency(item.rate || 0)}</TableCell>
                                                            <TableCell className="text-right">
                                                                {item.tax_type === "tax_group"
                                                                    ? item.tax_group?.name
                                                                    : item.tax_type === "non_taxable"
                                                                        ? "Non Taxable"
                                                                        : item.tax_type === "out_of_scope"
                                                                            ? "Out of Scope"
                                                                            : item.tax_type === "non_gst_supply"
                                                                                ? "Non GST Supply"
                                                                                : "-"}
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold">{formatCurrency(item.total_amount || item.amount || 0)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pricing Summary */}
                                        <div className="mt-6 flex justify-end">
                                            <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">Sub Total</span>
                                                    <span className="font-semibold text-base">₹{invoiceData?.sub_total_amount?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">Discount ({invoiceData?.discount_per}%)</span>
                                                    <span className="font-semibold text-base text-red-600">-₹{invoiceData?.discount_amount?.toFixed(2)}</span>
                                                </div>
                                                {taxRows.map(([name, tax], index) => (
                                                    <div key={index} className="flex justify-between items-center py-2">
                                                        <span className="text-sm font-medium text-muted-foreground">{name} ({tax.rate}%)</span>
                                                        <span className="font-semibold text-base">₹{tax.amount.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">{invoiceData?.tax_type?.toUpperCase()}</span>
                                                    <span className="font-semibold text-base text-red-600">-₹{invoiceData?.lock_account_tax_amount?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">{invoiceData?.charge_name || "Adjustment"}</span>
                                                    <span className="font-semibold text-base">₹{invoiceData?.charge_amount?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                                    <span className="font-bold text-base">Total ( ₹ )</span>
                                                    <span className="font-bold text-primary text-2xl">₹{invoiceData?.total_amount?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No items found</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {invoiceData.customer_notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Customer Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-all">{invoiceData.customer_notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {invoiceData.terms_and_conditions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Terms & Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-all">{invoiceData.terms_and_conditions}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-primary" />
                                    Journal
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {journalData.length > 0 ? (
                                    <>
                                        {/* <div className="text-sm text-muted-foreground mb-3">
                                            Amount is displayed in your base currency ₹
                                        </div> */}

                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead>Account</TableHead>
                                                        <TableHead className="text-right">Debit</TableHead>
                                                        <TableHead className="text-right">Credit</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {journalData.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">
                                                                {row.account}
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                {row.debit ? formatCurrency(row.debit) : "0.00"}
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                {row.credit ? formatCurrency(row.credit) : "0.00"}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {/* TOTAL ROW */}
                                                    <TableRow className="bg-muted/30 font-semibold">
                                                        <TableCell>Total</TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(totalDebit)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(totalCredit)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No journal entries available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Customer Info Tab */}
                    <TabsContent value="customer-info" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Customer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                                    <p className="text-base font-semibold mt-1 break-all">{invoiceData.customer_name || "N/A"}</p>
                                </div>
                                {invoiceData.customer_notes && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Customer Notes</p>
                                        <p className="text-base mt-1 break-all whitespace-pre-wrap">
                                            {invoiceData.customer_notes}
                                        </p>
                                    </div>
                                )}
                                {invoiceData.terms_and_conditions && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Terms & Conditions</p>
                                        <p className="text-base mt-1 break-all whitespace-pre-wrap">
                                            {invoiceData.terms_and_conditions}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attachments & Communications Tab */}
                    <TabsContent value="attachments" className="space-y-6">
                        {/* Attachments */}
                        {invoiceData.attachments && invoiceData.attachments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5 text-primary" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {invoiceData.attachments.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{file.document_file_name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(file.document_file_size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(file.attachment_url, "_blank")}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Email Communications */}
                        {invoiceData.email_communications && invoiceData.email_communications.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        Email Communications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {invoiceData.email_communications.map((comm) => (
                                            <div
                                                key={comm.id}
                                                className="p-3 bg-muted/30 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm font-medium">{comm.person_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">{comm.person_email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Activity Logs Tab */}
                    <TabsContent value="activity-logs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Activity Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Array.isArray(invoiceData.activity_logs) && invoiceData.activity_logs.length > 0 ? (
                                    <div className="divide-y">
                                        {invoiceData.activity_logs.map((log, idx) => {
                                            const key = `${log?.date || ""}-${log?.time || ""}-${idx}`;
                                            const hint = `${log?.action || ""} ${log?.message || ""}`.toLowerCase();
                                            const isConverted = hint.includes("convert");
                                            const isCreated = hint.includes("create");
                                            const isAccepted = hint.includes("accept");
                                            const isSent = hint.includes("sent");

                                            const salesOrderId =
                                                log?.sales_order_id ||
                                                log?.sale_order_id ||
                                                log?.lock_account_sale_order_id ||
                                                invoiceData?.sales_order_id ||
                                                invoiceData?.sale_order_id ||
                                                invoiceData?.lock_account_sale_order_id;

                                            const Icon = isConverted || isCreated ? CirclePlus : (isAccepted || isSent ? Edit : FileText);
                                            const iconWrapClass =
                                                isConverted || isCreated
                                                    ? "bg-green-50 text-green-600 border-green-100"
                                                    : (isAccepted || isSent
                                                        ? "bg-sky-50 text-sky-600 border-sky-100"
                                                        : "bg-gray-50 text-gray-500 border-gray-100");

                                            return (
                                                <div key={key} className="flex gap-6 py-5">
                                                    <div className="min-w-[170px] text-sm text-muted-foreground">
                                                        <div>{log?.date || "—"} {log?.time || ""}</div>
                                                    </div>

                                                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${iconWrapClass}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-foreground">
                                                            {log?.message || "—"}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            by <span className="font-medium text-foreground">{log?.user || "—"}</span>
                                                        </div>

                                                        {isConverted && salesOrderId ? (
                                                            <button
                                                                type="button"
                                                                className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                                                onClick={() => navigate(`/accounting/sales-order/${salesOrderId}`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View the sales order
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No activity logs found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Invoice</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this invoice? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approval Log Modal */}
            <Dialog open={showApprovalLog} onOpenChange={setShowApprovalLog}>
                <DialogContent className="max-w-4xl">
                    <div className="flex items-center justify-between">
                        <DialogHeader>
                            <DialogTitle className="text-[#C72030]">Approval Log</DialogTitle>
                        </DialogHeader>
                        <button
                            type="button"
                            onClick={() => setShowApprovalLog(false)}
                            className="p-2 rounded hover:bg-muted"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#7a0c0c] hover:bg-[#7a0c0c] [&>th]:!text-white [&>th]:!opacity-100">
                                    <TableHead className="!text-white !opacity-100 font-semibold w-[70px]">Sr.No.</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Approval Level</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Approved By</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Date</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Status</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Remark</TableHead>
                                    <TableHead className="!text-white !opacity-100 font-semibold">Users</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(invoiceData?.approval_status?.approval_levels || []).map((lvl, index) => (
                                    <TableRow key={lvl?.id ?? index}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{lvl?.name || "—"}</TableCell>
                                        <TableCell className="font-medium">{lvl?.approved_by || "—"}</TableCell>
                                        <TableCell className="font-medium">{lvl?.approved_at || "—"}</TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded text-xs font-semibold ${getApprovalStatusBadge(lvl?.status)}`}>
                                                {String(lvl?.status || "pending").toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {lvl?.rejection_reason || "—"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {lvl?.approved_by || "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InvoiceDashboardDetailsPage;
