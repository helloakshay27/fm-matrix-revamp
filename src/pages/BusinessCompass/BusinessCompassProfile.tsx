import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  ShieldAlert,
  FileText,
  Edit2,
  Upload,
  Heart,
  Building2,
  Globe,
  Cake,
  Star,
  BriefcaseBusiness,
  ShieldCheck,
  ChevronDown,
  X,
  Save,
  Plus,
  Trash2,
  Loader2,
  Target,
  Bot,
  Cpu,
  KeyRound,
  Info,
  BarChart2,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from "lucide-react";
const ChevronDownIcon = ChevronDown;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { getBaseUrl, getToken, getUser } from "@/utils/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import {
  userService,
  ProfileAccountResponse,
  ProfileUpdateResponse,
} from "@/services/userService";
import { toast } from "sonner";
import FaceEnrollmentPanel from "@/components/FaceEnrollmentPanel";
import ProfileAssets from "@/components/ProfileAssets";
import ProfileWallet from "@/components/ProfileWallet";
import ProfileRoster from "../ProfileRoster";
import BusinessCompassAttendanceView from "./BusinessCompassAttendanceView";
import "./BusinessCompass.css";

const AdvancedDatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) return parsedDate;

    const fallbackDate = new Date(dateString);
    return isValid(fallbackDate) ? fallbackDate : null;
  };

  const selectedDate = parseDate(value);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, "dd/MM/yyyy"));
    } else {
      onChange("");
    }
  };

  const years = Array.from({ length: 131 }, (_, i) => 1900 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={cn("relative w-full", className)}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2 bg-white border-b gap-1">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
              type="button"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <div className="flex gap-1">
              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
                className="text-xs font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer hover:text-blue-600 outline-none"
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) =>
                  changeYear(parseInt(value))
                }
                className="text-xs font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer hover:text-blue-600 outline-none"
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
              type="button"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        )}
        customInput={
          <div className="relative group cursor-pointer">
            <Input
              className={cn(
                "h-[36px] text-[14px] border-gray-300 hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-100",
                !selectedDate && "text-gray-400"
              )}
              value={value || ""}
              readOnly
              placeholder={placeholder}
            />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 pointer-events-none" />
          </div>
        }
      />
    </div>
  );
};

const InfoField = ({
  icon: Icon,
  label,
  value,
  isEditing = false,
  onChange,
  placeholder,
  type = "text",
  editable = true,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
  isEditing?: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  editable?: boolean;
}) => {
  const isEmpty = !value || (typeof value === "string" && value.trim() === "");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#6B9BCC]" />
        <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
          {label}
        </span>
      </div>
      {isEditing && editable ? (
        <div className="relative group w-full">
          {type === "date" ? (
            <AdvancedDatePicker
              value={value || ""}
              onChange={(v) => onChange?.(v)}
              placeholder="dd/MM/yyyy"
            />
          ) : (
            <Input
              className="h-[36px] text-[14px] border-gray-300 focus-visible:border-blue-500 placeholder:text-gray-400 w-full"
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
            />
          )}
        </div>
      ) : (
        <span
          className={cn(
            "tracking-tight",
            isEmpty && !isEditing
              ? "text-[#B91C1C] text-[11px] font-medium"
              : "text-[#1a1a1a] text-[15px] font-bold"
          )}
        >
          {isEmpty && !isEditing ? "Not provided" : value}
        </span>
      )}
    </div>
  );
};

// ─── Document types ───────────────────────────────────────────────────────────
interface DocumentEntry {
  id: string;
  title: string;
  file: File | null;
  url: string | null; // existing remote URL (if any)
}

type UserKpi = {
  id: string | number;
  name: string;
  target?: string | number | null;
  currentValue?: string | number | null;
  unit?: string | null;
  frequency?: string | null;
  priority?: string | null;
  status?: string | null;
};

type AiProvider = {
  display_name: string;
  provider_id: string;
};

type AiModel = {
  display_name: string;
  model_name: string;
};

type UserAiConfig = {
  id?: number;
  code?: number;
  user_id?: number;
  user_name?: string;
  configured?: boolean;
  is_active?: boolean;
  message?: string;
  provider?:
  | string
  | {
    id?: string;
    display_name?: string;
  };
  provider_id?: string;
  model?: string | AiModel;
  model_name?: string;
  api_key?: string;
  source_type?: string;
  endpoint?: string;
};

const normalizeUserKpis = (raw: any): UserKpi[] => {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.kpis)
        ? raw.kpis
        : Array.isArray(raw?.data?.kpis)
          ? raw.data.kpis
          : [];

  return list.map((item: any) => ({
    id: item.id,
    name: item.name ?? item.kpi_name ?? item.title ?? "Untitled KPI",
    target: item.target ?? item.target_value ?? item.planned_value ?? null,
    currentValue: item.value ?? item.current_value ?? item.actual_value ?? null,
    unit: item.unit ?? item.measurement_unit ?? "",
    frequency: item.frequency ?? item.period ?? "",
    priority: item.priority ?? "",
    status: item.status ?? item.badge ?? "Active",
  }));
};

const getAiConfigProviderId = (config?: UserAiConfig | null) => {
  if (!config) return "";
  if (typeof config.provider === "object") return config.provider?.id || "";
  return config.provider_id || config.provider || "";
};

const getAiConfigProviderDisplayName = (config?: UserAiConfig | null) => {
  if (!config) return "";
  if (typeof config.provider === "object") {
    return config.provider?.display_name || config.provider?.id || "";
  }
  return config.provider || config.provider_id || "";
};

const getAiConfigModelName = (config?: UserAiConfig | null) => {
  if (!config) return "";
  if (typeof config.model === "object") return config.model?.model_name || "";
  return config.model_name || config.model || "";
};

const getAiConfigModelDisplayName = (config?: UserAiConfig | null) => {
  if (!config) return "";
  if (typeof config.model === "object") {
    return config.model?.display_name || config.model?.model_name || "";
  }
  return config.model || config.model_name || "";
};

const maskApiKey = (value: string) => {
  if (!value) return "";

  const key = value.trim();
  if (key.length <= 8) {
    return `${key.slice(0, 2)}********${key.slice(-2)}`;
  }

  if (key.length <= 18) {
    return `${key.slice(0, 4)}********${key.slice(-4)}`;
  }

  return `${key.slice(0, 8)}************${key.slice(-6)}`;
};

const getStoredOrganizationName = () => {
  const directName =
    localStorage.getItem("selectedOrg") ||
    sessionStorage.getItem("selectedOrg") ||
    localStorage.getItem("selectedOrganizationName") ||
    sessionStorage.getItem("selectedOrganizationName");

  if (directName?.trim()) return directName.trim();

  const storedOrg =
    localStorage.getItem("selectedOrganization") ||
    sessionStorage.getItem("selectedOrganization");

  if (!storedOrg) return "";

  try {
    const parsed = JSON.parse(storedOrg);
    return typeof parsed?.name === "string" ? parsed.name.trim() : "";
  } catch {
    return storedOrg.trim();
  }
};

const parseStoredOrganizationId = (
  value?: string | number | null
): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const getStoredOrganizationId = () => {
  const directId =
    localStorage.getItem("org_id") ||
    sessionStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    sessionStorage.getItem("organization_id");

  const parsedDirectId = parseStoredOrganizationId(directId);
  if (parsedDirectId !== null) return parsedDirectId;

  const storedOrg =
    localStorage.getItem("selectedOrganization") ||
    sessionStorage.getItem("selectedOrganization");

  if (!storedOrg) return null;

  try {
    const parsed = JSON.parse(storedOrg);
    return parseStoredOrganizationId(
      parsed?.id ?? parsed?.organization_id ?? parsed?.org_id
    );
  } catch {
    return null;
  }
};

const buildUserAiConfigPath = (
  userId: string,
  organizationId: number | null
) => {
  const params = new URLSearchParams();
  if (organizationId) {
    const orgId = String(organizationId);
    params.set("organization_id", orgId);
    params.set("org_id", orgId);
  }

  const query = params.toString();
  return `/user_ai_config/user/${encodeURIComponent(userId)}${query ? `?${query}` : ""
    }`;
};

const AI_PROVIDER_LINKS = [
  {
    name: "Claude",
    label: "Anthropic",
    url: "https://console.anthropic.com/settings/keys",
    bg: "bg-[#c96442]/10",
    border: "border-[#c96442]/30",
    text: "text-[#c96442]",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
  },
];

const AiProviderLinksDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // return (
  // <div className="relative" ref={ref}>
  //   <button
  //     type="button"
  //     onClick={() => setOpen((v) => !v)}
  //     className="flex items-center gap-1.5 text-xs font-semibold text-[#c96442] hover:text-[#a8502e] border border-[#c96442]/30 hover:border-[#c96442]/60 bg-[#c96442]/10 hover:bg-[#c96442]/20 rounded-md px-2.5 py-1 transition-colors"
  //   >
  //     <Globe size={12} />
  //     Link with Claude
  //     <ChevronDown size={11} className={cn("transition-transform duration-200", open && "rotate-180")} />
  //   </button>

  //   {open && (
  //     <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-xl border border-blue-100 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
  //       <p className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
  //         Get API Key from Provider
  //       </p>
  //       <div className="p-2 space-y-1">
  //         {AI_PROVIDER_LINKS.map((provider) => (
  //           <a
  //             key={provider.name}
  //             href={provider.url}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             onClick={() => setOpen(false)}
  //             className={cn(
  //               "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all hover:scale-[1.01]",
  //               provider.bg,
  //               provider.border
  //             )}
  //           >
  //             <img
  //               src={provider.icon}
  //               alt={provider.name}
  //               className="w-5 h-5 rounded object-contain shrink-0"
  //               onError={(e) => {
  //                 (e.target as HTMLImageElement).style.display = "none";
  //               }}
  //             />
  //             <div className="min-w-0 flex-1">
  //               <p className={cn("text-sm font-bold leading-none", provider.text)}>
  //                 {provider.name}
  //               </p>
  //               <p className="text-[10px] text-gray-400 mt-0.5">{provider.label}</p>
  //             </div>
  //             <span className="text-[10px] font-semibold text-gray-400 shrink-0">
  //               Get Key →
  //             </span>
  //           </a>
  //         ))}
  //       </div>
  //     </div>
  //   )}
  // </div>
  //   );
  // };

  return null;
};

