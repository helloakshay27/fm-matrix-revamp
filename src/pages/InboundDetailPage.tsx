import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Package,
    User,
    FileText,
    Paperclip,
    ChevronUp,
    ChevronDown,
    LucideIcon,
    X,
    Check,
    Download,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

const formatDate = (value?: string | null) => {
    if (!value) return 'NA';
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    const sanitized = value.replace(/-/g, '/');
    const parts = sanitized.split('/');
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }

    return value;
};

const formatStatus = (status?: string) => {
    if (!status) return 'Pending';
    const normalized = status.trim().toLowerCase();
    if (normalized === 'collected') return 'Collected';
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'overdue') return 'Overdue';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const buildAddress = (detail: Record<string, any>) => {
    const parts = [
        detail.sender_address,
        detail.sender_address1,
        detail.city,
        detail.state?.name || detail.state,
        detail.pincode,
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : detail.address || 'NA';
};

interface InboundAttachment {
    id: number | string;
    url: string;
    name: string;
    fileType?: 'image' | 'pdf' | 'excel' | 'word' | 'other';
}

interface InboundLog {
    id: number | string;
    message: string;
    timestamp: string;
    status?: string;
}

interface InboundMail {
    id: number;
    vendorName: string;
    recipientName: string;
    unit: string;
    entity: string;
    type: string;
    department: string;
    sender: string;
    company: string;
    receivedOn: string;
    receivedBy: string;
    status: string;
    ageing: string;
    collectedOn: string;
    collectedBy: string;
    delegatedTo: string;
    delegatePackageReason: string;
    awbNumber: string;
    mobile: string;
    address: string;
    image?: string;
    attachments?: InboundAttachment[];
    logs?: InboundLog[];
}

const MAIL_INBOUND_DETAIL_ENDPOINT = (recordId: string | number) => `/pms/admin/mail_inbounds/${recordId}.json`;

const getAttachmentType = (url?: string, contentType?: string) => {
    const source = (contentType || url || '').toLowerCase();
    if (source.match(/(jpg|jpeg|png|gif|bmp|svg|webp|image)/)) return 'image';
    if (source.includes('pdf')) return 'pdf';
    if (source.match(/(xls|xlsx|csv|excel)/)) return 'excel';
    if (source.match(/(doc|docx|word)/)) return 'word';
    return 'other';
};

export const InboundDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inboundData, setInboundData] = useState<InboundMail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for expandable sections
    const [expandedSections, setExpandedSections] = useState({
        packageDetails: true,
        senderDetails: true,
        logs: true,
        attachments: true,
    });

    // Modal states
    const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

    // Form states for Delegate Package
    const [selectedDelegateEmployee, setSelectedDelegateEmployee] = useState('');
    const [selectedCollectEmployee, setSelectedCollectEmployee] = useState('');
    const [delegateReason, setDelegateReason] = useState('');

    // Form state for Mark As Collected
    const [passcode, setPasscode] = useState('');

    // Form state for Add Attachments
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [collectEmployees, setCollectEmployees] = useState<Array<{ id: number; full_name: string }>>([]);
    const [isLoadingCollectEmployees, setIsLoadingCollectEmployees] = useState(false);
    const [delegateEmployees, setDelegateEmployees] = useState<Array<{ id: number; full_name: string }>>([]);
    const [isLoadingDelegateEmployees, setIsLoadingDelegateEmployees] = useState(false);
    const [isCollectingPackage, setIsCollectingPackage] = useState(false);
    const [isDelegatingPackage, setIsDelegatingPackage] = useState(false);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Helper function to check if value has data
    const hasData = (value: string | undefined | null): boolean => {
        return value !== null && value !== undefined && value !== '';
    };

    const fetchInboundDetails = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(getFullUrl(MAIL_INBOUND_DETAIL_ENDPOINT(id)), {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inbound details');
            }

            const data = await response.json();
            const detail = data?.mail_inbound || data;

            if (!detail || !detail.id) {
                throw new Error('Inbound detail not available');
            }

            const attachments: InboundAttachment[] = (detail.attachments || []).map((attachment: any) => {
                const url =
                    attachment.document_url ||
                    attachment.document?.url ||
                    attachment.url ||
                    attachment.attachment_url ||
                    '';
                const name =
                    attachment.name ||
                    attachment.filename ||
                    attachment.document_file_name ||
                    attachment.document_name ||
                    `Attachment ${attachment.id || attachment.document_id || attachment.attachfile_id || 'file'}`;
                const attachmentId =
                    attachment.attachfile_id ||
                    attachment.document_id ||
                    attachment.attachment_id ||
                    attachment.id ||
                    attachment.document?.id;

                return {
                    id: attachmentId,
                    url,
                    name,
                    fileType: getAttachmentType(url, attachment.content_type || attachment.document_content_type),
                };
            });

            const logs: InboundLog[] = (detail.mail_inbound_logs || detail.logs || []).map((log: any, index: number) => ({
                id: log.id || index,
                message: log.message || log.description || log.status || 'Status update',
                timestamp: formatDate(log.created_at || log.timestamp),
                status: log.status || log.event_type,
            }));

            const mapped: InboundMail = {
                id: detail.id,
                vendorName: detail.delivery_vendor?.name || detail.vendor_name || '-',
                recipientName: detail.user?.full_name || detail.recipient_name || '-',
                unit: detail.unit || detail.unit_name || '-',
                entity: detail.entity || detail.entity_name || detail.resource_type || '-',
                type: detail.mail_items?.[0]?.item_type || detail.item_type || '-',
                department: detail.department || detail.department_name || '-',
                sender: detail.sender_name || '-',
                company: detail.sender_company || '-',
                receivedOn: formatDate(detail.receive_date),
                receivedBy: detail.received_by || detail.received_by_name || '-',
                status: formatStatus(detail.status),
                ageing: detail.ageing_display || (detail.ageing ? `${detail.ageing} days` : 'NA'),
                collectedOn: detail.collected_on ? formatDate(detail.collected_on) : 'Not collected',
                collectedBy: detail.collected_by || detail.collected_by_name || 'NA',
                delegatedTo: detail.delegated_to_user?.full_name || detail.delegated_to || 'NA',
                delegatePackageReason: detail.delegate_reason || detail.delegatePackageReason || 'NA',
                awbNumber: detail.awb_number || '-',
                mobile: detail.sender_mobile || '-',
                address: buildAddress(detail),
                attachments,
                logs,
            };

            setInboundData(mapped);
        } catch (err) {
            setError('Failed to fetch inbound details');
            console.error('Error fetching inbound details:', err);
            toast.error('Failed to load inbound details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInboundDetails();
    }, [fetchInboundDetails]);

    const fetchCollectEmployees = useCallback(async () => {
        if (!id) return;
        setIsLoadingCollectEmployees(true);
        try {
            const params = new URLSearchParams();
            params.append('id', id.toString());
            const response = await fetch(
                `${getFullUrl('/pms/admin/mail_inbounds/employee_list.json')}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to load employees');
            }

            const data = await response.json();
            setCollectEmployees(data.users || data || []);
        } catch (error) {
            console.error('Employee list fetch failed:', error);
            toast.error('Unable to load employees');
        } finally {
            setIsLoadingCollectEmployees(false);
        }
    }, [id]);

    useEffect(() => {
        if (isCollectModalOpen) {
            fetchCollectEmployees();
        }
    }, [isCollectModalOpen, fetchCollectEmployees]);

    const handleBackToList = () => {
        navigate('/vas/mailroom/inbound');
    };

    const handleAddAttachments = () => {
        setIsAttachmentModalOpen(true);
    };

    const handleDownloadAttachment = async (attachment: InboundAttachment) => {
        const attachmentId = attachment.id;

        if (!attachmentId) {
            if (attachment.url) {
                window.open(attachment.url, '_blank');
            } else {
                toast.error('Attachment not available');
            }
            return;
        }

        try {
            const fileUrl = getFullUrl(`/attachfiles/${attachmentId}?show_file=true`);
            const response = await fetch(fileUrl, {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = attachment.name || `attachment-${attachmentId}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Attachment download error:', error);
            toast.error('Unable to download attachment');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const handleRemoveSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmitAttachments = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one file');
            return;
        }
        if (!id) {
            toast.error('Invalid inbound record');
            return;
        }

        try {
            setIsUploadingAttachment(true);

            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('attachments[]', file);
            });

            const response = await fetch(
                getFullUrl(`/pms/admin/mail_inbounds/${id}/add_attachment.json`),
                {
                    method: 'POST',
                    headers: {
                        'Authorization': getAuthHeader(),
                    },
                    body: formData,
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to upload attachments');
            }

            toast.success('Attachments uploaded successfully');
            setIsAttachmentModalOpen(false);
            setSelectedFiles([]);
            await fetchInboundDetails();
        } catch (error) {
            console.error('Attachment upload failed:', error);
            toast.error(error instanceof Error ? error.message : 'Unable to upload attachments');
        } finally {
            setIsUploadingAttachment(false);
        }
    };

    const fetchDelegateEmployees = useCallback(async () => {
        if (!id) return;
        setIsLoadingDelegateEmployees(true);
        try {
            const params = new URLSearchParams();
            params.append('id', id.toString());
            const response = await fetch(
                `${getFullUrl('/pms/admin/mail_inbounds/employee_list.json')}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to load employees');
            }

            const data = await response.json();
            setDelegateEmployees(data.users || data || []);
        } catch (error) {
            console.error('Employee list fetch failed:', error);
            toast.error('Unable to load employees');
        } finally {
            setIsLoadingDelegateEmployees(false);
        }
    }, [id]);

    const handleDelegatePackage = () => {
        setSelectedDelegateEmployee('');
        setDelegateReason('');
        setIsDelegateModalOpen(true);
        fetchDelegateEmployees();
    };

    const handleMarkAsCollected = () => {
        setSelectedCollectEmployee('');
        setPasscode('');
        setIsCollectModalOpen(true);
        fetchCollectEmployees();
    };

    const handleSubmitDelegate = async () => {
        if (!selectedDelegateEmployee) {
            toast.error('Please select an employee');
            return;
        }
        if (!delegateReason) {
            toast.error('Please select a reason');
            return;
        }
        if (!id) {
            toast.error('Invalid inbound record');
            return;
        }

        try {
            setIsDelegatingPackage(true);
            const response = await fetch(
                getFullUrl(`/pms/admin/mail_inbounds/${id}.json`),
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mail_inbound: {
                            delegate_id: selectedDelegateEmployee,
                            delegate_reason: delegateReason,
                        },
                    }),
                },
            );

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message = responseData?.message || 'Failed to delegate package';
                toast.error(message);
                throw new Error(message);
            }

            toast.success(responseData?.message || 'Package delegated successfully');
            setIsDelegateModalOpen(false);
            setSelectedDelegateEmployee('');
            setDelegateReason('');
            await fetchInboundDetails();
        } catch (error) {
            console.error('Delegate package failed:', error);
        } finally {
            setIsDelegatingPackage(false);
        }
    };

    const handleSubmitCollect = async () => {
        if (!selectedCollectEmployee) {
            toast.error('Please select an employee');
            return;
        }
        const trimmedPasscode = passcode.trim();
        if (!trimmedPasscode) {
            toast.error('Please enter passcode');
            return;
        }
        if (!/^\d{6}$/.test(trimmedPasscode)) {
            toast.error('Passcode must be a 6-digit number');
            return;
        }
        if (!id) {
            toast.error('Invalid inbound record');
            return;
        }

        try {
            setIsCollectingPackage(true);
            const response = await fetch(
                getFullUrl(`/pms/admin/mail_inbounds/${id}/collect_package.json`),
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        collected_by_id: selectedCollectEmployee,
                        passcode: trimmedPasscode,
                    }),
                },
            );

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message =
                    responseData?.message || 'Failed to mark as collected';
                toast.error(message);
                throw new Error(message);
            }

            if (
                responseData?.message &&
                responseData.message.toLowerCase().includes('passcode')
            ) {
                toast.error(responseData.message);
                return;
            }

            toast.success(responseData?.message || 'Package marked as collected');
            setIsCollectModalOpen(false);
            setPasscode('');
            setSelectedCollectEmployee('');
            await fetchInboundDetails();
        } catch (error) {
            console.error('Collect package failed:', error);
        } finally {
            setIsCollectingPackage(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading inbound details...</div>
                </div>
            </div>
        );
    }

    if (error || !inboundData) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">{error || 'Inbound mail not found'}</div>
                </div>
            </div>
        );
    }

    // Expandable Section Component
    const ExpandableSection = ({
        title,
        icon: Icon,
        isExpanded,
        onToggle,
        children,
        hasData = true
    }: {
        title: string;
        icon: LucideIcon;
        isExpanded: boolean;
        onToggle: () => void;
        children: React.ReactNode;
        hasData?: boolean;
    }) => (
        <div className="bg-transparent border-none shadow-none rounded-lg mb-6">
            <div
                onClick={onToggle}
                className="figma-card-header flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                        <Icon className="figma-card-icon" />
                    </div>
                    <h3 className="figma-card-title uppercase">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {!hasData && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </div>
            </div>
            {isExpanded && (
                <div className="figma-card-content">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-bold text-[#1a1a1a]">Mail Inbound List</span>
                    </button>
                    <span>›</span>
                    <span>Inbound Details</span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">INBOUND DETAILS ({inboundData.id})</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">No. Of Package:</span>
                                <span className="text-sm font-semibold">1</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                {inboundData.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{inboundData.ageing}</span>
                        </div>
                    </div>
                    {inboundData.status.toLowerCase() !== 'collected' && (
                        <div className="flex gap-3">
                            <Button
                                onClick={handleAddAttachments}
                                className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            >
                                Add Attachments
                            </Button>
                            <Button
                                onClick={handleDelegatePackage}
                                className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            >
                                Delegate Package
                            </Button>
                            <Button
                                onClick={handleMarkAsCollected}
                                className="bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-300"
                            >
                                Mark As Collected
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Package Details Section */}
            <ExpandableSection
                title="PACKAGE DETAILS"
                icon={Package}
                isExpanded={expandedSections.packageDetails}
                onToggle={() => toggleSection('packageDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Vendor Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.vendorName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Department</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.department}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Collected On</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.collectedOn}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Delegate Package Reason</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.delegatePackageReason}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.recipientName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Received On</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.receivedOn}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Collected By</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.collectedBy}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">AWB Number</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.awbNumber}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Received By</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.receivedBy}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Delegated To</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.delegatedTo}</span>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Sender Details Section */}
            <ExpandableSection
                title="SENDER DETAILS"
                icon={User}
                isExpanded={expandedSections.senderDetails}
                onToggle={() => toggleSection('senderDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Sender</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.sender}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Company</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.company}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Mobile</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.mobile}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Address</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{inboundData.address}</span>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Logs Section */}
            <ExpandableSection
                title="LOGS"
                icon={FileText}
                isExpanded={expandedSections.logs}
                onToggle={() => toggleSection('logs')}
                hasData={Boolean(inboundData.logs && inboundData.logs.length)}
            >
                {inboundData.logs && inboundData.logs.length ? (
                    <div className="space-y-4">
                        {inboundData.logs.map((log) => (
                            <div
                                key={log.id}
                                className={`p-4 rounded border-l-4 ${log.status?.toLowerCase() === 'overdue'
                                    ? 'bg-[#FFF9F0] border-[#F97316]'
                                    : 'bg-[#F0F9FF] border-[#3B82F6]'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">{log.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500">No logs available.</div>
                )}
            </ExpandableSection>

            {/* Attachments Section */}
            <ExpandableSection
                title="Attachments"
                icon={Paperclip}
                isExpanded={expandedSections.attachments}
                onToggle={() => toggleSection('attachments')}
                hasData={inboundData.attachments && inboundData.attachments.length > 0}
            >
                {inboundData.attachments && inboundData.attachments.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {inboundData.attachments.map((attachment) => {
                            const isImage = attachment.fileType === 'image';
                            const isPdf = attachment.fileType === 'pdf';
                            const isExcel = attachment.fileType === 'excel';
                            const isWord = attachment.fileType === 'word';

                            return (
                                <div
                                    key={attachment.id}
                                    className="relative flex flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-sm"
                                >
                                    <div
                                        className={`w-14 h-14 flex items-center justify-center border rounded-md bg-white mb-2 ${isPdf
                                            ? 'text-red-600'
                                            : isExcel
                                                ? 'text-green-600'
                                                : isWord
                                                    ? 'text-blue-600'
                                                    : isImage
                                                        ? 'text-yellow-600'
                                                        : 'text-gray-600'
                                            }`}
                                    >
                                        <FileText className="w-6 h-6" />
                                    </div>

                                    <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                        {attachment.name}
                                    </span>

                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-600 hover:text-black"
                                        onClick={() => handleDownloadAttachment(attachment)}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No attachments available</p>
                        <div className="mt-4 border rounded-lg p-8 inline-block">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto" />
                        </div>
                    </div>
                )}
            </ExpandableSection>

            {/* Delegate Package Modal */}
            <Dialog open={isDelegateModalOpen} onOpenChange={setIsDelegateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">DELEGATE PACKAGE</DialogTitle>
                        <button
                            onClick={() => setIsDelegateModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee" className="text-sm font-medium">
                                Employee <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedDelegateEmployee} onValueChange={setSelectedDelegateEmployee}>
                                <SelectTrigger id="employee" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingDelegateEmployees ? 'Loading employees...' : 'Select Employee'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingDelegateEmployees ? (
                                        <SelectItem value="loading" disabled>
                                            Loading employees...
                                        </SelectItem>
                                    ) : delegateEmployees.length ? (
                                        delegateEmployees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.full_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-employees" disabled>
                                            No employees available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium">
                                Reason <span className="text-red-500">*</span>
                            </Label>
                            <Select value={delegateReason} onValueChange={setDelegateReason}>
                                <SelectTrigger id="reason" className="w-full">
                                    <SelectValue placeholder="Select Reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee left the role">Employee left the role</SelectItem>
                                    <SelectItem value="Employee is on a meeting">Employee is on a meeting</SelectItem>
                                    <SelectItem value="Employee is on leave">Employee is on leave</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitDelegate}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            disabled={isDelegatingPackage}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isDelegatingPackage ? 'Processing...' : 'Delegate Package'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mark As Collected Modal */}
            <Dialog open={isCollectModalOpen} onOpenChange={setIsCollectModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">COLLECT PACKAGE</DialogTitle>
                        <button
                            onClick={() => setIsCollectModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="collect-employee" className="text-sm font-medium">
                                Employee <span className="text-red-500">*</span>
                            </Label>
                            <Select value={selectedCollectEmployee} onValueChange={setSelectedCollectEmployee}>
                                <SelectTrigger id="collect-employee" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingCollectEmployees ? 'Loading employees...' : 'Select Employee'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingCollectEmployees ? (
                                        <SelectItem value="loading" disabled>
                                            Loading employees...
                                        </SelectItem>
                                    ) : collectEmployees.length ? (
                                        collectEmployees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.full_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-employees" disabled>
                                            No employees available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passcode" className="text-sm font-medium">
                                Passcode <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="passcode"
                                type="password"
                                placeholder="Enter Passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitCollect}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            disabled={isCollectingPackage}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isCollectingPackage ? 'Processing...' : 'Mark as Collected'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Attachments Modal */}
            <Dialog open={isAttachmentModalOpen} onOpenChange={setIsAttachmentModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <DialogTitle className="text-lg font-semibold">Add Attachments</DialogTitle>
                        <button
                            onClick={() => setIsAttachmentModalOpen(false)}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="attachment" className="text-sm font-medium">
                                Attachment
                            </Label>
                            <div className="relative">
                                <Input
                                    id="attachment"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-[#C72030] hover:file:bg-gray-50"
                                />
                                {selectedFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-gray-500">
                                            {selectedFiles.length} file(s) selected
                                        </p>
                                        <ul className="max-h-40 overflow-y-auto text-xs text-gray-700 border rounded-md p-2 bg-gray-50">
                                            {selectedFiles.map((file, index) => (
                                                <li
                                                    key={`${file.name}-${index}`}
                                                    className="flex items-center justify-between gap-2 py-1"
                                                >
                                                    <span className="truncate">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700 text-xs"
                                                        onClick={() => handleRemoveSelectedFile(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmitAttachments}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                            disabled={isUploadingAttachment}
                        >
                            {isUploadingAttachment ? 'Uploading...' : 'Submit'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};
