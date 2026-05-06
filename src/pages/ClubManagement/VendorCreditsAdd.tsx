import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    // Button,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    ListSubheader,
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
    ChevronRight,
    EditOutlined
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ItemSearchInput from '@/components/ItemSearchInput';

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
    company_name?: string;
    email: string;
    currency: string;
    billingAddress: string;
    shippingAddress: string;
    address?: string;
    address2?: string;
    state?: string;
    customerType: string;
    paymentTerms: string;
    payment_terms?: string;
    portalStatus: string;
    language: string;
    gst_preference?: string;
    gst_treatment?: string;
    gstin?: string;
    mobile1?: string;
    mobile2?: string;
    billing_address?: CustomerAddress;
    shipping_address?: CustomerAddress;
    default_billing_address?: CustomerAddress;
    default_shipping_address?: CustomerAddress;
    outstandingReceivables: number;
    unusedCredits: number;
    contactPersons: ContactPerson[];
}

interface CustomerOptions {
    id: string;
    name: string;
    email: string;
    currency: string;
    billingAddress: string;
    shippingAddress: string;
    customerType: string;
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
    quantity: number | '';
    rate: number | '';
    discount: number | '';
    discountType: 'percentage' | 'amount';
    tax: string;
    taxRate: number;
    amount: number;
    account: string;
    customer: string;
    item_tax_type?: string
    tax_group_id?: number | null
    tax_exemption_id?: number | null
    item_id?: string | null
}

interface ExternalUser {
    name: string;
    email: string;
}

interface CustomerAddress {
    id: string | number;
    attention?: string;
    address: string;
    address_line_two?: string;
    country?: string;
    state?: string;
    city?: string;
    pin_code?: string;
    telephone_number?: string;
    fax_number?: string;
    mobile?: string;
    address_type?: 'billing' | 'shipping' | string;
    default_address?: boolean;
}

