import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, File, FileText, Image, Printer, Rss } from "lucide-react";
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

// Define the interface for Approval
interface Approval {
  id: string;
  name: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string; // Added for rejection reason tooltip
}

// Define column configurations
const itemsColumns: ColumnConfig[] = [
  { key: 'sno', label: 'S.No.', sortable: true, draggable: true },
  { key: 'inventory_name', label: 'Inventory', sortable: true, draggable: true },
  { key: 'expected_quantity', label: 'Expected Quantity', sortable: true, draggable: true },
  { key: 'received_quantity', label: 'Received Quantity', sortable: true, draggable: true },
  { key: 'unit_type', label: 'Unit', sortable: true, draggable: true },
  { key: 'rate', label: 'Rate', sortable: true, draggable: true },
  { key: 'approved_qty', label: 'Approved Qty', sortable: true, draggable: true },
  { key: 'rejected_qty', label: 'Rejected Qty', sortable: true, draggable: true },
  { key: 'cgst_rate', label: 'CGST Rate', sortable: true, draggable: true },
  { key: 'cgst_amount', label: 'CGST Amount', sortable: true, draggable: true },
  { key: 'sgst_rate', label: 'SGST Rate', sortable: true, draggable: true },
  { key: 'sgst_amount', label: 'SGST Amount', sortable: true, draggable: true },
  { key: 'igst_rate', label: 'IGST Rate', sortable: true, draggable: true },
  { key: 'igst_amount', label: 'IGST Amount', sortable: true, draggable: true },
  { key: 'tcs_rate', label: 'TCS Rate', sortable: true, draggable: true },
  { key: 'tcs_amount', label: 'TCS Amount', sortable: true, draggable: true },
  { key: 'taxable_value', label: 'Total Taxes', sortable: true, draggable: true },
  { key: 'total_value', label: 'Total Amount', sortable: true, draggable: true },
];

const debitNoteColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'description', label: 'Description', sortable: true, draggable: true },
  { key: 'approved', label: 'Approved', sortable: true, draggable: true },
  { key: 'approved_on', label: 'Approved On', sortable: true, draggable: true },
  { key: 'approved_by', label: 'Approved By', sortable: true, draggable: true },
  { key: 'created_on', label: 'Created On', sortable: true, draggable: true },
  { key: 'created_by', label: 'Created By', sortable: true, draggable: true },
  {
    key: 'attachment',
    label: 'Attachment',
    sortable: false,
    draggable: true,
  },
];

