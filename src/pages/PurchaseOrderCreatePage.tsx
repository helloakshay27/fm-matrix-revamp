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
    ChevronRight,
    Search,
    CheckCircle,
    EditOutlined
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getAddresses, getInventories } from '@/store/slices/materialPRSlice';
import ItemSearchInput from '@/components/ItemSearchInput';

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

interface Address {
    id: string;
    address: string;
    city: string;
    state: string;
    pin_code: string;
    default_address: boolean;
    [key: string]: any;
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
    account_id: number;
    // fields used by the tax dropdown (tax groups/exemptions)
    item_tax_type?: string;
    tax_group_id?: number | null;
    tax_exemption_id?: number | null;
}

interface BulkItem {
    id: string;
    inventory_name: string;
    rate: number;
    sku?: string;
}

interface BulkSelectedItem extends BulkItem {
    quantity: number;
}

interface BulkItemModalProps {
    open: boolean;
    onClose: () => void;
    itemOptions: BulkItem[];
    onAddItems: (items: BulkSelectedItem[]) => void;
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

    // Vendor Addresses from API
    const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
    const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [addressError, setAddressError] = useState('');

    // Delivery Address
    const [deliveryAddressType, setDeliveryAddressType] = useState<'organization' | 'customer'>('organization');

    // Organization flow
    const [organizationAddress, setOrganizationAddress] = useState<any>(null);
    const [loadingOrgAddress, setLoadingOrgAddress] = useState(false);
    const [orgAddressError, setOrgAddressError] = useState('');

    // Customer flow
    const [deliveryCustomers, setDeliveryCustomers] = useState<any[]>([]);
    const [selectedDeliveryCustomer, setSelectedDeliveryCustomer] = useState<any>(null);
    const [deliveryCustomerAddress, setDeliveryCustomerAddress] = useState<any>(null);
    const [loadingCustomerAddress, setLoadingCustomerAddress] = useState(false);
    const [customerAddressError, setCustomerAddressError] = useState('');

    // Purchase Order Details
    const [referenceNumber, setReferenceNumber] = useState('');
    const [purchaseOrderDate, setPurchaseOrderDate] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
    const [loadingPONumber, setLoadingPONumber] = useState(false);
    const [reverseCharge, setReverseCharge] = useState(false);

    // Source and destination of supply for tax calculations
    const [sourceOfSupply, setSourceOfSupply] = useState("");
    const [destinationOfSupply, setDestinationOfSupply] = useState("");
    const [orgState, setOrgState] = useState<string>("");

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
            account_id: 0,
            item_tax_type: '',
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
    const [vendorDetails, setVendorDetails] = useState<any>(null);
    const [vendorDetail, setVendorDetail] = useState<any>(null);
    const [vendorDetailLoading, setVendorDetailLoading] = useState(false);
    const [billingAddressBook, setBillingAddressBook] = useState<any[]>([]);
    const [shippingAddressBook, setShippingAddressBook] = useState<any[]>([]);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<any>(null);
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<any>(null);
    const [addressListModalOpen, setAddressListModalOpen] = useState(false);
    const [addressFormModalOpen, setAddressFormModalOpen] = useState(false);
    const [activeAddressType, setActiveAddressType] = useState<'billing' | 'shipping'>('billing');
    const [addressFormMode, setAddressFormMode] = useState<'new' | 'edit'>('new');
    const [editingAddressId, setEditingAddressId] = useState<any>(null);
    const [addressForm, setAddressForm] = useState<any>({
        id: '', attention: '', address: '', address_line_two: '',
        country: 'India', state: '', city: '', pin_code: '',
        telephone_number: '', fax_number: '', mobile: ''
    });
    const [gstDetails, setGstDetails] = useState<any[]>([]);
    const [selectedGstDetailId, setSelectedGstDetailId] = useState<any>(null);
    const [gstPickerModalOpen, setGstPickerModalOpen] = useState(false);
    const [gstManageModalOpen, setGstManageModalOpen] = useState(false);
    const [gstModalOpen, setGstModalOpen] = useState(false);
    const [gstTreatmentDraft, setGstTreatmentDraft] = useState('');
    const [showNewGstForm, setShowNewGstForm] = useState(false);
    const [editingGstDetailId, setEditingGstDetailId] = useState<any>(null);
    const [newGstForm, setNewGstForm] = useState({
        gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: ''
    });
    const [selectedAddressTaxInfoId, setSelectedAddressTaxInfoId] = useState('');

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
    const [itemOptions, setItemOptions] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [taxOptions, setTaxOptions] = useState<{ id: string; name: string; rate: number }[]>([]);

