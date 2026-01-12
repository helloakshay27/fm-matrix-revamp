import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import axios from "axios"
import { Edit, Eye, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CommunityFilterModal } from "@/components/CommunityFilterModal"
import { toast } from "sonner"

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
    const [searchParams] = useSearchParams();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    const [communities, setCommunities] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [filters, setFilters] = useState({
        status: '',
        created_at: '',
        created_by: '',
    })

    // Check if we're in selection mode
    const isSelectionMode = searchParams.get('mode') === 'selection';

    const fetchCommunities = async (filterParams?: string) => {
        setLoading(true)
        try {
            const url = filterParams
                ? `https://${baseUrl}/communities.json?${filterParams}`
                : `https://${baseUrl}/communities.json`

            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setCommunities(response.data.communities)
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch communities')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommunities()
    }, [])

    const handleApplyFilter = async (filterData: { status?: string; created_at?: string; created_by?: string }) => {
        // Update local filters state
        setFilters({
            status: filterData.status || '',
            created_at: filterData.created_at || '',
            created_by: filterData.created_by || '',
        })

        // Build filter params for API
        const params = new URLSearchParams()

        if (filterData.status) {
            params.append('q[active_eq]', filterData.status)
        }

        if (filterData.created_at) {
            params.append('q[created_at_eq]', filterData.created_at)
        }

        if (filterData.created_by) {
            params.append('q[created_by_eq]', filterData.created_by)
        }

        try {
            await fetchCommunities(params.toString())
        } catch (error) {
            console.log(error)
            toast.error('Failed to apply filters')
        }
    }

    const handleContinue = () => {
        // Save selected community IDs to localStorage
        localStorage.setItem('selectedCommunityIds', JSON.stringify(selectedRows));

        // Check where to redirect based on the 'from' parameter
        const fromPage = searchParams.get('from');
        const broadcastId = searchParams.get('id');

        if (fromPage === 'edit' && broadcastId) {
            // Redirect back to edit page
            navigate(`/pulse/notices/edit/${broadcastId}`);
        } else if (fromPage === 'add-event') {
            // Redirect back to add event page
            navigate('/pulse/events/add');
        } else {
            // Default to add broadcast page (from=add or no from parameter)
            navigate('/pulse/notices/add');
        }
    }

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
                onClick={() => navigate(`/pulse/community/edit/${item.id}`)}
            >
                <Edit className="w-4 h-4" />
            </Button>
        </div>
    )

    const leftActions = (
        <>
            {!isSelectionMode && (
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => navigate("/pulse/community/add")}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            )}
        </>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "images":
                return <img src={item.icon} alt="" className="h-14 w-14 object-fit" />
            case "title":
                return <div className="w-60">{item.name}</div>;
            case "description":
                return <div className="w-60 truncate">{item.description}</div>;
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

    const handleCommunitySelection = (communityIdString: string, isSelected: boolean) => {
        const communityId = parseInt(communityIdString);
        setSelectedRows(prev => {
            if (isSelected) {
                return [...prev, communityId];
            } else {
                return prev.filter(id => id !== communityId);
            }
        });
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            const allCommunityIds = communities.map((community: any) => community.id);
            setSelectedRows(allCommunityIds);
        } else {
            setSelectedRows([]);
        }
    };

    return (
        <div className="p-6 space-y-4">
            {isSelectionMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Select Communities</h3>
                        <p className="text-sm text-gray-600">
                            {selectedRows?.length > 0
                                ? `${selectedRows?.length} ${selectedRows?.length === 1 ? 'community' : 'communities'} selected`
                                : 'Please select communities'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const fromPage = searchParams.get('from');
                                if (fromPage === 'add-event') {
                                    navigate('/pulse/events/add');
                                } else {
                                    navigate('/pulse/notices/add');
                                }
                            }}
                            className="border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleContinue}
                            disabled={selectedRows.length === 0}
                            className="bg-[#C72030] hover:bg-[#A01020] text-white disabled:opacity-50"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            <EnhancedTable
                data={communities}
                columns={columns}
                renderActions={!isSelectionMode ? renderActions : undefined}
                renderCell={renderCell}
                leftActions={leftActions}
                onFilterClick={() => setIsFilterModalOpen(true)}
                loading={loading}
                selectable={isSelectionMode}
                enableSelection={isSelectionMode}
                selectedItems={selectedRows.map(id => String(id))}
                onSelectItem={handleCommunitySelection}
                onSelectAll={handleSelectAll}
                getItemId={(item: any) => String(item.id)}
            />

            {/* Filter Modal */}
            <CommunityFilterModal
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
                onApply={handleApplyFilter}
            />
        </div>
    )
}

export default Communtiy