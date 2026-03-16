import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel
} from '@mui/material';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {
    Close,
    CloudUpload,
    Search
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
    const [expenseType, setExpenseType] = useState<'goods' | 'services'>('goods');
    const [hsnCode, setHsnCode] = useState('');
    const [sacCode, setSacCode] = useState('');
    const [vendor, setVendor] = useState('');
    const [gstTreatment, setGstTreatment] = useState('');
    const [sourceOfSupply, setSourceOfSupply] = useState('');
    const [destinationOfSupply, setDestinationOfSupply] = useState('');
    const [reverseCharge, setReverseCharge] = useState(false);
    const [taxId, setTaxId] = useState('');
    const [amountIs, setAmountIs] = useState<'inclusive' | 'exclusive'>('exclusive');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [customer, setCustomer] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [description, setDescription] = useState('');
    const [receipts, setReceipts] = useState<File[]>([]);

    // reporting tags modal
    const [showTagModal, setShowTagModal] = useState(false);
    const [reportingTagAccount, setReportingTagAccount] = useState('');

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
        // optionally validate HSN/SAC codes depending on type
        if (expenseType === 'goods' && !hsnCode) newErrors.hsnCode = 'HSN code is required for goods';
        if (expenseType === 'services' && !sacCode) newErrors.sacCode = 'SAC code is required for services';
        if (!gstTreatment) newErrors.gstTreatment = 'GST treatment is required';
        if (!sourceOfSupply) newErrors.sourceOfSupply = 'Source of supply is required';
        if (!destinationOfSupply) newErrors.destinationOfSupply = 'Destination of supply is required';
        if (!taxId) newErrors.taxId = 'Tax selection is required';
        if (!invoiceNumber) newErrors.invoiceNumber = 'Invoice number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // clear irrelevant code when expense type changes
    useEffect(() => {
        if (expenseType === 'goods') {
            setSacCode('');
        } else {
            setHsnCode('');
        }
        // also clear any related errors
        setErrors(prev => {
            const copy = { ...prev };
            delete copy.hsnCode;
            delete copy.sacCode;
            return copy;
        });
    }, [expenseType]);

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
                    customer_id: customer ? parseInt(customer) : null,
                    vendor_id: vendor ? parseInt(vendor) : null
                    ,
                    expense_type: expenseType,
                    hsn_code: expenseType === 'goods' ? hsnCode : null,
                    sac_code: expenseType === 'services' ? sacCode : null,
                    gst_treatment: gstTreatment || null,
                    source_of_supply: sourceOfSupply || null,
                    destination_of_supply: destinationOfSupply || null,
                    reverse_charge: reverseCharge,
                    tax_id: taxId || null,
                    amount_is: amountIs,
                    invoice_number: invoiceNumber,
                    notes: notes,
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

                        {/* Expense type radio and conditional codes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Expense Type
                            </label>
                            <RadioGroup
                                row
                                value={expenseType}
                                onChange={(e) => setExpenseType(e.target.value as 'goods' | 'services')}
                            >
                                <FormControlLabel value="goods" control={<Radio />} label="Goods" />
                                <FormControlLabel value="services" control={<Radio />} label="Services" />
                            </RadioGroup>
                        </div>

                        {expenseType === 'goods' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    HSN Code <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    fullWidth
                                    value={hsnCode}
                                    onChange={(e) => setHsnCode(e.target.value)}
                                    placeholder="Enter HSN code"
                                    error={!!errors.hsnCode}
                                    helperText={errors.hsnCode}
                                />
                            </div>
                        )}

                        {expenseType === 'services' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    SAC Code <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    fullWidth
                                    value={sacCode}
                                    onChange={(e) => setSacCode(e.target.value)}
                                    placeholder="Enter SAC code"
                                    error={!!errors.sacCode}
                                    helperText={errors.sacCode}
                                />
                            </div>
                        )}

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

                        {/* Additional tax/GST fields */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                GST Treatment<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.gstTreatment}>
                                <Select
                                    value={gstTreatment}
                                    onChange={(e) => setGstTreatment(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>
                                        Select treatment
                                    </MenuItem>
                                    {/* TODO: populate with real options */}
                                    <MenuItem value="taxable">Taxable</MenuItem>
                                    <MenuItem value="exempt">Exempt</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Source of Supply<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.sourceOfSupply}>
                                <Select
                                    value={sourceOfSupply}
                                    onChange={(e) => setSourceOfSupply(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>
                                        State/Province
                                    </MenuItem>
                                    {/* placeholder states */}
                                    <MenuItem value="MH">[MH] - Maharashtra</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Destination of Supply<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.destinationOfSupply}>
                                <Select
                                    value={destinationOfSupply}
                                    onChange={(e) => setDestinationOfSupply(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>
                                        Select destination
                                    </MenuItem>
                                    <MenuItem value="MH">[MH] - Maharashtra</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="reverseCharge"
                                checked={reverseCharge}
                                onChange={(e) => setReverseCharge(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="reverseCharge" className="text-sm">
                                This transaction is applicable for reverse charge
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tax
                            </label>
                            <FormControl fullWidth error={!!errors.taxId}>
                                <Select
                                    value={taxId}
                                    onChange={(e) => setTaxId(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>
                                        Select a Tax
                                    </MenuItem>
                                    {/* TODO: populate dynamic tax options */}
                                    <MenuItem value="1">GST 5%</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Amount Is
                            </label>
                            <RadioGroup
                                row
                                value={amountIs}
                                onChange={(e) => setAmountIs(e.target.value as 'inclusive' | 'exclusive')}
                            >
                                <FormControlLabel value="inclusive" control={<Radio />} label="Tax Inclusive" />
                                <FormControlLabel value="exclusive" control={<Radio />} label="Tax Exclusive" />
                            </RadioGroup>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Invoice#<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                placeholder="Enter invoice number"
                                error={!!errors.invoiceNumber}
                                helperText={errors.invoiceNumber}
                                sx={fieldStyles}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Notes
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Max. 500 characters"
                            />
                        </div>

                        {/* Customer selection (optional) with reporting tags link */}
                        <div className="md:col-span-2 flex items-start gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">
                                    Customer Name
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={customer}
                                        onChange={(e) => setCustomer(e.target.value)}
                                        displayEmpty
                                        sx={fieldStyles}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton size="small">
                                                    <Search fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="">
                                            Select or add a customer
                                        </MenuItem>
                                        {/* TODO: populate customer list */}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-2">
                                    Reporting Tags
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                    onClick={() => setShowTagModal(true)}
                                >
                                    Associate Tags
                                </button>
                            </div>
                        </div>

                        {/* <div>
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
                        </div> */}

                        {/* <div className="md:col-span-2">
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
                        </div> */}
                    </div>
                </Section>

                {/* reporting tags modal */}
                <Dialog
                    open={showTagModal}
                    onClose={() => setShowTagModal(false)}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle className="flex items-center justify-between">
                        <span>Associate Tags</span>
                        <IconButton size="small" onClick={() => setShowTagModal(false)}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <FormControl fullWidth size="small">
                            <InputLabel id="tag-account-label">Accounts</InputLabel>
                            <Select
                                labelId="tag-account-label"
                                value={reportingTagAccount}
                                label="Accounts"
                                onChange={(e) => setReportingTagAccount(e.target.value)}
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="">None</MenuItem>
                                {/* TODO: populate real tag accounts */}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowTagModal(false)}
                            size="small"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                console.log('selected tag account', reportingTagAccount);
                                setShowTagModal(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

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
