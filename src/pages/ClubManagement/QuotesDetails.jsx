import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast as sonnerToast } from "sonner";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import axios from "axios";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";



export const QuotesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quoteData, setQuoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("quote-details");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [hasQuoteApproval, setHasQuoteApproval] = useState(false);
    const [showDotsMenu, setShowDotsMenu] = useState(false);
    const [showConvertMenu, setShowConvertMenu] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showApprovalLog, setShowApprovalLog] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const [renderDownloadPdf, setRenderDownloadPdf] = useState(false);
    const quotePdfRef = useRef(null);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchQuoteDetails();
            fetchLockAccount();
        }
    }, [id, baseUrl, token]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = () => { setShowDotsMenu(false); setShowConvertMenu(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchQuoteDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/lock_account_quotes/${id}.json`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setQuoteData(response.data);
        } catch (error) {
            console.error("Error fetching quote details:", error);
            sonnerToast.error("Failed to fetch quote details");
        } finally {
            setLoading(false);
        }
    };

    const fetchLockAccount = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/get_lock_account.json`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const hasApproval = Array.isArray(response.data?.approvals) &&
                response.data.approvals.some((a) => a.approval_type === "quote" && a.active);
            setHasQuoteApproval(hasApproval);
        } catch (e) {
            console.error("Failed to fetch lock account", e);
        }
    };

    // ── Status update (PATCH) ──────────────────────────────────────────────
    const updateStatus = async (status) => {
        try {
            setActionLoading(true);
            await axios.patch(
                `https://${baseUrl}/lock_account_quotes/${id}.json`,
                { lock_account_quote: { status } },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            sonnerToast.success(`Quote ${status.replace("_", " ")} successfully`);
            fetchQuoteDetails();
        } catch (error) {
            const errors = error?.response?.data?.errors;
            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((e) => sonnerToast.error(`${e.id}: ${e.message}`));
            } else {
                sonnerToast.error("Failed to update status");
            }
        } finally {
            setActionLoading(false);
            setShowDotsMenu(false);
        }
    };

    // ── Approval status (POST) ─────────────────────────────────────────────
    const updateApprovalStatus = async (status) => {
        try {
            setActionLoading(true);
            await axios.post(
                `https://${baseUrl}/lock_account_quotes/${id}/update_approval_status.json`,
                { status, comment: "" },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            sonnerToast.success(`Quote ${status.replace("_", " ")} successfully`);
            fetchQuoteDetails();
        } catch (error) {
            sonnerToast.error("Failed to update approval status");
        } finally {
            setActionLoading(false);
        }
    };

    const selectMenuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                zIndex: 9999,
            },
        },
        disablePortal: true,
        container: document.body,
    };

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        "& .MuiInputBase-input, & .MuiSelect-select": {
            padding: { xs: "8px", sm: "10px", md: "12px" },
        },
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 border-gray-200",
            sent: "bg-blue-100 text-blue-800 border-blue-200",
            accepted: "bg-green-100 text-green-800 border-green-200",
            declined: "bg-red-100 text-red-800 border-red-200",
            expired: "bg-orange-100 text-orange-800 border-orange-200",
            converted: "bg-purple-100 text-purple-800 border-purple-200",
            pending_approval: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || colors.draft;
    };

    const getPdfStatusStyle = (status) => {
        const styles = {
            draft: { backgroundColor: "#f3f4f6", color: "#1f2937", borderColor: "#e5e7eb" },
            sent: { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" },
            accepted: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
            declined: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
            expired: { backgroundColor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" },
            converted: { backgroundColor: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" },
            pending_approval: { backgroundColor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" },
            approved: { backgroundColor: "#dbeafe", color: "#1d4ed8", borderColor: "#bfdbfe" },
        };
        return styles[status] || styles.draft;
    };

    const getApprovalStatusBadge = (status) => {
        const s = String(status || "").toLowerCase();
        if (s === "approved") return "bg-green-100 text-green-800";
        if (s === "rejected") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const handleEdit = () => {
        navigate(`/accounting/quotes/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `https://${baseUrl}/lock_account_quotes/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            sonnerToast.success("Quote deleted successfully");
            navigate("/accounting/quotes");
        } catch (error) {
            console.error("Error deleting quote:", error);
            sonnerToast.error("Failed to delete quote");
        }
        setShowDeleteDialog(false);
    };

    const handlePrint = () => {
        setActiveTab("pdf");
        setTimeout(() => window.print(), 0);
    };

    const handleDownload = async () => {
        try {
            setPdfGenerating(true);
            setRenderDownloadPdf(true);
            await new Promise((resolve) => requestAnimationFrame(resolve));

            if (!quotePdfRef.current) {
                throw new Error("PDF preview is not ready yet");
            }

            const canvas = await html2canvas(quotePdfRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const fileName = `Quote-${quoteData?.quote_number || id || "download"}.pdf`;
            pdf.save(fileName);
            sonnerToast.success("Quote PDF downloaded successfully");
        } catch (error) {
            console.error("Error generating quote PDF:", error);
            sonnerToast.error("Failed to download quote PDF");
        } finally {
            setPdfGenerating(false);
            setRenderDownloadPdf(false);
        }
    };

    const handleSendEmail = () => {
        sonnerToast.success("Email sent successfully");
    };

    const handleClone = () => {
        sonnerToast.success("Quote cloned successfully");
        navigate("/accounting/quotes/add");
    };

    const handleConvertToInvoice = () => {
        sonnerToast.success("Converting quote to invoice...");
        navigate("/accounting/invoices/add", { state: { quoteData } });
    };

    const formatCurrency = (amount) => {
        const currencySymbol = localStorage.getItem("currencySymbol") || "₹";
        return `${currencySymbol}${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd/MM/yyyy");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading quote...</p>
                </div>
            </div>
        );
    }

    if (!quoteData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Quote not found</p>
                    <Button className="mt-4" onClick={() => navigate("/accounting/quotes")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Quotes
                    </Button>
                </div>
            </div>
        );
    }

    const taxBreakdown = {};

    quoteData?.item_details?.forEach((item) => {
        if (item.tax_type === "tax_group" && item.tax_group?.tax_rates) {
            item.tax_group.tax_rates.forEach((tax) => {
                const taxAmount = (item.total_amount * tax.rate) / 100;

                if (!taxBreakdown[tax.name]) {
                    taxBreakdown[tax.name] = {
                        rate: tax.rate,
                        amount: 0,
                    };
                }

                taxBreakdown[tax.name].amount += taxAmount;
            });
        }
    });

    const taxRows = Object.entries(taxBreakdown);
    const quoteItems = Array.isArray(quoteData?.item_details) ? quoteData.item_details : [];
    const billingAddress = quoteData?.address_detail?.billing_address;
    const shippingAddress = quoteData?.address_detail?.shipping_address;
    const statusLabel = quoteData.status?.replace(/_/g, " ") || "draft";
    const statusDisplay = statusLabel.replace(/\b\w/g, (char) => char.toUpperCase());
    const quoteNotes = quoteData.customer_notes ?? quoteData.notes ?? quoteData.note ?? "";
    const quoteTerms = quoteData.terms_and_conditions ?? quoteData.terms ?? quoteData.terms_condition ?? "";
    const totalInWords =
        quoteData.amount_in_words ||
        quoteData.total_in_words ||
        numberToIndianCurrencyWords(Number(quoteData.total_amount || 0));

    const formatAddressBlock = (address) => {
        if (!address) return ["N/A"];
        const cityLine = [
            address.city,
            address.state,
            address.country,
        ].filter(Boolean).join(", ");

        return [
            address.address,
            address.address_line_two,
            cityLine ? `${cityLine}${address.pin_code ? `, ${address.pin_code}` : ""}` : "",
            address.contact_person ? `Contact: ${address.contact_person}` : "",
            address.telephone_number ? `Phone: ${address.telephone_number}` : "",
        ].filter(Boolean);
    };

    const renderQuotePdf = () => (
        <div className="bg-white text-black p-8 text-[11px] leading-tight" style={{ width: "794px", minHeight: "1123px", overflow: "visible" }}>
            <div className="relative mx-auto mt-6" style={{ width: "700px", overflow: "visible" }}>
                <div className="border border-gray-500 bg-white">
                    <div className="grid grid-cols-[1fr_210px] border-b border-gray-500">
                        <div className="p-3 min-h-[96px]">
                            <h2 className="text-[17px] font-bold mb-2">{localStorage.getItem("companyName") || "Lockated"}</h2>
                            <div className="space-y-1">
                                <p>{localStorage.getItem("companyAddress") || "pune Maharashtra 411006"}</p>
                                <p>{localStorage.getItem("companyCountry") || "India"}</p>
                                <p>{localStorage.getItem("companyEmail") || "ajay.pihulkar@lockated.com"}</p>
                                <p>GSTIN: {quoteData?.address_detail?.gst_detail?.gstin || localStorage.getItem("gstin") || "27AGOPL6958QABC"}</p>
                            </div>
                        </div>
                        <div className="p-3 flex flex-col items-end justify-end gap-3">
                            <span
                                className="inline-flex items-center border px-3 py-1 text-[11px] font-bold"
                                style={getPdfStatusStyle(quoteData.status)}
                            >
                                {statusDisplay}
                            </span>
                            <h1 className="text-[32px] font-serif font-normal tracking-wide">QUOTE</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-[160px_190px_1fr] border-b border-gray-500 min-h-[50px]">
                        <div className="p-2 border-r border-gray-500">#</div>
                        <div className="p-2 border-r border-gray-500">
                            <p className="font-bold">: {quoteData.quote_number || "N/A"}</p>
                            <p className="font-bold">: {formatDate(quoteData.date)}</p>
                        </div>
                        <div className="p-2">
                            {quoteData.place_of_supply && (
                                <div className="flex mb-1">
                                    <span className="w-24">Place Of Supply</span>
                                    <span className="font-bold">: {quoteData.place_of_supply}</span>
                                </div>
                            )}
                            {quoteData.reference_number && (
                                <div className="flex mb-1">
                                    <span className="w-24">Reference</span>
                                    <span>: {quoteData.reference_number}</span>
                                </div>
                            )}
                            {quoteData.expiry_date && (
                                <div className="flex mb-1">
                                    <span className="w-24">Expiry Date</span>
                                    <span>: {formatDate(quoteData.expiry_date)}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <span className="w-24">Status</span>
                                <span>: </span>
                                <span
                                    className="inline-flex items-center border px-2 py-0.5 text-[10px] font-bold ml-1"
                                    style={getPdfStatusStyle(quoteData.status)}
                                >
                                    {statusDisplay}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-gray-500 bg-gray-100 font-bold">
                        <div className="px-2 py-1 border-r border-gray-500">Bill To</div>
                        <div className="px-2 py-1">Ship To</div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-gray-500 min-h-[30px]">
                        <div className="px-2 py-2 border-r border-gray-500">
                            <p className="font-bold text-blue-700">{quoteData.customer_name || "N/A"}</p>
                            {formatAddressBlock(billingAddress).map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                        <div className="px-2 py-2">
                            <p className="font-bold text-blue-700">{quoteData.customer_name || "N/A"}</p>
                            {formatAddressBlock(shippingAddress || billingAddress).map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border-b border-r border-gray-500 p-2 text-center w-[36px]">#</th>
                                <th className="border-b border-r border-gray-500 p-2 text-left">Item & Description</th>
                                <th className="border-b border-r border-gray-500 p-2 text-right w-[74px]">Qty</th>
                                <th className="border-b border-r border-gray-500 p-2 text-right w-[90px]">Rate</th>
                                <th className="border-b border-gray-500 p-2 text-right w-[100px]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quoteItems.length > 0 ? (
                                quoteItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border-b border-r border-gray-400 p-2 text-center align-top">{index + 1}</td>
                                        <td className="border-b border-r border-gray-400 p-2 align-top">
                                            <p className="font-bold">{item.item_name || "N/A"}</p>
                                            {item.description && <p className="text-[10px] text-gray-700 mt-1">{item.description}</p>}
                                        </td>
                                        <td className="border-b border-r border-gray-400 p-2 text-right align-top">
                                            <p>{Number(item.quantity || 0).toFixed(2)}</p>
                                            <p className="text-[10px]">{item.item_unit || ""}</p>
                                        </td>
                                        <td className="border-b border-r border-gray-400 p-2 text-right align-top">{Number(item.rate || 0).toFixed(2)}</td>
                                        <td className="border-b border-gray-400 p-2 text-right align-top">{Number(item.total_amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-6 text-center text-gray-500" colSpan={5}>No items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-[1fr_305px] border-b border-gray-500">
                        <div className="p-3 border-r border-gray-500 min-h-[118px]">
                            <p className="font-bold">Total In Words</p>
                            <p className="font-bold italic mt-2">{totalInWords}</p>
                        </div>
                        <div className="p-3">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Sub Total</span>
                                    <span>{Number(quoteData.sub_total_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount({quoteData.discount_per || 0}%)</span>
                                    <span>(-) {Number(quoteData.discount_amount || 0).toFixed(2)}</span>
                                </div>
                                {quoteData.lock_account_tax_amount ? (
                                    <div className="flex justify-between">
                                        <span>Amount Withheld</span>
                                        <span className="text-red-600">(-) {Number(quoteData.lock_account_tax_amount || 0).toFixed(2)}</span>
                                    </div>
                                ) : null}
                                {taxRows.map(([name, tax], index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{name} ({tax.rate}%)</span>
                                        <span>{Number(tax.amount || 0).toFixed(2)}</span>
                                    </div>
                                ))}
                                {quoteData.charge_amount ? (
                                    <div className="flex justify-between">
                                        <span>{quoteData.charge_name || "Adjustment"}</span>
                                        <span>{Number(quoteData.charge_amount || 0).toFixed(2)}</span>
                                    </div>
                                ) : null}
                                <div className="flex justify-between border-t border-gray-500 pt-2 font-bold text-[12px]">
                                    <span>Total</span>
                                    <span>{formatCurrency(quoteData.total_amount || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_305px]">
                        <div className="p-3 border-r border-gray-500 min-h-[190px]">
                            <div className="mb-4">
                                <p className="font-bold">Notes</p>
                                <p className="whitespace-pre-wrap mt-1">{quoteNotes || "—"}</p>
                            </div>
                            <div>
                                <p className="font-bold">Terms & Conditions</p>
                                <p className="whitespace-pre-wrap mt-1">{quoteTerms || "—"}</p>
                            </div>
                        </div>
                        <div className="p-3 min-h-[190px] flex flex-col justify-end">
                            <div className="text-right">
                                <p className="font-bold mb-12">For {localStorage.getItem("companyName") || "Lockated"}</p>
                                <div className="border-t border-gray-500 ml-auto w-[170px] pt-2 text-center font-bold">
                                    Authorized Signature
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/accounting/quotes")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <FileSignature className="h-6 w-6 text-primary" />
                                Quote #{quoteData.quote_number}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {formatDate(quoteData.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(quoteData.status)} border`}>
                            {quoteData.status?.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEdit}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>

                        {quoteData?.approval_status?.approval_levels?.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowApprovalLog(true)}
                                className="gap-2"
                            >
                                <ClipboardList className="h-4 w-4" />
                                Approval Log
                            </Button>
                        )}

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTab("pdf")}
                            className="gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            PDF
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownload}
                            disabled={pdfGenerating}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {pdfGenerating ? "Downloading..." : "Download PDF"}
                        </Button>

                        {/* ── WITHOUT APPROVAL ── */}
                        {!hasQuoteApproval && (
                            <>
                                {/* Draft → Mark as Sent */}
                                {quoteData.status === "draft" && (
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("sent")}
                                    >
                                        Mark as Sent
                                    </Button>
                                )}

                                {/* Sent → 3-dot menu: Accept / Decline */}
                                {quoteData.status === "sent" && (
                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowDotsMenu((p) => !p)}
                                        >
                                            ⋯
                                        </Button>
                                        {showDotsMenu && (
                                            <div
                                                className="absolute right-0 top-9 z-50 bg-white border rounded-md shadow-lg min-w-[180px]"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-green-700"
                                                    onClick={() => updateStatus("accepted")}
                                                >
                                                    Mark as Accepted
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-700"
                                                    onClick={() => updateStatus("declined")}
                                                >
                                                    Mark as Declined
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Accepted → Convert dropdown */}
                                {quoteData.status === "accepted" && (
                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                            onClick={() => setShowConvertMenu((p) => !p)}
                                        >
                                            Convert ▾
                                        </Button>
                                        {showConvertMenu && (
                                            <div
                                                className="absolute right-0 top-9 z-50 bg-white border rounded-md shadow-lg min-w-[200px]"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                                    onClick={() => { setShowConvertMenu(false); navigate("/accounting/invoices/add", { state: { quoteData } }); }}
                                                >
                                                    Convert to Invoice
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                                    onClick={() => { setShowConvertMenu(false); navigate("/accounting/sales-order/create", { state: { quoteData } }); }}
                                                >
                                                    Convert to Sales Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── WITH APPROVAL ── */}
                        {hasQuoteApproval && (
                            <>
                                {/* Draft → Submit for Approval */}
                                {quoteData.status === "draft" && (
                                    <Button
                                        size="sm"
                                        className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("pending_approval")}
                                    >
                                        Submit for Approval
                                    </Button>
                                )}

                                {/* Pending Approval + can_be_approved → Approve / Reject */}
                                {quoteData.status === "pending_approval" && quoteData.can_approve && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 text-white hover:bg-green-700"
                                            disabled={actionLoading}
                                            onClick={() => updateApprovalStatus("approved")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-600 text-white hover:bg-red-700"
                                            disabled={actionLoading}
                                            onClick={() => updateApprovalStatus("rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {/* Approved → Mark as Sent */}
                                {quoteData.status === "approved" && (
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={actionLoading}
                                        onClick={() => updateStatus("sent")}
                                    >
                                        Mark as Sent
                                    </Button>
                                )}

                                {/* Sent → 3-dot menu: Accept / Decline */}
                                {quoteData.status === "sent" && (
                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowDotsMenu((p) => !p)}
                                        >
                                            ⋯
                                        </Button>
                                        {showDotsMenu && (
                                            <div
                                                className="absolute right-0 top-9 z-50 bg-white border rounded-md shadow-lg min-w-[180px]"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-green-700"
                                                    onClick={() => updateStatus("accepted")}
                                                >
                                                    Mark as Accepted
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-700"
                                                    onClick={() => updateStatus("declined")}
                                                >
                                                    Mark as Declined
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Accepted → Convert dropdown */}
                                {quoteData.status === "accepted" && (
                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                            onClick={() => setShowConvertMenu((p) => !p)}
                                        >
                                            Convert ▾
                                        </Button>
                                        {showConvertMenu && (
                                            <div
                                                className="absolute right-0 top-9 z-50 bg-white border rounded-md shadow-lg min-w-[200px]"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                                    onClick={() => { setShowConvertMenu(false); navigate("/accounting/invoices/add", { state: { quoteData } }); }}
                                                >
                                                    Convert to Invoice
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                                    onClick={() => { setShowConvertMenu(false); navigate("/accounting/sales-order/create", { state: { quoteData } }); }}
                                                >
                                                    Convert to Sales Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Approval Log Modal */}
                <Dialog open={showApprovalLog} onOpenChange={setShowApprovalLog}>
                    <DialogContent className="max-w-4xl">
                        <div className="flex items-center justify-between">
                            <DialogHeader>
                                <DialogTitle className="text-[#C72030]">Approval Log</DialogTitle>
                            </DialogHeader>
                            <button
                                type="button"
                                onClick={() => setShowApprovalLog(false)}
                                className="p-2 rounded hover:bg-muted"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#7a0c0c] hover:bg-[#7a0c0c] [&>th]:!text-white [&>th]:!opacity-100">
                                        <TableHead className="!text-white !opacity-100 font-semibold w-[70px]">Sr.No.</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Approval Level</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Approved By</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Date</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Status</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Remark</TableHead>
                                        <TableHead className="!text-white !opacity-100 font-semibold">Users</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(quoteData?.approval_status?.approval_levels || []).map((lvl, index) => (
                                        <TableRow key={lvl?.id ?? index}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">{lvl?.name || "—"}</TableCell>
                                            <TableCell className="font-medium">{lvl?.approved_by || "—"}</TableCell>
                                            <TableCell className="font-medium">{lvl?.approved_at || "—"}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded text-xs font-semibold ${getApprovalStatusBadge(lvl?.status)}`}>
                                                    {String(lvl?.status || "pending").toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {lvl?.rejection_reason || "—"}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {lvl?.approved_by || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Action Buttons */}
                {/* <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="default" onClick={handleConvertToInvoice}>
                                <Receipt className="h-4 w-4 mr-2" />
                                Convert to Invoice
                            </Button>
                            <Button variant="outline" onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </Button>
                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={handleSendEmail}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                            <Button variant="outline" onClick={handleClone}>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone
                            </Button>
                            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                        <TabsTrigger value="quote-details">Quote Details</TabsTrigger>
                        <TabsTrigger value="pdf">PDF</TabsTrigger>
                        <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments & Comms</TabsTrigger>
                        <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
                    </TabsList>

                    {/* Quote Details Tab */}
                    <TabsContent value="quote-details" className="space-y-6">
                                                {quoteData?.invoices?.length > 0 && (
                                                    <Accordion type="single" collapsible
                                                    // defaultValue="sales-order"
                                                    >
                                                        <AccordionItem value="sales-order" className="border rounded-lg px-4">
                                                            <AccordionTrigger className="py-3 hover:no-underline">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-base">
                                                                        Invoices
                                                                    </span>
                        
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="h-5 px-2 text-xs rounded-full"
                                                                    >
                                                                        1
                                                                    </Badge>
                                                                </div>
                                                            </AccordionTrigger>
                        
                                                            <AccordionContent>
                                                                <div className="border rounded-lg overflow-hidden mt-2">
                                                                    <Table>
                        
                        
                                                                        <TableHeader>
                                                                            <TableRow className="bg-muted/50">
                                                                                <TableHead>Date</TableHead>
                                                                                <TableHead>Invoice#</TableHead>
                                                                                <TableHead>Status</TableHead>
                                                                                <TableHead>Due Date</TableHead>
                                                                                <TableHead className="text-right">Amount</TableHead>
                                                                                <TableHead className="text-right">Balance Due</TableHead>
                                                                                <TableHead className="text-center w-[60px]"></TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>                                                                    <TableBody>
                                                                            {quoteData.invoices.map((inv, index) => (
                                                                                <TableRow key={inv.id || index} className="hover:bg-muted/40">
                        
                                                                                    {/* Date */}
                                                                                    <TableCell>{formatDate(inv.date)}</TableCell>
                        
                                                                                    {/* Invoice Number */}
                                                                                    <TableCell>
                                                                                        <button
                                                                                            className="text-blue-600 hover:underline font-medium"
                                                                                            onClick={() => navigate(`/accounting/invoices/${inv.id}`)}
                                                                                        >
                                                                                            {inv.invoice_number}
                                                                                        </button>
                                                                                    </TableCell>
                        
                                                                                    {/* Status */}
                                                                                    <TableCell>
                                                                                        <span
                                                                                            className={`text-xs font-semibold ${inv.status === "overdue"
                                                                                                    ? "text-red-600"
                                                                                                    : inv.status === "paid"
                                                                                                        ? "text-green-600"
                                                                                                        : "text-orange-500"
                                                                                                }`}
                                                                                        >
                                                                                            {inv.status?.toUpperCase()}
                                                                                        </span>
                                                                                    </TableCell>
                        
                                                                                    {/* Due Date */}
                                                                                    <TableCell>{formatDate(inv.due_date)}</TableCell>
                        
                                                                                    {/* Amount */}
                                                                                    <TableCell className="text-right font-medium">
                                                                                        ₹{inv.total_amount?.toFixed(2)}
                                                                                    </TableCell>
                        
                                                                                    {/* Balance Due */}
                                                                                    <TableCell className="text-right font-medium">
                                                                                        ₹{inv.balance_due?.toFixed(2)}
                                                                                    </TableCell>
                        
                                                                                    {/* Actions (3-dot menu like Zoho) */}
                                                                                    {/* <TableCell className="text-center">
                                                                                        <button className="p-2 rounded hover:bg-muted">
                                                                                            ⋮
                                                                                        </button>
                                                                                    </TableCell> */}
                        
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                )}
                        {/* Quote Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Quote Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Quote Number</p>
                                        <p className="text-base font-semibold mt-1">{quoteData.quote_number}</p>
                                    </div>
                                     <div>
                                        <p className="text-sm font-medium text-muted-foreground">Place of Supply</p>
                                        <p className="text-base font-semibold mt-1">{quoteData.place_of_supply || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                                        <p className="text-base font-semibold mt-1">{quoteData.reference_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Quote Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {formatDate(quoteData.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                                        <p className="text-base font-semibold mt-1">
                                            {formatDate(quoteData.expiry_date)}
                                        </p>
                                    </div>
                                   
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Salesperson</p>
                                        <p className="text-base font-semibold mt-1">{quoteData.sales_person_name || "N/A"}</p>
                                    </div>
                                     <div>
                                         <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                         <p className="text-base font-semibold mt-1 break-all">{quoteData.subject || "N/A"}</p>
                                     </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Tax Type</p>
                                        <p className="text-base font-semibold mt-1">{quoteData.tax_type?.toUpperCase() || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge className={`${getStatusColor(quoteData.status)} border mt-1`}>
                                            {quoteData.status?.replace(/_/g, " ").toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Quote Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {quoteData.item_details && quoteData.item_details.length > 0 ? (
                                    <>
                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead>Item Details</TableHead>
                                                        <TableHead className="text-right">Unit</TableHead>
                                                        <TableHead className="text-right">Quantity</TableHead>
                                                        <TableHead className="text-right">Rate</TableHead>
                                                        <TableHead className="text-right">Tax</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {quoteData.item_details.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-semibold">{item.item_name || "N/A"}</p>
                                                                    {item.description && (
                                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">{item.item_unit || "-"}</TableCell>
                                                            <TableCell className="text-right">{item.quantity || 0}</TableCell>
                                                            <TableCell className="text-right">{formatCurrency(item.rate || 0)}</TableCell>
                                                            <TableCell className="text-right">
                                                                {item.tax_type === "tax_group"
                                                                    ? item.tax_group?.name
                                                                    : item.tax_type === "non_taxable"
                                                                        ? "Non Taxable"
                                                                        : item.tax_type === "out_of_scope"
                                                                            ? "Out of Scope"
                                                                            : item.tax_type === "non_gst_supply"
                                                                                ? "Non GST Supply"
                                                                                : "-"}
                                                            </TableCell>

                                                            <TableCell className="text-right font-semibold">{formatCurrency(item.total_amount || 0)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pricing Summary */}
                                        <div className="mt-6 flex justify-end">
                                            <div className="w-full max-w-md space-y-3 bg-muted/30 p-4 rounded-lg">
                                                {/* Subtotal */}
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Sub Total
                                                    </span>
                                                    <span className="font-semibold text-base">
                                                        ₹{quoteData.sub_total_amount?.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Discount */}

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Discount ({quoteData.discount_per}%)
                                                    </span>
                                                    <span className="font-semibold text-base text-red-600">
                                                        -₹{quoteData.discount_amount?.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Tax Breakdown */}

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {/* {tax.name} ({tax.rate}%) */}
                                                    </span>
                                                    <span className="font-semibold text-base">
                                                        {/* ₹{tax.amount?.toFixed(2)} */}
                                                    </span>
                                                </div>


                                                {taxRows.map(([name, tax], index) => (
                                                    <div key={index} className="flex justify-between items-center py-2">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            {name} ({tax.rate}%)
                                                        </span>
                                                        <span className="font-semibold text-base">
                                                            ₹{tax.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* TDS / TCS */}

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {quoteData?.tax_type?.toUpperCase()}
                                                        {/* ({quoteData.tax_name}) */}
                                                    </span>
                                                    <span className="font-semibold text-base text-red-600">
                                                        -₹{quoteData.lock_account_tax_amount?.toFixed(2)}
                                                    </span>
                                                </div>


                                                {/* Adjustment */}

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {quoteData.charge_name || "Adjustment"}
                                                    </span>
                                                    <span className="font-semibold text-base">
                                                        ₹{quoteData.charge_amount?.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Total */}
                                                <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                                    <span className="font-bold text-base">Total ( ₹ )</span>
                                                    <span className="font-bold text-primary text-2xl">
                                                        ₹{quoteData.total_amount?.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                     
                                    </>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No items found</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quoteData.customer_notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Customer Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-all">{quoteData.customer_notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {quoteData.terms_and_conditions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Terms & Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-all">{quoteData.terms_and_conditions}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    {/* PDF Tab */}
                    <TabsContent value="pdf" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Quote PDF
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handlePrint}>
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                    <Button size="sm" onClick={handleDownload} disabled={pdfGenerating}>
                                        <Download className="h-4 w-4 mr-2" />
                                        {pdfGenerating ? "Downloading..." : "Download PDF"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-auto bg-[#f7f8fc] p-6">
                                    <div className="mx-auto bg-white" ref={activeTab === "pdf" ? quotePdfRef : null}>
                                        {renderQuotePdf()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Customer Info Tab */}
                    <TabsContent value="customer-info" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Customer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div>
                                     <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                                     <p className="text-base font-semibold mt-1 break-all">{quoteData.customer_name || "N/A"}</p>
                                 </div>
                                {quoteData.customer_notes && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Customer Notes</p>
                                        <p className="text-base mt-1 break-all whitespace-pre-wrap">
                                            {quoteData.customer_notes}
                                        </p>
                                    </div>
                                )}
                                {quoteData.terms_and_conditions && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Terms & Conditions</p>
                                        <p className="text-base mt-1 break-all whitespace-pre-wrap">
                                            {quoteData.terms_and_conditions}
                                        </p>
                                    </div>
                                )}

                                {/* Address Detail from quote response */}
                                {quoteData.address_detail && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="border rounded-lg p-3 bg-muted/20">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Billing Address</p>
                                            {quoteData.address_detail.billing_address ? (
                                                <div className="text-sm space-y-0.5">
                                                    <p>{quoteData.address_detail.billing_address.address || "—"}</p>
                                                    {quoteData.address_detail.billing_address.address_line_two && (
                                                        <p>{quoteData.address_detail.billing_address.address_line_two}</p>
                                                    )}
                                                    <p>
                                                        {[
                                                            quoteData.address_detail.billing_address.city,
                                                            quoteData.address_detail.billing_address.state,
                                                            quoteData.address_detail.billing_address.country
                                                        ].filter(Boolean).join(", ")}
                                                        {quoteData.address_detail.billing_address.pin_code
                                                            ? `, ${quoteData.address_detail.billing_address.pin_code}`
                                                            : ""}
                                                    </p>
                                                    {quoteData.address_detail.billing_address.contact_person && (
                                                        <p>Contact: {quoteData.address_detail.billing_address.contact_person}</p>
                                                    )}
                                                    {quoteData.address_detail.billing_address.telephone_number && (
                                                        <p>Phone: {quoteData.address_detail.billing_address.telephone_number}</p>
                                                    )}
                                                    {quoteData.address_detail.billing_address.fax_number && (
                                                        <p>Fax: {quoteData.address_detail.billing_address.fax_number}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm">N/A</p>
                                            )}
                                        </div>

                                        <div className="border rounded-lg p-3 bg-muted/20">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</p>
                                            {quoteData.address_detail.shipping_address ? (
                                                <div className="text-sm space-y-0.5">
                                                    <p>{quoteData.address_detail.shipping_address.address || "—"}</p>
                                                    {quoteData.address_detail.shipping_address.address_line_two && (
                                                        <p>{quoteData.address_detail.shipping_address.address_line_two}</p>
                                                    )}
                                                    <p>
                                                        {[
                                                            quoteData.address_detail.shipping_address.city,
                                                            quoteData.address_detail.shipping_address.state,
                                                            quoteData.address_detail.shipping_address.country
                                                        ].filter(Boolean).join(", ")}
                                                        {quoteData.address_detail.shipping_address.pin_code
                                                            ? `, ${quoteData.address_detail.shipping_address.pin_code}`
                                                            : ""}
                                                    </p>
                                                    {quoteData.address_detail.shipping_address.contact_person && (
                                                        <p>Contact: {quoteData.address_detail.shipping_address.contact_person}</p>
                                                    )}
                                                    {quoteData.address_detail.shipping_address.telephone_number && (
                                                        <p>Phone: {quoteData.address_detail.shipping_address.telephone_number}</p>
                                                    )}
                                                    {quoteData.address_detail.shipping_address.fax_number && (
                                                        <p>Fax: {quoteData.address_detail.shipping_address.fax_number}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm">N/A</p>
                                            )}
                                        </div>

                                        <div className="border rounded-lg p-3 bg-muted/20 md:col-span-2">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">GST Details</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <p><span className="font-medium">GST Preference:</span> {quoteData.address_detail.gst_preference || "—"}</p>
                                                <p><span className="font-medium">GSTIN:</span> {quoteData.address_detail.gst_detail?.gstin || "—"}</p>
                                                <p><span className="font-medium">Place of Supply:</span> {quoteData.address_detail.gst_detail?.place_of_supply || "—"}</p>
                                                <p><span className="font-medium">Business Legal Name:</span> {quoteData.address_detail.gst_detail?.business_legal_name || "—"}</p>
                                                <p><span className="font-medium">Business Trade Name:</span> {quoteData.address_detail.gst_detail?.business_trade_name || "—"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attachments & Communications Tab */}
                    <TabsContent value="attachments" className="space-y-6">
                        {/* Attachments */}
                        {quoteData.attachments && quoteData.attachments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5 text-primary" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {quoteData.attachments.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{file.document_file_name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(file.document_file_size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(file.attachment_url, "_blank")}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Email Communications */}
                        {quoteData.email_communications && quoteData.email_communications.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        Email Communications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {quoteData.email_communications.map((comm) => (
                                            <div
                                                key={comm.id}
                                                className="p-3 bg-muted/30 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm font-medium">{comm.person_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">{comm.person_email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Activity Logs Tab */}
                    <TabsContent value="activity-logs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Activity Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Array.isArray(quoteData.activity_logs) && quoteData.activity_logs.length > 0 ? (
                                    <div className="divide-y">
                                        {quoteData.activity_logs.map((log, idx) => (
                                            (() => {
                                                const key = `${log?.date || ""}-${log?.time || ""}-${idx}`;
                                                const hint = `${log?.action || ""} ${log?.message || ""}`.toLowerCase();
                                                const isConverted = hint.includes("convert");
                                                const isCreated = hint.includes("create");
                                                const isAccepted = hint.includes("accept");
                                                const isSent = hint.includes("sent");

                                                const salesOrderId =
                                                    log?.sales_order_id ||
                                                    log?.sale_order_id ||
                                                    log?.lock_account_sale_order_id ||
                                                    quoteData?.sales_order_id ||
                                                    quoteData?.sale_order_id ||
                                                    quoteData?.lock_account_sale_order_id;

                                                const Icon = isConverted || isCreated ? CirclePlus : (isAccepted || isSent ? Edit : FileText);
                                                const iconWrapClass =
                                                    isConverted || isCreated
                                                        ? "bg-green-50 text-green-600 border-green-100"
                                                        : (isAccepted || isSent
                                                            ? "bg-sky-50 text-sky-600 border-sky-100"
                                                            : "bg-gray-50 text-gray-500 border-gray-100");

                                                return (
                                                    <div key={key} className="flex gap-6 py-5">
                                                        <div className="min-w-[170px] text-sm text-muted-foreground">
                                                            <div>{log?.date || "—"} {log?.time || ""}</div>
                                                        </div>

                                                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${iconWrapClass}`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-foreground">
                                                                {log?.message || "—"}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                by <span className="font-medium text-foreground">{log?.user || "—"}</span>
                                                            </div>

                                                            {isConverted && salesOrderId ? (
                                                                <button
                                                                    type="button"
                                                                    className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                                                    onClick={() => navigate(`/accounting/sales-order/${salesOrderId}`)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View the sales order
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No activity logs found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {renderDownloadPdf && activeTab !== "pdf" && (
                <div className="fixed -left-[10000px] top-0 bg-white" aria-hidden="true">
                    <div ref={quotePdfRef}>
                        {renderQuotePdf()}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Quote</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this quote? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuotesDetails;
