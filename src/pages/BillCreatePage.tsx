import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Drawer,
    Typography,
    Box,
    Divider,
    Radio,
    RadioGroup,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Close,
    Add,
    Delete,
    CloudUpload,
    AttachFile,
    PersonAdd,
    ChevronRight
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

interface Vendor {
    id: string;
    name: string;
    email: string;
    currency: string;
    billingAddress: string;
    shippingAddress: string;
    vendorType: string;
    paymentTerms: string;
    portalStatus: string;
    language: string;
    outstandingReceivables: number;
    unusedCredits: number;
    contactPersons: ContactPerson[];
}

interface ContactPerson {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
    skype: string;
    designation: string;
    department: string;
}

interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    rate: number;
    discount: number;
    discountType: 'percentage' | 'amount';
    tax: string;
    taxRate: number;
    amount: number;
}

interface ExternalUser {
    name: string;
    email: string;
}

export const BillCreatePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'New Bill';
    }, []);

    // Vendor data
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [loadingVendors, setLoadingVendors] = useState(false);
    const [vendorDrawerOpen, setVendorDrawerOpen] = useState(false);

    // Address
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [sameAsBilling, setSameAsBilling] = useState(false);

    // Bill Details
    const [salesOrderNumber, setBillNumber] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [salesOrderDate, setBillDate] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [salesperson, setSalesperson] = useState('');

    // Items
    const [items, setItems] = useState<Item[]>([
        {
            id: Date.now().toString(),
            name: '',
            description: '',
            quantity: 1,
            rate: 0,
            discount: 0,
            discountType: 'percentage',
            tax: '',
            taxRate: 0,
            amount: 0
        }
    ]);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);

    // Notes & Attachments
    const [vendorNotes, setVendorNotes] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [displayAttachmentsInPortal, setDisplayAttachmentsInPortal] = useState(false);

    // Email Communications
    const [sendEmailToVendor, setSendEmailToVendor] = useState(false);
    const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    // Contact Person Dialog
    const [contactPersonDialogOpen, setContactPersonDialogOpen] = useState(false);
    const [newContactPerson, setNewContactPerson] = useState<ContactPerson>({
        id: '',
        salutation: '',
        firstName: '',
        lastName: '',
        email: '',
        workPhone: '',
        mobile: '',
        skype: '',
        designation: '',
        department: ''
    });

    // Dropdowns data
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Generate auto sales order number
    useEffect(() => {
        const generateOrderNumber = () => {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            setBillNumber(`SO-${timestamp.toString().slice(-5)}${random}`);
        };
        generateOrderNumber();
    }, []);

    // Fetch vendors on mount
    useEffect(() => {
        const fetchVendors = async () => {
            setLoadingVendors(true);
            try {
                // Mock data - replace with actual API call
                const mockVendors: Vendor[] = [
                    {
                        id: '1',
                        name: 'Lockated',
                        email: 'contact@lockated.com',
                        currency: 'INR',
                        billingAddress: '123 Main St, Mumbai, Maharashtra 400001',
                        shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
                        vendorType: 'Business',
                        paymentTerms: 'Due on Receipt',
                        portalStatus: 'Disabled',
                        language: 'English',
                        outstandingReceivables: 0,
                        unusedCredits: 1370,
                        contactPersons: [
                            {
                                id: '1',
                                salutation: 'Mr.',
                                firstName: 'John',
                                lastName: 'Doe',
                                email: 'john@lockated.com',
                                workPhone: '+91 9876543210',
                                mobile: '+91 9876543210',
                                skype: 'john.doe',
                                designation: 'Manager',
                                department: 'Sales'
                            }
                        ]
                    },
                    {
                        id: '2',
                        name: 'Gurughar',
                        email: 'info@gurughar.com',
                        currency: 'INR',
                        billingAddress: '456 Park Ave, Delhi 110001',
                        shippingAddress: '456 Park Ave, Delhi 110001',
                        vendorType: 'Business',
                        paymentTerms: 'Net 30',
                        portalStatus: 'Enabled',
                        language: 'English',
                        outstandingReceivables: 5000,
                        unusedCredits: 0,
                        contactPersons: []
                    }
                ];
                setVendors(mockVendors);
            } catch (error) {
                console.error('Error fetching vendors:', error);
            } finally {
                setLoadingVendors(false);
            }
        };

        fetchVendors();
    }, []);

    // Fetch items, salespersons, taxes
    useEffect(() => {
        // Mock data - replace with actual API calls
        setItemOptions([
            { id: '1', name: 'Cement', rate: 500 },
            { id: '2', name: 'Steel', rate: 800 },
            { id: '3', name: 'Bricks', rate: 10 },
            { id: '4', name: 'Paint', rate: 350 }
        ]);

        setSalespersons([
            { id: '1', name: 'Rajesh Kumar' },
            { id: '2', name: 'Priya Sharma' },
            { id: '3', name: 'Amit Patel' }
        ]);

        setTaxOptions([
            { id: '1', name: 'GST 18%', rate: 18 },
            { id: '2', name: 'GST 12%', rate: 12 },
            { id: '3', name: 'GST 5%', rate: 5 },
            { id: '4', name: 'No Tax', rate: 0 }
        ]);

        // Set default terms and conditions
        setTermsAndConditions('1. Use this to issue for all sales orders of all vendors.\n2. Payment should be made within 30 days of the invoice date.\n3. Late payments may incur additional charges.');
    }, []);

    // When vendor is selected
    useEffect(() => {
        if (selectedVendor) {
            setBillingAddress(selectedVendor.billingAddress);
            setShippingAddress(selectedVendor.shippingAddress);
            setPaymentTerms(selectedVendor.paymentTerms);
        }
    }, [selectedVendor]);

    // Same as billing address
    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [sameAsBilling, billingAddress]);

    // Calculate item amount
    const calculateItemAmount = (item: Item): number => {
        const baseAmount = item.quantity * item.rate;
        const discountAmount = item.discountType === 'percentage'
            ? (baseAmount * item.discount) / 100
            : item.discount;
        const afterDiscount = baseAmount - discountAmount;
        const taxAmount = (afterDiscount * item.taxRate) / 100;
        return afterDiscount + taxAmount;
    };

    // Update item
    const updateItem = (index: number, field: keyof Item, value: string | number | 'percentage' | 'amount') => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };

            // Recalculate amount
            newItems[index].amount = calculateItemAmount(newItems[index]);

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
            discount: 0,
            discountType: 'percentage',
            tax: '',
            taxRate: 0,
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
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalDiscount = (subTotal * discountOnTotal) / 100;
    const afterDiscount = subTotal - totalDiscount;
    const taxAmount = items.reduce((sum, item) => {
        const itemSubtotal = item.quantity * item.rate;
        const itemDiscount = item.discountType === 'percentage'
            ? (itemSubtotal * item.discount) / 100
            : item.discount;
        return sum + ((itemSubtotal - itemDiscount) * item.taxRate / 100);
    }, 0);
    const totalAmount = afterDiscount + taxAmount + adjustment;

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} exceeds 5MB limit`);
                    return false;
                }
                return true;
            });

            if (attachments.length + newFiles.length > 10) {
                alert('Maximum 10 files allowed');
                return;
            }

            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    // Remove attachment
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // Add external user
    const handleAddExternalUser = () => {
        if (newUserName && newUserEmail) {
            setExternalUsers(prev => [...prev, { name: newUserName, email: newUserEmail }]);
            setNewUserName('');
            setNewUserEmail('');
            setAddUserDialogOpen(false);
        }
    };

    // Remove external user
    const removeExternalUser = (index: number) => {
        setExternalUsers(prev => prev.filter((_, i) => i !== index));
    };

    // Add contact person
    const handleAddContactPerson = () => {
        if (selectedVendor && newContactPerson.firstName && newContactPerson.email) {
            const updatedVendor = {
                ...selectedVendor,
                contactPersons: [
                    ...selectedVendor.contactPersons,
                    { ...newContactPerson, id: Date.now().toString() }
                ]
            };
            setSelectedVendor(updatedVendor);
            setVendors(prev => prev.map(c => c.id === updatedVendor.id ? updatedVendor : c));
            setContactPersonDialogOpen(false);
            setNewContactPerson({
                id: '',
                salutation: '',
                firstName: '',
                lastName: '',
                email: '',
                workPhone: '',
                mobile: '',
                skype: '',
                designation: '',
                department: ''
            });
        }
    };

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedVendor) newErrors.vendor = 'Vendor is required';
        if (!salesOrderDate) newErrors.salesOrderDate = 'Sales order date is required';
        if (!expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required';
        if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

        const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
        if (!hasValidItems) newErrors.items = 'At least one valid item is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (!saveAsDraft && !validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                vendorId: selectedVendor?.id,
                salesOrderNumber,
                referenceNumber,
                salesOrderDate,
                expectedDeliveryDate,
                paymentTerms,
                deliveryMethod,
                salesperson,
                billingAddress,
                shippingAddress,
                items: items.filter(item => item.name),
                subTotal,
                discount: totalDiscount,
                taxType,
                selectedTax,
                adjustment,
                totalAmount,
                vendorNotes,
                termsAndConditions,
                attachments: attachments.map(f => f.name),
                sendEmailToVendor,
                externalUsers,
                status: saveAsDraft ? 'draft' : 'confirmed'
            };

            // TODO: Replace with actual API call
            // Example: await salesOrderAPI.create(payload);
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Sales order ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
            navigate('/accounting/bills');
        } catch (error) {
            console.error('Error submitting sales order:', error);
            alert('Failed to create sales order');
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
                <h1 className="text-2xl font-bold">New Bill</h1>
            </header>

            <div className="space-y-6">
                {/* Vendor Section */}
                <Section title="Vendor Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vendor Name<span className="text-red-500">*</span>
                                </label>
                                <FormControl fullWidth error={!!errors.vendor}>
                                    <Select
                                        value={selectedVendor?.id || ''}
                                        onChange={(e) => {
                                            const vendor = vendors.find(c => c.id === e.target.value);
                                            setSelectedVendor(vendor || null);
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select a vendor</MenuItem>
                                        {vendors.map((vendor) => (
                                            <MenuItem key={vendor.id} value={vendor.id}>
                                                {vendor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Currency
                                </label>
                                <TextField
                                    fullWidth
                                    value={selectedVendor?.currency || 'INR'}
                                    disabled
                                    sx={fieldStyles}
                                />
                            </div>
                        </div>

                        {selectedVendor && (
                            <Button
                                variant="outlined"
                                onClick={() => setVendorDrawerOpen(true)}
                                endIcon={<ChevronRight />}
                                sx={{ textTransform: 'none' }}
                            >
                                View Vendor Details
                            </Button>
                        )}
                    </div>
                </Section>

                {/* Address Section */}
                <Section title="Address Details" icon={<FileText className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Billing Address
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={billingAddress}
                                onChange={(e) => setBillingAddress(e.target.value)}
                                placeholder="Enter billing address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Shipping Address
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter shipping address"
                                disabled={sameAsBilling}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sameAsBilling}
                                        onChange={(e) => setSameAsBilling(e.target.checked)}
                                    />
                                }
                                label="Same as Billing Address"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </Section>

                {/* Bill Details */}
                <Section title="Bill Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bill #<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                value={salesOrderNumber}
                                disabled
                                sx={fieldStyles}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" title="Refresh">
                                                <FileText className="w-4 h-4" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
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

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bill Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={salesOrderDate}
                                onChange={(e) => setBillDate(e.target.value)}
                                error={!!errors.salesOrderDate}
                                helperText={errors.salesOrderDate}
                                sx={fieldStyles}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Expected Delivery Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={expectedDeliveryDate}
                                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                                error={!!errors.expectedDeliveryDate}
                                helperText={errors.expectedDeliveryDate}
                                sx={fieldStyles}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Payment Terms<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.paymentTerms}>
                                <Select
                                    value={paymentTerms}
                                    onChange={(e) => setPaymentTerms(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>Select payment terms</MenuItem>
                                    <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
                                    <MenuItem value="Net 15">Net 15</MenuItem>
                                    <MenuItem value="Net 30">Net 30</MenuItem>
                                    <MenuItem value="Net 45">Net 45</MenuItem>
                                    <MenuItem value="Net 60">Net 60</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Delivery Method
                            </label>
                            <FormControl fullWidth>
                                <Select
                                    value={deliveryMethod}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>Select a delivery method or type to add</MenuItem>
                                    <MenuItem value="courier">Courier</MenuItem>
                                    <MenuItem value="hand-delivery">Hand Delivery</MenuItem>
                                    <MenuItem value="pickup">Pickup</MenuItem>
                                    <MenuItem value="shipping">Shipping</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

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
                                        <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Discount</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Tax</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <FormControl fullWidth sx={{ minWidth: 250 }}>
                                                    <Select
                                                        value={item.name}
                                                        onChange={(e) => {
                                                            const selectedItem = itemOptions.find(opt => opt.name === e.target.value);
                                                            if (selectedItem) {
                                                                updateItem(index, 'name', selectedItem.name);
                                                                updateItem(index, 'rate', selectedItem.rate);
                                                            }
                                                        }}
                                                        displayEmpty
                                                        size="small"
                                                    >
                                                        <MenuItem value="" disabled>Select an item</MenuItem>
                                                        {itemOptions.map((option) => (
                                                            <MenuItem key={option.id} value={option.name}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    sx={{ mt: 1 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    inputProps={{ min: 1, step: 1 }}
                                                    sx={{ width: 80 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.rate}
                                                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                    sx={{ width: 100 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={item.discount}
                                                        onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                        sx={{ width: 80 }}
                                                    />
                                                    <FormControl size="small" sx={{ width: 80 }}>
                                                        <Select
                                                            value={item.discountType}
                                                            onChange={(e) => updateItem(index, 'discountType', e.target.value)}
                                                        >
                                                            <MenuItem value="percentage">%</MenuItem>
                                                            <MenuItem value="amount">₹</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <FormControl size="small" sx={{ width: 120 }}>
                                                    <Select
                                                        value={item.tax}
                                                        onChange={(e) => {
                                                            const selectedTaxOption = taxOptions.find(t => t.name === e.target.value);
                                                            updateItem(index, 'tax', e.target.value);
                                                            updateItem(index, 'taxRate', selectedTaxOption?.rate || 0);
                                                        }}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="">Select a Tax</MenuItem>
                                                        {taxOptions.map(tax => (
                                                            <MenuItem key={tax.id} value={tax.name}>{tax.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                ₹{item.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeItem(index)}
                                                    disabled={items.length === 1}
                                                    color="error"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                startIcon={<Add />}
                                onClick={addItem}
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add New Row
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* Summary Section */}
                <Section title="Summary" icon={<ShoppingCart className="w-5 h-5" />}>
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-muted-foreground">Sub Total</span>
                                <span className="font-semibold text-base">₹{subTotal.toFixed(2)}</span>
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
                                    <span className="font-semibold text-base text-red-600 ml-2">-₹{totalDiscount.toFixed(2)}</span>
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
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 224,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                },
                                            },
                                            disablePortal: true,
                                        }}
                                    >
                                        <MenuItem value="">Select a Tax</MenuItem>
                                        {taxOptions.map(tax => (
                                            <MenuItem key={tax.id} value={tax.name}>{tax.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <span className="font-semibold text-base text-red-600">-₹{taxAmount.toFixed(2)}</span>
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
                                        sx={{ width: 100 }}
                                    />
                                </div>
                            </div>

                            <Divider sx={{ my: 2 }} />

                            <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                <span className="font-bold text-base">Total ( ₹ )</span>
                                <span className="font-bold text-primary text-2xl">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Vendor Notes */}
                <Section title="Vendor Notes" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={vendorNotes}
                        onChange={(e) => setVendorNotes(e.target.value)}
                        placeholder="Enter any notes for the vendor"
                    />
                </Section>

                {/* Terms & Conditions */}
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

                {/* Attachments */}
                <Section title="Attach Files to Bill" icon={<AttachFile className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <CloudUpload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <Typography variant="body1" className="text-gray-700 font-semibold">
                                    Upload File
                                </Typography>
                                <Typography variant="body2" className="text-gray-500 mt-1">
                                    You can upload a maximum of 10 files, 5MB each
                                </Typography>
                            </label>
                        </div>

                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <div className="flex items-center gap-2">
                                            <AttachFile fontSize="small" />
                                            <span className="text-sm">{file.name}</span>
                                            <span className="text-xs text-gray-500">
                                                ({(file.size / 1024).toFixed(2)} KB)
                                            </span>
                                        </div>
                                        <IconButton size="small" onClick={() => removeAttachment(index)}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={displayAttachmentsInPortal}
                                    onChange={(e) => setDisplayAttachmentsInPortal(e.target.checked)}
                                />
                            }
                            label="Display attachments in vendor portal and emails"
                        />
                    </div>
                </Section>

                {/* Email Communications */}
                <Section title="Email Communications" icon={<FileText className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendEmailToVendor}
                                    onChange={(e) => setSendEmailToVendor(e.target.checked)}
                                />
                            }
                            label="Send email to selected vendor above"
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="body2" className="font-semibold">
                                    Add external users (email users other than the selected vendor above)
                                </Typography>
                                <Button
                                    startIcon={<PersonAdd />}
                                    onClick={() => setAddUserDialogOpen(true)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Add More
                                </Button>
                            </div>

                            {externalUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {externalUsers.map((user, index) => (
                                        <Chip
                                            key={index}
                                            label={`${user.name} (${user.email})`}
                                            onDelete={() => removeExternalUser(index)}
                                            variant="outlined"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Additional Fields */}
                <Section title="Additional Custom Fields" icon={<FileText className="w-5 h-5" />}>
                    <Typography variant="body2" className="text-gray-600">
                        Add custom fields to your sales orders by going to Settings → Sales → Bills → Field Customization
                    </Typography>
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button
                    variant="outlined"
                    onClick={() => navigate('/accounting/bills')}
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
                    onClick={() => handleSubmit(true)}
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
                    onClick={() => handleSubmit(false)}
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

            {/* Vendor Details Drawer */}
            <Drawer
                anchor="right"
                open={vendorDrawerOpen}
                onClose={() => setVendorDrawerOpen(false)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 } } }}
            >
                {selectedVendor && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">
                                        {selectedVendor.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <Typography variant="h6" className="font-bold">
                                        {selectedVendor.name}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {selectedVendor.email}
                                    </Typography>
                                </div>
                            </div>
                            <IconButton onClick={() => setVendorDrawerOpen(false)}>
                                <Close />
                            </IconButton>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹{selectedVendor.outstandingReceivables.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    Outstanding Receivables
                                </Typography>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹{selectedVendor.unusedCredits.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    Unused Credits
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <Typography variant="subtitle1" className="font-semibold mb-3">
                                Contact Details
                            </Typography>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vendor Type</span>
                                    <span className="font-semibold">{selectedVendor.vendorType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Currency</span>
                                    <span className="font-semibold">{selectedVendor.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Terms</span>
                                    <span className="font-semibold">{selectedVendor.paymentTerms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Portal Status</span>
                                    <span className="font-semibold">{selectedVendor.portalStatus}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vendor Language</span>
                                    <span className="font-semibold">{selectedVendor.language}</span>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Typography variant="subtitle1" className="font-semibold">
                                    Contact Persons
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={() => setContactPersonDialogOpen(true)}
                                    variant="outlined"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Add
                                </Button>
                            </div>

                            {selectedVendor.contactPersons.length === 0 ? (
                                <Typography variant="body2" className="text-gray-500">
                                    No contact persons added
                                </Typography>
                            ) : (
                                <div className="space-y-3">
                                    {selectedVendor.contactPersons.map(person => (
                                        <div key={person.id} className="bg-gray-50 rounded-lg p-4">
                                            <Typography variant="body1" className="font-semibold">
                                                {person.salutation} {person.firstName} {person.lastName}
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-600">
                                                {person.email}
                                            </Typography>
                                            {person.designation && (
                                                <Typography variant="body2" className="text-gray-600">
                                                    {person.designation} {person.department && `- ${person.department}`}
                                                </Typography>
                                            )}
                                            <div className="flex gap-3 mt-2">
                                                {person.workPhone && (
                                                    <Typography variant="body2" className="text-gray-600">
                                                        Work: {person.workPhone}
                                                    </Typography>
                                                )}
                                                {person.mobile && (
                                                    <Typography variant="body2" className="text-gray-600">
                                                        Mobile: {person.mobile}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Add External User Dialog */}
            <Dialog open={addUserDialogOpen} onClose={() => setAddUserDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add External User</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-2">
                        <TextField
                            fullWidth
                            label="Name"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddExternalUser} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Add Contact Person Dialog */}
            <Dialog
                open={contactPersonDialogOpen}
                onClose={() => setContactPersonDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add Contact Person</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-3 gap-4">
                            <FormControl fullWidth>
                                <InputLabel>Salutation</InputLabel>
                                <Select
                                    value={newContactPerson.salutation}
                                    onChange={(e) => setNewContactPerson({ ...newContactPerson, salutation: e.target.value })}
                                    label="Salutation"
                                >
                                    <MenuItem value="Mr.">Mr.</MenuItem>
                                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                                    <MenuItem value="Ms.">Ms.</MenuItem>
                                    <MenuItem value="Dr.">Dr.</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={newContactPerson.firstName}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, firstName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={newContactPerson.lastName}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, lastName: e.target.value })}
                            />
                        </div>

                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={newContactPerson.email}
                            onChange={(e) => setNewContactPerson({ ...newContactPerson, email: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                label="Work Phone"
                                value={newContactPerson.workPhone}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, workPhone: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Mobile"
                                value={newContactPerson.mobile}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, mobile: e.target.value })}
                            />
                        </div>

                        <TextField
                            fullWidth
                            label="Skype Name/Number"
                            value={newContactPerson.skype}
                            onChange={(e) => setNewContactPerson({ ...newContactPerson, skype: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                label="Designation"
                                value={newContactPerson.designation}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, designation: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Department"
                                value={newContactPerson.department}
                                onChange={(e) => setNewContactPerson({ ...newContactPerson, department: e.target.value })}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setContactPersonDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddContactPerson} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
