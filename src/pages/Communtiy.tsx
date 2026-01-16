import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@mui/material"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import axios from "axios"
import { Edit, Eye, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CommunityFilterModal } from "@/components/CommunityFilterModal"
import { toast } from "sonner"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const columns: ColumnConfig[] = [
    {
        key: 'images',
        label: 'Community Images',
        sortable: true,
        draggable: true
    },
    {
        key: 'title',
        label: 'Community Name',
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
        sortable: false,
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
    const [isToggling, setIsToggling] = useState<number | null>(null)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        created_at: '',
        created_by: '',
    })

    // Check if we're in selection mode
    const isSelectionMode = searchParams.get('mode') === 'selection';

    const fetchCommunities = async (page: number, currentFilters: any, currentSearch: string) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', String(page))
            params.append('per_page', '10')

            if (currentFilters.status) {
                params.append('q[active_eq]', currentFilters.status)
            }
            if (currentFilters.created_at) {
                params.append('q[created_on_eq]', currentFilters.created_at)
            }
            if (currentFilters.created_by) {
                params.append('q[created_by_id_eq]', currentFilters.created_by)
            }
            if (currentSearch) {
                params.append('q[name_or_created_by_firstname_or_created_by_lastname_cont]', currentSearch)
            }

            const response = await axios.get(`https://${baseUrl}/communities.json?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setCommunities(response.data.communities)
            setPagination({
                current_page: response.data.pagination.current_page,
                total_count: response.data.pagination.total_count,
                total_pages: response.data.pagination.total_pages
            })
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch communities')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommunities(1, filters, searchTerm)
    }, [searchTerm])

    const handleApplyFilter = async (filterData: { status?: string; created_at?: string; created_by?: string }) => {
        const newFilters = {
            status: filterData.status || '',
            created_at: filterData.created_at || '',
            created_by: filterData.created_by || '',
        };
        setFilters(newFilters);
        fetchCommunities(1, newFilters, searchTerm);
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
        } else if (fromPage === 'edit-event' && broadcastId) {
            // Redirect back to edit event page
            navigate(`/pulse/events/edit/${broadcastId}`);
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

    const handleStatusChange = async (id: number, currentActive: boolean) => {
        const newActive = !currentActive;
        setIsToggling(id);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('community[active]', newActive ? 'true' : 'false');

            await axios.put(
                `https://${baseUrl}/communities/${id}.json`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setCommunities((prev: any[]) =>
                prev.map((item: any) =>
                    item.id === id ? { ...item, active: newActive } : item
                )
            );
            toast.success(`Community ${newActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update community status");
        } finally {
            setIsToggling(null);
        }
    };

    const handlePageChange = (page: number) => {
        fetchCommunities(page, filters, searchTerm);
    };

    const renderPaginationItems = () => {
        if (!pagination.total_pages || pagination.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = pagination.total_pages;
        const currentPage = pagination.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            items.push(
                <PaginationItem key={1} className='cursor-pointer'>
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 4) {
                items.push(
                    <PaginationItem key="ellipsis1" >
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    items.push(
                        <PaginationItem key={i} className='cursor-pointer'>
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage > 3 && currentPage < totalPages - 2) {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(
                        <PaginationItem key={i} className='cursor-pointer'>
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage < totalPages - 3) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
                    if (!items.find((item) => item.key === i.toString())) {
                        items.push(
                            <PaginationItem key={i} className='cursor-pointer'>
                                <PaginationLink
                                    onClick={() => handlePageChange(i)}
                                    isActive={currentPage === i}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                }
            }

            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages} className='cursor-pointer'>
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i} className='cursor-pointer'>
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

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
                        onChange={() => handleStatusChange(item.id, item.active)}
                        disabled={isToggling === item.id}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
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
            <h1 className="font-medium text-[16px] text-[rgba(26,26,26,0.5)] mb-4">Community</h1>
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
                                const broadcastId = searchParams.get('id');
                                if (fromPage === 'add-event') {
                                    navigate('/pulse/events/add');
                                } else if (fromPage === 'edit-event' && broadcastId) {
                                    navigate(`/pulse/events/edit/${broadcastId}`);
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
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                enableSearch={true}
                disableClientSearch={true}
                searchPlaceholder="Search communities..."
                storageKey="communities-table"
            />

            <div className="flex justify-center mt-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

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