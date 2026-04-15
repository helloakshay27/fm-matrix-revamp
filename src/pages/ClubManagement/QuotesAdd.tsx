import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// import { Button } from "@/components/ui/button";
import {
    Close,
    Add,
    Delete,
    CloudUpload,
    AttachFile,
    PersonAdd,
    EditOutlined
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ChevronDown, ChevronUp, Mail, Phone, Smartphone, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';

// Zoho-style item search input with dropdown
const ItemSearchInput: React.FC<{
    value: string;
    itemOptions: any[];
    onSelect: (item: any) => void;
    onType: (text: string) => void;
}> = ({ value, itemOptions, onSelect, onType }) => {
    const [inputVal, setInputVal] = React.useState(value);
    const [open, setOpen] = React.useState(false);
    const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 });
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync external value changes (e.g. re-preselect effect)
    React.useEffect(() => { setInputVal(value); }, [value]);

    const filtered = itemOptions.filter(o =>
        o?.name?.toLowerCase().includes(inputVal.toLowerCase())
    );

    const handleSelect = (opt: any) => {
        setInputVal(opt.name);
        setOpen(false);
        onSelect(opt);
    };

    const openDropdown = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 2,
                left: rect.left + window.scrollX,
                width: Math.max(rect.width, 280),
            });
        }
        setOpen(true);
    };

    // Close on outside click
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const dropdown = document.getElementById('item-search-dropdown');
            if (
                inputRef.current && !inputRef.current.contains(target) &&
                dropdown && !dropdown.contains(target)
            ) {
                setOpen(false);
                onType(inputVal);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [inputVal]);

    return (
        <div style={{ position: 'relative', minWidth: 250 }}>
            <input
                ref={inputRef}
                type="text"
                value={inputVal}
                placeholder="Type or select item"
                onFocus={openDropdown}
                onChange={(e) => {
                    setInputVal(e.target.value);
                    openDropdown();
                }}
                onBlur={() => onType(inputVal)}
                style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: 13,
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    outline: 'none',
                    background: '#fff',
                    boxSizing: 'border-box',
                    height: 34,
                }}
                onFocusCapture={(e) => (e.target.style.borderColor = '#C72030')}
                onBlurCapture={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
            {open && typeof document !== 'undefined' && createPortal(
                <div
                    id="item-search-dropdown"
                    style={{
                        position: 'absolute',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 9999,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        maxHeight: 240,
                        overflowY: 'auto',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div style={{ padding: '10px 14px', fontSize: 13, color: '#6b7280' }}>
                            No results found. Try a different keyword.
                        </div>
                    ) : (
                        filtered.map((opt) => (
                            <div
                                key={opt.id}
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    color: '#111827',
                                    borderBottom: '1px solid #f3f4f6',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                            >
                                {opt.name}
                            </div>
                        ))
                    )}
                    {/* {inputVal.trim() && !filtered.find(o => o.name.toLowerCase() === inputVal.trim().toLowerCase()) && (
                        <div
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onType(inputVal.trim());
                                setOpen(false);
                            }}
                            style={{
                                padding: '8px 14px',
                                fontSize: 13,
                                color: '#C72030',
                                cursor: 'pointer',
                                fontWeight: 500,
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            + Add New Item: "{inputVal.trim()}"
                        </div>
                    )} */}
                </div>,
                document.body
            )}
        </div>
    );
};

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
    billing_address?: {
        address: string;
        address_line_two?: string;
        city?: string;
        state?: string;
        pin_code?: string;
    };
    shipping_address?: {
        address: string;
        address_line_two?: string;
        city?: string;
        state?: string;
        pin_code?: string;
    };
    contact_persons?: ContactPerson[];
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
    id?: string | number;
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

