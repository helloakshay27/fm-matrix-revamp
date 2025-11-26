import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Package,
    Truck,
    FileText,
    Paperclip,
    ChevronUp,
    ChevronDown,
    LucideIcon,
    X,
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

interface OutboundAttachment {
    id: number | string;
    url: string;
    name: string;
    fileType?: 'image' | 'pdf' | 'excel' | 'word' | 'other';
}

interface OutboundLog {
    id: number | string;
    message: string;
    timestamp: string;
}

interface OutboundMail {
    id: number;
    senderName: string;
    recipientName: string;
    recipientAddress: string;
    recipientMobile: string;
    recipientEmail: string;
    dateOfSending: string;
    vendor: string;
    awbNumber: string;
    trackStatus: string;
    spocPerson: string;
    contactNumber: string;
    numberOfPackages: number;
    packageType: string;
    logs: OutboundLog[];
    attachments: OutboundAttachment[];
}

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

export const OutboundDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [outboundData, setOutboundData] = useState<OutboundMail>({
        id: 0,
        senderName: '',
        recipientName: '',
        recipientAddress: '',
        recipientMobile: '',
        recipientEmail: '',
        dateOfSending: '',
        vendor: '',
        awbNumber: '',
        trackStatus: '',
        spocPerson: '',
        contactNumber: '',
        numberOfPackages: 0,
        packageType: '',
        logs: [],
        attachments: [],
    });

    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        outboundDetails: true,
        courierDetails: true,
        logs: true,
        attachments: true,
    });

    // Modal states
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section as keyof typeof prev],
        }));
    };

    const fetchOutboundDetails = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await fetch(
                getFullUrl(`/pms/admin/mail_outbounds/${id}.json`),
                {
                    method: 'GET',
                    headers: {
                        'Authorization': getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch outbound details');
            }

            const data = await response.json();
            const detail = data.mail_outbound || data;

            const processedAttachments: OutboundAttachment[] = (
                detail.attachments || []
            ).map((att: any) => {
                const url = att.document_url || att.url;
                const fileName = att.document_file_name || att.name || 'attachment';

                let fileType: OutboundAttachment['fileType'] = 'other';
                const ext = fileName.toLowerCase().split('.').pop();
                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
                    fileType = 'image';
                } else if (ext === 'pdf') {
                    fileType = 'pdf';
                } else if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
                    fileType = 'excel';
                } else if (['doc', 'docx'].includes(ext || '')) {
                    fileType = 'word';
                }

                return {
                    id: att.id,
                    url,
                    name: fileName,
                    fileType,
                };
            });

            const processedLogs: OutboundLog[] = [];

            // Add creation log if available
            if (detail.creation_log) {
                processedLogs.push({
                    id: 'creation',
                    message: detail.creation_log.message,
                    timestamp: detail.creation_log.date,
                });
            }

            // Add other logs
            if (detail.logs_text && Array.isArray(detail.logs_text)) {
                detail.logs_text.forEach((log: any) => {
                    processedLogs.push({
                        id: log.id,
                        message: log.message,
                        timestamp: log.date,
                    });
                });
            }

            // Fallback for older API structure if needed
            if (processedLogs.length === 0 && detail.logs) {
                detail.logs.forEach((log: any) => {
                    processedLogs.push({
                        id: log.id,
                        message: log.message || log.description || '',
                        timestamp: formatDate(log.created_at || log.timestamp),
                    });
                });
            }

            setOutboundData({
                id: detail.id,
                senderName: detail.sender_name || 'NA',
                recipientName: detail.recipient_name || detail.user?.full_name || 'NA',
                recipientAddress: detail.recipient_address || 'NA',
                recipientMobile: detail.recipient_mobile || 'NA',
                recipientEmail: detail.recipient_email || 'NA',
                dateOfSending: formatDate(detail.sending_date || detail.date_of_sending),
                vendor: detail.delivery_vendor?.name || detail.vendor || 'NA',
                awbNumber: detail.awb_number || 'NA',
                trackStatus: detail.track_status || detail.tracking_url || 'NA',
                spocPerson: detail.spoc_person || 'NA',
                contactNumber: detail.contact_number || 'NA',
                numberOfPackages: detail.number_of_packages || detail.packages_count || 0,
                packageType: detail.package_type || detail.item_type || 'NA',
                logs: processedLogs,
                attachments: processedAttachments,
            });
        } catch (error) {
            console.error('Error fetching outbound details:', error);
            toast.error('Failed to load outbound details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOutboundDetails();
    }, [fetchOutboundDetails]);

    const handleBack = () => {
        navigate('/vas/mailroom/outbound');
    };

    const handleAddAttachments = () => {
        setSelectedFiles([]);
        setIsAttachmentModalOpen(true);
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

    const handleUploadAttachments = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one file');
            return;
        }

        try {
            setIsUploadingAttachment(true);

            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('attachments[]', file);
            });

            const response = await fetch(
                getFullUrl(`/pms/admin/mail_outbounds/${id}/add_attachment.json`),
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
            await fetchOutboundDetails();
        } catch (error) {
            console.error('Attachment upload failed:', error);
            toast.error(error instanceof Error ? error.message : 'Unable to upload attachments');
        } finally {
            setIsUploadingAttachment(false);
        }
    };

    const handleDownloadAttachment = async (attachment: OutboundAttachment) => {
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
                throw new Error('Failed to download attachment');
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

            toast.success('Attachment downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download attachment');
        }
    };

    const getAttachmentIcon = (type?: string) => {
        switch (type) {
            case 'pdf':
                return '📄';
            case 'image':
                return '🖼️';
            case 'excel':
                return '📊';
            case 'word':
                return '📝';
            default:
                return '📎';
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-bold text-[#1a1a1a]">Mail Outbound List</span>
                    </button>
                    <span>›</span>
                    <span>Outbound Details</span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">OUTBOUND DETAILS ({outboundData.id})</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">No. Of Package:</span>
                                <span className="text-sm font-semibold">{outboundData.numberOfPackages}</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                {outboundData.packageType}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAddAttachments}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            Add Attachments
                        </Button>
                    </div>
                </div>
            </div>

            {/* Outbound Details Section */}
            <ExpandableSection
                title="OUTBOUND DETAILS"
                icon={Package}
                isExpanded={expandedSections.outboundDetails}
                onToggle={() => toggleSection('outboundDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Sender Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.senderName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Name</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.recipientName}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Address</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.recipientAddress}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Date of Sending</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.dateOfSending}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Mobile</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.recipientMobile}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Recipient Email ID</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.recipientEmail}</span>
                        </div>
                    </div>
                </div>
            </ExpandableSection>

            {/* Courier Details Section */}
            <ExpandableSection
                title="COURIER DETAILS"
                icon={Truck}
                isExpanded={expandedSections.courierDetails}
                onToggle={() => toggleSection('courierDetails')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Vendor</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.vendor}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">AWB Number</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.awbNumber}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Track Status</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.trackStatus}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">SPOC Person</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.spocPerson}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 flex-shrink-0 font-medium">Contact Number</span>
                            <span className="text-gray-500 mx-3">:</span>
                            <span className="text-gray-900 font-semibold flex-1">{outboundData.contactNumber}</span>
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
            >
                <div className="space-y-4">
                    {outboundData.logs.length === 0 ? (
                        <p className="text-gray-500 text-sm">No logs available</p>
                    ) : (
                        outboundData.logs.map((log) => (
                            <div key={log.id} className="flex flex-col gap-1">
                                <p className="text-sm text-[#1a1a1a]">{log.message}</p>
                                <p className="text-xs text-gray-500">{log.timestamp}</p>
                            </div>
                        ))
                    )}
                </div>
            </ExpandableSection>

            {/* Attachments Section */}
            <ExpandableSection
                title="ATTACHMENTS"
                icon={Paperclip}
                isExpanded={expandedSections.attachments}
                onToggle={() => toggleSection('attachments')}
                hasData={outboundData.attachments.length > 0}
            >
                <div>
                    {outboundData.attachments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No attachments available</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {outboundData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{getAttachmentIcon(attachment.fileType)}</span>
                                        <button
                                            onClick={() => handleDownloadAttachment(attachment)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-700 truncate" title={attachment.name}>
                                        {attachment.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ExpandableSection>

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
                            onClick={handleUploadAttachments}
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

export default OutboundDetailPage;
