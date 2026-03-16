import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for Payment Received
interface PaymentReceived {
    id: number;
    payment_number: number;
    date: string;
    type: string;
    reference_number: string;
    customer_name: string;
    invoice_number: string;
    mode: string;
    amount: number;
    unused_amount: number;
    status: 'PAID' | 'DRAFT' | 'VOID';
}

// API shape returned by lock_payments.json (subset)
interface LockPaymentAPI {
    id: number;
    order_number?: string;
    receipt_number?: string;
    payment_of?: string;
    payment_mode?: string;
    payment_method?: string;
    payment_status?: string;
    created_at?: string;
    paid_amount?: string;
    total_amount?: string;
    neft_reference?: string;
    pg_transaction_id?: string;
    payment_gateway?: string;
    bank_name?: string;
    invoice_number?: string;
}

// Helper mapper
const mapLockPayment = (lp: LockPaymentAPI): PaymentReceived => {
    const statusRaw = (lp.payment_status || '').toLowerCase();
    let status: PaymentReceived['status'] = 'DRAFT';
    if (statusRaw === 'paid' || statusRaw === 'success') status = 'PAID';
    else if (statusRaw === 'void' || statusRaw === 'failed') status = 'VOID';

    const date = lp.created_at
        ? new Date(lp.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : '-';

    const paymentNumber = lp.receipt_number || lp.order_number || lp.id;
    const mode = lp.payment_mode || lp.payment_method || '';
    const amount = parseFloat(lp.paid_amount || lp.total_amount || '0') || 0;

    return {
        id: lp.id,
        payment_number: Number(paymentNumber),
        date,
        type: lp.payment_of || 'Invoice Payment',
        reference_number: lp.order_number || '',
        customer_name: lp.payment_of || '',
        invoice_number: lp.invoice_number || '',
        mode,
        amount,
        unused_amount: 0,
        status,
    };
};

const columns: ColumnConfig[] = [
    { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
    { key: 'date', label: 'Date', sortable: true, hideable: true, draggable: true },
    { key: 'payment_number', label: 'Payment #', sortable: true, hideable: true, draggable: true },
    { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
    { key: 'reference_number', label: 'Reference Number', sortable: true, hideable: true, draggable: true },
    { key: 'customer_name', label: 'Customer Name', sortable: true, hideable: true, draggable: true },
    { key: 'invoice_number', label: 'Invoice#', sortable: true, hideable: true, draggable: true },
    { key: 'mode', label: 'Mode', sortable: true, hideable: true, draggable: true },
    { key: 'amount', label: 'Amount', sortable: true, hideable: true, draggable: true },
    { key: 'unused_amount', label: 'Unused Amount', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
];

export const PaymentsReceivedListPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchQuery = useDebounce(searchTerm, 1000);
    const [paymentData, setPaymentData] = useState<PaymentReceived[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        has_next_page: false,
        has_prev_page: false
    });

    // Payment data state will come from API

    // helper to fetch list
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `https://${baseUrl}/lock_payments.json`,
                {
                    params: {
                        lock_account_id: 1,
                        'q[payment_made_eq]': 0,
                        page: currentPage,
                        per_page: perPage,
                        search: debouncedSearchQuery || undefined,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = res.data;
            const list: LockPaymentAPI[] = data.lock_payments || data || [];
            const mapped = list.map(mapLockPayment);
            setPaymentData(mapped);
            if (data.pagination) {
                setPagination({
                    current_page: data.pagination.current_page || currentPage,
                    per_page: data.pagination.per_page || perPage,
                    total_pages: data.pagination.total_pages || 1,
                    total_count: data.pagination.total_count || mapped.length,
                    has_next_page: (data.pagination.current_page || currentPage) < (data.pagination.total_pages || 1),
                    has_prev_page: (data.pagination.current_page || currentPage) > 1,
                });
            } else {
                setPagination((p) => ({ ...p, total_count: mapped.length }));
            }
        } catch (err) {
            console.error('Failed to load payments', err);
        } finally {
            setLoading(false);
        }
    };


    // Fetch data from API whenever page/perPage/search changes
    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, perPage, debouncedSearchQuery]);

    // Render row for table
    const renderRow = (payment: PaymentReceived) => ({
        actions: (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate(`/accounting/payments-received/${payment.id}`)}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        ),
        date: (
            <span className="text-sm text-gray-600">
                {new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
        ),
        payment_number: (
            <div className="font-medium text-blue-600 cursor-pointer">{payment.payment_number}</div>
        ),
        type: (
            <span className="text-sm text-gray-900">{payment.type}</span>
        ),
        reference_number: (
            <span className="text-sm text-gray-900">{payment.reference_number}</span>
        ),
        customer_name: (
            <span className="text-sm text-gray-900">{payment.customer_name}</span>
        ),
        invoice_number: (
            <span className="text-sm text-gray-900">{payment.invoice_number}</span>
        ),
        mode: (
            <span className="text-sm text-gray-900">{payment.mode}</span>
        ),
        amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        unused_amount: (
            <span className="text-sm font-medium text-gray-900">
                ₹{payment.unused_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
        status: (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'PAID' ? 'bg-green-100 text-green-800' : payment.status === 'VOID' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {payment.status}
            </span>
        )
    });

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    // Dropdown state for filter
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedView, setSelectedView] = useState('Invoice Payments');
    const dropdownOptions = [
        'All Payments',
        'Retainer Payments',
        'Invoice Payments',
        'Draft',
        'Paid',
        'Void',
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center px-3 py-2 text-lg font-semibold bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 min-w-[180px]"
                            onClick={() => setDropdownOpen((open) => !open)}
                        >
                            {selectedView}
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                                {dropdownOptions.map((option) => (
                                    <button
                                        key={option}
                                        className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${selectedView === option ? 'bg-gray-100 font-semibold' : ''}`}
                                        onClick={() => {
                                            setSelectedView(option);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span className="flex-1">{option}</span>
                                        {selectedView === option && (
                                            <svg className="w-4 h-4 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 11.586l-1.293-1.293z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                                <div className="border-t border-gray-200 my-1" />
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        // Implement custom view logic here
                                    }}
                                >
                                    <span className="mr-2 text-lg">+</span> New Custom View
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <EnhancedTaskTable
                data={paymentData}
                columns={columns}
                renderRow={renderRow}
                storageKey="payments-received-dashboard-v1"
                hideTableExport={true}
                hideTableSearch={false}
                enableSearch={true}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                loading={loading}
                leftActions={(
                    <Button
                        className='bg-primary text-primary-foreground hover:bg-primary/90'
                        onClick={() => navigate('/accounting/payments-received/create')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> New
                    </Button>
                )}
            />
            {pagination.total_count > 0 && (
                <TicketPagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    totalRecords={pagination.total_count}
                    perPage={pagination.per_page}
                    isLoading={loading}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            )}
        </div>
    );
};

export default PaymentsReceivedListPage;
