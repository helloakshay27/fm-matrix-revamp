import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Printer, Star, FileText, Share2, File, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChangeStatusDialog } from '@/components/ChangeStatusDialog';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchBroadcastById } from '@/store/slices/broadcastSlice';
import { format } from 'date-fns';
import axios from 'axios';
import { Switch } from "@/components/ui/switch";
import { useClubManagementEvents } from '@/components/PostHogClubManagementEvents';
import { DetailCard } from "@/components/ui/detail-card";
import { isCMContextActive } from '@/utils/posthogHelpers';

interface BroadcastDetails {
    id?: string;
    created_by?: string;
    notice_type?: string;
    notice_heading?: string;
    created_at?: string | Date;
    status?: string;
    expire_time?: string | Date;
    isImportant?: boolean;
    notice_text?: string;
    attachments?: any[];
    cover_image?: any;
    shared_notices?: string[];
    shared?: number;
    show_on_home_screen?: boolean;
    visible_after_expire?: boolean;
    shared_community?: boolean;
}

export const CommunityNoticeDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { detailViewed, statusChanged, exported } = useClubManagementEvents();
    const viewedRef = useRef(false);

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem("token");

    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [broadcastStatus, setBroadcastStatus] = useState('Published');
    const [broadcastDetails, setBroadcastDetails] = useState<BroadcastDetails>({})
    const [isPrinting, setIsPrinting] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const [showOnHomeScreen, setShowOnHomeScreen] = useState(false);
    const [visibleAfterExpire, setVisibleAfterExpire] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchBroadcastById({ id, baseUrl, token })).unwrap();
                setBroadcastDetails(response)
                // Set initial switch states
                setIsActive(response.active);
                setShowOnHomeScreen(response.show_on_home_screen || false);
                setVisibleAfterExpire(response.flag_expire || false);
                if (isCMContextActive() && !viewedRef.current) {
                    viewedRef.current = true;
                    detailViewed("Community Notice", id, "community_notice_details");
                }
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch broadcast details")
            }
        }

        fetchData();
    }, [])

    const handleStatusChange = (newStatus: string) => {
        setBroadcastStatus(newStatus);
        console.log('Status changed to:', newStatus);
    };

    const handlePrint = async () => {
        setIsPrinting(true)
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/noticeboards/${id}/print_notice.pdf`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            })
            console.log(response)
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `notice-${id}.pdf`); // Set the file name

            // Append to body and trigger click
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // optional: free memory
            if (isCMContextActive()) {
                exported("Community Notice", "pdf", 1, "community_notice_details", { entity_id: id });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsPrinting(false)
        }
    }

    const handleStatusToggle = async (field: string, value: boolean) => {
        try {
            const formData = new FormData();

            if (field === 'active') {
                formData.append('noticeboard[active]', value ? '1' : '0');
                setIsActive(value);
            } else if (field === 'show_on_home_screen') {
                formData.append('noticeboard[show_on_home_screen]', value.toString());
                setShowOnHomeScreen(value);
            } else if (field === 'visible_after_expire') {
                formData.append('noticeboard[flag_expire]', value ? '1' : '0');
                setVisibleAfterExpire(value);
            }

            await axios.patch(
                `https://${baseUrl}/pms/admin/noticeboards/${id}.json`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Status updated successfully');
            if (isCMContextActive()) {
                statusChanged("Community Notice", id, { field, active: value, screen: "community_notice_details" });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
            // Revert the state on error
            if (field === 'active') setIsActive(!value);
            else if (field === 'show_on_home_screen') setShowOnHomeScreen(!value);
            else if (field === 'visible_after_expire') setVisibleAfterExpire(!value);
        }
    };

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4"><Link to={'/pulse/community'}>Community</Link> <span className="font-normal">{">"}</span> Noticeboard</h1>
            {/* Header with back button */}
            <div className="flex items-center justify-end gap-4 mb-6">
                <Button
                    variant="outline"
                    // onClick={() => navigate(`/pulse/notices/edit/${id}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 hover:bg-transparent"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Main Content Card */}
            <DetailCard
                title={broadcastDetails.notice_heading || "Fire Safety Drill Report"}
                icon={<File className="w-[18px] h-[18px] text-gray-500" />}
                headerActions={
                    <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <div>
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={(checked) => handleStatusToggle('active', checked)}
                                />
                                <span className="text-sm font-medium text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                }
                className="mb-6"
            >
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {broadcastDetails.notice_text || "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-y-4 mt-6">
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Created On</span>
                            <span className="text-sm font-medium text-gray-900">
                                {broadcastDetails.created_at && format(new Date(broadcastDetails.created_at), "d MMMM yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Home Screen</span>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={showOnHomeScreen}
                                    onCheckedChange={(checked) => handleStatusToggle('show_on_home_screen', checked)}
                                />
                                <span className="text-sm font-medium text-gray-700">{showOnHomeScreen ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Expire On</span>
                            <span className="text-sm font-medium text-gray-900">
                                {broadcastDetails.expire_time && format(new Date(broadcastDetails.expire_time), "d MMMM yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Created By</span>
                            <span className="text-sm font-medium text-gray-900">
                                {broadcastDetails.created_by || "Abdul Ghaffar"}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[140px]">Visible After Expire</span>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={visibleAfterExpire}
                                    onCheckedChange={(checked) => handleStatusToggle('visible_after_expire', checked)}
                                />
                                <span className="text-sm font-medium text-gray-700">{visibleAfterExpire ? 'Active' : 'Inactive'}</span>
                            </div>
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
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[160px]">Share With</span>
                            <span className="text-sm font-medium text-gray-900">
                                {broadcastDetails.shared === 2 ? "All Tech Park" : "Individual Tech Park"}
                            </span>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[180px]">Share With Communities</span>
                            <span className="text-sm font-medium text-gray-900">
                                {broadcastDetails.shared_community ? "Yes" : "No"}
                            </span>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Upload Document */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Upload Document</h4>
                            {broadcastDetails?.attachments && broadcastDetails.attachments.length > 0 ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-[200px] h-40 flex flex-col items-center justify-center bg-white">
                                    <span className="text-xs text-gray-600 mb-2 text-center truncate max-w-full px-2">
                                        {broadcastDetails.attachments[0]?.document_name || "Document"}
                                    </span>
                                    <div className="flex flex-col items-center">
                                        {broadcastDetails.attachments[0]?.url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                            <img
                                                src={broadcastDetails.attachments[0].url}
                                                alt="Document"
                                                className="w-16 h-16 object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-16 bg-red-500 rounded-sm flex items-center justify-center mb-1">
                                                    <span className="text-white text-xs font-bold">PDF</span>
                                                </div>
                                                <div className="w-12 h-1 bg-gray-300 rounded"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-[200px] h-40 flex items-center justify-center bg-gray-50">
                                    <span className="text-sm text-gray-400">No document</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Cover Image */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Upload Cover Image</h4>
                            {broadcastDetails?.cover_image ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-[200px] h-40 flex flex-col items-center justify-center bg-white">
                                    <span className="text-xs text-gray-600 mb-2 text-center truncate max-w-full px-2">
                                        {broadcastDetails.cover_image?.name || "Name.jpg"}
                                    </span>
                                    <img
                                        src={broadcastDetails.cover_image?.url || "https://via.placeholder.com/80"}
                                        alt="Cover"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-[200px] h-40 flex items-center justify-center bg-gray-50">
                                    <span className="text-sm text-gray-400">No cover image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DetailCard>

            {/* Change Status Dialog */}
            <ChangeStatusDialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                currentStatus={broadcastStatus}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};