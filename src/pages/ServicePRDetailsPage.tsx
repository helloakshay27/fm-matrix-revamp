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
  Edit,
  Copy,
  Printer,
  Rss,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  AlertTriangle,
  Contact,
  ScrollText,
  ClipboardList,
  Images,
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
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import { fetchWBS } from "@/store/slices/materialPRSlice";
import { approveDeletionRequest } from "@/store/slices/pendingApprovalSlice";

// Interfaces
interface Company {
  site_name?: string;
  phone?: string;
  fax?: string;
  email?: string;
  gst?: string;
  pan?: string;
  address?: string;
}

interface SupplierDetails {
  company_name?: string;
  mobile1?: string;
  email?: string;
  gstin_number?: string;
  pan_number?: string;
}

interface SupplierAddress {
  address?: string;
}

interface PaymentTerms {
  payment_tenure?: number;
  retention?: number;
  tds?: number;
  qc?: number;
}

interface WorkOrder {
  number?: string;
  wo_date?: string;
  kind_attention?: string;
  subject?: string;
  related_to?: string;
  payment_terms?: PaymentTerms;
  advance_amount?: number;
  description?: string;
  reference_no?: string;
  id?: string;
  supplier_details?: SupplierDetails;
  supplier_address?: SupplierAddress;
  work_category?: string;
  plant_detail?: string;
  wo_status?: string;
  term_condition?: string;
  all_level_approved?: boolean;
  active?: boolean;
}

interface ServiceItem {
  id?: number;
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

interface Approval {
  level: string;
  status: string;
  updated_by?: string;
  updated_at?: string;
  rejection_reason?: string;
}

interface Totals {
  net_amount?: number;
  total_taxable?: number;
  taxes?: number;
  total_value?: number;
}

interface Attachment {
  id: number;
  url: string;
  document_name?: string;
  document_file_name?: string;
}

interface ServicePR {
  company?: Company;
  work_order?: WorkOrder;
  inventories?: ServiceItem[];
  approvals?: Approval[];
  totals?: Totals;
  attachments?: Attachment[];
  preparedBy?: string;
  signature?: string;
  contractor?: string;
  all_level_approved?: boolean;
}

// Column configurations
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
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");
  const requestId = searchParams.get("request_id");
  const shouldShowButtons = Boolean(levelId && userId);

