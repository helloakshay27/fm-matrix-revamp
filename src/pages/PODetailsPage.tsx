import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Printer,
  Copy,
  Rss,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { getMaterialPRById } from "@/store/slices/materialPRSlice";
import { approvePO, rejectPO } from "@/store/slices/purchaseOrderSlice";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import { format } from "date-fns";

// Interfaces
interface BillingAddress {
  phone?: string;
  fax?: string;
  email?: string;
  gst_number?: string;
  pan_number?: string;
  address?: string;
  notes?: string[];
}

interface PlantDetail {
  plant_name?: string;
}

interface Supplier {
  address?: string;
  email?: string;
  pan_number?: string;
  mobile1?: string;
  company_name?: string;
}

interface ApprovalLevel {
  id: string;
  name: string;
  status_label: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
}

interface PRInventory {
  id?: number;
  inventory?: { name?: string };
  sac_hsn_code?: string;
  expected_date?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  total_value?: number;
  approved_qty?: number;
  transfer_qty?: number;
  wbs_code?: string;
}

interface Attachment {
  id: number;
  url: string;
  document_name?: string;
  document_file_name?: string;
}

interface GRNDetail {
  id: number;
  inventories_name?: string;
  supplier?: string;
  invoice_no?: string;
  amount?: number;
  payable_amount?: number;
  retention_amount?: number;
  tds_amount?: number;
  qh_amount?: number;
  bill_date?: string;
  payment_mod?: string;
  other_expenses?: number;
  loading_expense?: number;
  adj_amount?: number;
  qc_approval_status?: string;
  hse_approval_status?: string;
  admin_approval_status?: string;
  invoice_sent_label?: string;
}

interface PaymentDetail {
  grn_id?: number;
  amount?: number;
  payment_mode?: string;
  transaction_number?: string;
  status?: string;
  payment_date?: string;
  note?: string;
  date_of_entry?: string;
}

interface DebitCreditNote {
  id: number;
  note_type?: string;
  amount?: number;
  note?: string;
  approved?: string;
  approved_at?: string;
  approved_by?: string;
  created_at?: string;
  creator_name?: string;
}

interface PODetails {
  all_level_approved?: boolean;
  billing_address?: BillingAddress;
  plant_detail?: PlantDetail;
  supplier?: Supplier;
  pms_po_inventories?: PRInventory[];
  pms_pr_inventories?: PRInventory[];
  external_id?: string;
  po_date?: string;
  related_to?: string;
  retention?: string;
  quality_holding?: string;
  reference_number?: string;
  id?: string;
  payment_tenure?: string;
  tds?: string;
  advance_amount?: string;
  net_amount_formatted?: string;
  total_taxable_amount?: string;
  total_amount_formatted?: string;
  show_send_sap_yes?: boolean;
  approval_levels?: ApprovalLevel[];
  shipping_address?: {
    title?: string;
  };
  email?: string;
  gst?: string;
  attachments?: Attachment[];
  terms_conditions?: string;
  pms_grns?: GRNDetail[];
  payment_details?: PaymentDetail[];
  debit_notes?: DebitCreditNote[];
}

// Table column configurations
const inventoryTableColumns: ColumnConfig[] = [
  { key: "inventory_name", label: "Item", sortable: true, draggable: true },
  {
    key: "sac_hsn_code",
    label: "SAC/HSN Code",
    sortable: true,
    draggable: true,
  },
  {
    key: "expected_date",
    label: "Expected Date",
    sortable: true,
    draggable: true,
  },
  { key: "quantity", label: "Quantity", sortable: true, draggable: true },
  { key: "unit", label: "Unit", sortable: true, draggable: true },
  { key: "rate", label: "Rate", sortable: true, draggable: true },
  { key: "total_value", label: "Amount", sortable: true, draggable: true },
  // {
  //   key: "approved_qty",
  //   label: "Approved Qty",
  //   sortable: true,
  //   draggable: true,
  // },
  // {
  //   key: "transfer_qty",
  //   label: "Transfer Qty",
  //   sortable: true,
  //   draggable: true,
  // },
];

