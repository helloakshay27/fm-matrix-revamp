import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

    // Mock data - replace with actual API call
    const mockData: PaymentReceived[] = [
        { id: 6, payment_number: 6, date: '2026-02-03', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: '', mode: 'Cash', amount: 1000, unused_amount: 1000, status: 'PAID' },
        { id: 5, payment_number: 5, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000003', mode: 'Cash', amount: 100, unused_amount: 0, status: 'PAID' },
        { id: 4, payment_number: 4, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000003', mode: 'Cash', amount: 159.87, unused_amount: 0, status: 'PAID' },
        { id: 3, payment_number: 3, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: '', mode: 'Cash', amount: 100, unused_amount: 100, status: 'PAID' },
        { id: 2, payment_number: 2, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000002', mode: 'Cash', amount: 300, unused_amount: 0, status: 'PAID' },
        { id: 1, payment_number: 1, date: '2025-11-12', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000001', mode: 'Cash', amount: 1665, unused_amount: 0, status: 'PAID' },
    ];

    // Fetch data (mocked)
    useEffect(() => {
        setLoading(true);
        let filteredData = mockData;
        if (debouncedSearchQuery.trim()) {
            filteredData = filteredData.filter(payment =>
                payment.customer_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                payment.invoice_number.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
        }
        const totalCount = filteredData.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (currentPage - 1) * perPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + perPage);
        setPaymentData(paginatedData);
        setPagination({
            current_page: currentPage,
            per_page: perPage,
            total_pages: totalPages,
            total_count: totalCount,
            has_next_page: currentPage < totalPages,
            has_prev_page: currentPage > 1
        });
        setLoading(false);
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
            <header className="flex items-center justify-between">
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
                <Button
                    className='bg-primary text-primary-foreground hover:bg-primary/90'
                    onClick={() => navigate('/accounting/payments-received/create')}
                >
                    <Plus className="w-4 h-4 mr-2" /> New
                </Button>
            </header>
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
