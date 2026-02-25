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

// Type definitions for Credit Note
interface CreditNote {
    id: number;
    credit_note_number: string;
    customer_name: string;
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
    // {
    //     key: 'actions',
    //     label: 'Action',
    //     sortable: false,
    //     hideable: false,
    //     draggable: false
    // },
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
        key: 'customer_name',
        label: 'Customer Name',
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

export const CreditNoteListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [appliedFilters, setAppliedFilters] = useState<CreditNoteFilters>({});
    const [creditNoteData, setCreditNoteData] = useState<CreditNote[]>([]);
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
      const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

    // Fetch credit note data
    const fetchCreditNoteData = async (page = 1, per_page = 10, search = '', filters: CreditNoteFilters = {}) => {
        setLoading(true);
          const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

        try {
                    const response = await axios.get(
                        `https://${baseUrl}/lock_account_credit_notes.json?lock_account_id=1`,
                        {
                            params: {
                                // lock_account_id: 1,
                                //   page,
                                //   per_page,
                                //   search,
                                //   status: filters.status || undefined,
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
                            },
                        }
                    );
        
                    // 🔥 Adjust this based on actual API response structure
                    const apiData = response.data;
        
                    const bills: CreditNote[] = apiData?.data || apiData || [];
        
                    setCreditNoteData(apiData);
        
                    setPagination({
                        current_page: apiData?.current_page || page,
                        per_page: apiData?.per_page || per_page,
                        total_pages: apiData?.total_pages || 1,
                        total_count: apiData?.total_count || bills.length,
                        has_next_page:
                            (apiData?.current_page || page) <
                            (apiData?.total_pages || 1),
                        has_prev_page:
                            (apiData?.current_page || page) > 1,
                    });
        
                } catch (error: unknown) {
                    console.error("Error fetching bill data:", error);
        
                    const errorMessage =
                        error instanceof Error ? error.message : "Unknown error";
        
                    toast.error(`Failed to load bill data: ${errorMessage}`, {
                        duration: 5000,
                    });
        
                } finally {
                    setLoading(false);
                }
        // try {
        //     const mockData: CreditNote[] = [
        //         {
        //             id: 1,
        //             credit_note_number: 'CN-10023',
        //             customer_name: 'Lockated',
        //             date: '2026-02-10',
        //             reference_number: 'REF-001',
        //             invoice_number: 'INV-1023',
        //             amount: 3550.00,
        //             balance_due: 0.00,
        //             status: 'open',
        //             active: true,
        //             created_at: '2026-02-10',
        //             updated_at: '2026-02-10'
        //         },
        //         {
        //             id: 2,
        //             credit_note_number: 'CN-10024',
        //             customer_name: 'Gurughar',
        //             date: '2026-02-15',
        //             reference_number: 'REF-002',
        //             invoice_number: 'INV-1045',
        //             amount: 1600.00,
        //             balance_due: 1600.00,
        //             status: 'draft',
        //             active: true,
        //             created_at: '2026-02-15',
        //             updated_at: '2026-02-15'
        //         }
        //     ];

        //     let filteredData = mockData;
        //     if (search.trim()) {
        //         filteredData = mockData.filter(cn =>
        //             cn.credit_note_number.toLowerCase().includes(search.toLowerCase()) ||
        //             cn.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        //             cn.reference_number.toLowerCase().includes(search.toLowerCase())
        //         );
        //     }
        //     if (filters.status) {
        //         filteredData = filteredData.filter(cn => cn.status === filters.status);
        //     }

        //     const totalCount = filteredData.length;
        //     const totalPages = Math.ceil(totalCount / per_page);
        //     const startIndex = (page - 1) * per_page;
        //     const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

        //     setCreditNoteData(paginatedData);
        //     setPagination({
        //         current_page: page,
        //         per_page,
        //         total_pages: totalPages,
        //         total_count: totalCount,
        //         has_next_page: page < totalPages,
        //         has_prev_page: page > 1
        //     });
        // } catch (error: unknown) {
        //     console.error('Error fetching credit note data:', error);
        //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        //     toast.error(`Failed to load credit note data: ${errorMessage}`, { duration: 5000 });
        // } finally {
        //     setLoading(false);
        // }
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

    const renderRow = (cn: CreditNote) => ({
        actions: (
            <div className="flex items-center gap-2">
                <input
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
                />
                <button
                    onClick={() => navigate(`/accounting/credit-note/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => navigate(`/accounting/credit-note/edit/${cn.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this credit note?')) {
                            toast.success('Credit note deleted successfully!');
                            fetchCreditNoteData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
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
            <div className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate(`/accounting/credit-note/${cn.id}`)}>
                {cn.credit_note_number}
            </div>
        ),
        reference_number: (
            <span className="text-sm text-gray-900">{cn.reference_number || '-'}</span>
        ),
        customer_name: (
            <span className="text-sm text-gray-900">{cn.customer_name}</span>
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
                            className='bg-primary text-primary-foreground hover:bg-primary/90'
                            onClick={() => navigate('/accounting/credit-note/add')}
                        >
                            <Plus className="w-4 h-4 mr-2" /> New
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
        </div>
    );
};

export default CreditNoteListPage;
