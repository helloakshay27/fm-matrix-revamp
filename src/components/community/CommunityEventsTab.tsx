import { useState, useEffect } from "react";
import { Eye, Star, File, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Switch from "@mui/material/Switch";
import { useAppDispatch } from "@/store/hooks";
import { updateBroadcast } from "@/store/slices/broadcastSlice";
import { updateEvent } from "@/store/slices/eventSlice";

interface CommunityEventsTabProps {
    communityId?: string;
}

interface Document {
    id: number;
    title: string;
    category: string;
    folder: string;
    format: string;
    size: string;
    active?: boolean;
    attachment: {
        file_type: string;
        file_size: string;
    }
    created_by: string;
    created_at: string;
    document_category_name?: string;
}

interface Notice {
    id: number;
    sr_no: string;
    title: string;
    created_by: string;
    created_at: string;
    expire_time: string;
    is_starred: boolean;
    active: boolean;
    is_important: boolean;
    show_on_home_screen: boolean;
    flag_expire: boolean;
}

interface Event {
    id: number;
    sr_no: string;
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    created_by: string;
    is_starred: boolean;
    is_paid: boolean;
    active?: boolean;
    from_time: string;
}

const documentColumns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'title',
        label: 'Title',
        sortable: true,
        draggable: true
    },
    {
        key: 'document_category_name',
        label: 'Category',
        sortable: true,
        draggable: true
    },
    {
        key: 'folder_name',
        label: 'Folder',
        sortable: true,
        draggable: true
    },
    {
        key: 'format',
        label: 'Format',
        sortable: true,
        draggable: true
    },
    {
        key: 'size',
        label: 'Size',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_by_full_name',
        label: 'Created By',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_on',
        label: 'Created On',
        sortable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    },
];

const eventColumns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'event_name',
        label: 'Event Name',
        sortable: true,
        draggable: true
    },
    {
        key: 'event_date',
        label: 'Event Date',
        sortable: true,
        draggable: true
    },
    {
        key: 'event_time',
        label: 'Event Time',
        sortable: true,
        draggable: true
    },
    {
        key: 'event_category',
        label: 'Event Category',
        sortable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    },
    {
        key: 'event_at',
        label: 'Event Location',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_by',
        label: 'Created By',
        sortable: true,
        draggable: true
    }
];

