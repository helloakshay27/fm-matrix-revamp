import React, { useCallback, useEffect, useState } from "react";
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
  ClipboardList,
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
import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import PurchaseOrderPdfTemplate from "./ClubManagement/PurchaseOrderPdfTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PurchaseOrderPdfTemplate from "./ClubManagement/PurchaseOrderPdfTemplate";
import {
  bankMasterListUrl,
  getBankMasterApiConfig,
  mapApiBankRecord,
} from "./ClubManagement/bankMasterUtils";

// Types based on actual API response
interface PoInventory {
  id: number;
  quantity: number;
  unit: string | null;
  rate: number;
  total_value: number;
  prod_desc: string;
  inventory?: {
    id: number;
    name: string;
  };
  cgst_rate: number | null;
  cgst_amount: number | null;
  sgst_rate: number | null;
  sgst_amount: number | null;
  igst_rate: number | null;
  igst_amount: number | null;
}

interface Tax {
  discount: number;
  tax_type: string;
  tax_percentage: number;
  tax_value: number;
  adjustment: number;
  sub_total: number;
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

interface Attachment {
  id?: number | string;
  name?: string;
  url?: string;
  file_url?: string;
  attachment_url?: string;
}

interface DeliveryAddress {
  name?: string;
  address?: string;
  formatted_address?: string;
  full_address?: string;
}

interface PurchaseOrder {
  id: number;
  external_id: string;
  reference_number: number;
  po_date: string;
  amount: number;
  all_level_approved: boolean;
  supplier: Supplier;
  site: Site;
  created_by: string;
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  pms_pr_inventories?: PoInventory[];
  pms_po_inventories?: PoInventory[];
  total_amount_formatted: string;
  net_amount_formatted: string;
  total_tax_amount?: number;
  total_taxable_amount?: number;
  amount_in_words?: string;
  created_at: string;
  updated_at: string;
  terms_conditions?: string;
  payment_term?: string;
  payment_terms?: string;
  payment_tern?: string;
  delivery_address?: string | DeliveryAddress;
  attachments: Attachment[];
  reverse_charge?: boolean | string;
  tax?: Tax;
  lock_account_tax_amount?: number;
  sub_total?: number;
  sub_total_amount?: number;
  net_amount?: number;
  total_amount?: number;
  status?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
};

// Helper: resolve items from whichever key API returns
const resolveItems = (po: PurchaseOrder): PoInventory[] =>
  (po.pms_pr_inventories?.length
    ? po.pms_pr_inventories
    : po.pms_po_inventories) ?? [];

// Helper: aggregate tax rows by rate across all items
const aggregateTax = (
  items: PoInventory[],
  type: "cgst" | "sgst" | "igst"
): { rate: number; amount: number }[] => {
  const map: Record<number, number> = {};
  items.forEach((item) => {
    const rate =
      type === "cgst" ? item.cgst_rate
        : type === "sgst" ? item.sgst_rate
          : item.igst_rate;
    const amt =
      type === "cgst" ? item.cgst_amount
        : type === "sgst" ? item.sgst_amount
          : item.igst_amount;
    if (rate != null && amt != null && amt !== 0) {
      map[rate] = (map[rate] ?? 0) + amt;
    }
  });
  return Object.entries(map).map(([r, a]) => ({ rate: Number(r), amount: a }));
};

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pdfRef = React.useRef<HTMLDivElement>(null);

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("order-details");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bankDetail, setBankDetail] = useState<any>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Fetch purchase order data from API
  const fetchPurchaseOrderDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get base URL and token from API_CONFIG
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        setError("Missing configuration. Please login again.");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Purchase Order ID not found.");
        setLoading(false);
        return;
      }

      // Build URL using URL object
      const url = new URL(
        `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/pms/purchase_orders/${id}.json`
      );
      url.searchParams.append("access_token", token);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please login again.");
          return;
        }
        if (response.status === 404) {
          setError("Purchase Order not found.");
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.id) {
        setPurchaseOrder(data);
      } else {
        setError("Invalid purchase order data received.");
      }
    } catch (error: unknown) {
      console.error("Error fetching purchase order detail:", error);
      setError(getErrorMessage(error, "Failed to fetch purchase order details"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load data on component mount
  useEffect(() => {
    fetchPurchaseOrderDetail();
  }, [fetchPurchaseOrderDetail]);

  // Resolve the bank selected on the purchase order, if any
  useEffect(() => {
    const fetchBankDetail = async () => {
      const bankId = (purchaseOrder as any)?.bank_master_id || (purchaseOrder as any)?.bank_master?.id;
      if (!bankId) {
        setBankDetail(null);
        return;
      }
      if ((purchaseOrder as any)?.bank_master) {
        setBankDetail(mapApiBankRecord((purchaseOrder as any).bank_master));
        return;
      }
      try {
        const { baseUrl: bmBaseUrl, lockAccountId, headers } = getBankMasterApiConfig();
        const res = await axios.get(bankMasterListUrl(bmBaseUrl, lockAccountId), { headers });
        const data = Array.isArray(res.data) ? res.data : (res.data?.bank_masters || res.data?.data || []);
        const found = data.map(mapApiBankRecord).find((b: any) => String(b.id) === String(bankId));
        setBankDetail(found || null);
      } catch (err) {
        setBankDetail(null);
      }
    };
    fetchBankDetail();
  }, [purchaseOrder]);


  const [hasSaleOrderApproval, setHasSaleOrderApproval] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  useEffect(() => {
    const fetchLockAccount = async () => {
      try {
        const response = await axios.get(`https://${baseUrl}/get_lock_account.json`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        const hasApproval = Array.isArray(response.data?.approvals) &&
          response.data.approvals.some((a: any) => a.approval_type === "purchase_order" && a.active);
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
        `https://${baseUrl}/pms/purchase_orders/${id}.json`,
        { pms_purchase_order: { status } },
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
      sonnerToast.success(`Purchase order ${status.replace("_", " ")} successfully`);
      // fetchSalesOrder();
      fetchPurchaseOrderDetail();
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
        `https://${baseUrl}/pms/purchase_orders/${id}/update_approval_status.json`,
        { status, comment: "" },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      sonnerToast.success(`Purchase order ${status.replace("_", " ")} successfully`);
      // fetchSalesOrder();
      fetchPurchaseOrderDetail();
    } catch (error) {
      sonnerToast.error("Failed to update approval status");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
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
        sonnerToast.error("Missing configuration. Please login again.");
        return;
      }

      const url = new URL(
        `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/pms/purchase_orders/${id}.json`
      );
      url.searchParams.append("access_token", token);

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete purchase order");
      }

      sonnerToast.success("Purchase order deleted successfully");
      navigate("/accounting/purchase-order");
    } catch (error: unknown) {
      sonnerToast.error(getErrorMessage(error, "Failed to delete purchase order"));
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

  const handleDownloadPdf = async () => {
    try {
      const input = pdfRef.current;
      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`purchase-order-${purchaseOrder?.external_id || "po"}.pdf`);
    } catch (err) {
      console.error(err);
      sonnerToast.error("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading purchase order...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/purchase-order")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Purchase Order
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                onClick={() => navigate("/accounting/purchase-order")}
                variant="outline"
              >
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/purchase-order")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No purchase order data available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const poNumber = `PO-${String(purchaseOrder.id).padStart(5, "0")}`;
  const status = purchaseOrder.all_level_approved ? "approved" : "pending"; // Dynamic status based on all_level_approved
  const paymentTermsDisplay =
    purchaseOrder.payment_term ||
    purchaseOrder.payment_tern ||
    "N/A";
  const deliveryAddressDisplay =
    typeof purchaseOrder.delivery_address === "string"
      ? purchaseOrder.delivery_address
      : purchaseOrder.delivery_address?.formatted_address ||
      purchaseOrder.delivery_address?.full_address ||
      purchaseOrder.delivery_address?.address ||
      purchaseOrder.delivery_address?.name ||
      "N/A";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/purchase-order")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Purchase Order #{poNumber}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on{" "}
                {new Date(purchaseOrder.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(status)} border`}>
              {status.toUpperCase()}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/accounting/bills/create?po_id=${purchaseOrder.id}`)}
            >
              Convert to Bill
            </Button>
          </div>x */}




          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getStatusColor(purchaseOrder.status)} border`}>
              {purchaseOrder.status?.toUpperCase()}
            </Badge>

            <Button
              variant="outline"
              onClick={() => setActiveTab("pdf-view")}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/accounting/purchase-order/edit/${id}`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            {/* {(purchaseOrder as any)?.approval_status?.approval_levels?.length > 0 && (
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setShowApprovalLog(true)}
                                          className="gap-2"
                                      >
                                          <ClipboardList className="h-4 w-4" />
                                          Approval Log
                                      </Button>
                                  )} */}

            {/* ── WITHOUT APPROVAL ── */}
            {!hasSaleOrderApproval && (
              <>
                {/* Draft → Mark as Confirmed */}
                {purchaseOrder.status === "draft" && (
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={actionLoading}
                    onClick={() => updateStatus("issued")}
                  >
                    Mark as Issued
                  </Button>
                )}

                {/* Confirmed → Convert to Invoice */}
                {purchaseOrder.status === "issued" && (
                  <Button
                    size="sm"
                    className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                    disabled={actionLoading}
                    onClick={() => navigate("/accounting/bills/create", { state: { saleOrderId: purchaseOrder?.id || id } })}
                  >
                    Convert to Bill
                  </Button>
                )}
              </>
            )}

            {/* ── WITH APPROVAL ── */}
            {hasSaleOrderApproval && (
              <>
                {/* Draft → Submit for Approval */}
                {purchaseOrder.status === "draft" && (
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
                {purchaseOrder.status === "pending_approval" && (purchaseOrder as any).can_approve && (
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
                {purchaseOrder.status === "approved" && (
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={actionLoading}
                    onClick={() => updateStatus("issued")}
                  >
                    Mark as Issued
                  </Button>
                )}

                {/* Issued → Convert to Bill */}
                {purchaseOrder.status === "issued" && (
                  <Button
                    size="sm"
                    className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                    disabled={actionLoading}
                    onClick={() => navigate("/accounting/bills/create", { state: { saleOrderId: purchaseOrder?.id || id } })}
                  >
                    Convert to Bill
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="rounded-lg border-r border-b border-gray-200 shadow-sm"
          style={{
            borderTop: "none",
            borderLeft: "none",
            backgroundColor: "rgba(250, 250, 250, 1)",
          }}
        >
          <style>{`
                        .purchase-order-tabs button[data-state="active"] {
                            background-color: rgba(237, 234, 227, 1) !important;
                            color: rgba(199, 32, 48, 1) !important;
                        }
                    `}</style>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="purchase-order-tabs w-full flex flex-nowrap rounded-t-lg p-0 overflow-x-auto mb-4"
              style={{
                gap: "0",
                padding: "0",
                backgroundColor: "rgba(246, 247, 247, 1)",
                height: "50px",
                marginBottom: "16px",
                justifyContent: "flex-start",
              }}
            >
              {[
                { label: "Order Details", value: "order-details" },
                { label: "Vendor Info", value: "vendor-info" },
                { label: "PDF View", value: "pdf-view" },
                { label: "History", value: "history" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]"
                  style={{
                    width: "230px",
                    height: "36px",
                    paddingTop: "10px",
                    paddingRight: "20px",
                    paddingBottom: "10px",
                    paddingLeft: "20px",
                    borderRadius: "0",
                    border: "none",
                    margin: "0",
                    fontFamily: "Work Sans",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "rgba(26, 26, 26, 1)",
                    backgroundColor: "rgba(246, 247, 247, 1)",
                  }}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Order Details Tab */}
            <TabsContent
              value="order-details"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
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
                      <p className="text-sm font-medium text-muted-foreground">
                        PO Number
                      </p>
                      <p className="text-base font-semibold mt-1">{poNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        External ID
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {purchaseOrder.external_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        PO Date
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {new Date(purchaseOrder.po_date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Site
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {purchaseOrder.site?.name || "N/A"}
                      </p>
                    </div> */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Created By
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {purchaseOrder.created_by || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Reference Number
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {purchaseOrder.reference_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Payment Terms

                      </p>
                      <p className="text-base font-semibold mt-1">
                        {paymentTermsDisplay}
                      </p>

                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Delivery Address
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {deliveryAddressDisplay}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Table */}
              {(() => {
                const items = resolveItems(purchaseOrder);
                if (!items.length) return null;

                const subTotal = purchaseOrder.sub_total ?? purchaseOrder.sub_total_amount ?? 0;
                const discountPct = purchaseOrder.tax?.tax_percentage ?? 0;
                const discountAmt = purchaseOrder.tax?.discount ?? 0;

                // Single tax row, just like the Bill page: name from the first item's tax_group, amount from total_taxable_amount
                const taxGroupName = items[0]?.tax_group?.name ?? null;
                const taxGroupRate = items[0]?.tax_group?.rate ?? null;
                const taxAmount = purchaseOrder.total_taxable_amount ?? 0;

                const tdsLabel = purchaseOrder.tax?.tax_type ?? "TDS";
                const tdsAmt = purchaseOrder.lock_account_tax_amount ?? purchaseOrder.tax?.tax_value ?? 0;

                const adjustment = purchaseOrder.tax?.adjustment ?? 0;
                const grandTotal =
                  purchaseOrder.total_amount_formatted ??
                  purchaseOrder.total_amount?.toFixed(2) ??
                  "0.00";

                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Item Table
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
                            {items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-semibold">
                                      {item.inventory?.name ?? "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.prod_desc}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.quantity} {item.unit || ""}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{Number(item.rate).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.tax_group?.name ?? "-"}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  ₹{Number(item.total_value).toFixed(2)}
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
                            <span className="text-sm font-medium text-muted-foreground">
                              Sub Total
                            </span>
                            <span className="font-semibold text-base">
                              ₹{Number(subTotal).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Discount ({discountPct}%)
                            </span>
                            <span className="font-semibold text-base text-red-600">
                              -₹{Number(discountAmt).toFixed(2)}
                            </span>
                          </div>

                          {!(
                            purchaseOrder?.reverse_charge === true ||
                            purchaseOrder?.reverse_charge === "true"
                          ) &&
                            taxGroupName && (
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {taxGroupName} {taxGroupRate != null ? `(${taxGroupRate}%)` : ""}
                                </span>
                                <span className="font-semibold text-base">
                                  ₹{Number(taxAmount).toFixed(2)}
                                </span>
                              </div>
                            )}

                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {tdsLabel?.toUpperCase()}
                            </span>
                            <span className="font-semibold text-base text-red-600">
                              -₹{Number(tdsAmt).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Adjustment
                            </span>
                            <span className="font-semibold text-base">
                              ₹{Number(adjustment).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                            <span className="font-bold text-base">Total ( ₹ )</span>
                            <span className="font-bold text-primary text-2xl">
                              ₹{grandTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Reverse Charge Summary - Display when reverse_charge is true */}
              {(() => {
                const items = resolveItems(purchaseOrder);
                return (
                  (purchaseOrder?.reverse_charge === true ||
                    purchaseOrder?.reverse_charge === "true") &&
                  items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Reverse Charge Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border border-border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left px-4 py-3 font-medium">
                                  Reverse Charge Rate
                                </th>
                                <th className="text-right px-4 py-3 font-medium">
                                  Tax Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                  <td className="px-4 py-2">
                                    Item {index + 1} - {item.prod_desc}
                                  </td>
                                  <td className="text-right px-4 py-2 font-semibold">
                                    ₹{item.total_value.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="border-t font-semibold bg-muted/30">
                                <td className="px-4 py-3">Total</td>
                                <td className="text-right px-4 py-3">
                                  ₹
                                  {items
                                    ?.reduce(
                                      (sum: number, item: PoInventory) =>
                                        sum + item.total_value,
                                      0
                                    )
                                    .toFixed(2) || "0.00"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-4 flex items-center gap-2">
                          <span>ℹ️</span>
                          Reverse Charge Mechanism (RCM) is applicable on this
                          transaction
                        </p>
                      </CardContent>
                    </Card>
                  )
                );
              })()}

              {/* Reverse Charge Indicator */}
              {(purchaseOrder?.reverse_charge === true ||
                purchaseOrder?.reverse_charge === "true") && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="text-amber-600 text-2xl">ℹ️</div>
                        <div>
                          <p className="font-semibold text-amber-900">
                            Reverse Charge Applicable
                          </p>
                          <p className="text-sm text-amber-800 mt-1">
                            This transaction is applicable for reverse charge.
                            The tax liability lies with the recipient.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {bankDetail && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bank Details</CardTitle>
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

              {purchaseOrder.terms_conditions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {purchaseOrder.terms_conditions}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {purchaseOrder.attachments &&
                purchaseOrder.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {purchaseOrder.attachments.map(
                          (file: Attachment, index: number) => (
                            <div
                              key={file.id ?? index}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {file.name || `Attachment ${index + 1}`}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            {/* Vendor Info Tab */}
            <TabsContent
              value="vendor-info"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Supplier Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Company Name
                    </p>
                    <p className="text-base font-semibold mt-1">
                      {purchaseOrder.supplier?.company_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="text-base mt-1">
                      {purchaseOrder.supplier?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="text-base mt-1">
                      {purchaseOrder.supplier?.mobile1 || "N/A"}
                    </p>
                  </div>
                  {purchaseOrder.supplier?.gstin_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        GSTIN Number
                      </p>
                      <p className="text-base mt-1">
                        {purchaseOrder.supplier.gstin_number}
                      </p>
                    </div>
                  )}
                  {purchaseOrder.supplier?.pan_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        PAN Number
                      </p>
                      <p className="text-base mt-1">
                        {purchaseOrder.supplier.pan_number}
                      </p>
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
                    <p className="text-sm text-muted-foreground">
                      {purchaseOrder.supplier.formatted_address}
                    </p>
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Name
                      </p>
                      <p className="text-base mt-1">
                        {purchaseOrder.user.full_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="text-base mt-1">
                        {purchaseOrder.user.email || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* PDF View Tab */}
            <TabsContent
              value="pdf-view"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Purchase Order PDF
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownloadPdf}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-6 overflow-auto rounded-lg">
                    <div ref={pdfRef} className="flex justify-center">
                      <PurchaseOrderPdfTemplate
                        data={{
                          po_number: `PO-${String(purchaseOrder?.id).padStart(5, "0")}`,
                          po_date: purchaseOrder?.po_date,
                          external_id: purchaseOrder?.external_id,
                          reference_number: purchaseOrder?.reference_number,
                          status: purchaseOrder?.status,
                          amount: purchaseOrder?.total_amount,
                          total_amount: purchaseOrder?.total_amount,
                          amount_in_words: purchaseOrder?.amount_in_words,
                          sub_total_amount: purchaseOrder?.sub_total_amount || purchaseOrder?.sub_total,
                          discount_amount: purchaseOrder?.tax?.discount || 0,
                          lock_account_tax_amount: purchaseOrder?.lock_account_tax_amount,
                          adjustment: purchaseOrder?.tax?.adjustment || 0,
                          supplier_name: purchaseOrder?.supplier?.company_name,
                          supplier_email: purchaseOrder?.supplier?.email,
                          supplier_phone: purchaseOrder?.supplier?.mobile1,
                          supplier_address: purchaseOrder?.supplier?.formatted_address,
                          payment_terms: purchaseOrder?.payment_term || purchaseOrder?.payment_tern,
                          delivery_address: typeof purchaseOrder?.delivery_address === "string"
                            ? purchaseOrder?.delivery_address
                            : purchaseOrder?.delivery_address?.formatted_address || purchaseOrder?.delivery_address?.address,
                          terms_conditions: purchaseOrder?.terms_conditions,
                        }}
                        items={resolveItems(purchaseOrder) || []}
                        formatCurrency={(amount) =>
                          `₹${Number(amount || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        }
                        formatDate={(date) => {
                          if (!date) return "-";
                          return new Date(date).toLocaleDateString("en-GB");
                        }}
                        bankDetail={bankDetail}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent
              value="history"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
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
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase order? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrderDetailPage;