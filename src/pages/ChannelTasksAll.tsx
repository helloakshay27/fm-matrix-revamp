import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { createChatTask, fetchIndividualChatTasks } from "@/store/slices/channelSlice";
import { Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import CreateChatTask from "@/components/CreateChatTask";

const columns = [
    {
        key: 'title',
        label: 'Task Title',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'responsible',
        label: 'Responsible Person',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'duration',
        label: 'Duration',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'endDate',
        label: 'End Date',
        sortable: true,
        defaultVisible: true,
    },
];

const formattedData = (data) => {
    return data.map((item) => ({
        id: item.id,
        title: item.title,
        responsible: item.responsible_person.name,
        duration: item.duration,
        endDate: item.target_date,
    }));
}

const ChannelTasksAll = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [tasks, setTasks] = useState([])
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    });

    const getChatTasks = async (filterParams = {}) => {
        setLoading(true);
        try {
            const response = await dispatch(fetchIndividualChatTasks({ baseUrl, token, ...filterParams })).unwrap();
            setTasks(formattedData(response))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getChatTasks();
    }, [])

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'title':
                return <div className="font-normal text-black max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{item[columnKey]}</div>;
            case 'responsible':
            case 'endDate':
                return <span className="text-gray-600">{item[columnKey]}</span>;
            case 'duration':
                return (
                    <div className="inline-block px-4 py-2 rounded-sm">
                        {item[columnKey] ? `${item[columnKey]} hours` : '-'}
                    </div>
                );
            default:
                return item[columnKey];
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/channels/tasks/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setModalOpen(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Create
            </Button>
        </>
    );

    const handleCreateTask = async (payload) => {
        try {
            await dispatch(createChatTask({ baseUrl, token, data: payload })).unwrap();
            toast.success("Task created successfully");
            setModalOpen(false);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
            return;
        }

        try {
            setPagination((prev) => ({ ...prev, current_page: page }));
            await getChatTasks({
                page,
            });
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
            <EnhancedTable
                data={tasks}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                storageKey="chat-tasks-table"
                emptyMessage="No tasks available"
                pagination={true}
                pageSize={10}
                leftActions={leftActions}
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

            <CreateChatTask
                openTaskModal={modalOpen}
                setOpenTaskModal={setModalOpen}
                onCreateTask={handleCreateTask}
                fetchTasks={getChatTasks}
            />
        </div>
    )
}

export default ChannelTasksAll