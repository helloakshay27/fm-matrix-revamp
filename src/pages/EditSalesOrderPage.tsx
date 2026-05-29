import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemSearchInput from '@/components/ItemSearchInput';
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
    EditOutlined
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ChevronDown, ChevronUp, Mail, Phone, Smartphone, Star, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

// Section component - matching SalesOrderCreatePage style
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

interface DetailContactPerson {
    id: string;
    salutation: string;
    first_name: string;
    last_name: string;
    email: string;
    work_phone: string;
    mobile: string;
    phone: string;
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
    contact_persons: DetailContactPerson[];
    billing_address: {
        address: string;
        address_line_two: string;
        city: string;
        state: string;
        pin_code: string;
        country: string;
    };
    shipping_address: {
        address: string;
        address_line_two: string;
        city: string;
        state: string;
        pin_code: string;
        country: string;
    };
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
    item_id?: string | null;
    description: string;
    quantity: number | '';
    rate: number | '';
    discount: number | '';
    discountType: 'percentage' | 'amount';
    tax: string;
    taxRate: number;
    amount: number;
    item_tax_type?: string;
    tax_group_id?: number | null;
    tax_exemption_id?: number | null;
    line_item_id?: number; // DB item ID
}

interface ExternalUser {
    name: string;
    email: string;
}

