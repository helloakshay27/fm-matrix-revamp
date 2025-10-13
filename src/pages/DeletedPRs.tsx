import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { fetchDeletedPRs } from "@/store/slices/pendingApprovalSlice";
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
];

export const DeletedPRs = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const token = localStorage.getItem("token")
    const baseUrl = localStorage.getItem("baseUrl")

    const [loading, setLoading] = useState(false)
    const [deletedPRs, setDeletedPRs] = useState([])

    const getDeletedPRs = async () => {
        try {
            const response = await dispatch(fetchDeletedPRs({ baseUrl, token })).unwrap()
            const formattedResponse = response.deletion_requests.map((item: any) => ({
                id: item.resource_id,
                type:
                    item.resource_type === "Pms::PurchaseOrder"
                        ? "Material PR"
                        : item.resource_type === "Pms::WorkOrder"
                            ? "Service PR"
                            : "",
                prNo: item.reference_number,
            }));
            setDeletedPRs(formattedResponse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDeletedPRs()
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
                            `/${url}/${item.id}`
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
            <h1 className="text-2xl font-bold mb-3">Deleted PRs</h1>
            <EnhancedTable
                data={deletedPRs}
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