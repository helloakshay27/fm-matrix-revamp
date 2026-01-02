import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { Button } from "./ui/button"
import { Edit, Eye, Plus } from "lucide-react"
import { Switch } from "./ui/switch"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import SosFilterModal, { SosFilterParams } from "./SosFilterModal"

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
        key: 'category',
        label: 'Category',
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

const InternalSosDirectory = ({ internalSos, handleStatusChange }: { internalSos: any[], handleStatusChange: (id: number, status: boolean) => void }) => {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<SosFilterParams>({});

    const filteredData = internalSos.filter(item => {
        if (filters.created_at) {
            const itemDate = new Date(item.created_at).toISOString().split('T')[0];
            if (itemDate !== filters.created_at) return false;
        }
        if (filters.created_by) {
            if (!item.created_by?.toLowerCase().includes(filters.created_by.toLowerCase())) return false;
        }
        if (filters.status) {
            const statusBool = filters.status === 'true';
            if (item.status !== statusBool) return false;
        }
        return true;
    });

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "image":
                return <img src={item.document_url} alt="" className="h-14 w-14 object-fit" />
            case "title":
                return <div className="w-60">{item.title}</div>;
            case "status":
                return <div className="flex items-center gap-2">
                    <Switch checked={!!item.status} onCheckedChange={() => handleStatusChange(item.id, item.status)} />
                    {item.status ? "Active" : "Inactive"}
                </div>
            case "created_at":
                return new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }).format(new Date(item.created_at))
            default:
                return item[columnKey] || "-";
        }
    }

    const renderActions = (item: any) => (
        <div className="flex">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/sos-directory/${item.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/sos-directory/${item.id}/edit`)}
            >
                <Edit className="w-4 h-4" />
            </Button>
        </div>
    )

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => navigate("/pulse/sos-directory/add?type=internal")}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    return (
        <div>
            <EnhancedTable
                data={filteredData}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                onFilterClick={() => setIsFilterOpen(true)}
            />
            <SosFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={setFilters}
                currentFilters={filters}
            />
        </div>
    )
}

export default InternalSosDirectory