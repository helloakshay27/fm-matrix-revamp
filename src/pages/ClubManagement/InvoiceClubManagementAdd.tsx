import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    EditOutlined,
    CloudUpload,
    AttachFile,
    PersonAdd,
    ChevronRight
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ChevronDown, ChevronUp, Mail, Phone, Smartphone, Star, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import {
    BankRecord,
    bankMasterListUrl,
    getBankMasterApiConfig,
    mapApiBankRecord,
} from './bankMasterUtils';

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

interface CustomerDetail {
    company_name: string;
    salutation: string;
    first_name: string;
    last_name: string;
    email: string;
    outstanding_receivable_amount: number;
    unused_credits_receivable_amount: number;
    customer_type: string;
    currency: string;
    payment_terms: string;
    portal_status: string;
    customer_language: string;
    gst_treatment: string;
    gst_preference?: string;
    gstin: string;
    pan: string;
    place_of_supply: string;
    tax_preference: string;
    contact_persons: any[];
    billing_address: any;
    shipping_address: any;
    billing_addresses?: CustomerAddress[];
    shipping_addresses?: CustomerAddress[];
    default_billing_address?: any;
    default_shipping_address?: any;
    gst_details?: GstDetail[];
}

interface CustomerAddress {
    id: number | string;
    attention: string;
    address: string;
    address_line_two: string;
    country: string;
    state: string;
    city: string;
    pin_code: string;
    telephone_number: string;
    fax_number: string;
    mobile: string;
}

interface GstDetail {
    id: number | string;
    gstin: string;
    place_of_supply: string;
    business_legal_name: string | null;
    business_trade_name: string | null;
    primary: boolean;
}

interface Item {
    id: string;
    name: string;
    item_id?: string | null;
    description: string;
    quantity: number | '';
    rate: number | '';
    discount: number | '';
    discountType: 'percentage' | 'amount';
    tax: string;
    taxRate: number;
    amount: number;
    item_tax_type?: string
    tax_group_id?: number | null
    tax_exemption_id?: number | null
}

interface ExternalUser {
    name: string;
    email: string;
}

