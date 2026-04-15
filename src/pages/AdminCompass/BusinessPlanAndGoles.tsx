import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { BhagSection } from "./AdminCompassComponent/BhagSection";
import { MediumTermSection } from "./AdminCompassComponent/MediumTermSection";
import { ShortTermSection } from "./AdminCompassComponent/ShortTermSection";
import { QuarterlySection } from "./AdminCompassComponent/QuarterlySection";
import { CriticalNumbers } from "./AdminCompassComponent/CriticalNumbers";
import { KeyProcessesSection } from "./AdminCompassComponent/KeyProcessesSection";
import SWOTAnalysis from "./AdminCompassComponent/SWOTAnalysis";
import { GoalsView } from "./AdminCompassComponent/GoalsView";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

// ── Design Tokens — reduced orange, neutral-first ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  tealBg: "#9EC8BA",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

// ── API base ──
const BASE_URL = localStorage.getItem("baseUrl") || "";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

// ─────────────────────────────────────────────
//  Safe JSON Parser
// ─────────────────────────────────────────────
const safeParseJSON = (data: any) => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
};

// ─────────────────────────────────────────────
//  Brand Promises API helpers
// ─────────────────────────────────────────────
const parseBrandPromisesRecord = (
  json: any
): { promises: BrandPromise[]; videoUrl: string } => {
  if (json?.grouped_data?.business_plan_brand_promises) {
    const group = json.grouped_data.business_plan_brand_promises;
    const values: string[] = group.values ?? [];
    const videoUrl: string = group.video_url ?? "";
    const promiseKpis: Record<string, string[]> = safeParseJSON(
      group.promise_kpis
    );
    const rows: any[] = Array.isArray(json.data) ? json.data : [];
    const promises: BrandPromise[] = values.map(
      (text: string, idx: number) => ({
        id: rows[idx]?.id ?? null,
        text,
        kpis: promiseKpis[`item_${idx + 1}`] ?? [],
      })
    );
    return { promises, videoUrl };
  }
  if (json?.extra_field) {
    const record = json.extra_field;
    const values: string[] = record.values ?? [];
    const videoUrl: string = record.video_url ?? "";
    const promiseKpis: Record<string, string[]> = safeParseJSON(
      record.promise_kpis
    );
    const promises: BrandPromise[] = values.map(
      (text: string, idx: number) => ({
        id: null,
        text,
        kpis: promiseKpis[`item_${idx + 1}`] ?? [],
      })
    );
    return { promises, videoUrl };
  }
  if (Array.isArray(json)) {
    const record =
      json.find((r: any) => r.group_name === "business_plan_brand_promises") ??
      json[0];
    if (!record) return { promises: [], videoUrl: "" };
    const values: string[] =
      record.values ?? (record.value ? [record.value] : []);
    const videoUrl: string = record.video_url ?? "";
    const promiseKpis: Record<string, string[]> = safeParseJSON(
      record.promise_kpis
    );
    const efv: any[] = record.extra_field_values ?? [];
    const promises: BrandPromise[] = values.map(
      (text: string, idx: number) => ({
        id: efv[idx]?.id ?? null,
        text,
        kpis: promiseKpis[`item_${idx + 1}`] ?? [],
      })
    );
    return { promises, videoUrl };
  }
  return { promises: [], videoUrl: "" };
};

const fetchBrandPromisesFromApi = async (): Promise<{
  promises: BrandPromise[];
  videoUrl: string;
}> => {
  const url = `https://${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_brand_promises&include_grouped=true`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = [];
  }
  return parseBrandPromisesRecord(json);
};

const saveBrandPromisesToApi = async (
  promises: { text: string; kpis: string[] }[],
  videoUrl: string
): Promise<{ promises: BrandPromise[]; videoUrl: string }> => {
  const promiseKpis: Record<string, string[]> = {};
  promises.forEach((p, idx) => {
    promiseKpis[`item_${idx + 1}`] = p.kpis;
  });
  const payload = {
    extra_field: {
      group_name: "business_plan_brand_promises",
      values: promises.map((p) => p.text),
      video_url: videoUrl,
      promise_kpis: promiseKpis,
    },
  };
  const res = await fetch(`https://${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const rawText = await res.text();
  if (!res.ok)
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  const parsed = parseBrandPromisesRecord(json);
  if (parsed.promises.length === 0 && promises.length > 0) {
    return {
      promises: promises.map((p) => ({ id: null, text: p.text, kpis: p.kpis })),
      videoUrl,
    };
  }
  return parsed;
};

// ─────────────────────────────────
//  DELETE API helper
// ─────────────────────────────────
const deleteExtraFieldFromApi = async (id: number): Promise<void> => {
  const res = await fetch(`https://${BASE_URL}/extra_fields/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const rawText = await res.text();
    throw new Error(
      `Delete API error ${res.status}: ${rawText || res.statusText}`
    );
  }
};

// ─────────────────────────────────
//  Purpose API helpers
// ─────────────────────────────────
const parsePurposeRecord = (
  json: any
): { purposeText: string; videoUrl: string; recordId: number | null } => {
  if (json?.grouped_data?.business_plan_purpose) {
    const group = json.grouped_data.business_plan_purpose;
    const rows: any[] = Array.isArray(json.data) ? json.data : [];
    return {
      purposeText: (group.values ?? [])[0] ?? "",
      videoUrl: group.video_url ?? "",
      recordId: rows[0]?.id ?? null,
    };
  }
  if (json?.extra_field) {
    const record = json.extra_field;
    return {
      purposeText: (record.values ?? [])[0] ?? "",
      videoUrl: record.video_url ?? "",
      recordId: null,
    };
  }
  return { purposeText: "", videoUrl: "", recordId: null };
};

const fetchPurposeFromApi = async (): Promise<{
  purposeText: string;
  videoUrl: string;
  recordId: number | null;
}> => {
  const url = `https://${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_purpose&include_grouped=true`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  return parsePurposeRecord(json);
};