const OrganizationCheckbox = ({
  name,
  organizationId,
  checked,
  onCheckedChange,
}: {
  name: string;
  organizationId: number | null;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <label
    className={cn(
      "flex min-h-10 max-w-full cursor-pointer items-center gap-2 rounded-md border px-3 shadow-sm",
      organizationId
        ? "border-blue-100 bg-blue-50 text-blue-700"
        : "cursor-not-allowed border-amber-100 bg-amber-50 text-amber-700 opacity-80"
    )}
  >
    <Checkbox
      checked={checked}
      disabled={!organizationId}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      className="border-current data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
    />
    <Building2 size={15} className="shrink-0" />
    <span className="min-w-0">
      <span className="block text-[10px] font-bold uppercase leading-none tracking-widest opacity-75">
        Organization
      </span>
      <span className="block max-w-[220px] truncate text-sm font-bold">
        {name || "Not selected"}
      </span>
    </span>
  </label>
);

const BusinessCompassProfile = () => {
  type ProfileFormData = {
    displayName: string;
    email: string;
    phone: string;
    jobTitle: string;
    departmentName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    dob: string;
    anniversaryDate: string;
    doj: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    cv?: string;
  };

  const getInitialProfileData = (): ProfileFormData => {
    const savedData = localStorage.getItem("bc-profile-data");
    if (savedData) {
      return JSON.parse(savedData) as ProfileFormData;
    }

    const authUser = getUser();
    const fullName = [authUser?.firstname, authUser?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      displayName: fullName || authUser?.firstname || "Common Admin Id",
      email: authUser?.email || "operational@lockated.com",
      phone: authUser?.mobile || authUser?.phone || "9673565064",
      jobTitle: authUser?.firstname || "Common Admin Id",
      departmentName: (authUser as any)?.department_name || "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      dob: "",
      anniversaryDate: "",
      doj: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    };
  };

  const formatApiDateToUi = (dateString?: string | null): string => {
    if (!dateString) return "";
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy") : "";
  };

  const formatUiDateToApi = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) return null;
    return format(parsedDate, "yyyy-MM-dd");
  };

  const mergeApiProfileIntoForm = (
    currentData: ProfileFormData,
    apiData: ProfileUpdateResponse
  ): ProfileFormData => {
    const userData = apiData.user || {};

    // Extract names from both top level and user object
    const firstname = userData.firstname ?? apiData.firstname ?? "";
    const lastname = userData.lastname ?? apiData.lastname ?? "";
    const displayName = [firstname, lastname].filter(Boolean).join(" ").trim();

    // Extract extra fields - could be in user object or extra_fields
    const extra = apiData.extra_fields || userData;

    console.warn(
      "[mergeApiProfileIntoForm] Extracting data from API response:",
      { userData, extra }
    );

    return {
      ...currentData,
      displayName: displayName || currentData.displayName,
      email: userData.email ?? apiData.email ?? currentData.email,
      phone: userData.mobile ?? apiData.mobile ?? currentData.phone,
      jobTitle: userData.user_title ?? currentData.jobTitle,
      departmentName:
        (userData as any).department_name ??
        (apiData as any).department_name ??
        currentData.departmentName,
      address: userData.alternate_address ?? currentData.address,
      city: extra.city ?? currentData.city,
      state: extra.state ?? currentData.state,
      pinCode:
        extra.pin_code ??
        extra.pincode ??
        extra.zip_code ??
        currentData.pinCode,
      dob: formatApiDateToUi(userData.birth_date) || currentData.dob,
      doj: formatApiDateToUi(extra.date_of_joining) || currentData.doj,
      anniversaryDate:
        formatApiDateToUi(extra.anniversary_date) ||
        currentData.anniversaryDate,
      emergencyContactName:
        extra.emergency_contact_name ?? currentData.emergencyContactName,
      emergencyContactNumber:
        userData.alternate_mobile ??
        extra.emergency_contact_number ??
        currentData.emergencyContactNumber,
    };
  };

  const mapAccountProfileToForm = (
    currentData: ProfileFormData,
    accountData: ProfileAccountResponse
  ): ProfileFormData => {
    const firstname = accountData.firstname || "";
    const lastname = accountData.lastname || "";
    const displayName = [firstname, lastname].filter(Boolean).join(" ").trim();
    const extra = accountData.extra_fields || accountData; // Try both extra_fields and root level

    console.warn("[mapAccountProfileToForm] Mapping account data:", {
      accountData,
      extra,
    });

    return {
      ...currentData,
      displayName: displayName || currentData.displayName,
      email: accountData.email || currentData.email,
      phone: accountData.mobile || currentData.phone,
      jobTitle:
        accountData.designation ||
        accountData.profile_type ||
        currentData.jobTitle,
      departmentName:
        (accountData as any).department_name ||
        (extra as any).department_name ||
        currentData.departmentName,
      address: accountData.alternate_address || currentData.address,
      city: extra.city || currentData.city,
      state: extra.state || currentData.state,
      pinCode:
        extra.pin_code ||
        extra.pincode ||
        extra.zip_code ||
        currentData.pinCode,
      dob: formatApiDateToUi(accountData.birth_date) || currentData.dob,
      anniversaryDate:
        formatApiDateToUi(extra.anniversary_date) ||
        currentData.anniversaryDate,
      doj: formatApiDateToUi(extra.date_of_joining) || currentData.doj,
      emergencyContactName:
        extra.emergency_contact_name || currentData.emergencyContactName,
      emergencyContactNumber:
        extra.emergency_contact_number || currentData.emergencyContactNumber,
    };
  };

  const persistProfileDataLocally = (data: ProfileFormData) => {
    console.warn("[LocalStorage] Saving profile data to localStorage:", data);
    localStorage.setItem("bc-profile-data", JSON.stringify(data));

    const essentialFields = [
      "address",
      "city",
      "state",
      "pinCode",
      "dob",
      "doj",
      "emergencyContactName",
      "emergencyContactNumber",
    ];
    const isComplete = essentialFields.every(
      (field) => data[field as keyof ProfileFormData]?.trim() !== ""
    );
    const completionCount = essentialFields.filter(
      (field) => data[field as keyof ProfileFormData]?.trim() !== ""
    ).length;
    console.warn(
      `[LocalStorage] Profile completion: ${completionCount}/${essentialFields.length}`
    );

    if (isComplete) {
      console.warn("[LocalStorage] Profile marked as complete (100%)");
      localStorage.setItem("bc-profile-completed", "true");
    } else {
      console.warn(
        "[LocalStorage] Profile NOT complete, removing completion flag"
      );
      localStorage.removeItem("bc-profile-completed");
    }
  };

  type ProfileTab =
    | "basic"
    | "face_enroll"
    | "assets"
    | "attendance"
    | "my_roster"
    | "my_wallet"
    | "wallet";

  const [activeTab, setActiveTab] = useState<ProfileTab>("basic");
  const [profileDetails, setProfileDetails] = useState<any>({});

  // ── Wallet state ──────────────────────────────────────────────────────────
  interface WalletTx {
    id?: string | number;
    date: string;
    transactionPoints: number;
    point_type: string;
    transactionType: "credit" | "debit" | string;
    payment_mode: string;
  }
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletUpdatedAt, setWalletUpdatedAt] = useState<string>("");
  const [walletTransactions, setWalletTransactions] = useState<WalletTx[]>([]);
  const [walletFilter, setWalletFilter] = useState<"all" | "credit" | "debit">(
    "all"
  );
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletRefreshing, setWalletRefreshing] = useState(false);
  const [walletExists, setWalletExists] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(
    getInitialProfileData
  );
  const [profileImage, setProfileImage] = useState<string>(
    () => localStorage.getItem("bc-profile-avatar") || ""
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  // ─── Document state ─────────────────────────────────────────────────────────
  const [documents, setDocuments] = useState<DocumentEntry[]>(() => {
    const savedDocs = localStorage.getItem("bc-profile-documents");
    if (savedDocs) {
      return JSON.parse(savedDocs);
    }
    return [];
  });
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [userKpis, setUserKpis] = useState<UserKpi[]>([]);
  const [isKpisLoading, setIsKpisLoading] = useState(false);
  const [kpisError, setKpisError] = useState<string | null>(null);
  const [aiProviders, setAiProviders] = useState<AiProvider[]>([]);
  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [selectedAiProvider, setSelectedAiProvider] = useState("");
  const [selectedAiModel, setSelectedAiModel] = useState("");
  const [aiApiKey, setAiApiKey] = useState("");
  const [isAiApiKeyFocused, setIsAiApiKeyFocused] = useState(false);
  const [userAiConfig, setUserAiConfig] = useState<UserAiConfig | null>(null);
  const [isAiProvidersLoading, setIsAiProvidersLoading] = useState(false);
  const [isAiModelsLoading, setIsAiModelsLoading] = useState(false);
  const [isAiConfigLoading, setIsAiConfigLoading] = useState(false);
  const [aiConfigTab, setAiConfigTab] = useState<"api_key" | "auth_connect">(
    "api_key"
  );
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isOAuthExchanging, setIsOAuthExchanging] = useState(false);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const [oauthState, setOauthState] = useState<string | null>(null);
  const [oauthCode, setOauthCode] = useState("");
  const [oauthCooldown, setOauthCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isAiConfigSaving, setIsAiConfigSaving] = useState(false);
  const [isAiConfigDeleting, setIsAiConfigDeleting] = useState(false);
  const [isAiConfigToggling, setIsAiConfigToggling] = useState(false);
  const [isAiConfigActive, setIsAiConfigActive] = useState(false);
  const [aiConfigError, setAiConfigError] = useState<string | null>(null);
  const storedOrganizationId = getStoredOrganizationId();
  const [includeOrganizationInAiConfig, setIncludeOrganizationInAiConfig] =
    useState(() => Boolean(storedOrganizationId));

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const currentUserId =
    localStorage.getItem("userId") || String(getUser()?.id || "");
  const organizationIdForAiPayload =
    includeOrganizationInAiConfig && storedOrganizationId
      ? storedOrganizationId
      : null;

  useEffect(() => {
    const fetchProfileUserDetails = async () => {
      const base = localStorage.getItem("baseUrl") || "";
      const token = localStorage.getItem("token") || "";

      if (!base || !token || !currentUserId) {
        setProfileDetails({});
        return;
      }

      try {
        const baseUrl = base.replace(/\/$/, "").replace(/^https?:\/\//, "");
        const response = await fetch(
          `https://${baseUrl}/user_details/${encodeURIComponent(currentUserId)}.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        setProfileDetails(await response.json());
      } catch (error) {
        console.error("Failed to load profile user details", error);
        setProfileDetails({});
      }
    };

    fetchProfileUserDetails();
  }, [currentUserId]);

  useEffect(() => {
    if (!storedOrganizationId && includeOrganizationInAiConfig) {
      setIncludeOrganizationInAiConfig(false);
    }
  }, [storedOrganizationId, includeOrganizationInAiConfig]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setIsProfileLoading(true);
        console.warn("[Profile Load] Starting profile fetch...");
        const profileData = await userService.getAccountDetails();
        console.warn(
          "[Profile Load] Raw API response:",
          JSON.stringify(profileData, null, 2)
        );

        const mappedData = mapAccountProfileToForm(formData, profileData);
        console.warn(
          "[Profile Load] After mapping to form:",
          JSON.stringify(mappedData, null, 2)
        );
        setFormData(mappedData);
        persistProfileDataLocally(mappedData);

        const accountImage =
          profileData.profile_icon_url ||
          profileData.profile_photo ||
          profileData.avatar ||
          profileData.image ||
          "";

        if (accountImage) {
          console.warn(
            "[Profile Load] Setting profile image from API:",
            accountImage
          );
          setProfileImage(accountImage);
          localStorage.setItem("bc-profile-avatar", accountImage);
        }
      } catch (error) {
        console.error("[Profile Load] Error fetching profile:", error);
        if (!localStorage.getItem("bc-profile-data")) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load profile details";
          toast.error(message);
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  useEffect(() => {
    const fetchUserKpis = async () => {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const userId =
        localStorage.getItem("userId") || String(getUser()?.id || "");

      if (!baseUrl || !token || !userId) {
        setUserKpis([]);
        return;
      }

      try {
        setIsKpisLoading(true);
        setKpisError(null);
        const response = await fetch(
          `${baseUrl}/kpis?q[assignee_id_eq]=${encodeURIComponent(userId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setUserKpis(normalizeUserKpis(data));
      } catch (error: any) {
        console.error("Failed to load user KPIs", error);
        setUserKpis([]);
        setKpisError(error?.message || "Failed to load KPIs");
      } finally {
        setIsKpisLoading(false);
      }
    };

    fetchUserKpis();
  }, []);

  useEffect(() => {
    const fetchAiProviders = async () => {
      try {
        setIsAiProvidersLoading(true);
        setAiConfigError(null);
        const response = await fetch(getFullUrl("/user_ai_config/providers"), {
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setAiProviders(Array.isArray(data?.providers) ? data.providers : []);
      } catch (error: any) {
        console.error("Failed to load AI providers", error);
        setAiProviders([]);
        setAiConfigError(error?.message || "Failed to load AI providers");
      } finally {
        setIsAiProvidersLoading(false);
      }
    };

    const fetchUserAiConfig = async () => {
      if (!currentUserId) return;

      try {
        setIsAiConfigLoading(true);
        setAiConfigError(null);
        const response = await fetch(
          getFullUrl(
            buildUserAiConfigPath(currentUserId, storedOrganizationId)
          ),
          {
            headers: {
              Authorization: getAuthHeader(),
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = await response.json();
        const config = json?.config ?? json;
        const data: UserAiConfig = {
          ...json,
          ...config,
          id: config?.id,
          configured: config?.is_active ?? false,
          is_active: config?.is_active ?? false,
        };
        setUserAiConfig(data);
        setIsAiConfigActive(data.is_active ?? false);
        if (
          storedOrganizationId &&
          (config?.organization_id || config?.org_id)
        ) {
          setIncludeOrganizationInAiConfig(true);
        }

        const provider = getAiConfigProviderId(data);
        const model = getAiConfigModelName(data);
        if (provider) setSelectedAiProvider(provider);
        if (model) setSelectedAiModel(model);
        if (data.api_key) setAiApiKey(data.api_key);
      } catch (error: any) {
        console.error("Failed to load user AI config", error);
        setUserAiConfig(null);
        setIsAiConfigActive(false);
        setAiConfigError(error?.message || "Failed to load user AI config");
      } finally {
        setIsAiConfigLoading(false);
      }
    };

    fetchAiProviders();
    fetchUserAiConfig();
  }, [currentUserId, storedOrganizationId]);

  useEffect(() => {
    const fetchAiModels = async () => {
      if (!selectedAiProvider) {
        setAiModels([]);
        setSelectedAiModel("");
        return;
      }

      try {
        setIsAiModelsLoading(true);
        setAiConfigError(null);
        const response = await fetch(
          getFullUrl(
            `/user_ai_config/models?provider=${encodeURIComponent(selectedAiProvider)}`
          ),
          {
            headers: {
              Authorization: getAuthHeader(),
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const models = Array.isArray(data?.models) ? data.models : [];
        setAiModels(models);
        setSelectedAiModel((current) =>
          current &&
            models.some((model: AiModel) => model.model_name === current)
            ? current
            : ""
        );
      } catch (error: any) {
        console.error("Failed to load AI models", error);
        setAiModels([]);
        setSelectedAiModel("");
        setAiConfigError(error?.message || "Failed to load AI models");
      } finally {
        setIsAiModelsLoading(false);
      }
    };

    fetchAiModels();
  }, [selectedAiProvider]);

  const handleSaveAiConfig = async () => {
    if (!selectedAiProvider) {
      toast.error("Please select an AI provider");
      return;
    }

    if (!selectedAiModel) {
      toast.error("Please select an AI model");
      return;
    }

    if (!aiApiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    try {
      setIsAiConfigSaving(true);
      setAiConfigError(null);

      const configId = userAiConfig?.id;
      const url = configId
        ? getFullUrl(`/user_ai_config/${configId}`)
        : getFullUrl("/user_ai_config");
      const method = configId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: getAuthHeader(),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedAiProvider,
          model: selectedAiModel,
          api_key: aiApiKey.trim(),
          organization_id: organizationIdForAiPayload,
          org_id: organizationIdForAiPayload,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
      }

      const config = data?.config || data;
      setUserAiConfig((prev) => ({
        ...prev,
        ...config,
        id: config?.id ?? prev?.id,
        configured: config?.is_active ?? config?.configured ?? true,
        is_active: config?.is_active ?? true,
        provider: config?.provider || {
          id: selectedAiProvider,
          display_name:
            aiProviders.find((p) => p.provider_id === selectedAiProvider)
              ?.display_name || selectedAiProvider,
        },
        provider_id: config?.provider_id || selectedAiProvider,
        model: config?.model || {
          model_name: selectedAiModel,
          display_name:
            aiModels.find((m) => m.model_name === selectedAiModel)
              ?.display_name || selectedAiModel,
        },
        model_name: config?.model_name || selectedAiModel,
        api_key: config?.api_key || aiApiKey.trim(),
        user_id:
          config?.user_id ||
          prev?.user_id ||
          Number(currentUserId) ||
          undefined,
        user_name: config?.user_name || prev?.user_name || formData.displayName,
      }));
      toast.success(data?.message || "AI configuration saved successfully");
    } catch (error: any) {
      console.error("Failed to save AI config", error);
      const message = error?.message || "Failed to save AI configuration";
      setAiConfigError(message);
      toast.error(message);
    } finally {
      setIsAiConfigSaving(false);
    }
  };

  const handleDeleteAiApiKey = async () => {
    const configId = userAiConfig?.id;
    if (!configId) {
      toast.error("No AI configuration found to delete");
      return;
    }

    try {
      setIsAiConfigDeleting(true);
      setAiConfigError(null);

      const response = await fetch(getFullUrl(`/user_ai_config/${configId}`), {
        method: "DELETE",
        headers: { Authorization: getAuthHeader(), Accept: "application/json" },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
      }

      setAiApiKey("");
      setSelectedAiProvider("");
      setSelectedAiModel("");
      setUserAiConfig(null);
      setIsAiConfigActive(false);
      toast.success(data?.message || "Config deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete AI config", error);
      const message = error?.message || "Failed to delete AI configuration";
      setAiConfigError(message);
      toast.error(message);
    } finally {
      setIsAiConfigDeleting(false);
    }
  };

  const handleOAuthConnect = async () => {
    try {
      setIsOAuthLoading(true);
      setAiConfigError(null);

      const params = new URLSearchParams();
      if (selectedAiProvider) params.append("provider", selectedAiProvider);
      if (selectedAiModel) params.append("model", selectedAiModel);

      const response = await fetch(
        getFullUrl(`/user_ai_config/oauth/cli_start?${params.toString()}`),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
      }

      if (data?.url) {
        // Decode unicode-escaped ampersands then strip invalid code=true param
        const cleanUrl = data.url
          .replace(/\\u0026/g, "&")
          .replace(/&code=true/g, "")
          .replace(/code=true&/g, "")
          .replace(/[?&]code=true$/g, "");

        // Extract state from URL if not returned as top-level field
        const stateFromUrl = new URL(cleanUrl).searchParams.get("state");
        setOauthUrl(cleanUrl);
        setOauthState(data?.state || stateFromUrl || null);

        window.open(cleanUrl, "_blank", "noopener,noreferrer");
        toast.info(
          data?.message ||
          "Open the URL, authorize, then paste the code back here"
        );
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error: any) {
      console.error("Failed to get OAuth URL", error);
      const message = error?.message || "Failed to initiate OAuth connection";
      setAiConfigError(message);
      toast.error(message);
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleOAuthExchange = async () => {
    if (!oauthCode.trim()) {
      toast.error("Please paste the authentication code from Claude");
      return;
    }

    const payload = {
      code: oauthCode.trim(),
      model: selectedAiModel,
      organization_id: organizationIdForAiPayload,
      org_id: organizationIdForAiPayload,
    };

    try {
      setIsOAuthExchanging(true);
      setAiConfigError(null);

      const response = await fetch(
        getFullUrl("/user_ai_config/oauth/cli_complete"),
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 422 || response.status === 429) {
        const body = JSON.stringify(data).toLowerCase();
        const isRateLimit =
          body.includes("rate_limit") || body.includes("rate limited");
        const isExpired = body.includes("expired") || body.includes("invalid");

        const startCooldown = (seconds: number) => {
          setOauthCooldown(seconds);
          cooldownRef.current = setInterval(() => {
            setOauthCooldown((prev) => {
              if (prev <= 1) {
                clearInterval(cooldownRef.current!);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        };

        if (isRateLimit) {
          startCooldown(30);
          toast.error(
            "Claude rate limit hit. Please wait 30 seconds, get a fresh code and try again."
          );
        } else if (isExpired) {
          toast.error("Auth code expired. Click 'Get New Code' to restart.");
        } else {
          toast.error(
            data?.message ||
            data?.error ||
            "Exchange failed. Get a fresh code and try again."
          );
        }
        setOauthCode("");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
      }

      const config = data?.config ?? data;
      setUserAiConfig((prev) => ({
        ...prev,
        ...config,
        id: config?.id ?? prev?.id,
        configured: config?.is_active ?? true,
        is_active: config?.is_active ?? true,
      }));
      setIsAiConfigActive(config?.is_active ?? true);
      setOauthCode("");
      setOauthUrl(null);
      setOauthState(null);
      toast.success(data?.message || "Claude connected successfully!");
    } catch (error: any) {
      console.error("Failed to exchange OAuth code", error);
      const message = error?.message || "Failed to complete OAuth connection";
      setAiConfigError(message);
      toast.error(message);
    } finally {
      setIsOAuthExchanging(false);
    }
  };

  const handleToggleAiConfig = async () => {
    const configId = userAiConfig?.id;
    if (!configId) {
      toast.error("No AI configuration found to toggle");
      return;
    }

    try {
      setIsAiConfigToggling(true);
      setAiConfigError(null);

      const response = await fetch(
        getFullUrl(`/user_ai_config/${configId}/toggle`),
        {
          method: "PATCH",
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action_type: isAiConfigActive ? "deactivate" : "activate",
          }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
      }

      const newActive = data?.config?.is_active ?? !isAiConfigActive;
      setIsAiConfigActive(newActive);
      setUserAiConfig((prev) =>
        prev
          ? {
            ...prev,
            ...data.config,
            is_active: newActive,
            configured: newActive,
          }
          : prev
      );
      toast.success(
        data?.message || (newActive ? "Config activated" : "Config deactivated")
      );
    } catch (error: any) {
      console.error("Failed to toggle AI config", error);
      const message = error?.message || "Failed to toggle AI configuration";
      setAiConfigError(message);
      toast.error(message);
    } finally {
      setIsAiConfigToggling(false);
    }
  };

  // Sync documents to localStorage whenever they change
  useEffect(() => {
    const docsToSave = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url,
      file: null, // File object JSON mein save nahi ho sakta, isliye isko null bhejenge
    }));
    localStorage.setItem("bc-profile-documents", JSON.stringify(docsToSave));
  }, [documents]);

  const triggerProfileUpload = () => {
    if (!isEditing || isSaving) return;
    fileInputRef.current?.click();
  };

  const handleProfileImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setProfileImage(result);
        setRemoveProfileImage(false);
      }
    };
    reader.readAsDataURL(file);
    setProfileImageFile(file);
    event.target.value = "";
  };

  // ─── Remove profile image handler ──────────────────────────────────────────
  const handleRemoveProfileImage = () => {
    setProfileImage("");
    setProfileImageFile(null);
    setRemoveProfileImage(true);
  };

  // ─── Document handlers ──────────────────────────────────────────────────────
  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      // Pre-fill title from filename if empty
      if (!docTitle.trim()) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
    e.target.value = "";
  };

  const handleAddDocument = async () => {
    if (!docTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }
    if (!docFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploadingDoc(true);
    try {
      // Build multipart payload — attach document under user[avatar] or a dedicated key
      // Adjust the field name to match your API contract
      const multipartPayload = new FormData();
      multipartPayload.append("firstname", formData.displayName.trim());
      multipartPayload.append("lastname", "");
      multipartPayload.append("email", formData.email.trim());
      multipartPayload.append("mobile", formData.phone.trim());
      multipartPayload.append("user[firstname]", formData.displayName.trim());
      multipartPayload.append("user[lastname]", "");
      multipartPayload.append("user[email]", formData.email.trim());
      multipartPayload.append("user[mobile]", formData.phone.trim());
      multipartPayload.append(
        "user[alternate_address]",
        formData.address.trim()
      );
      multipartPayload.append("user[user_title]", formData.jobTitle.trim());
      multipartPayload.append(
        "user[birth_date]",
        formatUiDateToApi(formData.dob) || ""
      );
      multipartPayload.append(
        "user[alternate_mobile]",
        formData.emergencyContactNumber.trim()
      );
      // document-specific fields
      multipartPayload.append("user[document_title]", docTitle.trim());
      multipartPayload.append("user[document]", docFile);

      await userService.updateProfile(multipartPayload);

      const newDoc: DocumentEntry = {
        id: `doc-${Date.now()}`,
        title: docTitle.trim(),
        file: docFile,
        url: URL.createObjectURL(docFile),
      };
      setDocuments((prev) => [...prev, newDoc]);
      setDocTitle("");
      setDocFile(null);
      toast.success("Document added successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload document";
      toast.error(message);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document removed");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const firstName = formData.displayName.trim();
      const birthDate = formatUiDateToApi(formData.dob) || "";
      const dojFormatted = formatUiDateToApi(formData.doj) || "";
      const anniversaryDateFormatted =
        formatUiDateToApi(formData.anniversaryDate) || "";
      const useFormData = !!profileImageFile || removeProfileImage;
      let updatedProfile: ProfileUpdateResponse;

      if (useFormData) {
        const multipartPayload = new FormData();
        multipartPayload.append("firstname", firstName);
        multipartPayload.append("lastname", "");
        multipartPayload.append("email", formData.email.trim());
        multipartPayload.append("mobile", formData.phone.trim());
        multipartPayload.append("user[firstname]", firstName);
        multipartPayload.append("user[lastname]", "");
        multipartPayload.append("user[email]", formData.email.trim());
        multipartPayload.append("user[mobile]", formData.phone.trim());
        multipartPayload.append(
          "user[alternate_address]",
          formData.address.trim()
        );
        multipartPayload.append("user[user_title]", formData.jobTitle.trim());
        multipartPayload.append("user[birth_date]", birthDate);
        multipartPayload.append(
          "user[alternate_mobile]",
          formData.emergencyContactNumber.trim()
        );

        // Additional profile fields (may be stored in extra_fields or user object)
        multipartPayload.append("user[city]", formData.city.trim());
        multipartPayload.append("user[state]", formData.state.trim());
        multipartPayload.append("user[pin_code]", formData.pinCode.trim());
        multipartPayload.append("user[date_of_joining]", dojFormatted);
        multipartPayload.append(
          "user[anniversary_date]",
          anniversaryDateFormatted
        );
        multipartPayload.append(
          "user[emergency_contact_name]",
          formData.emergencyContactName.trim()
        );

        if (profileImageFile) {
          multipartPayload.append("user[avatar]", profileImageFile);
        } else if (removeProfileImage) {
          multipartPayload.append("user[remove_avatar]", "true");
        }

        console.warn(
          "[Profile Save] Sending FormData to /users/profile_update.json"
        );
        updatedProfile = await userService.updateProfile(multipartPayload);
        console.warn("[Profile Save] API Response received:", updatedProfile);
      } else {
        const payload = {
          firstname: firstName,
          lastname: "",
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          user: {
            firstname: firstName,
            lastname: "",
            email: formData.email.trim(),
            mobile: formData.phone.trim(),
            alternate_address: formData.address.trim(),
            user_title: formData.jobTitle.trim(),
            birth_date: birthDate || null,
            alternate_mobile: formData.emergencyContactNumber.trim(),
            // Additional fields - API may store these in user object or return them separately
            city: formData.city.trim(),
            state: formData.state.trim(),
            pin_code: formData.pinCode.trim(),
            date_of_joining: dojFormatted,
            anniversary_date: anniversaryDateFormatted,
            emergency_contact_name: formData.emergencyContactName.trim(),
          },
        };

        console.warn(
          "[Profile Save] Sending JSON payload to /users/profile_update.json:",
          JSON.stringify(payload, null, 2)
        );
        updatedProfile = await userService.updateProfile(payload);
        console.warn("[Profile Save] API Response received:", updatedProfile);
      }

      const mergedData = mergeApiProfileIntoForm(formData, updatedProfile);
      setFormData(mergedData);
      persistProfileDataLocally(mergedData);

      if (removeProfileImage) {
        localStorage.removeItem("bc-profile-avatar");
      } else if (profileImage) {
        localStorage.setItem("bc-profile-avatar", profileImage);
      } else {
        localStorage.removeItem("bc-profile-avatar");
      }

      setProfileImageFile(null);
      setRemoveProfileImage(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      console.error("[Profile Save] Error:", message, error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const savedData = localStorage.getItem("bc-profile-data");
    if (savedData) setFormData(JSON.parse(savedData));
    setProfileImage(localStorage.getItem("bc-profile-avatar") || "");
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setDocTitle("");
    setDocFile(null);
  };

  // ── Wallet helpers ────────────────────────────────────────────────────────
  const formatBalance = (v: number | null) => {
    if (v === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);
  };

  const formatTxDate = (s: string) => {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;
  };

  const formatLastUpdated = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const isToday = d.toDateString() === new Date().toDateString();
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Last updated: ${isToday ? "Today" : formatTxDate(iso)}, ${time}`;
  };

  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const d = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const wk = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    const mo = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `W${wk} ${mo[monday.getMonth()]} ${monday.getDate()} – ${mo[sunday.getMonth()]} ${sunday.getDate()}`;
  };

  // Fetch wallet data
  const fetchWalletData = async (refreshing = false) => {
    const base = getBaseUrl();
    const token = getToken();
    const userId =
      localStorage.getItem("userId") || String(getUser()?.id || "");
    if (!base || !token || !userId) return;
    const baseUrl = base.replace(/\/$/, "").replace(/^https?:\/\//, "");
    if (refreshing) setWalletRefreshing(true);
    else setWalletLoading(true);
    try {
      const res = await fetch(
        `https://${baseUrl}/wallet/balance.json?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.available_amount ?? null);
        setWalletTransactions(data.wallet_transactions || []);
        setWalletUpdatedAt(new Date().toISOString());
        setWalletExists(true);
      } else if (res.status === 404) {
        setWalletExists(false);
      }
    } catch (e) {
      console.error("Wallet fetch error:", e);
    } finally {
      setWalletLoading(false);
      setWalletRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeTab === "wallet") fetchWalletData();
  }, [activeTab]);

  const pointTypeBadge = (pt: string) => {
    const lower = (pt || "").toLowerCase();
    if (lower === "bonus") return "bg-[#e0f5f0] text-[#0d9488]";
    return "bg-[#fde8dc] text-[#c2410c]";
  };

  const txTypeBadge = (tt: string) =>
    (tt || "").toLowerCase() === "credit"
      ? "bg-[#dcfce7] text-[#16a34a]"
      : "bg-[#fee2e2] text-[#dc2626]";

  const filteredTxs = walletTransactions.filter((t) => {
    if (walletFilter === "all") return true;
    return (t.transactionType || "").toLowerCase() === walletFilter;
  });

  const handleExportHistory = () => {
    if (!filteredTxs.length) return;
    const headers = [
      "Date",
      "Amount",
      "Point Type",
      "Transaction Type",
      "Payment Mode",
    ];
    const rows = filteredTxs.map((t) =>
      [
        formatTxDate(t.date),
        t.transactionPoints,
        t.point_type,
        t.transactionType,
        t.payment_mode,
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const profileInitials =
    formData.displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";
  const aiConfigProviderDisplayName =
    getAiConfigProviderDisplayName(userAiConfig);
  const aiConfigModelName = getAiConfigModelName(userAiConfig);
  const aiConfigModelDisplayName = getAiConfigModelDisplayName(userAiConfig);
  const selectedOrganizationName = getStoredOrganizationName();

  // Profile completion %
  const completionFields = [
    formData.displayName,
    formData.email,
    formData.jobTitle,
    formData.city,
    formData.state,
    formData.pinCode,
    formData.dob,
    formData.doj,
    formData.emergencyContactName,
    formData.emergencyContactNumber,
  ];
  const completionPct = Math.round(
    (completionFields.filter((f) => f?.trim()).length /
      completionFields.length) *
    100
  );

  /* ─────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto">
        {/* Page title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-5">
          My Profile
        </h1>

        {/* ══ Main two-column layout ══════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          {/* ── LEFT: main profile content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* ─ Profile Header Card ─ */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0 group">
                  {profileImage && !removeProfileImage ? (
                    <>
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      {isEditing && (
                        <>
                          <div
                            onClick={triggerProfileUpload}
                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Upload size={16} className="text-white" />
                          </div>
                          <button
                            onClick={handleRemoveProfileImage}
                            type="button"
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div
                      onClick={isEditing ? triggerProfileUpload : undefined}
                      className={cn(
                        "w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-full bg-[#DA7756] flex items-center justify-center text-white text-[22px] font-black border-2 border-white shadow-sm",
                        isEditing && "cursor-pointer hover:opacity-90"
                      )}
                    >
                      {profileInitials}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageSelect}
                  />
                </div>

                {/* Name + Designation + Edit + Details row */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-[16px] sm:text-[19px] font-bold text-[#1a1a1a] leading-tight">
                        {formData.displayName}
                      </h2>
                      <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
                        {formData.jobTitle || "No designation set"}
                      </p>
                    </div>
                    {/* Edit / Save / Cancel */}
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        disabled={isProfileLoading}
                        className="flex-shrink-0 border border-[#DA7756] text-[#DA7756] text-[12px] font-semibold px-3 sm:px-4 py-1.5 rounded-[12px] hover:bg-[#fef6f4] transition-colors whitespace-nowrap"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={handleSave}
                          disabled={isSaving || isProfileLoading}
                          className="bg-[#DA7756] text-white text-[12px] font-semibold px-3 sm:px-4 py-1.5 rounded-[12px] hover:bg-[#c9673f] transition-colors disabled:opacity-60 whitespace-nowrap"
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="border border-gray-300 text-gray-500 text-[12px] font-semibold px-3 sm:px-4 py-1.5 rounded-[12px] hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Location / Position / Work / Status */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                    {[
                      {
                        label: "Location",
                        value:
                          [formData.city, formData.state]
                            .filter(Boolean)
                            .join(", ") || "Not provided",
                      },
                      {
                        label: "Position",
                        value: formData.jobTitle || "Not provided",
                      },
                      {
                        label: "Department",
                        value: formData.departmentName || "Not provided",
                      },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-[12px] sm:text-[13px] font-semibold text-[#1a1a1a]">
                          {value}
                        </p>
                      </div>
                    ))}
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 leading-none mb-0.5">
                        Status
                      </p>
                      <span className="inline-block bg-teal-50 text-teal-600 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile completion ring – hidden on xs */}
                <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
                  <p className="text-[10px] text-gray-400">
                    Profile completion
                  </p>
                  <div className="relative w-[80px] h-[80px]">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 80 80"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#ede9e3"
                        strokeWidth="7"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#DA7756"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={
                          2 * Math.PI * 34 * (1 - completionPct / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-[#1a1a1a]">
                      {completionPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-1.5 flex items-center gap-1 w-fit shadow-sm flex-wrap">
              {(
                [
                  "basic",
                  "face_enroll",
                  // "assets",
                  "attendance",
                  // "my_roster",
                  "my_wallet",
                ] as ProfileTab[]
              ).map((id) => {
                const labels: Record<string, string> = {
                  basic: "Basic Info",
                  face_enroll: "Face Enroll",
                  assets: "Assets",
                  attendance: "Attendance",
                  my_roster: "My Roster",
                  my_wallet: "My Wallet",
                };
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "px-4 sm:px-5 py-1.5 sm:py-2 rounded-[8px] text-[12px] sm:text-[13px] font-semibold transition-colors",
                      activeTab === id
                        ? "bg-[#DA7756] text-white"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {labels[id]}
                  </button>
                );
              })}
            </div>

            {/* ─ Basic Info content ─ */}
            {activeTab === "basic" && (
              <>
                {/* Personal info */}
                <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
                  <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                    <User size={15} className="text-gray-500" strokeWidth={2} />
                    Personal info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Name */}
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Globe size={11} className="text-[#6B9BCC]" />
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Name
                        </span>
                      </div>
                      {isEditing ? (
                        <Input
                          className="h-8 text-[12px] border-gray-200"
                          value={formData.displayName}
                          onChange={(e) =>
                            handleInputChange("displayName", e.target.value)
                          }
                          placeholder="Full name"
                        />
                      ) : (
                        <p className="text-[13px] font-semibold text-[#1a1a1a]">
                          {formData.displayName || "Not provided"}
                        </p>
                      )}
                    </div>
                    {/* Email */}
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Mail size={11} className="text-[#6B9BCC]" />
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Email
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#1a1a1a] break-all">
                        {formData.email || "Not provided"}
                      </p>
                    </div>
                    {/* Job position */}
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Star size={11} className="text-[#6B9BCC]" />
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Job position
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#1a1a1a]">
                        {formData.jobTitle || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional info */}
                <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
                  <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                    <Info size={15} className="text-gray-500" strokeWidth={2} />
                    Additional info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {(
                      [
                        {
                          icon: Globe,
                          label: "City",
                          field: "city",
                          type: "text",
                        },
                        {
                          icon: MapPin,
                          label: "State",
                          field: "state",
                          type: "text",
                        },
                        {
                          icon: Star,
                          label: "Pin Code",
                          field: "pinCode",
                          type: "text",
                        },
                        {
                          icon: Cake,
                          label: "Birthday",
                          field: "dob",
                          type: "date",
                        },
                        {
                          icon: Heart,
                          label: "Anniversary",
                          field: "anniversaryDate",
                          type: "date",
                        },
                        {
                          icon: Calendar,
                          label: "Joined Date",
                          field: "doj",
                          type: "date",
                        },
                      ] as {
                        icon: React.ElementType;
                        label: string;
                        field: string;
                        type: string;
                      }[]
                    ).map(({ icon: Icon, label, field, type }) => (
                      <div
                        key={field}
                        className="bg-white rounded-xl border border-gray-100 p-3"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon size={11} className="text-[#6B9BCC]" />
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                            {label}
                          </span>
                        </div>
                        {isEditing ? (
                          type === "date" ? (
                            <AdvancedDatePicker
                              value={
                                formData[
                                field as keyof typeof formData
                                ] as string
                              }
                              onChange={(v) => handleInputChange(field, v)}
                              placeholder="dd/MM/yyyy"
                            />
                          ) : (
                            <Input
                              className="h-8 text-[12px] border-gray-200"
                              value={
                                formData[
                                field as keyof typeof formData
                                ] as string
                              }
                              onChange={(e) =>
                                handleInputChange(field, e.target.value)
                              }
                              placeholder={label}
                            />
                          )
                        ) : (
                          <p className="text-[13px] font-semibold text-[#1a1a1a]">
                            {(formData[
                              field as keyof typeof formData
                            ] as string) || "Not provided"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Details + Emergency Recovery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department Details */}
                  <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
                    <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                      <Briefcase
                        size={15}
                        className="text-gray-500"
                        strokeWidth={2}
                      />
                      Department
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white text-gray-600 text-[12px] font-medium px-4 py-2 rounded-lg border border-gray-200">
                        {formData.departmentName || "Not provided"}
                      </span>
                      <span className="bg-white text-teal-600 text-[12px] font-medium px-4 py-2 rounded-lg border border-teal-100">
                        Active Member
                      </span>
                    </div>
                  </div>

                  {/* Emergency Recovery */}
                  <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
                    <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                      <ShieldAlert
                        size={15}
                        className="text-gray-500"
                        strokeWidth={2}
                      />
                      Emergency Recovery
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <User size={9} className="text-gray-400" /> Trusted
                          Contact
                        </p>
                        {isEditing ? (
                          <Input
                            className="h-8 text-[12px] border-gray-200"
                            value={formData.emergencyContactName}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactName",
                                e.target.value
                              )
                            }
                            placeholder="Name"
                          />
                        ) : (
                          <p className="text-[13px] font-semibold text-[#1a1a1a]">
                            {formData.emergencyContactName || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Phone size={9} className="text-gray-400" /> Recovery
                          Phone
                        </p>
                        {isEditing ? (
                          <Input
                            className="h-8 text-[12px] border-gray-200"
                            value={formData.emergencyContactNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactNumber",
                                e.target.value
                              )
                            }
                            placeholder="Number"
                          />
                        ) : (
                          <p className="text-[13px] font-semibold text-[#1a1a1a]">
                            {formData.emergencyContactNumber || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Shared profile sections */}
            {activeTab === "face_enroll" && (
              <div className="rounded-2xl border border-gray-100 bg-[#F6F4EE] p-4 sm:p-5">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    Face Enrollment
                  </h2>
                  <p className="mt-1 text-sm text-[#2C2C2C]/65">
                    Add or update your face profile for secure product access.
                  </p>
                </div>
                <FaceEnrollmentPanel />
              </div>
            )}

            {activeTab === "assets" && (
              <div className="rounded-2xl bg-[#F6F4EE] p-4 sm:p-5">
                <ProfileAssets />
              </div>
            )}

            {activeTab === "attendance" && <BusinessCompassAttendanceView />}

            {activeTab === "my_roster" && (
              <div className="rounded-2xl bg-[#F6F4EE] p-4 sm:p-5">
                <ProfileRoster
                  rosterId={
                    profileDetails?.lock_user_permission?.user_roaster_id
                  }
                />
              </div>
            )}

            {activeTab === "my_wallet" && (
              <div className="rounded-2xl bg-[#F6F4EE] p-4 sm:p-5">
                <ProfileWallet />
              </div>
            )}

            {/* wallet content moved to full-width section above */}
            {activeTab === "wallet" && (
              <div className="flex flex-col gap-4">
                {/* Available Balance Card */}
                <div
                  className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #b0aca4 0%, #c8c4bc 40%, #d8d4cc 70%, #e2dfd9 100%)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white/25 rounded-md flex items-center justify-center">
                          <CreditCard size={13} className="text-white" />
                        </div>
                        <span className="text-white/80 text-[12px] font-medium">
                          Available Balance
                        </span>
                      </div>
                      {walletLoading ? (
                        <div className="flex items-center gap-2 py-2">
                          <RefreshCw
                            size={18}
                            className="animate-spin text-white/60"
                          />
                          <span className="text-white/60 text-[14px]">
                            Loading…
                          </span>
                        </div>
                      ) : !walletExists ? (
                        <p className="text-white/70 text-[15px] font-semibold">
                          Wallet not found
                        </p>
                      ) : (
                        <p className="text-[32px] sm:text-[38px] font-black text-[#DA7756] leading-none">
                          ₹{formatBalance(walletBalance)}
                        </p>
                      )}
                      <p className="text-white/55 text-[11px] mt-2">
                        {formatLastUpdated(walletUpdatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => fetchWalletData(true)}
                      disabled={walletRefreshing}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform disabled:opacity-60 flex-shrink-0"
                    >
                      <RefreshCw
                        size={14}
                        className={cn(
                          "text-gray-500",
                          walletRefreshing && "animate-spin"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
                  {/* Table header row */}
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#DA7756]/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#DA7756]" />
                      </div>
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">
                        Transaction History
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Count badge */}
                      <span className="bg-purple-100 text-purple-700 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        {walletTransactions.length} transactions
                      </span>
                      {/* Filter tabs */}
                      {(["all", "credit", "debit"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setWalletFilter(f)}
                          className={cn(
                            "text-[11px] sm:text-[12px] font-semibold px-3 py-1 rounded-lg transition-colors capitalize",
                            walletFilter === f
                              ? "bg-[#DA7756] text-white"
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          {f === "all"
                            ? "All"
                            : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                      {/* Filter button */}
                      <button className="border border-[#DA7756] text-[#DA7756] text-[11px] sm:text-[12px] font-semibold px-3 py-1 rounded-lg hover:bg-[#fef6f4] transition-colors flex items-center gap-1.5">
                        <Filter size={12} /> Filter
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  {walletLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-[13px] font-medium">
                        Loading transactions…
                      </span>
                    </div>
                  ) : filteredTxs.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-[13px] font-medium">
                      No transactions found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            {[
                              "Date",
                              "Amount",
                              "Point Type",
                              "Transaction Type",
                              "Payment Mode",
                            ].map((col) => (
                              <th key={col} className="pb-3 pr-4 last:pr-0">
                                <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                                  {col}
                                  <ChevronDownIcon
                                    size={11}
                                    className="text-gray-400"
                                  />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTxs.map((tx, i) => {
                            const isCredit =
                              (tx.transactionType || "").toLowerCase() ===
                              "credit";
                            return (
                              <tr
                                key={tx.id ?? i}
                                className="border-b border-gray-100 last:border-0 hover:bg-white/50 transition-colors"
                              >
                                {/* Date */}
                                <td className="py-3 pr-4 text-[12px] sm:text-[13px] text-gray-700 whitespace-nowrap">
                                  {formatTxDate(tx.date)}
                                </td>
                                {/* Amount */}
                                <td className="py-3 pr-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1">
                                    {isCredit ? (
                                      <TrendingUp
                                        size={13}
                                        className="text-green-500 flex-shrink-0"
                                      />
                                    ) : (
                                      <TrendingDown
                                        size={13}
                                        className="text-red-500 flex-shrink-0"
                                      />
                                    )}
                                    <span
                                      className={cn(
                                        "text-[12px] sm:text-[13px] font-semibold",
                                        isCredit
                                          ? "text-green-600"
                                          : "text-red-500"
                                      )}
                                    >
                                      {isCredit ? "+" : "-"}
                                      {Math.abs(tx.transactionPoints)}
                                    </span>
                                  </div>
                                </td>
                                {/* Point Type */}
                                <td className="py-3 pr-4">
                                  <span
                                    className={cn(
                                      "text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                                      pointTypeBadge(tx.point_type)
                                    )}
                                  >
                                    {tx.point_type || "—"}
                                  </span>
                                </td>
                                {/* Transaction Type */}
                                <td className="py-3 pr-4">
                                  <span
                                    className={cn(
                                      "text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                                      txTypeBadge(tx.transactionType)
                                    )}
                                  >
                                    {tx.transactionType || "—"}
                                  </span>
                                </td>
                                {/* Payment Mode */}
                                <td className="py-3 text-[12px] sm:text-[13px] text-gray-600 whitespace-nowrap">
                                  {tx.payment_mode || "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4">
            {/* My Objectives (KPI) — Swiper carousel, no arrows */}
            <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                <BarChart2
                  size={15}
                  className="text-gray-500"
                  strokeWidth={2}
                />
                My Objectives (KPI)
              </h3>

              {isKpisLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={18} className="animate-spin text-[#DA7756]" />
                </div>
              ) : (
                (() => {
                  /* Build slide pairs: each slide shows 2 KPIs side-by-side */
                  const pool =
                    userKpis.length > 0
                      ? userKpis
                      : ([
                        {
                          id: "p1",
                          frequency: "Daily",
                          name: "Courtesy call",
                          currentValue: 0,
                          target: 2,
                          unit: "calls",
                        },
                        {
                          id: "p2",
                          frequency: "Daily",
                          name: "Courtesy call",
                          currentValue: 0,
                          target: 2,
                          unit: "calls",
                        },
                      ] as typeof userKpis);

                  const pairs: (typeof userKpis)[] = [];
                  for (let i = 0; i < pool.length; i += 2) {
                    pairs.push(pool.slice(i, i + 2) as typeof userKpis);
                  }

                  return (
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={8}
                      slidesPerView={1}
                      loop={pairs.length > 1}
                      autoplay={
                        pairs.length > 1
                          ? { delay: 3000, disableOnInteraction: false }
                          : false
                      }
                      allowTouchMove
                      className="w-full"
                    >
                      {pairs.map((pair, slideIdx) => (
                        <SwiperSlide key={slideIdx}>
                          <div className="grid grid-cols-2 gap-2">
                            {pair.map((kpi) => (
                              <div
                                key={kpi.id}
                                className="bg-white rounded-xl border border-gray-100 p-3"
                              >
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mb-0.5">
                                  {kpi.frequency || "Daily"}
                                </p>
                                <p className="text-[11px] sm:text-[12px] font-semibold text-[#1a1a1a] leading-tight line-clamp-2 mb-2">
                                  {kpi.name}
                                </p>
                                <div className="border-t border-gray-100 pt-2">
                                  <span className="text-[17px] sm:text-[18px] font-black text-[#DA7756]">
                                    {kpi.currentValue ?? 0}
                                  </span>
                                  <span className="text-[10px] text-gray-400 ml-0.5">
                                    /{kpi.target ?? 0} {kpi.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  );
                })()
              )}
            </div>

            {/* Professional Vault */}
            <div className="bg-[#F6F4EE] rounded-2xl p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">
                <FileText size={15} className="text-gray-500" strokeWidth={2} />
                Professional Vault
              </h3>
              <div className="space-y-2.5">
                <Input
                  className="h-10 bg-white text-[13px] border-gray-200 rounded-xl placeholder:text-gray-300"
                  placeholder="Document title..."
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  disabled={isUploadingDoc}
                />
                <input
                  ref={docFileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleDocFileSelect}
                />
                <button
                  onClick={() => docFileInputRef.current?.click()}
                  disabled={isUploadingDoc}
                  className="w-full h-10 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  {docFile ? (
                    <span className="truncate max-w-[160px] text-[12px]">
                      {docFile.name}
                    </span>
                  ) : (
                    "Choose File"
                  )}
                </button>
                <button
                  onClick={handleAddDocument}
                  disabled={isUploadingDoc}
                  className="w-full h-10 bg-white border border-[#DA7756] rounded-xl text-[13px] font-semibold text-[#DA7756] hover:bg-[#fef6f4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={14} />
                  {isUploadingDoc ? "Uploading…" : "Add Document"}
                </button>
                {documents.length > 0 ? (
                  <div className="space-y-1.5 mt-1">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between gap-2 bg-white rounded-xl border border-gray-100 px-3 py-2 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText
                            size={13}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <span className="text-[12px] font-medium text-gray-700 truncate">
                            {doc.title}
                          </span>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#DA7756] hover:underline flex-shrink-0"
                            >
                              View
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 text-center mt-1 italic">
                    No professional documents secured yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ AI Configuration (kept exactly as-is) ══════════════════════ */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            <Card className="rounded-[16px] border border-blue-100 bg-white shadow-sm ring-1 ring-blue-50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-blue-700">
                  <Bot size={20} className="text-blue-500" />
                  AI Configuration
                  <AiProviderLinksDropdown />
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-3 h-6 rounded-full font-bold",
                      userAiConfig?.configured
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {isAiConfigLoading
                      ? "Checking"
                      : userAiConfig?.configured
                        ? "Configured"
                        : "Not Configured"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-4 space-y-5">
                {/* ── Tab Buttons ── */}
                <div className="flex gap-2 border-b border-gray-100 pb-1">
                  <button
                    type="button"
                    onClick={() => setAiConfigTab("api_key")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition-colors",
                      aiConfigTab === "api_key"
                        ? "border-blue-600 text-blue-700 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <KeyRound size={14} />
                    API Key Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAiConfigTab("auth_connect");
                      const anthropicProvider = aiProviders.find(
                        (p) =>
                          p.provider_id?.toLowerCase().includes("anthropic") ||
                          p.display_name?.toLowerCase().includes("anthropic") ||
                          p.provider_id?.toLowerCase().includes("claude")
                      );
                      if (
                        anthropicProvider &&
                        selectedAiProvider !== anthropicProvider.provider_id
                      ) {
                        setSelectedAiProvider(anthropicProvider.provider_id);
                        setSelectedAiModel("");
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition-colors",
                      aiConfigTab === "auth_connect"
                        ? "border-[#c96442] text-[#c96442] bg-[#c96442]/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Globe size={14} />
                    Auth Connect
                  </button>
                </div>

                {aiConfigError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {aiConfigError}
                  </div>
                )}

                {/* ── Tab 1: API Key ── */}
                {aiConfigTab === "api_key" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bot size={14} className="text-blue-500" />
                          <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
                            Provider
                          </span>
                        </div>
                        <Select
                          value={selectedAiProvider}
                          onValueChange={(v) => {
                            setSelectedAiProvider(v);
                            setSelectedAiModel("");
                          }}
                          disabled={isAiProvidersLoading}
                        >
                          <SelectTrigger className="h-10 border-gray-300 bg-[#FAFAFA]">
                            <SelectValue
                              placeholder={
                                isAiProvidersLoading
                                  ? "Loading providers..."
                                  : "Select Provider"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {aiProviders.map((p) => (
                              <SelectItem
                                key={p.provider_id}
                                value={p.provider_id}
                              >
                                {p.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Cpu size={14} className="text-indigo-500" />
                          <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
                            Models
                          </span>
                        </div>
                        <Select
                          value={selectedAiModel}
                          onValueChange={setSelectedAiModel}
                          disabled={!selectedAiProvider || isAiModelsLoading}
                        >
                          <SelectTrigger className="h-10 border-gray-300 bg-[#FAFAFA]">
                            <SelectValue
                              placeholder={
                                !selectedAiProvider
                                  ? "Select provider first"
                                  : isAiModelsLoading
                                    ? "Loading models..."
                                    : "Select Model"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {aiModels.map((m) => (
                              <SelectItem
                                key={m.model_name}
                                value={m.model_name}
                              >
                                {m.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                          User AI Config
                        </p>
                        <p className="mt-2 text-sm font-bold text-gray-800">
                          {userAiConfig?.user_name || formData.displayName}
                        </p>
                        {aiConfigProviderDisplayName && (
                          <p className="mt-2 text-xs font-semibold text-gray-500">
                            Provider:{" "}
                            <span className="text-gray-800">
                              {aiConfigProviderDisplayName}
                            </span>
                          </p>
                        )}
                        {(aiConfigModelDisplayName || aiConfigModelName) && (
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            Model:{" "}
                            <span className="text-gray-800">
                              {aiConfigModelDisplayName || aiConfigModelName}
                            </span>
                          </p>
                        )}
                        {!userAiConfig?.configured && userAiConfig?.message && (
                          <p className="mt-2 text-xs font-semibold text-amber-700">
                            {userAiConfig.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeyRound size={14} className="text-slate-500" />
                        <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
                          API Key
                        </span>
                      </div>
                      <Textarea
                        value={
                          isAiApiKeyFocused || !aiApiKey
                            ? aiApiKey
                            : maskApiKey(aiApiKey)
                        }
                        onChange={(e) => setAiApiKey(e.target.value)}
                        onFocus={() => setIsAiApiKeyFocused(true)}
                        onBlur={() => setIsAiApiKeyFocused(false)}
                        placeholder="Enter API key"
                        disabled={isAiConfigSaving}
                        className="min-h-[96px] bg-[#FAFAFA] text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <OrganizationCheckbox
                        name={selectedOrganizationName}
                        organizationId={storedOrganizationId}
                        checked={
                          includeOrganizationInAiConfig &&
                          Boolean(storedOrganizationId)
                        }
                        onCheckedChange={setIncludeOrganizationInAiConfig}
                      />
                      <div className="flex flex-col justify-end gap-3 sm:flex-row">
                        <Button
                          variant="outline"
                          onClick={handleDeleteAiApiKey}
                          disabled={
                            isAiConfigDeleting ||
                            isAiConfigSaving ||
                            !selectedAiProvider ||
                            !aiApiKey.trim()
                          }
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-10 px-6 shadow-sm"
                        >
                          {isAiConfigDeleting ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <Trash2
                              size={16}
                              className="mr-2"
                              strokeWidth={2.5}
                            />
                          )}
                          {isAiConfigDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button
                          onClick={handleSaveAiConfig}
                          disabled={
                            isAiConfigSaving ||
                            isAiConfigDeleting ||
                            isAiProvidersLoading ||
                            isAiModelsLoading ||
                            !selectedAiProvider ||
                            !selectedAiModel ||
                            !aiApiKey.trim()
                          }
                          className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-10 px-6 shadow-sm"
                        >
                          {isAiConfigSaving ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <Save
                              size={16}
                              className="mr-2"
                              strokeWidth={2.5}
                            />
                          )}
                          {isAiConfigSaving ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab 2: Auth Connect ── */}
                {aiConfigTab === "auth_connect" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bot size={14} className="text-blue-500" />
                          <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
                            Provider
                          </span>
                        </div>
                        <div className="h-10 flex items-center gap-2.5 rounded-md border border-gray-300 bg-[#FAFAFA] px-3">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg"
                            alt="Claude"
                            className="w-5 h-5 rounded object-contain shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <span className="text-sm font-semibold text-gray-800">
                            Anthropic
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Cpu size={14} className="text-indigo-500" />
                          <span className="text-[#8e8e8e] text-[10px] font-bold uppercase tracking-widest leading-none">
                            Models
                          </span>
                        </div>
                        <Select
                          value={selectedAiModel}
                          onValueChange={setSelectedAiModel}
                          disabled={!selectedAiProvider || isAiModelsLoading}
                        >
                          <SelectTrigger className="h-10 border-gray-300 bg-[#FAFAFA]">
                            <SelectValue
                              placeholder={
                                !selectedAiProvider
                                  ? "Select provider first"
                                  : isAiModelsLoading
                                    ? "Loading models..."
                                    : "Select Model"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {aiModels.map((m) => (
                              <SelectItem
                                key={m.model_name}
                                value={m.model_name}
                              >
                                {m.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                          User AI Config
                        </p>
                        <p className="mt-2 text-sm font-bold text-gray-800">
                          {userAiConfig?.user_name || formData.displayName}
                        </p>
                        {aiConfigProviderDisplayName && (
                          <p className="mt-2 text-xs font-semibold text-gray-500">
                            Provider:{" "}
                            <span className="text-gray-800">
                              {aiConfigProviderDisplayName}
                            </span>
                          </p>
                        )}
                        {(aiConfigModelDisplayName || aiConfigModelName) && (
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            Model:{" "}
                            <span className="text-gray-800">
                              {aiConfigModelDisplayName || aiConfigModelName}
                            </span>
                          </p>
                        )}
                        {!userAiConfig?.configured && userAiConfig?.message && (
                          <p className="mt-2 text-xs font-semibold text-amber-700">
                            {userAiConfig.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4" />

                    <div className="rounded-xl border border-[#c96442]/20 bg-[#c96442]/5 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full bg-[#c96442] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          1
                        </div>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg"
                          alt="Claude"
                          className="w-7 h-7 rounded-lg object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <div>
                          <p className="text-sm font-bold text-[#c96442]">
                            Claude by Anthropic
                          </p>
                          <p className="text-xs text-gray-500">
                            Connect your account via OAuth
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Connect directly with your Anthropic account without
                        needing to manage API keys manually.
                      </p>
                      <Button
                        className="w-full bg-[#c96442] hover:bg-[#a8502e] text-white font-bold h-10 shadow-sm"
                        onClick={handleOAuthConnect}
                        disabled={isOAuthLoading || !selectedAiModel}
                      >
                        {isOAuthLoading ? (
                          <Loader2 size={15} className="mr-2 animate-spin" />
                        ) : (
                          <Globe size={15} className="mr-2" />
                        )}
                        {isOAuthLoading
                          ? "Redirecting..."
                          : "Connect with Claude"}
                      </Button>
                      {!selectedAiModel && (
                        <p className="text-[11px] text-amber-600 font-semibold mt-2 text-center">
                          Please select a model before connecting.
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-green-100 bg-green-50/50 p-5 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">
                          Copy the full code from Claude Platform and paste it
                          below:
                        </p>
                        <Textarea
                          value={oauthCode}
                          onChange={(e) => setOauthCode(e.target.value)}
                          placeholder="e.g. nsRdj0lCU38CQ9BH...#FRhkNKp68rilbIW..."
                          className="min-h-[80px] bg-white text-sm font-mono border-green-200 focus-visible:border-green-400"
                          disabled={isOAuthExchanging}
                        />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <OrganizationCheckbox
                          name={selectedOrganizationName}
                          organizationId={storedOrganizationId}
                          checked={
                            includeOrganizationInAiConfig &&
                            Boolean(storedOrganizationId)
                          }
                          onCheckedChange={setIncludeOrganizationInAiConfig}
                        />
                        <Button
                          onClick={handleOAuthExchange}
                          disabled={
                            isOAuthExchanging ||
                            !!oauthCooldown ||
                            !oauthCode.trim() ||
                            !selectedAiModel
                          }
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 shadow-sm disabled:opacity-60 sm:flex-1"
                        >
                          {isOAuthExchanging ? (
                            <Loader2 size={15} className="mr-2 animate-spin" />
                          ) : (
                            <ShieldCheck size={15} className="mr-2" />
                          )}
                          {isOAuthExchanging
                            ? "Connecting..."
                            : oauthCooldown > 0
                              ? `Rate limited — wait ${oauthCooldown}s`
                              : "Submit Code & Connect"}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-400 font-medium">
                        OAuth authentication will redirect you to Anthropic's
                        authorization page. You'll be brought back automatically
                        after granting access.
                      </p>
                    </div>

                    {userAiConfig?.id && (
                      <div className="flex justify-end border-t border-gray-100 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleDeleteAiApiKey}
                          disabled={isAiConfigDeleting}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-10 px-6 shadow-sm"
                        >
                          {isAiConfigDeleting ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <Trash2
                              size={16}
                              className="mr-2"
                              strokeWidth={2.5}
                            />
                          )}
                          {isAiConfigDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCompassProfile;
