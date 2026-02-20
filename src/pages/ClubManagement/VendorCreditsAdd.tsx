import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Delete,
    Search
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';

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

interface Customer {
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

export const VendorCreditsAdd: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'New Vendor Credits';
    }, []);

    // Vendor data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Vendor Credit Details
    const [creditNoteNumber, setCreditNoteNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [creditNoteDate, setCreditNoteDate] = useState('');
    const [subject, setSubject] = useState('');

    // Items
    const [items, setItems] = useState<Item[]>([
        {
            id: Date.now().toString(),
            name: '',
            account: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }
    ]);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);

    // Notes
    const [notes, setNotes] = useState('');

    // Dropdowns data
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [salespersons] = useState<{ id: string; name: string }[]>([]);
    const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [accountOptions] = useState(['Sales', 'Services', 'Consulting', 'Other Income']);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Generate auto credit note number and set today's date
    useEffect(() => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        setCreditNoteNumber(`CN-${timestamp.toString().slice(-5)}${random}`);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setCreditNoteDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Fetch mock data
    useEffect(() => {
        setCustomers([
            { id: '1', name: 'Lockated', email: 'contact@lockated.com', currency: 'INR' },
            { id: '2', name: 'Gurughar', email: 'info@gurughar.com', currency: 'INR' }
        ]);

        setItemOptions([
            { id: '1', name: 'Cement', rate: 500 },
            { id: '2', name: 'Steel', rate: 800 },
            { id: '3', name: 'Bricks', rate: 10 },
            { id: '4', name: 'Paint', rate: 350 }
        ]);

        setTaxOptions([
            { id: '1', name: 'GST 18%', rate: 18 },
            { id: '2', name: 'GST 12%', rate: 12 },
            { id: '3', name: 'GST 5%', rate: 5 },
            { id: '4', name: 'No Tax', rate: 0 }
        ]);
    }, []);

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
        if (!selectedCustomer) newErrors.customer = 'Vendor Name is required';
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
            console.error('Error submitting credit note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 relative">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CircularProgress size={60} />
                </div>
            )}

            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Vendor Credits</h1>
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
                                    <FormControl fullWidth error={!!errors.customer}>
                                        <Select
                                            value={selectedCustomer?.id || ''}
                                            onChange={(e) => {
                                                const c = customers.find(x => x.id === e.target.value);
                                                setSelectedCustomer(c || null);
                                                if (c) setErrors(prev => ({ ...prev, customer: '' }));
                                            }}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" disabled>Select a Vendor</MenuItem>
                                            {customers.map(c => (
                                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1 }}>
                                        <Search fontSize="small" />
                                    </IconButton>
                                </div>
                                {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
                            </div>
                        </div>

                        {/* Credit Note # and Reference # */}
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

                        {/* Credit Note Date */}
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