const savePurposeToApi = async (
  text: string,
  videoUrl: string,
  recordId: number | null
): Promise<{
  purposeText: string;
  videoUrl: string;
  recordId: number | null;
}> => {
  const payload = {
    extra_field: {
      ...(recordId ? { id: recordId } : {}),
      group_name: "business_plan_purpose",
      values: text ? [text] : [],
      video_url: videoUrl,
    },
  };
  const res = await fetch(`https://${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const rawText = await res.text();
  if (!res.ok)
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  return parsePurposeRecord(json);
};

// ─────────────────────────────────
//  Core Values API helpers
// ─────────────────────────────────
interface CoreValueRecord {
  id: number | null;
  value: string;
}

const parseCoreValuesRecord = (
  json: any
): { values: CoreValueRecord[]; videoUrl: string } => {
  if (json?.grouped_data?.business_plan_core_values) {
    const group = json.grouped_data.business_plan_core_values;
    const vals: string[] = group.values ?? [];
    const rows: any[] = Array.isArray(json.data) ? json.data : [];
    return {
      values: vals.map((v: string, idx: number) => ({
        id: rows[idx]?.id ?? null,
        value: v,
      })),
      videoUrl: group.video_url ?? "",
    };
  }
  if (json?.extra_field) {
    const record = json.extra_field;
    const vals: string[] = record.values ?? [];
    return {
      values: vals.map((v: string) => ({ id: null, value: v })),
      videoUrl: record.video_url ?? "",
    };
  }
  return { values: [], videoUrl: "" };
};

const fetchCoreValuesFromApi = async (): Promise<{
  values: CoreValueRecord[];
  videoUrl: string;
}> => {
  const url = `https://${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_core_values&include_grouped=true`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  return parseCoreValuesRecord(json);
};

const saveCoreValuesToApi = async (
  values: string[],
  videoUrl: string
): Promise<{ values: CoreValueRecord[]; videoUrl: string }> => {
  const payload = {
    extra_field: {
      group_name: "business_plan_core_values",
      values,
      video_url: videoUrl,
    },
  };
  const res = await fetch(`https://${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const rawText = await res.text();
  if (!res.ok)
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  return parseCoreValuesRecord(json);
};

// ─────────────────────────────────
//  Icons
// ─────────────────────────────────
const InfoIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    style={{ color: C.primary }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const GripIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9h2v2H8V9zm0 4h2v2H8v-2zm6-4h2v2h-2V9zm0 4h2v2h-2v-2z"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);
const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
    style={{ color: C.textMuted }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
const ImagePlaceholder = () => (
  <svg
    className="w-12 h-12 mx-auto mb-2"
    style={{ color: C.primary, opacity: 0.4 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const VideoPlaceholder = () => (
  <svg
    className="w-12 h-12 mx-auto mb-2"
    style={{ color: C.primary, opacity: 0.4 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// ─────────────────────────────────
//  Shared Buttons
// ─────────────────────────────────
const BtnPrimary = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all duration-150 active:scale-[0.97] ${className}`}
    style={{ background: C.primary, fontFamily: C.font }}
    onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHov)}
    onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
  >
    {children}
  </button>
);

const BtnOutline = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition-all duration-150 active:scale-[0.97] border ${className}`}
    style={{ borderColor: C.primaryBord, color: C.primary, fontFamily: C.font }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.primaryBg;
      e.currentTarget.style.borderColor = C.primaryBordStrong;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.borderColor = C.primaryBord;
    }}
  >
    {children}
  </button>
);

const BtnIcon = ({ children, onClick, title = "" }: any) => (
  <button
    onClick={onClick}
    title={title}
    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-sm transition-all duration-150 active:scale-[0.95] border"
    style={{ borderColor: C.primaryBord, color: "#9ca3af" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.primaryBg;
      e.currentTarget.style.color = C.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = "#9ca3af";
    }}
  >
    {children}
  </button>
);

// ─────────────────────────────────
//  Theme Styles
// ─────────────────────────────────
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    .bp-wrap * { font-family: 'Poppins', sans-serif !important; }

    .bp-modal-portal {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.40);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    .bp-modal-box {
      background: #f6f4ee;
      border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.20);
      box-shadow: 0 30px 80px rgba(0,0,0,0.20);
      width: 100%; max-width: 540px;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
    }
    .bp-input {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 13px; font-weight: 600;
      color: #1a1a1a;
      background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      outline: none;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .bp-input:focus {
      border-color: #DA7756;
      box-shadow: 0 0 0 3px rgba(218,119,86,0.15);
    }
    .bp-input::placeholder { color: #a3a3a3; font-weight: 500; }
    .bp-select {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 36px 9px 12px;
      font-size: 13px; font-weight: 600;
      color: #1a1a1a;
      background: #fffaf8;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer; outline: none; box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .bp-select:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-select:disabled { opacity: 0.6; cursor: not-allowed; }
    .bp-scroll::-webkit-scrollbar { width: 6px; }
    .bp-scroll::-webkit-scrollbar-track { background: transparent; }
    .bp-scroll::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .bp-scroll::-webkit-scrollbar-thumb:hover { background: #DA7756; }
    .bp-error-banner {
      background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;
      border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 600;
    }

    /* ── Card hover lift matching Dashboard ── */
    .bp-card-lift {
      transition: box-shadow .2s, transform .2s;
    }
    .bp-card-lift:hover {
      box-shadow: 0 8px 32px rgba(218,119,86,0.12);
      transform: translateY(-1px);
    }

    /* ── Tab active pill ── */
    .bp-tab-active {
      background: #fff !important;
      color: #DA7756 !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
    }
    .bp-tab-inactive {
      background: transparent !important;
      color: rgba(255,255,255,0.80) !important;
    }
    .bp-tab-inactive:hover {
      background: rgba(255,255,255,0.12) !important;
      color: #fff !important;
    }
  `}</style>
);

