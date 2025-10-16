import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { fetchDeletedPRs } from "@/store/slices/pendingApprovalSlice";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

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
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    });

    const getDeletedPRs = async (page = 1) => {
        try {
            const response = await dispatch(fetchDeletedPRs({ baseUrl, token, page })).unwrap()
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
            setPagination({
                current_page: response.pagination?.current_page,
                total_count: response.pagination?.total_count,
                total_pages: response.pagination?.total_pages,
            })
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

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
            return;
        }

        try {
            setPagination((prev) => ({ ...prev, current_page: page }));
            await getDeletedPRs(page)
        } catch (error) {
            console.error("Error changing page:", error);
            toast.error("Failed to load page data. Please try again.");
        }
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
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
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
                                onClick={() => handlePageChange(i)}
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
                                onClick={() => handlePageChange(i)}
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
                                    onClick={() => handlePageChange(i)}
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
                            onClick={() => handlePageChange(totalPages)}
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
                            onClick={() => handlePageChange(i)}
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

            <div className="flex justify-center mt-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}