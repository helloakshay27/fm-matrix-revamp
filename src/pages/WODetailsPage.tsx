import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Copy, Printer, Rss, ArrowLeft, Image, FileText, File } from "lucide-react";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

// Define the interface for Approval
interface Approval {
  id: string;
  level: string;
  status: string;
  updated_by?: string;
  updated_at?: string;
  rejection_reason?: string; // Added for rejection reason tooltip
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
  { key: "wbs_code", label: "Wbs Code", sortable: true, draggable: true },
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
    sortable: true, draggable: true,
  },
  {
    key: "invoice_date",
    label: "Invoice Date",
    sortable: true, draggable: true,
  },
  {
    key: "total_amount",
    label: "Total Invoice Amount",
    sortable: true, draggable: true,
  },
  {
    key: "payable_amount",
    label: "Payable Amount",
    sortable: true, draggable: true,
  },
  {
    key: "retention_amount",
    label: "Retention Amount",
    sortable: true, draggable: true,
  },
  { key: "tds_amount", label: "TDS Amount", sortable: true, draggable: true },
  { key: "qc_amount", label: "QC Amount", sortable: true, draggable: true },
  { key: "wo_number", label: "W.O. Number", sortable: true, draggable: true },
  {
    key: "physical_sent",
    label: "Physical Invoice Sent to Accounts",
    sortable: true, draggable: true,
  },
  {
    key: "physical_received",
    label: "Physical Invoice Received",
    sortable: true, draggable: true,
  },
];

const paymentColumn: ColumnConfig[] = [
  { key: "invoice_id", label: "Invoice ID", sortable: true, draggable: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true },
  {
    key: "payment_mode",
    label: "Payment Mode",
    sortable: true, draggable: true,
  },
  {
    key: "transaction_number",
    label: "Transaction Number",
    sortable: true, draggable: true,
  },
  { key: "status", label: "Status", sortable: true, draggable: true },
  {
    key: "payment_date",
    label: "Payment Date",
    sortable: true, draggable: true,
  },
  { key: "note", label: "Note", sortable: true, draggable: true },
  {
    key: "date_of_entry",
    label: "Date of Entry",
    sortable: true, draggable: true,
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
  const [debitCreditForm, setDebitCreditForm] = useState({
    type: "",
    amount: "",
    description: "",
  });
  const [buttonCondition, setButtonCondition] = useState({
    showSap: false,
    editWbsCode: false
  });

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
      supplier_details: {
        mobile1: "",
        email: "",
        gstin_number: "",
        pan_number: "",
      },
      work_category: "",
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
        editWbsCode: response.can_edit_wbs_codes
      });
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
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/work_orders/${id}/print_pdf.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'work_order.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className='p-0'
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-semibold text-xl sm:text-2xl text-gray-900 mb-2">
            WORK ORDER DETAILS
          </h1>
          <TooltipProvider>
            <div className="flex items-start gap-3">
              {
                workOrder?.approvals?.map((approval: Approval) => (
                  <div className='space-y-2' key={approval.id}>
                    {approval.status.toLowerCase() === 'rejected' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(approval.status)}`}>
                            {`${approval.level} Approval : ${approval.status}`}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rejection Reason: {approval.rejection_reason ?? 'No reason provided'}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(approval.status)}`}>
                        {`${approval.level} Approval : ${approval.status}`}
                      </div>
                    )}
                    {
                      approval.updated_by && approval.updated_at &&
                      <div className='ms-2 w-[190px]'>
                        {`${approval.updated_by} (${format(new Date(approval.updated_at), 'dd/MM/yyyy')})`}
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </TooltipProvider>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {
              buttonCondition.showSap && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-purple-600 text-white sap_button"
                  onClick={handleSendToSap}
                >
                  Send To SAP Team
                </Button>
              )
            }
            {
              buttonCondition.editWbsCode && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#wbsBulkModal"
                >
                  Edit WBS Codes
                </Button>
              )
            }
            <Button size="sm" variant="outline" className="border-gray-300" onClick={() => navigate(`/finance/wo/edit/${id}`)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate(`/finance/wo/add?clone=${id}`)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Clone
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
            <Button size="sm" variant="outline" className="border-gray-300" onClick={() => navigate(`/finance/wo/feeds/${id}`)}>
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
      </div>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {workOrder.company?.site_name}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {workOrder.company?.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {workOrder.company?.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {workOrder.company?.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {workOrder.company?.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {workOrder.company?.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Address
                </span>
                <span className="ml-5">: {workOrder.company?.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Work Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Work Order ({workOrder.work_order?.wo_status})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                WO Number
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.number || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                WO Date
              </span>
              <span className="text-sm">: {workOrder.work_order?.wo_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Kind Attention
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.kind_attention || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Subject
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.subject || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Related To
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.related_to || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Payment Tenure(In Days)
              </span>
              <span className="text-sm">
                : {workOrder.work_order.payment_terms?.payment_tenure || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Retention(%)
              </span>
              <span className="text-sm">
                : {workOrder.work_order.payment_terms?.retention || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                TDS(%)
              </span>
              <span className="text-sm">
                : {workOrder.work_order.payment_terms?.tds || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                QC(%)
              </span>
              <span className="text-sm">
                : {workOrder.work_order.payment_terms?.qc || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Advance Amount
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.advance_amount || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Description
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.description || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Reference No.
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.reference_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">ID</span>
              <span className="text-sm">: {workOrder.work_order?.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Contractor
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.contractor}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Address
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.contractorAddress}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Phone
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.supplier_details?.mobile1}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Email
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.supplier_details?.email}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                GST
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.supplier_details?.gstin_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                PAN
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.supplier_details?.pan_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Work Category
              </span>
              <span className="text-sm">
                : {workOrder.work_order?.work_category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOQ Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          BOQ Details
        </h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Terms & Conditions :
        </h3>
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
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(workOrder.attachments) && workOrder.attachments.length > 0 ? (
            <div className="space-y-3">
              {workOrder.attachments.map((attachment: any) => {
                const getFileIcon = (fileName: string) => {
                  const ext = fileName.split(".").pop()?.toLowerCase();
                  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) {
                    return <Image className="w-5 h-5 text-blue-600" />;
                  }
                  if (ext === "pdf") {
                    return <FileText className="w-5 h-5 text-red-600" />;
                  }
                  return <File className="w-5 h-5 text-gray-600" />;
                };

                return (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedAttachment(attachment);
                      setIsPreviewModalOpen(true);
                    }}
                  >
                    {getFileIcon(attachment.document_file_name)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {attachment.document_file_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text-muted-foreground'>
              No attachments
            </p>
          )}
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoices/SES Details
        </h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Debit/Credit Note Details
        </h3>
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
            rows={4}
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
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedAttachment(null);
        }}
        attachment={selectedAttachment}
      />
    </div>
  );
};