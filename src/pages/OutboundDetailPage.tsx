import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Package,
    Truck,
    FileText,
    Paperclip,
    X,
    Download,
    User,
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
    const [activeTab, setActiveTab] = useState('outbound-details');

    // Modal states
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

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

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading outbound details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030] transition-colors mb-4 text-base">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Outbound List
                </button>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">OUTBOUND DETAILS ({outboundData.id})</h1>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">No. Of Package:</span>
                                <span className="text-sm font-semibold">{outboundData.numberOfPackages}</span>
                            </div>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                {outboundData.packageType}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        <Button
                            onClick={handleAddAttachments}
                            className="bg-[#532D5F] hover:bg-[#532D5F]/90 text-white"
                        >
                            Add Attachments
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tab Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Tabs defaultValue="outbound-details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch border-b">
                        {[
                            { label: 'Outbound Details', value: 'outbound-details' },
                            { label: 'Courier Details', value: 'courier-details' },
                            { label: 'Logs', value: 'logs' },
                            { label: 'Attachments', value: 'attachments' },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-3 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0 text-sm"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* OUTBOUND DETAILS TAB */}
                    <TabsContent value="outbound-details" className="p-4 sm:p-6 text-[15px]">
                        <div className="bg-white rounded-lg border text-[15px]">
                            <div className="flex p-4 items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                                    <Package className="w-5 h-5 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold">OUTBOUND DETAILS</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Sender Name</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.senderName}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Recipient Name</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.recipientName}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Recipient Address</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.recipientAddress}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Date of Sending</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.dateOfSending}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Recipient Mobile</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.recipientMobile}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Recipient Email ID</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.recipientEmail}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* COURIER DETAILS TAB */}
                    <TabsContent value="courier-details" className="p-4 sm:p-6 text-[15px]">
                        <div className="bg-white rounded-lg border text-[15px]">
                            <div className="flex p-4 items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                                    <Truck className="w-5 h-5 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold">COURIER DETAILS</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Vendor</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.vendor}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">AWB Number</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.awbNumber}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Track Status</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.trackStatus}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">SPOC Person</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.spocPerson}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-48 flex-shrink-0">Contact Number</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{outboundData.contactNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* LOGS TAB */}
                    <TabsContent value="logs" className="p-4 sm:p-6 text-[15px]">
                        <div className="bg-white rounded-lg border text-[15px]">
                            <div className="flex p-4 items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                                    <FileText className="w-5 h-5 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold">LOGS</h2>
                            </div>
                            <div className="p-4">
                                {outboundData.logs && outboundData.logs.length ? (
                                    <div className="space-y-4">
                                        {outboundData.logs.map((log) => (
                                            <div key={log.id} className="flex flex-col gap-1 border-l-4 border-[#C72030] pl-4 py-2">
                                                <p className="text-sm text-[#1a1a1a] font-medium">{log.message}</p>
                                                <p className="text-xs text-gray-500">{log.timestamp}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No logs available</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ATTACHMENTS TAB */}
                    <TabsContent value="attachments" className="p-4 sm:p-6 text-[15px]">
                        <div className="bg-white rounded-lg border text-[15px]">
                            <div className="flex p-4 items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                                    <Paperclip className="w-5 h-5 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold">ATTACHMENTS</h2>
                            </div>
                            <div className="p-4">
                                {outboundData.attachments && outboundData.attachments.length > 0 ? (
                                    <div className="flex flex-wrap gap-4">
                                        {outboundData.attachments.map((attachment) => {
                                            const isImage = attachment.fileType === 'image';
                                            const isPdf = attachment.fileType === 'pdf';
                                            const isExcel = attachment.fileType === 'excel';
                                            const isWord = attachment.fileType === 'word';

                                            return (
                                                <div
                                                    key={attachment.id}
                                                    className="relative flex flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-sm hover:shadow-md transition-shadow"
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
                                                        className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-600 hover:text-[#C72030] hover:bg-gray-100"
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
                                        <p className="text-sm text-gray-500 mb-4">No attachments available</p>
                                        <div className="border rounded-lg p-8 inline-block">
                                            <FileText className="w-16 h-16 text-gray-300 mx-auto" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

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