// ─────────────────────────────────
//  Portal Modal
// ─────────────────────────────────
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return ReactDOM.createPortal(
    <div
      className="bp-modal-portal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ─────────────────────────────────
//  Types
// ─────────────────────────────────
interface BrandPromise {
  id: number | null;
  text: string;
  kpis: string[];
}
interface KPI {
  id: number;
  name: string;
}

// ─────────────────────────────────
//  CoreValuesInlineCard
// ─────────────────────────────────
const CV_STATIC_DESC = [
  {
    letter: "I",
    label: "Innovation",
    desc: "We embrace innovative solutions to redefine real estate.",
  },
  {
    letter: "N",
    label: "Nurturing",
    desc: "We foster a supportive environment for growth.",
  },
  {
    letter: "A",
    label: "Agility",
    desc: "We adapt swiftly to industry changes.",
  },
  {
    letter: "R",
    label: "Resilience",
    desc: "We persist through challenges and setbacks.",
  },
  {
    letter: "E",
    label: "Empowerment",
    desc: "We empower our teams to take initiative and lead.",
  },
];
const CV_FULL_TEXT = CV_STATIC_DESC.map(
  (d) => `${d.letter} - ${d.label}: ${d.desc}`
).join(" ");
const TRUNCATED =
  CV_FULL_TEXT.length > 80
    ? CV_FULL_TEXT.slice(0, 80).trimEnd() + "..."
    : CV_FULL_TEXT;

const CoreValuesInlineCard: React.FC<{ values: CoreValueRecord[] }> = ({
  values,
}) => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    });
    setHovered(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {values.map((v, idx) => (
          <span
            key={v.id ?? idx}
            className="px-4 py-1.5 text-[11px] font-black rounded-full shadow-sm text-white tracking-tight"
            style={{ background: C.primary }}
          >
            {v.value}
          </span>
        ))}
      </div>
      <div
        ref={wrapRef}
        className="cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
      >
        <p
          className="text-[12px] leading-relaxed select-none"
          style={{ color: C.textMuted }}
        >
          {TRUNCATED}{" "}
          <span className="font-bold" style={{ color: C.primary }}>
            Read more
          </span>
        </p>
        {hovered &&
          ReactDOM.createPortal(
            <div
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                zIndex: 99999,
                background: "#fffaf8",
                border: "1px solid rgba(218,119,86,0.20)",
                borderRadius: 16,
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                padding: "16px 18px",
                width: 340,
                fontSize: 13,
                lineHeight: 1.6,
                color: C.textMuted,
                pointerEvents: "none",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {CV_STATIC_DESC.map((d) => (
                <p key={d.letter} style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: C.primary, fontWeight: 800 }}>
                    {d.letter}
                  </strong>
                  {" - "}
                  {d.label}: {d.desc}
                </p>
              ))}
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

// ─────────────────────────────────
//  Video Preview Helper
// ─────────────────────────────────
const extractYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoPreview = ({ url }: { url: string }) => {
  if (!url) return null;
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-[12px] text-blue-500 underline mt-3 block break-all"
      >
        {url}
      </a>
    );
  }
  return (
    <div className="mb-4 relative w-full">
      <div
        className="rounded-xl overflow-hidden shadow-sm border w-full relative"
        style={{ paddingTop: "56.25%", borderColor: C.borderLgt }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title="Video Preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// ==========================================
//  MAIN COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState("strategic");
  const [showAddContent, setShowAddContent] = useState(false);
  const [addContentTab, setAddContentTab] = useState("images");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [activeTopModal, setActiveTopModal] = useState<string | null>(null);

  // KPIs
  const [availableKpis, setAvailableKpis] = useState<KPI[]>([]);
  const [isFetchingKpis, setIsFetchingKpis] = useState(false);

  // Purpose
  const [purposeText, setPurposeText] = useState("");
  const [purposeVideoUrl, setPurposeVideoUrl] = useState("");
  const [purposeRecordId, setPurposeRecordId] = useState<number | null>(null);
  const [isFetchingPurpose, setIsFetchingPurpose] = useState(true);
  const [purposeFetchError, setPurposeFetchError] = useState<string | null>(
    null
  );
  const [isSavingPurpose, setIsSavingPurpose] = useState(false);
  const [purposeSaveError, setPurposeSaveError] = useState<string | null>(null);
  const [tempPurposeText, setTempPurposeText] = useState("");
  const [tempPurposeVideoUrl, setTempPurposeVideoUrl] = useState("");

  // Core Values
  const [coreValues, setCoreValues] = useState<CoreValueRecord[]>([]);
  const [coreVideoUrl, setCoreVideoUrl] = useState("");
  const [isFetchingCore, setIsFetchingCore] = useState(true);
  const [coreFetchError, setCoreFetchError] = useState<string | null>(null);
  const [isSavingCore, setIsSavingCore] = useState(false);
  const [coreSaveError, setCoreSaveError] = useState<string | null>(null);
  const [tempCoreValues, setTempCoreValues] = useState<CoreValueRecord[]>([]);
  const [tempCoreVideoUrl, setTempCoreVideoUrl] = useState("");

  // Brand Promises
  const [brandPromises, setBrandPromises] = useState<BrandPromise[]>([]);
  const [brandVideoUrl, setBrandVideoUrl] = useState("");
  const [isFetchingBrand, setIsFetchingBrand] = useState(true);
  const [brandFetchError, setBrandFetchError] = useState<string | null>(null);
  const [tempBrandPromises, setTempBrandPromises] = useState<BrandPromise[]>(
    []
  );
  const [tempBrandVideoUrl, setTempBrandVideoUrl] = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [brandSaveError, setBrandSaveError] = useState<string | null>(null);

  // Delete Trackers
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [pendingCoreDeleteIds, setPendingCoreDeleteIds] = useState<number[]>(
    []
  );

  // ── Fetches ──
  const loadBrandPromises = useCallback(async () => {
    setIsFetchingBrand(true);
    setBrandFetchError(null);
    try {
      const { promises, videoUrl } = await fetchBrandPromisesFromApi();
      setBrandPromises(promises);
      setBrandVideoUrl(videoUrl);
    } catch (err: any) {
      setBrandFetchError(err.message || "Failed to load brand promises.");
    } finally {
      setIsFetchingBrand(false);
    }
  }, []);

  const loadPurpose = useCallback(async () => {
    setIsFetchingPurpose(true);
    setPurposeFetchError(null);
    try {
      const {
        purposeText: text,
        videoUrl,
        recordId,
      } = await fetchPurposeFromApi();
      setPurposeText(text);
      setPurposeVideoUrl(videoUrl);
      setPurposeRecordId(recordId);
    } catch (err: any) {
      setPurposeFetchError(err.message || "Failed to load purpose.");
    } finally {
      setIsFetchingPurpose(false);
    }
  }, []);

  const loadCoreValues = useCallback(async () => {
    setIsFetchingCore(true);
    setCoreFetchError(null);
    try {
      const { values, videoUrl } = await fetchCoreValuesFromApi();
      setCoreValues(values);
      setCoreVideoUrl(videoUrl);
    } catch (err: any) {
      setCoreFetchError(err.message || "Failed to load core values.");
    } finally {
      setIsFetchingCore(false);
    }
  }, []);

  const loadKpis = useCallback(async () => {
    setIsFetchingKpis(true);
    try {
      const url = `https://${BASE_URL}/kpis`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch KPIs");
      const json = await res.json();

      let list: any[] = [];
      if (json?.data?.kpis && Array.isArray(json.data.kpis)) {
        list = json.data.kpis;
      } else if (Array.isArray(json?.data)) {
        list = json.data;
      } else if (Array.isArray(json)) {
        list = json;
      }

      // Format correctly for our dropdown
      const formatted = list
        .filter((item) => item?.id && (item?.name || item?.title))
        .map((item) => ({
          id: item.id,
          name: item.name || item.title || "Unnamed KPI",
        }));

      setAvailableKpis(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingKpis(false);
    }
  }, []);

  useEffect(() => {
    loadBrandPromises();
    loadPurpose();
    loadCoreValues();
    loadKpis();
  }, [loadBrandPromises, loadPurpose, loadCoreValues, loadKpis]);

  // ── Modal openers ──
  const openTopModal = (modalName: string) => {
    if (modalName === "purpose") {
      setTempPurposeText(purposeText);
      setTempPurposeVideoUrl(purposeVideoUrl);
      setPurposeSaveError(null);
    } else if (modalName === "core") {
      setTempCoreValues(coreValues.map((v) => ({ ...v })));
      setTempCoreVideoUrl(coreVideoUrl);
      setCoreSaveError(null);
      setPendingCoreDeleteIds([]);
    } else if (modalName === "brand") {
      setTempBrandPromises(
        brandPromises.map((p) => ({ ...p, kpis: [...p.kpis] }))
      );
      setTempBrandVideoUrl(brandVideoUrl);
      setBrandSaveError(null);
      setPendingDeleteIds([]);
    }
    setActiveTopModal(modalName);
  };

  // ── Save handlers ──
  const saveTopPurpose = async () => {
    setIsSavingPurpose(true);
    setPurposeSaveError(null);
    try {
      const trimmedText = tempPurposeText.trim();
      const trimmedVideo = tempPurposeVideoUrl.trim();

      if (!trimmedText && !trimmedVideo && purposeRecordId) {
        await deleteExtraFieldFromApi(purposeRecordId);
        setPurposeText("");
        setPurposeVideoUrl("");
        setPurposeRecordId(null);
        setActiveTopModal(null);
      } else {
        const resObj = await savePurposeToApi(
          trimmedText,
          trimmedVideo,
          purposeRecordId
        );
        setPurposeText(resObj.purposeText);
        setPurposeVideoUrl(resObj.videoUrl);
        setPurposeRecordId(resObj.recordId);
        setActiveTopModal(null);
        // Note: Intentional removal of fetchPurposeFromApi() to prevent backend lag wiping UI
      }
    } catch (err: any) {
      setPurposeSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingPurpose(false);
    }
  };

  const saveCoreValues = async () => {
    const filtered = tempCoreValues.filter((v) => v.value.trim() !== "");
    setIsSavingCore(true);
    setCoreSaveError(null);
    try {
      for (const id of pendingCoreDeleteIds) {
        try {
          await deleteExtraFieldFromApi(id);
        } catch (e) {
          console.error(e);
        }
      }
      setPendingCoreDeleteIds([]);

      if (filtered.length > 0 || tempCoreVideoUrl.trim() !== "") {
        const resObj = await saveCoreValuesToApi(
          filtered.map((v) => v.value),
          tempCoreVideoUrl
        );
        // Merge the newly created IDs back into our state without wiping the values
        const merged = filtered.map((v, i) => ({
          ...v,
          id: resObj.values[i]?.id ?? v.id,
        }));
        setCoreValues(merged);
        setCoreVideoUrl(tempCoreVideoUrl);
      } else {
        setCoreValues([]);
        setCoreVideoUrl(tempCoreVideoUrl);
      }

      setActiveTopModal(null);
      // Note: Intentional removal of fetchCoreValuesFromApi() to prevent backend lag wiping UI
    } catch (err: any) {
      setCoreSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingCore(false);
    }
  };

  const saveBrandPromises = async () => {
    const filtered = tempBrandPromises.filter((p) => p.text.trim() !== "");
    setIsSavingBrand(true);
    setBrandSaveError(null);
    try {
      for (const id of pendingDeleteIds) {
        try {
          await deleteExtraFieldFromApi(id);
        } catch (e) {
          console.error(e);
        }
      }
      setPendingDeleteIds([]);

      if (filtered.length > 0 || tempBrandVideoUrl.trim() !== "") {
        const resObj = await saveBrandPromisesToApi(
          filtered,
          tempBrandVideoUrl
        );
        // Merge the newly created IDs back into our state without wiping the KPIs!
        const merged = filtered.map((p, i) => ({
          ...p,
          id: resObj.promises[i]?.id ?? p.id,
        }));
        setBrandPromises(merged);
        setBrandVideoUrl(tempBrandVideoUrl);
      } else {
        setBrandPromises([]);
        setBrandVideoUrl(tempBrandVideoUrl);
      }

      setActiveTopModal(null);
      // Note: Intentional removal of fetchBrandPromisesFromApi() to prevent backend lag wiping UI
    } catch (err: any) {
      setBrandSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingBrand(false);
    }
  };

  // ── Brand promise handlers ──
  const handleBrandPromiseChange = (index: number, value: string) => {
    const updated = [...tempBrandPromises];
    updated[index] = { ...updated[index], text: value };
    setTempBrandPromises(updated);
  };
  const handleDeleteBrandPromise = (index: number) => {
    const promise = tempBrandPromises[index];
    if (promise.id !== null)
      setPendingDeleteIds((prev) => [...prev, promise.id as number]);
    setTempBrandPromises(tempBrandPromises.filter((_, i) => i !== index));
  };
  const handleAddBrandPromise = () =>
    setTempBrandPromises([
      ...tempBrandPromises,
      { id: null, text: "", kpis: [] },
    ]);
  const handleAddKpiToBrandPromise = (promiseIndex: number, kpi: string) => {
    if (!kpi) return;
    const updated = [...tempBrandPromises];
    const current = updated[promiseIndex].kpis;
    if (current.length >= 3 || current.includes(kpi)) return;
    updated[promiseIndex] = {
      ...updated[promiseIndex],
      kpis: [...current, kpi],
    };
    setTempBrandPromises(updated);
  };
  const handleRemoveKpiFromBrandPromise = (
    promiseIndex: number,
    kpi: string
  ) => {
    const updated = [...tempBrandPromises];
    updated[promiseIndex] = {
      ...updated[promiseIndex],
      kpis: updated[promiseIndex].kpis.filter((k) => k !== kpi),
    };
    setTempBrandPromises(updated);
  };

  // ── Core value handlers ──
  const handleCoreValueChange = (index: number, value: string) => {
    const updated = [...tempCoreValues];
    updated[index] = { ...updated[index], value };
    setTempCoreValues(updated);
  };
  const handleDeleteCoreValue = (index: number) => {
    const item = tempCoreValues[index];
    if (item.id !== null)
      setPendingCoreDeleteIds((prev) => [...prev, item.id as number]);
    setTempCoreValues(tempCoreValues.filter((_, i) => i !== index));
  };
  const handleAddCoreValue = () =>
    setTempCoreValues([...tempCoreValues, { id: null, value: "" }]);

  const isSavingAny =
    (activeTopModal === "brand" && isSavingBrand) ||
    (activeTopModal === "purpose" && isSavingPurpose) ||
    (activeTopModal === "core" && isSavingCore);

  const tabs = [
    { key: "strategic", label: "Strategic Plan" },
    { key: "goals", label: "Goals" },
  ];

  // ── Skeleton shimmer helper ──
  const Shimmer = ({ w = "100%", h = 16 }: { w?: string; h?: number }) => (
    <div
      className="animate-pulse rounded-xl"
      style={{ width: w, height: h, background: "#e5e1d8" }}
    />
  );

  // ── Empty-add button shared style ──
  const emptyAddBtn = (onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full py-6 rounded-2xl border-2 border-dashed transition-all"
      style={{ borderColor: C.primaryBord, background: C.primaryTint }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.primary;
        e.currentTarget.style.background = C.primaryBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.primaryBord;
        e.currentTarget.style.background = C.primaryTint;
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center mb-2"
        style={{ background: "rgba(218,119,86,0.18)" }}
      >
        <PlusIcon />
      </div>
      <span className="text-[13px] font-black" style={{ color: C.primary }}>
        {label}
      </span>
    </button>
  );

  return (
    <div
      className="bp-wrap min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto space-y-6"
      style={{ background: C.pageBg, color: C.textMain, fontFamily: C.font }}
    >
      <ThemeStyle />

      {/* ── Page Header ── */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: "rgba(218,119,86,0.10)",
          borderColor: C.primaryBord,
        }}
      >
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1"
            style={{ color: C.textMuted }}
          >
            Strategic overview and goals alignment
          </p>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#111" }}
          >
            Business Plan
          </h1>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: C.textMuted }}
          >
            HAVEN INFOLINE PRIVATE LIMITED
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <BtnOutline>Copy Plan</BtnOutline>
          <BtnPrimary>✨ Create with AI</BtnPrimary>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div
        className="flex w-fit rounded-2xl p-1 gap-1 overflow-x-auto"
        style={{ background: C.primary }}
      >
        {tabs.map((tab) => {
          const isActive = activeMainTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveMainTab(tab.key)}
              className={`py-2 px-4 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap ${isActive ? "bp-tab-active" : "bp-tab-inactive"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════
          STRATEGIC PLAN VIEW
      ══════════════════════════════════════ */}
      {activeMainTab === "strategic" && (
        <div className="space-y-6">
          {/* ── "Our Business Plan" header row ── */}
          <div
            className="rounded-[8px] p-5 flex items-center justify-between"
            style={{ background: C.tealBg }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/30 p-2 rounded-full">
                <EyeIcon />
              </div>
              <span className="text-[12px] font-black tracking-[0.15em] text-[#070707] uppercase">
                Our Business Plan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BtnIcon title="Info">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </BtnIcon>
              <BtnIcon onClick={() => setShowAddContent(!showAddContent)}>
                <ChevronIcon isExpanded={showAddContent} />
              </BtnIcon>
            </div>
          </div>

          {/* ── Add Content Dropdown ── */}
          {showAddContent && (
            <div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: C.primaryBordStrong, background: C.cardBg }}
            >
              <div
                className="flex border-b"
                style={{ borderColor: C.primaryBord }}
              >
                {["images", "video"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setAddContentTab(t)}
                    className="flex-1 py-3 text-[13px] font-black transition-colors capitalize"
                    style={{
                      background:
                        addContentTab === t ? C.primary : "transparent",
                      color: addContentTab === t ? "#fff" : C.textMuted,
                    }}
                  >
                    {t === "images" ? "Images" : "Explainer Video"}
                  </button>
                ))}
              </div>

              <div className="p-10 flex flex-col items-center text-center">
                {addContentTab === "images" &&
                  (!showImageInput ? (
                    <div className="flex flex-col items-center">
                      <ImagePlaceholder />
                      <p
                        className="text-[13px] font-black mb-5"
                        style={{ color: C.textMuted }}
                      >
                        No images added yet
                      </p>
                      <BtnPrimary onClick={() => setShowImageInput(true)}>
                        Add Images
                      </BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto text-left">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="font-black text-[15px]"
                          style={{ color: C.textMain }}
                        >
                          Add Images
                        </span>
                        <button
                          onClick={() => setShowImageInput(false)}
                          className="text-gray-400 hover:text-gray-700 font-black text-lg transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Paste image URL or Google Drive link..."
                          className="bp-input flex-1"
                        />
                        <button
                          className="px-4 py-2 rounded-xl text-[13px] font-black border transition-all active:scale-[0.97]"
                          style={{
                            background: C.primaryTint,
                            color: C.primaryHov,
                            borderColor: C.primaryBord,
                          }}
                        >
                          + Add
                        </button>
                        <button
                          className="px-4 py-2 rounded-xl text-[13px] font-black text-white shadow-sm transition-all active:scale-[0.97]"
                          style={{ background: C.primary }}
                        >
                          ↑ Upload
                        </button>
                      </div>
                      <p
                        className="text-[11px] mb-5 font-semibold"
                        style={{ color: C.textMuted }}
                      >
                        0/12 images • Max 1 MB per image.{" "}
                        <a
                          href="#"
                          style={{ color: C.primary }}
                          className="hover:underline"
                        >
                          Compress images here
                        </a>
                      </p>
                      <p
                        className="text-[11px] mb-2 font-black"
                        style={{ color: C.textMuted }}
                      >
                        Generate with AI:
                      </p>
                      <div className="flex gap-3">
                        <button
                          className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm"
                          style={{ borderColor: C.borderLgt }}
                        >
                          ✨ Create Image (overview)
                        </button>
                        <button
                          className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm"
                          style={{ borderColor: C.borderLgt }}
                        >
                          ✨ Create Image (detailed)
                        </button>
                      </div>
                    </div>
                  ))}
                {addContentTab === "video" &&
                  (!showVideoInput ? (
                    <div className="flex flex-col items-center">
                      <VideoPlaceholder />
                      <p
                        className="text-[13px] font-black mb-5"
                        style={{ color: C.textMuted }}
                      >
                        No explainer videos added yet
                      </p>
                      <BtnPrimary onClick={() => setShowVideoInput(true)}>
                        Add Videos
                      </BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto text-left">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="font-black text-[15px]"
                          style={{ color: C.textMain }}
                        >
                          Add Videos
                        </span>
                        <button
                          onClick={() => setShowVideoInput(false)}
                          className="text-gray-400 hover:text-gray-700 font-black text-lg transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Paste YouTube, Vimeo, or direct video URL..."
                          className="bp-input flex-1"
                        />
                        <button
                          className="px-4 py-2 rounded-xl text-[13px] font-black border transition-all active:scale-[0.97]"
                          style={{
                            background: C.primaryTint,
                            color: C.primaryHov,
                            borderColor: C.primaryBord,
                          }}
                        >
                          + Add
                        </button>
                      </div>
                      <p
                        className="text-[11px] font-black mb-5"
                        style={{ color: C.textMuted }}
                      >
                        0/12 videos added
                      </p>
                      <p
                        className="text-[11px] mb-2 font-black"
                        style={{ color: C.textMuted }}
                      >
                        Generate with AI:
                      </p>
                      <button
                        className="w-full py-2.5 bg-white border rounded-xl flex items-center justify-center text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm"
                        style={{ borderColor: C.borderLgt }}
                      >
                        📄 Create Video Script
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── 3 Cards — Core Values / Purpose / Brand Promises ── */}
          <div className="rounded-[8px] p-6" style={{ background: C.tealBg }}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black mb-5">
              Strategic Essentials
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Core Values */}
              <div
                className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col"
                style={{
                  background: C.cardBg,
                  borderTop: `4px solid ${C.primary}`,
                  borderColor: C.borderLgt,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="font-black text-[14px] flex items-center gap-1.5"
                    style={{ color: C.textMain }}
                  >
                    Core Values <InfoIcon />
                  </h3>
                  <button
                    onClick={() => openTopModal("core")}
                    className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9ca3af")
                    }
                  >
                    <EditIcon />
                  </button>
                </div>
                {isFetchingCore ? (
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <Shimmer key={n} w="80px" h={28} />
                    ))}
                  </div>
                ) : coreFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">
                    ⚠ {coreFetchError}{" "}
                    <button onClick={loadCoreValues} className="underline">
                      Retry
                    </button>
                  </div>
                ) : coreValues.length === 0 && !coreVideoUrl ? (
                  <div className="flex flex-col gap-3">
                    {emptyAddBtn(() => openTopModal("core"), "Add Core Values")}
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: C.textMuted }}
                    >
                      {TRUNCATED}{" "}
                      <span className="font-bold" style={{ color: C.primary }}>
                        Read more
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {coreVideoUrl && <VideoPreview url={coreVideoUrl} />}
                    {coreValues.length === 0 ? (
                      <div>
                        {emptyAddBtn(
                          () => openTopModal("core"),
                          "Add Core Values"
                        )}
                      </div>
                    ) : (
                      <div>
                        <CoreValuesInlineCard values={coreValues} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Purpose */}
              <div
                className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col"
                style={{
                  background: C.cardBg,
                  borderTop: `4px solid ${C.primary}`,
                  borderColor: C.borderLgt,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="font-black text-[14px] flex items-center gap-1.5"
                    style={{ color: C.textMain }}
                  >
                    Purpose <InfoIcon />
                  </h3>
                  <button
                    onClick={() => openTopModal("purpose")}
                    className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9ca3af")
                    }
                  >
                    <EditIcon />
                  </button>
                </div>
                {isFetchingPurpose ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                      <Shimmer key={n} w={n === 3 ? "50%" : "95%"} h={12} />
                    ))}
                  </div>
                ) : purposeFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">
                    ⚠ {purposeFetchError}{" "}
                    <button onClick={loadPurpose} className="underline">
                      Retry
                    </button>
                  </div>
                ) : !purposeText && !purposeVideoUrl ? (
                  emptyAddBtn(() => openTopModal("purpose"), "Add Purpose")
                ) : (
                  <div className="flex flex-col h-full">
                    {purposeVideoUrl && <VideoPreview url={purposeVideoUrl} />}
                    {purposeText ? (
                      <p
                        className="text-[13px] font-black leading-relaxed"
                        style={{ color: C.primary }}
                      >
                        {purposeText}
                      </p>
                    ) : (
                      <div>
                        {emptyAddBtn(
                          () => openTopModal("purpose"),
                          "Add Purpose"
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Brand Promises */}
              <div
                className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col"
                style={{
                  background: C.cardBg,
                  borderTop: `4px solid ${C.primary}`,
                  borderColor: C.borderLgt,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="font-black text-[14px] flex items-center gap-1.5"
                    style={{ color: C.textMain }}
                  >
                    Brand Promises <InfoIcon />
                  </h3>
                  <button
                    onClick={() => openTopModal("brand")}
                    className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                    style={{ color: "#9ca3af" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.primary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9ca3af")
                    }
                  >
                    <EditIcon />
                  </button>
                </div>
                {isFetchingBrand ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                      <Shimmer key={n} w={n === 3 ? "60%" : "90%"} h={14} />
                    ))}
                  </div>
                ) : brandFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">
                    ⚠ {brandFetchError}{" "}
                    <button onClick={loadBrandPromises} className="underline">
                      Retry
                    </button>
                  </div>
                ) : brandPromises.length === 0 && !brandVideoUrl ? (
                  emptyAddBtn(() => openTopModal("brand"), "Add Promise")
                ) : (
                  <div className="flex flex-col h-full">
                    {brandVideoUrl && <VideoPreview url={brandVideoUrl} />}
                    {brandPromises.length === 0 ? (
                      <div>
                        {emptyAddBtn(
                          () => openTopModal("brand"),
                          "Add Promise"
                        )}
                      </div>
                    ) : (
                      <ul
                        className="space-y-3 text-[12px]"
                        style={{ color: C.textMuted }}
                      >
                        {brandPromises.map((p, idx) => (
                          <li key={p.id ?? idx} className="flex items-start">
                            <span
                              className="mr-2 mt-0.5 shrink-0 font-black"
                              style={{ color: C.primary }}
                            >
                              •
                            </span>
                            <div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: p.text.replace(
                                    /([^-]+)/,
                                    `<strong style="color:${C.textMain};font-weight:800;">$1</strong>`
                                  ),
                                }}
                              />
                              {p.kpis.length > 0 ? (
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {p.kpis.join(", ")}
                                </p>
                              ) : (
                                <p className="text-[11px] text-gray-400 italic mt-0.5">
                                  No KPIs linked
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-sections */}
          <BhagSection />
          <MediumTermSection />
          <ShortTermSection />
          <QuarterlySection />
          <CriticalNumbers />
          <KeyProcessesSection />
          <SWOTAnalysis />
        </div>
      )}

      {activeMainTab === "goals" && <GoalsView />}

      {/* ══════════════════════════════════════
          MODALS
      ══════════════════════════════════════ */}
      {activeTopModal && (
        <Modal onClose={() => setActiveTopModal(null)}>
          <div className="bp-modal-box">
            {/* Modal Header */}
            <div
              className="flex justify-between items-center px-6 py-5 border-b"
              style={{ background: C.cardBg, borderColor: C.primaryBord }}
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.primary,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <h2
                  className="font-black text-[17px] m-0"
                  style={{ color: C.textMain }}
                >
                  Edit{" "}
                  {activeTopModal === "core"
                    ? "Core Values"
                    : activeTopModal === "purpose"
                      ? "Purpose"
                      : "Brand Promises"}
                </h2>
              </div>
              <BtnIcon onClick={() => setActiveTopModal(null)}>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </BtnIcon>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto bp-scroll">
              {/* ── Purpose ── */}
              {activeTopModal === "purpose" && (
                <div className="space-y-5">
                  {purposeSaveError && (
                    <div className="bp-error-banner">{purposeSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-black mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Explanation / Text{" "}
                      <span style={{ color: C.primary }}>*</span>
                    </label>
                    <textarea
                      value={tempPurposeText}
                      onChange={(e) => setTempPurposeText(e.target.value)}
                      className="bp-input resize-y"
                      style={{ minHeight: 140 }}
                      placeholder="Describe your company purpose..."
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[12px] font-black mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempPurposeVideoUrl}
                      onChange={(e) => setTempPurposeVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                    <p
                      className="text-[11px] mt-1.5 font-semibold"
                      style={{ color: C.textMuted }}
                    >
                      Supports YouTube, Vimeo, and direct video files (.mp4,
                      etc.)
                    </p>
                  </div>
                </div>
              )}

              {/* ── Core Values ── */}
              {activeTopModal === "core" && (
                <div className="space-y-5">
                  {coreSaveError && (
                    <div className="bp-error-banner">{coreSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-black mb-3"
                      style={{ color: C.textMain }}
                    >
                      Core Values
                    </label>
                    <div className="space-y-2.5 mb-3">
                      {tempCoreValues.map((item, idx) => (
                        <div
                          key={item.id ?? idx}
                          className="flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm"
                          style={{ borderColor: C.borderLgt }}
                        >
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              handleCoreValueChange(idx, e.target.value)
                            }
                            className="flex-1 outline-none text-[13px] font-black bg-transparent"
                            style={{ color: C.textMain }}
                            placeholder="Add core value"
                            autoFocus={
                              idx === tempCoreValues.length - 1 &&
                              item.value === ""
                            }
                          />
                          <button
                            onClick={() => handleDeleteCoreValue(idx)}
                            className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddCoreValue}
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-black rounded-2xl transition-colors border-2 border-dashed mb-5"
                      style={{ borderColor: C.borderLgt, color: C.primary }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.primaryBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>
                  <div>
                    <label
                      className="block text-[12px] font-black mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempCoreVideoUrl}
                      onChange={(e) => setTempCoreVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                  </div>
                </div>
              )}

              {/* ── Brand Promises ── */}
              {activeTopModal === "brand" && (
                <div className="space-y-5">
                  {brandSaveError && (
                    <div className="bp-error-banner">{brandSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-black mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempBrandVideoUrl}
                      onChange={(e) => setTempBrandVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[12px] font-black mb-3"
                      style={{ color: C.textMain }}
                    >
                      Promises
                    </label>
                    <div className="space-y-2.5 mb-3">
                      {tempBrandPromises.map((item, idx) => (
                        <div
                          key={item.id ?? idx}
                          className="flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm"
                          style={{ borderColor: C.borderLgt }}
                        >
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) =>
                              handleBrandPromiseChange(idx, e.target.value)
                            }
                            className="flex-1 outline-none text-[13px] font-black bg-transparent"
                            style={{ color: C.textMain }}
                            placeholder="Add promise"
                            autoFocus={
                              idx === tempBrandPromises.length - 1 &&
                              item.text === ""
                            }
                          />
                          <button
                            onClick={() => handleDeleteBrandPromise(idx)}
                            className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddBrandPromise}
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-black rounded-2xl transition-colors border-2 border-dashed mb-5"
                      style={{ borderColor: C.borderLgt, color: C.primary }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.primaryBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>

                  {/* KPI Linking */}
                  <div>
                    <label
                      className="block text-[12px] font-black mb-3"
                      style={{ color: C.textMain }}
                    >
                      Link KPIs to Promises{" "}
                      <span className="font-semibold text-gray-400">
                        (Max 3 per promise)
                      </span>
                    </label>
                    <div className="max-h-[280px] overflow-y-auto bp-scroll space-y-3 pr-1">
                      {tempBrandPromises
                        .filter((p) => p.text.trim() !== "")
                        .map((item, idx) => (
                          <div
                            key={item.id ?? idx}
                            className="border p-4 rounded-2xl bg-white shadow-sm"
                            style={{ borderColor: C.borderLgt }}
                          >
                            <div
                              className="text-[13px] font-black mb-3 leading-snug"
                              style={{ color: C.textMain }}
                            >
                              {item.text}
                            </div>
                            {item.kpis.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {item.kpis.map((kpi) => (
                                  <span
                                    key={kpi}
                                    className="flex items-center gap-1 px-3 py-1 text-[11px] font-black rounded-full text-white"
                                    style={{ background: C.primary }}
                                  >
                                    {kpi}
                                    <button
                                      onClick={() =>
                                        handleRemoveKpiFromBrandPromise(
                                          idx,
                                          kpi
                                        )
                                      }
                                      className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.kpis.length < 3 ? (
                              <select
                                className="bp-select text-gray-500"
                                value=""
                                onChange={(e) =>
                                  handleAddKpiToBrandPromise(
                                    idx,
                                    e.target.value
                                  )
                                }
                                disabled={isFetchingKpis}
                              >
                                <option value="">
                                  {isFetchingKpis
                                    ? "Loading KPIs..."
                                    : "Link a KPI..."}
                                </option>
                                {availableKpis.map((kpi) => (
                                  <option key={kpi.id} value={kpi.name}>
                                    {kpi.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div
                                className="text-[11px] italic font-semibold mt-1"
                                style={{ color: C.textMuted }}
                              >
                                Max 3 KPIs reached.
                              </div>
                            )}
                          </div>
                        ))}
                      {tempBrandPromises.filter((p) => p.text.trim() !== "")
                        .length === 0 && (
                        <p className="text-[13px] text-gray-400 italic">
                          Add promises above to link KPIs.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="p-5 flex justify-end gap-3 border-t"
              style={{ background: C.cardBg, borderColor: C.primaryBord }}
            >
              <BtnOutline onClick={() => setActiveTopModal(null)}>
                Cancel
              </BtnOutline>
              <button
                disabled={isSavingAny}
                onClick={() => {
                  if (activeTopModal === "purpose") saveTopPurpose();
                  else if (activeTopModal === "core") saveCoreValues();
                  else if (activeTopModal === "brand") saveBrandPromises();
                  else setActiveTopModal(null);
                }}
                className="px-6 py-2 text-[13px] font-black text-white rounded-xl transition-colors shadow-sm active:scale-[0.97] flex items-center gap-2 disabled:opacity-60"
                style={{ background: "#1a1a1a", fontFamily: C.font }}
                onMouseEnter={(e) => {
                  if (!isSavingAny) e.currentTarget.style.background = "#000";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1a1a1a")
                }
              >
                {isSavingAny && <LoaderIcon />}
                {isSavingAny ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BusinessPlanAndGoles;
