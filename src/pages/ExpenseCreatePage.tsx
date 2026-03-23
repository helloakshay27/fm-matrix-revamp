
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
import { Close, CloudUpload, Search } from '@mui/icons-material';
import { Receipt, FileText } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

// ── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
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

// ── Types ────────────────────────────────────────────────────────────────────
interface AccountLedger {
  id: number;
  name: string;
  formatted_name: string;
  lock_account_group_id: number;
  active: boolean;
  // Optional tax metadata returned by the API (used for auto tax selection)
  tax_preference?: string;
  tax_exemption_id?: number | null;
  tax_group_id?: number | null;
  intra_state_tax_rate_id?: number | null;
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
  hsnSacEditing: boolean;  // inline HSN/SAC edit mode per row
  taxType: string;         // 'tax_group' | 'non_taxable' | ''
  taxGroupId: string | number | null;
  taxExemptionId: string | number | null;
}

const EMPTY_LINE = (): ExpenseLine => ({
  accountId: '',
  accountType: 'goods',
  amount: '',
  notes: '',
  hsnSacCode: '',
  hsnSacEditing: false,
  taxType: '',
  taxGroupId: null,
  taxExemptionId: null,
});

// ── Indian states list ───────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ── GST treatments ───────────────────────────────────────────────────────────
const GST_TREATMENTS = [
  { value: 'registered_business_regular', label: 'Registered Business - Regular' },
  { value: 'registered_business_composition', label: 'Registered Business - Composition' },
  { value: 'unregistered_business', label: 'Unregistered Business' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'overseas', label: 'Overseas' },
  { value: 'special_economic_zone', label: 'Special Economic Zone' },
  { value: 'deemed_export', label: 'Deemed Export' },
  { value: 'non_gst_supply', label: 'Non-GST Supply' },
  { value: 'out_of_scope', label: 'Out of scope' },
  { value: 'tax_deductor', label: 'Tax Deductor' },
  { value: 'sez_developer', label: 'SEZ Developer' },
  { value: 'input_service_distributor', label: 'Input Service Distributor' },
];

