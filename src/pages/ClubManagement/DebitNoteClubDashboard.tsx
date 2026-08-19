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

// Type definitions for Debit Note
interface DebitNote {
    id: number;
    debit_note_number: string;
    customer_name: string;
    guest_name?: string;
    member_name?: string;
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

interface DebitNoteFilters {
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
        key: 'debit_note_number',
        label: 'Debit Note#',
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

export const DebitNoteClubDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<DebitNoteFilters>({});
    const [debitNoteData, setDebitNoteData] = useState<DebitNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DebitNote | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Maps a raw debit_note record (shape unconfirmed) to the DebitNote shape this table renders
    const mapDebitNoteRecord = (record: any): DebitNote => {
        const user = record.user || {};
        return {
            id: record.id,
            debit_note_number: record.debit_note_number || record.number || record.order_number || '',
            customer_name: record.customer_name || user.name || '',
            guest_name: record.guest_name || (user.user_type === 'guest' ? user.name : undefined),
            member_name: record.member_name || (user.user_type !== 'guest' ? user.name : undefined),
            date: record.date || record.bill_date || record.created_at || '',
            reference_number: record.reference_number || record.order_number || '',
            invoice_number: record.invoice_number || '',
            amount: Number(record.amount ?? record.total_amount ?? 0),
            balance_due: Number(record.balance_due ?? record.due_amount ?? 0),
            status: record.status || 'draft',
            active: record.active !== undefined ? record.active : true,
            created_at: record.created_at || '',
            updated_at: record.updated_at || '',
            // Extra field used directly by renderRow, not part of the base DebitNote shape
            ...({ total_amount: Number(record.total_amount ?? record.amount ?? 0) } as any),
        };
    };

    // Fetch debit note data
    const fetchDebitNoteData = async (page = 1, per_page = 10, search = '', filters: DebitNoteFilters = {}) => {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');

        try {
            const response = await axios.get(
                `https://${baseUrl}/debit_notes.json`,
                {
                    params: { lock_account_id, page, per_page },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // NOTE: response shape is unconfirmed — best-effort parsing across common shapes.
            const apiData = response.data;
            const list = apiData?.debit_notes || apiData?.data || (Array.isArray(apiData) ? apiData : []);

            setDebitNoteData(list.map(mapDebitNoteRecord));

            setPagination({
                current_page: apiData?.pagination?.current_page ?? apiData?.current_page ?? page,
                per_page: apiData?.pagination?.per_page ?? apiData?.per_page ?? per_page,
                total_pages: apiData?.pagination?.total_pages ?? apiData?.total_pages ?? 1,
                total_count: apiData?.pagination?.total_count ?? apiData?.total_count ?? list.length,
                has_next_page: apiData?.pagination?.has_next_page ?? false,
                has_prev_page: apiData?.pagination?.has_prev_page ?? false,
            });
        } catch (error: unknown) {
            console.error('Error fetching debit note data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to load debit note data: ${errorMessage}`, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebitNoteData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) fetchDebitNoteData(1, perPage, '', appliedFilters);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: string) => {
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
                `https://${baseUrl}/debit_notes/${deleteTarget.id}.json?lock_account_id=${lock_account_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success('Debit note deleted successfully!');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchDebitNoteData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
        } catch (error: unknown) {
            console.error('Error deleting debit note:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to delete debit note: ${errorMessage}`);
        } finally {
            setDeleteLoading(false);
            setLoading(false);
        }
    };

    const renderRow = (cn: DebitNote) => ({
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
                    onClick={() => navigate(`/club-management/debit-note/details/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    {/* <Eye className="w-4 h-4" /> */}
                </button>
                <button
                    onClick={() => navigate(`/club-management/debit-note/edit/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    {/* <Edit className="w-4 h-4" /> */}
                </button>
                <button
                    onClick={() => {
                        setDeleteTarget(cn);
                        setShowDeleteModal(true);
                    }}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
        debit_note_number: (
            <div className="font-medium text-brand cursor-pointer" onClick={() => navigate(`/club-management/debit-note/details/${cn.id}`)}>
                {cn.debit_note_number}
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
        invoice_number: (
            <span className="text-sm text-gray-600">{cn.invoice_number || '-'}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(cn.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
        ),
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(cn.status)}
            </div>
        ),
        total_amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{cn?.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        balance_due: (
            <span className="text-sm font-medium text-gray-900">
                {/* ₹{cn.balance_due.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
            </span>
        )
    });

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Debit Notes</h1>
            </header>

            <EnhancedTaskTable
                data={debitNoteData}
                columns={columns}
                renderRow={renderRow}
                storageKey="debit-note-list-v1"
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
                            onClick={() => navigate('/club-management/debit-note/add')}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                        {selectedRows.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    toast.success(`Printing ${selectedRows.length} debit note(s)...`);
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
                        <AlertDialogTitle>Delete Debit Note</AlertDialogTitle>

                        <AlertDialogDescription>
                            Once you delete this debit note, you won't be able to retrieve it later.
                            Are you sure you want to delete {deleteTarget?.debit_note_number || 'this debit note'}?
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

export default DebitNoteClubDashboard;
