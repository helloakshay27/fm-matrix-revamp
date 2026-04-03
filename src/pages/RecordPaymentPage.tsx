import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button as MuiButton,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import {
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Receipt,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Smartphone,
  Star,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

// Section component - matching InvoiceAdd design
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
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

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export interface Customer {
  id: number;
  salutation: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  mobile: string;
  pan: string;
  gst_treatment?: string;
  gstin?: string;
}

interface Ledger {
  id: number;
  name: string;
}

interface GroupLedger {
  id: number;
  name: string;
  lock_account_id: number;
  lock_account_group_id: number;
}

interface LockAccountGroup {
  id: number;
  group_name: string;
  ledgers: GroupLedger[];
}

interface UnpaidInvoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  balance_due: number;
  // optional field that might be provided by the API later
  payment_received_on?: string;
}

interface InvoicePaymentRow extends UnpaidInvoice {
  paymentReceivedOn: string;
  withholdingTax: string;
  payment: string;
}

const PAYMENT_MODES = [
  "Bank Remittance",
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Credit Card",
  "UPI",
];

interface ContactPerson {
  id: number;
  first_name: string;
  last_name: string;
  salutation?: string;
  email: string;
  mobile?: string;
  phone?: string;
  work_phone?: string;
}

interface CustomerDetail {
  id: number;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  gstin?: string;
  gst_treatment?: string;
  customer_type?: string;
  currency?: string;
  payment_terms?: string;
  portal_status?: string;
  customer_language?: string;
  place_of_supply?: string;
  tax_preference?: string;
  outstanding_receivable_amount?: number;
  unused_credits_receivable_amount?: number;
  contact_persons?: ContactPerson[];
  billing_address?: {
    address?: string;
    address_line_two?: string;
    city?: string;
    state?: string;
    pin_code?: string;
    country?: string;
    phone?: string;
  };
  shipping_address?: {
    address?: string;
    address_line_two?: string;
    city?: string;
    state?: string;
    pin_code?: string;
    country?: string;
  };
}

