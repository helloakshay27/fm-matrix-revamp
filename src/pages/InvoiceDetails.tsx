import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Printer, Rss } from "lucide-react";
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
import { getInvoiceById } from "@/store/slices/invoicesSlice";

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
    document_file_name?: string;
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

    useEffect(() => {
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

        if (id) {
            fetchData();
        }
    }, [dispatch, baseUrl, token, id]);

    const handlePrint = () => {
        window.print();
    };

    const handleFeeds = () => {
        if (id) {
            navigate(`/finance/po/feeds/${id}`);
        }
    };

    const handleApprove = async () => {
        try {
            toast.success("PO approved successfully");
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
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex flex-col">
                    <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
                        WORK ORDER INVOICE
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                            L1 Approval:
                        </span>
                        <span className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium">
                            {invoice.all_level_approved === true
                                ? "Approved"
                                : invoice.all_level_approved === false
                                    ? "Rejected"
                                    : "Pending"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                    <div className="flex gap-2 flex-wrap">
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
                        {invoice.supplier_name}
                    </h2>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Address
                                </span>
                                <span className="ml-8">
                                    : {invoice.billing_address?.address}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Phone</span>
                                <span className="ml-12">
                                    : {invoice.billing_address?.phone}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Fax</span>
                                <span className="ml-8">: {invoice.billing_address?.fax}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Email</span>
                                <span className="ml-11">
                                    : {invoice.billing_address?.email}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">GST</span>
                                <span className="ml-9">
                                    : {invoice.billing_address?.gst_number}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">PAN</span>
                                <span className="ml-5">
                                    : {invoice.billing_address?.pan_number}
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
                    WO INVOICE
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="space-y-4">
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Invoice No.
                            </span>
                            <span className="text-sm">: {invoice.invoice_number}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Posting Date
                            </span>
                            <span className="text-sm">: {invoice.posting_date}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Physical Invoice Sent to
                            </span>
                            <span className="text-sm">: {invoice.plant_detail?.name}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                WO Reference Number
                            </span>
                            <span className="text-sm">: {invoice.wo_reference_number}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Related to
                            </span>
                            <span className="text-sm">: {invoice.related_to}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Supplier Name
                            </span>
                            <span className="text-sm">: {invoice.supplier_name}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Invoice Amount
                            </span>
                            <span className="text-sm">: {invoice.invoice_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Total Taxes
                            </span>
                            <span className="text-sm">: {invoice.total_taxes}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Total Invoice Amount
                            </span>
                            <span className="text-sm">: {invoice.total_invoice_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Notes
                            </span>
                            <span className="text-sm">: {invoice.notes}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Invoice Date
                            </span>
                            <span className="text-sm">: {invoice.invoice_date}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">ID</span>
                            <span className="text-sm">: {invoice.id}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                WO Number
                            </span>
                            <span className="text-sm">: {invoice.wo_number}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Physical Invoice received
                            </span>
                            <span className="text-sm">: N/A</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Adjustment Amount
                            </span>
                            <span className="text-sm">: {invoice.adjustment_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Retention Amount
                            </span>
                            <span className="text-sm">: {invoice.retention_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                TDS Amount
                            </span>
                            <span className="text-sm">: {invoice.tds_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                QC Amount
                            </span>
                            <span className="text-sm">: {invoice.qc_amount}</span>
                        </div>
                        <div className="flex">
                            <span className="text-sm font-medium text-gray-700 w-44">
                                Payable Amount
                            </span>
                            <span className="text-sm">: {invoice.payable_amount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
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
                                ? numberToIndianCurrencyWords(invoice.total_value)
                                : "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Attachments
                </h3>
                <div className="flex flex-col items-start gap-2 text-blue-600">
                    {
                        invoice?.attachments?.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <span className="cursor-pointer hover:underline">
                                    {attachment.document_file_name}
                                </span>
                            </div>
                        ))
                    }
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Retention Payment Details
                </h3>
                <div className="overflow-x-auto">
                    <EnhancedTable
                        data={[]}
                        columns={grnDetailsColumns}
                        storageKey="invoice-retention-table"
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
                    QC Payment Details
                </h3>
                <div className="overflow-x-auto">
                    <EnhancedTable
                        data={[]}
                        columns={paymentDetailsColumns}
                        storageKey="invoice-qc-table"
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
        </div>
    );
};