export const EditSalesOrderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const lock_account_id = localStorage.getItem("lock_account_id");
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [selectedTerm, setSelectedTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfig, setShowConfig] = useState(false);
    const [editTerms, setEditTerms] = useState([]);
    const [paymentTermsList, setPaymentTermsList] = useState([]);
    const filteredTerms = paymentTermsList.filter(term =>
        term.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Customer Details Drawer State
    const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
    const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null);
    const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
    const [drawerActiveTab, setDrawerActiveTab] = useState(0);
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

    const getAddressBookByType = (type: 'billing' | 'shipping') =>
        type === 'billing' ? billingAddressBook : shippingAddressBook;

    const selectedBillingAddress = billingAddressBook.find(a => String(a.id) === String(selectedBillingAddressId)) || billingAddressBook[0] || null;
    const selectedShippingAddress = shippingAddressBook.find(a => String(a.id) === String(selectedShippingAddressId)) || shippingAddressBook[0] || null;
    const selectedGstDetail = gstDetails.find(g => String(g.id) === String(selectedGstDetailId)) || gstDetails.find(g => g.primary) || gstDetails[0] || null;

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
    const [expectedShipmentDate, setExpectedShipmentDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [placeOfSupply, setPlaceOfSupply] = useState("");
    const [orgState, setOrgState] = useState<string>("");

    // Items and deleted tracking
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
            tax_group_id: null,
            tax_exemption_id: null
        }
    ]);
    const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);

    const taxTypeOptions = [
        { value: "non_taxable", label: "Non-Taxable" },
        { value: "out_of_scope", label: "Out of Scope" },
        { value: "non_gst_supply", label: "Non-GST Supply" }
    ];

    const [taxGroups, setTaxGroups] = useState<any[]>([]);
    const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);

    const [taxRates, setTaxRates] = useState<any[]>([]);

    // Exemption reasons
    const [exemptionModalOpen, setExemptionModalOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedExemption, setSelectedExemption] = useState("");
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [customerExemptions, setCustomerExemptions] = useState<any[]>([]);
    const [loadingExemptions, setLoadingExemptions] = useState(false);

    // Summary
    const [discountOnTotal, setDiscountOnTotal] = useState<number>(0);
    const [discountTypeOnTotal, setDiscountTypeOnTotal] = useState<'percentage' | 'amount'>('percentage');
    const [adjustment, setAdjustment] = useState<number | ''>(0);
    const [adjustmentLabel, setAdjustmentLabel] = useState('Adjustment');

    // Notes & Attachments
    const [customerNotes, setCustomerNotes] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
    const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>([]);
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

    // Dropdowns options
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number; description?: string; tax_preference?: string; tax_exemption_id?: number | null; tax_group_id?: number | null; inter_state_tax_rate_id?: any }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Delete confirmation dialog state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
    const [deleteTargetType, setDeleteTargetType] = useState<'item' | 'attachment'>('item');

    const handleDeleteConfirm = () => {
        if (deleteTargetIndex !== null) {
            if (deleteTargetType === 'item') {
                removeItem(deleteTargetIndex);
            } else {
                removeAttachment(deleteTargetIndex);
            }
        }
        setDeleteConfirmOpen(false);
        setDeleteTargetIndex(null);
    };

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    const modalPrimaryButtonSx = {
        textTransform: 'none',
        bgcolor: '#C72030',
        color: '#fff',
        '&:hover': { bgcolor: '#A01020' }
    };

    const modalSecondaryButtonSx = {
        textTransform: 'none',
        borderColor: '#C72030',
        color: '#C72030',
        '&:hover': { borderColor: '#A01020', bgcolor: '#f8f1f1', color: '#A01020' }
    };

    // Load active settings and dropdown resources
    useEffect(() => {
        document.title = 'Edit Sales Order';

        const fetchItems = async () => {
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_items.json?lock_account_id=${lock_account_id}&q[can_be_sold_eq]=1`, {
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
                }
            } catch (err) {
                setItemOptions([]);
            }
        };

        const fetchSalespersons = async () => {
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

        const fetchPaymentTerms = async () => {
            try {
                const res = await axios.get(`https://${baseUrl}/payment_terms.json?lock_account_id=${lock_account_id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    const terms = res.data.map((pt: any) => ({ id: pt.id, name: pt.name, days: pt.no_of_days }));
                    setPaymentTermsList(terms);
                    const defaultTerm = terms.find((t: any) => t.name.toLowerCase() === 'due on receipt' || t.name.toLowerCase() === 'due on reciept');
                    if (defaultTerm) {
                        setSelectedTerm((prev: any) => prev || defaultTerm.id);
                    }
                }
            } catch (err) {
                setPaymentTermsList([]);
            }
        };

        const fetchTaxGroups = async () => {
            setLoadingTaxGroups(true);
            try {
                const res = await axios.get(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_groups_view.json`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json"
                    }
                });
                setTaxGroups(res.data || []);
            } catch (error) {
                console.error("Error fetching tax groups:", error);
            } finally {
                setLoadingTaxGroups(false);
            }
        };

        const fetchTaxRates = async () => {
            try {
                const res = await axios.get(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_rates.json?q[rate_type_eq]=IGST`, {
                    headers: { Authorization: token ? `Bearer ${token}` : undefined, "Content-Type": "application/json" }
                });
                setTaxRates(res.data || []);
            } catch (error) {
                console.error("Error fetching IGST tax rates:", error);
            }
        };

        const fetchOrgState = async () => {
            const organisation_id = localStorage.getItem('org_id') || localStorage.getItem('organisation_id');
            if (!organisation_id) return;
            try {
                const res = await axios.get(
                    `https://${baseUrl}/organizations/${organisation_id}.json?lock_account_id=${lock_account_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const org = res.data?.organization || res.data;
                const state = org?.address?.state || '';
                setOrgState(state);
            } catch (err) {
                console.error('Failed to fetch org state:', err);
            }
        };

        const fetchExemptions = async () => {
            setLoadingExemptions(true);
            try {
                const res = await axios.get(`https://${baseUrl}/tax_exemptions.json?lock_account_id=${lock_account_id}&q[exemption_type_eq]=item`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json"
                    }
                });
                setCustomerExemptions(res.data || []);
            } catch (error) {
                console.error("Error fetching tax exemptions:", error);
            } finally {
                setLoadingExemptions(false);
            }
        };

        const fetchCustomers = async () => {
            setLoadingCustomers(true);
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                setCustomers(res.data || []);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoadingCustomers(false);
            }
        };

        fetchItems();
        fetchSalespersons();
        fetchPaymentTerms();
        fetchTaxGroups();
        fetchTaxRates();
        fetchOrgState();
        fetchExemptions();
        fetchCustomers();
    }, []);

    const fetchCustomerDetail = async (
        customerId: string | number,
        preferredGstin?: string,
        newAddressToSelect?: { type: 'billing' | 'shipping', attention: string, address: string, pin_code: string }
    ) => {
        setCustomerDetailLoading(true);
        try {
            const response = await fetch(
                `https://${baseUrl}/lock_account_customers/${customerId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
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

            return {
                nextBilling,
                nextShipping,
                defaultBilling: finalBilling,
                defaultShipping: finalShipping
            };
        } catch (error) {
            console.error("Error fetching customer details:", error);
            toast.error("Failed to fetch customer details");
        } finally {
            setCustomerDetailLoading(false);
        }
    };

    // Load existing Sales Order details
    useEffect(() => {
        const fetchSalesOrder = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await axios.get(`https://${baseUrl}/sale_orders/${id}.json?lock_account_id=${lock_account_id}`, {
                    headers: { Authorization: token ? `Bearer ${token}` : undefined }
                });
                const data = res.data;
                if (data) {
                    setSalesOrderNumber(data.sale_order_number || '');
                    setReferenceNumber(data.reference_number || '');
                    setSalesOrderDate(data.date ? data.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'));
                    setExpectedShipmentDate(data.shipment_date ? data.shipment_date.split('T')[0] : '');
                    setDeliveryMethod(data.delivery_method || '');
                    setSalesperson(data.sales_person_id ? String(data.sales_person_id) : '');
                    setSelectedTerm(data.payment_term_id ? String(data.payment_term_id) : '');
                    setCustomerNotes(data.customer_notes || '');
                    setTermsAndConditions(data.terms_and_conditions || '');

                    if (data.discount_per) {
                        setDiscountTypeOnTotal('percentage');
                        setDiscountOnTotal(data.discount_per);
                    } else if (data.discount_amount) {
                        setDiscountTypeOnTotal('amount');
                        setDiscountOnTotal(data.discount_amount);
                    } else {
                        setDiscountOnTotal(0);
                    }

                    if (data.charge_amount) {
                        setAdjustment(data.charge_amount);
                        setAdjustmentLabel(data.charge_name || 'Adjustment');
                    }

                    if (data.tax_type) {
                        setTaxType((data.tax_type.toUpperCase() as 'TDS' | 'TCS') || 'TDS');
                    }
                    if (data.lock_account_tax_id) {
                        setSelectedTax(String(data.lock_account_tax_id));
                    }
                    if (data.place_of_supply) {
                        setPlaceOfSupply(data.place_of_supply);
                    }

                    // Pre-fill selected customer and detail book
                    if (data.lock_account_customer_id) {
                        setSelectedCustomer({
                            id: String(data.lock_account_customer_id),
                            name: data.customer_name || 'Customer',
                            currency: data.currency || 'INR'
                        } as any);

                        const customerDetailResult = await fetchCustomerDetail(data.lock_account_customer_id);

                        const billingId = data.address_detail?.billing_address_id || data.address_detail?.billing_address?.id || customerDetailResult?.defaultBilling?.id || null;
                        const shippingId = data.address_detail?.shipping_address_id || data.address_detail?.shipping_address?.id || customerDetailResult?.defaultShipping?.id || null;

                        setSelectedBillingAddressId(billingId);
                        setSelectedShippingAddressId(shippingId);

                        const billingAddressFromOrder = customerDetailResult?.nextBilling.find((addr: CustomerAddress) => String(addr.id) === String(billingId))
                            || customerDetailResult?.defaultBilling
                            || (data.address_detail?.billing_address ? mapAddress(data.address_detail.billing_address, 'billing') : null);
                        const shippingAddressFromOrder = customerDetailResult?.nextShipping.find((addr: CustomerAddress) => String(addr.id) === String(shippingId))
                            || customerDetailResult?.defaultShipping
                            || (data.address_detail?.shipping_address ? mapAddress(data.address_detail.shipping_address, 'shipping') : null);

                        setBillingAddress(formatAddressText(billingAddressFromOrder));
                        setShippingAddress(formatAddressText(shippingAddressFromOrder));

                        if (data.address_detail?.gst_detail_id) {
                            setSelectedGstDetailId(data.address_detail.gst_detail_id);
                        }
                        if (data.address_detail?.gst_detail?.place_of_supply) {
                            setPlaceOfSupply(data.address_detail.gst_detail.place_of_supply);
                        }
                    }

                    // Map line items
                    if (data.item_details && data.item_details.length > 0) {
                        setItems(data.item_details.map((item: any, idx: number) => ({
                            id: String(idx + 1),
                            line_item_id: item.id,
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
                            tax_exemption_id: item.tax_exemption_id || null,
                        })));
                    }

                    if (data.attachments && data.attachments.length > 0) {
                        setExistingAttachments(data.attachments);
                    }

                    // Turn off initial loading lock
                    setIsInitialLoad(false);
                }
            } catch (err) {
                console.error("Failed to load sales order details for editing:", err);
                toast.error("Failed to fetch Sales Order details");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesOrder();
    }, [id]);

    // Handle manual customer dropdown selection Address overwrite
    useEffect(() => {
        if (!isInitialLoad && selectedCustomer) {
            setBillingAddress(selectedCustomer.billingAddress || '');
            setShippingAddress(selectedCustomer.shippingAddress || '');
            setPaymentTerms(selectedCustomer.paymentTerms || '');
        }
    }, [selectedCustomer, isInitialLoad]);

    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [sameAsBilling, billingAddress]);

    useEffect(() => {
        if (selectedBillingAddress) {
            setBillingAddress(formatAddressText(selectedBillingAddress));
        }
    }, [selectedBillingAddressId, billingAddressBook.length]);

    useEffect(() => {
        if (!sameAsBilling && selectedShippingAddress) {
            setShippingAddress(formatAddressText(selectedShippingAddress));
        }
    }, [selectedShippingAddressId, shippingAddressBook.length, sameAsBilling]);

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
    }, [placeOfSupply, orgState]);

    const handleInputChange = (field: string, value: any) => {
        if (field === 'date') setSalesOrderDate(value);
        if (field === 'reference_number') setReferenceNumber(value);
        if (field === 'expected_shipment_date') setExpectedShipmentDate(value);
        if (field === 'delivery_method') setDeliveryMethod(value);
        if (field === 'salesperson') setSalesperson(value);
    };

    const handleSaveAddressForm = async () => {
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }
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
        if (addressFormMode === 'edit' && !String(targetId).startsWith(`${activeAddressType}-`)) {
            addressAttr.id = Number(targetId) || targetId;
        }
        const updatePayload = {
            lock_account_customer: {
                id: selectedCustomer.id,
                [activeAddressType === 'billing' ? 'billing_addresses_attributes' : 'shipping_addresses_attributes']: [addressAttr]
            }
        };
        try {
            const response = await fetch(
                `https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`,
                {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify(updatePayload)
                }
            );
            if (!response.ok) throw new Error(`Address save failed (${response.status})`);
            setBook(prev => addressFormMode === 'edit'
                ? prev.map(item => (String(item.id) === String(targetId) ? payload : item))
                : [...prev, payload]
            );
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
        if (!gstinRegex.test(normalizedGstin)) {
            toast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
            return;
        }
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

    const calculateItemAmount = (item: Item): number => {
        const qty = Number(item.quantity || 0);
        const rate = Number(item.rate || 0);
        const baseAmount = qty * rate;
        const disc = Number(item.discount || 0);
        const discountAmount = item.discountType === 'percentage'
            ? (baseAmount * disc) / 100
            : disc;
        const afterDiscount = baseAmount - discountAmount;
        const taxAmount = (afterDiscount * item.taxRate) / 100;
        return afterDiscount + taxAmount;
    };

    const updateItem = (index: number, field: keyof Item, value: string | number | 'percentage' | 'amount') => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
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

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const deletedItem = items[index];
            if (deletedItem.line_item_id) {
                setDeletedItemIds(prev => [...prev, deletedItem.line_item_id!]);
            }
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const [taxAmount2, setTaxAmount2] = useState(0);
    const [totalAmount2, setTotalAmount2] = useState(0);

    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0);
    const totalDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * discountOnTotal) / 100
        : discountOnTotal;
    const afterDiscount = subTotal - totalDiscount;

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

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = (attId: number) => {
        setDeletedAttachmentIds(prev => [...prev, attId]);
        setExistingAttachments(prev => prev.filter(att => att.id !== attId));
    };

    const removeExternalUser = (index: number) => {
        setExternalUsers(prev => prev.filter((_, i) => i !== index));
    };

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

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedCustomer) {
            newErrors.customer = 'Customer is required';
            toast.error('Customer is required');
        }
        if (!salesOrderDate) {
            newErrors.salesOrderDate = 'Sales order date is required';
            toast.error('Sales order date is required');
        }
        if (!expectedShipmentDate) {
            newErrors.expectedShipmentDate = 'Expected shipment date is required';
            toast.error('Expected shipment date is required');
        } else if (salesOrderDate && new Date(expectedShipmentDate) < new Date(salesOrderDate)) {
            newErrors.expectedShipmentDate = 'Cannot be earlier than Sales Order Date';
            toast.error('Expected shipment date cannot be earlier than Sales Order Date');
        }
        if (!selectedTerm) {
            newErrors.paymentTerms = 'Payment terms is required';
            toast.error('Payment terms is required');
        }

        const hasValidItems = items.some(item => item.name && Number(item.quantity || 0) > 0 && Number(item.rate || 0) > 0);
        if (!hasValidItems) {
            newErrors.items = 'At least one valid item with quantity and rate is required';
            toast.error('At least one valid item is required');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );

            formData.append('sale_order[sub_total_amount]', String(subTotal));
            formData.append('sale_order[taxable_amount]', String(totalGSTAmount));
            formData.append('sale_order[lock_account_tax_amount]', String(taxAmount2));
            formData.append('sale_order[lock_account_customer_id]', selectedCustomer?.id || '');
            formData.append('sale_order[reference_number]', referenceNumber);
            formData.append('sale_order[date]', salesOrderDate);
            formData.append('sale_order[shipment_date]', expectedShipmentDate);
            formData.append('sale_order[payment_term_id]', selectedTerm);
            formData.append('sale_order[delivery_method]', deliveryMethod);
            formData.append('sale_order[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
            formData.append('sale_order[customer_notes]', customerNotes);
            formData.append('sale_order[terms_and_conditions]', termsAndConditions);
            formData.append('sale_order[status]', saveAsDraft ? 'draft' : 'confirmed');
            formData.append('sale_order[total_amount]', String(totalAmount2));

            if (discountTypeOnTotal === 'percentage') {
                formData.append('sale_order[discount_per]', String(discountOnTotal));
                formData.append('sale_order[discount_amount]', String(totalDiscount));
            } else {
                formData.append('sale_order[discount_amount]', String(discountOnTotal));
            }
            formData.append('sale_order[charge_amount]', String(adjustment || 0));
            formData.append('sale_order[charge_name]', adjustmentLabel);
            formData.append('sale_order[charge_type]', Number(adjustment || 0) >= 0 ? 'plus' : 'minus');
            formData.append('sale_order[tax_type]', taxType.toLowerCase());

            const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
            formData.append('sale_order[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));
            formData.append('sale_order[place_of_supply]', placeOfSupply);

            // Address mapping
            const selectedOrFirstBillingId = selectedBillingAddressId ?? billingAddressBook[0]?.id ?? '';
            const selectedOrFirstShippingId = selectedShippingAddressId ?? shippingAddressBook[0]?.id ?? '';
            const selectedOrFirstGstDetailId = selectedGstDetailId ?? gstDetails[0]?.id ?? '';
            const gstPreferenceValue = customerDetail?.gst_preference || customerDetail?.gst_treatment || '';
            formData.append('sale_order[address_detail_attributes][billing_address_id]', String(selectedOrFirstBillingId));
            formData.append('sale_order[address_detail_attributes][shipping_address_id]', String(selectedOrFirstShippingId));
            formData.append('sale_order[address_detail_attributes][gst_detail_id]', String(selectedOrFirstGstDetailId));
            formData.append('sale_order[address_detail_attributes][gst_preference]', String(gstPreferenceValue));

            // Sale order items
            items.forEach((item, idx) => {
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                
                if (item.line_item_id) {
                    formData.append(`sale_order[sale_order_items_attributes][${idx}][id]`, String(item.line_item_id));
                }
                
                if (resolvedId) {
                    formData.append(`sale_order[sale_order_items_attributes][${idx}][lock_account_item_id]`, String(resolvedId));
                } else {
                    formData.append(`sale_order[sale_order_items_attributes][${idx}][item_name]`, item.name);
                }
                formData.append(`sale_order[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][description]`, item.description || '');
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_type]`, String(item.item_tax_type));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
            });

            // Append deleted line items
            deletedItemIds.forEach((itemId, idx) => {
                const deleteIdx = items.length + idx;
                formData.append(`sale_order[sale_order_items_attributes][${deleteIdx}][id]`, String(itemId));
                formData.append(`sale_order[sale_order_items_attributes][${deleteIdx}][_destroy]`, 'true');
            });

            // Email contact persons
            selectedContactPersons.forEach((id, idx) => {
                formData.append(`sale_order[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
            });

            // New Attachments
            attachments.forEach((file, idx) => {
                formData.append(`sale_order[attachments_attributes][${idx}][document]`, file);
                formData.append(`sale_order[attachments_attributes][${idx}][active]`, 'true');
            });

            // Existing Attachments to delete
            deletedAttachmentIds.forEach((attId, idx) => {
                const deleteAttIdx = attachments.length + idx;
                formData.append(`sale_order[attachments_attributes][${deleteAttIdx}][id]`, String(attId));
                formData.append(`sale_order[attachments_attributes][${deleteAttIdx}][active]`, 'false');
            });

            await axios.put(`https://${baseUrl}/sale_orders/${id}.json?lock_account_id=${lock_account_id}`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                }
            });

            toast.success(`Sales order updated successfully!`);
            navigate(`/accounting/sales-order/${id}`);
        } catch (error) {
            console.error('Error submitting sales order edit:', error);
            toast.error('Failed to update sales order');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch tax options based on taxType, using baseUrl and Bearer token
    useEffect(() => {
        const fetchTaxSections = async () => {
            try {
                const type = taxType.toLowerCase();
                const url = `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=${type}&lock_account_id=${lock_account_id}`;
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
        if (baseUrl && token) {
            fetchTaxSections();
        }
    }, [taxType]);

    // Update taxAmount using percentage from selected tax option
    useEffect(() => {
        const selected = taxOptions.find(t => t.name === selectedTax || String(t.id) === String(selectedTax));
        if (selected && typeof selected.percentage === 'number') {
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

    // Inter-state (IGST Tax Rates)
    items
        .filter(item => item.item_tax_type === "tax_rate" && item.tax_group_id)
        .forEach(item => {
            const rate = taxRates.find(r => String(r.id) === String(item.tax_group_id));
            if (!rate) return;
            const taxAmount = (item.amount * rate.rate) / 100;
            const existing = taxBreakdown.find(t => t.name === rate.name);
            if (existing) existing.amount += taxAmount;
            else taxBreakdown.push({ name: rate.name, rate: rate.rate, amount: taxAmount });
        });

    const totalTax = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);

    useEffect(() => {
        const total =
            afterDiscount +
            totalTax -
            taxAmount2 +
            (Number(adjustment) || 0);
        setTotalAmount2(total);
    }, [afterDiscount, totalTax, taxAmount2, adjustment]);

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

    const openCustomerDrawer = () => {
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }
        setCustomerDrawerOpen(true);
        fetchCustomerDetail(selectedCustomer.id);
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
        setGstTreatmentDraft(
            customerDetail?.gst_preference ||
            customerDetail?.gst_treatment ||
            ''
        );
        setGstModalOpen(true);
    };

    const openGstManageModal = () => {
        setShowNewGstForm(false);
        setEditingGstDetailId(null);
        setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
        setGstManageModalOpen(true);
    };

    const openGstPickerModal = () => setGstPickerModalOpen(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading sales order details...</p>
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

            <div className="mb-2">
                <button
                    onClick={() => navigate(`/accounting/sales-order/${id}`)}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium tracking-wide"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sales Order Details
                </button>
            </div>

            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Sales Order</h1>
            </header>

            <div className="space-y-6">
                {/* Customer Section */}
                <Section title="Customer Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Customer Name<span className="text-red-500">*</span>
                                </label>
                                <FormControl fullWidth error={!!errors.customer}>
                                    <Select
                                        value={selectedCustomer?.id || ''}
                                        onChange={(e) => {
                                            const customerId = e.target.value;
                                            const customer = customers.find(c => String(c.id) === String(customerId));
                                            setSelectedCustomer(customer || null);
                                            setSelectedBillingAddressId(null);
                                            setSelectedShippingAddressId(null);
                                            if (customerId) {
                                                fetchCustomerDetail(customerId);
                                            } else {
                                                setCustomerDetail(null);
                                                setBillingAddress('');
                                                setShippingAddress('');
                                                setPlaceOfSupply('');
                                            }
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select a customer</MenuItem>
                                        {customers.map((customer) => (
                                            <MenuItem key={customer.id} value={customer.id}>
                                                {customer.name}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                        )}

                        {selectedCustomer && customerDetail && (
                            <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                                    {/* Billing Address */}
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
                                                {selectedBillingAddress.address_line_two && (
                                                    <div>{selectedBillingAddress.address_line_two}</div>
                                                )}
                                                <div>
                                                    {[selectedBillingAddress.city, selectedBillingAddress.state]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                    {selectedBillingAddress.pin_code ? ` - ${selectedBillingAddress.pin_code}` : ""}
                                                </div>
                                                {selectedBillingAddress.country && (
                                                    <div>{selectedBillingAddress.country}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openAddressFormModal('new', 'billing')}
                                                className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block"
                                            >
                                                New Address
                                            </button>
                                        )}
                                    </div>

                                    {/* Shipping Address */}
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
                                                {selectedShippingAddress.address_line_two && (
                                                    <div>{selectedShippingAddress.address_line_two}</div>
                                                )}
                                                <div>
                                                    {[selectedShippingAddress.city, selectedShippingAddress.state]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                    {selectedShippingAddress.pin_code ? ` - ${selectedShippingAddress.pin_code}` : ""}
                                                </div>
                                                {selectedShippingAddress.country && (
                                                    <div>{selectedShippingAddress.country}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openAddressFormModal('new', 'shipping')}
                                                className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block"
                                            >
                                                New Address
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* GST Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GST Treatment:</span>
                                        <span className="text-gray-800">{getGstTreatmentLabel(customerDetail.gst_preference || customerDetail.gst_treatment)}</span>
                                        <IconButton size="small" onClick={openGstModal}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GSTIN:</span>
                                        <span className="text-gray-800 font-medium">{selectedGstDetail?.gstin || customerDetail.gstin || "—"}</span>
                                        <IconButton size="small" onClick={openGstPickerModal}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={openCustomerDrawer}
                                        className="text-[#C72030] text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        View Customer Details <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                        {!customerDetail && selectedCustomer && customerDetailLoading && (
                            <div className="py-4 flex justify-center">
                                <CircularProgress size={24} color="error" />
                            </div>
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
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
                                rows={4}
                                value={billingAddress}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) setBillingAddress(e.target.value);
                                }}
                                placeholder="Enter billing address (max 500 characters)"
                                maxLength={500}
                            />
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {(billingAddress?.length || 0)}/500
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Shipping Address
                            </label>
                            <textarea
                                className={`w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y ${sameAsBilling ? 'bg-gray-50' : ''}`}
                                rows={4}
                                value={shippingAddress}
                                onChange={(e) => {
                                    if (e.target.value.length <= 500) setShippingAddress(e.target.value);
                                }}
                                placeholder="Enter shipping address (max 500 characters)"
                                readOnly={sameAsBilling}
                                maxLength={500}
                            />
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {(shippingAddress?.length || 0)}/500
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Sales Order Details */}
                <Section title="Sales Order Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Sales Order Number
                            </label>
                            <TextField
                                fullWidth
                                value={salesOrderNumber}
                                disabled
                                sx={fieldStyles}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Reference #
                            </label>
                            <TextField
                                fullWidth
                                value={referenceNumber}
                                onChange={(e) => handleInputChange('reference_number', e.target.value)}
                                placeholder="Enter reference number"
                                sx={fieldStyles}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Sales Order Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={salesOrderDate}
                                onChange={(e) => handleInputChange('date', e.target.value)}
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
                                Expected Shipment Date<span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                type="date"
                                value={expectedShipmentDate}
                                onChange={(e) => handleInputChange('expected_shipment_date', e.target.value)}
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
                            <label className="block text-sm font-medium mb-2">
                                Payment Terms<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.paymentTerms}>
                                <Select
                                    value={selectedTerm}
                                    onChange={(e) => setSelectedTerm(e.target.value)}
                                    renderValue={(val) => {
                                        if (!val) {
                                            return <span className="text-gray-400">Select payment term</span>;
                                        }
                                        const found = filteredTerms.find(term => String(term.id) === String(val));
                                        return found ? found.name : val;
                                    }}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        Select payment term
                                    </MenuItem>
                                    {filteredTerms.map((term) => (
                                        <MenuItem key={term.id || term.name} value={term.id}>
                                            {term.name}
                                        </MenuItem>
                                    ))}
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
                                    onChange={(e) => handleInputChange('delivery_method', e.target.value)}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>Select a delivery method</MenuItem>
                                    <MenuItem value="drive">Drive</MenuItem>
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
                                    onChange={(e) => handleInputChange('salesperson', e.target.value)}
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
                                                    <ItemSearchInput
                                                        value={item.name}
                                                        itemOptions={itemOptions}
                                                        onSelect={(selected) => {
                                                            const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                            let taxFields: Partial<Item> = {};
                                                            if (selected.tax_preference === "non_taxable") {
                                                                taxFields = { item_tax_type: "non_taxable", tax_exemption_id: selected.tax_exemption_id };
                                                            } else if (selected.tax_preference === "taxable") {
                                                                taxFields = { item_tax_type: isSameState ? "tax_group" : "tax_rate", tax_group_id: isSameState ? selected.tax_group_id : selected.inter_state_tax_rate_id };
                                                            } else if (selected.tax_preference === "out_of_scope") {
                                                                taxFields = { item_tax_type: "out_of_scope" };
                                                            } else if (selected.tax_preference === "non_gst_supply") {
                                                                taxFields = { item_tax_type: "non_gst_supply" };
                                                            }
                                                            updateItemFields(index, { item_id: String(selected.id), name: selected.name, rate: selected.rate || 0, description: selected.description || '', ...taxFields });
                                                        }}
                                                        onType={(typed) => updateItemFields(index, { item_id: null, name: typed })}
                                                    />
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
                                            <td className="px-4 py-3">
                                                <FormControl size="small" sx={{ width: 200 }}>
                                                    <Select
                                                        value={["tax_group", "tax_rate"].includes(item.item_tax_type || '') ? item.tax_group_id : item.item_tax_type || ""}
                                                        displayEmpty
                                                        onChange={(e) => {
                                                            const value = String(e.target.value);
                                                            const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();

                                                            if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value)) {
                                                                updateItem(index, "item_tax_type", value);
                                                                updateItem(index, "tax_group_id", null);

                                                                if (value === "non_taxable") {
                                                                    setCurrentItemIndex(index);
                                                                    setExemptionModalOpen(true);
                                                                }
                                                            } else {
                                                                updateItem(index, "item_tax_type", isSameState ? "tax_group" : "tax_rate");
                                                                updateItem(index, "tax_group_id", Number(value));
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value="">Select Tax</MenuItem>
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
                                                        setDeleteTargetType('item');
                                                        setDeleteTargetIndex(index);
                                                        setDeleteConfirmOpen(true);
                                                    }}
                                                >
                                                    <Delete className="text-red-500" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Button
                            variant="outlined"
                            onClick={addItem}
                            className="w-full py-2 hover:bg-gray-50 border-dashed"
                            startIcon={<Add />}
                        >
                            Add New Line
                        </Button>
                    </div>
                </Section>

                {/* Sub Total, Adjustments, and pricing */}
                <Section title="Pricing Summary" icon={<ShoppingCart className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Adjustments details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">TDS/TCS Section</label>
                                <div className="flex gap-4 mb-3">
                                    <RadioGroup
                                        row
                                        value={taxType}
                                        onChange={(e) => setTaxType(e.target.value as 'TDS' | 'TCS')}
                                    >
                                        <FormControlLabel value="TDS" control={<Radio size="small" />} label="TDS" />
                                        <FormControlLabel value="TCS" control={<Radio size="small" />} label="TCS" />
                                    </RadioGroup>
                                </div>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedTax}
                                        onChange={(e) => setSelectedTax(e.target.value)}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">Select Tax Section</MenuItem>
                                        {taxOptions.map((tax) => (
                                            <MenuItem key={tax.id || tax.name} value={tax.name}>
                                                {tax.name} ({tax.percentage}%)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {/* Calculations */}
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Sub Total</span>
                                <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
                            </div>

                            {taxBreakdown.map((tax, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{tax.name} ({tax.rate}%)</span>
                                    <span className="font-semibold">₹{tax.amount.toFixed(2)}</span>
                                </div>
                            ))}

                            {taxAmount2 > 0 && (
                                <div className="flex justify-between items-center text-sm text-red-600">
                                    <span>(-) {taxType} Amount</span>
                                    <span className="font-semibold">-₹{taxAmount2.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="border rounded px-2 py-1 text-xs w-[120px]"
                                        value={adjustmentLabel}
                                        onChange={(e) => setAdjustmentLabel(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
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
                <Section title="Customer Notes" icon={<FileText className="w-5 h-5" />}>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
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
                </Section>

                {/* Terms & Conditions */}
                <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
                        rows={4}
                        value={termsAndConditions}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) setTermsAndConditions(e.target.value);
                        }}
                        placeholder="Enter terms and conditions (max 500 characters)"
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                        {(termsAndConditions?.length || 0)}/500
                    </div>
                </Section>

                {/* Attachments */}
                <Section title="Attach Files to Sales Order" icon={<AttachFile className="w-5 h-5" />}>
                    <div className="space-y-4">
                        {existingAttachments.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <Typography variant="body2" className="font-semibold text-gray-500">
                                    Existing Attachments
                                </Typography>
                                {existingAttachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <div className="flex items-center gap-2">
                                            <AttachFile fontSize="small" className="text-blue-500" />
                                            <a href={file.url} target="_blank" rel="noreferrer" className="text-sm hover:underline text-blue-600">
                                                {file.name || 'Attachment'}
                                            </a>
                                        </div>
                                        <IconButton size="small" onClick={() => {
                                            removeExistingAttachment(file.id);
                                        }}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}

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
                                            setDeleteTargetType('attachment');
                                            setDeleteTargetIndex(index);
                                            setDeleteConfirmOpen(true);
                                        }}>
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
                <Section title="Email Communications" icon={<FileText className="w-5 h-5" />}>
                    <div className="space-y-4">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendEmailToCustomer}
                                    onChange={(e) => setSendEmailToCustomer(e.target.checked)}
                                />
                            }
                            label="Send email to selected customer above"
                        />

                        {selectedCustomer && selectedCustomer.contact_persons && selectedCustomer.contact_persons.length > 0 && (
                            <div>
                                <Typography variant="body2" className="font-semibold mb-2">
                                    Select contact persons to email
                                </Typography>
                                <div className="flex flex-col gap-2">
                                    {selectedCustomer.contact_persons.map((person) => (
                                        <div key={person.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedContactPersons.includes(Number(person.id))}
                                                onChange={e => {
                                                    const pid = Number(person.id);
                                                    if (e.target.checked) {
                                                        setSelectedContactPersons([...selectedContactPersons, pid]);
                                                    } else {
                                                        setSelectedContactPersons(selectedContactPersons.filter(id => id !== pid));
                                                    }
                                                }}
                                                size="small"
                                            />
                                            <Chip
                                                label={`${person.firstName || person.salutation} ${person.lastName} (${person.email})`}
                                                variant={selectedContactPersons.includes(Number(person.id)) ? "filled" : "outlined"}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button
                    variant="text"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    sx={{
                        textTransform: 'none',
                        px: 4,
                        bgcolor: '#f8f1f1',
                        color: '#C72030',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: '#f1e8e8',
                            color: '#A01020'
                        }
                    }}
                >
                    Save as Draft
                </Button>
                <Button
                    variant="text"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    sx={{
                        bgcolor: '#f8f1f1',
                        color: '#C72030',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                            bgcolor: '#f1e8e8',
                            color: '#A01020'
                        },
                        textTransform: 'none'
                    }}
                >
                    {isSubmitting ? 'Updating...' : 'Update Sales Order'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/accounting/sales-order/${id}`)}
                    disabled={isSubmitting}
                    sx={{
                        textTransform: 'none',
                        px: 4,
                        borderColor: '#C72030',
                        color: '#C72030',
                        fontWeight: 600,
                        '&:hover': {
                            borderColor: '#A01020',
                            bgcolor: '#f8f1f1',
                            color: '#A01020'
                        }
                    }}
                >
                    Cancel
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure about deleting this item?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderColor: '#C72030',
                            color: '#C72030',
                            '&:hover': { borderColor: '#A01020', bgcolor: '#f8f1f1' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            bgcolor: '#C72030',
                            '&:hover': { bgcolor: '#A01020' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Address pickers and details modals */}
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
                    <Button onClick={() => setAddressListModalOpen(false)} variant="outlined" size="small" sx={modalSecondaryButtonSx}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addressFormModalOpen} onClose={() => setAddressFormModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="!text-base !font-semibold">Additional Address</DialogTitle>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <TextField label="Attention" fullWidth value={addressForm.attention} onChange={(e) => setAddressForm(prev => ({ ...prev, attention: e.target.value }))} className="md:col-span-2" />
                        <TextField label="Country/Region" select fullWidth value={addressForm.country} onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))} className="md:col-span-2">
                            {addressCountryOptions.map((opt) => (
                                <MenuItem key={opt.code} value={opt.name}>{opt.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Tax Information" select fullWidth value={selectedAddressTaxInfoId} onChange={(e) => setSelectedAddressTaxInfoId(String(e.target.value))} className="md:col-span-2">
                            <MenuItem value="">Select</MenuItem>
                            {gstDetails.map((gst) => (
                                <MenuItem key={gst.id} value={String(gst.id)}>{gst.gstin} - {gst.place_of_supply}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Address" placeholder="Street 1" fullWidth value={addressForm.address} onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))} className="md:col-span-2" />
                        <TextField placeholder="Street 2" fullWidth value={addressForm.address_line_two} onChange={(e) => setAddressForm(prev => ({ ...prev, address_line_two: e.target.value }))} className="md:col-span-2" />
                        <TextField label="City" fullWidth value={addressForm.city} onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))} className="md:col-span-2" />
                        <TextField label="State" select fullWidth value={addressForm.state} onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}>
                            <MenuItem value="">Select</MenuItem>
                            {states.map((state) => (<MenuItem key={state} value={state}>{state}</MenuItem>))}
                        </TextField>
                        <TextField label="Pin Code" fullWidth value={addressForm.pin_code} onChange={(e) => setAddressForm(prev => ({ ...prev, pin_code: e.target.value }))} />
                        <TextField label="Phone" fullWidth value={addressForm.telephone_number} onChange={(e) => setAddressForm(prev => ({ ...prev, telephone_number: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">+91</InputAdornment> }} />
                        <TextField label="Fax Number" fullWidth value={addressForm.fax_number} onChange={(e) => setAddressForm(prev => ({ ...prev, fax_number: e.target.value }))} />
                    </div>
                </DialogContent>
                <DialogActions className="!justify-start !px-6 !py-3">
                    <Button variant="contained" onClick={handleSaveAddressForm} sx={modalPrimaryButtonSx}>Save</Button>
                    <Button variant="outlined" onClick={() => setAddressFormModalOpen(false)} sx={modalSecondaryButtonSx}>Cancel</Button>
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
                    <Button variant="contained" onClick={handleUpdateGstConfig} sx={modalPrimaryButtonSx}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstManageModalOpen} onClose={() => setGstManageModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="!text-base !font-semibold !border-b !border-gray-200 !flex !items-center !justify-between !py-3">
                    <span>Manage Tax Informations</span>
                    <IconButton size="small" onClick={() => setGstManageModalOpen(false)}><Close fontSize="small" className="text-red-500" /></IconButton>
                </DialogTitle>
                <DialogContent className="!pt-4">
                    <div className="space-y-4">
                        <Button variant="contained" size="small" onClick={() => { setEditingGstDetailId(null); setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' }); setShowNewGstForm(true); }} sx={modalPrimaryButtonSx}>Add New Tax Information</Button>
                        {showNewGstForm && (
                            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <TextField
                                        label="GSTIN / UIN*"
                                        fullWidth
                                        value={newGstForm.gstin}
                                        onChange={(e) => setNewGstForm(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                                        error={!!newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)}
                                        helperText={
                                            newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)
                                                ? 'Invalid GSTIN format. e.g. 27AAAAA1234A1Z5'
                                                : ''
                                        }
                                        inputProps={{ maxLength: 15 }}
                                        size="small"
                                    />
                                </div>
                                <TextField label="Place of Supply*" select fullWidth value={newGstForm.place_of_supply} onChange={(e) => setNewGstForm(prev => ({ ...prev, place_of_supply: e.target.value }))} size="small">
                                    <MenuItem value="">Select</MenuItem>
                                    {states.map((state) => (<MenuItem key={state} value={state}>{state}</MenuItem>))}
                                </TextField>
                                <TextField label="Business Legal Name" fullWidth value={newGstForm.business_legal_name} onChange={(e) => setNewGstForm(prev => ({ ...prev, business_legal_name: e.target.value }))} size="small" />
                                <TextField label="Business Trade Name" fullWidth value={newGstForm.business_trade_name} onChange={(e) => setNewGstForm(prev => ({ ...prev, business_trade_name: e.target.value }))} size="small" />
                                <div className="md:col-span-3 flex items-center gap-2">
                                    <Button variant="contained" size="small" onClick={handleSaveAndSelectGst} sx={modalPrimaryButtonSx}>{editingGstDetailId ? 'Save' : 'Save and Select'}</Button>
                                    <Button variant="outlined" size="small" onClick={() => { setShowNewGstForm(false); setEditingGstDetailId(null); }} sx={modalSecondaryButtonSx}>Cancel</Button>
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
                    <Button variant="outlined" size="small" onClick={() => setGstManageModalOpen(false)} sx={modalSecondaryButtonSx}>Close</Button>
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
                        <button type="button" className="text-blue-600 text-sm flex items-center gap-1" onClick={() => { setGstPickerModalOpen(false); openGstManageModal(); }}>
                            <span>⚙</span> Manage Tax Informations
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={exemptionModalOpen} onClose={() => setExemptionModalOpen(false)} maxWidth="sm" fullWidth>
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

            {/* Customer Details Drawer */}
            {customerDrawerOpen && (
                <div className="fixed inset-0 z-[9999] flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
                        onClick={() => setCustomerDrawerOpen(false)}
                    />
                    <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
                            <span className="font-semibold text-gray-800 text-lg">Customer details</span>
                            <button
                                onClick={() => setCustomerDrawerOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        {customerDetailLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <CircularProgress size={36} />
                            </div>
                        ) : customerDetail ? (
                            <div className="flex-1 overflow-y-auto">
                                <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                        {(customerDetail.company_name || customerDetail.first_name || "?")[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 text-base flex items-center gap-1">
                                            {customerDetail.company_name ||
                                                [customerDetail.salutation, customerDetail.first_name, customerDetail.last_name]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                        </div>
                                        {customerDetail.company_name && (
                                            <div className="text-sm text-gray-500">{customerDetail.company_name}</div>
                                        )}
                                        {customerDetail.email && (
                                            <div className="text-xs text-blue-500">{customerDetail.email}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex border-b border-gray-200 px-4">
                                    {["Details", "Activity Log"].map((t, i) => (
                                        <button
                                            key={t}
                                            onClick={() => setDrawerActiveTab(i)}
                                            className={`py-2 px-3 text-sm font-medium border-b-2 transition-colors ${drawerActiveTab === i
                                                ? "border-[#C72030] text-[#C72030]"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {drawerActiveTab === 0 && (
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="border border-gray-200 rounded-lg p-3 text-center">
                                                <div className="text-orange-400 text-xl mb-1">⚠</div>
                                                <div className="text-xs text-gray-500">Outstanding Receivables</div>
                                                <div className="font-semibold text-gray-800 text-sm mt-1">
                                                    ₹{(customerDetail.outstanding_receivable_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-3 text-center">
                                                <div className="text-green-500 text-xl mb-1">●</div>
                                                <div className="text-xs text-gray-500">Unused Credits</div>
                                                <div className="font-semibold text-gray-800 text-sm mt-1">
                                                    ₹{(customerDetail.unused_credits_receivable_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setAddressExpanded(!addressExpanded)}
                                                    className="w-full bg-gray-50/50 px-4 py-2.5 flex items-center justify-between text-sm font-medium text-gray-700 border-b border-gray-100"
                                                >
                                                    <span>Addresses</span>
                                                    <span>{addressExpanded ? "▲" : "▼"}</span>
                                                </button>
                                                {addressExpanded && (
                                                    <div className="p-4 space-y-4 bg-white text-xs leading-relaxed text-gray-600">
                                                        <div>
                                                            <div className="font-semibold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">Billing Address</div>
                                                            {customerDetail.billing_address?.address ? (
                                                                <div>
                                                                    <div>{customerDetail.billing_address.address}</div>
                                                                    {customerDetail.billing_address.address_line_two && <div>{customerDetail.billing_address.address_line_two}</div>}
                                                                    <div>{[customerDetail.billing_address.city, customerDetail.billing_address.state].filter(Boolean).join(", ")}{customerDetail.billing_address.pin_code ? ` - ${customerDetail.billing_address.pin_code}` : ""}</div>
                                                                    {customerDetail.billing_address.country && <div>{customerDetail.billing_address.country}</div>}
                                                                </div>
                                                            ) : "—"}
                                                        </div>
                                                        <div className="border-t border-gray-100 pt-3">
                                                            <div className="font-semibold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">Shipping Address</div>
                                                            {customerDetail.shipping_address?.address ? (
                                                                <div>
                                                                    <div>{customerDetail.shipping_address.address}</div>
                                                                    {customerDetail.shipping_address.address_line_two && <div>{customerDetail.shipping_address.address_line_two}</div>}
                                                                    <div>{[customerDetail.shipping_address.city, customerDetail.shipping_address.state].filter(Boolean).join(", ")}{customerDetail.shipping_address.pin_code ? ` - ${customerDetail.shipping_address.pin_code}` : ""}</div>
                                                                    {customerDetail.shipping_address.country && <div>{customerDetail.shipping_address.country}</div>}
                                                                </div>
                                                            ) : "—"}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setContactPersonsExpanded(!contactPersonsExpanded)}
                                                    className="w-full bg-gray-50/50 px-4 py-2.5 flex items-center justify-between text-sm font-medium text-gray-700 border-b border-gray-100"
                                                >
                                                    <span>Contact Persons ({customerDetail.contact_persons?.length || 0})</span>
                                                    <span>{contactPersonsExpanded ? "▲" : "▼"}</span>
                                                </button>
                                                {contactPersonsExpanded && (
                                                    <div className="divide-y divide-gray-100 bg-white">
                                                        {customerDetail.contact_persons?.map((person) => (
                                                            <div key={person.id} className="p-4 text-xs text-gray-600 space-y-1">
                                                                <div className="font-semibold text-gray-800 text-sm">
                                                                    {[person.salutation, person.first_name, person.last_name].filter(Boolean).join(" ")}
                                                                </div>
                                                                {person.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {person.email}</div>}
                                                                {person.work_phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {person.work_phone}</div>}
                                                                {person.mobile && <div className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-gray-400" /> {person.mobile}</div>}
                                                            </div>
                                                        ))}
                                                        {(!customerDetail.contact_persons || customerDetail.contact_persons.length === 0) && (
                                                            <div className="p-4 text-xs text-gray-400 text-center">No contact persons added</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {drawerActiveTab === 1 && (
                                    <div className="p-4 text-center text-gray-400 text-sm">No activity logs recorded yet</div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSalesOrderPage;
