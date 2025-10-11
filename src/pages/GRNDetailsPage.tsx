import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Contact,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  Images,
  Printer,
  Rss,
  ScrollText,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchSingleGRN, approveGRN, rejectGrn } from "@/store/slices/grnSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import axios from "axios";
import DebitCreditModal from "@/components/DebitCreditModal";
import { format } from "date-fns";

// Define the interface for Approval
interface Approval {
  id: string;
  name: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string; // Added for rejection reason tooltip
}

interface Attachment {
  id: number;
  document_url?: string;
  filename?: string;
}

// Define column configurations
const itemsColumns: ColumnConfig[] = [
  { key: "sno", label: "S.No.", sortable: true, draggable: true },
  {
    key: "inventory_name",
    label: "Inventory",
    sortable: true,
    draggable: true,
  },
  {
    key: "expected_quantity",
    label: "Expected Quantity",
    sortable: true,
    draggable: true,
  },
  {
    key: "received_quantity",
    label: "Received Quantity",
    sortable: true,
    draggable: true,
  },
  // { key: "unit_type", label: "Unit", sortable: true, draggable: true },
  { key: "rate", label: "Rate", sortable: true, draggable: true },
  {
    key: "approved_qty",
    label: "Approved Qty",
    sortable: true,
    draggable: true,
  },
  {
    key: "rejected_qty",
    label: "Rejected Qty",
    sortable: true,
    draggable: true,
  },
  { key: "cgst_rate", label: "CGST Rate", sortable: true, draggable: true },
  { key: "cgst_amount", label: "CGST Amount", sortable: true, draggable: true },
  { key: "sgst_rate", label: "SGST Rate", sortable: true, draggable: true },
  { key: "sgst_amount", label: "SGST Amount", sortable: true, draggable: true },
  { key: "igst_rate", label: "IGST Rate", sortable: true, draggable: true },
  { key: "igst_amount", label: "IGST Amount", sortable: true, draggable: true },
  { key: "tcs_rate", label: "TCS Rate", sortable: true, draggable: true },
  { key: "tcs_amount", label: "TCS Amount", sortable: true, draggable: true },
  {
    key: "taxable_value",
    label: "Total Taxes",
    sortable: true,
    draggable: true,
  },
  {
    key: "total_value",
    label: "Total Amount",
    sortable: true,
    draggable: true,
  },
];

const debitNoteColumns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true },
  { key: "description", label: "Description", sortable: true, draggable: true },
  { key: "approved", label: "Approved", sortable: true, draggable: true },
  { key: "approved_at", label: "Approved On", sortable: true, draggable: true },
  { key: "approved_by", label: "Approved By", sortable: true, draggable: true },
  { key: "created_at", label: "Created On", sortable: true, draggable: true },
  { key: "created_by", label: "Created By", sortable: true, draggable: true },
];

