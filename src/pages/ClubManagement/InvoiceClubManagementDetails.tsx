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
import {
    ArrowLeft,
    FileText,
    Package,
    User,
    Paperclip,
    Edit,
    Trash2,
    Download,
    Receipt,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast as sonnerToast } from "sonner";
import axios from "axios";
import {
    bankMasterListUrl,
    getBankMasterApiConfig,
    mapApiBankRecord,
} from "./bankMasterUtils";

// Mirrors the line_item_type values sent by the Invoice Add page
const LINE_ITEM_TYPE_LABELS = {
    facility_booking: "Facility Booking",
    membership: "Membership",
    event: "Event",
    other: "Other",
};

export const InvoiceClubManagementDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [lineItems, setLineItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [bankDetail, setBankDetail] = useState(null);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchInvoiceDetails();
        }
    }, [id, baseUrl, token]);

    // Resolve the bank selected on the invoice, if any
    useEffect(() => {
        const fetchBankDetail = async () => {
            const bankId = invoiceData?.bank_master_id || invoiceData?.bank_master?.id;
            if (!bankId) {
                setBankDetail(null);
                return;
            }
            if (invoiceData?.bank_master) {
                setBankDetail(mapApiBankRecord(invoiceData.bank_master));
                return;
            }
            try {
                const { baseUrl: bmBaseUrl, lockAccountId, headers } = getBankMasterApiConfig();
                const res = await axios.get(bankMasterListUrl(bmBaseUrl, lockAccountId), { headers });
                const data = Array.isArray(res.data) ? res.data : (res.data?.bank_masters || res.data?.data || []);
                const found = data.map(mapApiBankRecord).find((b) => String(b.id) === String(bankId));
                setBankDetail(found || null);
            } catch (err) {
                setBankDetail(null);
            }
        };
        fetchBankDetail();
    }, [invoiceData]);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // NOTE: response shape is unconfirmed — handle both a nested { bill_booking, line_items }
            // shape and a flat bill_booking object with an embedded line_items array.
            const data = response.data || {};
            const booking = data.bill_booking || data;
            setInvoiceData(booking);
            setLineItems(data.line_items || booking.line_items || []);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            sonnerToast.error("Failed to fetch invoice details");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/club-management/invoice/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            sonnerToast.success("Invoice deleted successfully");
            navigate("/club-management/invoice");
        } catch (error) {
            console.error("Error deleting invoice:", error);
            sonnerToast.error("Failed to delete invoice");
        }
        setShowDeleteDialog(false);
    };

    const handleDownloadPdf = async () => {
        const loadingToast = sonnerToast.loading("Downloading invoice PDF...");
        try {
            const response = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${id}/pdf.json`,
                {
                    params: { access_token: token },
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `Invoice-${invoiceData?.order_number || id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            sonnerToast.success("Invoice PDF downloaded");
        } catch (error) {
            console.error("Error downloading invoice PDF:", error);
            sonnerToast.error("Failed to download invoice PDF");
        } finally {
            sonnerToast.dismiss(loadingToast);
        }
    };

    const formatCurrency = (amount) => {
        const currencySymbol = localStorage.getItem("currencySymbol") || "₹";
        return `${currencySymbol}${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch {
            return dateString;
        }
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
                    <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={() => navigate("/club-management/invoice")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Invoices
                    </Button>
                </div>
            </div>
        );
    }

    const user = invoiceData.user || {};
    const addressDetail = invoiceData.address_detail || invoiceData.address_detail_attributes || {};
    const billingAddress = addressDetail.billing_address || null;
    const shippingAddress = addressDetail.shipping_address || null;

    const totals = invoiceData.totals || {};
    const subTotal = totals.subtotal ?? lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    // invoiceData.discount_amount (the invoice-level discount actually saved) takes priority over
    // totals.discount, which the API can return as 0 even when a real discount_amount exists.
    const totalDiscount = Number(invoiceData.discount_amount) || Number(totals.discount) || lineItems.reduce((sum, item) => sum + Number(item.discount || 0), 0);
    const totalCgst = totals.cgst_total ?? lineItems.reduce((sum, item) => sum + Number(item.cgst_amount || 0), 0);
    const totalSgst = totals.sgst_total ?? lineItems.reduce((sum, item) => sum + Number(item.sgst_amount || 0), 0);
    const grandTotal = totals.grand_total ?? (invoiceData.total_amount || 0);

    const formatAddress = (addr) => {
        if (!addr) return null;
        const lines = [addr.address, addr.address_line_two, addr.address_line_three].filter(Boolean);
        const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
        const cityLine = cityState ? `${cityState}${addr.pin_code ? ` - ${addr.pin_code}` : ""}` : addr.pin_code || "";
        return { lines, cityLine, country: addr.country, contact: addr.contact_person, mobile: addr.mobile };
    };
    const billingAddressText = formatAddress(billingAddress);
    const shippingAddressText = formatAddress(shippingAddress);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/club-management/invoice")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <Receipt className="h-6 w-6 text-primary" />
                                Invoice {invoiceData.order_number ? `#${invoiceData.order_number}` : `#${id}`}
                            </h1>
                            {invoiceData.created_at && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Created on {formatDate(invoiceData.created_at)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {invoiceData.status && (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                                {String(invoiceData.status).replace(/_/g, " ").toUpperCase()}
                            </Badge>
                        )}
                        {/* <Button size="sm" variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button> */}
                        {/* <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button> */}
                    </div>
                </div>

                {/* Invoice Information — mirrors the bill_booking fields sent on creation */}
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
                                <p className="text-sm font-medium text-muted-foreground">Invoice To</p>
                                <p className="text-base font-semibold mt-1">
                                    {user.name || invoiceData.user_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                                <p className="text-base font-semibold mt-1">{invoiceData.order_number || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                                <p className="text-base font-semibold mt-1">{formatDate(invoiceData.bill_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                <p className="text-base font-semibold mt-1">{formatDate(invoiceData.due_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                <p className="text-base font-semibold mt-1 break-all">{invoiceData.subject || "N/A"}</p>
                            </div>
                            {/* <div>
                <p className="text-sm font-medium text-muted-foreground">Discount %</p>
                <p className="text-base font-semibold mt-1">{invoiceData.discount_per ?? 0}%</p>
              </div> */}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Place of Supply</p>
                                <p className="text-base font-semibold mt-1">{invoiceData.source_of_supply || "N/A"}</p>
                            </div>
                            {/* <div>
                <p className="text-sm font-medium text-muted-foreground">Destination of Supply</p>
                <p className="text-base font-semibold mt-1">{invoiceData.destination_of_supply || "N/A"}</p>
              </div> */}
                            {/* <div>
                <p className="text-sm font-medium text-muted-foreground">Billing GSTIN</p>
                <p className="text-base font-semibold mt-1">{invoiceData.billing_gstin || "N/A"}</p>
              </div> */}
                        </div>

                        {invoiceData.note && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Note</p>
                                <p className="text-sm mt-1 whitespace-pre-wrap break-all">{invoiceData.note}</p>
                            </div>
                        )}

                        {invoiceData.terms_and_conditions && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Terms &amp; Conditions</p>
                                <p className="text-sm mt-1 whitespace-pre-wrap break-all">
                                    {invoiceData.terms_and_conditions}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Address & GST — mirrors address_detail_attributes sent on creation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Billing Address</p>
                                {billingAddressText ? (
                                    <div className="text-sm">
                                        {billingAddressText.lines.map((line, i) => (
                                            <div key={i}>{line}</div>
                                        ))}
                                        {billingAddressText.cityLine && <div>{billingAddressText.cityLine}</div>}
                                        {billingAddressText.country && <div>{billingAddressText.country}</div>}
                                        {billingAddressText.contact && (
                                            <div className="mt-1 text-muted-foreground">Contact: {billingAddressText.contact}</div>
                                        )}
                                        {billingAddressText.mobile && (
                                            <div className="text-muted-foreground">Mobile: {billingAddressText.mobile}</div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">-</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
                                {shippingAddressText ? (
                                    <div className="text-sm">
                                        {shippingAddressText.lines.map((line, i) => (
                                            <div key={i}>{line}</div>
                                        ))}
                                        {shippingAddressText.cityLine && <div>{shippingAddressText.cityLine}</div>}
                                        {shippingAddressText.country && <div>{shippingAddressText.country}</div>}
                                        {shippingAddressText.contact && (
                                            <div className="mt-1 text-muted-foreground">Contact: {shippingAddressText.contact}</div>
                                        )}
                                        {shippingAddressText.mobile && (
                                            <div className="text-muted-foreground">Mobile: {shippingAddressText.mobile}</div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">-</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bank Details */}
                {bankDetail && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Bank Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                                <p className="text-sm mt-1">{bankDetail.bankName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                                <p className="text-sm mt-1">{bankDetail.accountNo}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Beneficiary / Account Name</p>
                                <p className="text-sm mt-1">{bankDetail.beneficiaryName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                                <p className="text-sm mt-1">{bankDetail.ifscCode}</p>
                            </div>
                            {bankDetail.swiftCode && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Swift Code</p>
                                    <p className="text-sm mt-1">{bankDetail.swiftCode}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Branch</p>
                                <p className="text-sm mt-1">{bankDetail.branch}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Line Items — mirrors the line_items array sent on creation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Line Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lineItems.length > 0 ? (
                            <>
                                <div className="border border-border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>Type</TableHead>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                                <TableHead className="text-right">Rate</TableHead>
                                                {/* <TableHead className="text-right">Discount</TableHead> */}
                                                <TableHead className="text-right">GST</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lineItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {LINE_ITEM_TYPE_LABELS[item.line_item_type] || item.line_item_type || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="font-semibold">{item.name || "N/A"}</TableCell>
                                                    <TableCell className="text-right">{item.quantity ?? 0}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                                                    {/* <TableCell className="text-right">{formatCurrency(item.discount)}</TableCell> */}
                                                    <TableCell className="text-right">
                                                        {(() => {
                                                            const gstRate = Number(item.cgst_rate || 0) + Number(item.sgst_rate || 0);
                                                            const gstAmount = Number(item.cgst_amount || 0) + Number(item.sgst_amount || 0);
                                                            return gstRate ? `${gstRate}% (${formatCurrency(gstAmount)})` : "-";
                                                        })()}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {formatCurrency(item.total_amount ?? item.amount)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Sub Total</span>
                                            <span className="font-semibold text-base">{formatCurrency(subTotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Discount{invoiceData.discount_per ? ` (${invoiceData.discount_per}%)` : ""}
                                            </span>
                                            <span className="font-semibold text-base text-red-600">
                                                -{formatCurrency(totalDiscount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">GST</span>
                                            <span className="font-semibold text-base">{formatCurrency(totalCgst + totalSgst)}</span>
                                        </div>
                                        {/* <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                            <span className="font-bold text-base">Grand Total</span>
                                            <span className="font-bold text-primary text-2xl">{formatCurrency(grandTotal)}</span>
                                        </div> */}
                                        <div className="flex justify-between items-center py-2 border-t pt-3">

                                             <span className="font-bold text-base">Grand Total</span>
                                            <span className="font-bold text-primary text-2xl">{formatCurrency(grandTotal)}</span>
                                            {/* <span className="text-sm font-medium text-muted-foreground">Paid Amount</span>
                                            <span className="font-semibold text-base">{formatCurrency(invoiceData.paid_amount)}</span> */}
                                        </div>
                                        {/* <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-medium text-muted-foreground">Balance Due</span>
                                            <span className="font-semibold text-base text-red-600">
                                                {formatCurrency(invoiceData.balance_due)}
                                            </span>
                                        </div> */}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No items found</p>
                        )}
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Paperclip className="h-5 w-5 text-primary" />
                            Attachments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm font-medium">Invoice PDF</p>
                                <Button variant="ghost" size="sm" onClick={handleDownloadPdf}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                                {invoiceData.attachments?.map((file, idx) => (
                                    <div
                                        key={file.id ?? idx}
                                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <p className="text-sm font-medium">
                                                {file.document_file_name || file.file_name || `Attachment ${idx + 1}`}
                                            </p>
                                        </div>
                                        {(file.attachment_url || file.url) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(file.attachment_url || file.url, "_blank")}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
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
                        <Button
                            className="btn-delete-confirm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InvoiceClubManagementDetails;
