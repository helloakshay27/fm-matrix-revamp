import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { Button } from "./ui/button"
import { Edit, Eye, Plus } from "lucide-react"
import { Switch } from "./ui/switch"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import SosFilterModal, { SosFilterParams } from "./SosFilterModal"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"

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

interface InternalSosDirectoryProps {
    internalSos: any[];
    handleStatusChange: (id: number, status: boolean) => void;
    pagination: {
        current_page: number;
        total_count: number;
        total_pages: number;
    };
    onPageChange: (page: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFilterApply: (filters: SosFilterParams) => void;
    loading: boolean;
}

const InternalSosDirectory = ({
    internalSos,
    handleStatusChange,
    pagination,
    onPageChange,
    searchQuery,
    onSearchChange,
    onFilterApply,
    loading
}: InternalSosDirectoryProps) => {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<SosFilterParams>({});

    const handleFilterApply = (newFilters: SosFilterParams) => {
        setFilters(newFilters);
        onFilterApply(newFilters);
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "image":
                return <img src={item.sos_directory_lite_url} alt="" className="h-14 w-14 object-fit" />
            case "title":
                return <div className="w-60">{item.title}</div>;
            case "category":
                return <div className="w-60">{item.sos_category_name}</div>;
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
                onClick={() => navigate(`/pulse/sos-directory/${item.id}/edit?type=internal`)}
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
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => onPageChange(1)}
                        isActive={currentPage === 1}
                        aria-disabled={loading}
                        className={loading ? "pointer-events-none opacity-50" : ""}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 4) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => onPageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={loading}
                                className={loading ? "pointer-events-none opacity-50" : ""}
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
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => onPageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={loading}
                                className={loading ? "pointer-events-none opacity-50" : ""}
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
                            <PaginationItem key={i} className="cursor-pointer">
                                <PaginationLink
                                    onClick={() => onPageChange(i)}
                                    isActive={currentPage === i}
                                    aria-disabled={loading}
                                    className={loading ? "pointer-events-none opacity-50" : ""}
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
                    <PaginationItem key={totalPages} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => onPageChange(totalPages)}
                            isActive={currentPage === totalPages}
                            aria-disabled={loading}
                            className={loading ? "pointer-events-none opacity-50" : ""}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => onPageChange(i)}
                            isActive={currentPage === i}
                            aria-disabled={loading}
                            className={loading ? "pointer-events-none opacity-50" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <div>
            <EnhancedTable
                data={internalSos}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                onFilterClick={() => setIsFilterOpen(true)}
                searchTerm={searchQuery}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search by title..."
                enableSearch={true}
                loading={loading}
            />

            {pagination.total_pages > 0 && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange(Math.max(1, pagination.current_page - 1))}
                                    className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                    className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <SosFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleFilterApply}
                currentFilters={filters}
            />
        </div>
    )
}

export default InternalSosDirectory