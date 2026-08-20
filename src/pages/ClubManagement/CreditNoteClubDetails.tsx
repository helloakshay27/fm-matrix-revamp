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
import { ArrowLeft, FileText, Package, User, Edit, Trash2, ShoppingCart, Paperclip, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast as sonnerToast } from "sonner";
import axios from "axios";

// Mirrors the line_item_type values sent by the Credit Note Add page
const LINE_ITEM_TYPE_LABELS = {
  facility_booking: "Facility Booking",
  membership: "Membership",
  event: "Event",
  other: "Other",
};

export const CreditNoteClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creditNoteData, setCreditNoteData] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  useEffect(() => {
    if (id && baseUrl && token) {
      fetchCreditNoteDetails();
    }
  }, [id, baseUrl, token]);

  const fetchCreditNoteDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/credit_notes/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // NOTE: response shape is unconfirmed — handle both a nested { credit_note, line_items }
      // shape and a flat credit_note object with an embedded line_items array.
      const data = response.data || {};
      const note = data.credit_note || data;
      setCreditNoteData(note);
      setLineItems(data.line_items || note.line_items || []);
    } catch (error) {
      console.error("Error fetching credit note details:", error);
      sonnerToast.error("Failed to fetch credit note details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/club-management/credit-note/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/credit_notes/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      sonnerToast.success("Credit note deleted successfully");
      navigate("/club-management/credit-note");
    } catch (error) {
      console.error("Error deleting credit note:", error);
      sonnerToast.error("Failed to delete credit note");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDownloadPdf = async () => {
    const loadingToast = sonnerToast.loading("Downloading credit note PDF...");
    try {
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/credit_notes/${id}/pdf.json`,
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
      link.download = `CreditNote-${creditNoteData?.credit_note_number || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      sonnerToast.success("Credit note PDF downloaded");
    } catch (error) {
      console.error("Error downloading credit note PDF:", error);
      sonnerToast.error("Failed to download credit note PDF");
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
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading credit note...</p>
        </div>
      </div>
    );
  }

  if (!creditNoteData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Credit note not found</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/club-management/credit-note")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Credit Notes
          </Button>
        </div>
      </div>
    );
  }

  // Confirmed response names the billed user "customer" (not "user" like bill_bookings)
  const user = creditNoteData.customer || creditNoteData.user || {};

  // NOTE: response is assumed to mirror the bill_bookings details shape (per-item cgst_rate/sgst_rate,
  // and a top-level totals object) since credit_notes share the same backend — unconfirmed for this endpoint.
  const totals = creditNoteData.totals || {};
  const subTotal = totals.subtotal ?? lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalDiscount = totals.discount ?? (creditNoteData.discount_amount ?? lineItems.reduce((sum, item) => sum + Number(item.discount || 0), 0));
  const totalGst = (totals.cgst_total ?? 0) + (totals.sgst_total ?? 0)
    || lineItems.reduce((sum, item) => sum + Number(item.cgst_amount || 0) + Number(item.sgst_amount || 0), 0);
  const grandTotal = totals.grand_total ?? (creditNoteData.total_amount ?? (subTotal - totalDiscount + totalGst));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/club-management/credit-note")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Credit Note {creditNoteData.credit_note_number ? `#${creditNoteData.credit_note_number}` : `#${id}`}
              </h1>
              {creditNoteData.created_at && (
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {formatDate(creditNoteData.created_at)}
                </p>
              )}
            </div>
          </div>

          {/* <div className="flex items-center gap-2 flex-wrap">
            {creditNoteData.status && (
              <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                {String(creditNoteData.status).replace(/_/g, " ").toUpperCase()}
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div> */}
        </div>

        {/* Credit Note Information — mirrors the credit_note fields sent on creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Credit Note Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credit Note Number</p>
                <p className="text-base font-semibold mt-1">{creditNoteData.credit_note_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User</p>
                <p className="text-base font-semibold mt-1">
                  {user.name || creditNoteData.user_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                <p className="text-base font-semibold mt-1">{creditNoteData.reference_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credit Note Date</p>
                <p className="text-base font-semibold mt-1">{formatDate(creditNoteData.date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p className="text-base font-semibold mt-1">{creditNoteData.reason || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Place of Supply</p>
                <p className="text-base font-semibold mt-1">{creditNoteData.place_of_supply || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Linked Invoice</p>
                <p className="text-base font-semibold mt-1">
                  {creditNoteData.invoice_number || creditNoteData.lock_account_invoice_id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-base font-semibold mt-1">
                  {creditNoteData.status ? String(creditNoteData.status).replace(/_/g, " ").toUpperCase() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                              const gstRate = Number(item.cgst_rate || 0) + Number(item.sgst_rate || 0) || Number(item.gst_rate || 0);
                              const gstAmount = Number(item.cgst_amount || 0) + Number(item.sgst_amount || 0);
                              return gstRate ? `${gstRate}%${gstAmount ? ` (${formatCurrency(gstAmount)})` : ''}` : "-";
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
                      <span className="text-sm font-medium text-muted-foreground">Discount</span>
                      <span className="font-semibold text-base text-red-600">
                        -{formatCurrency(totalDiscount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">GST</span>
                      <span className="font-semibold text-base">{formatCurrency(totalGst)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                      <span className="font-bold text-base">Total</span>
                      <span className="font-bold text-primary text-2xl">{formatCurrency(grandTotal)}</span>
                    </div>
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
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium">Credit Note PDF</p>
              <Button variant="ghost" size="sm" onClick={handleDownloadPdf}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Credit Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this credit note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button className="btn-delete-confirm" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditNoteClubDetails;
