import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Contact, Download, Eye, File, FileSpreadsheet, FileText, Images, Printer, Rss, ScrollText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import { approveInvoice, getInvoiceById } from "@/store/slices/invoicesSlice";
import { Card, CardContent } from "@/components/ui/card";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import axios from "axios";
import DebitCreditModal from "@/components/DebitCreditModal";

// Define interfaces for data structures
interface BillingAddress {
    phone?: string;
    fax?: string;
    email?: string;
    gst_number?: string;
    pan_number?: string;
    address?: string;
}

interface PlantDetail {
    name?: string;
}

interface WOInvoiceInventory {
    sr_no?: number;
    boq_details?: string;
    quantity?: number;
    completed_percentage?: number;
    rate?: number;
    tax_amount?: number;
    total_amount?: number;
    inventory?: { name?: string };
    expected_date?: string;
}

interface Attachment {
    id: number;
    url: string;
    document_name?: string;
    document_file_name?: string;
}

interface ApprovalLevel {
    name?: string;
    status?: string;
    updated_by?: string;
    status_updated_at?: string;
}

interface DebitNote {
    id?: string;
    description?: string;
    amount?: number;
    approved?: string;
    approved_on?: string;
    approved_by?: string;
    created_on?: string;
    created_by?: string;
}

interface Invoice {
    id?: string;
    invoice_number?: string;
    posting_date?: string;
    plant_detail?: PlantDetail;
    wo_reference_number?: string;
    related_to?: string;
    supplier_name?: string;
    invoice_amount?: number;
    total_taxes?: number;
    total_invoice_amount?: number;
    notes?: string;
    invoice_date?: string;
    wo_number?: string;
    adjustment_amount?: number;
    retention_amount?: number;
    tds_amount?: number;
    qc_amount?: number;
    payable_amount?: number;
    all_level_approved?: boolean | null;
    billing_address?: BillingAddress;
    wo_invoice_inventories?: WOInvoiceInventory[];
    total_value?: number;
    attachments?: Attachment[];
    approval_levels?: ApprovalLevel[];
    debit_notes?: DebitNote[];
}

