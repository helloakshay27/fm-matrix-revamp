import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField,
    Button,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    CircularProgress,
    Divider,
    InputAdornment
} from '@mui/material';
import {
    Close,
    Add,
    Search
} from '@mui/icons-material';
import { Package, Calendar, FileText } from 'lucide-react';

// Section component - matching PatrollingCreatePage style
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

interface Vendor {
    id: string;
    name: string;
    email: string;
    currency: string;
}

interface Item {
    id: string;
    name: string;
    account: string;
    quantity: number;
    rate: number;
    amount: number;
}

// Dummy vendor credit data keyed by ID
const DUMMY_VENDOR_CREDITS: Record<string, {
    vendor: Vendor;
    creditNoteNumber: string;
    orderNumber: string;
    creditNoteDate: string;
    subject: string;
    items: Item[];
    discountOnTotal: number;
    taxType: 'TDS' | 'TCS';
    selectedTax: string;
    adjustment: number;
    notes: string;
}> = {
    '1': {
        vendor: { id: '1', name: 'Lockated', email: 'contact@lockated.com', currency: 'INR' },
        creditNoteNumber: 'VC-10045',
        orderNumber: 'ORD-2024-001',
        creditNoteDate: '2026-02-10',
        subject: 'Vendor credit for returned materials - PO #PO-1023',
        items: [
            { id: '101', name: 'Cement', account: 'Sales', quantity: 10, rate: 500, amount: 5000 },
            { id: '102', name: 'Steel', account: 'Services', quantity: 2, rate: 800, amount: 1600 },
        ],
        discountOnTotal: 5,
        taxType: 'TDS',
        selectedTax: 'GST 18%',
        adjustment: -100,
        notes: 'Credit issued for materials returned due to quality issues. Reference PO #PO-1023.',
    },
    '2': {
        vendor: { id: '2', name: 'Gurughar', email: 'info@gurughar.com', currency: 'INR' },
        creditNoteNumber: 'VC-10046',
        orderNumber: 'ORD-2024-002',
        creditNoteDate: '2026-02-15',
        subject: 'Credit adjustment for overbilling on invoice #INV-2045',
        items: [
            { id: '201', name: 'Paint', account: 'Consulting', quantity: 5, rate: 350, amount: 1750 },
            { id: '202', name: 'Bricks', account: 'Other Income', quantity: 100, rate: 10, amount: 1000 },
        ],
        discountOnTotal: 0,
        taxType: 'TCS',
        selectedTax: 'GST 12%',
        adjustment: 0,
        notes: 'Credit note raised due to overbilling discrepancy.',
    },
};