export const QuotesAdd: React.FC = () => {
    // Subject field
    const [subject, setSubject] = useState('');
    // Fetch item list from API
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
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

    useEffect(() => {
        document.title = 'New Sales Order';
    }, []);

    // Customer data
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
    const [gstinDraft, setGstinDraft] = useState('');
    const [gstPermanentDraft, setGstPermanentDraft] = useState(false);
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
    const addressCountryOptions = [
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' }
    ];
    const [addressForm, setAddressForm] = useState<CustomerAddress>(emptyAddressForm);

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
        setGstinDraft(customerDetail?.gstin || '');
        setGstPermanentDraft(false);
        setGstModalOpen(true);
    };

    const openGstManageModal = () => {
        setShowNewGstForm(false);
        setEditingGstDetailId(null);
        setNewGstForm({
            gstin: '',
            place_of_supply: '',
            business_legal_name: '',
            business_trade_name: ''
        });
        setGstManageModalOpen(true);
    };

    const openGstPickerModal = () => {
        setGstPickerModalOpen(true);
    };

    const fetchCustomerDetail = async (customerId: string | number, preferredGstin?: string) => {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
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
                setPlaceOfSupply(defaultGst.place_of_supply || placeOfSupply);
                setCustomerDetail((prev) => (prev ? { ...prev, gstin: defaultGst.gstin } : prev));
            } else {
                setSelectedGstDetailId(null);
            }
            setSelectedBillingAddressId(nextBilling[0]?.id ?? null);
            setSelectedShippingAddressId(nextShipping[0]?.id ?? null);
            setBillingAddress(formatAddressText(nextBilling[0]));
            setShippingAddress(formatAddressText(nextShipping[0]));
        } catch (error) {
            console.error("Error fetching customer details:", error);
            toast.error("Failed to fetch customer details");
        } finally {
            setCustomerDetailLoading(false);
        }
    };

    const openCustomerDrawer = () => {
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }
        setCustomerDrawerOpen(true);
        fetchCustomerDetail(selectedCustomer.id);
    };

    // Contact persons selected for email
    const [selectedContactPersons, setSelectedContactPersons] = useState<string[]>([]);

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
     const lock_account_id = localStorage.getItem("lock_account_id");

    // Items
    const [items, setItems] = useState<Item[]>([
        {
            id: Date.now().toString(),
            name: '',
            item_id: null,
            description: '',
            quantity: 1 as number | '',
            rate: 0 as number | '',
            discount: 0 as number | '',
            discountType: 'percentage',
            tax: '',
            taxRate: 0,
            amount: 0,
            item_tax_type: "",
            tax_group_id: "",
            tax_exemption_id: ""
        }
    ]);

    const [placeOfSupply, setPlaceOfSupply] = useState("");
    const [orgState, setOrgState] = useState<string>("");
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
                console.log('[Quotes] Org state from API:', state);
                setOrgState(state);
            } catch (err) {
                console.error('[Quotes] Failed to fetch org state:', err);
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
            const matched = itemOptions.find(opt => opt.name === item.name);
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
    const [discountOnTotal, setDiscountOnTotal] = useState<number | ''>(0);
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

    // Dropdowns data
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number; description: string; tax_preference: string; tax_exemption_id: number | null; tax_group_id: number | null; inter_state_tax_rate_id?: any }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasQuoteApproval, setHasQuoteApproval] = useState(false);

    useEffect(() => {
        const fetchLockAccount = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`https://${baseUrl}/get_lock_account.json`, {
                    headers: { Authorization: token ? `Bearer ${token}` : undefined },
                });
                const hasApproval = Array.isArray(res.data?.approvals) &&
                    res.data.approvals.some((a: any) => a.approval_type === 'quote' && a.active);
                setHasQuoteApproval(hasApproval);
            } catch (e) {
                console.error('Failed to fetch lock account', e);
            }
        };
        fetchLockAccount();
    }, []);
    const [selectedProject, setSelectedProject] = useState<string>("");

    const projects = [
        { id: "1", name: "Recess Club Phase 1" },
        { id: "2", name: "Accounting Revamp" },
        { id: "3", name: "CRM Integration" },
    ];


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
        const lock_account_id = localStorage.getItem('lock_account_id');
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
        if (selectedBillingAddress) {
            setBillingAddress(formatAddressText(selectedBillingAddress));
        }
    }, [selectedBillingAddressId, billingAddressBook.length]);

    useEffect(() => {
        if (!sameAsBilling && selectedShippingAddress) {
            setShippingAddress(formatAddressText(selectedShippingAddress));
        }
    }, [selectedShippingAddressId, shippingAddressBook.length, sameAsBilling]);

    const handleSaveAddressForm = async () => {
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatePayload)
                }
            );

            if (!response.ok) {
                throw new Error(`Address save failed (${response.status})`);
            }

            setBook(prev => {
                if (addressFormMode === 'edit') {
                    return prev.map(item => (String(item.id) === String(targetId) ? payload : item));
                }
                return [...prev, payload];
            });
            setSelectedId(targetId);
            setAddressFormModalOpen(false);
            setAddressListModalOpen(false);
            toast.success("Address saved successfully");
            fetchCustomerDetail(selectedCustomer.id);
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save address");
        }
    };

    const handleUpdateGstConfig = () => {
        setCustomerDetail((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                gst_preference: gstTreatmentDraft,
                gst_treatment: gstTreatmentDraft,
                gstin: gstinDraft
            };
        });
        setGstModalOpen(false);
    };

    const handleGstinDropdownChange = (value: string | number) => {
        setSelectedGstDetailId(value);
        const selected = gstDetails.find(g => String(g.id) === String(value));
        if (!selected) return;
        setCustomerDetail((prev) => prev ? { ...prev, gstin: selected.gstin } : prev);
        if (selected.place_of_supply) {
            setPlaceOfSupply(selected.place_of_supply);
        }
        setGstPickerModalOpen(false);
    };

    const handleSaveAndSelectGst = async () => {
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }
        if (!newGstForm.gstin || !newGstForm.place_of_supply) {
            toast.error("GSTIN and Place of Supply are required");
            return;
        }
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        const normalizedGstin = String(newGstForm.gstin || '').toUpperCase().trim();
        if (!gstinRegex.test(normalizedGstin)) {
            toast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
            return;
        }

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

        const payload = {
            lock_account_customer: {
                id: selectedCustomer.id,
                gst_details_attributes: [gstAttribute]
            }
        };

        try {
            const response = await fetch(
                `https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`GST detail save failed (${response.status})`);
            }

            setShowNewGstForm(false);
            setEditingGstDetailId(null);
            setGstManageModalOpen(false);
            toast.success(editingGstDetailId ? "Tax information updated" : "Tax information saved");
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
        if (!selectedCustomer?.id) {
            toast.error("Please select a customer first");
            return;
        }
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const lock_account_id = localStorage.getItem("lock_account_id");

        const payload = {
            lock_account_customer: {
                id: selectedCustomer.id,
                gst_details_attributes: [
                    {
                        id: Number(gstId) || gstId,
                        _destroy: true
                    }
                ]
            }
        };

        try {
            const response = await fetch(
                `https://${baseUrl}/lock_account_customers/${selectedCustomer.id}.json?lock_account_id=${lock_account_id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                }
            );
            if (!response.ok) {
                throw new Error(`GST detail delete failed (${response.status})`);
            }
            toast.success("Tax information deleted");
            await fetchCustomerDetail(selectedCustomer.id);
        } catch (error) {
            console.error("Error deleting gst detail:", error);
            toast.error("Failed to delete tax information");
        }
    };

    // Calculate item amount
    const calculateItemAmount = (item: Item): number => {
        const baseAmount = Number(item.quantity || 0) * Number(item.rate || 0);
        const discountAmount = item.discountType === 'percentage'
            ? (baseAmount * Number(item.discount || 0)) / 100
            : Number(item.discount || 0);
        const afterDiscount = baseAmount - discountAmount;
        const taxAmount = (afterDiscount * Number(item.taxRate || 0)) / 100;
        return afterDiscount + taxAmount;
    };

    // Update multiple item fields at once (avoids double re-renders)
    const updateItemFields = (index: number, fields: Partial<Item>) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], ...fields };
            newItems[index].amount = calculateItemAmount(newItems[index]);
            return newItems;
        });
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
    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0);
    const totalDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * (Number(discountOnTotal) || 0)) / 100
        : (Number(discountOnTotal) || 0);
    const afterDiscount = subTotal - totalDiscount;
    const taxAmount = items.reduce((sum, item) => {
        const itemSubtotal = Number(item.quantity || 0) * Number(item.rate || 0);
        const itemDiscount = item.discountType === 'percentage'
            ? (itemSubtotal * Number(item.discount || 0)) / 100
            : Number(item.discount || 0);
        return sum + ((itemSubtotal - itemDiscount) * Number(item.taxRate || 0) / 100);
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
        // const newErrors: Record<string, string> = {};

        // if (!selectedCustomer) newErrors.customer = 'Customer is required';
        // if (!salesOrderDate) newErrors.salesOrderDate = 'Sales order date is required';
        // if (!expectedShipmentDate) newErrors.expectedShipmentDate = 'Expected shipment date is required';
        // if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

        // const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
        // if (!hasValidItems) newErrors.items = 'At least one valid item is required';

        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;


        const newErrors: Record<string, string> = {};

        if (!selectedCustomer) {
            // newErrors.customer = 'Customer is required';
            setErrors(newErrors);
            toast.error('Customer is required');
            return false;
        }
        if (!placeOfSupply) {
            setErrors(newErrors);
            toast.error('Place of Supply is required');
            return false;
        }

        if (!salesOrderDate) {
            // newErrors.salesOrderDate = 'Sales order date is required';
            setErrors(newErrors);
            toast.error('Quote date is required');
            return false;
        }

        // if (!expectedShipmentDate) {
        //     // newErrors.expectedShipmentDate = 'Expected shipment date is required';
        //     setErrors(newErrors);
        //     toast.error('Expiry is required');
        //     return false;
        // }

        if (expectedShipmentDate && salesOrderDate && new Date(expectedShipmentDate) < new Date(salesOrderDate)) {
            toast.error('Expiry Date cannot be earlier than Quote Date');
            return false;
        }

        // if (!selectedTerm) {
        //     // newErrors.paymentTerms = 'Payment terms is required';
        //     setErrors(newErrors);
        //     toast.error('Payment terms is required');
        //     return false;
        // }

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
            lock_account_customer_id: selectedCustomer?.id,
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
            total_amount: totalAmount2,
            discount_per: discountTypeOnTotal === 'percentage' ? discountOnTotal : undefined,
            discount_amount: discountTypeOnTotal === 'percentage' ? totalDiscount : discountOnTotal,
            charge_amount: adjustment,
            charge_name: adjustmentLabel,
            charge_type: adjustment >= 0 ? 'plus' : 'minus',
            place_of_supply: placeOfSupply,
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
                    description: item.description || '',
                    tax_type: item.item_tax_type,
                    tax_group_id: item.tax_group_id,
                    tax_exemption_id: item.tax_exemption_id
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

    // Handle submit
    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (isSubmitting) return;
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');

            // Build FormData for invoice
            const formData = new FormData();

            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );

            formData.append(
                'lock_account_quote[sub_total_amount]',
                String(subTotal)
            );

            formData.append(
                'lock_account_quote[taxable_amount]',
                String(totalGSTAmount)
            );

            formData.append(
                'lock_account_quote[lock_account_tax_amount]',
                String(taxAmount2)
            );
            formData.append('lock_account_quote[lock_account_customer_id]', selectedCustomer?.id || '');
            formData.append('lock_account_quote[reference_number]', referenceNumber);
            formData.append('lock_account_quote[date]', salesOrderDate);
            formData.append('lock_account_quote[expiry_date]', expectedShipmentDate);
            formData.append('lock_account_quote[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
            formData.append('lock_account_quote[customer_notes]', customerNotes);
            formData.append('lock_account_quote[terms_and_conditions]', termsAndConditions);
            formData.append('lock_account_quote[subject]', subject);
            // formData.append('lock_account_quote[status]', 'draft');
            formData.append(
                'lock_account_quote[status]',
                saveAsDraft ? 'draft' : 'sent'
            );
            formData.append('lock_account_quote[total_amount]', String(totalAmount2));
            if (discountTypeOnTotal === 'percentage') {
                formData.append('lock_account_quote[discount_per]', String(discountOnTotal));
                formData.append('lock_account_quote[discount_amount]', String(totalDiscount));
            } else {
                formData.append('lock_account_quote[discount_amount]', String(discountOnTotal));
            }
            formData.append('lock_account_quote[charge_amount]', String(adjustment));
            formData.append('lock_account_quote[charge_name]', adjustmentLabel);
            formData.append('lock_account_quote[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
            formData.append('lock_account_quote[tax_type]', taxType.toLowerCase());
            const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
            formData.append('lock_account_quote[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));
            formData.append('lock_account_quote[place_of_supply]', placeOfSupply); //new added

            // Address detail attributes for selected customer address/gst mapping
            const selectedOrFirstBillingId = selectedBillingAddressId ?? billingAddressBook[0]?.id ?? '';
            const selectedOrFirstShippingId = selectedShippingAddressId ?? shippingAddressBook[0]?.id ?? '';
            const selectedOrFirstGstDetailId = selectedGstDetailId ?? gstDetails[0]?.id ?? '';
            const gstPreferenceValue = customerDetail?.gst_preference || customerDetail?.gst_treatment || '';

            formData.append('lock_account_quote[address_detail_attributes][billing_address_id]', String(selectedOrFirstBillingId));
            formData.append('lock_account_quote[address_detail_attributes][shipping_address_id]', String(selectedOrFirstShippingId));
            formData.append('lock_account_quote[address_detail_attributes][gst_detail_id]', String(selectedOrFirstGstDetailId));
            formData.append('lock_account_quote[address_detail_attributes][gst_preference]', String(gstPreferenceValue));

            // Quote items
            items.forEach((item, idx) => {
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                if (resolvedId) {
                    formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][lock_account_item_id]`, String(resolvedId));
                } else {
                    formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][item_name]`, item.name);
                }
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][description]`, item.description || '');

                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][tax_type]`, String(item.item_tax_type));
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
                formData.append(`lock_account_quote[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
            });

            // Email contact persons
            selectedContactPersons.forEach((id, idx) => {
                formData.append(`lock_account_quote[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
            });

            // Attachments
            attachments.forEach((file, idx) => {
                formData.append(`lock_account_quote[attachments_attributes][${idx}][document]`, file);
                formData.append(`lock_account_quote[attachments_attributes][${idx}][active]`, 'true');
            });

            await axios.post(
                `https://${baseUrl}/lock_account_quotes.json?lock_account_id=${lock_account_id}`,
                formData,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined
                        // Do NOT set Content-Type manually for FormData
                    }
                }
            );

            toast.success(saveAsDraft ? 'Quote saved as draft successfully' : 'Quote created successfully');
            navigate('/accounting/quotes');
        } catch (error) {
            console.error('Error submitting quote:', error);
            toast.error('Failed to save quote');
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
    // Calculate TDS / TCS tax
    useEffect(() => {
        const selected = taxOptions.find(t => t.name === selectedTax);

        if (selected && typeof selected.percentage === "number") {
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
    const totalGSTAmount = taxBreakdown.reduce(
        (sum, tax) => sum + Number(tax.amount || 0),
        0
    );

    console.log("tax gst amount total:", totalGSTAmount)
    console.log("sub total :", subTotal)
    console.log("tax amount 2 tds :", taxAmount2)

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

            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Quote</h1>
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
                                            const customer = customers.find(c => c.id === customerId);
                                            setSelectedCustomer(customer || null);
                                            if (customerId) {
                                                fetchCustomerDetail(customerId);
                                                const supply = (customer as any)?.place_of_supply || (customer as any)?.billing_address?.state || '';
                                                console.log('[Quotes] Customer place of supply:', supply, '| Org state:', orgState);
                                                setPlaceOfSupply(supply);
                                            } else {
                                                setCustomerDetail(null);
                                            }
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">Select a customer</MenuItem>
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
                                        Place of Supply<span className="text-red-500">*</span>
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
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sameAsBilling}
                                        onChange={(e) => setSameAsBilling(e.target.checked)}
                                    />
                                }
                                label="Same as Billing Address"
                                className="mt-2"
                            /> */}
                        </div>
                    </div>
                </Section>


                {/* Sales Order Details */}
                <Section title="Quote Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Reference#
                            </label>
                            <TextField
                                fullWidth
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Enter Reference number"
                                sx={fieldStyles}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Quote Date<span className="text-red-500">*</span>
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
                                Expiry Date
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

                        <div>
                            <label className="block text-sm font-medium ">
                                Subject
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
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
                                                <ItemSearchInput
                                                    value={item.name}
                                                    itemOptions={itemOptions}
                                                    onSelect={(selected) => {
                                                        const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                        let taxFields: Partial<Item> = {};
                                                        if (selected.tax_preference === "non_taxable") {
                                                            taxFields = { item_tax_type: "non_taxable", tax_exemption_id: selected.tax_exemption_id };
                                                        } else if (selected.tax_preference === "taxable") {
                                                            taxFields = {
                                                                item_tax_type: isSameState ? "tax_group" : "tax_rate",
                                                                tax_group_id: isSameState ? selected.tax_group_id : selected.inter_state_tax_rate_id
                                                            };
                                                        } else if (selected.tax_preference === "out_of_scope") {
                                                            taxFields = { item_tax_type: "out_of_scope" };
                                                        } else if (selected.tax_preference === "non_gst_supply") {
                                                            taxFields = { item_tax_type: "non_gst_supply" };
                                                        }
                                                        updateItemFields(index, {
                                                            item_id: String(selected.id),
                                                            name: selected.name,
                                                            rate: selected.rate || 0,
                                                            description: selected.description || '',
                                                            ...taxFields
                                                        });
                                                    }}
                                                    onType={(typed) => {
                                                        updateItemFields(index, { item_id: null, name: typed });
                                                    }}
                                                />
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
                                                            onChange={(e) => updateItem(index, 'discountType', e.target.value as 'percentage' | 'amount')}
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
                                variant="outlined"
                                onClick={addItem}
                                sx={{ textTransform: 'none' }}
                            >
                                <span className="flex items-center gap-2"><Add /> Add New Row</span>
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
                                    <Select
                                        size="small"
                                        value={discountTypeOnTotal}
                                        onChange={e => setDiscountTypeOnTotal(e.target.value as 'percentage' | 'amount')}
                                        sx={{ width: 110 }}
                                    >
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="amount">Amount</MenuItem>
                                    </Select>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={discountOnTotal}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
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
                                        inputProps={{ min: 0, step: 0.01 }}
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
                                        onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                                        inputProps={{ step: 0.01 }}
                                        sx={{ width: 100 }}
                                    />
                                </div>
                            </div>

                            <Divider sx={{ my: 2 }} />

                            <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                <span className="font-bold text-base">Total ( ₹ )</span>
                                <span className="font-bold text-primary text-2xl">
                                    {/* ₹{totalAmount.toFixed(2)} */}
                                    ₹{totalAmount2.toFixed(2)}
                                </span>
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
                        placeholder="Enter the terms and conditions of your business to be displayed in your transaction (max 500 characters)"
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                        {(termsAndConditions?.length || 0)}/500
                    </div>
                </Section>

                {/* Attachments */}
                <Section title="Attach Files" icon={<AttachFile className="w-5 h-5" />}>
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

                        {/* Contact Persons Section */}
                        {selectedCustomer && (selectedCustomer.contact_persons || selectedCustomer.contactPersons) && (
                            <div>
                                <Typography variant="body2" className="font-semibold mb-2">
                                    Select contact persons to email
                                </Typography>
                                <div className="flex flex-col gap-2">
                                    {((selectedCustomer.contact_persons || selectedCustomer.contactPersons) as any[]).map((person) => (
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
                                                label={`${person.first_name || person.firstName} ${person.last_name || person.lastName} (${person.email})`}
                                                variant={selectedContactPersons.includes(person.id) ? "filled" : "outlined"}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* External Users Section */}
                        <div>
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
                <Section title="Additional Fields" icon={<FileText className="w-5 h-5" />}>
                    <Typography variant="body2" className="text-gray-600">
                        Start adding custom fields for your quotes by going to Settings → Sales → Quotes.
                    </Typography>
                </Section>
            </div>

            <div className="flex gap-3 mt-10 mb-10 justify-center pb-5">
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
                {!hasQuoteApproval && (
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
                        {isSubmitting ? 'Submitting...' : 'Save and Send'}
                    </Button>
                )}

                <Button
                    variant="outlined"
                    onClick={() => navigate('/accounting/quotes/list')}
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

            {/* Customer Details Drawer */}
            {customerDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/20"
                        onClick={() => setCustomerDrawerOpen(false)}
                    />
                    <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
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
                                {/* Customer Name + Avatar */}
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
                                            <span className="text-blue-500 cursor-pointer text-sm">↗</span>
                                        </div>
                                        {customerDetail.company_name && (
                                            <div className="text-sm text-gray-500">{customerDetail.company_name}</div>
                                        )}
                                        {customerDetail.email && (
                                            <div className="text-xs text-blue-500">{customerDetail.email}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Tabs */}
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
                                        {/* Outstanding & Credits */}
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

                                        {/* Contact Details */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="font-semibold text-gray-700 mb-3 text-sm">Contact Details</div>
                                            {[
                                                ["Customer Type", customerDetail.customer_type || "—"],
                                                ["Currency", customerDetail.currency || "INR"],
                                                ["Payment Terms", customerDetail.payment_terms || "—"],
                                                ["Portal Status", customerDetail.portal_status || "—"],
                                                ["Customer Language", customerDetail.customer_language || "English"],
                                                ["GST Treatment", getGstTreatmentLabel(customerDetail.gst_preference || customerDetail.gst_treatment)],
                                                ["GSTIN", selectedGstDetail?.gstin || customerDetail.gstin || "—"],
                                                ["PAN", customerDetail.pan || "—"],
                                                ["Place of Supply", customerDetail.place_of_supply || "Yet to be updated"],
                                                ["Tax Preference", customerDetail.tax_preference || "—"],
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0">
                                                    <span className="text-xs text-[#C72030] w-36 shrink-0">{label}</span>
                                                    <span className="text-xs text-gray-700 text-right">{value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Contact Persons */}
                                        {customerDetail.contact_persons && customerDetail.contact_persons.length > 0 && (
                                            <div className="border border-gray-200 rounded-lg">
                                                <div
                                                    className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => setContactPersonsExpanded(!contactPersonsExpanded)}
                                                >
                                                    <span className="font-semibold text-gray-700 text-sm">
                                                        Contact Persons
                                                        <span className="ml-2 bg-gray-200 text-gray-600 text-xs rounded-full px-1.5 py-0.5">
                                                            {customerDetail.contact_persons.length}
                                                        </span>
                                                    </span>
                                                    {contactPersonsExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </div>
                                                {contactPersonsExpanded && (
                                                    <div className="divide-y divide-gray-100">
                                                        {customerDetail.contact_persons.map((cp, idx) => (
                                                            <div key={cp.id || idx} className="px-4 py-4 flex items-start gap-3">
                                                                <div className="relative mt-1">
                                                                    <div className="w-8 h-8 rounded-full bg-[#EAEEF6] flex items-center justify-center text-[#7C8DAC] font-semibold text-sm shrink-0">
                                                                        {(cp.first_name || "?")[0].toUpperCase()}
                                                                    </div>
                                                                    {idx === 0 && (
                                                                        <div className="absolute -bottom-1 -right-1 w-[14px] h-[14px] bg-[#42C867] rounded-full border-[1.5px] border-white flex justify-center items-center">
                                                                            <Star className="w-[8px] h-[8px] text-white fill-current" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                                                        {[cp.salutation, cp.first_name, cp.last_name].filter(Boolean).join(" ")}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        {cp.email && (
                                                                            <div className="text-[13px] text-gray-500 flex items-center gap-2">
                                                                                <Mail className="w-3.5 h-3.5 text-gray-400" /> {cp.email}
                                                                            </div>
                                                                        )}
                                                                        {cp.work_phone && (
                                                                            <div className="text-[13px] text-gray-500 flex items-center gap-2">
                                                                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {cp.work_phone}
                                                                            </div>
                                                                        )}
                                                                        {!cp.work_phone && cp.phone && (
                                                                            <div className="text-[13px] text-gray-500 flex items-center gap-2">
                                                                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {cp.phone}
                                                                            </div>
                                                                        )}
                                                                        {cp.mobile && (
                                                                            <div className="text-[13px] text-gray-500 flex items-center gap-2">
                                                                                <Smartphone className="w-3.5 h-3.5 text-gray-400" /> {cp.mobile}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Address */}
                                        <div className="border border-gray-200 rounded-lg">
                                            <div
                                                className="px-4 py-3 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => setAddressExpanded(!addressExpanded)}
                                            >
                                                <span className="font-semibold text-gray-700 text-sm">Address</span>
                                                {addressExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            {addressExpanded && (
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                                            <span>📋</span> Billing Address
                                                        </div>
                                                        {customerDetail.billing_address?.address ? (
                                                            <div className="text-xs text-gray-700 leading-relaxed">
                                                                <div>{customerDetail.billing_address.address}</div>
                                                                {customerDetail.billing_address.address_line_two && (
                                                                    <div>{customerDetail.billing_address.address_line_two}</div>
                                                                )}
                                                                <div>
                                                                    {[customerDetail.billing_address.city, customerDetail.billing_address.state]
                                                                        .filter(Boolean)
                                                                        .join(", ")}
                                                                    {customerDetail.billing_address.pin_code
                                                                        ? " " + customerDetail.billing_address.pin_code
                                                                        : ""}
                                                                </div>
                                                                {customerDetail.billing_address.country && (
                                                                    <div>{customerDetail.billing_address.country}</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-400 italic">No billing address provided</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                                            <span>🚚</span> Shipping Address
                                                        </div>
                                                        {customerDetail.shipping_address?.address ? (
                                                            <div className="text-xs text-gray-700 leading-relaxed">
                                                                <div>{customerDetail.shipping_address.address}</div>
                                                                {customerDetail.shipping_address.address_line_two && (
                                                                    <div>{customerDetail.shipping_address.address_line_two}</div>
                                                                )}
                                                                <div>
                                                                    {[customerDetail.shipping_address.city, customerDetail.shipping_address.state]
                                                                        .filter(Boolean)
                                                                        .join(", ")}
                                                                    {customerDetail.shipping_address.pin_code
                                                                        ? " " + customerDetail.shipping_address.pin_code
                                                                        : ""}
                                                                </div>
                                                                {customerDetail.shipping_address.country && (
                                                                    <div>{customerDetail.shipping_address.country}</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-400 italic">No shipping address provided</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {drawerActiveTab === 1 && (
                                    <div className="p-10 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <div className="text-gray-500 text-sm">No activity logs found</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                No customer details available
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                                        {(addr.telephone_number || addr.fax_number) && (
                                            <div>{addr.telephone_number}{addr.fax_number ? ` Fax Number : ${addr.fax_number}` : ''}</div>
                                        )}
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
                <DialogTitle className="!text-base !font-semibold">
                    Additional Address
                </DialogTitle>
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
                            select
                            fullWidth
                            value={addressForm.country}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                            className="md:col-span-2"
                        >
                            {addressCountryOptions.map((opt) => (
                                <MenuItem key={opt.code} value={opt.name}>{opt.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Tax Information"
                            select
                            fullWidth
                            value={selectedAddressTaxInfoId}
                            onChange={(e) => setSelectedAddressTaxInfoId(String(e.target.value))}
                            className="md:col-span-2"
                        >
                            <MenuItem value="">Select</MenuItem>
                            {gstDetails.map((gst) => (
                                <MenuItem key={gst.id} value={String(gst.id)}>
                                    {gst.gstin} - {gst.place_of_supply}
                                </MenuItem>
                            ))}
                        </TextField>
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
                            select
                            fullWidth
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {states.map((state) => (
                                <MenuItem key={state} value={state}>{state}</MenuItem>
                            ))}
                        </TextField>
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
                <DialogActions className="!justify-start !px-6 !py-3">
                    <Button variant="contained" onClick={handleSaveAddressForm} sx={modalPrimaryButtonSx}>Save</Button>
                    <Button variant="outlined" onClick={() => setAddressFormModalOpen(false)} sx={modalSecondaryButtonSx}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstModalOpen} onClose={() => setGstModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle className="!text-base !font-medium !pb-2">Configure Tax Preferences</DialogTitle>
                <DialogContent className="!pt-2">
                    <div className="space-y-3">
                        <TextField
                            label="GST Treatment"
                            select
                            fullWidth
                            value={gstTreatmentDraft}
                            onChange={(e) => setGstTreatmentDraft(e.target.value)}
                            size="small"
                        >
                            {gstTreatmentOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions className="!justify-start !px-6 !pb-4">
                    <Button variant="contained" onClick={handleUpdateGstConfig} sx={modalPrimaryButtonSx}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstManageModalOpen} onClose={() => setGstManageModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="!text-base !font-semibold !border-b !border-gray-200 !flex !items-center !justify-between !py-3">
                    <span>Manage Tax Informations</span>
                    <IconButton size="small" onClick={() => setGstManageModalOpen(false)}>
                        <Close fontSize="small" className="text-red-500" />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="!pt-4">
                    <div className="space-y-4">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setEditingGstDetailId(null);
                                setNewGstForm({
                                    gstin: '',
                                    place_of_supply: '',
                                    business_legal_name: '',
                                    business_trade_name: ''
                                });
                                setShowNewGstForm(true);
                            }}
                            sx={modalPrimaryButtonSx}
                        >
                            Add New Tax Information
                        </Button>
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
                                <TextField
                                    label="Place of Supply*"
                                    select
                                    fullWidth
                                    value={newGstForm.place_of_supply}
                                    onChange={(e) => setNewGstForm(prev => ({ ...prev, place_of_supply: e.target.value }))}
                                    size="small"
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    {states.map((state) => (
                                        <MenuItem key={state} value={state}>{state}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Business Legal Name"
                                    fullWidth
                                    value={newGstForm.business_legal_name}
                                    onChange={(e) => setNewGstForm(prev => ({ ...prev, business_legal_name: e.target.value }))}
                                    size="small"
                                />
                                <TextField
                                    label="Business Trade Name"
                                    fullWidth
                                    value={newGstForm.business_trade_name}
                                    onChange={(e) => setNewGstForm(prev => ({ ...prev, business_trade_name: e.target.value }))}
                                    size="small"
                                />
                                <div className="md:col-span-3 flex items-center gap-2">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSaveAndSelectGst}
                                        sx={modalPrimaryButtonSx}
                                    >
                                        {editingGstDetailId ? 'Save' : 'Save and Select'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setShowNewGstForm(false);
                                            setEditingGstDetailId(null);
                                        }}
                                        sx={modalSecondaryButtonSx}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <div className="grid grid-cols-5 bg-gray-50 text-xs font-semibold text-gray-500 px-4 py-2">
                                <div>GSTIN</div>
                                <div>PLACE OF SUPPLY</div>
                                <div>BUSINESS LEGAL NAME</div>
                                <div>BUSINESS TRADE NAME</div>
                                <div></div>
                            </div>
                            <div className="max-h-[280px] overflow-y-auto">
                                {gstDetails.map((gst) => (
                                    <div
                                        key={gst.id}
                                        className={`grid grid-cols-5 px-4 py-2 text-sm border-t border-gray-100 cursor-pointer ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''}`}
                                        onClick={() => handleGstinDropdownChange(gst.id)}
                                    >
                                        <div>
                                            {gst.gstin}
                                            {gst.primary && <div className="text-green-600 italic">(Primary Tax Information)</div>}
                                        </div>
                                        <div>{gst.place_of_supply || '—'}</div>
                                        <div>{gst.business_legal_name || '—'}</div>
                                        <div>{gst.business_trade_name || '—'}</div>
                                        <div className="flex items-center gap-2 justify-end">
                                            {!gst.primary && (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditGstDetail(gst);
                                                        }}
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteGstDetail(gst.id);
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
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
                            <button
                                key={gst.id}
                                type="button"
                                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''}`}
                                onClick={() => handleGstinDropdownChange(gst.id)}
                            >
                                {gst.gstin} - {gst.place_of_supply}[MH]
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            className="text-blue-600 text-sm flex items-center gap-1"
                            onClick={() => {
                                setGstPickerModalOpen(false);
                                openGstManageModal();
                            }}
                        >
                            <span>⚙</span>
                            Manage Tax Informations
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
                            displayEmpty
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
                            color: '#C72030',
                            borderColor: '#C72030',
                            '&:hover': {
                                borderColor: '#C72030',
                                backgroundColor: 'rgba(199, 32, 48, 0.04)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: '#C72030',
                            '&:hover': {
                                backgroundColor: '#A01926'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default QuotesAdd;
