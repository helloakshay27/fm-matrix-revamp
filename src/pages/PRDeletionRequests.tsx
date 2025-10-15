import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { fetchDeletionRequests } from "@/store/slices/pendingApprovalSlice";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns: ColumnConfig[] = [
    {
        key: "view",
        label: "View",
        sortable: false,
        draggable: false,
        defaultVisible: true,
    },
    {
        key: "type",
        label: "Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "prNo",
        label: "PR No.",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "siteName",
        label: "Site Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "level",
        label: "Level",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

export const PRDeletionRequests = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token")
    const baseUrl = localStorage.getItem("baseUrl")

    const [loading, setLoading] = useState(false)
    const [deletionRequests, setDeletionRequests] = useState([]);

    const getDeletionRequests = async () => {
        try {
            setLoading(true)
            const response = await dispatch(fetchDeletionRequests({ baseUrl, token, page: 1 })).unwrap()
            const formattedResponse = response.pending_data.map((item: any) => ({
                id: item.resource_id,
                type:
                    item.resource_type === "Pms::PurchaseOrder" && item.letter_of_indent === true
                        ? "Material PR"
                        : item.resource_type === "Pms::WorkOrder" && item.letter_of_indent === true
                            ? "Service PR"
                            : "",
                prNo: item.external_id,
                siteName: item.site_name,
                level: item.approval_level_name,
                level_id: item.level_id,
                user_id: item.user_id,
                delete_request_id: item.delete_request_id
            }));
            setDeletionRequests(formattedResponse)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDeletionRequests()
    }, [])

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === "view") {
            const url =
                item.type === "Material PR"
                    ? `finance/material-pr/details`
                    : item.type === "Service PR"
                        ? `finance/service-pr/details`
                        : ``;
            return (
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() =>
                        navigate(
                            `/${url}/${item.id}?level_id=${item.level_id}&user_id=${item.user_id}&request_id=${item.delete_request_id}&type=delete-request`
                        )
                    }
                >
                    <Eye className="h-4 w-4" />
                </Button>
            );
        }
        return item[columnKey];
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-3">PR Deletion Requests</h1>
            <EnhancedTable
                data={deletionRequests}
                columns={columns}
                renderCell={renderCell}
                storageKey="pr-deletion-requests-table"
                className="bg-white rounded-lg shadow overflow-x-auto"
                emptyMessage="No PR deletion requests found"
                hideTableExport={true}
                hideTableSearch={true}
                hideColumnsButton={true}
                loading={loading}
            />
        </div>
    )
}