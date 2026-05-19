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
// Types
interface SalesOrderItem {
    id: number;
    name: string;
    description: string;
    quantity: number;
    rate: number;
    discount: number;
    discountType: string;
    tax: string;
    taxRate: number;
    amount: number;
}

interface SalesOrderAttachment {
    name: string;
    size: number;
}

// interface SalesOrder {
//     id: string;
//     customer: {
//         name: string;
//         email: string;
//         phone: string;
//         billingAddress: string;
//         shippingAddress: string;
//     };
//     orderDetails: {
//         orderNumber: string;
//         referenceNumber: string;
//         orderDate: string;
//         expectedShipmentDate: string;
//         paymentTerms: string;
//         deliveryMethod: string;
//         salesperson: string;
//         status: string;
//     };
//     items: SalesOrderItem[];
//     pricing: {
//         subTotal: number;
//         discount: number;
//         taxAmount: number;
//         adjustment: number;
//         total: number;
//     };
//     customerNotes: string;
//     termsAndConditions: string;
//     attachments: SalesOrderAttachment[];
//     createdAt: string;
//     updatedAt: string;
// }

interface SalesOrder {
    id: number;
    sale_order_number: string;
    reference_number: string;
    date: string;
    shipment_date: string;
    delivery_method: string;
    sales_person_name: string;
    customer_name: string;
    total_amount: number;
    discount_per: number | null;
    discount_amount: number | null;
    charge_amount: number;
    charge_type: string;
    tax_type: string;
    status: string;
    customer_notes: string;
    terms_and_conditions: string;
    subject?: string;
    payment_term?: string;
    created_at: string;
    updated_at: string;
    sub_total_amount: number;
    lock_account_tax_amount: number;
    charge_name: string;
    item_details: {
        id: number;
        item_name: string;
        description: string;
        quantity: number;
        rate: number;
        total_amount: number;
        item_unit: string;
        tax_type: string;
        tax_group: { name: string; tax_rates: { name: string; rate: number }[] } | null;
    }[];
    attachments: any[];
}

// Mock sales order data
const mockSalesOrder = {
    id: "SO-00001",
    customer: {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+91 98765 43210",
        billingAddress: "123 Business Park, Sector 15, Noida, UP 201301",
        shippingAddress: "123 Business Park, Sector 15, Noida, UP 201301",
    },
    orderDetails: {
        orderNumber: "SO-00001",
        referenceNumber: "REF-2024-001",
        orderDate: "2024-01-15",
        expectedShipmentDate: "2024-01-20",
        paymentTerms: "Net 30",
        deliveryMethod: "Standard Shipping",
        salesperson: "John Doe",
        status: "confirmed",
    },
    items: [
        {
            id: 1,
            name: "Product A",
            description: "High quality product",
            quantity: 10,
            rate: 500,
            discount: 10,
            discountType: "percentage",
            tax: "GST 18%",
            taxRate: 18,
            amount: 5310,
        },
        {
            id: 2,
            name: "Product B",
            description: "Premium quality",
            quantity: 5,
            rate: 1000,
            discount: 500,
            discountType: "amount",
            tax: "GST 18%",
            taxRate: 18,
            amount: 5310,
        },
    ],
    pricing: {
        subTotal: 9500,
        discount: 450,
        taxAmount: 1629,
        adjustment: 0,
        total: 10679,
    },
    customerNotes: "Please ensure timely delivery",
    termsAndConditions: "Payment due within 30 days",
    attachments: [
        { name: "Purchase Order.pdf", size: 245000 },
        { name: "Specifications.pdf", size: 128000 },
    ],
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T14:45:00",
};