const noticeColumns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'sr_no',
        label: 'Sr No',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'notice_heading',
        label: 'Title',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'created_by',
        label: 'Created By',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'created_at',
        label: 'Created On',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'expire_time',
        label: 'Expire On',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'show_on_home_screen',
        label: 'Show on Home Screen',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    },
    {
        key: 'visible_after_expire',
        label: 'Visible After Expire',
        sortable: true,
        draggable: true,
        hideable: true,
        defaultVisible: true
    }
];

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const CommunityEventsTab = ({ communityId }: CommunityEventsTabProps) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
    const [isDeletingDocuments, setIsDeletingDocuments] = useState(false);
    const [isDeletingNotices, setIsDeletingNotices] = useState(false);
    const [isDeletingEvents, setIsDeletingEvents] = useState(false);
    const [showDeleteDocumentDialog, setShowDeleteDocumentDialog] = useState(false);
    const [showDeleteNoticeDialog, setShowDeleteNoticeDialog] = useState(false);
    const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);

    // Fetch notices from API
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setNotices(response.data.noticeboards || []);
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        };

        if (communityId) {
            fetchNotices();
        }
    }, [communityId, baseUrl, token]);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/communities/${communityId}/events.json`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setEvents(response.data.classifieds || []);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (communityId) {
            fetchEvents();
        }
    }, [communityId, baseUrl, token]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/folders/by_communities.json?community_ids=[${communityId}]`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setDocuments(response.data.folders.flatMap((folder: any) => folder.documents) || []);
            } catch (error) {
                console.log(error)
            }
        }

        if (communityId) {
            fetchDocuments();
        }
    }, [communityId, baseUrl, token])

    console.log(documents)

    const handleNoticeImportantClick = async (item: any) => {
        const newStatus = item.is_important ? 0 : 1;

        setUpdatingStatus((prev) => ({ ...prev, [`important_${item.id}`]: true }));

        try {
            await dispatch(
                updateBroadcast({
                    id: item.id,
                    data: { noticeboard: { is_important: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Notice importance status updated successfully");

            // Refresh notices
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setNotices(response.data.noticeboards || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update notice importance status");
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[`important_${item.id}`];
                return newState;
            });
        }
    };

    const handleNoticeStatusChange = async (item: any, checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        setUpdatingStatus((prev) => ({ ...prev, [item.id]: true }));

        try {
            await dispatch(
                updateBroadcast({
                    id: item.id,
                    data: { noticeboard: { active: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Notice status updated successfully");

            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setNotices(response.data.noticeboards || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update notice status");
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[item.id];
                return newState;
            });
        }
    };

    const handleShowOnHomeScreenChange = async (item: any, checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        setUpdatingStatus((prev) => ({ ...prev, [`home_${item.id}`]: true }));

        try {
            await dispatch(
                updateBroadcast({
                    id: item.id,
                    data: { noticeboard: { show_on_home_screen: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Show on home screen status updated successfully");

            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setNotices(response.data.noticeboards || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update show on home screen status");
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[`home_${item.id}`];
                return newState;
            });
        }
    };

    const handleVisibleAfterExpireChange = async (item: any, checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        setUpdatingStatus((prev) => ({ ...prev, [`expire_${item.id}`]: true }));

        try {
            await dispatch(
                updateBroadcast({
                    id: item.id,
                    data: { noticeboard: { flag_expire: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Visible after expire status updated successfully");

            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setNotices(response.data.noticeboards || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update visible after expire status");
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[`expire_${item.id}`];
                return newState;
            });
        }
    };

    const handleDocumentStatusChange = async (item: any, checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        setUpdatingStatus((prev) => ({ ...prev, [`doc_${item.id}`]: true }));

        try {
            await axios.patch(
                `https://${baseUrl}/documents/${item.id}.json`,
                { document: { active: newStatus } },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            toast.success("Document status updated successfully");

            // Refresh documents
            const response = await axios.get(`https://${baseUrl}/folders/by_communities.json?community_ids=[${communityId}]`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDocuments(response.data.folders.flatMap((folder: any) => folder.documents) || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update document status");
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[`doc_${item.id}`];
                return newState;
            });
        }
    };

    const handleConfirmDeleteDocuments = async () => {
        setIsDeletingDocuments(true);
        const documentIds = selectedDocuments.map((id) => parseInt(id));
        try {
            // Delete each selected document using the permission API
            await Promise.all(
                documentIds.map((docId) =>
                    axios.post(
                        `https://${baseUrl}/folders/update_permission.json`,
                        {
                            permissible_type: "Document",
                            permissible_id: docId,
                            access_to: "Community",
                            remove_items: [Number(communityId)]
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    )
                )
            );

            // Refresh documents list
            const response = await axios.get(`https://${baseUrl}/folders/by_communities.json?community_ids=[${communityId}]`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDocuments(response.data.folders.flatMap((folder: any) => folder.documents) || []);

            toast.success("Documents deleted successfully!");
            setSelectedDocuments([]);
            setShowDeleteDocumentDialog(false);
        } catch (error) {
            console.error("Error deleting documents:", error);
            toast.error("Failed to delete documents. Please try again.");
        } finally {
            setIsDeletingDocuments(false);
        }
    };

    const handleClearDocumentSelection = () => {
        setSelectedDocuments([]);
    };

    const handleConfirmDeleteNotices = async () => {
        setIsDeletingNotices(true);
        const noticeIds = selectedNotices.map((id) => parseInt(id));
        try {
            // Update each selected notice by filtering out current communityId from community_ids
            await Promise.all(
                noticeIds.map(async (noticeId) => {
                    try {
                        // Fetch notice data to get community_ids
                        const noticeResponse = await axios.get(
                            `https://${baseUrl}/pms/admin/noticeboards/${noticeId}.json`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        );

                        const noticeData = noticeResponse.data;
                        console.log(noticeData)
                        const currentCommunityIds = noticeData.community_ids || [];

                        // Filter out current communityId from the array
                        const filteredCommunityIds = currentCommunityIds.filter(
                            (cId: string | number) => String(cId) !== String(communityId)
                        );

                        // Update notice with filtered community_ids via updateBroadcast
                        return dispatch(
                            updateBroadcast({
                                id: String(noticeId),
                                data: { noticeboard: { community_ids: filteredCommunityIds } },
                                baseUrl,
                                token
                            })
                        ).unwrap();
                    } catch (error) {
                        console.error(`Error processing notice ${noticeId}:`, error);
                        throw error;
                    }
                })
            );

            // Refresh notices list
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/notices.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setNotices(response.data.noticeboards || []);

            toast.success("Notices removed successfully!");
            setSelectedNotices([]);
            setShowDeleteNoticeDialog(false);
        } catch (error) {
            console.error("Error removing notices:", error);
            toast.error("Failed to remove notices. Please try again.");
        } finally {
            setIsDeletingNotices(false);
        }
    };

    const handleClearNoticeSelection = () => {
        setSelectedNotices([]);
    };

    const handleConfirmDeleteEvents = async () => {
        setIsDeletingEvents(true);
        const eventIds = selectedEvents.map((id) => parseInt(id));
        try {
            // Delete each selected event
            await axios.put(
                `https://${baseUrl}/communities/${communityId}.json`, { community: { event_ids: eventIds } }, {
                headers: { Authorization: `Bearer ${token}` },
            })

            // Refresh events list
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/events.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setEvents(response.data.classifieds || []);

            toast.success("Events deleted successfully!");
            setSelectedEvents([]);
            setShowDeleteEventDialog(false);
        } catch (error) {
            console.error("Error deleting events:", error);
            toast.error("Failed to delete events. Please try again.");
        } finally {
            setIsDeletingEvents(false);
        }
    };

    const handleClearEventSelection = () => {
        setSelectedEvents([]);
    };

    const renderDocumentActions = (document: Document) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/pulse/community/document/${document.id}`)}>
            <Eye className="w-4 h-4" />
        </Button>
    );

    const renderNoticeActions = (notice: Notice) => (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNoticeImportantClick(notice)}
                disabled={updatingStatus[`important_${notice.id}`]}
            >
                <Star
                    className="w-4 h-4"
                    stroke={notice.is_important ? "rgb(234, 179, 8)" : "#000"}
                    fill={notice.is_important ? "rgb(234, 179, 8)" : "#fff"}
                />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/community/notice/${notice.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
        </div>
    );

    const renderEventActions = (event: Event) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/pulse/community/event/${event.id}`)}>
            <Eye className="w-4 h-4" />
        </Button>
    );

    const handleEventStatusChange = async (item: any, checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        // Optimistic update
        setUpdatingStatus((prev) => ({ ...prev, [`event_${item.id}`]: true }));

        // Update events list optimistically
        setEvents((prev) =>
            prev.map((event) =>
                event.id === item.id ? { ...event, active: checked } : event
            )
        );

        try {
            await dispatch(
                updateEvent({
                    id: item.id,
                    data: { event: { active: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Event status updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update event status");

            // Revert optimistic update on error
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === item.id ? { ...event, active: item.active !== false } : event
                )
            );
        } finally {
            setUpdatingStatus((prev) => {
                const newState = { ...prev };
                delete newState[`event_${item.id}`];
                return newState;
            });
        }
    };

    const renderDocumentCell = (document: Document, columnKey: string) => {
        if (columnKey === 'action') {
            return renderDocumentActions(document);
        }
        if (columnKey === 'document_category_name') {
            return document.document_category_name || "-";
        }
        if (columnKey === 'format') {
            return document.attachment.file_type.charAt(0).toUpperCase() + document.attachment.file_type.slice(1).toLowerCase();
        }
        if (columnKey === 'size') {
            return formatFileSize(Number(document.attachment.file_size));
        }
        if (columnKey === 'created_on') {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(document.created_at));
        }
        if (columnKey === 'status') {
            const isChecked = document.active !== false;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isChecked}
                        onChange={(e) => handleDocumentStatusChange(document, e.target.checked)}
                        disabled={updatingStatus[`doc_${document.id}`]}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                    {isChecked ? "Active" : "Inactive"}
                </div>
            );
        }
        const value = document[columnKey as keyof Document];
        if (typeof value === 'object' && value !== null) {
            return "-";
        }
        return String(value) || "-";
    };

    const renderNoticeCell = (notice: Notice, columnKey: string) => {
        if (columnKey === 'action') {
            return renderNoticeActions(notice);
        }
        if (columnKey === 'sr_no') {
            return (notices.indexOf(notice) + 1);
        }
        if (columnKey === 'created_at') {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(notice.created_at));
        }
        if (columnKey === 'expire_time') {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(notice.expire_time));
        }
        if (columnKey === 'status') {
            const isChecked = notice.active;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isChecked}
                        onChange={(e) => handleNoticeStatusChange(notice, e.target.checked)}
                        disabled={updatingStatus[notice.id]}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                    {isChecked ? "Active" : "Inactive"}
                </div>
            );
        }
        if (columnKey === 'show_on_home_screen') {
            const isShowOnHomeScreenChecked = notice.show_on_home_screen;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isShowOnHomeScreenChecked}
                        onChange={(e) => handleShowOnHomeScreenChange(notice, e.target.checked)}
                        disabled={updatingStatus[`home_${notice.id}`]}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                    {isShowOnHomeScreenChecked ? "Active" : "Inactive"}
                </div>
            );
        }
        if (columnKey === 'visible_after_expire') {
            const isVisibleAfterExpireChecked = notice.flag_expire;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isVisibleAfterExpireChecked}
                        onChange={(e) => handleVisibleAfterExpireChange(notice, e.target.checked)}
                        disabled={updatingStatus[`expire_${notice.id}`]}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                    {isVisibleAfterExpireChecked ? "Active" : "Inactive"}
                </div>
            );
        }
        return notice[columnKey as keyof Notice] || "-";
    };

    const renderEventCell = (event: Event, columnKey: string) => {
        if (columnKey === 'action') {
            return renderEventActions(event);
        }
        if (columnKey === 'event_date') {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(new Date(event.from_time));
        }
        if (columnKey === 'event_time') {
            return new Intl.DateTimeFormat("en-GB", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(new Date(event.from_time));
        }
        if (columnKey === 'event_category') {
            return event.is_paid ? "Paid" : "Complimentary";
        }
        if (columnKey === 'status') {
            const isChecked = event.active !== false;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isChecked}
                        onChange={(e) => handleEventStatusChange(event, e.target.checked)}
                        disabled={updatingStatus[`event_${event.id}`]}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                    {isChecked ? "Active" : "Inactive"}
                </div>
            );
        }
        return event[columnKey as keyof Event] || "-";
    };

    return (
        <div className="space-y-6">
            {/* Events Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <File size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Events</span>
                </div>

                <EnhancedTable
                    data={events}
                    columns={eventColumns}
                    renderCell={renderEventCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    storageKey="community_events"
                    onSelectItem={(itemId: string, checked: boolean) => {
                        if (checked) {
                            setSelectedEvents([...selectedEvents, itemId]);
                        } else {
                            setSelectedEvents(selectedEvents.filter(id => id !== itemId));
                        }
                    }}
                    onSelectAll={(isSelectAll: boolean) => {
                        if (isSelectAll) {
                            setSelectedEvents(events.map(event => String(event.id)));
                        } else {
                            setSelectedEvents([]);
                        }
                    }}
                    selectedItems={selectedEvents}
                    getItemId={(item: any) => String(item.id)}
                />
            </div>

            {/* Documents Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <File size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Documents</span>
                </div>

                <EnhancedTable
                    data={documents}
                    columns={documentColumns}
                    renderCell={renderDocumentCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    storageKey="community_documents"
                    onSelectItem={(itemId: string, checked: boolean) => {
                        if (checked) {
                            setSelectedDocuments([...selectedDocuments, itemId]);
                        } else {
                            setSelectedDocuments(selectedDocuments.filter(id => id !== itemId));
                        }
                    }}
                    onSelectAll={(isSelectAll: boolean) => {
                        if (isSelectAll) {
                            setSelectedDocuments(documents.map(doc => String(doc.id)));
                        } else {
                            setSelectedDocuments([]);
                        }
                    }}
                    selectedItems={selectedDocuments}
                    getItemId={(item: any) => String(item.id)}
                />
            </div>

            {/* Notices Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <File size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Notices</span>
                </div>

                <EnhancedTable
                    data={notices}
                    columns={noticeColumns}
                    renderCell={renderNoticeCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    storageKey="community_notices"
                    onSelectItem={(itemId: string, checked: boolean) => {
                        if (checked) {
                            setSelectedNotices([...selectedNotices, itemId]);
                        } else {
                            setSelectedNotices(selectedNotices.filter(id => id !== itemId));
                        }
                    }}
                    onSelectAll={(isSelectAll: boolean) => {
                        if (isSelectAll) {
                            setSelectedNotices(notices.map(notice => String(notice.id)));
                        } else {
                            setSelectedNotices([]);
                        }
                    }}
                    selectedItems={selectedNotices}
                    getItemId={(item: any) => String(item.id)}
                />
            </div>

            {/* Document Selection Panel */}
            {selectedDocuments.length > 0 && (
                <div
                    className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
                    style={{ top: "50%", left: "35%", width: "563px", height: "105px" }}
                >
                    <div className="flex items-center justify-between w-full h-full pr-6">
                        <div className="flex items-center gap-2">
                            <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
                                {selectedDocuments.length}
                            </div>
                            <div className="flex flex-col justify-center px-3 py-2 flex-1">
                                <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                                    Selection
                                </span>
                                <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
                                    {selectedDocuments.length === 1
                                        ? documents.find((doc) => String(doc.id) === selectedDocuments[0])?.title || "Document"
                                        : selectedDocuments.length <= 3
                                            ? selectedDocuments.map((id) => documents.find((doc) => String(doc.id) === id)?.title || "Document").join(", ")
                                            : `${selectedDocuments.slice(0, 3).map((id) => documents.find((doc) => String(doc.id) === id)?.title || "Document").join(", ")} and ${selectedDocuments.length - 3} more`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center ml-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteDocumentDialog(true)}
                                disabled={isDeletingDocuments}
                                className="text-gray-600 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
                            >
                                {isDeletingDocuments ? (
                                    <Loader2 className="w-6 h-6 mt-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                                <span className="text-xs font-medium">Delete</span>
                            </Button>

                            <div className="w-px h-8 bg-gray-300 mr-5"></div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearDocumentSelection}
                                className="text-gray-600 hover:bg-gray-100"
                                style={{ width: "44px", height: "44px" }}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Document Confirmation Dialog */}
            <Dialog open={showDeleteDocumentDialog} onOpenChange={(open) => {
                if (!open) setShowDeleteDocumentDialog(false);
            }}>
                <DialogContent className="max-w-sm bg-white rounded-lg p-0 flex flex-col border-0 shadow-lg">
                    <div className="bg-white pt-12 text-center flex flex-col">
                        <h2 className="text-base font-semibold text-gray-900 mb-12 leading-tight">
                            Are you sure you want to delete<br />the selected document{selectedDocuments.length > 1 ? 's' : ''}?
                        </h2>
                        <div className="flex mt-auto">
                            <button
                                onClick={() => setShowDeleteDocumentDialog(false)}
                                className="flex-1 px-3 py-4 bg-[#E7E3D9] text-[#6C6C6C] font-semibold text-[14px] transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDeleteDocuments}
                                disabled={isDeletingDocuments}
                                className="flex-1 px-3 py-4 bg-[#C72030] !text-white font-semibold text-[14px] hover:bg-[#A01020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeletingDocuments ? "Deleting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notice Selection Panel */}
            {selectedNotices.length > 0 && (
                <div
                    className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
                    style={{ top: "50%", left: "35%", width: "563px", height: "105px" }}
                >
                    <div className="flex items-center justify-between w-full h-full pr-6">
                        <div className="flex items-center gap-2">
                            <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
                                {selectedNotices.length}
                            </div>
                            <div className="flex flex-col justify-center px-3 py-2 flex-1">
                                <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                                    Selection
                                </span>
                                <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
                                    {selectedNotices.length === 1
                                        ? notices.find((notice) => String(notice.id) === selectedNotices[0])?.title || "Notice"
                                        : selectedNotices.length <= 3
                                            ? selectedNotices.map((id) => notices.find((notice) => String(notice.id) === id)?.title || "Notice").join(", ")
                                            : `${selectedNotices.slice(0, 3).map((id) => notices.find((notice) => String(notice.id) === id)?.title || "Notice").join(", ")} and ${selectedNotices.length - 3} more`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center ml-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteNoticeDialog(true)}
                                disabled={isDeletingNotices}
                                className="text-gray-600 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
                            >
                                {isDeletingNotices ? (
                                    <Loader2 className="w-6 h-6 mt-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                                <span className="text-xs font-medium">Delete</span>
                            </Button>

                            <div className="w-px h-8 bg-gray-300 mr-5"></div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearNoticeSelection}
                                className="text-gray-600 hover:bg-gray-100"
                                style={{ width: "44px", height: "44px" }}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Notice Confirmation Dialog */}
            <Dialog open={showDeleteNoticeDialog} onOpenChange={(open) => {
                if (!open) setShowDeleteNoticeDialog(false);
            }}>
                <DialogContent className="max-w-sm bg-white rounded-lg p-0 flex flex-col border-0 shadow-lg">
                    <div className="bg-white pt-12 text-center flex flex-col">
                        <h2 className="text-base font-semibold text-gray-900 mb-12 leading-tight">
                            Are you sure you want to delete<br />the selected notice{selectedNotices.length > 1 ? 's' : ''}?
                        </h2>
                        <div className="flex mt-auto">
                            <button
                                onClick={() => setShowDeleteNoticeDialog(false)}
                                className="flex-1 px-3 py-4 bg-[#E7E3D9] text-[#6C6C6C] font-semibold text-[14px] transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDeleteNotices}
                                disabled={isDeletingNotices}
                                className="flex-1 px-3 py-4 bg-[#C72030] !text-white font-semibold text-[14px] hover:bg-[#A01020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeletingNotices ? "Deleting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Event Selection Panel */}
            {selectedEvents.length > 0 && (
                <div
                    className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
                    style={{ top: "50%", left: "35%", width: "563px", height: "105px" }}
                >
                    <div className="flex items-center justify-between w-full h-full pr-6">
                        <div className="flex items-center gap-2">
                            <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
                                {selectedEvents.length}
                            </div>
                            <div className="flex flex-col justify-center px-3 py-2 flex-1">
                                <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                                    Selection
                                </span>
                                <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
                                    {selectedEvents.length === 1
                                        ? events.find((event) => String(event.id) === selectedEvents[0])?.title || "Event"
                                        : selectedEvents.length <= 3
                                            ? selectedEvents.map((id) => events.find((event) => String(event.id) === id)?.title || "Event").join(", ")
                                            : `${selectedEvents.slice(0, 3).map((id) => events.find((event) => String(event.id) === id)?.title || "Event").join(", ")} and ${selectedEvents.length - 3} more`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center ml-10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteEventDialog(true)}
                                disabled={isDeletingEvents}
                                className="text-gray-600 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
                            >
                                {isDeletingEvents ? (
                                    <Loader2 className="w-6 h-6 mt-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                                <span className="text-xs font-medium">Delete</span>
                            </Button>

                            <div className="w-px h-8 bg-gray-300 mr-5"></div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearEventSelection}
                                className="text-gray-600 hover:bg-gray-100"
                                style={{ width: "44px", height: "44px" }}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Event Confirmation Dialog */}
            <Dialog open={showDeleteEventDialog} onOpenChange={(open) => {
                if (!open) setShowDeleteEventDialog(false);
            }}>
                <DialogContent className="max-w-sm bg-white rounded-lg p-0 flex flex-col border-0 shadow-lg">
                    <div className="bg-white pt-12 text-center flex flex-col">
                        <h2 className="text-base font-semibold text-gray-900 mb-12 leading-tight">
                            Are you sure you want to delete<br />the selected event{selectedEvents.length > 1 ? 's' : ''}?
                        </h2>
                        <div className="flex mt-auto">
                            <button
                                onClick={() => setShowDeleteEventDialog(false)}
                                className="flex-1 px-3 py-4 bg-[#E7E3D9] text-[#6C6C6C] font-semibold text-[14px] transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDeleteEvents}
                                disabled={isDeletingEvents}
                                className="flex-1 px-3 py-4 bg-[#C72030] !text-white font-semibold text-[14px] hover:bg-[#A01020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeletingEvents ? "Deleting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommunityEventsTab;