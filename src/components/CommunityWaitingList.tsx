import { File, Loader2 } from "lucide-react"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { useState } from "react"
import { ColumnConfig } from "@/hooks/useEnhancedTable";

const columns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'full_name',
        label: 'Requestor Name',
        sortable: true,
        draggable: true
    },
    {
        key: 'reason',
        label: 'Reason',
        sortable: true,
        draggable: true
    },
    {
        key: 'mobile',
        label: 'Requestor Number',
        sortable: true,
        draggable: true
    },
    {
        key: 'email',
        label: 'Requestor Mail',
        sortable: true,
        draggable: true
    },
    {
        key: 'organisation',
        label: 'Organisation',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_at',
        label: 'Request Date',
        sortable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    }
];

const CommunityWaitingList = () => {
    const [loading, setLoading] = useState(false)

    const renderCell = (item: any, columnKey: string) => {
        return item[columnKey] || "-";
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                    <File size={16} />
                </div>
                <span className="font-semibold text-lg text-gray-800">Requestor Details</span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                </div>
            ) : (
                <EnhancedTable
                    data={[]}
                    columns={columns}
                    renderCell={renderCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                />
            )}
        </div>
    )
}

export default CommunityWaitingList