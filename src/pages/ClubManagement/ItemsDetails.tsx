import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCog } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import {

    FileText,
    Package,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Edit,
    Trash2,
    Download,
    Printer,
    Send,
    Copy,
    Share2,
    ShoppingCart,
    Receipt,
    DollarSign,
    Paperclip,
    FileSignature,
    CirclePlus,
    Eye,
    ClipboardList,
    X,
} from "lucide-react";
import {
    TextField,
    // Button,
    FormControlLabel,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Drawer,
    Typography,
    Box,
    Divider,
    Radio,
    RadioGroup,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Chip
} from '@mui/material';
const muiTheme = createTheme({});


export const ItemsDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState<any>(null);

    const [activeTab, setActiveTab] = useState<
        "overview" | "transactions" | "history"
    >("overview");
    const [transactionFilter, setTransactionFilter] = useState("quotes");
    const [itemName, setItemName] = useState("");
    const [itemIconUrl, setItemIconUrl] = useState<string | null>(null);
    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };
    const [formData, setFormData] = useState({
        itemType: "",
        unit: "",
        sellingPrice: "",
        sale_mrp: "",
        salesAccount: "",
        salesDescription: "",
        costPrice: "",
        purchaseAccount: "",
        purchaseDescription: "",
        supplier: "",
        reportingTags: [],
        tax_preference: "",
        tax_exemption_reason: "",
        sku: "",
        hsn_code: "",
        sac: "",
        intra_state_tax_rate: "",
        inter_state_tax_rate: "",
    });

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            try {
                let apiBase = baseUrl || "https://club-uat-api.lockated.com";
                if (!apiBase.startsWith("http")) {
                    apiBase = `https://${apiBase}`;
                }

                const response = await axios.get(
                    `${apiBase}/lock_account_items/${id}.json`,
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                        },
                    }
                );

                const data = response.data || {};
                setItemData(data); // IMPORTANT

                setItemName(data.name || "");
                setItemIconUrl(
                    data.icon?.document_file_name ? data.icon.attachment_url : null
                );

                setFormData({
                    itemType: data.product_type || "",
                    unit: data.unit || "",
                    sellingPrice: data.sale_rate?.toString() || "",
                    sale_mrp: data.sale_mrp?.toString() || "",
                    salesAccount: data.sale_lock_account_ledger || "",
                    salesDescription: data.sale_description || "",
                    costPrice: data.purchase_rate?.toString() || "",
                    purchaseAccount: data.purchase_lock_account_ledger || "",
                    purchaseDescription: data.purchase_description || "",
                    supplier: data.supplier || "",
                    reportingTags: data.reporting_tags || [],
                    tax_preference: data.tax_preference || "",
                    tax_exemption_reason: data.tax_exemption_reason || "",
                    sku: data.sku || "",
                    hsn_code: data.hsn_code || "",
                    sac: data.sac || "",
                    intra_state_tax_rate: data.intra_state_tax_rate || "",
                    inter_state_tax_rate: data.inter_state_tax_rate || "",
                });
            } catch (error) {
                toast.error("Failed to fetch item details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItemDetails();
    }, [id, baseUrl, token]);

    const handleClose = () => navigate("/accounting/items");

    const formatText = (text: string) =>
        text?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white">

                {/* HEADER */}
                <div className="flex justify-between mb-4">
                    <Button variant="ghost" onClick={handleClose}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Items List
                    </Button>
                </div>

                {/* TABS */}
                <div className="flex gap-6 border-b mb-4">
                    {["overview", "transactions", "history"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-2 text-sm font-medium capitalize ${activeTab === tab
                                ? "border-b-2 border-[#C72030] text-[#C72030]"
                                : "text-gray-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW */}

                {activeTab === "overview" && (
                    <div className="space-y-6">

                        {/* HEADER */}
                        <div className="border p-6 rounded bg-white flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-[#E5E0D3]">
                                {itemIconUrl ? (
                                    <img src={itemIconUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <FileCog className="text-[#C72030]" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{itemName || "Item Details"}</h2>
                                <p className="text-sm text-gray-500 uppercase">Item Details</p>
                            </div>
                        </div>

                        {/* BASIC INFO */}
                        <div className="border p-6 rounded bg-white">
                            <h4 className="font-semibold mb-3">Basic Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><b>Item Type:</b> {formData.itemType || "-"}</p>
                                <p><b>SKU:</b> {formData.sku || "-"}</p>
                                <p><b>Unit:</b> {formData.unit || "-"}</p>

                                {formData.itemType === "goods" && (
                                    <p><b>HSN Code:</b> {formData.hsn_code || "-"}</p>
                                )}
                                {formData.itemType === "service" && (
                                    <p><b>SAC:</b> {formData.sac || "-"}</p>
                                )}

                                <p><b>Tax Preference:</b> {formatText(formData.tax_preference || "-")}</p>
                                <p><b>Exemption Reason:</b> {formData.tax_exemption_reason || "-"}</p>
                            </div>
                        </div>

                        {/* SALES INFO */}
                        <div className="border p-6 rounded bg-white">
                            <h4 className="font-semibold mb-3">Sales Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><b>Selling Price:</b> {formData.sellingPrice || "-"}</p>
                                <p><b>MRP:</b> {formData.sale_mrp || "-"}</p>
                                <p><b>Sales Account:</b> {formData.salesAccount || "-"}</p>
                                <p><b>Description:</b> {formData.salesDescription || "-"}</p>
                            </div>
                        </div>

                        {/* PURCHASE INFO */}
                        <div className="border p-6 rounded bg-white">
                            <h4 className="font-semibold mb-3">Purchase Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><b>Cost Price:</b> {formData.costPrice || "-"}</p>
                                <p><b>Purchase Account:</b> {formData.purchaseAccount || "-"}</p>
                                <p><b>Description:</b> {formData.purchaseDescription || "-"}</p>
                                <p><b>Preferred Vendor:</b> {formData.supplier || "-"}</p>
                            </div>
                        </div>

                        {/* TAX RATES */}
                        <div className="border p-6 rounded bg-white">
                            <h4 className="font-semibold mb-3">Default Tax Rates</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><b>Intra State Tax Rate:</b> {formData.intra_state_tax_rate || "-"}</p>
                                <p><b>Inter State Tax Rate:</b> {formData.inter_state_tax_rate || "-"}</p>
                            </div>
                        </div>

                        {/* REPORTING TAGS */}
                        <div className="border p-6 rounded bg-white">
                            <h4 className="font-semibold mb-3">Reporting Tags</h4>
                            <p className="text-gray-600">
                                {formData.reportingTags?.length
                                    ? formData.reportingTags.join(", ")
                                    : "No reporting tag associated"}
                            </p>
                        </div>

                    </div>
                )}

                {/* TRANSACTIONS */}
                {/* {activeTab === "transactions" && (
                    <div className="space-y-6">

                        <h3 className="font-semibold">Sale Orders</h3>
                        <EnhancedTaskTable
                            data={itemData?.sale_orders || []}
                            columns={[
                                { key: "sale_order_number", label: "Order #" },
                                { key: "date", label: "Date" },
                                { key: "customer_name", label: "Customer" },
                                { key: "total_amount", label: "Total" },
                                { key: "status", label: "Status" },
                            ]}
                            renderRow={(row) => row}
                        />

                        <h3 className="font-semibold">Invoices</h3>
                        <EnhancedTaskTable
                            data={itemData?.invoices || []}
                            columns={[
                                { key: "invoice_number", label: "Invoice #" },
                                { key: "date", label: "Date" },
                                { key: "customer_name", label: "Customer" },
                                { key: "total_amount", label: "Total" },
                                { key: "status", label: "Status" },
                            ]}
                            renderRow={(row) => row}
                        />

                        <h3 className="font-semibold">Quotes</h3>
                        <EnhancedTaskTable
                            data={itemData?.quotes || []}
                            columns={[
                                { key: "quote_number", label: "Quote #" },
                                { key: "date", label: "Date" },
                                { key: "customer_name", label: "Customer" },
                                { key: "total_amount", label: "Total" },
                                { key: "status", label: "Status" },
                            ]}
                            renderRow={(row) => row}
                        />

                    </div>
                )} */}


                {activeTab === "transactions" && (
                    <div className="space-y-6">

                        <div className="flex items-center gap-3 mb-4">
                            <label className="text-sm font-medium whitespace-nowrap">
                                Filter By : 
                            </label>

                            <div className="w-56">
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    value={transactionFilter}
                                    onChange={(e) => setTransactionFilter(e.target.value)}
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="quotes">Quotes</MenuItem>
                                    <MenuItem value="sale_orders">Sales Orders</MenuItem>
                                    <MenuItem value="invoices">Invoices</MenuItem>
                                    <MenuItem value="bills">Bills</MenuItem>
                                    <MenuItem value="credit_notes">Credit Notes</MenuItem>
                                </TextField>
                            </div>
                        </div>

                        {/* TABLE */}
                        {transactionFilter === "quotes" && (
                            <>
                                <h3 className="font-semibold">Quotes</h3>
                                <EnhancedTaskTable
                                    data={itemData?.quotes || []}
                                    columns={[
                                        { key: "quote_number", label: "Quote #" },
                                        { key: "date", label: "Date" },
                                        { key: "customer_name", label: "Customer" },
                                        { key: "total_amount", label: "Total" },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderRow={(row) => row}
                                />
                            </>
                        )}

                        {transactionFilter === "sale_orders" && (
                            <>
                                <h3 className="font-semibold">Sale Orders</h3>
                                <EnhancedTaskTable
                                    data={itemData?.sale_orders || []}
                                    columns={[
                                        { key: "sale_order_number", label: "Order #" },
                                        { key: "date", label: "Date" },
                                        { key: "customer_name", label: "Customer" },
                                        { key: "total_amount", label: "Total" },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderRow={(row) => row}
                                />
                            </>
                        )}

                        {transactionFilter === "invoices" && (
                            <>
                                <h3 className="font-semibold">Invoices</h3>
                                <EnhancedTaskTable
                                    data={itemData?.invoices || []}
                                    columns={[
                                        { key: "invoice_number", label: "Invoice #" },
                                        { key: "date", label: "Date" },
                                        { key: "customer_name", label: "Customer" },
                                        { key: "total_amount", label: "Total" },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderRow={(row) => row}
                                />
                            </>
                        )}

                        {transactionFilter === "bills" && (
                            <>
                                <h3 className="font-semibold">Bills</h3>
                                <EnhancedTaskTable
                                    data={itemData?.bills || []}
                                    columns={[
                                        { key: "bill_number", label: "Bill #" },
                                        { key: "date", label: "Date" },
                                        { key: "vendor_name", label: "Vendor" },
                                        { key: "total_amount", label: "Total" },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderRow={(row) => row}
                                />
                            </>
                        )}

                        {transactionFilter === "credit_notes" && (
                            <>
                                <h3 className="font-semibold">Credit Notes</h3>
                                <EnhancedTaskTable
                                    data={itemData?.credit_notes || []}
                                    columns={[
                                        { key: "credit_note_number", label: "Credit Note #" },
                                        { key: "date", label: "Date" },
                                        { key: "customer_name", label: "Customer" },
                                        { key: "total_amount", label: "Total" },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderRow={(row) => row}
                                />
                            </>
                        )}

                    </div>
                )}

                {/* HISTORY */}
                {/* {activeTab === "history" && (
                    <div className="border p-4 rounded">
                        <p>
                            Created At:{" "}
                            {itemData?.created_at
                                ? new Date(itemData.created_at).toLocaleString()
                                : "-"}
                        </p>
                        <p>
                            Updated At:{" "}
                            {itemData?.updated_at
                                ? new Date(itemData.updated_at).toLocaleString()
                                : "-"}
                        </p>
                    </div>
                )} */}




                {activeTab === "history" && (
                    <div className="space-y-6">
                        <div className="border rounded bg-white">

                            {/* Header */}
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    History
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {Array.isArray(itemData?.activity_logs) && itemData.activity_logs.length > 0 ? (
                                    <div className="divide-y">

                                        {itemData.activity_logs.map((log, idx) => {
                                            const key = `${log.date}-${log.time}-${idx}`;
                                            const action = log?.action?.toLowerCase();

                                            const isCreated = action === "create";
                                            const isUpdated = action === "update";

                                            const Icon = isCreated ? CirclePlus : isUpdated ? Edit : FileText;

                                            const iconStyle = isCreated
                                                ? "bg-green-50 text-green-600 border-green-100"
                                                : isUpdated
                                                    ? "bg-sky-50 text-sky-600 border-sky-100"
                                                    : "bg-gray-50 text-gray-500 border-gray-100";

                                            return (
                                                <div key={key} className="flex gap-6 py-5">

                                                    {/* DATE + TIME (NO CONVERSION) */}
                                                    <div className="min-w-[170px] text-sm text-muted-foreground">
                                                        {log.date || "—"} ,{log.time || ""}
                                                    </div>

                                                    {/* ICON */}
                                                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${iconStyle}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    {/* CONTENT */}
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-foreground">
                                                            {log.message || "—"}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            by <span className="font-medium text-foreground">{log.user || "—"}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No activity logs found.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </ThemeProvider>
    );
};