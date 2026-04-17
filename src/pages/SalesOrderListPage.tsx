import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import axios from 'axios';

// Type definitions for Sales Order
interface SalesOrder {
    id: number;
    sale_order_number: string;
    customer_name: string;
    date: string;
    shipment_date: string;
    total_amount: number;
    status: string;
    payment_term: string | null;
    delivery_method: string | null;
    reference_number: string;
    sales_person_name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    fulfilled: boolean;
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
        key: 'sale_order_number',
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
        key: 'shipment_date',
        label: 'Expected Shipment',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'total_amount',
        label: 'Amount',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'payment_term',
        label: 'Payment Term',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'delivery_method',
        label: 'Delivery Method',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'sales_person_name',
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

export const SalesOrderListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<SalesOrderFilters>({});
    const [salesOrderData, setSalesOrderData] = useState<SalesOrder[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [hasSaleOrderApproval, setHasSaleOrderApproval] = useState(false);
    const [errorModal, setErrorModal] = useState<{ show: boolean; errors: { id: string; message: string }[] }>({ show: false, errors: [] });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    const lock_account_id = localStorage.getItem("lock_account_id");


    

    // Fetch sales order data from API
    const fetchSalesOrderData = async (page = 1, per_page = 10, search = '', filters: SalesOrderFilters = {}) => {
        setLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                lock_account_id: lock_account_id,
                // page: String(page),
                // per_page: String(per_page),
            });
            if (search) params.append('q[sale_order_number_or_customer_name_cont]', search);
            if (filters.status) params.append('q[status_eq]', filters.status);
            if (filters.customerId) params.append('q[lock_account_customer_id_eq]', String(filters.customerId));
            if (filters.dateFrom) params.append('q[date_gteq]', filters.dateFrom);
            if (filters.dateTo) params.append('q[date_lteq]', filters.dateTo);

