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
import axios from "axios";
// Type definitions for Sales Order
interface SalesOrder {
    id: number;
    sale_order_number: string;
    customer_name: string;
    guest_name?: string;
    member_name?: string;
    staff_name?: string;
    date: string;
    shipment_date: string;
    total_amount: number;
    status: string;
    payment_term: string | null;
    reference_number: string;
    sales_person_name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    fulfilled: boolean;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
        key: 'date',
        label: 'Date',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'invoice_number',
        label: 'Invoice Number',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'order_number',
        label: 'Order Number',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'guest_name',
        label: 'Guest',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'member_name',
        label: 'Member',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'staff_name',
        label: 'Staff',
        sortable: true,
        hideable: true,
        draggable: true
    },

    {
        key: 'due_date',
        label: 'Due Date',
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
    // {
    //     key: 'payment_term',
    //     label: 'Payment Term',
    //     sortable: true,
    //     hideable: true,
    //     draggable: true
    // },
    {
        key: 'balance_due',
        label: 'Balance Due',
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
    },
    // {
    //     key: 'active',
    //     label: 'Active/Inactive',
    //     sortable: false,
    //     hideable: true,
    //     draggable: false
    // }
];

export const InvoiceClubManagementDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<SalesOrderFilters>({});
    const [salesOrderData, setSalesOrderData] = useState<SalesOrder[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [hasInvoiceApproval, setHasInvoiceApproval] = useState(false);
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);




    // Maps a raw bill_booking record (shape unconfirmed) to the SalesOrder shape this table renders
    const mapBillBookingToSalesOrder = (bb: any): SalesOrder => {
        const user = bb.user || {};
        // Prefer explicit is_staff/is_member/is_guest boolean flags (on the record or the nested user
        // object) when present; fall back to a user_type string if that's what the API returns instead.
        const isStaff = bb.is_staff ?? user.is_staff ?? (user.user_type === 'fm' || user.user_type === 'staff');
        const isMember = bb.is_member ?? user.is_member ?? (user.user_type === 'occupant' || user.user_type === 'member');
        const isGuest = bb.is_guest ?? user.is_guest ?? (user.user_type === 'guest');
        return {
            id: bb.id,
            sale_order_number: bb.order_number || bb.sale_order_number || '',
            customer_name: bb.customer_name || user.name || '',
            guest_name: bb.guest_name || (isGuest ? user.name : undefined),
            member_name: bb.member_name || (isMember ? user.name : undefined),
            staff_name: bb.staff_name || (isStaff ? user.name : undefined),
            date: bb.bill_date || bb.date || '',
            shipment_date: bb.shipment_date || '',
            total_amount: Number(bb.total_amount ?? bb.amount ?? 0),
            status: bb.status || '',
            payment_term: bb.payment_term || null,
            reference_number: bb.order_number || bb.reference_number || '',
            sales_person_name: bb.sales_person_name || '',
            active: bb.active !== undefined ? bb.active : true,
            created_at: bb.created_at || '',
            updated_at: bb.updated_at || '',
            fulfilled: !!bb.fulfilled,
            // Extra fields used directly by renderRow, not part of the base SalesOrder shape
            ...({
                invoice_number: bb.invoice_number || bb.bill_number || bb.number || '',
                order_number: bb.order_number || '',
                due_date: bb.due_date || '',
                balance_due: Number(bb.balance_due ?? bb.due_amount ?? bb.total_amount ?? 0),
            } as any),
        };
    };

    // Fetch sales order data from API
    const fetchSalesOrderData = async (page = 1, per_page = 10, search = '', filters: SalesOrderFilters = {}) => {
        setLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            // Confirmed: GET /bill_bookings.json?search=...&status=...&from_date=...&to_date=...
            const params = new URLSearchParams({
                page: String(page),
                per_page: String(per_page),
            });
            if (search) params.append('search', search);
            if (filters.status) params.append('status', filters.status);
            if (filters.dateFrom) params.append('from_date', filters.dateFrom);
            if (filters.dateTo) params.append('to_date', filters.dateTo);

            const response = await fetch(`https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings.json?${params.toString()}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('API Response:', data);
            // NOTE: response shape for this endpoint is unconfirmed — best-effort parsing across common shapes.
            const list = data?.bill_bookings || data?.data || (Array.isArray(data) ? data : []);
            setSalesOrderData(list.map(mapBillBookingToSalesOrder));
            setPagination({
                current_page: data?.pagination?.current_page ?? data?.current_page ?? page,
                per_page: data?.pagination?.per_page ?? data?.per_page ?? per_page,
                total_pages: data?.pagination?.total_pages ?? data?.total_pages ?? 1,
                total_count: data?.pagination?.total_count ?? data?.total_count ?? list.length,
                has_next_page: data?.pagination?.has_next_page ?? false,
                has_prev_page: data?.pagination?.has_prev_page ?? false,
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

    // Fetch lock account to check if invoice approval is enabled
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
                const invoiceApproval = Array.isArray(data?.approvals) &&
                    data.approvals.some((a: any) => a.approval_type === 'invoice' && a.active);
                setHasInvoiceApproval(invoiceApproval);
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
        if (!status) return <span className="text-sm text-gray-900">-</span>;
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {status.replace(/_/g, " ").toUpperCase()}
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
                {/* {order.status !== "sent" && ( */}
                {/* <input
                    type="checkbox"
                    checked={selectedRows.includes(order.id)}
                    onChange={(e) => {
                        setSelectedRows((prev) =>
                            e.target.checked
                                ? [...prev, order.id]
                                : prev.filter((id) => id !== order.id)
                        );
                    }}
                    className="cursor-pointer"
                /> */}
                {/* )} */}
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
                    onClick={() => {
                        setSelectedDeleteId(order.id);
                        setDeleteDialogOpen(true);
                    }}
                    className="p-1 text-black-600 hover:text-red-700 hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
        invoice_number: (
            <div className="font-medium text-brand">{order.invoice_number || '-'}</div>
        ),
        order_number: (
            <div className="font-medium text-brand">{order.order_number || '-'}</div>
        ),
        guest_name: (
            <span className="text-sm text-gray-900">{order.guest_name || '-'}</span>
        ),
        member_name: (
            <span className="text-sm text-gray-900">{order.member_name || '-'}</span>
        ),
        staff_name: (
            <span className="text-sm text-gray-900">{order.staff_name || '-'}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {order.date
                    ? new Date(order.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                    : '-'}
            </span>
        ),

        due_date: (
            <span className="text-sm text-gray-600">
                {order.due_date
                    ? new Date(order.due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : "-"}
            </span>
        ),

        total_amount: (
            <span className="text-sm font-medium text-gray-900">
                {order.total_amount != null
                    ? `₹${order.total_amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                    : "-"}
            </span>
        ),

        balance_due: (
            <span className="text-sm font-medium text-red-600">
                {order.balance_due != null
                    ? `₹${order.balance_due.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                    : "-"}
            </span>
        ),
        // shipment_date: (
        //     <span className="text-sm text-gray-600">
        //         {order.shipment_date ? new Date(order.shipment_date).toLocaleDateString('en-GB', {
        //             day: '2-digit',
        //             month: '2-digit',
        //             year: 'numeric'
        //         }) : ''}
        //     </span>
        // ),
        // total_amount: (
        //     <span className="text-sm font-medium text-gray-900">
        //         ₹{order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        //     </span>
        // ),
        // payment_term: (
        //     <span className="text-sm text-gray-600">{order.payment_term || '-'}</span>
        // ),
        // sales_person_name: (
        //     <span className="text-sm text-gray-600">{order.sales_person_name}</span>
        // ),
        status: (
            <div className="flex items-center justify-center gap-2">
                {getStatusBadge(order.status)}
            </div>
        ),
        active: (() => {
            const isActive = !!order.active;
            return (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(order)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-brand" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                  </span>
                </div>
            );
        })()
    });

    const handleView = (id: number) => {
        navigate(`/club-management/invoice/details/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/club-management/invoice/edit/${id}`);
    };

    const handleDelete = async () => {
        if (!selectedDeleteId) return;
        setDeleteLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            await axios.delete(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${selectedDeleteId}.json`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    }
                }
            );
            toast.success('Invoice deleted successfully!', { duration: 3000 });
            setDeleteDialogOpen(false);
            setSelectedDeleteId(null);
            fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete invoice");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleStatus = async (order: SalesOrder) => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const url = `https://${baseUrl}/lock_account_invoices/${order.id}/toggle_active.json`;

            const response = await axios.patch(
                url,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            toast.success(response?.data?.message || "Status updated successfully");
            fetchSalesOrderData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("Failed to update status");
        }
    };

    const handleUpdateStatus = async (status: string, successMsg: string, failMsg: string) => {
        if (selectedRows.length === 0) {
            toast.error('Select at least one invoice');
            return;
        }

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `https://${baseUrl}/lock_account_invoices/update_status.json`,
                { invoice_ids: selectedRows, status },
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

    const handleMarkAsSent = () => handleUpdateStatus('sent', 'Invoices marked as sent', 'Failed to mark invoices as sent');

    const handleSubmitForApproval = () => handleUpdateStatus('pending_approval', 'Invoices submitted for approval', 'Failed to submit invoices for approval');
    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Invoice List</h1>
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
                    <div className="flex items-center gap-2">
                        <Button
                            // className='bg-primary text-primary-foreground hover:bg-primary/90'
                            className='fm-button-fix fm-button-brand px-4 py-2'
                            onClick={() => navigate('/club-management/invoice/add')}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                        {/* {selectedRows.length > 0 && (
                            <Button
                                className='bg-green-600 text-white hover:bg-green-700'
                                onClick={handleMarkAsConfirmed}
                            >
                                Mark as Confirmed
                            </Button>
                        )} */}

                        {selectedRows.length > 0 && (
                            hasInvoiceApproval ? (
                                <Button
                                    className="bg-brand hover:bg-brand-hover text-white"
                                    onClick={handleSubmitForApproval}
                                >
                                    Submit for Approval
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleMarkAsSent}
                                >
                                    Mark as Sent
                                </Button>
                            )
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
                                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">INVOICE</th>
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
                                className="bg-brand hover:bg-brand-hover text-white px-6"
                                onClick={() => setErrorModal({ show: false, errors: [] })}
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Invoice
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this invoice? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={deleteLoading}
                            className="btn-delete-confirm"
                        >
                            {deleteLoading ? "Deleting..." : "OK"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