const grnDetailsColumns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "inventory", label: "Inventory", sortable: true, draggable: true },
  { key: "supplier", label: "Supplier", sortable: true, draggable: true },
  {
    key: "invoice_number",
    label: "Invoice Number",
    sortable: true,
    draggable: true,
  },
  {
    key: "total_grn_amount",
    label: "Total GRN Amount",
    sortable: true,
    draggable: true,
  },
  {
    key: "payable_amount",
    label: "Payable Amount",
    sortable: true,
    draggable: true,
  },
  {
    key: "retention_amount",
    label: "Retention Amount",
    sortable: true,
    draggable: true,
  },
  { key: "tds_amount", label: "TDS Amount", sortable: true, draggable: true },
  { key: "qc_amount", label: "QC Amount", sortable: true, draggable: true },
  {
    key: "invoice_date",
    label: "Invoice Date",
    sortable: true,
    draggable: true,
  },
  {
    key: "payment_mode",
    label: "Payment Mode",
    sortable: true,
    draggable: true,
  },
  {
    key: "other_expenses",
    label: "Other Expense",
    sortable: true,
    draggable: true,
  },
  {
    key: "loading_expense",
    label: "Loading Expense",
    sortable: true,
    draggable: true,
  },
  {
    key: "adjustment_amount",
    label: "Adjustment Amount",
    sortable: true,
    draggable: true,
  },
  {
    key: "qc_approval_status",
    label: "QC Approval Status",
    sortable: true,
    draggable: true,
  },
  {
    key: "hse_approval_status",
    label: "HSE Approval Status",
    sortable: true,
    draggable: true,
  },
  {
    key: "admin_approval_status",
    label: "Admin Approval Status",
    sortable: true,
    draggable: true,
  },
  {
    key: "physical_invoice_sent",
    label: "Physical Invoice Sent to Accounts",
    sortable: true,
    draggable: true,
  },
];

const paymentDetailsColumns: ColumnConfig[] = [
  { key: "grn_id", label: "GRN ID", sortable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true },
  {
    key: "payment_mode",
    label: "Payment Mode",
    sortable: true,
    draggable: true,
  },
  {
    key: "transaction_number",
    label: "Transaction Number",
    sortable: true,
    draggable: true,
  },
  { key: "status", label: "Status", sortable: true, draggable: true },
  {
    key: "payment_date",
    label: "Payment Date",
    sortable: true,
    draggable: true,
  },
  { key: "note", label: "Note", sortable: true, draggable: true },
  {
    key: "date_of_entry",
    label: "Date Of Entry",
    sortable: true,
    draggable: true,
  },
];

const debitNoteDetailsColumns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true },
  { key: "description", label: "Description", sortable: true, draggable: true },
  { key: "approved", label: "Approved", sortable: true, draggable: true },
  { key: "approved_on", label: "Approved On", sortable: true, draggable: true },
  { key: "approved_by", label: "Approved By", sortable: true, draggable: true },
  { key: "created_on", label: "Created On", sortable: true, draggable: true },
  { key: "created_by", label: "Created By", sortable: true, draggable: true },
];

