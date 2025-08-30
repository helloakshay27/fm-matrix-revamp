import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  Copy,
  Printer,
  Rss,
  ArrowLeft,
  Image,
  FileText,
  File,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import {
  approveRejectWO,
  getWorkOrderById,
} from "@/store/slices/workOrderSlice";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import axios from "axios";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

// Define the interface for service items
interface ServiceItem {
  sno: number;
  boq_details: string;
  quantity: number;
  uom: string;
  expected_date: string;
  product_description: string;
  rate: number;
  wbs_code: string;
  cgst_rate: number;
  cgst_amount: number;
  sgst_rate: number;
  sgst_amount: number;
  igst_rate: number;
  igst_amount: number;
  tcs_amount: number;
  tax_amount: number;
  total_amount: number;
}

// Define the interface for approvals
interface Approval {
  level: string;
  status: string;
  updated_by?: string;
  updated_at?: string;
  rejection_reason?: string; // Added for rejection reason tooltip
}

// Define column configurations for the EnhancedTable
const serviceColumns: ColumnConfig[] = [
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
  { key: "tcs_amount", label: "TCS Amount", sortable: true, draggable: true },
  { key: "tax_amount", label: "Tax Amount", sortable: true, draggable: true },
  {
    key: "total_amount",
    label: "Total Amount",
    sortable: true,
    draggable: true,
  },
];

export const ServicePRDetailsPage = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");

  const shouldShowButtons = Boolean(levelId && userId);

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [servicePR, setServicePR] = useState<any>({});
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [buttonCondition, setButtonCondition] = useState({
    showSap: false,
    showAddInvoice: false,
    showAddDebitCredit: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getWorkOrderById({ baseUrl, token, id })
        ).unwrap();
        setServicePR(response.page);
        setButtonCondition({
          showSap: response.show_send_sap_yes,
          showAddInvoice: response.show_add_invoice_ses,
          showAddDebitCredit: response.can_add_debit_credit_note,
        });
      } catch (error) {
        toast.error(String(error));
      }
    };

    fetchData();
  }, [dispatch, baseUrl, token, id]);

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

  const handlePrint = () => { };

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

  // Transform inventory data to match ServiceItem interface
  const serviceItems: ServiceItem[] =
    servicePR.inventories?.map((item: any) => ({
      sno: item.sno,
      boq_details: item.boq_details,
      quantity: item.quantity,
      uom: item.uom,
      expected_date: item.expected_date,
      product_description: item.product_description,
      rate: item.rate,
      wbs_code: item.wbs_code,
      cgst_rate: item.cgst_rate,
      cgst_amount: item.cgst_amount,
      sgst_rate: item.sgst_rate,
      sgst_amount: item.sgst_amount,
      igst_rate: item.igst_rate,
      igst_amount: item.igst_amount,
      tcs_amount: item.tcs_amount,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount,
    })) || [];

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

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-2xl font-semibold">Service PR Details</h1>
          </div>
          <TooltipProvider>
            <div className="flex items-start gap-3">
              {servicePR?.approvals?.map((level: Approval) => (
                <div className="space-y-2" key={level.level}>
                  {level.status.toLowerCase() === 'rejected' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(level.status)}`}
                        >
                          {`${level.level} approval : ${level.status}`}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rejection Reason: {level.rejection_reason ?? 'No reason provided'}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div
                      className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(level.status)}`}
                    >
                      {`${level.level} approval : ${level.status}`}
                    </div>
                  )}
                  {level.updated_by && level.updated_at && (
                    <div className="ms-2 w-[190px]">
                      {`${level.updated_by} (${format(new Date(level.updated_at), "dd/MM/yyyy")})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
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
            <Button size="sm" variant="outline" className="border-gray-300" onClick={() => navigate(`/finance/service-pr/edit/${id}`)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate(`/finance/service-pr/add?clone=${id}`)}
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
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300"
              onClick={() => navigate(`/finance/service-pr/feeds/${id}`)}
            >
              <Rss className="w-4 h-4 mr-1" />
              Feeds
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {servicePR.company?.site_name}
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {servicePR.company?.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {servicePR.company?.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {servicePR.company?.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {servicePR.company?.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {servicePR.company?.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Address
                </span>
                <span className="ml-5">: {servicePR.company?.address}</span>
              </div>
            </div>
          </div>

          {/* Center - Contractor name */}
          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service PR Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Service Purchase Request ({servicePR.work_order?.wo_status})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                SPR Number
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.number || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                SPR Date
              </span>
              <span className="text-sm">: {servicePR.work_order?.wo_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Kind Attention
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.kind_attention || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Subject
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.subject || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Related To
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.related_to || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Payment Tenure(In Days)
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.payment_terms?.payment_tenure}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Retention(%)
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.payment_terms?.retention}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                TDS(%)
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.payment_terms?.tds || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                QC(%)
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.payment_terms?.qc || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Advance Amount
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.advance_amount || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">
                Description
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.description || "-"}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Reference No.
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.reference_no}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">ID</span>
              <span className="text-sm">: {servicePR.work_order?.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Contractor
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_details?.company_name}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Address
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_address?.address}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Phone
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_details?.mobile1}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Email
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_details?.email}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                GST
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_details?.gstin_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                PAN
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.supplier_details?.pan_number}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Work Category
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.work_category}
              </span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">
                Plant Detail
              </span>
              <span className="text-sm">
                : {servicePR.work_order?.plant_detail}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Items Section with EnhancedTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Service Items Details
        </h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={serviceItems}
            columns={serviceColumns}
            storageKey="service-items-table"
            className="min-w-[1200px]"
            emptyMessage="No service items available"
            pagination={true}
            pageSize={10}
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            renderCell={(item: ServiceItem, columnKey: string) => (
              <span className="text-sm font-medium">
                {columnKey === "total_amount" ? (
                  <span className="font-semibold">{item[columnKey]}</span>
                ) : (
                  item[columnKey as keyof ServiceItem]
                )}
              </span>
            )}
          />
        </div>

        {/* Summary Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Net Amount (INR):</span>
            <span className="font-medium">{servicePR.totals?.net_amount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">
              Total Taxable Value Of Service PR:
            </span>
            <span className="font-medium">
              {servicePR.totals?.total_taxable}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">{servicePR.totals?.taxes}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-semibold text-gray-900">
              Total Service PR Value (INR):
            </span>
            <span className="font-semibold">
              {servicePR.totals?.total_value}
            </span>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Amount In Words: </span>
            <span className="text-gray-900">
              {numberToIndianCurrencyWords(servicePR.totals?.total_value)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Terms & Conditions :
        </h3>
        <p className="text-gray-700">{servicePR.work_order?.term_condition ?? 'No terms and conditions available'}</p>

        <div className="mt-6">
          <p className="text-gray-900 font-medium">
            For {servicePR.contractor} We Confirm & Accept,
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-medium text-gray-900">
              PREPARED BY: {servicePR.preparedBy}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              SIGNATURE: {servicePR.signature || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Attachments Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(servicePR.attachments) &&
            servicePR.attachments.length > 0 ? (
            <div className="space-y-3">
              {servicePR.attachments.map((attachment: any) => {
                const getFileIcon = (fileName: string) => {
                  const ext = fileName.split(".").pop()?.toLowerCase();
                  if (
                    ["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")
                  ) {
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
            <p className="text-muted-foreground">No attachments</p>
          )}
        </CardContent>
      </Card>

      {shouldShowButtons && (
        <div className="flex items-center justify-center gap-4 my-6">
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