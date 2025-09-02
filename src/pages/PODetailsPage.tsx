import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Printer, Copy, Rss, ArrowLeft, Image, FileText, File } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { getMaterialPRById } from "@/store/slices/materialPRSlice";
import { approvePO, rejectPO } from "@/store/slices/purchaseOrderSlice";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

// Define the interface for ApprovalLevel
interface ApprovalLevel {
  id: string;
  name: string;
  status_label: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string; // Added for rejection reason tooltip
}

const inventoryTableColumns: ColumnConfig[] = [
  { key: "inventory_name", label: "Item", sortable: true, draggable: true },
  { key: "sac_hsn_code", label: "SAC/HSN Code", sortable: true, draggable: true },
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
  {
    key: "approved_qty",
    label: "Approved Qty",
    sortable: true,
    draggable: true,
  },
  {
    key: "transfer_qty",
    label: "Transfer Qty",
    sortable: true,
    draggable: true,
  },
  { key: "wbs_code", label: "Wbs Code", sortable: true, draggable: true },
];

const grnDetailsColumns: ColumnConfig[] = [
  { key: "action", label: "Action", sortable: false, draggable: false },
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
    key: "other_expense",
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
  { key: "attachment", label: "Attachment", sortable: true, draggable: true },
];

export const PODetailsPage = () => {
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

  const [poDetails, setpoDetails] = useState({
    all_level_approved: null,
    billing_address: {
      phone: "",
      fax: "",
      email: "",
      gst_number: "",
      pan_number: "",
      address: "",
    },
    plant_detail: { name: "" },
    supplier: {
      address: "",
      email: "",
      pan_number: "",
      mobile1: "",
      company_name: "",
    },
    pms_po_inventories: [],
    pms_pr_inventories: [],
    external_id: "",
    po_date: "",
    related_to: "",
    retention: "",
    quality_holding: "",
    reference_number: "",
    id: "",
    payment_tenure: "",
    tds: "",
    advance_amount: "",
    net_amount: "",
    total_tax_amount: "",
    taxes: "",
    total_amount: "",
    show_send_sap_yes: false,
    approval_levels: [],
    deliveryAddress: "",
    email: "",
    gst: "",
    attachments: [],
    terms_conditions: "",
  });

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getMaterialPRById({ baseUrl, token, id })
        ).unwrap();
        setpoDetails(response);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchData();
  }, []);

  const handlePrint = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/purchase_orders/${id}/print_pdf`,
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
      link.download = 'purchase_order.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  const handleFeeds = () => {
    navigate(`/finance/po/feeds/${id}`);
  };

  const handleApprove = async () => {
    const payload = {
      pms_purchase_order: {
        id: Number(id),
        pms_pr_inventories_attributes: poDetails.pms_po_inventories.map(
          (item) => ({
            id: item.id,
            rate: item.rate,
            total_value: item.total_value,
            approved_qty: item.quantity,
            transfer_qty: item.transfer_qty,
          })
        ),
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
      level_id: levelId,
      approve: "false",
      user_id: userId,
      rejection_reason: rejectComment,
      redirect: false
    };

    try {
      await dispatch(
        rejectPO({ baseUrl, token, id: Number(id), data: payload })
      ).unwrap();
      toast.success("PO rejected successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setOpenRejectDialog(false);
      setRejectComment("");
    }
  };

  const handleSendToSap = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}.json?send_sap=yes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send to SAP");
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRejectCancel = () => {
    setOpenRejectDialog(false);
    setRejectComment("");
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
            PURCHASE ORDER DETAILS
          </h1>
          <TooltipProvider>
            <div className="flex items-start gap-3">
              {
                poDetails?.approval_levels?.map((level: ApprovalLevel) => (
                  <div className='space-y-2' key={level.id}>
                    {level.status_label.toLowerCase() === 'rejected' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(level.status_label)}`}>
                            {`${level.name} Approval : ${level.status_label}`}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rejection Reason: {level.rejection_reason ?? 'No reason provided'}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(level.status_label)}`}>
                        {`${level.name} Approval : ${level.status_label}`}
                      </div>
                    )}
                    {
                      level.approved_by && level.approval_date &&
                      <div className='ms-2'>
                        {`${level.approved_by} (${level.approval_date})`}
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
              poDetails.show_send_sap_yes && (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">jyoti</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">
                  : {poDetails.billing_address?.phone}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">
                  : {poDetails.billing_address?.fax}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">
                  : {poDetails.billing_address?.email}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">
                  : {poDetails.billing_address?.gst_number}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">
                  : {poDetails.billing_address?.pan_number}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Address
                </span>
                <span className="ml-5">
                  : {poDetails.billing_address?.address}
                </span>
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
          Purchase Order (Approved)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                PO No.
              </span>
              <span className="text-sm">: {poDetails.external_id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                PO Date
              </span>
              <span className="text-sm">: {poDetails.po_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Plant Detail
              </span>
              <span className="text-sm">: {poDetails.plant_detail?.name}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Address
              </span>
              <span className="text-sm">: {poDetails.supplier?.address}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Email
              </span>
              <span className="text-sm">: {poDetails.supplier?.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                PAN
              </span>
              <span className="text-sm">
                : {poDetails.supplier?.pan_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Phone
              </span>
              <span className="text-sm">: {poDetails.supplier?.mobile1}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Related To
              </span>
              <span className="text-sm">: {poDetails.related_to}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Retention(%)
              </span>
              <span className="text-sm">: {poDetails.retention}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                QC(%)
              </span>
              <span className="text-sm">: {poDetails.quality_holding}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Reference No.
              </span>
              <span className="text-sm">: {poDetails.reference_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">ID</span>
              <span className="text-sm">: {poDetails.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Supplier
              </span>
              <span className="text-sm">
                : {poDetails.supplier?.company_name}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Phone
              </span>
              <span className="text-sm">: NA</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                GST
              </span>
              <span className="text-sm">: {poDetails.gst}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Delivery Address
              </span>
              <span className="text-sm">
                : {poDetails.deliveryAddress}
                <br />
                demo world
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Email
              </span>
              <span className="text-sm">: {poDetails.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Payment Tenure(In Days)
              </span>
              <span className="text-sm">: {poDetails.payment_tenure}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                TDS(%)
              </span>
              <span className="text-sm">: {poDetails.tds}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">
                Advance Amount
              </span>
              <span className="text-sm">: {poDetails.advance_amount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="overflow-x-auto">
          <EnhancedTable
            data={poDetails.pms_pr_inventories || []}
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
            renderCell={(item, columnKey) => {
              if (columnKey === "inventory_name") {
                return item.inventory?.name || "-";
              }
              if (columnKey === "availability") {
                return "-";
              }
              if (columnKey === "expected_date") {
                return item.expected_date
                  ? item.expected_date.split("T")[0]
                  : "-";
              }
              return item[columnKey] ?? "-";
            }}
          />
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Net Amount (INR):
              </span>
              <span className="font-medium">{poDetails.net_amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Total Taxable Value Of PO:
              </span>
              <span className="font-medium">{poDetails.total_tax_amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Taxes (INR):</span>
              <span className="font-medium">{poDetails.taxes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Total PO Value (INR):
              </span>
              <span className="font-medium">{poDetails.total_amount}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-medium text-gray-700">
                Amount In Words:
              </span>
              <span className="font-medium">
                {numberToIndianCurrencyWords(poDetails.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
            <p className="text-gray-700 ml-4">NA</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Terms & Conditions:
            </h3>
            <p className="text-gray-700 ml-4">{poDetails.terms_conditions}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-900 font-medium mb-8">
              For NA we Confirm & Accept,
            </p>
          </div>

          <div>
            <p className="text-gray-900 font-medium">Authorised Signatory</p>
          </div>
        </div>
      </div>

      {/* Attachments Card */}
      <Card className="shadow-sm border border-border mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(poDetails.attachments) && poDetails.attachments.length > 0 ? (
            <div className="space-y-3">
              {poDetails.attachments.map((attachment: any) => {
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
          GRN Details
        </h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={[]}
            columns={grnDetailsColumns}
            storageKey="grn-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="grn-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No data available"
            className="min-w-[1800px] h-max"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={[]}
            columns={paymentDetailsColumns}
            storageKey="payment-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="payment-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No data available"
            className="h-max"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Debit/Credit Note Details
        </h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={[]}
            columns={debitNoteDetailsColumns}
            storageKey="debit-credit-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="debit-credit-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No data available"
            className="h-max"
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

      <Dialog open={openRejectDialog} onClose={handleRejectCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Purchase Order</DialogTitle>
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