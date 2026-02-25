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
    ChevronRight
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText } from 'lucide-react';
import axios from 'axios';

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
    quantity: number;
    rate: number;
    discount: number;
    discountType: 'percentage' | 'amount';
    tax: string;
    taxRate: number;
    amount: number;
    account:string ;
    customer: string
}

interface ExternalUser {
    name: string;
    email: string;
}

export const BillsAdd: React.FC = () => {
    const [subject, setSubject] = useState('');
    // Fetch item list from API
    useEffect(() => {
        const fetchItems = async () => {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`https://${baseUrl}/lock_account_items.json?lock_account_id=1`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                });
                if (res && res.data && Array.isArray(res.data)) {
                    setItemOptions(res.data.map(item => ({ id: item.id, name: item.name, rate: item.sale_rate, description: item.sale_description })));
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
                const res = await axios.get(`https://${baseUrl}/sales_persons.json?lock_account_id=1`, {
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
                const res = await axios.get(`https://${baseUrl}/payment_terms.json?lock_account_id=1`, {
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
        }
    ]);

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
            .get(`https://${baseUrl}/pms/suppliers.json?`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log("cust:", res)
                setCustomers(res?.data?.pms_suppliers || []);
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


    // Fetch customers on mount
    useEffect(() => {
        // setLoadingCustomers(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        // Fetch customer list
        axios
            .get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=1`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setCustomerOptions(res.data || []);
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

    // Account groups and ledgers for sales/purchase account dropdowns
    const [accountGroups, setAccountGroups] = React.useState([]);
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [openSalesAccount, setOpenSalesAccount] = React.useState(false);
    const [openPurchaseAccount, setOpenPurchaseAccount] = React.useState(false);

    React.useEffect(() => {
        const fetchAccountGroups = async () => {
            try {
                // Replace with your actual endpoint for groups/ledgers
                const res = await axios.get(`https://${baseUrl}/lock_accounts/1/lock_account_groups?format=flat`, {
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
        // Mock data - replace with actual API calls
        // setItemOptions([
        //     { id: '1', name: 'Cement', rate: 500 },
        //     { id: '2', name: 'Steel', rate: 800 },
        //     { id: '3', name: 'Bricks', rate: 10 },
        //     { id: '4', name: 'Paint', rate: 350 }
        // ]);

        // setSalespersons([
        //     { id: '1', name: 'Rajesh Kumar' },
        //     { id: '2', name: 'Priya Sharma' },
        //     { id: '3', name: 'Amit Patel' }
        // ]);

        // setTaxOptions([
        //     { id: '1', name: 'GST 18%', rate: 18 },
        //     { id: '2', name: 'GST 12%', rate: 12 },
        //     { id: '3', name: 'GST 5%', rate: 5 },
        //     { id: '4', name: 'No Tax', rate: 0 }
        // ]);

        // Set default terms and conditions
        setTermsAndConditions('1. Use this to issue for all sales orders of all customers.\n2. Payment should be made within 30 days of the invoice date.\n3. Late payments may incur additional charges.');
    }, []);

    // When customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            // setBillingAddress(selectedCustomer.billingAddress);
            // setShippingAddress(selectedCustomer.shippingAddress);
            setBillingAddress(selectedCustomer.address);
            setShippingAddress(selectedCustomer.address2);
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

        if (!selectedCustomer) newErrors.customer = 'Customer is required';
        if (!salesOrderDate) newErrors.salesOrderDate = 'Sales order date is required';
        if (!expectedShipmentDate) newErrors.expectedShipmentDate = 'Expected shipment date is required';
        if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

        const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
        if (!hasValidItems) newErrors.items = 'At least one valid item is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
console.log("items:",items)
    // Handle submit
    const handleSubmit = async (saveAsDraft: boolean = false) => {
        if (!saveAsDraft && !validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            // Build FormData for sale order
            const formData = new FormData();
            formData.append('lock_account_bill[pms_supplier_id]', selectedCustomer?.id || '');
            formData.append('lock_account_bill[order_number]', referenceNumber);
            formData.append('lock_account_bill[bill_date]', salesOrderDate);
            formData.append('lock_account_bill[due_date]', expectedShipmentDate);
            formData.append('lock_account_bill[payment_term_id]', selectedTerm);
            // formData.append('sale_order[delivery_method]', deliveryMethod);
            // formData.append('sale_order[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
            formData.append('lock_account_bill[notes]', customerNotes);
            // formData.append('lock_account_bill[terms_and_conditions]', termsAndConditions);
            formData.append('lock_account_bill[status]', 'draft');
            formData.append('lock_account_bill[subject]', subject || '');
            formData.append('lock_account_bill[total_amount]', String(totalAmount));
            if (discountTypeOnTotal === 'percentage') {
                formData.append('lock_account_bill[discount_per]', String(discountOnTotal));
                formData.append('lock_account_bill[discount_amount]', String(totalDiscount));
            } else {
                formData.append('lock_account_bill[discount_amount]', String(discountOnTotal));
            }
            formData.append('lock_account_bill[charge_amount]', String(adjustment));
            formData.append('lock_account_bill[charge_name]', adjustmentLabel);
            formData.append('lock_account_bill[charge_type]', adjustment >= 0 ? 'plus' : 'minus');
            formData.append('lock_account_bill[tax_type]', taxType.toLowerCase());
            const foundTax = taxOptions.find(t => t.id === selectedTax || t.name === selectedTax);
            formData.append('lock_account_bill[lock_account_tax_id]', (foundTax && foundTax.id ? foundTax.id : selectedTax || ''));

            // Sale order items
            items.forEach((item, idx) => {
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][lock_account_item_id]`, itemOptions.find(opt => opt.name === item.name)?.id || item.name);
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][rate]`, String(item.rate));
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][quantity]`, String(item.quantity));
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][total_amount]`, String(item.amount));
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][name]`, item.description || '');
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][lock_account_ledger_id]`, item.account || '');
                formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][lock_account_customer_id]`, item.customer || '');
            });

            // Email contact persons
            // selectedContactPersons.forEach((id, idx) => {
            //     formData.append(`lock_account_bill[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
            // });

            // Attachments
            attachments.forEach((file, idx) => {
                formData.append(`lock_account_bill[attachments_attributes][${idx}][document]`, file);
                formData.append(`lock_account_bill[attachments_attributes][${idx}][active]`, 'true');
            });

            await fetch(`https://${baseUrl}/lock_account_bills.json?lock_account_id=1`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                    // Do NOT set Content-Type, browser will set it for FormData
                },
                body: formData
            });

            alert(`Sales order ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
            navigate('/accounting/bills');
        } catch (error) {
            console.error('Error submitting sales order:', error);
            alert('Failed to create sales order');
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


                    `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=${type}&lock_account_id=1`;
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
                                            setSelectedCustomer(customer || null);
                                        }}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="" disabled>Select a customer</MenuItem>

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

                        {/* {selectedCustomer && (
                            <Button
                                variant="outlined"
                                onClick={() => setCustomerDrawerOpen(true)}
                                endIcon={<ChevronRight />}
                                sx={{ textTransform: 'none' }}
                            >
                                View Customer Details
                            </Button>
                        )} */}
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
                                value={selectedCustomer?.billing_address?.address
                                    ? `${selectedCustomer.billing_address.address}${selectedCustomer.billing_address.address_line_two ? ', ' + selectedCustomer.billing_address.address_line_two : ''}${selectedCustomer.billing_address.city ? ', ' + selectedCustomer.billing_address.city : ''}${selectedCustomer.billing_address.state ? ', ' + selectedCustomer.billing_address.state : ''}${selectedCustomer.billing_address.pin_code ? ' - ' + selectedCustomer.billing_address.pin_code : ''}`
                                    : billingAddress}
                                onChange={(e) => setBillingAddress(e.target.value)}
                                placeholder="Enter billing address"
                                disabled={!!selectedCustomer?.billing_address?.address}
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
                                value={selectedCustomer?.shipping_address?.address
                                    ? `${selectedCustomer.shipping_address.address}${selectedCustomer.shipping_address.address_line_two ? ', ' + selectedCustomer.shipping_address.address_line_two : ''}${selectedCustomer.shipping_address.city ? ', ' + selectedCustomer.shipping_address.city : ''}${selectedCustomer.shipping_address.state ? ', ' + selectedCustomer.shipping_address.state : ''}${selectedCustomer.shipping_address.pin_code ? ' - ' + selectedCustomer.shipping_address.pin_code : ''}`
                                    : shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter shipping address"
                                disabled={!!selectedCustomer?.shipping_address?.address || sameAsBilling}
                            />
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
                <Section title="Bill Details" icon={<Calendar className="w-5 h-5" />}>
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
                                Bill Date<span className="text-red-500">*</span>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Payment Terms<span className="text-red-500">*</span>
                            </label>
                            <FormControl fullWidth error={!!errors.paymentTerms}>
                                {/* <InputLabel>Payment Terms</InputLabel> */}
                                <Select
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
                                    {/* <MenuItem>
                                        <span className="text-blue-600 cursor-pointer" onClick={() => setShowConfig(true)}>
                                            Configure Terms
                                        </span>
                                    </MenuItem> */}
                                </Select>
                            </FormControl>
                            {/* Configure Payment Terms Modal */}
                            {showConfig && (
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
                        </div>

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
                                sx={fieldStyles}
                            />
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
                                        <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                                        {/* <th className="px-4 py-3 text-left text-sm font-medium">Discount</th> */}
                                        {/* <th className="px-4 py-3 text-left text-sm font-medium">Tax</th> */}
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
                                            {/* Customer Dropdown */}
                                            <td className="px-4 py-3">
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
                                            </td>
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
                                <span className="font-bold text-primary text-2xl">₹{totalAmount.toFixed(2)}</span>
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
                </Section> */}

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

                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    checked={displayAttachmentsInPortal}
                                    onChange={(e) => setDisplayAttachmentsInPortal(e.target.checked)}
                                />
                            }
                            label="Display attachments in customer portal and emails"
                        /> */}
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
                <Section title="Additional Fields" icon={<FileText className="w-5 h-5" />}>
                    <Typography variant="body2" className="text-gray-600">
                        Start adding custom fields for your payments made by going to Settings →  Purchases  → Bills.
                    </Typography>
                </Section>
            </div>

            <div className="flex items-center gap-3 justify-center pt-2">
                <Button
                    variant="outlined"
                    onClick={() => navigate('/accounting/sales-order')}
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
                                    <span className="text-xl font-bold text-blue-600">
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
