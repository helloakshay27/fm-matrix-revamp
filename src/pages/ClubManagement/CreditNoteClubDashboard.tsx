import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import axios from 'axios';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// Type definitions for Credit Note
interface CreditNote {
    id: number;
    credit_note_number: string;
    customer_name: string;
    guest_name?: string;
    member_name?: string;
    staff_name?: string;
    date: string;
    reference_number: string;
    invoice_number: string;
    amount: number;
    balance_due: number;
    status: 'draft' | 'open' | 'paid' | 'overdue' | 'cancelled';
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface CreditNoteFilters {
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
        key: 'credit_note_number',
        label: 'Credit Note#',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'reference_number',
        label: 'Reference Number',
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
    // {
    //     key: 'invoice_number',
    //     label: 'Invoice#',
    //     sortable: true,
    //     hideable: true,
    //     draggable: true
    // },
    {
        key: 'date',
        label: 'Date',
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
    {
        key: 'total_amount',
        label: 'Amount',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'balance_due',
        label: 'Balance Due',
        sortable: true,
        hideable: true,
        draggable: true
    }
];

export const CreditNoteClubDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<CreditNoteFilters>({});
    const [creditNoteData, setCreditNoteData] = useState<CreditNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<CreditNote | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Maps a raw credit_note record (shape unconfirmed) to the CreditNote shape this table renders
    const mapCreditNoteRecord = (record: any): CreditNote => {
        // Confirmed: the billed party comes back as "customer", not "user" (see CreditNoteClubDetails).
        const user = record.customer || record.user || {};
        // Prefer explicit is_staff/is_member/is_guest boolean flags (on the record or the nested user
        // object) when present; fall back to a user_type string if that's what the API returns instead.
        const isStaff = record.is_staff ?? user.is_staff ?? (user.user_type === 'fm' || user.user_type === 'staff');
        const isMember = record.is_member ?? user.is_member ?? (user.user_type === 'occupant' || user.user_type === 'member');
        const isGuest = record.is_guest ?? user.is_guest ?? (user.user_type === 'guest');
        return {
            id: record.id,
            credit_note_number: record.credit_note_number || record.number || record.order_number || '',
            customer_name: record.customer_name || user.name || '',
            guest_name: record.guest_name || (isGuest ? user.name : undefined),
            member_name: record.member_name || (isMember ? user.name : undefined),
            staff_name: record.staff_name || (isStaff ? user.name : undefined),
            date: record.date || record.bill_date || record.created_at || '',
            reference_number: record.reference_number || record.order_number || '',
            invoice_number: record.invoice_number || '',
            amount: Number(record.amount ?? record.total_amount ?? 0),
            balance_due: Number(record.balance_due ?? record.due_amount ?? 0),
            status: record.status || 'draft',
            active: record.active !== undefined ? record.active : true,
            created_at: record.created_at || '',
            updated_at: record.updated_at || '',
            // Extra field used directly by renderRow, not part of the base CreditNote shape
            ...({ total_amount: Number(record.total_amount ?? record.amount ?? 0) } as any),
        };
    };

    // Fetch credit note data
    const fetchCreditNoteData = async (page = 1, per_page = 10, search = '', filters: CreditNoteFilters = {}) => {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');

        try {
            // Confirmed: GET /credit_notes.json?search=...&status=...
            const params: Record<string, string | number> = { page, per_page };
            if (search) params.search = search;
            if (filters.status) params.status = filters.status;

            const response = await axios.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/credit_notes.json`,
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // NOTE: response shape is unconfirmed — best-effort parsing across common shapes.
            const apiData = response.data;
            const list = apiData?.credit_notes || apiData?.data || (Array.isArray(apiData) ? apiData : []);

            setCreditNoteData(list.map(mapCreditNoteRecord));

            setPagination({
                current_page: apiData?.pagination?.current_page ?? apiData?.current_page ?? page,
                per_page: apiData?.pagination?.per_page ?? apiData?.per_page ?? per_page,
                total_pages: apiData?.pagination?.total_pages ?? apiData?.total_pages ?? 1,
                total_count: apiData?.pagination?.total_count ?? apiData?.total_count ?? list.length,
                has_next_page: apiData?.pagination?.has_next_page ?? false,
                has_prev_page: apiData?.pagination?.has_prev_page ?? false,
            });
        } catch (error: unknown) {
            console.error('Error fetching credit note data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to load credit note data: ${errorMessage}`, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditNoteData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) fetchCreditNoteData(1, perPage, '', appliedFilters);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

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

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleteLoading(true);
            setLoading(true);
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');

            await axios.delete(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/credit_notes/${deleteTarget.id}.json`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success('Credit note deleted successfully!');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchCreditNoteData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error: unknown) {
            console.error('Error deleting credit note:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to delete credit note: ${errorMessage}`);
        } finally {
            setDeleteLoading(false);
            setLoading(false);
        }
    };

