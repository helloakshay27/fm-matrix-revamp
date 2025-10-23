import React, { useState, useEffect, useRef, memo } from "react";
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
    Edit,
    Printer,
    Eye,
    FileSpreadsheet,
    File,
} from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { AddPermitCommentModal } from "@/components/AddPermitCommentModal";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Box, SelectChangeEvent, TextField } from '@mui/material';
import { format } from "date-fns";

// MUI field styles
const fieldStyles = {
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: '12px',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: 'white',
        '& fieldset': {
            borderColor: '#e5e7eb',
        },
        '&:hover fieldset': {
            borderColor: '#9ca3af',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#C72030',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6b7280',
        '&.Mui-focused': {
            color: '#C72030',
        },
    },
};

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            zIndex: 9999,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
    },
    MenuListProps: {
        style: {
            padding: 0,
        },
    },
    anchorOrigin: {
        vertical: 'bottom' as const,
        horizontal: 'left' as const,
    },
    transformOrigin: {
        vertical: 'top' as const,
        horizontal: 'left' as const,
    },
};

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
    id?: number;
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
    id: number;
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

interface PermitExtend {
    id: number;
    reason_for_extension: string;
    extension_date: string;
    created_by: {
        full_name: string;
    };
    assignees: string;
    attachments_count: number;
    extend_approval_levels: ApprovalLevel[];
    status?: string;
}

interface PermitDetailsResponse {
    permit: Permit;
    approval_levels: ApprovalLevel[];
    permit_extends: PermitExtend[];
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
    show_upload_jsa_form_button: boolean;
    show_complete_draft_open_button: boolean;
    show_fill_jsa_button: boolean;
    show_complete_form_button: boolean;
    show_extend_permit_approved_button: boolean;
    show_complete_approved_button: boolean;
    show_resume_permit_button: boolean;
    show_extend_permit_extended_button: boolean;
    all_buttons_hidden: boolean;
    // Legacy button flags for backward compatibility
    show_extend_button?: boolean;
    show_resume_button?: boolean;
    show_upload_jsa_button?: boolean;
    show_complete_button?: boolean;
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

// Section component for organized layout - defined outside main component to prevent re-renders
const Section = memo(({
    title,
    icon,
    children,
    sectionKey,
    activeSection,
    setActiveSection
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    sectionKey: string;
    activeSection: string;
    setActiveSection: (key: string) => void;
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
        {(activeSection === sectionKey || (activeSection === "details" && sectionKey !== "permit-extension")) && (
            <div className="p-6">
                {children}
            </div>
        )}
    </div>
));

// Field component for consistent styling - defined outside main component to prevent re-renders
const Field = memo(({
    label,
    value,
    fullWidth = false,
    className = "",
}: {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
}) => (
    <div className={`flex ${fullWidth ? 'flex-col' : 'items-center'} gap-4 ${fullWidth ? 'mb-4' : ''} ${className}`}>
        <label className={`${fullWidth ? 'text-sm' : 'w-32 text-sm'} font-medium text-gray-700`}>
            {label}
        </label>
        {!fullWidth && <span className="text-sm">:</span>}
        <span className={`text-sm text-gray-900 ${fullWidth ? '' : "w-[200px] text-wrap break-words "} ${fullWidth ? 'mt-1' : 'flex-1'}`}>
            {value || '-'}
        </span>
    </div>
));

export const PermitDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const [permitData, setPermitData] = useState<PermitDetailsResponse | null>(null);
    console.log(permitData)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState("details");
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectComment, setRejectComment] = useState("");
    const [extensionId, setExtensionId] = useState<string>("");

    // Extend permit form states
    const [isExtending, setIsExtending] = useState(false);
    const [extendReason, setExtendReason] = useState("");
    const [extendDate, setExtendDate] = useState("");
    const [extendAttachments, setExtendAttachments] = useState<FileList | null>(null);
    const [selectedExtendAssignees, setSelectedExtendAssignees] = useState<string[]>([]);

    // Upload JSA form states
    const [jsaUploadModalOpen, setJsaUploadModalOpen] = useState(false);
    const [jsaAttachments, setJsaAttachments] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Complete permit form states
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [completionComment, setCompletionComment] = useState("");
    const [completeAttachments, setCompleteAttachments] = useState<File[]>([]);
    const [isCompleting, setIsCompleting] = useState(false);