// Column configurations for tables
const boqTableColumns: ColumnConfig[] = [
    { key: "sr_no", label: "SR No", sortable: true, draggable: true },
    { key: "boq_details", label: "BOQ Details", sortable: true, draggable: true },
    {
        key: "quantity",
        label: "Quantity/ Area(per.Sq.ft)",
        sortable: true,
        draggable: true,
    },
    {
        key: "completed_percentage",
        label: "Work Completed(%)",
        sortable: true,
        draggable: true,
    },
    { key: "rate", label: "Rate", sortable: true, draggable: true },
    { key: "tax_amount", label: "Tax Amount", sortable: true, draggable: true },
    {
        key: "total_amount",
        label: "Total Amount",
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

export const InvoiceDetails = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token") ?? "";
    const baseUrl = localStorage.getItem("baseUrl") ?? "";

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const levelId = searchParams.get("level_id");
    const userId = searchParams.get("user_id");

    const shouldShowButtons = Boolean(levelId && userId);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [invoice, setInvoice] = useState<Invoice>({});
    const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false);
    const [rejectComment, setRejectComment] = useState<string>("");
    const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [openDebitModal, setOpenDebitModal] = useState(false)
    const [printing, setPrinting] = useState(false)
    const [debitCreditForm, setDebitCreditForm] = useState({
        type: "",
        amount: "",
        description: "",
    });

    const fetchData = async () => {
        try {
            const response = await dispatch(
                getInvoiceById({ baseUrl, token, id })
            ).unwrap();
            setInvoice(response);
        } catch (error) {
            console.error("Error fetching invoice:", error);
            toast.error(String(error) || "Failed to fetch invoice");
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [dispatch, baseUrl, token, id]);

    const handlePrint = async () => {
        setPrinting(true)
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices/${id}/print_pdf.pdf`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'work_order_invoice.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.log(error)
        } finally {
            setPrinting(false)
        }
    };

    const handleFeeds = () => {
        if (id) {
            navigate(`/finance/invoice/feeds/${id}`);
        }
    };

    const handleDebitCreditChange = (e) => {
        const { name, value } = e.target;
        setDebitCreditForm((prev) => ({ ...prev, [name]: value }));
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

    const handleSubmitDebitCredit = async () => {
        try {
            const payload = {
                debit_note: {
                    amount: debitCreditForm.amount,
                    note: debitCreditForm.description,
                    note_type: debitCreditForm.type,
                    resource_id: Number(id),
                    resource_type: "WorkOrderInvoice",
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
            setOpenDebitModal(false);
        }
    };

    const handleApprove = async () => {
        const payload = {
            level_id: Number(levelId),
            user_id: Number(userId),
            approve: true,
        }
        try {
            await dispatch(approveInvoice({ baseUrl, token, id: Number(id), data: payload })).unwrap();
            toast.success("Invoice approved successfully");
            navigate(`/finance/pending-approvals`);
        } catch (error) {
            console.error("Error approving PO:", error);
            toast.error(String(error) || "Failed to approve PO");
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

        try {
            toast.success("PO rejected successfully");
            navigate(`/finance/pending-approvals`);
        } catch (error) {
            console.error("Error rejecting PO:", error);
            toast.error(String(error) || "Failed to reject PO");
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
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-2 p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            {/* Header */}
            <div className="flex justify-between items-end">
                <h1 className="text-2xl font-semibold">
                    WORK ORDER INVOICE
                </h1>
                <div className="flex gap-2 flex-wrap">
                    {
                        invoice.all_level_approved && localStorage.getItem("userType") === 'pms_occupant' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => setOpenDebitModal(true)}
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
                        )
                    }
                </div>
            </div>

            <div className='flex items-start gap-4 my-4'>
                {
                    invoice?.approval_levels?.map(level => (
                        <div className='space-y-3'>
                            <div className={`px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md font-medium w-max ${getStatusColor(
                                level.status
                            )}`}>
                                {`${level?.name?.toUpperCase()} approved : ${level.status}`}
                            </div>
                            {
                                level.updated_by && level.status_updated_at &&
                                <div className='ms-2 w-[177px]'>
                                    {
                                        `${level.updated_by} (${level.status_updated_at})`
                                    }
                                </div>
                            }
                        </div>
                    ))
                }
            </div>

            {/* Vendor/Contact Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex items-center gap-3 pb-6">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <Contact className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">{invoice.supplier_name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Address</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.address}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Phone</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.phone}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Fax</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.fax}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Email</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.email}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">GST</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.gst_number}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">PAN</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.billing_address?.pan_number}</span>
                    </div>
                </div>
            </div>

            {/* Purchase Order Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex items-center gap-3 pb-6">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <ScrollText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]"> WO INVOICE</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Invoice No.</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.invoice_number}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Invoice Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.invoice_date}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Posting Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.posting_date}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">ID</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.id}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Physical Invoice Sent to</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">N/A</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">WO Number</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.wo_number}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">WO Reference Number</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.wo_reference_number}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Physical Invoice received</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">N/A</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Related to</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.related_to}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Adjustment Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.adjustment_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Supplier Name</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.supplier_name}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Retention Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.retention_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Invoice Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.invoice_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">TDS Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.tds_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Total Taxes</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.total_taxes}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">QC Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.qc_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Total Invoice Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.total_invoice_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Payable Amount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.payable_amount}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 min-w-[180px]">Notes</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{invoice.notes}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex items-center gap-3 pb-3">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <ClipboardList className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BOQ List</h3>
                </div>
                <div className="overflow-x-auto">
                    <EnhancedTable
                        data={invoice.wo_invoice_inventories || []}
                        columns={boqTableColumns}
                        storageKey="wo-invoice-boq-table"
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

                <div className="mt-6 border-gray-200 border-t pt-6">
                    <div className="flex justify-between items-center border-gray-200">
                        <span className="font-medium text-gray-700">Amount In Words:</span>
                        <span className="font-medium">
                            {invoice.total_value
                                ? numberToIndianCurrencyWords(invoice.total_value.toFixed(2))
                                : "N/A"}
                        </span>
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
                    {Array.isArray(invoice.attachments) && invoice.attachments.length > 0 ? (
                        <div className="flex items-center flex-wrap gap-4">
                            {invoice.attachments.map((attachment: Attachment) => {
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
                                                        setSelectedAttachment(attachment);
                                                        setIsPreviewModalOpen(true);
                                                    }}
                                                    type="button"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.document_name || attachment.document_file_name}
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
                                            {attachment.document_name || attachment.document_file_name || `Document_${attachment.id}`}
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
                        <ScrollText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Debit Note Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <EnhancedTable
                        data={invoice?.debit_notes || []}
                        columns={debitNoteDetailsColumns}
                        renderCell={(item, columnKey) => {
                            if (columnKey === "type") {
                                return "Debit"
                            }
                            return item[columnKey] ?? "-";
                        }}
                        storageKey="invoice-debit-credit-table"
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

            <Dialog
                open={openRejectDialog}
                onClose={handleRejectCancel}
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
                handleCloseDebitCreditModal={() => setOpenDebitModal(false)}
                debitCreditForm={debitCreditForm}
                handleDebitCreditChange={handleDebitCreditChange}
                handleSubmitDebitCredit={handleSubmitDebitCredit}
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
