import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Eye, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const columns: ColumnConfig[] = [
    {
        key: 'images',
        label: 'Community Images',
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
        key: 'description',
        label: 'Description',
        sortable: true,
        draggable: true
    },
    {
        key: 'members',
        label: 'Members',
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
    {
        key: 'created_by',
        label: 'Created By',
        sortable: true,
        draggable: true
    },
]

const communityData = [
    {
        id: 1,
        images: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        title: "Community 1",
        description: "Description 1",
        members: 10,
        status: true,
        created_at: "2022-01-01",
        created_by: "John Doe"
    }
]

const Communtiy = () => {
    const navigate = useNavigate();

    const renderActions = (item: any) => (
        <div className="flex">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/community/${item.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/community/${item.id}/edit`)}
            >
                <Edit className="w-4 h-4" />
            </Button>
        </div>
    )

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => navigate("/pulse/community/add")}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "images":
                return <img src={item.images} alt="" className="h-14 w-14 object-fit" />
            case "title":
                return <div className="w-60">{item.title}</div>;
            case "status":
                return <div className="flex items-center gap-2">
                    <Switch
                        checked={!!item.status}
                    // onCheckedChange={() => handleStatusChange(item.id, item.status)} 
                    />
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

    return (
        <div className="p-6">
            <EnhancedTable
                data={communityData}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                onFilterClick={() => { }}
            />
        </div>
    )
}

export default Communtiy