    // Attachment preview modal states
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPermitSectionVisible, setIsPermitSectionVisible] = useState(false)
    const [isResumeSectionVisible, setIsResumeSectionVisible] = useState(false)

    console.log(isResumeSectionVisible)

    // Check if we came from pending approvals page
    const levelId = searchParams.get('level_id');
    const userId = searchParams.get('user_id');
    const closureId = searchParams.get('closure_id');
    const resourceId = searchParams.get('resource_id');
    const isApprovalPage = searchParams.get('type') === 'approval';

    const completeFileInputRef = useRef(null)

    const isFromPendingApprovals = searchParams.get('type') === 'approval';
    const showApprovalButtons = levelId && userId && isApprovalPage;
    const permitClosure = searchParams.get('resource_type') === 'permit_closure';
    const permitExtension = searchParams.get('resource_type') === 'permit_extend';
    const permitMain = searchParams.get('resource_type') === 'permit';
    console.log(selectedExtendAssignees)

    // Resume permit form states (mirror of extend)
    const [isResuming, setIsResuming] = useState(false);
    const [resumeReason, setResumeReason] = useState("");
    const [resumeDate, setResumeDate] = useState("");
    const [resumeAttachments, setResumeAttachments] = useState<FileList | null>(null);
    const [selectedResumeAssignees, setSelectedResumeAssignees] = useState<string[]>([]);
    const resumeFileInputRef = useRef<HTMLInputElement>(null);


    // Handle multi-select change for assignees
    const handleAssigneeChange = (event: SelectChangeEvent<typeof selectedExtendAssignees>) => {
        const {
            target: { value },
        } = event;
        setSelectedExtendAssignees(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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

    // Handle multi-select change for resume assignees
    const handleResumeAssigneeChange = (event: SelectChangeEvent<typeof selectedResumeAssignees>) => {
        const {
            target: { value },
        } = event;
        setSelectedResumeAssignees(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
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

    // Handle approve permit extension
    const handleApproveExtension = async (extensionId: string) => {
        if (!extensionId) {
            toast.error('Extension ID is required for approval');
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

            const response = await fetch(`${baseUrl}/pms/permit_extends/${extensionId}/status_confirmation.json?approve=true&user_id=${userId}&level_id=${levelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to approve permit extension: ${response.statusText}`);
            }

            toast.success('Permit extension approved successfully');

            // Refresh permit details to show updated status
            const updatedData = await fetchPermitDetails(id!);
            setPermitData(updatedData);

            // Navigate back to pending approvals after successful approval
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error approving permit extension:', error);
            toast.error('Failed to approve permit extension. Please try again.');
        } finally {
            setIsApproving(false);
        }
    };

    // Handle reject permit extension
    const handleRejectExtension = async () => {
        if (!extensionId) {
            toast.error('Extension ID is required for rejection');
            return;
        }

        if (!levelId) {
            toast.error('Level ID is required for rejection');
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

            const response = await fetch(`${baseUrl}/pms/permit_extends/${extensionId}/status_confirmation.json?approve=false&user_id=${userId}&level_id=${levelId}&rejection_reason=${rejectComment.trim()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to reject permit extension: ${response.statusText}`);
            }

            toast.success('Permit extension rejected successfully');

            // Refresh permit details to show updated status
            const updatedData = await fetchPermitDetails(id!);
            setPermitData(updatedData);

            // Navigate back to pending approvals after successful rejection
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error rejecting permit extension:', error);
            toast.error('Failed to reject permit extension. Please try again.');
        } finally {
            setIsRejecting(false);
        }
    };

    // Handle approve permit closure
    const handleApproveClosure = async (closureId: string) => {
        console.log('=== APPROVE CLOSURE DEBUG ===');
        console.log('Closure ID passed:', closureId);
        console.log('Permit closure data:', permitData?.permit_closure);
        console.log('Level ID:', levelId);
        console.log('User ID:', userId);

        if (!closureId) {
            console.error('No closure ID provided');
            toast.error('Closure ID is required for approval');
            return;
        }

        if (!levelId) {
            console.error('No level ID provided');
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

            const response = await fetch(`${baseUrl}/pms/permit_closures/${closureId}/status_confirmation.json?approve=true&user_id=${userId}&level_id=${levelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to approve permit closure: ${response.statusText}`);
            }

            toast.success('Permit closure approved successfully');

            // Refresh permit details to show updated status
            const updatedData = await fetchPermitDetails(id!);
            setPermitData(updatedData);

            // Navigate back to pending approvals after successful approval
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error approving permit closure:', error);
            toast.error('Failed to approve permit closure. Please try again.');
        } finally {
            setIsApproving(false);
        }
    };

    // Handle reject permit closure
    const handleRejectClosure = async () => {
        const closerId = permitData?.permit_closure?.id?.toString();

        if (!closerId) {
            console.error('No closure ID provided');
            toast.error('Closure ID is required for rejection');
            return;
        }

        if (!levelId) {
            console.error('No level ID provided');
            toast.error('Level ID is required for rejection');
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

            const response = await fetch(`${baseUrl}/pms/permit_closures/${closerId}/status_confirmation.json?approve=false&user_id=${userId}&level_id=${levelId}&rejection_reason=${rejectComment.trim()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to reject permit closure: ${response.statusText}`);
            }

            toast.success('Permit closure rejected successfully');

            // Refresh permit details to show updated status
            const updatedData = await fetchPermitDetails(id!);
            setPermitData(updatedData);

            // Navigate back to pending approvals after successful rejection
            navigate('/safety/permit/pending-approvals');
        } catch (error) {
            console.error('Error rejecting permit closure:', error);
            toast.error('Failed to reject permit closure. Please try again.');
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

        // if (selectedExtendAssignees.length === 0) {
        //     toast.error('Please select at least one assignee');
        //     return;
        // }

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

            // Add selected assignees
            if (selectedExtendAssignees.length > 0) {
                selectedExtendAssignees.forEach((assigneeId, index) => {
                    formData.append(`pms_permit_extend[permit_extension_assignees][]`, assigneeId);
                });
            }

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
            setSelectedExtendAssignees([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

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

    // Handle resume permit form submission (mirror of extend, but add to_resume: true)
    const handleResumePermit = async () => {
        if (!id) {
            toast.error('Permit ID is required for resume');
            return;
        }

        if (!resumeReason.trim()) {
            toast.error('Please provide a reason for resume');
            return;
        }

        if (!resumeDate) {
            toast.error('Please select a resume date');
            return;
        }

        // if (selectedResumeAssignees.length === 0) {
        //     toast.error('Please select at least one assignee');
        //     return;
        // }

        setIsResuming(true);
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
            formData.append('pms_permit_extend[reason_for_extension]', resumeReason.trim());
            formData.append('pms_permit_extend[extension_date]', resumeDate);
            formData.append('pms_permit_extend[to_resume]', 'true');  // Add the extra param for resume

            // Add selected assignees
            if (selectedResumeAssignees.length > 0) {
                selectedResumeAssignees.forEach((assigneeId, index) => {
                    formData.append(`pms_permit_extend[permit_extension_assignees][]`, assigneeId);
                });
            }

            // Add attachments if any
            if (resumeAttachments && resumeAttachments.length > 0) {
                for (let i = 0; i < resumeAttachments.length; i++) {
                    formData.append('extend_attachments[]', resumeAttachments[i]);
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
                throw new Error(`Failed to resume permit: ${response.statusText}`);
            }

            toast.success('Permit resume request submitted successfully');

            // Clear form data
            setResumeReason("");
            setResumeDate("");
            setResumeAttachments(null);
            setSelectedResumeAssignees([]);
            if (resumeFileInputRef.current) {
                resumeFileInputRef.current.value = "";
            }

            // Refresh permit details to show updated information
            const updatedData = await fetchPermitDetails(id);
            setPermitData(updatedData);

        } catch (error) {
            console.error('Error resuming permit:', error);
            toast.error('Failed to submit permit resume. Please try again.');
        } finally {
            setIsResuming(false);
        }
    };

    // Handle JSA file upload
    const handleJsaUpload = async (e) => {
        e.stopPropagation();
        if (jsaAttachments.length === 0) {
            toast.error("Please attach at least one file.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            jsaAttachments.forEach((file, index) => {
                formData.append(`attachments[]`, file);

            });
            formData.append('pms_permit[id]', id || '');
            // Use API_CONFIG to ensure consistent URL construction


            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                throw new Error('Base URL or token not found');
            }

            // Ensure protocol is present
            let fullBaseUrl = baseUrl;
            if (!/^https?:\/\//i.test(baseUrl)) {
                fullBaseUrl = `https://${baseUrl}`;
            }

            // Construct the full URL using the base URL to avoid path concatenation issues
            const url = `${fullBaseUrl}/pms/permits/${id}.json`;
            console.log('Uploading JSA to URL:', url);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to upload attachments: ${response.status} ${response.statusText}`);
            }

            // const result = await response.json();
            toast.success('JSA/Form uploaded successfully');
            setJsaUploadModalOpen(false);
            setJsaAttachments([]);

            // Refresh permit data to show updated attachments
            if (id) {
                try {
                    // Call handleRefresh instead to use the established refresh logic
                    await handleRefresh();
                    console.log("Permit data refreshed successfully after upload");
                } catch (refreshError) {
                    console.error('Error refreshing permit data after upload:', refreshError);
                }
            }
        } catch (error) {
            console.error('Error uploading JSA:', error);
            toast.error('Failed to upload files. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle complete permit form submission
    const handleCompletePermit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            toast.error('Permit ID is required for completion');
            return;
        }

        if (!completionComment.trim()) {
            toast.error('Please provide a completion comment');
            return;
        }

        setIsCompleting(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                throw new Error('Base URL or token not found');
            }

            // Ensure protocol is present
            let fullBaseUrl = baseUrl;
            if (!/^https?:\/\//i.test(baseUrl)) {
                fullBaseUrl = `https://${baseUrl}`;
            }

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('pms_permit_closure[permit_id]', id);
            formData.append('pms_permit_closure[completion_comment]', completionComment.trim());

            // Add attachments if any
            if (completeAttachments && completeAttachments.length > 0) {
                completeAttachments.forEach((file, index) => {
                    formData.append('closer_attachments[]', file);
                });
            }

            const response = await fetch(`${fullBaseUrl}/pms/permit_closures.json`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to complete permit: ${response.status} ${response.statusText}`);
            }

            toast.success('Permit completed successfully');
            setCompleteModalOpen(false);
            setCompletionComment("");
            setCompleteAttachments([]);

            // Refresh permit data to show updated information
            if (id) {
                try {
                    await handleRefresh();
                    console.log("Permit data refreshed successfully after completion");
                } catch (refreshError) {
                    console.error('Error refreshing permit data after completion:', refreshError);
                }
            }
        } catch (error) {
            console.error('Error completing permit:', error);
            toast.error('Failed to complete permit. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    // Handle file selection for complete permit attachments
    const handleCompleteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCompleteAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    // Handle removing a file from the complete attachments list
    const handleRemoveCompleteFile = (index: number) => {
        setCompleteAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // Handle file selection for JSA uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setJsaAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    // Handle removing a file from the list
    const handleRemoveFile = (index: number) => {
        setJsaAttachments(prev => prev.filter((_, i) => i !== index));
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
                console.log(response)
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
    // const handleDownloadQR = () => {
    //     if (permitData?.qr_code?.image_url) {
    //         const link = document.createElement('a');
    //         link.href = permitData.qr_code.image_url;
    //         link.download = `permit-${permitData.permit.id}-qr-code.png`;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }
    // };

    const handleDownloadQR = async () => {
        if (permitData?.qr_code?.id) {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');

                if (!baseUrl || !token) {
                    toast.error('Authentication information missing');
                    return;
                }

                // Ensure protocol is present
                let fullBaseUrl = baseUrl;
                if (!/^https?:\/\//i.test(baseUrl)) {
                    fullBaseUrl = `https://${baseUrl}`;
                }

                // Download QR code using the provided format
                const fileUrl = `https://${baseUrl}/attachfiles/${permitData.qr_code.id}?show_file=true`;
                const response = await fetch(fileUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to download QR code');
                }

                // Get the blob from the response
                const blob = await response.blob();

                // Create object URL and trigger download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `permit-${permitData.permit.id}-qr-code.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success('QR code downloaded successfully');
            } catch (error) {
                console.error('Error downloading QR code:', error);
                toast.error('Failed to download QR code. Please try again.');
            }
        } else {
            toast.error('QR code not available');
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

    // Handle print JSA
    const handlePrintJSA = async () => {
        if (!id) {
            toast.error('Permit ID is required');
            return;
        }

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

            const response = await fetch(`${baseUrl}/pms/permits/${id}/print_pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `permit-${id}-jsa.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('JSA PDF downloaded successfully');
            } else {
                console.error('Failed to download JSA PDF:', response.status, response.statusText);
                toast.error('Failed to download JSA PDF');
            }
        } catch (error) {
            console.error('Error downloading JSA PDF:', error);
            toast.error('Error downloading JSA PDF');
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

    // Using memoized Section and Field components defined outside the component to avoid re-renders

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
                {!permitData.all_buttons_hidden && (
                    <div className="flex items-center gap-4">
                        {!isFromPendingApprovals && permitData.show_edit_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/safety/permit/edit/${id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        )}
                        {!isFromPendingApprovals && (permitData.show_extend_permit_approved_button || permitData.show_extend_button) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsPermitSectionVisible(true)
                                    setActiveSection(activeSection === "permit-extension" ? "" : "permit-extension")
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Extend Permit
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_extend_permit_extended_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveSection(activeSection === "permit-extension" ? "" : "permit-extension")}
                                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Extend (Extended)
                            </Button>
                        )}
                        {!isFromPendingApprovals && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/safety/permit/vendor-form/${id}`)}
                                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Fill Form
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_fill_jsa_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/safety/permit/fill-jsa-form/${id}`)}
                                className="bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Fill JSA Form
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_complete_form_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/safety/permit/fill-form/${id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            >
                                <Clipboard className="w-4 h-4 mr-2" />
                                Complete Form
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_complete_draft_open_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCompleteModalOpen(true)}
                                className="bg-teal-500 hover:bg-teal-600 text-white border-teal-500"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Complete Draft
                            </Button>
                        )}
                        {!isFromPendingApprovals && (permitData.show_complete_approved_button || permitData.show_complete_button) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCompleteModalOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete
                            </Button>
                        )}
                        {!isFromPendingApprovals && (permitData.show_upload_jsa_form_button || permitData.show_upload_jsa_button) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setJsaUploadModalOpen(true)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload JSA
                            </Button>
                        )}
                        {!isFromPendingApprovals && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsResumeSectionVisible(true);
                                    setActiveSection(activeSection === "resume-permit" ? "" : "resume-permit");
                                }}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Resume
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_print_form_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrintForm}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print Form
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_print_jsa_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrintJSA}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print JSA
                            </Button>
                        )}
                        {!isFromPendingApprovals && permitData.show_send_mail_button && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    try {
                                        let baseUrl = localStorage.getItem('baseUrl');
                                        const token = localStorage.getItem('token');
                                        if (!baseUrl || !token || !id) {
                                            toast.error('Base URL, token, or permit ID missing');
                                            return;
                                        }
                                        if (!/^https?:\/\//i.test(baseUrl)) {
                                            baseUrl = `https://${baseUrl}`;
                                        }
                                        const response = await fetch(`${baseUrl}/pms/permits/${id}/permit_supplier_mail.json`, {
                                            method: 'GET',
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/json',
                                                'Accept': 'application/json',
                                            },
                                        });
                                        if (response.ok) {
                                            toast.success('Mail sent successfully');
                                        } else {
                                            toast.error('Failed to send mail');
                                        }
                                    } catch (error) {
                                        toast.error('Error sending mail');
                                    }
                                }}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Mail
                            </Button>
                        )}
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            title="Refresh permit details"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadQR}
                            title="Download QR Code"
                        >
                            <Download className="w-4 h-4" />
                        </Button> */}
                    </div>
                )}
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
                                    {/* {`${level.updated_by} (${formatDateOnly(level.status_updated_at)})`} */}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
                {/* Permit Details Section */}
                <Section
                    title="PERMIT DETAILS"
                    icon={<FileText />}
                    sectionKey="details"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4 ">
                            <Field label="Permit ID" value={permitData.permit.id} />
                            <Field label="Reference No" value={permitData.permit.reference_number} />
                            <Field label="Permit Type" value={permitData.permit.permit_type} />
                            <Field label="Permit For" value={permitData.permit.permit_for} />
                            {/* <Field
                                label="Permit For"
                                value={
                                    <span className="break-words whitespace-normal">
                                        {permitData.permit.permit_for}
                                    </span>
                                }
                            /> */}
                            {/* <Field label="Permit Status" value={
                                <Badge className="text-white bg-blue-500">
                                    {permitData.permit.status}
                                </Badge>
                            } /> */}
                            <Field
                                label="Permit Status"
                                value={
                                    <Badge
                                        className={`text-white ${permitData?.permit?.status === 'Draft'
                                            ? 'bg-[#0d6efd]'
                                            : permitData?.permit?.status === 'Extended'
                                                ? 'bg-[#0dcaf0]'
                                                : permitData?.permit?.status === 'Expired'
                                                    ? 'bg-[#01C833]'
                                                    : permitData?.permit?.status === 'Approved'
                                                        ? 'bg-[#ffc40b]'
                                                        : permitData?.permit?.status === 'Hold'
                                                            ? 'bg-[#808080]'
                                                            : 'bg-gray-400'
                                            }`}
                                    >
                                        {permitData?.permit?.status || '-'}
                                    </Badge>
                                }
                            />

                            <Field label="Extension Status" value={permitData.permit.extension_status} />
                        </div>
                        <div className="space-y-4">
                            <Field label="Current User ID" value={permitData.permit.current_user_id} />
                            <Field label="All Level Approved" value={permitData.permit.all_level_approved ? "Yes" : "No"} />
                            <Field label="Created On" value={permitData?.permit?.created_at && format(permitData.permit.created_at, "dd/MM/yyyy hh:mm a")} />
                            <Field label="Expiry Date" value={permitData?.permit?.expiry_date && format(permitData.permit.expiry_date, "dd/MM/yyyy hh:mm a")} />
                            <Field label="Extension Date" value={permitData?.permit?.extension_date && format(permitData.permit.extension_date, "dd/MM/yyyy hh:mm a")} />
                            <Field label="Resume Date" value={permitData?.permit?.resume_date && format(permitData.permit.resume_date, "dd/MM/yyyy hh:mm a")} />
                        </div>
                    </div>
                    <div className="mt-6 text-wrap break-words">
                        <Field label="Location Details" value={permitData.permit.location_details} />
                        <Field label="Comment" value={permitData.permit.comment || "No comments"} />
                        <Field label="Rejection Reason" value={permitData.permit.rejection_reason || "None"} />
                    </div>
                </Section>

                {/* Requestor's Information Section */}
                <Section
                    title="REQUESTOR'S INFORMATION"
                    icon={<User />}
                    sectionKey="requestor"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Created By" value={permitData.permit.created_by.full_name} />
                            <Field label="Department" value={permitData.permit.created_by.department_name} />
                            <Field label="Mobile" value={permitData.permit.created_by.mobile} />
                        </div>
                        <div className="space-y-4">
                            <Field label="Vendor Company" value={permitData.permit.vendor?.company_name || "N/A"} />
                            {/* <Field label="External Vendor Name" value={permitData.permit.external_vendor_name || "N/A"} /> */}
                        </div>
                    </div>
                </Section>

                {/* Approval Levels Section */}
                {/* {permitData.approval_levels && permitData.approval_levels.length > 0 && (
                    <Section
                        title="APPROVAL LEVELS"
                        icon={<CheckCircle />}
                        sectionKey="approval-levels"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
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
                )} */}



                {/* Manpower Details Section */}
                {permitData.manpower_details && permitData.manpower_details.length > 0 && (
                    <Section
                        title="MANPOWER DETAILS"
                        icon={<User />}
                        sectionKey="manpower"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
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
                                            <span className="text-gray-900">{manpower.designation || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Contact: </span>
                                            <span className="text-gray-900">{manpower.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Activity Details Section */}
                {/* <Section
                    title="ACTIVITY DETAILS"
                    icon={<Clipboard />}
                    sectionKey="activity"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
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
                </Section> */}
                <Section
                    title="ACTIVITY DETAILS"
                    icon={<Clipboard />}
                    sectionKey="activity"
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                >
                    <div className="grid grid-cols-1  gap-6">
                        <div className="space-y-4">
                            {permitData.activity_details && permitData.activity_details.length > 0 ? (
                                permitData.activity_details.map((activity: any, index: number) => (
                                    <div
                                        key={activity.id || index}
                                        className="p-4 bg-gray-50 rounded-lg"
                                    >
                                        {/* One row with 3 fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                            <div className="flex flex-wrap">
                                                <span className="font-medium text-gray-700 mr-2">Activity</span>
                                                <span className="mr-2">:</span>
                                                <span className="text-gray-900">{activity.activity || "-"}</span>
                                            </div>
                                            <div className="flex flex-wrap">
                                                <span className="font-medium text-gray-700 mr-2">Sub Activity</span>
                                                <span className="mr-2">:</span>
                                                <span className="text-gray-900">{activity.sub_activity || "-"}</span>
                                            </div>
                                            <div className="flex flex-wrap">
                                                <span className="font-medium text-gray-700 mr-2">Category of Hazard</span>
                                                <span className="mr-2">:</span>
                                                <span className="text-gray-900">{activity.hazard_category || "-"}</span>
                                            </div>
                                        </div>

                                        {/* Risks */}
                                        <div>
                                            <h5 className="font-semibold mb-2">Risks</h5>
                                            <ul className="list-disc pl-6 text-gray-700">
                                                {activity.risks && activity.risks.length > 0 ? (
                                                    activity.risks.map((risk: string, i: number) => (
                                                        <li key={i}>{risk}</li>
                                                    ))
                                                ) : (
                                                    <li>-</li>
                                                )}
                                            </ul>
                                        </div>
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
                    <Section
                        title="MAIN ATTACHMENTS"
                        icon={<Upload />}
                        sectionKey="attachments"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="flex items-center flex-wrap gap-4">
                            {permitData.main_attachments.map((attachment: MainAttachment) => {
                                const attachmentUrl = attachment.url;
                                const attachmentName = attachment.filename || attachment.document_file_name || `Document_${attachment.id}`;
                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
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
                                                    {/* <Eye className="w-4 h-4" /> */}
                                                </button>
                                                <img
                                                    src={attachmentUrl}
                                                    alt={attachmentName}
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
                                            {attachmentName}
                                        </span>
                                        {(isDownloadable || isImage) && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                onClick={() => {
                                                    if (isImage) {
                                                        setSelectedDoc(attachment);
                                                        setIsModalOpen(true);
                                                    } else if (attachmentUrl) {
                                                        window.open(attachmentUrl, '_blank');
                                                    }
                                                }}
                                            >
                                                {isImage ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                )}

                {/* {permitData.vendor_attachments && (
                    permitData.vendor_attachments.list_of_people.length > 0 ||
                    permitData.vendor_attachments.esi_wc_policy.length > 0 ||
                    permitData.vendor_attachments.medical_reports.length > 0 ||
                    permitData.vendor_attachments.other.length > 0
                ) && (
                        <Section
                            title="VENDOR ATTACHMENTS"
                            icon={<Upload />}
                            sectionKey="vendor-attachments"
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">List of People</h4>
                                    {permitData.vendor_attachments.list_of_people.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.list_of_people.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {(isDownloadable || isImage) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    if (isImage) {
                                                                        setSelectedDoc(attachment);
                                                                        setIsModalOpen(true);
                                                                    } else if (attachmentUrl) {
                                                                        window.open(attachmentUrl, '_blank');
                                                                    }
                                                                }}
                                                            >
                                                                {isImage ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">ESI WC Policy</h4>
                                    {permitData.vendor_attachments.esi_wc_policy.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.esi_wc_policy.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {(isDownloadable || isImage) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    if (isImage) {
                                                                        setSelectedDoc(attachment);
                                                                        setIsModalOpen(true);
                                                                    } else if (attachmentUrl) {
                                                                        window.open(attachmentUrl, '_blank');
                                                                    }
                                                                }}
                                                            >
                                                                {isImage ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Medical Reports</h4>
                                    {permitData.vendor_attachments.medical_reports.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.medical_reports.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {(isDownloadable || isImage) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    if (isImage) {
                                                                        setSelectedDoc(attachment);
                                                                        setIsModalOpen(true);
                                                                    } else if (attachmentUrl) {
                                                                        window.open(attachmentUrl, '_blank');
                                                                    }
                                                                }}
                                                            >
                                                                {isImage ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Other</h4>
                                    {permitData.vendor_attachments.other.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.other.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {(isDownloadable || isImage) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    if (isImage) {
                                                                        setSelectedDoc(attachment);
                                                                        setIsModalOpen(true);
                                                                    } else if (attachmentUrl) {
                                                                        window.open(attachmentUrl, '_blank');
                                                                    }
                                                                }}
                                                            >
                                                                {isImage ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>
                            </div>
                        </Section>
                    )} */}

                {/* Vendor Attachments Section - Full Implementation with All Categories */}
                {permitData.vendor_attachments && (
                    permitData.vendor_attachments.list_of_people.length > 0 ||
                    permitData.vendor_attachments.esi_wc_policy.length > 0 ||
                    permitData.vendor_attachments.medical_reports.length > 0 ||
                    permitData.vendor_attachments.other.length > 0
                ) && (
                        <Section
                            title="VENDOR ATTACHMENTS"
                            icon={<Upload />}
                            sectionKey="vendor-attachments"
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        >
                            <div className="space-y-6">
                                {/* List of People */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">List of People</h4>
                                    {permitData.vendor_attachments.list_of_people.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.list_of_people.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {/* Unified Eye button for all types: opens modal for preview/download */}
                                                        {(isDownloadable || isImage || true) && (  // Show for all, even non-downloadable
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    setSelectedDoc(attachment);
                                                                    setIsModalOpen(true);
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
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                {/* ESI WC Policy */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">ESI WC Policy</h4>
                                    {permitData.vendor_attachments.esi_wc_policy.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.esi_wc_policy.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {/* Unified Eye button for all types: opens modal for preview/download */}
                                                        {(isDownloadable || isImage || true) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    setSelectedDoc(attachment);
                                                                    setIsModalOpen(true);
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
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                {/* Medical Reports */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Medical Reports</h4>
                                    {permitData.vendor_attachments.medical_reports.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.medical_reports.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {/* Unified Eye button for all types: opens modal for preview/download */}
                                                        {(isDownloadable || isImage || true) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    setSelectedDoc(attachment);
                                                                    setIsModalOpen(true);
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
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>

                                {/* Other */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Other</h4>
                                    {permitData.vendor_attachments.other.length > 0 ? (
                                        <div className="flex items-center flex-wrap gap-4">
                                            {permitData.vendor_attachments.other.map((attachment: any, index: number) => {
                                                const attachmentUrl = attachment.url || attachment.document_url;
                                                const attachmentName = attachment.filename || attachment.document_file_name || attachment.name || `Document_${index + 1}`;
                                                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '');
                                                const isPdf = /\.pdf$/i.test(attachmentUrl || '');
                                                const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '');
                                                const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '');
                                                const isDownloadable = isPdf || isExcel || isWord;

                                                return (
                                                    <div
                                                        key={attachment.id || index}
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
                                                                    src={attachmentUrl}
                                                                    alt={attachmentName}
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
                                                            {attachmentName}
                                                        </span>
                                                        {/* Unified Eye button for all types: opens modal for preview/download */}
                                                        {(isDownloadable || isImage || true) && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                                                onClick={() => {
                                                                    setSelectedDoc(attachment);
                                                                    setIsModalOpen(true);
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
                                        <div className="text-sm text-gray-500">No attachments</div>
                                    )}
                                </div>
                            </div>
                        </Section>
                    )}



                {/* Permit Extension Section */}

                {
                    isPermitSectionVisible && (
                        <Section
                            title="PERMIT EXTENSION"
                            icon={<Clock />}
                            sectionKey="permit-extension"
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        >
                            <div className="space-y-6">
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {/* Reason for Extension */}
                                        <div>
                                            <TextField
                                                label="Reason for Extension *"
                                                value={extendReason}
                                                onChange={(e) => setExtendReason(e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                placeholder="Enter Reason Here"
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "auto !important",
                                                        padding: "2px !important",
                                                        display: "flex",
                                                    },
                                                    "& .MuiInputBase-input[aria-hidden='true']": {
                                                        flex: 0,
                                                        width: 0,
                                                        height: 0,
                                                        padding: "0 !important",
                                                        margin: 0,
                                                        display: "none",
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        resize: "none !important",
                                                    },
                                                }} />
                                        </div>

                                        {/* Extension Date & Time */}
                                        <div>
                                            <TextField
                                                label="Extension Date & Time *"
                                                type="datetime-local"
                                                value={extendDate}
                                                onChange={(e) => setExtendDate(e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                sx={fieldStyles}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Assignees */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Assignees<span className="text-red-500">*</span>
                                            </label>
                                            <FormControl
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#C72030',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#C72030',
                                                            borderWidth: '2px',
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    multiple
                                                    value={selectedExtendAssignees}
                                                    onChange={handleAssigneeChange}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) => {
                                                        if ((selected as string[]).length === 0) {
                                                            return <span style={{ color: '#9CA3AF' }}>Select assignees</span>;
                                                        }
                                                        return (
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {(selected as string[]).map((value) => {
                                                                    const assignee = permitData?.permit?.permit_assignees?.find(a => a.id.toString() === value);
                                                                    return (
                                                                        <Chip
                                                                            key={value}
                                                                            label={assignee?.name || value}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: '#C72030',
                                                                                color: 'white',
                                                                                '& .MuiChip-deleteIcon': {
                                                                                    color: 'white',
                                                                                },
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </Box>
                                                        );
                                                    }}
                                                    displayEmpty
                                                    sx={{
                                                        minHeight: '48px',
                                                        '& .MuiSelect-placeholder': {
                                                            color: '#9CA3AF',
                                                        },
                                                    }}
                                                >
                                                    <MenuItem disabled value="">
                                                        <em>Select assignees</em>
                                                    </MenuItem>
                                                    {permitData?.permit?.permit_assignees?.map((assignee) => (
                                                        <MenuItem key={assignee.id} value={assignee.id.toString()}>
                                                            {assignee.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        {/* Attachment */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Attachment
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#C72030] border border-gray-300 rounded cursor-pointer transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    Choose files
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        multiple
                                                        onChange={(e) => setExtendAttachments(e.target.files)}
                                                    />
                                                </label>
                                                <span className="text-sm text-gray-500">
                                                    {extendAttachments && extendAttachments.length > 0
                                                        ? `${extendAttachments.length} file(s) selected`
                                                        : "No file chosen"}
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

                            </div>
                        </Section>
                    )
                }

                {/* Permit Extensions Section */}
                {permitData.permit_extends && permitData.permit_extends.length > 0 && (
                    <Section
                        title="PERMIT EXTENSIONS"
                        icon={<Clock />}
                        sectionKey="extensions"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-4">
                            {permitData.permit_extends.map((extension: PermitExtend, index: number) => (
                                <div key={extension.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-medium text-gray-900">Extension #{extension.id}</h4>
                                        <Badge className={`${extension.extend_approval_levels?.[0]?.status === 'Approved'
                                            ? 'bg-green-100 text-green-800'
                                            : extension.extend_approval_levels?.[0]?.status === 'Rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {extension.extend_approval_levels?.[0]?.status || 'Pending'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Reason:</span>
                                            <p className="text-gray-900 mt-1">{extension.reason_for_extension || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Extension Date:</span>
                                            <p className="text-gray-900 mt-1">{extension?.extension_date && format(extension?.extension_date, "dd/MM/yyyy hh:mm a")}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Created By:</span>
                                            <p className="text-gray-900 mt-1">{extension.created_by?.full_name || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Assignees:</span>
                                            <p className="text-gray-900 mt-1">{extension.assignees || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Attachments:</span>
                                            <p className="text-gray-900 mt-1">{extension.attachments_count || 0}</p>
                                        </div>
                                    </div>

                                    {/* Extension Approval Levels */}
                                    {extension.extend_approval_levels && extension.extend_approval_levels.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h5 className="font-medium text-gray-700 mb-2">Approval Levels:</h5>
                                            <div className="space-y-2">
                                                {extension.extend_approval_levels.map((level: any, levelIndex: number) => (
                                                    <div key={levelIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-medium">{level.name}</span>
                                                            <Badge className={getStatusColor(level.status)}>
                                                                {level.status}
                                                            </Badge>
                                                        </div>
                                                        {level.updated_by && (
                                                            <div className="text-xs text-gray-500">
                                                                {level.updated_by}
                                                                {level.status_updated_at && (
                                                                    <span className="ml-1">
                                                                        ({formatDateOnly(level.status_updated_at)})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {
                                        permitExtension && (
                                            <div className="flex items-center gap-4 justify-center mt-4">
                                                <Button
                                                    onClick={() => handleApproveExtension(extension.id.toString())}
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
                                                            Approve Extension
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleReject()
                                                        setExtensionId(extension.id.toString())
                                                    }}
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
                                                            Reject Extension
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Permit Resume Section */}
                {isResumeSectionVisible && (

                    <Section
                        title="PERMIT RESUME"
                        icon={<RefreshCw />}
                        sectionKey="resume-permit"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {/* Reason for Resume */}
                                    <div>
                                        <TextField
                                            label="Reason for Resume *"
                                            value={resumeReason}
                                            onChange={(e) => setResumeReason(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            placeholder="Enter Reason Here"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    height: "auto !important",
                                                    padding: "2px !important",
                                                    display: "flex",
                                                },
                                                "& .MuiInputBase-input[aria-hidden='true']": {
                                                    flex: 0,
                                                    width: 0,
                                                    height: 0,
                                                    padding: "0 !important",
                                                    margin: 0,
                                                    display: "none",
                                                },
                                                "& .MuiInputBase-input": {
                                                    resize: "none !important",
                                                },
                                            }}
                                        />
                                    </div>

                                    {/* Resume Date & Time */}
                                    <div>
                                        <TextField
                                            label="Resume Date & Time *"
                                            type="datetime-local"
                                            value={resumeDate}
                                            onChange={(e) => setResumeDate(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            sx={fieldStyles}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Assignees */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assignees<span className="text-red-500">*</span>
                                        </label>
                                        <FormControl
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#C72030',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#C72030',
                                                        borderWidth: '2px',
                                                    },
                                                },
                                            }}
                                        >
                                            <Select
                                                multiple
                                                value={selectedResumeAssignees}
                                                onChange={handleResumeAssigneeChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => {
                                                    if ((selected as string[]).length === 0) {
                                                        return <span style={{ color: '#9CA3AF' }}>Select assignees</span>;
                                                    }
                                                    return (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {(selected as string[]).map((value) => {
                                                                const assignee = permitData?.permit?.permit_assignees?.find(a => a.id.toString() === value);
                                                                return (
                                                                    <Chip
                                                                        key={value}
                                                                        label={assignee?.name || value}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: '#C72030',
                                                                            color: 'white',
                                                                            '& .MuiChip-deleteIcon': {
                                                                                color: 'white',
                                                                            },
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </Box>
                                                    );
                                                }}
                                                displayEmpty
                                                sx={{
                                                    minHeight: '48px',
                                                    '& .MuiSelect-placeholder': {
                                                        color: '#9CA3AF',
                                                    },
                                                }}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>Select assignees</em>
                                                </MenuItem>
                                                {permitData?.permit?.permit_assignees?.map((assignee) => (
                                                    <MenuItem key={assignee.id} value={assignee.id.toString()}>
                                                        {assignee.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {/* Attachment */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Attachment
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#C72030] border border-gray-300 rounded cursor-pointer transition-colors">
                                                <Upload className="w-4 h-4" />
                                                Choose files
                                                <input
                                                    ref={resumeFileInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    multiple
                                                    onChange={(e) => setResumeAttachments(e.target.files)}
                                                />
                                            </label>
                                            <span className="text-sm text-gray-500">
                                                {resumeAttachments && resumeAttachments.length > 0
                                                    ? `${resumeAttachments.length} file(s) selected`
                                                    : "No file chosen"
                                                }
                                            </span>
                                        </div>
                                        {/* Show selected files */}
                                        {resumeAttachments && resumeAttachments.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {Array.from(resumeAttachments).map((file, index) => (
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
                                        id="resumeAgreement"
                                        className="mt-1 h-4 w-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                                    />
                                    <label htmlFor="resumeAgreement" className="text-sm text-gray-700 leading-relaxed">
                                        I have understood all the hazard and risk associated in the activity I pledge to implement on the control measure identified in the activity through risk analyses JSA and SOP. I hereby declare that the details given above are correct and also I have been trained by our company for the above mentioned work & I am mentally and physically fit, Alcohol/drugs free to perform it, will be performed with appropriate safety and supervision as per Panchshil & Norms.
                                    </label>
                                </div>
                            </div>

                            {/* Resume Permit Button */}
                            <div className="flex justify-center pt-4">
                                <Button
                                    className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-8 py-2 font-medium"
                                    onClick={handleResumePermit}
                                    disabled={isResuming}
                                >
                                    {isResuming ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Resume Permit'

                                    )}
                                </Button>
                            </div>
                        </div>
                    </Section>
                )}
                {/* Permit Resume Section */}
                {permitData.permit_resume &&
                    <Section
                        title="PERMIT RESUME"
                        icon={<RefreshCw />}
                        sectionKey="resume"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-3">
                            {/* {permitData.permit_resume.map((resume: any, index: number) => ( */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Resume </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Reason for Resume: </span>
                                        <span className="text-gray-900">{permitData.permit_resume?.reason_for_resume || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Resume Date: </span>
                                        <span className="text-gray-900">{permitData?.permit_resume?.resume_date && format(permitData.permit_resume?.resume_date, "dd/MM/yyyy hh:mm a")}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Created By: </span>
                                        <span className="text-gray-900">{permitData.permit_resume?.created_by?.full_name || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Assignees: </span>
                                        <span className="text-gray-900">{permitData.permit_resume?.assignees || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Attachments Count: </span>
                                        <span className="text-gray-900">{permitData.permit_resume?.attachments_count?.toString() || "0"}</span>
                                    </div>
                                </div>
                            </div>
                            {/* ))} */}
                        </div>
                    </Section>
                }


                {/* Permit Closure Details Section */}
                {permitData.permit_closure && permitData.permit_closure.completion_comment && permitData.permit_closure.attachments_count > 0 && permitData.permit_closure.closed_by && (
                    <Section
                        title="PERMIT CLOSURE DETAILS"
                        icon={<CheckCircle />}
                        sectionKey="closure"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
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
                                <div className="flex items-start gap-4">
                                    {permitData.permit_closure.closure_approval_levels.map((level: any, index: number) => (
                                        <div key={index} className="space-y-2">
                                            <div className={`px-3 py-1 text-sm rounded-md font-medium w-max ${getStatusColor(level.status)}`}>
                                                {level.name}: {level.status}
                                            </div>
                                            {level.updated_by && level.status_updated_at && (
                                                <div className="ms-2 text-sm text-gray-600">
                                                    by {level?.updated_by} on {(level?.status_updated_at && format(level.status_updated_at, 'dd/MM/yyyy hh:mm a'))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {
                            permitClosure && (
                                <div className="flex items-center gap-4 justify-center mt-4">
                                    <Button
                                        onClick={() => {
                                            const actualClosureId = permitData.permit_closure?.id?.toString();
                                            console.log('Using closure ID for approval:', actualClosureId);
                                            if (actualClosureId) {
                                                handleApproveClosure(actualClosureId);
                                            } else {
                                                toast.error('Closure ID not found in permit data');
                                            }
                                        }}
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
                                                Approve Closure
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
                                                Reject Closure
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )
                        }
                    </Section>
                )}

                {/* Comment Log Section */}
                {permitData.comment_logs && permitData.comment_logs.length > 0 ? (
                    <Section
                        title="COMMENT LOG"
                        icon={<MessageSquare />}
                        sectionKey="comments"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="space-y-4">
                            {permitData.comment_logs.map((comment: CommentLog, index: number) => (
                                <div key={comment.id || index} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-sm text-gray-900">
                                                <strong>Created By:</strong> {typeof comment.created_by === 'object' ? comment.created_by.full_name : (comment.created_by || 'Unknown User')}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="bg-white p-3 rounded border">
                                                <div className="mb-3">
                                                    <span className="font-semibold text-gray-700 block mb-1">Created At:</span>
                                                    <span className="text-gray-900 block">
                                                        {comment.created_at ? format(new Date(comment.created_at), 'dd/MM/yyyy hh:mm a') : '-'}
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
                    <Section
                        title="COMMENT LOG"
                        icon={<MessageSquare />}
                        sectionKey="comments"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
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
                    <Section
                        title="QR Code"
                        icon={<QrCode />}
                        sectionKey="qrcode"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
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
                                {/* {permitData.qr_code.download_link && (
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(permitData.qr_code.download_link, '_blank')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download via Link
                                    </Button>
                                )} */}
                            </div>
                        </div>
                    </Section>
                )}

                {/* Safety Check Audits Section */}
                {permitData.safety_check_audits && permitData.safety_check_audits.length > 0 && (
                    <Section
                        title="Safety Check Audits"
                        icon={<CheckCircle />}
                        sectionKey="audits"
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Sr. No</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Response</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Submitted Date/Time</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Submitted By</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Status</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">View</th>
                                        <th className="border border-gray-200 p-3 text-left text-sm font-medium">Attachment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permitData.safety_check_audits.map((audit: any, index: number) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 p-3 text-sm">{index + 1}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{audit.response || '-'}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{(audit?.created_at && format(audit.created_at, 'dd/MM/yyyy hh:mm a')) || '-'}</td>
                                            <td className="border border-gray-200 p-3 text-sm">{audit.submitted_by || '-'}</td>
                                            <td className="border border-gray-200 p-3 text-sm">
                                                <Badge variant={audit.status === 'Approved' ? 'default' : 'secondary'}>
                                                    {audit.status}
                                                </Badge>
                                            </td>
                                            <td className="border border-gray-200 p-3 text-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        // Navigate to SafetyCheckAudit page with id as query param
                                                        window.location.href = `/safety-check-audit?quest_id=${audit.id}`;
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                            {/* <td className="border border-gray-200 p-3 text-sm">
                                                <Button variant="ghost" size="sm">Print</Button>
                                            </td> */}
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {audit.attachment ? (
                                                    <div
                                                        className="w-10 h-10 border border-gray-300 rounded overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100"
                                                        onClick={() => {
                                                            setSelectedDoc({ url: audit.attachment, type: 'image' });
                                                            setIsModalOpen(true);
                                                        }}
                                                        title="Click to view full image"
                                                    >
                                                        <img
                                                            src={audit.attachment}
                                                            alt="attachment"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No Attachment</span>
                                                )}
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
            {/* {permitMain && (
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
            )} */}

            {permitMain && (
                <div className="mt-8 border border-[#D9D9D9] rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#F6F4EE] border-b border-[#D9D9D9] px-6 py-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                            <CheckCircle className="w-6 h-6" style={{ color: '#C72030' }} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1A1A1A] uppercase">
                            Approval Actions
                        </h3>
                    </div>

                    {/* Body */}
                    <div className="p-6 bg-white flex items-center gap-4 justify-center">
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

            {/* Upload JSA/Form Modal */}
            <Dialog open={jsaUploadModalOpen} onOpenChange={setJsaUploadModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                            Upload JSA/Form
                            <button
                                onClick={() => setJsaUploadModalOpen(false)}
                                className="rounded-full p-1 hover:bg-gray-200"
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Attachment<span className="text-red-500">*</span>
                            </label>

                            <div className="space-y-2 mb-4">
                                {jsaAttachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm truncate">{file.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 h-8 w-8 p-0"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                            </svg>
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                                >
                                    <label className="cursor-pointer flex items-center">
                                        <Upload className="w-4 h-4 mr-2" />
                                        <span>+ Attach file</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </Button>
                                <div className="mt-1 text-xs text-gray-500">
                                    {jsaAttachments.length > 0 ? `${jsaAttachments.length} file(s) selected` : 'No file chosen'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setJsaUploadModalOpen(false)}
                            variant="outline"
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleJsaUpload}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={jsaAttachments.length === 0 || isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Permit Modal */}
            <Dialog open={completeModalOpen} onOpenChange={setCompleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                            CLOSE PTW
                            <button
                                onClick={() => setCompleteModalOpen(false)}
                                className="rounded-full p-1 hover:bg-gray-200"
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCompletePermit}>
                        <div className="py-4">
                            {/* Completion Comment Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Completion Comment<span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    placeholder="Completion Comment"
                                    value={completionComment}
                                    onChange={(e) => setCompletionComment(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                    required
                                />
                            </div>

                            {/* Attachment Section */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Attachment
                                </label>

                                <div className="space-y-2 mb-4">
                                    {completeAttachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                            <span className="text-sm truncate">{file.name}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 h-8 w-8 p-0"
                                                onClick={() => handleRemoveCompleteFile(index)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                </svg>
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2">
                                    {/* <Button
                                        type="button"
                                        variant="outline"
                                    // className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                    >
                                        <label className="cursor-pointer flex items-center">
                                            <span className="text-orange-600">Choose files</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleCompleteFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                            />
                                        </label>
                                    </Button> */}
                                    <Button type="button" onClick={() => completeFileInputRef.current?.click()}>Choose Files</Button>
                                    <input
                                        ref={completeFileInputRef}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleCompleteFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                    />
                                    <div className="mt-1 text-xs text-gray-500">
                                        {completeAttachments.length > 0
                                            ? `${completeAttachments.length} file(s) selected`
                                            : 'No file chosen'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => setCompleteModalOpen(false)}
                                variant="outline"
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={!completionComment.trim() || isCompleting}
                            >
                                {isCompleting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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
                            // onClick={handleRejectConfirm}
                            onClick={permitClosure ? handleRejectClosure : permitExtension ? handleRejectExtension : handleRejectConfirm}

                            disabled={isRejecting}
                            className="bg-[#C72030] hover:bg-[#a61b27] text-white"
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Attachment Preview Modal */}
            <AttachmentPreviewModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedDoc={selectedDoc}
                setSelectedDoc={setSelectedDoc}
            />
        </div>
    );
};