export const VendorCreditsAdd: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [reverseCharge, setReverseCharge] = useState(false);
    // Fetch item list from API
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_items.json?lock_account_id=${lock_account_id}&q[can_be_purchase_eq]=1`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setItemOptions(res.data.map(item => ({ id: item.id, name: item.name, rate: item.purchase_rate, description: item.sale_description, tax_preference: item.tax_preference, tax_exemption_id: item.tax_exemption_id, tax_group_id: item.intra_state_tax_rate_id, inter_state_tax_rate_id: item.inter_state_tax_rate_id })));
                    console.log('Fetched items:', res.data);
                }
            } catch (err) {
                setItemOptions([]);
            }
        };
        fetchItems();
    }, []);

    // Fetch salespersons from API
    useEffect(() => {
        const fetchSalespersons = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(`https://${baseUrl}/sales_persons.json?lock_account_id=${lock_account_id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setSalespersons(res.data.map(person => ({ id: person.id, name: person.name })));
                }
            } catch (err) {
                setSalespersons([]);
            }
        };
        fetchSalespersons();
    }, []);
    // Fetch payment terms from API and set as dropdown options
    useEffect(() => {
        const fetchPaymentTerms = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(`https://${baseUrl}/payment_terms.json?lock_account_id=${lock_account_id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setPaymentTermsList(res.data.map(pt => ({ id: pt.id, name: pt.name, days: pt.no_of_days })));
                }
            } catch (err) {
                setPaymentTermsList([]);
            }
        };
        fetchPaymentTerms();
    }, []);
    // Payment Terms Modal Handlers
    const handleAddNewTerm = () => {
        setEditTerms((prev) => [...prev, { name: '', days: '' }]);
    };
    const handleNewRowChange = (idx, field, value) => {
        setEditTerms(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    };
    const handleRemoveNewRow = (idx) => {
        setEditTerms(rows => rows.filter((_, i) => i !== idx));
    };
    // Payment Terms Dropdown State
    const [selectedTerm, setSelectedTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfig, setShowConfig] = useState(false);
    const [editTerms, setEditTerms] = useState([]);
    const [paymentTermsList, setPaymentTermsList] = useState([]);
    const filteredTerms = paymentTermsList.filter(term =>
        term.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'New Bill';
    }, []);

    // Customer data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
    // Contact persons selected for email
    const [selectedContactPersons, setSelectedContactPersons] = useState<number[]>([]);

    // Address
    const emptyAddressForm: CustomerAddress = {
        id: '',
        attention: '',
        address: '',
        address_line_two: '',
        country: 'India',
        state: '',
        city: '',
        pin_code: '',
        telephone_number: '',
        fax_number: '',
        mobile: '',
        address_type: 'billing',
        default_address: false
    };
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [billingAddressBook, setBillingAddressBook] = useState<CustomerAddress[]>([]);
    const [shippingAddressBook, setShippingAddressBook] = useState<CustomerAddress[]>([]);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<number | string | null>(null);
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | string | null>(null);
    const [addressListModalOpen, setAddressListModalOpen] = useState(false);
    const [addressFormModalOpen, setAddressFormModalOpen] = useState(false);
    const [activeAddressType, setActiveAddressType] = useState<'billing' | 'shipping'>('billing');
    const [addressFormMode, setAddressFormMode] = useState<'new' | 'edit'>('new');
    const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);
    const [addressForm, setAddressForm] = useState<CustomerAddress>(emptyAddressForm);
    const [gstModalOpen, setGstModalOpen] = useState(false);
    const [gstTreatmentDraft, setGstTreatmentDraft] = useState('');
    const [gstinDraft, setGstinDraft] = useState('');

    // Sales Order Details
    const [salesOrderNumber, setSalesOrderNumber] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [salesOrderDate, setSalesOrderDate] = useState('');
    const [expectedShipmentDate, setExpectedShipmentDate] = useState('');
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
            amount: 0,
            customer: "",
            account: "",
            item_tax_type: "",
            tax_group_id: "",
            tax_exemption_id: ""
        }
    ]);

    const [sourceOfSupply, setSourceOfSupply] = useState("");
    const [destinationOfSupply, setDestinationOfSupply] = useState("");
    const [orgState, setOrgState] = useState("");
    const gstTreatmentOptions = [
        { value: 'registered_regular', label: 'Registered Business - Regular' },
        { value: 'registered_composition', label: 'Registered Business - Composition' },
        { value: 'unregistered', label: 'Unregistered Business' },
        { value: 'consumer', label: 'Consumer' },
        { value: 'overseas', label: 'Overseas' },
        { value: 'sez_unit', label: 'Special Economic Zone (SEZ) Unit' },
        { value: 'deemed_export', label: 'Deemed Export' },
        { value: 'tax_deductor', label: 'Tax Deductor' },
        { value: 'sez_developer', label: 'SEZ Developer' },
        { value: 'isd', label: 'Input Service Distributor (ISD)' }
    ];
    const getGstTreatmentLabel = (value?: string) =>
        gstTreatmentOptions.find(opt => opt.value === value)?.label || value || '—';
    const mapAddress = (address: any, fallbackType: 'billing' | 'shipping'): CustomerAddress => ({
        id: address?.id ?? `${fallbackType}-${Date.now()}`,
        attention: address?.attention || address?.contact_person || '',
        address: address?.address || '',
        address_line_two: address?.address_line_two || '',
        country: address?.country || 'India',
        state: address?.state || '',
        city: address?.city || '',
        pin_code: address?.pin_code || '',
        telephone_number: address?.telephone_number || '',
        fax_number: address?.fax_number || '',
        mobile: address?.mobile || '',
        address_type: address?.address_type || fallbackType,
        default_address: !!address?.default_address
    });
    const formatAddressText = (addr?: CustomerAddress | null): string => {
        if (!addr) return '';
        return [
            addr.attention,
            addr.address,
            addr.address_line_two,
            [addr.city, addr.state].filter(Boolean).join(', '),
            addr.pin_code ? `PIN: ${addr.pin_code}` : '',
            addr.country,
            addr.telephone_number ? `Phone: ${addr.telephone_number}` : '',
            addr.mobile ? `Mobile: ${addr.mobile}` : '',
            addr.fax_number ? `Fax: ${addr.fax_number}` : '',
        ].filter(Boolean).join('\n');
    };
    const formatInlineAddress = (addr?: CustomerAddress | null) => {
        if (!addr?.address) return '—';
        return [
            addr.address,
            addr.address_line_two,
            [addr.city, addr.state].filter(Boolean).join(', '),
            addr.pin_code,
            addr.country,
        ].filter(Boolean).join(', ');
    };
    const getAddressBookByType = (type: 'billing' | 'shipping') =>
        type === 'billing' ? billingAddressBook : shippingAddressBook;
    const selectedBillingAddress =
        billingAddressBook.find(a => String(a.id) === String(selectedBillingAddressId)) ||
        billingAddressBook[0] ||
        null;
    const selectedShippingAddress =
        shippingAddressBook.find(a => String(a.id) === String(selectedShippingAddressId)) ||
        shippingAddressBook[0] ||
        null;
    const openAddressListModal = (type: 'billing' | 'shipping') => {
        setActiveAddressType(type);
        setAddressListModalOpen(true);
    };
    const openAddressFormModal = (
        mode: 'new' | 'edit',
        type: 'billing' | 'shipping',
        address?: CustomerAddress | null
    ) => {
        setActiveAddressType(type);
        setAddressFormMode(mode);
        setEditingAddressId(address?.id ?? null);
        setAddressForm(
            address
                ? { ...emptyAddressForm, ...address, address_type: type }
                : { ...emptyAddressForm, id: `${type}-${Date.now()}`, address_type: type }
        );
        setAddressListModalOpen(false);
        setAddressFormModalOpen(true);
    };

    // Fetch organisation state on mount
    useEffect(() => {
        const fetchOrgState = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            const organisation_id = localStorage.getItem('org_id') || localStorage.getItem('organisation_id');
            if (!organisation_id || !baseUrl || !token) return;
            try {
                const res = await axios.get(
                    `https://${baseUrl}/organizations/${organisation_id}.json?lock_account_id=${lock_account_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const org = res.data?.organization || res.data;
                setOrgState(org?.address?.state || '');
            } catch {
                // silently fail
            }
        };
        fetchOrgState();
    }, []);
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const taxTypeOptions = [
        { value: "non_taxable", label: "Non-Taxable" },
        { value: "out_of_scope", label: "Out of Scope" },
        { value: "non_gst_supply", label: "Non-GST Supply" },
        //   { value: "tax_group", label: "Tax Group" }
    ];

    const [taxGroups, setTaxGroups] = useState<any[]>([]);
    const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');

        setLoadingTaxGroups(true);

        axios
            .get(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_groups_view.json`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json"
                }
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

    const [taxRates, setTaxRates] = useState<any[]>([]);
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');
        axios
            .get(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_rates.json?q[rate_type_eq]=IGST`, {
                headers: { Authorization: token ? `Bearer ${token}` : undefined, "Content-Type": "application/json" }
            })
            .then((res) => setTaxRates(res.data || []))
            .catch((error) => console.error("Error fetching tax rates:", error));
    }, []);

    const [exemptionModalOpen, setExemptionModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedExemption, setSelectedExemption] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

    const [customerExemptions, setCustomerExemptions] = useState<any[]>([]);
    const [loadingExemptions, setLoadingExemptions] = useState(false);

    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');

        setLoadingExemptions(true);

        axios
            .get(`https://${baseUrl}/tax_exemptions.json?lock_account_id=${lock_account_id}&q[exemption_type_eq]=item`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json"
                }
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


    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [discountTypeOnTotal, setDiscountTypeOnTotal] = useState<'percentage' | 'amount'>('percentage');
    // const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    // const [selectedTax, setSelectedTax] = useState('');
    const [adjustment, setAdjustment] = useState(0);
    const [adjustmentLabel, setAdjustmentLabel] = useState('Adjustment');

    // Notes & Attachments
    const [customerNotes, setCustomerNotes] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [displayAttachmentsInPortal, setDisplayAttachmentsInPortal] = useState(false);

    // Email Communications
    const [sendEmailToCustomer, setSendEmailToCustomer] = useState(false);
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
    // const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [customerOptions, setCustomerOptions] = useState<CustomerOptions[]>([]);
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
            setSalesOrderNumber(`SO-${timestamp.toString().slice(-5)}${random}`);
        };
        generateOrderNumber();
    }, []);

    // Fetch customers on mount


    useEffect(() => {
        setLoadingCustomers(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        // Fetch customer list
        axios
            .get(`https://${baseUrl}/pms/suppliers.json`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setCustomers(res?.data?.pms_suppliers || []);
                // setCustomers(res.data || []);
                // Optionally fetch detail for first customer
                if (res.data && res.data.length > 0) {
                    const customerId = res.data[0].id;
                    axios
                        .get(`https://${baseUrl}/lock_account_customers/${customerId}.json`, {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : undefined,
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(detailRes => {
                            // Optionally handle detailRes.data
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            })
            .finally(() => {
                setLoadingCustomers(false);
            });
    }, []);
    const fetchSupplierDetails = async (supplierId: string) => {
        const supplierBaseUrl = localStorage.getItem('baseUrl');
        const supplierToken = localStorage.getItem('token');
        if (!supplierId || !supplierBaseUrl) return;
        try {
            const res = await axios.get(`https://${supplierBaseUrl}/pms/suppliers/${supplierId}.json`, {
                headers: {
                    Authorization: supplierToken ? `Bearer ${supplierToken}` : undefined,
                    'Content-Type': 'application/json'
                }
            });
            const detail = res.data || {};
            setSelectedCustomer(prev => prev ? {
                ...prev,
                name: detail.company_name || prev.name,
                company_name: detail.company_name || prev.company_name,
                email: detail.email || prev.email || '',
                currency: detail.currency || prev.currency || 'INR',
                paymentTerms: detail.payment_terms || prev.paymentTerms || '',
                payment_terms: detail.payment_terms || prev.payment_terms || '',
                gst_preference: detail.gst_preference || prev.gst_preference || '',
                gst_treatment: detail.gst_preference || detail.gst_treatment || prev.gst_treatment || '',
                gstin: detail.primary_gst_detail?.gstin || detail.gstin_number || prev.gstin || '',
                mobile1: detail.mobile1 || prev.mobile1 || '',
                mobile2: detail.mobile2 || prev.mobile2 || '',
                state: detail.state || prev.state || '',
                address: detail.address || prev.address || '',
                address2: detail.address2 || prev.address2 || '',
                billing_address: detail.default_billing_address
                    ? mapAddress(detail.default_billing_address, 'billing')
                    : (detail.billing_address ? mapAddress(detail.billing_address, 'billing') : prev.billing_address),
                shipping_address: detail.default_shipping_address
                    ? mapAddress(detail.default_shipping_address, 'shipping')
                    : (detail.shipping_address ? mapAddress(detail.shipping_address, 'shipping') : prev.shipping_address),
                default_billing_address: detail.default_billing_address
                    ? mapAddress(detail.default_billing_address, 'billing')
                    : prev.default_billing_address,
                default_shipping_address: detail.default_shipping_address
                    ? mapAddress(detail.default_shipping_address, 'shipping')
                    : prev.default_shipping_address,
            } : prev);
            if (detail.payment_terms) setPaymentTerms(detail.payment_terms);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        }
    };
    const fetchSupplierAddresses = async (supplierId: string, preserveCurrentText = false) => {
        const supplierBaseUrl = localStorage.getItem('baseUrl');
        const supplierToken = localStorage.getItem('token');
        if (!supplierId || !supplierBaseUrl) return;
        try {
            const res = await axios.get(
                `https://${supplierBaseUrl}/pms/suppliers/addresses.json?id=${supplierId}&access_token=${supplierToken}`
            );
            const nextBilling = Array.isArray(res.data?.billing_address)
                ? res.data.billing_address.map((a: any) => mapAddress(a, 'billing'))
                : [];
            const nextShipping = Array.isArray(res.data?.shipping_address)
                ? res.data.shipping_address.map((a: any) => mapAddress(a, 'shipping'))
                : [];
            setBillingAddressBook(nextBilling);
            setShippingAddressBook(nextShipping);

            const finalBilling =
                nextBilling.find(a => String(a.id) === String(selectedBillingAddressId)) ||
                nextBilling.find(a => a.default_address) ||
                nextBilling[0] ||
                null;
            const finalShipping =
                nextShipping.find(a => String(a.id) === String(selectedShippingAddressId)) ||
                nextShipping.find(a => a.default_address) ||
                nextShipping[0] ||
                null;

            setSelectedBillingAddressId(finalBilling?.id ?? null);
            setSelectedShippingAddressId(finalShipping?.id ?? null);

            if (!preserveCurrentText || !billingAddress) {
                setBillingAddress(formatAddressText(finalBilling));
            }
            if (!preserveCurrentText || !shippingAddress) {
                setShippingAddress(formatAddressText(finalShipping));
            }
            if (finalBilling?.state) setSourceOfSupply(finalBilling.state);
            if (finalShipping?.state) setDestinationOfSupply(finalShipping.state);
        } catch (error) {
            console.error('Error fetching supplier addresses:', error);
            setBillingAddressBook([]);
            setShippingAddressBook([]);
        }
    };


    // Account groups and ledgers for sales/purchase account dropdowns
    const [accountGroups, setAccountGroups] = React.useState([]);
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");
    const [openSalesAccount, setOpenSalesAccount] = React.useState(false);
    const [openPurchaseAccount, setOpenPurchaseAccount] = React.useState(false);

    React.useEffect(() => {
        const fetchAccountGroups = async () => {
            try {
                // Replace with your actual endpoint for groups/ledgers
                const res = await axios.get(`https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat&q[group_type_in][]=purchase&q[group_type_in][]=both`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Account Groups Response:", res.data);
                setAccountGroups(res.data.data || []);
            } catch (e) {
                setAccountGroups([]);
            }
        };
        fetchAccountGroups();
    }, [baseUrl, token]);
    // Fetch items, salespersons, taxes
    useEffect(() => {
        setTermsAndConditions('');
    }, []);

    // When vendor is selected
    useEffect(() => {
        if (selectedCustomer) {
            fetchSupplierDetails(selectedCustomer.id);
            fetchSupplierAddresses(selectedCustomer.id, Boolean(billingAddress || shippingAddress));
            setPaymentTerms(selectedCustomer.paymentTerms || selectedCustomer.payment_terms || '');
        } else {
            setBillingAddressBook([]);
            setShippingAddressBook([]);
            setSelectedBillingAddressId(null);
            setSelectedShippingAddressId(null);
            setBillingAddress('');
            setShippingAddress('');
        }
        // eslint-disable-next-line
    }, [selectedCustomer?.id]);

    // Same as billing address
    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [sameAsBilling, billingAddress]);
    useEffect(() => {
        if (selectedBillingAddress) {
            setBillingAddress(formatAddressText(selectedBillingAddress));
            if (selectedBillingAddress.state) setSourceOfSupply(selectedBillingAddress.state);
        }
        // eslint-disable-next-line
    }, [selectedBillingAddressId, billingAddressBook.length]);
    useEffect(() => {
        if (!sameAsBilling && selectedShippingAddress) {
            setShippingAddress(formatAddressText(selectedShippingAddress));
            if (selectedShippingAddress.state) setDestinationOfSupply(selectedShippingAddress.state);
        }
        // eslint-disable-next-line
    }, [selectedShippingAddressId, shippingAddressBook.length, sameAsBilling]);
    const handleSaveAddressForm = async () => {
        if (!selectedCustomer?.id) {
            toast.error('Please select a vendor first');
            return;
        }
        const supplierBaseUrl = localStorage.getItem('baseUrl');
        const supplierToken = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('pms_supplier[addresses_attributes][0][address]', addressForm.address || '');
        formData.append('pms_supplier[addresses_attributes][0][address_type]', activeAddressType);
        formData.append('pms_supplier[addresses_attributes][0][country]', addressForm.country || 'India');
        formData.append('pms_supplier[addresses_attributes][0][state]', addressForm.state || '');
        formData.append('pms_supplier[addresses_attributes][0][city]', addressForm.city || '');
        formData.append('pms_supplier[addresses_attributes][0][pin_code]', addressForm.pin_code || '');
        formData.append('pms_supplier[addresses_attributes][0][address_line_two]', addressForm.address_line_two || '');
        formData.append('pms_supplier[addresses_attributes][0][attention]', addressForm.attention || '');
        formData.append('pms_supplier[addresses_attributes][0][telephone_number]', addressForm.telephone_number || '');
        formData.append('pms_supplier[addresses_attributes][0][fax_number]', addressForm.fax_number || '');
        formData.append('pms_supplier[addresses_attributes][0][mobile]', addressForm.mobile || '');
        formData.append('pms_supplier[addresses_attributes][0][default_address]', addressForm.default_address ? 'true' : 'false');
        if (addressFormMode === 'edit' && editingAddressId && !String(editingAddressId).startsWith(`${activeAddressType}-`)) {
            formData.append('pms_supplier[addresses_attributes][0][id]', String(editingAddressId));
        }
        try {
            await fetch(`https://${supplierBaseUrl}/pms/suppliers/${selectedCustomer.id}.json`, {
                method: 'PATCH',
                headers: {
                    Authorization: supplierToken ? `Bearer ${supplierToken}` : undefined
                },
                body: formData
            });
            await fetchSupplierAddresses(selectedCustomer.id, false);
            await fetchSupplierDetails(selectedCustomer.id);
            setAddressFormModalOpen(false);
            toast.success(`Supplier ${activeAddressType} address saved`);
        } catch (error) {
            console.error('Error saving supplier address:', error);
            toast.error(`Failed to save ${activeAddressType} address`);
        }
    };
    const openGstModal = () => {
        setGstTreatmentDraft(selectedCustomer?.gst_preference || selectedCustomer?.gst_treatment || '');
        setGstinDraft(selectedCustomer?.gstin || '');
        setGstModalOpen(true);
    };
    const handleUpdateGstConfig = async () => {
        if (!selectedCustomer?.id) {
            toast.error('Please select a vendor first');
            return;
        }
        const supplierBaseUrl = localStorage.getItem('baseUrl');
        const supplierToken = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('pms_supplier[gst_preference]', gstTreatmentDraft || '');
        formData.append('pms_supplier[primary_gst_detail_attributes][gst_preference]', gstTreatmentDraft || '');
        formData.append('pms_supplier[primary_gst_detail_attributes][gstin]', gstinDraft || '');
        formData.append('pms_supplier[primary_gst_detail_attributes][place_of_supply]', sourceOfSupply || '');
        try {
            await fetch(`https://${supplierBaseUrl}/pms/suppliers/${selectedCustomer.id}.json`, {
                method: 'PATCH',
                headers: { Authorization: supplierToken ? `Bearer ${supplierToken}` : undefined },
                body: formData
            });
            setSelectedCustomer(prev => prev ? {
                ...prev,
                gst_preference: gstTreatmentDraft,
                gst_treatment: gstTreatmentDraft,
                gstin: gstinDraft
            } : prev);
            setGstModalOpen(false);
            toast.success('GST details updated');
        } catch (error) {
            console.error('Error updating supplier GST:', error);
            toast.error('Failed to update GST details');
        }
    };

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

    const updateItemFields = (index: number, fields: Partial<Item>) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], ...fields };
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
            customer: "",
            account: "",
            item_id: null,
        }]);
    };

    // Remove item
    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };
    const [taxAmount2, setTaxAmount2] = useState(0);
    const [totalAmount2, setTotalAmount2] = useState(0);
    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * discountOnTotal) / 100
        : discountOnTotal;
    const afterDiscount = subTotal - totalDiscount;
    const taxAmount = items.reduce((sum, item) => {
        const itemSubtotal = item.quantity * item.rate;
        const itemDiscount = item.discountType === 'percentage'
            ? (itemSubtotal * item.discount) / 100
            : item.discount;
        return sum + ((itemSubtotal - itemDiscount) * item.taxRate / 100);
    }, 0);
    // Update totalAmount to subtract TDS/TCS (taxAmount2)
    const totalAmount = afterDiscount + adjustment - taxAmount2;

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
        if (selectedCustomer && newContactPerson.firstName && newContactPerson.email) {
            const updatedCustomer = {
                ...selectedCustomer,
                contactPersons: [
                    ...selectedCustomer.contactPersons,
                    { ...newContactPerson, id: Date.now().toString() }
                ]
            };
            setSelectedCustomer(updatedCustomer);
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
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

    // ====================== VALIDATION FUNCTION ======================
    const validateForm = (): boolean => {
        if (!selectedCustomer) {
            toast.error("Please select a vendor");
            return false;
        }

        if (!referenceNumber.trim()) {
            toast.error("Please enter the order number.");
            return false;
        }

        if (!salesOrderDate) {
            toast.error("Please select Vendor Credit Date");
            return false;
        }

        if (!sourceOfSupply) {
            toast.error("Please select a source of supply");
            return false;
        }

        // Items validation
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemNum = i + 1;

            if (!item.name?.trim()) {
                toast.error(`Item ${itemNum}: Please select an item`);
                return false;
            }

            if (!item.account) {
                toast.error(`Item ${itemNum}: The Account field cannot be empty.`);
                return false;
            }

            if (!item.item_tax_type) {
                toast.error(`Item ${itemNum}: Please set the GST treatment for the item`);
                return false;
            }

            if (!item.quantity || item.quantity <= 0) {
                toast.error(`Item ${itemNum}: Quantity must be greater than 0`);
                return false;
            }
        }

        return true;
    };

    const saleOrderPayload = {
        sale_order: {
            lock_account_customer_id: selectedCustomer?.id,
            reference_number: referenceNumber,
            date: salesOrderDate,
            shipment_date: expectedShipmentDate,
            payment_term_id: paymentTermsList.find(pt => pt.name === paymentTerms)?.id || paymentTerms,
            //    payment_term_id: (() => {
            //     const found = paymentTermsList.find(pt => pt.name === paymentTerms);
            //     if (found && found.id) return found.id;
            //     if (typeof paymentTerms === 'string' && paymentTerms) return paymentTerms;
            //     return '';
            // })(),
            delivery_method: deliveryMethod,
            sales_person_id: salespersons.find(sp => sp.name === salesperson)?.id || salesperson,
            customer_notes: customerNotes,
            terms_and_conditions: termsAndConditions,
            status: 'draft',
            total_amount: totalAmount,
            // discount_per: discountTypeOnTotal === 'percentage' ? discountOnTotal : undefined,
            // discount_amount: discountTypeOnTotal === 'amount' ? discountOnTotal : undefined,

            discount_per: discountTypeOnTotal === 'percentage' ? discountOnTotal : undefined,
            discount_amount: discountTypeOnTotal === 'percentage' ? totalDiscount : discountOnTotal,
            charge_amount: adjustment,
            charge_name: adjustmentLabel,
            charge_type: adjustment >= 0 ? 'plus' : 'minus',
            tax_type: taxType.toLowerCase(),
            lock_account_tax_id: taxOptions.find(t => t.name === selectedTax)?.id || selectedTax,
            sale_order_items_attributes: items.map(item => ({
                lock_account_item_id: itemOptions.find(opt => opt.name === item.name)?.id || item.name,
                rate: item.rate,
                quantity: item.quantity,
                total_amount: item.amount,
                description: item.description || ''
            })),
            email_contact_persons_attributes: selectedContactPersons.map(id => ({ contact_person_id: id })),
            attachments_attributes: attachments.map(f => ({
                document: f,
                active: true
            }))
        }
    };


    const saleOrderPayload2 = {
        sale_order: {
            lock_account_customer_id: selectedCustomer?.id,
            reference_number: referenceNumber,
            date: salesOrderDate,
            shipment_date: expectedShipmentDate,
            payment_term_id: selectedTerm,
            delivery_method: deliveryMethod,
            sales_person_id: salespersons.find(sp => sp.name === salesperson)?.id || salesperson,
            customer_notes: customerNotes,
            terms_and_conditions: termsAndConditions,
            status: 'draft',
            total_amount: totalAmount,
            discount_per: discountTypeOnTotal === 'percentage' ? discountOnTotal : undefined,
            discount_amount: discountTypeOnTotal === 'percentage' ? totalDiscount : discountOnTotal,
            charge_amount: adjustment,
            charge_name: adjustmentLabel,
            charge_type: adjustment >= 0 ? 'plus' : 'minus',
            tax_type: taxType.toLowerCase(),
            lock_account_tax_id: (() => {
                const found = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
                return found && found.id ? found.id : selectedTax || '';
            })(),
            sale_order_items_attributes: items.map(item => ({
                lock_account_item_id: itemOptions.find(opt => opt.name === item.name)?.id || item.name,
                rate: item.rate,
                quantity: item.quantity,
                total_amount: item.amount,
                description: item.description || ''
            })),
            // email_contact_persons_attributes: externalUsers.map((user, idx) => ({
            //     contact_person_id: user.id || idx + 1 // Replace with actual contact person id
            // })),
            // attachments_attributes: attachments.map(f => ({
            //     document: '', // Replace with actual document upload logic
            //     active: true
            // }))
            email_contact_persons_attributes: selectedContactPersons.map(id => ({ contact_person_id: id })),
            attachments_attributes: attachments.map(f => ({
                document: f,
                active: true
            }))
        }
    };
    console.log('Sale Order Payload:', saleOrderPayload2);
    console.log("items:", items)
    // Handle submit
    // const handleSubmit = async (saveAsDraft: boolean = false) => {
    //     if (isSubmitting) return;

    //     const error = validate();
    //     if (error) {
    //         toast.error(error);
    //         return;
    //     }

    //     const loadingToast = toast.loading("Creating...");

    //     setIsSubmitting(true);

    //     try {
    //         const baseUrl = localStorage.getItem('baseUrl');
    //         const token = localStorage.getItem('token');
    //         const lock_account_id = localStorage.getItem('lock_account_id');

    //         // Build FormData for sale order
    //         const formData = new FormData();
    //         const totalGSTAmount = taxBreakdown.reduce(
    //             (sum, tax) => sum + Number(tax.amount || 0),
    //             0
    //         );

    //         formData.append(
    //             'lock_account_supplier_credit[sub_total_amount]',
    //             String(subTotal)
    //         );

    //         formData.append(
    //             'lock_account_supplier_credit[taxable_amount]',
    //             String(totalGSTAmount)
    //         );

    //         formData.append(
    //             'lock_account_supplier_credit[lock_account_tax_amount]',
    //             String(taxAmount2)
    //         );
    //         formData.append('lock_account_supplier_credit[pms_supplier_id]', selectedCustomer?.id || '');
    //         formData.append('lock_account_supplier_credit[order_number]', referenceNumber);
    //         formData.append('lock_account_supplier_credit[bill_date]', salesOrderDate);
    //         formData.append('lock_account_supplier_credit[date]', expectedShipmentDate);
    //         // formData.append('lock_account_supplier_credit[payment_term_id]', selectedTerm);
    //         // formData.append('sale_order[delivery_method]', deliveryMethod);
    //         // formData.append('sale_order[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
    //         formData.append('lock_account_supplier_credit[notes]', customerNotes);
    //         // formData.append('lock_account_supplier_credit[terms_and_conditions]', termsAndConditions);
    //         formData.append('lock_account_supplier_credit[status]', 'draft');
    //         formData.append('lock_account_supplier_credit[subject]', subject || '');
    //         formData.append('lock_account_supplier_credit[total_amount]', String(totalAmount));
    //         if (discountTypeOnTotal === 'percentage') {
    //             formData.append('lock_account_supplier_credit[discount_per]', String(discountOnTotal));
    //             formData.append('lock_account_supplier_credit[discount_amount]', String(totalDiscount));
    //         } else {
    //             formData.append('lock_account_supplier_credit[discount_amount]', String(discountOnTotal));
    //         }
    //         formData.append('lock_account_supplier_credit[charge_amount]', String(adjustment));
    //         formData.append('lock_account_supplier_credit[charge_name]', adjustmentLabel);
    //         formData.append('lock_account_supplier_credit[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
    //         formData.append('lock_account_supplier_credit[tax_type]', taxType.toLowerCase());
    //         const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
    //         formData.append('lock_account_supplier_credit[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));
    //         //new
    //         formData.append('lock_account_supplier_credit[source_of_supply]', sourceOfSupply || '');
    //         formData.append('lock_account_supplier_credit[destination_of_supply]', destinationOfSupply || '');
    //         // Sale order items
    //         items.forEach((item, idx) => {
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][lock_account_item_id]`, itemOptions.find(opt => opt.name === item.name)?.id || item.name);
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][name]`, item.description || '');
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][lock_account_ledger_id]`, item.account || '');
    //             // formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][lock_account_customer_id]`, item.customer || '');

    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_type]`, String(item.item_tax_type));
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
    //             formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
    //         });

    //         // Email contact persons
    //         // selectedContactPersons.forEach((id, idx) => {
    //         //     formData.append(`lock_account_supplier_credit[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
    //         // });

    //         // Attachments
    //         attachments.forEach((file, idx) => {
    //             formData.append(`lock_account_supplier_credit[attachments_attributes][${idx}][document]`, file);
    //             formData.append(`lock_account_supplier_credit[attachments_attributes][${idx}][active]`, 'true');
    //         });

    //         await fetch(`https://${baseUrl}/lock_account_supplier_credits.json?lock_account_id=${lock_account_id}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: token ? `Bearer ${token}` : undefined
    //                 // Do NOT set Content-Type, browser will set it for FormData
    //             },
    //             body: formData
    //         });

    //         toast.dismiss(loadingToast);
    //         if (saveAsDraft) {
    //             toast.success("Saved as draft");
    //         } else {
    //             toast.success("Vendor credit created!");
    //         }
    //         navigate('/accounting/vendor-credits');
    //     } catch (error) {
    //         console.error('Error submitting sales order:', error);
    //         toast.dismiss(loadingToast);
    //         toast.error("Failed to save vendor credit");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };


    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (isSubmitting) return;

        // ←←← ADD THIS LINE
        if (!validateForm()) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading("Creating Vendor Credit...");

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');

            const formData = new FormData();

            // ... your existing formData appends (keep all of them) ...

            formData.append('lock_account_supplier_credit[pms_supplier_id]', selectedCustomer?.id || '');
            formData.append('lock_account_supplier_credit[order_number]', referenceNumber.trim());
            formData.append('lock_account_supplier_credit[date]', salesOrderDate);
            formData.append('lock_account_supplier_credit[subject]', subject || '');
            formData.append('lock_account_supplier_credit[notes]', customerNotes);
            formData.append('lock_account_supplier_credit[source_of_supply]', sourceOfSupply);
            formData.append('lock_account_supplier_credit[destination_of_supply]', destinationOfSupply || '');
            formData.append('lock_account_supplier_credit[status]', saveAsDraft ? 'draft' : 'confirmed');
            formData.append('lock_account_supplier_credit[total_amount]', String(totalAmount2));
             formData.append('lock_account_supplier_credit[tax_type]', taxType.toLowerCase());
            formData.append(
                'lock_account_supplier_credit[reverse_charge]',
                reverseCharge ? 'true' : 'false'
            );

              formData.append(
                'lock_account_supplier_credit[sub_total_amount]',
                String(subTotal)
            );

            // Items loop (keep your existing one)
            items.forEach((item, idx) => {
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                if (resolvedId) {
                    formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][lock_account_item_id]`, String(resolvedId));
                } else {
                    formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][item_name]`, item.name);
                }
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][lock_account_ledger_id]`, item.account || '');
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
                 formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_type]`, item.item_tax_type || '');
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id || ''));
                formData.append(`lock_account_supplier_credit[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id || ''));
            });

            // ... rest of your fetch call remains same ...

            const response = await fetch(`https://${baseUrl}/lock_account_supplier_credits.json?lock_account_id=${lock_account_id}`, {
                method: 'POST',
                headers: { Authorization: token ? `Bearer ${token}` : undefined },
                body: formData,
            });

            if (!response.ok) throw new Error();

            toast.dismiss(loadingToast);
            toast.success(saveAsDraft ? "Saved as draft" : "Vendor credit created successfully!");
            navigate('/accounting/vendor-credits');

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to save vendor credit");
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- Tax Section State and Effect ---



    useEffect(() => {
        // Fetch tax options based on taxType, using baseUrl and Bearer token
        const fetchTaxSections = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lock_account_id = localStorage.getItem('lock_account_id');
                const type = taxType.toLowerCase();
                const url =


                    `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=${type}&lock_account_id=${lock_account_id}`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setTaxOptions(Array.isArray(data) ? data : data?.tax_sections || []);
            } catch (error) {
                setTaxOptions([]);
            }
        };
        fetchTaxSections();
        setSelectedTax('');
    }, [taxType]);




    // Update taxAmount using percentage from selected tax option
    useEffect(() => {
        const selected = taxOptions.find(t => t.name === selectedTax);
        // Use percentage key for calculation
        if (selected && typeof selected.percentage === 'number') {
            // Calculate tax on afterDiscount
            setTaxAmount2((afterDiscount * selected.percentage) / 100);
        } else {
            setTaxAmount2(0);
        }
    }, [selectedTax, taxOptions, afterDiscount]);

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

    if (!reverseCharge) {
        selectedTaxGroups.forEach(group => {
            group.taxRates.forEach(rate => {
                const taxAmount = (group.itemAmount * rate.rate) / 100;

                const existing = taxBreakdown.find(t => t.name === rate.name);

                if (existing) {
                    existing.amount += taxAmount;
                } else {
                    taxBreakdown.push({
                        name: rate.name,
                        rate: rate.rate,
                        amount: taxAmount
                    });
                }
            });
        });

        // Tax rate breakdown (non-Maharashtra)
        items
            .filter(item => item.item_tax_type === "tax_rate" && item.tax_group_id)
            .forEach(item => {
                const rate = taxRates.find(r => r.id === item.tax_group_id);
                if (!rate) return;
                const rateValue = rate.rate ?? rate.percentage ?? 0;
                const taxAmount = (item.amount * rateValue) / 100;
                const existing = taxBreakdown.find(t => t.name === rate.name);
                if (existing) {
                    existing.amount += taxAmount;
                } else {
                    taxBreakdown.push({ name: rate.name, rate: rateValue, amount: taxAmount });
                }
            });


    }
    // Calculate Final Total

    // const totalTax = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);
    const totalTax = reverseCharge
        ? 0
        : taxBreakdown.reduce((sum, t) => sum + t.amount, 0);
    // Re-preselect tax type on items when destinationOfSupply or orgState changes
    useEffect(() => {
        if (!destinationOfSupply) return;
        const isSameState = orgState && destinationOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
        setItems(prev => prev.map(item => {
            if (!["tax_group", "tax_rate"].includes(item.item_tax_type)) return item;
            const matched = itemOptions.find(opt => opt.name === item.name);
            if (!matched) return item;
            return {
                ...item,
                item_tax_type: isSameState ? "tax_group" : "tax_rate",
                tax_group_id: isSameState ? matched.tax_group_id : matched.inter_state_tax_rate_id
            };
        }));
    }, [destinationOfSupply, orgState]);

    useEffect(() => {
        const total =
            afterDiscount +
            totalTax  // tax from tax groups
            - taxAmount2 + // TDS/TCS
            (Number(adjustment) || 0);

        setTotalAmount2(total);


    }, [afterDiscount, totalTax, taxAmount2, adjustment]);


    useEffect(() => {
        const total =
            afterDiscount +
            totalTax -        // will be 0 if reverseCharge
            taxAmount2 +      // TDS/TCS
            (Number(adjustment) || 0);

        setTotalAmount2(total);
    }, [afterDiscount, totalTax, taxAmount2, adjustment, reverseCharge]);

    console.log('Tax Options:', taxOptions);
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
                {/* Customer Section */}
                <Section title="Vendor Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vendor Name<span className="text-red-500">*</span>
                                </label>
                                <FormControl fullWidth error={!!errors.customer}>
                                    <Select
                                        value={selectedCustomer?.id || ''}
                                        onChange={(e) => {
                                            const customer = customers.find(c => c.id === e.target.value);
                                            setSelectedBillingAddressId(null);
                                            setSelectedShippingAddressId(null);
                                            setBillingAddress('');
                                            setShippingAddress('');
                                            setSelectedCustomer(customer || null);
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select a vendor</MenuItem>

                                        {customers.map((customer) => (
                                            <MenuItem key={customer.id} value={customer.id}>
                                                {customer?.company_name}
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
                                    value={selectedCustomer?.currency || 'INR'}
                                    disabled
                                    sx={fieldStyles}
                                />
                            </div>



                        </div>

                        {selectedCustomer && (
                            <Button
                                variant="outline"
                                onClick={() => setCustomerDrawerOpen(true)}
                                className="w-fit"
                            >
                                View Vendor Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}

                        {selectedCustomer && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Source of Supply */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Source of Supply
                                    </label>

                                    <FormControl fullWidth>
                                        <Select
                                            value={sourceOfSupply}
                                            onChange={(e) => setSourceOfSupply(e.target.value)}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="">Select State</MenuItem>

                                            {indianStates.map((state) => (
                                                <MenuItem key={state} value={state}>
                                                    {state}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* Destination of Supply */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Destination of Supply
                                    </label>

                                    <FormControl fullWidth>
                                        <Select
                                            value={destinationOfSupply}
                                            onChange={(e) => setDestinationOfSupply(e.target.value)}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="">Select State</MenuItem>

                                            {indianStates.map((state) => (
                                                <MenuItem key={state} value={state}>
                                                    {state}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                            </div>
                        )}

                        {selectedCustomer && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                                <div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                        Billing Address
                                        <IconButton size="small" onClick={() => openAddressListModal('billing')}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                    {selectedBillingAddress?.address ? (
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            <div className="font-medium">{selectedBillingAddress.address}</div>
                                            {selectedBillingAddress.address_line_two && <div>{selectedBillingAddress.address_line_two}</div>}
                                            <div>
                                                {[selectedBillingAddress.city, selectedBillingAddress.state].filter(Boolean).join(", ")}
                                                {selectedBillingAddress.pin_code ? ` - ${selectedBillingAddress.pin_code}` : ""}
                                            </div>
                                            {selectedBillingAddress.country && <div>{selectedBillingAddress.country}</div>}
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => openAddressFormModal('new', 'billing')} className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                            New Address
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                        Shipping Address
                                        <IconButton size="small" onClick={() => openAddressListModal('shipping')}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                    {selectedShippingAddress?.address ? (
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            <div className="font-medium">{selectedShippingAddress.address}</div>
                                            {selectedShippingAddress.address_line_two && <div>{selectedShippingAddress.address_line_two}</div>}
                                            <div>
                                                {[selectedShippingAddress.city, selectedShippingAddress.state].filter(Boolean).join(", ")}
                                                {selectedShippingAddress.pin_code ? ` - ${selectedShippingAddress.pin_code}` : ""}
                                            </div>
                                            {selectedShippingAddress.country && <div>{selectedShippingAddress.country}</div>}
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => openAddressFormModal('new', 'shipping')} className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                            New Address
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedCustomer && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">GST Treatment:</span>
                                    <span className="text-gray-800">{getGstTreatmentLabel(selectedCustomer.gst_preference || selectedCustomer.gst_treatment)}</span>
                                    <IconButton size="small" onClick={openGstModal}>
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">GSTIN:</span>
                                    <span className="text-gray-800 font-medium">{selectedCustomer.gstin || "—"}</span>
                                    <IconButton size="small" onClick={openGstModal}>
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Address Section */}
                <Section title="Address Details" icon={<FileText className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Billing Address
                                </label>
                                {selectedCustomer && (
                                    <IconButton size="small" onClick={() => openAddressListModal('billing')}>
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                )}
                            </div>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
                                rows={4}
                                maxLength={500}
                                value={billingAddress}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) setBillingAddress(e.target.value);
                                }}
                                placeholder="Enter billing address"
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">{billingAddress.length}/500</p>
                            {selectedCustomer && !selectedBillingAddress && (
                                <button
                                    type="button"
                                    onClick={() => openAddressFormModal('new', 'billing')}
                                    className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block mt-2"
                                >
                                    New Address
                                </button>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Shipping Address
                                </label>
                                {selectedCustomer && (
                                    <IconButton size="small" onClick={() => openAddressListModal('shipping')}>
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                )}
                            </div>
                            <textarea
                                className={`w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y ${sameAsBilling ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                                rows={4}
                                maxLength={500}
                                value={shippingAddress}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) setShippingAddress(e.target.value);
                                }}
                                placeholder="Enter shipping address"
                                disabled={sameAsBilling}
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">{shippingAddress.length}/500</p>
                            {selectedCustomer && !selectedShippingAddress && (
                                <button
                                    type="button"
                                    onClick={() => openAddressFormModal('new', 'shipping')}
                                    className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block mt-2"
                                >
                                    New Address
                                </button>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Sales Order Details */}
                <Section title="Vendor Credit Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* <div>
                            <label className="block text-sm font-medium mb-2">
                                Sales Order #<span className="text-red-500">*</span>
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
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Order Number
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
                                Vendor Credit Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={salesOrderDate}
                                onChange={(e) => setSalesOrderDate(e.target.value)}
                                error={!!errors.salesOrderDate}
                                helperText={errors.salesOrderDate}
                                sx={fieldStyles}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium mb-2">
                                Due Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={expectedShipmentDate}
                                onChange={(e) => setExpectedShipmentDate(e.target.value)}
                                error={!!errors.expectedShipmentDate}
                                helperText={errors.expectedShipmentDate}
                                sx={fieldStyles}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div> */}

                        {/* <div>
                            <label className="block text-sm font-medium mb-2">
                                Payment Terms<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.paymentTerms}>
                                {/* <InputLabel>Payment Terms</InputLabel> */}
                        {/* <Select
                                    value={selectedTerm}
                                    label="Payment Terms"
                                    onChange={e => setSelectedTerm(e.target.value)}
                                    renderValue={val => {
                                        const found = filteredTerms.find(term => term.id === val);
                                        return found ? found.name : val;
                                    }}
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>Select payment term</MenuItem>
                                    {filteredTerms.map(term => (
                                        <MenuItem key={term.id || term.name} value={term.id}>{term.name}</MenuItem>
                                    ))} */}
                        {/* <MenuItem>
                                        <span className="text-blue-600 cursor-pointer" onClick={() => setShowConfig(true)}>
                                            Configure Terms
                                        </span>
                                    </MenuItem> */}
                        {/* </Select>
                            </FormControl> */}
                        {/* Configure Payment Terms Modal */}
                        {/* {showConfig && (
                                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                                        <h2 className="text-lg font-semibold mb-4">Configure Payment Terms</h2>
                                        <table className="w-full mb-4 text-sm">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-2 border">Term Name</th>
                                                    <th className="p-2 border">Number of Days</th>
                                                    <th className="p-2 border"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editTerms.map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td className="border p-2">
                                                            <input
                                                                className="border rounded px-2 py-1 w-full"
                                                                placeholder="Term Name"
                                                                value={row.name}
                                                                onChange={e => handleNewRowChange(idx, 'name', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border p-2">
                                                            <input
                                                                className="border rounded px-2 py-1 w-full"
                                                                placeholder="Days"
                                                                type="number"
                                                                value={row.days}
                                                                onChange={e => handleNewRowChange(idx, 'days', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border p-2">
                                                            <button className="text-red-600 text-xs" onClick={async () => {
                                                                if (row.id) {
                                                                    await handleRemovePaymentTerm(row.id, idx);
                                                                } else {
                                                                    handleRemoveNewRow(idx);
                                                                }
                                                            }}>Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                className="text-blue-600 text-sm"
                                                onClick={handleAddNewTerm}
                                            >
                                                + Add New
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded"
                                                onClick={handleSaveTerms}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-200 px-4 py-2 rounded"
                                                onClick={() => {
                                                    setEditTerms(paymentTerms.map(term => ({ ...term })));
                                                    setShowConfig(false);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div> */}
                        {/* <div>
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
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium ">
                                Subject
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                minRows={0}
                                maxRows={8}
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="Enter subject"
                                // sx={fieldStyles}
                                sx={{
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
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="reverseCharge"
                                checked={reverseCharge}
                                onChange={(e) => setReverseCharge(e.target.checked)}
                                className="w-4 h-4 accent-[#bf213e] cursor-pointer"
                            />
                            <label
                                htmlFor="reverseCharge"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                This transaction is applicable for reverse charge
                            </label>
                        </div>


                        {/* <div>
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
                                    {/* <MenuItem value="courier">Courier</MenuItem> */}
                        {/* <MenuItem value="hand-delivery">Hand Delivery</MenuItem> */}
                        {/* <MenuItem value="pickup">Pickup</MenuItem> */}
                        {/* <MenuItem value="shipping">Shipping</MenuItem> */}
                        {/* <MenuItem value="drive">Drive</MenuItem>
                                </Select>
                            </FormControl>
                        </div> */}


                    </div>
                </Section>

                {/* Item Table */}
                <Section title="Item Table" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-4">
                        {errors.items && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.items}</div>
                        )}

                        <div className="border border-border rounded-lg overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Item Details</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Account</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                                        {/* <th className="px-4 py-3 text-left text-sm font-medium">Customer</th> */}
                                        {/* <th className="px-4 py-3 text-left text-sm font-medium">Discount</th> */}
                                        <th className="px-4 py-3 text-left text-sm font-medium">Tax</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">

                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <ItemSearchInput
                                                    value={item.name}
                                                    itemOptions={itemOptions}
                                                    onSelect={(selected) => {
                                                        const isSameState = orgState && destinationOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                        updateItemFields(index, {
                                                            item_id: String(selected.id),
                                                            name: selected.name,
                                                            rate: selected.rate || 0,
                                                            description: selected.description || '',
                                                            item_tax_type: selected.tax_preference === 'non_taxable' ? 'non_taxable'
                                                                : selected.tax_preference === 'taxable' ? (isSameState ? 'tax_group' : 'tax_rate')
                                                                    : selected.tax_preference === 'out_of_scope' ? 'out_of_scope'
                                                                        : selected.tax_preference === 'non_gst_supply' ? 'non_gst_supply'
                                                                            : undefined,
                                                            tax_group_id: selected.tax_preference === 'taxable' ? (isSameState ? selected.tax_group_id : selected.inter_state_tax_rate_id) : null,
                                                            tax_exemption_id: selected.tax_preference === 'non_taxable' ? selected.tax_exemption_id : null,
                                                        });
                                                    }}
                                                    onType={(typed) => updateItemFields(index, { item_id: null, name: typed })}
                                                />
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
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id={`account-label-${index}`}>
                                                        Account
                                                    </InputLabel>

                                                    <Select
                                                        labelId={`account-label-${index}`}
                                                        value={item.account || ""}
                                                        label="Account*"
                                                        onChange={(e) => updateItem(index, "account", e.target.value)}
                                                        displayEmpty
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 300,
                                                                    minWidth: 250,
                                                                    maxWidth: 350,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>
                                                            Select Account
                                                        </MenuItem>

                                                        {accountGroups.map((group) =>
                                                            group.ledgers && group.ledgers.length > 0 ? [
                                                                <ListSubheader key={`group-${group.id}`}>
                                                                    {group.group_name}
                                                                </ListSubheader>,
                                                                ...group.ledgers.map((ledger) => (
                                                                    <MenuItem key={ledger.id} value={ledger.id}>
                                                                        {ledger.name}
                                                                    </MenuItem>
                                                                )),
                                                            ] : null
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </td>
                                            <td className="px-4 py-3">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || '')}
                                                    inputProps={{ min: 1, step: 1 }}
                                                    sx={{ width: 80 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.rate}
                                                    onChange={(e) => {
                                                        const parsed = parseFloat(e.target.value);
                                                        const safeRate = isNaN(parsed) ? '' : Math.max(0, parsed);
                                                        updateItem(index, 'rate', safeRate);
                                                    }}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                    sx={{ width: 100 }}
                                                />
                                            </td>
                                            {/* Customer Dropdown */}
                                            {/* <td className="px-4 py-3">
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        value={item.customer || ""}
                                                        onChange={(e) => updateItem(index, "customer", e.target.value)}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="">Select Customer</MenuItem>
                                                        {customerOptions.map((cust) => (
                                                            <MenuItem key={cust.id} value={cust.id}>
                                                                {cust.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </td> */}
                                            {/* {console.log("cust ops:",customerOptions)} */}
                                            {/* <td className="px-4 py-3"> */}
                                            {/* <div className="flex items-center gap-2">
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
                                                </div> */}
                                            {/* </td> */}
                                            {/* <td className="px-4 py-3">
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
                                            </td> */}


                                            <td className="px-4 py-3">
                                                <FormControl size="small" sx={{ width: 200 }}>
                                                    <Select
                                                        value={["tax_group", "tax_rate"].includes(item.item_tax_type) ? item.tax_group_id : item.item_tax_type || ""}
                                                        displayEmpty
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const isSameState = orgState && destinationOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();

                                                            // Static tax types
                                                            if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value)) {
                                                                updateItem(index, "item_tax_type", value);
                                                                updateItem(index, "tax_group_id", null);

                                                                if (value === "non_taxable") {
                                                                    setCurrentItemIndex(index);
                                                                    setExemptionModalOpen(true);
                                                                }
                                                            }
                                                            // Tax group (same state) or tax rate (different state)
                                                            else {
                                                                updateItem(index, "item_tax_type", isSameState ? "tax_group" : "tax_rate");
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

                                                        {(() => {
                                                            const isSameState = orgState && destinationOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                            return isSameState ? (
                                                                [
                                                                    <MenuItem key="__divider__" disabled>Tax Groups</MenuItem>,
                                                                    ...taxGroups.map((group) => (
                                                                        <MenuItem key={group.id} value={group.id}>
                                                                            {group.name}
                                                                        </MenuItem>
                                                                    ))
                                                                ]
                                                            ) : (
                                                                [
                                                                    <MenuItem key="__divider__" disabled>Tax Rates (IGST)</MenuItem>,
                                                                    ...taxRates.map((rate) => (
                                                                        <MenuItem key={rate.id} value={rate.id}>
                                                                            {rate.name}
                                                                        </MenuItem>
                                                                    ))
                                                                ]
                                                            );
                                                        })()}
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
                                variant="outline"
                                sx={{ textTransform: 'none' }}
                            >
                                Add New Row
                            </Button>
                            {/* <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button> */}
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
                            {!reverseCharge && taxBreakdown.map((tax, index) => (
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

                {/* Customer Notes */}
                <Section title="Notes" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Enter any notes for the customer"
                        sx={{
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
                {/* <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={termsAndConditions}
                        onChange={(e) => setTermsAndConditions(e.target.value)}
                        placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                    />
                </Section>  */}

                {/* Attachments */}
                <Section title="Attach Files to Sales Order" icon={<AttachFile className="w-5 h-5" />}>
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
                            label="Display attachments in customer portal and emails"
                        />
                    </div>
                </Section>

                {/* Email Communications */}
                {/* <Section title="Email Communications" icon={<FileText className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendEmailToCustomer}
                                    onChange={(e) => setSendEmailToCustomer(e.target.checked)}
                                />
                            }
                            label="Send email to selected customer above"
                        /> */}

                {/* Contact Persons Section */}
                {/* {selectedCustomer && selectedCustomer.contact_persons && selectedCustomer.contact_persons.length > 0 && (
                            <div>
                                <Typography variant="body2" className="font-semibold mb-2">
                                    Select contact persons to email
                                </Typography>
                                <div className="flex flex-col gap-2">
                                    {selectedCustomer.contact_persons.map((person) => (
                                        <div key={person.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedContactPersons.includes(person.id)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedContactPersons([...selectedContactPersons, person.id]);
                                                    } else {
                                                        setSelectedContactPersons(selectedContactPersons.filter(id => id !== person.id));
                                                    }
                                                }}
                                                size="small"
                                            />
                                            <Chip
                                                label={`${person.first_name} ${person.last_name} (${person.email})`}
                                                variant={selectedContactPersons.includes(person.id) ? "filled" : "outlined"}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                {/* External Users Section */}
                {/* <div>
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="body2" className="font-semibold">
                                    Add external users (email users other than the selected customer above)
                                </Typography>
                                {/* <Button
                                                    startIcon={<PersonAdd />}
                                                    onClick={() => setAddUserDialogOpen(true)}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Add More
                                                </Button> */}
                {/* </div>

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
                </Section> */}

                {/* Additional Fields */}
                {/* <Section title="Additional Fields" icon={<FileText className="w-5 h-5" />}>
                    <Typography variant="body2" className="text-gray-600">
                        Start adding custom fields for your payments made by going to Settings →  Purchases  → Bills.
                    </Typography>
                </Section> */}
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save as Open'}
                </Button>
            </div>

            <Dialog open={addressListModalOpen} onClose={() => setAddressListModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{activeAddressType === 'billing' ? 'Billing Address' : 'Shipping Address'}</DialogTitle>
                <DialogContent dividers>
                    <div className="max-h-[420px] overflow-y-auto space-y-3">
                        {getAddressBookByType(activeAddressType).map((addr) => (
                            <div
                                key={addr.id}
                                className={`border rounded-md p-3 text-sm cursor-pointer transition-colors ${String(activeAddressType === 'billing' ? selectedBillingAddressId : selectedShippingAddressId) === String(addr.id)
                                    ? 'border-[#C72030] bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => {
                                    if (activeAddressType === 'billing') setSelectedBillingAddressId(addr.id);
                                    else setSelectedShippingAddressId(addr.id);
                                    setAddressListModalOpen(false);
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5 text-gray-700">
                                        {addr.attention && <div className="font-semibold">{addr.attention}</div>}
                                        {addr.address && <div>{addr.address}</div>}
                                        {addr.address_line_two && <div>{addr.address_line_two}</div>}
                                        <div>{[addr.city, addr.state].filter(Boolean).join(', ')}{addr.pin_code ? ` ${addr.pin_code}` : ''}</div>
                                        {addr.country && <div>{addr.country}</div>}
                                    </div>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openAddressFormModal('edit', activeAddressType, addr);
                                        }}
                                    >
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className="!justify-between !px-4">
                    <button
                        type="button"
                        className="text-[#1d4ed8] text-sm font-medium"
                        onClick={() => openAddressFormModal('new', activeAddressType)}
                    >
                        + New address
                    </button>
                    <Button variant="outline" onClick={() => setAddressListModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addressFormModalOpen} onClose={() => setAddressFormModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Additional Address</DialogTitle>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <TextField
                            label="Attention"
                            fullWidth
                            value={addressForm.attention}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, attention: e.target.value }))}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Country/Region"
                            fullWidth
                            value={addressForm.country}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Address"
                            placeholder="Street 1"
                            fullWidth
                            value={addressForm.address}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                            className="md:col-span-2"
                        />
                        <TextField
                            placeholder="Street 2"
                            fullWidth
                            value={addressForm.address_line_two}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address_line_two: e.target.value }))}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="City"
                            fullWidth
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="State"
                            fullWidth
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        />
                        <TextField
                            label="Pin Code"
                            fullWidth
                            value={addressForm.pin_code}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, pin_code: e.target.value }))}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={addressForm.telephone_number}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, telephone_number: e.target.value }))}
                            InputProps={{ startAdornment: <InputAdornment position="start">+91</InputAdornment> }}
                        />
                        <TextField
                            label="Fax Number"
                            fullWidth
                            value={addressForm.fax_number}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, fax_number: e.target.value }))}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={handleSaveAddressForm}>Save</Button>
                    <Button variant="outline" onClick={() => setAddressFormModalOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstModalOpen} onClose={() => setGstModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Configure Tax Preferences</DialogTitle>
                <DialogContent className="!pt-2">
                    <div className="space-y-3">
                        <TextField
                            label="GST Treatment"
                            select
                            fullWidth
                            value={gstTreatmentDraft}
                            onChange={(e) => setGstTreatmentDraft(e.target.value)}
                        >
                            {gstTreatmentOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="GSTIN"
                            fullWidth
                            value={gstinDraft}
                            onChange={(e) => setGstinDraft(e.target.value.toUpperCase())}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={handleUpdateGstConfig}>Update</Button>
                    <Button variant="outline" onClick={() => setGstModalOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Vendor Details Drawer */}
            <Drawer
                anchor="right"
                open={customerDrawerOpen}
                onClose={() => setCustomerDrawerOpen(false)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 } } }}
            >
                {selectedCustomer && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">
                                        {(selectedCustomer.company_name || selectedCustomer.name || 'V').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <Typography variant="h6" className="font-bold">
                                        {selectedCustomer.company_name || selectedCustomer.name}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {selectedCustomer.email || '—'}
                                    </Typography>
                                </div>
                            </div>
                            <IconButton onClick={() => setCustomerDrawerOpen(false)}>
                                <Close />
                            </IconButton>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹0.00
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    Outstanding Payables
                                </Typography>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹0.00
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    Advance Balance
                                </Typography>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="font-semibold text-gray-700 mb-3 text-sm">Vendor Details</div>
                            {[
                                ['Vendor Name', selectedCustomer.company_name || selectedCustomer.name || '—'],
                                ['Email', selectedCustomer.email || '—'],
                                ['Mobile', selectedCustomer.mobile1 || selectedCustomer.mobile2 || '—'],
                                ['Currency', selectedCustomer.currency || 'INR'],
                                ['Payment Terms', selectedCustomer.payment_terms || selectedCustomer.paymentTerms || '—'],
                                ['GST Treatment', getGstTreatmentLabel(selectedCustomer.gst_preference || selectedCustomer.gst_treatment)],
                                ['GSTIN', selectedCustomer.gstin || '—'],
                                ['Billing Address', formatInlineAddress(selectedCustomer.default_billing_address || selectedCustomer.billing_address)],
                                ['Shipping Address', formatInlineAddress(selectedCustomer.default_shipping_address || selectedCustomer.shipping_address)],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 gap-4">
                                    <span className="text-xs text-[#C72030] w-36 shrink-0">{label}</span>
                                    <span className="text-xs text-gray-700 text-right">{value}</span>
                                </div>
                            ))}
                        </div>

                        <Divider />

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Typography variant="subtitle1" className="font-semibold">
                                    Contact Persons
                                </Typography>
                                <Button
                                    size="sm"
                                    onClick={() => setContactPersonDialogOpen(true)}
                                    variant="outline"
                                >
                                    <Add style={{ fontSize: 16, marginRight: 4 }} /> Add
                                </Button>
                            </div>

                            {/* {selectedCustomer.contactPersons.length === 0 ? (
                                <Typography variant="body2" className="text-gray-500">
                                    No contact persons added
                                </Typography>
                            ) : (
                                <div className="space-y-3">
                                    {selectedCustomer.contactPersons.map(person => (
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
                            )} */}
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
                    <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={handleAddExternalUser}>Add</Button>
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
                    <Button variant="outline" onClick={() => setContactPersonDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={handleAddContactPerson}>Save</Button>
                </DialogActions>
            </Dialog>

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
