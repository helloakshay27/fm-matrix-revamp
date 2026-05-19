import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    IconButton,
    ListSubheader,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    FormControlLabel
} from '@mui/material';
import { Close, Add, EditOutlined } from '@mui/icons-material';
import { ArrowLeft, Calendar, FileText, Package } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    email?: string;
    currency?: string;
}

interface Item {
    id?: string;
    persisted?: boolean;
    item_id?: string | null;
    name: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    account: string;
    item_tax_type?: string;
    tax_group_id?: number | string | null;
    tax_exemption_id?: number | string | null;
}

interface AddressOption {
    id: string;
    address?: string;
    address_line_two?: string;
    city?: string;
    state?: string;
    pin_code?: string;
    country?: string;
}

interface GstOption {
    id: string;
    gstin?: string;
    place_of_supply?: string;
    primary?: boolean;
}

const emptyItem = (): Item => ({
    id: `${Date.now()}`,
    persisted: false,
    item_id: null,
    name: '',
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0,
    account: '',
    item_tax_type: '',
    tax_group_id: null,
    tax_exemption_id: null
});

export const CreditNoteEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [itemOptions, setItemOptions] = useState<any[]>([]);
    const [salespersons, setSalespersons] = useState<any[]>([]);
    const [taxOptions, setTaxOptions] = useState<any[]>([]);
    const [invoiceList, setInvoiceList] = useState<any[]>([]);
    const [accountGroups, setAccountGroups] = useState<any[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerDetail, setCustomerDetail] = useState<any>(null);
    const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
    const [billingAddressBook, setBillingAddressBook] = useState<AddressOption[]>([]);
    const [shippingAddressBook, setShippingAddressBook] = useState<AddressOption[]>([]);
    const [gstDetails, setGstDetails] = useState<GstOption[]>([]);
    const [addressListModalOpen, setAddressListModalOpen] = useState(false);
    const [activeAddressType, setActiveAddressType] = useState<'billing' | 'shipping'>('billing');
    const [gstTreatmentModalOpen, setGstTreatmentModalOpen] = useState(false);
    const [gstTreatmentDraft, setGstTreatmentDraft] = useState('');
    const [gstPickerModalOpen, setGstPickerModalOpen] = useState(false);
    const [placeOfSupply, setPlaceOfSupply] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [invoiceType, setInvoiceType] = useState('');
    const [reason, setReason] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [creditNoteDate, setCreditNoteDate] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [subject, setSubject] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddressId, setBillingAddressId] = useState('');
    const [shippingAddressId, setShippingAddressId] = useState('');
    const [gstDetailId, setGstDetailId] = useState('');
    const [gstPreference, setGstPreference] = useState('');
    const [items, setItems] = useState<Item[]>([emptyItem()]);
    const [discountTypeOnTotal, setDiscountTypeOnTotal] = useState<'percentage' | 'amount'>('percentage');
    const [discountOnTotal, setDiscountOnTotal] = useState(0);
    const [adjustmentLabel, setAdjustmentLabel] = useState('Adjustment');
    const [adjustment, setAdjustment] = useState(0);
    const [taxType, setTaxType] = useState<'TDS' | 'TCS'>('TDS');
    const [selectedTax, setSelectedTax] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    };

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Foreign Country'
    ];

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

    const toNumber = (value: any, fallback = 0) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const formatAddress = (address: any) => {
        if (!address) return '';
        return [
            address.address,
            address.address_line_two,
            [address.city, address.state].filter(Boolean).join(', '),
            address.pin_code,
            address.country
        ].filter(Boolean).join(', ');
    };

    const formatAddressLines = (address: any) => {
        if (!address) return [];
        return [
            address.address,
            address.address_line_two,
            [address.city, address.state].filter(Boolean).join(', '),
            address.pin_code ? `- ${address.pin_code}` : '',
            address.country
        ].filter(Boolean);
    };

    const normalizeAddress = (address: any): AddressOption => ({
        id: String(address?.id || `${Date.now()}`),
        address: address?.address || '',
        address_line_two: address?.address_line_two || '',
        city: address?.city || '',
        state: address?.state || '',
        pin_code: address?.pin_code || '',
        country: address?.country || 'India'
    });

    const getGstTreatmentLabel = (value?: string) => {
        if (!value) return '';
        return gstTreatmentOptions.find(option => option.value === value)?.label || value;
    };

    const selectedBillingAddress = billingAddressBook.find(address => String(address.id) === String(billingAddressId)) || billingAddressBook[0] || null;
    const selectedShippingAddress = shippingAddressBook.find(address => String(address.id) === String(shippingAddressId)) || shippingAddressBook[0] || null;
    const selectedGstDetail = gstDetails.find(gst => String(gst.id) === String(gstDetailId)) || gstDetails.find(gst => gst.primary) || gstDetails[0] || null;

    const mapItem = (item: any): Item => {
        const quantity = toNumber(item.quantity, 1);
        const rate = toNumber(item.rate);
        const lineItemId =
            item.id ??
            item.sale_order_item_id ??
            item.lock_account_credit_note_item_id ??
            item.credit_note_item_id ??
            item.lock_account_sale_order_item_id ??
            '';
        const ledgerId =
            item.lock_account_ledger_id ??
            item.ledger_id ??
            item.account_id ??
            item.account?.id ??
            item.ledger?.id ??
            item.lock_account_ledger?.id ??
            '';
        return {
            id: lineItemId ? String(lineItemId) : `${Date.now()}`,
            persisted: Boolean(lineItemId),
            item_id: item.lock_account_item_id ? String(item.lock_account_item_id) : (item.item_id ? String(item.item_id) : null),
            name: item.item_name || item.name || item.lock_account_item?.name || '',
            description: item.description || item.name || '',
            quantity,
            rate,
            amount: toNumber(item.total_amount, quantity * rate),
            account: ledgerId ? String(ledgerId) : '',
            item_tax_type: item.tax_type || '',
            tax_group_id: item.tax_group_id || item.lock_account_tax_group_id || null,
            tax_exemption_id: item.tax_exemption_id || null
        };
    };

    useEffect(() => {
        document.title = 'Edit Credit Note';
    }, []);

    useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lock_account_id = localStorage.getItem('lock_account_id');
        const headers = { Authorization: token ? `Bearer ${token}` : undefined };

        const fetchBaseData = async () => {
            const [customerRes, itemRes, salespersonRes, accountGroupRes] = await Promise.allSettled([
                axios.get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`, { headers }),
                axios.get(`https://${baseUrl}/lock_account_items.json?lock_account_id=${lock_account_id}&q[can_be_sold_eq]=1`, { headers }),
                axios.get(`https://${baseUrl}/sales_persons.json?lock_account_id=${lock_account_id}&q[active_eq]=1`, { headers }),
                axios.get(`https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat&q[group_type_in][]=sales&q[group_type_in][]=both`, { headers })
            ]);

            if (customerRes.status === 'fulfilled') setCustomers(customerRes.value.data || []);
            if (itemRes.status === 'fulfilled') setItemOptions(itemRes.value.data || []);
            if (salespersonRes.status === 'fulfilled') setSalespersons(salespersonRes.value.data || []);
            if (accountGroupRes.status === 'fulfilled') setAccountGroups(accountGroupRes.value.data?.data || accountGroupRes.value.data || []);
        };

        fetchBaseData();
    }, []);

    const fetchCustomerDetail = async (customerId: string, preferred?: { billingId?: string; shippingId?: string; gstId?: string }) => {
        setCustomerDetailLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            const response = await axios.get(
                `https://${baseUrl}/lock_account_customers/${customerId}.json?lock_account_id=${lock_account_id}`,
                { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
            );
            const data = response.data || {};
            const nextBilling = Array.isArray(data.billing_addresses) && data.billing_addresses.length
                ? data.billing_addresses.map(normalizeAddress)
                : (data.billing_address ? [normalizeAddress(data.billing_address)] : []);
            const nextShipping = Array.isArray(data.shipping_addresses) && data.shipping_addresses.length
                ? data.shipping_addresses.map(normalizeAddress)
                : (data.shipping_address ? [normalizeAddress(data.shipping_address)] : []);
            const nextGstDetails = Array.isArray(data.gst_details)
                ? data.gst_details.map((gst: any) => ({
                    id: String(gst.id),
                    gstin: gst.gstin || '',
                    place_of_supply: gst.place_of_supply || '',
                    primary: Boolean(gst.primary)
                }))
                : [];
            const nextBillingAddress = (preferred?.billingId ? nextBilling.find((address) => String(address.id) === String(preferred.billingId)) : null) || nextBilling[0] || null;
            const nextShippingAddress = (preferred?.shippingId ? nextShipping.find((address) => String(address.id) === String(preferred.shippingId)) : null) || nextShipping[0] || null;
            const nextGst = (preferred?.gstId ? nextGstDetails.find((gst) => String(gst.id) === String(preferred.gstId)) : null)
                || nextGstDetails.find((gst) => gst.primary)
                || nextGstDetails[0]
                || null;

            setCustomerDetail(data);
            setBillingAddressBook(nextBilling);
            setShippingAddressBook(nextShipping);
            setGstDetails(nextGstDetails);
            if (nextBillingAddress) {
                setBillingAddressId(nextBillingAddress.id);
                setBillingAddress(formatAddress(nextBillingAddress));
            }
            if (nextShippingAddress) {
                setShippingAddressId(nextShippingAddress.id);
                setShippingAddress(formatAddress(nextShippingAddress));
            }
            if (nextGst) {
                setGstDetailId(nextGst.id);
                if (nextGst.place_of_supply) setPlaceOfSupply(nextGst.place_of_supply);
            }
            setGstPreference(data.gst_preference || data.gst_treatment || gstPreference || '');
        } catch (error) {
            console.error('Error fetching customer details:', error);
        } finally {
            setCustomerDetailLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchCreditNoteDetails = async () => {
            setLoading(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lock_account_id = localStorage.getItem('lock_account_id');
                const response = await axios.get(
                    `https://${baseUrl}/lock_account_credit_notes/${id}.json?lock_account_id=${lock_account_id}&show=true`,
                    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
                );
                const data = response.data?.lock_account_credit_note || response.data?.data || response.data || {};
                const customerId = data.lock_account_customer_id || data.customer_id || data.customer?.id || data.lock_account_customer?.id;
                const customer = customerId ? {
                    id: String(customerId),
                    name: data.customer_name || data.customer?.name || data.lock_account_customer?.name || '',
                    email: data.customer_email || data.customer?.email || data.lock_account_customer?.email || '',
                    currency: data.currency || data.customer?.currency || data.lock_account_customer?.currency || 'INR'
                } : null;

                setSelectedCustomer(customer);
                setPlaceOfSupply(data.place_of_supply || data.address_detail?.gst_detail?.place_of_supply || '');
                setSelectedInvoice(data.lock_account_invoice_id ? String(data.lock_account_invoice_id) : '');
                setInvoiceType(data.invoice_type || '');
                setReason(data.reason || '');
                setReferenceNumber(data.reference_number || '');
                setCreditNoteDate(String(data.date || data.credit_note_date || '').slice(0, 10));
                setSalesperson(String(data.sales_person_id || data.salesperson_id || ''));
                setSubject(data.subject || '');
                setCustomerNotes(data.customer_notes || '');
                setTermsAndConditions(data.terms_and_conditions || '');
                setDiscountTypeOnTotal(data.discount_per !== null && data.discount_per !== undefined ? 'percentage' : 'amount');
                setDiscountOnTotal(toNumber(data.discount_per ?? data.discount_amount));
                setAdjustmentLabel(data.charge_name || 'Adjustment');
                setAdjustment(toNumber(data.charge_amount));
                setTaxType(String(data.tax_type || 'tds').toUpperCase() === 'TCS' ? 'TCS' : 'TDS');
                setSelectedTax(String(data.lock_account_tax_id || data.lock_account_tax?.name || data.tax?.name || ''));
                const nextBillingAddressId = String(data.address_detail?.billing_address_id || data.billing_address_id || '');
                const nextShippingAddressId = String(data.address_detail?.shipping_address_id || data.shipping_address_id || '');
                const nextGstDetailId = String(data.address_detail?.gst_detail_id || data.gst_detail_id || '');
                setBillingAddress(formatAddress(data.address_detail?.billing_address || data.billing_address));
                setShippingAddress(formatAddress(data.address_detail?.shipping_address || data.shipping_address));
                setBillingAddressId(nextBillingAddressId);
                setShippingAddressId(nextShippingAddressId);
                setGstDetailId(nextGstDetailId);
                setGstPreference(String(data.address_detail?.gst_preference || data.gst_preference || ''));
                if (customerId) {
                    fetchCustomerDetail(String(customerId), {
                        billingId: nextBillingAddressId,
                        shippingId: nextShippingAddressId,
                        gstId: nextGstDetailId
                    });
                }

                const detailItems = data.item_details || data.sale_order_items || [];
                setItems(Array.isArray(detailItems) && detailItems.length ? detailItems.map(mapItem) : [emptyItem()]);
            } catch (error) {
                console.error('Error fetching credit note details:', error);
                toast.error('Failed to load credit note details');
            } finally {
                setLoading(false);
            }
        };

        fetchCreditNoteDetails();
    }, [id]);

    useEffect(() => {
        if (!selectedCustomer?.id) {
            setInvoiceList([]);
            return;
        }

        const fetchInvoices = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lock_account_id = localStorage.getItem('lock_account_id');
                const response = await axios.get(
                    `https://${baseUrl}/lock_account_invoices.json?lock_account_id=${lock_account_id}&q[lock_account_customer_id_eq]=${selectedCustomer.id}`,
                    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
                );
                setInvoiceList(response.data?.data || response.data || []);
            } catch {
                setInvoiceList([]);
            }
        };

        fetchInvoices();
    }, [selectedCustomer?.id]);

    useEffect(() => {
        const fetchTaxSections = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const lock_account_id = localStorage.getItem('lock_account_id');
                const response = await axios.get(
                    `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=${taxType.toLowerCase()}&lock_account_id=${lock_account_id}`,
                    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
                );
                setTaxOptions(Array.isArray(response.data) ? response.data : response.data?.tax_sections || []);
            } catch {
                setTaxOptions([]);
            }
        };

        fetchTaxSections();
    }, [taxType]);

    const subTotal = useMemo(() => items.reduce((sum, item) => sum + (toNumber(item.quantity) * toNumber(item.rate)), 0), [items]);
    const totalDiscount = discountTypeOnTotal === 'percentage' ? (subTotal * discountOnTotal) / 100 : discountOnTotal;
    const afterDiscount = subTotal - totalDiscount;
    const selectedTaxOption = taxOptions.find(t => String(t.id) === selectedTax || t.name === selectedTax);
    const tdsTcsAmount = selectedTaxOption?.percentage ? (afterDiscount * selectedTaxOption.percentage) / 100 : 0;
    const totalAmount = afterDiscount + adjustment - tdsTcsAmount;
    const customerOptionsForSelect = selectedCustomer && !customers.some(customer => String(customer.id) === String(selectedCustomer.id))
        ? [selectedCustomer, ...customers]
        : customers;

    const updateItem = (index: number, fields: Partial<Item>) => {
        setItems(prev => prev.map((item, itemIndex) => {
            if (itemIndex !== index) return item;
            const next = { ...item, ...fields };
            return { ...next, amount: toNumber(next.quantity) * toNumber(next.rate) };
        }));
    };

    const validate = () => {
        if (!selectedCustomer) {
            toast.error('Customer is required');
            return false;
        }
        if (!placeOfSupply) {
            toast.error('Place of Supply is required');
            return false;
        }
        if (!creditNoteDate) {
            toast.error('Credit note date is required');
            return false;
        }
        if (!items.some(item => item.name && toNumber(item.quantity) > 0 && toNumber(item.rate) > 0)) {
            toast.error('Please add at least one valid item');
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!id || !validate()) return;

        setIsSubmitting(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const lock_account_id = localStorage.getItem('lock_account_id');
            const formData = new FormData();

            formData.append('lock_account_credit_note[id]', String(id));
            formData.append('lock_account_credit_note[lock_account_customer_id]', selectedCustomer?.id || '');
            formData.append('lock_account_credit_note[reference_number]', referenceNumber);
            formData.append('lock_account_credit_note[date]', creditNoteDate);
            formData.append('lock_account_credit_note[sales_person_id]', salesperson);
            formData.append('lock_account_credit_note[customer_notes]', customerNotes);
            formData.append('lock_account_credit_note[terms_and_conditions]', termsAndConditions);
            formData.append('lock_account_credit_note[subject]', subject);
            formData.append('lock_account_credit_note[sub_total_amount]', String(subTotal));
            formData.append('lock_account_credit_note[taxable_amount]', '0');
            formData.append('lock_account_credit_note[lock_account_tax_amount]', String(tdsTcsAmount));
            formData.append('lock_account_credit_note[total_amount]', String(totalAmount));
            if (discountTypeOnTotal === 'percentage') {
                formData.append('lock_account_credit_note[discount_per]', String(discountOnTotal));
                formData.append('lock_account_credit_note[discount_amount]', String(totalDiscount));
            } else {
                formData.append('lock_account_credit_note[discount_amount]', String(discountOnTotal));
            }
            formData.append('lock_account_credit_note[charge_amount]', String(adjustment));
            formData.append('lock_account_credit_note[charge_name]', adjustmentLabel);
            formData.append('lock_account_credit_note[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
            formData.append('lock_account_credit_note[tax_type]', taxType.toLowerCase());
            formData.append('lock_account_credit_note[lock_account_tax_id]', selectedTaxOption?.id ? String(selectedTaxOption.id) : selectedTax);
            formData.append('lock_account_credit_note[place_of_supply]', placeOfSupply);
            formData.append('lock_account_credit_note[lock_account_invoice_id]', selectedInvoice);
            formData.append('lock_account_credit_note[invoice_type]', invoiceType);
            formData.append('lock_account_credit_note[reason]', reason);
            formData.append('lock_account_credit_note[address_detail_attributes][billing_address_id]', billingAddressId);
            formData.append('lock_account_credit_note[address_detail_attributes][shipping_address_id]', shippingAddressId);
            formData.append('lock_account_credit_note[address_detail_attributes][gst_detail_id]', gstDetailId);
            formData.append('lock_account_credit_note[address_detail_attributes][gst_preference]', gstPreference);

            items.forEach((item, index) => {
                if (item.persisted && item.id) {
                    formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][id]`, item.id);
                }
                const resolvedId = item.item_id || itemOptions.find(opt => opt.name === item.name)?.id;
                if (resolvedId) {
                    formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][lock_account_item_id]`, String(resolvedId));
                } else {
                    formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][item_name]`, item.name);
                }
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][rate]`, String(item.rate));
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][quantity]`, String(item.quantity));
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][total_amount]`, String(item.amount));
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][name]`, item.description || '');
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][description]`, item.description || '');
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][lock_account_ledger_id]`, item.account || '');
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][tax_type]`, item.item_tax_type || '');
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][tax_group_id]`, String(item.tax_group_id || ''));
                formData.append(`lock_account_credit_note[sale_order_items_attributes][${index}][tax_exemption_id]`, String(item.tax_exemption_id || ''));
            });

            const response = await fetch(`https://${baseUrl}/lock_account_credit_notes/${id}.json?lock_account_id=${lock_account_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                },
                body: formData
            });

            if (!response.ok) throw new Error(`Update failed (${response.status})`);
            toast.success('Credit note updated successfully');
            navigate('/accounting/credit-note');
        } catch (error) {
            console.error('Error updating credit note:', error);
            toast.error('Failed to update credit note');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <CircularProgress size={48} />
                    <p className="text-muted-foreground text-sm">Loading credit note...</p>
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

            <header className="mb-4">
                <button type="button" onClick={() => navigate('/accounting/credit-note')} className="flex items-center gap-2 text-black font-medium mb-2">
                    <ArrowLeft className="h-4 w-4 text-black" />
                    Back to Credit Note List
                </button>
                <h1 className="text-2xl font-bold text-black">Edit Credit Note</h1>
            </header>

            <div className="space-y-6">
                <Section title="Customer Information" icon={<Package className="w-5 h-5" />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Customer Name<span className="text-red-500">*</span></label>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedCustomer?.id || ''}
                                        onChange={(event) => {
                                            const customer = customers.find(c => String(c.id) === String(event.target.value));
                                            setSelectedCustomer(customer ? { ...customer, id: String(customer.id) } : null);
                                            setBillingAddressId('');
                                            setShippingAddressId('');
                                            setGstDetailId('');
                                            setBillingAddress('');
                                            setShippingAddress('');
                                            setCustomerDetail(null);
                                            if (customer?.id) fetchCustomerDetail(String(customer.id));
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select a customer</MenuItem>
                                        {customerOptionsForSelect.map(customer => (
                                            <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Currency</label>
                                <TextField fullWidth value={selectedCustomer?.currency || 'INR'} disabled sx={fieldStyles} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Place of Supply<span className="text-red-500">*</span></label>
                                <TextField select fullWidth value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)} sx={fieldStyles}>
                                    <MenuItem value="">Select Place of Supply</MenuItem>
                                    {states.map(state => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                                </TextField>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Invoice#</label>
                                <FormControl fullWidth>
                                    <Select value={selectedInvoice} onChange={e => setSelectedInvoice(e.target.value)} displayEmpty sx={fieldStyles}>
                                        <MenuItem value="">Select Invoice</MenuItem>
                                        {invoiceList.map(inv => <MenuItem key={inv.id} value={String(inv.id)}>{inv.invoice_number || inv.id}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Invoice Type</label>
                                <FormControl fullWidth>
                                    <Select value={invoiceType} onChange={e => setInvoiceType(e.target.value)} displayEmpty sx={fieldStyles}>
                                        <MenuItem value="">Select Invoice Type</MenuItem>
                                        {invoiceTypeOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Reason</label>
                                <FormControl fullWidth>
                                    <Select value={reason} onChange={e => setReason(e.target.value)} displayEmpty sx={fieldStyles}>
                                        <MenuItem value="">Select Reason</MenuItem>
                                        {reasonOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {selectedCustomer && (
                            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Billing Address
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setActiveAddressType('billing');
                                                    setAddressListModalOpen(true);
                                                }}
                                            >
                                                <EditOutlined fontSize="small" className="text-blue-500" />
                                            </IconButton>
                                        </div>
                                        {selectedBillingAddress?.address || billingAddress ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {(selectedBillingAddress ? formatAddressLines(selectedBillingAddress) : [billingAddress]).map((line, lineIndex) => (
                                                    <div key={lineIndex} className={lineIndex === 0 ? 'font-medium' : ''}>{line}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => {
                                                setActiveAddressType('billing');
                                                setAddressListModalOpen(true);
                                            }} className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                New Address
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            Shipping Address
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setActiveAddressType('shipping');
                                                    setAddressListModalOpen(true);
                                                }}
                                            >
                                                <EditOutlined fontSize="small" className="text-blue-500" />
                                            </IconButton>
                                        </div>
                                        {selectedShippingAddress?.address || shippingAddress ? (
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {(selectedShippingAddress ? formatAddressLines(selectedShippingAddress) : [shippingAddress]).map((line, lineIndex) => (
                                                    <div key={lineIndex} className={lineIndex === 0 ? 'font-medium' : ''}>{line}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => {
                                                setActiveAddressType('shipping');
                                                setAddressListModalOpen(true);
                                            }} className="text-xs text-[#C72030] font-medium py-1 px-2 bg-red-50 rounded border border-red-100 inline-block">
                                                New Address
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GST Treatment:</span>
                                        <span className="text-gray-800">{getGstTreatmentLabel(gstPreference || customerDetail?.gst_preference || customerDetail?.gst_treatment)}</span>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setGstTreatmentDraft(gstPreference || customerDetail?.gst_preference || customerDetail?.gst_treatment || '');
                                                setGstTreatmentModalOpen(true);
                                            }}
                                        >
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">GSTIN:</span>
                                        <span className="text-gray-800 font-medium">{selectedGstDetail?.gstin || customerDetail?.gstin || '-'}</span>
                                        <IconButton size="small" onClick={() => setGstPickerModalOpen(true)}>
                                            <EditOutlined fontSize="small" className="text-blue-500" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedCustomer && customerDetailLoading && (
                            <div className="py-4 flex justify-center">
                                <CircularProgress size={24} color="error" />
                            </div>
                        )}
                    </div>
                </Section>

                <Section title="Address Details" icon={<FileText className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Billing Address</label>
                            <textarea className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y" rows={4} maxLength={500} value={billingAddress} onChange={e => setBillingAddress(e.target.value)} />
                            <p className="text-xs text-gray-400 text-right mt-1">{billingAddress.length}/500</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Shipping Address</label>
                            <textarea className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y" rows={4} maxLength={500} value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
                            <p className="text-xs text-gray-400 text-right mt-1">{shippingAddress.length}/500</p>
                        </div>
                    </div>
                </Section>

                <Section title="Credit Note Details" icon={<Calendar className="w-5 h-5" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Reference#</label>
                            <TextField fullWidth value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} sx={fieldStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Credit Note Date<span className="text-red-500">*</span></label>
                            <TextField fullWidth type="date" value={creditNoteDate} onChange={e => setCreditNoteDate(e.target.value)} sx={fieldStyles} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Salesperson</label>
                            <FormControl fullWidth>
                                <Select value={salesperson} onChange={e => setSalesperson(e.target.value)} displayEmpty sx={fieldStyles}>
                                    <MenuItem value="">Select or Add Salesperson</MenuItem>
                                    {salespersons.map(person => <MenuItem key={person.id} value={String(person.id)}>{person.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <TextField fullWidth multiline rows={2} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Let your customer know what this Credit Note is for" />
                    </div>
                </Section>

                <Section title="Item Table" icon={<Package className="w-5 h-5" />}>
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
                                    <tr key={`${item.id}-${index}`}>
                                        <td className="px-4 py-3">
                                            <FormControl fullWidth sx={{ minWidth: 220 }}>
                                                <Select
                                                    value={item.name}
                                                    onChange={e => {
                                                        const selected = itemOptions.find(opt => opt.name === e.target.value);
                                                        updateItem(index, {
                                                            name: e.target.value,
                                                            item_id: selected?.id ? String(selected.id) : item.item_id,
                                                            rate: selected?.sale_rate ?? selected?.rate ?? item.rate,
                                                            description: selected?.sale_description ?? item.description,
                                                            item_tax_type: selected?.tax_preference || item.item_tax_type,
                                                            tax_group_id: selected?.intra_state_tax_rate_id || item.tax_group_id,
                                                            tax_exemption_id: selected?.tax_exemption_id || item.tax_exemption_id
                                                        });
                                                    }}
                                                    displayEmpty
                                                    readOnly
                                                    size="small"
                                                >
                                                    <MenuItem value="">Type or click to select an item.</MenuItem>
                                                    {itemOptions.map(option => <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                            <TextField fullWidth size="small" className="mt-2" value={item.description} onChange={e => updateItem(index, { description: e.target.value })} placeholder="Description" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                                                <InputLabel id={`account-label-${index}`}>Account</InputLabel>
                                                <Select
                                                    labelId={`account-label-${index}`}
                                                    value={item.account || ''}
                                                    label="Account*"
                                                    onChange={e => updateItem(index, { account: String(e.target.value) })}
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
                                                    <MenuItem value="" disabled>Select Account</MenuItem>
                                                    {accountGroups.map((group) =>
                                                        group.ledgers && group.ledgers.length > 0 ? [
                                                            <ListSubheader key={`group-${group.id}`}>{group.group_name}</ListSubheader>,
                                                            ...group.ledgers.map((ledger) => (
                                                                <MenuItem key={ledger.id} value={String(ledger.id)}>
                                                                    {ledger.name}
                                                                </MenuItem>
                                                            )),
                                                        ] : null
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td className="px-4 py-3">
                                            <TextField type="number" size="small" value={item.quantity} onChange={e => updateItem(index, { quantity: toNumber(e.target.value, 1) })} sx={{ width: 90 }} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <TextField type="number" size="small" value={item.rate} onChange={e => updateItem(index, { rate: toNumber(e.target.value) })} sx={{ width: 110 }} />
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold">{item.amount.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <IconButton size="small" onClick={() => items.length > 1 && setItems(prev => prev.filter((_, i) => i !== index))} disabled={items.length === 1} color="error">
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pt-4">
                        <Button onClick={() => setItems(prev => [...prev, emptyItem()])} variant="outline" className="gap-2">
                            <Add fontSize="small" />
                            Add New Row
                        </Button>
                    </div>

                    <div className="flex justify-end mt-4">
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-muted-foreground">Sub Total</span>
                                <span className="font-semibold text-base">₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-muted-foreground">Discount</span>
                                <div className="flex items-center gap-2">
                                    <Select size="small" value={discountTypeOnTotal} onChange={e => setDiscountTypeOnTotal(e.target.value as 'percentage' | 'amount')} sx={{ width: 120 }}>
                                        <MenuItem value="percentage">%</MenuItem>
                                        <MenuItem value="amount">Amount</MenuItem>
                                    </Select>
                                    <TextField type="number" size="small" value={discountOnTotal} onChange={e => setDiscountOnTotal(toNumber(e.target.value))} sx={{ width: 80 }} />
                                    <span className="font-semibold text-base text-red-600 ml-2">-₹{totalDiscount.toFixed(2)}</span>
                                </div>
                            </div>
                            <Divider />
                            <div className="flex flex-wrap items-center gap-3 py-2">
                                <RadioGroup row value={taxType} onChange={e => setTaxType(e.target.value as 'TDS' | 'TCS')}>
                                    <FormControlLabel value="TDS" control={<Radio size="small" />} label={<span className="text-sm">TDS</span>} />
                                    <FormControlLabel value="TCS" control={<Radio size="small" />} label={<span className="text-sm">TCS</span>} />
                                </RadioGroup>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select value={selectedTax} onChange={e => setSelectedTax(e.target.value)} displayEmpty>
                                        <MenuItem value="">Select a Tax</MenuItem>
                                        {taxOptions.map(tax => <MenuItem key={tax.id || tax.name} value={String(tax.id || tax.name)}>{tax.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <span className="font-semibold text-base text-red-600">-₹{tdsTcsAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-2">
                                    <TextField size="small" value={adjustmentLabel} onChange={e => setAdjustmentLabel(e.target.value)} sx={{ width: 140 }} />
                                    <TextField type="number" size="small" value={adjustment} onChange={e => setAdjustment(toNumber(e.target.value))} sx={{ width: 110 }} />
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

                <Section title="Customer Notes" icon={<FileText className="w-5 h-5" />}>
                    <textarea className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y" rows={3} maxLength={500} value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} placeholder="Enter notes" />
                    <p className="text-xs text-gray-400 text-right mt-1">{customerNotes.length}/500</p>
                </Section>

                <Section title="Terms & Conditions" icon={<FileText className="w-5 h-5" />}>
                    <textarea className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y" rows={4} maxLength={500} value={termsAndConditions} onChange={e => setTermsAndConditions(e.target.value)} placeholder="Enter the terms and conditions of your business to be displayed in your transaction" />
                    <p className="text-xs text-gray-400 text-right mt-1">{termsAndConditions.length}/500</p>
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button onClick={handleUpdate} disabled={isSubmitting} className="px-4 py-2 rounded border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
                    {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
                <Button onClick={() => navigate('/accounting/credit-note')} disabled={isSubmitting} variant="outline">
                    Cancel
                </Button>
            </div>

            <Dialog open={addressListModalOpen} onClose={() => setAddressListModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{activeAddressType === 'billing' ? 'Billing Address' : 'Shipping Address'}</DialogTitle>
                <DialogContent dividers>
                    <div className="space-y-3">
                        {(activeAddressType === 'billing' ? billingAddressBook : shippingAddressBook).map((address) => (
                            <button
                                key={address.id}
                                type="button"
                                onClick={() => {
                                    if (activeAddressType === 'billing') {
                                        setBillingAddressId(address.id);
                                        setBillingAddress(formatAddress(address));
                                    } else {
                                        setShippingAddressId(address.id);
                                        setShippingAddress(formatAddress(address));
                                    }
                                    setAddressListModalOpen(false);
                                }}
                                className={`w-full rounded border p-3 text-left text-sm hover:border-[#C72030] ${
                                    String(activeAddressType === 'billing' ? billingAddressId : shippingAddressId) === String(address.id)
                                        ? 'border-[#C72030] bg-red-50'
                                        : 'border-gray-200'
                                }`}
                            >
                                {formatAddressLines(address).map((line, index) => (
                                    <div key={index} className={index === 0 ? 'font-medium text-gray-800' : 'text-gray-600'}>{line}</div>
                                ))}
                            </button>
                        ))}
                        {(activeAddressType === 'billing' ? billingAddressBook : shippingAddressBook).length === 0 && (
                            <p className="text-sm text-gray-500">No saved address found for this customer.</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outline" onClick={() => setAddressListModalOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstTreatmentModalOpen} onClose={() => setGstTreatmentModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>GST Treatment</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth>
                        <InputLabel>GST Treatment</InputLabel>
                        <Select
                            value={gstTreatmentDraft}
                            label="GST Treatment"
                            onChange={(event) => setGstTreatmentDraft(event.target.value)}
                        >
                            <MenuItem value="">Select GST Treatment</MenuItem>
                            {gstTreatmentOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button variant="outline" onClick={() => setGstTreatmentModalOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setGstPreference(gstTreatmentDraft);
                            setCustomerDetail((prev) => prev ? { ...prev, gst_preference: gstTreatmentDraft, gst_treatment: gstTreatmentDraft } : prev);
                            setGstTreatmentModalOpen(false);
                        }}
                        className="px-4 py-2 rounded border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gstPickerModalOpen} onClose={() => setGstPickerModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>GSTIN</DialogTitle>
                <DialogContent dividers>
                    <div className="space-y-3">
                        {gstDetails.map((gst) => (
                            <button
                                key={gst.id}
                                type="button"
                                onClick={() => {
                                    setGstDetailId(gst.id);
                                    if (gst.place_of_supply) setPlaceOfSupply(gst.place_of_supply);
                                    setGstPickerModalOpen(false);
                                }}
                                className={`w-full rounded border p-3 text-left text-sm hover:border-[#C72030] ${
                                    String(gstDetailId) === String(gst.id) ? 'border-[#C72030] bg-red-50' : 'border-gray-200'
                                }`}
                            >
                                <div className="font-medium text-gray-800">{gst.gstin || '-'}</div>
                                {gst.place_of_supply && <div className="text-gray-600">{gst.place_of_supply}</div>}
                            </button>
                        ))}
                        {gstDetails.length === 0 && (
                            <p className="text-sm text-gray-500">No GSTIN found for this customer.</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outline" onClick={() => setGstPickerModalOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreditNoteEditPage;
