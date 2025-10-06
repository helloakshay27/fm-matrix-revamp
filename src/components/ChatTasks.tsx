import { useEffect, useState } from 'react';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';
import { fetchIndividualChatTasks } from '@/store/slices/channelSlice';
import { useLocation, useParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        responsibleId: item.responsible_person.id,
        duration: item.duration,
        endDate: item.target_date,
    }));
}

const ChatTasks = () => {
    const { id } = useParams();
    const path = useLocation().pathname;
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([])
    const [activeTab, setActiveTab] = useState('all');
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    })

    const isGroupChat = path.includes('/groups');

    const getChatTasks = async (filteredParams = {}, tab = 'all') => {
        const param = path.includes('messages') ? 'conversation_id_eq' : 'project_space_id_eq';
        setLoading(true);
        try {
            const response = await dispatch(fetchIndividualChatTasks({
                baseUrl,
                token,
                id,
                param,
                ...filteredParams
            })).unwrap();

            const formattedTasks = formattedData(response.task_managements);

            if (isGroupChat && tab === 'my') {
                const myTasks = formattedTasks.filter(task => task.responsibleId?.toString() === currentUserId?.toString());
                setTasks(myTasks);
                setPagination({
                    current_page: 1,
                    total_count: myTasks.length,
                    total_pages: Math.ceil(myTasks.length / 10),
                });
            } else {
                setTasks(formattedTasks);
                setPagination({
                    current_page: response.current_page,
                    total_count: response.total_count,
                    total_pages: response.total_pages,
                });
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getChatTasks({ page: 1 }, activeTab)
    }, [activeTab])

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

    const handlePageChange = async (page) => {
        if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
            return;
        }

        try {
            setPagination((prev) => ({ ...prev, current_page: page }));
            await getChatTasks({
                page,
            }, activeTab);
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

    const renderTaskTable = () => (
        <>
            <EnhancedTable
                data={tasks}
                columns={columns}
                renderCell={renderCell}
                storageKey="chat-tasks-table"
                emptyMessage="No tasks available"
                pagination={true}
                pageSize={10}
                hideTableSearch={true}
                hideColumnsButton={true}
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
        </>
    );

    if (!isGroupChat) {
        return <div>{renderTaskTable()}</div>;
    }

    return (
        <div className='p-6'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger value="all" className="w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">All Tasks</TabsTrigger>
                    <TabsTrigger value="my" className="w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">My Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {renderTaskTable()}
                </TabsContent>

                <TabsContent value="my">
                    {renderTaskTable()}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ChatTasks;