export const GRNDetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");

  const shouldShowButtons = Boolean(levelId && userId);

  const navigate = useNavigate();
  const { id } = useParams();

  const [openDebitModal, setOpenDebitModal] = useState(false);
  const [grnDetails, setGrnDetails] = useState<any>({});
  const [rejectComment, setRejectComment] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [sendToSap, setSendToSap] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [debitForm, setDebitForm] = useState({
    type: "",
    amount: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const response = await dispatch(
        fetchSingleGRN({ baseUrl, token, id: Number(id) })
      ).unwrap();
      setGrnDetails(response.grn || {});
      setSendToSap(response.show_send_sap_yes);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [dispatch, baseUrl, token, id]);

  // Helper for safe access
  const purchaseOrder = grnDetails.purchase_order || {};
  const supplier = grnDetails.supplier || {};
  const billingAddress = purchaseOrder.billing_address || {};
  const approvalStatus = grnDetails.approval_status || {};

  const handlePrint = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/grns/${id}/print_pdf.pdf`,
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
      link.download = "grn.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleFeeds = () => {
    navigate(`/finance/grn-srn/feeds/${id}`);
  };

  const handleApprove = async () => {
    const payload = {
      level_id: levelId,
      approve: "true",
      user_id: userId,
    };
    try {
      await dispatch(
        approveGRN({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("GRN approved successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error) {
      console.log(error);
      toast.error(error);
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

  const handleRejectClick = () => {
    setOpenRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const payload = {
      level_id: levelId,
      approve: "false",
      user_id: userId,
      rejection_reason: rejectComment,
    };

    try {
      await dispatch(
        rejectGrn({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("GRN rejected successfully");
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

  const handleOpenDebitModal = () => {
    setOpenDebitModal(true);
  };

  const handleCloseDebitModal = () => {
    setOpenDebitModal(false);
  };

  const handleDebitChange = (e) => {
    const { name, value } = e.target;
    setDebitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDebit = async () => {
    try {
      const payload = {
        debit_note: {
          amount: debitForm.amount,
          note: debitForm.description,
          note_type: debitForm.type,
          resource_id: Number(id),
          resource_type: "Pms::Grn",
        },
      };

      await axios.post(`https://${baseUrl}/debit_notes.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setDebitForm({
        type: "",
        amount: "",
        description: "",
      });
      toast.success("Debit note created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      handleCloseDebitModal();
    }
  };

  const renderDebitNoteCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approved":
        return item[columnKey] ? "Yes" : "No";
      default:
        return item[columnKey] || "-";
    }
  }

  // Transform grn_inventories to include S.No.
  const itemsData =
    grnDetails.grn_inventories?.map((item: any, index: number) => ({
      ...item,
      sno: index + 1,
    })) || [];

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      {/* Header */}
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-semibold">
          GRN DETAILS
        </h1>
        <div className="flex gap-2 flex-wrap">
          {sendToSap && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
            >
              Send to SAP
            </Button>
          )}
          {
            grnDetails.all_level_approved && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleOpenDebitModal}
              >
                Debit Note
              </Button>
            )
          }
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleFeeds}
          >
            <Rss className="w-4 h-4 mr-1" />
            Feeds
          </Button>
          {
            !shouldShowButtons && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
            )
          }
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-3 my-4">
          {approvalStatus?.approval_levels?.map((approval: Approval) => (
            <div className="space-y-2" key={approval.id}>
              {approval.status.toLowerCase() === "rejected" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(
                        approval.status
                      )}`}
                    >
                      {`${approval.name} Approval : ${approval.status}`}
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
                  {`${approval.name} Approval : ${approval.status}`}
                </div>
              )}
              {approval.approved_by && approval.approved_at && (
                <div className="ms-2 w-[190px]">
                  {`${approval.approved_by} (${approval.approved_at})`}
                </div>
              )}
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Contact className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">{billingAddress.building_name}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Phone</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.phone}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Fax</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.fax}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Email</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.email}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">GST</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.gst_number}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">PAN</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.pan_number}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[140px]">Address</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">
              {billingAddress.address}
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">GRN</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Invoice Number</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.invoice_no}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Reference No.</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{purchaseOrder.reference_number}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Invoice Date</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails?.bill_date && format(grnDetails.bill_date, "dd/MM/yyyy")}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">ID</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.id}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Posting Date</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails?.posting_date && format(grnDetails.posting_date, "dd/MM/yyyy")}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Supplier Name</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{supplier.company_name}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Retention Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.retention_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">PO Number</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{purchaseOrder.reference_number}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">TDS Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.tds_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">QC Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.qh_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">PO Reference Number</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{purchaseOrder.reference_number}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Total Taxes</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.total_taxes}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">GRN Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.grn_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">PO Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{purchaseOrder.amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Payment Mode</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.payment_mod}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Invoice Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.invoice_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Payable Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.payable_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">GRN Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.grn_amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Physical Invoice sent to</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.invoice_sent_at}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Physical Invoice received on</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.invoice_received_at}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Gross Amount</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.amount}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Related To</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.related_to}</span>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 min-w-[180px]">Notes</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-900 font-medium">{grnDetails.notes}</span>
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Items Table</h3>
        </div>
        <EnhancedTable
          data={itemsData}
          renderCell={(item: any, columnKey: string) => {
            switch (columnKey) {
              default:
                return item[columnKey];
            }
          }}
          columns={itemsColumns}
          storageKey="grn-items-table"
          emptyMessage="No items available"
          pagination={true}
          pageSize={10}
          hideColumnsButton={true}
          hideTableSearch={true}
          hideTableExport={true}
        />
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Other Expense:</span>
              <span className="font-medium">{grnDetails.other_expenses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Loading Expense:
              </span>
              <span className="font-medium">{grnDetails.loading_expense}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Adjustment Amount:
              </span>
              <span className="font-medium">{grnDetails.adj_amount}</span>
            </div>
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
          {Array.isArray(grnDetails.attachments?.general_attachments) &&
            grnDetails.attachments.general_attachments.length > 0 ? (
            <div className="flex items-center flex-wrap gap-4">
              {grnDetails.attachments.general_attachments.map(
                (attachment: Attachment) => {
                  const isImage =
                    attachment.document_url &&
                    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
                      attachment.document_url
                    );
                  const isPdf =
                    attachment.document_url &&
                    /\.pdf$/i.test(attachment.document_url);
                  const isExcel =
                    attachment.document_url &&
                    /\.(xls|xlsx|csv)$/i.test(attachment.document_url);
                  const isWord =
                    attachment.document_url &&
                    /\.(doc|docx)$/i.test(attachment.document_url);
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
                              setSelectedAttachment({
                                id: attachment.id,
                                url: attachment.document_url,
                                document_name: attachment.filename,
                              });
                              setIsPreviewModalOpen(true);
                            }}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <img
                            src={attachment.document_url}
                            alt={attachment.filename}
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedAttachment({
                                id: attachment.id,
                                url: attachment.document_url,
                                document_name: attachment.filename,
                              });
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
                        {attachment.filename || `Document_${attachment.id}`}
                      </span>
                      {isDownloadable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                          onClick={() => {
                            setSelectedAttachment({
                              id: attachment.id,
                              url: attachment.document_url,
                              document_name: attachment.filename,
                            });
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No attachments</p>
          )}
        </CardContent>
      </Card>

      {/* Debit Note Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Debit Note Details</h3>
        </div>
        <EnhancedTable
          data={grnDetails.debit_notes || []}
          columns={debitNoteColumns}
          storageKey="grn-debit-notes-table"
          emptyMessage="No debit notes available"
          pagination={true}
          pageSize={10}
          hideColumnsButton={true}
          hideTableExport={true}
          hideTableSearch={true}
          renderCell={renderDebitNoteCell}
        />
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
            rows={4}
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            variant="outlined"
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
        options={["Debit"]}
        openDebitCreditModal={openDebitModal}
        handleCloseDebitCreditModal={handleCloseDebitModal}
        debitCreditForm={debitForm}
        handleDebitCreditChange={handleDebitChange}
        handleSubmitDebitCredit={handleSubmitDebit}
      />

      <AttachmentPreviewModal
        isModalOpen={isPreviewModalOpen}
        setIsModalOpen={setIsPreviewModalOpen}
        selectedDoc={selectedAttachment}
        setSelectedDoc={setSelectedAttachment}
      />
    </div>
  );
};
