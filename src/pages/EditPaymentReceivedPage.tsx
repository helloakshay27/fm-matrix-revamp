import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, File, X } from "lucide-react";
import { toast } from "sonner";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  CircularProgress,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { CreditCard, Calendar, DollarSign, Receipt } from "lucide-react";

interface InvoiceRow {
  id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  balance_due: number;
  payment: number;
  paymentReceivedOn: string;
  withholdingTax: number;
}

interface PaymentReceivedData {
  id: number;
  payment_number: string;
  payment_date: string;
  customer_name: string;
  customer_id?: number;
  payment_mode: string;
  amount: number;
  bank_charges: number;
  tax_deducted: boolean;
  notes?: string;
  status: string;
  invoice_payments?: InvoiceRow[];
  attachments?: Array<{ id: number; url: string; name: string }>;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email?: string;
  mobile?: string;
}

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm mb-6">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export const EditPaymentReceivedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentReceived, setPaymentReceived] =
    useState<PaymentReceivedData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [invoiceRows, setInvoiceRows] = useState<InvoiceRow[]>([]);

  const [formData, setFormData] = useState({
    payment_number: "",
    payment_date: "",
    customer_id: "",
    customer_name: "",
    payment_mode: "BANK_TRANSFER",
    amount: "",
    bank_charges: "",
    tax_deducted: false,
    notes: "",
    status: "DRAFT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ id: number; url: string; name: string }>
  >([]);

  // Fetch payment received details
  useEffect(() => {
    const fetchPaymentReceived = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/api/payments-received/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.data || response.data;
        setPaymentReceived(data);
        setFormData({
          payment_number: data.payment_number || "",
          payment_date: data.payment_date?.split("T")[0] || "",
          customer_id: data.customer_id?.toString() || "",
          customer_name: data.customer_name || "",
          payment_mode: data.payment_mode || "BANK_TRANSFER",
          amount: data.amount?.toString() || "",
          bank_charges: data.bank_charges?.toString() || "",
          tax_deducted: data.tax_deducted || false,
          notes: data.notes || "",
          status: data.status || "DRAFT",
        });
        setInvoiceRows(data.invoice_payments || []);
        setExistingAttachments(data.attachments || []);
      } catch (error) {
        toast.error("Failed to fetch payment received details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPaymentReceived();
  }, [id, baseUrl, token]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await axios.get(
          `https://${baseUrl}/api/customers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setCustomersLoading(false);
      }
    };

    if (baseUrl && token) fetchCustomers();
  }, [baseUrl, token]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInvoiceRowChange = (
    invoiceId: number,
    field: string,
    value: any
  ) => {
    setInvoiceRows((prev) =>
      prev.map((row) =>
        row.id === invoiceId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (f) => f.size <= 20 * 1024 * 1024
    );
    if (newFiles.length !== files.length) {
      toast.error("Some files exceed 20MB limit");
    }
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (id: number) => {
    setExistingAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.payment_number.trim())
      newErrors.payment_number = "Payment number is required";
    if (!formData.payment_date)
      newErrors.payment_date = "Payment date is required";
    if (!formData.customer_id)
      newErrors.customer_id = "Customer is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("payment_number", formData.payment_number);
      formDataToSend.append("payment_date", formData.payment_date);
      formDataToSend.append("customer_id", formData.customer_id);
      formDataToSend.append("payment_mode", formData.payment_mode);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("bank_charges", formData.bank_charges);
      formDataToSend.append("tax_deducted", formData.tax_deducted ? "1" : "0");
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("invoice_payments", JSON.stringify(invoiceRows));

      attachments.forEach((file) => {
        formDataToSend.append("attachments[]", file);
      });

      const response = await axios.put(
        `https://${baseUrl}/api/payments-received/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Payment received updated successfully");
      navigate(`/accounting/payments-received/${id}`);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update payment received";
      toast.error(message);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const totalPayment = invoiceRows.reduce(
    (sum, row) => sum + (parseFloat(row.payment?.toString() || "0") || 0),
    0
  );
  const totalWithholding = invoiceRows.reduce(
    (sum, row) =>
      sum + (parseFloat(row.withholdingTax?.toString() || "0") || 0),
    0
  );
  const bankCharges = parseFloat(formData.bank_charges) || 0;
  const netAmount = totalPayment - totalWithholding - bankCharges;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Payment Received</h1>
            <p className="text-sm text-gray-600">
              Payment #{formData.payment_number}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information" icon={<Receipt className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Payment Number"
              value={formData.payment_number}
              onChange={(e) =>
                handleInputChange("payment_number", e.target.value)
              }
              error={!!errors.payment_number}
              helperText={errors.payment_number}
              size="small"
            />
            <TextField
              fullWidth
              label="Payment Date"
              type="date"
              value={formData.payment_date}
              onChange={(e) =>
                handleInputChange("payment_date", e.target.value)
              }
              error={!!errors.payment_date}
              helperText={errors.payment_date}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <FormControl fullWidth size="small" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="VOID">Void</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </Section>

        {/* Customer Information */}
        <Section title="Customer Information" icon={<DollarSign className="h-4 w-4" />}>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.company_name || `${option.first_name} ${option.last_name}`}
            value={
              customers.find((c) => c.id.toString() === formData.customer_id) ||
              null
            }
            onChange={(_, customer) => {
              handleInputChange("customer_id", customer?.id.toString() || "");
              handleInputChange(
                "customer_name",
                customer?.company_name ||
                  `${customer?.first_name} ${customer?.last_name}` ||
                  ""
              );
            }}
            loading={customersLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                error={!!errors.customer_id}
                helperText={errors.customer_id}
                size="small"
              />
            )}
            fullWidth
          />
        </Section>

        {/* Payment Information */}
        <Section title="Payment Information" icon={<CreditCard className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth size="small">
              <InputLabel>Payment Mode</InputLabel>
              <MuiSelect
                value={formData.payment_mode}
                onChange={(e) =>
                  handleInputChange("payment_mode", e.target.value)
                }
                label="Payment Mode"
              >
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="CHECK">Check</MenuItem>
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="NEFT">NEFT</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              error={!!errors.amount}
              helperText={errors.amount}
              inputProps={{ step: "0.01" }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Bank Charges"
              type="number"
              value={formData.bank_charges}
              onChange={(e) =>
                handleInputChange("bank_charges", e.target.value)
              }
              inputProps={{ step: "0.01" }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tax_deducted}
                  onChange={(e) =>
                    handleInputChange("tax_deducted", e.target.checked)
                  }
                />
              }
              label="Tax Deducted at Source (TDS)"
            />
          </div>
        </Section>

        {/* Invoice Payment Details */}
        {invoiceRows.length > 0 && (
          <Section
            title="Invoice Payment Details"
            icon={<Calendar className="h-4 w-4" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Invoice #</th>
                    <th className="p-3 text-left">Invoice Date</th>
                    <th className="p-3 text-right">Amount Due</th>
                    <th className="p-3 text-right">Payment</th>
                    <th className="p-3 text-right">Withholding Tax</th>
                    <th className="p-3 text-left">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="p-3">{row.invoice_number}</td>
                      <td className="p-3">
                        {new Date(row.invoice_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="p-3 text-right">
                        ₹{row.balance_due.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <TextField
                          type="number"
                          value={row.payment || ""}
                          onChange={(e) =>
                            handleInvoiceRowChange(
                              row.id,
                              "payment",
                              e.target.value
                            )
                          }
                          inputProps={{ step: "0.01" }}
                          size="small"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td className="p-3">
                        <TextField
                          type="number"
                          value={row.withholdingTax || ""}
                          onChange={(e) =>
                            handleInvoiceRowChange(
                              row.id,
                              "withholdingTax",
                              e.target.value
                            )
                          }
                          inputProps={{ step: "0.01" }}
                          size="small"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td className="p-3">
                        <TextField
                          type="date"
                          value={row.paymentReceivedOn || ""}
                          onChange={(e) =>
                            handleInvoiceRowChange(
                              row.id,
                              "paymentReceivedOn",
                              e.target.value
                            )
                          }
                          size="small"
                          style={{ width: "120px" }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Total Payment:</span>
                <span className="font-medium">₹{totalPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Withholding Tax:</span>
                <span className="font-medium">
                  ₹{totalWithholding.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bank Charges:</span>
                <span className="font-medium">₹{bankCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Net Amount:</span>
                <span>₹{Math.max(0, netAmount).toFixed(2)}</span>
              </div>
            </div>
          </Section>
        )}

        {/* Notes */}
        <Section title="Notes" icon={<File className="h-4 w-4" />}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            size="small"
          />
        </Section>

        {/* Attachments */}
        <Section title="Attachments" icon={<File className="h-4 w-4" />}>
          <div className="space-y-4">
            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Existing Files</h3>
                <div className="space-y-2">
                  {existingAttachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Attachments */}
            {attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">New Files</h3>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <File className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    Max 20MB per file
                  </span>
                </div>
              </label>
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Payment Received
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPaymentReceivedPage;
