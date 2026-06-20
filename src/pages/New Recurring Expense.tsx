// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Checkbox,
//   CircularProgress,
//   FormControl,
//   FormControlLabel,
//   InputAdornment,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
//   Button,
// } from "@mui/material";
// import { Receipt, Calendar, FileText, CreditCard, RefreshCw } from "lucide-react";
// import { toast as sonnerToast } from "sonner";

// // ─────────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────────

// interface AccountLedger {
//   id: number;
//   name: string;
//   formatted_name: string;
//   lock_account_group_id: number;
//   active: boolean;
//   tax_preference?: string;
//   tax_exemption_id?: number | null;
//   tax_group_id?: number | null;
//   intra_state_tax_rate_id?: number | null;
// }

// interface Vendor {
//   id: number;
//   name: string;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Static data
// // ─────────────────────────────────────────────────────────────────────────────

// const REPEAT_OPTIONS = [
//   { label: "Week", value: "week" },
//   { label: "2 Weeks", value: "2weeks" },
//   { label: "Month", value: "month" },
//   { label: "2 Months", value: "2months" },
//   { label: "3 Months", value: "3months" },
//   { label: "6 Months", value: "6months" },
//   { label: "Year", value: "year" },
//   { label: "2 Years", value: "2years" },
//   { label: "3 Years", value: "3years" },
//   { label: "Custom", value: "custom" },
// ];

// const CUSTOM_FREQ_OPTIONS = ["Day(s)", "Week(s)", "Month(s)", "Year(s)"];

// const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED"];

// const GST_TREATMENTS = [
//   { value: "registered_business_regular", label: "Registered Business - Regular" },
//   { value: "registered_business_composition", label: "Registered Business - Composition" },
//   { value: "unregistered_business", label: "Unregistered Business" },
//   { value: "consumer", label: "Consumer" },
//   { value: "overseas", label: "Overseas" },
//   { value: "special_economic_zone", label: "Special Economic Zone" },
//   { value: "deemed_export", label: "Deemed Export" },
//   { value: "non_gst_supply", label: "Non-GST Supply" },
//   { value: "out_of_scope", label: "Out of scope" },
//   { value: "tax_deductor", label: "Tax Deductor" },
//   { value: "sez_developer", label: "SEZ Developer" },
//   { value: "input_service_distributor", label: "Input Service Distributor" },
// ];

// const INDIAN_STATES = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
//   "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
//   "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
//   "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
//   "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
//   "Andaman and Nicobar Islands", "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
// ];

// const GST_TREATMENT_MAP: Record<string, string> = {
//   registered_regular: "registered_business_regular",
//   registered_composition: "registered_business_composition",
// };

// const normalizeGstTreatment = (val: string): string =>
//   GST_TREATMENT_MAP[val] || val;
// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// const getApiUrl = (): string => {
//   const base = localStorage.getItem("baseUrl") || "";
//   return base.startsWith("http") ? base : `https://${base}`;
// };

// const formatDateGB = (date: Date): string =>
//   date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

// const calcNextOccurrence = (
//   startDateStr: string,
//   repeatEvery: string,
//   customNum: number,
//   customFreq: string
// ): string => {
//   if (!startDateStr) return "";
//   const d = new Date(startDateStr);
//   if (isNaN(d.getTime())) return "";
//   const n = new Date(d);
//   switch (repeatEvery) {
//     case "week": n.setDate(n.getDate() + 7); break;
//     case "2weeks": n.setDate(n.getDate() + 14); break;
//     case "month": n.setMonth(n.getMonth() + 1); break;
//     case "2months": n.setMonth(n.getMonth() + 2); break;
//     case "3months": n.setMonth(n.getMonth() + 3); break;
//     case "6months": n.setMonth(n.getMonth() + 6); break;
//     case "year": n.setFullYear(n.getFullYear() + 1); break;
//     case "2years": n.setFullYear(n.getFullYear() + 2); break;
//     case "3years": n.setFullYear(n.getFullYear() + 3); break;
//     case "custom": {
//       const num = customNum || 1;
//       if (customFreq.startsWith("Day")) n.setDate(n.getDate() + num);
//       else if (customFreq.startsWith("Week")) n.setDate(n.getDate() + num * 7);
//       else if (customFreq.startsWith("Month")) n.setMonth(n.getMonth() + num);
//       else n.setFullYear(n.getFullYear() + num);
//       break;
//     }
//   }
//   return formatDateGB(n);
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Shared field styles (matches original page)
// // ─────────────────────────────────────────────────────────────────────────────

// const fieldStyles = {
//   height: { xs: 28, sm: 36, md: 45 },
//   "& .MuiInputBase-input, & .MuiSelect-select": {
//     padding: { xs: "8px", sm: "10px", md: "12px" },
//   },
// } as const;

// // ─────────────────────────────────────────────────────────────────────────────
// // Section component (matches original page exactly)
// // ─────────────────────────────────────────────────────────────────────────────

