import { useState, useEffect } from "react";
import { FileText, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/store/hooks";
import { updateBroadcast } from "@/store/slices/broadcastSlice";

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
    created_by: string;
    created_on: string;
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
    from_time: string;
}

// Mock data for Documents
const mockDocuments: Document[] = [
    {
        id: 1,
        title: "Lease Agreement",
        category: "Lease / Legal",
        folder: "Lease Agreements",
        format: "PDF",
        size: "1.2 MB",
        created_by: "Rohan Desai",
        created_on: "2025-01-05"
    },
    {
        id: 2,
        title: "Fire Safety Drill Report",
        category: "Safety & Compliance",
        folder: "Fire Safety Certificates",
        format: "DOCX",
        size: "320 KB",
        created_by: "Priya Kulkarni",
        created_on: "2025-01-03"
    },
    {
        id: 3,
        title: "Visitor Pass Template",
        category: "Templates",
        folder: "Visitor Pass Templates",
        format: "PDF",
        size: "450 KB",
        created_by: "Admin System",
        created_on: "2025-01-02"
    },
    {
        id: 4,
        title: "Maintenance Work Order",
        category: "Maintenance",
        folder: "Work Orders",
        format: "XLSX",
        size: "780 KB",
        created_by: "Mahesh Patil",
        created_on: "2025-01-01"
    }
];

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
        key: 'category',
        label: 'Category',
        sortable: true,
        draggable: true
    },
    {
        key: 'folder',
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
        key: 'created_by',
        label: 'Created By',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_on',
        label: 'Created On',
        sortable: true,
        draggable: true
    }
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
        label: 'Title',
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
        key: 'event_at',
        label: 'Location',
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

const CommunityEventsTab = ({ communityId }: CommunityEventsTabProps) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [documents] = useState<Document[]>(mockDocuments);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

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

    const renderDocumentActions = (document: Document) => (
        <Button variant="ghost" size="sm">
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
                onClick={() => navigate(`/pulse/notices/details/${notice.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
        </div>
    );

    const renderEventActions = (event: Event) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/pulse/events/details/${event.id}`)}>
            <Eye className="w-4 h-4" />
        </Button>
    );

    const renderDocumentCell = (document: Document, columnKey: string) => {
        if (columnKey === 'action') {
            return renderDocumentActions(document);
        }
        return document[columnKey as keyof Document] || "-";
    };

    const renderNoticeCell = (notice: Notice, columnKey: string) => {
        if (columnKey === 'action') {
            return renderNoticeActions(notice);
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
                        onCheckedChange={(checked) => handleNoticeStatusChange(notice, checked)}
                        disabled={updatingStatus[notice.id]}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
                        onCheckedChange={(checked) => handleShowOnHomeScreenChange(notice, checked)}
                        disabled={updatingStatus[`home_${notice.id}`]}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
                        onCheckedChange={(checked) => handleVisibleAfterExpireChange(notice, checked)}
                        disabled={updatingStatus[`expire_${notice.id}`]}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
        return event[columnKey as keyof Event] || "-";
    };

    return (
        <div className="space-y-6">
            {/* Events Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <FileText size={16} />
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
                        <FileText size={16} />
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
                        <FileText size={16} />
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
        </div>
    );
};

export default CommunityEventsTab;
