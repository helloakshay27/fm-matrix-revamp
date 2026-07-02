import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit2, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { useDebounce } from '@/hooks/useDebounce';
import { toast as sonnerToast } from 'sonner';

// Type definitions for Expense
interface Expense {
    id: number;
    date: string;
    account_id: string;
    paid_through_account_id: string;
    vendor_id: string | null;
    customer_id: string | null;
    customer_name?: string | null;
    reference_number: string;
    description: string;
    amount: number;
    billable: boolean;
    expense_accounts: Array<{
        id: number;
        lock_account_ledger_id: number;
        lock_account_name: string;
    }>;
    transaction: {
        voucher_number: string;
        transaction_type: string;
        transaction_date: string;
        reference: string;
        description: string;
    };
    created_at: string;
    updated_at: string;
}

interface AccountLedger {
    id: number;
    name: string;
    formatted_name: string;
}

interface Vendor {
    id: number;
    name: string;
}

interface ExpenseFilters {
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
        key: 'date',
        label: 'Date',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'expense_account',
        label: 'Expense Account',
        sortable: true,
        hideable: true,
        draggable: true
    },
    {
        key: 'reference_number',
        label: 'Reference#',
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
        key: 'paid_through',
        label: 'Paid Through',
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
        key: 'status',
        label: 'Status',
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
    }
];