// const Section: React.FC<{
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }> = ({ title, icon, children }) => (
//   <section className="bg-card rounded-lg border border-border shadow-sm">
//     <div className="px-6 py-4 border-b border-border flex items-center gap-3">
//       <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
//         {icon}
//       </div>
//       <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
//     </div>
//     <div className="p-6">{children}</div>
//   </section>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────────────────────────────────────

// const NewRecurringExpensePage: React.FC = () => {
//   const navigate = useNavigate();

//   useEffect(() => { document.title = "New Recurring Expense"; }, []);

//   // ── Recurring state ───────────────────────────────────────────────────────
//   const [profileName, setProfileName] = useState("");
//   const [repeatEvery, setRepeatEvery] = useState("week");
//   const [customNum, setCustomNum] = useState(1);
//   const [customFreq, setCustomFreq] = useState("Week(s)");
//   const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
//   const [endsOn, setEndsOn] = useState("");
//   const [neverExpires, setNeverExpires] = useState(true);

//   // ── Expense state ─────────────────────────────────────────────────────────
//   const [expenseAccount, setExpenseAccount] = useState("");
//   const [currency, setCurrency] = useState("INR");
//   const [amount, setAmount] = useState("");
//   const [paidThrough, setPaidThrough] = useState("");
//   const [expenseType, setExpenseType] = useState<"goods" | "services">("goods");
//   const [hsnCode, setHsnCode] = useState("");
//   const [sacCode, setSacCode] = useState("");
//   const [vendor, setVendor] = useState("");
//   const [gstTreatment, setGstTreatment] = useState("");
//   const [gstin, setGstin] = useState("");
//   const [sourceOfSupply, setSourceOfSupply] = useState("");
//   const [destinationOfSupply, setDestinationOfSupply] = useState("Maharashtra");
//   const [reverseCharge, setReverseCharge] = useState(false);
//   const [taxType, setTaxType] = useState("");
//   const [taxGroupId, setTaxGroupId] = useState<number | string | null>(null);
//   const [taxExemptionId, setTaxExemptionId] = useState<number | string | null>(null);
//   const [amountIs, setAmountIs] = useState<"inclusive" | "exclusive">("exclusive");
//   const [notes, setNotes] = useState("");
//   const [customer, setCustomer] = useState("");

//   // ── Vendor GST detail state ───────────────────────────────────────────────
//   const [vendorDetail, setVendorDetail] = useState<any>(null);
//   const [vendorDetailLoading, setVendorDetailLoading] = useState(false);
//   const [gstDetails, setGstDetails] = useState<any[]>([]);
//   const [selectedGstDetailId, setSelectedGstDetailId] = useState<any>(null);

//   // ── API data ──────────────────────────────────────────────────────────────
//   const [accountLedgers, setAccountLedgers] = useState<AccountLedger[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [taxGroups, setTaxGroups] = useState<any[]>([]);
//   const [exemptions, setExemptions] = useState<any[]>([]);

//   const [loadingAccounts, setLoadingAccounts] = useState(false);
//   const [loadingVendors, setLoadingVendors] = useState(false);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [loadingTaxGroups, setLoadingTaxGroups] = useState(false);
//   const [loadingExemptions, setLoadingExemptions] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [tagAccountSearch, setTagAccountSearch] = useState("");
//   const [tagAccountOpen, setTagAccountOpen] = useState(false);
//   const [selectedTagAccount, setSelectedTagAccount] = useState<{ id: string; label: string } | null>(null);
//   const [pendingTagAccount, setPendingTagAccount] = useState<{ id: string; label: string } | null>(null);

//   // ── API fetches ───────────────────────────────────────────────────────────

//   useEffect(() => {
//     const run = async () => {
//       setLoadingAccounts(true);
//       try {
//         const apiUrl = getApiUrl();
//         const token = localStorage.getItem("token");
//         const lockAccountId = localStorage.getItem("lock_account_id");
//         const res = await window.fetch(
//           `${apiUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (res.ok) {
//           const data: AccountLedger[] = await res.json();
//           setAccountLedgers(data.filter((a) => a.active));
//         }
//       } catch {
//         sonnerToast.error("Failed to load accounts");
//       } finally {
//         setLoadingAccounts(false);
//       }
//     };
//     run();
//   }, []);

//   useEffect(() => {
//     const run = async () => {
//       setLoadingVendors(true);
//       try {
//         const apiUrl = getApiUrl();
//         const token = localStorage.getItem("token");
//         const res = await window.fetch(
//           `${apiUrl}/pms/purchase_orders/get_suppliers.json?access_token=${token}`
//         );
//         if (res.ok) {
//           const data = await res.json();
//           if (data.status === "success") setVendors(data.suppliers || []);
//         }
//       } catch {
//         sonnerToast.error("Failed to load vendors");
//       } finally {
//         setLoadingVendors(false);
//       }
//     };
//     run();
//   }, []);

//   useEffect(() => {
//     const apiUrl = getApiUrl();
//     const token = localStorage.getItem("token");
//     const lockId = localStorage.getItem("lock_account_id");
//     setLoadingTaxGroups(true);
//     axios
//       .get(`${apiUrl}/lock_accounts/${lockId}/tax_groups_view.json`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setTaxGroups(res.data || []))
//       .catch(() => sonnerToast.error("Failed to load tax groups"))
//       .finally(() => setLoadingTaxGroups(false));
//   }, []);

//   useEffect(() => {
//     const apiUrl = getApiUrl();
//     const token = localStorage.getItem("token");
//     const lockId = localStorage.getItem("lock_account_id");
//     setLoadingExemptions(true);
//     axios
//       .get(
//         `${apiUrl}/tax_exemptions.json?lock_account_id=${lockId}&q[exemption_type_eq]=item`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then((res) => setExemptions(res.data || []))
//       .catch(() => sonnerToast.error("Failed to load exemptions"))
//       .finally(() => setLoadingExemptions(false));
//   }, []);

//   useEffect(() => {
//     const apiUrl = getApiUrl();
//     const token = localStorage.getItem("token");
//     const lockAccountId = localStorage.getItem("lock_account_id");
//     setLoadingCustomers(true);
//     axios
//       .get(`${apiUrl}/lock_account_customers.json?lock_account_id=${lockAccountId}`, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       })
//       .then((res) => setCustomers(res.data || []))
//       .catch(() => sonnerToast.error("Failed to load customers"))
//       .finally(() => setLoadingCustomers(false));
//   }, []);

//   // ── Vendor detail ─────────────────────────────────────────────────────────

//   const fetchVendorDetail = async (vendorId: string) => {
//     if (!vendorId) {
//       setVendorDetail(null);
//       setGstDetails([]);
//       setSelectedGstDetailId(null);
//       setGstTreatment("");
//       setSourceOfSupply("");
//       setGstin("");
//       return;
//     }
//     const apiUrl = getApiUrl();
//     const token = localStorage.getItem("token");
//     setVendorDetailLoading(true);
//     try {
//       const res = await axios.get(
//         `${apiUrl}/pms/suppliers/${vendorId}.json?access_token=${token}`
//       );
//       const data = res.data?.supplier || res.data;
//       setVendorDetail(data);
//       if (data.gst_preference) setGstTreatment(normalizeGstTreatment(data.gst_preference));
//       const nextGst: any[] = Array.isArray(data.gst_details) ? data.gst_details : [];
//       setGstDetails(nextGst);
//       const primaryGst =
//         nextGst.find((g) => g.primary) || nextGst[0] || data.primary_gst_detail || null;
//       if (primaryGst) {
//         setSelectedGstDetailId(primaryGst.id ?? null);
//         if (primaryGst.place_of_supply) setSourceOfSupply(primaryGst.place_of_supply);
//         if (primaryGst.gstin) setGstin(primaryGst.gstin);
//       }
//     } catch {
//       sonnerToast.error("Failed to load vendor details");
//     } finally {
//       setVendorDetailLoading(false);
//     }
//   };

//   const handleVendorChange = (vendorId: string) => {
//     setVendor(vendorId);
//     fetchVendorDetail(vendorId);
//   };

//   // ── Tax helpers ───────────────────────────────────────────────────────────

//   const getLedgerTaxDefaults = (ledger: AccountLedger | undefined) => {
//     if (!ledger) return { taxType: "", taxGroupId: null, taxExemptionId: null };
//     const pref = ledger.tax_preference;
//     if (pref === "non_taxable")
//       return { taxType: "non_taxable", taxGroupId: null, taxExemptionId: ledger.tax_exemption_id ?? null };
//     if (pref === "taxable")
//       return {
//         taxType: "tax_group",
//         taxGroupId: ledger.tax_group_id ?? ledger.intra_state_tax_rate_id ?? null,
//         taxExemptionId: null,
//       };
//     if (pref === "out_of_scope" || pref === "non_gst_supply")
//       return { taxType: "non_taxable", taxGroupId: null, taxExemptionId: null };
//     return { taxType: "", taxGroupId: null, taxExemptionId: null };
//   };

//   const handleTaxChange = (val: string) => {
//     if (val === "non_taxable" || val === "") {
//       setTaxType(val);
//       setTaxGroupId(null);
//     } else {
//       setTaxType("tax_group");
//       setTaxGroupId(val);
//     }
//   };

//   // ── Next occurrence ───────────────────────────────────────────────────────

//   const nextOccurrence = useMemo(
//     () => calcNextOccurrence(startDate, repeatEvery, customNum, customFreq),
//     [startDate, repeatEvery, customNum, customFreq]
//   );

//   // ── Validation ────────────────────────────────────────────────────────────

//   const validate = (): boolean => {
//     const e: Record<string, string> = {};
//     if (!profileName) e.profileName = "Profile name is required";
//     if (!expenseAccount) e.expenseAccount = "Expense account is required";
//     if (!amount || parseFloat(amount) <= 0) e.amount = "Valid amount required";
//     if (!paidThrough) e.paidThrough = "Paid through is required";
//     if (!gstTreatment) e.gstTreatment = "GST treatment is required";
//     if (!sourceOfSupply) e.sourceOfSupply = "Source of supply is required";
//     if (!destinationOfSupply) e.destinationOfSupply = "Destination is required";
//     setErrors(e);
//     Object.values(e).forEach((msg, i) =>
//       setTimeout(() => sonnerToast.error(msg), i * 800)
//     );
//     return Object.keys(e).length === 0;
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────

//   const handleSave = async () => {
//     if (!validate()) return;
//     setIsSubmitting(true);
//     try {
//       const apiUrl = getApiUrl();
//       const token = localStorage.getItem("token");
//       const lockAccountId = localStorage.getItem("lock_account_id");

//       const repeatPayload =
//         repeatEvery === "custom"
//           ? { repeat_every: "custom", custom_repeat_every: customNum, custom_repeat_unit: customFreq }
//           : { repeat_every: repeatEvery };

//       const payload = {
//         recurring_expense: {
//           profile_name: profileName,
//           ...repeatPayload,
//           start_date: startDate,
//           end_date: neverExpires ? null : endsOn,
//           never_expires: neverExpires,
//           paid_through_account_id: parseInt(paidThrough),
//           ...(vendor && { vendor_id: parseInt(vendor) }),
//           ...(customer && { customer_id: parseInt(customer) }),
//           amount: parseFloat(amount),
//           is_inclusive_tax: reverseCharge ? false : amountIs === "inclusive",
//           gst_treatment: gstTreatment,
//           gstin,
//           source_of_supply: sourceOfSupply,
//           destination_of_supply: destinationOfSupply,
//           reverse_charge: reverseCharge,
//           notes,
//           expense_accounts_attributes: [
//             {
//               lock_account_ledger_id: parseInt(expenseAccount),
//               account_type: expenseType,
//               amount: parseFloat(amount),
//               hsn_sac_code: expenseType === "goods" ? hsnCode : sacCode,
//               tax_type: taxType,
//               ...(taxType === "tax_group" && { tax_group_id: taxGroupId }),
//               ...(taxType === "non_taxable" && { tax_exemption_id: taxExemptionId }),
//             },
//           ],
//         },
//       };

//       const res = await window.fetch(
//         `${apiUrl}/recurring_expenses.json?lock_account_id=${lockAccountId}`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (res.ok) {
//         sonnerToast.success("Recurring expense created successfully!");
//         navigate(-1);
//       } else {
//         const err = await res.json();
//         sonnerToast.error(err.message || "Failed to create recurring expense");
//       }
//     } catch {
//       sonnerToast.error("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => navigate(-1);

//   // ─────────────────────────────────────────────────────────────────────────
//   // Render
//   // ─────────────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-background p-6">
//       {/* Submitting overlay */}
//       {isSubmitting && (
//         <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
//           <div className="bg-card px-10 py-7 rounded-lg flex items-center gap-3">
//             <CircularProgress size={20} />
//             <span className="text-sm">Creating recurring expense…</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center gap-3">
//               <Receipt className="h-6 w-6 text-primary" />
//               New Recurring Expense
//             </h1>
//             <p className="text-sm text-muted-foreground mt-1">
//               Create a new recurring expense profile
//             </p>
//           </div>
//         </div>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 1 — Profile & Schedule
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Profile & Schedule"
//           icon={<Calendar className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Profile Name */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Profile Name*
//               </label>
//               <TextField
//                 value={profileName}
//                 onChange={(e) => setProfileName(e.target.value)}
//                 fullWidth
//                 placeholder="Enter profile name"
//                 error={!!errors.profileName}
//                 helperText={errors.profileName}
//                 sx={fieldStyles}
//               />
//             </div>

//             {/* Repeat Every */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Repeat Every*
//               </label>
//               <div className="flex gap-2 items-center">
//                 <FormControl sx={{ minWidth: 150 }}>
//                   <Select
//                     value={repeatEvery}
//                     onChange={(e) => setRepeatEvery(e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {REPEAT_OPTIONS.map((o) => (
//                       <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 {repeatEvery === "custom" && (
//                   <>
//                     <TextField
//                       type="number"
//                       value={customNum}
//                       onChange={(e) => setCustomNum(Number(e.target.value))}
//                       inputProps={{ min: 1, max: 999 }}
//                       sx={{ ...fieldStyles, width: 72 }}
//                     />
//                     <FormControl sx={{ minWidth: 110 }}>
//                       <Select
//                         value={customFreq}
//                         onChange={(e) => setCustomFreq(e.target.value)}
//                         sx={fieldStyles}
//                       >
//                         {CUSTOM_FREQ_OPTIONS.map((f) => (
//                           <MenuItem key={f} value={f}>{f}</MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             {/* Start Date */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Start Date</label>
//               <TextField
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 fullWidth
//                 sx={fieldStyles}
//               />
//               {nextOccurrence && (
//                 <p className="text-xs text-muted-foreground mt-2">
//                   The recurring expense will be created on {nextOccurrence}
//                 </p>
//               )}
//             </div>

//             {/* Ends On */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Ends On</label>
//               <TextField
//                 type="date"
//                 value={endsOn}
//                 onChange={(e) => setEndsOn(e.target.value)}
//                 fullWidth
//                 disabled={neverExpires}
//                 sx={fieldStyles}
//               />
//               <FormControlLabel
//                 className="mt-2"
//                 control={
//                   <Checkbox
//                     checked={neverExpires}
//                     onChange={(e) => setNeverExpires(e.target.checked)}
//                   />
//                 }
//                 label="Never Expires"
//               />
//             </div>
//           </div>
//         </Section>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 2 — Expense Account
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Expense Account"
//           icon={<FileText className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Expense Account */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Expense Account*
//               </label>
//               <FormControl fullWidth error={!!errors.expenseAccount}>
//                 <Select
//                   value={expenseAccount}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setExpenseAccount(val);
//                     const selected = accountLedgers.find((a) => a.id.toString() === val);
//                     const defaults = getLedgerTaxDefaults(selected);
//                     setTaxType(defaults.taxType);
//                     setTaxGroupId(defaults.taxGroupId);
//                     setTaxExemptionId(defaults.taxExemptionId);
//                   }}
//                   displayEmpty
//                   disabled={loadingAccounts}
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="" disabled>
//                     {loadingAccounts ? "Loading…" : "Select an account"}
//                   </MenuItem>
//                   {accountLedgers.map((a) => (
//                     <MenuItem key={a.id} value={a.id.toString()}>
//                       {a.formatted_name || a.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors.expenseAccount && (
//                 <p className="text-xs text-red-500 mt-1">{errors.expenseAccount}</p>
//               )}
//             </div>

//             {/* Expense Type */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Expense Type</label>
//               <RadioGroup
//                 row
//                 value={expenseType}
//                 onChange={(e) => {
//                   setExpenseType(e.target.value as "goods" | "services");
//                   setHsnCode("");
//                   setSacCode("");
//                 }}
//                 sx={{ gap: 2, mt: 0.5 }}
//               >
//                 <FormControlLabel value="goods" control={<Radio size="small" />} label="Goods" />
//                 <FormControlLabel value="services" control={<Radio size="small" />} label="Services" />
//               </RadioGroup>
//             </div>
//           </div>

//           {/* HSN / SAC Code */}
//           {(expenseType === "goods" || expenseType === "services") && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   {expenseType === "goods" ? "HSN Code" : "SAC Code"}
//                 </label>
//                 <TextField
//                   value={expenseType === "goods" ? hsnCode : sacCode}
//                   onChange={(e) =>
//                     expenseType === "goods"
//                       ? setHsnCode(e.target.value)
//                       : setSacCode(e.target.value)
//                   }
//                   fullWidth
//                   placeholder={expenseType === "goods" ? "Enter HSN code" : "Enter SAC code"}
//                   sx={fieldStyles}
//                 />
//               </div>
//             </div>
//           )}
//         </Section>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 3 — Payment Details
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Payment Details"
//           icon={<CreditCard className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Amount*
//               </label>
//               <div className="flex gap-2">
//                 <FormControl sx={{ minWidth: 90 }}>
//                   <Select
//                     value={currency}
//                     onChange={(e) => setCurrency(e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {CURRENCY_OPTIONS.map((c) => (
//                       <MenuItem key={c} value={c}>{c}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <TextField
//                   value={amount}
//                   onChange={(e) => {
//                     const p = parseFloat(e.target.value);
//                     setAmount(isNaN(p) ? "" : Math.max(0, p).toString());
//                   }}
//                   fullWidth
//                   placeholder="0.00"
//                   error={!!errors.amount}
//                   helperText={errors.amount}
//                   sx={fieldStyles}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">₹</InputAdornment>
//                     ),
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Paid Through */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Paid Through*
//               </label>
//               <FormControl fullWidth error={!!errors.paidThrough}>
//                 <Select
//                   value={paidThrough}
//                   onChange={(e) => setPaidThrough(e.target.value)}
//                   displayEmpty
//                   disabled={loadingAccounts}
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="" disabled>
//                     {loadingAccounts ? "Loading…" : "Select an account"}
//                   </MenuItem>
//                   {accountLedgers.map((a) => (
//                     <MenuItem key={a.id} value={a.id.toString()}>
//                       {a.formatted_name || a.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors.paidThrough && (
//                 <p className="text-xs text-red-500 mt-1">{errors.paidThrough}</p>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 4 — Vendor & GST Details
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Vendor & GST Details"
//           icon={<Receipt className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Vendor */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Vendor</label>
//               <div className="flex items-center gap-2">
//                 <FormControl fullWidth>
//                   <Select
//                     value={vendor}
//                     onChange={(e) => handleVendorChange(e.target.value)}
//                     displayEmpty
//                     disabled={loadingVendors}
//                     sx={fieldStyles}
//                   >
//                     <MenuItem value="">
//                       {loadingVendors ? "Loading…" : "Select a vendor"}
//                     </MenuItem>
//                     {vendors.map((v) => (
//                       <MenuItem key={v.id} value={v.id.toString()}>{v.name}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 {vendorDetailLoading && <CircularProgress size={18} />}
//               </div>
//             </div>

//             {/* GST Treatment */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 GST Treatment*
//               </label>
//               <FormControl fullWidth error={!!errors.gstTreatment}>
//                 <Select
//                   value={gstTreatment}
//                   onChange={(e) => setGstTreatment(e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="" disabled>Select treatment</MenuItem>
//                   {GST_TREATMENTS.map((t) => (
//                     <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors.gstTreatment && (
//                 <p className="text-xs text-red-500 mt-1">{errors.gstTreatment}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             {/* Vendor GSTIN */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Vendor GSTIN</label>
//               <TextField
//                 value={gstin}
//                 onChange={(e) => setGstin(e.target.value.toUpperCase())}
//                 fullWidth
//                 placeholder="e.g. 22AAAAA0000A1Z5"
//                 inputProps={{ maxLength: 15 }}
//                 sx={fieldStyles}
//               />
//             </div>

//             {/* Source of Supply */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Source of Supply*
//               </label>
//               <FormControl fullWidth error={!!errors.sourceOfSupply}>
//                 <Select
//                   value={sourceOfSupply}
//                   onChange={(e) => setSourceOfSupply(e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="" disabled>Select state</MenuItem>
//                   {INDIAN_STATES.map((s) => (
//                     <MenuItem key={s} value={s}>{s}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors.sourceOfSupply && (
//                 <p className="text-xs text-red-500 mt-1">{errors.sourceOfSupply}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             {/* Destination of Supply */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-red-500">
//                 Destination of Supply*
//               </label>
//               <FormControl fullWidth error={!!errors.destinationOfSupply}>
//                 <Select
//                   value={destinationOfSupply}
//                   onChange={(e) => setDestinationOfSupply(e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="" disabled>Select state</MenuItem>
//                   {INDIAN_STATES.map((s) => (
//                     <MenuItem key={s} value={s}>{s}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors.destinationOfSupply && (
//                 <p className="text-xs text-red-500 mt-1">{errors.destinationOfSupply}</p>
//               )}
//             </div>
//           </div>

//           {/* Reverse Charge */}
//           <div className="mt-4">
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={reverseCharge}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setReverseCharge(checked);
//                     if (checked) setAmountIs("exclusive");
//                   }}
//                 />
//               }
//               label="This transaction is applicable for reverse charge"
//             />
//           </div>
//         </Section>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 5 — Tax
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Tax"
//           icon={<FileText className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Tax Dropdown */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Tax</label>
//               <FormControl fullWidth>
//                 <Select
//                   value={taxType === "tax_group" ? ((taxGroupId ?? "") as string) : (taxType || "")}
//                   onChange={(e) => handleTaxChange(e.target.value)}
//                   displayEmpty
//                   disabled={loadingTaxGroups}
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="">
//                     {loadingTaxGroups ? "Loading…" : "Select a tax"}
//                   </MenuItem>
//                   <MenuItem value="non_taxable">Non-Taxable</MenuItem>
//                   <MenuItem disabled value="__divider__">── Tax Groups ──</MenuItem>
//                   {taxGroups.map((g) => (
//                     <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </div>

//             {/* Exemption Reason (only when non_taxable) */}
//             {taxType === "non_taxable" && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">Exemption Reason</label>
//                 <FormControl fullWidth>
//                   <Select
//                     value={(taxExemptionId ?? "") as string}
//                     onChange={(e) => setTaxExemptionId(e.target.value || null)}
//                     displayEmpty
//                     disabled={loadingExemptions}
//                     sx={fieldStyles}
//                   >
//                     <MenuItem value="">
//                       {loadingExemptions ? "Loading…" : "Select reason"}
//                     </MenuItem>
//                     {exemptions.map((ex) => (
//                       <MenuItem key={ex.id} value={ex.id}>{ex.reason}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </div>
//             )}
//           </div>

//           {/* Amount Is (hidden when reverse charge active) */}
//           {!reverseCharge && (
//             <div className="mt-4">
//               <label className="block text-sm font-medium mb-2">Amount Is</label>
//               <RadioGroup
//                 row
//                 value={amountIs}
//                 onChange={(e) => setAmountIs(e.target.value as "inclusive" | "exclusive")}
//                 sx={{ gap: 2 }}
//               >
//                 <FormControlLabel value="exclusive" control={<Radio size="small" />} label="Tax Exclusive" />
//                 <FormControlLabel value="inclusive" control={<Radio size="small" />} label="Tax Inclusive" />
//               </RadioGroup>
//             </div>
//           )}
//         </Section>

//         {/* ════════════════════════════════════════════════════════════════
//             SECTION 6 — Additional Details
//         ════════════════════════════════════════════════════════════════ */}
//         <Section
//           title="Additional Details"
//           icon={<Receipt className="h-3.5 w-3.5" />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Notes */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Notes</label>
//               <TextField
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 fullWidth
//                 multiline
//                 minRows={3}
//                 placeholder="Max. 500 characters"
//                 inputProps={{ maxLength: 500 }}
//               />
//               <p className="text-xs text-muted-foreground mt-1">
//                 {500 - notes.length} characters remaining
//               </p>
//             </div>

//             {/* Customer Name */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Customer Name</label>
//               <FormControl fullWidth>
//                 <Select
//                   value={customer}
//                   onChange={(e) => setCustomer(e.target.value)}
//                   displayEmpty
//                   disabled={loadingCustomers}
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value="">
//                     {loadingCustomers ? "Loading…" : "Select a customer"}
//                   </MenuItem>
//                   {customers.map((c) => (
//                     <MenuItem key={c.id} value={c.id.toString()}>{c.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block text-sm font-medium mb-2">Reporting Tags</label>
//             <button
//               type="button"
//               className="text-sm text-primary hover:underline"
//               onClick={() => {
//                 setPendingTagAccount(selectedTagAccount);
//                 setTagAccountSearch("");
//                 setTagAccountOpen(false);
//                 setShowTagModal(true);
//               }}
//             >
//               {selectedTagAccount ? `Tags: ${selectedTagAccount.label}` : "Associate Tags"}
//             </button>
//           </div>
//         </Section>

//         {/* Action Buttons */}
//         <div className="flex gap-4 pt-2 pb-6">
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             disabled={isSubmitting}
//             sx={{
//               textTransform: "none",
//               backgroundColor: "#f8e9e9",
//               color: "#c62828",
//               borderRadius: "6px",
//               boxShadow: "none",
//               padding: "8px 24px",
//               fontWeight: 600,
//               "&:hover": {
//                 backgroundColor: "#f4dede",
//                 boxShadow: "none",
//               },
//             }}
//           >
//             {isSubmitting ? "Saving…" : "Save"}
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleCancel}
//             disabled={isSubmitting}
//             sx={{
//               textTransform: "none",
//               color: "#c62828",
//               borderColor: "#c62828",
//               borderRadius: "6px",
//               padding: "8px 24px",
//               fontWeight: 600,
//               "&:hover": {
//                 borderColor: "#b71c1c",
//                 backgroundColor: "transparent",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default NewRecurringExpensePage;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { EditOutlined, Close as CloseIcon } from "@mui/icons-material";
import { Receipt, Calendar, FileText, CreditCard } from "lucide-react";
import { toast as sonnerToast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AccountLedger {
  id: number;
  name: string;
  formatted_name: string;
  lock_account_group_id: number;
  active: boolean;
  tax_preference?: string;
  tax_exemption_id?: number | null;
  tax_group_id?: number | null;
  intra_state_tax_rate_id?: number | null;
}

interface Vendor {
  id: number;
  name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const REPEAT_OPTIONS = [
  { label: "Week", value: "week" },
  { label: "2 Weeks", value: "2weeks" },
  { label: "Month", value: "month" },
  { label: "2 Months", value: "2months" },
  { label: "3 Months", value: "3months" },
  { label: "6 Months", value: "6months" },
  { label: "Year", value: "year" },
  { label: "2 Years", value: "2years" },
  { label: "3 Years", value: "3years" },
  { label: "Custom", value: "custom" },
];

const CUSTOM_FREQ_OPTIONS = ["Day(s)", "Week(s)", "Month(s)", "Year(s)"];

const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED"];

const GST_TREATMENTS = [
  { value: "registered_business_regular", label: "Registered Business - Regular" },
  { value: "registered_business_composition", label: "Registered Business - Composition" },
  { value: "unregistered_business", label: "Unregistered Business" },
  { value: "consumer", label: "Consumer" },
  { value: "overseas", label: "Overseas" },
  { value: "special_economic_zone", label: "Special Economic Zone" },
  { value: "deemed_export", label: "Deemed Export" },
  { value: "non_gst_supply", label: "Non-GST Supply" },
  { value: "out_of_scope", label: "Out of scope" },
  { value: "tax_deductor", label: "Tax Deductor" },
  { value: "sez_developer", label: "SEZ Developer" },
  { value: "input_service_distributor", label: "Input Service Distributor" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const GST_TREATMENT_MAP: Record<string, string> = {
  registered_regular: "registered_business_regular",
  registered_composition: "registered_business_composition",
};


const normalizeGstTreatment = (val: string): string =>
  GST_TREATMENT_MAP[val] || val;

const getApiUrl = (): string => {
  const base = localStorage.getItem("baseUrl") || "";
  return base.startsWith("http") ? base : `https://${base}`;
};

const formatDateGB = (date: Date): string =>
  date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

const calcNextOccurrence = (
  startDateStr: string,
  repeatEvery: string,
  customNum: number,
  customFreq: string
): string => {
  if (!startDateStr) return "";
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return "";
  const n = new Date(d);
  switch (repeatEvery) {
    case "week": n.setDate(n.getDate() + 7); break;
    case "2weeks": n.setDate(n.getDate() + 14); break;
    case "month": n.setMonth(n.getMonth() + 1); break;
    case "2months": n.setMonth(n.getMonth() + 2); break;
    case "3months": n.setMonth(n.getMonth() + 3); break;
    case "6months": n.setMonth(n.getMonth() + 6); break;
    case "year": n.setFullYear(n.getFullYear() + 1); break;
    case "2years": n.setFullYear(n.getFullYear() + 2); break;
    case "3years": n.setFullYear(n.getFullYear() + 3); break;
    case "custom": {
      const num = customNum || 1;
      if (customFreq.startsWith("Day")) n.setDate(n.getDate() + num);
      else if (customFreq.startsWith("Week")) n.setDate(n.getDate() + num * 7);
      else if (customFreq.startsWith("Month")) n.setMonth(n.getMonth() + num);
      else n.setFullYear(n.getFullYear() + num);
      break;
    }
  }
  return formatDateGB(n);
};

const getMinimumEndDate = (startDateStr: string): string => {
  if (!startDateStr) return "";
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared field styles
// ─────────────────────────────────────────────────────────────────────────────

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Section component
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const NewRecurringExpensePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => { document.title = "New Recurring Expense"; }, []);

  // ── Recurring state ───────────────────────────────────────────────────────
  const [profileName, setProfileName] = useState("");
  const [repeatEvery, setRepeatEvery] = useState("week");
  const [customNum, setCustomNum] = useState(1);
  const [customFreq, setCustomFreq] = useState("Week(s)");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endsOn, setEndsOn] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);

  // ── Expense state ─────────────────────────────────────────────────────────
  const [expenseAccount, setExpenseAccount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [paidThrough, setPaidThrough] = useState("");
  const [expenseType, setExpenseType] = useState<"goods" | "services">("goods");
  const [hsnCode, setHsnCode] = useState("");
  const [sacCode, setSacCode] = useState("");
  const [vendor, setVendor] = useState("");
  const [gstTreatment, setGstTreatment] = useState("");
  const [gstin, setGstin] = useState("");
  const [sourceOfSupply, setSourceOfSupply] = useState("");
  const [destinationOfSupply, setDestinationOfSupply] = useState("Maharashtra");
  const [reverseCharge, setReverseCharge] = useState(false);
  const [taxType, setTaxType] = useState("");
  const [taxGroupId, setTaxGroupId] = useState<number | string | null>(null);
  const [taxExemptionId, setTaxExemptionId] = useState<number | string | null>(null);
  const [amountIs, setAmountIs] = useState<"inclusive" | "exclusive">("exclusive");
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");

  // ── Vendor GST detail state ───────────────────────────────────────────────
  const [vendorDetail, setVendorDetail] = useState<any>(null);
  const [vendorDetailLoading, setVendorDetailLoading] = useState(false);
  const [gstDetails, setGstDetails] = useState<any[]>([]);
  const [selectedGstDetailId, setSelectedGstDetailId] = useState<any>(null);

  // ── GSTIN edit modals (Picker + Manage) ───────────────────────────────────
  const [gstPickerModalOpen, setGstPickerModalOpen] = useState(false);
  const [gstManageModalOpen, setGstManageModalOpen] = useState(false);
  const [showNewGstForm, setShowNewGstForm] = useState(false);
  const [editingGstDetailId, setEditingGstDetailId] = useState<any>(null);
  const [newGstForm, setNewGstForm] = useState({
    gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: ''
  });

  const selectedGstDetail = gstDetails.find(
    (g) => String(g.id) === String(selectedGstDetailId)
  ) || gstDetails.find((g) => g.primary) || gstDetails[0] || null;

  // ── API data ──────────────────────────────────────────────────────────────
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

  // ── Reporting Tags state ──────────────────────────────────────────────────
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTagAccount, setSelectedTagAccount] = useState<{ id: string; label: string } | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // API Fetches — same pattern as ExpenseCreatePage
  // ─────────────────────────────────────────────────────────────────────────

  // Fetch account ledgers
  useEffect(() => {
    const fetchAccountLedgers = async () => {
      setLoadingAccounts(true);
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem("token");
        const lockAccountId = localStorage.getItem("lock_account_id");
        const res = await window.fetch(
          `${apiUrl}/lock_accounts/${lockAccountId}/lock_account_ledgers.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data: AccountLedger[] = await res.json();
          setAccountLedgers(data.filter((a) => a.active));
        }
      } catch {
        sonnerToast.error("Failed to load accounts");
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccountLedgers();
  }, []);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem("token");
        const res = await window.fetch(
          `${apiUrl}/pms/purchase_orders/get_suppliers.json?access_token=${token}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success") setVendors(data.suppliers || []);
        }
      } catch {
        sonnerToast.error("Failed to load vendors");
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  // Fetch tax groups
  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem("token");
    const lockId = localStorage.getItem("lock_account_id");
    setLoadingTaxGroups(true);
    axios
      .get(`${apiUrl}/lock_accounts/${lockId}/tax_groups_view.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTaxGroups(res.data || []))
      .catch(() => sonnerToast.error("Failed to load tax groups"))
      .finally(() => setLoadingTaxGroups(false));
  }, []);

  // Fetch exemptions
  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem("token");
    const lockId = localStorage.getItem("lock_account_id");
    setLoadingExemptions(true);
    axios
      .get(
        `${apiUrl}/tax_exemptions.json?lock_account_id=${lockId}&q[exemption_type_eq]=item`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setExemptions(res.data || []))
      .catch(() => sonnerToast.error("Failed to load exemptions"))
      .finally(() => setLoadingExemptions(false));
  }, []);

  // Fetch customers
  useEffect(() => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem("token");
    const lockAccountId = localStorage.getItem("lock_account_id");
    setLoadingCustomers(true);
    axios
      .get(`${apiUrl}/lock_account_customers.json?lock_account_id=${lockAccountId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      .then((res) => setCustomers(res.data || []))
      .catch(() => sonnerToast.error("Failed to load customers"))
      .finally(() => setLoadingCustomers(false));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Vendor detail — same as ExpenseCreatePage
  // ─────────────────────────────────────────────────────────────────────────

  // const fetchVendorDetail = async (vendorId: string) => {
  //   if (!vendorId) {
  //     setVendorDetail(null);
  //     setGstDetails([]);
  //     setSelectedGstDetailId(null);
  //     setGstTreatment("");
  //     setSourceOfSupply("");
  //     setGstin("");
  //     return;
  //   }
  //   const apiUrl = getApiUrl();
  //   const token = localStorage.getItem("token");
  //   setVendorDetailLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${apiUrl}/pms/suppliers/${vendorId}.json?access_token=${token}`
  //     );
  //     const data = res.data?.supplier || res.data;
  //     setVendorDetail(data);
  //     if (data.gst_preference) setGstTreatment(normalizeGstTreatment(data.gst_preference));
  //     const nextGst: any[] = Array.isArray(data.gst_details) ? data.gst_details : [];
  //     setGstDetails(nextGst);
  //     const primaryGst =
  //       nextGst.find((g) => g.primary) || nextGst[0] || data.primary_gst_detail || null;
  //     if (primaryGst) {
  //       setSelectedGstDetailId(primaryGst.id ?? null);
  //       if (primaryGst.place_of_supply) setSourceOfSupply(primaryGst.place_of_supply);
  //       if (primaryGst.gstin) setGstin(primaryGst.gstin);
  //     }
  //   } catch {
  //     sonnerToast.error("Failed to load vendor details");
  //   } finally {
  //     setVendorDetailLoading(false);
  //   }
  // };

  const fetchVendorDetail = async (vendorId: string) => {
    if (!vendorId) {
      setVendorDetail(null);
      setGstDetails([]);
      setSelectedGstDetailId(null);
      setGstTreatment("");
      setSourceOfSupply("");
      setGstin("");
      return;
    }
    const apiUrl = getApiUrl();
    const token = localStorage.getItem("token");

    // Reset previous vendor's GST state immediately, before the new
    // request resolves, so stale values never linger on screen.
    setVendorDetail(null);
    setGstDetails([]);
    setSelectedGstDetailId(null);
    setGstTreatment("");
    setSourceOfSupply("");
    setGstin("");

    setVendorDetailLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/pms/suppliers/${vendorId}.json?access_token=${token}`
      );
      const data = res.data?.supplier || res.data;
      setVendorDetail(data);

      // Always set (with fallback), never skip — guarantees new vendor's
      // value (even if empty) overwrites the old one.
      setGstTreatment(data.gst_preference ? normalizeGstTreatment(data.gst_preference) : "");

      const nextGst: any[] = Array.isArray(data.gst_details) ? data.gst_details : [];
      setGstDetails(nextGst);
      const primaryGst =
        nextGst.find((g) => g.primary) || nextGst[0] || data.primary_gst_detail || null;

      setSelectedGstDetailId(primaryGst?.id ?? null);
      setSourceOfSupply(primaryGst?.place_of_supply || "");
      setGstin(primaryGst?.gstin || "");
    } catch {
      sonnerToast.error("Failed to load vendor details");
      // Keep the reset state — don't show old vendor's data on failure.
    } finally {
      setVendorDetailLoading(false);
    }
  };
  const handleVendorChange = (vendorId: string) => {
    setVendor(vendorId);
    fetchVendorDetail(vendorId);
  };

  const handleGstinDropdownChange = (value: any) => {
    setSelectedGstDetailId(value);
    const selected = gstDetails.find((g) => String(g.id) === String(value));
    if (selected?.gstin !== undefined) setGstin(selected.gstin || '');
    if (selected?.place_of_supply) setSourceOfSupply(selected.place_of_supply);
    setGstPickerModalOpen(false);
  };

  const handleSaveAndSelectGst = async () => {
    if (!vendor || !newGstForm.gstin || !newGstForm.place_of_supply) {
      sonnerToast.error('GSTIN and Place of Supply are required');
      return;
    }
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    const normalized = newGstForm.gstin.toUpperCase().trim();
    if (!gstinRegex.test(normalized)) {
      sonnerToast.error('Invalid GSTIN format. e.g. 27AAAAA1234A1Z5');
      return;
    }
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const gstAttr: any = {
      ...(editingGstDetailId ? { id: Number(editingGstDetailId) || editingGstDetailId } : {}),
      gstin: normalized,
      place_of_supply: newGstForm.place_of_supply,
      business_legal_name: newGstForm.business_legal_name || '',
      business_trade_name: newGstForm.business_trade_name || '',
    };
    try {
      await axios.put(
        `${apiUrl}/pms/suppliers/${vendor}.json?access_token=${token}`,
        { pms_supplier: { gst_details_attributes: [gstAttr] } }
      );
      setShowNewGstForm(false);
      setEditingGstDetailId(null);
      setGstManageModalOpen(false);
      sonnerToast.success('Tax information saved');
      await fetchVendorDetail(vendor);
    } catch {
      sonnerToast.error('Failed to save tax information');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Tax helpers — same as ExpenseCreatePage
  // ─────────────────────────────────────────────────────────────────────────

  const calculateTaxForAmount = (
    amountVal: number,
    taxTypeVal: string,
    taxGroupIdVal: string | number | null
  ) => {
    if (taxTypeVal !== "tax_group" || !taxGroupIdVal) return 0;
    const group = taxGroups.find((g) => String(g.id) === String(taxGroupIdVal));
    if (!group || !Array.isArray(group.tax_rates)) return 0;
    return group.tax_rates.reduce((sum: number, rate: any) => {
      const pct = Number(rate.rate) || 0;
      return sum + (amountVal * pct) / 100;
    }, 0);
  };

  // ✅ Auto-calculated tax amount for the recurring expense view
  const taxAmount = calculateTaxForAmount(parseFloat(amount) || 0, taxType, taxGroupId);

  const getLedgerTaxDefaults = (ledger: AccountLedger | undefined) => {
    if (!ledger) return { taxType: "", taxGroupId: null, taxExemptionId: null };
    const pref = ledger.tax_preference;
    if (pref === "non_taxable")
      return {
        taxType: "non_taxable",
        taxGroupId: null,
        taxExemptionId: ledger.tax_exemption_id ?? null,
      };
    if (pref === "taxable")
      return {
        taxType: "tax_group",
        taxGroupId: ledger.tax_group_id ?? ledger.intra_state_tax_rate_id ?? null,
        taxExemptionId: null,
      };
    if (pref === "out_of_scope" || pref === "non_gst_supply")
      return { taxType: "non_taxable", taxGroupId: null, taxExemptionId: null };
    return { taxType: "", taxGroupId: null, taxExemptionId: null };
  };

  const handleTaxChange = (val: string) => {
    if (val === "non_taxable" || val === "") {
      setTaxType(val);
      setTaxGroupId(null);
    } else {
      setTaxType("tax_group");
      setTaxGroupId(val);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Next occurrence
  // ─────────────────────────────────────────────────────────────────────────

  const nextOccurrence = useMemo(
    () => calcNextOccurrence(startDate, repeatEvery, customNum, customFreq),
    [startDate, repeatEvery, customNum, customFreq]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!profileName) e.profileName = "Profile name is required";
    if (!expenseAccount) e.expenseAccount = "Expense account is required";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Valid amount required";
    if (!paidThrough) e.paidThrough = "Paid through is required";
    if (!gstTreatment) e.gstTreatment = "GST treatment is required";
    if (!sourceOfSupply) e.sourceOfSupply = "Source of supply is required";
    if (!destinationOfSupply) e.destinationOfSupply = "Destination is required";
    if (!neverExpires && endsOn && endsOn <= startDate) {
      e.endsOn = "End Date must be later than Start Date";
    }
    setErrors(e);
    Object.values(e).forEach((msg, i) =>
      setTimeout(() => sonnerToast.error(msg), i * 800)
    );
    return Object.keys(e).length === 0;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Submit — POST /recurring_expenses.json
  // Payload matches the spec; token + baseUrl pulled from localStorage
  // ─────────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      // ── Dynamic token & base URL (same pattern as ExpenseCreatePage) ──────
      const apiUrl = getApiUrl();
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      // ── Repeat-every block ────────────────────────────────────────────────
      const repeatPayload =
        repeatEvery === "custom"
          ? {
            repeat_every: "custom",
            custom_repeat_every: customNum,
            custom_repeat_unit: customFreq,
          }
          : { repeat_every: repeatEvery };

      // ── Calculate tax amount (0 if reverseCharge) ──────────────────────────
      const totalTaxAmount = reverseCharge
        ? 0
        : (() => {
          if (taxType !== 'tax_group' || !taxGroupId) return 0;
          const group = taxGroups.find(g => String(g.id) === String(taxGroupId));
          if (!group || !Array.isArray(group.tax_rates)) return 0;
          const baseAmount = parseFloat(amount) || 0;
          return group.tax_rates.reduce((sum: number, rate: any) => {
            const pct = Number(rate.rate) || 0;
            return sum + (baseAmount * pct) / 100;
          }, 0);
        })();

      // ── Expense account line ──────────────────────────────────────────────
      const expenseAccountsAttributes = [
        {
          lock_account_ledger_id: parseInt(expenseAccount),
          account_type: expenseType,
          amount: parseFloat(amount),
          hsn_sac_code: expenseType === "goods" ? hsnCode : sacCode,
          tax_type: taxType,
          ...(taxType === "tax_group" && { tax_group_id: taxGroupId }),
          ...(taxType === "non_taxable" && { tax_exemption_id: taxExemptionId }),
        },
      ];

      // ── Top-level payload matching the spec ───────────────────────────────
      const payload = {
        recurring_expense: {
          // Profile & schedule
          profile_name: profileName,
          ...repeatPayload,
          start_date: startDate,
          end_date: neverExpires ? null : endsOn || null,
          never_expires: neverExpires,
          active: true,

          // Accounts
          account_id: parseInt(expenseAccount),   // spec: account_id
          paid_through_account_id: parseInt(paidThrough),

          // Parties (omit if empty)
          ...(vendor && { vendor_id: parseInt(vendor) }),
          ...(customer && { customer_id: parseInt(customer) }),

          // Amount & tax
          amount: parseFloat(amount),
          is_inclusive_tax: reverseCharge ? false : amountIs === "inclusive",
          total_tax_amount: totalTaxAmount,
          reverse_charge: reverseCharge,

          // GST
          gst_treatment: gstTreatment,
          gstin,
          source_of_supply: sourceOfSupply,
          destination_of_supply: destinationOfSupply,

          // Misc
          description: description || notes,   // populate whichever is filled
          notes,
          organization_id: parseInt(lockAccountId || "0"),   // maps org from lock account

          // Line items
          expense_accounts_attributes: expenseAccountsAttributes,
        },
      };

      // ── POST request — same fetch pattern as ExpenseCreatePage ────────────
      const res = await window.fetch(
        `${apiUrl}/recurring_expenses.json?lock_account_id=${lockAccountId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        sonnerToast.success("Recurring expense created successfully!");
        navigate(-1);
      } else {
        const err = await res.json().catch(() => ({}));
        sonnerToast.error(err?.message || err?.error || "Failed to create recurring expense");
      }
    } catch {
      sonnerToast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(-1);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Submitting overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
          <div className="bg-card px-10 py-7 rounded-lg flex items-center gap-3">
            <CircularProgress size={20} />
            <span className="text-sm">Creating recurring expense…</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Receipt className="h-6 w-6 text-primary" />
              New Recurring Expense
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new recurring expense profile
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — Profile & Schedule
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Profile & Schedule" icon={<Calendar className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Profile Name*
              </label>
              <TextField
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                fullWidth
                placeholder="Enter profile name"
                error={!!errors.profileName}
                helperText={errors.profileName}
                sx={fieldStyles}
              />
            </div>

            {/* Repeat Every */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Repeat Every*
              </label>
              <div className="flex gap-2 items-center">
                <FormControl sx={{ minWidth: 150 }}>
                  <Select
                    value={repeatEvery}
                    onChange={(e) => setRepeatEvery(e.target.value)}
                    sx={fieldStyles}
                  >
                    {REPEAT_OPTIONS.map((o) => (
                      <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {repeatEvery === "custom" && (
                  <>
                    <TextField
                      type="number"
                      value={customNum}
                      onChange={(e) => setCustomNum(Number(e.target.value))}
                      inputProps={{ min: 1, max: 999 }}
                      sx={{ ...fieldStyles, width: 72 }}
                    />
                    <FormControl sx={{ minWidth: 110 }}>
                      <Select
                        value={customFreq}
                        onChange={(e) => setCustomFreq(e.target.value)}
                        sx={fieldStyles}
                      >
                        {CUSTOM_FREQ_OPTIONS.map((f) => (
                          <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                sx={fieldStyles}
              />
              {nextOccurrence && (
                <p className="text-xs text-muted-foreground mt-2">
                  The recurring expense will be created on {nextOccurrence}
                </p>
              )}
            </div>

            {/* Ends On */}
            <div>
              <label className="block text-sm font-medium mb-2">Ends On</label>
              <TextField
                type="date"
                value={endsOn}
                onChange={(e) => setEndsOn(e.target.value)}
                fullWidth
                disabled={neverExpires}
                error={!!errors.endsOn}
                helperText={errors.endsOn}
                inputProps={{
                  min: getMinimumEndDate(startDate),
                }}
                sx={fieldStyles}
              />
              <FormControlLabel
                className="mt-2"
                control={
                  <Checkbox
                    checked={neverExpires}
                    onChange={(e) => setNeverExpires(e.target.checked)}
                  />
                }
                label="Never Expires"
              />
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — Expense Account
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Expense Account" icon={<FileText className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Account — wired to accountLedgers */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Expense Account*
              </label>
              <FormControl fullWidth error={!!errors.expenseAccount}>
                <Select
                  value={expenseAccount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExpenseAccount(val);
                    const selected = accountLedgers.find((a) => a.id.toString() === val);
                    const defaults = getLedgerTaxDefaults(selected);
                    setTaxType(defaults.taxType);
                    setTaxGroupId(defaults.taxGroupId);
                    setTaxExemptionId(defaults.taxExemptionId);
                  }}
                  displayEmpty
                  disabled={loadingAccounts}
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    {loadingAccounts ? "Loading…" : "Select an account"}
                  </MenuItem>
                  {accountLedgers.map((a) => (
                    <MenuItem key={a.id} value={a.id.toString()}>
                      {a.formatted_name || a.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.expenseAccount && (
                <p className="text-xs text-red-500 mt-1">{errors.expenseAccount}</p>
              )}
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Expense Type</label>
              <RadioGroup
                row
                value={expenseType}
                onChange={(e) => {
                  setExpenseType(e.target.value as "goods" | "services");
                  setHsnCode("");
                  setSacCode("");
                }}
                sx={{ gap: 2, mt: 0.5 }}
              >
                <FormControlLabel value="goods" control={<Radio size="small" />} label="Goods" />
                <FormControlLabel value="services" control={<Radio size="small" />} label="Services" />
              </RadioGroup>
            </div>
          </div>

          {/* HSN / SAC Code */}
          {(expenseType === "goods" || expenseType === "services") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {expenseType === "goods" ? "HSN Code" : "SAC Code"}
                </label>
                <TextField
                  value={expenseType === "goods" ? hsnCode : sacCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Only digits
                    if (expenseType === "goods") {
                      setHsnCode(value.slice(0, 8)); // HSN: max 8 digits
                    } else {
                      setSacCode(value.slice(0, 8)); // SAC: max 8 digits
                    }
                  }}
                  fullWidth
                  placeholder={expenseType === "goods" ? "Enter 8-digit HSN code" : "Enter 8-digit SAC code"}
                  inputProps={{
                    maxLength: 8,
                    pattern: "[0-9]*",
                    inputMode: "numeric",
                  }}
                  sx={fieldStyles}
                />
              </div>
            </div>
          )}
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — Payment Details
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Payment Details" icon={<CreditCard className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">Amount*</label>
              <div className="flex gap-2">
                <FormControl sx={{ minWidth: 90 }}>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    sx={fieldStyles}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  value={amount}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value);
                    setAmount(isNaN(p) ? "" : Math.max(0, p).toString());
                  }}
                  fullWidth
                  placeholder="0.00"
                  error={!!errors.amount}
                  helperText={errors.amount}
                  sx={fieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            {/* Paid Through — same accountLedgers source */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Paid Through*
              </label>
              <FormControl fullWidth error={!!errors.paidThrough}>
                <Select
                  value={paidThrough}
                  onChange={(e) => setPaidThrough(e.target.value)}
                  displayEmpty
                  disabled={loadingAccounts}
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    {loadingAccounts ? "Loading…" : "Select an account"}
                  </MenuItem>
                  {accountLedgers.map((a) => (
                    <MenuItem key={a.id} value={a.id.toString()}>
                      {a.formatted_name || a.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.paidThrough && (
                <p className="text-xs text-red-500 mt-1">{errors.paidThrough}</p>
              )}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — Vendor & GST Details
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Vendor & GST Details" icon={<Receipt className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor — triggers fetchVendorDetail on change */}
            <div>
              <label className="block text-sm font-medium mb-2">Vendor</label>
              <div className="flex items-center gap-2">
                <FormControl fullWidth>
                  <Select
                    value={vendor}
                    onChange={(e) => handleVendorChange(e.target.value)}
                    displayEmpty
                    disabled={loadingVendors}
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      {loadingVendors ? "Loading…" : "Select a vendor"}
                    </MenuItem>
                    {vendors.map((v) => (
                      <MenuItem key={v.id} value={v.id.toString()}>{v.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {vendorDetailLoading && <CircularProgress size={18} />}
              </div>
            </div>

            {/* GST Treatment — auto-populated from vendor, also editable */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                GST Treatment*
              </label>
              <FormControl fullWidth error={!!errors.gstTreatment}>
                <Select
                  value={gstTreatment}
                  onChange={(e) => setGstTreatment(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>Select treatment</MenuItem>
                  {GST_TREATMENTS.map((t) => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.gstTreatment && (
                <p className="text-xs text-red-500 mt-1">{errors.gstTreatment}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Vendor GSTIN — auto-populated from vendor, editable via picker/manage modals */}
            <div>
              <label className="block text-sm font-medium mb-2">Vendor GSTIN</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-800 font-medium">
                  {gstin || selectedGstDetail?.gstin || vendorDetail?.primary_gst_detail?.gstin || '—'}
                </span>
                <IconButton size="small" onClick={() => setGstPickerModalOpen(true)} disabled={!vendor}>
                  <EditOutlined fontSize="small" className="text-blue-500" />
                </IconButton>
              </div>
            </div>

            {/* Source of Supply — auto-populated from vendor's primary GST */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Source of Supply*
              </label>
              <FormControl fullWidth error={!!errors.sourceOfSupply}>
                <Select
                  value={sourceOfSupply}
                  onChange={(e) => setSourceOfSupply(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>Select state</MenuItem>
                  {INDIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.sourceOfSupply && (
                <p className="text-xs text-red-500 mt-1">{errors.sourceOfSupply}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Destination of Supply */}
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Destination of Supply*
              </label>
              <FormControl fullWidth error={!!errors.destinationOfSupply}>
                <Select
                  value={destinationOfSupply}
                  onChange={(e) => setDestinationOfSupply(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>Select state</MenuItem>
                  {INDIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.destinationOfSupply && (
                <p className="text-xs text-red-500 mt-1">{errors.destinationOfSupply}</p>
              )}
            </div>
          </div>

          {/* Reverse Charge */}
          <div className="mt-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={reverseCharge}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setReverseCharge(checked);
                    if (checked) setAmountIs('exclusive');
                  }}
                />
              }
              label="This transaction is applicable for reverse charge"
            />
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — Tax
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Tax" icon={<FileText className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax — wired to taxGroups API */}
            <div>
              <label className="block text-sm font-medium mb-2">Tax</label>
              <FormControl fullWidth>
                <Select
                  value={
                    taxType === "tax_group"
                      ? ((taxGroupId ?? "") as string)
                      : (taxType || "")
                  }
                  onChange={(e) => handleTaxChange(e.target.value)}
                  displayEmpty
                  disabled={loadingTaxGroups}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    {loadingTaxGroups ? "Loading…" : "Select a tax"}
                  </MenuItem>
                  <MenuItem value="non_taxable">Non-Taxable</MenuItem>
                  <MenuItem disabled value="__divider__">── Tax Groups ──</MenuItem>
                  {taxGroups.map((g) => (
                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* ✅ Tax Amount — read-only calculation */}
            {taxType === "tax_group" && taxGroupId && (
              <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-gray-700">
                  Tax Amount = ₹<span className="font-semibold text-blue-600">{taxAmount.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Exemption Reason — only when non_taxable; wired to exemptions API */}
            {taxType === "non_taxable" && (
              <div>
                <label className="block text-sm font-medium mb-2">Exemption Reason</label>
                <FormControl fullWidth>
                  <Select
                    value={(taxExemptionId ?? "") as string}
                    onChange={(e) => setTaxExemptionId(e.target.value || null)}
                    displayEmpty
                    disabled={loadingExemptions}
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      {loadingExemptions ? "Loading…" : "Select reason"}
                    </MenuItem>
                    {exemptions.map((ex) => (
                      <MenuItem key={ex.id} value={ex.id}>{ex.reason}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>

          {/* Amount Is — hidden when reverse charge active */}
          {!reverseCharge && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Amount Is</label>
              <RadioGroup
                row
                value={amountIs}
                onChange={(e) => setAmountIs(e.target.value as "inclusive" | "exclusive")}
                sx={{ gap: 2 }}
              >
                <FormControlLabel value="exclusive" control={<Radio size="small" />} label="Tax Exclusive" />
                <FormControlLabel value="inclusive" control={<Radio size="small" />} label="Tax Inclusive" />
              </RadioGroup>
            </div>
          )}
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — Additional Details
        ══════════════════════════════════════════════════════════════════ */}
        <Section title="Additional Details" icon={<Receipt className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <TextField
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder="Max. 500 characters"
                inputProps={{ maxLength: 500 }}
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
              <p className="text-xs text-muted-foreground mt-1">
                {500 - notes.length} characters remaining
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder="Enter description"
                inputProps={{ maxLength: 500 }}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Customer Name — wired to customers API */}
            <div>
              <label className="block text-sm font-medium mb-2">Customer Name</label>
              <FormControl fullWidth>
                <Select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  displayEmpty
                  disabled={loadingCustomers}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    {loadingCustomers ? "Loading…" : "Select a customer"}
                  </MenuItem>
                  {customers.map((c) => (
                    <MenuItem key={c.id} value={c.id.toString()}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Reporting Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Reporting Tags</label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setShowTagModal(true)}
              >
                {selectedTagAccount ? `Tags: ${selectedTagAccount.label}` : "Associate Tags"}
              </button>
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-2 pb-6">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              backgroundColor: "#DA7756",
              color: "#ffffff",
              borderRadius: "6px",
              boxShadow: "none",
              padding: "8px 24px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#C45F40", boxShadow: "none" },
            }}
          >
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              color: "#DA7756",
              borderColor: "#DA7756",
              borderRadius: "6px",
              padding: "8px 24px",
              fontWeight: 600,
              "&:hover": { borderColor: "#C45F40", backgroundColor: "transparent" },
            }}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* GSTIN Picker Modal */}
      <Dialog open={gstPickerModalOpen} onClose={() => setGstPickerModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogContent className="!p-0">
          <div className="max-h-[240px] overflow-y-auto">
            {gstDetails.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">No GST details found</div>
            )}
            {gstDetails.map((gst) => (
              <button
                key={gst.id}
                type="button"
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''
                  }`}
                onClick={() => handleGstinDropdownChange(gst.id)}
              >
                {gst.gstin || '(No GSTIN)'} — {gst.place_of_supply}
                {gst.primary && <span className="ml-2 text-xs text-green-600 italic">(Primary)</span>}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              className="text-blue-600 text-sm"
              onClick={() => {
                setGstPickerModalOpen(false);
                setShowNewGstForm(false);
                setEditingGstDetailId(null);
                setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
                setGstManageModalOpen(true);
              }}
            >
              ⚙ Manage Tax Informations
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* GST Manage Modal */}
      <Dialog open={gstManageModalOpen} onClose={() => setGstManageModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Manage Tax Informations
          <IconButton size="small" onClick={() => setGstManageModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setEditingGstDetailId(null);
                setNewGstForm({ gstin: '', place_of_supply: '', business_legal_name: '', business_trade_name: '' });
                setShowNewGstForm(true);
              }}
              sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}
            >
              Add New Tax Information
            </Button>

            {showNewGstForm && (
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="GSTIN*"
                  fullWidth
                  size="small"
                  value={newGstForm.gstin}
                  onChange={(e) => setNewGstForm((p) => ({ ...p, gstin: e.target.value.toUpperCase() }))}
                  error={!!newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)}
                  helperText={
                    newGstForm.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(newGstForm.gstin)
                      ? 'Invalid GSTIN. e.g. 27AAAAA1234A1Z5'
                      : ''
                  }
                  inputProps={{ maxLength: 15 }}
                />
                <TextField
                  label="Place of Supply*"
                  select
                  fullWidth
                  size="small"
                  value={newGstForm.place_of_supply}
                  onChange={(e) => setNewGstForm((p) => ({ ...p, place_of_supply: e.target.value }))}
                >
                  <MenuItem value="">Select</MenuItem>
                  {INDIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Business Legal Name"
                  fullWidth
                  size="small"
                  value={newGstForm.business_legal_name}
                  onChange={(e) => setNewGstForm((p) => ({ ...p, business_legal_name: e.target.value }))}
                />
                <TextField
                  label="Business Trade Name"
                  fullWidth
                  size="small"
                  value={newGstForm.business_trade_name}
                  onChange={(e) => setNewGstForm((p) => ({ ...p, business_trade_name: e.target.value }))}
                />
                <div className="md:col-span-2 flex gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveAndSelectGst}
                    sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}
                  >
                    {editingGstDetailId ? 'Save' : 'Save and Select'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setShowNewGstForm(false);
                      setEditingGstDetailId(null);
                    }}
                    sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold text-gray-500 px-4 py-2">
                <div>GSTIN</div><div>PLACE OF SUPPLY</div><div>LEGAL NAME</div><div></div>
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {gstDetails.map((gst) => (
                  <div
                    key={gst.id}
                    className={`grid grid-cols-4 px-4 py-2 text-sm border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${String(selectedGstDetailId) === String(gst.id) ? 'bg-gray-100' : ''
                      }`}
                    onClick={() => handleGstinDropdownChange(gst.id)}
                  >
                    <div>
                      {gst.gstin || '—'}
                      {gst.primary && <div className="text-green-600 text-xs italic">(Primary)</div>}
                    </div>
                    <div>{gst.place_of_supply || '—'}</div>
                    <div>{gst.business_legal_name || '—'}</div>
                    <div className="flex justify-end gap-1">
                      {!gst.primary && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGstDetailId(gst.id);
                            setNewGstForm({
                              gstin: gst.gstin,
                              place_of_supply: gst.place_of_supply,
                              business_legal_name: gst.business_legal_name || '',
                              business_trade_name: gst.business_trade_name || '',
                            });
                            setShowNewGstForm(true);
                          }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setGstManageModalOpen(false)}
            sx={{ textTransform: 'none', borderColor: '#C72030', color: '#C72030' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewRecurringExpensePage;