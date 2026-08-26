import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Plus } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCustomNotificationsQuery } from "../hooks/useCustomNotificationsQuery";
import { NotificationPriorityBadge } from "../components/NotificationPriorityBadge";
import {
    formatNotificationDate,
    formatNotificationStatusLabel,
    formatNotificationTypeLabel,
} from "../utils/notificationFormatters";
import type { CustomNotification } from "../types/customNotification";

const PAGE_SIZE = 25;

const columns: ColumnConfig[] = [
    {
        key: "title",
        label: "Title",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "ntype",
        label: "Type",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "priority",
        label: "Priority",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "created_at",
        label: "Created At",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "scheduled_at",
        label: "Scheduled At",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "sent_at",
        label: "Sent At",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "expires_at",
        label: "Expiry Date & Time",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "total_recipients",
        label: "Recipients",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "sent_count",
        label: "Sent",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "failed_count",
        label: "Failed",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "read_count",
        label: "Read",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
];

const PulseNotifications = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isFetching } = useCustomNotificationsQuery({
        // status: "pending_approval",
        page: currentPage,
        per_page: PAGE_SIZE,
    });

    const notifications = data?.custom_notifications ?? [];
    const totalPages = data?.meta.total_pages ?? 1;

    const renderCell = (notification: CustomNotification, columnKey: string) => {
        switch (columnKey) {
            case "title":
                return (
                    <span className="font-medium text-gray-900">
                        {notification.title}
                    </span>
                );
            case "ntype":
                return formatNotificationTypeLabel(notification.ntype);
            case "priority":
                return <NotificationPriorityBadge priority={notification.priority} />;
            case "status":
                return (
                    <StatusBadge className="rounded-[10px]" status={notification.status}>
                        {formatNotificationStatusLabel(notification.status)}
                    </StatusBadge>
                );
            case "created_at":
                return formatNotificationDate(notification.created_at);
            case "scheduled_at":
                return formatNotificationDate(notification.scheduled_at);
            case "sent_at":
                return formatNotificationDate(notification.sent_at);
            case "expires_at":
                return formatNotificationDate(notification.expires_at);
            case "total_recipients":
                return notification.total_recipients;
            case "sent_count":
                return notification.sent_count;
            case "failed_count":
                return notification.failed_count;
            case "read_count":
                return notification.read_count;
            default:
                return notification[columnKey as keyof CustomNotification] ?? "—";
        }
    };

    const renderActions = (notification: CustomNotification) => (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/notifications/view/${notification.id}`)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="View"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/notifications/edit/${notification.id}`)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </Button>
        </>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <EnhancedTable
                data={notifications}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey="pulse-custom-notifications-table"
                loading={isLoading || isFetching}
                emptyMessage="No notifications pending approval"
                pagination
                pageSize={PAGE_SIZE}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                leftActions={
                    <Button
                        className="bg-brand hover:bg-brand-hover text-white"
                        onClick={() => navigate("/pulse/notifications/add")}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                }
            />
        </div>
    );
};

export default PulseNotifications;
