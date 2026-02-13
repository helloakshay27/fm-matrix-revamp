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

interface SalesOrder {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        billingAddress: string;
        shippingAddress: string;
    };
    orderDetails: {
        orderNumber: string;
        referenceNumber: string;
        orderDate: string;
        expectedShipmentDate: string;
        paymentTerms: string;
        deliveryMethod: string;
        salesperson: string;
        status: string;
    };
    items: SalesOrderItem[];
    pricing: {
        subTotal: number;
        discount: number;
        taxAmount: number;
        adjustment: number;
        total: number;
    };
    customerNotes: string;
    termsAndConditions: string;
    attachments: SalesOrderAttachment[];
    createdAt: string;
    updatedAt: string;
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
        };
        return colors[status] || colors.draft;
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
                                Sales Order #{salesOrder.orderDetails.orderNumber}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {new Date(salesOrder.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(salesOrder.orderDetails.status)} border`}>
                            {salesOrder.orderDetails.status.toUpperCase()}
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
                        <TabsTrigger value="order-details">Order Details</TabsTrigger>
                        <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    {/* Order Details Tab */}
                    <TabsContent value="order-details" className="space-y-6">
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
                                        <p className="text-base font-semibold mt-1">{salesOrder.orderDetails.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder.orderDetails.referenceNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {new Date(salesOrder.orderDetails.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Expected Shipment Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {new Date(salesOrder.orderDetails.expectedShipmentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder.orderDetails.paymentTerms}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Delivery Method</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder.orderDetails.deliveryMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Salesperson</p>
                                        <p className="text-base font-semibold mt-1">{salesOrder.orderDetails.salesperson}</p>
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
                                                <TableHead className="text-right">Discount</TableHead>
                                                <TableHead className="text-right">Tax</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {salesOrder.items.map((item: SalesOrderItem) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-semibold">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">₹{item.rate.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">
                                                        {item.discount} {item.discountType === "percentage" ? "%" : "₹"}
                                                    </TableCell>
                                                    <TableCell className="text-right">{item.tax}</TableCell>
                                                    <TableCell className="text-right font-semibold">₹{item.amount.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pricing Summary */}
                                <div className="mt-6 flex justify-end">
                                    <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Sub Total</span>
                                            <span className="font-semibold">₹{salesOrder.pricing.subTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Discount</span>
                                            <span className="font-semibold text-red-600">-₹{salesOrder.pricing.discount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="font-semibold">₹{salesOrder.pricing.taxAmount.toFixed(2)}</span>
                                        </div>
                                        {salesOrder.pricing.adjustment !== 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Adjustment</span>
                                                <span className="font-semibold">₹{salesOrder.pricing.adjustment.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3 flex justify-between text-lg">
                                            <span className="font-bold">Total</span>
                                            <span className="font-bold text-primary">₹{salesOrder.pricing.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {salesOrder.customerNotes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Customer Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{salesOrder.customerNotes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {salesOrder.termsAndConditions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Terms & Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{salesOrder.termsAndConditions}</p>
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
                                                        <p className="text-sm font-medium">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
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
                                    <p className="text-base font-semibold mt-1">{salesOrder.customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </p>
                                    <p className="text-base mt-1">{salesOrder.customer.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </p>
                                    <p className="text-base mt-1">{salesOrder.customer.phone}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Order History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4 pb-4 border-b">
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">Order Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(salesOrder.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pb-4 border-b">
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">Order Confirmed</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(salesOrder.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
        </div>
    );
};

export default SalesOrderDetailPage;