            const response = await fetch(`https://${baseUrl}/sale_orders.json?${params.toString()}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('API Response:', data);
            // Assume API returns { data: SalesOrder[], pagination: {...} }
            setSalesOrderData(Array.isArray(data) ? data: []);
            setPagination(data.pagination || {
                current_page: page,
                per_page: per_page,
                total_pages: 1,
                total_count: 0,
                has_next_page: false,
                has_prev_page: false
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

    // Fetch lock account to check if sale_order approval is enabled
    useEffect(() => {
        const fetchLockAccount = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://${baseUrl}/get_lock_account.json`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('get_lock_account response:', data);
                const saleOrderApproval = Array.isArray(data?.approvals) &&
                    data.approvals.some((a: any) => a.approval_type === 'sale_order' && a.active);
                setHasSaleOrderApproval(saleOrderApproval);
            } catch (error) {
                console.error('Error fetching lock account:', error);
            }
        };
        fetchLockAccount();
    }, []);

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
console.log('Sales Order Data:', salesOrderData);
    // Render row function for enhanced table
    const renderRow = (order: SalesOrder) => ({
        actions: (
            <div className="flex items-center gap-2">
                {/* {order.status !== 'confirmed' && ( */}
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(order.id)}
                        onChange={e => {
                            setSelectedRows(prev =>
                                e.target.checked
                                    ? [...prev, order.id]
                                    : prev.filter(id => id !== order.id)
                            );
                        }}
                        title="Select for status update"
                    />
                {/* )} */}
                <button
                    onClick={() => handleView(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                {/* <button
                    onClick={() => handleEdit(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button> */}
                {/* <button
                    onClick={() => handleDelete(order.id)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button> */}
            </div>
        ),
        sale_order_number: (
            <div className="font-medium text-blue-600">{order.sale_order_number}</div>
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
        shipment_date: (
            <span className="text-sm text-gray-600">
                {order.shipment_date ? new Date(order.shipment_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) : ''}
            </span>
        ),
        total_amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        payment_term: (
            <span className="text-sm text-gray-600">{order.payment_term || '-'}</span>
        ),
        delivery_method: (
            <span className="text-sm text-gray-600">{order.delivery_method || '-'}</span>
        ),
        sales_person_name: (
            <span className="text-sm text-gray-600">{order.sales_person_name}</span>
        ),
        status: (
            <div className="flex items-center justify-center gap-2">
                {getStatusBadge(order.status)}
                {order.fulfilled && (
                    <span title="Fulfilled">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </span>
                )}
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

    const handleUpdateStatus = async (status: string, successMsg: string, failMsg: string) => {
        if (selectedRows.length === 0) {
            toast.error('Select at least one sales order');
            return;
        }

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `https://${baseUrl}/sale_orders/update_status.json`,
                { sale_order_ids: selectedRows, status },
                { headers: { Authorization: token ? `Bearer ${token}` : undefined }, validateStatus: () => true }
            );

            if (response.status === 422) {
                const { message, errors } = response.data;
                if (Array.isArray(errors) && errors.length > 0) {
                    setErrorModal({ show: true, errors });
                } else {
                    setErrorModal({ show: true, errors: [{ id: '-', message: message || failMsg }] });
                }
                return;
            }

            toast.success(successMsg);
            setSelectedRows([]);
            fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error) {
            console.error(error);
            toast.error(failMsg);
        }
    };

    const handleMarkAsConfirmed = () => handleUpdateStatus('confirmed', 'Sales orders marked as confirmed', 'Failed to mark sales orders as confirmed');

    const handleSubmitForApproval = () => handleUpdateStatus('pending_approval', 'Sales orders submitted for approval', 'Failed to submit sales orders for approval');

    const handleMarkAsFulfilled = async () => {
        if (selectedRows.length === 0) { toast.error('Select at least one sales order'); return; }
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `https://${baseUrl}/sale_orders/update_status.json`,
                { sale_order_ids: selectedRows, fulfilled: true },
                { headers: { Authorization: token ? `Bearer ${token}` : undefined }, validateStatus: () => true }
            );
            if (response.status >= 400) {
                const { message, errors } = response.data;
                if (Array.isArray(errors) && errors.length > 0) { setErrorModal({ show: true, errors }); }
                else { setErrorModal({ show: true, errors: [{ id: '-', message: message || 'Failed to mark as fulfilled' }] }); }
                return;
            }
            toast.success('Sales orders marked as fulfilled');
            setSelectedRows([]);
            fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error) {
            toast.error('Failed to mark as fulfilled');
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
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <div className="flex items-center gap-2">
                        <Button
                            className='bg-primary text-primary-foreground hover:bg-primary/90'
                            onClick={() => navigate('/accounting/sales-order/create')}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                        {selectedRows.length > 0 && (
                            <>
                                {hasSaleOrderApproval ? (
                                    <Button
                                        className="bg-[#C72030] text-white hover:bg-[#a81a28]"
                                        onClick={handleSubmitForApproval}
                                    >
                                        Submit for Approval
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        onClick={handleMarkAsConfirmed}
                                    >
                                        Mark as Confirmed
                                    </Button>
                                )}
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleMarkAsFulfilled}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Fulfilled
                                </Button>
                            </>
                        )}
                    </div>
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

            {/* Bulk Update Error Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h2 className="text-base font-semibold text-gray-800">Bulk Update Error Summary</h2>
                            <button
                                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                onClick={() => setErrorModal({ show: false, errors: [] })}
                            >
                                ×
                            </button>
                        </div>
                        <div className="px-5 py-4 max-h-80 overflow-y-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">SALE ORDER</th>
                                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">ERROR DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {errorModal.errors.map((err, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 border border-gray-200 text-gray-800 font-medium">{err.id}</td>
                                            <td className="px-3 py-2 border border-gray-200 text-black-600">{err.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 border-t flex justify-end">
                            <Button
                                className="bg-[#C72030] text-white hover:bg-[#a81a28] px-6"
                                onClick={() => setErrorModal({ show: false, errors: [] })}
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
