import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Copy, Printer, Rss, ArrowLeft, FileText, File, Eye, FileSpreadsheet, Download } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { getMaterialPRById } from '@/store/slices/materialPRSlice';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { approvePO, rejectPO } from '@/store/slices/purchaseOrderSlice';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

// Interfaces
interface BillingAddress {
  phone?: string;
  email?: string;
  pan_number?: string;
  fax?: string;
  gst_number?: string;
  address?: string;
}

interface Supplier {
  company_name?: string;
  email?: string;
  address?: string;
}

interface ApprovalLevel {
  name: string;
  status_label: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
}

interface Inventory {
  name?: string;
}

interface PRInventory {
  id?: number;
  inventory?: Inventory;
  availability?: string;
  sac_hsn_code?: string;
  expected_date?: string;
  prod_desc?: string;
  quantity?: number;
  unit?: string;
  total_value?: number;
  rate?: number;
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

interface MaterialPR {
  id?: string;
  external_id?: string;
  po_date?: string;
  plant_detail?: {
    plant_name?: string;
  };
  related_to?: string;
  reference_number?: string;
  adminApproval?: string;
  total_amount?: number;
  terms_conditions?: string;
  billing_address?: BillingAddress;
  supplier?: Supplier;
  approval_levels?: ApprovalLevel[];
  pms_pr_inventories?: PRInventory[];
  attachments?: Attachment[];
  show_send_sap_yes?: boolean;
}

interface TableRow {
  id: number;
  srNo: number;
  item?: string;
  availability?: string;
  sacHsnCode?: string;
  expected_date?: string;
  prod_desc?: string;
  quantity?: string;
  unit?: string;
  total_value?: string;
  rate?: string;
  amount?: string;
  approved_qty?: string;
  transfer_qty?: string;
  wbs_code?: string;
}

// Column configuration
const columns: ColumnConfig[] = [
  { key: 'srNo', label: 'SR No.', sortable: true, defaultVisible: true },
  { key: 'item', label: 'Item', sortable: true, defaultVisible: true },
  { key: 'availability', label: 'Availability', sortable: true, defaultVisible: true },
  { key: 'sacHsnCode', label: 'SAC/HSN Code', sortable: true, defaultVisible: true },
  { key: 'expected_date', label: 'Expected Date', sortable: true, defaultVisible: true },
  { key: 'prod_desc', label: 'Product Description', sortable: true, defaultVisible: true },
  { key: 'quantity', label: 'Quantity', sortable: true, defaultVisible: true },
  // { key: 'unit', label: 'Unit', sortable: true, defaultVisible: true },
  { key: 'total_value', label: 'Moving Avg Rate', sortable: true, defaultVisible: true },
  { key: 'rate', label: 'Rate', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
  { key: 'approved_qty', label: 'Approved Qty', sortable: true, defaultVisible: true },
  // { key: 'transfer_qty', label: 'Transfer Qty', sortable: true, defaultVisible: true },
  { key: 'wbs_code', label: 'Wbs Code', sortable: true, defaultVisible: true },
];

export const MaterialPRDetailsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");
  const shouldShowButtons = Boolean(levelId && userId);

  const [pr, setPR] = useState<MaterialPR>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Attachment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch PR data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');

      if (!baseUrl || !token) {
        toast.error('Missing required configuration');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await dispatch(getMaterialPRById({ baseUrl, token, id })).unwrap();
        setPR(response);
      } catch (err) {
        console.error('Error fetching PR:', err);
        toast.error('Failed to fetch purchase request');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  // Handle approve action
  const handleApprove = useCallback(async () => {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!baseUrl || !token || !id || !levelId || !userId) {
      toast.error('Missing required configuration');
      return;
    }

    const payload = {
      pms_purchase_order: {
        id: Number(id),
        pms_pr_inventories_attributes: pr.pms_pr_inventories?.map(item => ({
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
      await dispatch(approvePO({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      toast.success("PO approved successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve PO");
    }
  }, [dispatch, id, levelId, userId, pr.pms_pr_inventories, navigate]);

  // Handle reject action
  const handleRejectConfirm = useCallback(async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!baseUrl || !token || !id || !levelId || !userId) {
      toast.error('Missing required configuration');
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
      await dispatch(rejectPO({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      toast.success("PO rejected successfully");
      navigate(`/finance/pending-approvals`);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject PO");
    } finally {
      setOpenRejectDialog(false);
      setRejectComment("");
    }
  }, [dispatch, id, levelId, userId, rejectComment, navigate]);

  // Handle send to SAP
  const handleSendToSap = useCallback(async () => {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!baseUrl || !token || !id) {
      toast.error('Missing required configuration');
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
      toast.error(error.message || 'Failed to send to SAP');
    }
  }, [id]);

  // Handle print
  const handlePrint = useCallback(async () => {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!baseUrl || !token || !id) {
      toast.error('Missing required configuration');
      return;
    }

    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/purchase_orders/${id}/print_pdf.pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'material_pr.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download PDF');
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tableData: TableRow[] = pr?.pms_pr_inventories?.map((item, index) => ({
    id: item.id || index,
    srNo: index + 1,
    item: item.inventory?.name ?? '-',
    availability: item.availability ?? '-',
    sacHsnCode: item.sac_hsn_code ?? '-',
    expected_date: item.expected_date ? format(new Date(item.expected_date), 'dd-MM-yyyy') : 'NA',
    prod_desc: item.prod_desc ?? '-',
    quantity: item.quantity?.toString() ?? '0',
    unit: item.unit ?? '-',
    total_value: item.total_value?.toString() ?? '0',
    rate: item.rate?.toString() ?? '0',
    amount: item.total_value?.toString() ?? '0',
    approved_qty: item.approved_qty?.toString() ?? '0',
    transfer_qty: item.transfer_qty?.toString() ?? '0',
    wbs_code: item.wbs_code ?? '-',
  })) ?? [];

  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey] ?? "-";
    if (columnKey === "prod_desc") {
      const truncated = value.length > 30 ? value.slice(0, 30) + "..." : value;
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
    return value;
  };

  return (
    <div className="p-6 mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className='p-0'
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">Material PR Details</h1>
        <div className="flex items-center gap-3">
          {pr.show_send_sap_yes && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white"
              onClick={handleSendToSap}
            >
              Send To SAP Team
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(`/finance/material-pr/add?clone=${id}`)}>
            <Copy className="w-4 h-4 mr-2" />
            Clone
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/finance/material-pr/feeds/${id}`)}>
            <Rss className="w-4 h-4 mr-2" />
            Feeds
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-start gap-4 my-6">
          {pr.approval_levels?.map((level, index) => (
            <div key={index} className="space-y-2">
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
              {level.approved_by && level.approval_date && (
                <div className="ms-2">
                  {`${level.approved_by} (${level.approval_date})`}
                </div>
              )}
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="space-y-6">
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex"><span className="text-muted-foreground w-24">Phone</span><span className="font-medium">: {pr.billing_address?.phone ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-24">Email</span><span className="font-medium">: {pr.billing_address?.email ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-24">PAN</span><span className="font-medium">: {pr.billing_address?.pan_number ?? '-'}</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex"><span className="text-muted-foreground w-24">Fax</span><span className="font-medium">: {pr.billing_address?.fax ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-24">GST</span><span className="font-medium">: {pr.billing_address?.gst_number ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-24">Address</span><span className="font-medium">: {pr.billing_address?.address ?? '-'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Material Purchase Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex"><span className="text-muted-foreground w-40">MPR No.</span><span className="font-medium">: {pr.external_id ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">MPR Date</span><span className="font-medium">: {pr.po_date ? format(new Date(pr.po_date), 'dd-MM-yyyy') : '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">Plant Detail</span><span className="font-medium">: {pr.plant_detail?.plant_name ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">Address</span><span className="font-medium">: {pr.supplier?.address ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">Related To</span><span className="font-medium">: {pr.related_to ?? '-'}</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex"><span className="text-muted-foreground w-40">Reference No.</span><span className="font-medium">: {pr.reference_number ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">ID</span><span className="font-medium">: {pr.id ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">Supplier</span><span className="font-medium">: {pr.supplier?.company_name ?? '-'}</span></div>
                <div className="flex"><span className="text-muted-foreground w-40">Email</span><span className="font-medium">: {pr.supplier?.email ?? '-'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">Items Table</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={tableData}
              columns={columns}
              renderCell={renderCell}
              storageKey="material-pr-items"
              pagination={true}
              pageSize={10}
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              loading={loading}
            />
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-lg font-semibold">Net Amount(INR): ₹{pr.total_amount ?? '0'}</div>
                  <div className="text-sm text-muted-foreground">
                    Amount In Words: {numberToIndianCurrencyWords(pr.total_amount ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(pr.attachments) && pr.attachments.length > 0 ? (
              <div className="flex items-center flex-wrap gap-4">
                {pr.attachments.map((attachment) => {
                  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachment.url);
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
                              setSelectedDoc(attachment);
                              setIsModalOpen(true);
                            }}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <img
                            src={attachment.url}
                            alt={attachment.document_name}
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedDoc(attachment);
                              setIsModalOpen(true);
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
                        {attachment.document_name || attachment.document_file_name || `Document_${attachment.id}`}
                      </span>
                      {isDownloadable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                          onClick={() => {
                            setSelectedDoc(attachment);
                            setIsModalOpen(true);
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
              <p className='text-muted-foreground'>No attachments</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className='text-wrap break-words'>
            <p className="text-muted-foreground">{pr.terms_conditions ?? 'No terms and conditions available'}</p>
          </CardContent>
        </Card>

        {shouldShowButtons && (
          <div className="flex items-center justify-center gap-4">
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

        <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
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
            <Button onClick={() => setOpenRejectDialog(false)} variant="outline">
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
      </div>

      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};