export const RecordPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>(
    ""
  );
  const [activeTab, setActiveTab] = useState(0);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const [amountReceived, setAmountReceived] = useState("");
  const [bankCharges, setBankCharges] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [depositTo, setDepositTo] = useState("");
  const [reference, setReference] = useState("");
  const [taxDeducted, setTaxDeducted] = useState("no");
  const [tdsAccount, setTdsAccount] = useState("Advance Tax");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Customer Advance fields
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [descriptionOfSupply, setDescriptionOfSupply] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advanceBankCharges, setAdvanceBankCharges] = useState("");
  const [advanceTax, setAdvanceTax] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("15");

  const [receivedFullAmount, setReceivedFullAmount] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [invoiceRows, setInvoiceRows] = useState<InvoicePaymentRow[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendThankYou, setSendThankYou] = useState(true);

  // Customer Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null);
  const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState(0);

  // Drawer Accordions State
  const [contactPersonsExpanded, setContactPersonsExpanded] = useState(false);
  const [addressExpanded, setAddressExpanded] = useState(false);

  const openCustomerDrawer = async () => {
    if (!selectedCustomerId) return;
    setDrawerOpen(true);
    setCustomerDetailLoading(true);
    try {
      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/${selectedCustomerId}.json`,
        { headers: authHeaders }
      );
      setCustomerDetail(res.data?.data || res.data || null);
    } catch {
      setCustomerDetail(null);
    } finally {
      setCustomerDetailLoading(false);
    }
  };

  // Customer Advance – Deposit To dropdown (flattened ledgers from lock_account_groups)
  const [advanceDepositTo, setAdvanceDepositTo] = useState("");
  const [advanceDepositLedgers, setAdvanceDepositLedgers] = useState<GroupLedger[]>([]);
  const [advanceDepositGroupsLoading, setAdvanceDepositGroupsLoading] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Fetch customers on mount
  useEffect(() => {
    axios
      .get(
        `https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        const data: Customer[] = res.data?.data || res.data || [];
        setCustomers(data);
      })
      .catch(() => setCustomers([]));
  }, []);

  // Fetch ledgers on mount
  useEffect(() => {
    axios
      .get(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_ledgers.json`,
        {
          headers: authHeaders,
        }
      )
      .then((res) => {
        const data: Ledger[] = res.data?.data || res.data || [];
        setLedgers(data);
      })
      .catch(() => setLedgers([]));
  }, []);

  // Fetch lock_account_groups for Customer Advance "Deposit To" dropdown
  // API returns groups, each with a nested `ledgers` array – flatten them for the dropdown
  useEffect(() => {
    setAdvanceDepositGroupsLoading(true);
    axios
      .get(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat`,
        { headers: authHeaders }
      )
      .then((res) => {
        const groups: LockAccountGroup[] = res.data?.data || res.data || [];
        // Flatten: collect every ledger from every group into one list
        const flat = groups.flatMap((g) =>
          Array.isArray(g.ledgers) ? g.ledgers : []
        );
        setAdvanceDepositLedgers(flat);
      })
      .catch(() => setAdvanceDepositLedgers([]))
      .finally(() => setAdvanceDepositGroupsLoading(false));
  }, []);

  // Fetch unpaid invoices directly when customer changes
  useEffect(() => {
    if (!selectedCustomerId) {
      setInvoiceRows([]);
      return;
    }

    // sanity checks before issuing request
    if (!baseUrl || !token) {
      setInvoiceError("Missing base URL or auth token");
      return;
    }

    setInvoiceError(null);
    setInvoicesLoading(true);
    axios
      .get(`https://${baseUrl}/lock_account_invoices.json`, {
        params: {
          lock_account_id: lock_account_id,
          "q[lock_account_customer_id_eq]": selectedCustomerId,
          // "q[sent_eq]": 1,
          "q[status_not_eq]": "paid",
        },
        headers: authHeaders,
        timeout: 10000, // 10 seconds, avoid hanging indefinitely
      })
      .then((res) => {
        const data: UnpaidInvoice[] = res.data?.data || res.data || [];
        const today = format(new Date(), "yyyy-MM-dd");
        const rows = data.map((inv) => ({
          ...inv,
          // prefer an existing saved date if API returns it
          paymentReceivedOn: inv.payment_received_on || today,
          withholdingTax: "",
          payment: inv.balance_due?.toString() ?? "",
        }));
        setInvoiceRows(rows);
        const total = rows.reduce(
          (s, r) => s + (parseFloat(r.payment) || 0),
          0
        );
        setAmountReceived(total.toFixed(2));
      })
      .catch((err) => {
        console.error("Invoice fetch error", err);
        setInvoiceError("Failed to load invoices. Please try again later.");
        setInvoiceRows([]);
      })
      .finally(() => setInvoicesLoading(false));
  }, [selectedCustomerId]);

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) ?? null;

  const getCustomerDisplayName = (c: Customer) =>
    [c.salutation, c.first_name, c.last_name].filter(Boolean).join(" ") ||
    c.company_name ||
    c.email;

  const totalPayment = invoiceRows.reduce(
    (sum, r) => sum + (parseFloat(r.payment) || 0),
    0
  );

  // if we're in "received full amount" mode, keep the amountReceived synced with invoice payments
  useEffect(() => {
    if (receivedFullAmount) {
      setAmountReceived(totalPayment.toFixed(2));
    }
  }, [invoiceRows, receivedFullAmount, totalPayment]);

  const handlePayInFull = (id: number) => {
    setInvoiceRows((rows) =>
      rows.map((r) =>
        r.id === id ? { ...r, payment: r.balance_due?.toString() ?? "" } : r
      )
    );
  };

  const handleInvoiceRowChange = (
    id: number,
    field: keyof InvoicePaymentRow,
    value: string
  ) => {
    setInvoiceRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (status: "draft" | "paid") => {
    // Centralized Validation for mandatory fields
    const errors: string[] = [];
    if (!selectedCustomerId) errors.push("Customer Name is required");
    if (!date) errors.push("Payment Date is required");
    if (!paymentNumber) errors.push("Payment # is required");

    if (activeTab === 0) {
      if (!amountReceived || parseFloat(amountReceived) <= 0) {
        errors.push("Amount Received must be a valid number greater than 0");
      }
      if (!depositTo) {
        errors.push("Deposit To account is required");
      }
    } else {
      // Customer Advance specific validation
      if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
        errors.push("Amount Received must be a valid number greater than 0");
      }
      if (!advanceDepositTo) {
        errors.push("Deposit To account is required");
      }
      if (selectedCustomerId && !placeOfSupply) {
        errors.push("Place of Supply is required");
      }
    }

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    setSubmitting(true);
    try {
      let payload: any = {};

      if (activeTab === 0) {
        const excessAmount = Math.max(
          0,
          (parseFloat(amountReceived) || 0) - totalPayment
        );
        payload = {
          lock_payment: {
            payment_of: "LockAccountCustomer",
            payment_of_id: selectedCustomerId,
            payment_made: false,
            paid_amount: parseFloat(amountReceived) || 0,
            bank_charges: parseFloat(bankCharges) || 0,
            payment_date: format(parseISO(date), "dd/MM/yyyy"),
            payment_mode: paymentMode,
            order_number: reference,
            deposit_to_ledger_id: depositTo ? parseInt(depositTo) : null,
            tax_deducted: taxDeducted === "yes",
            tds_lock_account_ledger_id:
              taxDeducted === "yes" && tdsAccount ? tdsAccount : null,
            notes,
            payment_amount: totalPayment,
            excess_amount: excessAmount,
            status,
            lock_bill_payments_attributes: invoiceRows
              .filter((r) => parseFloat(r.payment) > 0)
              .map((r) => ({
                resource_id: r.id,
                resource_type: "LockAccountInvoice",
                amount: parseFloat(r.payment) || 0,
                payment_date: r.paymentReceivedOn,
              })),
            attachments_attributes: [],
          },
        };
      } else {
        payload = {
          lock_payment: {
            payment_of: "LockAccountCustomer",
            payment_of_id: selectedCustomerId,
            payment_made: false,
            paid_amount: parseFloat(advanceAmount) || 0,
            bank_charges: parseFloat(advanceBankCharges) || 0,
            payment_date: format(parseISO(date), "dd/MM/yyyy"),
            payment_mode: paymentMode,
            order_number: reference,
            advance: true,
            deposit_to_ledger_id: advanceDepositTo ? parseInt(advanceDepositTo) : null,
            notes,
            place_of_supply: placeOfSupply,
            description_of_supply: descriptionOfSupply,
            tax_rate_id: advanceTax ? parseInt(advanceTax.replace(/\D/g, '')) || 1 : null,
            attachments_attributes: [],
          },
        };
      }

      // Format attachments to base64
      if (attachments.length > 0) {
        try {
          const base64Files = await Promise.all(attachments.map(toBase64));
          payload.lock_payment.attachments_attributes = attachments.map((f, i) => ({
            document: base64Files[i],
            active: true
          }));
        } catch (e) {
          console.error("Failed to convert attachments:", e);
        }
      }

      await axios.post(
        `https://${baseUrl}/lock_payments.json?lock_account_id=${lock_account_id}`,
        payload,
        { headers: { ...authHeaders, "Content-Type": "application/json" } }
      );
      toast.success(
        `Payment ${status === "draft" ? "saved as draft" : "recorded"} successfully!`
      );
      navigate(-1);
    } catch (err) {
      console.error("Failed to save payment:", err);
      toast.error("Failed to save payment");
    } finally {
      setSubmitting(false);
    }
  };

  const INDIAN_STATES = [
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
      <div className="mb-2">
        <button
          onClick={() => navigate('/accounting/payments-received')}
          className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium tracking-wide"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payment Received List
        </button>
      </div>

      {/* ── Customer Detail Drawer (slides in from right) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="relative z-10 w-[360px] max-w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Customer</span>
              <button
                onClick={() => setDrawerOpen(false)}
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
                      className={`py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                        drawerActiveTab === i
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
                            {customerDetail.contact_persons.map((cp, idx) => (
                              <div key={cp.id || idx} className="px-4 py-4 flex items-start gap-3">
                                {/* Avatar with optional primary green star badge */}
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
                                {customerDetail.billing_address.phone && (
                                  <div>Phone: {customerDetail.billing_address.phone}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic">No Billing Address</div>
                            )}
                          </div>
                          <div className="border-t border-gray-100 pt-3">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Shipping Address</div>
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
                            <div className="text-xs text-[#C72030] italic border-l-4 border-[#C72030] pl-2">No Shipping Address</div>
                          )}
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}

                {drawerActiveTab === 1 && (
                  <div className="p-6 text-center text-gray-400 text-sm">Activity log coming soon.</div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Failed to load customer details.
              </div>
            )}
          </div>
        </div>
      )}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}

      <header className="flex items-center justify-between mb-2">
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "1.1rem", paddingX: 3 },
          }}
        >
          <Tab label="Invoice Payment" />
          <Tab label="Customer Advance" />
        </Tabs>
      </header>

      {activeTab === 0 && (
      <div className="space-y-6">
        {/* Customer Section */}
        <Section
          title="Customer Information"
          icon={<Receipt className="w-5 h-5" />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Name<span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth>
                  <Select
                    value={selectedCustomerId}
                    onChange={(e) =>
                      setSelectedCustomerId(e.target.value as number)
                    }
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>
                      Select a customer
                    </MenuItem>
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayName(customer)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedCustomer && (
                  <div className="mt-2 text-[12px] text-gray-500 space-y-1">
                    <p>PAN: <span className="text-blue-500">{selectedCustomer.pan || "—"}</span></p>
                  </div>
                )}
                {selectedCustomer && (
                  <div className="mt-3">
                    <MuiButton
                      onClick={openCustomerDrawer}
                      variant="outlined"
                      endIcon={<ChevronRight className="w-4 h-4" />}
                      sx={{
                        textTransform: "none",
                        borderColor: "#404b69",
                        color: "#404b69",
                        "&:hover": { borderColor: "#353f5a", bgcolor: "#404b69", color: "white" },
                      }}
                    >
                      {getCustomerDisplayName(selectedCustomer)}'s Details
                    </MuiButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Payment Details Section */}
        <Section
          title="Payment Details"
          icon={<DollarSign className="w-5 h-5" />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount Received<span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={amountReceived}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val < 0) {
                      toast.error('Amount Received cannot be negative');
                      setAmountReceived('0');
                    } else {
                      setAmountReceived(e.target.value);
                    }
                  }}
                  placeholder="0.00"
                  sx={fieldStyles}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">INR</InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={receivedFullAmount}
                      onChange={(e) => {
                        setReceivedFullAmount(e.target.checked);
                        if (!e.target.checked) {
                          setAmountReceived("");
                          setInvoiceRows([]);
                        }
                      }}
                      size="small"
                    />
                  }
                  label={
                    <span className="text-sm text-gray-600">
                      Received full amount
                      {invoiceRows.length > 0 && (
                        <span className="text-gray-500">
                          {" "}
                          (₹{totalPayment.toFixed(2)})
                        </span>
                      )}
                    </span>
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bank Charges (if any)
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={bankCharges}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val < 0) {
                      toast.error('Bank Charges cannot be negative');
                      setBankCharges('0');
                    } else {
                      setBankCharges(e.target.value);
                    }
                  }}
                  placeholder="0.00"
                  sx={fieldStyles}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Date<span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                      toast.error('Payment Date cannot be in the future');
                      setDate(format(today, "yyyy-MM-dd"));
                    } else {
                      setDate(e.target.value);
                    }
                  }}
                  sx={{
                    ...fieldStyles,
                    '& .MuiInputBase-input': {
                      color: date ? 'transparent' : 'inherit',
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: date ? (
                      <InputAdornment position="start" sx={{ position: 'absolute', pointerEvents: 'none', left: '10px', backgroundColor: 'white', pr: 1, zIndex: 1 }}>
                        {format(parseISO(date), 'dd/MM/yyyy')}
                      </InputAdornment>
                    ) : null
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Mode
                </label>
                <FormControl fullWidth>
                  <Select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as string)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>
                      Select payment mode
                    </MenuItem>
                    {PAYMENT_MODES.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deposit To<span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth>
                  <Select
                    value={depositTo}
                    onChange={(e) => setDepositTo(e.target.value as string)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="" disabled>
                      Select ledger
                    </MenuItem>
                    {ledgers.map((l) => (
                      <MenuItem key={l.id} value={String(l.id)}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reference #
                </label>
                <TextField
                  fullWidth
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter reference number"
                  sx={fieldStyles}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Tax Section */}
        <Section
          title="Tax Information"
          icon={<CreditCard className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tax deducted?
              </label>
              <RadioGroup
                row
                value={taxDeducted}
                onChange={(e) => {
                  const val = e.target.value;
                  setTaxDeducted(val);
                  if (val === "no") {
                    setInvoiceRows((rows) =>
                      rows.map((r) => ({ ...r, withholdingTax: "" }))
                    );
                  }
                }}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No Tax deducted"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes, TDS (Income Tax)"
                />
              </RadioGroup>
            </div>

            {taxDeducted === "yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TDS Tax Account<span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={tdsAccount}
                      onChange={(e) => setTdsAccount(e.target.value as string)}
                      sx={fieldStyles}
                    >
                      <MenuItem value="Advance Tax">Advance Tax</MenuItem>
                      <MenuItem value="Employee Advance">
                        Employee Advance
                      </MenuItem>
                      <MenuItem value="Prepaid Expenses">
                        Prepaid Expenses
                      </MenuItem>
                      <MenuItem value="TDS Receivable">TDS Receivable</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Unpaid Invoices Section */}
        <Section
          title="Unpaid Invoices"
          icon={<FileText className="w-5 h-5" />}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                {invoiceRows.length > 0
                  ? `${invoiceRows.length} unpaid invoice(s) found`
                  : "Select a customer and check 'Received full amount' to load invoices"}
              </p>
              {invoiceRows.length > 0 && (
                <MuiButton
                  variant="text"
                  size="small"
                  onClick={() =>
                    setInvoiceRows((rows) =>
                      rows.map((r) => ({ ...r, payment: "" }))
                    )
                  }
                  sx={{ textTransform: "none", color: "primary.main" }}
                >
                  Clear Applied Amount
                </MuiButton>
              )}
            </div>

            {invoicesLoading ? (
              <div className="py-10 text-center">
                <CircularProgress size={32} />
                <p className="text-sm text-gray-500 mt-2">Loading invoices…</p>
              </div>
            ) : invoiceError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600 text-sm">
                {invoiceError}
              </div>
            ) : invoiceRows.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500 text-sm">
                There are no unpaid invoices associated with this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Date
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Invoice Number
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Invoice Amount
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Amount Due
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Payment Received On
                      </th>
                      <th
                        className={`text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 ${taxDeducted === "yes" ? "text-gray-500" : "text-gray-300"}`}
                      >
                        Withholding Tax
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="py-3 px-4 align-top">
                          <div className="text-gray-800">
                            {row.invoice_date
                              ? format(new Date(row.invoice_date), "dd/MM/yyyy")
                              : "—"}
                          </div>
                          {row.due_date && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              Due:{" "}
                              {format(new Date(row.due_date), "dd/MM/yyyy")}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 align-top text-primary font-medium">
                          {row.invoice_number}
                        </td>
                        <td className="py-3 px-4 align-top text-right">
                          {row.total?.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 align-top text-right text-primary font-medium">
                          {row.balance_due?.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 align-top">
                          <TextField
                            type="date"
                            value={row.paymentReceivedOn}
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              if (selectedDate > today) {
                                toast.error('Payment Date cannot be in the future');
                                handleInvoiceRowChange(row.id, "paymentReceivedOn", format(today, "yyyy-MM-dd"));
                              } else {
                                handleInvoiceRowChange(row.id, "paymentReceivedOn", e.target.value);
                              }
                            }}
                            size="small"
                            sx={{
                              width: 150,
                              "& .MuiInputBase-input": {
                                padding: "6px 10px",
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 align-top">
                          <TextField
                            value={row.withholdingTax}
                            onChange={(e) =>
                              handleInvoiceRowChange(
                                row.id,
                                "withholdingTax",
                                e.target.value
                              )
                            }
                            size="small"
                            placeholder="0.00"
                            disabled={taxDeducted !== "yes"}
                            sx={{
                              width: 130,
                              "& .MuiInputBase-input": {
                                padding: "6px 10px",
                                fontSize: "0.875rem",
                              },
                              ...(taxDeducted !== "yes" && {
                                bgcolor: "action.disabledBackground",
                                "& .MuiInputBase-input": {
                                  padding: "6px 10px",
                                  fontSize: "0.875rem",
                                  color: "text.disabled",
                                },
                              }),
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 align-top text-right">
                          <TextField
                            value={row.payment}
                            onChange={(e) =>
                              handleInvoiceRowChange(
                                row.id,
                                "payment",
                                e.target.value
                              )
                            }
                            size="small"
                            placeholder="0.00"
                            sx={{
                              width: 120,
                              "& .MuiInputBase-input": {
                                padding: "6px 10px",
                                fontSize: "0.875rem",
                                textAlign: "right",
                              },
                            }}
                          />
                          <div
                            className="text-xs text-primary cursor-pointer mt-1 text-right hover:underline"
                            onClick={() => handlePayInFull(row.id)}
                          >
                            Pay in Full
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td
                        colSpan={4}
                        className="pt-3 px-4 text-xs text-gray-500 italic"
                      >
                        **List contains only SENT invoices
                      </td>
                      <td className="pt-3 px-4 text-right font-semibold text-gray-700">
                        Total
                      </td>
                      <td></td>
                      <td className="pt-3 px-4 text-right font-semibold text-gray-700">
                        {totalPayment.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </Section>

        {/* Notes & Attachments Section */}
        <Section
          title="Notes & Attachments"
          icon={<FileText className="w-5 h-5" />}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Notes{" "}
                <span className="text-gray-400 font-normal">
                  (Internal use. Not visible to customer)
                </span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
                rows={4}
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setNotes(e.target.value);
                }}
                placeholder="Add notes for internal reference... (max 500 characters)"
                maxLength={500}
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {notes?.length || 0}/500
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Attachments
              </label>
              <div className="flex items-center gap-4">
                <MuiButton
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{
                    textTransform: "none",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => {
                      if (e.target.files)
                        setAttachments(Array.from(e.target.files));
                    }}
                  />
                </MuiButton>
                <span className="text-sm text-gray-500">
                  You can upload a maximum of 5 files, 5MB each
                </span>
              </div>
              {attachments.length > 0 && (
                <ul className="mt-3 text-sm list-disc list-inside text-gray-600">
                  {attachments.map((f, idx) => (
                    <li key={idx}>{f.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendThankYou}
                    onChange={(e) => setSendThankYou(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <span className="text-sm">
                    Send a "Thank you" note for this payment
                  </span>
                }
              />
              {selectedCustomer && sendThankYou && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center gap-2">
                    <Checkbox defaultChecked size="small" />
                    <span>
                      {getCustomerDisplayName(selectedCustomer)} &lt;
                      {selectedCustomer.email}&gt;
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Payment Summary Section */}
        <Section
          title="Payment Summary"
          icon={<DollarSign className="w-5 h-5" />}
        >
          <div className="max-w-md space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount Received</span>
              <span className="text-sm font-medium">
                ₹ {amountReceived || "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Amount used for Payments
              </span>
              <span className="text-sm font-medium">
                ₹ {totalPayment.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount Refunded</span>
              <span className="text-sm font-medium">₹ 0.00</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm text-red-500 font-medium">
                ⚠ Amount in Excess
              </span>
              <span className="text-sm font-semibold">
                ₹{" "}
                {Math.max(
                  0,
                  (parseFloat(amountReceived) || 0) - totalPayment
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </Section>
      </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Customer Information Section */}
          <Section
            title="Customer Information"
            icon={<Receipt className="w-5 h-5" />}
          >
            <div className="space-y-6">
              {/* Customer Name + Place of Supply side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Customer Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Name<span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value as number)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select a customer</MenuItem>
                      {customers.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{getCustomerDisplayName(c)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedCustomer && (
                    <div className="mt-2 text-[12px] text-gray-500 space-y-1">
                      <p>PAN: <span className="text-blue-500">{selectedCustomer.pan || "—"}</span></p>
                      <p>GST Treatment: {selectedCustomer.gst_treatment || "Registered Business - Regular"} <span className="text-blue-500 cursor-pointer ml-1">✎</span></p>
                      <p>GSTIN: {selectedCustomer.gstin || "—"} <span className="text-blue-500 cursor-pointer ml-1">✎</span></p>
                    </div>
                  )}
                  {selectedCustomer && (
                    <div className="mt-3">
                      <MuiButton
                        onClick={openCustomerDrawer}
                        variant="outlined"
                        endIcon={<ChevronRight className="w-4 h-4" />}
                        sx={{
                          textTransform: "none",
                          borderColor: "#404b69",
                          color: "#404b69",
                          "&:hover": { borderColor: "#353f5a", bgcolor: "#404b69", color: "white" },
                        }}
                      >
                        {getCustomerDisplayName(selectedCustomer)}'s Details
                      </MuiButton>
                    </div>
                  )}
                </div>

                {/* Right: Place of Supply – only shown after customer is selected */}
                {selectedCustomer && (
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
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">Select Place of Supply</MenuItem>
                      {INDIAN_STATES.map((state) => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
              </div>

              {/* Description of Supply */}
              <div>
                <label className="block text-sm font-medium mb-2">Description of Supply</label>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={descriptionOfSupply}
                  onChange={(e) => setDescriptionOfSupply(e.target.value)}
                  placeholder="Will be displayed on the Payment Receipt"
                />
              </div>
            </div>
          </Section>

          {/* Payment Details Section */}
          <Section
            title="Payment Details"
            icon={<DollarSign className="w-5 h-5" />}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount Received<span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    type="number"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    sx={fieldStyles}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">INR</InputAdornment>,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Charges (if any)</label>
                  <TextField
                    fullWidth
                    type="number"
                    value={advanceBankCharges}
                    onChange={(e) => setAdvanceBankCharges(e.target.value)}
                    sx={fieldStyles}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tax</label>
                  <FormControl fullWidth>
                    <Select
                      value={advanceTax}
                      onChange={(e) => setAdvanceTax(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select a Tax</MenuItem>
                      <MenuItem value="GST 18%">GST 18%</MenuItem>
                      <MenuItem value="GST 12%">GST 12%</MenuItem>
                      <MenuItem value="GST 5%">GST 5%</MenuItem>
                      <MenuItem value="Exempt">Exempt</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Date<span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment #<span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value)}
                    sx={fieldStyles}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <span className="text-blue-500 cursor-pointer text-lg">⚙️</span>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Mode</label>
                  <FormControl fullWidth>
                    <Select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>Select payment mode</MenuItem>
                      {PAYMENT_MODES.map((mode) => (
                        <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Deposit To<span className="text-red-500">*</span>
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={advanceDepositTo}
                      onChange={(e) => setAdvanceDepositTo(e.target.value)}
                      displayEmpty
                      disabled={advanceDepositGroupsLoading}
                      sx={fieldStyles}
                    >
                      <MenuItem value="" disabled>
                        {advanceDepositGroupsLoading ? "Loading…" : "Select deposit account"}
                      </MenuItem>
                      {advanceDepositLedgers.map((l) => (
                        <MenuItem key={l.id} value={String(l.id)}>{l.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reference#</label>
                  <TextField
                    fullWidth
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    sx={fieldStyles}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Notes & Attachments Section */}
          <Section
            title="Notes & Attachments"
            icon={<FileText className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes{" "}
                  <span className="text-gray-400 font-normal">
                    (Internal use. Not visible to customer)
                  </span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-[#bf213e] focus:border-[#bf213e] resize-y"
                  rows={4}
                  value={notes}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setNotes(e.target.value);
                  }}
                  placeholder="Add notes for internal reference... (max 500 characters)"
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {notes?.length || 0}/500
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <div className="flex flex-col gap-2 items-start mt-1">
                  <MuiButton
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.secondary",
                      px: 3,
                    }}
                  >
                    Upload File
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => {
                        if (e.target.files) setAttachments(Array.from(e.target.files));
                      }}
                    />
                  </MuiButton>
                  <span className="text-xs text-gray-500">
                    You can upload a maximum of 5 files, 5MB each
                  </span>
                  {attachments.length > 0 && (
                    <ul className="mt-2 text-sm list-disc list-inside text-gray-600">
                      {attachments.map((f, idx) => (
                        <li key={idx}>{f.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Action Buttons - matching InvoiceAdd pattern */}
      <div className="flex items-center gap-3 justify-center pt-2">
        <MuiButton
          variant="outlined"
          onClick={() => navigate(-1)}
          disabled={submitting}
          sx={{
            textTransform: "none",
            px: 4,
            borderColor: "#C72030",
            color: "#C72030",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#A01020",
              bgcolor: "#f8f1f1",
              color: "#A01020",
            },
          }}
        >
          Cancel
        </MuiButton>
        {/* <MuiButton
                    variant="outlined"
                    onClick={() => handleSubmit("draft")}
                    disabled={submitting}
                    sx={{
                        textTransform: "none",
                        px: 4,
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": { borderColor: "primary.dark", bgcolor: "primary.main", color: "white" },
                    }}
                >
                    Save as Draft
                </MuiButton> */}
        <MuiButton
          variant="text"
          onClick={() => handleSubmit("paid")}
          disabled={submitting}
          sx={{
            bgcolor: "#f8f1f1",
            color: "#C72030",
            fontWeight: 600,
            px: 4,
            "&:hover": { bgcolor: "#f1e8e8", color: "#A01020" },
            textTransform: "none",
          }}
        >
          {submitting ? "Saving…" : "Save as Paid"}
        </MuiButton>
      </div>
    </div>
  );
};

export default RecordPaymentPage;
