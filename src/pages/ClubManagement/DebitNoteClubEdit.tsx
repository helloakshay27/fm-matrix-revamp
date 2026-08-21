import React, { useState, useEffect, useRef } from 'react';
import { BrandRadio } from '@/components/ui/brand-radio';
import { useNavigate, useParams } from 'react-router-dom';
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
    EditOutlined,
    CloudUpload,
    AttachFile,
    PersonAdd,
    ChevronRight
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

// Section component - matching PatrollingCreatePage style
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                {icon}
            </div>
            <span className="font-semibold text-lg text-gray-800">{title}</span>
        </div>
        <div className="p-6 bg-white">{children}</div>
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
    place_of_supply?: string;
    billing_address?: any;
    shipping_address?: any;
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
    account: string;
    customer: string;
    item_tax_type?: string
    tax_group_id?: number | null
    tax_exemption_id?: number | null
    locked?: boolean
    dbId?: number
}

interface ExternalUser {
    name: string;
    email: string;
}

export const DebitNoteClubEditPage: React.FC = () => {
    const [subject, setSubject] = useState('');
    // Fetch item list from API
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_items/select_list.json?lock_account_id=${lock_account_id}&q[can_be_sold_eq]=1&active=true`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setItemOptions(res.data.map(item => ({ id: item.id, name: item.name, rate: item.sale_rate, description: item.sale_description, tax_preference: item.tax_preference, tax_exemption_id: item.tax_exemption_id, tax_group_id: item.intra_state_tax_rate_id, inter_state_tax_rate_id: item.inter_state_tax_rate_id })));
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
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        document.title = 'Edit Debit Note';
    }, []);

    // Bill-to: Member / Guest / Staff selection (replaces Customer + Currency) — same pattern as AddFacilityBookingClubPage
    const [userType, setUserType] = useState<'occupant' | 'guest' | 'fm'>('occupant');
    const [selectedUser, setSelectedUser] = useState('');
    const [occupantUsers, setOccupantUsers] = useState<{ id: string; name: string }[]>([]);
    const [occupantUsersLoading, setOccupantUsersLoading] = useState(false);
    const [occupantUsersError, setOccupantUsersError] = useState(false);
    const [guestUsers, setGuestUsers] = useState<{ id: string; name: string }[]>([]);
    const [guestUsersLoading, setGuestUsersLoading] = useState(false);
    const [guestUsersError, setGuestUsersError] = useState(false);
    const [fmUsers, setFmUsers] = useState<{ id: string; name: string }[]>([]);
    const [fmUsersLoading, setFmUsersLoading] = useState(false);
    const [fmUsersError, setFmUsersError] = useState(false);

    // Customer data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
    const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null);
    const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
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
    // GST — manual entry (guest/member records don't carry GST details the way a customer record would)
    const [gstTreatment, setGstTreatment] = useState('');
    const [gstin, setGstin] = useState('');
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
    const taxTypeOptions = [
        { value: "non_taxable", label: "Non-Taxable" },
        { value: "out_of_scope", label: "Out of Scope" },
        { value: "non_gst_supply", label: "Non-GST Supply" },
        //   { value: "tax_group", label: "Tax Group" }
    ];
    const [placeOfSupply, setPlaceOfSupply] = useState("");
    const [orgState, setOrgState] = useState<string>("");

    // Fetch organisation state on mount from organisation detail API
    useEffect(() => {
        const fetchOrgState = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            // org_id stored at login, organisation_id stored by fetchLockAccount
            const organisation_id = localStorage.getItem('org_id') || localStorage.getItem('organisation_id');
            if (!organisation_id || !baseUrl || !token) return;
            try {
                const res = await axios.get(
                    `https://${baseUrl}/organizations/${organisation_id}.json?lock_account_id=${lock_account_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const org = res.data?.organization || res.data;
                // address.state holds the organisation's registered state
                const state = org?.address?.state || '';
                console.log('[DebitNote] Org state from API:', state);
                setOrgState(state);
            } catch (err) {
                console.error('[DebitNote] Failed to fetch org state:', err);
            }
        };
        fetchOrgState();
    }, []);
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

    // Debit Note specific fields
    const [invoiceList, setInvoiceList] = useState<{ id: string; invoice_number: string }[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [invoiceType, setInvoiceType] = useState('');
    const [reason, setReason] = useState('');

    const invoiceTypeOptions = [
        'Registered',
        'Deemed Export',
        'SEZ With Payment',
        'SEZ Without Payment',
        'Export With Payment',
        'Export Without Payment',
        'B2C (Large)',
        'B2C Others',
    ];

    const reasonOptions = [
        'Sales Return',
        'Post Sale Discount',
        'Deficiency in service',
        'Correction in invoice',
        'Change in POS',
        'Finalization of Provisional assessment',
        'Others',
    ];

    // Fetch invoices (bill_bookings) for the selected user, to link this debit note to one
    useEffect(() => {
        if (!selectedUser) {
            setInvoiceList([]);
            setSelectedInvoice('');
            return;
        }
        const fetchInvoices = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(
                    `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings.json`,
                    {
                        params: { user_id: selectedUser, page: 1, per_page: 20 },
                        headers: { Authorization: token ? `Bearer ${token}` : undefined }
                    }
                );
                // NOTE: response shape is unconfirmed — best-effort parsing across common shapes.
                const data = res.data;
                const list = data?.bill_bookings || data?.data || (Array.isArray(data) ? data : []);
                const freshList = (list || []).map((inv: any) => ({
                    id: String(inv.id),
                    invoice_number: `#${inv.id}`
                    // inv.bill_number || inv.order_number || inv.invoice_number ||
                }));
                // This page (page=1&per_page=20) may not include the currently linked/selected
                // invoice — keep it in the list if a prior fetch (or edit-mode prefill) already added it.
                setInvoiceList(prev => {
                    const missingSelected = selectedInvoice && !freshList.some(inv => inv.id === selectedInvoice)
                        ? prev.find(inv => inv.id === selectedInvoice)
                        : undefined;
                    return missingSelected ? [...freshList, missingSelected] : freshList;
                });
            } catch {
                setInvoiceList([]);
            }
        };
        fetchInvoices();
    }, [selectedUser]);

    // Dropdowns data
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
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
    const selectedShippingAddress = sameAsBilling
        ? selectedBillingAddress
        : (shippingAddressBook.find(a => String(a.id) === String(selectedShippingAddressId)) || shippingAddressBook[0] || null);
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

    const fetchCustomerDetail = async (
        customerId: string | number, 
        preferredGstin?: string,
        newAddressToSelect?: { type: 'billing' | 'shipping', attention: string, address: string, pin_code: string }
    ) => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');
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
                (preferredGstin ? nextGstDetails.find((g) => g.gstin === preferredGstin) : null) ||
                nextGstDetails.find((g) => g.primary) ||
                nextGstDetails[0] ||
                null;
            if (defaultGst) {
                setSelectedGstDetailId(defaultGst.id);
                setPlaceOfSupply(defaultGst.place_of_supply || placeOfSupply);
                setCustomerDetail((prev) => (prev ? { ...prev, gstin: defaultGst.gstin } : prev));
            } else {
                setSelectedGstDetailId(null);
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
        setGstTreatmentDraft(gstTreatment);
        setGstModalOpen(true);
    };
    const openGstManageModal = () => {
        setShowNewGstForm(false);
        setEditingGstDetailId(null);
        setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
        setGstManageModalOpen(true);
    };
    const openGstPickerModal = () => setGstPickerModalOpen(true);

    // Fetch Members (occupant), Guest, or Staff (fm) users — same pattern as AddFacilityBookingClubPage
    const fetchOccupantUsersDirect = () => {
        setOccupantUsersLoading(true);
        setOccupantUsersError(false);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/pms/account_setups/occupant_users.json`, {
                params: { 'q[lock_user_permissions_user_type_eq]': 'pms_occupant', active: true },
                headers: { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' }
            })
            .then(res => {
                const list = res.data?.occupant_users || [];
                setOccupantUsers(list.map((u: any) => ({
                    id: String(u.id),
                    name: u.name || `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim() || `Member #${u.id}`
                })));
            })
            .catch(error => {
                console.error('Error fetching occupant users:', error);
                setOccupantUsersError(true);
                setOccupantUsers([]);
            })
            .finally(() => setOccupantUsersLoading(false));
    };

    const fetchGuestUsers = () => {
        setGuestUsersLoading(true);
        setGuestUsersError(false);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/pms/account_setups/occupant_users.json`, {
                params: { 'q[lock_user_permissions_user_type_eq]': 'pms_guest', active: true },
                headers: { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' }
            })
            .then(res => {
                const list = res.data?.occupant_users || [];
                setGuestUsers(list.map((u: any) => ({
                    id: String(u.id),
                    name: `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim() || u.email || `Guest #${u.id}`
                })));
            })
            .catch(error => {
                console.error('Error fetching guest users:', error);
                setGuestUsersError(true);
                setGuestUsers([]);
            })
            .finally(() => setGuestUsersLoading(false));
    };

    const fetchFmUsers = () => {
        setFmUsersLoading(true);
        setFmUsersError(false);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/pms/users/get_escalate_to_users.json`, {
                headers: { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' }
            })
            .then(res => {
                const list = res.data?.users || [];
                setFmUsers(list.map((u: any) => ({
                    id: String(u.id),
                    name: u.full_name || u.name || `Staff #${u.id}`
                })));
            })
            .catch(error => {
                console.error('Error fetching staff users:', error);
                setFmUsersError(true);
                setFmUsers([]);
            })
            .finally(() => setFmUsersLoading(false));
    };

    useEffect(() => {
        if (userType === 'occupant') {
            fetchOccupantUsersDirect();
        } else if (userType === 'guest') {
            fetchGuestUsers();
        } else {
            fetchFmUsers();
        }
    }, [userType]);

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
                const res = await axios.get(`https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat&q[group_type_in][]=sales&q[group_type_in][]=both`, {
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

    // When customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            // setBillingAddress(selectedCustomer.billingAddress || '');
            // setShippingAddress(selectedCustomer.shippingAddress || '');
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

    // Local-only address save (no customer record to persist to for a guest/member bill-to)
    const handleSaveAddressForm = () => {
        const setBook = activeAddressType === 'billing' ? setBillingAddressBook : setShippingAddressBook;
        const setSelectedId = activeAddressType === 'billing' ? setSelectedBillingAddressId : setSelectedShippingAddressId;
        const targetId = editingAddressId ?? addressForm.id ?? `${activeAddressType}-${Date.now()}`;
        const payload: CustomerAddress = { ...addressForm, id: targetId };
        setBook((prev) => addressFormMode === 'edit' ? prev.map((item) => (String(item.id) === String(targetId) ? payload : item)) : [...prev, payload]);
        setSelectedId(targetId);
        setAddressFormModalOpen(false);
        setAddressListModalOpen(false);
        toast.success("Address saved successfully");
    };

    const handleUpdateGstConfig = () => {
        setGstTreatment(gstTreatmentDraft);
        setGstModalOpen(false);
    };

    const handleGstinDropdownChange = (value: string | number) => {
        setSelectedGstDetailId(value);
        const selected = gstDetails.find((g) => String(g.id) === String(value));
        if (!selected) return;
        setGstin(selected.gstin);
        if (selected.place_of_supply) setPlaceOfSupply(selected.place_of_supply);
        setGstPickerModalOpen(false);
    };

    // Local-only GST detail save (no customer record to persist to for a guest/member bill-to)
    const handleSaveAndSelectGst = () => {
        if (!newGstForm.gstin || !newGstForm.place_of_supply) return toast.error('GSTIN and Place of Supply are required');
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        const normalizedGstin = String(newGstForm.gstin || '').toUpperCase().trim();
        if (!gstinRegex.test(normalizedGstin)) return toast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
        const targetId = editingGstDetailId ?? `gst-${Date.now()}`;
        const gstDetail: GstDetail = {
            id: targetId,
            gstin: normalizedGstin,
            place_of_supply: newGstForm.place_of_supply,
            business_legal_name: newGstForm.business_legal_name || '',
            business_trade_name: newGstForm.business_trade_name || '',
            primary: false
        };
        setGstDetails((prev) => editingGstDetailId
            ? prev.map((g) => (String(g.id) === String(targetId) ? gstDetail : g))
            : [...prev, gstDetail]);
        setSelectedGstDetailId(targetId);
        setGstin(normalizedGstin);
        setShowNewGstForm(false);
        setEditingGstDetailId(null);
        setGstManageModalOpen(false);
        toast.success('Tax information saved');
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

    const handleDeleteGstDetail = (gstId: number | string) => {
        setGstDetails((prev) => prev.filter((g) => String(g.id) !== String(gstId)));
        if (String(selectedGstDetailId) === String(gstId)) {
            setSelectedGstDetailId(null);
            setGstin('');
        }
        toast.success('Tax information deleted');
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

    // Item table quick-add: Facility Booking / Membership / Event / Other pickers (per row, single choice)
    const [itemSourceSelection, setItemSourceSelection] = useState<Record<string, 'facility' | 'membership' | 'event' | 'other' | ''>>({});
    const [selectedEntityByItem, setSelectedEntityByItem] = useState<Record<string, string>>({});
    const setItemSource = (itemId: string, value: 'facility' | 'membership' | 'event' | 'other' | '') => {
        setItemSourceSelection(prev => ({ ...prev, [itemId]: value }));
        setSelectedEntityByItem(prev => ({ ...prev, [itemId]: '' }));
    };
    const [otherItemNameDraft, setOtherItemNameDraft] = useState<Record<string, string>>({});
    const [facilityBookingOptions, setFacilityBookingOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [membershipPlanOptions, setMembershipPlanOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [eventOptionsList, setEventOptionsList] = useState<{ id: string; name: string; rate: number }[]>([]);

    // --- Edit mode: fetch the existing debit_note and prefill the whole form ---
    const [editLoading, setEditLoading] = useState(true);

    // Best-effort: the details response doesn't say whether the billed user is a
    // Member/Guest/Staff, so probe each list and match by id. Defaults to 'occupant'.
    const detectUserType = async (userId: string): Promise<'occupant' | 'guest' | 'fm'> => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const authHeaders = { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' };
        try {
            const [guestRes, fmRes] = await Promise.all([
                axios.get(`https://${baseUrl}/pms/account_setups/occupant_users.json`, {
                    params: { 'q[lock_user_permissions_user_type_eq]': 'pms_guest', active: true },
                    headers: authHeaders
                }).catch(() => null),
                axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json`, { headers: authHeaders }).catch(() => null),
            ]);
            const guestList = guestRes?.data?.occupant_users || [];
            const fmList = fmRes?.data?.users || [];
            if (guestList.some((u: any) => String(u.id) === String(userId))) return 'guest';
            if (fmList.some((u: any) => String(u.id) === String(userId))) return 'fm';
            return 'occupant';
        } catch {
            return 'occupant';
        }
    };

    const SOURCE_KEY_TO_LINE_ITEM_TYPE_EDIT: Record<string, string> = {
        facility_booking: 'facility',
        membership: 'membership',
        event: 'event',
        other: 'other',
    };

    useEffect(() => {
        if (!id) {
            setEditLoading(false);
            return;
        }
        const fetchDebitNoteForEdit = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lock_account_id = localStorage.getItem('lock_account_id');
                const authHeaders = { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' };

                const res = await axios.get(
                    `https://${baseUrl}/debit_notes/${id}.json`,
                    { params: { lock_account_id }, headers: authHeaders }
                );
                const data = res.data?.debit_note || res.data || {};
                const fetchedLineItems = res.data?.line_items || data.line_items || [];

                setReferenceNumber(data.reference_number || '');
                setSalesOrderDate(data.date || new Date().toISOString().split('T')[0]);
                setReason(data.reason || data.note || '');
                setInvoiceType(data.invoice_type || '');
                setSubject(data.subject || '');
                setCustomerNotes(data.customer_notes || '');
                setTermsAndConditions(data.terms_and_conditions || '');
                setPlaceOfSupply(data.place_of_supply || '');

                // NOTE: the confirmed debit_notes GET sample doesn't include address_detail —
                // prefill defensively in case the backend adds it later.
                const addressDetail = data.address_detail || data.address_detail_attributes;
                if (addressDetail) {
                    setGstTreatment(addressDetail.gst_preference || '');
                    setGstin(data.billing_gstin || addressDetail.gst_detail?.gstin || '');
                    if (addressDetail.gst_detail) {
                        const gd = addressDetail.gst_detail;
                        setGstDetails([{
                            id: gd.id,
                            gstin: gd.gstin || data.billing_gstin || '',
                            place_of_supply: gd.place_of_supply || data.place_of_supply || '',
                            business_legal_name: gd.business_legal_name || null,
                            business_trade_name: gd.business_trade_name || null,
                            primary: true
                        }]);
                        setSelectedGstDetailId(gd.id);
                    }
                    const mapFetchedAddress = (addr: any): CustomerAddress => ({
                        id: addr.id,
                        attention: addr.contact_person || '',
                        address: addr.address || '',
                        address_line_two: addr.address_line_two || '',
                        country: addr.country || 'India',
                        state: addr.state || '',
                        city: addr.city || '',
                        pin_code: addr.pin_code || '',
                        telephone_number: addr.telephone_number || '',
                        fax_number: addr.fax_number || '',
                        mobile: addr.mobile || ''
                    });
                    if (addressDetail.billing_address) {
                        const billingEntry = mapFetchedAddress(addressDetail.billing_address);
                        setBillingAddressBook([billingEntry]);
                        setSelectedBillingAddressId(billingEntry.id);
                    }
                    if (addressDetail.shipping_address) {
                        const shippingEntry = mapFetchedAddress(addressDetail.shipping_address);
                        setShippingAddressBook([shippingEntry]);
                        setSelectedShippingAddressId(shippingEntry.id);
                        if (addressDetail.billing_address) {
                            const sameAddress = ['address', 'city', 'state', 'country', 'pin_code'].every(
                                (key) => (addressDetail.billing_address[key] || '') === (addressDetail.shipping_address[key] || '')
                            );
                            setSameAsBilling(sameAddress);
                        }
                    }
                }
                // Confirmed: the debit_note record's top-level discount field is named "discount"
                setDiscountOnTotal(Number(data.discount ?? data.discount_amount) || 0);
                setDiscountTypeOnTotal('amount');

                if (data.lock_account_invoice_id) {
                    skipNextInvoiceItemsFetch.current = true;
                    const invoiceId = String(data.lock_account_invoice_id);
                    setSelectedInvoice(invoiceId);

                    // The Invoice# dropdown's option list is a fresh, paginated (page=1&per_page=20)
                    // fetch scoped to the selected user — the linked invoice may not be in that page,
                    // so fetch it directly and make sure it's present as a selectable option.
                    try {
                        const invRes = await axios.get(
                            `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${invoiceId}.json`,
                            { headers: authHeaders }
                        );
                        const invData = invRes.data?.bill_booking || invRes.data || {};
                        const invoiceLabel = invData.bill_number || invData.order_number || invData.invoice_number || `#${invoiceId}`;
                        setInvoiceList(prev => prev.some(inv => inv.id === invoiceId)
                            ? prev
                            : [...prev, { id: invoiceId, invoice_number: invoiceLabel }]);
                    } catch (err) {
                        console.error('Error fetching linked invoice details:', err);
                    }
                }

                if (Array.isArray(fetchedLineItems) && fetchedLineItems.length > 0) {
                    const locked = !!data.lock_account_invoice_id;
                    const sourceSel: Record<string, 'facility' | 'membership' | 'event' | 'other' | ''> = {};
                    const entitySel: Record<string, string> = {};
                    const draftNames: Record<string, string> = {};

                    const mappedItems: Item[] = fetchedLineItems.map((li: any, idx: number) => {
                        const gstRate = Number(li.cgst_rate || 0) + Number(li.sgst_rate || 0) || Number(li.gst_rate || 0) || 0;
                        const itemId = `edit-${li.id ?? idx}-${idx}`;
                        // Confirmed: debit_note line_items use "item_name", not "name" (unlike bill_bookings)
                        const itemName = li.item_name || li.name || '';
                        // Confirmed: no top-level "amount" field on debit_note line_items — derive it
                        const baseAmount = li.amount ?? (Number(li.quantity || 0) * Number(li.rate || 0));

                        sourceSel[itemId] = (SOURCE_KEY_TO_LINE_ITEM_TYPE_EDIT[li.line_item_type] as any) || 'other';
                        if (li.line_item_reference_id) entitySel[itemId] = String(li.line_item_reference_id);
                        if (!li.line_item_reference_id) draftNames[itemId] = itemName;

                        return {
                            id: itemId,
                            dbId: li.id,
                            name: itemName,
                            item_id: li.line_item_reference_id ? String(li.line_item_reference_id) : null,
                            description: '',
                            quantity: Number(li.quantity) || 0,
                            rate: Number(li.rate) || 0,
                            discount: Number(li.discount) || 0,
                            discountType: 'amount',
                            tax: '',
                            taxRate: 0,
                            amount: Number(baseAmount) || 0,
                            account: '',
                            customer: '',
                            item_tax_type: gstRate ? 'flat_gst' : '',
                            tax_group_id: gstRate || null,
                            tax_exemption_id: null,
                            locked,
                        };
                    });
                    setItems(mappedItems);
                    setItemSourceSelection(sourceSel);
                    setSelectedEntityByItem(entitySel);
                    setOtherItemNameDraft(draftNames);
                }

                // Confirmed: debit_note's "user.id" is directly the occupant/guest/staff id (unlike
                // credit_note's "customer.id", which is a separate internal lock_account_customer id).
                const billedUserId = data.user?.id ?? data.customer?.user_id ?? data.customer?.id;
                if (billedUserId) {
                    const uid = String(billedUserId);
                    const type = await detectUserType(uid);
                    setUserType(type);
                    setSelectedUser(uid);
                }
            } catch (error) {
                console.error('Error fetching debit note for edit:', error);
                toast.error('Failed to load debit note details');
            } finally {
                setEditLoading(false);
            }
        };
        fetchDebitNoteForEdit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // When an invoice is selected, pull its line items in and lock every field except Rate.
    // Skipped once right after the edit-mode prefill sets selectedInvoice programmatically,
    // so loading an existing debit note doesn't clobber its saved items/rates.
    const skipNextInvoiceItemsFetch = useRef(false);
    useEffect(() => {
        if (!selectedInvoice) return;
        if (skipNextInvoiceItemsFetch.current) {
            skipNextInvoiceItemsFetch.current = false;
            return;
        }
        const fetchInvoiceItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            try {
                const res = await axios.get(
                    `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/${selectedInvoice}.json`,
                    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
                );
                const data = res.data?.bill_booking || res.data || {};
                const fetchedLineItems = res.data?.line_items || data.line_items || [];
                if (!Array.isArray(fetchedLineItems) || fetchedLineItems.length === 0) {
                    toast.error('Selected invoice has no items');
                    return;
                }

                const sourceSel: Record<string, 'facility' | 'membership' | 'event' | 'other' | ''> = {};
                const entitySel: Record<string, string> = {};
                const draftNames: Record<string, string> = {};

                const mappedItems: Item[] = fetchedLineItems.map((li: any, idx: number) => {
                    const gstRate = Number(li.cgst_rate || 0) + Number(li.sgst_rate || 0) || Number(li.gst_rate || 0) || 0;
                    const itemId = `inv-${li.id ?? idx}-${idx}`;

                    const typeToSourceKey: Record<string, 'facility' | 'membership' | 'event' | 'other'> = {
                        facility_booking: 'facility',
                        membership: 'membership',
                        event: 'event',
                        other: 'other',
                    };
                    sourceSel[itemId] = typeToSourceKey[li.line_item_type] || 'other';
                    if (li.line_item_reference_id) entitySel[itemId] = String(li.line_item_reference_id);
                    if (!li.line_item_reference_id) draftNames[itemId] = li.name || '';

                    return {
                        id: itemId,
                        name: li.name || '',
                        item_id: li.line_item_reference_id ? String(li.line_item_reference_id) : null,
                        description: '',
                        quantity: Number(li.quantity) || 0,
                        rate: Number(li.rate) || 0,
                        discount: Number(li.discount) || 0,
                        discountType: 'amount',
                        tax: '',
                        taxRate: 0,
                        amount: Number(li.amount) || 0,
                        account: '',
                        customer: '',
                        item_tax_type: gstRate ? 'flat_gst' : '',
                        tax_group_id: gstRate || null,
                        tax_exemption_id: null,
                        locked: true,
                    };
                });
                setItems(mappedItems);
                setItemSourceSelection(sourceSel);
                setSelectedEntityByItem(entitySel);
                setOtherItemNameDraft(draftNames);

                // The invoice's own discount can be applied at the invoice level (discount_per/discount_amount)
                // rather than per line item — pull that in too, or the Summary silently shows no discount at all.
                if (data.discount_per) {
                    setDiscountTypeOnTotal('percentage');
                    setDiscountOnTotal(Number(data.discount_per) || 0);
                } else if (data.discount_amount) {
                    setDiscountTypeOnTotal('amount');
                    setDiscountOnTotal(Number(data.discount_amount) || 0);
                }
            } catch (error) {
                console.error('Error fetching invoice items:', error);
                toast.error('Failed to load items from the selected invoice');
            }
        };
        fetchInvoiceItems();
    }, [selectedInvoice]);

    // Extracts an options array regardless of which wrapper key the API used, and
    // normalizes each entity's id/name/rate — exact response shape unconfirmed.
    const parseEntityOptions = (data: any): { id: string; name: string; rate: number }[] => {
        const list = data?.options || data?.entity_options || data?.data || (Array.isArray(data) ? data : []);
        return (list || []).map((item: any) => ({
            id: String(item.id),
            name: item.label || item.name || item.title || `#${item.id}`,
            rate: Number(item.rate ?? item.amount ?? item.price ?? 0) || 0
        }));
    };

    useEffect(() => {
        if (!selectedUser) {
            setFacilityBookingOptions([]);
            setMembershipPlanOptions([]);
            setEventOptionsList([]);
            return;
        }
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const authHeaders = { Authorization: token ? `Bearer ${token}` : undefined, 'Content-Type': 'application/json' };
        const entityOptionsUrl = (lineItemType: string) =>
            `https://${baseUrl}/lock_accounts/${lock_account_id}/bill_bookings/entity_options.json?line_item_type=${lineItemType}&user_id=${selectedUser}`;

        axios.get(entityOptionsUrl('facility_booking'), { headers: authHeaders })
            .then(res => setFacilityBookingOptions(parseEntityOptions(res.data)))
            .catch(error => {
                console.error('Error fetching facility booking options:', error);
                setFacilityBookingOptions([]);
            });

        axios.get(entityOptionsUrl('membership'), { headers: authHeaders })
            .then(res => setMembershipPlanOptions(parseEntityOptions(res.data)))
            .catch(error => {
                console.error('Error fetching membership options:', error);
                setMembershipPlanOptions([]);
            });

        axios.get(entityOptionsUrl('event'), { headers: authHeaders })
            .then(res => setEventOptionsList(parseEntityOptions(res.data)))
            .catch(error => {
                console.error('Error fetching event options:', error);
                setEventOptionsList([]);
            });
    }, [selectedUser]);

    // Fills the given item row from a Facility Booking / Membership Plan / Event selection
    const applySourceToItem = (index: number, label: string, rate: number) => {
        updateItemFields(index, { item_id: null, name: label, rate });
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
            amount: 0,
            customer: "",
            account: "",
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
    // Per-item discounts (e.g. from a locked invoice line item) were being silently dropped from the
    // summary — only the manual invoice-level discount field below was ever counted. Add both together.
    const itemDiscountTotal = items.reduce((sum, item) => {
        const itemSubtotal = item.quantity * item.rate;
        const itemDiscount = item.discountType === 'percentage'
            ? (itemSubtotal * Number(item.discount || 0)) / 100
            : Number(item.discount || 0);
        return sum + itemDiscount;
    }, 0);
    // discountOnTotal can be '' while the user is clearing the field — coerce or totalDiscount becomes
    // a string (e.g. number + '' via + concatenation) and every .toFixed(2) call downstream crashes.
    const invoiceLevelDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * Number(discountOnTotal || 0)) / 100
        : Number(discountOnTotal || 0);
    const totalDiscount = itemDiscountTotal + invoiceLevelDiscount;
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
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedUser) {
            setErrors(newErrors);
            toast.error('Please select a user');
            return false;
        }

        if (!placeOfSupply) {
            setErrors(newErrors);
            toast.error('Place of Supply is required');
            return false;
        }

        if (!salesOrderDate) {
            setErrors(newErrors);
            toast.error('Debit note date is required');
            return false;
        }

        if (!selectedInvoice) {
            setErrors(newErrors);
            toast.error('Invoice# is required');
            return false;
        }

        // if (expectedShipmentDate && salesOrderDate && new Date(expectedShipmentDate) < new Date(salesOrderDate)) {
        //     toast.error('Due date cannot be earlier than debit note date');
        //     return false;
        // }

        const hasValidItems = items.some(item => item.name && Number(item.quantity) > 0 && Number(item.rate) > 0);
        if (!hasValidItems) {
            setErrors(newErrors);
            toast.error('Please add at least one valid item');
            return false;
        }

        setErrors(newErrors);
        return true;
    };

    // Maps the item-source radio key to the line_item_type the API expects
    const SOURCE_KEY_TO_LINE_ITEM_TYPE: Record<string, string> = {
        facility: 'facility_booking',
        membership: 'membership',
        event: 'event',
        other: 'other',
    };
    // Maps a line_item_type to the PascalCase resource_type the debit_notes API expects
    const LINE_ITEM_RESOURCE_TYPE: Record<string, string> = {
        facility_booking: 'FacilityBooking',
        membership: 'Membership',
        event: 'Event',
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
            const lock_account_id = localStorage.getItem('lock_account_id');

            const formData = new FormData();

            formData.append('debit_note[user_id]', String(selectedUser || ''));
            formData.append('debit_note[date]', salesOrderDate);
            formData.append('debit_note[note_type]', 'other');
            // Reason dropdown is sent as "reason" directly (not "note").
            formData.append('debit_note[reason]', reason || '');
            formData.append('debit_note[note]', reason || '');
            formData.append('debit_note[subject]', subject || '');
            formData.append('debit_note[customer_notes]', customerNotes || '');
            formData.append('debit_note[terms_and_conditions]', termsAndConditions || '');
            formData.append('debit_note[place_of_supply]', placeOfSupply || '');
            formData.append('debit_note[reference_number]', referenceNumber || '');
            // Confirmed: the debit_note record's top-level discount field is named "discount", not "discount_amount".
            // totalDiscount is always the final combined amount (item-level + invoice-level discount).
            formData.append('debit_note[discount]', String(totalDiscount));
            if (selectedInvoice) {
                formData.append('debit_note[lock_account_invoice_id]', selectedInvoice);
            }
            // Invoice Type dropdown sent as "invoice_type" directly (overrides the earlier "bill_booking"
            // polymorphic-discriminator assumption per explicit instruction — may affect invoice linkage).
            if (invoiceType) {
                formData.append('debit_note[invoice_type]', invoiceType);
            }

            // NOTE: address_detail_attributes isn't in the confirmed debit_notes creation sample —
            // sent on a best-effort basis, mirroring the confirmed bill_bookings contract.
            formData.append('debit_note[address_detail_attributes][gst_detail_id]', selectedGstDetail?.id ? String(selectedGstDetail.id) : '');
            formData.append('debit_note[address_detail_attributes][gst_preference]', gstTreatment || '');
            if (selectedBillingAddress) {
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][address]', selectedBillingAddress.address || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][city]', selectedBillingAddress.city || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][state]', selectedBillingAddress.state || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][country]', selectedBillingAddress.country || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][pin_code]', selectedBillingAddress.pin_code || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][contact_person]', selectedBillingAddress.attention || '');
                formData.append('debit_note[address_detail_attributes][billing_address_attributes][mobile]', selectedBillingAddress.mobile || selectedBillingAddress.telephone_number || '');
            }
            if (selectedShippingAddress) {
                formData.append('debit_note[address_detail_attributes][shipping_address_attributes][address]', selectedShippingAddress.address || '');
                formData.append('debit_note[address_detail_attributes][shipping_address_attributes][city]', selectedShippingAddress.city || '');
                formData.append('debit_note[address_detail_attributes][shipping_address_attributes][state]', selectedShippingAddress.state || '');
                formData.append('debit_note[address_detail_attributes][shipping_address_attributes][country]', selectedShippingAddress.country || '');
                formData.append('debit_note[address_detail_attributes][shipping_address_attributes][pin_code]', selectedShippingAddress.pin_code || '');
            }
            formData.append('debit_note[billing_gstin]', selectedGstDetail?.gstin || gstin || '');

            const lineItemTypes = items.map(item => SOURCE_KEY_TO_LINE_ITEM_TYPE[itemSourceSelection[item.id] || ''] || 'other');
            const resourceIdx = items.findIndex((item, idx) => lineItemTypes[idx] !== 'other' && item.item_id);
            if (resourceIdx !== -1) {
                formData.append('debit_note[resource_type]', LINE_ITEM_RESOURCE_TYPE[lineItemTypes[resourceIdx]]);
                formData.append('debit_note[resource_id]', String(items[resourceIdx].item_id));
            }

            items.forEach((item, idx) => {
                const baseAmount = Number(item.quantity || 0) * Number(item.rate || 0);
                const discountAmount = item.discountType === 'percentage'
                    ? (baseAmount * Number(item.discount || 0)) / 100
                    : Number(item.discount || 0);
                const gstRate = item.item_tax_type === 'flat_gst' ? Number(item.tax_group_id) || 0 : 0;
                const lineItemType = lineItemTypes[idx];

                if (item.dbId) {
                    formData.append(`line_items[${idx}][id]`, String(item.dbId));
                }
                formData.append(`line_items[${idx}][line_item_type]`, lineItemType);
                if (lineItemType !== 'other' && item.item_id) {
                    formData.append(`line_items[${idx}][line_item_reference_id]`, String(item.item_id));
                }
                formData.append(`line_items[${idx}][name]`, item.name);
                formData.append(`line_items[${idx}][quantity]`, String(item.quantity));
                formData.append(`line_items[${idx}][rate]`, String(item.rate));
                formData.append(`line_items[${idx}][amount]`, String(baseAmount));
                formData.append(`line_items[${idx}][discount]`, String(discountAmount));
                formData.append(`line_items[${idx}][gst_rate]`, String(gstRate));
            });

            await fetch(`https://${baseUrl}/debit_notes/${id}.json?lock_account_id=${lock_account_id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                    // Do NOT set Content-Type, browser will set it for FormData
                },
                body: formData
            });

            toast.success('Debit note updated successfully!');
            navigate('/club-management/debit-note');
        } catch (error) {
            console.error('Error updating debit note:', error);
            toast.error('Failed to update debit note.');
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

    // Re-preselect tax on all taxable items when place of supply or orgState changes
    useEffect(() => {
        if (!placeOfSupply) return;
        const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
        setItems(prev => prev.map(item => {
            if (!["tax_group", "tax_rate"].includes(item.item_tax_type)) return item;
            const matched = itemOptions.find(opt => opt.name === item.name);
            if (!matched) return item;
            return {
                ...item,
                item_tax_type: isSameState ? "tax_group" : "tax_rate",
                tax_group_id: isSameState ? matched.tax_group_id : matched.inter_state_tax_rate_id,
            };
        }));
    }, [placeOfSupply, orgState]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Tax group breakdown (Maharashtra)
    selectedTaxGroups.forEach(group => {
        group.taxRates.forEach(rate => {
            const taxAmount = (group.itemAmount * rate.rate) / 100;
            const existing = taxBreakdown.find(t => t.name === rate.name);
            if (existing) {
                existing.amount += taxAmount;
            } else {
                taxBreakdown.push({ name: rate.name, rate: rate.rate, amount: taxAmount });
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

    // Flat GST breakdown (hardcoded 5% / 9% / 18% options)
    items
        .filter(item => item.item_tax_type === "flat_gst" && item.tax_group_id)
        .forEach(item => {
            const rateValue = Number(item.tax_group_id) || 0;
            const taxAmount = (item.amount * rateValue) / 100;
            const name = `GST ${rateValue}%`;
            const existing = taxBreakdown.find(t => t.name === name);
            if (existing) {
                existing.amount += taxAmount;
            } else {
                taxBreakdown.push({ name, rate: rateValue, amount: taxAmount });
            }
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
    if (editLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress size={60} />
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

            {/* <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">New Debit Note</h1>
                </div>
            </header> */}

            <header className="mb-4">

                {/* Back Button - Top */}
                <button
                    type="button"
                    onClick={() => navigate('/club-management/debit-note')}
                    className="flex items-center gap-2 text-black font-medium mb-2"
                >
                    <ArrowLeft className="h-4 w-4 text-black" />
                    Back to Debit Note List
                </button>

                {/* Title - Below */}
                <h1 className="text-2xl font-bold text-black">
                    Edit Debit Note
                </h1>

            </header>


            <div className="space-y-6">
                {/* Customer Section */}
                <Section title="Debit Note Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div>
                            <RadioGroup
                                row
                                value={userType}
                                onChange={(e) => {
                                    setUserType(e.target.value as 'occupant' | 'guest' | 'fm');
                                    setSelectedUser('');
                                }}
                            >
                                <FormControlLabel
                                    value="occupant"
                                    control={<BrandRadio />}
                                    label="Members"
                                />
                                <FormControlLabel
                                    value="guest"
                                    control={<BrandRadio />}
                                    label="Guest"
                                />
                                <FormControlLabel
                                    value="fm"
                                    control={<BrandRadio />}
                                    label="Staff"
                                />
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    User <span className="text-red-500">*</span>
                                </label>
                                <FormControl
                                    fullWidth
                                    error={userType === 'occupant' ? occupantUsersError : userType === 'guest' ? guestUsersError : fmUsersError}
                                >
                                    <Select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(String(e.target.value))}
                                        displayEmpty
                                        disabled={userType === 'occupant' ? occupantUsersLoading : userType === 'guest' ? guestUsersLoading : fmUsersLoading}
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">Select a user</MenuItem>
                                        {userType === 'occupant' && occupantUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                        ))}
                                        {userType === 'guest' && guestUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                        ))}
                                        {userType === 'fm' && fmUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Place of Supply <span className="text-red-500">*</span>
                                    </label>
                                    <TextField
                                        select
                                        fullWidth
                                        value={placeOfSupply}
                                        //  displayEmpty
                                        onChange={(e) => setPlaceOfSupply(e.target.value)}
                                        sx={fieldStyles}
                                        SelectProps={{
                                            displayEmpty: true
                                        }}

                                    >
                                        <MenuItem value="">Select Place of Supply</MenuItem>
                                        {/* <MenuItem value="India">India</MenuItem>
                                        <MenuItem value="United States">United States</MenuItem>
                                        <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                                        <MenuItem value="Australia">Australia</MenuItem>
                                        <MenuItem value="Canada">Canada</MenuItem> */}
                                        {states.map((state) => (
                                            <MenuItem key={state} value={state}>
                                                {state}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Invoice#<span className="text-brand">*</span></label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectedInvoice}
                                            onChange={(e) => setSelectedInvoice(e.target.value)}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" disabled>Select Invoice</MenuItem>
                                            {invoiceList.map((inv) => (
                                                <MenuItem key={inv.id} value={inv.id}>
                                                    {inv.invoice_number || inv.id}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Invoice Type</label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={invoiceType}
                                            onChange={(e) => setInvoiceType(e.target.value)}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" >Select Invoice Type</MenuItem>
                                            {invoiceTypeOptions.map((opt) => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Reason</label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            displayEmpty
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="" >Select Reason</MenuItem>
                                            {reasonOptions.map((opt) => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Billing Address
                                            <IconButton size="small" onClick={() => openAddressListModal('billing')}>
                                                <EditOutlined fontSize="small" className="text-brand" />
                                            </IconButton>
                                        </div>
                                        {selectedBillingAddress?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                <div className="font-medium">{selectedBillingAddress.address}</div>
                                                {selectedBillingAddress.address_line_two && <div>{selectedBillingAddress.address_line_two}</div>}
                                                <div>{[selectedBillingAddress.city, selectedBillingAddress.state].filter(Boolean).join(', ')}{selectedBillingAddress.pin_code ? ` - ${selectedBillingAddress.pin_code}` : ''}</div>
                                                {selectedBillingAddress.country && <div>{selectedBillingAddress.country}</div>}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => openAddressFormModal('new', 'billing')} className="text-xs text-[#DA7756] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                New Address
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Shipping Address
                                            {!sameAsBilling && (
                                                <IconButton size="small" onClick={() => openAddressListModal('shipping')}>
                                                    <EditOutlined fontSize="small" className="text-brand" />
                                                </IconButton>
                                            )}
                                        </div>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={sameAsBilling}
                                                    onChange={(e) => setSameAsBilling(e.target.checked)}
                                                    sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                                                />
                                            }
                                            label={<span className="text-xs text-gray-600">Same as Billing Address</span>}
                                            className="mb-1 -mt-1"
                                        />
                                        {sameAsBilling ? (
                                            selectedBillingAddress?.address ? (
                                                <div className="text-sm text-gray-700 leading-relaxed">
                                                    <div className="font-medium">{selectedBillingAddress.address}</div>
                                                    {selectedBillingAddress.address_line_two && <div>{selectedBillingAddress.address_line_two}</div>}
                                                    <div>{[selectedBillingAddress.city, selectedBillingAddress.state].filter(Boolean).join(', ')}{selectedBillingAddress.pin_code ? ` - ${selectedBillingAddress.pin_code}` : ''}</div>
                                                    {selectedBillingAddress.country && <div>{selectedBillingAddress.country}</div>}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic">Add a billing address first</div>
                                            )
                                        ) : selectedShippingAddress?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                <div className="font-medium">{selectedShippingAddress.address}</div>
                                                {selectedShippingAddress.address_line_two && <div>{selectedShippingAddress.address_line_two}</div>}
                                                <div>{[selectedShippingAddress.city, selectedShippingAddress.state].filter(Boolean).join(', ')}{selectedShippingAddress.pin_code ? ` - ${selectedShippingAddress.pin_code}` : ''}</div>
                                                {selectedShippingAddress.country && <div>{selectedShippingAddress.country}</div>}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => openAddressFormModal('new', 'shipping')} className="text-xs text-[#DA7756] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                New Address
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GST Treatment:</span>
                                        <span className="text-gray-800">{getGstTreatmentLabel(gstTreatment) || '—'}</span>
                                        <IconButton size="small" onClick={openGstModal}>
                                            <EditOutlined fontSize="small" className="text-brand" />
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GSTIN:</span>
                                        <span className="text-gray-800 font-medium">{selectedGstDetail?.gstin || gstin || '—'}</span>
                                        <IconButton size="small" onClick={openGstPickerModal}>
                                            <EditOutlined fontSize="small" className="text-brand" />
                                        </IconButton>
                                    </div>
                                </div> */}
                            </div>
                    </div>
                </Section>

                {/* Sales Order Details */}
                <Section title="Debit Note Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Reference#
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
                                Debit Note Date<span className="text-red-500">*</span>
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


                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Subject
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
                                rows={3}
                                maxLength={500}
                                value={subject}
                                onChange={e => { if (e.target.value.length <= 500) setSubject(e.target.value); }}
                                placeholder="Enter subject"
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">{subject.length}/500</p>
                        </div>

                    </div>
                </Section>

                {/* Item Table */}
                <Section title="Item Table" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-4">
                        {errors.items && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{errors.items}</div>
                        )}

                        <div className="border border-gray-200 rounded-lg overflow-x-auto">
                                <table className="w-full min-w-[900px] item-table-no-hover">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Item Details</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                                            {/* <th className="px-4 py-3 text-left text-sm font-medium">Discount</th> */}
                                            <th className="px-4 py-3 text-left text-sm font-medium">Tax</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                                            {/* <th className="px-4 py-3 text-center text-sm font-medium">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">

                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    {item.locked ? (
                                                        <div className="text-sm">
                                                            <div className="font-medium text-gray-900">{item.name}</div>
                                                            <div className="text-gray-900 mt-1">
                                                                {{
                                                                    facility: 'Facility Booking',
                                                                    membership: 'Membership',
                                                                    event: 'Event',
                                                                    other: 'Other',
                                                                    '': '',
                                                                }[itemSourceSelection[item.id] || '']}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {(() => {
                                                                const rowSource = itemSourceSelection[item.id] || '';
                                                                const sourceOptions: { key: 'facility' | 'membership' | 'event'; label: string; options: { id: string; name: string; rate: number }[] }[] = [
                                                                    { key: 'facility', label: 'Facility Booking', options: facilityBookingOptions },
                                                                    { key: 'membership', label: 'Membership', options: membershipPlanOptions },
                                                                    { key: 'event', label: 'Event', options: eventOptionsList },
                                                                ];
                                                                const activeSource = sourceOptions.find(s => s.key === rowSource);
                                                                return (
                                                                    <div className="mt-2">
                                                                        <RadioGroup
                                                                            row
                                                                            value={rowSource}
                                                                            onChange={(e) => setItemSource(item.id, e.target.value as typeof rowSource)}
                                                                        >
                                                                            {sourceOptions.map(({ key, label }) => (
                                                                                <FormControlLabel
                                                                                    key={key}
                                                                                    value={key}
                                                                                    control={<BrandRadio />}
                                                                                    label={label}
                                                                                />
                                                                            ))}
                                                                            <FormControlLabel
                                                                                value="other"
                                                                                control={<BrandRadio />}
                                                                                label="Other"
                                                                            />
                                                                        </RadioGroup>

                                                                        {activeSource && (
                                                                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                                                                <Select
                                                                                    displayEmpty
                                                                                    value={selectedEntityByItem[item.id] || ''}
                                                                                    onChange={(e) => {
                                                                                        const value = String(e.target.value);
                                                                                        const selected = activeSource.options.find(o => o.id === value);
                                                                                        if (selected) {
                                                                                            setSelectedEntityByItem(prev => ({ ...prev, [item.id]: value }));
                                                                                            applySourceToItem(index, `${activeSource.label}: ${selected.name}`, selected.rate);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="" disabled>
                                                                                        {activeSource.options.length === 0 ? `No ${activeSource.label.toLowerCase()} records found` : `Select ${activeSource.label.toLowerCase()}`}
                                                                                    </MenuItem>
                                                                                    {activeSource.options.map(opt => (
                                                                                        <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                        )}

                                                                        {rowSource === 'other' && (
                                                                            <TextField
                                                                                size="small"
                                                                                placeholder="Enter item name"
                                                                                value={otherItemNameDraft[item.id] ?? ''}
                                                                                onChange={(e) => setOtherItemNameDraft(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                                onBlur={() => {
                                                                                    const name = (otherItemNameDraft[item.id] || '').trim();
                                                                                    if (name) updateItemFields(index, { item_id: null, name });
                                                                                }}
                                                                                sx={{ minWidth: 200 }}
                                                                            />
                                                                        )}
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
                                                        </>
                                                    )}
                                                </td>


                                                <td className="px-4 py-3">
                                                    {item.locked ? (
                                                        <div className="text-sm text-gray-900">{item.quantity}</div>
                                                    ) : (
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || '')}
                                                            inputProps={{ min: 1, step: 1 }}
                                                            sx={{ width: 80 }}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={item.rate}
                                                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || '')}
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
                                                    {item.locked ? (
                                                        <div className="text-sm text-gray-900">
                                                            {item.item_tax_type === "flat_gst" && item.tax_group_id ? `GST ${item.tax_group_id}%` : '-'}
                                                        </div>
                                                    ) : (
                                                        <FormControl size="small" sx={{ width: 200 }}>
                                                            <Select
                                                                value={item.item_tax_type === "flat_gst" ? `flat_${item.tax_group_id}` : ""}
                                                                displayEmpty
                                                                onChange={(e) => {
                                                                    const value = String(e.target.value);
                                                                    if (value.startsWith("flat_")) {
                                                                        updateItem(index, "item_tax_type", "flat_gst");
                                                                        updateItem(index, "tax_group_id", Number(value.replace("flat_", "")));
                                                                    } else {
                                                                        updateItem(index, "item_tax_type", "");
                                                                        updateItem(index, "tax_group_id", null);
                                                                    }
                                                                }}
                                                            >
                                                                <MenuItem value="">Select Tax</MenuItem>

                                                                {[5, 9, 18].map((percent) => (
                                                                    <MenuItem key={`flat_${percent}`} value={`flat_${percent}`}>
                                                                        GST {percent}%
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    ₹{item.amount.toFixed(2)}
                                                </td>
                                                {/* <td className="px-4 py-3 text-center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeItem(index)}
                                                        disabled={items.length === 1}
                                                        sx={{
                                                            color: '#DA7756',
                                                            '&:hover': { backgroundColor: 'rgba(218, 119, 86, 0.08)' },
                                                            '&.Mui-disabled': { color: 'rgba(218, 119, 86, 0.4)' },
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </div>

                        <div className="flex gap-3 pt-4">
                            {/* <Button
                                variant="outline"
                                onClick={addItem}
                                className="fm-button-fix px-8 py-2"
                            >
                                <span className="flex items-center gap-2"><Add fontSize="small" /> Add New Row</span>
                            </Button> */}
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

                            {/* <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-muted-foreground">Discount</span>
                                <div className="flex items-center gap-2">
                                    <Select
                                        size="small"
                                        value={discountTypeOnTotal}
                                        onChange={e => setDiscountTypeOnTotal(e.target.value as 'percentage' | 'amount')}
                                        sx={{ width: 120 }}
                                    >
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="amount">Amount</MenuItem>
                                    </Select>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={discountOnTotal}
                                        onChange={(e) => setDiscountOnTotal(parseFloat(e.target.value) || '')}
                                        inputProps={{ min: 0, step: 0.01 }}
                                        sx={{ width: 80 }}
                                    />

                                    <span className="font-semibold text-base text-red-600 ml-2">-₹{totalDiscount.toFixed(2)}</span>
                                </div>
                            </div> */}
                            {taxBreakdown.map((tax, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {tax.name.includes('%') ? tax.name : `${tax.name} (${tax.rate}%)`} ({tax.rate}%)
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

                {/* Customer Notes */}
                <Section title="Notes" icon={<FileText className="w-5 h-5" />}>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
                        rows={3}
                        maxLength={500}
                        value={customerNotes}
                        onChange={(e) => { if (e.target.value.length <= 500) setCustomerNotes(e.target.value); }}
                        placeholder="Enter notes "
                    />
                    <p className="text-xs text-gray-400 text-right mt-1">{customerNotes.length}/500</p>
                </Section>

                {/* Terms & Conditions */}
                <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#DA7756] focus:border-[#DA7756] resize-y"
                        rows={4}
                        maxLength={500}
                        value={termsAndConditions}
                        onChange={(e) => { if (e.target.value.length <= 500) setTermsAndConditions(e.target.value); }}
                        placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                    />
                    <p className="text-xs text-gray-400 text-right mt-1">{termsAndConditions.length}/500</p>
                </Section>

                {/* Attachments */}
                {/* <Section title="Attach Files to Sales Order" icon={<AttachFile className="w-5 h-5" />}>
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
                            label="Display attachments in customer portal and emails"
                        /> */}
                {/* </div> */}
                {/* </Section> */}

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

                <Button
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="fm-button-fix fm-button-brand px-8 py-2"
                >
                    {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
                <Button
                    onClick={() => navigate('/club-management/debit-note')}
                    disabled={isSubmitting}
                    variant="outline"
                    className="fm-button-fix px-8 py-2"
                >
                    Cancel
                </Button>
            </div>

            {/* Customer Details Drawer */}
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
                                    <span className="text-xl font-bold text-brand">
                                        {/* {selectedCustomer.contacts.charAt(0)} */}
                                    </span>
                                </div>
                                <div>
                                    <Typography variant="h6" className="font-bold">
                                        {selectedCustomer.name}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {selectedCustomer.email}
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
                                    {/* ₹{typeof selectedCustomer.outstandingReceivables === 'number' ? selectedCustomer.outstandingReceivables.toLocaleString() : '0'} */}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    Outstanding Receivables
                                </Typography>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    {/* ₹{selectedCustomer.unusedCredits.toLocaleString()} */}
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
                                    <span className="text-gray-600">Customer Type</span>
                                    <span className="font-semibold">{selectedCustomer.customerType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Currency</span>
                                    <span className="font-semibold">{selectedCustomer.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Terms</span>
                                    <span className="font-semibold">{selectedCustomer.paymentTerms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Portal Status</span>
                                    <span className="font-semibold">{selectedCustomer.portalStatus}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Customer Language</span>
                                    <span className="font-semibold">{selectedCustomer.language}</span>
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
                    <Button onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddExternalUser} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addressListModalOpen} onClose={() => setAddressListModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="!text-base !font-semibold !pr-10">
                    {activeAddressType === 'billing' ? 'Billing Address' : 'Shipping Address'}
                </DialogTitle>
                <DialogContent dividers>
                    <div className="max-h-[420px] overflow-y-auto space-y-3">
                        {getAddressBookByType(activeAddressType).map((addr) => (
                            <div
                                key={addr.id}
                                className={`border rounded-md p-3 text-sm cursor-pointer transition-colors ${String(activeAddressType === 'billing' ? selectedBillingAddressId : selectedShippingAddressId) === String(addr.id)
                                    ? 'border-[#DA7756] bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'}`}
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
                                        {(addr.telephone_number || addr.fax_number) && <div>{addr.telephone_number}{addr.fax_number ? ` Fax Number : ${addr.fax_number}` : ''}</div>}
                                    </div>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openAddressFormModal('edit', activeAddressType, addr);
                                        }}
                                    >
                                        <EditOutlined fontSize="small" className="text-brand" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className="!justify-between !px-4">
                    <button type="button" className="text-[#DA7756] text-sm font-medium" onClick={() => openAddressFormModal('new', activeAddressType)}>
                        + New address
                    </button>
                    <button type="button" onClick={() => setAddressListModalOpen(false)} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Close</button>
                </DialogActions>
            </Dialog>

            <Dialog open={addressFormModalOpen} onClose={() => setAddressFormModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="!text-base !font-semibold">Additional Address</DialogTitle>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <TextField label="Attention" fullWidth value={addressForm.attention} onChange={(e) => setAddressForm((prev) => ({ ...prev, attention: e.target.value }))} className="md:col-span-2" />
                        <TextField label="Country/Region" select fullWidth value={addressForm.country} onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))} className="md:col-span-2">
                            {addressCountryOptions.map((opt) => (<MenuItem key={opt.code} value={opt.name}>{opt.name}</MenuItem>))}
                        </TextField>
                        <TextField label="Tax Information" select fullWidth value={selectedAddressTaxInfoId} onChange={(e) => setSelectedAddressTaxInfoId(String(e.target.value))} className="md:col-span-2">
                            <MenuItem value="">Select</MenuItem>
                            {gstDetails.map((gst) => (<MenuItem key={gst.id} value={String(gst.id)}>{gst.gstin} - {gst.place_of_supply}</MenuItem>))}
                        </TextField>
                        <TextField label="Address" placeholder="Street 1" fullWidth value={addressForm.address} onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))} className="md:col-span-2" />
                        <TextField placeholder="Street 2" fullWidth value={addressForm.address_line_two} onChange={(e) => setAddressForm((prev) => ({ ...prev, address_line_two: e.target.value }))} className="md:col-span-2" />
                        <TextField label="City" fullWidth value={addressForm.city} onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))} className="md:col-span-2" />
                        <TextField label="State" select fullWidth value={addressForm.state} onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}>
                            <MenuItem value="">Select</MenuItem>
                            {states.map((state) => (<MenuItem key={state} value={state}>{state}</MenuItem>))}
                        </TextField>
                        <TextField label="Pin Code" fullWidth value={addressForm.pin_code} onChange={(e) => setAddressForm((prev) => ({ ...prev, pin_code: e.target.value }))} />
                        <TextField label="Phone" fullWidth value={addressForm.telephone_number} onChange={(e) => setAddressForm((prev) => ({ ...prev, telephone_number: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">+91</InputAdornment> }} />
                        <TextField label="Fax Number" fullWidth value={addressForm.fax_number} onChange={(e) => setAddressForm((prev) => ({ ...prev, fax_number: e.target.value }))} />
                    </div>
                </DialogContent>
                <DialogActions className="!justify-start !px-6 !py-3">
                    <button type="button" onClick={handleSaveAddressForm} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Save</button>
                    <button type="button" onClick={() => setAddressFormModalOpen(false)} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Cancel</button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstModalOpen} onClose={() => setGstModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle className="!text-base !font-medium !pb-2">Configure Tax Preferences</DialogTitle>
                <DialogContent className="!pt-2">
                    <TextField label="GST Treatment" select fullWidth value={gstTreatmentDraft} onChange={(e) => setGstTreatmentDraft(e.target.value)} size="small">
                        {gstTreatmentOptions.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                    </TextField>
                </DialogContent>
                <DialogActions className="!justify-start !px-6 !pb-4">
                    <button type="button" onClick={handleUpdateGstConfig} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Update</button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstManageModalOpen} onClose={() => setGstManageModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="!text-base !font-semibold !border-b !border-gray-200 !flex !items-center !justify-between !py-3">
                    <span>Manage Tax Informations</span>
                    <IconButton size="small" onClick={() => setGstManageModalOpen(false)}><Close fontSize="small" className="text-red-500" /></IconButton>
                </DialogTitle>
                <DialogContent className="!pt-4">
                    <div className="space-y-4">
                        <button type="button" onClick={() => { setEditingGstDetailId(null); setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' }); setShowNewGstForm(true); }} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">
                            Add New Tax Information
                        </button>
                        {showNewGstForm && (
                            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <TextField
                                        label="GSTIN / UIN*"
                                        fullWidth
                                        value={newGstForm.gstin}
                                        onChange={(e) => setNewGstForm((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                                        error={!!newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)}
                                        helperText={newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin) ? 'Invalid GSTIN format. e.g. 27AAAAA1234A1Z5' : ''}
                                        inputProps={{ maxLength: 15 }}
                                        size="small"
                                    />
                                    <button type="button" className="text-brand text-sm mt-1">Validate</button>
                                </div>
                                <TextField label="Place of Supply*" select fullWidth value={newGstForm.place_of_supply} onChange={(e) => setNewGstForm((prev) => ({ ...prev, place_of_supply: e.target.value }))} size="small">
                                    <MenuItem value="">Select</MenuItem>
                                    {states.map((state) => (<MenuItem key={state} value={state}>{state}</MenuItem>))}
                                </TextField>
                                <TextField label="Business Legal Name" fullWidth value={newGstForm.business_legal_name} onChange={(e) => setNewGstForm((prev) => ({ ...prev, business_legal_name: e.target.value }))} size="small" />
                                <TextField label="Business Trade Name" fullWidth value={newGstForm.business_trade_name} onChange={(e) => setNewGstForm((prev) => ({ ...prev, business_trade_name: e.target.value }))} size="small" />
                                <div className="md:col-span-3 flex items-center gap-2">
                                    <button type="button" onClick={handleSaveAndSelectGst} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">{editingGstDetailId ? 'Save' : 'Save and Select'}</button>
                                    <button type="button" onClick={() => { setShowNewGstForm(false); setEditingGstDetailId(null); }} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Cancel</button>
                                </div>
                            </div>
                        )}
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <div className="grid grid-cols-5 bg-gray-50 text-xs font-semibold text-gray-500 px-4 py-2">
                                <div>GSTIN</div><div>PLACE OF SUPPLY</div><div>BUSINESS LEGAL NAME</div><div>BUSINESS TRADE NAME</div><div></div>
                            </div>
                            <div className="max-h-[280px] overflow-y-auto">
                                {gstDetails.map((gst) => (
                                    <div key={gst.id} className={`grid grid-cols-5 px-4 py-2 text-sm border-t border-gray-100 cursor-pointer ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''}`} onClick={() => handleGstinDropdownChange(gst.id)}>
                                        <div>{gst.gstin}{gst.primary && <div className="text-green-600 italic">(Primary Tax Information)</div>}</div>
                                        <div>{gst.place_of_supply || '—'}</div>
                                        <div>{gst.business_legal_name || '—'}</div>
                                        <div>{gst.business_trade_name || '—'}</div>
                                        <div className="flex items-center gap-2 justify-end">
                                            {!gst.primary && (
                                                <>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditGstDetail(gst); }}><EditOutlined fontSize="small" /></IconButton>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteGstDetail(gst.id); }}><Delete fontSize="small" /></IconButton>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="!px-5 !pb-4">
                    <button type="button" onClick={() => setGstManageModalOpen(false)} className="px-4 py-2 rounded border border-[#DA7756] text-[#DA7756] hover:bg-[#DA7756] hover:text-white text-sm">Close</button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstPickerModalOpen} onClose={() => setGstPickerModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogContent className="!p-0">
                    <div className="max-h-[240px] overflow-y-auto">
                        {gstDetails.map((gst) => (
                            <button key={gst.id} type="button" className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''}`} onClick={() => handleGstinDropdownChange(gst.id)}>
                                {gst.gstin} - {gst.place_of_supply}
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <button type="button" className="text-brand text-sm flex items-center gap-1" onClick={() => { setGstPickerModalOpen(false); openGstManageModal(); }}>
                            <span>⚙</span> Manage Tax Informations
                        </button>
                    </div>
                </DialogContent>
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
        </div>
    );
};