export const InvoiceClubManagementAdd: React.FC = () => {
    // Subject field
    const [subject, setSubject] = useState('');
    // Fetch item list from API
    const lock_account_id = localStorage.getItem("lock_account_id");
    // console.log("lock id:",lock_account_id)
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_items/select_list.json?lock_account_id=${lock_account_id}&q[can_be_sold_eq]=1&active=true`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setItemOptions(res.data.map(item => ({
                        id: item.id, name: item.name, rate: item.sale_rate, description: item.sale_description,
                        tax_preference: item.tax_preference,
                        tax_exemption_id: item.tax_exemption_id,
                        tax_group_id: Number(item.intra_state_tax_rate_id) || null,
                        inter_state_tax_rate_id: item.inter_state_tax_rate_id
                    })));
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
            try {
                const res = await axios.get(`https://${baseUrl}/sales_persons.json?lock_account_id=${lock_account_id}&q[active_eq]=1`, {
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
            try {
                const res = await axios.get(`https://${baseUrl}/payment_terms.json?lock_account_id=${lock_account_id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    const terms = res.data.map(pt => ({ id: pt.id, name: pt.name, days: pt.no_of_days }));
                    setPaymentTermsList(terms);
                    const dueOnReceipt = terms.find(t => t.name.toLowerCase() === 'due on receipt');
                    if (dueOnReceipt) {
                        setSelectedTerm(dueOnReceipt.id);
                    }
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
    const location = useLocation();

    useEffect(() => {
        document.title = 'New Invoice';
    }, []);

    // Bill-to: Guest / Member selection (replaces Customer + Currency)
    const [guests, setGuests] = useState<{ id: string; name: string }[]>([]);
    const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
    const [selectedGuestId, setSelectedGuestId] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');

    // Customer data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
    const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null);
    const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
    const [drawerActiveTab, setDrawerActiveTab] = useState<'details' | 'activity'>('details');
    const [addressExpanded, setAddressExpanded] = useState(true);
    const [contactPersonsExpanded, setContactPersonsExpanded] = useState(true);
    const [billingAddressBook, setBillingAddressBook] = useState<CustomerAddress[]>([]);
    const [shippingAddressBook, setShippingAddressBook] = useState<CustomerAddress[]>([]);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<number | string | null>(null);
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | string | null>(null);
    const [addressListModalOpen, setAddressListModalOpen] = useState(false);
    const [addressFormModalOpen, setAddressFormModalOpen] = useState(false);
    const [activeAddressType, setActiveAddressType] = useState<'billing' | 'shipping'>('billing');
    const [addressFormMode, setAddressFormMode] = useState<'new' | 'edit'>('new');
    const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);
    const [selectedAddressTaxInfoId, setSelectedAddressTaxInfoId] = useState<string>('');
    const [gstModalOpen, setGstModalOpen] = useState(false);
    const [gstTreatmentDraft, setGstTreatmentDraft] = useState('');
    const [gstManageModalOpen, setGstManageModalOpen] = useState(false);
    const [gstPickerModalOpen, setGstPickerModalOpen] = useState(false);
    const [showNewGstForm, setShowNewGstForm] = useState(false);
    const [gstDetails, setGstDetails] = useState<GstDetail[]>([]);
    const [selectedGstDetailId, setSelectedGstDetailId] = useState<number | string | null>(null);
    const [editingGstDetailId, setEditingGstDetailId] = useState<number | string | null>(null);
    const [newGstForm, setNewGstForm] = useState({
        gstin: '',
        place_of_supply: '',
        business_legal_name: '',
        business_trade_name: ''
    });

    // Contact persons selected for email
    const [selectedContactPersons, setSelectedContactPersons] = useState<number[]>([]);

    // Address
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [sameAsBilling, setSameAsBilling] = useState(false);

    // Sales Order Details
    const [salesOrderNumber, setSalesOrderNumber] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [salesOrderDate, setSalesOrderDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [expectedShipmentDate, setExpectedShipmentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
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
            item_tax_type: "",
            tax_group_id: "",
            tax_exemption_id: ""
        }
    ]);

    const taxTypeOptions = [
        { value: "non_taxable", label: "Non-Taxable" },
        { value: "out_of_scope", label: "Out of Scope" },
        { value: "non_gst_supply", label: "Non-GST Supply" },
        //   { value: "tax_group", label: "Tax Group" }
    ];
    const [placeOfSupply, setPlaceOfSupply] = useState("");
    const [orgState, setOrgState] = useState<string>("");
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
            .catch((error) => console.error("Error fetching IGST tax rates:", error));
    }, []);

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
                const state = org?.address?.state || '';
                console.log('[InvoiceAdd] Org state from API:', state);
                setOrgState(state);
            } catch (err) {
                console.error('[InvoiceAdd] Failed to fetch org state:', err);
            }
        };
        fetchOrgState();
    }, []);

    // Re-preselect tax on all taxable items when place of supply or orgState changes
    useEffect(() => {
        if (!placeOfSupply) return;
        const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
        setItems(prev => prev.map(item => {
            if (!["tax_group", "tax_rate"].includes(item.item_tax_type)) return item;
            const matched = (itemOptions as any[]).find(opt => opt.name === item.name);
            if (!matched) return item;
            return {
                ...item,
                item_tax_type: isSameState ? "tax_group" : "tax_rate",
                tax_group_id: isSameState ? matched.tax_group_id : matched.inter_state_tax_rate_id,
            };
        }));
    }, [placeOfSupply, orgState]); // eslint-disable-line react-hooks/exhaustive-deps

    const [exemptionModalOpen, setExemptionModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedExemption, setSelectedExemption] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

    const [customerExemptions, setCustomerExemptions] = useState<any[]>([]);
    const [loadingExemptions, setLoadingExemptions] = useState(false);

    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

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

    // Bank Details
    const [bankOptions, setBankOptions] = useState<BankRecord[]>([]);
    const [selectedBankId, setSelectedBankId] = useState<string>('');

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();
                const res = await axios.get(`${bankMasterListUrl(baseUrl, lockAccountId)}&active=true`, { headers });
                const data = Array.isArray(res.data) ? res.data : (res.data?.bank_masters || res.data?.data || []);
                setBankOptions(data.map(mapApiBankRecord));
            } catch (err) {
                setBankOptions([]);
            }
        };
        fetchBanks();
    }, []);

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
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number; description?: string; tax_preference?: string; tax_exemption_id?: number | null; tax_group_id?: number | null; inter_state_tax_rate_id?: any }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    // const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };
    const modalPrimaryButtonSx = {
        backgroundColor: '#DA7756',
        textTransform: 'none',
        '&:hover': { backgroundColor: '#C45F40' }
    };
    const modalSecondaryButtonSx = {
        color: '#DA7756',
        borderColor: '#DA7756',
        textTransform: 'none',
        '&:hover': { borderColor: '#DA7756', backgroundColor: 'rgba(218, 119, 86, 0.06)' }
    };
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
    const getGstTreatmentLabel = (value?: string) => {
        if (!value) return '';
        return gstTreatmentOptions.find(opt => opt.value === value)?.label || value;
    };
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
        mobile: ''
    };
    const [addressForm, setAddressForm] = useState<CustomerAddress>(emptyAddressForm);
    const addressCountryOptions = [
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' }
    ];
    const mapAddress = (address: any, fallbackType: 'billing' | 'shipping'): CustomerAddress => ({
        id: address?.id ?? `${fallbackType}-${Date.now()}-${Math.random()}`,
        attention: address?.attention || address?.contact_person || '',
        address: address?.address || '',
        address_line_two: address?.address_line_two || '',
        country: address?.country || 'India',
        state: address?.state || '',
        city: address?.city || '',
        pin_code: address?.pin_code || '',
        telephone_number: address?.telephone_number || '',
        fax_number: address?.fax_number || '',
        mobile: address?.mobile || ''
    });
    const formatAddressText = (addr?: CustomerAddress | null): string => {
        if (!addr) return '';
        const parts = [
            addr.attention,
            addr.address,
            addr.address_line_two,
            [addr.city, addr.state].filter(Boolean).join(', '),
            addr.pin_code,
            addr.country
        ].filter(Boolean);
        const contact = [addr.telephone_number, addr.fax_number ? `Fax: ${addr.fax_number}` : ''].filter(Boolean).join(' ');
        return [...parts, contact].filter(Boolean).join(', ');
    };
    const getAddressBookByType = (type: 'billing' | 'shipping') => type === 'billing' ? billingAddressBook : shippingAddressBook;
    const selectedBillingAddress = billingAddressBook.find(a => String(a.id) === String(selectedBillingAddressId)) || billingAddressBook[0] || null;
    const selectedShippingAddress = shippingAddressBook.find(a => String(a.id) === String(selectedShippingAddressId)) || shippingAddressBook[0] || null;
    const selectedGstDetail = gstDetails.find(g => String(g.id) === String(selectedGstDetailId)) || gstDetails.find(g => g.primary) || gstDetails[0] || null;

    // Generate auto sales order number
    useEffect(() => {
        const generateOrderNumber = () => {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            setSalesOrderNumber(`SO-${timestamp.toString().slice(-5)}${random}`);
        };
        generateOrderNumber();
    }, []);

    // Fetch customer detail from API
    const fetchCustomerDetail = async (
        customerId: string | number,
        preferredGstin?: string,
        newAddressToSelect?: { type: 'billing' | 'shipping', attention: string, address: string, pin_code: string }
    ) => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem("lock_account_id");
        setCustomerDetailLoading(true);
        try {
            const response = await fetch(`https://${baseUrl}/lock_account_customers/${customerId}.json?lock_account_id=${lock_account_id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setCustomerDetail(data);
            const nextBilling = Array.isArray(data.billing_addresses) && data.billing_addresses.length
                ? data.billing_addresses.map((a: any) => mapAddress(a, 'billing'))
                : (data.billing_address ? [mapAddress(data.billing_address, 'billing')] : []);
            const nextShipping = Array.isArray(data.shipping_addresses) && data.shipping_addresses.length
                ? data.shipping_addresses.map((a: any) => mapAddress(a, 'shipping'))
                : (data.shipping_address ? [mapAddress(data.shipping_address, 'shipping')] : []);
            setBillingAddressBook(nextBilling);
            setShippingAddressBook(nextShipping);
            const nextGstDetails: GstDetail[] = Array.isArray(data.gst_details) ? data.gst_details : [];
            setGstDetails(nextGstDetails);
            const defaultGst =
                (preferredGstin ? nextGstDetails.find(g => g.gstin === preferredGstin) : null) ||
                nextGstDetails.find(g => g.primary) ||
                nextGstDetails[0] ||
                null;
            if (defaultGst) {
                setSelectedGstDetailId(defaultGst.id);
                setPlaceOfSupply(defaultGst.place_of_supply || data.place_of_supply || (data.billing_address as any)?.state || placeOfSupply);
                setCustomerDetail((prev) => (prev ? { ...prev, gstin: defaultGst.gstin } : prev));
            } else {
                setSelectedGstDetailId(null);
                const fallbackSupply = data.place_of_supply || (data.billing_address as any)?.state || '';
                if (fallbackSupply) setPlaceOfSupply(fallbackSupply);
            }

            // Billing address logic
            let finalBilling = null;
            if (newAddressToSelect?.type === 'billing') {
                finalBilling = nextBilling.find(a =>
                    a.attention === newAddressToSelect.attention &&
                    a.address === newAddressToSelect.address &&
                    a.pin_code === newAddressToSelect.pin_code
                );
            }
            if (!finalBilling && selectedBillingAddressId) {
                finalBilling = nextBilling.find(a => String(a.id) === String(selectedBillingAddressId));
            }
            if (!finalBilling) {
                finalBilling = data.default_billing_address
                    ? mapAddress(data.default_billing_address, 'billing')
                    : (nextBilling.length > 0 ? nextBilling[0] : null);
            }

            // Shipping address logic
            let finalShipping = null;
            if (newAddressToSelect?.type === 'shipping') {
                finalShipping = nextShipping.find(a =>
                    a.attention === newAddressToSelect.attention &&
                    a.address === newAddressToSelect.address &&
                    a.pin_code === newAddressToSelect.pin_code
                );
            }
            if (!finalShipping && selectedShippingAddressId) {
                finalShipping = nextShipping.find(a => String(a.id) === String(selectedShippingAddressId));
            }
            if (!finalShipping) {
                finalShipping = data.default_shipping_address
                    ? mapAddress(data.default_shipping_address, 'shipping')
                    : (nextShipping.length > 0 ? nextShipping[0] : null);
            }

            setSelectedBillingAddressId(finalBilling?.id ?? null);
            setSelectedShippingAddressId(finalShipping?.id ?? null);
            setBillingAddress(formatAddressText(finalBilling));
            setShippingAddress(formatAddressText(finalShipping));
        } catch (error) {
            console.error('Error fetching customer detail:', error);
            toast.error('Failed to load customer details');
        } finally {
            setCustomerDetailLoading(false);
        }
    };

    const openCustomerDrawer = (customerId: string | number) => {
        fetchCustomerDetail(customerId);
        setCustomerDrawerOpen(true);
    };

    // Pre-fill from quote when navigated via Convert to Invoice
    useEffect(() => {
        const quoteId = location.state?.quoteData?.id;
        if (!quoteId) return;
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios.get(`https://${baseUrl}/lock_account_quotes/${quoteId}.json`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        }).then(async (res) => {
            const q = res.data;
            // NOTE: Do NOT pre-fill referenceNumber (Order Number field) from quote's reference_number
            if (q.quote_number) {
                setReferenceNumber(q.quote_number);
            }
            if (q.date) setSalesOrderDate(q.date);
            if (q.customer_notes) setCustomerNotes(q.customer_notes);
            if (q.terms_and_conditions) setTermsAndConditions(q.terms_and_conditions);
            if (q.subject) setSubject(q.subject);
            if (q.sales_person_id) setSalesperson(String(q.sales_person_id));
            if (q.payment_term_id) setSelectedTerm(String(q.payment_term_id));
            if (q.bank_master_id) setSelectedBankId(String(q.bank_master_id));
            // Set place of supply directly from quote
            const quotePlaceOfSupply = q.place_of_supply || q.address_detail?.gst_detail?.place_of_supply || '';
            if (quotePlaceOfSupply) setPlaceOfSupply(quotePlaceOfSupply);
            if (q.lock_account_customer_id) {
                setSelectedCustomer({ id: String(q.lock_account_customer_id), name: q.customer_name || '' } as any);
                // Fetch customer details (addresses, GST), then re-apply quote's place of supply
                await fetchCustomerDetail(String(q.lock_account_customer_id));
                if (quotePlaceOfSupply) setPlaceOfSupply(quotePlaceOfSupply);
            }
            if (Array.isArray(q.item_details) && q.item_details.length > 0) {
                setItems(q.item_details.map((item: any, idx: number) => ({
                    id: String(idx + 1),
                    name: item.item_name || '',
                    item_id: item.lock_account_item_id ? String(item.lock_account_item_id) : null,
                    description: item.description || '',
                    quantity: item.quantity || '',
                    rate: item.rate || '',
                    discount: 0,
                    discountType: 'percentage' as const,
                    tax: item.tax_group?.name || '',
                    taxRate: 0,
                    amount: item.total_amount || 0,
                    item_tax_type: item.tax_type || '',
                    tax_group_id: item.tax_group?.id || null,
                    tax_exemption_id: null,
                })));
            }
        }).catch((err) => {
            console.error('Failed to fetch quote for pre-fill:', err);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Pre-fill from sales order when navigated via Convert to Invoice
    useEffect(() => {
        const saleOrderId = location.state?.saleOrderId;
        if (!saleOrderId) return;
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios.get(`https://${baseUrl}/sale_orders/${saleOrderId}.json`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
        }).then(async (res) => {
            const saleOrder = res.data;
            const addressDetail = saleOrder?.address_detail || {};
            const preferredGstin = addressDetail?.gst_detail?.gstin;

            // Keep the new invoice order number blank; conversion metadata is submitted separately.
            if (saleOrder.sale_order_number) {
                setReferenceNumber(saleOrder.sale_order_number);
            }
            if (saleOrder.date) setSalesOrderDate(saleOrder.date);
            if (saleOrder.shipment_date) setExpectedShipmentDate(saleOrder.shipment_date);
            if (saleOrder.customer_notes) setCustomerNotes(saleOrder.customer_notes);
            if (saleOrder.terms_and_conditions) setTermsAndConditions(saleOrder.terms_and_conditions);
            if (saleOrder.subject) setSubject(saleOrder.subject);
            if (saleOrder.sales_person_id || saleOrder.sales_person_name) {
                setSalesperson(String(saleOrder.sales_person_id || saleOrder.sales_person_name));
            }
            if (saleOrder.payment_term_id) setSelectedTerm(String(saleOrder.payment_term_id));
            if (saleOrder.bank_master_id) setSelectedBankId(String(saleOrder.bank_master_id));

            const convertedPlaceOfSupply =
                saleOrder.place_of_supply ||
                addressDetail?.gst_detail?.place_of_supply ||
                '';
            if (convertedPlaceOfSupply) setPlaceOfSupply(convertedPlaceOfSupply);

            if (saleOrder.discount_per !== null && saleOrder.discount_per !== undefined && saleOrder.discount_per !== '') {
                setDiscountTypeOnTotal('percentage');
                setDiscountOnTotal(Number(saleOrder.discount_per) || 0);
            } else {
                setDiscountTypeOnTotal('amount');
                setDiscountOnTotal(Number(saleOrder.discount_amount) || 0);
            }

            setAdjustment(Number(saleOrder.charge_amount) || 0);
            setAdjustmentLabel(saleOrder.charge_name || 'Adjustment');

            if (saleOrder.tax_type) {
                const normalizedTaxType = String(saleOrder.tax_type).toUpperCase();
                if (normalizedTaxType === 'TDS' || normalizedTaxType === 'TCS') {
                    setTaxType(normalizedTaxType);
                }
            }
            if (saleOrder.lock_account_tax_id || saleOrder.lock_account_tax?.id) {
                setSelectedTax(String(saleOrder.lock_account_tax_id || saleOrder.lock_account_tax?.id));
            }

            if (saleOrder.lock_account_customer_id) {
                setSelectedCustomer({ id: String(saleOrder.lock_account_customer_id), name: saleOrder.customer_name || '' } as any);
                await fetchCustomerDetail(String(saleOrder.lock_account_customer_id), preferredGstin);
                if (addressDetail?.billing_address_id) setSelectedBillingAddressId(addressDetail.billing_address_id);
                if (addressDetail?.shipping_address_id) setSelectedShippingAddressId(addressDetail.shipping_address_id);
                if (addressDetail?.gst_detail_id) setSelectedGstDetailId(addressDetail.gst_detail_id);
                if (convertedPlaceOfSupply) setPlaceOfSupply(convertedPlaceOfSupply);
            }

            if (Array.isArray(saleOrder.item_details) && saleOrder.item_details.length > 0) {
                setItems(saleOrder.item_details.map((item: any, idx: number) => ({
                    id: String(idx + 1),
                    name: item.item_name || '',
                    item_id: item.lock_account_item_id ? String(item.lock_account_item_id) : null,
                    description: item.description || '',
                    quantity: item.quantity || '',
                    rate: item.rate || '',
                    discount: 0,
                    discountType: 'percentage' as const,
                    tax: item.tax_group?.name || item.tax_rate?.name || '',
                    taxRate: 0,
                    amount: item.total_amount || 0,
                    item_tax_type: item.tax_type || '',
                    tax_group_id: item.tax_group?.id || item.tax_rate?.id || null,
                    tax_exemption_id: item.tax_exemption_id || null,
                })));
            }
        }).catch((err) => {
            console.error('Failed to fetch sales order for invoice pre-fill:', err);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const openAddressListModal = (type: 'billing' | 'shipping') => {
        setActiveAddressType(type);
        setAddressListModalOpen(true);
    };
    const openAddressFormModal = (mode: 'new' | 'edit', type: 'billing' | 'shipping', address?: CustomerAddress) => {
        setActiveAddressType(type);
        setAddressFormMode(mode);
        if (mode === 'edit' && address) {
            setEditingAddressId(address.id);
            setAddressForm({ ...address });
        } else {
            setEditingAddressId(null);
            setAddressForm({ ...emptyAddressForm, id: `${type}-${Date.now()}` });
        }
        setSelectedAddressTaxInfoId(selectedGstDetailId ? String(selectedGstDetailId) : '');
        setAddressFormModalOpen(true);
    };
    const openGstModal = () => {
        setGstTreatmentDraft(customerDetail?.gst_preference || customerDetail?.gst_treatment || '');
        setGstModalOpen(true);
    };
    const openGstManageModal = () => {
        setShowNewGstForm(false);
        setEditingGstDetailId(null);
        setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
        setGstManageModalOpen(true);
    };
    const openGstPickerModal = () => setGstPickerModalOpen(true);

    // Fetch customers on mount
    useEffect(() => {
        setLoadingCustomers(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        // Fetch customer list
        axios
            .get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setCustomers(res.data || []);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            })
            .finally(() => {
                setLoadingCustomers(false);
            });
    }, []);

    // Fetch guests on mount
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/pms/account_setups/occupant_users.json?per_page=200&q[lock_user_permissions_user_type_eq]=pms_guest`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                const list = res.data?.occupant_users || [];
                setGuests(list.map((u: any) => ({
                    id: String(u.id),
                    name: `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim() || u.email || `Guest #${u.id}`
                })));
            })
            .catch(error => {
                console.error('Error fetching guests:', error);
                setGuests([]);
            });
    }, []);

    // Fetch members on mount
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/club_members.json?access_token=${token}&per_page=200`)
            .then(res => {
                const list = res.data?.club_members || [];
                setMembers(list.map((m: any) => ({
                    id: String(m.id),
                    name: m.user_name || m.name || `Member #${m.id}`
                })));
            })
            .catch(error => {
                console.error('Error fetching members:', error);
                setMembers([]);
            });
    }, []);

    // Item table quick-add: Facility Booking / Membership / Event pickers (per row)
    const [itemSourceChecks, setItemSourceChecks] = useState<Record<string, { facility: boolean; membership: boolean; event: boolean }>>({});
    const toggleItemSourceCheck = (itemId: string, key: 'facility' | 'membership' | 'event', checked: boolean) => {
        setItemSourceChecks(prev => ({
            ...prev,
            [itemId]: { facility: false, membership: false, event: false, ...prev[itemId], [key]: checked }
        }));
    };
    const [facilityBookingOptions, setFacilityBookingOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [membershipPlanOptions, setMembershipPlanOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [eventOptionsList, setEventOptionsList] = useState<{ id: string; name: string; rate: number }[]>([]);

    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const authHeaders = { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' };

        axios.get(`https://${baseUrl}/pms/admin/facility_bookings.json`, { headers: authHeaders })
            .then(res => {
                const list = res.data?.bookings || [];
                setFacilityBookingOptions(list.map((b: any) => ({
                    id: String(b.id),
                    name: b.facility_name || `Booking #${b.id}`,
                    rate: Number(b.amount_full) || 0
                })));
            })
            .catch(error => {
                console.error('Error fetching facility bookings:', error);
                setFacilityBookingOptions([]);
            });

        axios.get(`https://${baseUrl}/membership_plans.json`, { headers: authHeaders })
            .then(res => {
                const list = res.data?.plans || [];
                setMembershipPlanOptions(list.map((p: any) => ({
                    id: String(p.id),
                    name: p.name || `Plan #${p.id}`,
                    rate: Number(p.price) || 0
                })));
            })
            .catch(error => {
                console.error('Error fetching membership plans:', error);
                setMembershipPlanOptions([]);
            });

        axios.get(`https://${baseUrl}/pms/admin/events.json?per_page=200&page=1`, { headers: authHeaders })
            .then(res => {
                const list = res.data?.classifieds || [];
                setEventOptionsList(list.map((e: any) => ({
                    id: String(e.id),
                    name: e.event_name || `Event #${e.id}`,
                    rate: 0
                })));
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setEventOptionsList([]);
            });
    }, []);

    // Fills the given item row from a Facility Booking / Membership Plan / Event selection
    const applySourceToItem = (index: number, label: string, rate: number) => {
        updateItemFields(index, { item_id: null, name: label, rate });
    };

    console.log('Customers:', customers)
    // Fetch items, salespersons, taxes
    useEffect(() => {

        // setTermsAndConditions('1. Use this to issue for all sales orders of all customers.\n2. Payment should be made within 30 days of the invoice date.\n3. Late payments may incur additional charges.');
    }, []);

    // When customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            setBillingAddress(selectedCustomer.billingAddress);
            setShippingAddress(selectedCustomer.shippingAddress);
            setPaymentTerms(selectedCustomer.paymentTerms);
        }
    }, [selectedCustomer]);

    // Same as billing address
    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [sameAsBilling, billingAddress]);
    useEffect(() => {
        if (selectedBillingAddress) setBillingAddress(formatAddressText(selectedBillingAddress));
    }, [selectedBillingAddressId, billingAddressBook.length]);
    useEffect(() => {
        if (!sameAsBilling && selectedShippingAddress) setShippingAddress(formatAddressText(selectedShippingAddress));
    }, [selectedShippingAddressId, shippingAddressBook.length, sameAsBilling]);

    const handleSaveAddressForm = async () => {
        if (!selectedCustomer?.id) return toast.error("Please select a customer first");
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const lock_account_id = localStorage.getItem("lock_account_id");
        const setBook = activeAddressType === 'billing' ? setBillingAddressBook : setShippingAddressBook;
        const setSelectedId = activeAddressType === 'billing' ? setSelectedBillingAddressId : setSelectedShippingAddressId;
        const targetId = editingAddressId ?? addressForm.id ?? `${activeAddressType}-${Date.now()}`;
        const payload: CustomerAddress = { ...addressForm, id: targetId };
        const addressAttr: any = {
            attention: addressForm.attention || '',
            address: addressForm.address || '',
            email: '',
            address_type: activeAddressType,
            address_line_two: addressForm.address_line_two || '',
            address_line_three: '',
            country: addressForm.country || 'India',
            state: addressForm.state || '',
            city: addressForm.city || '',
            pin_code: addressForm.pin_code || '',
            telephone_number: addressForm.telephone_number || '',
            fax_number: addressForm.fax_number || '',
            mobile: addressForm.mobile || '',
            contact_person: addressForm.attention || '',
            gst_detail_id: selectedAddressTaxInfoId ? Number(selectedAddressTaxInfoId) : null
        };
        if (addressFormMode === 'edit' && !String(targetId).startsWith(`${activeAddressType}-`)) addressAttr.id = Number(targetId) || targetId;
        const updatePayload = {
            lock_account_customer: {
                id: selectedCustomer.id,
                [activeAddressType === 'billing' ? 'billing_addresses_attributes' : 'shipping_addresses_attributes']: [addressAttr]
            }
        };
        try {
            const response = await fetch(`https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload)
            });
            if (!response.ok) throw new Error(`Address save failed (${response.status})`);
            setBook(prev => addressFormMode === 'edit' ? prev.map(item => (String(item.id) === String(targetId) ? payload : item)) : [...prev, payload]);
            setSelectedId(targetId);
            setAddressFormModalOpen(false);
            setAddressListModalOpen(false);
            toast.success("Address saved successfully");
            fetchCustomerDetail(selectedCustomer.id, undefined, {
                type: activeAddressType,
                attention: addressForm.attention,
                address: addressForm.address,
                pin_code: addressForm.pin_code
            });
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save address");
        }
    };
    const handleUpdateGstConfig = () => {
        setCustomerDetail((prev) => prev ? { ...prev, gst_preference: gstTreatmentDraft, gst_treatment: gstTreatmentDraft } : prev);
        setGstModalOpen(false);
    };
    const handleGstinDropdownChange = (value: string | number) => {
        setSelectedGstDetailId(value);
        const selected = gstDetails.find(g => String(g.id) === String(value));
        if (!selected) return;
        setCustomerDetail((prev) => prev ? { ...prev, gstin: selected.gstin } : prev);
        if (selected.place_of_supply) setPlaceOfSupply(selected.place_of_supply);
        setGstPickerModalOpen(false);
    };
    const handleSaveAndSelectGst = async () => {
        if (!selectedCustomer?.id) return toast.error("Please select a customer first");
        if (!newGstForm.gstin || !newGstForm.place_of_supply) return toast.error("GSTIN and Place of Supply are required");
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        const normalizedGstin = String(newGstForm.gstin || '').toUpperCase().trim();
        if (!gstinRegex.test(normalizedGstin)) return toast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const lock_account_id = localStorage.getItem("lock_account_id");
        const gstAttribute = {
            ...(editingGstDetailId ? { id: Number(editingGstDetailId) || editingGstDetailId } : {}),
            gstin: normalizedGstin,
            place_of_supply: newGstForm.place_of_supply,
            business_legal_name: newGstForm.business_legal_name || '',
            business_trade_name: newGstForm.business_trade_name || ''
        };
        const payload = { lock_account_customer: { id: selectedCustomer.id, gst_details_attributes: [gstAttribute] } };
        try {
            const response = await fetch(`https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`GST detail save failed (${response.status})`);
            setShowNewGstForm(false);
            setEditingGstDetailId(null);
            setGstManageModalOpen(false);
            toast.success("Tax information saved");
            await fetchCustomerDetail(selectedCustomer.id, normalizedGstin);
        } catch (error) {
            console.error("Error saving gst detail:", error);
            toast.error("Failed to save tax information");
        }
    };
    const handleEditGstDetail = (gst: GstDetail) => {
        setEditingGstDetailId(gst.id);
        setShowNewGstForm(true);
        setNewGstForm({
            gstin: gst.gstin || '',
            place_of_supply: gst.place_of_supply || '',
            business_legal_name: gst.business_legal_name || '',
            business_trade_name: gst.business_trade_name || ''
        });
    };
    const handleDeleteGstDetail = async (gstId: number | string) => {
        if (!selectedCustomer?.id) return toast.error("Please select a customer first");
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const lock_account_id = localStorage.getItem("lock_account_id");
        const payload = { lock_account_customer: { id: selectedCustomer.id, gst_details_attributes: [{ id: Number(gstId) || gstId, _destroy: true }] } };
        try {
            const response = await fetch(`https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`GST detail delete failed (${response.status})`);
            toast.success("Tax information deleted");
            await fetchCustomerDetail(selectedCustomer.id);
        } catch (error) {
            console.error("Error deleting gst detail:", error);
            toast.error("Failed to delete tax information");
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
            newItems[index].amount = calculateItemAmount(newItems[index]);
            return newItems;
        });
    };

    // Update multiple fields at once (avoids multiple re-renders)
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
            item_id: null,
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

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
    const [deleteTargetType, setDeleteTargetType] = useState<'item' | 'attachment' | null>(null);

    const handleDeleteConfirm = () => {
        if (deleteTargetIndex !== null) {
            if (deleteTargetType === 'item') {
                removeItem(deleteTargetIndex);
            } else if (deleteTargetType === 'attachment') {
                removeAttachment(deleteTargetIndex);
            }
        }
        setDeleteConfirmOpen(false);
        setDeleteTargetIndex(null);
        setDeleteTargetType(null);
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

    // Validation
    // const validate = (): boolean => {
    //     const newErrors: Record<string, string> = {};

    //     if (!selectedCustomer) newErrors.customer = 'Customer is required';
    //     if (!salesOrderDate) newErrors.salesOrderDate = 'Sales order date is required';
    //     if (!expectedShipmentDate) newErrors.expectedShipmentDate = 'Expected shipment date is required';
    //     if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

    //     const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
    //     if (!hasValidItems) newErrors.items = 'At least one valid item is required';

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };


    //     const validate = (): boolean => {
    //     const newErrors: Record<string, string> = {};

    //     if (!selectedCustomer) {
    //         newErrors.customer = 'Customer is required';
    //         toast.error('Customer is required');
    //     }

    //     if (!salesOrderDate) {
    //         newErrors.salesOrderDate = 'Sales order date is required';
    //         toast.error('Sales order date is required');
    //     }

    //     if (!expectedShipmentDate) {
    //         newErrors.expectedShipmentDate = 'Expected shipment date is required';
    //         toast.error('Expected shipment date is required');
    //     }

    //     if (!paymentTerms) {
    //         newErrors.paymentTerms = 'Payment terms is required';
    //         toast.error('Payment terms is required');
    //     }

    //     const hasValidItems = items.some(
    //         item => item.name && item.quantity > 0 && item.rate > 0
    //     );

    //     if (!hasValidItems) {
    //         newErrors.items = 'At least one valid item is required';
    //         toast.error('Please add at least one valid item');
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };


    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedGuestId && !selectedMemberId) {
            setErrors(newErrors);
            toast.error('Please select a guest or a member');
            return false;
        }

        if (!salesOrderDate) {
            // newErrors.salesOrderDate = 'Sales order date is required';
            setErrors(newErrors);
            toast.error('Invoice date is required');
            return false;
        }

        if (!expectedShipmentDate) {
            // newErrors.expectedShipmentDate = 'Expected shipment date is required';
            setErrors(newErrors);
            toast.error('Due date is required');
            return false;
        } else if (salesOrderDate && new Date(expectedShipmentDate) < new Date(salesOrderDate)) {
            setErrors(newErrors);
            toast.error('Due date cannot be earlier than Invoice date');
            return false;
        }

        const hasValidItems = items.some(
            item => item.name && item.quantity > 0 && item.rate > 0
        );

        if (!hasValidItems) {
            // newErrors.items = 'At least one valid item is required';
            setErrors(newErrors);
            toast.error('Please add at least one valid item');
            return false;
        }

        setErrors({});
        return true;
    };


    // --- INVOICE PAYLOADS ---

    const invoicePayload2 = {
        lock_account_invoice: {
            lock_account_customer_id: selectedGuestId || selectedMemberId,
            order_number: referenceNumber,
            date: salesOrderDate,
            due_date: expectedShipmentDate,
            payment_term_id: selectedTerm,
            delivery_method: deliveryMethod,
            sales_person_id: salespersons.find(sp => sp.name === salesperson)?.id || salesperson,
            customer_notes: customerNotes,
            terms_and_conditions: termsAndConditions,
            subject: subject,
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
            lock_account_invoice_items_attributes: items.map(item => {
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                return {
                    ...(resolvedId ? { lock_account_item_id: resolvedId } : { item_name: item.name }),
                    rate: item.rate,
                    quantity: item.quantity,
                    total_amount: item.amount,
                    description: item.description || ''
                };
            }),
            email_contact_persons_attributes: selectedContactPersons.map(id => ({ contact_person_id: id })),
            attachments_attributes: attachments.map(f => ({
                document: f,
                active: true
            }))
        }
    };
    console.log('Invoice Payload:', invoicePayload2);
    console.log("date:", salesOrderDate)
    // Handle submit
    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            // Build FormData for invoice
            const formData = new FormData();

            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );

            formData.append(
                'lock_account_invoice[sub_total_amount]',
                String(subTotal)
            );

            formData.append(
                'lock_account_invoice[taxable_amount]',
                String(totalGSTAmount)
            );

            formData.append(
                'lock_account_invoice[lock_account_tax_amount]',
                String(taxAmount2)
            );
            // NOTE: backend contract for billing a guest/member (vs. a lock_account_customer) is unconfirmed;
            // sending whichever id was picked under the existing customer_id param as a best-effort mapping.
            formData.append('lock_account_invoice[lock_account_customer_id]', selectedGuestId || selectedMemberId || '');
            formData.append('lock_account_invoice[order_number]', referenceNumber);
            formData.append('lock_account_invoice[date]', salesOrderDate);
            formData.append('lock_account_invoice[due_date]', expectedShipmentDate);
            formData.append('lock_account_invoice[payment_term_id]', selectedTerm);
            // formData.append('lock_account_invoice[delivery_method]', deliveryMethod);
            formData.append('lock_account_invoice[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
            formData.append('lock_account_invoice[customer_notes]', customerNotes);
            formData.append('lock_account_invoice[bank_master_id]', selectedBankId || '');
            formData.append('lock_account_invoice[terms_and_conditions]', termsAndConditions);
            formData.append('lock_account_invoice[subject]', subject);
            // formData.append('lock_account_invoice[status]', 'draft');
            formData.append(
                'lock_account_invoice[status]',
                saveAsDraft ? 'draft' : 'sent'
            );
            formData.append('lock_account_invoice[total_amount]', String(totalAmount2));
            if (discountTypeOnTotal === 'percentage') {
                formData.append('lock_account_invoice[discount_per]', String(discountOnTotal));
                formData.append('lock_account_invoice[discount_amount]', String(totalDiscount));
            } else {
                formData.append('lock_account_invoice[discount_amount]', String(discountOnTotal));
            }
            formData.append('lock_account_invoice[charge_amount]', String(adjustment));
            formData.append('lock_account_invoice[charge_name]', adjustmentLabel);
            formData.append('lock_account_invoice[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
            formData.append('lock_account_invoice[tax_type]', taxType.toLowerCase());
            const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
            formData.append('lock_account_invoice[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));
            formData.append('lock_account_invoice[place_of_supply]', placeOfSupply); //new added
            // Converted from quote or sales order
            if (location.state?.quoteData) {
                formData.append('lock_account_invoice[converted_from_type]', 'LockAccountQuote');
                formData.append('lock_account_invoice[converted_from_id]', String(location.state.quoteData.id));
            }
            if (location.state?.saleOrderId) {
                formData.append('lock_account_invoice[converted_from_type]', 'SaleOrder');
                formData.append('lock_account_invoice[converted_from_id]', String(location.state.saleOrderId));
            }
            const selectedOrFirstBillingId = selectedBillingAddressId ?? billingAddressBook[0]?.id ?? '';
            const selectedOrFirstShippingId = selectedShippingAddressId ?? shippingAddressBook[0]?.id ?? '';
            const selectedOrFirstGstDetailId = selectedGstDetailId ?? gstDetails[0]?.id ?? '';
            const gstPreferenceValue = customerDetail?.gst_preference || customerDetail?.gst_treatment || '';
            formData.append('lock_account_invoice[address_detail_attributes][billing_address_id]', String(selectedOrFirstBillingId));
            formData.append('lock_account_invoice[address_detail_attributes][shipping_address_id]', String(selectedOrFirstShippingId));
            formData.append('lock_account_invoice[address_detail_attributes][gst_detail_id]', String(selectedOrFirstGstDetailId));
            formData.append('lock_account_invoice[address_detail_attributes][gst_preference]', String(gstPreferenceValue));
            // Invoice items
            items.forEach((item, idx) => {
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                if (resolvedId) {
                    formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][lock_account_item_id]`, String(resolvedId));
                } else {
                    formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][item_name]`, item.name);
                }
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][description]`, item.description || '');

                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][tax_type]`, String(item.item_tax_type));
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
                formData.append(`lock_account_invoice[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
            });

            // Email contact persons
            selectedContactPersons.forEach((id, idx) => {
                formData.append(`lock_account_invoice[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
            });

            // Attachments
            attachments.forEach((file, idx) => {
                formData.append(`lock_account_invoice[attachments_attributes][${idx}][document]`, file);
                formData.append(`lock_account_invoice[attachments_attributes][${idx}][active]`, 'true');
            });

            await fetch(`https://${baseUrl}/lock_account_invoices.json?lock_account_id=${lock_account_id}`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                    // Do NOT set Content-Type, browser will set it for FormData
                },
                body: formData
            });

            toast.success(`Invoice ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
            navigate('/club-management/invoice');
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Failed to create invoice');
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

    const taxBreakdown: any[] = [];

    // Intra-state (Tax Groups)
    items
        .filter(item => item.item_tax_type === "tax_group" && item.tax_group_id)
        .forEach(item => {
            const group = taxGroups.find(g => g.id === item.tax_group_id);
            if (!group) return;
            group.tax_rates.forEach((rate: any) => {
                const taxAmount = (item.amount * rate.rate) / 100;
                const existing = taxBreakdown.find(t => t.name === rate.name);
                if (existing) existing.amount += taxAmount;
                else taxBreakdown.push({ name: rate.name, rate: rate.rate, amount: taxAmount });
            });
        });

    // Inter-state (IGST Tax Rates)
    items
        .filter(item => item.item_tax_type === "tax_rate" && item.tax_group_id)
        .forEach(item => {
            const rate = taxRates.find(r => r.id === item.tax_group_id);
            if (!rate) return;
            const taxAmount = (item.amount * rate.rate) / 100;
            const existing = taxBreakdown.find(t => t.name === rate.name);
            if (existing) existing.amount += taxAmount;
            else taxBreakdown.push({ name: rate.name, rate: rate.rate, amount: taxAmount });
        });
    // Calculate Final Total

    const totalTax = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);
    useEffect(() => {
        const total =
            afterDiscount +
            totalTax  // tax from tax groups
            - taxAmount2 + // TDS/TCS
            (Number(adjustment) || 0);

        setTotalAmount2(total);


    }, [afterDiscount, totalTax, taxAmount2, adjustment]);
    console.log('Tax Options:', taxOptions);
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
        "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry", "Foreign Country"
    ];
    return (
        <div className="p-6 space-y-6 relative">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <CircularProgress size={60} />
                </div>
            )}

            <div className="mb-2">
                <button
                    onClick={() => navigate('/club-management/invoice')}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium tracking-wide"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Invoices List
                </button>
            </div>

            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Invoice</h1>
            </header>

            <div className="space-y-6">
                {/* Customer Section */}
                <Section title="Guest/Member Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Guest
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedGuestId}
                                        onChange={(e) => {
                                            setSelectedGuestId(String(e.target.value));
                                            if (e.target.value) setSelectedMemberId('');
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">Select a guest</MenuItem>
                                        {guests.map((guest) => (
                                            <MenuItem key={guest.id} value={guest.id}>
                                                {guest.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Member
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedMemberId}
                                        onChange={(e) => {
                                            setSelectedMemberId(String(e.target.value));
                                            if (e.target.value) setSelectedGuestId('');
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">Select a member</MenuItem>
                                        {members.map((member) => (
                                            <MenuItem key={member.id} value={member.id}>
                                                {member.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Place of Supply
                                </label>

                                <TextField
                                    select
                                    fullWidth
                                    value={placeOfSupply}
                                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                                    sx={fieldStyles}
                                    SelectProps={{
                                        displayEmpty: true
                                    }}
                                >
                                    <MenuItem value="">Select Place of Supply</MenuItem>
                                    {states.map((state) => (
                                        <MenuItem key={state} value={state}>
                                            {state}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Sales Order Details */}
                <Section title="Invoice Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Order Number
                            </label>
                            <TextField
                                fullWidth
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Enter order number"
                                sx={fieldStyles}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Invoice Date<span className="text-brand">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={salesOrderDate}
                                onChange={(e) => setSalesOrderDate(e.target.value)}
                                error={!!errors.salesOrderDate}
                                helperText={errors.salesOrderDate}
                                sx={{
                                    ...fieldStyles,
                                    '& .MuiInputBase-input': {
                                        color: salesOrderDate ? 'transparent' : 'inherit',
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: salesOrderDate ? (
                                        <InputAdornment position="start" sx={{ position: 'absolute', pointerEvents: 'none', left: '10px', backgroundColor: 'white', pr: 1, zIndex: 1 }}>
                                            {format(parseISO(salesOrderDate), 'dd/MM/yyyy')}
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Due Date<span className="text-brand">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={expectedShipmentDate}
                                onChange={(e) => setExpectedShipmentDate(e.target.value)}
                                error={!!errors.expectedShipmentDate}
                                helperText={errors.expectedShipmentDate}
                                sx={{
                                    ...fieldStyles,
                                    '& .MuiInputBase-input': {
                                        color: expectedShipmentDate ? 'transparent' : 'inherit',
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: salesOrderDate }}
                                InputProps={{
                                    startAdornment: expectedShipmentDate ? (
                                        <InputAdornment position="start" sx={{ position: 'absolute', pointerEvents: 'none', left: '10px', backgroundColor: 'white', pr: 1, zIndex: 1 }}>
                                            {format(parseISO(expectedShipmentDate), 'dd/MM/yyyy')}
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        </div>

                    <div>
                        <label className="block text-sm font-medium ">
                            Subject
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
                            rows={4}
                            value={subject}
                            onChange={(e) => {
                                if (e.target.value.length <= 500) setSubject(e.target.value);
                            }}
                            placeholder="Enter subject (max 500 characters)"
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-400 text-right mt-1">
                            {(subject?.length || 0)}/500
                        </div>
                    </div>



            </div>
        </Section>

                {/* Item Table */ }
    <Section title="Item Table" icon={<Package className="w-5 h-5" />}>
        <div className="space-y-4">
            {errors.items && (
                <div className="text-brand text-sm bg-red-50 p-3 rounded-md">{errors.items}</div>
            )}

            <div className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Item Details</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
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
                                    {item.name && (
                                        <div className="text-sm font-medium">{item.name}</div>
                                    )}

                                    {(() => {
                                        const rowChecks = itemSourceChecks[item.id] || { facility: false, membership: false, event: false };
                                        return (
                                            <div className="flex flex-wrap items-start gap-4 mt-2">
                                                {([
                                                    { key: 'facility' as const, label: 'Facility Booking', options: facilityBookingOptions },
                                                    { key: 'membership' as const, label: 'Membership', options: membershipPlanOptions },
                                                    { key: 'event' as const, label: 'Event', options: eventOptionsList },
                                                ]).map(({ key, label, options }) => (
                                                    <div key={key} className="flex flex-col gap-1">
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    size="small"
                                                                    checked={rowChecks[key]}
                                                                    onChange={(e) => toggleItemSourceCheck(item.id, key, e.target.checked)}
                                                                    sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                                                                />
                                                            }
                                                            label={<span className="text-xs">{label}</span>}
                                                        />
                                                        {rowChecks[key] && (
                                                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                                                <Select
                                                                    displayEmpty
                                                                    value=""
                                                                    onChange={(e) => {
                                                                        const selected = options.find(o => o.id === e.target.value);
                                                                        if (selected) applySourceToItem(index, `${label}: ${selected.name}`, selected.rate);
                                                                    }}
                                                                >
                                                                    <MenuItem value="" disabled>
                                                                        {options.length === 0 ? `No ${label.toLowerCase()} records found` : `Select ${label.toLowerCase()}`}
                                                                    </MenuItem>
                                                                    {options.map(opt => (
                                                                        <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                    <TextField
                                        fullWidth
                                        label="Item Description"
                                        size="small"
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        sx={{ mt: 2 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val < 0) {
                                                toast.error('Quantity cannot be negative');
                                                updateItem(index, 'quantity', 0);
                                            } else {
                                                updateItem(index, 'quantity', isNaN(val) ? "" : val);
                                            }
                                        }}
                                        inputProps={{ min: 0, step: 1 }}
                                        sx={{ width: 80 }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={item.rate}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val < 0) {
                                                toast.error('Rate cannot be negative');
                                                updateItem(index, 'rate', 0);
                                            } else {
                                                updateItem(index, 'rate', isNaN(val) ? "" : val);
                                            }
                                        }}
                                        inputProps={{ min: 0, step: 0.01 }}
                                        sx={{ width: 100 }}
                                    />
                                </td>
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
                                <td className="px-4 py-3">
                                    <FormControl size="small" sx={{ width: 200 }}>
                                        <Select
                                            value={["tax_group", "tax_rate"].includes(item.item_tax_type) ? item.tax_group_id : item.item_tax_type || ""}
                                            displayEmpty
                                            onChange={(e) => {
                                                const value = String(e.target.value);
                                                const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();

                                                // Static tax types
                                                if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value)) {
                                                    updateItem(index, "item_tax_type", value);
                                                    updateItem(index, "tax_group_id", null);

                                                    if (value === "non_taxable") {
                                                        setCurrentItemIndex(index);
                                                        setExemptionModalOpen(true);
                                                    }
                                                }
                                                // Tax group/rate selected
                                                else {
                                                    updateItem(index, "item_tax_type", isSameState ? "tax_group" : "tax_rate");
                                                    updateItem(index, "tax_group_id", Number(value));
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
                                                const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                return isSameState ? (
                                                    [
                                                        <MenuItem key="__divider__" disabled>Tax Groups</MenuItem>,
                                                        ...taxGroups.map((group) => (
                                                            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                                                        ))
                                                    ]
                                                ) : (
                                                    [
                                                        <MenuItem key="__divider__" disabled>Tax Rates (IGST)</MenuItem>,
                                                        ...taxRates.map((rate) => (
                                                            <MenuItem key={rate.id} value={rate.id}>{rate.name}</MenuItem>
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
                                        onClick={() => {
                                            setDeleteTargetIndex(index);
                                            setDeleteTargetType('item');
                                            setDeleteConfirmOpen(true);
                                        }}
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
                {/* <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button> */}
            </div>
        </div>
    </Section>

    {/* Summary Section */ }
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
                        <Select
                            size="small"
                            value={discountTypeOnTotal}
                            onChange={e => setDiscountTypeOnTotal(e.target.value as 'percentage' | 'amount')}
                            sx={{ width: 100 }}
                        >
                            <MenuItem value="percentage">%</MenuItem>
                            <MenuItem value="amount">Amount</MenuItem>
                        </Select>
                        <TextField
                            type="number"
                            size="small"
                            value={discountOnTotal}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val < 0) {
                                    toast.error('Discount cannot be negative');
                                    setDiscountOnTotal(0);
                                } else if (discountTypeOnTotal === 'percentage' && val > 100) {
                                    toast.error('Discount percentage cannot exceed 100%');
                                    setDiscountOnTotal(100);
                                } else {
                                    setDiscountOnTotal(isNaN(val) ? 0 : val);
                                }
                            }}
                            inputProps={{ min: 0, step: 0.01, max: discountTypeOnTotal === 'percentage' ? 100 : undefined }}
                            sx={{ width: 80 }}
                        />
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
                <Divider sx={{ my: 2 }} />

                <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                    <span className="font-bold text-base">Total ( ₹ )</span>
                    <span className="font-bold text-primary text-2xl">₹{totalAmount2.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </Section>

    {/* Customer Notes */ }
    <Section title="Customer Notes" icon={<FileText className="w-5 h-5" />}>
        <textarea
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
            rows={3}
            value={customerNotes}
            onChange={(e) => {
                if (e.target.value.length <= 500) setCustomerNotes(e.target.value);
            }}
            placeholder="Enter any notes for the customer (max 500 characters)"
            maxLength={500}
        />
        <div className="text-xs text-gray-400 text-right mt-1">
            {(customerNotes?.length || 0)}/500
        </div>

        <div className="mt-4 w-1/2">
            <label className="block text-sm font-medium mb-2">
                Bank
            </label>
            <FormControl fullWidth size="small" error={!!errors.bank}>
                <Select
                    displayEmpty
                    value={selectedBankId}
                    onChange={(e) => {
                        setSelectedBankId(String(e.target.value));
                        if (errors.bank) {
                            setErrors((prev) => {
                                const next = { ...prev };
                                delete next.bank;
                                return next;
                            });
                        }
                    }}
                    renderValue={(val) =>
                        val
                            ? (() => {
                                const bank = bankOptions.find(b => String(b.id) === String(val));
                                return bank ? `${bank.bankName} - ${bank.accountNo} (${bank.beneficiaryName})` : '';
                            })()
                            : <span style={{ color: '#aaa' }}>Select Bank</span>
                    }
                    sx={fieldStyles}
                >
                    <MenuItem value=""><em>Select Bank</em></MenuItem>
                    {bankOptions.map((bank) => (
                        <MenuItem key={bank.id} value={String(bank.id)}>
                            {bank.bankName} - {bank.accountNo} ({bank.beneficiaryName})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {errors.bank && <p className="text-xs text-brand mt-1">{errors.bank}</p>}
        </div>
    </Section>

    {/* Terms & Conditions */ }
    <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
        <textarea
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
            rows={4}
            value={termsAndConditions}
            onChange={(e) => {
                if (e.target.value.length <= 500) setTermsAndConditions(e.target.value);
            }}
            placeholder="Enter the terms and conditions of your business to be displayed in your transaction (max 500 characters)"
            maxLength={500}
        />
        <div className="text-xs text-gray-400 text-right mt-1">
            {(termsAndConditions?.length || 0)}/500
        </div>
    </Section>

    {/* Attachments */ }
    <Section title="Attach Files to Invoice" icon={<AttachFile className="w-5 h-5" />}>
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
                            <IconButton size="small" onClick={() => {
                                setDeleteTargetIndex(index);
                                setDeleteTargetType('attachment');
                                setDeleteConfirmOpen(true);
                            }}>
                                <Close fontSize="small" />
                            </IconButton>
                        </div>
                    ))}
                </div>
            )}

        </div>
    </Section>
            </div >

    <div className="flex items-center gap-3 justify-center pt-2">
        <Button
            variant="text"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="fm-button-fix fm-button-brand px-8 py-2"
            sx={{ textTransform: 'none', fontWeight: 600 }}
        >
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
            variant="outlined"
            onClick={() => navigate('/club-management/invoice')}
            disabled={isSubmitting}
            className="fm-button-fix px-8 py-2"
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#DA7756',
                color: '#DA7756',
                '&:hover': {
                    borderColor: '#C45F40',
                    bgcolor: '#F2EEE9',
                    color: '#C45F40'
                }
            }}
        >
            Cancel
        </Button>
    </div>


{/* Add External User Dialog */ }
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
                        className="bg-[#DA7756] hover:bg-[#C45F40] text-white px-4 py-2 rounded"
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
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure about deleting this {deleteTargetType}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        variant="outlined"
                        sx={{
                            color: '#DA7756',
                            borderColor: '#DA7756',
                            '&:hover': {
                                borderColor: '#DA7756',
                                backgroundColor: 'rgba(218, 119, 86, 0.04)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: '#dc2626',
                            '&:hover': {
                                backgroundColor: '#b91c1c'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </div >
    );
};
