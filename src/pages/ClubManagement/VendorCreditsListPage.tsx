import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for Vendor Credit
interface VendorCredit {
    id: number;
    credit_note_number: string;
    vendor_name: string;
    date: string;
    order_number: string;
    bill_number: string;
    amount: number;
    balance_due: number;
    status: 'draft' | 'open' | 'paid' | 'overdue' | 'cancelled';
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface VendorCreditFilters {
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
        key: 'credit_note_number',
        label: 'Credit Note#',
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
        key: 'bill_number',
        label: 'Bill#',
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
        key: 'amount',
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

export const VendorCreditsListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<VendorCreditFilters>({});
    const [vendorCreditData, setVendorCreditData] = useState<VendorCredit[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Fetch vendor credit data
    const fetchVendorCreditData = async (page = 1, per_page = 10, search = '', filters: VendorCreditFilters = {}) => {
        setLoading(true);
        try {
            const mockData: VendorCredit[] = [
                {
                    id: 1,
                    credit_note_number: 'VC-10045',
                    vendor_name: 'Lockated',
                    date: '2026-02-10',
                    order_number: 'ORD-2024-001',
                    bill_number: 'BILL-1023',
                    amount: 6600.00,
                    balance_due: 0.00,
                    status: 'open',
                    active: true,
                    created_at: '2026-02-10',
                    updated_at: '2026-02-10'
                },
                {
                    id: 2,
                    credit_note_number: 'VC-10046',
                    vendor_name: 'Gurughar',
                    date: '2026-02-15',
                    order_number: 'ORD-2024-002',
                    bill_number: 'BILL-2045',
                    amount: 2750.00,
                    balance_due: 2750.00,
                    status: 'draft',
                    active: true,
                    created_at: '2026-02-15',
                    updated_at: '2026-02-15'
                }
            ];

            let filteredData = mockData;
            if (search.trim()) {
                filteredData = mockData.filter(vc =>
                    vc.credit_note_number.toLowerCase().includes(search.toLowerCase()) ||
                    vc.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
                    vc.order_number.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (filters.status) {
                filteredData = filteredData.filter(vc => vc.status === filters.status);
            }

            const totalCount = filteredData.length;
            const totalPages = Math.ceil(totalCount / per_page);
            const startIndex = (page - 1) * per_page;
            const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

            setVendorCreditData(paginatedData);
            setPagination({
                current_page: page,
                per_page,
                total_pages: totalPages,
                total_count: totalCount,
                has_next_page: page < totalPages,
                has_prev_page: page > 1
            });
        } catch (error: unknown) {
            console.error('Error fetching vendor credit data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to load vendor credit data: ${errorMessage}`, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorCreditData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (!term.trim()) fetchVendorCreditData(1, perPage, '', appliedFilters);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800',
            open: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            overdue: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const totalRecords = pagination.total_count;
    const totalPages = pagination.total_pages;

    const renderRow = (vc: VendorCredit) => ({
        actions: (
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={selectedRows.includes(vc.id)}
                    onChange={e => {
                        setSelectedRows(prev =>
                            e.target.checked
                                ? [...prev, vc.id]
                                : prev.filter(id => id !== vc.id)
                        );
                    }}
                    title="Select for status update"
                    className="w-4 h-4 cursor-pointer accent-primary"
                />
                <button
                    onClick={() => navigate(`/accounting/vendor-credits/${vc.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => navigate(`/accounting/vendor-credits/edit/${vc.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this vendor credit?')) {
                            toast.success('Vendor credit deleted successfully!');
                            fetchVendorCreditData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
                        }
                    }}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
        credit_note_number: (
            <div className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate(`/accounting/vendor-credits/${vc.id}`)}>
                {vc.credit_note_number}
            </div>
        ),
        vendor_name: (
            <span className="text-sm text-gray-900">{vc.vendor_name}</span>
        ),
        bill_number: (
            <span className="text-sm text-gray-600">{vc.bill_number || '-'}</span>
        ),
        order_number: (
            <span className="text-sm text-gray-900">{vc.order_number || '-'}</span>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(vc.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
        ),
        status: (
            <div className="flex items-center justify-center">
                {getStatusBadge(vc.status)}
            </div>
        ),
        amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{vc.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        balance_due: (
            <span className="text-sm font-medium text-gray-900">
                ₹{vc.balance_due.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        )
    });

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Vendor Credits</h1>
            </header>

            <EnhancedTaskTable
                data={vendorCreditData}
                columns={columns}
                renderRow={renderRow}
                storageKey="vendor-credits-list-v1"
                hideTableExport={true}
                hideTableSearch={false}
                enableSearch={true}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <Button
                        className='bg-primary text-primary-foreground hover:bg-primary/90'
                        onClick={() => navigate('/accounting/vendor-credits/add')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> New
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

export default VendorCreditsListPage;
