import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Printer, Download, File, Trash2, Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import axios from 'axios';
import { Switch } from "@/components/ui/switch";
import { useClubManagementEvents } from '@/components/PostHogClubManagementEvents';
import { DetailCard } from "@/components/ui/detail-card";
import { isCMContextActive } from '@/utils/posthogHelpers';

interface DocumentDetails {
    id?: number;
    title?: string;
    category?: string;
    folder?: string;
    created_by?: string;
    created_at?: string | Date;
    folder_name?: string;
    document_category_name?: string;
    created_by_full_name?: string;
    public_uuid?: string;
    attachment?: {
        id?: number;
        filename?: string;
        content_type?: string;
        file_size?: number;
        url?: string;
        file_type?: string;
        preview_url?: string;
    };
    shared_communities?: any[];
}

const CommunityDocumentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { detailViewed, action } = useClubManagementEvents();
    const viewedRef = useRef(false);

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem("token");
    const communityId = localStorage.getItem("communityId");

    const [documentDetails, setDocumentDetails] = useState<DocumentDetails>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch document details from API
                const response = await axios.get(
                    `https://${baseUrl}/documents/${id}.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setDocumentDetails(response.data || {});
                if (isCMContextActive() && !viewedRef.current) {
                    viewedRef.current = true;
                    detailViewed("Community Document", id, "community_document_details");
                }
            } catch (error) {
                console.log(error);
                const errorMessage = error.response.data.error
                toast.error(errorMessage || 'Failed to fetch document details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id && token) {
            fetchData();
        }
    }, [id, token]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this document?")) {
            try {
                await axios.delete(
                    `https://${baseUrl}/documents/${id}.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                toast.success("Document deleted successfully");
                if (isCMContextActive()) {
                    action("Community Document Deleted", { entity_id: id, screen: "community_document_details" });
                }
                navigate('/pulse/community');
            } catch (error) {
                console.error('Failed to delete document:', error);
                toast.error('Failed to delete document');
            }
        }
    };

    const handleDownload = () => {
        if (documentDetails.attachment?.url) {
            const link = document.createElement('a');
            link.href = documentDetails.attachment.url;
            link.setAttribute('download', documentDetails.attachment.filename || 'document');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="p-4 md:px-8 py-6 bg-white min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4">
                <Link to={'/pulse/community'}>Community</Link> <span className="font-normal">{">"}</span> Documents
            </h1>

            {/* Header with Delete Button */}
            <div className="flex items-center justify-end gap-4 mb-6">
                <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 hover:bg-transparent"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Main Content Card */}
            <DetailCard
                title={documentDetails.title || "Document"}
                icon={<File className="w-[18px] h-[18px] text-gray-500" />}
                headerActions={
                    <div className="flex items-center gap-3">
                            <Switch
                                checked={isActive}
                                onCheckedChange={(checked) => setIsActive(checked)}
                            />
                            <span className="text-sm font-medium text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                }
                className="mb-6"
            >
                <div>
                    <div className="grid grid-cols-3 gap-y-6">
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Category</span>
                            <span className="text-sm font-medium text-gray-900">
                                {documentDetails.document_category_name || "-"}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Created By</span>
                            <span className="text-sm font-medium text-gray-900">
                                {documentDetails.created_by_full_name || "-"}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Folder</span>
                            <span className="text-sm font-medium text-gray-900">
                                {documentDetails.folder_name || "-"}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Created On</span>
                            <span className="text-sm font-medium text-gray-900">
                                {documentDetails.created_at && format(new Date(documentDetails.created_at), "d MMMM yyyy")}
                            </span>
                        </div>
                    </div>
                </div>
            </DetailCard>

            {/* Share Section */}
            <DetailCard
                title="Share"
                icon={<Share2 className="w-[18px] h-[18px] text-gray-500" />}
                className="mb-6"
            >
                <div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-start gap-8">
                            <span className="text-sm text-gray-500 min-w-[160px]">Share With Communities</span>
                            <div className="flex flex-col gap-1">
                                {documentDetails.shared_communities && documentDetails.shared_communities.length > 0 ? (
                                    documentDetails.shared_communities.map((community: any, idx: number) => (
                                        <span key={idx} className="text-sm font-medium text-gray-900">
                                            {community.name || `Community ${idx + 1}`}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DetailCard>

            {/* Attachment Section */}
            <DetailCard
                title="Attachment"
                icon={<File className="w-[18px] h-[18px] text-gray-500" />}
                className="mb-6"
            >
                <div>
                    {documentDetails.attachment ? (
                        <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 w-60 h-48 flex flex-col items-center justify-center bg-white relative group hover:border-gray-600 transition-colors">
                            {/* Filename Header */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <span className="text-sm text-gray-700 font-medium truncate flex-1">
                                    {documentDetails.attachment.filename || "Document"}
                                </span>
                                <button
                                    onClick={handleDownload}
                                    className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                    title="Download"
                                >
                                    <Download className="w-5 h-5 text-red-600" />
                                </button>
                            </div>

                            {/* Document Preview */}
                            <div className="flex flex-col items-center gap-2 mt-4">
                                {documentDetails.attachment.file_type === 'pdf' || documentDetails.attachment.content_type?.includes('pdf') ? (
                                    <div className="relative">
                                        {/* File Corner */}
                                        <div className="w-32 h-40 bg-gray-100 rounded-sm flex flex-col items-center justify-center relative border border-gray-300 shadow-md">
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-gray-300 rounded-tl"></div>
                                            <div className="w-20 h-28 bg-white rounded-sm flex items-center justify-center mb-2">
                                                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        {/* PDF Badge */}
                                        <div className="absolute -top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                                            PDF
                                        </div>
                                    </div>
                                ) : documentDetails.attachment.content_type?.includes('image') ? (
                                    <img
                                        src={documentDetails.attachment.url}
                                        alt="Document"
                                        className="w-24 h-24 object-contain"
                                    />
                                ) : (
                                    <File className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-sm h-80 flex items-center justify-center bg-gray-50">
                            <span className="text-sm text-gray-400">No document</span>
                        </div>
                    )}
                </div>
            </DetailCard>
        </div>
    );
};

export default CommunityDocumentDetails;