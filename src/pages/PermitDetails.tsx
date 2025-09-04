import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Download,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    User,
    MapPin,
    Calendar,
    Clipboard,
    Phone,
    Mail,
    Building,
    RefreshCw,
    MessageSquare,
    Upload,
    QrCode,
} from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { AddPermitCommentModal } from "@/components/AddPermitCommentModal";

// Type definitions for permit details
interface CreatedBy {
    full_name: string;
    department_name: string;
    mobile: string;
}

interface Vendor {
    company_name: string;
}

interface ClosedBy {
    full_name: string;
}

interface PermitClosure {
    completion_comment: string;
    closed_by: ClosedBy;
    attachments_count: number;
    closure_approval_levels: any[];
}

interface MainAttachment {
    id: number;
    // Old fields for backward compatibility
    document_file_name?: string;
    document_content_type?: string;
    document_file_size?: number;
    document_updated_at?: string;
    relation?: string;
    relation_id?: number;
    active?: number;
    created_at?: string;
    updated_at?: string;
    changed_by?: string | null;
    added_from?: string | null;
    comments?: string | null;
    // API response fields
    filename?: string;
    content_type?: string;
    file_size?: number;
    url?: string;
}

interface VendorAttachments {
    list_of_people: any[];
    esi_wc_policy: any[];
    medical_reports: any[];
    other: any[];
}

interface QRCode {
    image_url: string;
    download_link: string;
}

interface ApprovalLevel {
    name: string;
    status: string;
    updated_by: string;
    status_updated_at: string | null;
}

interface Permit {
    id: number;
    reference_number: string;
    permit_type: string;
    status: string;
    created_at: string;
    current_user_id: number;
    permit_assignees: any[];
    pms_permit_form: any;
    expiry_date: string | null;
    extension_status: string;
    extension_date: string | null;
    resume_date: string | null;
    permit_for: string;
    location_details: string;
    comment: string;
    rejection_reason: string;
    external_vendor_name: string;
    vendor: Vendor;
    created_by: CreatedBy;
    all_level_approved: boolean;
}

interface CommentLog {
    id: number;
    description: string;
    created_by: {
        full_name: string;
    };
    created_at: string;
    updated_at: string;
}

interface PermitDetailsResponse {
    permit: Permit;
    approval_levels: ApprovalLevel[];
    permit_extends: any[];
    permit_resume: any[];
    permit_closure: PermitClosure;
    activity_details: any[];
    main_attachments: MainAttachment[];
    vendor_attachments: VendorAttachments;
    manpower_details: any[];
    comment_logs: CommentLog[];
    safety_check_audits: any[];
    qr_code: QRCode;
    show_edit_button: boolean;
    show_send_mail_button: boolean;
    show_print_form_button: boolean;
    show_print_jsa_button: boolean;
    show_fill_jsa_button: boolean;
    show_complete_form_button: boolean;
    show_extend_button: boolean;
    show_resume_button: boolean;
    show_upload_jsa_button: boolean;
    show_complete_button: boolean;
}

// API function to fetch permit details
const fetchPermitDetails = async (id: string): Promise<PermitDetailsResponse> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMIT_DETAILS}/${id}.json`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch permit details');
    }

    return await response.json();
};

// API function to add permit comment
const addPermitComment = async (permitId: string, comment: string): Promise<void> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMIT_COMMENT}/${permitId}/permit_comment`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            pms_permit_comment_log: {
                description: comment
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
    }

    return await response.json();
};