    const renderRow = (cn: CreditNote) => ({
        actions: (
            <div className="flex items-center gap-2">
                {/* <input
                    type="checkbox"
                    checked={selectedRows.includes(cn.id)}
                    onChange={e => {
                        setSelectedRows(prev =>
                            e.target.checked
                                ? [...prev, cn.id]
                                : prev.filter(id => id !== cn.id)
                        );
                    }}
                    title="Select for status update"
                    className="w-4 h-4 cursor-pointer accent-primary"
                /> */}
                <button
                    onClick={() => navigate(`/club-management/credit-note/details/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => navigate(`/club-management/credit-note/edit/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button>
                {/* <button
                    onClick={() => {
                        setDeleteTarget(cn);
                        setShowDeleteModal(true);
                    }}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button> */}
            </div>
        ),
        credit_note_number: (
            <div className="font-medium text-brand cursor-pointer" onClick={() => navigate(`/club-management/credit-note/details/${cn.id}`)}>
                {cn.credit_note_number || '-'}
            </div>
        ),
        reference_number: (
            <span className="text-sm text-gray-900">{cn.reference_number || '-'}</span>
        ),
        guest_name: (
            <span className="text-sm text-gray-900">{cn.guest_name || '-'}</span>
        ),
        member_name: (
            <span className="text-sm text-gray-900">{cn.member_name || '-'}</span>
        ),
        staff_name: (
            <span className="text-sm text-gray-900">{cn.staff_name || '-'}</span>
        ),
        invoice_number: (
            <span className="text-sm text-gray-600">{cn.invoice_number || '-'}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {cn.date
                    ? new Date(cn.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : '-'}
            </span>
        ),
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(cn.status)}
            </div>
        ),
        total_amount: (
            <span className="text-sm font-medium text-gray-900">
                {cn.total_amount != null
                    ? `₹${cn.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '-'}
            </span>
        ),
        balance_due: (
            <span className="text-sm font-medium text-gray-900">
                {cn.balance_due != null
                    ? `₹${cn.balance_due.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '-'}
            </span>
        )
    });

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Credit Notes</h1>
            </header>

            <EnhancedTaskTable
                data={creditNoteData}
                columns={columns}
                renderRow={renderRow}
                storageKey="credit-note-list-v1"
                hideTableExport={false}
                hideTableSearch={false}
                enableSearch={true}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <div className="flex items-center gap-2">
                        <Button
                            // className='bg-primary text-primary-foreground hover:bg-primary/90'
                            className='fm-button-fix fm-button-brand px-8 py-2'
                            onClick={() => navigate('/club-management/credit-note/add')}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                        {selectedRows.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    toast.success(`Printing ${selectedRows.length} credit note(s)...`);
                                    window.print();
                                }}
                            >
                                <Printer className="w-4 h-4 mr-2" /> Print ({selectedRows.length})
                            </Button>
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
            {/* Delete confirmation modal (matches provided UI) */}
            <AlertDialog
                open={showDeleteModal}
                onOpenChange={(open) => {
                    setShowDeleteModal(open);
                    if (!open) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Credit Note</AlertDialogTitle>

                        <AlertDialogDescription>
                            Once you delete this credit note, you won't be able to retrieve it later.
                            Are you sure you want to delete {deleteTarget?.credit_note_number || 'this credit note'}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmDelete();
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

export default CreditNoteClubDashboard;
