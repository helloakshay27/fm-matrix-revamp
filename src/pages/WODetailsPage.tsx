import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Edit,
  Copy,
  Printer,
  Rss,
  ArrowLeft,
  FileText,
  File,
  Eye,
  FileSpreadsheet,
  Download,
  ScrollText,
  ReceiptText,
  ClipboardList,
  Images,
  Loader2,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  approveRejectWO,
  getWorkOrderById,
} from "@/store/slices/workOrderSlice";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import InvoiceModal from "@/components/InvoiceModal";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import DebitCreditModal from "@/components/DebitCreditModal";

interface Approval {
  id: string;
  level: string;
  status: string;
  updated_by?: string;
  updated_at?: string;
  rejection_reason?: string;
}

interface Attachment {
  id: number;
  url: string;
  document_name?: string;
  document_file_name?: string;
}

const boqColumns: ColumnConfig[] = [
  { key: "sno", label: "S.No", sortable: true, draggable: true },
  { key: "boq_details", label: "BOQ Details", sortable: true, draggable: true },
  { key: "quantity", label: "Quantity", sortable: true, draggable: true },
  { key: "uom", label: "UOM", sortable: true, draggable: true },
  {
    key: "expected_date",
    label: "Expected Date",
    sortable: true,
    draggable: true,
  },
  {
    key: "product_description",
    label: "Product Description",
    sortable: true,
    draggable: true,
  },
  { key: "rate", label: "Rate", sortable: true, draggable: true },
  { key: "cgst_rate", label: "CGST Rate(%)", sortable: true, draggable: true },
  { key: "cgst_amount", label: "CGST Amount", sortable: true, draggable: true },
  { key: "sgst_rate", label: "SGST Rate(%)", sortable: true, draggable: true },
  { key: "sgst_amount", label: "SGST Amount", sortable: true, draggable: true },
  { key: "igst_rate", label: "IGST Rate(%)", sortable: true, draggable: true },
  { key: "igst_amount", label: "IGST Amount", sortable: true, draggable: true },
  { key: "tcs_rate", label: "TCS Rate(%)", sortable: true, draggable: true },
  { key: "tcs_amount", label: "TCS Amount", sortable: true, draggable: true },
  { key: "tax_amount", label: "Tax Amount", sortable: true, draggable: true },
  {
    key: "total_amount",
    label: "Total Amount",
    sortable: true,
    draggable: true,
  },
];

const invoiceColumns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  {
    key: "invoice_number",
    label: "Invoice Number",
    sortable: true,
    draggable: true,
  },
  {
    key: "invoice_date",
    label: "Invoice Date",
    sortable: true,
    draggable: true,
  },
  {
    key: "total_amount",
    label: "Total Invoice Amount",
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
  { key: "wo_number", label: "W.O. Number", sortable: true, draggable: true },
  {
    key: "physical_sent",
    label: "Physical Invoice Sent to Accounts",
    sortable: true,
    draggable: true,
  },
  {
    key: "physical_received",
    label: "Physical Invoice Received",
    sortable: true,
    draggable: true,
  },
];

const paymentColumn: ColumnConfig[] = [
  { key: "invoice_id", label: "Invoice ID", sortable: true, draggable: true },
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
    label: "Date of Entry",
    sortable: true,
    draggable: true,
  },
];

const debitCreditColumns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true },
  { key: "description", label: "Description", sortable: true, draggable: true },
  { key: "approved", label: "Approved", sortable: true, draggable: true },
  { key: "approved_on", label: "Approved On", sortable: true, draggable: true },
  { key: "approved_by", label: "Approved By", sortable: true, draggable: true },
  { key: "created_on", label: "Created On", sortable: true, draggable: true },
  { key: "created_by", label: "Created By", sortable: true, draggable: true },
  { key: "attachments", label: "Attachments", sortable: true, draggable: true },
];