export const ExpenseListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<ExpenseFilters>({});
    const [expenseData, setExpenseData] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [accountLedgers, setAccountLedgers] = useState<AccountLedger[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Fetch account ledgers and vendors
    useEffect(() => {
        const fetchAccountLedgers = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lockAccountId = localStorage.getItem('lock_account_id');
                const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

                const response = await fetch(
                    `${apiUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setAccountLedgers(data);
                }
            } catch (error) {
                console.error('Error fetching account ledgers:', error);
            }
        };

        const fetchVendors = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

                const response = await fetch(
                    `${apiUrl}/pms/purchase_orders/get_suppliers.json?access_token=${token}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success' && data.suppliers) {
                        setVendors(data.suppliers);
                    }
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        fetchAccountLedgers();
        fetchVendors();
    }, []);

    // Helper functions to get names
    const getAccountName = (accountId: string) => {
        const account = accountLedgers.find(a => a.id === parseInt(accountId));
        return account ? (account.formatted_name || account.name) : accountId;
    };

    const getVendorName = (vendorId: string | null) => {
        if (!vendorId) return '-';
        const vendor = vendors.find(v => v.id === parseInt(vendorId));
        return vendor ? vendor.name : vendorId;
    };

    // Fetch expense data from API
    const fetchExpenseData = async (page = 1, per_page = 10, search = '', filters: ExpenseFilters = {}) => {
        setLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

            const response = await fetch(
                `${apiUrl}/expenses.json?lock_account_id=${lock_account_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data: Expense[] = await response.json();

                // Filter based on search
                let filteredData = data;

                if (search.trim()) {
                    const searchValue = search.toLowerCase().trim();

                    filteredData = data.filter((expense) => {
                        const accountName =
                            getAccountName(expense.account_id || '')?.toLowerCase() || '';

                        const paidThroughName =
                            getAccountName(expense.paid_through_account_id || '')?.toLowerCase() || '';

                        const vendorName =
                            getVendorName(expense.vendor_id || '')?.toLowerCase() || '';

                        const expenseAccountName =
                            expense.expense_accounts
                                ?.map((acc) => acc.lock_account_name || '')
                                .join(' ')
                                .toLowerCase() || '';

                        const referenceNumber =
                            expense.reference_number?.toLowerCase() || '';

                        const voucherNumber =
                            expense.transaction?.voucher_number?.toLowerCase() || '';

                        const customerName =
                            expense.customer_name?.toLowerCase() || '';

                        const amount =
                            expense.amount?.toString() || '';

                        return (
                            accountName.includes(searchValue) ||
                            paidThroughName.includes(searchValue) ||
                            vendorName.includes(searchValue) ||
                            expenseAccountName.includes(searchValue) ||
                            referenceNumber.includes(searchValue) ||
                            voucherNumber.includes(searchValue) ||
                            customerName.includes(searchValue) ||
                            amount.includes(searchValue)
                        );
                    });
                }

                const totalCount = filteredData.length;
                const totalPages = Math.ceil(totalCount / per_page);
                const startIndex = (page - 1) * per_page;
                const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

                setExpenseData(paginatedData);
                setPagination({
                    current_page: page,
                    per_page,
                    total_pages: totalPages,
                    total_count: totalCount,
                    has_next_page: page < totalPages,
                    has_prev_page: page > 1
                });
            } else {
                sonnerToast.error('Failed to fetch expenses');
                setExpenseData([]);
            }
        } catch (error: unknown) {
            console.error('Error fetching expense data:', error);
            sonnerToast.error('Error loading expenses');
            setExpenseData([]);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and when page/perPage/filters change
    useEffect(() => {
        if (accountLedgers.length > 0 || vendors.length > 0) {
            fetchExpenseData(
                currentPage,
                perPage,
                debouncedSearchQuery,
                appliedFilters
            );
        }
    }, [
        currentPage,
        perPage,
        debouncedSearchQuery,
        appliedFilters,
        accountLedgers,
        vendors
    ]);

    // Handle search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) {
            fetchExpenseData(1, perPage, '', appliedFilters);
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



    const totalRecords = pagination.total_count;
    const totalPages = pagination.total_pages;
    const displayedData = expenseData;

    // Render row function for enhanced table
    const renderRow = (expense: Expense) => ({
        actions: (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(expense.id)}
                    className="h-8 w-8"
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(expense.id)}
                    className="h-8 w-8"
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(expense.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(expense.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </span>
        ),
        expense_account: (
            <div className="font-medium text-blue-600">
                {expense.expense_accounts?.[0]?.lock_account_name || getAccountName(expense.account_id)}
            </div>
        ),
        reference_number: (
            <div className="text-sm">
                <div className="font-medium text-gray-900">{expense.transaction?.voucher_number || '-'}</div>
                <div className="text-xs text-gray-500">{expense.reference_number}</div>
            </div>
        ),
        vendor_name: (
            <span className="text-sm text-gray-900">{getVendorName(expense.vendor_id)}</span>
        ),
        paid_through: (
            <span className="text-sm text-gray-600">{getAccountName(expense.paid_through_account_id)}</span>
        ),
        customer_name: (
            <span className="text-sm text-gray-900">{expense.customer_name || '-'}</span>
        ),
        status: (
            <span className="text-sm text-gray-600">{expense.billable ? 'Unbilled' : 'Non billable'}</span>
        ),
        amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        )
    });

    const handleView = (id: number) => {
        navigate(`/accounting/expense/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/accounting/expense/edit/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        setDeletingExpenseId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingExpenseId === null) return;

        setDeleting(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

            const response = await fetch(
                `${apiUrl}/expenses/${deletingExpenseId}.json?lock_account_id=${lock_account_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                sonnerToast.success('Expense deleted successfully');
                setDeleteConfirmOpen(false);
                setDeletingExpenseId(null);
                // Refresh the list
                const newPage = expenseData.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                fetchExpenseData(newPage, perPage, debouncedSearchQuery, appliedFilters);
            } else {
                sonnerToast.error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            sonnerToast.error('Error deleting expense');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setDeletingExpenseId(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Expenses</h1>
            </div>

            <EnhancedTaskTable
                data={displayedData}
                columns={columns}
                renderRow={renderRow}
                storageKey="expense-dashboard-v1"
                hideTableExport={true}
                hideTableSearch={false}
                enableSearch={true}
                isLoading={loading}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <Button onClick={() => navigate('/accounting/expense/create')} 
                    // className="fm-button-fix fm-button-brand gap-2 px-4 py-2"
                     className='fm-button-fix fm-button-brand px-4 py-2P'
                    >
                         
                        <Plus className="h-4 w-4" />
                        Add
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Expense</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} variant="outline">
                        No
                    </Button>
                    <Button onClick={handleDeleteConfirm} disabled={deleting} className="text-red-600 hover:bg-red-50">
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
