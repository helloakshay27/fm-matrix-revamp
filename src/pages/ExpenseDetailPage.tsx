import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    Download,
    Mail,
    Copy,
    Receipt,
    FileText,
    Calendar,
    DollarSign
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

// Types
interface TransactionRecord {
    record: {
        id: number;
        lock_account_id: number;
        lock_account_transaction_id: number;
        tr_type: string;
        ledger_id: number;
        amount: number;
        active: boolean;
        created_at: string;
        updated_at: string;
        contact_id: number | null;
        description: string | null;
        cost_centre_id: number;
    };
}

interface Transaction {
    id: number;
    voucher_number: string;
    transaction_type: string;
    transaction_date: string;
    reference: string;
    description: string;
    records: TransactionRecord[];
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

interface Expense {
    id: number;
    account_id: string;
    paid_through_account_id: string;
    vendor_id: string | null;
    customer_id: string | null;
    currency_id: string | null;
    organization_id: string;
    date: string;
    amount: number;
    reference_number: string;
    description: string;
    transaction: Transaction;
    created_at: string;
    updated_at: string;
}

export const ExpenseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [expense, setExpense] = useState<Expense | null>(null);
    const [accountLedgers, setAccountLedgers] = useState<AccountLedger[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('expense-details');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Fetch account ledgers
    useEffect(() => {
        const fetchAccountLedgers = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lockAccountId = localStorage.getItem('lock_account_id') || '1';
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

    // Fetch expense details
    useEffect(() => {
        const fetchExpense = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

                const response = await fetch(
                    `${apiUrl}/expenses/${id}.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setExpense(data);
                } else {
                    sonnerToast.error('Failed to fetch expense details');
                    navigate('/accounting/expense');
                }
            } catch (error) {
                console.error('Error fetching expense:', error);
                sonnerToast.error('Error loading expense');
                navigate('/accounting/expense');
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id, navigate]);

    // Helper functions
    const getAccountName = (accountId: string) => {
        const account = accountLedgers.find(a => a.id === parseInt(accountId));
        return account ? (account.formatted_name || account.name) : accountId;
    };

    const getVendorName = (vendorId: string | null) => {
        if (!vendorId) return '-';
        const vendor = vendors.find(v => v.id === parseInt(vendorId));
        return vendor ? vendor.name : vendorId;
    };

    const getStatusColor = (status: string) => {
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    const handleEdit = () => {
        navigate(`/accounting/expense/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

            const response = await fetch(
                `${apiUrl}/expenses/${id}.json`,
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
                navigate('/accounting/expense');
            } else {
                sonnerToast.error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            sonnerToast.error('Failed to delete expense');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        sonnerToast.success('Downloading expense PDF...');
    };

    const handleSendEmail = () => {
        sonnerToast.success('Email sent successfully');
    };

    const handleClone = () => {
        sonnerToast.success('Expense cloned successfully');
        navigate('/accounting/expense/create');
    };

    if (loading || !expense) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading expense...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/accounting/expense')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <Receipt className="h-6 w-6 text-primary" />
                                Expense #{expense.transaction.voucher_number}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Created on {new Date(expense.created_at).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(expense.transaction.transaction_type)} border`}>
                            {expense.transaction.transaction_type.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                {/* Action Buttons
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="default" onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </Button>
                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={handleSendEmail}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                            </Button>
                            <Button variant="outline" onClick={handleClone}>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="expense-details">Expense Details</TabsTrigger>
                        <TabsTrigger value="vendor-info">Vendor Info</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    {/* Expense Details Tab */}
                    <TabsContent value="expense-details" className="space-y-6">
                        {/* Expense Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Expense Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <span className="text-sm text-gray-600">Date</span>
                                        <p className="font-medium mt-1">
                                            {new Date(expense.date).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Expense Account</span>
                                        <p className="font-medium mt-1">{getAccountName(expense.account_id)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Reference Number</span>
                                        <p className="font-medium mt-1">{expense.reference_number || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Amount</span>
                                        <p className="font-medium mt-1 text-lg">
                                            ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Paid Through</span>
                                        <p className="font-medium mt-1">{getAccountName(expense.paid_through_account_id)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Vendor</span>
                                        <p className="font-medium mt-1">{getVendorName(expense.vendor_id)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Voucher Number</span>
                                        <p className="font-medium mt-1">{expense.transaction.voucher_number}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Transaction Type</span>
                                        <div className="mt-1">
                                            <Badge className={getStatusColor(expense.transaction.transaction_type)}>
                                                {expense.transaction.transaction_type.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {expense.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{expense.description}</p>
                                </CardContent>
                            </Card>
                        )}

                    </TabsContent>

                    {/* Vendor Info Tab */}
                    <TabsContent value="vendor-info" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vendor Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-600">Vendor Name</span>
                                        <p className="font-medium mt-1">{getVendorName(expense.vendor_id)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Activity History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 pb-4 border-b">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Expense Created</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(expense.created_at).toLocaleString('en-GB')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Last Updated</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(expense.updated_at).toLocaleString('en-GB')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Expense</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this expense? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseDetailPage;
