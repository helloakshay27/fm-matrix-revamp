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
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import {
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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

interface Customer {
  id: number;
  salutation: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  mobile: string;
  pan: string;
}

interface Ledger {
  id: number;
  name: string;
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

export const RecordPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>(
    ""
  );
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

  const [receivedFullAmount, setReceivedFullAmount] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [invoiceRows, setInvoiceRows] = useState<InvoicePaymentRow[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendThankYou, setSendThankYou] = useState(true);

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

  const handleSubmit = async (status: "draft" | "paid") => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    setSubmitting(true);
    try {
      const excessAmount = Math.max(
        0,
        (parseFloat(amountReceived) || 0) - totalPayment
      );
      const payload: any = {
        lock_payment: {
          payment_of: "LockAccountCustomer",
          payment_of_id: selectedCustomerId,
          payment_made: false,
          paid_amount: parseFloat(amountReceived) || 0,
          bank_charges: parseFloat(bankCharges) || 0,
          payment_date: date,
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
      // include attachments if user selected any
      if (attachments.length > 0) {
        payload.lock_payment.attachments_attributes = attachments.map((f) => ({
          filename: f.name,
          // TODO: convert `f` to required upload format
        }));
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

  return (
    <div className="p-6 space-y-6 relative">
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Record Payment</h1>
      </header>

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
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">PAN</label>
                <TextField
                  fullWidth
                  value={selectedCustomer?.pan || "—"}
                  disabled
                  sx={fieldStyles}
                />
              </div>
            </div>

            {selectedCustomer && (
              <div className="flex items-center">
                <MuiButton
                  variant="outlined"
                  endIcon={<ChevronRight className="w-4 h-4" />}
                  sx={{
                    textTransform: "none",
                    borderColor: "#404b69",
                    color: "#404b69",
                    "&:hover": {
                      borderColor: "#353f5a",
                      bgcolor: "#404b69",
                      color: "white",
                    },
                  }}
                >
                  {getCustomerDisplayName(selectedCustomer)}'s Details
                </MuiButton>
              </div>
            )}
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
