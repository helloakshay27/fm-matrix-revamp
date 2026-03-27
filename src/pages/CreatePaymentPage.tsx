import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast as sonnerToast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";

// Bill shape from lock_account_bill.json
interface LockAccountBill {
  id: number;
  bill_number: string;
  bill_date: string;
  due_date: string;
  total_amount: number;
  order_number: string;
  status: string;
  vendor_name: string;
  payment_term: string;
  subject: string;
  pms_supplier_id: number;
}

// Supplier shape from pms/suppliers.json
interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  pan_number: string | null;
  payment_terms: string | null;
  currency: string | null;
}

interface Ledger {
  id: number;
  name: string;
}

interface AccountGroup {
  id: number;
  group_name: string;
  ledgers?: Ledger[];
}
import {
  X,
  Settings,
  ChevronDown,
  Check,
  Info,
  AlertTriangle,
  Upload,
  ChevronRight,
  ExternalLink,
  FileText,
  Mail,
  Gem,
  MessageSquare,
  Search,
  Paperclip,
  CreditCard,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import {
  FormControl,
  Select as MuiSelect,
  MenuItem as MuiMenuItem,
  ListSubheader,
  InputLabel,
  Typography,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  AttachFile,
  Close as MuiClose,
} from "@mui/icons-material";

export const CreatePaymentPage: React.FC = () => {
  const navigate = useNavigate();
            const lock_account_id = localStorage.getItem("lock_account_id");
  // PMS axios instance — uses the dynamic session base URL (fm-uat-api.lockated.com)
  const pmsClient = React.useMemo(
    () =>
      axios.create({
        baseURL: API_CONFIG.BASE_URL || "https://fm-uat-api.lockated.com",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.TOKEN}`,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [API_CONFIG.BASE_URL, API_CONFIG.TOKEN]
  );

  // Accounting axios instance — always hits club-uat-api.lockated.com
  const accountingClient = React.useMemo(
    () =>
      axios.create({
        baseURL: "https://club-uat-api.lockated.com",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.TOKEN}`,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [API_CONFIG.TOKEN]
  );

  // State
  const [activeSheetTab, setActiveSheetTab] = useState("details");
  const [activeTab, setActiveTab] = useState("bill_payment");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date("2026-02-12"));
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [paymentNumber, setPaymentNumber] = useState("");
  
  // Payment Number Configuration State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState({
    autoGenerate: true,
    prefix: "",
    nextNumber: 1,
  });

  // Modal temporary states
  const [modalAutoGenerate, setModalAutoGenerate] = useState(true);
  const [modalPrefix, setModalPrefix] = useState("");
  const [modalNextNumber, setModalNextNumber] = useState("1");

  // Sync modal state when opening
  useEffect(() => {
    if (isConfigModalOpen) {
      setModalAutoGenerate(paymentConfig.autoGenerate);
      setModalPrefix(paymentConfig.prefix);
      setModalNextNumber(String(paymentConfig.nextNumber));
    }
  }, [isConfigModalOpen, paymentConfig]);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidThrough, setPaidThrough] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  // Ledger & tax IDs
  const [depositToLedgerId] = useState(2);
  const [lockAccountTaxId] = useState(1);

  // TDS state
  const [tdsOptions, setTdsOptions] = useState<{ id: string | number; name: string; percentage?: number }[]>([]);
  const [selectedTds, setSelectedTds] = useState("");
  const [loadingTds, setLoadingTds] = useState(false);
  
  // Reverse Charge state
  const [rcTaxOptions, setRcTaxOptions] = useState<{ id: string | number; name: string; percentage?: number }[]>([]);
  const [loadingRcTaxes, setLoadingRcTaxes] = useState(false);
  const [isReverseCharge, setIsReverseCharge] = useState(false);
  const [reverseChargeTax, setReverseChargeTax] = useState("");
  const [sourceOfSupply, setSourceOfSupply] = useState("");
  const [destinationOfSupply, setDestinationOfSupply] = useState("");
  const [descriptionOfSupply, setDescriptionOfSupply] = useState("");
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  // Attachments
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Bills fetched from API after vendor selection
  const [bills, setBills] = useState<LockAccountBill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [appliedAmounts, setAppliedAmounts] = useState<Record<number, string>>(
    {}
  );
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    if (!API_CONFIG.TOKEN) return;
    setSuppliersLoading(true);
    try {
      const res = await pmsClient.get("/pms/suppliers.json");
      const data = res.data;
      const list: Supplier[] = Array.isArray(data)
        ? data
        : (data.suppliers ?? data.pms_suppliers ?? []);
      setSuppliers(list);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      sonnerToast.error("Could not load vendor list.");
    } finally {
      setSuppliersLoading(false);
    }
  }, [pmsClient]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Fetch TDS taxes from API (only TDS, not TCS)
  useEffect(() => {
    const fetchTdsOptions = async () => {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const lock_account_id = localStorage.getItem('lock_account_id');
      if (!baseUrl || !token || !lock_account_id) return;
      setLoadingTds(true);
      try {
        const url = `https://${baseUrl}/lock_account_taxes.json?q[tax_type_eq]=tds&lock_account_id=${lock_account_id}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTdsOptions(Array.isArray(data) ? data : data?.tax_sections || []);
      } catch (error) {
        console.error('Failed to fetch TDS options:', error);
        setTdsOptions([]);
      } finally {
        setLoadingTds(false);
      }
    };
    fetchTdsOptions();
  }, []);

  useEffect(() => {
    const fetchAccountGroups = async () => {
      if (!API_CONFIG.TOKEN || !lock_account_id) return;
      setLoadingAccounts(true);
      try {
        const res = await pmsClient.get(
          `/lock_accounts/${lock_account_id}/lock_account_groups?format=flat`
        );
        setAccountGroups(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch account groups:", err);
        setAccountGroups([]);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccountGroups();
  }, [pmsClient, lock_account_id]);

  const fetchBills = useCallback(
    async (vendorId: string) => {
      if (!API_CONFIG.TOKEN) return;

      setBillsLoading(true);
      setBills([]);
      setAppliedAmounts({});
      try {
        const res = await accountingClient.get("/lock_account_bills.json", {
          params: { lock_account_id: lock_account_id },
        });
        const raw = res.data;
        const allBills: LockAccountBill[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.lock_account_bills)
            ? raw.lock_account_bills
            : Array.isArray(raw?.data)
              ? raw.data
              : [];
        console.log("allBills", allBills);
        const vendorBills = allBills.filter(
          (b) => String(b.pms_supplier_id) === String(vendorId)
        );
        console.log("vendorBills", vendorBills);
        setBills(vendorBills);
      } catch (err) {
        console.error("Failed to fetch bills:", err);
        sonnerToast.error("Could not load bills for this vendor.");
      } finally {
        setBillsLoading(false);
      }
    },
    [accountingClient]
  );

  // Convert a File to base64 string
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSave = async (status: "DRAFT" | "PAID") => {
    if (!selectedVendor) {
      sonnerToast.error("Please select a vendor.");
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      sonnerToast.error("Please enter a valid amount.");
      return;
    }
    if (!paidThrough) {
      sonnerToast.error("Please select an account in 'Paid Through'.");
      return;
    }
    if (!API_CONFIG.TOKEN) {
      sonnerToast.error("API not configured. Please log in.");
      return;
    }

    setIsSaving(true);
    try {
      const attachments_attributes =
        attachmentFiles.length > 0
          ? await Promise.all(
              attachmentFiles.map(async (file) => ({
                document: await fileToBase64(file),
                active: true,
              }))
            )
          : undefined;

      const paymentDate = date
        ? format(date, "dd/MM/yyyy")
        : format(new Date(), "dd/MM/yyyy");

      const lock_bill_payments_attributes = Object.entries(appliedAmounts)
        .filter(([, v]) => parseFloat(v) > 0)
        .map(([billId, v]) => ({
          lock_account_bill_id: parseInt(billId, 10),
          amount: parseFloat(v),
          payment_date: paymentDate,
        }));

      const paidAmount = parseFloat(amount) || 0;
      const paymentAmount = totalApplied;
      const excessAmount = Math.max(0, paidAmount - totalApplied);

      const payload = {
        lock_payment: {
          lock_account_id: lock_account_id,
          payment_of: "Pms::Supplier",
          payment_of_id: parseInt(selectedVendor, 10),
          paid_amount: paidAmount,
          // Use the dynamically selected TDS id (vendor_advance tab only)
          lock_account_tax_id: selectedTds ? parseInt(selectedTds, 10) : (lockAccountTaxId),
          tds_amount: tdsAmount > 0 ? tdsAmount : undefined,
          tds_percentage: tdsPercentage > 0 ? tdsPercentage : undefined,
          net_amount: tdsAmount > 0 ? paidAmount - tdsAmount : undefined,
          payment_date: paymentDate,
          payment_mode: paymentMode,
          order_number: paymentNumber || "",
          neft_reference: reference,
          paid_from_ledger_id: parseInt(paidThrough, 10),
          deposit_to_ledger_id: depositToLedgerId,
          advance: activeTab === "vendor_advance",
          notes: notes,
          payment_amount: paymentAmount,
          excess_amount: excessAmount,
          lock_bill_payments_attributes,
          ...(attachments_attributes && { attachments_attributes }),
        },
      };
      console.error("[handleSave] payload:", JSON.stringify(payload, null, 2));

      const res = await accountingClient.post("/lock_payments.json", payload);
      sonnerToast.success("Payment saved successfully!");
      const newId = res.data?.id || res.data?.lock_payment?.id;
      if (newId) {
        navigate(`/accounting/payments-made?paymentId=${newId}&view=detail`);
      } else {
        navigate("/accounting/payments-made");
      }
    } catch (err: unknown) {
      console.error("Error creating payment:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to save payment. Please try again.";
      sonnerToast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper: get the currently selected supplier object
  const selectedSupplier =
    suppliers.find((s) => String(s.id) === selectedVendor) ?? null;

  const handleVendorSelect = async (vendorId: string) => {
    setSelectedVendor(vendorId);
    setIsVendorOpen(false);
    fetchBills(vendorId);

    // Auto-set Payment # = (number of existing payments for this vendor) + 1
    try {
      const res = await accountingClient.get("/lock_payments.json", {
        params: {
          lock_account_id: lock_account_id,
          per_page: 9999, // fetch all to count accurately
        },
      });
      // API returns { lock_payments: [...] } or an array
      const allPayments: { payment_of_id: number | string }[] =
        res.data?.lock_payments ?? (Array.isArray(res.data) ? res.data : []);

      // Count only payments that belong to this specific vendor
      const vendorPaymentCount = allPayments.filter(
        (p) => String(p.payment_of_id) === String(vendorId)
      ).length;

      const nextNumber = vendorPaymentCount + 1;
      // Always auto-set the Payment # field with the sequential count
      setPaymentNumber(
        paymentConfig.prefix
          ? `${paymentConfig.prefix}${nextNumber}`
          : String(nextNumber)
      );
    } catch (err) {
      console.error("Failed to fetch vendor payment count:", err);
      // Fallback: just increment from config
      setPaymentNumber(
        paymentConfig.prefix
          ? `${paymentConfig.prefix}${paymentConfig.nextNumber}`
          : String(paymentConfig.nextNumber)
      );
    }
  };

  useEffect(() => {
    if (activeTab === "bill_payment" && selectedVendor) {
      fetchBills(selectedVendor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Total applied across all bill rows
  const totalApplied = Object.values(appliedAmounts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0
  );
  const amountInExcess = Math.max(0, (parseFloat(amount) || 0) - totalApplied);

  // TDS deduction: amount × (selectedTds percentage / 100)
  const selectedTdsOption = tdsOptions.find((opt) => String(opt.id) === selectedTds);
  const tdsPercentage = selectedTdsOption?.percentage ?? 0;
  const tdsAmount = tdsPercentage > 0 && parseFloat(amount) > 0
    ? (parseFloat(amount) * tdsPercentage) / 100
    : 0;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* ══ HEADER SECTION (Gray Background) ══ */}
          <div className="bg-[#f9f9fa] border-b border-gray-200 px-6 pb-6 pt-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-6 z-10 hover:bg-gray-200 rounded-full h-8 w-8 text-gray-500"
              onClick={() => navigate("/accounting/payments-made")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Tab Switcher */}
            <div className="flex justify-start items-end border-b border-gray-200 mb-6">
              <TabsList className="bg-transparent justify-start rounded-none h-auto p-0 gap-6">
                <TabsTrigger
                  value="bill_payment"
                  className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-700 data-[state=active]:bg-transparent data-[state=active]:text-red-700 data-[state=active]:shadow-none font-medium text-gray-600 bg-transparent transition-none mb-[-1px]"
                >
                  Bill Payment
                </TabsTrigger>
                <TabsTrigger
                  value="vendor_advance"
                  className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-700 data-[state=active]:bg-transparent data-[state=active]:text-red-700 data-[state=active]:shadow-none font-medium text-gray-600 bg-transparent transition-none mb-[-1px]"
                >
                  Vendor Advance
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Vendor Name – MUI Select (same as BillsAdd style) ── */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name<span className="text-red-500">*</span>
              </label>
              <FormControl fullWidth error={!selectedVendor}>
                <MuiSelect
                  value={selectedSupplier?.id || ""}
                  onChange={(e) => {
                    const vendorId = String(e.target.value);
                    if (vendorId) {
                      handleVendorSelect(vendorId);
                    } else {
                      setSelectedVendor(null);
                      setBills([]);
                      setAppliedAmounts({});
                    }
                  }}
                  displayEmpty
                  sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                      padding: { xs: "8px", sm: "10px", md: "12px" },
                    },
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 350,
                      },
                    },
                  }}
                >
                  <MuiMenuItem value="" disabled>
                    Select a vendor
                  </MuiMenuItem>
                  {suppliers.map((option) => (
                    <MuiMenuItem key={option.id} value={option.id}>
                      {option.company_name
                        ? option.name
                          ? `${option.name} (${option.company_name})`
                          : option.company_name
                        : option.name || "Unknown Vendor"}
                    </MuiMenuItem>
                  ))}
                  <MuiMenuItem
                    sx={{
                      p: 0,
                      position: "sticky",
                      bottom: 0,
                      background: "white",
                      zIndex: 10,
                      mt: 1,
                    }}
                    disableRipple
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  ></MuiMenuItem>
                </MuiSelect>
              </FormControl>

              {/* Supply Details (Vendor Advance Only) - Moved here and shows only after vendor selection */}
              {selectedVendor && activeTab === "vendor_advance" && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">Source of Supply</label>
                      <FormControl fullWidth size="small">
                        <MuiSelect
                          value={sourceOfSupply}
                          onChange={(e) => setSourceOfSupply(e.target.value as string)}
                          displayEmpty
                          sx={{
                            height: { xs: 28, sm: 36, md: 38 },
                            "& .MuiInputBase-input, & .MuiSelect-select": {
                              padding: { xs: "8px", sm: "10px", md: "8px" },
                              fontSize: "14px",
                            },
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                          }}
                        >
                          <MuiMenuItem value="" disabled>Select State</MuiMenuItem>
                          {indianStates.map((state) => (
                            <MuiMenuItem key={state} value={state}>
                              {state}
                            </MuiMenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">Destination of Supply</label>
                      <FormControl fullWidth size="small">
                        <MuiSelect
                          value={destinationOfSupply}
                          onChange={(e) => setDestinationOfSupply(e.target.value as string)}
                          displayEmpty
                          sx={{
                            height: { xs: 28, sm: 36, md: 38 },
                            "& .MuiInputBase-input, & .MuiSelect-select": {
                              padding: { xs: "8px", sm: "10px", md: "8px" },
                              fontSize: "14px",
                            },
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                          }}
                        >
                          <MuiMenuItem value="" disabled>Select State</MuiMenuItem>
                          {indianStates.map((state) => (
                            <MuiMenuItem key={state} value={state}>
                              {state}
                            </MuiMenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="block text-sm font-medium text-gray-700 cursor-help">
                            Description of Supply
                          </label>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-[#1e293b] text-white border-none text-[12px] py-1.5 px-3 max-w-[250px]">
                          <p>provide description for goods or services that you are going to supply</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      value={descriptionOfSupply}
                      onChange={(e) => setDescriptionOfSupply(e.target.value)}
                      className="h-[38px] w-full text-sm border-gray-300 focus-visible:ring-1 shadow-sm bg-white"
                      placeholder="Enter description of supply"
                    />
                    <p className="mt-1.5 text-[11px] text-gray-500 italic">
                      Will be displayed on the Payment Voucher
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ MAIN FORM SECTION (White Background) ══ */}
          <div className="px-6 py-6 bg-white">
            <div
              className={cn(
                "space-y-5 transition-all duration-300",
                !selectedVendor &&
                  "opacity-50 blur-[2px] pointer-events-none select-none grayscale-[0.3]"
              )}
            >
              {/* ── PAYMENT DETAILS ── */}
              <div className="border border-gray-200 bg-white">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200">
                  <FileText
                    className="w-[18px] h-[18px] text-[#db4a4a]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] font-bold tracking-wide text-[#333]">
                    PAYMENT DETAILS
                  </span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment # */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Payment #<span className="text-red-500">*</span>
                      </label>
                      <div className="relative font-sans">
                        <Input
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value)}
                          readOnly={paymentConfig.autoGenerate}
                          className={cn(
                            "pr-10 h-[38px] w-full text-sm border-gray-300 focus-visible:ring-1 shadow-sm",
                            paymentConfig.autoGenerate ? "bg-gray-50 cursor-not-allowed focus-visible:ring-0" : "bg-white cursor-text"
                          )}
                          placeholder="Payment number"
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Settings
                              className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                              onClick={() => setIsConfigModalOpen(true)}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#1e293b] text-white border-none text-[12px] py-1.5 px-3">
                            <p>Click here to configure auto-generation of payment numbers.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Payment Made */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Payment Made<span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center h-[38px] border border-gray-300 rounded-md px-3 bg-white focus-within:ring-1 focus-within:ring-gray-950 focus-within:border-gray-950 transition-colors shadow-sm">
                        <span className="text-gray-500 text-sm font-medium mr-2">
                          INR
                        </span>
                        <input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="flex-1 w-full outline-none text-sm bg-transparent"
                        />
                      </div>
                      {/* Net amount after TDS — shown only in vendor_advance */}
                      {activeTab === "vendor_advance" && tdsAmount > 0 && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          Amount paid after deducting TDS:{" "}
                          <span className="font-semibold text-gray-800">
                            ₹{(parseFloat(amount) - tdsAmount).toFixed(2)}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Reverse Charge (Vendor Advance Only) */}
                    {activeTab === "vendor_advance" && (
                      <div className="md:col-span-2 flex items-start border-b border-transparent pb-2">
                         <label className="text-sm font-medium text-gray-700 min-w-[200px] pt-[2px]">
                           Reverse Charge
                         </label>
                         <div className="flex flex-col flex-1">
                           <div className="flex items-center gap-2">
                             <input
                               type="checkbox"
                               id="reverseCharge"
                               className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                               checked={isReverseCharge}
                               onChange={(e) => setIsReverseCharge(e.target.checked)}
                             />
                             <label htmlFor="reverseCharge" className="text-[13px] text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                               This transaction is applicable for reverse charge
                             </label>
                           </div>
                           
                           {isReverseCharge && (
                             <div className="w-full md:w-[50%] lg:w-[40%] mt-4">
                               <label className="block text-sm font-medium mb-1.5 text-gray-700">Tax</label>
                               <FormControl fullWidth size="small">
                                 <MuiSelect
                                   value={reverseChargeTax}
                                   onChange={(e) => setReverseChargeTax(e.target.value as string)}
                                   displayEmpty
                                   sx={{
                                     height: { xs: 28, sm: 36, md: 38 },
                                     "& .MuiInputBase-input, & .MuiSelect-select": {
                                       padding: { xs: "8px", sm: "10px", md: "8px" },
                                       fontSize: "14px",
                                     },
                                     backgroundColor: "#fff",
                                     borderRadius: "6px",
                                   }}
                                 >
                                   <MuiMenuItem value="" disabled>Select Tax</MuiMenuItem>
                                   {rcTaxOptions.map((opt) => (
                                     <MuiMenuItem key={opt.id} value={String(opt.id)}>
                                       {opt.name}
                                       {typeof opt.percentage === "number" ? ` [${opt.percentage}%]` : ""}
                                     </MuiMenuItem>
                                   ))}
                                 </MuiSelect>
                               </FormControl>
                             </div>
                           )}
                         </div>
                      </div>
                    )}

                    {/* TDS (Vendor Advance Only) */}
                    {activeTab === "vendor_advance" && (
                      <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            TDS
                          </label>
                          <FormControl fullWidth>
                          <MuiSelect
                            value={selectedTds || ""}
                            onChange={(e) => setSelectedTds(e.target.value as string)}
                            displayEmpty
                            sx={{
                              height: { xs: 28, sm: 36, md: 45 },
                              "& .MuiInputBase-input, & .MuiSelect-select": {
                                padding: { xs: "8px", sm: "10px", md: "12px" },
                              },
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 350,
                                },
                              },
                            }}
                          >
                            <MuiMenuItem value="" disabled>
                              {loadingTds ? "Loading TDS options..." : "Select a Tax"}
                            </MuiMenuItem>
                            {!loadingTds && tdsOptions.length === 0 && (
                              <MuiMenuItem value="" disabled>
                                No TDS options available
                              </MuiMenuItem>
                            )}
                            {tdsOptions.map((opt) => (
                              <MuiMenuItem key={opt.id} value={String(opt.id)}>
                                {opt.name}
                                {typeof opt.percentage === "number" ? ` [${opt.percentage}%]` : ""}
                              </MuiMenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                        {/* TDS deduction breakdown — shown below TDS dropdown */}
                        {tdsAmount > 0 && (
                          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                            <span>−</span>
                            <span>TDS ({tdsPercentage}%): ₹{tdsAmount.toFixed(2)}</span>
                          </p>
                        )}
                        </div>
                    )}

                    {/* Payment Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Bill Date<span className="text-red-500">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal h-[38px] text-sm border-gray-300 shadow-sm bg-white",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? format(date, "dd-MM-yyyy") : "dd-mm-yyyy"}
                            <CalendarIcon className="h-4 w-4 text-gray-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── PAYMENT METHOD ── */}
              <div className="border border-gray-200 mt-6 bg-white">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200">
                  <CreditCard
                    className="w-[18px] h-[18px] text-[#db4a4a]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] font-bold tracking-wide text-[#333]">
                    PAYMENT METHOD
                  </span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Mode */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Payment Mode
                      </label>
                      <Select
                        value={paymentMode}
                        onValueChange={setPaymentMode}
                      >
                        <SelectTrigger className="border-gray-300 bg-white text-gray-700 h-[38px] text-sm shadow-sm">
                          <SelectValue placeholder="Choose payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Paid Through */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Paid Through<span className="text-red-500">*</span>
                      </label>
                      <FormControl fullWidth size="small">
                        <MuiSelect
                          value={paidThrough || ""}
                          onChange={(e) => setPaidThrough(e.target.value as string)}
                          displayEmpty
                          sx={{
                            height: { xs: 28, sm: 36, md: 45 },
                            "& .MuiInputBase-input, & .MuiSelect-select": {
                              padding: { xs: "8px", sm: "10px", md: "12px" },
                            },
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                          }}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                            PaperProps: {
                              style: {
                                maxHeight: 350,
                              },
                            },
                          }}
                        >
                          <MuiMenuItem value="" disabled>
                            Select an account
                          </MuiMenuItem>
                          {accountGroups.map((group) =>
                            group.ledgers && group.ledgers.length > 0
                              ? [
                                  <ListSubheader key={`group-${group.id}`} className="bg-gray-50 font-bold text-gray-900 leading-8">
                                    {group.group_name}
                                  </ListSubheader>,
                                  ...group.ledgers.map((ledger: Ledger) => (
                                    <MuiMenuItem key={ledger.id} value={ledger.id} className="pl-6">
                                      {ledger.name}
                                    </MuiMenuItem>
                                  )),
                                ]
                              : null
                          )}
                        </MuiSelect>
                      </FormControl>
                    </div>

                    {/* Deposit To & Reference (Vendor Advance Only) */}
                    {activeTab === "vendor_advance" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Deposit To
                          </label>
                          <Select defaultValue="prepaid_expenses">
                            <SelectTrigger className="border-gray-300 bg-white text-gray-700 h-[38px] text-sm shadow-sm">
                              <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prepaid_expenses">
                                Prepaid Expenses
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Reference#
                          </label>
                          <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="border-gray-300 bg-white h-[38px] text-sm shadow-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ── BILLS TABLE (Bill Payment Only) ── */}
              {activeTab === "bill_payment" && (
                <div className="border border-gray-200 mt-6 bg-white">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200">
                    <FileText
                      className="w-[18px] h-[18px] text-[#db4a4a]"
                      strokeWidth={2}
                    />
                    <span className="text-[13px] font-bold tracking-wide text-[#333]">
                      BILLS
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        className="text-blue-500 text-xs hover:underline"
                        onClick={() => setAppliedAmounts({})}
                      >
                        Clear Applied Amount
                      </button>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 border-b border-black pb-2 text-xs font-medium text-black">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2">Bill#</div>
                      <div className="col-span-2">PO#</div>
                      <div className="col-span-2 text-right">Bill Amount</div>
                      <div className="col-span-2 text-right">Amount Due</div>
                      <div className="col-span-2 text-right flex items-center justify-end gap-1">
                        Payment Made <Info className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Loading */}
                    {billsLoading && (
                      <div className="py-10 text-center text-sm text-gray-500">
                        Loading bills...
                      </div>
                    )}

                    {/* Empty State */}
                    {!billsLoading && bills.length === 0 && (
                      <div className="py-12 text-center text-gray-800 text-sm border-b border-gray-200">
                        {selectedVendor
                          ? "There are no bills for this vendor."
                          : "Select a vendor to view bills."}
                      </div>
                    )}

                    {/* Bill Rows */}
                    {!billsLoading &&
                      bills.map((bill) => (
                        <div
                          key={bill.id}
                          className="grid grid-cols-12 gap-4 border-b border-gray-100 py-3 text-sm items-center hover:bg-gray-50 transition-colors"
                        >
                          <div className="col-span-2 text-gray-600 text-xs">
                            {bill.bill_date
                              ? new Date(bill.bill_date).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}
                          </div>
                          <div className="col-span-2">
                            <span className="text-blue-600 font-medium text-xs">
                              {bill.bill_number || "-"}
                            </span>
                            {bill.subject && (
                              <div className="text-[10px] text-gray-400 truncate">
                                {bill.subject}
                              </div>
                            )}
                          </div>
                          <div className="col-span-2 text-gray-600 text-xs">
                            {bill.order_number || "-"}
                          </div>
                          <div className="col-span-2 text-right text-gray-800 text-xs font-medium">
                            ₹{bill.total_amount.toFixed(2)}
                          </div>
                          <div className="col-span-2 text-right text-gray-800 text-xs">
                            ₹{bill.total_amount.toFixed(2)}
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <input
                              type="number"
                              min="0"
                              max={bill.total_amount}
                              step="0.01"
                              placeholder="0.00"
                              value={appliedAmounts[bill.id] ?? ""}
                              onChange={(e) =>
                                setAppliedAmounts((prev) => ({
                                  ...prev,
                                  [bill.id]: e.target.value,
                                }))
                              }
                              className="w-24 text-right border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
                            />
                          </div>
                        </div>
                      ))}

                    {/* Total Row */}
                    <div className="flex justify-between items-center py-4">
                      <div className="text-sm font-medium">Total :</div>
                      <div className="text-sm text-gray-700 font-medium">
                        ₹{totalApplied.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Card (Bill Payment Only) */}
              {activeTab === "bill_payment" && (
                <div className="flex justify-end">
                  <div className="bg-[#fff8f0] rounded-lg p-6 w-[400px] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-gray-800">
                        ₹
                        {parseFloat(amount)
                          ? parseFloat(amount).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Amount used for Payments:
                      </span>
                      <span className="text-gray-800">
                        ₹{totalApplied.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Refunded:</span>
                      <span className="text-gray-800">₹0.00</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-gray-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-400 fill-orange-400 text-white" />
                        Amount in Excess:
                      </span>
                      <span className="font-medium text-gray-800">
                        ₹{amountInExcess.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CUSTOMER NOTES ── */}
              <div className="border border-gray-200 mt-6 bg-white">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200">
                  <FileText
                    className="w-[18px] h-[18px] text-[#db4a4a]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] font-bold tracking-wide text-[#333]">
                    NOTES
                  </span>
                </div>
                <div className="p-5">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[96px] border border-gray-400 p-3 text-sm rounded-[4px] resize-y placeholder-gray-400 focus:outline-none"
                    placeholder="Enter any notes for the customer"
                  />
                </div>
              </div>

              {/* ── ATTACH FILES ── */}
              <div className="border border-gray-200 mt-6 bg-white">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200">
                  <Paperclip
                    className="w-[18px] h-[18px] text-[#db4a4a]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] font-bold tracking-wide text-[#333]">
                    ATTACH FILES TO SALES ORDER
                  </span>
                </div>
                <div className="p-5">
                  <div className="border border-dashed border-gray-300 p-12 text-center bg-white hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (attachmentFiles.length + files.length > 10) {
                          sonnerToast.error("Maximum 10 files allowed.");
                          return;
                        }
                        setAttachmentFiles((prev) => [...prev, ...files]);
                      }}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center m-0"
                    >
                      <CloudUpload className="w-8 h-8 text-[#98a2b3] mb-3" />
                      <Typography
                        variant="body2"
                        className="text-[#344054] font-semibold mb-1"
                      >
                        Upload File
                      </Typography>
                      <Typography variant="caption" className="text-[#667085]">
                        You can upload a maximum of 10 files, 5MB each
                      </Typography>
                    </label>
                  </div>

                  {attachmentFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {attachmentFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <AttachFile
                              fontSize="small"
                              className="text-gray-500"
                            />
                            <span className="text-sm text-gray-700">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachmentFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <MuiClose
                              fontSize="small"
                              className="text-gray-500"
                            />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Additional Fields: Start adding custom fields for your
                  payments made by going to{" "}
                  <span className="text-gray-700 text-xs italic">
                    Settings ➜ Purchases ➜ Payments Made.
                  </span>
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 flex items-center justify-center gap-4 border-t border-gray-200 pt-6 pb-4">
                <Button
                  variant="outline"
                  disabled={isSaving}
                  className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => handleSave("DRAFT")}
                >
                  {isSaving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  disabled={isSaving}
                  className="bg-[#2977ff] hover:bg-blue-600 text-white h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => handleSave("PAID")}
                >
                  {isSaving ? "Saving..." : "Save as Paid"}
                </Button>
                <Button
                  variant="outline"
                  disabled={isSaving}
                  className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => navigate("/accounting/payments-made")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Tabs>

        {/* Vendor Details Sidebar / Sheet */}
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent
            className="w-[450px] sm:w-[500px] sm:max-w-[500px] p-0"
            side="right"
          >
            <div className="p-6 border-b border-gray-200 relative">
              <SheetClose className="absolute right-4 top-4 rounded-sm hover:opacity-100 opacity-70">
                <X className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-medium">
                  {(selectedSupplier?.name ?? "?")[0].toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-gray-500">Vendor</div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedSupplier?.name ?? "-"}
                    </h2>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[calc(100vh-100px)] overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{selectedSupplier?.name ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-blue-500">
                      {selectedSupplier?.email ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-b border-gray-200 mt-6 px-4">
                  <div
                    onClick={() => setActiveSheetTab("details")}
                    className={cn(
                      "pb-2 text-sm font-medium cursor-pointer transition-colors",
                      activeSheetTab === "details"
                        ? "border-b-2 border-blue-600 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Details
                  </div>
                  <div
                    onClick={() => setActiveSheetTab("activity_log")}
                    className={cn(
                      "pb-2 text-sm font-medium cursor-pointer transition-colors",
                      activeSheetTab === "activity_log"
                        ? "border-b-2 border-blue-600 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Activity Log
                  </div>
                </div>

                {activeSheetTab === "details" && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm bg-white">
                        <AlertTriangle className="h-5 w-5 text-orange-400 fill-orange-400" />
                        <div className="text-xs text-gray-500 text-center">
                          Outstanding Payables
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹0.00
                        </div>
                      </div>
                      <div className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm bg-white">
                        <Gem className="h-5 w-5 text-green-500 fill-green-500" />
                        <div className="text-xs text-gray-500 text-center">
                          Unused Credits
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹0.00
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg mt-6 overflow-hidden">
                      <div className="bg-white p-4 border-b border-gray-100">
                        <h3 className="font-medium text-sm text-gray-900">
                          Contact Details
                        </h3>
                      </div>
                      <div className="p-4 space-y-4 bg-white">
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">Currency</div>
                          <div className="text-gray-900 font-medium">
                            {selectedSupplier?.currency ?? "INR"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">Payment Terms</div>
                          <div className="text-gray-900 font-medium">
                            {selectedSupplier?.payment_terms ??
                              "Due on Receipt"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">PAN</div>
                          <div className="text-gray-900 font-medium">
                            {selectedSupplier?.pan_number ?? "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg mt-4 bg-white px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">
                        Contact Persons{" "}
                        <span className="bg-gray-400 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
                          1
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="border border-gray-200 rounded-lg mt-4 bg-white px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">
                        Address
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {activeSheetTab === "activity_log" && (
                  <div className="p-6 bg-gray-50/50 min-h-full">
                    <div className="relative space-y-8 pl-4">
                      <div className="absolute left-[27px] top-2 bottom-0 w-[2px] bg-gray-100 -z-10" />

                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:47 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Expense of amount ₹122.00 created
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:06 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Payment of amount ₹250.00 made and applied for 123
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:00 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Purchase Order of amount ₹250.00 converted as bill
                            123
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 11/02/2026 11:56 PM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Purchase Order PO-00002 emailed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Configure Payment Number Preferences Modal */}
        <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-xl">
            <DialogHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Configure Payment Number Preferences
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose how your payment numbers should be generated. You can automate the sequence or enter them manually for each payment.
              </p>
              
              <RadioGroup
                value={modalAutoGenerate ? "auto" : "manual"}
                onValueChange={(val) => setModalAutoGenerate(val === "auto")}
                className="gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="auto" id="auto" className="text-blue-600 border-gray-300" />
                    <Label htmlFor="auto" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Auto-generate payment number
                    </Label>
                  </div>
                  
                  {modalAutoGenerate && (
                    <div className="grid grid-cols-2 gap-4 pl-7">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prefix</Label>
                        <Input
                          value={modalPrefix}
                          onChange={(e) => setModalPrefix(e.target.value)}
                          className="h-9 border-gray-300 text-sm focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Number</Label>
                        <Input
                          type="number"
                          value={modalNextNumber}
                          onChange={(e) => setModalNextNumber(e.target.value)}
                          className="h-9 border-gray-300 text-sm focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="manual" id="manual" className="text-blue-600 border-gray-300" />
                    <Label htmlFor="manual" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Add payment number manually for this payment
                    </Label>
                  </div>

                  {!modalAutoGenerate && (
                    <div className="grid grid-cols-2 gap-4 pl-7">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-gray-400">Prefix</Label>
                        <Input
                          value={modalPrefix}
                          onChange={(e) => setModalPrefix(e.target.value)}
                          className="h-9 border-gray-300 text-sm focus:ring-blue-500"
                          placeholder="e.g. PAY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-gray-400">Payment Number</Label>
                        <Input
                          value={modalNextNumber}
                          onChange={(e) => setModalNextNumber(e.target.value)}
                          className="h-9 border-gray-300 text-sm focus:ring-blue-500"
                          placeholder="e.g. 1001"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
            
            <DialogFooter className="px-6 py-4 bg-gray-50 flex items-center gap-3">
              <Button
                onClick={() => {
                  setPaymentConfig({
                    autoGenerate: modalAutoGenerate,
                    prefix: modalPrefix,
                    nextNumber: parseInt(modalNextNumber, 10) || 1,
                  });
                  setIsConfigModalOpen(false);
                  
                  if (selectedVendor) {
                    setPaymentNumber(`${modalPrefix}${modalNextNumber}`);
                  }
                }}
                className="bg-[#2977ff] hover:bg-blue-600 text-white h-9 px-6 text-sm font-medium rounded-[4px]"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
                className="h-9 px-6 text-sm border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </TooltipProvider>
  );
};