export const WODetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");

  const shouldShowButtons = Boolean(levelId && userId);

  const { id } = useParams();
  const navigate = useNavigate();

  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [relatedTo, setRelatedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [openDebitCreditModal, setOpenDebitCreditModal] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [debitCreditNote, setDebitCreditNote] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [printing, setPrinting] = useState(false)
  const [debitCreditForm, setDebitCreditForm] = useState({
    type: "",
    amount: "",
    description: "",
  });
  const [buttonCondition, setButtonCondition] = useState({
    showSap: false,
    editWbsCode: false,
  });
  const [externalApiCalls, setExternalApiCalls] = useState<any[]>([]);

  const [workOrder, setWorkOrder] = useState({
    letter_of_indent: false,
    plant_detail_id: null,
    external_id: null,
    all_level_approved: false,
    lup: { has: { send_to_sap: { create: false } } },
    id: id,
    company: {
      site_name: "",
      phone: "",
      fax: "",
      email: "",
      gst: "",
      pan: "",
      address: "",
    },
    work_order: {
      wo_status: "",
      number: "",
      wo_date: "",
      kind_attention: "",
      subject: "",
      related_to: "",
      advance_amount: "",
      description: "",
      reference_number: "",
      id: "",
      contractor: "",
      contractorAddress: "",
      supplier_address: {
        address: "",
      },
      supplier_details: {
        mobile1: "",
        email: "",
        gstin_number: "",
        pan_number: "",
      },
      category_type: "",
      payment_terms: { payment_tenure: "", retention: "", tds: "", qc: "" },
      term_condition: "",
    },
    inventories: [],
    totals: { net_amount: "", total_taxable: "", taxes: "", total_value: "" },
    pms_po_inventories: [],
    attachments: [],
    approvals: [],
  });

  const handleDebitCreditChange = (e) => {
    const { name, value } = e.target;
    setDebitCreditForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchWorkOrder = async () => {
    try {
      const response = await dispatch(
        getWorkOrderById({ baseUrl, token, id })
      ).unwrap();
      setWorkOrder(response.page);
      setDebitCreditNote(response.page.debit_credit_notes);
      setInvoices(response.page.invoices);
      setButtonCondition({
        showSap: response.show_send_sap_yes,
        editWbsCode: response.can_edit_wbs_codes,
      });
      // Set external API calls if available
      if (response.page?.external_api_calls && Array.isArray(response.page.external_api_calls)) {
        setExternalApiCalls(response.page.external_api_calls);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, []);

  // Mock payment data
  const paymentData = [];

  const handleCloseInvoiceModal = () => {
    setOpenInvoiceModal(false);
    setInvoiceNumber("");
    setInvoiceDate("");
    setAdjustmentAmount("");
    setPostingDate("");
    setNotes("");
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

  const handleOpenDebitCreditModal = () => {
    setOpenDebitCreditModal(true);
  };

  const handleCloseDebitCreditModal = () => {
    setOpenDebitCreditModal(false);
  };

  const handleSubmitDebitCredit = async () => {
    try {
      const payload = {
        debit_note: {
          amount: debitCreditForm.amount,
          note: debitCreditForm.description,
          note_type: debitCreditForm.type,
          resource_id: Number(id),
          resource_type: "Pms::WorkOrder",
        },
      };

      await axios.post(`https://${baseUrl}/debit_notes.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchWorkOrder();
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

  const handleApprove = async () => {
    const payload = {
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: true,
    };
    try {
      await dispatch(
        approveRejectWO({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("Work Order approved successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleRejectClick = () => {
    setOpenRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const payload = {
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: false,
      rejection_reason: rejectComment,
    };

    try {
      await dispatch(
        approveRejectWO({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("Work Order rejected successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setOpenRejectDialog(false);
      setRejectComment("");
    }
  };

  const handleRejectCancel = () => {
    setOpenRejectDialog(false);
    setRejectComment("");
  };

  const handleSendToSap = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/work_orders/${id}.json?send_sap=yes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send to SAP");
    }
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/work_orders/${id}/print_pdf.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "work_order.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      {/* Header */}
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-semibold">WORK ORDER DETAILS</h1>
        <div className="flex gap-2 flex-wrap">
          {buttonCondition.showSap && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white sap_button"
              onClick={handleSendToSap}
            >
              Send To SAP Team
            </Button>
          )}
          {workOrder.all_level_approved === null && !shouldShowButtons && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300"
              onClick={() => navigate(`/finance/wo/edit/${id}`)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
          {
            !shouldShowButtons && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => navigate(`/finance/wo/add?clone=${id}`)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Clone
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} disabled={printing}>
                  {
                    printing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Print
                      </>
                    ) : (
                      <>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </>
                    )
                  }
                </Button>
              </>
            )
          }
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300"
            onClick={() => navigate(`/finance/wo/feeds/${id}`)}
          >
            <Rss className="w-4 h-4 mr-1" />
            Feeds
          </Button>
          {workOrder.all_level_approved && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setOpenInvoiceModal(true)}
              >
                Add Invoice
              </Button>
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
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-start gap-3 my-4">
          {workOrder?.approvals?.map((approval: Approval) => (
            <div className="space-y-2" key={approval.id}>
              {approval.status.toLowerCase() === "rejected" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(
                        approval.status
                      )}`}
                    >
                      {`${approval.level} Approval : ${approval.status}`}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Rejection Reason:{" "}
                      {approval.rejection_reason ?? "No reason provided"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div
                  className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(
                    approval.status
                  )}`}
                >
                  {`${approval.level} Approval : ${approval.status}`}
                </div>
              )}
              {approval.updated_by && approval.updated_at && (
                <div className="ms-2 w-[190px]">
                  {`${approval.updated_by} (${format(
                    new Date(approval.updated_at),
                    "dd/MM/yyyy"
                  )})`}
                </div>
              )}
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ReceiptText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]"> {workOrder.company?.site_name}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Phone</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.phone}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Fax</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.fax}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Email</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.email}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">GST</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.gst}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">PAN</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.pan}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Address</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.company?.address}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Work Order</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">WO Number</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.number || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Reference No.</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.reference_number}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]"> WO Date</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {workOrder.work_order?.wo_date
                ? format(workOrder.work_order?.wo_date, "dd/MM/yyyy")
                : "-"}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">ID</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.id}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Kind Attention</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.kind_attention || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Contractor</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.contractor}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Subject</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.subject || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Address</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.supplier_address?.address}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Related To</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.related_to || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Phone</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.supplier_details?.mobile1}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Payment Tenure</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order.payment_terms?.payment_tenure || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Email</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.supplier_details?.email}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Retention(%)</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order.payment_terms?.retention || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">GST</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.supplier_details?.gstin_number}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">TDS(%)</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order.payment_terms?.tds || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">PAN</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.supplier_details?.pan_number}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">QC(%)</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order.payment_terms?.qc || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Work Category</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.category_type}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Advance Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.advance_amount || "-"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Description</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{workOrder.work_order?.description || "-"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BOQ Details</h3>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={workOrder.inventories}
            columns={boqColumns}
            storageKey="boq-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="boq-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No BOQ data available"
            className="min-w-[1200px] h-max"
            renderCell={(item, columnKey) => {
              if (columnKey === "total_amount") {
                return <span className="font-medium">{item[columnKey]}</span>;
              } else if (columnKey === "expected_date") {
                return (
                  <span className="font-medium">
                    {item[columnKey]
                      ? format(item[columnKey], "dd/MM/yyyy")
                      : "-"}
                  </span>
                );
              }
              return item[columnKey];
            }}
          />
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Net Amount (INR):</span>
            <span className="font-medium">{workOrder.totals?.net_amount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">
              Total Taxable Value Of WO:
            </span>
            <span className="font-medium">
              {workOrder.totals?.total_taxable}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">{workOrder.totals?.taxes}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-semibold text-gray-900">
              Total WO Value (INR):
            </span>
            <span className="font-semibold">
              {workOrder.totals?.total_value}
            </span>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Amount In Words: </span>
            <span className="text-gray-900">
              {numberToIndianCurrencyWords(workOrder.totals?.total_value)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Terms & Conditions</h3>
        </div>
        <p className="text-gray-700">{workOrder.work_order?.term_condition}</p>

        <div className="mt-6">
          <p className="text-gray-900 font-medium">
            For jyoti We Confirm & Accept,
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-medium text-gray-900">
              PREPARED BY: Robert Day2
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">SIGNATURE:</p>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border border-border mb-6">
        <div className="flex items-center gap-3 p-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Images className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Attachments</h3>
        </div>
        <CardContent>
          {Array.isArray(workOrder.attachments) &&
            workOrder.attachments.length > 0 ? (
            <div className="flex items-center flex-wrap gap-4">
              {workOrder.attachments.map((attachment: Attachment) => {
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ReceiptText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Invoices/SES Details</h3>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={invoices}
            columns={invoiceColumns}
            renderCell={(item, columnKey) => {
              return item[columnKey] || "-";
            }}
            storageKey="invoice-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="invoice-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No invoice data available"
            className="min-w-[1000px] h-max"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ReceiptText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]"> Payment Details</h3>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={paymentData}
            columns={paymentColumn}
            storageKey="payment-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="payment-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No payment data available"
            className="min-w-[800px] h-max"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ReceiptText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]"> Debit/Credit Note Details</h3>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={debitCreditNote || []}
            columns={debitCreditColumns}
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
            emptyMessage="No data available"
            className="min-w-[1000px] h-max"
          />
        </div>
      </div>

      {shouldShowButtons && (
        <div className="flex items-center justify-center gap-4">
          <button
            className="bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="bg-[#C72030] text-white py-2 px-4 rounded-md"
            onClick={handleRejectClick}
          >
            Reject
          </button>
        </div>
      )}

      <Dialog
        open={openRejectDialog}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Work Order</DialogTitle>
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
          <Button onClick={handleRejectCancel} variant="outline">
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

      <DebitCreditModal
        options={["Debit", "Credit"]}
        openDebitCreditModal={openDebitCreditModal}
        handleCloseDebitCreditModal={handleCloseDebitCreditModal}
        debitCreditForm={debitCreditForm}
        handleDebitCreditChange={handleDebitCreditChange}
        handleSubmitDebitCredit={handleSubmitDebitCredit}
      />

      <InvoiceModal
        openInvoiceModal={openInvoiceModal}
        handleCloseInvoiceModal={handleCloseInvoiceModal}
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        adjustmentAmount={adjustmentAmount}
        setAdjustmentAmount={setAdjustmentAmount}
        postingDate={postingDate}
        setPostingDate={setPostingDate}
        notes={notes}
        relatedTo={relatedTo}
        setRelatedTo={setRelatedTo}
        setNotes={setNotes}
        fetchWorkOrder={fetchWorkOrder}
      />

      <AttachmentPreviewModal
        isModalOpen={isPreviewModalOpen}
        setIsModalOpen={setIsPreviewModalOpen}
        selectedDoc={selectedAttachment}
        setSelectedDoc={setSelectedAttachment}
      />

      {/* External API Calls Logs Section */}
      {externalApiCalls && externalApiCalls.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Rss className="w-5 h-5" />
            External API Calls
          </h3>
          <div className="space-y-4">
            {externalApiCalls.map((apiCall, index) => (
              <div key={apiCall.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Provider</p>
                    <p className="text-sm font-medium">{apiCall.api_provider || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Response Status Code</p>
                    <p className={`text-sm font-medium ${
                      apiCall.response_status === 200 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {apiCall.response_status || '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 font-semibold">Message</p>
                    <p className="text-sm bg-white p-2 rounded border border-gray-200 mt-1 font-mono whitespace-pre-wrap break-words">
                      {apiCall.eval_status && apiCall.eval_status.trim() 
                        ? apiCall.eval_status 
                        : (apiCall.response_string ? JSON.stringify(JSON.parse(apiCall.response_string), null, 2) : '-')}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">
                      Created: {apiCall.created_at ? new Date(apiCall.created_at).toLocaleString() : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
