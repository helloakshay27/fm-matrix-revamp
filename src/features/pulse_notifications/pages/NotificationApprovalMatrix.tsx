import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomNotificationApproversQuery } from "../hooks/useCustomNotificationApproversQuery";
import { useCreateCustomNotificationApproverMutation } from "../hooks/useCreateCustomNotificationApproverMutation";
import { useDeleteCustomNotificationApproverMutation } from "../hooks/useDeleteCustomNotificationApproverMutation";
import { AddApproverDialog } from "../components/AddApproverDialog";
import { RemoveApproverDialog } from "../components/RemoveApproverDialog";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import type { CustomNotificationApprover } from "../types/customNotification";

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "user_name",
        label: "Approver Name",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
];

const NotificationApprovalMatrix = () => {
    const siteIdRaw = localStorage.getItem("selectedSiteId");
    const pmsSiteId = siteIdRaw ? parseInt(siteIdRaw, 10) : null;

    const { data, isLoading, isFetching } = useCustomNotificationApproversQuery(pmsSiteId);

    const approvers = data?.site_specific_approvers ?? [];
    const effectiveIds = new Set(data?.effective_approver_ids ?? []);

    const [isAddApproverOpen, setIsAddApproverOpen] = useState(false);
    const [newApproverSiteId, setNewApproverSiteId] = useState(siteIdRaw ?? "");
    const [newApproverUserIds, setNewApproverUserIds] = useState<string[]>([]);

    const createApproverMutation = useCreateCustomNotificationApproverMutation();

    const handleAddApprover = async () => {
        if (!newApproverSiteId || newApproverUserIds.length === 0) return;
        const selectedSiteId = parseInt(newApproverSiteId, 10);
        try {
            await Promise.all(
                newApproverUserIds.map((userId) =>
                    createApproverMutation.mutateAsync({
                        pms_site_id: selectedSiteId,
                        user_id: parseInt(userId, 10),
                    })
                )
            );
            toast.success(
                `${newApproverUserIds.length} approver${newApproverUserIds.length > 1 ? "s" : ""} added successfully`
            );
            setIsAddApproverOpen(false);
            setNewApproverUserIds([]);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to add approver(s)"));
        }
    };

    const [approverPendingRemoval, setApproverPendingRemoval] =
        useState<CustomNotificationApprover | null>(null);

    const deleteApproverMutation = useDeleteCustomNotificationApproverMutation();

    const handleRemoveApprover = async () => {
        if (!approverPendingRemoval) return;
        try {
            await deleteApproverMutation.mutateAsync({
                id: approverPendingRemoval.id,
                pmsSiteId: approverPendingRemoval.pms_site_id,
            });
            toast.success("Approver removed successfully");
            setApproverPendingRemoval(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to remove approver"));
        }
    };

    const renderLeftActions = () => (
        <Button
            className="bg-brand hover:bg-brand-hover text-white"
            onClick={() => setIsAddApproverOpen(true)}
        >
            <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
    );

    const renderActions = (approver: CustomNotificationApprover) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setApproverPendingRemoval(approver)}
            className="h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
            title="Remove"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );

    const renderCell = (approver: CustomNotificationApprover, columnKey: string) => {
        switch (columnKey) {
            case "id":
                return approver.id;
            case "user_name":
                return <span className="font-medium text-gray-900">{approver.user_name}</span>;
            case "user_id":
                return approver.user_id;
            case "effective":
                return effectiveIds.has(approver.user_id) ? (
                    <Badge className="bg-brand-success-bg text-brand-success">Yes</Badge>
                ) : (
                    <Badge variant="outline">No</Badge>
                );
            default:
                return approver[columnKey as keyof CustomNotificationApprover] ?? "—";
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-4">
            <EnhancedTable
                data={approvers}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey="pulse-notification-approval-matrix-table"
                loading={isLoading || isFetching}
                emptyMessage="No approvers configured for this site"
                leftActions={renderLeftActions()}
            />

            <AddApproverDialog
                open={isAddApproverOpen}
                onOpenChange={setIsAddApproverOpen}
                siteId={newApproverSiteId}
                onSiteIdChange={setNewApproverSiteId}
                userIds={newApproverUserIds}
                onUserIdsChange={setNewApproverUserIds}
                onConfirm={handleAddApprover}
                isSubmitting={createApproverMutation.isPending}
            />

            <RemoveApproverDialog
                open={approverPendingRemoval !== null}
                onOpenChange={(open) => {
                    if (!open) setApproverPendingRemoval(null);
                }}
                approverName={approverPendingRemoval?.user_name}
                onConfirm={handleRemoveApprover}
                isSubmitting={deleteApproverMutation.isPending}
            />
        </div>
    );
};

export default NotificationApprovalMatrix;