    // additional tax dropdown data (copied from QuotesAdd)
    const taxTypeOptions = [
        { value: 'non_taxable', label: 'Non-Taxable' },
        { value: 'out_of_scope', label: 'Out of Scope' },
        { value: 'non_gst_supply', label: 'Non-GST Supply' },
    ];
    const [taxGroups, setTaxGroups] = useState<any[]>([]);
    const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);

    const [taxRates, setTaxRates] = useState<any[]>([]);
    const [loadingTaxRates, setLoadingTaxRates] = useState(false);

    const [exemptionModalOpen, setExemptionModalOpen] = useState(false);
    const [selectedExemption, setSelectedExemption] = useState('');
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [customerExemptions, setCustomerExemptions] = useState<any[]>([]);
    const [loadingExemptions, setLoadingExemptions] = useState(false);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    useEffect(() => {
        const fetchPONumber = async () => {
            setLoadingPONumber(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lockAccountId = localStorage.getItem('lock_account_id') || '1';

                const response = await axios.get(
                    `https://${baseUrl}//pms/purchase_orders/get_po_number.json?lock_account_id=${lockAccountId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('PO Number API response:', response.data);

                const poNumber =
                    response.data?.po_number ||
                    response.data?.next_po_number ||
                    response.data?.purchase_order_number ||
                    response.data?.number ||
                    '';

                setPurchaseOrderNumber(poNumber);
            } catch (error) {
                console.error('Error fetching PO number:', error);
                toast.error('Failed to fetch PO number');
            } finally {
                setLoadingPONumber(false);
            }
        };

        fetchPONumber();
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
                        paymentTerms: '',
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
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lockAccountId = localStorage.getItem('lock_account_id') || '1';

            if (!baseUrl || !token) {
                console.error('Missing baseUrl or token');
                return;
            }

            setLoadingItems(true);
            try {
                const response = await axios.get(
                    `https://${baseUrl}/lock_account_items.json?lock_account_id=${lockAccountId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const raw = response.data?.data || response.data || [];
                const normalised = raw.map((item: any) => ({
                    id: item.id,
                    name: item.inventory_name || item.name || '',
                    inventory_name: item.inventory_name || item.name || '',
                    rate: Number(item.purchase_rate ?? item.rate ?? 0),
                    description: item.sale_description || item.description || '',
                    account: item.purchase_lock_account_ledger_id || '',
                    sku: item.sku || '',
                    tax_preference: item.tax_preference || '',
                    tax_exemption_id: item.tax_exemption_id || null,
                    tax_group_id: item.intra_state_tax_rate_id || item.tax_group_id || null,
                }));
                setItemOptions(normalised);
            } catch (error) {
                console.error('Error fetching lock_account_items:', error);
                toast.error('Failed to load items');
                setItemOptions([]);
            } finally {
                setLoadingItems(false);
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
        fetchItems();
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

    // Fetch tax rates (IGST) for inter-state transactions (matching BillsAdd)
    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');

        setLoadingTaxRates(true);

        axios
            .get(`https://${baseUrl}/lock_accounts/${lock_account_id}/tax_rates.json?q[rate_type_eq]=IGST`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json"
                }
            })
            .then((res) => setTaxRates(res.data || []))
            .catch((error) => console.error("Error fetching tax rates:", error))
            .finally(() => setLoadingTaxRates(false));
    }, []);

    // Fetch organisation state on mount (matching BillsAdd)
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
                setOrgState(state);
            } catch {
                // silently fail
            }
        };
        fetchOrgState();
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

    // Fetch account ledgers and groups
    useEffect(() => {
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

        fetchAccountLedgers();
        fetchAccountGroups();
    }, [baseUrl, token]);

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

    // Fetch customers for delivery address section
    useEffect(() => {
        const lockAccountId = localStorage.getItem('lock_account_id');
        const fetchDeliveryCustomers = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=${lockAccountId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDeliveryCustomers(response.data || []);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchDeliveryCustomers();
    }, [baseUrl, token]);

    // Fetch organization address (auto-fetch when org delivery type is selected)
    useEffect(() => {
        if (deliveryAddressType !== 'organization') return;

        const fetchOrgAddress = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            // Get org_id from localStorage - try multiple possible keys
            const orgId =
                localStorage.getItem('org_id') ||
                localStorage.getItem('organisation_id') ||
                localStorage.getItem('organization_id') ||
                (() => {
                    try {
                        return JSON.parse(localStorage.getItem('user') || '{}')?.organization_id;
                    } catch {
                        return null;
                    }
                })();

            const lockAccountId = localStorage.getItem('lock_account_id');

            if (!baseUrl || !token || !orgId) {
                setOrgAddressError('Organization not found in session.');
                return;
            }

            setLoadingOrgAddress(true);
            setOrgAddressError('');
            setOrganizationAddress(null);

            try {
                const res = await axios.get(
                    `https://${baseUrl}/organizations/${orgId}.json?lock_account_id=${lockAccountId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const org = res.data?.organization || res.data;
                const addr = org?.address || null;

                if (addr) {
                    setOrganizationAddress(addr);
                } else {
                    setOrgAddressError('No address found for this organization.');
                }
            } catch (err) {
                console.error('Error fetching organization address:', err);
                setOrgAddressError('Failed to fetch organization address.');
            } finally {
                setLoadingOrgAddress(false);
            }
        };

        fetchOrgAddress();
    }, [deliveryAddressType]);

    // Fetch customer address when customer is selected
    useEffect(() => {
        if (!selectedDeliveryCustomer?.id) {
            setDeliveryCustomerAddress(null);
            setCustomerAddressError('');
            return;
        }

        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lockAccountId = localStorage.getItem('lock_account_id');

        const fetchCustAddress = async () => {
            setLoadingCustomerAddress(true);
            setCustomerAddressError('');

            try {
                const res = await axios.get(
                    `https://${baseUrl}/lock_account_customers/${selectedDeliveryCustomer.id}.json?lock_account_id=${lockAccountId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Try to extract address from response
                let addressData = null;

                // Check for default_shipping_address first 
                if (res.data?.default_shipping_address) {
                    addressData = res.data.default_shipping_address;
                } else if (res.data?.shipping_address) {
                    addressData = res.data.shipping_address;
                } else if (res.data?.billing_address) {
                    addressData = res.data.billing_address;
                } else if (res.data?.address) {
                    addressData = res.data.address;
                }

                // Extract individual address fields with fallbacks
                if (addressData || res.data) {
                    const sourceData = addressData || res.data;
                    const addressInfo = {
                        attention: sourceData.attention || '',
                        address: sourceData.address || sourceData.street || '',
                        address_line_two: sourceData.address_line_two || sourceData.street2 || '',
                        city: sourceData.city || '',
                        state: sourceData.state || sourceData.province || '',
                        pin_code: sourceData.pin_code || sourceData.postal_code || sourceData.zip || '',
                        country: sourceData.country || '',
                        id: sourceData.id || selectedDeliveryCustomer.id
                    };
                    setDeliveryCustomerAddress(addressInfo);
                } else {
                    setCustomerAddressError('No address found for this customer.');
                    setDeliveryCustomerAddress(null);
                }
            } catch (error) {
                console.error('Error fetching customer address:', error);
                setCustomerAddressError('Failed to load customer address.');
                setDeliveryCustomerAddress(null);
            } finally {
                setLoadingCustomerAddress(false);
            }
        };

        fetchCustAddress();
    }, [selectedDeliveryCustomer?.id]);

    // Fetch vendor addresses when vendor is selected
    const fetchVendorAddresses = async (vendorId: string) => {
        try {
            setLoadingAddresses(true);
            setAddressError('');
            const token = localStorage.getItem('token') || '';
            const response = await axios.get(
                `https://${baseUrl}/pms/suppliers/addresses.json?id=${vendorId}&access_token=${token}`
            );

            const data = response.data;
            console.log('Vendor Addresses API Response:', data); // DEBUG LOG

            const billingAddrs = data.billing_address || [];
            const shippingAddrs = data.shipping_address || [];

            console.log('Billing Addresses:', billingAddrs, 'Shipping Addresses:', shippingAddrs); // DEBUG LOG

            setBillingAddresses(billingAddrs);
            setShippingAddresses(shippingAddrs);

            // Auto-select default address
            const defaultBillingAddr = billingAddrs.find(addr => addr.default_address === true);
            const defaultShippingAddr = shippingAddrs.find(addr => addr.default_address === true);

            console.log('Default Billing:', defaultBillingAddr, 'Default Shipping:', defaultShippingAddr); // DEBUG LOG

            const selectedBillingId = defaultBillingAddr?.id || billingAddrs[0]?.id || '';
            const selectedShippingId = defaultShippingAddr?.id || shippingAddrs[0]?.id || '';

            console.log('Setting Addresses - Billing ID:', selectedBillingId, 'Shipping ID:', selectedShippingId); // DEBUG LOG

            setBillingAddress(selectedBillingId);
            setShippingAddress(selectedShippingId);

            // Set sourceOfSupply from the default billing address state
            if (defaultBillingAddr?.state) {
                setSourceOfSupply(defaultBillingAddr.state);
            } else if (billingAddrs[0]?.state) {
                setSourceOfSupply(billingAddrs[0].state);
            }
        } catch (error) {
            console.error('Error fetching vendor addresses:', error);
            setAddressError('Failed to load addresses');
            setBillingAddresses([]);
            setShippingAddresses([]);
            setBillingAddress('');
            setShippingAddress('');
        } finally {
            setLoadingAddresses(false);
        }
    };
    // Fetch vendor details for drawer
    const handleVendorChange = async (vendorId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `https://${baseUrl}/pms/suppliers/${vendorId}.json?access_token=${token}`
            );
            setVendorDetails(res.data?.supplier || res.data);
            setVendorDrawerOpen(true);
        } catch (err) {
            console.error('Error fetching vendor details:', err);
            toast.error('Failed to load vendor details');
        }
    };

    // Handle delivery type change (resets all delivery-related state)
    const handleDeliveryTypeChange = (type: 'organization' | 'customer') => {
        setDeliveryAddressType(type);
        // Clear organization address state
        setOrganizationAddress(null);
        setOrgAddressError('');
        // Clear customer address state
        setSelectedDeliveryCustomer(null);
        setDeliveryCustomerAddress(null);
        setCustomerAddressError('');
    };

    // When vendor is selected

    // When vendor is selected
    useEffect(() => {
        if (selectedVendor?.id) {
            // Fetch vendor addresses which will auto-select the default addresses by ID
            fetchVendorAddresses(selectedVendor.id);
            // Don't auto-set payment terms - let user manually select from dropdown
            // This ensures we use the proper ID from the dropdown options
            setPaymentTerms('');
        } else {
            setBillingAddresses([]);
            setShippingAddresses([]);
            setBillingAddress('');
            setShippingAddress('');
            setAddressError('');
            setSourceOfSupply('');
            setPaymentTerms('');
        }
    }, [selectedVendor?.id]);

    // Same as billing address
    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [sameAsBilling, billingAddress]);

    // Sync destinationOfSupply with orgState
    useEffect(() => {
        if (orgState) {
            setDestinationOfSupply(orgState);
        }
    }, [orgState]);

    // Update sourceOfSupply when billing address changes
    useEffect(() => {
        if (billingAddress && billingAddresses.length > 0) {
            const selectedAddr = billingAddresses.find(addr => addr.id === billingAddress);
            if (selectedAddr?.state) {
                setSourceOfSupply(selectedAddr.state);
            }
        }
    }, [billingAddress, billingAddresses]);

    // Calculate item amount (matching BillsAdd logic with defensive Number() conversions)
    const calculateItemAmount = (item: Item): number => {
        const baseAmount = Number(item.quantity || 0) * Number(item.rate || 0);
        const discountAmount = item.discountType === 'percentage'
            ? (baseAmount * Number(item.discount || 0)) / 100
            : Number(item.discount || 0);
        const afterDiscount = baseAmount - discountAmount;
        const taxAmount = (afterDiscount * Number(item.taxRate || 0)) / 100;
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

    // Update multiple item fields at once (avoids double re-renders, matching BillsAdd)
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
            quantity: 1 as number | '',
            rate: 0 as number | '',
            discount: 0 as number | '',
            discountType: 'percentage',
            tax: '',
            taxRate: 0,
            amount: 0,
            account_id: 0,
            item_tax_type: '',
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

    // Calculate totals (matching BillsAdd logic with defensive Number() conversions)
    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0);
    const totalDiscount = discountTypeOnTotal === 'percentage'
        ? (subTotal * (Number(discountOnTotal) || 0)) / 100
        : (Number(discountOnTotal) || 0);
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

    // Tax rate breakdown for inter-state transactions (IGST)
    items
        .filter(item => item.item_tax_type === "tax_rate" && item.tax_group_id)
        .forEach(item => {
            const rate = taxRates.find(r => r.id === item.tax_group_id);
            if (!rate) return;
            const rateValue = rate.rate ?? rate.percentage ?? 0;
            const taxAmt = (item.amount * rateValue) / 100;
            const existing = taxBreakdown.find(t => t.name === rate.name);
            if (existing) {
                existing.amount += taxAmt;
            } else {
                taxBreakdown.push({ name: rate.name, rate: rateValue, amount: taxAmt });
            }
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
        const selected = taxOptions.find(t => t.name === selectedTax);
        if (selected && typeof selected.percentage === 'number') {
            setTaxAmount2((afterDiscount * selected.percentage) / 100);
        } else {
            setTaxAmount2(0);
        }
    }, [selectedTax, taxOptions, afterDiscount]);

    // Re-preselect tax on all taxable items when source/destination of supply changes
    useEffect(() => {
        if (!sourceOfSupply || !destinationOfSupply) return;
        const isSameState = sourceOfSupply.trim().toLowerCase() === destinationOfSupply.trim().toLowerCase();
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
    }, [sourceOfSupply, destinationOfSupply]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update totalAmount2 to include tax groups and adjustment
    useEffect(() => {
        const total = afterDiscount + totalTaxGroups - taxAmount2 + (Number(adjustment) || 0);
        setTotalAmount2(total);
    }, [afterDiscount, totalTaxGroups, taxAmount2, adjustment]);

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

    // Handle bulk items added
    const handleBulkItemsAdded = (bulkItems: BulkSelectedItem[]) => {
        const currentItems = items.filter(it => it.name || it.rate > 0);
        const newRows: Item[] = bulkItems.map(bi => ({
            id: bi.id,
            name: bi.inventory_name,
            description: '',
            quantity: bi.quantity,
            rate: bi.rate,
            discount: 0,
            discountType: 'percentage' as const,
            tax: '',
            taxRate: 0,
            amount: bi.quantity * bi.rate,
            account_id: 0,
            item_tax_type: '',
            tax_group_id: null,
            tax_exemption_id: null,
        }));
        setItems(currentItems.length > 0 ? [...currentItems, ...newRows] : newRows);
    };

    // ── BulkItemModal Component ─────────────────────────────────────────────
    const BulkItemModal: React.FC<BulkItemModalProps> = ({ open, onClose, itemOptions, onAddItems }) => {
        const [search, setSearch] = useState('');
        const [selectedItems, setSelectedItems] = useState<BulkSelectedItem[]>([]);

        // Reset on open
        useEffect(() => {
            if (open) {
                setSearch('');
                setSelectedItems([]);
            }
        }, [open]);

        const filteredItems = itemOptions.filter(item => {
            const name = (item.inventory_name || item.name || '').toString().toLowerCase();
            const sku = (item.sku || '').toString().toLowerCase();
            const query = search.toLowerCase();

            return name.includes(query) || (sku && sku.includes(query));
        });

        const isSelected = (id: string) => selectedItems.some(i => i.id === id);

        const toggleItem = (item: BulkItem) => {
            if (isSelected(item.id)) {
                setSelectedItems(prev => prev.filter(i => i.id !== item.id));
            } else {
                setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
            }
        };

        const updateQty = (id: string, delta: number) => {
            setSelectedItems(prev =>
                prev.map(i => i.id === id
                    ? { ...i, quantity: Math.max(1, i.quantity + delta) }
                    : i
                )
            );
        };

        const totalQty = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

        const handleAdd = () => {
            if (selectedItems.length === 0) return;
            onAddItems(selectedItems);
            onClose();
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { height: '90vh', maxHeight: 680, borderRadius: 2 } }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Add Items in Bulk</h2>
                    <IconButton size="small" onClick={onClose} sx={{ color: 'error.main' }}>
                        <Close fontSize="small" />
                    </IconButton>
                </div>

                {/* Body */}
                <div className="flex overflow-hidden" style={{ height: 'calc(100% - 120px)' }}>

                    {/* LEFT – Item list */}
                    <div className="w-[45%] border-r border-gray-200 flex flex-col overflow-hidden">
                        {/* Search */}
                        <div className="px-4 py-3">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type to search or scan the barcode of the item"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' } }}
                            />
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredItems.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">No items found</div>
                            ) : (
                                filteredItems.map(item => {
                                    const selected = isSelected(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleItem(item)}
                                            className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-sm font-medium ${selected ? 'text-blue-600' : 'text-gray-800'}`}>
                                                    {item.inventory_name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.sku ? `SKU: ${item.sku}  ` : ''}
                                                    Purchase Rate: ₹{Number(item.rate).toFixed(2)}
                                                </p>
                                            </div>
                                            {selected && (
                                                <CheckCircle sx={{ color: '#22c55e', fontSize: 22 }} />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT – Selected items */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header row */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-gray-800">Selected Items</span>
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                                    {selectedItems.length}
                                </span>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                Total Quantity: {totalQty}
                            </span>
                        </div>

                        {/* Selected list */}
                        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                            {selectedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-sm mt-2">Click items on the left to add them</p>
                                </div>
                            ) : (
                                selectedItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-800 font-medium flex-1 pr-4">
                                            {item.sku ? `[${item.sku}] ` : ''}{item.inventory_name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQty(item.id, -1)}
                                                sx={{ border: '1px solid #e2e8f0', borderRadius: 1, width: 28, height: 28 }}
                                            >
                                                <span style={{ fontSize: 18, lineHeight: 1 }}>−</span>
                                            </IconButton>
                                            <span className="w-8 text-center text-sm font-semibold text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQty(item.id, 1)}
                                                sx={{ border: '1px solid #e2e8f0', borderRadius: 1, width: 28, height: 28 }}
                                            >
                                                <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-white">
                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        disabled={selectedItems.length === 0}
                        sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', borderRadius: 1.5, px: 3 }}
                    >
                        Add Items
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ textTransform: 'none', borderRadius: 1.5, px: 3, borderColor: '#e2e8f0', color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
        );
    };

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedVendor) newErrors.vendor = 'Vendor is required';
        if (!selectedBillingAddressId) newErrors.billingAddress = 'Billing address is required';
        if (!selectedShippingAddressId) newErrors.shippingAddress = 'Shipping address is required';
        if (!purchaseOrderDate) newErrors.purchaseOrderDate = 'Purchase order date is required';
        if (!expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required';
        if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

        if (referenceNumber && !/^\d{4,5}$/.test(referenceNumber)) {
            newErrors.referenceNumber = 'Reference number must be 4 to 5 digits';
        }

        if (expectedDeliveryDate && purchaseOrderDate && new Date(expectedDeliveryDate) <= new Date(purchaseOrderDate)) {
            newErrors.expectedDeliveryDate = 'Expected delivery date must be after purchase order date';
        }

        const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0 && item.item_id);
        if (!hasValidItems) newErrors.items = 'At least one valid item with proper selection is required';

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
                    pms_inventory_id: item.item_id,
                    quantity: item.quantity,
                    rate: item.rate,
                    total_value: item.amount,
                    ledger_id: item.account_id,
                    prod_desc: item.description
                };
            });


            const selectedTaxObj = taxOptions.find(t => t.name === selectedTax);

            const totalGSTAmount = taxBreakdown.reduce(
                (sum, tax) => sum + Number(tax.amount || 0),
                0
            );
            const payload = {
                pms_purchase_order: {
                    pms_supplier_id: selectedVendor?.id,
                    billing_address_id: selectedBillingAddressId,
                    shipping_address_id: selectedShippingAddressId,
                    gst_detail_id: selectedGstDetailId,
                    gst_preference: vendorDetail?.gst_preference || '',
                    delivery_adress_type: deliveryAddressType,
                    delivery_address_id: deliveryAddressType === 'organization' ? organizationAddress?.id : deliveryCustomerAddress?.id,
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

                    tax_percentage: selectedTaxObj?.rate || 0,
                    reverse_charge: reverseCharge,
                    source_of_supply: sourceOfSupply,
                    destination_of_supply: destinationOfSupply,

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

    const handleItemSelect = (index: number, selectedItemId: string) => {
        const selectedItem = itemOptions.find((opt: any) => opt.id === selectedItemId);
        if (!selectedItem) return;
        setItems(prev => {
            const newItems = [...prev];
            let newItemTaxType = '';
            let newTaxGroupId = null;

            // Set tax type and validate against available options
            if (selectedItem.tax_preference === 'non_taxable') {
                newItemTaxType = 'non_taxable';
                newTaxGroupId = null;
            } else if (selectedItem.tax_preference === 'taxable') {
                newItemTaxType = 'tax_group';
                newTaxGroupId = selectedItem.tax_group_id;
                // Validate that the tax_group_id exists in available tax groups/rates
                // If not, clear it and let user re-select
                const isSameState = orgState && sourceOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                const validIds = isSameState ? taxGroups.map(g => g.id) : taxRates.map(r => r.id);
                if (!validIds.includes(newTaxGroupId)) {
                    newItemTaxType = '';
                    newTaxGroupId = null;
                }
            } else if (selectedItem.tax_preference === 'out_of_scope') {
                newItemTaxType = 'out_of_scope';
                newTaxGroupId = null;
            } else if (selectedItem.tax_preference === 'non_gst_supply') {
                newItemTaxType = 'non_gst_supply';
                newTaxGroupId = null;
            }

            newItems[index] = {
                ...newItems[index],
                id: selectedItem.id,
                name: selectedItem.name,
                rate: Number(selectedItem.rate) || 0,
                description: selectedItem.description || '',
                account_id: selectedItem.account || '',
                item_tax_type: newItemTaxType,
                tax_group_id: newTaxGroupId,
                tax_exemption_id: selectedItem.tax_preference === 'non_taxable' ? selectedItem.tax_exemption_id : null,
            };
            newItems[index].amount = calculateItemAmount(newItems[index]);
            if (selectedItem.tax_preference === 'non_taxable') {
                setCurrentItemIndex(index);
                setExemptionModalOpen(true);
            }
            return newItems;
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Constants and Helper Functions for Address and GST Management
    // ─────────────────────────────────────────────────────────────────────────

    const INDIAN_STATES = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
        'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
        'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    const gstTreatmentOptions = [
        { value: 'registered_regular', label: 'Registered Business - Regular' },
        { value: 'registered_composition', label: 'Registered Business - Composition' },
        { value: 'unregistered', label: 'Unregistered Business' },
        { value: 'consumer', label: 'Consumer' },
        { value: 'overseas', label: 'Overseas' },
        { value: 'sez_unit', label: 'Special Economic Zone (SEZ) Unit' },
    ];

    const getGstTreatmentLabel = (value?: string) => {
        if (!value) return '';
        return gstTreatmentOptions.find(opt => opt.value === value)?.label || value;
    };

    const mapAddress = (address: any, fallbackType: 'billing' | 'shipping') => ({
        id: address?.id ?? `${fallbackType}-${Date.now()}`,
        attention: address?.attention || '',
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

    const formatAddressText = (addr?: any): string => {
        if (!addr) return '';
        return [
            addr.attention, addr.address, addr.address_line_two,
            [addr.city, addr.state].filter(Boolean).join(', '),
            addr.pin_code, addr.country
        ].filter(Boolean).join(', ');
    };

    const selectedBillingAddress = billingAddressBook.find(
        a => String(a.id) === String(selectedBillingAddressId)
    ) || billingAddressBook[0] || null;

    const selectedShippingAddress = shippingAddressBook.find(
        a => String(a.id) === String(selectedShippingAddressId)
    ) || shippingAddressBook[0] || null;

    const selectedGstDetail = gstDetails.find(
        g => String(g.id) === String(selectedGstDetailId)
    ) || gstDetails.find(g => g.primary) || gstDetails[0] || null;

    const getAddressBookByType = (type: 'billing' | 'shipping') =>
        type === 'billing' ? billingAddressBook : shippingAddressBook;

    const fetchVendorDetail = async (vendorId: string) => {
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        setVendorDetailLoading(true);
        try {
            const res = await axios.get(
                `https://${baseUrl}/pms/suppliers/${vendorId}.json?access_token=${token}`
            );
            const data = res.data?.supplier || res.data;
            setVendorDetail(data);

            const nextBilling = Array.isArray(data.billing_addresses) && data.billing_addresses.length
                ? data.billing_addresses.map((a: any) => mapAddress(a, 'billing'))
                : data.default_billing_address
                    ? [mapAddress(data.default_billing_address, 'billing')]
                    : [];

            const nextShipping = Array.isArray(data.shipping_addresses) && data.shipping_addresses.length
                ? data.shipping_addresses.map((a: any) => mapAddress(a, 'shipping'))
                : data.default_shipping_address
                    ? [mapAddress(data.default_shipping_address, 'shipping')]
                    : [];

            setBillingAddressBook(nextBilling);
            setShippingAddressBook(nextShipping);

            const defaultBilling = data.default_billing_address
                ? mapAddress(data.default_billing_address, 'billing')
                : nextBilling[0] || null;
            const defaultShipping = data.default_shipping_address
                ? mapAddress(data.default_shipping_address, 'shipping')
                : nextShipping[0] || null;

            setSelectedBillingAddressId(defaultBilling?.id ?? null);
            setSelectedShippingAddressId(defaultShipping?.id ?? null);

            const nextGst: any[] = Array.isArray(data.gst_details) ? data.gst_details : [];
            setGstDetails(nextGst);
            const primaryGst = nextGst.find(g => g.primary) || nextGst[0] || null;
            setSelectedGstDetailId(primaryGst?.id ?? null);
            if (primaryGst?.place_of_supply) {
                setSourceOfSupply(primaryGst.place_of_supply);
            }
        } catch (err) {
            console.error('Error fetching vendor detail:', err);
            toast.error('Failed to load vendor details');
        } finally {
            setVendorDetailLoading(false);
        }
    };

    const openAddressListModal = (type: 'billing' | 'shipping') => {
        setActiveAddressType(type);
        setAddressListModalOpen(true);
    };

    const openAddressFormModal = (mode: 'new' | 'edit', type: 'billing' | 'shipping', address?: any) => {
        setActiveAddressType(type);
        setAddressFormMode(mode);
        if (mode === 'edit' && address) {
            setEditingAddressId(address.id);
            setAddressForm({ ...address });
        } else {
            setEditingAddressId(null);
            setAddressForm({
                id: `${type}-${Date.now()}`, attention: '', address: '',
                address_line_two: '', country: 'India', state: '', city: '',
                pin_code: '', telephone_number: '', fax_number: '', mobile: ''
            });
        }
        setSelectedAddressTaxInfoId(selectedGstDetailId ? String(selectedGstDetailId) : '');
        setAddressFormModalOpen(true);
    };

    const handleSaveAddressForm = async () => {
        if (!selectedVendor?.id) return;
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        const targetId = editingAddressId ?? addressForm.id;
        const payload = { ...addressForm, id: targetId };
        const setBook = activeAddressType === 'billing' ? setBillingAddressBook : setShippingAddressBook;
        const setSelectedId = activeAddressType === 'billing' ? setSelectedBillingAddressId : setSelectedShippingAddressId;

        const addressAttr: any = {
            attention: addressForm.attention || '',
            address: addressForm.address || '',
            address_type: activeAddressType,
            address_line_two: addressForm.address_line_two || '',
            country: addressForm.country || 'India',
            state: addressForm.state || '',
            city: addressForm.city || '',
            pin_code: addressForm.pin_code || '',
            telephone_number: addressForm.telephone_number || '',
            fax_number: addressForm.fax_number || '',
            mobile: addressForm.mobile || '',
        };
        if (addressFormMode === 'edit') addressAttr.id = Number(targetId) || targetId;

        try {
            await axios.put(
                `https://${baseUrl}/pms/suppliers/${selectedVendor.id}.json?access_token=${token}`,
                {
                    pms_supplier: {
                        [activeAddressType === 'billing'
                            ? 'billing_addresses_attributes'
                            : 'shipping_addresses_attributes']: [addressAttr]
                    }
                }
            );
            setBook(prev => addressFormMode === 'edit'
                ? prev.map(item => String(item.id) === String(targetId) ? payload : item)
                : [...prev, payload]
            );
            setSelectedId(targetId);
            setAddressFormModalOpen(false);
            setAddressListModalOpen(false);
            toast.success('Address saved successfully');
            fetchVendorDetail(selectedVendor.id);
        } catch (err) {
            toast.error('Failed to save address');
        }
    };

    const handleGstinDropdownChange = (value: any) => {
        setSelectedGstDetailId(value);
        const selected = gstDetails.find(g => String(g.id) === String(value));
        if (selected?.place_of_supply) setSourceOfSupply(selected.place_of_supply);
        setGstPickerModalOpen(false);
    };

    const handleSaveAndSelectGst = async () => {
        if (!selectedVendor?.id || !newGstForm.gstin || !newGstForm.place_of_supply) {
            toast.error('GSTIN and Place of Supply are required');
            return;
        }
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        const normalized = newGstForm.gstin.toUpperCase().trim();
        if (!gstinRegex.test(normalized)) {
            toast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
            return;
        }
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        const gstAttr: any = {
            ...(editingGstDetailId ? { id: Number(editingGstDetailId) || editingGstDetailId } : {}),
            gstin: normalized,
            place_of_supply: newGstForm.place_of_supply,
            business_legal_name: newGstForm.business_legal_name || '',
            business_trade_name: newGstForm.business_trade_name || ''
        };
        try {
            await axios.put(
                `https://${baseUrl}/pms/suppliers/${selectedVendor.id}.json?access_token=${token}`,
                { pms_supplier: { gst_details_attributes: [gstAttr] } }
            );
            setShowNewGstForm(false);
            setEditingGstDetailId(null);
            setGstManageModalOpen(false);
            toast.success('Tax information saved');
            await fetchVendorDetail(selectedVendor.id);
        } catch (err) {
            toast.error('Failed to save tax information');
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
                                            setSelectedBillingAddressId(null);
                                            setSelectedShippingAddressId(null);
                                            setBillingAddressBook([]);
                                            setShippingAddressBook([]);
                                            setGstDetails([]);
                                            setVendorDetail(null);
                                            if (e.target.value) {
                                                fetchVendorDetail(e.target.value);
                                            }
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
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Source of Supply */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Source of Supply<span className="text-red-500">*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                value={sourceOfSupply}
                                                onChange={(e) => setSourceOfSupply(e.target.value)}
                                                displayEmpty
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">Select Source of Supply</MenuItem>
                                                {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'].map((state) => (
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
                                            Destination of Supply<span className="text-red-500">*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                value={destinationOfSupply}
                                                onChange={(e) => setDestinationOfSupply(e.target.value)}
                                                displayEmpty
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="">Select Destination of Supply</MenuItem>
                                                {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'].map((state) => (
                                                    <MenuItem key={state} value={state}>
                                                        {state}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                {/* <Button
                                    variant="outlined"
                                    onClick={() => setVendorDrawerOpen(true)}
                                    endIcon={<ChevronRight />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    View Vendor Details
                                </Button> */}

                                <Button
                                    variant="outlined"
                                    onClick={() => handleVendorChange(selectedVendor.id)}
                                    endIcon={<ChevronRight />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    View Vendor Details
                                </Button>
                            </>
                        )}
                    </div>
                </Section>

                {/* Address Section */}
                <Section title="Address Details" icon={<FileText className="w-5 h-5" />}>
                    <div className="space-y-4">
                        {vendorDetailLoading ? (
                            <div className="flex justify-center py-4">
                                <CircularProgress size={24} />
                            </div>
                        ) : vendorDetail && selectedVendor ? (
                            <>
                                {/* Billing and Shipping Address */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-gray-100">
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Billing Address*
                                            <IconButton size="small" onClick={() => openAddressListModal('billing')}>
                                                <EditOutlined fontSize="small" className="text-blue-500" />
                                            </IconButton>
                                        </div>
                                        {selectedBillingAddress?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {selectedBillingAddress.attention && <div className="font-medium">{selectedBillingAddress.attention}</div>}
                                                <div>{selectedBillingAddress.address}</div>
                                                {selectedBillingAddress.address_line_two && <div>{selectedBillingAddress.address_line_two}</div>}
                                                <div>
                                                    {[selectedBillingAddress.city, selectedBillingAddress.state].filter(Boolean).join(', ')}
                                                    {selectedBillingAddress.pin_code ? ` - ${selectedBillingAddress.pin_code}` : ''}
                                                </div>
                                                {selectedBillingAddress.country && <div>{selectedBillingAddress.country}</div>}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => openAddressFormModal('new', 'billing')}
                                                className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100">
                                                + New Address
                                            </button>
                                        )}
                                        {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                                    </div>

                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Shipping Address*
                                            <IconButton size="small" onClick={() => openAddressListModal('shipping')}>
                                                <EditOutlined fontSize="small" className="text-blue-500" />
                                            </IconButton>
                                        </div>
                                        {selectedShippingAddress?.address ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {selectedShippingAddress.attention && <div className="font-medium">{selectedShippingAddress.attention}</div>}
                                                <div>{selectedShippingAddress.address}</div>
                                                {selectedShippingAddress.address_line_two && <div>{selectedShippingAddress.address_line_two}</div>}
                                                <div>
                                                    {[selectedShippingAddress.city, selectedShippingAddress.state].filter(Boolean).join(', ')}
                                                    {selectedShippingAddress.pin_code ? ` - ${selectedShippingAddress.pin_code}` : ''}
                                                </div>
                                                {selectedShippingAddress.country && <div>{selectedShippingAddress.country}</div>}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => openAddressFormModal('new', 'shipping')}
                                                className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100">
                                                + New Address
                                            </button>
                                        )}
                                        {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                                    </div>
                                </div>

                                {/* GST Info Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GST Treatment:</span>
                                        <span className="text-gray-800">{getGstTreatmentLabel(vendorDetail?.gst_preference)}</span>
                                        <IconButton size="small" onClick={() => {
                                            setGstTreatmentDraft(vendorDetail?.gst_preference || '');
                                            setGstModalOpen(true);
                                        }}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GSTIN:</span>
                                        <span className="text-gray-800 font-medium">
                                            {selectedGstDetail?.gstin || vendorDetail?.primary_gst_detail?.gstin || '—'}
                                        </span>
                                        <IconButton size="small" onClick={() => setGstPickerModalOpen(true)}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                </div>

                                {/* Delivery Address - keep existing radio group */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h6 className="text-sm font-medium mb-2">Delivery Address</h6>
                                    <div className="flex items-center gap-4 mb-4">
                                        <RadioGroup row value={deliveryAddressType}
                                            onChange={(e) => handleDeliveryTypeChange(e.target.value as 'organization' | 'customer')}>
                                            <FormControlLabel value="organization" control={<Radio />} label="Organization" />
                                            <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                                        </RadioGroup>
                                    </div>

                                    {deliveryAddressType === 'organization' && (
                                        <div className="space-y-3">
                                            {loadingOrgAddress && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                                                    <CircularProgress size={16} />
                                                    <span>Fetching organization address...</span>
                                                </div>
                                            )}
                                            {orgAddressError && !loadingOrgAddress && (
                                                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                                    {orgAddressError}
                                                </div>
                                            )}
                                            {organizationAddress && !loadingOrgAddress && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 space-y-1">
                                                    {organizationAddress.attention && <p className="font-medium">{organizationAddress.attention}</p>}
                                                    {organizationAddress.address && <p>{organizationAddress.address}</p>}
                                                    {organizationAddress.address_line_two && <p>{organizationAddress.address_line_two}</p>}
                                                    {(organizationAddress.city || organizationAddress.state || organizationAddress.pin_code) && (
                                                        <p>{[organizationAddress.city, organizationAddress.state, organizationAddress.pin_code].filter(Boolean).join(', ')}</p>
                                                    )}
                                                    {organizationAddress.country && <p className="text-gray-500">{organizationAddress.country}</p>}
                                                </div>
                                            )}
                                            {!loadingOrgAddress && !organizationAddress && !orgAddressError && (
                                                <div className="text-sm text-gray-400 italic py-2">No address available for this organization.</div>
                                            )}
                                        </div>
                                    )}

                                    {deliveryAddressType === 'customer' && (
                                        <div className="space-y-3">
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel shrink>Select Customer</InputLabel>
                                                <Select label="Select Customer" value={selectedDeliveryCustomer?.id || ''}
                                                    onChange={(e) => {
                                                        const selected = deliveryCustomers.find(c => c.id === e.target.value);
                                                        setSelectedDeliveryCustomer(selected || null);
                                                    }}
                                                    displayEmpty sx={fieldStyles}>
                                                    <MenuItem value=""><em>Select Customer</em></MenuItem>
                                                    {deliveryCustomers.map((customer: any) => (
                                                        <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {loadingCustomerAddress && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                                                    <CircularProgress size={16} />
                                                    <span>Loading customer address...</span>
                                                </div>
                                            )}
                                            {customerAddressError && !loadingCustomerAddress && (
                                                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                                    {customerAddressError}
                                                </div>
                                            )}
                                            {deliveryCustomerAddress && !loadingCustomerAddress && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 space-y-1">
                                                    {deliveryCustomerAddress.attention && <p className="font-medium">{deliveryCustomerAddress.attention}</p>}
                                                    {deliveryCustomerAddress.address && <p>{deliveryCustomerAddress.address}</p>}
                                                    {deliveryCustomerAddress.address_line_two && <p>{deliveryCustomerAddress.address_line_two}</p>}
                                                    {(deliveryCustomerAddress.city || deliveryCustomerAddress.state || deliveryCustomerAddress.pin_code) && (
                                                        <p>{[deliveryCustomerAddress.city, deliveryCustomerAddress.state, deliveryCustomerAddress.pin_code].filter(Boolean).join(', ')}</p>
                                                    )}
                                                    {deliveryCustomerAddress.country && <p className="text-gray-500">{deliveryCustomerAddress.country}</p>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-400 italic py-4">
                                Select a vendor to view and manage address details.
                            </div>
                        )}
                    </div>
                </Section>

                {/* Purchase Order Details */}
                <Section title="Purchase Order Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Purchase Order #
                            </label>
                            <TextField
                                fullWidth
                                value={loadingPONumber ? 'Loading...' : purchaseOrderNumber}
                                disabled
                                sx={{
                                    ...fieldStyles,
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: '#374151',
                                        fontWeight: 600,
                                    },
                                }}
                                InputProps={{
                                    endAdornment: loadingPONumber ? (
                                        <InputAdornment position="end">
                                            <CircularProgress size={16} />
                                        </InputAdornment>
                                    ) : null,
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
                                onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(/\D/g, '');
                                    setReferenceNumber(onlyDigits.slice(0, 5));
                                }}
                                placeholder="Enter reference number"
                                error={!!errors.referenceNumber}
                                helperText={errors.referenceNumber}
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
                                inputProps={{
                                    min: purchaseOrderDate ? new Date(new Date(purchaseOrderDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
                                }}
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

                        {/* Reverse Charge */}
                        <div className="col-span-1 md:col-span-3 mt-2">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={reverseCharge}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setReverseCharge(checked);
                                            setItems(prev =>
                                                prev.map(item => {
                                                    const base = item.quantity * item.rate;
                                                    const disc = item.discountType === 'percentage'
                                                        ? (base * item.discount) / 100
                                                        : item.discount;
                                                    const after = base - disc;
                                                    return {
                                                        ...item,
                                                        taxRate: checked ? 0 : item.taxRate,
                                                        tax_group_id: checked ? null : item.tax_group_id,
                                                        item_tax_type: checked ? '' : item.item_tax_type,
                                                        tax_exemption_id: checked ? null : item.tax_exemption_id,
                                                        amount: checked
                                                            ? after
                                                            : after + (after * item.taxRate) / 100,
                                                    };
                                                })
                                            );
                                        }}
                                        sx={{
                                            color: 'primary.main',
                                            '&.Mui-checked': { color: 'primary.main' },
                                        }}
                                    />
                                }
                                label={
                                    <span className="text-sm font-medium">
                                        This transaction is applicable for Reverse Charge
                                    </span>
                                }
                            />
                            {reverseCharge && (
                                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-1 flex items-center gap-2">
                                    <span>ℹ️</span>
                                    Reverse Charge is applicable
                                </p>
                            )}
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
                                                <ItemSearchInput
                                                    value={item.name}
                                                    itemOptions={itemOptions}
                                                    onSelect={(selected) => {
                                                        const isSameState = orgState && sourceOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
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
                                                    onType={(typed) => updateItemFields(index, {
                                                        item_id: item.name.trim().toLowerCase() === typed.trim().toLowerCase() ? item.item_id : null,
                                                        name: typed
                                                    })}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Description"
                                                    size="small"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    sx={{ mt: 2 }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
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
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        if (val < 0) {
                                                            toast.error('Quantity cannot be negative');
                                                            updateItem(index, 'quantity', 0);
                                                        } else {
                                                            updateItem(index, 'quantity', isNaN(val) ? '' : val);
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
                                                            updateItem(index, 'rate', isNaN(val) ? '' : val);
                                                        }
                                                    }}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                    sx={{ width: 100 }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <FormControl size="small" sx={{ width: 200 }} disabled={reverseCharge}>
                                                    <Select
                                                        value={(() => {
                                                            // If item_tax_type is a static type, use it directly
                                                            if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(item.item_tax_type || "")) {
                                                                return item.item_tax_type || "";
                                                            }
                                                            // If item_tax_type is tax_group or tax_rate, use tax_group_id
                                                            // But validate it exists in available options
                                                            if (["tax_group", "tax_rate"].includes(item.item_tax_type || "")) {
                                                                const isSameState = orgState && sourceOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
                                                                const validIds = isSameState ? taxGroups.map(g => g.id) : taxRates.map(r => r.id);
                                                                // If the ID exists in available options, show it; otherwise show empty
                                                                return validIds.includes(item.tax_group_id || -1) ? item.tax_group_id : "";
                                                            }
                                                            return "";
                                                        })()}
                                                        displayEmpty
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const isSameState = orgState && sourceOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();

                                                            // Static tax types
                                                            if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value as string)) {
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
                                                            const isSameState = orgState && sourceOfSupply.trim().toLowerCase() === orgState.trim().toLowerCase();
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
                                                {reverseCharge && (
                                                    <span className="text-xs text-black-400 block mt-1">
                                                        Tax disabled (RCM)
                                                    </span>
                                                )}
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
                            {/* <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Items in Bulk
                            </Button> */}
                            <Button
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                                onClick={() => setBulkModalOpen(true)}   // 👈 only this line added
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
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setDiscountOnTotal(Number.isFinite(value) ? value : 0);
                                        }}
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

                            {taxBreakdown.length > 0 && (
                                <>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                            Tax Summary
                                        </span>
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
                                </>
                            )}

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
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setAdjustment(Number.isFinite(value) ? value : 0);
                                        }}
                                        inputProps={{ step: 0.01 }}
                                        sx={{ width: 100 }}
                                    />
                                </div>
                            </div>

                            <Divider sx={{ my: 2 }} />

                            {/* <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                <span className="font-bold text-base">Total ( ₹ )</span>
                                <span className="font-bold text-primary text-2xl">₹{Number(totalAmount2 || 0).toFixed(2)}</span>
                            </div> */}

                            <div className="flex justify-between items-center py-3 bg-primary/5 px-4 rounded-lg">
                                <span className="font-bold text-base text-gray-900">Total ( ₹ )</span>
                                <span className="font-bold text-gray-900 text-2xl">₹{Number(totalAmount2 || 0).toFixed(2)}</span>
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
            {/* <Drawer
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
            </Drawer> */}

            <Drawer
                anchor="right"
                open={vendorDrawerOpen}
                onClose={() => setVendorDrawerOpen(false)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 } } }}
            >
                {vendorDetails && (
                    <div className="p-6 space-y-6">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-700">
                                        {vendorDetails.company_name?.charAt(0) || 'G'}
                                    </span>
                                </div>
                                <div>
                                    <Typography variant="h6" className="font-bold">
                                        {vendorDetails.company_name}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {vendorDetails.email}
                                    </Typography>
                                </div>
                            </div>
                            <IconButton onClick={() => setVendorDrawerOpen(false)}>
                                <Close />
                            </IconButton>
                        </div>

                        <Divider />

                        {/* Financial Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹{vendorDetails.financial_summary?.total_outstanding_amount_all || 0}
                                </Typography>
                                <Typography variant="body2">Outstanding Payables</Typography>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <Typography variant="h6" className="font-bold">
                                    ₹0
                                </Typography>
                                <Typography variant="body2">Unused Credits</Typography>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Typography variant="subtitle1" className="font-semibold mb-3">
                                Contact Details
                            </Typography>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Currency</span>
                                    <span>INR</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Payment Terms</span>
                                    <span>Due on Receipt</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>GST Treatment</span>
                                    <span>{vendorDetails.gst_preference}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>GSTIN</span>
                                    <span>{vendorDetails.primary_gst_detail?.gstin || '-'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>PAN</span>
                                    <span>{vendorDetails.pan_number || '-'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Source of Supply</span>
                                    <span>{vendorDetails.primary_gst_detail?.place_of_supply || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Persons */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Typography variant="subtitle1" className="font-semibold mb-3">
                                Contact Persons
                            </Typography>

                            {vendorDetails.contacts?.length ? (
                                vendorDetails.contacts.map((c: any) => (
                                    <div key={c.id} className="mb-3">
                                        <Typography className="font-semibold">
                                            {c.first_name} {c.last_name}
                                        </Typography>
                                        <Typography variant="body2">{c.email1}</Typography>
                                        <Typography variant="body2">{c.mobile1 || '-'}</Typography>
                                    </div>
                                ))
                            ) : (
                                <Typography>No Contact Persons</Typography>
                            )}
                        </div>

                        {/* Address */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Typography variant="subtitle1" className="font-semibold mb-3">
                                Address
                            </Typography>

                            {/* Billing */}
                            <div className="mb-4">
                                <Typography className="font-medium">Billing Address</Typography>
                                {vendorDetails.default_billing_address ? (
                                    <Typography variant="body2">
                                        {vendorDetails.default_billing_address.address},{" "}
                                        {vendorDetails.default_billing_address.city},{" "}
                                        {vendorDetails.default_billing_address.state}
                                    </Typography>
                                ) : (
                                    <Typography>No Billing Address</Typography>
                                )}
                            </div>

                            {/* Shipping */}
                            <div>
                                <Typography className="font-medium">Shipping Address</Typography>
                                {vendorDetails.default_shipping_address ? (
                                    <Typography variant="body2">
                                        {vendorDetails.default_shipping_address.address},{" "}
                                        {vendorDetails.default_shipping_address.city},{" "}
                                        {vendorDetails.default_shipping_address.state}
                                    </Typography>
                                ) : (
                                    <Typography>No Shipping Address</Typography>
                                )}
                            </div>
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

            {/* Address List Modal */}
            <Dialog open={addressListModalOpen} onClose={() => setAddressListModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{activeAddressType === 'billing' ? 'Billing Address' : 'Shipping Address'}</DialogTitle>
                <DialogContent dividers>
                    <div className="max-h-[420px] overflow-y-auto space-y-3">
                        {getAddressBookByType(activeAddressType).map((addr) => (
                            <div key={addr.id}
                                className={`border rounded-md p-3 text-sm cursor-pointer transition-colors ${String(activeAddressType === 'billing' ? selectedBillingAddressId : selectedShippingAddressId) === String(addr.id)
                                    ? 'border-[#C72030] bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => {
                                    if (activeAddressType === 'billing') setSelectedBillingAddressId(addr.id);
                                    else setSelectedShippingAddressId(addr.id);
                                    setAddressListModalOpen(false);
                                }}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5 text-gray-700">
                                        {addr.attention && <div className="font-semibold">{addr.attention}</div>}
                                        {addr.address && <div>{addr.address}</div>}
                                        {addr.address_line_two && <div>{addr.address_line_two}</div>}
                                        <div>{[addr.city, addr.state].filter(Boolean).join(', ')}{addr.pin_code ? ` ${addr.pin_code}` : ''}</div>
                                        {addr.country && <div>{addr.country}</div>}
                                    </div>
                                    <IconButton size="small" onClick={(e) => {
                                        e.stopPropagation();
                                        openAddressFormModal('edit', activeAddressType, addr);
                                    }}>
                                        <EditOutlined fontSize="small" className="text-blue-500" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
                    <button type="button" className="text-blue-600 text-sm font-medium"
                        onClick={() => openAddressFormModal('new', activeAddressType)}>
                        + New address
                    </button>
                    <Button onClick={() => setAddressListModalOpen(false)} variant="outlined" size="small"
                        sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Address Form Modal */}
            <Dialog open={addressFormModalOpen} onClose={() => setAddressFormModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Additional Address</DialogTitle>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <TextField label="Attention" fullWidth value={addressForm.attention}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, attention: e.target.value }))}
                            sx={{ gridColumn: 'span 2' }} />
                        <TextField label="Country/Region" select fullWidth value={addressForm.country}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, country: e.target.value }))}
                            sx={{ gridColumn: 'span 2' }}>
                            <MenuItem value="India">India</MenuItem>
                            <MenuItem value="United States">United States</MenuItem>
                            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                        </TextField>
                        <TextField label="Tax Information" select fullWidth value={selectedAddressTaxInfoId}
                            onChange={(e) => setSelectedAddressTaxInfoId(String(e.target.value))}
                            sx={{ gridColumn: 'span 2' }}>
                            <MenuItem value="">Select</MenuItem>
                            {gstDetails.map(gst => (
                                <MenuItem key={gst.id} value={String(gst.id)}>{gst.gstin} - {gst.place_of_supply}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Address" placeholder="Street 1" fullWidth value={addressForm.address}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, address: e.target.value }))}
                            sx={{ gridColumn: 'span 2' }} />
                        <TextField placeholder="Street 2" fullWidth value={addressForm.address_line_two}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, address_line_two: e.target.value }))}
                            sx={{ gridColumn: 'span 2' }} />
                        <TextField label="City" fullWidth value={addressForm.city}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, city: e.target.value }))} />
                        <TextField label="State" select fullWidth value={addressForm.state}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, state: e.target.value }))}>
                            <MenuItem value="">Select</MenuItem>
                            {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                        <TextField label="Pin Code" fullWidth value={addressForm.pin_code}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, pin_code: e.target.value }))} />
                        <TextField label="Phone" fullWidth value={addressForm.telephone_number}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, telephone_number: e.target.value }))} />
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-start', px: 3, py: 2 }}>
                    <Button variant="contained" onClick={handleSaveAddressForm}
                        sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}>Save</Button>
                    <Button variant="outlined" onClick={() => setAddressFormModalOpen(false)}
                        sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* GST Picker Modal */}
            <Dialog open={gstPickerModalOpen} onClose={() => setGstPickerModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogContent className="!p-0">
                    <div className="max-h-[240px] overflow-y-auto">
                        {gstDetails.length === 0 && (
                            <div className="px-4 py-6 text-center text-sm text-gray-400">No GST details found</div>
                        )}
                        {gstDetails.map(gst => (
                            <button key={gst.id} type="button"
                                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''
                                    }`}
                                onClick={() => handleGstinDropdownChange(gst.id)}>
                                {gst.gstin} - {gst.place_of_supply}
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <button type="button" className="text-blue-600 text-sm flex items-center gap-1"
                            onClick={() => { setGstPickerModalOpen(false); setShowNewGstForm(false); setEditingGstDetailId(null); setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' }); setGstManageModalOpen(true); }}>
                            ⚙ Manage Tax Informations
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* GST Treatment Modal */}
            <Dialog open={gstModalOpen} onClose={() => setGstModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Configure Tax Preferences</DialogTitle>
                <DialogContent>
                    <TextField label="GST Treatment" select fullWidth value={gstTreatmentDraft}
                        onChange={(e) => setGstTreatmentDraft(e.target.value)} size="small" sx={{ mt: 1 }}>
                        {gstTreatmentOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => {
                        setVendorDetail((prev: any) => prev ? { ...prev, gst_preference: gstTreatmentDraft } : prev);
                        setGstModalOpen(false);
                    }} sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}>
                        Update
                    </Button>
                    <Button variant="outlined" onClick={() => setGstModalOpen(false)}
                        sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* GST Manage Modal */}
            <Dialog open={gstManageModalOpen} onClose={() => setGstManageModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Manage Tax Informations
                    <IconButton size="small" onClick={() => setGstManageModalOpen(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-4">
                        <Button variant="contained" size="small"
                            onClick={() => {
                                setEditingGstDetailId(null);
                                setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
                                setShowNewGstForm(true);
                            }}
                            sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}>
                            Add New Tax Information
                        </Button>
                        {showNewGstForm && (
                            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="GSTIN*" fullWidth value={newGstForm.gstin} size="small"
                                    onChange={(e) => setNewGstForm(p => ({ ...p, gstin: e.target.value.toUpperCase() }))}
                                    error={!!newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)}
                                    helperText={newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin) ? 'Invalid GSTIN. e.g. 27AAAAA1234A1Z5' : ''}
                                    inputProps={{ maxLength: 15 }} />
                                <TextField label="Place of Supply*" select fullWidth value={newGstForm.place_of_supply} size="small"
                                    onChange={(e) => setNewGstForm(p => ({ ...p, place_of_supply: e.target.value }))}>
                                    <MenuItem value="">Select</MenuItem>
                                    {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                                <TextField label="Business Legal Name" fullWidth value={newGstForm.business_legal_name} size="small"
                                    onChange={(e) => setNewGstForm(p => ({ ...p, business_legal_name: e.target.value }))} />
                                <TextField label="Business Trade Name" fullWidth value={newGstForm.business_trade_name} size="small"
                                    onChange={(e) => setNewGstForm(p => ({ ...p, business_trade_name: e.target.value }))} />
                                <div className="md:col-span-2 flex gap-2">
                                    <Button variant="contained" size="small" onClick={handleSaveAndSelectGst}
                                        sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}>
                                        {editingGstDetailId ? 'Save' : 'Save and Select'}
                                    </Button>
                                    <Button variant="outlined" size="small"
                                        onClick={() => { setShowNewGstForm(false); setEditingGstDetailId(null); }}
                                        sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold text-gray-500 px-4 py-2">
                                <div>GSTIN</div><div>PLACE OF SUPPLY</div><div>LEGAL NAME</div><div></div>
                            </div>
                            <div className="max-h-[280px] overflow-y-auto">
                                {gstDetails.map(gst => (
                                    <div key={gst.id}
                                        className={`grid grid-cols-4 px-4 py-2 text-sm border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''
                                            }`}
                                        onClick={() => handleGstinDropdownChange(gst.id)}>
                                        <div>
                                            {gst.gstin}
                                            {gst.primary && <div className="text-green-600 text-xs italic">(Primary)</div>}
                                        </div>
                                        <div>{gst.place_of_supply || '—'}</div>
                                        <div>{gst.business_legal_name || '—'}</div>
                                        <div className="flex justify-end gap-1">
                                            {!gst.primary && (
                                                <IconButton size="small" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingGstDetailId(gst.id);
                                                    setNewGstForm({
                                                        gstin: gst.gstin,
                                                        place_of_supply: gst.place_of_supply,
                                                        business_legal_name: gst.business_legal_name || '',
                                                        business_trade_name: gst.business_trade_name || ''
                                                    });
                                                    setShowNewGstForm(true);
                                                }}>
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button variant="outlined" size="small" onClick={() => setGstManageModalOpen(false)}
                        sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Items Modal */}
            <BulkItemModal
                open={bulkModalOpen}
                onClose={() => setBulkModalOpen(false)}
                itemOptions={itemOptions}
                onAddItems={handleBulkItemsAdded}
            />
        </div>
    );
};