export const SalesOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [salesOrder, setSalesOrder] = useState<SalesOrder>(mockSalesOrder);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("order-details");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showApprovalLog, setShowApprovalLog] = useState(false);
    const [hasSaleOrderApproval, setHasSaleOrderApproval] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showConvertMenu, setShowConvertMenu] = useState(false);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const fetchSalesOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://${baseUrl}/sale_orders/${id}.json`, {
                headers: { Authorization: token ? `Bearer ${token}` : undefined },
            });
            setSalesOrder(response.data);
        } catch (error) {
            sonnerToast.error("Failed to fetch sales order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchSalesOrder();
    }, [id]);

    useEffect(() => {
        const fetchLockAccount = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/get_lock_account.json`, {
                    headers: { Authorization: token ? `Bearer ${token}` : undefined },
                });
                const hasApproval = Array.isArray(response.data?.approvals) &&
                    response.data.approvals.some((a: any) => a.approval_type === "sale_order" && a.active);
                setHasSaleOrderApproval(hasApproval);
            } catch (e) {
                console.error("Failed to fetch lock account", e);
            }
        };
        if (baseUrl && token) fetchLockAccount();
    }, []);

    // Close convert dropdown on outside click
    useEffect(() => {
        const handler = () => setShowConvertMenu(false);
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const updateStatus = async (status: string) => {
        try {
            setActionLoading(true);
            const response = await axios.patch(
                `https://${baseUrl}/sale_orders/${id}.json`,
                { sale_order: { status } },
                { headers: { Authorization: token ? `Bearer ${token}` : undefined }, validateStatus: () => true }
            );
            if (response.status === 422) {
                const { message, errors } = response.data;
                const msg = Array.isArray(errors) && errors.length > 0
                    ? errors.map((e: any) => `${e.id}: ${e.message}`).join(", ")
                    : message || "Failed to update status";
                sonnerToast.error(msg);
                return;
            }
            sonnerToast.success(`Sales order ${status.replace("_", " ")} successfully`);
            fetchSalesOrder();
        } catch (error) {
            sonnerToast.error("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const updateApprovalStatus = async (status: string) => {
        try {
            setActionLoading(true);
            await axios.post(
                `https://${baseUrl}/sale_orders/${id}/update_approval_status.json`,
                { status, comment: "" },
                { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
            );
            sonnerToast.success(`Sales order ${status.replace("_", " ")} successfully`);
            fetchSalesOrder();
        } catch (error) {
            sonnerToast.error("Failed to update approval status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading sales order...</p>
                </div>
            </div>
        );
    }

    if (!salesOrder) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-muted-foreground">Sales order not found.</div>
            </div>
        );
    }

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

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            draft: "bg-gray-100 text-gray-800 border-gray-200",
            confirmed: "bg-blue-100 text-blue-800 border-blue-200",
            processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            pending_approval: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || colors.draft;
    };

    const getApprovalStatusBadge = (status: any) => {
        const s = String(status || "").toLowerCase();
        if (s === "approved") return "bg-green-100 text-green-800";
        if (s === "rejected") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const handleEdit = () => {
        navigate(`/accounting/sales-order/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            // API call to delete sales order
            sonnerToast.success("Sales order deleted successfully");
            navigate("/accounting/sales-order");
        } catch (error) {
            sonnerToast.error("Failed to delete sales order");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        sonnerToast.success("Downloading sales order PDF...");
    };

    const handleSendEmail = () => {
        sonnerToast.success("Email sent successfully");
    };

    const handleClone = () => {
        sonnerToast.success("Sales order cloned successfully");
        navigate("/accounting/sales-order/create");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading sales order...</p>
                </div>
            </div>
        );
    }

    const taxBreakdown: Record<string, { rate: number; amount: number }> = {};
    salesOrder?.item_details?.forEach((item) => {
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
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd/MM/yyyy");
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/sales-order")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <ShoppingCart className="h-6 w-6 text-primary" />
                                Sales Order #{salesOrder?.sale_order_number}
                                {/* Created on {new Date(salesOrder.created_at).toLocaleDateString()} */}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {salesOrder?.created_at ? format(new Date(salesOrder.created_at), 'dd/MM/yyyy') : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(salesOrder.status)} border`}>
                            {salesOrder.status?.replace(/_/g, " ").toUpperCase()}
                        </Badge>

                        {(salesOrder as any)?.approval_status?.approval_levels?.length > 0 && (
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
                        {!hasSaleOrderApproval && (
                            <>
                                {/* Draft → Mark as Confirmed */}
                                {salesOrder.status === "draft" && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("confirmed")}
                                    >
                                        Mark as Confirmed
                                    </Button>
                                )}

                                {/* Confirmed → Convert to Invoice */}
                                {salesOrder.status === "confirmed" && (
                                    <Button
                                        size="sm"
                                        className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                        disabled={actionLoading}
                                        onClick={() => navigate("/accounting/invoices/add", { state: { saleOrderId: salesOrder?.id || id } })}
                                    >
                                        Convert to Invoice
                                    </Button>
                                )}
                            </>
                        )}

                        {/* ── WITH APPROVAL ── */}
                        {hasSaleOrderApproval && (
                            <>
                                {/* Draft → Submit for Approval */}
                                {salesOrder.status === "draft" && (
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
                                {salesOrder.status === "pending_approval" && (salesOrder as any).can_approve && (
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

                                {/* Approved → Mark as Confirmed */}
                                {salesOrder.status === "approved" && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("confirmed")}
                                    >
                                        Mark as Confirmed
                                    </Button>
                                )}

                                {/* Confirmed → Convert to Invoice */}
                                {salesOrder.status === "confirmed" && (
                                    <Button
                                        size="sm"
                                        className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                        disabled={actionLoading}
                                        onClick={() => navigate("/accounting/invoices/add", { state: { saleOrderId: salesOrder?.id || id } })}
                                    >
                                        Convert to Invoice
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
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="order-details">Order Details</TabsTrigger>
                        <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    {/* Order Details Tab */}
                    <TabsContent value="order-details" className="space-y-6">

                        {salesOrder?.invoices && (
                            <Accordion type="single" collapsible
                            // defaultValue="sales-order"
                            >
                                <AccordionItem value="sales-order" className="border rounded-lg px-4">
                                    <AccordionTrigger className="py-3 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-base">
                                                Invoices
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
                                                        <TableHead>Invoice#</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Due Date</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                        <TableHead className="text-right">Balance Due</TableHead>
                                                        <TableHead className="text-center w-[60px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>                                                                    <TableBody>
                                                    {salesOrder.invoices.map((inv, index) => (
                                                        <TableRow key={inv.id || index} className="hover:bg-muted/40">

                                                            {/* Date */}
                                                            <TableCell>{formatDate(inv.date)}</TableCell>

                                                            {/* Invoice Number */}
                                                            <TableCell>
                                                                <button
                                                                    className="text-blue-600 hover:underline font-medium"
                                                                    onClick={() => navigate(`/accounting/invoices/${inv.id}`)}
                                                                >
                                                                    {inv.invoice_number}
                                                                </button>
                                                            </TableCell>

                                                            {/* Status */}
                                                            <TableCell>
                                                                <span
                                                                    className={`text-xs font-semibold ${inv.status === "overdue"
                                                                            ? "text-red-600"
                                                                            : inv.status === "paid"
                                                                                ? "text-green-600"
                                                                                : "text-orange-500"
                                                                        }`}
                                                                >
                                                                    {inv.status?.toUpperCase()}
                                                                </span>
                                                            </TableCell>

                                                            {/* Due Date */}
                                                            <TableCell>{formatDate(inv.due_date)}</TableCell>

                                                            {/* Amount */}
                                                            <TableCell className="text-right font-medium">
                                                                ₹{inv.total_amount?.toFixed(2)}
                                                            </TableCell>

                                                            {/* Balance Due */}
                                                            <TableCell className="text-right font-medium">
                                                                ₹{inv.balance_due?.toFixed(2)}
                                                            </TableCell>

                                                            {/* Actions (3-dot menu like Zoho) */}
                                                            {/* <TableCell className="text-center">
                                                                <button className="p-2 rounded hover:bg-muted">
                                                                    ⋮
                                                                </button>
                                                            </TableCell> */}

                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}

                        {/* Order Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Order Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder?.sale_order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                                        <p className="text-base font-semibold mt-1 break-all">{salesOrder?.reference_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {salesOrder?.date ? format(new Date(salesOrder.date), 'dd/MM/yyyy') : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Expected Shipment Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {salesOrder?.shipment_date ? format(new Date(salesOrder.shipment_date), 'dd/MM/yyyy') : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                                        <p className="text-base font-semibold mt-1 break-all">{salesOrder?.payment_term || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                        <p className="text-base font-semibold mt-1 break-all">{salesOrder?.subject || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Delivery Method</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder?.delivery_method}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Salesperson</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder?.sales_person_name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                                            {salesOrder?.item_details?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-semibold">{item.item_name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {item.quantity} {item.item_unit}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ₹{Number(item.rate).toFixed(2)}
                                                    </TableCell>
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
                                                    <TableCell className="text-right font-semibold">
                                                        ₹{Number(item.total_amount).toFixed(2)}
                                                    </TableCell>
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
                                            <span className="font-semibold text-base">₹{salesOrder?.sub_total_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Discount ({salesOrder?.discount_per}%)</span>
                                            <span className="font-semibold text-base text-red-600">-₹{salesOrder?.discount_amount?.toFixed(2)}</span>
                                        </div>
                                        {taxRows.map(([name, tax], index) => (
                                            <div key={index} className="flex justify-between items-center py-2">
                                                <span className="text-sm font-medium text-muted-foreground">{name} ({tax.rate}%)</span>
                                                <span className="font-semibold text-base">₹{tax.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">{salesOrder?.tax_type?.toUpperCase()}</span>
                                            <span className="font-semibold text-base text-red-600">-₹{salesOrder?.lock_account_tax_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">{salesOrder?.charge_name || "Adjustment"}</span>
                                            <span className="font-semibold text-base">₹{salesOrder?.charge_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                            <span className="font-bold text-base">Total ( ₹ )</span>
                                            <span className="font-bold text-primary text-2xl">₹{salesOrder?.total_amount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {salesOrder.customer_notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Customer Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground break-all whitespace-pre-wrap">{salesOrder.customer_notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {salesOrder.terms_and_conditions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Terms & Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground break-all whitespace-pre-wrap">{salesOrder.terms_and_conditions}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Attachments */}
                        {salesOrder.attachments && salesOrder.attachments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Attachments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {salesOrder.attachments.map((file: SalesOrderAttachment, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{file?.document_file_name}</p>
                                                        <p className="text-xs text-muted-foreground">{(file?.document_file_size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
                                    <p className="text-base font-semibold mt-1 break-all">{salesOrder?.customer_name}</p>
                                </div>
                                <div>
                                    {/* <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </p> */}
                                    {/* <p className="text-base mt-1">{salesOrder.customer.email}</p> */}
                                </div>
                                <div>
                                    {/* <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </p> */}
                                    {/* <p className="text-base mt-1">{salesOrder.customer.phone}</p> */}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        {/* <Phone className="h-4 w-4" /> */}
                                        Customer Notes
                                    </p>
                                    <p className="text-base mt-1 break-all whitespace-pre-wrap">{salesOrder?.customer_notes}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        {/* <Phone className="h-4 w-4" /> */}
                                        Terms and Conditions
                                    </p>
                                    <p className="text-base mt-1 break-all whitespace-pre-wrap">{salesOrder?.terms_and_conditions}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Billing Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{salesOrder.customer.billingAddress}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{salesOrder.customer.shippingAddress}</p>
                                </CardContent>
                            </Card>
                        </div> */}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Activity Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Array.isArray((salesOrder as any)?.activity_logs) && (salesOrder as any).activity_logs.length > 0 ? (
                                    <div className="divide-y">
                                        {(salesOrder as any).activity_logs.map((log: any, idx: number) => {
                                            const key = `${log?.date || ""}-${log?.time || ""}-${idx}`;
                                            const hint = `${log?.action || ""} ${log?.message || ""}`.toLowerCase();
                                            const isConverted = hint.includes("convert");
                                            const isCreated = hint.includes("create");
                                            const isAccepted = hint.includes("accept");
                                            const isSent = hint.includes("sent");

                                            const invoiceId =
                                                log?.invoice_id ||
                                                log?.lock_account_invoice_id ||
                                                (salesOrder as any)?.invoice_id ||
                                                (salesOrder as any)?.lock_account_invoice_id;

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

                                                        {isConverted && invoiceId ? (
                                                            <button
                                                                type="button"
                                                                className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                                                onClick={() => navigate(`/accounting/invoices/${invoiceId}`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View the invoice
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
                        <DialogTitle>Delete Sales Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this sales order? This action cannot be undone.
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
                                {(((salesOrder as any)?.approval_status?.approval_levels) || []).map((lvl: any, index: number) => (
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

export default SalesOrderDetailPage;
