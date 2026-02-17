import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Close,
    CloudUpload
} from '@mui/icons-material';
import { Receipt, FileText } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

// Section component
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="bg-card rounded-lg border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </section>
);

interface AccountLedger {
    id: number;
    name: string;
    formatted_name: string;
    lock_account_group_id: number;
    active: boolean;
}

interface Vendor {
    id: number;
    name: string;
}

export const ExpenseCreatePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'New Expense';
    }, []);

    // Expense data
    const [date, setDate] = useState('');
    const [expenseAccount, setExpenseAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [paidThrough, setPaidThrough] = useState('');
    const [vendor, setVendor] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [description, setDescription] = useState('');
    const [receipts, setReceipts] = useState<File[]>([]);

    // Dropdowns data
    const [accountLedgers, setAccountLedgers] = useState<AccountLedger[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Fetch account ledgers
    useEffect(() => {
        const fetchAccountLedgers = async () => {
            setIsLoadingAccounts(true);
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
                    const data: AccountLedger[] = await response.json();
                    // Filter only active accounts
                    const activeAccounts = data.filter(account => account.active);
                    setAccountLedgers(activeAccounts);
                } else {
                    sonnerToast.error('Failed to fetch account ledgers');
                }
            } catch (error) {
                console.error('Error fetching account ledgers:', error);
                sonnerToast.error('Error loading accounts');
            } finally {
                setIsLoadingAccounts(false);
            }
        };

        fetchAccountLedgers();
    }, []);

    // Fetch vendors
    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoadingVendors(true);
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
                } else {
                    sonnerToast.error('Failed to fetch vendors');
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
                sonnerToast.error('Error loading vendors');
            } finally {
                setIsLoadingVendors(false);
            }
        };

        fetchVendors();
    }, []);

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).slice(0, 10 - receipts.length);
            setReceipts(prev => [...prev, ...newFiles]);
        }
    };

    // Remove receipt
    const removeReceipt = (index: number) => {
        setReceipts(prev => prev.filter((_, i) => i !== index));
    };

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!date) newErrors.date = 'Date is required';
        if (!expenseAccount) newErrors.expenseAccount = 'Expense account is required';
        if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valid amount is required';
        if (!paidThrough) newErrors.paidThrough = 'Paid through is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const organizationId = localStorage.getItem('organization_id') || '1';

            const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

            const expenseData = {
                expense: {
                    account_id: parseInt(expenseAccount),
                    paid_through_account_id: parseInt(paidThrough),
                    date: date,
                    amount: parseFloat(amount),
                    reference_number: referenceNumber,
                    description: description,
                    organization_id: parseInt(organizationId),
                    customer_id: null, // Blank for now as per requirement
                    vendor_id: vendor ? parseInt(vendor) : null
                }
            };

            console.log('Submitting expense:', expenseData);

            const response = await fetch(`${apiUrl}/expenses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseData)
            });

            if (response.ok) {
                const result = await response.json();
                sonnerToast.success('Expense created successfully!');
                navigate('/accounting/expense');
            } else {
                const errorData = await response.json();
                sonnerToast.error(errorData.message || 'Failed to create expense');
            }
        } catch (error) {
            console.error('Error creating expense:', error);
            sonnerToast.error('Failed to create expense. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 relative">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">Creating expense...</div>
                </div>
            )}

            <header className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4">
                <div>
                    <h1 className="text-2xl font-bold">New Expense</h1>
                    <p className="text-sm text-muted-foreground mt-1">Create a new expense record</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/accounting/expense')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </header>

            <div className="space-y-6">
                {/* Expense Details Section */}
                <Section title="Expense Details" icon={<Receipt className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                error={!!errors.date}
                                helperText={errors.date}
                                sx={fieldStyles}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Expense Account<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.expenseAccount}>
                                <Select
                                    value={expenseAccount}
                                    onChange={(e) => setExpenseAccount(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                    disabled={isLoadingAccounts}
                                >
                                    <MenuItem value="" disabled>
                                        {isLoadingAccounts ? 'Loading accounts...' : 'Select an account'}
                                    </MenuItem>
                                    {accountLedgers.map((account) => (
                                        <MenuItem key={account.id} value={account.id.toString()}>
                                            {account.formatted_name || account.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Amount<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                error={!!errors.amount}
                                helperText={errors.amount}
                                sx={fieldStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FormControl variant="standard" sx={{ minWidth: 60 }}>
                                                <Select
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                    disableUnderline
                                                >
                                                    <MenuItem value="INR">INR</MenuItem>
                                                    <MenuItem value="USD">USD</MenuItem>
                                                    <MenuItem value="EUR">EUR</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </InputAdornment>
                                    )
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Paid Through<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.paidThrough}>
                                <Select
                                    value={paidThrough}
                                    onChange={(e) => setPaidThrough(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                    disabled={isLoadingAccounts}
                                >
                                    <MenuItem value="" disabled>
                                        {isLoadingAccounts ? 'Loading accounts...' : 'Select an account'}
                                    </MenuItem>
                                    {accountLedgers.map((account) => (
                                        <MenuItem key={account.id} value={account.id.toString()}>
                                            {account.formatted_name || account.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Vendor
                            </label>
                            <FormControl fullWidth>
                                <Select
                                    value={vendor}
                                    onChange={(e) => setVendor(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                    disabled={isLoadingVendors}
                                >
                                    <MenuItem value="">
                                        {isLoadingVendors ? 'Loading vendors...' : 'Select a vendor'}
                                    </MenuItem>
                                    {vendors.map((v) => (
                                        <MenuItem key={v.id} value={v.id.toString()}>
                                            {v.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Reference #
                            </label>
                            <TextField
                                fullWidth
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Enter reference number"
                                sx={fieldStyles}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description"
                            />
                        </div>
                    </div>
                </Section>

                {/* Receipts Section */}
                <Section title="Receipts" icon={<FileText className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                    <CloudUpload className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Drag or Drop your Receipts
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maximum file size allowed is 10MB
                                    </p>
                                </div>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        📤 Upload your Files
                                    </span>
                                </label>
                            </div>
                        </div>

                        {receipts.length > 0 && (
                            <div className="space-y-2">
                                {receipts.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeReceipt(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Section>
            </div>
        </div>
    );
};