  const [isDeletionRequest, setIsDeletionRequest] = useState(false)
  const [servicePR, setServicePR] = useState<ServicePR>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showEditWbsModal, setShowEditWbsModal] = useState(false);
  const [wbsCodes, setWbsCodes] = useState([]);
  const [openDeletionModal, setOpenDeletionModal] = useState(false)
  const [updatedWbsCodes, setUpdatedWbsCodes] = useState<{
    [key: string]: string;
  }>({});
  const [buttonCondition, setButtonCondition] = useState({
    showSap: false,
    editWbsCode: false,
  });

  useEffect(() => {
    if (searchParams.get("type") === "delete-request") {
      setIsDeletionRequest(true)
    }
  }, [])

  // Fetch service PR data
  useEffect(() => {
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
          getWorkOrderById({ baseUrl, token, id })
        ).unwrap();
        setServicePR(response.page || {});
        setButtonCondition({
          showSap: response.show_send_sap_yes,
          editWbsCode: response.can_edit_wbs_codes,
        });
        // Initialize updatedWbsCodes with current WBS codes
        const initialWbsCodes = response.page?.inventories?.reduce(
          (acc: { [key: string]: string }, item: ServiceItem) => {
            const key = item.id || item.sno.toString();
            acc[key] = item.wbs_code || "";
            return acc;
          },
          {}
        );
        setUpdatedWbsCodes(initialWbsCodes || {});
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch service PR");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchWBS({ baseUrl, token })).unwrap();
        setWbsCodes(response.wbs);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };
    fetchData();
  }, []);

  // Handle WBS code change
  const handleWbsCodeChange = useCallback(
    (event, item: ServiceItem) => {
      const newWbsCode = event.target.value as string;
      const itemKey = (item.id || item.sno).toString();
      setUpdatedWbsCodes((prev) => ({
        ...prev,
        [itemKey]: newWbsCode,
      }));
    },
    []
  );

  // Handle update WBS codes to backend
  const handleUpdateWbsCodes = useCallback(async () => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    if (!baseUrl || !token || !id) {
      toast.error("Missing required configuration");
      return;
    }

    try {
      const updates = {
        pms_po_inventory_updates: Object.entries(updatedWbsCodes).map(([itemKey, wbsCode]) => ({
          id: itemKey,
          wbs_code: wbsCode
        }))
      }

      await axios.patch(
        `https://${baseUrl}/pms/purchase_orders/bulk_update_wbs_codes.json`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("WBS Codes updated successfully");
      setShowEditWbsModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update WBS Codes");
    }
  }, [id, updatedWbsCodes]);

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
        `https://${baseUrl}/pms/work_orders/${id}/print_pdf.pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "service_pr.pdf";
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
        `https://${baseUrl}/pms/work_orders/${id}.json?send_sap=yes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to send to SAP");
    }
  }, [id]);

  const handleApproveDeletionRequest = async () => {
    const payload = {
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: true,
      redirect: false
    }
    try {
      await dispatch(approveDeletionRequest({ baseUrl, token, id: requestId, data: payload })).unwrap();
      toast.success("Deletion request approved successfully");
      navigate(-1);
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectDeletionRequest = async () => {
    const payload = {
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: false,
      redirect: false,
      rejection_reason: rejectComment
    }
    try {
      await dispatch(approveDeletionRequest({ baseUrl, token, id: requestId, data: payload })).unwrap();
      toast.success("Deletion request rejected successfully");
      navigate(-1);
    } catch (error) {
      console.log(error)
    }
  }


  // Handle approve
  const handleApprove = async () => {
    if (isDeletionRequest) {
      await handleApproveDeletionRequest();
    } else {
      if (!baseUrl || !token || !id || !levelId || !userId) {
        toast.error("Missing required configuration");
        return;
      }

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
      } catch (error: any) {
        toast.error(error.message || "Failed to approve Work Order");
      }
    }
  };

  // Handle reject
  const handleRejectConfirm = useCallback(async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (isDeletionRequest) {
      await handleRejectDeletionRequest();
    } else {
      if (!baseUrl || !token || !id || !levelId || !userId) {
        toast.error("Missing required configuration");
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
      } catch (error: any) {
        toast.error(error.message || "Failed to reject Work Order");
      } finally {
        setOpenRejectDialog(false);
        setRejectComment("");
      }
    }
  }, [dispatch, id, levelId, userId, rejectComment, navigate]);

  const handleDelete = async () => {
    const payload = {
      deletion_request: {
        resource_id: id,
        resource_type: "Pms::WorkOrder",
        approve: false
      }
    }
    try {
      await axios.post(`https://${baseUrl}/deletion_requests.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Deletion request raised successfully")
      setOpenDeletionModal(false)
    } catch (error) {
      console.log(error)
      toast.error("Failed to raise deletion request")
    }
  }

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

  const serviceItems: ServiceItem[] =
    servicePR.inventories?.map((item: any, index: number) => ({
      id: item.id || index,
      sno: item.sno || index + 1,
      boq_details: item.boq_details || "-",
      quantity: item.quantity || 0,
      uom: item.uom || "-",
      expected_date: item.expected_date
        ? format(item.expected_date, "dd/MM/yyyy")
        : "-",
      product_description: item.product_description || "-",
      rate: item.rate || 0,
      wbs_code: item.wbs_code || "-",
      cgst_rate: item.cgst_rate || 0,
      cgst_amount: item.cgst_amount || 0,
      sgst_rate: item.sgst_rate || 0,
      sgst_amount: item.sgst_amount || 0,
      igst_rate: item.igst_rate || 0,
      igst_amount: item.igst_amount || 0,
      tcs_amount: item.tcs_amount || 0,
      tax_amount: item.tax_amount || 0,
      total_amount: item.total_amount || 0,
    })) || [];

  const renderCell = (item: ServiceItem, columnKey: string) => {
    const value = item[columnKey as keyof ServiceItem] ?? "-";
    if (columnKey === "product_description") {
      const truncated =
        typeof value === "string" && value.length > 30
          ? value.slice(0, 30) + "..."
          : value;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[20rem] text-wrap break-words">{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="p-6 mx-auto bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Service PR Details</h1>
        <div className="flex items-center gap-2">
          {!servicePR?.work_order?.active ? (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 !bg-[#C72030] !text-white cursor-default"
              >
                Deleted
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
            </>
          ) : (
            <>
              {buttonCondition.showSap && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleSendToSap}
                >
                  Send To SAP Team
                </Button>
              )}

              {servicePR?.all_level_approved === null && !shouldShowButtons && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => navigate(`/finance/service-pr/edit/${id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}

              {!shouldShowButtons && (
                <>
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
                </>
              )}

              <Button
                size="sm"
                variant="outline"
                className="border-gray-300"
                onClick={() => navigate(`/finance/service-pr/feeds/${id}`)}
              >
                <Rss className="w-4 h-4 mr-1" />
                Feeds
              </Button>

              {servicePR?.all_level_approved && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 btn-primary"
                  onClick={() => setOpenDeletionModal(true)}
                >
                  Raise Deletion Request
                </Button>
              )}

              {buttonCondition.editWbsCode && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 btn-primary"
                  onClick={() => setShowEditWbsModal(true)}
                >
                  Edit WBS Codes
                </Button>
              )}
            </>
          )}
        </div>

      </div>

      <TooltipProvider>
        <div className="flex items-start gap-3 my-4">
          {servicePR?.approvals?.map((level: Approval) => (
            <div className="space-y-2" key={level.level}>
              {level.status.toLowerCase() === "rejected" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${getStatusColor(
                        level.status
                      )}`}
                    >
                      {`${level.level} Approval : ${level.status}`}
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
                    level.status
                  )}`}
                >
                  {`${level.level} Approval : ${level.status}`}
                </div>
              )}
              {level.updated_by && level.updated_at && (
                <div className="ms-2 w-[190px]">
                  {`${level.updated_by} (${format(
                    new Date(level.updated_at),
                    "dd/MM/yyyy"
                  )})`}
                </div>
              )}
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="space-y-6">
        <Card className="shadow-sm border border-border">
          <div className="flex items-center gap-3 p-6">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Contact className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">{servicePR.company?.site_name || "Company Details"}</h3>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Phone</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.phone ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Fax</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.fax ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Email</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.email ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">GST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.gst ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">PAN</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.pan ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Address</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.company?.address ?? "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <div className="flex items-center gap-3 p-6">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <ScrollText className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Service Purchase Request</h3>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">SPR Number</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.number ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Reference No.</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.reference_no ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">SPR Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.wo_date
                    ? format(new Date(servicePR.work_order.wo_date), "dd-MM-yyyy")
                    : "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.id ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Kind Attention</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.kind_attention ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Contractor</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_details?.company_name ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Subject</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.subject ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Address</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_address?.address ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Related To</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.related_to ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Phone</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_details?.mobile1 ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Payment Tenure</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.payment_terms?.payment_tenure ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Email</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_details?.email ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Retention(%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.payment_terms?.retention ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">GST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_details?.gstin_number ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">TDS(%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.payment_terms?.tds ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">PAN</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.supplier_details?.pan_number ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">QC(%)</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.payment_terms?.qc ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Work Category</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.work_category ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Advance Amount</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.advance_amount ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Plant Detail</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.plant_detail ?? "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Description</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {servicePR.work_order?.description ?? "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <div className="flex items-center gap-3 px-6 pt-6 pb-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Service Items Details</h3>
          </div>
          <CardContent>
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
              loading={loading}
              renderCell={renderCell}
            />
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">
                  Net Amount (INR):
                </span>
                <span className="font-medium">
                  {servicePR.totals?.net_amount ?? "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">
                  Total Taxable Value Of Service PR:
                </span>
                <span className="font-medium">
                  {servicePR.totals?.total_taxable ?? "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Taxes (INR):</span>
                <span className="font-medium">
                  {servicePR.totals?.taxes ?? "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t">
                <span className="font-semibold text-gray-900">
                  Total Service PR Value (INR):
                </span>
                <span className="font-semibold">
                  {servicePR.totals?.total_value ?? "-"}
                </span>
              </div>
              <div className="mt-4">
                <span className="font-medium text-gray-700">
                  Amount In Words:{" "}
                </span>
                <span className="text-gray-900">
                  {numberToIndianCurrencyWords(
                    servicePR.totals?.total_value ?? 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <div className="flex items-center gap-3 px-6 pt-6 pb-1">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <ScrollText className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Terms & Conditions</h3>
          </div>
          <CardContent className="text-wrap break-words">
            <p className="text-muted-foreground">
              {servicePR.work_order?.term_condition ??
                "No terms and conditions available"}
            </p>
            <div className="mt-6">
              <p className="font-medium text-gray-900">
                For {servicePR.contractor || "-"} We Confirm & Accept,
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-medium text-gray-900">
                  PREPARED BY: {servicePR.preparedBy || "-"}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  SIGNATURE: {servicePR.signature || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <div className="flex items-center gap-3 p-6">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Images className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Attachments</h3>
          </div>
          <CardContent>
            {Array.isArray(servicePR.attachments) &&
              servicePR.attachments.length > 0 ? (
              <div className="flex items-center flex-wrap gap-4">
                {servicePR.attachments.map((attachment: Attachment) => {
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
                          <Eye className="w-4 h-4" />
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
              onClick={() => setOpenRejectDialog(true)}
            >
              Reject
            </button>
          </div>
        )}

        <Dialog
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{isDeletionRequest ? "Reject Deletion Request" : "Reject Work Order"}</DialogTitle>
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
          open={showEditWbsModal}
          onClose={() => setShowEditWbsModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit WBS Codes</DialogTitle>
          <DialogContent>
            <div className="space-y-4 mt-4">
              {servicePR.inventories?.map((item) => (
                <FormControl fullWidth key={item.id || item.sno}>
                  <InputLabel>
                    WBS Code for {item.boq_details || `Item ${item.sno}`}
                  </InputLabel>
                  <Select
                    value={updatedWbsCodes[(item.id || item.sno).toString()] || item.wbs_code}
                    onChange={(e) => handleWbsCodeChange(e, item)}
                    label={`WBS Code for ${item.boq_details || `Item ${item.sno}`}`}
                  >
                    <MenuItem value="">
                      <em>Select WBS Code</em>
                    </MenuItem>
                    {wbsCodes.map((wbs: { wbs_code: string }) => (
                      <MenuItem key={wbs.wbs_code} value={wbs.wbs_code}>
                        {wbs.wbs_code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              {(!servicePR.inventories || servicePR.inventories.length === 0) && (
                <p className="text-muted-foreground">No inventory items available</p>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowEditWbsModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateWbsCodes}
              className="bg-[#C72030] text-white hover:bg-[#a61b27]"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeletionModal}
          onClose={() => setOpenDeletionModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={24} color="#d32f2f" />
            Confirm Deletion Request
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to raise a deletion request? This action will initiate the deletion process.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpenDeletionModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete}>
              Yes
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
    </div>
  );
};