export const PODetailsPage = () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token')
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");
  const shouldShowButtons = Boolean(levelId && userId);

  const [poDetails, setPoDetails] = useState<PODetails>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [openDebitCreditModal, setOpenDebitCreditModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [debitCreditForm, setDebitCreditForm] = useState({
    type: "",
    amount: "",
    description: "",
  });

  // Fetch PO data
  const fetchData = async () => {
    if (!id) return;

    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    if (!baseUrl || !token) {
      toast.error("Missing required configuration");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(
        getMaterialPRById({ baseUrl, token, id })
      ).unwrap();
      setPoDetails(response || {});
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch purchase order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, id]);

  // Handle print
  const handlePrint = useCallback(async () => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl || !token || !id) {
      toast.error("Missing required configuration");
      return;
    }

    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/purchase_orders/${id}/print_pdf.pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "purchase_order.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF");
    }
  }, [id]);

  // Handle send to SAP
  const handleSendToSap = useCallback(async () => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl || !token || !id) {
      toast.error("Missing required configuration");
      return;
    }

    try {
      const response = await axios.get<{ message: string }>(
        `https://${baseUrl}/pms/purchase_orders/${id}.json?send_sap=yes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to send to SAP");
    }
  }, [id]);

  // Handle approve
  const handleApprove = useCallback(async () => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl || !token || !id || !levelId || !userId) {
      toast.error("Missing required configuration");
      return;
    }

    const payload = {
      pms_purchase_order: {
        id: Number(id),
        pms_pr_inventories_attributes:
          poDetails.pms_pr_inventories?.map((item) => ({
            id: item.id,
            rate: item.rate,
            total_value: item.total_value,
            approved_qty: item.quantity,
            transfer_qty: item.transfer_qty,
          })) || [],
      },
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: true,
    };

    try {
      await dispatch(
        approvePO({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("PO approved successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve PO");
    }
  }, [dispatch, id, levelId, userId, poDetails.pms_pr_inventories, navigate]);

  // Handle reject
  const handleRejectConfirm = useCallback(async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl || !token || !id || !levelId || !userId) {
      toast.error("Missing required configuration");
      return;
    }

    const payload = {
      level_id: Number(levelId),
      approve: false,
      user_id: Number(userId),
      rejection_reason: rejectComment,
      redirect: false,
    };

    try {
      await dispatch(
        rejectPO({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("PO rejected successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject PO");
    } finally {
      setOpenRejectDialog(false);
      setRejectComment("");
    }
  }, [dispatch, id, levelId, userId, rejectComment, navigate]);

  const handleOpenDebitCreditModal = () => {
    setOpenDebitCreditModal(true);
  };

  const handleCloseDebitCreditModal = () => {
    setOpenDebitCreditModal(false);
  };

  const handleDebitCreditChange = (e) => {
    const { name, value } = e.target;
    setDebitCreditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDebitCredit = async () => {
    try {
      const payload = {
        debit_note: {
          amount: debitCreditForm.amount,
          note: debitCreditForm.description,
          note_type: debitCreditForm.type,
          resource_id: Number(id),
          resource_type: "Pms::PurchaseOrder",
        },
      };

      await axios.post(`https://${baseUrl}/debit_notes.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setDebitCreditForm({
        type: "",
        amount: "",
        description: "",
      });

      toast.success("Debit note created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      handleCloseDebitCreditModal();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const inventoryTableData =
    poDetails.pms_pr_inventories?.map((item, index) => ({
      id: item.id || index,
      inventory_name: item.inventory?.name || "-",
      sac_hsn_code: item.sac_hsn_code || "-",
      expected_date: item.expected_date
        ? format(new Date(item.expected_date), "dd-MM-yyyy")
        : "-",
      quantity: item.quantity?.toString() || "-",
      unit: item.unit || "-",
      rate: item.rate?.toString() || "-",
      total_value: item.total_value?.toString() || "-",
      approved_qty: item.approved_qty?.toString() || "-",
      transfer_qty: item.transfer_qty?.toString() || "-",
    })) || [];

  const grnTableData =
    poDetails.pms_grns?.map((item, index) => ({
      id: item.id || index,
      action: (
        <Button size="sm" variant="outline">
          View
        </Button>
      ),
      inventory: item.inventories_name || "-",
      supplier: item.supplier || "-",
      invoice_number: item.invoice_no || "-",
      total_grn_amount: item.amount || "-",
      payable_amount: item.payable_amount || "-",
      retention_amount: item.retention_amount || "-",
      tds_amount: item.tds_amount || "-",
      qc_amount: item.qh_amount || "-",
      invoice_date: item.bill_date
        ? format(new Date(item.bill_date), "dd-MM-yyyy")
        : "-",
      payment_mode: item.payment_mod || "-",
      other_expenses: item.other_expenses || "-",
      loading_expense: item.loading_expense || "-",
      adjustment_amount: item.adj_amount || "-",
      qc_approval_status: item.qc_approval_status || "-",
      hse_approval_status: item.hse_approval_status || "-",
      admin_approval_status: item.admin_approval_status || "-",
      physical_invoice_sent: item.invoice_sent_label || "-",
    })) || [];

  const paymentTableData =
    poDetails.payment_details?.map((item, index) => ({
      id: item.grn_id || index,
      grn_id: item.grn_id?.toString() || "-",
      amount: item.amount?.toString() || "-",
      payment_mode: item.payment_mode || "-",
      transaction_number: item.transaction_number || "-",
      status: item.status || "-",
      payment_date: item.payment_date
        ? format(new Date(item.payment_date), "dd-MM-yyyy")
        : "-",
      note: item.note || "-",
      date_of_entry: item.date_of_entry
        ? format(new Date(item.date_of_entry), "dd-MM-yyyy")
        : "-",
    })) || [];

  const debitCreditTableData =
    poDetails.debit_notes?.map((item, index) => ({
      id: item.id || index,
      type: item.note_type || "-",
      amount: item.amount?.toString() || "-",
      description: item.note || "-",
      approved: item.approved,
      approved_on: item.approved_at
        ? format(new Date(item.approved_at), "dd-MM-yyyy")
        : "-",
      approved_by: item.approved_by || "-",
      created_on: item.created_at
        ? format(new Date(item.created_at), "dd-MM-yyyy")
        : "-",
      created_by: item.creator_name || "-",
    })) || [];

  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey] ?? "-";
    if (columnKey === "inventory_name") {
      return value;
    }
    return value;
  };

  return (
    <div className="p-6 mx-auto bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-semibold text-2xl text-gray-900 mb-2">
            Purchase Order Details
          </h1>
          <TooltipProvider>
            <div className="flex items-start gap-3 mt-3">
              {poDetails?.approval_levels?.map((level: ApprovalLevel) => (
                <div className="space-y-2" key={level.id}>
                  {level.status_label.toLowerCase() === "rejected" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(
                            level.status_label
                          )}`}
                        >
                          {`${level.name} Approval : ${level.status_label}`}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Rejection Reason:{" "}
                          {level.rejection_reason ?? "No reason provided"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div
                      className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(
                        level.status_label
                      )}`}
                    >
                      {`${level.name} Approval : ${level.status_label}`}
                    </div>
                  )}
                  {level.approved_by && level.approval_date && (
                    <div className="ms-2">
                      {`${level.approved_by} (${level.approval_date})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {poDetails.show_send_sap_yes && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleSendToSap}
              >
                Send To SAP Team
              </Button>
            )}
            {poDetails.all_level_approved && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleOpenDebitCreditModal}
                >
                  Debit/Credit Note
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate(`/finance/po/add?clone=${id}`)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate(`/finance/po/feeds/${id}`)}
            >
              <Rss className="w-4 h-4 mr-1" />
              Feeds
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-center">
              Billing Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Phone</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.phone ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Email</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.email ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">PAN</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.pan_number ?? "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Fax</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.fax ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">GST</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.gst_number ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Address</span>
                  <span className="font-medium">
                    : {poDetails.billing_address?.address ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-center">
              Purchase Order{" "}
              {poDetails.all_level_approved ? "(Approved)" : "(Pending)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-44">PO No.</span>
                  <span className="font-medium">
                    : {poDetails.external_id ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">PO Date</span>
                  <span className="font-medium">
                    :{" "}
                    {poDetails.po_date
                      ? format(new Date(poDetails.po_date), "dd-MM-yyyy")
                      : "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Plant Detail
                  </span>
                  <span className="font-medium">
                    : {poDetails.plant_detail?.plant_name ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">Address</span>
                  <span className="font-medium">
                    : {poDetails.supplier?.address ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">Email</span>
                  <span className="font-medium">
                    : {poDetails.supplier?.email ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">PAN</span>
                  <span className="font-medium">
                    : {poDetails.supplier?.pan_number ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">Phone</span>
                  <span className="font-medium">
                    : {poDetails.supplier?.mobile1 ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">Related To</span>
                  <span className="font-medium">
                    : {poDetails.related_to ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Retention(%)
                  </span>
                  <span className="font-medium">
                    : {poDetails.retention ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">QC(%)</span>
                  <span className="font-medium">
                    : {poDetails.quality_holding ?? "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Reference No.
                  </span>
                  <span className="font-medium">
                    : {poDetails.reference_number ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">ID</span>
                  <span className="font-medium">: {poDetails.id ?? "-"}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">Supplier</span>
                  <span className="font-medium">
                    : {poDetails.supplier?.company_name ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">GST</span>
                  <span className="font-medium">: {poDetails.gst ?? "-"}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Delivery Address
                  </span>
                  <span className="font-medium">
                    : {poDetails.shipping_address?.title ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Payment Tenure(In Days)
                  </span>
                  <span className="font-medium">
                    : {poDetails.payment_tenure ?? "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">TDS(%)</span>
                  <span className="font-medium">: {poDetails.tds ?? "-"}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-44">
                    Advance Amount
                  </span>
                  <span className="font-medium">
                    : {poDetails.advance_amount ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">PO Items</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={inventoryTableData}
              columns={inventoryTableColumns}
              storageKey="po-items-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="po-items-details"
              pagination={true}
              pageSize={10}
              emptyMessage="No PO items available"
              className="min-w-[1200px] h-max"
              loading={loading}
              renderCell={renderCell}
            />
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Net Amount (INR):
                  </span>
                  <span className="font-medium">
                    {poDetails.net_amount_formatted ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total Taxable Value Of PO:
                  </span>
                  <span className="font-medium">
                    {poDetails.net_amount_formatted ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Taxes (INR):
                  </span>
                  <span className="font-medium">
                    {poDetails.total_taxable_amount ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total PO Value (INR):
                  </span>
                  <span className="font-medium">
                    {poDetails.total_amount_formatted ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-medium text-gray-700">
                    Amount In Words:
                  </span>
                  <span className="font-medium">
                    {numberToIndianCurrencyWords(
                      parseFloat(poDetails.total_amount_formatted || "0")
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-wrap break-words">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  Notes:
                </h3>
                <div className="text-gray-700 ml-4">
                  {poDetails.billing_address?.notes?.length ? (
                    <ol className="list-decimal">
                      {poDetails.billing_address.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-muted-foreground">No notes available</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  Terms & Conditions:
                </h3>
                <p className="text-muted-foreground ml-4">
                  {poDetails.terms_conditions ??
                    "No terms and conditions available"}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-900 font-medium">
                  For {poDetails.supplier?.company_name || "-"} We Confirm &
                  Accept,
                </p>
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  Authorised Signatory
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(poDetails.attachments) &&
              poDetails.attachments.length > 0 ? (
              <div className="flex items-center flex-wrap gap-4">
                {poDetails.attachments.map((attachment: Attachment) => {
                  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
                    attachment.url
                  );
                  const isPdf = /\.pdf$/i.test(attachment.url);
                  const isExcel = /\.(xls|xlsx|csv)$/i.test(attachment.url);
                  const isWord = /\.(doc|docx)$/i.test(attachment.url);
                  const isDownloadable = isPdf || isExcel || isWord;

                  return (
                    <div
                      key={attachment.id}
                      className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                    >
                      {isImage ? (
                        <>
                          <button
                            className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                            title="View"
                            onClick={() => {
                              setSelectedAttachment(attachment);
                              setIsPreviewModalOpen(true);
                            }}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <img
                            src={attachment.url}
                            alt={
                              attachment.document_name ||
                              attachment.document_file_name
                            }
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedAttachment(attachment);
                              setIsPreviewModalOpen(true);
                            }}
                          />
                        </>
                      ) : isPdf ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : isExcel ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                      ) : isWord ? (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                          <File className="w-6 h-6" />
                        </div>
                      )}
                      <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                        {attachment.document_name ||
                          attachment.document_file_name ||
                          `Document_${attachment.id}`}
                      </span>
                      {isDownloadable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                          onClick={() => {
                            setSelectedAttachment(attachment);
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No attachments</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">GRN Details</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={grnTableData}
              columns={grnDetailsColumns}
              renderCell={(item, columnKey) => {
                const value = item[columnKey] ?? "-";
                return value;
              }}
              renderActions={(item) => (
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1"
                  onClick={() => navigate(`/finance/grn-srn/details/${item.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              storageKey="po-grn-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="grn-details"
              pagination={true}
              pageSize={10}
              emptyMessage="No GRN details available"
              className="min-w-[1800px] h-max"
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={paymentTableData}
              columns={paymentDetailsColumns}
              storageKey="payment-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="payment-details"
              pagination={true}
              pageSize={10}
              emptyMessage="No payment details available"
              className="h-max"
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">
              Debit/Credit Note Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={debitCreditTableData}
              columns={debitNoteDetailsColumns}
              renderCell={(item, columnKey) => {
                return item[columnKey] || "-";
              }}
              storageKey="debit-credit-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="debit-credit-details"
              pagination={true}
              pageSize={10}
              emptyMessage="No debit/credit notes available"
              className="h-max"
              loading={loading}
            />
          </CardContent>
        </Card>

        {shouldShowButtons && (
          <div className="flex items-center justify-center gap-4 my-6">
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              className="bg-[#C72030] text-white hover:bg-[#a61b27]"
              onClick={() => setOpenRejectDialog(true)}
            >
              Reject
            </Button>
          </div>
        )}

        <Dialog
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reject Purchase Order</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Rejection"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              variant="outlined"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  height: "auto !important",
                  padding: "2px !important",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenRejectDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              className="bg-[#C72030] text-white hover:bg-[#a61b27]"
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDebitCreditModal}
          onClose={handleCloseDebitCreditModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Debit/Credit Notes</DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                mt: 1,
              }}
            >
              <InputLabel shrink>Select Type</InputLabel>
              <Select
                label="Select Type"
                value={debitCreditForm.type}
                onChange={handleDebitCreditChange}
                displayEmpty
                name="type"
                sx={{
                  height: {
                    xs: 28,
                    sm: 36,
                    md: 45,
                  },
                  "& .MuiInputBase-input, & .MuiSelect-select": {
                    padding: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                <MenuItem value="Debit">Debit</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={debitCreditForm.amount}
              onChange={handleDebitCreditChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={debitCreditForm.description}
              onChange={handleDebitCreditChange}
              multiline
              rows={2}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  height: "auto !important",
                  padding: "2px !important",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDebitCreditModal}>Close</Button>
            <Button
              onClick={handleSubmitDebitCredit}
              style={{ backgroundColor: "#6B46C1", color: "white" }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <AttachmentPreviewModal
          isModalOpen={isPreviewModalOpen}
          setIsModalOpen={setIsPreviewModalOpen}
          selectedDoc={selectedAttachment}
          setSelectedDoc={setSelectedAttachment}
        />
      </div>
    </div >
  );
};
