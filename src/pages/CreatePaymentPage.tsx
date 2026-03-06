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
import axios from "axios";

export const CreatePaymentPage: React.FC = () => {
  const navigate = useNavigate();

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
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidThrough, setPaidThrough] = useState("Petty Cash");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  // Ledger & tax IDs
  const [paidFromLedgerId] = useState(1);
  const [depositToLedgerId] = useState(2);
  const [lockAccountTaxId] = useState(1);
  // Attachments
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bills fetched from API after vendor selection
  const [bills, setBills] = useState<LockAccountBill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [appliedAmounts, setAppliedAmounts] = useState<Record<number, string>>(
    {}
  );

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

  const fetchBills = useCallback(
    async (vendorId: string) => {
      if (!API_CONFIG.TOKEN) return;

      setBillsLoading(true);
      setBills([]);
      setAppliedAmounts({});
      try {
        const res = await accountingClient.get("/lock_account_bills.json", {
          params: { lock_account_id: 1 },
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
          lock_account_id: 1,
          payment_of: "Pms::Supplier",
          payment_of_id: parseInt(selectedVendor, 10),
          paid_amount: paidAmount,
          lock_account_tax_id: lockAccountTaxId,
          payment_date: paymentDate,
          payment_mode: paymentMode,
          order_number: paymentNumber || "",
          paid_from_ledger_id: paidFromLedgerId,
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

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setIsVendorOpen(false);
    fetchBills(vendorId);
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

  return (
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

            {/* ── FIELDSET: Vendor Name with floating label on dropdown border ── */}
            <div className="relative mt-2">
              <fieldset className="border border-gray-300 rounded-md px-4 pb-4 bg-[#f9f9fa]">
                <legend className="px-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-[#f9f9fa]">
                  Vendor Name*
                </legend>
                <div className="relative">
                  <Popover open={isVendorOpen} onOpenChange={setIsVendorOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isVendorOpen}
                        className={cn(
                          "w-full justify-between text-left font-normal h-9 bg-white hover:bg-white focus:ring-0 rounded-[4px]",
                          selectedVendor
                            ? "border-gray-300 text-gray-900"
                            : "text-gray-400 border-red-300"
                        )}
                      >
                        {selectedSupplier ? (
                          <span className="flex items-center gap-2 truncate">
                            <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold flex items-center justify-center shrink-0">
                              {(
                                selectedSupplier.name?.[0] ?? "?"
                              ).toUpperCase()}
                            </span>
                            <span className="font-medium text-gray-900 truncate">
                              {selectedSupplier.name}
                            </span>
                          </span>
                        ) : (
                          <span className="truncate">
                            {selectedVendor
                              ? "Loading..."
                              : suppliersLoading
                                ? "Loading vendors..."
                                : "Select Vendor"}
                          </span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search" />
                        <CommandList>
                          <CommandEmpty>No vendor found.</CommandEmpty>
                          <CommandGroup>
                            {suppliersLoading ? (
                              <div className="py-4 text-center text-xs text-gray-500">
                                Loading suppliers...
                              </div>
                            ) : (
                              suppliers.map((supplier) => (
                                <CommandItem
                                  key={supplier.id}
                                  value={supplier.name}
                                  onSelect={() =>
                                    handleVendorSelect(String(supplier.id))
                                  }
                                  onClick={() =>
                                    handleVendorSelect(String(supplier.id))
                                  }
                                  className="flex items-center gap-3 p-2 cursor-pointer aria-selected:bg-blue-50"
                                >
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                                    {(supplier.name ?? "?")[0].toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-blue-600 text-sm">
                                      {supplier.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                      <span>{supplier.email ?? "-"}</span>
                                      {supplier.company_name && (
                                        <span className="border-l border-gray-300 pl-2">
                                          {supplier.company_name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {selectedVendor === String(supplier.id) && (
                                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                                  )}
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </fieldset>
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
              {/* ── FIELDSET BOX: Payment Details ── */}
              <fieldset className="border border-gray-300 rounded-md px-5 pb-5">
                <legend className="px-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-white">
                  Payment Details
                </legend>

                <div className="space-y-4 mt-3">
                  {/* Payment # — label on input border */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-5">
                      <fieldset className="border border-gray-200 rounded-md">
                        <legend className="px-2 ml-2 text-xs font-medium text-gray-500 bg-white">
                          Payment #*
                        </legend>
                        <div className="relative px-2 pb-2">
                          <Input
                            value={paymentNumber}
                            onChange={(e) => setPaymentNumber(e.target.value)}
                            className="pr-8 border-0 bg-white h-8 text-sm shadow-none focus-visible:ring-0 p-0"
                          />
                          <Settings className="absolute right-3 top-1.5 h-4 w-4 text-blue-400 cursor-pointer opacity-70" />
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* Payment Made — label on input border */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-5">
                      <fieldset className="border border-gray-200 rounded-md">
                        <legend className="px-2 ml-2 text-xs font-medium text-gray-500 bg-white">
                          Payment Made*
                        </legend>
                        <div className="flex items-center px-2 pb-2">
                          <span className="text-gray-500 text-sm font-medium mr-2">
                            INR
                          </span>
                          <Input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 border-0 bg-white h-8 text-sm shadow-none focus-visible:ring-0 p-0"
                          />
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* TDS (Vendor Advance Only) — label on input border */}
                  {activeTab === "vendor_advance" && (
                    <div className="grid grid-cols-12 gap-8 items-center">
                      <div className="col-span-5">
                        <fieldset className="border border-gray-200 rounded-md">
                          <legend className="px-2 ml-2 text-xs font-medium text-gray-500 bg-white">
                            TDS
                          </legend>
                          <div className="px-2 pb-2">
                            <Select>
                              <SelectTrigger className="border-0 bg-white text-gray-700 h-8 text-sm shadow-none focus:ring-0 p-0">
                                <SelectValue placeholder="Select a Tax" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <SelectItem value="commission_brokerage_2">
                                  Commission or Brokerage [2%]
                                </SelectItem>
                                <SelectItem value="commission_brokerage_reduced_3_75">
                                  Commission or Brokerage (Reduced) [3.75%]
                                </SelectItem>
                                <SelectItem value="dividend_10">
                                  Dividend [10%]
                                </SelectItem>
                                <SelectItem value="dividend_reduced_7_5">
                                  Dividend (Reduced) [7.5%]
                                </SelectItem>
                                <SelectItem value="other_interest_10">
                                  Other Interest than securities [10%]
                                </SelectItem>
                                <SelectItem value="other_interest_reduced_7_5">
                                  Other Interest than securities (Reduced)
                                  [7.5%]
                                </SelectItem>
                                <SelectItem value="contractors_others_2">
                                  Payment of contractors for Others [2%]
                                </SelectItem>
                                <SelectItem value="contractors_others_reduced_1_5">
                                  Payment of contractors for Others (Reduced)
                                  [1.5%]
                                </SelectItem>
                                <SelectItem value="contractors_huf_1">
                                  Payment of contractors HUF/Indiv [1%]
                                </SelectItem>
                                <SelectItem value="contractors_huf_reduced_0_75">
                                  Payment of contractors HUF/Indiv (Reduced)
                                  [0.75%]
                                </SelectItem>
                                <SelectItem value="professional_fees_10">
                                  Professional Fees [10%]
                                </SelectItem>
                                <SelectItem value="professional_fees_reduced_7_5">
                                  Professional Fees (Reduced) [7.5%]
                                </SelectItem>
                                <SelectItem value="rent_land_furniture_10">
                                  Rent on land or furniture etc [10%]
                                </SelectItem>
                                <SelectItem value="rent_land_furniture_reduced_7_5">
                                  Rent on land or furniture etc (Reduced) [7.5%]
                                </SelectItem>
                                <SelectItem value="tds_1">TDS [1%]</SelectItem>
                                <SelectItem value="technical_fees_2">
                                  Technical Fees (2%) [2%]
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  )}

                  {/* Payment Date — label on input border */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-5">
                      <fieldset className="border border-gray-200 rounded-md">
                        <legend className="px-2 ml-2 text-xs font-medium text-gray-500 bg-white">
                          Payment Date*
                        </legend>
                        <div className="px-2 pb-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white h-8 text-sm p-0 hover:bg-white shadow-none",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                {date
                                  ? format(date, "dd/MM/yyyy")
                                  : "dd/MM/yyyy"}
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
                      </fieldset>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* ── FIELDSET BOX: Payment Method ── */}
              <fieldset className="border border-gray-300 rounded-md px-5 pb-5">
                <legend className="px-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-white">
                  Payment Method
                </legend>

                <div className="space-y-4 mt-3">
                  {/* Payment Mode */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <Label className="col-span-2 text-gray-700 font-medium text-sm">
                      Payment Mode
                    </Label>
                    <div className="col-span-5">
                      <Select
                        value={paymentMode}
                        onValueChange={setPaymentMode}
                      >
                        <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
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
                  </div>

                  {/* Paid Through */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <Label className="col-span-2 text-black font-medium text-sm">
                      Paid Through*
                    </Label>
                    <div className="col-span-5">
                      <Select
                        value={paidThrough}
                        onValueChange={setPaidThrough}
                      >
                        <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petty_cash">Petty Cash</SelectItem>
                          <SelectItem value="undeposited_funds">
                            Undeposited Funds
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Deposit To & Reference (Vendor Advance Only) */}
                  {activeTab === "vendor_advance" && (
                    <>
                      <div className="grid grid-cols-12 gap-8 items-center">
                        <Label className="col-span-2 text-gray-700 font-medium text-sm">
                          Deposit To
                        </Label>
                        <div className="col-span-5">
                          <Select defaultValue="prepaid_expenses">
                            <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                              <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prepaid_expenses">
                                Prepaid Expenses
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-8 items-center">
                        <Label className="col-span-2 text-gray-700 font-medium text-sm">
                          Reference#
                        </Label>
                        <div className="col-span-5">
                          <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="border-gray-200 bg-white h-9 text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </fieldset>

              {/* ── FIELDSET BOX: Bills Table (Bill Payment Only) ── */}
              {activeTab === "bill_payment" && (
                <fieldset className="border border-gray-300 rounded-md px-5 pb-5">
                  <legend className="px-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-white">
                    Bills
                  </legend>

                  <div className="mt-3">
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
                              className="w-24 text-right border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
                            />
                          </div>
                        </div>
                      ))}

                    {/* Total Row */}
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div className="text-sm font-medium">Total :</div>
                      <div className="text-sm text-gray-700 font-medium">
                        ₹{totalApplied.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </fieldset>
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

              {/* ── FIELDSET BOX: Notes & Attachments ── */}
              <fieldset className="border border-gray-300 rounded-md px-5 pb-5">
                <legend className="px-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-white">
                  Notes &amp; Attachments
                </legend>

                <div className="grid grid-cols-12 gap-8 mt-3">
                  <div className="col-span-7 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Notes (Internal use. Not visible to vendor)
                      </Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-24 w-full border-gray-300 bg-white"
                        placeholder="Add internal notes..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium text-sm">
                        Attachments
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="h-8 border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 gap-2 font-normal text-xs"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-3 w-3" />
                          Upload File
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          accept="*/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (attachmentFiles.length + files.length > 5) {
                              sonnerToast.error("Maximum 5 files allowed.");
                              return;
                            }
                            setAttachmentFiles((prev) => [...prev, ...files]);
                          }}
                        />
                      </div>
                      {attachmentFiles.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {attachmentFiles.map((file, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs text-gray-700"
                            >
                              <span className="truncate max-w-[200px]">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAttachmentFiles((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="text-red-400 hover:text-red-600 ml-auto"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-[11px] text-gray-500 mt-1">
                        You can upload a maximum of 5 files, 10MB each
                      </p>
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
                  </div>
                </div>
              </fieldset>

              {/* Footer Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 pb-4">
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
      </div>
    </div>
  );
};
