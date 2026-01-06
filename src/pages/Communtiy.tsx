import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import axios from "axios"
import { Edit, Eye, Plus } from "lucide-react"
import { useEffect, useState } from "react"
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

const Communtiy = () => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    const [communities, setCommunities] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchCommunities = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://${baseUrl}/communities.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setCommunities(response.data.communities)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommunities()
    }, [])

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
                return <img src={item.icon} alt="" className="h-14 w-14 object-fit" />
            case "title":
                return <div className="w-60">{item.name}</div>;
            case "status":
                return <div className="flex items-center gap-2">
                    <Switch
                        checked={!!item.active}
                    // onCheckedChange={() => handleStatusChange(item.id, item.active)} 
                    />
                    {item.active ? "Active" : "Inactive"}
                </div>
            case "members":
                return item.all_members.length || "-";
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
                data={communities}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                onFilterClick={() => { }}
                loading={loading}
            />
        </div>
    )
}

export default Communtiy