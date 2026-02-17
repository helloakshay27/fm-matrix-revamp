import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment
} from '@mui/material';
import {
    Close,
    Add,
    Delete,
    Search,
    MoreVert
} from '@mui/icons-material';
import { RefreshCcw, ShoppingCart, Package, Calendar, FileText } from 'lucide-react';

// Section component - matching SalesOrderCreatePage style
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="bg-card rounded-lg border border-border shadow-sm mt-6">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </section>
);

interface Customer {
    id: string;
    name: string;
    email: string;
}

interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface BulkItem {
    id: string;
    name: string;
    rate: number;
    sku?: string;
}

export const RecurringInvoicesCreatePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'New Recurring Invoice';
    }, []);

    // Customer data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Recurring Invoice Details
    const [profileName, setProfileName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [repeatEvery, setRepeatEvery] = useState('Week');
    const [startOn, setStartOn] = useState('');
    const [endsOn, setEndsOn] = useState('');
    const [neverExpires, setNeverExpires] = useState(true);
    const [paymentTerms, setPaymentTerms] = useState('Net 45');
    const [salesperson, setSalesperson] = useState('');
    const [associateProjects, setAssociateProjects] = useState('There are no active projects for this customer.');
    const [subject, setSubject] = useState('');

    // Items
    const [items, setItems] = useState<Item[]>([
        {
            id: Date.now().toString(),
            name: '',
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }
    ]);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
    const [taxType, setTaxType] = useState('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);
    const [adjustmentLabel, setAdjustmentLabel] = useState('aaaa');

    // Notes
    const [customerNotes, setCustomerNotes] = useState('Thanks for your business.');
    const [termsAndConditions, setTermsAndConditions] = useState('');

    // Add Items in Bulk Modal
    const [bulkItemsModalOpen, setBulkItemsModalOpen] = useState(false);
    const [bulkSearchQuery, setBulkSearchQuery] = useState('');
    const [selectedBulkItems, setSelectedBulkItems] = useState<string[]>([]);

    // Dropdowns data
    const [itemOptions, setItemOptions] = useState<BulkItem[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    const [taxOptions, setTaxOptions] = useState<{ id: string; name: string }[]>([]);
    const [paymentTermsOptions] = useState(['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt']);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fieldStyles = {
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: '10px 12px',
        },
    };

    // Generate auto order number and set default date
    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        setStartOn(formattedDate);
    }, []);

    // Fetch customers, items, etc.
    useEffect(() => {
        setCustomers([
            { id: '1', name: 'Lockated', email: 'contact@lockated.com' },
            { id: '2', name: 'Gurughar', email: 'contact@gurughar.com' }
        ]);

        setItemOptions([
            { id: '1', name: 'Cement', rate: 300, sku: '100' },
            { id: '2', name: 'Cement Kg', rate: 500, sku: '100' },
            { id: '3', name: 'FM SASS', rate: 25000 }
        ]);

        setSalespersons([
            { id: '1', name: 'Rajesh Kumar' },
            { id: '2', name: 'Priya Sharma' }
        ]);

        setTaxOptions([
            { id: '1', name: 'GST 18%' },
            { id: '2', name: 'GST 12%' },
            { id: '3', name: 'GST 5%' }
        ]);
    }, []);

    // Calculate item amount
    const calculateItemAmount = (quantity: number, rate: number): number => {
        return quantity * rate;
    };

    // Update item
    const updateItem = (index: number, field: keyof Item, value: string | number) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            newItems[index].amount = calculateItemAmount(newItems[index].quantity, newItems[index].rate);
            return newItems;
        });
    };

    // Add item row
    const addItem = () => {
        setItems(prev => [...prev, {
            id: Date.now().toString(),
            name: '',
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }]);
    };

    // Remove item
    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Handle bulk item selection
    const toggleBulkItem = (itemId: string) => {
        setSelectedBulkItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    // Add selected bulk items
    const handleAddBulkItems = () => {
        const newItems = itemOptions
            .filter(opt => selectedBulkItems.includes(opt.id))
            .map(opt => ({
                id: Date.now().toString() + Math.random(),
                name: opt.name,
                description: '',
                quantity: 1,
                rate: opt.rate,
                amount: opt.rate
            }));
        
        setItems(prev => [...prev, ...newItems]);
        setSelectedBulkItems([]);
        setBulkItemsModalOpen(false);
    };

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = discountType === 'percentage' ? (subTotal * discountOnTotal) / 100 : discountOnTotal;
    const afterDiscount = subTotal - discountAmount;
    const taxAmount = 0; // TDS/TCS calculation
    const roundOff = 0; // No rounding by default
    const totalAmount = afterDiscount - taxAmount + adjustment;

    // Filtered bulk items based on search
    const filteredBulkItems = itemOptions.filter(item =>
        item.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
        (item.sku && item.sku.includes(bulkSearchQuery))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CircularProgress size={60} />
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold ml-6 mt-5">New Recurring Invoice</h1>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Customer Information Section */}
                <Section title="Customer Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        {/* Customer Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Customer Name<span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <FormControl fullWidth error={false}>
                                        <Select
                                            value={selectedCustomer?.id || ''}
                                            onChange={(e) => {
                                                const customer = customers.find(c => c.id === e.target.value);
                                                setSelectedCustomer(customer || null);
                                            }}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" disabled>Select Customer</MenuItem>
                                            {customers.map((customer) => (
                                                <MenuItem key={customer.id} value={customer.id}>
                                                    {customer.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            borderRadius: 1
                                        }}
                                    >
                                        <Search fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Recurring Invoice Details Section */}
                <Section title="Recurring Invoice Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="space-y-6">
                        {/* Profile Name & Order Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Profile Name<span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    fullWidth
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    sx={fieldStyles}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Order Number
                                </label>
                                <TextField
                                    fullWidth
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    sx={fieldStyles}
                                />
                            </div>
                        </div>

                        {/* Repeat Every & Start/End Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Repeat Every<span className="text-red-500">*</span>
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={repeatEvery}
                                        onChange={(e) => setRepeatEvery(e.target.value)}
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="Day">Day</MenuItem>
                                        <MenuItem value="Week">Week</MenuItem>
                                        <MenuItem value="Month">Month</MenuItem>
                                        <MenuItem value="Year">Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Start On
                                </label>
                                <TextField
                                    fullWidth
                                    type="text"
                                    placeholder="dd/MM/yyyy"
                                    value={startOn}
                                    onChange={(e) => setStartOn(e.target.value)}
                                    sx={fieldStyles}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Ends On
                                </label>
                                <TextField
                                    fullWidth
                                    type="text"
                                    placeholder="dd/MM/yyyy"
                                    value={endsOn}
                                    onChange={(e) => setEndsOn(e.target.value)}
                                    disabled={neverExpires}
                                    sx={fieldStyles}
                                />
                            </div>
                            <div>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={neverExpires}
                                            onChange={(e) => setNeverExpires(e.target.checked)}
                                            sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }}
                                        />
                                    }
                                    label="Never Expires"
                                />
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Payment Terms
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={paymentTerms}
                                        onChange={(e) => setPaymentTerms(e.target.value)}
                                        sx={fieldStyles}
                                    >
                                        {paymentTermsOptions.map(term => (
                                            <MenuItem key={term} value={term}>{term}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {/* Salesperson */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Salesperson
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={salesperson}
                                        onChange={(e) => setSalesperson(e.target.value)}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select or Add Salesperson</MenuItem>
                                        {salespersons.map(person => (
                                            <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {/* Associate Projects */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Associate Project(s) Hours
                            </label>
                            <TextField
                                fullWidth
                                value={associateProjects}
                                disabled
                                sx={{
                                    ...fieldStyles,
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: '#6b7280',
                                        fontStyle: 'italic'
                                    }
                                }}
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Subject
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Let your customer know what this Recurring Invoice is for"
                            />
                        </div>
                    </div>
                </Section>

                {/* Item Table Section */}
                <Section title="Item Table" icon={<ShoppingCart className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Item Details
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Rate
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs">📦</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Type or click to select an item."
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={item.name}
                                                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="number"
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                                                    min="1"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={item.rate}
                                                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {item.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <IconButton size="small" onClick={() => {}}>
                                                        <MoreVert fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeItem(index)}
                                                        disabled={items.length === 1}
                                                    >
                                                        <Close fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <Button
                                startIcon={<Add />}
                                onClick={addItem}
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add New Row
                            </Button>
                            <Button
                                startIcon={<Add />}
                                onClick={() => setBulkItemsModalOpen(true)}
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full md:w-96 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="font-semibold">{subTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Discount</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                            value={discountOnTotal}
                                            onChange={(e) => setDiscountOnTotal(parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                minWidth: '40px',
                                                textTransform: 'none',
                                                fontSize: '12px'
                                            }}
                                        >
                                            %
                                        </Button>
                                        <span className="font-semibold">{discountAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">TDS</span>
                                    <div className="flex items-center gap-2">
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <Select
                                                value={selectedTax}
                                                onChange={(e) => setSelectedTax(e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="">Select a Tax</MenuItem>
                                                {taxOptions.map(tax => (
                                                    <MenuItem key={tax.id} value={tax.id}>{tax.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <span className="font-semibold">- {taxAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                            value={adjustmentLabel}
                                            onChange={(e) => setAdjustmentLabel(e.target.value)}
                                            placeholder="Label"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                            value={adjustment}
                                            onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                                        />
                                        <IconButton size="small">
                                            <span className="text-gray-400">?</span>
                                        </IconButton>
                                        <span className="font-semibold">{adjustment.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Round Off</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{roundOff.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 text-right">(No Rounding)</div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-base">Total ( ₹ )</span>
                                    <span className="font-bold text-lg">{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Customer Notes Section */}
                <Section title="Customer Notes" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Enter any notes for the customer"
                    />
                </Section>

                {/* Terms & Conditions Section */}
                <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={termsAndConditions}
                        onChange={(e) => setTermsAndConditions(e.target.value)}
                        placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                    />
                </Section>

                {/* Payment Gateway Promotion */}
                <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Want to get paid faster?</span>
                                <span className="text-xl">💳</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Configure payment gateways and receive payments online.{' '}
                                <a href="#" className="text-blue-600 hover:underline">Set up Payment Gateway</a>
                            </p>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 text-xs">💎</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            Introducing <strong>Zoho Payments</strong>, our unified payment solution designed to work seamlessly
                                            with your business apps. Set up now and manage payments, refunds, and disputes
                                            effortlessly. <a href="#" className="text-blue-600 hover:underline">View Platform Fee Details</a>
                                        </p>
                                    </div>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            bgcolor: '#2563eb',
                                            '&:hover': { bgcolor: '#1d4ed8' }
                                        }}
                                    >
                                        Set Up Now
                                    </Button>
                                    <IconButton size="small">
                                        <Close fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Preferences :</span>
                        <FormControlLabel
                            control={<Checkbox defaultChecked size="small" />}
                            label={<span className="text-sm text-gray-600">Create Invoices as Drafts</span>}
                        />
                        <IconButton size="small">
                            <span className="text-gray-400">⚙️</span>
                        </IconButton>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 justify-center pt-6 pb-8">
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        sx={{
                            textTransform: 'none',
                            px: 4,
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.main',
                                color: 'white'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {}}
                        disabled={isSubmitting}
                        sx={{
                            textTransform: 'none',
                            px: 4,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                bgcolor: 'primary.main',
                                color: 'white'
                            }
                        }}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {}}
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 4,
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            },
                            textTransform: 'none'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Save and Send'}
                    </Button>
                </div>
            </div>

            {/* Add Items in Bulk Modal */}
            <Dialog
                open={bulkItemsModalOpen}
                onClose={() => setBulkItemsModalOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                    <div className="flex items-center justify-between">
                        <span>Add Items in Bulk</span>
                        <IconButton onClick={() => setBulkItemsModalOpen(false)} size="small">
                            <Close />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <div className="grid grid-cols-2 min-h-[500px]">
                        {/* Left Panel - Item List */}
                        <div className="border-r border-gray-200 p-4">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type to search or scan the barcode of the item"
                                value={bulkSearchQuery}
                                onChange={(e) => setBulkSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 2 }}
                            />
                            <div className="space-y-2">
                                {filteredBulkItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleBulkItem(item.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                            selectedBulkItems.includes(item.id)
                                                ? 'bg-blue-50 border-blue-300'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-blue-600">{item.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Rate: ₹{item.rate.toFixed(2)}
                                                </div>
                                            </div>
                                            {selectedBulkItems.includes(item.id) && (
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>
                                        {item.sku && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                SKU: {item.sku}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel - Selected Items */}
                        <div className="p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Selected Items</h3>
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium">
                                        {selectedBulkItems.length}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Quantity: <strong>{selectedBulkItems.length}</strong>
                                </div>
                            </div>
                            {selectedBulkItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Click the item names from the left pane to select them
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedBulkItems.map((itemId) => {
                                        const item = itemOptions.find(opt => opt.id === itemId);
                                        return item ? (
                                            <div
                                                key={itemId}
                                                className="p-3 bg-white rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-sm text-gray-600">₹{item.rate.toFixed(2)}</div>
                                                    </div>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleBulkItem(itemId)}
                                                    >
                                                        <Close fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
                    <Button
                        onClick={() => setBulkItemsModalOpen(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddBulkItems}
                        variant="contained"
                        disabled={selectedBulkItems.length === 0}
                        sx={{
                            textTransform: 'none',
                            bgcolor: '#2563eb',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        Add Items
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
