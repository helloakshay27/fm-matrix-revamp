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
    PersonAdd
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ChevronDown, ChevronUp, Mail, Phone, Smartphone, Star, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

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
    item_tax_type?: string
    tax_group_id?: number | null
    tax_exemption_id?: number | null
}

interface ExternalUser {
    name: string;
    email: string;
}

export const SalesOrderCreatePage: React.FC = () => {
    // Fetch item list from API
    const lock_account_id = localStorage.getItem("lock_account_id");
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
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

    const fetchCustomerDetail = async (customerId: string | number) => {
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
            // Pre-populate address fields (user can still edit them)
            const ba = data.billing_address;
            if (ba) {
                const formatted = [
                    ba.address,
                    ba.address_line_two,
                    ba.city,
                    ba.state,
                    ba.pin_code ? `- ${ba.pin_code}` : '',
                    ba.country
                ].filter(Boolean).join(', ');
                setBillingAddress(formatted);
            }
            const sa = data.shipping_address;
            if (sa) {
                const formatted = [
                    sa.address,
                    sa.address_line_two,
                    sa.city,
                    sa.state,
                    sa.pin_code ? `- ${sa.pin_code}` : '',
                    sa.country
                ].filter(Boolean).join(', ');
                setShippingAddress(formatted);
            }
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
                console.log('[SalesOrder] Org state from API:', state);
                setOrgState(state);
            } catch (err) {
                console.error('[SalesOrder] Failed to fetch org state:', err);
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
    const [itemOptions, setItemOptions] = useState<{ id: string; name: string; rate: number; description?: string; tax_preference?: string; tax_exemption_id?: number | null; tax_group_id?: number | null; inter_state_tax_rate_id?: any }[]>([]);
    const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);
    // const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    // Fetch payment terms from API and set as dropdown options
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

    useEffect(() => {
        fetchPaymentTerms();
    }, []);
    // Fetch items, salespersons, taxes
    useEffect(() => {
        // Set default terms and conditions
        // setTermsAndConditions('1. Use this to issue for all sales orders of all customers.\n2. Payment should be made within 30 days of the invoice date.\n3. Late payments may incur additional charges.');
    }, []);

    const handleSaveTerms = async () => {

        // Only add valid new rows
        const validEdit = editTerms.filter(row => row.name.trim());
        setEditTerms([]);
        setShowConfig(false);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        // Build payment_terms array for API
        const paymentTermsPayload = validEdit.map(term => ({
            id: term.id ?? null,
            name: term.name,
            no_of_days: term.days || 0
        }));
        console.log("Saving Payment Terms Payload:", paymentTermsPayload);
        const payload = {
            payment_terms: paymentTermsPayload,
            lock_account_id: lock_account_id
        };

        await axios.post(
            `https://${baseUrl}/payment_terms.json?lock_account_id=${lock_account_id}`,
            payload,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                // Optionally handle success
            })
            .catch(err => {
                alert('Failed to save payment terms');
            });

        // Refresh payment terms list after save
        fetchPaymentTerms();
    };

    // Remove (deactivate) payment term by id
    const handleRemovePaymentTerm = async (id, idx) => {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        try {
            await axios.patch(
                `https://${baseUrl}/payment_terms/${id}.json`,
                { payment_term: { id, active: false } },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (err) {
            alert('Failed to deactivate payment term');
        }
        setEditTerms(terms => terms.filter((_, i) => i !== idx));
        fetchPaymentTerms();
    };
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

        const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
        if (!hasValidItems) {
            newErrors.items = 'At least one valid item with quantity and rate is required';
            toast.error('At least one valid item is required');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    // Handle submit
    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            // Build FormData for sale order
            const formData = new FormData();

            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );

            formData.append(
                'sale_order[sub_total_amount]',
                String(subTotal)
            );

            formData.append(
                'sale_order[taxable_amount]',
                String(totalGSTAmount)
            );

            formData.append(
                'sale_order[lock_account_tax_amount]',
                String(taxAmount2)
            );
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
            formData.append('sale_order[charge_amount]', String(adjustment));
            formData.append('sale_order[charge_name]', adjustmentLabel);
            formData.append('sale_order[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
            formData.append('sale_order[tax_type]', taxType.toLowerCase());
            const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
            formData.append('sale_order[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));
            formData.append('sale_order[place_of_supply]', placeOfSupply); //new added
            // Sale order items
            items.forEach((item, idx) => {
                formData.append(`sale_order[sale_order_items_attributes][${idx}][lock_account_item_id]`, itemOptions.find(opt => opt.name === item.name)?.id || item.name);
                formData.append(`sale_order[sale_order_items_attributes][${idx}][rate]`, String(item.rate));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][description]`, item.description || '');
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_type]`, String(item.item_tax_type));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
                formData.append(`sale_order[sale_order_items_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
            });

            // Email contact persons
            selectedContactPersons.forEach((id, idx) => {
                formData.append(`sale_order[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
            });

            // Attachments
            attachments.forEach((file, idx) => {
                formData.append(`sale_order[attachments_attributes][${idx}][document]`, file);
                formData.append(`sale_order[attachments_attributes][${idx}][active]`, 'true');
            });

            await fetch(`https://${baseUrl}/sale_orders.json?lock_account_id=${lock_account_id}`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                    // Do NOT set Content-Type, browser will set it for FormData
                },
                body: formData
            });

            toast.success(`Sales order ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
            navigate('/accounting/sales-order');
        } catch (error) {
            console.error('Error submitting sales order:', error);
            toast.error('Failed to create sales order');
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



    console.log('Tax Options:', taxOptions);



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
                    onClick={() => navigate('/accounting/sales-order')}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium tracking-wide"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sales Orders List
                </button>
            </div>

            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">New Sales Order</h1>
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
                                                console.log('[SalesOrder] Customer place of supply:', supply, '| Org state:', orgState);
                                                setPlaceOfSupply(supply);
                                            } else {
                                                setCustomerDetail(null);
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
                                        <MenuItem value="">Select  Place of Supply</MenuItem>
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
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            Billing Address
                                        </div>
                                        {customerDetail.billing_address?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                <div className="font-medium">{customerDetail.billing_address.address}</div>
                                                {customerDetail.billing_address.address_line_two && (
                                                    <div>{customerDetail.billing_address.address_line_two}</div>
                                                )}
                                                <div>
                                                    {[customerDetail.billing_address.city, customerDetail.billing_address.state]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                    {customerDetail.billing_address.pin_code ? ` - ${customerDetail.billing_address.pin_code}` : ""}
                                                </div>
                                                {customerDetail.billing_address.country && (
                                                    <div>{customerDetail.billing_address.country}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400 italic">No billing address provided</div>
                                        )}
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            Shipping Address
                                        </div>
                                        {customerDetail.shipping_address?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                <div className="font-medium">{customerDetail.shipping_address.address}</div>
                                                {customerDetail.shipping_address.address_line_two && (
                                                    <div>{customerDetail.shipping_address.address_line_two}</div>
                                                )}
                                                <div>
                                                    {[customerDetail.shipping_address.city, customerDetail.shipping_address.state]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                    {customerDetail.shipping_address.pin_code ? ` - ${customerDetail.shipping_address.pin_code}` : ""}
                                                </div>
                                                {customerDetail.shipping_address.country && (
                                                    <div>{customerDetail.shipping_address.country}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                New Address
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* GST Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GST Treatment:</span>
                                        <span className="text-gray-800">{customerDetail.gst_treatment || "Registered Business - Regular"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GSTIN:</span>
                                        <span className="text-gray-800 font-medium">{customerDetail.gstin || "—"}</span>
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
                <Section title="Sales Order Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                Sales Order Date<span className="text-red-500">*</span>
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
                                Expected Shipment Date<span className="text-red-500">*</span>
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
                                Payment Terms<span className="text-red-500">*</span>
                            </label>

                            <FormControl fullWidth error={!!errors.paymentTerms}>
                                <Select
                                    value={selectedTerm}
                                    onChange={(e) => setSelectedTerm(e.target.value)}
                                    renderValue={(val) => {
                                        const found = filteredTerms.find(term => term.id === val);
                                        return found ? found.name : val;
                                    }}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="" disabled>
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
                                    ))}
                                
                                </Select>
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
                                    {/* <MenuItem value="courier">Courier</MenuItem> */}
                                    {/* <MenuItem value="hand-delivery">Hand Delivery</MenuItem> */}
                                    {/* <MenuItem value="pickup">Pickup</MenuItem> */}
                                    {/* <MenuItem value="shipping">Shipping</MenuItem> */}
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
                                                <FormControl fullWidth sx={{ minWidth: 250 }}>
                                                    <Select
                                                        value={item.name}
                                                        onChange={(e) => {
                                                            const selectedItem = itemOptions.find(opt => opt.name === e.target.value);
                                                            if (selectedItem) {
                                                                updateItem(index, 'name', selectedItem.name);
                                                                updateItem(index, 'rate', selectedItem.rate);
                                                                updateItem(index, 'description', selectedItem.description);
                                                                // TAX HANDLING
                                                                if (selectedItem.tax_preference === "non_taxable") {
                                                                    updateItem(index, "item_tax_type", "non_taxable");
                                                                    updateItem(index, "tax_exemption_id", selectedItem.tax_exemption_id);
                                                                }

                                                                if (selectedItem.tax_preference === "taxable") {
                                                                    const isSameState = orgState && placeOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                                    updateItem(index, "item_tax_type", isSameState ? "tax_group" : "tax_rate");
                                                                    updateItem(index, "tax_group_id", isSameState ? selectedItem.tax_group_id : selectedItem.inter_state_tax_rate_id);
                                                                }

                                                                if (selectedItem.tax_preference === "out_of_scope") {
                                                                    updateItem(index, "item_tax_type", "out_of_scope");
                                                                }

                                                                if (selectedItem.tax_preference === "non_gst_supply") {
                                                                    updateItem(index, "item_tax_type", "non_gst_supply");
                                                                }
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
                                                        setDeleteTargetType('item');
                                                        setDeleteTargetIndex(index);
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
                        placeholder="Enter the terms and conditions of your business to be displayed in your transaction (max 500 characters)"
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                        {(termsAndConditions?.length || 0)}/500
                    </div>
                </Section>

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

                        {/* Contact Persons Section */}
                        {selectedCustomer && selectedCustomer.contact_persons && selectedCustomer.contact_persons.length > 0 && (
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
                <Section title="Additional Custom Fields" icon={<FileText className="w-5 h-5" />}>
                    <Typography variant="body2" className="text-gray-600">
                        Add custom fields to your sales orders by going to Settings → Sales → Sales Orders → Field Customization
                    </Typography>
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
                    {isSubmitting ? 'Submitting...' : 'Save and Send'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/accounting/sales-order')}
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
            {/* Customer Details Drawer */}
            {customerDrawerOpen && (
                <div className="fixed inset-0 z-[9999] flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
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
                                                ["GST Treatment", customerDetail.gst_treatment || "—"],
                                                ["GSTIN", customerDetail.gstin || "—"],
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
                                                        {customerDetail.contact_persons.map((cp: any, idx: number) => (
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

                                        {/* Address Section */}
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
                                                            <div className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                                New Address
                                                            </div>
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
        </div>
    );
};