export const VendorCreditsEdit: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Loading states
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Vendor data
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    // Vendor Credit Details
    const [creditNoteNumber, setCreditNoteNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [creditNoteDate, setCreditNoteDate] = useState('');
    const [subject, setSubject] = useState('');

    // Items
    const [items, setItems] = useState<Item[]>([]);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);

    // Notes
    const [notes, setNotes] = useState('');

    // Dropdown options
    const [itemOptions] = useState<{ id: string; name: string; rate: number }[]>([
        { id: '1', name: 'Cement', rate: 500 },
        { id: '2', name: 'Steel', rate: 800 },
        { id: '3', name: 'Bricks', rate: 10 },
        { id: '4', name: 'Paint', rate: 350 }
    ]);
    const [taxOptions] = useState<{ id: string; name: string; rate: number }[]>([
        { id: '1', name: 'GST 18%', rate: 18 },
        { id: '2', name: 'GST 12%', rate: 12 },
        { id: '3', name: 'GST 5%', rate: 5 },
        { id: '4', name: 'No Tax', rate: 0 }
    ]);
    const [accountOptions] = useState(['Sales', 'Services', 'Consulting', 'Other Income']);

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Fetch vendor credit by ID (dummy)
    useEffect(() => {
        document.title = 'Edit Vendor Credit';

        setVendors([
            { id: '1', name: 'Lockated', email: 'contact@lockated.com', currency: 'INR' },
            { id: '2', name: 'Gurughar', email: 'info@gurughar.com', currency: 'INR' }
        ]);

        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const recordId = id ?? '1';
            const data = DUMMY_VENDOR_CREDITS[recordId] ?? DUMMY_VENDOR_CREDITS['1'];

            setSelectedVendor(data.vendor);
            setCreditNoteNumber(data.creditNoteNumber);
            setOrderNumber(data.orderNumber);
            setCreditNoteDate(data.creditNoteDate);
            setSubject(data.subject);
            setItems(data.items);
            setDiscountOnTotal(data.discountOnTotal);
            setTaxType(data.taxType);
            setSelectedTax(data.selectedTax);
            setAdjustment(data.adjustment);
            setNotes(data.notes);

            setIsFetching(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [id]);

    // Calculate item amount
    const calculateAmount = (quantity: number, rate: number) => quantity * rate;

    // Update item
    const updateItem = (index: number, field: keyof Item, value: string | number) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            newItems[index].amount = calculateAmount(newItems[index].quantity, newItems[index].rate);
            return newItems;
        });
    };

    // Add item row
    const addItem = () => {
        setItems(prev => [...prev, {
            id: Date.now().toString(),
            name: '',
            account: '',
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

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalDiscount = (subTotal * discountOnTotal) / 100;
    const afterDiscount = subTotal - totalDiscount;
    const totalAmount = afterDiscount + adjustment;

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!selectedVendor) newErrors.vendor = 'Vendor Name is required';
        if (!creditNoteDate) newErrors.creditNoteDate = 'Vendor Credit Date is required';
        const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
        if (!hasValidItems) newErrors.items = 'At least one valid item is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (status: 'draft' | 'open') => {
        if (status === 'open' && !validate()) return;
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate(-1);
        } catch (error) {
            console.error('Error updating vendor credit:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <CircularProgress size={48} />
                    <p className="text-muted-foreground text-sm">Loading vendor credit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 relative">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CircularProgress size={60} />
                </div>
            )}

            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Edit Vendor Credit</h1>
                    <p className="text-sm text-muted-foreground mt-1">{creditNoteNumber}</p>
                </div>
            </header>

            <div className="space-y-6">
                {/* Vendor Credit Details */}
                <Section title="Vendor Credit Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="space-y-6">
                        {/* Vendor Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vendor Name<span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <FormControl fullWidth error={!!errors.vendor}>
                                        <Select
                                            value={selectedVendor?.id || ''}
                                            onChange={(e) => {
                                                const v = vendors.find(x => x.id === e.target.value);
                                                setSelectedVendor(v || null);
                                                if (v) setErrors(prev => ({ ...prev, vendor: '' }));
                                            }}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" disabled>Select a Vendor</MenuItem>
                                            {vendors.map(v => (
                                                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1 }}>
                                        <Search fontSize="small" />
                                    </IconButton>
                                </div>
                                {errors.vendor && <p className="text-xs text-red-500 mt-1">{errors.vendor}</p>}
                            </div>
                        </div>

                        {/* Credit Note # and Order Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Credit Note #<span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    fullWidth
                                    value={creditNoteNumber}
                                    onChange={(e) => setCreditNoteNumber(e.target.value)}
                                    sx={fieldStyles}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small">
                                                    <Search fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
                                    placeholder="Enter order number"
                                    sx={fieldStyles}
                                />
                            </div>
                        </div>

                        {/* Vendor Credit Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vendor Credit Date<span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={creditNoteDate}
                                    onChange={(e) => { setCreditNoteDate(e.target.value); setErrors(prev => ({ ...prev, creditNoteDate: '' })); }}
                                    error={!!errors.creditNoteDate}
                                    helperText={errors.creditNoteDate}
                                    sx={fieldStyles}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
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
                                placeholder="Enter a subject within 250 characters"
                            />
                        </div>
                    </div>
                </Section>

                {/* Item Table */}
                <Section title="Item Table" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-4">
                        {errors.items && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.items}</div>
                        )}

                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Item Details</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Account</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Rate</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <FormControl fullWidth sx={{ minWidth: 200 }}>
                                                    <Select
                                                        value={item.name}
                                                        onChange={(e) => {
                                                            const opt = itemOptions.find(o => o.name === e.target.value);
                                                            if (opt) {
                                                                updateItem(index, 'name', opt.name);
                                                                updateItem(index, 'rate', opt.rate);
                                                            } else {
                                                                updateItem(index, 'name', e.target.value);
                                                            }
                                                        }}
                                                        displayEmpty
                                                        size="small"
                                                    >
                                                        <MenuItem value="" disabled>Type or click to select an item.</MenuItem>
                                                        {itemOptions.map(opt => (
                                                            <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </td>
                                            <td className="px-4 py-3">
                                                <FormControl fullWidth sx={{ minWidth: 150 }}>
                                                    <Select
                                                        value={item.account}
                                                        onChange={(e) => updateItem(index, 'account', e.target.value)}
                                                        displayEmpty
                                                        size="small"
                                                    >
                                                        <MenuItem value="" disabled>Select an account</MenuItem>
                                                        {accountOptions.map(acc => (
                                                            <MenuItem key={acc} value={acc}>{acc}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </td>
                                            <td className="px-4 py-3">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                                                    inputProps={{ min: 1, step: 1 }}
                                                    sx={{ width: 80 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.rate}
                                                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                    sx={{ width: 100 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {item.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeItem(index)}
                                                    disabled={items.length === 1}
                                                    color="error"
                                                >
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-3 pt-2">
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
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button>
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end mt-4">
                            <div className="w-full md:w-1/2 space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-muted-foreground">Sub Total</span>
                                    <span className="font-semibold">{subTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-muted-foreground">Discount</span>
                                    <div className="flex items-center gap-2">
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={discountOnTotal}
                                            onChange={(e) => setDiscountOnTotal(parseFloat(e.target.value) || 0)}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                            sx={{ width: 80 }}
                                        />
                                        <span className="text-sm">%</span>
                                        <span className="font-semibold ml-2">{totalDiscount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex flex-wrap items-center gap-3 py-2">
                                    <RadioGroup
                                        row
                                        value={taxType}
                                        onChange={(e) => setTaxType(e.target.value as 'TDS' | 'TCS')}
                                    >
                                        <FormControlLabel
                                            value="TDS"
                                            control={<Radio size="small" sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                            label={<span className="text-sm">TDS</span>}
                                        />
                                        <FormControlLabel
                                            value="TCS"
                                            control={<Radio size="small" sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
                                            label={<span className="text-sm">TCS</span>}
                                        />
                                    </RadioGroup>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <Select
                                            value={selectedTax}
                                            onChange={(e) => setSelectedTax(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Select a Tax</MenuItem>
                                            {taxOptions.map(tax => (
                                                <MenuItem key={tax.id} value={tax.name}>{tax.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <span className="font-semibold">- 0.00</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-muted-foreground">Adjustment</span>
                                    <div className="flex items-center gap-2">
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={adjustment}
                                            onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                                            inputProps={{ step: 0.01 }}
                                            sx={{ width: 120 }}
                                            placeholder="0.00"
                                        />
                                        <span className="font-semibold w-16 text-right">{adjustment.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Divider sx={{ my: 1 }} />

                                <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                    <span className="font-bold text-base">Total ( ₹ )</span>
                                    <span className="font-bold text-primary text-2xl">{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Notes */}
                <Section title="Notes" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Will be displayed on the vendor credit"
                    />
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2 pb-6">
                <Button
                    variant="outlined"
                    onClick={() => handleSubmit('draft')}
                    disabled={isSubmitting}
                    sx={{
                        textTransform: 'none',
                        px: 4,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.main', color: 'white' }
                    }}
                >
                    Save as Draft
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleSubmit('open')}
                    disabled={isSubmitting}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 4,
                        '&:hover': { bgcolor: 'primary.dark' },
                        textTransform: 'none'
                    }}
                >
                    {isSubmitting ? 'Saving...' : 'Save as Open'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    sx={{
                        textTransform: 'none',
                        px: 4,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.main', color: 'white' }
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};
