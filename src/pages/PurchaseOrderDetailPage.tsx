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
import { API_CONFIG } from "@/config/apiConfig";

// Types based on actual API response
interface PoInventory {
    id: number;
    quantity: number;
    unit: string;
    rate: number;
    total_value: number;
    prod_desc: string;
    inventory?: {
        id: number;
        name: string;
    };
}

interface Supplier {
    id: number;
    company_name: string;
    email: string;
    mobile1: string;
    formatted_address: string;
    gstin_number: string;
    pan_number: string;
    city?: string;
    state?: string;
    country?: string;
}

interface Site {
    id: number;
    name: string;
}

interface PurchaseOrder {
    id: number;
    external_id: string;
    reference_number: number;
    po_date: string;
    amount: number;
    supplier: Supplier;
    site: Site;
    created_by: string;
    user?: {
        id: number;
        full_name: string;
        email: string;
    };
    pms_po_inventories: PoInventory[];
    total_amount_formatted: string;
    net_amount_formatted: string;
    total_tax_amount?: number;
    total_taxable_amount?: number;
    amount_in_words?: string;
    created_at: string;
    updated_at: string;
    terms_conditions?: string;
    attachments: any[];
}

export const PurchaseOrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("order-details");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch purchase order data from API
    const fetchPurchaseOrderDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get base URL and token from API_CONFIG
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            if (!baseUrl || !token) {
                setError('Missing configuration. Please login again.');
                setLoading(false);
                return;
            }

            if (!id) {
                setError('Purchase Order ID not found.');
                setLoading(false);
                return;
            }

            // Build URL using URL object
            const url = new URL(
                `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/pms/purchase_orders/${id}.json`
            );
            url.searchParams.append('access_token', token);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Unauthorized. Please login again.');
                    return;
                }
                if (response.status === 404) {
                    setError('Purchase Order not found.');
                    return;
                }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.id) {
                setPurchaseOrder(data);
            } else {
                setError('Invalid purchase order data received.');
            }

        } catch (error: any) {
            console.error('Error fetching purchase order detail:', error);
            setError(error.message || 'Failed to fetch purchase order details');
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchPurchaseOrderDetail();
    }, [id]);

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            draft: "bg-gray-100 text-gray-800 border-gray-200",
            confirmed: "bg-blue-100 text-blue-800 border-blue-200",
            processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            received: "bg-green-100 text-green-800 border-green-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status?.toLowerCase()] || colors.draft;
    };

    const handleEdit = () => {
        navigate(`/accounting/purchase-order/edit/${id}`);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            if (!baseUrl || !token) {
                sonnerToast.error('Missing configuration. Please login again.');
                return;
            }

            const url = new URL(
                `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/pms/purchase_orders/${id}.json`
            );
            url.searchParams.append('access_token', token);

            const response = await fetch(url.toString(), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete purchase order');
            }

            sonnerToast.success("Purchase order deleted successfully");
            navigate("/accounting/purchase-order");
        } catch (error: any) {
            sonnerToast.error(error.message || "Failed to delete purchase order");
        } finally {
            setDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        sonnerToast.success("Downloading purchase order PDF...");
    };

    const handleSendEmail = () => {
        sonnerToast.success("Email sent successfully");
    };

    const handleClone = () => {
        sonnerToast.success("Purchase order cloned successfully");
        navigate("/accounting/purchase-order/create");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading purchase order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/purchase-order")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Purchase Order</h2>
                            <p className="text-red-700 mb-4">{error}</p>
                            <Button onClick={() => navigate("/accounting/purchase-order")} variant="outline">
                                Back to List
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!purchaseOrder) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/purchase-order")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground">No purchase order data available.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const poNumber = `PO-${String(purchaseOrder.external_id).padStart(5, '0')}`;
    const status = 'confirmed'; // Default status - can be derived from API if available

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/purchase-order")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <ShoppingCart className="h-6 w-6 text-primary" />
                                Purchase Order #{poNumber}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {new Date(purchaseOrder.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(status)} border`}>
                            {status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="order-details">Order Details</TabsTrigger>
                        <TabsTrigger value="vendor-info">Vendor Info</TabsTrigger>
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
                                        <p className="text-sm font-medium text-muted-foreground">PO Number</p>
                                        <p className="text-base font-semibold mt-1">{poNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">External ID</p>
                                        <p className="text-base font-semibold mt-1">{purchaseOrder.external_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">PO Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {new Date(purchaseOrder.po_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Site</p>
                                        <p className="text-base font-semibold mt-1">{purchaseOrder.site?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Created By</p>
                                        <p className="text-base font-semibold mt-1">{purchaseOrder.created_by || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                                        <p className="text-base font-semibold mt-1">{purchaseOrder.reference_number || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Table */}
                        {purchaseOrder.pms_po_inventories && purchaseOrder.pms_po_inventories.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        Line Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Item Description</TableHead>
                                                    <TableHead className="text-right">Quantity</TableHead>
                                                    <TableHead className="text-right">Unit</TableHead>
                                                    <TableHead className="text-right">Rate</TableHead>
                                                    <TableHead className="text-right">Total Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {purchaseOrder.pms_po_inventories.map((item: PoInventory) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-semibold">{item.prod_desc || 'N/A'}</p>
                                                                {item.inventory?.name && (
                                                                    <p className="text-sm text-muted-foreground">{item.inventory.name}</p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">{item.unit}</TableCell>
                                                        <TableCell className="text-right">₹{item.rate.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right font-semibold">₹{item.total_value.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pricing Summary */}
                                    <div className="mt-6 flex justify-end">
                                        <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Net Amount</span>
                                                <span className="font-semibold">₹{purchaseOrder.net_amount_formatted || '0.00'}</span>
                                            </div>
                                            {purchaseOrder.total_tax_amount && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Tax</span>
                                                    <span className="font-semibold">₹{purchaseOrder.total_tax_amount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-3 flex justify-between text-lg">
                                                <span className="font-bold">Total Amount</span>
                                                <span className="font-bold text-primary">₹{purchaseOrder.total_amount_formatted || '0.00'}</span>
                                            </div>
                                            {purchaseOrder.amount_in_words && (
                                                <div className="border-t pt-3">
                                                    <p className="text-xs text-muted-foreground">Amount in Words:</p>
                                                    <p className="text-sm font-medium">{purchaseOrder.amount_in_words}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Terms & Conditions */}
                        {purchaseOrder.terms_conditions && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Terms & Conditions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{purchaseOrder.terms_conditions}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Attachments */}
                        {purchaseOrder.attachments && purchaseOrder.attachments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Attachments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {purchaseOrder.attachments.map((file: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{file.name || `Attachment ${index + 1}`}</p>
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

                    {/* Vendor Info Tab */}
                    <TabsContent value="vendor-info" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Supplier Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                                    <p className="text-base font-semibold mt-1">{purchaseOrder.supplier?.company_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </p>
                                    <p className="text-base mt-1">{purchaseOrder.supplier?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </p>
                                    <p className="text-base mt-1">{purchaseOrder.supplier?.mobile1 || 'N/A'}</p>
                                </div>
                                {purchaseOrder.supplier?.gstin_number && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">GSTIN Number</p>
                                        <p className="text-base mt-1">{purchaseOrder.supplier.gstin_number}</p>
                                    </div>
                                )}
                                {purchaseOrder.supplier?.pan_number && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                                        <p className="text-base mt-1">{purchaseOrder.supplier.pan_number}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {purchaseOrder.supplier?.formatted_address && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Supplier Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{purchaseOrder.supplier.formatted_address}</p>
                                </CardContent>
                            </Card>
                        )}

                        {purchaseOrder.user && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Created By</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                                        <p className="text-base mt-1">{purchaseOrder.user.full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p className="text-base mt-1">{purchaseOrder.user.email || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4 pb-4 border-b">
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">Purchase Order Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(purchaseOrder.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">Last Updated</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(purchaseOrder.updated_at).toLocaleString()}
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
                        <DialogTitle>Delete Purchase Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this purchase order? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PurchaseOrderDetailPage;
