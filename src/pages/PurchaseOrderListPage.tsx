import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { useDebounce } from '@/hooks/useDebounce';
import { toast as sonnerToast } from 'sonner';

// Type definitions for Purchase Order
interface PurchaseOrder {
    id: number;
    order_number: string;
    vendor_name: string;
    date: string;
    expected_delivery_date: string;
    amount: number;
    status: 'draft' | 'confirmed' | 'received' | 'completed' | 'cancelled' | 'closed';
    payment_terms: string;
    reference_number: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface PurchaseOrderFilters {
    status?: string;
    vendorId?: number;
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
        key: 'vendor_name',
        label: 'Vendor Name',
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
        key: 'expected_delivery_date',
        label: 'Expected Delivery',
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
        key: 'status',
        label: 'Status',
        sortable: true,
        hideable: true,
        draggable: true
    }
];

export const PurchaseOrderListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<PurchaseOrderFilters>({});
    const [purchaseOrderData, setPurchaseOrderData] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Fetch purchase order data from API
    const fetchPurchaseOrderData = async (page = 1, per_page = 10, search = '', filters: PurchaseOrderFilters = {}) => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockData: PurchaseOrder[] = [
                {
                    id: 1,
                    order_number: 'PO-00002',
                    vendor_name: 'Gophygital',
                    date: '2026-02-11',
                    expected_delivery_date: '2026-02-25',
                    amount: 250.00,
                    status: 'confirmed',
                    payment_terms: 'Due on Receipt',
                    reference_number: 'PO-0002',
                    active: true,
                    created_at: '2026-02-11',
                    updated_at: '2026-02-11'
                },
                {
                    id: 2,
                    order_number: 'PO-00001',
                    vendor_name: 'Gophygital',
                    date: '2025-12-11',
                    expected_delivery_date: '2025-12-25',
                    amount: 219.69,
                    status: 'closed',
                    payment_terms: 'Net 30',
                    reference_number: 'PO-00001',
                    active: true,
                    created_at: '2025-12-11',
                    updated_at: '2025-12-25'
                }
            ];

            // Filter based on search
            let filteredData = mockData;
            if (search.trim()) {
                filteredData = filteredData.filter(order =>
                    order.order_number.toLowerCase().includes(search.toLowerCase()) ||
                    order.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
                    order.reference_number.toLowerCase().includes(search.toLowerCase())
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

            setPurchaseOrderData(paginatedData);
            setPagination({
                current_page: page,
                per_page,
                total_pages: totalPages,
                total_count: totalCount,
                has_next_page: page < totalPages,
                has_prev_page: page > 1
            });

        } catch (error: unknown) {
            console.error('Error fetching purchase order data:', error);
            setPurchaseOrderData([]);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and when page/perPage/filters change
    useEffect(() => {
        fetchPurchaseOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

    // Handle search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) {
            fetchPurchaseOrderData(1, perPage, '', appliedFilters);
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
            received: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors['draft']}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const totalRecords = pagination.total_count;
    const totalPages = pagination.total_pages;
    const displayedData = purchaseOrderData;

    // Render row function for enhanced table
    const renderRow = (order: PurchaseOrder) => ({
        actions: (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(order.id)}
                    className="h-8 w-8"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(order.id)}
                    className="h-8 w-8"
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(order.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
        order_number: (
            <div className="font-medium text-blue-600">{order.order_number}</div>
        ),
        vendor_name: (
            <span className="text-sm text-gray-900">{order.vendor_name}</span>
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
        expected_delivery_date: (
            <span className="text-sm text-gray-600">
                {new Date(order.expected_delivery_date).toLocaleDateString('en-GB', {
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
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(order.status)}
            </div>
        )
    });

    const handleView = (id: number) => {
        navigate(`/settings/purchase-order/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/settings/purchase-order/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this purchase order?')) {
            // Add API call here
            fetchPurchaseOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Purchase Orders</h1>
            </div>

            <EnhancedTaskTable
                data={displayedData}
                columns={columns}
                renderRow={renderRow}
                storageKey="purchase-order-dashboard-v1"
                hideTableExport={true}
                hideTableSearch={false}
                enableSearch={true}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <Button onClick={() => navigate('/settings/purchase-order/create')} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New
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
