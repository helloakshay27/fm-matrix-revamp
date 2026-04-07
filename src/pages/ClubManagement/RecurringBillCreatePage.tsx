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
  PersonAdd,
  ChevronRight
} from '@mui/icons-material';
import { ShoppingCart, Package, Calendar, FileText, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button as ShadButton } from '@/components/ui/button';


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

export const RecurringBillCreatePage: React.FC = () => {
  // Subject field
  const [subject, setSubject] = useState('');
  // Fetch item list from API
  useEffect(() => {
    const fetchItems = async () => {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const lock_account_id = localStorage.getItem('lock_account_id');
      try {
        const res = await axios.get(`https://${baseUrl}/lock_account_items.json?lock_account_id=${lock_account_id}`, {
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
    document.title = 'New Sales Order';
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
  const [profileName, setProfileName] = useState("");
  const [repeatCount, setRepeatCount] = useState("");
  const [repeatType, setRepeatType] = useState("month");
  const [neverExpires, setNeverExpires] = useState(false);

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
  const [sourceOfSupply, setSourceOfSupply] = useState("");
  const [destinationOfSupply, setDestinationOfSupply] = useState("");
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
  const [placeOfSupply, setPlaceOfSupply] = useState("");
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
        setCustomers(res.data?.pms_suppliers || []);
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
    // const newErrors: Record<string, string> = {};

    // if (!selectedCustomer) newErrors.customer = 'Vendor is required';
    // if (!salesOrderDate) newErrors.salesOrderDate = 'Start date is required';
    // if (!neverExpires) {
    //   if (!expectedShipmentDate) {
    //     newErrors.expectedShipmentDate = 'End date is required';
    //   } else {
    //     const minDate = new Date('2026-02-12');
    //     const enteredDate = new Date(expectedShipmentDate);
    //     if (isNaN(enteredDate.getTime())) {
    //       newErrors.expectedShipmentDate = 'Please enter a valid end date';
    //     } else if (enteredDate < minDate) {
    //       newErrors.expectedShipmentDate = 'End date must be after 11-02-2026';
    //     }
    //   }
    // }
    // if (!paymentTerms) newErrors.paymentTerms = 'Payment terms is required';

    // const hasValidItems = items.some(item => item.name && item.quantity > 0 && item.rate > 0);
    // if (!hasValidItems) newErrors.items = 'At least one valid item is required';

    // setErrors(newErrors);
    // if (Object.keys(newErrors).length > 0) {
    //   toast.error('Please fill all mandatory fields before saving.');
    // }
    // return Object.keys(newErrors).length === 0;


    

     if (!selectedCustomer) {
        toast.error("Vendor is required");
        return false;
    }

    if (!sourceOfSupply) {
        toast.error("Source of Supply is required");
        return false;
    }

    if (!destinationOfSupply) {
        toast.error("Destination of Supply is required");
        return false;
    }
if (!profileName || profileName.trim() === "") {
        toast.error("Profile name is required");
        return false;
    }

    if (!salesOrderDate) {
        toast.error("Start On date is required");
        return false;
    }

    if (!neverExpires) {

        if (!expectedShipmentDate) {
            toast.error("Ends On date is required");
            return false;
        }

        const startDate = new Date(salesOrderDate);
        const endDate = new Date(expectedShipmentDate);

        if (isNaN(endDate.getTime())) {
            toast.error("Please enter valid Ends On date");
            return false;
        }

        if (endDate < startDate) {
            toast.error("Ends On date cannot be earlier than Start On date");
            return false;
        }
    }

    if (!selectedTerm) {
        toast.error("Payment terms is required");
        return false;
    }

    const hasValidItems = items.some(
        item => item.name && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidItems) {
        toast.error("Please add at least one valid item");
        return false;
    }

    return true;
  };


  // --- INVOICE PAYLOADS ---

  const invoicePayload2 = {
    lock_account_bill: {
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
      lock_account_bill_items_attributes: items.map(item => ({
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
  console.log('Invoice Payload:', invoicePayload2);

  // Handle submit
  const handleSubmit = async (saveAsDraft: boolean = false) => {
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
        'lock_account_bill[sub_total_amount]',
        String(subTotal)
      );

      formData.append(
        'lock_account_bill[taxable_amount]',
        String(totalGSTAmount)
      );

      formData.append(
        'lock_account_bill[lock_account_tax_amount]',
        String(taxAmount2)
      );
      formData.append('lock_account_bill[pms_supplier_id]', selectedCustomer?.id || '');
      formData.append('lock_account_bill[order_number]', referenceNumber);
      formData.append('lock_account_bill[payment_term_id]', selectedTerm);
      formData.append('lock_account_bill[delivery_method]', deliveryMethod);
      formData.append('lock_account_bill[sales_person_id]', salespersons.find(sp => sp.name === salesperson)?.id || salesperson);
      formData.append('lock_account_bill[customer_notes]', customerNotes);
      formData.append('lock_account_bill[terms_and_conditions]', termsAndConditions);
      formData.append('lock_account_bill[subject]', subject);
      formData.append('lock_account_bill[status]', 'draft');
      formData.append('lock_account_bill[total_amount]', String(totalAmount2));
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
      // formData.append('lock_account_bill[place_of_supply]', placeOfSupply); //new added

      //new
      formData.append('lock_account_bill[source_of_supply]', sourceOfSupply || '');
      formData.append('lock_account_bill[destination_of_supply]', destinationOfSupply || '');
      formData.append('lock_account_bill[recurring]', 'true');
      formData.append('lock_account_bill[profile_name]', profileName);

      // formData.append('lock_account_bill[recurring_detail][start_date]', salesOrderDate);
      // formData.append('lock_account_bill[recurring_detail][end_date]', neverExpires ? '' : expectedShipmentDate);

      // formData.append(
      //   'lock_account_bill[recurring_detail][repeat_type]',
      //   repeatType
      // );

      // formData.append(
      //   'lock_account_bill[recurring_detail][repeat_value]',
      //   String(repeatCount)
      // );

      // formData.append(
      //   'lock_account_bill[recurring_detail][never_expires]',
      //   neverExpires ? 'true' : 'false'
      // );

      formData.append('recurring_detail[start_date]', salesOrderDate);

      formData.append(
        'recurring_detail[end_date]',
        neverExpires ? '' : expectedShipmentDate
      );

      formData.append(
        'recurring_detail[repeat_type]',
        repeatType
      );

      formData.append(
        'recurring_detail[repeat_value]',
        String(repeatCount)
      );

      formData.append(
        'recurring_detail[never_expires]',
        neverExpires ? 'true' : 'false'
      );
      // Invoice items
      items.forEach((item, idx) => {
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][lock_account_item_id]`, itemOptions.find(opt => opt.name === item.name)?.id || item.name);
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][rate]`, String(item.rate));
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][quantity]`, String(item.quantity));
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][total_amount]`, String(item.amount));
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][description]`, item.description || '');

        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][tax_type]`, String(item.item_tax_type));
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][tax_group_id]`, String(item.tax_group_id));
        formData.append(`lock_account_bill[lock_account_bill_charges_attributes][${idx}][tax_exemption_id]`, String(item.tax_exemption_id));
      });

      // Email contact persons
      selectedContactPersons.forEach((id, idx) => {
        formData.append(`lock_account_bill[email_contact_persons_attributes][${idx}][contact_person_id]`, String(id));
      });

      // Attachments
      attachments.forEach((file, idx) => {
        formData.append(`lock_account_bill[attachments_attributes][${idx}][document]`, file);
        formData.append(`lock_account_bill[attachments_attributes][${idx}][active]`, 'true');
      });

      await fetch(`https://${baseUrl}/lock_account_bills.json?lock_account_id=${lock_account_id}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
          // Do NOT set Content-Type, browser will set it for FormData
        },
        body: formData
      });

      // alert(`Recurring Invoice ${saveAsDraft ? 'saved as draft' : 'created'} successfully!`);
      navigate('/accounting/recurring-bills');
    } catch (error) {
      console.error('Error submitting invoice:', error);
      alert('Failed to create invoice');
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

  // Re-preselect tax on all taxable items when destination changes
  useEffect(() => {
    if (!destinationOfSupply) return;
    const isMaharashtra = destinationOfSupply === "Maharashtra";
    setItems(prev => prev.map(item => {
      if (!["tax_group", "tax_rate"].includes(item.item_tax_type)) return item;
      const matched = itemOptions.find(opt => opt.name === item.name);
      if (!matched) return item;
      return {
        ...item,
        item_tax_type: isMaharashtra ? "tax_group" : "tax_rate",
        tax_group_id: isMaharashtra ? matched.tax_group_id : matched.inter_state_tax_rate_id,
      };
    }));
  }, [destinationOfSupply]); // eslint-disable-line react-hooks/exhaustive-deps

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
  return (
    <div className="p-6 space-y-6 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}

      {/* <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Recurring Bill</h1>
      </header> */}


      <header className="mb-4">

        {/* Back Button - Top */}
        <button
          type="button"
          onClick={() => navigate('/accounting/recurring-bills')}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          Back to Recurring Bill List
        </button>

        {/* Title - Below */}
        <h1 className="text-2xl font-bold text-black">
          New Recurring Bill
        </h1>

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
                    <MenuItem value="">Select a  Vendor </MenuItem>
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
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="United States">United States</MenuItem>
                    <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                  </TextField>
                </div>
              </div>
            )} */}


            {selectedCustomer && (
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
              <textarea
                className={`w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y ${!!selectedCustomer ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                rows={4}
                maxLength={500}
                value={selectedCustomer?.billing_address?.address
                  ? `${selectedCustomer.billing_address.address}${selectedCustomer.billing_address.address_line_two ? ', ' + selectedCustomer.billing_address.address_line_two : ''}${selectedCustomer.billing_address.city ? ', ' + selectedCustomer.billing_address.city : ''}${selectedCustomer.billing_address.state ? ', ' + selectedCustomer.billing_address.state : ''}${selectedCustomer.billing_address.pin_code ? ' - ' + selectedCustomer.billing_address.pin_code : ''}`
                  : billingAddress}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setBillingAddress(e.target.value);
                }}
                placeholder="Enter billing address"
                disabled={!!selectedCustomer}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{billingAddress.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Shipping Address
              </label>
              <textarea
                className={`w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y ${!!selectedCustomer || sameAsBilling ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                rows={4}
                maxLength={500}
                value={selectedCustomer?.shipping_address?.address
                  ? `${selectedCustomer.shipping_address.address}${selectedCustomer.shipping_address.address_line_two ? ', ' + selectedCustomer.shipping_address.address_line_two : ''}${selectedCustomer.shipping_address.city ? ', ' + selectedCustomer.shipping_address.city : ''}${selectedCustomer.shipping_address.state ? ', ' + selectedCustomer.shipping_address.state : ''}${selectedCustomer.shipping_address.pin_code ? ' - ' + selectedCustomer.shipping_address.pin_code : ''}`
                  : shippingAddress}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setShippingAddress(e.target.value);
                }}
                placeholder="Enter shipping address"
                disabled={!!selectedCustomer || sameAsBilling}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{shippingAddress.length}/500</p>
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
        <Section title=" Recurring Bill Details" icon={<Calendar className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Name<span className="text-red-500">*</span>
              </label>
              <TextField
                fullWidth
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
                sx={fieldStyles}
              />
            </div>


            {/* 
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
            </div> */}

            {/* Repeat Every */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Repeat Every
              </label>

              <div className="flex gap-2">

                <TextField
                  type="number"
                  placeholder="Enter"
                  size="small"
                  value={repeatCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || Number(val) > 0) setRepeatCount(val);
                  }}
                  onKeyDown={(e) => (e.key === '-' || e.key === '+' || e.key === 'e') && e.preventDefault()}
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: "90px" }}
                />

                <FormControl fullWidth size="small">
                  <Select
                    value={repeatType}
                    onChange={(e) => setRepeatType(e.target.value)}
                    sx={fieldStyles}
                  >

                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>

                  </Select>
                </FormControl>

              </div>
            </div>


            <div>
              <label className="block text-sm font-medium mb-2">
                Start On<span className="text-red-500">*</span>
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
                inputProps={{ min: "2026-02-12" }}
              />
            </div>



            <div className="flex gap-4 items-end">

              {/* Ends On Date */}
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">
                  Ends On<span className="text-red-500">*</span>
                </label>

                <TextField
                  fullWidth
                  type="date"
                  value={neverExpires ? "" : expectedShipmentDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const entered = new Date(val);
                      const minDate = salesOrderDate
                        ? new Date(new Date(salesOrderDate).getTime() + 86400000)
                        : new Date('2026-02-12');
                      if (isNaN(entered.getTime())) {
                        toast.error('Please enter a valid end date.');
                        return;
                      }
                      if (entered <= new Date(salesOrderDate)) {
                        toast.error('End date must be after the Start On date.');
                        return;
                      }
                    }
                    setExpectedShipmentDate(val);
                  }}
                  disabled={neverExpires}
                  error={!neverExpires && !!errors.expectedShipmentDate}
                  helperText={!neverExpires ? errors.expectedShipmentDate : ""}
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: salesOrderDate
                      ? new Date(new Date(salesOrderDate).getTime() + 86400000).toISOString().split('T')[0]
                      : "2026-02-12"
                  }}
                />
              </div>

              {/* Never Expires Checkbox */}
              <div className="flex items-center pb-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={neverExpires}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNeverExpires(checked);

                        if (checked) {
                          setExpectedShipmentDate(""); // clear date
                        }
                      }}
                    />
                  }
                  label="Never Expires"
                />
              </div>

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

  {/* Label */}
  <label className="block text-sm font-medium mb-2">
    Payment Terms<span className="text-red-500">*</span>
  </label>

  {/* Select */}
  <FormControl fullWidth>

    <Select
      value={selectedTerm || ""}
      onChange={(e) => setSelectedTerm(e.target.value)}
      displayEmpty
      sx={fieldStyles}

      renderValue={(val) => {

        if (!val) {
          return (
            <span className="text-gray-400">
              Select payment term
            </span>
          );
        }

        const found = filteredTerms.find(
          term => term.id === val
        );

        return found ? found.name : val;

      }}
    >

      {/* Placeholder */}
      <MenuItem value="">
        Select payment term
      </MenuItem>

      {/* Payment term list */}
      {filteredTerms.map(term => (

        <MenuItem
          key={term.id || term.name}
          value={term.id}
        >
          {term.name}
        </MenuItem>

      ))}

    </Select>

  </FormControl>


  {/* Configure Payment Terms Modal */}
  {showConfig && (

    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          Configure Payment Terms
        </h2>

        <table className="w-full mb-4 text-sm">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-2 border">
                Term Name
              </th>

              <th className="p-2 border">
                Number of Days
              </th>

              <th className="p-2 border">
              </th>

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

                    onChange={(e) =>
                      handleNewRowChange(
                        idx,
                        "name",
                        e.target.value
                      )
                    }
                  />

                </td>


                <td className="border p-2">

                  <input
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Days"
                    type="number"
                    value={row.days}

                    onChange={(e) =>
                      handleNewRowChange(
                        idx,
                        "days",
                        e.target.value
                      )
                    }
                  />

                </td>


                <td className="border p-2">

                  <button
                    className="text-red-600 text-xs"

                    onClick={async () => {

                      if (row.id) {

                        await handleRemovePaymentTerm(
                          row.id,
                          idx
                        );

                      } else {

                        handleRemoveNewRow(idx);

                      }

                    }}
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* Add new term button */}
        <div className="flex gap-2 mb-3">

          <button
            className="text-blue-600 text-sm"

            onClick={handleAddNewTerm}
          >
            + Add New
          </button>

        </div>


        {/* Save / Cancel */}
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

              setEditTerms(
                paymentTerms.map(term => ({
                  ...term
                }))
              );

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

            {/* <div>
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

            <div className="border border-border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
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
                                if (selectedItem.tax_preference === 'non_taxable') {
                                  updateItem(index, 'item_tax_type', 'non_taxable');
                                  updateItem(index, 'tax_exemption_id', selectedItem.tax_exemption_id);
                                }
                                if (selectedItem.tax_preference === 'taxable') {
                                  const isMaharashtra = destinationOfSupply === 'Maharashtra';
                                  updateItem(index, 'item_tax_type', isMaharashtra ? 'tax_group' : 'tax_rate');
                                  updateItem(index, 'tax_group_id', isMaharashtra ? selectedItem.tax_group_id : selectedItem.inter_state_tax_rate_id);
                                }
                                if (selectedItem.tax_preference === 'out_of_scope') {
                                  updateItem(index, 'item_tax_type', 'out_of_scope');
                                }
                                if (selectedItem.tax_preference === 'non_gst_supply') {
                                  updateItem(index, 'item_tax_type', 'non_gst_supply');
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
                        {/* <TextField
                          fullWidth
                          size="small"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          sx={{ mt: 1 }}
                        /> */}

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
                            const val = parseFloat(e.target.value);
                            if (e.target.value === '' || val >= 0) {
                              updateItem(index, 'rate', e.target.value === '' ? '' : val);
                            }
                          }}
                          onKeyDown={(e) => (e.key === '-' || e.key === '+' || e.key === 'e') && e.preventDefault()}
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
                              const value = e.target.value;
                              const isMaharashtra = destinationOfSupply === "Maharashtra";

                              if (["non_taxable", "out_of_scope", "non_gst_supply"].includes(value)) {
                                updateItem(index, "item_tax_type", value);
                                updateItem(index, "tax_group_id", null);
                                if (value === "non_taxable") {
                                  setCurrentItemIndex(index);
                                  setExemptionModalOpen(true);
                                }
                              } else {
                                updateItem(index, "item_tax_type", isMaharashtra ? "tax_group" : "tax_rate");
                                updateItem(index, "tax_group_id", value);
                              }
                            }}
                          >
                            <MenuItem value="">Select Tax</MenuItem>

                            {taxTypeOptions.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}

                            {destinationOfSupply === "Maharashtra" ? (
                              [
                                <MenuItem key="__divider__" disabled>Tax Groups</MenuItem>,
                                ...taxGroups.map((group) => (
                                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                                ))
                              ]
                            ) : (
                              [
                                <MenuItem key="__divider__" disabled>Tax Rates</MenuItem>,
                                ...taxRates.map((rate) => (
                                  <MenuItem key={rate.id} value={rate.id}>{rate.name}</MenuItem>
                                ))
                              ]
                            )}
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
              <ShadButton
                variant="outline"
                onClick={addItem}
              >
                <Add className="w-4 h-4 mr-1" />
                Add New Row
              </ShadButton>
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
                    onChange={(e) => setDiscountOnTotal(parseFloat(e.target.value) || '')}
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
        <Section title="Notes" icon={<FileText className="w-5 h-5" />}>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
            rows={3}
            maxLength={500}
            value={customerNotes}
            onChange={(e) => {
              if (e.target.value.length <= 500) setCustomerNotes(e.target.value);
            }}
            placeholder="Enter any notes for the bill"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{customerNotes.length}/500</p>
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
        </Section> */}

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
                </Typography> */}
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
        {/* <Section title="Additional Custom Fields" icon={<FileText className="w-5 h-5" />}>
          <Typography variant="body2" className="text-gray-600">
            Add custom fields to your sales orders by going to Settings → Sales → Sales Orders → Field Customization
          </Typography>
        </Section> */}
      </div>

      <div className="flex items-center gap-3 justify-center pt-2">
       
        <ShadButton className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save '}
        </ShadButton>
         <ShadButton variant="outline" onClick={() => navigate('/accounting/recurring-bills')} disabled={isSubmitting}>
          Cancel
        </ShadButton>
        {/* <ShadButton className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save as Open'}
        </ShadButton> */}
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
                    {/* {selectedCustomer.name.charAt(0)} */}
                  </span>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold">
                    {/* {selectedCustomer.name} */}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {/* {selectedCustomer.email} */}
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
