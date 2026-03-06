import React, { useState, useEffect } from "react";
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

export const InvoiceDashboardDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("invoice-details");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchInvoiceDetails();
        }
    }, [id, baseUrl, token]);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/lock_account_invoices/${id}.json?lock_account_id=1`,
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
            confirmed: "bg-blue-100 text-blue-800 border-blue-200",
            processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status] || colors.draft;
    };

    const handleEdit = () => {
        navigate(`/accounting/invoices/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `https://${baseUrl}/lock_account_invoices/${id}.json?lock_account_id=1`,
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
        return new Date(dateString).toLocaleDateString();
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

                    <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(invoiceData.status)} border`}>
                            {invoiceData.status.toUpperCase()}
                        </Badge>
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
                        <TabsTrigger value="invoice-details">Invoice Details</TabsTrigger>
                        <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments & Comms</TabsTrigger>
                    </TabsList>

                    {/* Invoice Details Tab */}
                    <TabsContent value="invoice-details" className="space-y-6">
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
                                        <p className="text-base font-semibold mt-1">{invoiceData.subject || "N/A"}</p>
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
                                                            <TableCell className="text-right">{item.tax || "N/A"}</TableCell>
                                                            <TableCell className="text-right font-semibold">{formatCurrency(item.amount || 0)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pricing Summary */}
                                        <div className="mt-6 flex justify-end">
                                            <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                                {invoiceData.discount_amount > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Discount ({invoiceData.discount_per}%)
                                                        </span>
                                                        <span className="font-semibold text-red-600">
                                                            -{formatCurrency(invoiceData.discount_amount)}
                                                        </span>
                                                    </div>
                                                )}
                                                {invoiceData.charge_amount && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            {invoiceData.charge_name || "Additional Charge"}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {invoiceData.charge_type === "plus" ? "+" : "-"}
                                                            {formatCurrency(invoiceData.charge_amount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t pt-3 flex justify-between text-lg">
                                                    <span className="font-bold">Total Amount</span>
                                                    <span className="font-bold text-primary">
                                                        {formatCurrency(invoiceData.total_amount)}
                                                    </span>
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
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoiceData.customer_notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {invoiceData.terms_and_conditions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Terms & Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoiceData.terms_and_conditions}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
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
                                    <p className="text-base font-semibold mt-1">{invoiceData.customer_name || "N/A"}</p>
                                </div>
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
        </div>
    );
};

export default InvoiceDashboardDetailsPage;
