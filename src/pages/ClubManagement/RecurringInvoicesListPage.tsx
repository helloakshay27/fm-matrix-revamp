import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for Sales Order
interface SalesOrder {
    id: number;
    order_number: string;
    customer_name: string;
    date: string;
    expected_shipment_date: string;
    amount: number;
    status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'closed';
    payment_terms: string;
    reference_number: string;
    salesperson: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    data: SalesOrder[];
    pagination: {
        current_page: number;
        per_page: number;
        total_pages: number;
        total_count: number;
        has_next_page: boolean;
        has_prev_page: boolean;
    };
}

interface SalesOrderFilters {
    status?: string;
    customerId?: number;
    dateFrom?: string;
    dateTo?: string;
}

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
    {
        key: 'actions',
        label: 'Action',
        sortable: false,
        hideable: false,
        draggable: false
    },
    {
        key: 'order_number',
        label: 'Order Number',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'customer_name',
        label: 'Customer Name',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'date',
        label: 'Order Date',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'expected_shipment_date',
        label: 'Expected Shipment',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'amount',
        label: 'Amount',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'payment_terms',
        label: 'Payment Terms',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'salesperson',
        label: 'Salesperson',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        hideable: true,
        draggable: true
    }
]; 

export const RecurringInvoicesListPage: React.FC = () => { const navigate = useNavigate(); const [currentPage, setCurrentPage] = useState(1); const [perPage, setPerPage] = useState(10); const [searchTerm, setSearchTerm] = useState(''); const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<SalesOrderFilters>({});
    const [salesOrderData, setSalesOrderData] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Fetch sales order data from API
    const fetchSalesOrderData = async (page = 1, per_page = 10, search = '', filters: SalesOrderFilters = {}) => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockData: SalesOrder[] = [
                {
                    id: 1,
                    order_number: 'SO-00004',
                    customer_name: 'Lockated',
                    date: '2026-02-11',
                    expected_shipment_date: '2026-02-25',
                    amount: 2845.00,
                    status: 'confirmed',
                    payment_terms: 'Due on Receipt',
                    reference_number: '12',
                    salesperson: 'SalesJay',
                    active: true,
                    created_at: '2026-02-11',
                    updated_at: '2026-02-11'
                },
                {
                    id: 2,
                    order_number: 'SO-00003',
                    customer_name: 'Lockated',
                    date: '2026-02-11',
                    expected_shipment_date: '2026-02-18',
                    amount: 2987.50,
                    status: 'draft',
                    payment_terms: 'Net 30',
                    reference_number: '',
                    salesperson: 'SalesJay',
                    active: true,
                    created_at: '2026-02-11',
                    updated_at: '2026-02-11'
                },
                {
                    id: 3,
                    order_number: 'SO-00002',
                    customer_name: 'Lockated',
                    date: '2026-01-13',
                    expected_shipment_date: '2026-01-28',
                    amount: 12100.00,
                    status: 'closed',
                    payment_terms: 'Net 45',
                    reference_number: 'TEST',
                    salesperson: 'SalesJay',
                    active: true,
                    created_at: '2026-01-13',
                    updated_at: '2026-01-28'
                },
                {
                    id: 4,
                    order_number: 'SO-00001',
                    customer_name: 'Lockated',
                    date: '2026-01-12',
                    expected_shipment_date: '2026-01-28',
                    amount: 1389.90,
                    status: 'closed',
                    payment_terms: 'Due on Receipt',
                    reference_number: '11',
                    salesperson: 'SalesJay',
                    active: true,
                    created_at: '2026-01-12',
                    updated_at: '2026-01-28'
                }
            ];

            // Filter based on search
            let filteredData = mockData;
            if (search.trim()) {
                filteredData = mockData.filter(order =>
                    order.order_number.toLowerCase().includes(search.toLowerCase()) ||
                    order.customer_name.toLowerCase().includes(search.toLowerCase())
                );
            }

            // Apply filters
            if (filters.status) {
                filteredData = filteredData.filter(order => order.status === filters.status);
            }

            const totalCount = filteredData.length;
            const totalPages = Math.ceil(totalCount / per_page);
            const startIndex = (page - 1) * per_page;
            const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

            setSalesOrderData(paginatedData);
            setPagination({
                current_page: page,
                per_page: per_page,
                total_pages: totalPages,
                total_count: totalCount,
                has_next_page: page < totalPages,
                has_prev_page: page > 1
            });

        } catch (error: unknown) {
            console.error('Error fetching sales order data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to load sales order data: ${errorMessage}`, {
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and when page/perPage/filters change
    useEffect(() => {
        fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

    // Handle search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) {
            fetchSalesOrderData(1, perPage, '', appliedFilters);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle per page change
    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    // Helper function to get status badge
    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            draft: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const totalRecords = pagination.total_count;
    const totalPages = pagination.total_pages;
    const displayedData = salesOrderData;

    // Render row function for enhanced table
    const renderRow = (order: SalesOrder) => ({
        actions: (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleView(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleEdit(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleDelete(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
        order_number: (
            <div className="font-medium text-blue-600">{order.order_number}</div>
        ),
        customer_name: (
            <span className="text-sm text-gray-900">{order.customer_name}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(order.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </span>
        ),
        expected_shipment_date: (
            <span className="text-sm text-gray-600">
                {new Date(order.expected_shipment_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </span>
        ),
        amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        payment_terms: (
            <span className="text-sm text-gray-600">{order.payment_terms}</span>
        ),
        salesperson: (
            <span className="text-sm text-gray-600">{order.salesperson}</span>
        ),
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(order.status)}
            </div>
        )
    });

    const handleView = (id: number) => {
        navigate(`/accounting/sales-order/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/accounting/sales-order/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this sales order?')) {
            toast.success('Sales order deleted successfully!', {
                duration: 3000,
            });
            fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Sales Order List</h1>
            </header>

            <EnhancedTaskTable
                data={displayedData}
                columns={columns}
                renderRow={renderRow}
                storageKey="sales-order-dashboard-v1"
                hideTableExport={true}
                hideTableSearch={false}
                enableSearch={true}
                isLoading={loading}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <Button
                        className='bg-primary text-primary-foreground hover:bg-primary/90'
                        onClick={() => navigate('/accounting/recurring-invoices/create')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                )}
            />

            {totalRecords > 0 && (
                <TicketPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    perPage={perPage}
                    isLoading={loading}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            )}
        </div>
    );
};