// ── Shared field height styles ───────────────────────────────────────────────
const fieldStyles = {
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

// ── Helper: build safe API base URL ─────────────────────────────────────────
const getApiUrl = (): string => {
  const base = localStorage.getItem('baseUrl') || '';
  return base.startsWith('http') ? base : `https://${base}`;
};

// ── Component ────────────────────────────────────────────────────────────────
export const ExpenseCreatePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'New Expense';
  }, []);

  // ── Mode ─────────────────────────────────────────────────────────────────
  const [isItemized, setIsItemized] = useState(false);

  // ── Shared header fields (both modes) ────────────────────────────────────
  const [date, setDate] = useState('');
  const [paidThrough, setPaidThrough] = useState('');
  const [vendor, setVendor] = useState('');
  const [customer, setCustomer] = useState('');
  const [gstTreatment, setGstTreatment] = useState('');
  const [sourceOfSupply, setSourceOfSupply] = useState('');
  const [destinationOfSupply, setDestinationOfSupply] = useState('Maharashtra'); // ✅ full name default
  const [reverseCharge, setReverseCharge] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');   // ✅ maps to reference_number
  const [description, setDescription] = useState('');       // ✅ rendered in UI now

  // ── Single-expense fields ─────────────────────────────────────────────────
  const [expenseAccount, setExpenseAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [currency] = useState('INR');
  const [expenseType, setExpenseType] = useState<'goods' | 'services'>('goods');
  const [hsnCode, setHsnCode] = useState('');
  const [sacCode, setSacCode] = useState('');
  const [taxType, setTaxType] = useState('');
  const [taxGroupId, setTaxGroupId] = useState<number | string | null>(null);
  const [taxExemptionId, setTaxExemptionId] = useState<number | string | null>(null);
  const [amountIs, setAmountIs] = useState<'inclusive' | 'exclusive'>('exclusive');
  const [notes, setNotes] = useState('');

  // ── Itemized fields ───────────────────────────────────────────────────────
  const [lines, setLines] = useState<ExpenseLine[]>([EMPTY_LINE()]);
  const [amountsAre, setAmountsAre] = useState<'inclusive' | 'exclusive'>('exclusive'); // ✅ separate state
  const [taxOverride, setTaxOverride] = useState<'transaction' | 'lineitem'>('transaction');

  // ── Receipts ──────────────────────────────────────────────────────────────
  const [receipts, setReceipts] = useState<File[]>([]);

  // ── Dropdown data ─────────────────────────────────────────────────────────
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

  // ── Fetch account ledgers ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchAccountLedgers = async () => {
      setLoadingAccounts(true);
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('token');
        const lockAccountId = localStorage.getItem('lock_account_id');
        const res = await fetch(
          `${apiUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data: AccountLedger[] = await res.json();
          setAccountLedgers(data.filter(a => a.active));
        }
      } catch {
        sonnerToast.error('Failed to load accounts');
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccountLedgers();
  }, []);

  // ── Fetch vendors ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${apiUrl}/pms/purchase_orders/get_suppliers.json?access_token=${token}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success') setVendors(data.suppliers || []);
        }
      } catch {
        sonnerToast.error('Failed to load vendors');
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  // ── Fetch tax groups ──────────────────────────────────────────────────────
  useEffect(() => {
    const apiUrl = getApiUrl(); // ✅ safe URL helper used everywhere
    const token = localStorage.getItem('token');
    const lockId = localStorage.getItem('lock_account_id');
    setLoadingTaxGroups(true);
    axios
      .get(`${apiUrl}/lock_accounts/${lockId}/tax_groups_view.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTaxGroups(res.data || []))
      .catch(() => sonnerToast.error('Failed to load tax groups'))
      .finally(() => setLoadingTaxGroups(false));
  }, []);

  // ── Fetch exemptions ──────────────────────────────────────────────────────
  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const lockId = localStorage.getItem('lock_account_id');
    setLoadingExemptions(true);
    axios
      .get(
        `${apiUrl}/tax_exemptions.json?lock_account_id=${lockId}&q[exemption_type_eq]=item`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => setExemptions(res.data || []))
      .catch(() => sonnerToast.error('Failed to load exemptions'))
      .finally(() => setLoadingExemptions(false));
  }, []);

  // ── Fetch customers ───────────────────────────────────────────────────────
  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const lockAccountId = localStorage.getItem('lock_account_id');
    setLoadingCustomers(true);
    axios
      .get(`${apiUrl}/lock_account_customers.json?lock_account_id=${lockAccountId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      .then(res => setCustomers(res.data || []))  // ✅ removed unnecessary detail fetch
      .catch(() => sonnerToast.error('Failed to load customers'))
      .finally(() => setLoadingCustomers(false));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const calculateLineTax = (line: ExpenseLine) => {
    if (line.taxType !== 'tax_group' || !line.taxGroupId) return 0;
    const group = taxGroups.find(g => String(g.id) === String(line.taxGroupId));
    const amount = parseFloat(line.amount) || 0;
    if (!group || !Array.isArray(group.tax_rates)) return 0;
    return group.tax_rates.reduce((sum: number, rate: any) => {
      const pct = Number(rate.rate) || 0;
      return sum + (amount * pct) / 100;
    }, 0);
  };

  const calculateTaxForAmount = (
    amount: number,
    taxTypeVal: string,
    taxGroupIdVal: string | number | null
  ) => {
    if (taxTypeVal !== 'tax_group' || !taxGroupIdVal) return 0;
    const group = taxGroups.find(g => String(g.id) === String(taxGroupIdVal));
    if (!group || !Array.isArray(group.tax_rates)) return 0;
    return group.tax_rates.reduce((sum: number, rate: any) => {
      const pct = Number(rate.rate) || 0;
      return sum + (amount * pct) / 100;
    }, 0);
  };

  const calculateSubtotal = () =>
    lines.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0);

  const calculateTaxTotal = () =>
    lines.reduce((sum, line) => sum + calculateLineTax(line), 0);

  const calculateGrandTotal = () => calculateSubtotal() + calculateTaxTotal();

  const getLedgerTaxDefaults = (ledger: AccountLedger | undefined) => {
    if (!ledger) return { taxType: '', taxGroupId: null, taxExemptionId: null };

    const pref = ledger.tax_preference;
    if (pref === 'non_taxable') {
      return {
        taxType: 'non_taxable',
        taxGroupId: null,
        taxExemptionId: ledger.tax_exemption_id ?? null,
      };
    }

    if (pref === 'taxable') {
      return {
        taxType: 'tax_group',
        taxGroupId: ledger.tax_group_id ?? ledger.intra_state_tax_rate_id ?? null,
        taxExemptionId: null,
      };
    }

    if (pref === 'out_of_scope' || pref === 'non_gst_supply') {
      return { taxType: 'non_taxable', taxGroupId: null, taxExemptionId: null };
    }

    return { taxType: '', taxGroupId: null, taxExemptionId: null };
  };

  const applyLedgerTaxPreferences = (
    ledger: AccountLedger | undefined,
    setTaxChoice: (val: string) => void,
    setGroupId: (val: string | number | null) => void,
    setExemptionId: (val: string | number | null) => void
  ) => {
    const defaults = getLedgerTaxDefaults(ledger);
    setTaxChoice(defaults.taxType);
    setGroupId(defaults.taxGroupId);
    setExemptionId(defaults.taxExemptionId);
    return defaults;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 10 - receipts.length);
      setReceipts(prev => [...prev, ...newFiles]);
    }
  };

  const removeReceipt = (index: number) =>
    setReceipts(prev => prev.filter((_, i) => i !== index));

  // ── Update a single line field ────────────────────────────────────────────
  const updateLine = (idx: number, patch: Partial<ExpenseLine>) => {
    setLines(prev => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };

  // ── Tax select handler (shared by single view and each line) ──────────────
  const handleTaxChange = (
    val: string,
    setTT: (v: string) => void,
    setTG: (v: string | number | null) => void
  ) => {
    if (val === 'non_taxable' || val === '') {
      setTT(val);
      setTG(null);
    } else {
      setTT('tax_group');
      setTG(val);
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Date is required';
    if (!paidThrough) e.paidThrough = 'Paid through is required';
    if (!gstTreatment) e.gstTreatment = 'GST treatment is required';
    if (!sourceOfSupply) e.sourceOfSupply = 'Source of supply is required';
    if (!destinationOfSupply) e.destinationOfSupply = 'Destination is required';
    if (!invoiceNumber) e.invoiceNumber = 'Invoice number is required';

    if (!isItemized) {
      if (!expenseAccount) e.expenseAccount = 'Expense account is required';
      if (!amount || parseFloat(amount) <= 0) e.amount = 'Valid amount required';
    } else {
      lines.forEach((line, i) => {
        if (!line.accountId) e[`line_${i}_account`] = 'Account required';
        if (!line.amount || parseFloat(line.amount) <= 0) e[`line_${i}_amount`] = 'Amount required';
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const lockAccountId = localStorage.getItem('lock_account_id');

      const totalTaxAmount = isItemized
        ? calculateTaxTotal()
        : calculateTaxForAmount(parseFloat(amount) || 0, taxType, taxGroupId);

      // ── Build expense_accounts_attributes ────────────────────────────────
      let expenseAccountsAttributes: any[];

      if (!isItemized) {
        // Single line
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
        // Multiple lines — ✅ all fields correctly mapped
        expenseAccountsAttributes = lines.map(line => ({
          lock_account_ledger_id: parseInt(line.accountId),
          account_type: line.accountType,
          amount: parseFloat(line.amount) || 0,          // ✅ fixed parseFloat
          notes: line.notes,
          hsn_sac_code: line.hsnSacCode,                 // ✅ now populated from table input
          tax_type: line.taxType,                        // ✅ 'tax_group' | 'non_taxable' | ''
          ...(line.taxType === 'tax_group' && { tax_group_id: line.taxGroupId }),
          ...(line.taxType === 'non_taxable' && { tax_exemption_id: line.taxExemptionId }),
        }));
      }

      // ── Build top-level payload ───────────────────────────────────────────
      const payload = {
        expense: {
          paid_through_account_id: parseInt(paidThrough),
          ...(vendor && { vendor_id: parseInt(vendor) }),
          ...(customer && { customer_id: parseInt(customer) }),
          date,
          amount: isItemized
            ? lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0) // ✅ fixed
            : parseFloat(amount),
          reference_number: invoiceNumber,               // ✅ was always "" before — now correct
          description,                                   // ✅ now has UI field
          is_inclusive_tax: reverseCharge
            ? false
            : (isItemized ? amountsAre : amountIs) === 'inclusive',
          gst_treatment: gstTreatment,
          source_of_supply: sourceOfSupply,
          destination_of_supply: destinationOfSupply,
          reverse_charge: reverseCharge,
          total_tax_amount: totalTaxAmount,
          expense_accounts_attributes: expenseAccountsAttributes,
        },
      };

      const res = await fetch(
        `${apiUrl}/expenses.json?lock_account_id=${lockAccountId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
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

  // ── Shared GST block (used in both views) ─────────────────────────────────
  const GstFields = () => (
    <>
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
            <MenuItem value="">{loadingVendors ? 'Loading...' : 'Select a vendor'}</MenuItem>
            {vendors.map(v => (
              <MenuItem key={v.id} value={v.id.toString()}>{v.name}</MenuItem>
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
            {GST_TREATMENTS.map(t => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.gstTreatment && <p className="text-xs text-red-500 mt-1">{errors.gstTreatment}</p>}
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
            {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        {errors.sourceOfSupply && <p className="text-xs text-red-500 mt-1">{errors.sourceOfSupply}</p>}
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
            {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        {errors.destinationOfSupply && (
          <p className="text-xs text-red-500 mt-1">{errors.destinationOfSupply}</p>
        )}
      </div>

      <div className="md:col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="reverseCharge"
          checked={reverseCharge}
          onChange={e => {
            const checked = e.target.checked;
            setReverseCharge(checked);
            if (checked) {
              setAmountIs('exclusive');
              setAmountsAre('exclusive');
            }
          }}
        />
        <label htmlFor="reverseCharge" className="text-sm">
          This transaction is applicable for reverse charge
        </label>
      </div>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">Creating expense...</div>
        </div>
      )}

      <header className="sticky top-0 bg-background z-10 pb-4">
        <div>
          <h1 className="text-2xl font-bold">New Expense</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new expense record</p>
        </div>
      </header>

      <div className="space-y-6">
        <Section title="Expense Details" icon={<Receipt className="w-5 h-5" />}>
          {/* ── SINGLE VIEW ──────────────────────────────────────────────── */}
          {!isItemized ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth type="date" value={date}
                  onChange={e => setDate(e.target.value)}
                  error={!!errors.date} helperText={errors.date}
                  sx={fieldStyles} InputLabelProps={{ shrink: true }}
                />
              </div>

              {/* Expense Account + Itemize button */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expense Account <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-3">
                  <FormControl fullWidth error={!!errors.expenseAccount} sx={{ flex: 1 }}>
                    <Select
                      value={expenseAccount}
                      onChange={e => {
                        const val = e.target.value;
                        setExpenseAccount(val);

                        const selected = accountLedgers.find(acc => acc.id.toString() === String(val));
                        applyLedgerTaxPreferences(selected, setTaxType, setTaxGroupId, setTaxExemptionId);
                      }}
                      displayEmpty sx={fieldStyles} disabled={loadingAccounts}
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
                    variant="outlined" size="small"
                    onClick={() => setIsItemized(true)}
                    sx={{ mt: '4px', whiteSpace: 'nowrap' }}
                  >
                    Itemize
                  </Button>
                </div>
                {errors.expenseAccount && (
                  <p className="text-xs text-red-500 mt-1">{errors.expenseAccount}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth type="number" value={amount}
                  onChange={e => {
                    const parsed = parseFloat(e.target.value);
                    const safeAmount = isNaN(parsed) ? '' : Math.max(0, parsed).toString();
                    setAmount(safeAmount);
                  }}
                  error={!!errors.amount} helperText={errors.amount}
                  sx={fieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FormControl variant="standard" sx={{ minWidth: 60 }}>
                          <Select value={currency} disableUnderline>
                            <MenuItem value="INR">INR</MenuItem>
                          </Select>
                        </FormControl>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>

              {/* Paid Through */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Paid Through <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth error={!!errors.paidThrough}>
                  <Select
                    value={paidThrough} onChange={e => setPaidThrough(e.target.value)}
                    displayEmpty sx={fieldStyles} disabled={loadingAccounts}
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
                {errors.paidThrough && <p className="text-xs text-red-500 mt-1">{errors.paidThrough}</p>}
              </div>

              {/* Expense Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Expense Type</label>
                <RadioGroup row value={expenseType}
                  onChange={e => setExpenseType(e.target.value as 'goods' | 'services')}>
                  <FormControlLabel value="goods" control={<Radio />} label="Goods" />
                  <FormControlLabel value="services" control={<Radio />} label="Services" />
                </RadioGroup>
              </div>

              {/* HSN / SAC */}
              {expenseType === 'goods' && (
                <div>
                  <label className="block text-sm font-medium mb-2">HSN Code</label>
                  <TextField fullWidth value={hsnCode}
                    onChange={e => setHsnCode(e.target.value)}
                    placeholder="Enter HSN code" sx={fieldStyles} />
                </div>
              )}
              {expenseType === 'services' && (
                <div>
                  <label className="block text-sm font-medium mb-2">SAC Code</label>
                  <TextField fullWidth value={sacCode}
                    onChange={e => setSacCode(e.target.value)}
                    placeholder="Enter SAC code" sx={fieldStyles} />
                </div>
              )}

              {/* GST fields */}
              <GstFields />

              {/* Tax */}
              <div>
                <label className="block text-sm font-medium mb-2">Tax</label>
                <FormControl fullWidth>
                  <Select
                    value={taxType === 'tax_group' ? (taxGroupId ?? '') : (taxType || '')}
                    onChange={e =>
                      handleTaxChange(
                        e.target.value as string,
                        setTaxType,
                        setTaxGroupId
                      )
                    }
                    displayEmpty sx={fieldStyles} disabled={loadingTaxGroups}
                  >
                    <MenuItem value="" disabled>
                      {loadingTaxGroups ? 'Loading...' : 'Select a Tax'}
                    </MenuItem>
                    <MenuItem value="non_taxable">Non-Taxable</MenuItem>
                    <MenuItem disabled>── Tax Groups ──</MenuItem>
                    {taxGroups.map(g => (
                      <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
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
                        sx={fieldStyles} disabled={loadingExemptions}
                      >
                        <MenuItem value="" disabled>
                          {loadingExemptions ? 'Loading...' : 'Select Reason'}
                        </MenuItem>
                        {exemptions.map(ex => (
                          <MenuItem key={ex.id} value={ex.id}>{ex.reason}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>

              {/* Amount Is — hidden when reverse charge is active (matches Zoho behaviour) */}
              {!reverseCharge && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Amount Is</label>
                  <RadioGroup row value={amountIs}
                    onChange={e => setAmountIs(e.target.value as 'inclusive' | 'exclusive')}>
                    <FormControlLabel value="inclusive" control={<Radio />} label="Tax Inclusive" />
                    <FormControlLabel value="exclusive" control={<Radio />} label="Tax Exclusive" />
                  </RadioGroup>
                </div>
              )}

              {/* Invoice # */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice# <span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  error={!!errors.invoiceNumber} helperText={errors.invoiceNumber}
                  sx={fieldStyles}
                />
              </div>

              {/* Description ✅ now has UI field */}
              {/* <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <TextField
                  fullWidth value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter description"
                  sx={fieldStyles}
                />
              </div> */}

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <TextField
                  fullWidth multiline rows={3} value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Max. 500 characters"
                  // sx={fieldStyles}
                  sx={{
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
              </div>

              {/* Customer + Reporting Tags */}
              <div className="md:col-span-2 flex items-start gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <FormControl fullWidth>
                    <Select
                      value={customer} onChange={e => setCustomer(e.target.value)}
                      displayEmpty sx={fieldStyles} disabled={loadingCustomers}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton size="small"><Search fontSize="small" /></IconButton>
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        {loadingCustomers ? 'Loading...' : 'Select a customer'}
                      </MenuItem>
                      {customers.map(c => (
                        <MenuItem key={c.id} value={c.id.toString()}>{c.name}</MenuItem>
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
            /* ── ITEMIZED VIEW ──────────────────────────────────────────── */
            <div className="space-y-6">
              {/* Top row: Date + Paid Through */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    error={!!errors.date} helperText={errors.date}
                    sx={fieldStyles} InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paid Through <span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth error={!!errors.paidThrough}>
                    <Select
                      value={paidThrough} onChange={e => setPaidThrough(e.target.value)}
                      displayEmpty sx={fieldStyles} disabled={loadingAccounts}
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
                  {errors.paidThrough && (
                    <p className="text-xs text-red-500 mt-1">{errors.paidThrough}</p>
                  )}
                </div>
              </div>

              {/* GST block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GstFields />
              </div>

              {/* Amounts are + Tax Override */}
              <div className="space-y-3">
                {!reverseCharge && (
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-medium w-28 shrink-0">Amounts are</span>
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
                  <span className="text-sm font-medium w-28 shrink-0">Tax Override</span>
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

              {/* ── Itemized Table ── */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-56">
                        Expense Account
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-44">
                        Tax
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                        Amount (₹)
                      </th>
                      <th className="px-3 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lines.map((line, idx) => (
                      <tr key={idx}>

                        {/* ── Expense Account cell ──
                            - Account dropdown
                            - Goods / Services dropdown below it
                            - HSN Code / SAC inline "Update" link (Zoho-style)
                        */}
                        <td className="px-3 py-3 align-middle"> 
                          <div className="flex flex-col gap-1">
                            {/* Account selector */}
                            <FormControl fullWidth size="small" error={!!errors[`line_${idx}_account`]}>
                              <Select
                                value={line.accountId}
                                onChange={e => {
                                  const value = e.target.value;
                                  const selectedLedger = accountLedgers.find(acc => acc.id.toString() === String(value));
                                  const defaults = getLedgerTaxDefaults(selectedLedger);
                                  updateLine(idx, {
                                    accountId: value,
                                    taxType: defaults.taxType,
                                    taxGroupId: defaults.taxGroupId,
                                    taxExemptionId: defaults.taxExemptionId,
                                  });
                                }}
                                displayEmpty
                              >
                                <MenuItem value="">Select account</MenuItem>
                                {accountLedgers.map(acc => (
                                  <MenuItem key={acc.id} value={acc.id.toString()}>
                                    {acc.formatted_name || acc.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {errors[`line_${idx}_account`] && (
                              <p className="text-xs text-red-500">{errors[`line_${idx}_account`]}</p>
                            )}

                            {/* Goods / Services dropdown */}
                            <FormControl size="small" sx={{ width: 'fit-content', minWidth: 110 }}>
                              <Select
                                value={line.accountType}
                                onChange={e => {
                                  updateLine(idx, {
                                    accountType: e.target.value as 'goods' | 'services',
                                    hsnSacCode: '',       // reset code when type changes
                                    hsnSacEditing: false, // collapse input on type change
                                  });
                                }}
                              >
                                <MenuItem value="goods">Goods</MenuItem>
                                <MenuItem value="services">Services</MenuItem>
                              </Select>
                            </FormControl>

                            {/* HSN / SAC inline — Zoho-style "label: ✏️ Update" link */}
                            {!line.hsnSacEditing ? (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <span className="font-medium text-gray-600">
                                  {line.accountType === 'goods' ? 'HSN Code:' : 'SAC:'}
                                </span>
                                {line.hsnSacCode && (
                                  <span className="text-gray-700">{line.hsnSacCode}</span>
                                )}
                                <button
                                  type="button"
                                  className="flex items-center gap-0.5 text-blue-500 hover:text-blue-700 ml-1"
                                  onClick={() => updateLine(idx, { hsnSacEditing: true })}
                                >
                                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-2.5-2.5zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                  </svg>
                                  Update
                                </button>
                              </div>
                            ) : (
                              /* Expanded input when editing */
                              <div className="flex items-center gap-1 mt-0.5">
                                <TextField
                                  size="small"
                                  value={line.hsnSacCode}
                                  onChange={e => updateLine(idx, { hsnSacCode: e.target.value })}
                                  placeholder={line.accountType === 'goods' ? 'Enter HSN code' : 'Enter SAC code'}
                                  autoFocus
                                  sx={{ width: 150, '& .MuiInputBase-input': { fontSize: 12, py: '5px', px: '8px' } }}
                                  onBlur={() => updateLine(idx, { hsnSacEditing: false })}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === 'Escape')
                                      updateLine(idx, { hsnSacEditing: false });
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="px-3 py-3 align-middle">
                          <TextField
                            fullWidth size="small" multiline minRows={2}
                            value={line.notes}
                            onChange={e => updateLine(idx, { notes: e.target.value })}
                            placeholder="Max. 500 characters"
                            sx={{
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
                        </td>

                        {/* Tax */}
                        <td className="px-3 py-3 align-middle">
                          <FormControl fullWidth size="small">
                            <Select
                              value={
                                line.taxType === 'tax_group'
                                  ? (line.taxGroupId ?? '')
                                  : (line.taxType || '')
                              }
                              onChange={e => {
                                const val = e.target.value as string;
                                if (val === 'non_taxable' || val === '') {
                                  updateLine(idx, { taxType: val, taxGroupId: null });
                                } else {
                                  updateLine(idx, { taxType: 'tax_group', taxGroupId: val });
                                }
                              }}
                              displayEmpty
                            >
                              <MenuItem value="">Select a Tax</MenuItem>
                              <MenuItem value="non_taxable">Non-Taxable</MenuItem>
                              <MenuItem disabled>── Tax Groups ──</MenuItem>
                              {taxGroups.map(g => (
                                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* Exemption reason for non-taxable lines */}
                          {line.taxType === 'non_taxable' && (
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                              <Select
                                value={line.taxExemptionId || ''}
                                onChange={e =>
                                  updateLine(idx, { taxExemptionId: e.target.value || null })
                                }
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  {loadingExemptions ? 'Loading...' : 'Exemption Reason'}
                                </MenuItem>
                                {exemptions.map(ex => (
                                  <MenuItem key={ex.id} value={ex.id}>{ex.reason}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-3 py-3 align-middle">
                          <TextField
                            fullWidth size="small" type="number"
                            value={line.amount}
                            onChange={e => {
                              const parsed = parseFloat(e.target.value);
                              const safeAmount = isNaN(parsed) ? '' : Math.max(0, parsed).toString();
                              updateLine(idx, { amount: safeAmount });
                            }}
                            error={!!errors[`line_${idx}_amount`]}
                            helperText={errors[`line_${idx}_amount`]}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </td>

                        {/* Remove row */}
                        <td className="px-3 py-3 align-middle">
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

              <div className="flex justify-between items-center mt-2">
                <Button
                  variant="outlined"
                  onClick={() => setLines(prev => [...prev, EMPTY_LINE()])}
                >
                  + Add New Row
                </Button>
                <div className="text-right space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Subtotal: ₹{calculateSubtotal().toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tax: ₹{calculateTaxTotal().toFixed(2)}
                  </div>
                  <div className="text-base font-semibold">
                    Total: ₹{calculateGrandTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setIsItemized(false)}
              >
                ← Back to single expense view
              </button>

              {/* Invoice # + Description + Customer (itemized footer) */}
              <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Invoice# <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    error={!!errors.invoiceNumber} helperText={errors.invoiceNumber}
                    sx={fieldStyles}
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <TextField
                    fullWidth value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter description"
                    sx={fieldStyles}
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <FormControl fullWidth>
                    <Select
                      value={customer} onChange={e => setCustomer(e.target.value)}
                      displayEmpty sx={fieldStyles} disabled={loadingCustomers}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton size="small"><Search fontSize="small" /></IconButton>
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        {loadingCustomers ? 'Loading...' : 'Select a customer'}
                      </MenuItem>
                      {customers.map(c => (
                        <MenuItem key={c.id} value={c.id.toString()}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-2">Reporting Tags</label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline mt-1"
                    onClick={() => setShowTagModal(true)}
                  >
                    Associate Tags
                  </button>
                </div> */}
              </div>

              {/* Attachments (itemized) */}
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
                        type="file" multiple accept="image/*,.pdf"
                        onChange={handleFileUpload} className="hidden"
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
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
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
          )}
        </Section>

        {/* Receipts section — single view only */}
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
                      type="file" multiple accept="image/*,.pdf"
                      onChange={handleFileUpload} className="hidden"
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
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outlined" onClick={() => navigate('/accounting/expense')}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          Save
        </Button>
      </div>

      {/* Reporting Tags Modal */}
      {/* <Dialog open={showTagModal} onClose={() => setShowTagModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center" padding={2}>
          Associate Tags
          <IconButton onClick={() => setShowTagModal(false)}><Close /></IconButton>
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
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTagModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowTagModal(false)}>Save</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        open={showTagModal}
        onClose={() => setShowTagModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center border-b">
          Associate Tags
          <IconButton onClick={() => setShowTagModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>

          {/* ✅ Row Layout */}
          <div className="flex items-center justify-between gap-4">

            {/* Left Label */}
            <span className="text-sm text-gray-700 min-w-[100px]">
              Accounts
            </span>

            {/* Right Dropdown */}
            <FormControl size="small" className="w-full">
              <Select
                value={reportingTagAccount}
                displayEmpty
                onChange={(e) => setReportingTagAccount(e.target.value)}
                className="bg-white"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="account1">Account 1</MenuItem>
                <MenuItem value="account2">Account 2</MenuItem>
              </Select>
            </FormControl>

          </div>

        </DialogContent>

        <DialogActions className="px-6 pb-4">
          <Button variant="contained" onClick={() => setShowTagModal(false)}>
            Save
          </Button>
          <Button onClick={() => setShowTagModal(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};