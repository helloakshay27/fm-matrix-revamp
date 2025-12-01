import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Edit2, X } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';
import { getCustomerById } from '@/store/slices/cusomerSlice';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface Customer {
    id?: number;
    name: string;
    email: string;
    company_code: string;
    color_code: string;
    mobile: string;
    organization_code: string;
    customer_code: string;
    ext_customer_code: string;
}

interface Lease {
    id: number;
    lease_start_date: string;
    lease_end_date: string;
    free_parking: string | boolean;
    paid_parking: string | boolean;
}

interface WalletTransaction {
    transactionId: string;
    bookingId: string;
    facilityName: string;
    personName: string;
    transactionDate: string;
    transactionTime: string;
    amount: string;
    transactionType: 'Credit' | 'Debit';
    ccAvenueId: string;
}

interface CustomerResponse {
    entity: Customer;
    customer_leases: Lease[];
}

interface LayoutContextType {
    setCurrentSection: (section: string) => void;
}

const leaseColumns: ColumnConfig[] = [
    {
        key: 'id',
        label: 'Lease Id',
        sortable: true,
        draggable: true,
        defaultVisible: true
    },
    {
        key: 'lease_start_date',
        label: 'Lease Start Date',
        sortable: true,
        draggable: true,
        defaultVisible: true
    },
    {
        key: 'lease_end_date',
        label: 'Lease End Date',
        sortable: true,
        draggable: true,
        defaultVisible: true
    },
    {
        key: 'free_parking',
        label: 'Free Parking',
        sortable: true,
        draggable: true,
        defaultVisible: true
    },
    {
        key: 'paid_parking',
        label: 'Paid Parking',
        sortable: true,
        draggable: true,
        defaultVisible: true
    }
];

export const CrmCustomerDetails = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { shouldShow } = useDynamicPermissions();

    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem('token') || '';
    const baseUrl = localStorage.getItem('baseUrl') || '';

    const { setCurrentSection } = useLayout() as LayoutContextType;

    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [lease, setLease] = useState<Lease[]>([]);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await dispatch(getCustomerById({ id: Number(id), baseUrl, token })).unwrap() as CustomerResponse;
                setCustomer(response.entity);
                setLease(response.customer_leases);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer';
                console.error(errorMessage);
                toast.error(errorMessage);
            }
        };

        fetchCustomer();
    }, []);

    useEffect(() => {
        setCurrentSection('CRM');
    }, [setCurrentSection]);

    const handleTopUpClose = () => {
        setTopUpDialogOpen(false);
        setTopUpAmount('');
    };

    const handleTopUpSubmit = () => {
        handleTopUpClose();
    };

    const renderCell = (item: Lease, columnKey: keyof Lease) => {
        return item[columnKey] || '-';
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <p className="text-gray-600 text-sm">Back</p>
                </button>
                <div className="flex items-center gap-4">
                    {/* <span className="text-sm text-gray-600">Wallet Balance: 0 Points</span> */}
                    {/* <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
                        onClick={handleTopUpClick}
                    >
                        Top-Up Wallet
                    </Button> */}

                    {
                        shouldShow("customers", "edit") && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-2"
                                onClick={() => navigate(`/crm/customers/edit/${id}`)}
                                disabled={!id}
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )
                    }
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Name</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Email</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Company Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.company_code || '-'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Color Code</label>
                            <span className="text-sm">:</span>
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: customer?.color_code || '#ffffff' }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Mobile Number</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.mobile}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Organization Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.company_code}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customer?.ext_customer_code || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Information</h3>
                <EnhancedTable
                    data={lease}
                    columns={leaseColumns}
                    renderCell={renderCell}
                    pagination={true}
                    pageSize={5}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                />
            </div>

            <Dialog
                open={topUpDialogOpen}
                onClose={handleTopUpClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        pb: 2,
                    }}
                >
                    Top-Up Wallet
                    <IconButton
                        onClick={handleTopUpClose}
                        sx={{
                            color: 'gray',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <TextField
                        label="Amount to Top-Up"
                        variant="outlined"
                        fullWidth
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        type="number"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
                    <Button variant="outline" onClick={handleTopUpClose} className="px-6 py-2">
                        Close
                    </Button>
                    <Button
                        onClick={handleTopUpSubmit}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                        disabled={!topUpAmount}
                    >
                        Top-Up
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};