const paymentDetailsColumns: ColumnConfig[] = [
  { key: 'action', label: 'Action', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'payment_mode', label: 'Payment Mode', sortable: true, draggable: true },
  { key: 'transaction_number', label: 'Transaction Number', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
  { key: 'payment_date', label: 'Payment Date', sortable: true, draggable: true },
  { key: 'note', label: 'Note', sortable: true, draggable: true },
  { key: 'date_of_entry', label: 'Date of Entry', sortable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, draggable: true },
];

const retentionPaymentColumns: ColumnConfig[] = [
  { key: 'action', label: 'Action', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'payment_mode', label: 'Payment Mode', sortable: true, draggable: true },
  { key: 'transaction_number', label: 'Transaction Number', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
  { key: 'payment_date', label: 'Payment Date', sortable: true, draggable: true },
  { key: 'note', label: 'Note', sortable: true, draggable: true },
  { key: 'date_of_entry', label: 'Date of Entry', sortable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, draggable: true },
];

const qcPaymentColumns: ColumnConfig[] = [
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'payment_mode', label: 'Payment Mode', sortable: true, draggable: true },
  { key: 'transaction_number', label: 'Transaction Number', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
  { key: 'payment_date', label: 'Payment Date', sortable: true, draggable: true },
  { key: 'note', label: 'Note', sortable: true, draggable: true },
  { key: 'date_of_entry', label: 'Date of Entry', sortable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, draggable: true, },
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

  const [grnDetails, setGrnDetails] = useState<any>({});
  const [rejectComment, setRejectComment] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [sendToSap, setSendToSap] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
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
    if (id) fetchData();
  }, [dispatch, baseUrl, token, id]);

  // Helper for safe access
  const purchaseOrder = grnDetails.purchase_order || {};
  const supplier = grnDetails.supplier || {};
  const billingAddress = purchaseOrder.billing_address || {};
  const approvalStatus = grnDetails.approval_status || {};

  const handlePrint = () => {
    window.print();
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

  // Transform grn_inventories to include S.No.
  const itemsData = grnDetails.grn_inventories?.map((item: any, index: number) => ({
    ...item,
    sno: index + 1,
  })) || [];

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
            GRN DETAILS
          </h1>
          <TooltipProvider>
            <div className="flex items-center gap-3">
              {
                approvalStatus?.approval_levels?.map((approval: Approval) => (
                  <div className='space-y-2' key={approval.id}>
                    {approval.status.toLowerCase() === 'rejected' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(approval.status)}`}>
                            {`${approval.name} Approval : ${approval.status}`}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rejection Reason: {approval.rejection_reason ?? 'No reason provided'}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(approval.status)}`}>
                        {`${approval.name} Approval : ${approval.status}`}
                      </div>
                    )}
                    {
                      approval.approved_by && approval.approved_at &&
                      <div className='ms-2 w-[190px]'>
                        {`${approval.approved_by} (${approval.approved_at})`}
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
            {sendToSap && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              >
                Send to SAP
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={handleFeeds}
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

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {billingAddress.building_name}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {billingAddress.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {billingAddress.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {billingAddress.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {billingAddress.gst_number}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {billingAddress.pan_number}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address</span>
                <span className="ml-5">: {billingAddress.address}</span>
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

      {/* Purchase Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          GRN
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Invoice Number</span>
              <span className="text-sm">: {grnDetails.invoice_no}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Invoice Date</span>
              <span className="text-sm">: {grnDetails.bill_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Posting Date</span>
              <span className="text-sm">: {grnDetails.posting_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Retention Amount</span>
              <span className="text-sm">: {grnDetails.retention_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">TDS Amount</span>
              <span className="text-sm">: {grnDetails.tds_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PO Reference Number</span>
              <span className="text-sm">: {purchaseOrder.reference_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">GRN Amount</span>
              <span className="text-sm">: {grnDetails.grn_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Payment Mode</span>
              <span className="text-sm">: {grnDetails.payment_mod}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Payable Amount</span>
              <span className="text-sm">: {grnDetails.payable_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Related To</span>
              <span className="text-sm">: {grnDetails.related_to}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Physical Invoice sent to</span>
              <span className="text-sm">: {grnDetails.invoice_sent_at}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Gross Amount</span>
              <span className="text-sm">: {grnDetails.amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Notes</span>
              <span className="text-sm">: {grnDetails.notes}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Reference No.</span>
              <span className="text-sm">: {purchaseOrder.reference_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">ID</span>
              <span className="text-sm">: {grnDetails.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Supplier Name</span>
              <span className="text-sm">: {supplier.company_name}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PO Number</span>
              <span className="text-sm">: {purchaseOrder.reference_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">QC Amount</span>
              <span className="text-sm">: {grnDetails.qh_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Total Taxes</span>
              <span className="text-sm">: {grnDetails.total_taxes}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PO Amount</span>
              <span className="text-sm">: {purchaseOrder.amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Invoice Amount</span>
              <span className="text-sm">: {grnDetails.invoice_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">GRN Amount</span>
              <span className="text-sm">: {grnDetails.grn_amount}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Physical Invoice received on</span>
              <span className="text-sm">: {grnDetails.invoice_received_at}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
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
              <span className="font-medium text-gray-700">Loading Expense:</span>
              <span className="font-medium">{grnDetails.loading_expense}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Adjustment Amount:</span>
              <span className="font-medium">{grnDetails.adj_amount}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border border-border mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(grnDetails.attachments?.general_attachments) && grnDetails.attachments.general_attachments.length > 0 ? (
            <div className="space-y-3">
              {grnDetails.attachments.general_attachments.map((attachment: any) => {
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
                    {getFileIcon(attachment.filename)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {attachment.filename}
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

      {/* Debit Note Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Debit Note Details</h2>
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
          renderCell={(item: any, columnKey: string) => {
            switch (columnKey) {
              default:
                return item[columnKey];
            }
          }}
          leftActions={
            <>
              <Button
                style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
                className="hover:bg-[#F2EEE9]/90"
              >
                Retention Payment
              </Button>
            </>
          }
        />
      </div>

      {/* Payment Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
        <EnhancedTable
          data={grnDetails.payment_details || []}
          columns={paymentDetailsColumns}
          storageKey="grn-payment-details-table"
          emptyMessage="No payment details available"
          pagination={true}
          pageSize={10}
          hideColumnsButton={true}
          hideTableExport={true}
          hideTableSearch={true}
          renderCell={(item: any, columnKey: string) => {
            switch (columnKey) {
              default:
                return item[columnKey];
            }
          }}
          leftActions={
            <>
              <Button
                style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
                className="hover:bg-[#F2EEE9]/90"
              >
                Retention Payment
              </Button>
            </>
          }
        />
      </div>

      {/* Retention Payment Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Retention Payment Details</h2>
        <EnhancedTable
          data={grnDetails.retention_payment_details || []}
          columns={retentionPaymentColumns}
          storageKey="grn-retention-payment-table"
          emptyMessage="No retention payment details available"
          pagination={true}
          pageSize={10}
          hideColumnsButton={true}
          hideTableExport={true}
          hideTableSearch={true}
          renderCell={(item: any, columnKey: string) => {
            switch (columnKey) {
              default:
                return item[columnKey];
            }
          }}
          leftActions={
            <>
              <Button
                style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
                className="hover:bg-[#F2EEE9]/90"
              >
                Retention Payment
              </Button>
            </>
          }
        />
      </div>

      {/* QC Payment Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">QC Payment Details</h2>
        <EnhancedTable
          data={grnDetails.qc_payment_details || []}
          columns={qcPaymentColumns}
          storageKey="grn-qc-payment-table"
          emptyMessage="No QC payment details available"
          pagination={true}
          pageSize={10}
          hideColumnsButton={true}
          hideTableExport={true}
          hideTableSearch={true}
          renderCell={(item: any, columnKey: string) => {
            switch (columnKey) {
              default:
                return item[columnKey];
            }
          }}
          leftActions={
            <>
              <Button
                style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
                className="hover:bg-[#F2EEE9]/90"
              >
                Retention Payment
              </Button>
            </>
          }
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



