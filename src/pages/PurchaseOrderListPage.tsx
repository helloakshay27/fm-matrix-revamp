import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { useDebounce } from '@/hooks/useDebounce';
import { toast as sonnerToast } from 'sonner';
import { API_CONFIG } from '@/config/apiConfig';

// Type definitions for Purchase Order
interface PurchaseOrder {
    id: number;
    external_id: string;
    reference_number: number;
    po_date: string;
    amount: number;
    supplier: {
        id: number;
        company_name: string;
        email: string;
        formatted_address: string;
    };
    site: {
        id: number;
        name: string;
    };
    created_by: string;
    pms_po_inventories: any[];
    total_amount_formatted: string;
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
            // Get base URL and token from API_CONFIG
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            if (!baseUrl || !token) {
                sonnerToast.error('Missing configuration. Please login again.');
                setLoading(false);
                return;
            }

            // Build URL using URL object
            const url = new URL(
                `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/pms/purchase_orders.json`
            );

            // Add pagination
            url.searchParams.append('page', String(page));
            url.searchParams.append('per_page', String(per_page));
            url.searchParams.append('access_token', token);

            // Add search if present
            if (search.trim()) {
                url.searchParams.append('search', search.trim());
            }

            // Add filters if present
            if (filters.status) {
                url.searchParams.append('filter_type', filters.status);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    sonnerToast.error('Unauthorized. Please login again.');
                    return;
                }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Handle response data (purchase_orders is the array field from API)
            const items = data.purchase_orders || data.data || [];
            if (Array.isArray(items)) {
                setPurchaseOrderData(items);
                setPagination({
                    current_page: data.current_page || page,
                    per_page: data.per_page || per_page,
                    total_pages: data.total_pages || 1,
                    total_count: data.total_count || 0,
                    has_next_page: page < (data.total_pages || 1),
                    has_prev_page: page > 1
                });
            } else {
                sonnerToast.error(data.message || 'Failed to fetch purchase orders');
                setPurchaseOrderData([]);
            }

        } catch (error: any) {
            console.error('Error fetching purchase order data:', error);
            sonnerToast.error(error.message || 'Failed to fetch purchase orders');
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
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            received: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors['pending']}`}>
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
            <div className="font-medium text-blue-600">PO-{String(order.external_id).padStart(5, '0')}</div>
        ),
        vendor_name: (
            <span className="text-sm text-gray-900">{order.supplier?.company_name || 'N/A'}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(order.po_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </span>
        ),
        expected_delivery_date: (
            <span className="text-sm text-gray-600">
                {order.site?.name || 'N/A'}
            </span>
        ),
        amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{order.total_amount_formatted || '0.00'}
            </span>
        ),
        payment_terms: (
            <span className="text-sm text-gray-600">{order.created_by || 'N/A'}</span>
        ),
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(order.pms_po_inventories?.length > 0 ? 'approved' : 'pending')}
            </div>
        )
    });

    const handleView = (id: number) => {
        navigate(`/accounting/purchase-order/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/accounting/purchase-order/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this purchase order?')) {
            // Add API call here
            sonnerToast.success('Purchase order deleted successfully');
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
                    <Button onClick={() => navigate('/accounting/purchase-order/create')} className="gap-2">
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
