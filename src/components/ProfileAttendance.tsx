import { useEffect, useState } from 'react'
import { EnhancedTable } from './enhanced-table/EnhancedTable'
import { ColumnConfig } from '@/hooks/useEnhancedTable'
import axios from 'axios'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';

const attendanceColumns: ColumnConfig[] = [
    {
        key: "date",
        label: "Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "day",
        label: "Day",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "punched_in_time",
        label: "Punched In Time",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "punched_out_time",
        label: "Punched Out Time",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "duration",
        label: "Duration",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProfileAttendance = () => {
    const baseUrl = localStorage.getItem('baseUrl') || ''
    const token = localStorage.getItem('token') || ''
    const id = JSON.parse(localStorage.getItem('user')).id || ''

    const [attendanceData, setAttendanceData] = useState([])
    const [attendanceLoading, setAttendanceLoading] = useState(false)
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    })

    const fetchAttendance = async (page = 1) => {
        try {
            setAttendanceLoading(true);
            const response = await axios.get(`https://${baseUrl}/pms/attendances/${id}.json?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setAttendanceData(response.data.attendances || []);
            setPaginationData({
                current_page: response.data.pagination.current_page || 1,
                total_count: response.data.pagination.total_count || 0,
                total_pages: response.data.pagination.total_pages || 1,
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch attendance data');
            setAttendanceData([]);
        } finally {
            setAttendanceLoading(false);
        }
    };

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchAttendance(1);
        }
    }, [id, baseUrl, token])

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            default:
                return item[columnKey] || '-';
        }
    };

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > paginationData.total_pages || page === paginationData.current_page || attendanceLoading) {
            return;
        }

        try {
            await fetchAttendance(page);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Failed to load page data. Please try again.');
        }
    };

    const renderPaginationItems = () => {
        if (!paginationData.total_pages || paginationData.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = paginationData.total_pages;
        const currentPage = paginationData.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            items.push(
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                        aria-disabled={attendanceLoading}
                        className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                                aria-disabled={attendanceLoading}
                                className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                                aria-disabled={attendanceLoading}
                                className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                                    aria-disabled={attendanceLoading}
                                    className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                            aria-disabled={attendanceLoading}
                            className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                            aria-disabled={attendanceLoading}
                            className={attendanceLoading ? 'pointer-events-none opacity-50' : ''}
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
                data={attendanceData}
                columns={attendanceColumns}
                renderCell={renderCell}
                hideTableSearch={true}
                hideColumnsButton={true}
                loading={attendanceLoading}
            />

            {paginationData.total_pages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, paginationData.current_page - 1))}
                                    className={paginationData.current_page === 1 || attendanceLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(paginationData.total_pages, paginationData.current_page + 1))}
                                    className={paginationData.current_page === paginationData.total_pages || attendanceLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default ProfileAttendance