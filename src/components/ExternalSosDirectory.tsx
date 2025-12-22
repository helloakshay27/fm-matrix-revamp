import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Button } from "./ui/button"
import { Eye, Plus } from "lucide-react"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { useNavigate } from "react-router-dom"

const columns: ColumnConfig[] = [
    {
        key: 'image',
        label: 'Image',
        sortable: true,
        draggable: true
    },
    {
        key: 'title',
        label: 'Title',
        sortable: true,
        draggable: true
    },
    {
        key: 'contact_number',
        label: 'Contact Number',
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
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_at',
        label: 'Created On',
        sortable: true,
        draggable: true
    },
]

const ExternalSosDirectory = ({ externalSos }) => {
    const navigate = useNavigate();

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "image":
                return <img src={item.document_url} alt="" className="h-14 w-14 object-fit" />
            case "status":
                return item.status ? "Active" : "Inactive";
            default:
                return item[columnKey] || "-";
        }
    }

    const renderActions = (item: any) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/pulse/sos-directory/${item.id}`)}
        >
            <Eye className="w-4 h-4" />
        </Button>
    )

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => navigate("/pulse/sos-directory/add?type=external")}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    return (
        <div>
            <EnhancedTable
                data={externalSos}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
            />
        </div>
    )
}

export default ExternalSosDirectory