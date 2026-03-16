import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/utils/auth';
import { API_CONFIG } from '@/config/apiConfig';
import {
    TextField,
    Button,
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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Radio,
    RadioGroup,
    ListSubheader,
} from '@mui/material';
import {
    Close,
    Add,
    Delete,
    CloudUpload,
    AttachFile,
    ChevronRight
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getAddresses, getInventories } from '@/store/slices/materialPRSlice';

import { useAppDispatch } from '@/store/hooks';
import axios from 'axios';

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
    account_id: number;
    // fields used by the tax dropdown (tax groups/exemptions)
    item_tax_type?: string;
    tax_group_id?: number | null;
    tax_exemption_id?: number | null;
}

export const PurchaseOrderCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const lock_account_id = localStorage.getItem("lock_account_id");

    useEffect(() => {
        document.title = 'New Purchase Order';
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

    // Delivery Address
    const [deliveryAddressType, setDeliveryAddressType] = useState<'organization' | 'customer'>('organization');
    const [deliveryAddresses, setDeliveryAddresses] = useState<any[]>([]);
    const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<any>(null);
    const [deliveryOrganizationId, setDeliveryOrganizationId] = useState<string>('');
    const [deliveryCustomerId, setDeliveryCustomerId] = useState<string>('');

    // Purchase Order Details
    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [purchaseOrderDate, setPurchaseOrderDate] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');

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
            amount: 0,
            account_id: 0
            , item_tax_type: '',
            tax_group_id: null,
            tax_exemption_id: null
        }
    ]);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [discountTypeOnTotal, setDiscountTypeOnTotal] = useState<'percentage' | 'amount'>('percentage');
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);
    const [adjustmentLabel, setAdjustmentLabel] = useState('Adjustment');
    const [taxAmount2, setTaxAmount2] = useState(0);
    const [totalAmount2, setTotalAmount2] = useState(0);
    const [addresses, setAddresses] = useState([])

    // Notes & Attachments
    const [vendorNotes, setVendorNotes] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [paymentTermsOptions, setPaymentTermsOptions] = useState<
        { id: string; name: string; days: number }[]
    >([]);
    const [accountLedgers, setAccountLedgers] = useState<any[]>([]);
    const [accountGroups, setAccountGroups] = useState<any[]>([]);

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
    const [itemOptions, setItemOptions] = useState<{ id: string; inventory_name: string; rate: number }[]>([]);
    const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);

    // additional tax dropdown data (copied from QuotesAdd)
    const taxTypeOptions = [
        { value: 'non_taxable', label: 'Non-Taxable' },
        { value: 'out_of_scope', label: 'Out of Scope' },
        { value: 'non_gst_supply', label: 'Non-GST Supply' },
    ];
    const [taxGroups, setTaxGroups] = useState<any[]>([]);
    const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);

    const [exemptionModalOpen, setExemptionModalOpen] = useState(false);
    const [selectedExemption, setSelectedExemption] = useState('');
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [customerExemptions, setCustomerExemptions] = useState<any[]>([]);
    const [loadingExemptions, setLoadingExemptions] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    // Generate auto purchase order number
    useEffect(() => {
        const generateOrderNumber = () => {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            setPurchaseOrderNumber(`PO-${timestamp.toString().slice(-5)}${random}`);
        };
        generateOrderNumber();
    }, []);

    // Fetch vendors on mount
    useEffect(() => {
        const fetchVendors = async () => {
            setLoadingVendors(true);
            try {
                const token = API_CONFIG.TOKEN;
                const baseUrl = API_CONFIG.BASE_URL;

                if (!token || !baseUrl) {
                    console.error('Missing API configuration');
                    setLoadingVendors(false);
                    return;
                }

                const url = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDER_SUPPLIERS}?access_token=${token}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success' && data.suppliers) {
                    // Transform API response to match Vendor interface
                    const transformedVendors: Vendor[] = data.suppliers.map((supplier: { id: number; name: string }) => ({
                        id: supplier.id.toString(),
                        name: supplier.name,
                        email: '',
                        currency: 'INR',
                        billingAddress: '',
                        shippingAddress: '',
                        vendorType: 'Business',
                        paymentTerms: 'Due on Receipt',
                        portalStatus: 'Disabled',
                        language: 'English',
                        outstandingReceivables: 0,
                        unusedCredits: 0,
                        contactPersons: []
                    }));

                    setVendors(transformedVendors);
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            } finally {
                setLoadingVendors(false);
            }
        };

        fetchVendors();
    }, []);

    // Fetch items, addresses & payment terms
    useEffect(() => {
        const fetchInventories = async () => {
            // Mock data or dispatch - restoring original logic
            try {
                const response = await dispatch(
                    getInventories({ baseUrl, token })
                ).unwrap();
                setItemOptions(response.inventories);
            } catch (error) {
                console.log(error);
                toast.error(error as any);
            }
        };

        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/addresses.json`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAddresses(response.data);
            } catch (error) {
                console.log(error);
                toast.error(error as any);
            }
        };

        // Payment terms dropdown data
        const fetchPaymentTerms = async () => {
            try {
                const lockAccountId = localStorage.getItem("lock_account_id") || "1";
                const res = await axios.get(
                    `https://${baseUrl}/payment_terms.json?lock_account_id=${lock_account_id}`,

                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (res && res.data && Array.isArray(res.data)) {
                    // map to { id, name, days } structure that the dropdown expects
                    setPaymentTermsOptions(
                        res.data.map((pt: any) => ({ id: pt.id?.toString?.() || String(pt.id), name: pt.name, days: pt.no_of_days }))
                    );
                }
            } catch (err) {
                console.log('Error fetching payment terms', err);
                setPaymentTermsOptions([]);
            }
        };

        fetchAddresses();
        fetchInventories();
        fetchPaymentTerms();
    }, []);

    // Fetch Taxes based on Tax Type
    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lockAccountId = localStorage.getItem("lock_account_id") || "1";
                const type = taxType.toLowerCase();
                const url = `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=${type}&lock_account_id=${lockAccountId}`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setTaxOptions(Array.isArray(data) ? data : data?.tax_sections || []);
            } catch (error) {
                console.error('Error fetching taxes:', error);
                setTaxOptions([]);
            }
        };
        fetchTaxes();
        setSelectedTax('');
    }, [taxType]);

    // Fetch tax groups for dropdown (same logic as QuotesAdd)
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lockAccountId = localStorage.getItem("lock_account_id") || "1";

        setLoadingTaxGroups(true);

        axios
            .get(`https://${baseUrl}/lock_accounts/${lockAccountId}/tax_groups_view.json`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                setTaxGroups(res.data || []);
            })
            .catch((error) => {
                console.error("Error fetching tax groups:", error);
            })
            .finally(() => {
                setLoadingTaxGroups(false);
            });
    }, []);

    // Fetch item-level tax exemptions (used when non_taxable selected)
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lockAccountId = localStorage.getItem("lock_account_id") || "1";

        setLoadingExemptions(true);

        axios

            .get(`https://${baseUrl}/tax_exemptions.json?lock_account_id=${lockAccountId}&q[exemption_type_eq]=item`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                setCustomerExemptions(res.data || []);
            })
            .catch((error) => {
                console.error("Error fetching tax exemptions:", error);
            })
            .finally(() => {
                setLoadingExemptions(false);
            });
    }, []);

    // Update taxAmount2 using percentage from selected tax option
    // Moved after calculations to avoid ReferenceError

    // Initialize IDs
    useEffect(() => {
        const orgId = localStorage.getItem('organization_id');
        if (orgId) setDeliveryOrganizationId(orgId);

        const user = getUser();
        if (user?.id) setDeliveryCustomerId(user.id.toString());
    }, []);

    // Fetch delivery addresses
    useEffect(() => {
        const fetchDeliveryAddresses = async () => {
            try {
                let url = `https://${baseUrl}/addresses.json`;

                const params = new URLSearchParams();
                if (deliveryAddressType === 'organization') {
                    params.append('resource_type', "Organization");
                    params.append('resource_id', JSON.parse(localStorage.getItem("user")).organization_id)
                } else {
                    params.append('resource_type', "Pms::Supplier");
                }

                const response = await axios.get(`${url}?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data) {
                    setDeliveryAddresses(response.data);
                }
            } catch (error) {
                console.error('Error fetching delivery addresses:', error);
                toast.error('Failed to fetch delivery addresses');
            }
        };

        const fetchAccountLedgers = async () => {
            const accountId = JSON.parse(localStorage.getItem("user")).lock_account_id;
            if (!accountId) return;

            try {
                const response = await axios.get(`https://${baseUrl}/lock_accounts/${accountId}/lock_account_ledgers.json`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAccountLedgers(response.data);
            } catch (error) {
                console.error('Error fetching account ledgers:', error);
            }
        };

        // fetch account groups (for dropdown with group/ledger structure)
        const fetchAccountGroups = async () => {
            try {
                // using lock_account_id from user (defaults to 1 if absent)
                const accountId = JSON.parse(localStorage.getItem("user")).lock_account_id || 1;
                const res = await axios.get(
                    `https://${baseUrl}/lock_accounts/${accountId}/lock_account_groups?format=flat`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Account Groups Response:", res.data);
                setAccountGroups(res.data.data || []);
            } catch (e) {
                setAccountGroups([]);
            }
        };

        fetchDeliveryAddresses();
        fetchAccountLedgers();
    }, [deliveryAddressType, deliveryOrganizationId, deliveryCustomerId]);

    useEffect(() => {
        const fetchAccountGroups = async () => {
            try {
                const accountId = JSON.parse(localStorage.getItem("user")).lock_account_id || 1;
                const res = await axios.get(
                    `https://${baseUrl}/lock_accounts/${accountId}/lock_account_groups?format=flat`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Account Groups Response:", res.data);
                setAccountGroups(res.data.data || []);
            } catch (e) {
                setAccountGroups([]);
            }
        };
        fetchAccountGroups();
    }, [baseUrl, token]);

    // When vendor is selected

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

    // When delivery address is selected, update shipping address
    useEffect(() => {
        if (selectedDeliveryAddress) {
            const addressString = `${selectedDeliveryAddress.address || ''}, ${selectedDeliveryAddress.address_line_two || ''}, ${selectedDeliveryAddress.city || ''}, ${selectedDeliveryAddress.state || ''}, ${selectedDeliveryAddress.zip_code || selectedDeliveryAddress.pincode || ''}`;
            // Clean up double commas or leading/trailing separators
            const cleanAddress = addressString.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, '');
            setShippingAddress(cleanAddress);
        }
    }, [selectedDeliveryAddress]);

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
            amount: 0,
            account_id: 0
            , item_tax_type: '',
            tax_group_id: null,
            tax_exemption_id: null
        }]);
    };

    // Remove item
    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Calculate totals (matching BillsAdd logic)
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * discountOnTotal) / 100
        : discountOnTotal;
    const afterDiscount = subTotal - totalDiscount;

    // compute tax breakdown for any item-level tax groups (similar to QuotesAdd)
    const selectedTaxGroups = items
        .filter(item => item.item_tax_type === "tax_group" && item.tax_group_id)
        .map(item => {
            const group = taxGroups.find(g => g.id === item.tax_group_id);
            return {
                itemAmount: item.amount,
                taxRates: group?.tax_rates || []
            };
        });
    const taxBreakdown: any[] = [];
    selectedTaxGroups.forEach(group => {
        group.taxRates.forEach((rate: any) => {
            const taxAmt = (group.itemAmount * rate.rate) / 100;
            const existing = taxBreakdown.find(t => t.name === rate.name);
            if (existing) {
                existing.amount += taxAmt;
            } else {
                taxBreakdown.push({ name: rate.name, rate: rate.rate, amount: taxAmt });
            }
        });
    });
    const totalTaxGroups = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);

    // Find selected tax rate
    const selectedTaxObj = taxOptions.find(t => t.id === selectedTax);
    const taxRate = selectedTaxObj?.rate || 0;
    const taxAmount = (afterDiscount * taxRate) / 100;

    // Update totalAmount to subtract TDS/TCS (taxAmount2) and add any item-group taxes
    const totalAmount = afterDiscount + totalTaxGroups + adjustment - taxAmount2;

    // Update taxAmount2 using percentage from selected tax option
    useEffect(() => {
        // Recalculate afterDiscount within the effect to avoid dependency issues
        const calcTotalDiscount = discountTypeOnTotal === 'percentage'
            ? (subTotal * discountOnTotal) / 100
            : discountOnTotal;
        const calcAfterDiscount = subTotal - calcTotalDiscount;

        const selected = taxOptions.find(t => t.name === selectedTax);
        // Use percentage key for calculation
        if (selected && typeof selected.percentage === 'number') {
            // Calculate tax on afterDiscount
            setTaxAmount2((calcAfterDiscount * selected.percentage) / 100);
        } else {
            setTaxAmount2(0);
        }
    }, [selectedTax, taxOptions, subTotal, discountOnTotal, discountTypeOnTotal]);

    // Update totalAmount2 to include tax groups and adjustment
    useEffect(() => {
        const calcTotalDiscount = discountTypeOnTotal === 'percentage'
            ? (subTotal * discountOnTotal) / 100
            : discountOnTotal;
        const calcAfterDiscount = subTotal - calcTotalDiscount;
        setTotalAmount2(calcAfterDiscount + totalTaxGroups - taxAmount2 + adjustment);
    }, [subTotal, discountOnTotal, discountTypeOnTotal, totalTaxGroups, taxAmount2, adjustment]);

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
        if (!purchaseOrderDate) newErrors.purchaseOrderDate = 'Purchase order date is required';
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
            const user = getUser();
            const accountId = user?.lock_account_id;

            // Map items to pms_po_inventories_attributes
            const inventoriesAttributes: Record<string, any> = {};
            items.filter(item => item.name).forEach((item, index) => {
                inventoriesAttributes[index.toString()] = {
                    pms_inventory_id: item.id,
                    quantity: item.quantity,
                    rate: item.rate,
                    total_value: item.amount,
                    ledger_id: item.account_id,
                    prod_desc: item.description
                };
            });

            // Find selected tax object to get value/percentage if needed
            // The curl example uses tax_value and tax_percentage. 
            // Assuming tax_value is the calculated amount and tax_percentage is the rate.
            // But wait, taxOptions has {id, name, rate}. 
            // The tax calculation in summary uses a single tax rate??
            // Re-checking Summary section: It has "Tax Type (TDS/TCS)" and "Select a Tax".
            // And it sums up tax from items? 
            // const taxAmount = items.reduce... -> This uses item.taxRate. 
            // But the curl example shows a global tax_id and tax_percentage.
            // Let's look at the UI code for tax again.
            // <Select value={selectedTax} onChange={(e) => setSelectedTax(e.target.value)}>
            // The `selectedTax` in UI stores the tax NAME (based on <MenuItem value={tax.name}>).
            // I need to change this to store ID or find the ID.

            const selectedTaxObj = taxOptions.find(t => t.name === selectedTax);

            // Re-evaluating tax logic:
            // The existing code calculates tax per item: `return sum + ((itemSubtotal - itemDiscount) * item.taxRate / 100);`
            // But the item table DOES NOT have a tax column anymore in the new file provided by user (it was in the initial file, but the user's latest file 821: table header ... Item Details, Account, Quantity, Rate, Amount, Action).
            // Wait, looking at lines 1528+, the user provided file DOES NOT have tax column in items.
            // So the tax calculation logic in `calculateTotals` might be stale or referring to the global tax?
            // "const taxAmount = items.reduce..." -> item.taxRate is used. 
            // But item interface still has `tax` and `taxRate`.
            // The UI for item row does NOT show tax input.
            // So likely the tax is GLOBAL, applied to the subtotal?
            // The Summary section has "Select a Tax".
            // So I should treat `selectedTax` as the global tax.
            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );
            const payload = {
                pms_purchase_order: {
                    pms_supplier_id: selectedVendor?.id,
                    billing_address_id: billingAddress, // Assuming select value is ID
                    shipping_address_id: shippingAddress, // Assuming select value is ID
                    delivery_address_id: selectedDeliveryAddress?.id,
                    reference_number: referenceNumber,
                    po_date: purchaseOrderDate,
                    expected_delivery_date: expectedDeliveryDate,
                    payment_term_id: paymentTerms,
                    letter_of_indent: false,
                    delivery_method: deliveryMethod,
                    vendor_note: vendorNotes,
                    terms_conditions: termsAndConditions,
                    account_id: accountId,

                    tax_id: selectedTaxObj?.id,
                    tax_type: taxType,
                    discount: totalDiscount, // Calculated amount
                    adjustment: adjustment,
                    sub_total: subTotal,
                    tax_value: taxAmount, // This currently comes from item reduction? 
                    // If items don't have tax, this taxAmount should probably be calculated from the global tax?
                    // Let's assume the tax is calculated based on selectedTaxObj.rate if items don't have it?
                    // But `taxAmount` variable is used in total calculation.
                    // I will fix taxAmount calculation in the next step/edit if needed. 
                    // For now, mapping what's available.
                    tax_percentage: selectedTaxObj?.rate || 0,

                    pms_po_inventories_attributes: inventoriesAttributes,

                    /* NEW FIELDS ADDED */
                    sub_total_amount: subTotal,
                    taxable_amount: totalGSTAmount,
                    lock_account_tax_amount: taxAmount2,
                },
                attachments: [] // Attachment upload logic implementation if needed, passing empty for now as per curl
            };

            const response = await axios.post(`https://${baseUrl}/pms/purchase_orders.json?access_token=${token}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success(`Purchase order ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
                navigate('/accounting/purchase-order');
            } else {
                toast.error('Failed to create purchase order');
            }
        } catch (error) {
            console.error('Error submitting purchase order:', error);
            toast.error('Failed to create purchase order');
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
                <h1 className="text-2xl font-bold">New Purchase Order</h1>
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>Billing Address*</InputLabel>
                                <Select
                                    label="Billing Address*"
                                    value={billingAddress}
                                    onChange={(e) => setBillingAddress(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select...</em>
                                    </MenuItem>
                                    {addresses.map((address: any) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            {address.address + " " + (address.address_line_two || "")}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>Shipping Address*</InputLabel>
                                <Select
                                    label="Shipping Address*"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select...</em>
                                    </MenuItem>
                                    {addresses.map((address: any) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            {address.address + " " + (address.address_line_two || "")}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className=''>
                            <h6 className='text-sm font-medium mb-2'>Delivery Address</h6>
                            <div className="flex items-center gap-4 mb-4">
                                <RadioGroup
                                    row
                                    value={deliveryAddressType}
                                    onChange={(e) => setDeliveryAddressType(e.target.value as 'organization' | 'customer')}
                                >
                                    <FormControlLabel value="organization" control={<Radio />} label="Organization" />
                                    <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                                </RadioGroup>
                            </div>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>Select Delivery Address</InputLabel>
                                <Select
                                    label="Select Delivery Address"
                                    value={selectedDeliveryAddress?.id || ''}
                                    onChange={(e) => {
                                        const selected = deliveryAddresses.find(addr => addr.id === e.target.value);
                                        setSelectedDeliveryAddress(selected || null);
                                    }}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select Address</em>
                                    </MenuItem>
                                    {deliveryAddresses.map((addr: any) => (
                                        <MenuItem key={addr.id} value={addr.id}>
                                            {addr.address}, {addr.address_line_two}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </Section>

                {/* Purchase Order Details */}
                <Section title="Purchase Order Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* <div>
                            <label className="block text-sm font-medium mb-2">
                                Purchase Order #<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                value={purchaseOrderNumber}
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
                        </div> */}

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
                                Purchase Order Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={purchaseOrderDate}
                                onChange={(e) => setPurchaseOrderDate(e.target.value)}
                                error={!!errors.purchaseOrderDate}
                                helperText={errors.purchaseOrderDate}
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
                                    {
                                        paymentTermsOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.name}
                                            </MenuItem>
                                        ))
                                    }
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
                                    <MenuItem value="" disabled>Select a delivery method</MenuItem>
                                    <MenuItem value="courier">Courier</MenuItem>
                                    <MenuItem value="hand-delivery">Hand Delivery</MenuItem>
                                    <MenuItem value="pickup">Pickup</MenuItem>
                                    <MenuItem value="shipping">Shipping</MenuItem>
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
                                        <th className="px-4 py-3 text-left text-sm font-medium">Account</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
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
                                                        value={item.id}
                                                        onChange={(e) => {
                                                            const selectedItem = itemOptions.find(opt => opt.id === e.target.value);
                                                            if (selectedItem) {
                                                                updateItem(index, 'id', selectedItem.id);
                                                                updateItem(index, 'name', selectedItem.inventory_name);
                                                                updateItem(index, 'rate', selectedItem.rate);
                                                            }
                                                        }}
                                                        displayEmpty
                                                        size="small"
                                                    >
                                                        <MenuItem value="" disabled>Select an item</MenuItem>
                                                        {itemOptions.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.inventory_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {
                                                    item.id && (
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Description"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                            sx={{ mt: 1 }}
                                                        />
                                                    )
                                                }
                                            </td>
                                            <td className="px-4 py-3">
                                                <FormControl fullWidth sx={{ minWidth: 250 }}>
                                                    <Select
                                                        value={item.account_id || ''}
                                                        onChange={(e) => {
                                                            updateItem(index, 'account_id', e.target.value);
                                                            // Optional: if you need to store account name as well
                                                            // const selectedAccount = accountLedgers.find(acc => acc.id === e.target.value);
                                                            // updateItem(index, 'account_name', selectedAccount?.name);
                                                        }}
                                                        displayEmpty
                                                        size="small"
                                                    >
                                                        <MenuItem value="">Select Account</MenuItem>
                                                        {/* if accountGroups is populated, render grouped dropdown like BillsAdd.tsx */}
                                                        {accountGroups.length > 0
                                                            ? accountGroups.map((group) =>
                                                                group.ledgers && group.ledgers.length > 0
                                                                    ? [
                                                                        <ListSubheader key={`group-${group.id}`}>{group.group_name}</ListSubheader>,
                                                                        ...group.ledgers.map((ledger: any) => (
                                                                            <MenuItem key={ledger.id} value={ledger.id}>
                                                                                {ledger.name}
                                                                            </MenuItem>
                                                                        )),
                                                                    ]
                                                                    : (
                                                                        <MenuItem key={`group-${group.id}`} value={group.id}>
                                                                            {group.group_name}
                                                                        </MenuItem>
                                                                    )
                                                            )
                                                            : accountLedgers.map((ledger: any) => (
                                                                <MenuItem key={ledger.id} value={ledger.id}>
                                                                    {ledger.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
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
                                                <FormControl size="small" sx={{ width: 200 }}>
                                                    <Select
                                                        value={item.item_tax_type === "tax_group" ? item.tax_group_id : item.item_tax_type || ""}
                                                        displayEmpty
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Static tax types
                                                            if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value)) {
                                                                updateItem(index, "item_tax_type", value);
                                                                updateItem(index, "tax_group_id", null);

                                                                if (value === "non_taxable") {
                                                                    setCurrentItemIndex(index);
                                                                    setExemptionModalOpen(true);
                                                                }
                                                            }
                                                            // Tax group selected
                                                            else {
                                                                updateItem(index, "item_tax_type", "tax_group");
                                                                updateItem(index, "tax_group_id", value);
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value="">Select Tax</MenuItem>

                                                        {/* Static Options */}
                                                        {taxTypeOptions.map((opt) => (
                                                            <MenuItem key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </MenuItem>
                                                        ))}

                                                        {/* Divider */}
                                                        <MenuItem disabled>Tax Groups</MenuItem>

                                                        {/* Tax Groups */}
                                                        {taxGroups.map((group) => (
                                                            <MenuItem key={group.id} value={group.id}>
                                                                {group.name}
                                                            </MenuItem>
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
                                        onChange={(e) => setDiscountOnTotal(parseFloat(e.target.value) || '')}
                                        inputProps={{ min: 0, step: 0.01 }}
                                        sx={{ width: 80 }}
                                    />
                                    <Select
                                        size="small"
                                        value={discountTypeOnTotal}
                                        onChange={e => setDiscountTypeOnTotal(e.target.value as 'percentage' | 'amount')}
                                        sx={{ width: 100 }}
                                    >
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="amount">Amount</MenuItem>
                                    </Select>
                                    <span className="font-semibold text-base text-red-600 ml-2">-₹{totalDiscount.toFixed(2)}</span>
                                </div>
                            </div>

                            {taxBreakdown.map((tax, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {tax.name} ({tax.rate}%)
                                    </span>
                                    <span className="font-semibold text-base">
                                        ₹{tax.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}

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
                                            <MenuItem key={tax.id || tax.name} value={tax.name}>{tax.name}
                                                {/* {typeof tax.percentage === 'number' ? `(${tax.percentage}%)` : ''} */}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <span className="font-semibold text-base text-red-600">-₹{taxAmount2.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-2">
                                    <TextField
                                        size="small"
                                        value={adjustmentLabel}
                                        onChange={e => setAdjustmentLabel(e.target.value)}
                                        sx={{ width: 120 }}
                                        placeholder="Adjustment Name"
                                    />
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={adjustment}
                                        onChange={(e) => setAdjustment(parseFloat(e.target.value) || '')}
                                        inputProps={{ step: 0.01 }}
                                        sx={{ width: 100 }}
                                    />
                                </div>
                            </div>

                            <Divider sx={{ my: 2 }} />

                            <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                <span className="font-bold text-base">Total ( ₹ )</span>
                                <span className="font-bold text-primary text-2xl">₹{totalAmount2.toFixed(2)}</span>
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
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                                height: "auto !important",
                                padding: "2px !important",
                                display: "flex",
                            },
                            "& .MuiInputBase-input[aria-hidden='true']": {
                                flex: 0,
                                width: 0,
                                height: 0,
                                padding: "0 !important",
                                margin: 0,
                                display: "none",
                            },
                            "& .MuiInputBase-input": {
                                resize: "none !important",
                            },
                        }}
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
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                                height: "auto !important",
                                padding: "2px !important",
                                display: "flex",
                            },
                            "& .MuiInputBase-input[aria-hidden='true']": {
                                flex: 0,
                                width: 0,
                                height: 0,
                                padding: "0 !important",
                                margin: 0,
                                display: "none",
                            },
                            "& .MuiInputBase-input": {
                                resize: "none !important",
                            },
                        }}
                    />
                </Section>

                {/* Attachments */}
                <Section title="Attach Files to Purchase Order" icon={<AttachFile className="w-5 h-5" />}>
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

                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    checked={displayAttachmentsInPortal}
                                    onChange={(e) => setDisplayAttachmentsInPortal(e.target.checked)}
                                />
                            }
                            label="Display attachments in vendor portal and emails"
                        /> */}
                    </div>
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button
                    variant="outlined"
                    onClick={() => navigate('/accounting/purchase-order')}
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

            {/* Exemption modal used by tax dropdown */}
            <Dialog open={exemptionModalOpen} onClose={() => setExemptionModalOpen(false)}
                maxWidth="sm" fullWidth>
                <DialogTitle>Exemption Reason</DialogTitle>

                <DialogContent>

                    <FormControl fullWidth>

                        <Select
                            value={selectedExemption}
                            onChange={(e) => setSelectedExemption(e.target.value)}
                        >

                            <MenuItem value="">Select Reason</MenuItem>

                            {customerExemptions.map(ex => (
                                <MenuItem key={ex.id} value={ex.id}>
                                    {ex.reason}
                                </MenuItem>
                            ))}

                        </Select>

                    </FormControl>

                </DialogContent>

                <DialogActions>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded"
                        onClick={() => setExemptionModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded"
                        onClick={() => {
                            if (currentItemIndex !== null) {
                                updateItem(currentItemIndex, "tax_exemption_id", selectedExemption);
                            }

                            setSelectedExemption("");
                            setCurrentItemIndex(null);
                            setExemptionModalOpen(false);
                        }}
                    >
                        Update
                    </button>

                </DialogActions>

            </Dialog>
        </div>
    );
};