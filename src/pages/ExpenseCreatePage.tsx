import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Search,
} from '@mui/icons-material';
import { Receipt, FileText } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

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

interface AccountLedger {
  id: number;
  name: string;
  formatted_name: string;
  lock_account_group_id: number;
  active: boolean;
}

interface Vendor {
  id: number;
  name: string;
}

interface ExpenseLine {
  accountId: string;
  accountType: 'goods' | 'services';
  amount: string;
  notes: string;
  hsnSacCode: string;
  taxType: string;
  taxGroupId: string | number | null;
  taxExemptionId: string | number | null;
}

export const ExpenseCreatePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'New Expense';
  }, []);

  // ── Main states ─────────────────────────────────────────────────────────────
  const [isItemized, setIsItemized] = useState(false);

  // Single expense fields
  const [date, setDate] = useState('');
  const [expenseAccount, setExpenseAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [paidThrough, setPaidThrough] = useState('');
  const [expenseType, setExpenseType] = useState<'goods' | 'services'>('goods');
  const [hsnCode, setHsnCode] = useState('');
  const [sacCode, setSacCode] = useState('');
  const [vendor, setVendor] = useState('');
  const [gstTreatment, setGstTreatment] = useState('');
  const [sourceOfSupply, setSourceOfSupply] = useState('');
  const [destinationOfSupply, setDestinationOfSupply] = useState('MH');
  const [reverseCharge, setReverseCharge] = useState(false);
  const [taxType, setTaxType] = useState('');
  const [taxGroupId, setTaxGroupId] = useState<number | string | null>(null);
  const [taxExemptionId, setTaxExemptionId] = useState<number | string | null>(null);
  const [amountIs, setAmountIs] = useState<'inclusive' | 'exclusive'>('exclusive');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [customer, setCustomer] = useState('');

  // Itemized mode
  const [lines, setLines] = useState<ExpenseLine[]>([
    { 
      accountId: '', 
      accountType: 'goods',
      amount: '', 
      notes: '', 
      hsnSacCode: '',
      taxType: '',
      taxGroupId: null,
      taxExemptionId: null
    },
  ]);
  const [taxOverrideLevel, setTaxOverrideLevel] = useState<'transaction' | 'line'>('transaction');
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');

  const [amountsAre, setAmountsAre] = useState('exclusive'); // default Tax Exclusive
  const [taxOverride, setTaxOverride] = useState('transaction'); // default At Transaction Level

  // Receipts
  const [receipts, setReceipts] = useState<File[]>([]);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  // Dropdown data
  const [accountLedgers, setAccountLedgers] = useState<AccountLedger[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [taxGroups, setTaxGroups] = useState<any[]>([]);
  const [exemptions, setExemptions] = useState<any[]>([]);

  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);
  const [loadingExemptions, setLoadingExemptions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showTagModal, setShowTagModal] = useState(false);
  const [reportingTagAccount, setReportingTagAccount] = useState('');

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAccountLedgers = async () => {
      setLoadingAccounts(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const lockAccountId = localStorage.getItem('lock_account_id');

        const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

        const res = await fetch(
          `${apiUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data: AccountLedger[] = await res.json();
          setAccountLedgers(data.filter(a => a.active));
        }
      } catch (err) {
        sonnerToast.error('Failed to load accounts');
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccountLedgers();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

        const res = await fetch(
          `${apiUrl}/pms/purchase_orders/get_suppliers.json?access_token=${token}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success') setVendors(data.suppliers || []);
        }
      } catch (err) {
        sonnerToast.error('Failed to load vendors');
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const lockId = localStorage.getItem('lock_account_id');

    setLoadingTaxGroups(true);
    axios
      .get(`https://${baseUrl}/lock_accounts/${lockId}/tax_groups_view.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTaxGroups(res.data || []))
      .catch(() => sonnerToast.error('Failed to load tax groups'))
      .finally(() => setLoadingTaxGroups(false));
  }, []);

  useEffect(() => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const lockId = localStorage.getItem('lock_account_id');

    setLoadingExemptions(true);
    axios
      .get(`https://${baseUrl}/tax_exemptions.json?lock_account_id=${lockId}&q[exemption_type_eq]=item`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setExemptions(res.data || []))
      .catch(() => sonnerToast.error('Failed to load exemptions'))
      .finally(() => setLoadingExemptions(false));
  }, []);

  // Fetch customers
  useEffect(() => {
    setLoadingCustomers(true);
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const lockAccountId = localStorage.getItem('lock_account_id');

    axios
      .get(`https://${baseUrl}/lock_account_customers.json?lock_account_id=${lockAccountId}`, {
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
              console.log('Customer detail:', detailRes.data);
            })
            .catch(err => console.error('Error fetching customer detail:', err));
        }
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        sonnerToast.error('Failed to load customers');
      })
      .finally(() => {
        setLoadingCustomers(false);
      });
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const calculateTotal = () => {
    return lines
      .reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0)
      .toFixed(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 10 - receipts.length);
      setReceipts(prev => [...prev, ...newFiles]);
    }
  };

  const removeReceipt = (index: number) => {
    setReceipts(prev => prev.filter((_, i) => i !== index));
  };

  // ── Validation (basic) ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) newErrors.date = 'Date is required';
    if (!paidThrough) newErrors.paidThrough = 'Paid through is required';
    if (!gstTreatment) newErrors.gstTreatment = 'GST treatment is required';
    if (!sourceOfSupply) newErrors.sourceOfSupply = 'Source of supply is required';
    if (!destinationOfSupply) newErrors.destinationOfSupply = 'Destination is required';
    if (!invoiceNumber) newErrors.invoiceNumber = 'Invoice number is required';

    if (!isItemized) {
      if (!expenseAccount) newErrors.expenseAccount = 'Expense account is required';
      if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valid amount required';
    } else {
      lines.forEach((line, i) => {
        if (!line.accountId) newErrors[`line_${i}_account`] = 'Account required';
        if (!line.amount || parseFloat(line.amount) <= 0) newErrors[`line_${i}_amount`] = 'Amount required';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const lockAccountId = localStorage.getItem('lock_account_id');

      const apiUrl = baseUrl?.startsWith('http') ? baseUrl : `https://${baseUrl}`;

      // Build expense accounts attributes
      let expenseAccountsAttributes: any[] = [];

      if (!isItemized) {
        // Single expense line
        expenseAccountsAttributes = [
          {
            lock_account_ledger_id: parseInt(expenseAccount),
            account_type: expenseType,
            amount: parseFloat(amount),
            notes: notes,
            hsn_sac_code: expenseType === 'goods' ? hsnCode : sacCode,
            tax_type: taxType,
            ...(taxType === 'tax_group' && { tax_group_id: taxGroupId }),
            ...(taxType === 'non_taxable' && { tax_exemption_id: taxExemptionId }),
          },
        ];
      } else {
        // Itemized expenses
        expenseAccountsAttributes = lines.map(line => ({
          lock_account_ledger_id: parseInt(line.accountId),
          account_type: line.accountType,
          amount: parseFloat(line.amount),
          notes: line.notes,
          hsn_sac_code: line.hsnSacCode,
          tax_type: line.taxType,
          ...(line.taxType === 'tax_group' && { tax_group_id: line.taxGroupId }),
          ...(line.taxType === 'non_taxable' && { tax_exemption_id: line.taxExemptionId }),
        }));
      }

      // Build the payload
      const payload = {
        expense: {
          paid_through_account_id: parseInt(paidThrough),
          ...(vendor && { vendor_id: parseInt(vendor) }),
          ...(customer && { customer_id: parseInt(customer) }),
          date: date,
          amount: isItemized ? lines.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0) : parseFloat(amount),
          reference_number: referenceNumber,
          description: description,
          is_inclusive_tax: amountIs === 'inclusive',
          gst_treatment: gstTreatment,
          source_of_supply: sourceOfSupply,
          destination_of_supply: destinationOfSupply,
          reverse_charge: reverseCharge,
          total_tax_amount: totalTaxAmount,
          expense_accounts_attributes: expenseAccountsAttributes,
        },
      };

      const res = await fetch(`${apiUrl}/expenses.json?lock_account_id=${lockAccountId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        sonnerToast.success('Expense created successfully!');
        navigate('/accounting/expense');
      } else {
        const err = await res.json();
        sonnerToast.error(err.message || 'Failed to create expense');
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      sonnerToast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">Creating expense...</div>
        </div>
      )}

      <header className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4">
        <div>
          <h1 className="text-2xl font-bold">New Expense</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new expense record</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outlined" onClick={() => navigate('/accounting/expense')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Expense Details */}
        <Section title="Expense Details" icon={<Receipt className="w-5 h-5" />}>
          {!isItemized ? (
            // ── SINGLE VIEW ───────────────────────────────────────────────────
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date}
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Expense Account <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-3">
                  <FormControl fullWidth error={!!errors.expenseAccount} sx={{ flex: 1 }}>
                    <Select
                      value={expenseAccount}
                      onChange={e => setExpenseAccount(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingAccounts}
                    >
                      <MenuItem value="" disabled>
                        {loadingAccounts ? 'Loading...' : 'Select an account'}
                      </MenuItem>
                      {accountLedgers.map(acc => (
                        <MenuItem key={acc.id} value={acc.id.toString()}>
                          {acc.formatted_name || acc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsItemized(true)}
                    sx={{ mt: '28px', whiteSpace: 'nowrap' }}
                  >
                    Itemize
                  </Button>
                </div>
                {!!errors.expenseAccount && (
                  <p className="text-xs text-red-500 mt-1">{errors.expenseAccount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  sx={fieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FormControl variant="standard" sx={{ minWidth: 60 }}>
                          <Select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            disableUnderline
                          >
                            <MenuItem value="INR">INR</MenuItem>
                          </Select>
                        </FormControl>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Paid Through <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth error={!!errors.paidThrough}>
                  <Select
                    value={paidThrough}
                    onChange={e => setPaidThrough(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                    disabled={loadingAccounts}
                  >
                    <MenuItem value="" disabled>
                      {loadingAccounts ? 'Loading...' : 'Select an account'}
                    </MenuItem>
                    {accountLedgers.map(acc => (
                      <MenuItem key={acc.id} value={acc.id.toString()}>
                        {acc.formatted_name || acc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Expense Type</label>
                <RadioGroup
                  row
                  value={expenseType}
                  onChange={e => setExpenseType(e.target.value as 'goods' | 'services')}
                >
                  <FormControlLabel value="goods" control={<Radio />} label="Goods" />
                  <FormControlLabel value="services" control={<Radio />} label="Services" />
                </RadioGroup>
              </div>

              {expenseType === 'goods' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    HSN Code <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    value={hsnCode}
                    onChange={e => setHsnCode(e.target.value)}
                    placeholder="Enter HSN code"
                    sx={fieldStyles}
                  />
                </div>
              )}

              {expenseType === 'services' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SAC Code <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    value={sacCode}
                    onChange={e => setSacCode(e.target.value)}
                    placeholder="Enter SAC code"
                    sx={fieldStyles}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Vendor</label>
                <FormControl fullWidth>
                  <Select
                    value={vendor}
                    onChange={e => setVendor(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                    disabled={loadingVendors}
                  >
                    <MenuItem value="">
                      {loadingVendors ? 'Loading...' : 'Select a vendor'}
                    </MenuItem>
                    {vendors.map(v => (
                      <MenuItem key={v.id} value={v.id.toString()}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GST Treatment <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth error={!!errors.gstTreatment}>
                  <Select
                    value={gstTreatment}
                    onChange={e => setGstTreatment(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>Select treatment</MenuItem>
                    <MenuItem value="registered_business_regular">Registered Business - Regular</MenuItem>
                    <MenuItem value="registered_business_composition">Registered Business - Composition</MenuItem>
                    <MenuItem value="unregistered_business">Unregistered Business</MenuItem>
                    <MenuItem value="consumer">Consumer</MenuItem>
                    <MenuItem value="overseas">Overseas</MenuItem>
                    <MenuItem value="special_economic_zone">Special Economic Zone</MenuItem>
                    <MenuItem value="deemed_export">Deemed Export</MenuItem>
                    <MenuItem value="non_gst_supply">Non-GST Supply</MenuItem>
                    <MenuItem value="out_of_scope">Out of scope</MenuItem>
                    <MenuItem value="tax_deductor">Tax Deductor</MenuItem>
                    <MenuItem value="sez_developer">SEZ Developer</MenuItem>
                    <MenuItem value="input_service_distributor">Input Service Distributor</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Source of Supply <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth error={!!errors.sourceOfSupply}>
                  <Select
                    value={sourceOfSupply}
                    onChange={e => setSourceOfSupply(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>State/Province</MenuItem>
                    {indianStates.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Destination of Supply <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth error={!!errors.destinationOfSupply}>
                  <Select
                    value={destinationOfSupply}
                    onChange={e => setDestinationOfSupply(e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>Select destination</MenuItem>
                    {indianStates.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reverseCharge"
                  checked={reverseCharge}
                  onChange={e => setReverseCharge(e.target.checked)}
                />
                <label htmlFor="reverseCharge" className="text-sm">
                  This transaction is applicable for reverse charge
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tax</label>
                <FormControl fullWidth>
                  <Select
                    value={taxType === 'tax_group' ? taxGroupId : taxType || ''}
                    onChange={e => {
                      const val = e.target.value;
                      if (['non_taxable'].includes(val as string)) {
                        setTaxType(val as string);
                        setTaxGroupId(null);
                      } else {
                        setTaxType('tax_group');
                        setTaxGroupId(val);
                      }
                    }}
                    displayEmpty
                    sx={fieldStyles}
                    disabled={loadingTaxGroups}
                  >
                    <MenuItem value="" disabled>
                      {loadingTaxGroups ? 'Loading...' : 'Select a Tax'}
                    </MenuItem>
                    <MenuItem value="non_taxable">Non-Taxable</MenuItem>
                    <MenuItem disabled>── Tax Groups ──</MenuItem>
                    {taxGroups.map(g => (
                      <MenuItem key={g.id} value={g.id}>
                        {g.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {taxType === 'non_taxable' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2">Exemption Reason</label>
                    <FormControl fullWidth>
                      <Select
                        value={taxExemptionId || ''}
                        onChange={e => setTaxExemptionId(e.target.value || null)}
                        sx={fieldStyles}
                        disabled={loadingExemptions}
                      >
                        <MenuItem value="" disabled>
                          {loadingExemptions ? 'Loading...' : 'Select Reason'}
                        </MenuItem>
                        {exemptions.map(ex => (
                          <MenuItem key={ex.id} value={ex.id}>
                            {ex.reason}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Amount Is</label>
                <RadioGroup
                  row
                  value={amountIs}
                  onChange={e => setAmountIs(e.target.value as 'inclusive' | 'exclusive')}
                >
                  <FormControlLabel value="inclusive" control={<Radio />} label="Tax Inclusive" />
                  <FormControlLabel value="exclusive" control={<Radio />} label="Tax Exclusive" />
                </RadioGroup>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice# <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  error={!!errors.invoiceNumber}
                  helperText={errors.invoiceNumber}
                  sx={fieldStyles}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Max. 500 characters"
                  sx={fieldStyles}
                />
              </div>

              <div className="md:col-span-2 flex items-start gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <FormControl fullWidth>
                    <Select
                      value={customer}
                      onChange={e => setCustomer(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingCustomers}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <Search fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        {loadingCustomers ? 'Loading...' : 'Select a customer'}
                      </MenuItem>
                      {customers.map(c => (
                        <MenuItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-2">Reporting Tags</label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowTagModal(true)}
                  >
                    Associate Tags
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ── ITEMIZED VIEW ─────────────────────────────────────────────────
            <div className="space-y-6">
              {/* Top Fields: Date and Header fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    error={!!errors.date}
                    helperText={errors.date}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paid Through <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth error={!!errors.paidThrough}>
                    <Select
                      value={paidThrough}
                      onChange={e => setPaidThrough(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingAccounts}
                    >
                      <MenuItem value="" disabled>
                        {loadingAccounts ? 'Loading...' : 'Select an account'}
                      </MenuItem>
                      {accountLedgers.map(acc => (
                        <MenuItem key={acc.id} value={acc.id.toString()}>
                          {acc.formatted_name || acc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* GST Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Vendor</label>
                  <FormControl fullWidth>
                    <Select
                      value={vendor}
                      onChange={e => setVendor(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingVendors}
                    >
                      <MenuItem value="">
                        {loadingVendors ? 'Loading...' : 'Select a vendor'}
                      </MenuItem>
                      {vendors.map(v => (
                        <MenuItem key={v.id} value={v.id.toString()}>
                          {v.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GST Treatment <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth error={!!errors.gstTreatment}>
                    <Select
                      value={gstTreatment}
                      onChange={e => setGstTreatment(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select treatment</MenuItem>
                      <MenuItem value="registered_business_regular">Registered Business - Regular</MenuItem>
                      <MenuItem value="registered_business_composition">Registered Business - Composition</MenuItem>
                      <MenuItem value="unregistered_business">Unregistered Business</MenuItem>
                      <MenuItem value="consumer">Consumer</MenuItem>
                      <MenuItem value="overseas">Overseas</MenuItem>
                      <MenuItem value="special_economic_zone">Special Economic Zone</MenuItem>
                      <MenuItem value="deemed_export">Deemed Export</MenuItem>
                      <MenuItem value="non_gst_supply">Non-GST Supply</MenuItem>
                      <MenuItem value="out_of_scope">Out of scope</MenuItem>
                      <MenuItem value="tax_deductor">Tax Deductor</MenuItem>
                      <MenuItem value="sez_developer">SEZ Developer</MenuItem>
                      <MenuItem value="input_service_distributor">Input Service Distributor</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Source of Supply <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth error={!!errors.sourceOfSupply}>
                    <Select
                      value={sourceOfSupply}
                      onChange={e => setSourceOfSupply(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select state</MenuItem>
                      {indianStates.map(state => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination of Supply <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth error={!!errors.destinationOfSupply}>
                    <Select
                      value={destinationOfSupply}
                      onChange={e => setDestinationOfSupply(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select destination</MenuItem>
                      {indianStates.map(state => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

              <div className="flex items-center gap-6 md:col-span-2">
  <label className="text-sm font-medium w-40 shrink-0">Reverse Charge</label>
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id="reverseChargeItemized"
      checked={reverseCharge}
      onChange={e => setReverseCharge(e.target.checked)}
    />
    <label htmlFor="reverseChargeItemized" className="text-sm text-gray-600">
      This transaction is applicable for reverse charge
    </label>
  </div>
</div>
              </div>

              {/* Amounts are and Tax Override sections */}
              <div className="md:col-span-3 space-y-4">
                {!reverseCharge && (
                  <div className="flex items-center gap-6">
                    <label className="block text-sm font-medium">Amounts are</label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="amountsAre" value="inclusive"
                        checked={amountsAre === 'inclusive'}
                        onChange={() => setAmountsAre('inclusive')} />
                      Tax Inclusive
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="amountsAre" value="exclusive"
                        checked={amountsAre === 'exclusive'}
                        onChange={() => setAmountsAre('exclusive')} />
                      Tax Exclusive
                    </label>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium">Apply Tax Override</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="taxOverride" value="transaction"
                      checked={taxOverride === 'transaction'}
                      onChange={() => setTaxOverride('transaction')} />
                    At Transaction Level
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="taxOverride" value="lineitem"
                      checked={taxOverride === 'lineitem'}
                      onChange={() => setTaxOverride('lineitem')} />
                    At Line Item Level
                  </label>
                </div>
              </div>

              {/* Table */}
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          EXPENSE ACCOUNT
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          NOTES
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          TAX
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          AMOUNT (₹)
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lines.map((line, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-4" style={{ verticalAlign: 'top' }}>
                            <div className="flex flex-col gap-1">
                              <FormControl fullWidth size="small">
                                <Select
                                  value={line.accountId}
                                  onChange={e => {
                                    const newLines = [...lines];
                                    newLines[idx].accountId = e.target.value;
                                    setLines(newLines);
                                  }}
                                >
                                  <MenuItem value="">Select account</MenuItem>
                                  {accountLedgers.map(acc => (
                                    <MenuItem key={acc.id} value={acc.id.toString()}>
                                      {acc.formatted_name || acc.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl size="small" sx={{ mt: 1, width: 'fit-content', minWidth: 160 }}>
                                <Select
                                  value={line.accountType}
                                  onChange={e => {
                                    const newLines = [...lines];
                                    newLines[idx].accountType = e.target.value;
                                    setLines(newLines);
                                  }}
                                >
                                  <MenuItem value="goods">Goods</MenuItem>
                                  <MenuItem value="services">Services</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </td>
                          <td className="px-4 py-4" style={{ verticalAlign: 'top' }}>
                            <TextField
                              fullWidth
                              size="small"
                              value={line.notes}
                              onChange={e => {
                                const newLines = [...lines];
                                newLines[idx].notes = e.target.value;
                                setLines(newLines);
                              }}
                              placeholder="Max 500 characters"
                            />
                          </td>
                          <td className="px-4 py-4" style={{ verticalAlign: 'top' }}>
                            <FormControl fullWidth size="small">
                              <Select
                                value={line.tax}
                                onChange={e => {
                                  const newLines = [...lines];
                                  newLines[idx].tax = e.target.value;
                                  setLines(newLines);
                                }}
                              >
                                <MenuItem value="">Select Tax</MenuItem>
                                {taxGroups.map(g => (
                                  <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </td>
                          <td className="px-4 py-4" style={{ verticalAlign: 'top' }}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={line.amount}
                              onChange={e => {
                                const newLines = [...lines];
                                newLines[idx].amount = e.target.value;
                                setLines(newLines);
                              }}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </td>
                          <td className="px-4 py-4" style={{ verticalAlign: 'top' }}>
                            {lines.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setLines([...lines, { 
                        accountId: '', 
                        accountType: 'goods',
                        amount: '', 
                        notes: '', 
                        hsnSacCode: '',
                        taxType: '',
                        taxGroupId: null,
                        taxExemptionId: null
                      }])
                    }
                  >
                    + Add New Row
                  </Button>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Expense Total (₹) {calculateTotal()}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setIsItemized(false)}
                  >
                    ← Back to single expense view
                  </button>
                </div>
              </div>

              {/* Invoice, Customer Name, and Attachments */}
              <div className="border-t pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Invoice# <span className="text-red-500">*</span>
                    </label>
                    <TextField
                      fullWidth
                      value={invoiceNumber}
                      onChange={e => setInvoiceNumber(e.target.value)}
                      error={!!errors.invoiceNumber}
                      helperText={errors.invoiceNumber}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Name</label>
                    <FormControl fullWidth>
                      <Select
                        value={customer}
                        onChange={e => setCustomer(e.target.value)}
                        displayEmpty
                        sx={fieldStyles}
                        disabled={loadingCustomers}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <Search fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">
                          {loadingCustomers ? 'Loading...' : 'Select a customer'}
                        </MenuItem>
                        {customers.map(c => (
                          <MenuItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* Attachments */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold mb-4">Attachments</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CloudUpload className="w-10 h-10 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Drag or Drop your Receipts</p>
                        <p className="text-xs text-gray-500 mt-1">Maximum file size allowed is 10MB</p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Upload your Files
                        </span>
                      </label>
                    </div>
                  </div>

                  {receipts.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {receipts.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <IconButton size="small" onClick={() => removeReceipt(i)}>
                            <Close fontSize="small" className="text-red-600" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Receipts Section - Only shown in single view */}
        {!isItemized && (
        <Section title="Receipts" icon={<FileText className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
              <div className="flex flex-col items-center gap-4">
                <CloudUpload className="w-12 h-12 text-blue-500" />
                <div>
                  <p className="font-medium">Drag or Drop your Receipts</p>
                  <p className="text-sm text-gray-500 mt-1">Maximum file size allowed is 10MB</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Upload your Files
                  </span>
                </label>
              </div>
            </div>

            {receipts.length > 0 && (
              <div className="space-y-2">
                {receipts.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <IconButton size="small" onClick={() => removeReceipt(i)}>
                      <Close fontSize="small" className="text-red-600" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
        )}
      </div>

      {/* Reporting Tags Modal */}
      <Dialog open={showTagModal} onClose={() => setShowTagModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          Associate Tags
          <IconButton onClick={() => setShowTagModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>   
            <InputLabel>Accounts</InputLabel>
            <Select
              value={reportingTagAccount}
              label="Accounts"
              onChange={e => setReportingTagAccount(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {/* Add real tag accounts here */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTagModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowTagModal(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};