export const PermitDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const [permitData, setPermitData] = useState<PermitDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState("details");
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectComment, setRejectComment] = useState("");

    // Extend permit form states
    const [isExtending, setIsExtending] = useState(false);
    const [extendReason, setExtendReason] = useState("");
    const [extendDate, setExtendDate] = useState("");
    const [extendAttachments, setExtendAttachments] = useState<FileList | null>(null);

    // Check if we came from pending approvals page
    const levelId = searchParams.get('level_id');
    const userId = searchParams.get('user_id');
    const isApprovalPage = searchParams.get('type') === 'approval';
    const showApprovalButtons = levelId && userId && isApprovalPage;

    // Handle adding comment
    const handleAddComment = async (comment: string) => {
        if (!id || !comment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setIsAddingComment(true);
        try {
            await addPermitComment(id, comment.trim());
            toast.success('Comment added successfully');
            setCommentModalOpen(false);

            // Refresh permit details to show the new comment
            const response = await fetchPermitDetails(id);
            setPermitData(response);
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment. Please try again.');
        } finally {
            setIsAddingComment(false);
        }
    };

    // Handle approve permit
    const handleApprove = async () => {
        if (!id) {
            toast.error('Permit ID is required for approval');
            return;
        }

        if (!levelId) {
            toast.error('Level ID is required for approval');
            return;
        }

        setIsApproving(true);
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id') || localStorage.getItem('userId');

            if (!baseUrl || !token || !userId) {
                throw new Error("Base URL, token, or user ID not set in localStorage");
            }

            // Ensure protocol is present
            if (!/^https?:\/\//i.test(baseUrl)) {
                baseUrl = `https://${baseUrl}`;
            }

            const response = await fetch(`${baseUrl}/pms/permits/${id}/status_confirmation?approve=true&user_id=${userId}&level_id=${levelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to approve permit: ${response.statusText}`);
            }

            toast.success('Permit approved successfully');

            // Navigate back to pending approvals after successful approval
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error approving permit:', error);
            toast.error('Failed to approve permit. Please try again.');
        } finally {
            setIsApproving(false);
        }
    };

    // Handle reject permit - opens dialog
    const handleReject = () => {
        setOpenRejectDialog(true);
    };

    // Handle reject dialog cancel
    const handleRejectCancel = () => {
        setOpenRejectDialog(false);
        setRejectComment("");
    };

    // Handle reject dialog confirm
    const handleRejectConfirm = async () => {
        if (!rejectComment.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        if (!id) {
            toast.error('Permit ID is required for rejection');
            return;
        }

        setIsRejecting(true);
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id') || localStorage.getItem('userId');

            if (!baseUrl || !token || !userId) {
                throw new Error("Base URL, token, or user ID not set in localStorage");
            }

            // Ensure protocol is present
            if (!/^https?:\/\//i.test(baseUrl)) {
                baseUrl = `https://${baseUrl}`;
            }

            // Create form data for URL encoded content
            const formData = new URLSearchParams();
            formData.append('rejection_reason', rejectComment.trim());

            const response = await fetch(`${baseUrl}/pms/permits/${id}/update_rejection_reason.json?user_id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to reject permit: ${response.statusText}`);
            }

            toast.success('Permit rejected successfully');
            setOpenRejectDialog(false);
            setRejectComment("");

            // Navigate back to pending approvals after successful rejection
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error rejecting permit:', error);
            toast.error('Failed to reject permit. Please try again.');
        } finally {
            setIsRejecting(false);
        }
    };

    // Handle extend permit form submission
    const handleExtendPermit = async () => {
        if (!id) {
            toast.error('Permit ID is required for extension');
            return;
        }

        if (!extendReason.trim()) {
            toast.error('Please provide a reason for extension');
            return;
        }

        if (!extendDate) {
            toast.error('Please select an extension date');
            return;
        }

        setIsExtending(true);
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                throw new Error("Base URL or token not set in localStorage");
            }

            // Ensure protocol is present
            if (!/^https?:\/\//i.test(baseUrl)) {
                baseUrl = `https://${baseUrl}`;
            }

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('pms_permit_extend[permit_id]', id);
            formData.append('pms_permit_extend[reason_for_extension]', extendReason.trim());
            formData.append('pms_permit_extend[extension_date]', extendDate);

            // Add attachments if any
            if (extendAttachments && extendAttachments.length > 0) {
                for (let i = 0; i < extendAttachments.length; i++) {
                    formData.append('extend_attachments[]', extendAttachments[i]);
                }
            }

            const response = await fetch(`${baseUrl}/pms/permit_extends`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to extend permit: ${response.statusText}`);
            }

            toast.success('Permit extension request submitted successfully');

            // Clear form data
            setExtendReason("");
            setExtendDate("");
            setExtendAttachments(null);

            // Refresh permit details to show updated information
            const updatedData = await fetchPermitDetails(id);
            setPermitData(updatedData);

        } catch (error) {
            console.error('Error extending permit:', error);
            toast.error('Failed to submit permit extension. Please try again.');
        } finally {
            setIsExtending(false);
        }
    };

    // Fetch permit details on component mount
    useEffect(() => {
        if (!id) {
            setError('Permit ID is required');
            setLoading(false);
            return;
        }

        const loadPermitDetails = async () => {
            try {
                setLoading(true);
                const response = await fetchPermitDetails(id);
                setPermitData(response);
                setError(null);
            } catch (err) {
                setError('Failed to load permit details');
                console.error('Error fetching permit details:', err);
                toast.error('Failed to load permit details');
            } finally {
                setLoading(false);
            }
        };

        loadPermitDetails();
    }, [id]);

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateWithTimezone = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        }) + ' (IST)';
    };

    const formatRawDate = (dateString: string) => {
        if (!dateString) return '-';
        return dateString; // Show the raw ISO format
    };

    // Format date only
    const formatDateOnly = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle download QR code
    const handleDownloadQR = () => {
        if (permitData?.qr_code?.image_url) {
            const link = document.createElement('a');
            link.href = permitData.qr_code.image_url;
            link.download = `permit-${permitData.permit.id}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Handle print form
    const handlePrintForm = async () => {
        if (!id) {
            toast.error('Permit ID is required');
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pms/permits/${id}/download_print_pdf.pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `permit-${id}-form.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('PDF form downloaded successfully');
            } else {
                console.error('Failed to download PDF:', response.status, response.statusText);
                toast.error('Failed to download PDF form');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error downloading PDF form');
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await fetchPermitDetails(id);
            setPermitData(response);
            setError(null);
            toast.success('Permit details refreshed');
        } catch (err) {
            setError('Failed to load permit details');
            console.error('Error fetching permit details:', err);
            toast.error('Failed to refresh permit details');
        } finally {
            setLoading(false);
        }
    };

    // Get status color for approval levels
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'approve':
                return 'bg-green-100 text-green-800';
            case 'rejected':
            case 'reject':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Section component for organized layout
    const Section = ({
        title,
        icon,
        children,
        sectionKey
    }: {
        title: string;
        icon: React.ReactNode;
        children: React.ReactNode;
        sectionKey: string;
    }) => (
        <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div
                className="p-4 border-b bg-[#f6f4ee] rounded-t-lg cursor-pointer flex items-center justify-between"
                onClick={() => setActiveSection(activeSection === sectionKey ? "" : sectionKey)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FBEDEC] rounded-full flex items-center justify-center">
                        {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 text-[#C72030]' })}
                    </div>
                    <h3 className="text-lg font-semibold text-[#C72030]">{title}</h3>
                </div>
                <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>
            </div>
            {(activeSection === sectionKey || activeSection === "details") && (
                <div className="p-6">
                    {children}
                </div>
            )}
        </div>
    );

    // Field component for consistent styling
    const Field = ({ label, value, fullWidth = false }: { label: string; value: React.ReactNode; fullWidth?: boolean }) => (
        <div className={`flex ${fullWidth ? 'flex-col' : 'items-center'} gap-4 ${fullWidth ? 'mb-4' : ''}`}>
            <label className={`${fullWidth ? 'text-sm' : 'w-32 text-sm'} font-medium text-gray-700`}>
                {label}
            </label>
            {!fullWidth && <span className="text-sm">:</span>}
            <span className={`text-sm text-gray-900 ${fullWidth ? 'mt-1' : 'flex-1'}`}>
                {value || '-'}
            </span>
        </div>
    );

    if (loading) {
        return (
            <div className="p-6 min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#C72030]" />
                    <span className="ml-3 text-gray-600">Loading permit details...</span>
                </div>
            </div>
        );
    }

    if (error || !permitData) {
        return (
            <div className="p-6 min-h-screen bg-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </button>
                </div>
                <div className="bg-white rounded-lg p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error || 'Permit not found'}</p>
                    <Button
                        onClick={() => navigate('/safety/permit')}
                        className="bg-[#C72030] hover:bg-[#B01D2A] text-white"
                    >
                        Back to Permits
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back</span>
                </button>
                <div className="flex items-center gap-4">
                    {permitData.show_edit_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/safety/permit/edit/${id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/safety/permit/vendor-form/${id}`)}
                        className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Vendor Form
                    </Button>
                    {permitData.show_complete_form_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/safety/permit/fill-form/${id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        >
                            <Clipboard className="w-4 h-4 mr-2" />
                            Fill Form
                        </Button>
                    )}
                    {permitData.show_fill_jsa_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/safety/permit/fill-jsa-form/${id}`)}
                            className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                        >
                            <Clipboard className="w-4 h-4 mr-2" />
                            Fill JSA Form
                        </Button>
                    )}
                    {permitData.show_upload_jsa_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/safety/permit/upload-jsa/${id}`)}
                            className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload JSA
                        </Button>
                    )}
                    {permitData.show_print_form_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrintForm}
                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PRINT Form
                        </Button>
                    )}
                    {permitData.show_print_jsa_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Add print JSA functionality */ }}
                            className="bg-green-700 hover:bg-green-800 text-white border-green-700"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PRINT JSA
                        </Button>
                    )}
                    {permitData.show_send_mail_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Add send mail functionality */ }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Mail
                        </Button>
                    )}
                    {permitData.show_complete_button && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Add complete functionality */ }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadQR}
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Approval Levels */}
            {permitData.approval_levels && permitData.approval_levels.length > 0 && (
                <div className="flex items-start gap-4 my-6">
                    {permitData.approval_levels.map((level: ApprovalLevel, index: number) => (
                        <div key={index} className="space-y-2">
                            <div className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(level.status)}`}>
                                {`${level.name} : ${level.status}`}
                            </div>
                            {level.updated_by && level.status_updated_at && (
                                <div className="ms-2 text-sm text-gray-600">
                                    {`${level.updated_by} (${formatDateOnly(level.status_updated_at)})`}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
                {/* Permit Details Section */}
                <Section title="PERMIT DETAILS" icon={<FileText />} sectionKey="details">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Permit ID" value={permitData.permit.id} />
                            <Field label="Reference No" value={permitData.permit.reference_number} />
                            <Field label="Permit Type" value={permitData.permit.permit_type} />
                            <Field label="Permit For" value={permitData.permit.permit_for} />
                            <Field label="Permit Status" value={
                                <Badge className="text-white bg-blue-500">
                                    {permitData.permit.status}
                                </Badge>
                            } />
                            <Field label="Extension Status" value={permitData.permit.extension_status} />
                        </div>
                        <div className="space-y-4">
                            <Field label="Current User ID" value={permitData.permit.current_user_id} />
                            <Field label="All Level Approved" value={permitData.permit.all_level_approved ? "Yes" : "No"} />
                            <Field label="Created On" value={formatDate(permitData.permit.created_at)} />
                            <Field label="Expiry Date" value={formatDate(permitData.permit.expiry_date)} />
                            <Field label="Extension Date" value={formatDate(permitData.permit.extension_date)} />
                            <Field label="Resume Date" value={formatDate(permitData.permit.resume_date)} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Field label="Location Details" value={permitData.permit.location_details} fullWidth />
                        <Field label="Comment" value={permitData.permit.comment || "No comments"} fullWidth />
                        <Field label="Rejection Reason" value={permitData.permit.rejection_reason || "None"} fullWidth />
                    </div>
                </Section>

                {/* Requestor's Information Section */}
                <Section title="REQUESTOR'S INFORMATION" icon={<User />} sectionKey="requestor">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Created By" value={permitData.permit.created_by.full_name} />
                            <Field label="Department" value={permitData.permit.created_by.department_name} />
                            <Field label="Mobile" value={permitData.permit.created_by.mobile} />
                        </div>
                        <div className="space-y-4">
                            <Field label="Vendor Company" value={permitData.permit.vendor?.company_name || "N/A"} />
                            <Field label="External Vendor Name" value={permitData.permit.external_vendor_name || "N/A"} />
                        </div>
                    </div>
                </Section>

                {/* Approval Levels Section */}
                {permitData.approval_levels && permitData.approval_levels.length > 0 && (
                    <Section title="APPROVAL LEVELS" icon={<CheckCircle />} sectionKey="approval-levels">
                        <div className="space-y-3">
                            {permitData.approval_levels.map((level: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Level {index + 1}</h4>
                                            <p className="text-sm text-gray-600">{level.name || level.description || "Approval level"}</p>
                                        </div>
                                        <Badge variant={level.status === 'approved' ? 'default' : 'secondary'}>
                                            {level.status || 'Pending'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Permit Extensions Section */}
                {permitData.permit_extends && permitData.permit_extends.length > 0 && (
                    <Section title="PERMIT EXTENSIONS" icon={<Clock />} sectionKey="extensions">
                        <div className="space-y-3">
                            {permitData.permit_extends.map((extension: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Extension {index + 1}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Date: </span>
                                            <span className="text-gray-900">{formatDate(extension.date) || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Status: </span>
                                            <span className="text-gray-900">{extension.status || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Permit Resume Section */}
                {permitData.permit_resume && permitData.permit_resume.length > 0 && (
                    <Section title="PERMIT RESUME" icon={<RefreshCw />} sectionKey="resume">
                        <div className="space-y-3">
                            {permitData.permit_resume.map((resume: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Resume {index + 1}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Date: </span>
                                            <span className="text-gray-900">{formatDate(resume.date) || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Status: </span>
                                            <span className="text-gray-900">{resume.status || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Manpower Details Section */}
                {permitData.manpower_details && permitData.manpower_details.length > 0 && (
                    <Section title="MANPOWER DETAILS" icon={<User />} sectionKey="manpower">
                        <div className="space-y-3">
                            {permitData.manpower_details.map((manpower: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Person {index + 1}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name: </span>
                                            <span className="text-gray-900">{manpower.name || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Role: </span>
                                            <span className="text-gray-900">{manpower.role || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Contact: </span>
                                            <span className="text-gray-900">{manpower.contact || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Activity Details Section */}
                <Section title="ACTIVITY DETAILS" icon={<Clipboard />} sectionKey="activity">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {permitData.activity_details && permitData.activity_details.length > 0 ? (
                                permitData.activity_details.map((activity: any, index: number) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Activity {index + 1}</h4>
                                        <p className="text-sm text-gray-700">{activity.description || activity.name || "Activity details"}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No activity details available</p>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Attachments Section */}
                {permitData.main_attachments && permitData.main_attachments.length > 0 && (
                    <Section title="MAIN ATTACHMENTS" icon={<Upload />} sectionKey="attachments">
                        {/* Image Previews Row */}
                        <div className="flex gap-4 overflow-x-auto mb-4">
                            {permitData.main_attachments.filter(att => {
                                const type = att.content_type || att.document_content_type;
                                return att && type && att.url && type.startsWith('image/');
                            }).map((att, idx) => (
                                <div key={att.id} className="flex flex-col items-center min-w-[120px]">
                                    <img
                                        src={att.url}
                                        alt={att.filename || att.document_file_name || 'Attachment'}
                                        className="rounded border max-h-32 object-contain bg-white"
                                    />
                                    <span className="text-xs mt-1 text-gray-700 truncate max-w-[100px]" title={att.filename || att.document_file_name}>{att.filename || att.document_file_name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {permitData.main_attachments.map((attachment: MainAttachment, index: number) => (
                                attachment ? (
                                    <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div className="flex-1">
                                            {(() => {
                                                const name = attachment.filename || attachment.document_file_name || 'No Name';
                                                const fileUrl = attachment.url;
                                                if (fileUrl) {
                                                    return (
                                                        <a
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-700 font-medium hover:underline"
                                                        >
                                                            {name}
                                                        </a>
                                                    );
                                                } else {
                                                    return (
                                                        <span className="text-sm text-gray-700 font-medium">{name}</span>
                                                    );
                                                }
                                            })()}
                                            <div className="text-xs text-gray-500">
                                                {(attachment.content_type || attachment.document_content_type) || '-'} • {Number.isFinite(attachment.file_size || attachment.document_file_size) && (attachment.file_size || attachment.document_file_size) > 0
                                                    ? `${Math.round((attachment.file_size || attachment.document_file_size) / 1024)} KB`
                                                    : '-'}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{formatDate(attachment.updated_at || attachment.created_at)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            {attachment.url ? (
                                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span>
                                                    <Download className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    </Section>
                )}

                {/* Vendor Attachments Section */}
                {permitData.vendor_attachments && (
                    <Section title="VENDOR ATTACHMENTS" icon={<Upload />} sectionKey="vendor-attachments">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">List of People</h4>
                                {permitData.vendor_attachments.list_of_people.length > 0 ? (
                                    <div className="text-sm text-gray-600">
                                        {permitData.vendor_attachments.list_of_people.length} attachment(s)
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">No attachments</div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">ESI WC Policy</h4>
                                {permitData.vendor_attachments.esi_wc_policy.length > 0 ? (
                                    <div className="text-sm text-gray-600">
                                        {permitData.vendor_attachments.esi_wc_policy.length} attachment(s)
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">No attachments</div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Reports</h4>
                                {permitData.vendor_attachments.medical_reports.length > 0 ? (
                                    <div className="text-sm text-gray-600">
                                        {permitData.vendor_attachments.medical_reports.length} attachment(s)
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">No attachments</div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Other</h4>
                                {permitData.vendor_attachments.other.length > 0 ? (
                                    <div className="text-sm text-gray-600">
                                        {permitData.vendor_attachments.other.length} attachment(s)
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">No attachments</div>
                                )}
                            </div>
                        </div>
                    </Section>
                )}

                {/* Permit Extension Section */}
                <Section title="PERMIT EXTENSION" icon={<Clock />} sectionKey="permit-extension">
                    <div className="space-y-6">
                        {/* Form Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Reason for Extension */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Extension<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Enter Reason Here"
                                        value={extendReason}
                                        onChange={(e) => setExtendReason(e.target.value)}
                                    />
                                </div>

                                {/* Extension Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Extension Date&Time<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                        placeholder="dd/mm/yyyy, --:--"
                                        value={extendDate}
                                        onChange={(e) => setExtendDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Assignees */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assignees<span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent bg-white">
                                        <option value="">Select Here</option>
                                        {/* Add options dynamically here */}
                                    </select>
                                </div>

                                {/* Attachment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attachment
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 px-4 py-2 border border-orange-400 text-orange-600 rounded cursor-pointer hover:bg-orange-50 transition-colors">
                                            <Upload className="w-4 h-4" />
                                            Choose files
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                onChange={(e) => setExtendAttachments(e.target.files)}
                                            />
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {extendAttachments && extendAttachments.length > 0
                                                ? `${extendAttachments.length} file(s) selected`
                                                : "No file chosen"
                                            }
                                        </span>
                                    </div>
                                    {/* Show selected files */}
                                    {extendAttachments && extendAttachments.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {Array.from(extendAttachments).map((file, index) => (
                                                <div key={index} className="text-xs text-gray-600">
                                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="extensionAgreement"
                                    className="mt-1 h-4 w-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                                />
                                <label htmlFor="extensionAgreement" className="text-sm text-gray-700 leading-relaxed">
                                    I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil & Norms.
                                </label>
                            </div>
                        </div>

                        {/* Extend Permit Button */}
                        {permitData.show_extend_button && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 font-medium"
                                    onClick={handleExtendPermit}
                                    disabled={isExtending}
                                >
                                    {isExtending ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Extend Permit'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Resume Permit Section */}
                {permitData.show_resume_button && (
                    <Section title="RESUME PERMIT" icon={<RefreshCw />} sectionKey="resume-permit">
                        <div className="space-y-6">
                            {/* Resume Form Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {/* Reason for Resume */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Resume<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-none"
                                            rows={3}
                                            placeholder="Enter Reason Here"
                                        />
                                    </div>

                                    {/* Resume Date & Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Resume Date&Time<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                            placeholder="dd/mm/yyyy, --:--"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Assignees */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assignees<span className="text-red-500">*</span>
                                        </label>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent bg-white">
                                            <option value="">Select Here</option>
                                            {/* Add options dynamically here */}
                                        </select>
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Attachment
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 px-4 py-2 border border-orange-400 text-orange-600 rounded cursor-pointer hover:bg-orange-50 transition-colors">
                                                <Upload className="w-4 h-4" />
                                                Choose files
                                                <input type="file" className="hidden" multiple />
                                            </label>
                                            <span className="text-sm text-gray-500">No file chosen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resume Permit Button */}
                            <div className="flex justify-center pt-4">
                                <Button
                                    className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 font-medium"
                                    onClick={() => {
                                        // Handle resume permit functionality here
                                        toast.success('Permit resume request submitted');
                                    }}
                                >
                                    Resume Permit
                                </Button>
                            </div>
                        </div>
                    </Section>
                )}

                {/* Permit Closure Details Section */}
                {permitData.permit_closure && (
                    <Section title="PERMIT CLOSURE DETAILS" icon={<CheckCircle />} sectionKey="closure">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Field label="Completion Comment" value={permitData.permit_closure.completion_comment || "No comment"} />
                                <Field label="Attachments Count" value={permitData.permit_closure.attachments_count} />
                            </div>
                            <div className="space-y-4">
                                <Field label="Closed By" value={permitData.permit_closure.closed_by?.full_name || "Not closed yet"} />
                            </div>
                        </div>
                        {permitData.permit_closure.closure_approval_levels && permitData.permit_closure.closure_approval_levels.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Closure Approval Levels</h4>
                                <div className="space-y-2">
                                    {permitData.permit_closure.closure_approval_levels.map((level: any, index: number) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">Level {index + 1}: {level.name || level.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Section>
                )}

                {/* Comment Log Section */}
                {permitData.comment_logs && permitData.comment_logs.length > 0 ? (
                    <Section title="COMMENT LOG" icon={<MessageSquare />} sectionKey="comments">
                        <div className="space-y-4">
                            {permitData.comment_logs.map((comment: CommentLog, index: number) => (
                                <div key={comment.id || index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-sm text-gray-900">
                                                <strong>Created By:</strong> {comment.created_by?.full_name || 'Unknown User'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="bg-white p-3 rounded border">
                                                <div className="mb-3">
                                                    <span className="font-semibold text-gray-700 block mb-1">Created At:</span>
                                                    <span className="text-gray-900 block">
                                                        {formatDateWithTimezone(comment.created_at)}
                                                    </span>

                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm text-gray-700">
                                                <strong>Description:</strong>
                                            </span>
                                            <p className="text-sm text-gray-700 mt-1">{comment.description || 'No description provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                className="bg-[#C72030] hover:bg-[#B01D2A] text-white"
                                onClick={() => setCommentModalOpen(true)}
                                disabled={isAddingComment}
                            >
                                {isAddingComment ? 'Adding...' : 'Add Comment'}
                            </Button>
                        </div>
                    </Section>
                ) : (
                    <Section title="COMMENT LOG" icon={<MessageSquare />} sectionKey="comments">
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No comments yet</p>
                            <Button
                                className="bg-[#C72030] hover:bg-[#B01D2A] text-white"
                                onClick={() => setCommentModalOpen(true)}
                                disabled={isAddingComment}
                            >
                                {isAddingComment ? 'Adding...' : 'Add Comment'}
                            </Button>
                        </div>
                    </Section>
                )}

                {/* QR Code Section - Only show when all levels are approved */}
                {permitData.qr_code && permitData.permit.all_level_approved && (
                    <Section title="QR Code" icon={<QrCode />} sectionKey="qrcode">
                        <div className="text-center">
                            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                                <img
                                    src={permitData.qr_code.image_url}
                                    alt="Permit QR Code"
                                    className="w-48 h-48"
                                />
                            </div>
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleDownloadQR}
                                    className="mr-2"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download QR Code
                                </Button>
                                {permitData.qr_code.download_link && (
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(permitData.qr_code.download_link, '_blank')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download via Link
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Section>
                )}

                {/* Safety Check Audits Section */}
                {permitData.safety_check_audits && permitData.safety_check_audits.length > 0 && (
                    <Section title="Safety Check Audits" icon={<CheckCircle />} sectionKey="audits">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">S. No</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Response</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Submitted Date/Time</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Submitted By</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Status</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">View</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Print</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permitData.safety_check_audits.map((audit: any, index: number) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 p-3 text-sm">{index + 1}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{audit.response || '-'}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{formatDate(audit.submitted_at)}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{audit.submitted_by || '-'}</td>
                                            <td className="border border-gray-200 p-3 text-sm">
                                                <Badge variant={audit.status === 'Approved' ? 'default' : 'secondary'}>
                                                    {audit.status}
                                                </Badge>
                                            </td>
                                            <td className="border border-gray-200 p-3 text-sm">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </td>
                                            <td className="border border-gray-200 p-3 text-sm">
                                                <Button variant="ghost" size="sm">Print</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>
                )}
            </div>

            {/* Approve/Reject Buttons - Only show when coming from pending approvals */}
            {showApprovalButtons && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Actions</h3>
                    <div className="flex items-center gap-4 justify-center">
                        <Button
                            onClick={handleApprove}
                            disabled={isApproving || isRejecting}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 font-medium"
                        >
                            {isApproving ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Permit
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={isApproving || isRejecting}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 font-medium"
                        >
                            {isRejecting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Rejecting...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Reject Permit
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Comment Modal */}
            <AddPermitCommentModal
                open={commentModalOpen}
                onOpenChange={setCommentModalOpen}
                onAddComment={handleAddComment}
                title={`Add Comment to Permit ${permitData?.permit.reference_number || permitData?.permit.id}`}
                isSubmitting={isAddingComment}
            />

            {/* Reject Permit Dialog */}
            <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Permit</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for Rejection"
                            value={rejectComment}
                            onChange={(e) => setRejectComment(e.target.value)}
                            rows={4}
                            className="w-full"
                        />
                    </div>
                    <DialogFooter className="flex flex-row justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRejectCancel}
                            disabled={isRejecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectConfirm}
                            disabled={isRejecting}
                            className="bg-[#C72030] hover:bg-[#a61b27] text-white"
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
