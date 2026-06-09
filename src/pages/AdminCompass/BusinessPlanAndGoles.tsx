import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { toast as sonnerToast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import GoalsPage from "./AdminCompassComponent/goalsPage";

// ── Design Tokens ──
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
const getBaseUrl = () => {
  const raw = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

const BASE_URL = getBaseUrl();
const AI_CRITICAL_NUMBERS_STORAGE_KEY = "business_plan_ai_critical_numbers";

const getSelectedOrgName = () => {
  const fallbackName = "HAVEN INFOLINE PRIVATE LIMITED";
  const selectedOrg = localStorage.getItem("selectedOrg");

  if (!selectedOrg) return fallbackName;

  try {
    const parsedOrg = JSON.parse(selectedOrg);
    const parsedName =
      parsedOrg?.name ||
      parsedOrg?.company_name ||
      parsedOrg?.organization_name ||
      parsedOrg?.title;

    return typeof parsedName === "string" && parsedName.trim()
      ? parsedName.trim()
      : fallbackName;
  } catch {
    return selectedOrg.trim() || fallbackName;
  }
};

function getCleanAiPlanErrorMessage(message: string): string {
  const cleanMessage = (value: string) =>
    value
      .trim()
      .replace(/\s+See\s+https?:\/\/\S+\.?$/i, "")
      .replace(/\s+You can find your API key at https?:\/\/\S+\.?$/i, "");

  const trimmedMessage = cleanMessage(message);
  const jsonStartIndex = trimmedMessage.indexOf("{");

  if (jsonStartIndex === -1) {
    return trimmedMessage;
  }

  try {
    const parsed = JSON.parse(trimmedMessage.slice(jsonStartIndex)) as {
      error?: { message?: unknown };
    };
    const apiMessage = parsed.error?.message;

    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return cleanMessage(apiMessage);
    }
  } catch {
    // Keep the original message if it is not parseable JSON.
  }

  return trimmedMessage;
}

const toast = sonnerToast;
const showToastError = sonnerToast.error.bind(
  sonnerToast
) as typeof sonnerToast.error;
toast.error = ((
  message: Parameters<typeof sonnerToast.error>[0],
  options?: Parameters<typeof sonnerToast.error>[1]
) =>
  showToastError(
    typeof message === "string" ? getCleanAiPlanErrorMessage(message) : message,
    options
  )) as typeof toast.error;

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
const safeParseJSON = (data: any): Record<string, any> => {
  if (!data) return {};
  let parsed = data;
  while (typeof parsed === "string") {
    try {
      const next = JSON.parse(parsed);
      if (typeof next === "string" && next === parsed) break;
      parsed = next;
    } catch {
      break;
    }
  }
  if (typeof parsed === "object" && !Array.isArray(parsed) && parsed !== null) {
    return parsed;
  }
  return {};
};

// ─────────────────────────────────────────────
//  Brand Promises API helpers
// ─────────────────────────────────────────────
const parseBrandPromisesRecord = (
  json: any
): { promises: BrandPromise[]; videoUrl: string } => {
  const rows: any[] = Array.isArray(json.data)
    ? json.data
    : Array.isArray(json)
      ? json
      : [];
  const record =
    rows.find((r: any) => r.group_name === "business_plan_brand_promises") ??
    rows[0];

  let rawValues: string[] = [];
  let rawVideoUrl = "";
  let rawPromiseKpis: any = null;

  if (json?.grouped_data?.business_plan_brand_promises) {
    const group = json.grouped_data.business_plan_brand_promises;
    rawValues = group.values ?? [];
    rawVideoUrl = group.video_url ?? "";
    rawPromiseKpis = group.promise_kpis ?? record?.promise_kpis;
  } else if (json?.extra_field) {
    const ef = json.extra_field;
    rawValues = ef.values ?? [];
    rawVideoUrl = ef.video_url ?? "";
    rawPromiseKpis = ef.promise_kpis;
  } else if (record) {
    rawValues = record.values ?? (record.value ? [record.value] : []);
    rawVideoUrl = record.video_url ?? "";
    rawPromiseKpis = record.promise_kpis;
  }

  const promiseKpis: Record<string, string[]> = safeParseJSON(rawPromiseKpis);
  const efv: any[] = record?.extra_field_values ?? [];

  const promises: BrandPromise[] = rawValues.map(
    (text: string, idx: number) => ({
      id: rows[idx]?.id ?? efv[idx]?.id ?? null,
      text,
      kpis: promiseKpis[`item_${idx + 1}`] ?? [],
    })
  );

  return { promises, videoUrl: rawVideoUrl };
};

const fetchBrandPromisesFromApi = async (): Promise<{
  promises: BrandPromise[];
  videoUrl: string;
}> => {
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_brand_promises&include_grouped=true`;
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
): Promise<void> => {
  const promiseKpis: Record<string, string[]> = {};
  promises.forEach((p, idx) => {
    if (p.kpis && p.kpis.length > 0) promiseKpis[`item_${idx + 1}`] = p.kpis;
  });
  const payload = {
    extra_field: {
      group_name: "business_plan_brand_promises",
      values: promises.map((p) => p.text),
      video_url: videoUrl,
      promise_kpis: promiseKpis,
    },
  };
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const rawText = await res.text();
  if (!res.ok)
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
};

const deleteExtraFieldFromApi = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/extra_fields/${id}`, {
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
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_purpose&include_grouped=true`;
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
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
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
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_core_values&include_grouped=true`;
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
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
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

// ─────────────────────────────────────────────
//  Overview Media API helpers
// ─────────────────────────────────────────────
interface OverviewMediaItem {
  id: number | null;
  url: string;
}

interface OverviewMedia {
  images: OverviewMediaItem[];
  videos: OverviewMediaItem[];
}

const getGoogleDriveFileId = (url: string): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "lh3.googleusercontent.com") {
      return (
        parsed.pathname.match(/\/d\/([^=/?#]+)/)?.[1] ||
        parsed.pathname.match(/\/d\/(.+)/)?.[1]?.split("=")[0] ||
        null
      );
    }
    if (parsed.hostname !== "drive.google.com") return null;
    return (
      parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
      parsed.searchParams.get("id")
    );
  } catch {
    return null;
  }
};

const getGoogleDriveOpenUrl = (url: string): string | null => {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : null;
};

const normalizeImageUrl = (url: string): string => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const directImageUrl = parsed.searchParams.get("imgurl");
    if (parsed.hostname.includes("google.") && directImageUrl) {
      return directImageUrl;
    }

    if (parsed.hostname === "drive.google.com") {
      const fileId = getGoogleDriveFileId(url);
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
      }
    }
  } catch {
    return url;
  }
  return url;
};

const fetchOverviewMediaFromApi = async (): Promise<OverviewMedia> => {
  const url = `${BASE_URL}/business_compass/overview_media`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = {};
  }
  const parseMediaArray = (
    arr: any[],
    normalizeUrl: (url: string) => string = (url) => url
  ): OverviewMediaItem[] =>
    arr
      .map((item) =>
        typeof item === "string"
          ? { id: null, url: item }
          : { id: item?.id ?? null, url: item?.url ?? item?.field_value ?? "" }
      )
      .map((item) => ({ ...item, url: normalizeUrl(item.url) }))
      .filter((item) => Boolean(item.url));

  const dataRecords = Array.isArray(json?.data) ? json.data : [];
  const overviewRecords = dataRecords.filter(
    (item: any) => item?.group_name === "business_plan_overview"
  );
  const imageRecords = overviewRecords.filter((item: any) =>
    String(item?.field_name || "").toLowerCase().startsWith("image")
  );
  const videoRecords = overviewRecords.filter((item: any) =>
    String(item?.field_name || "").toLowerCase().startsWith("video")
  );
  const mergeParsedMedia = (
    primary: OverviewMediaItem[],
    secondary: OverviewMediaItem[]
  ): OverviewMediaItem[] => {
    const seen = new Set<string>();
    return [...primary, ...secondary].filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  };

  const topLevelImages = Array.isArray(json?.images)
    ? parseMediaArray(json.images, normalizeImageUrl)
    : [];
  const recordImages = parseMediaArray(imageRecords, normalizeImageUrl);
  const topLevelVideos = Array.isArray(json?.videos)
    ? parseMediaArray(json.videos)
    : [];
  const recordVideos = parseMediaArray(videoRecords);
  const hasTopLevelImages = Array.isArray(json?.images);
  const hasTopLevelVideos = Array.isArray(json?.videos);

  return {
    images: hasTopLevelImages
      ? topLevelImages
      : mergeParsedMedia(topLevelImages, recordImages),
    videos: hasTopLevelVideos
      ? topLevelVideos
      : mergeParsedMedia(topLevelVideos, recordVideos),
  };
};

const saveOverviewImagesApi = async (images: string[]): Promise<void> => {
  const payload = {
    extra_field: { group_name: "business_plan_overview", images },
  };
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const rawText = await res.text();
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  }
};

const getUniqueImageUrls = (urls: string[]): string[] => {
  const seen = new Set<string>();
  return urls
    .map((url) => normalizeImageUrl(String(url || "").trim()))
    .filter((url) => {
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
};

const saveOverviewVideosApi = async (videos: string[]): Promise<void> => {
  const payload = {
    extra_field: {
      group_name: "business_plan_overview",
      videos: videos.map((url) => getGoogleDriveOpenUrl(url) || url),
    },
  };
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const rawText = await res.text();
    throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  }
};

// ─────────────────────────────────
//  Icons
// ─────────────────────────────────
const mergeOverviewMediaItems = (
  fetched: OverviewMediaItem[],
  fallbackUrls: string[]
): OverviewMediaItem[] => {
  const merged: OverviewMediaItem[] = [];
  const seen = new Set<string>();

  fetched.forEach((item) => {
    if (!item.url || seen.has(item.url)) return;
    seen.add(item.url);
    merged.push(item);
  });

  fallbackUrls.forEach((url) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    merged.push({ id: null, url });
  });

  return merged;
};

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
const EyeIcon = ({ color }: { color?: string }) => (
  <svg
    className="h-[18px] w-[18px]"
    style={{ color: color || C.primary }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
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
//  Inline Image Slider
// ─────────────────────────────────
const InlineImageSlider = ({
  images,
  onDelete,
  isSaving,
}: {
  images: string[];
  onDelete: (idx: number) => void;
  isSaving: boolean;
}) => {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(
    () => new Set()
  );

  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (current >= images.length && images.length > 0)
      setCurrent(images.length - 1);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length, current, fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setCurrent((p) => (p > 0 ? p - 1 : images.length - 1));
      if (e.key === "ArrowRight")
        setCurrent((p) => (p < images.length - 1 ? p + 1 : 0));
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, images.length]);

  if (images.length === 0) return null;

  const prev = () => setCurrent((p) => (p > 0 ? p - 1 : images.length - 1));
  const next = () => setCurrent((p) => (p < images.length - 1 ? p + 1 : 0));
  const currentImageUrl = images[current] || "";
  const hasImageFailed = failedImageUrls.has(currentImageUrl);
  const driveOpenUrl = getGoogleDriveOpenUrl(currentImageUrl);

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const sliderBox = (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: fullscreen ? 0 : 16,
        overflow: "hidden",
        background: "#000",
        paddingTop: fullscreen ? undefined : "48%",
        height: fullscreen ? "100%" : undefined,
      }}
    >
      {/* Blurred Background to fill empty space elegantly */}
      {!hasImageFailed && (
        <div
          style={{
            position: "absolute",
            inset: -20,
            backgroundImage: `url(${currentImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {hasImageFailed ? (
        <div
          style={{
            position: fullscreen ? "static" : "absolute",
            inset: fullscreen ? undefined : 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 24,
            textAlign: "center",
            background: "#f3f4f6",
            color: C.textMain,
            fontFamily: "'Poppins', sans-serif",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            Image preview is blocked
          </div>
          <div style={{ maxWidth: 360, fontSize: 12, color: "#d1d5db" }}>
            Google Drive does not allow this file to render directly here.
          </div>
          {driveOpenUrl && (
            <a
              href={driveOpenUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: 4,
                borderRadius: 999,
                background: "#fff",
                color: "#111",
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Open image
            </a>
          )}
        </div>
      ) : (
        <img
          key={current}
          src={currentImageUrl}
          alt={`slide-${current}`}
          referrerPolicy="no-referrer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain" as const,
            position: fullscreen ? "static" : "absolute",
            top: fullscreen ? undefined : 0,
            left: fullscreen ? undefined : 0,
            display: "block",
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
            zIndex: 2,
            touchAction: "none"
          }}
          onLoad={() => {
            setFailedImageUrls((prevFailed) => {
              if (!prevFailed.has(currentImageUrl)) return prevFailed;
              const nextFailed = new Set(prevFailed);
              nextFailed.delete(currentImageUrl);
              return nextFailed;
            });
          }}
          onError={() => {
            setFailedImageUrls((prevFailed) => {
              const nextFailed = new Set(prevFailed);
              nextFailed.add(currentImageUrl);
              return nextFailed;
            });
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setScale((s) => Math.min(s + 0.5, 4))}
          title="Zoom In"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            transition: "background .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
        >
          +
        </button>
        <button
          onClick={() => {
            if (scale > 1.5) {
              setScale((s) => s - 0.5);
            } else {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }
          }}
          title="Zoom Out"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            transition: "background .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
        >
          -
        </button>
        <button
          onClick={() => setFullscreen((f) => !f)}
          title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            transition: "background .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
        >
          {fullscreen ? (
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9L4 4m0 0h5m-5 0v5M15 9l5-5m0 0h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5M15 15l5 5m0 0h-5m5 0v-5"
              />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5-5M20 16v4m0 0h-4m4 0l-5-5"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => onDelete(current)}
          disabled={isSaving}
          title="Delete image"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#ef4444",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            fontSize: 14,
            fontWeight: 900,
            transition: "background .15s",
            opacity: isSaving ? 0.5 : 1,
            fontFamily: "'Poppins',sans-serif",
          }}
          onMouseEnter={(e) => {
            if (!isSaving) e.currentTarget.style.background = "#dc2626";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
        >
          {isSaving ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "bp-spin 1s linear infinite" }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
                style={{ opacity: 0.25 }}
              />
              <path
                fill="currentColor"
                style={{ opacity: 0.75 }}
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "✕"
          )}
        </button>
      </div>
      {images.length > 1 && (
        <button
          onClick={prev}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            zIndex: 10,
            transition: "background .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {images.length > 1 && (
        <button
          onClick={next}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            zIndex: 10,
            transition: "background .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.38)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 7,
            zIndex: 10,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 22 : 7,
                height: 7,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background:
                  i === current ? "#DA7756" : "rgba(255,255,255,0.50)",
                transition: "all .2s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return ReactDOM.createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFullscreen(false);
        }}
      >
        <div style={{ width: "100vw", height: "100vh" }}>{sliderBox}</div>
        <style>{`@keyframes bp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      </div>,
      document.body
    );
  }

  return (
    <div className="mb-5 w-full">
      {sliderBox}
      <style>{`@keyframes bp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
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

// ─────────────────────────────────
//  Inline Video Player
// ─────────────────────────────────
const DirectVideoPlayer: React.FC<{ url: string; safeIdx: number }> = ({
  url,
  safeIdx,
}) => {
  const driveOpenUrl = getGoogleDriveOpenUrl(url);
  const isBinaryVideoUrl = (() => {
    try {
      return /\.bin$/i.test(new URL(url).pathname);
    } catch {
      return false;
    }
  })();
  const videoType = isBinaryVideoUrl ? "video/mp4" : undefined;
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    setVideoError(null);
  }, [url]);

  if (driveOpenUrl) {
    return (
      <a
        key={`drive-${safeIdx}-${driveOpenUrl}`}
        href={driveOpenUrl}
        target="_blank"
        rel="noreferrer"
        title="Open Drive video"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
          textDecoration: "none",
          background: "#f3f4f6",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Thumbnail
      </a>
    );
  }

  if (videoError) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 24,
          textAlign: "center",
          background: "#f3f4f6",
          color: C.textMain,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800 }}>
          Video preview is unavailable
        </div>
        <div style={{ maxWidth: 380, fontSize: 12, color: "#d1d5db" }}>
          {videoError}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: 4,
            borderRadius: 999,
            background: "#fff",
            color: "#111",
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Open video
        </a>
      </div>
    );
  }

  return (
    <video
      key={`vid-${safeIdx}-${url}`}
      controls
      onError={() =>
        setVideoError("This video file cannot be played in the browser.")
      }
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        display: "block",
      }}
    >
      <source src={url} type={videoType} />
      Your browser does not support the video tag.
    </video>
  );
};

const InlineVideoPlayer: React.FC<{
  videos: string[];
  onDelete: (idx: number) => void;
  isSaving: boolean;
}> = ({ videos, onDelete, isSaving }) => {
  const [current, setCurrent] = useState(0);
  const safeIdx =
    (videos || []).length > 0
      ? Math.min(current, (videos || []).length - 1)
      : 0;

  useEffect(() => {
    if (safeIdx !== current) setCurrent(safeIdx);
  }, [safeIdx, current]);

  if (!videos || videos.length === 0) return null;

  const url = videos[safeIdx] ?? "";
  const getYouTubeId = (u: string): string | null => {
    if (!u || typeof u !== "string") return null;
    const m = u.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/#\s]{11})/
    );
    return m ? m[1] : null;
  };
  const videoId = getYouTubeId(url);
  const prev = () => setCurrent((p) => (p > 0 ? p - 1 : videos.length - 1));
  const next = () => setCurrent((p) => (p < videos.length - 1 ? p + 1 : 0));

  return (
    <div style={{ marginBottom: 20, width: "100%" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "48%",
          borderRadius: 16,
          overflow: "hidden",
          background: "#f3f4f6",
        }}
      >
        {videoId ? (
          <iframe
            key={`yt-${safeIdx}-${videoId}`}
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={`video-${safeIdx}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        ) : (
          <DirectVideoPlayer url={url} safeIdx={safeIdx} />
        )}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}
      >
        {videos.length > 1 && (
          <button
            onClick={prev}
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {videos.length > 1 && (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === safeIdx ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  background: i === safeIdx ? "#DA7756" : "#d1d5db",
                  transition: "all .2s",
                }}
              />
            ))}
          </div>
        )}
        {videos.length > 1 && (
          <button
            onClick={next}
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        <p
          style={{
            flex: 1,
            minWidth: 0,
            margin: 0,
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {safeIdx + 1}/{videos.length}
        </p>
        <button
          onClick={() => onDelete(safeIdx)}
          disabled={isSaving}
          title="Delete video"
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#ef4444",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isSaving ? "not-allowed" : "pointer",
            color: "#fff",
            fontSize: 13,
            fontWeight: 900,
            opacity: isSaving ? 0.5 : 1,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {isSaving ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "bp-spin 1s linear infinite" }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
                opacity={0.25}
              />
              <path
                fill="currentColor"
                opacity={0.75}
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "✕"
          )}
        </button>
      </div>
    </div>
  );
};

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

const BtnOutline = ({
  children,
  onClick,
  className = "",
  disabled = false,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition-all duration-150 active:scale-[0.97] border ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    style={{ borderColor: C.primaryBord, color: C.primary, fontFamily: C.font }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = C.primaryBg;
        e.currentTarget.style.borderColor = C.primaryBordStrong;
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = C.primaryBord;
      }
    }}
  >
    {children}
  </button>
);

const BtnIcon = ({
  children,
  onClick,
  title = "",
  onMouseEnter,
  onMouseLeave,
}: any) => (
  <button
    onClick={onClick}
    title={title}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.primaryBg;
      e.currentTarget.style.color = C.primary;
      if (onMouseEnter) onMouseEnter(e);
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = "#9ca3af";
      if (onMouseLeave) onMouseLeave(e);
    }}
    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-sm transition-all duration-150 active:scale-[0.95] border"
    style={{
      borderColor: C.primaryBord,
      color: "#9ca3af",
      position: "relative",
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
    .bp-modal-portal { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,0.40); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
    .bp-modal-box { background: #f6f4ee; border-radius: 20px; border: 1px solid rgba(218,119,86,0.20); box-shadow: 0 30px 80px rgba(0,0,0,0.20); width: 100%; max-width: 540px; display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; }
    .bp-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 12px; font-size: 13px; font-weight: 600; color: #1a1a1a; background: #fffaf8; transition: border-color .15s, box-shadow .15s; outline: none; box-sizing: border-box; font-family: 'Poppins', sans-serif !important; }
    .bp-input:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-input::placeholder { color: #a3a3a3; font-weight: 500; }
    .bp-select { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 9px 36px 9px 12px; font-size: 13px; font-weight: 600; color: #1a1a1a; background: #fffaf8; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; cursor: pointer; outline: none; box-sizing: border-box; font-family: 'Poppins', sans-serif !important; }
    .bp-select:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-select:disabled { opacity: 0.6; cursor: not-allowed; }
    .bp-scroll::-webkit-scrollbar { width: 6px; }
    .bp-scroll::-webkit-scrollbar-track { background: transparent; }
    .bp-scroll::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .bp-scroll::-webkit-scrollbar-thumb:hover { background: #DA7756; }
    .bp-error-banner { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 600; }
    .bp-card-lift { transition: box-shadow .2s, transform .2s, border-color .2s, background .2s; }
    .bp-card-lift:hover { border-color: rgba(218,119,86,0.35) !important; box-shadow: 0 16px 36px rgba(26,26,26,0.08), 0 4px 14px rgba(218,119,86,0.10); transform: translateY(-2px); }
    .bp-tab-active { background: #DA7756 !important; color: #fff !important; box-shadow: 0 10px 20px rgba(218,119,86,0.20); }
    .bp-tab-inactive { background: transparent !important; color: #6b7280 !important; }
    .bp-tab-inactive:hover { background: #fffaf8 !important; color: #DA7756 !important; }
    .bp-panel { border-radius: 20px; border: 1px solid #e8e3de; background: #ffffff; box-shadow: 0 10px 24px rgba(26,26,26,0.05); }
    .bp-section-band { border-radius: 20px; border: 1px solid #e8e3de; background: rgba(255,255,255,0.72); box-shadow: 0 10px 24px rgba(26,26,26,0.04); }
    .bp-soft-card { border-radius: 18px; border: 1px solid #e8e3de; background: #ffffff; box-shadow: 0 10px 24px rgba(26,26,26,0.05); }
    .bp-icon-tile { border: 1px solid rgba(218,119,86,0.22); background: #fdf9f7; color: #DA7756; }
    .drag-over { border: 2px dashed ${C.primary} !important; opacity: 0.5; }
    .bp-heading { color: ${C.textMain}; font-weight: 600; }
    .bp-heading-coral { color: #DA7756 !important; }
    @keyframes bp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  `}</style>
);

// ─────────────────────────────────
//  Portal Modal Component
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
//  Types & Info Card Data
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

type AiBuilderStage = "discovery" | "questions" | "building" | "plan";

const AI_PLAN_FIELDS = [
  { 
    key: "purpose", 
    label: "Q1: Why does your company exist?",
    placeholder: "Describe the purpose of your business, the problem you solve, who you serve, and the impact you aim to create"
  },
  {
    key: "core_values",
    label: "Q2: What 4-5 values or behaviours best represent your team or culture?",
    placeholder: "List the values and behaviours that guide how your team works, makes decisions, collaborates, and serves customers"
  },
  {
    key: "brand_promises",
    label: "Q3: What are the USPs that make you stand out?",
    placeholder: "Describe what makes your business unique, including your strengths, expertise, customer experience, innovation, quality, pricing, or competitive advantages."
  },
  {
    key: "bhag",
    label: "Q4: What bold outcome do you want to achieve in the next 10-15 years?",
    placeholder: "Describe the impact, market position, customer reach, business growth, and long-term outcomes you want to achieve in the next 10–15 years"
  },
  {
    key: "three_year_vision",
    label: "Q5: What do you want to achieve in the next 3-5 years?",
    placeholder: "Describe the key business outcomes you want to achieve in the next 3–5 years, including growth, profitability, customers, expansion, products, operations, and team development."
  },
  {
    key: "annual_goals",
    label: "Q6: What are your main business goals for this financial year?",
    placeholder: "Describe your key priorities and measurable goals for this financial year, including revenue, customers, operations, team, products, or strategic initiatives"
  },
  {
    key: "target_markets",
    label: "Q7: Which customer segments or geographies will you focus on this year?",
    placeholder: "Describe the customers, industries, or regions you will focus on, including their needs, challenges, expectations, and growth potential"
  },
  {
    key: "key_initiatives",
    label: "Q8: What 3 key actions or projects will help you achieve this year's goals?",
    placeholder: "Describe the key initiatives or projects you will execute this year, their expected outcomes, business impact, and how they support your goals"
  },
  {
    key: "key_metrics",
    label: "Q9: What are the key numbers or metrics you should regularly track to ensure success?",
    placeholder: "Describe the key financial, customer, operational, employee, and growth metrics you will track to measure success"
  },
  {
    key: "people_process",
    label: "Q10: What improvements do you need in your people or processes to succeed?",
    placeholder: "Describe the improvements needed in your people, leadership, skills, processes, systems, technology, data, or operations to achieve your goals."
  },
] as const;

const TOOLTIP_CONTENT: Record<
  string,
  { title: string; desc: string; example: string }
> = {
  core: {
    title: "Core Values - Your Foundation",
    desc: "The 3-5 non-negotiable principles that guide every business decision. These should be actionable, not just words on a wall.",
    example:
      'Example: For a family restaurant in Mumbai - "Fresh ingredients daily", "Treat guests like family", "Never compromise on taste"',
  },
  purpose: {
    title: 'Purpose - Your "Why"',
    desc: "Why does your business exist beyond making money? This inspires your team and attracts customers who share your values.",
    example:
      'Example: A textile manufacturer in Surat might say "To preserve traditional Indian craftsmanship while empowering rural artisans"',
  },
  brand: {
    title: "Brand Promises - Your Commitments",
    desc: "What can customers ALWAYS count on from you? Make these specific and measurable promises that differentiate you from competitors.",
    example:
      'Example: An IT services company in Bangalore - "24-hour response time", "English + Hindi support", "Fixed-price projects (no surprises)"',
  },
};

// ─────────────────────────────────
//  CoreValuesInlineCard
// ─────────────────────────────────
const CoreValuesInlineCard: React.FC<{ values: CoreValueRecord[] }> = ({
  values,
}) => {
  const safeValues = values || [];

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {safeValues.map((v, idx) => (
        <div
          key={v.id ?? idx}
          className="group/value flex items-center gap-3 rounded-[15px] border border-[#efe5df] bg-gradient-to-r from-white to-[#fff8f4] px-3.5 py-3 shadow-[0_8px_18px_rgba(218,119,86,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f0cfc2] hover:shadow-[0_12px_24px_rgba(218,119,86,0.12)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff0ea] text-[12px] font-extrabold text-[#DA7756] ring-1 ring-[#f3d8ce] transition-all duration-200 group-hover/value:bg-[#DA7756] group-hover/value:text-white">
            {idx + 1}
          </span>

          <span className="min-w-0 flex-1 text-[13px] font-extrabold leading-5 text-[#1a1a1a]">
            {v.value}
          </span>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#ff6b4a] shadow-sm ring-1 ring-[#f0ebe6]">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75 9 17.25 19.5 6.75"
              />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
//  MAIN COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState("strategic");
  const [showAddContent, setShowAddContent] = useState(true);
  const [addContentTab, setAddContentTab] = useState("Business Plan");
  const [activeTopModal, setActiveTopModal] = useState<string | null>(null);
  const [showGenerateVisionBoardConfirm, setShowGenerateVisionBoardConfirm] = useState(false);
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [aiBuilderStage, setAiBuilderStage] =
    useState<AiBuilderStage>("discovery");

  const [aiCompanyName, setAiCompanyName] = useState("");
  const [aiCompanyWebsite, setAiCompanyWebsite] = useState("");
  const [aiIndustryCategory, setAiIndustryCategory] = useState("");
  const [aiIndustryOther, setAiIndustryOther] = useState("");
  const [aiBusinessStage, setAiBusinessStage] = useState("");
  const [aiYearsInOperation, setAiYearsInOperation] = useState("");
  const [aiTeamSize, setAiTeamSize] = useState("");
  const [aiAnnualRevenue, setAiAnnualRevenue] = useState("");
  const [aiGeographicReach, setAiGeographicReach] = useState<string[]>([]);
  const [aiMarketPosition, setAiMarketPosition] = useState("");

  const getDiscoveryContext = useCallback(() => {
    const parts = [];
    if (aiCompanyName) parts.push(`Company Name: ${aiCompanyName}`);
    else parts.push(`Company: ${getSelectedOrgName()}`);
    if (aiCompanyWebsite) parts.push(`Website: ${aiCompanyWebsite}`);
    const industry = aiIndustryCategory === "Other" ? aiIndustryOther : aiIndustryCategory;
    if (industry) parts.push(`Industry: ${industry}`);
    if (aiBusinessStage) parts.push(`Stage: ${aiBusinessStage}`);
    if (aiYearsInOperation) parts.push(`Years in Operation: ${aiYearsInOperation}`);
    if (aiTeamSize) parts.push(`Team Size: ${aiTeamSize}`);
    if (aiAnnualRevenue) parts.push(`Annual Revenue: ${aiAnnualRevenue}`);
    if (aiGeographicReach.length > 0) parts.push(`Geographic Reach: ${aiGeographicReach.join(", ")}`);
    if (aiMarketPosition) parts.push(`Market Position: ${aiMarketPosition}`);
    return parts.join("\n");
  }, [
    aiCompanyName,
    aiCompanyWebsite,
    aiIndustryCategory,
    aiIndustryOther,
    aiBusinessStage,
    aiYearsInOperation,
    aiTeamSize,
    aiAnnualRevenue,
    aiGeographicReach,
    aiMarketPosition,
  ]);
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
  const [aiAnswers, setAiAnswers] = useState<string[]>(
    AI_PLAN_FIELDS.map(() => "")
  );
  const [generatedAiPlan, setGeneratedAiPlan] = useState("");
  const [generatedAiPlanPayload, setGeneratedAiPlanPayload] =
    useState<Record<string, any> | null>(null);
  const [isSavingAiPlan, setIsSavingAiPlan] = useState(false);
  const [aiPlanJobId, setAiPlanJobId] = useState("");
  const [aiBuilderError, setAiBuilderError] = useState<string | null>(null);
  const aiPlanAbortRef = useRef<AbortController | null>(null);
  const aiPlanCancelledRef = useRef(false);
  const [isSuggestingAi, setIsSuggestingAi] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Info hover state for main header
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [infoPos, setInfoPos] = useState({ top: 0, right: 0 });
  const infoBtnRef = useRef<HTMLButtonElement>(null);

  // Info hover state for 3 cards
  const [activeCardInfo, setActiveCardInfo] = useState<
    "core" | "purpose" | "brand" | null
  >(null);
  const [cardInfoCoords, setCardInfoCoords] = useState({
    top: 0,
    left: 0,
    transform: "translateX(-50%)",
  });

  const handleCardInfoEnter = (
    e: React.MouseEvent,
    type: "core" | "purpose" | "brand"
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let left = rect.left + window.scrollX + rect.width / 2;
    let transform = "translateX(-50%)";
    if (type === "core") {
      left = rect.left + window.scrollX;
      transform = "translateX(0%)";
    } else if (type === "brand") {
      left = rect.right + window.scrollX;
      transform = "translateX(-100%)";
    }
    setCardInfoCoords({
      top: rect.bottom + window.scrollY + 10,
      left,
      transform,
    });
    setActiveCardInfo(type);
  };

  const [isCopyingPlan, setIsCopyingPlan] = useState(false);
  const [isCopyingAiPrompt, setIsCopyingAiPrompt] = useState<
    "overview" | "detailed" | "script" | null
  >(null);

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

  // Drag and Drop
  const dragCoreItem = useRef<number | null>(null);
  const dragCoreOverItem = useRef<number | null>(null);
  const [dragCoreOverIdx, setDragCoreOverIdx] = useState<number | null>(null);
  const dragBrandItem = useRef<number | null>(null);
  const dragBrandOverItem = useRef<number | null>(null);
  const [dragBrandOverIdx, setDragBrandOverIdx] = useState<number | null>(null);

  // Overview Media
  const [overviewImages, setOverviewImages] = useState<OverviewMediaItem[]>(
    []
  );
  const [overviewVideos, setOverviewVideos] = useState<OverviewMediaItem[]>(
    []
  );
  const [isFetchingMedia, setIsFetchingMedia] = useState(false);
  const [mediaFetchError, setMediaFetchError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [isSavingVideos, setIsSavingVideos] = useState(false);
  const [mediaSaveError, setMediaSaveError] = useState<string | null>(null);
  const overviewImageUploadRef = useRef<HTMLInputElement | null>(null);
  const overviewVideoUploadRef = useRef<HTMLInputElement | null>(null);

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
      const res = await fetch(`${BASE_URL}/kpis`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch KPIs");
      const json = await res.json();
      let list: any[] = [];
      if (json?.data?.kpis && Array.isArray(json.data.kpis))
        list = json.data.kpis;
      else if (Array.isArray(json?.data)) list = json.data;
      else if (Array.isArray(json)) list = json;
      setAvailableKpis(
        list
          .filter((item) => item?.id && (item?.name || item?.title))
          .map((item) => ({
            id: item.id,
            name: item.name || item.title || "Unnamed KPI",
          }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingKpis(false);
    }
  }, []);

  const loadOverviewMedia = useCallback(async () => {
    setIsFetchingMedia(true);
    setMediaFetchError(null);
    try {
      const data = await fetchOverviewMediaFromApi();
      setOverviewImages(data.images);
      setOverviewVideos(data.videos);
    } catch (err: any) {
      setMediaFetchError(err.message || "Failed to load media.");
    } finally {
      setIsFetchingMedia(false);
    }
  }, []);

  useEffect(() => {
    loadBrandPromises();
    loadPurpose();
    loadCoreValues();
    loadKpis();
    loadOverviewMedia();
  }, [
    loadBrandPromises,
    loadPurpose,
    loadCoreValues,
    loadKpis,
    loadOverviewMedia,
  ]);

  // ─────────────────────────────────────────────
  //  Shared DOM Extraction helper
  // ─────────────────────────────────────────────
  const extractSectionFromDOM = (
    headingRegex: RegExp,
    defaultTitle: string
  ) => {
    const allElements = Array.from(
      document.querySelectorAll(
        "h2, h3, h4, p, span, div.text-lg, div.font-bold"
      )
    );
    const header = allElements.find(
      (el) =>
        headingRegex.test((el as HTMLElement).innerText || "") &&
        el.children.length === 0
    );
    if (!header) return `--- ${defaultTitle} ---\n(No data found)\n\n`;
    const container =
      header.closest(".border, .shadow-sm, section, .p-5, .p-6") ||
      header.parentElement;
    if (!container) return `--- ${defaultTitle} ---\n(No data found)\n\n`;
    const clone = container.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll(
        "button, input, select, textarea, svg, img, a, .bp-modal-portal"
      )
      .forEach((el) => el.remove());
    clone
      .querySelectorAll("div, p, li, h1, h2, h3, h4")
      .forEach((el) => el.appendChild(document.createTextNode("\n")));
    clone
      .querySelectorAll("span, strong, b")
      .forEach((el) => el.appendChild(document.createTextNode(" ")));
    const rawText = clone.textContent || "";
    const lines = rawText
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line.length > 0);
    let formattedText = `--- ${defaultTitle} ---\n`;
    lines.forEach((line, idx) => {
      if (idx === 0 && headingRegex.test(line)) return;
      const lowerLine = line.toLowerCase();
      if (
        lowerLine.includes("revenue:") ||
        lowerLine.includes("profit:") ||
        line.includes("Target:")
      ) {
        formattedText += `  • ${line}\n`;
      } else if (lowerLine.includes("initiatives")) {
        formattedText += `\n  [ ${line.toUpperCase()} ]\n`;
      } else if (
        line.startsWith("•") ||
        line.startsWith("📅") ||
        line.match(/^\d+%$/)
      ) {
        formattedText += `      ${line}\n`;
      } else {
        formattedText += `\n    > ${line}\n`;
      }
    });
    return formattedText + `\n`;
  };

  // ─────────────────────────────────────────────
  //  Build Full Plan Text (async — fetches all data)
  // ─────────────────────────────────────────────
  const buildFullPlanText = async (): Promise<string> => {
    const headers = getAuthHeaders();

    // Fetch KPIs
    let kpis: any[] = [];
    try {
      const res = await fetch(`${BASE_URL}/kpis`, { headers });
      const json = await res.json();
      kpis = Array.isArray(json?.data?.kpis)
        ? json.data.kpis
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
    } catch (e) {
      console.error("KPI fetch error", e);
    }

    // Fetch SOPs
    let sops: any[] = [];
    try {
      const res = await fetch(`${BASE_URL}/system_sops`, { headers });
      const json = await res.json();
      sops = Array.isArray(json?.data?.system_sops)
        ? json.data.system_sops
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
    } catch (e) {
      console.error("SOP fetch error", e);
    }

    // Fetch SWOT
    let swotData = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      opportunities: [] as string[],
      threats: [] as string[],
    };
    try {
      const res = await fetch(
        `${BASE_URL}/extra_fields?include_grouped=true&q[group_name_in][]=business_plan_strengths&q[group_name_in][]=business_plan_weaknesses&q[group_name_in][]=business_plan_opportunities&q[group_name_in][]=business_plan_threats`,
        { headers }
      );
      const json = await res.json();
      swotData = {
        strengths: json?.grouped_data?.business_plan_strengths?.values || [],
        weaknesses: json?.grouped_data?.business_plan_weaknesses?.values || [],
        opportunities:
          json?.grouped_data?.business_plan_opportunities?.values || [],
        threats: json?.grouped_data?.business_plan_threats?.values || [],
      };
    } catch (e) {
      console.error("SWOT fetch error", e);
    }

    // Build text
    const d = new Date();
    const dateStr = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    let text = `BUSINESS PLAN\n${getSelectedOrgName()}\nGenerated on: ${dateStr}\n${"=".repeat(60)}\n\n`;

    text += `PURPOSE\n${"=".repeat(60)}\n`;
    text += purposeText ? `${purposeText}\n\n` : `(No purpose defined)\n\n`;

    text += `CORE VALUES\n${"=".repeat(60)}\n`;
    coreValues.length
      ? coreValues.forEach((v, i) => {
        text += `${i + 1}. ${v.value}\n`;
      })
      : (text += `(No core values)\n`);
    text += `\n`;

    text += `BRAND PROMISES\n${"=".repeat(60)}\n`;
    brandPromises.length
      ? brandPromises.forEach((p, i) => {
        text += `${i + 1}. ${p.text}\n`;
        if (p.kpis?.length) text += `   Tracked by: ${p.kpis.join(", ")}\n`;
      })
      : (text += `(No brand promises)\n`);
    text += `\n`;

    // DOM-extracted sections
    text += extractSectionFromDOM(
      /BHAG|Big Hairy Audacious/i,
      "BHAG (BIG HAIRY AUDACIOUS GOAL)"
    );
    text += extractSectionFromDOM(
      /Medium Term|3.*Year|5.*Year/i,
      "MEDIUM TERM PLAN (3-5 YEARS)"
    );
    text += extractSectionFromDOM(
      /Short Term|1.*Year|Annual/i,
      "SHORT TERM GOALS (THIS YEAR)"
    );
    text += extractSectionFromDOM(
      /Quarterly|Rocks|90.*Day/i,
      "IMMEDIATE GOALS (THIS QUARTER)"
    );

    // KPIs
    text += `CRITICAL NUMBERS\n${"=".repeat(60)}\n`;
    kpis.length
      ? kpis.forEach((kpi: any, i: number) => {
        text += `${i + 1}. ${kpi.name || kpi.title || "Unnamed"}\n`;
        text += `   Current: ${kpi.current_value || 0} / Target: ${kpi.target_value || 0} ${kpi.unit || "#"}\n`;
        text += `   Frequency: ${kpi.frequency || "N/A"}\n`;
        const owner =
          kpi.owner ||
          kpi.assignee?.name ||
          kpi.assignee?.full_name ||
          kpi.assignee?.email;
        if (owner) text += `   Owner: ${owner}\n`;
      })
      : (text += `(No KPIs)\n`);
    text += `\n`;

    // SOPs / Key Processes
    text += `KEY PROCESSES\n${"=".repeat(60)}\n`;
    sops.length
      ? sops.forEach((sop: any, i: number) => {
        text += `${i + 1}. ${sop.system_name || sop.name || "Unnamed"}\n`;
        text += `   Status: ${sop.status || "to_start"}\n`;
        const owner =
          sop.owner ||
          sop.assignee?.name ||
          sop.assignee?.full_name ||
          sop.assignee?.email;
        if (owner) text += `   Owner: ${owner}\n`;
      })
      : (text += `(No SOPs)\n`);
    text += `\n`;

    // SWOT
    text += `SWOT ANALYSIS\n${"=".repeat(60)}\n\n`;
    (["strengths", "weaknesses", "opportunities", "threats"] as const).forEach(
      (key) => {
        text += `${key.charAt(0).toUpperCase() + key.slice(1)}:\n`;
        swotData[key].length
          ? swotData[key].forEach((item, i) => {
            text += `  ${i + 1}. ${item}\n`;
          })
          : (text += `  (No items)\n`);
        text += `\n`;
      }
    );

    return text.trim();
  };

  // ── COPY PLAN ──
  const handleCopyPlan = async () => {
    setIsCopyingPlan(true);
    try {
      const text = await buildFullPlanText();
      await navigator.clipboard.writeText(text);
      toast.success("Business Plan copied to clipboard!");
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Failed to copy plan.");
    } finally {
      setIsCopyingPlan(false);
    }
  };

  // ── AI Prompt Copy Handlers ──
  const handleAiSuggest = async () => {
    setIsSuggestingAi(true);
    try {
      const rawLabel = AI_PLAN_FIELDS[aiQuestionIndex].label;
      const cleanPrompt = rawLabel.replace(/^Q\d+:\s*/, "");
      const currentDraft = aiAnswers[aiQuestionIndex]?.trim();

      const previous_answers = AI_PLAN_FIELDS.slice(0, aiQuestionIndex)
        .map((field, idx) => ({
          question: field.label.replace(/^Q\d+:\s*/, ""),
          answer: aiAnswers[idx]
        }))
        .filter(item => item.answer.trim() !== "");

      const finalPrompt = currentDraft
        ? `Question: ${cleanPrompt}\n\nPlease enhance and professionally re-write the following draft answer:\n${currentDraft}`
        : cleanPrompt;

      const payload = {
        prompt: finalPrompt,
        feature: "business_plan_wizard",
        context: getDiscoveryContext(),
        previous_answers: previous_answers
      };

      const res = await fetch(`${BASE_URL}/ai_assist/suggest`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.suggestion) {
        updateAiAnswer(json.suggestion);
        toast.success("AI suggestion applied!");
      } else {
        throw new Error(json.message || "Failed to get suggestion");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch AI suggestion.");
    } finally {
      setIsSuggestingAi(false);
    }
  };

  const resetAiBuilder = () => {
    setAiBuilderStage("discovery");
    setAiQuestionIndex(0);
    setAiAnswers(AI_PLAN_FIELDS.map(() => ""));
    setGeneratedAiPlan("");
    setGeneratedAiPlanPayload(null);
    setAiPlanJobId("");
    setAiBuilderError(null);
    setAiCompanyName("");
    setAiCompanyWebsite("");
    setAiIndustryCategory("");
    setAiIndustryOther("");
    setAiBusinessStage("");
    setAiYearsInOperation("");
    setAiTeamSize("");
    setAiAnnualRevenue("");
    setAiGeographicReach([]);
    setAiMarketPosition("");
  };

  const openAiBuilder = () => {
    resetAiBuilder();
    setIsAiBuilderOpen(true);
  };

  const stopAiPlanGeneration = () => {
    aiPlanCancelledRef.current = true;
    aiPlanAbortRef.current?.abort();
    aiPlanAbortRef.current = null;
  };

  const closeAiBuilder = () => {
    stopAiPlanGeneration();
    setIsAiBuilderOpen(false);
  };

  const updateAiAnswer = (value: string) => {
    setAiAnswers((prev) =>
      prev.map((answer, idx) => (idx === aiQuestionIndex ? value : answer))
    );
    setAiBuilderError(null);
  };

  const createAiPlanPayload = () => ({
    business_context: getDiscoveryContext(),
    purpose: aiAnswers[0]?.trim() || "",
    core_values: aiAnswers[1]?.trim() || "",
    brand_promises: aiAnswers[2]?.trim() || "",
    bhag: aiAnswers[3]?.trim() || "",
    three_year_vision: aiAnswers[4]?.trim() || "",
    annual_goals: aiAnswers[5]?.trim() || "",
    target_markets: aiAnswers[6]?.trim() || "",
    key_initiatives: aiAnswers[7]?.trim() || "",
    key_metrics: aiAnswers[8]?.trim() || "",
    people_process: aiAnswers[9]?.trim() || "",
  });

  const createAiPlanPreview = () => {
    const answer = (idx: number) => aiAnswers[idx]?.trim() || "Not specified";
    return [
      "AI BUSINESS PLAN",
      "=".repeat(60),
      "",
      `Purpose: ${answer(0)}`,
      `Core Values: ${answer(1)}`,
      `Target Markets: ${answer(6)}`,
      "",
      "EXECUTIVE SUMMARY",
      "-".repeat(60),
      `${answer(0)} The plan is guided by ${answer(1)} and supported by ${answer(2)}.`,
      "",
      "STRATEGIC DIRECTION",
      "-".repeat(60),
      `BHAG / 10-Year Goal: ${answer(3)}`,
      `3-Year Goals: ${answer(4)}`,
      `1-Year Goals: ${answer(5)}`,
      "",
      "KEY INITIATIVES",
      "-".repeat(60),
      answer(7),
      "",
      "KEY METRICS",
      "-".repeat(60),
      answer(8),
      "",
      "PEOPLE AND PROCESS",
      "-".repeat(60),
      answer(9),
      "",
      "90 DAY EXECUTION PLAN",
      "-".repeat(60),
      "1. Align leadership around the 12 month goal.",
      "2. Turn customer focus into weekly sales and marketing actions.",
      "3. Assign owners to the biggest risks and review progress weekly.",
      "4. Review scorecard numbers monthly and correct misses quickly.",
    ].join("\n");
  };

  const getAiPlanResponseText = (response: any): string => {
    const candidates = [
      response?.response,
      response?.data?.response,
      response?.result?.response,
      response?.output,
      response?.data?.output,
      response?.result?.output,
      response?.content,
      response?.data?.content,
      response?.result?.content,
      response?.text,
      response?.data?.text,
      response?.result?.text,
      response?.generated_text,
      response?.data?.generated_text,
      response?.result?.generated_text,
    ];

    const text = candidates.find(
      (candidate) => typeof candidate === "string" && candidate.trim()
    );

    return text ? text.trim() : "";
  };

  const extractAiPlanText = (response: any): string => {
    const planObject =
      response?.plan ||
      response?.data?.plan ||
      response?.result?.plan ||
      null;
    if (planObject && typeof planObject === "object") {
      return JSON.stringify(planObject, null, 2);
    }

    const candidates = [
      response?.plan,
      response?.ai_plan,
      response?.business_plan,
      response?.summary,
      response?.data?.plan,
      response?.data?.ai_plan,
      response?.data?.business_plan,
      response?.data?.summary,
      response?.result?.plan,
      response?.result?.ai_plan,
      response?.result?.business_plan,
      response?.result?.summary,
      getAiPlanResponseText(response),
    ];
    const text = candidates.find(
      (candidate) => typeof candidate === "string" && candidate.trim()
    );
    return text || createAiPlanPreview();
  };

  const isAiPlanCompleted = (response: any): boolean => {
    const status = String(response?.status || response?.data?.status || "")
      .trim()
      .toLowerCase();
    return (
      status === "completed" ||
      status === "success" ||
      (response?.success === true &&
        !!(
          response?.plan ||
          response?.data?.plan ||
          response?.result?.plan ||
          getAiPlanResponseText(response)
        ))
    );
  };

  const getCompletedAiPlan = (response: any): Record<string, any> | null => {
    const plan =
      response?.plan ||
      response?.data?.plan ||
      response?.result?.plan ||
      null;
    return plan && typeof plan === "object" && !Array.isArray(plan)
      ? plan
      : null;
  };

  const unwrapAiPlanPayload = (payload: Record<string, any>) => {
    const plan =
      payload?.plan ||
      payload?.data?.plan ||
      payload?.result?.plan ||
      payload;
    return plan && typeof plan === "object" && !Array.isArray(plan)
      ? plan
      : {};
  };

  const normalizeAiPlanForSave = (payload: Record<string, any>) => {
    const plan = unwrapAiPlanPayload(payload);
    const brandPromiseKpis = Array.isArray(plan.brand_promise_kpis)
      ? plan.brand_promise_kpis
      : Array.isArray(plan["brand Promise KPIs"])
        ? plan["brand Promise KPIs"]
        : Array.isArray(plan.brand_promise_KPIs)
          ? plan.brand_promise_KPIs
          : [];
    const brandPromises = Array.isArray(plan.brand_promises)
      ? plan.brand_promises
      : [];
    const baseCriticalNumbers = Array.isArray(plan.critical_numbers)
      ? plan.critical_numbers
      : [];
    const criticalNumberNames = new Set(
      baseCriticalNumbers
        .map((item: any) =>
          String(item?.name || item?.title || item || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    );
    const brandKpisAsCriticalNumbers = brandPromiseKpis
      .map((item: any, index: number) => {
        const linkedBrandPromise =
          item?.brand_promise ||
          item?.brandPromise ||
          brandPromises[index] ||
          "";

        return typeof item === "string"
          ? {
            name: item,
            target: "",
            current: "",
            brand_promise: linkedBrandPromise,
            brand_promise_index: index,
          }
          : {
            name: item?.name || item?.title || item?.kpi || "",
            target: item?.target ?? item?.target_value ?? "",
            current: item?.current ?? item?.current_value ?? "",
            brand_promise: linkedBrandPromise,
            brand_promise_index: index,
          };
      })
      .filter((item: any) => {
        const key = String(item.name || "").trim().toLowerCase();
        if (!key || criticalNumberNames.has(key)) return false;
        criticalNumberNames.add(key);
        return true;
      });

    return {
      purpose: plan.purpose || "",
      core_values: Array.isArray(plan.core_values) ? plan.core_values : [],
      core_values_explanation: plan.core_values_explanation || "",
      brand_promises: brandPromises,
      brand_promise_kpis: brandPromiseKpis,
      target_segments: plan.target_segments || "",
      bhag_alternatives: Array.isArray(plan.bhag_alternatives)
        ? plan.bhag_alternatives
        : [],
      bhag_selected: plan.bhag_selected || "",
      bhag_initiatives: Array.isArray(plan.bhag_initiatives)
        ? plan.bhag_initiatives
        : [],
      three_year_goals: plan.three_year_goals || "",
      three_year_initiatives: Array.isArray(plan.three_year_initiatives)
        ? plan.three_year_initiatives
        : [],
      one_year_goals: plan.one_year_goals || "",
      one_year_initiatives: Array.isArray(plan.one_year_initiatives)
        ? plan.one_year_initiatives
        : [],
      quarterly_goals: plan.quarterly_goals || "",
      quarterly_theme: plan.quarterly_theme || "",
      quarterly_initiatives: Array.isArray(plan.quarterly_initiatives)
        ? plan.quarterly_initiatives
        : [],
      quarterly_rewards: Array.isArray(plan.quarterly_rewards)
        ? plan.quarterly_rewards
        : [],
      critical_numbers: [...baseCriticalNumbers, ...brandKpisAsCriticalNumbers],
      people_drivers:
        plan.people_drivers &&
          typeof plan.people_drivers === "object" &&
          !Array.isArray(plan.people_drivers)
          ? plan.people_drivers
          : {},
      process_drivers: Array.isArray(plan.process_drivers)
        ? plan.process_drivers
        : [],
      strengths: Array.isArray(plan.strengths) ? plan.strengths : [],
      weaknesses: Array.isArray(plan.weaknesses) ? plan.weaknesses : [],
      opportunities: Array.isArray(plan.opportunities) ? plan.opportunities : [],
      threats: Array.isArray(plan.threats) ? plan.threats : [],
    };
  };

  const saveAiPlanToApi = async (
    plan: Record<string, any>,
    signal?: AbortSignal
  ) => {
    const res = await fetch(`${BASE_URL}/extra_fields/save_ai_plan`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
      signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.success === false) {
      throw new Error(json?.message || json?.error || "Failed to save AI plan.");
    }
    return json;
  };

  const waitForAiPlan = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("AI plan generation cancelled.", "AbortError"));
        return;
      }

      const timeoutId = window.setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timeoutId);
          reject(new DOMException("AI plan generation cancelled.", "AbortError"));
        },
        { once: true }
      );
    });

  const getAiPlanErrorMessage = (response: any) => {
    if (Array.isArray(response?.errors) && response.errors.length > 0) {
      return response.errors.join("\n");
    }
    return response?.message || response?.error || "AI plan generation failed.";
  };

  const pollAiPlan = async (jobId: string, signal: AbortSignal) => {
    while (true) {
      if (signal.aborted || aiPlanCancelledRef.current) {
        throw new DOMException("AI plan generation cancelled.", "AbortError");
      }

      const res = await fetch(
        `${BASE_URL}/extra_fields/poll_ai_plan?job_id=${encodeURIComponent(jobId)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          signal,
        }
      );
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
      }

      const status = String(json?.status || "").toLowerCase();
      if (isAiPlanCompleted(json)) {
        return json;
      }

      if (status === "processing" || status === "pending") {
        await waitForAiPlan(10000, signal);
        continue;
      }

      if (status === "error" || status === "failed" || json?.success === false) {
        const error = new Error(getAiPlanErrorMessage(json));
        (error as any).shouldRestartAiPlan = true;
        throw error;
      }

      return json;
    }
  };

  const generateAiPlan = async (retryAttempt = 0) => {
    stopAiPlanGeneration();
    const controller = new AbortController();
    aiPlanAbortRef.current = controller;
    aiPlanCancelledRef.current = false;

    setAiBuilderStage("building");
    setAiBuilderError(null);
    setAiPlanJobId("");

    try {
      const res = await fetch(`${BASE_URL}/extra_fields/generate_ai_plan`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(createAiPlanPayload()),
        signal: controller.signal,
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || json?.error || "No AI Setup Detected");
      }

      if (isAiPlanCompleted(json)) {
        const completedPlan = getCompletedAiPlan(json);
        setGeneratedAiPlanPayload(completedPlan);
        setGeneratedAiPlan(extractAiPlanText(json));
        setAiBuilderStage("plan");
        return;
      }

      if (!json?.job_id) {
        throw new Error(json?.message || json?.error || "AI plan response is missing plan data.");
      }

      setAiPlanJobId(json.job_id);
      const pollResponse = await pollAiPlan(json.job_id, controller.signal);
      if (controller.signal.aborted || aiPlanCancelledRef.current) return;
      const completedPlan = getCompletedAiPlan(pollResponse);
      setGeneratedAiPlanPayload(completedPlan);
      setGeneratedAiPlan(extractAiPlanText(pollResponse));
      setAiBuilderStage("plan");
    } catch (err: any) {
      if (err?.name === "AbortError" || aiPlanCancelledRef.current) {
        return;
      }

      if (err?.shouldRestartAiPlan && retryAttempt < 1) {
        toast.error(err.message || "AI response failed. Restarting process.");
        await generateAiPlan(retryAttempt + 1);
        return;
      }

      setAiBuilderError(err.message || "Failed to generate AI plan.");
      toast.error(err.message || "Failed to generate AI plan.");
      setAiBuilderStage("questions");
    } finally {
      if (aiPlanAbortRef.current === controller) {
        aiPlanAbortRef.current = null;
      }
    }
  };

  const goToNextAiQuestion = () => {
    if (!aiAnswers[aiQuestionIndex]?.trim()) {
      const message = "Please answer this question before continuing.";
      setAiBuilderError(message);
      toast.error(message);
      return;
    }

    if (aiQuestionIndex < AI_PLAN_FIELDS.length - 1) {
      setAiQuestionIndex((idx) => idx + 1);
      setAiBuilderError(null);
      return;
    }

    generateAiPlan();
  };

  const downloadAiPlan = () => {
    const plan = generatedAiPlanPayload || safeParseJSON(generatedAiPlan);
    const hasPlanPayload = plan && Object.keys(plan).length > 0;
    if (!generatedAiPlan && !hasPlanPayload) return;

    const escapeCsv = (value: any) => {
      const text =
        value === null || value === undefined
          ? ""
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows: string[][] = hasPlanPayload
      ? Object.entries(normalizeAiPlanForSave(plan)).map(([key, value]) => [
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value ?? ""),
      ])
      : [["plan", generatedAiPlan]];
    const csv = [["Field", "Value"], ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-business-plan.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const saveAiPlan = async () => {
    const parsedPlan = generatedAiPlanPayload || safeParseJSON(generatedAiPlan);
    if (!parsedPlan || Object.keys(parsedPlan).length === 0) {
      toast.error("No AI plan payload found to save.");
      return;
    }

    try {
      setIsSavingAiPlan(true);
      const normalizedPlan = normalizeAiPlanForSave(parsedPlan);
      console.log("Save A.I Plan payload:", normalizedPlan);
      await saveAiPlanToApi(normalizedPlan);
      localStorage.setItem(
        AI_CRITICAL_NUMBERS_STORAGE_KEY,
        JSON.stringify(normalizedPlan.critical_numbers || [])
      );
      window.dispatchEvent(new Event("business-plan-critical-numbers-updated"));
      toast.success("AI plan saved.");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to save AI plan.");
    } finally {
      setIsSavingAiPlan(false);
    }
  };

  const aiPlanDisplay = generatedAiPlanPayload || safeParseJSON(generatedAiPlan);
  const hasStructuredAiPlan = Object.keys(aiPlanDisplay).length > 0;

  const renderAiPlanStringList = (items: any[] = []) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={`${String(item)}-${idx}`}
          className="rounded-full px-3 py-1 text-[12px] font-bold"
          style={{ background: C.primaryBg, color: C.primary }}
        >
          {String(item)}
        </span>
      ))}
    </div>
  );

  const renderAiPlanObjectList = (items: any[] = []) => (
    <div className="space-y-2">
      {items.map((item, idx) => {
        if (!item || typeof item !== "object") {
          return (
            <div
              key={idx}
              className="rounded-xl border bg-white p-3 text-[13px] font-bold"
              style={{ borderColor: C.primaryBord, color: C.textMain }}
            >
              {String(item)}
            </div>
          );
        }

        const title =
          item.initiative ||
          item.goal ||
          item.name ||
          item.title ||
          item.department_name ||
          "Item";
        const detail =
          item.owner ||
          item.rationale ||
          item.observation ||
          item.detail ||
          item.target ||
          "";

        return (
          <div
            key={`${title}-${idx}`}
            className="rounded-xl border bg-white p-3"
            style={{ borderColor: C.primaryBord }}
          >
            <div className="text-[13px] font-bold" style={{ color: C.textMain }}>
              {title}
            </div>
            {detail && (
              <div className="mt-1 text-[12px] font-semibold" style={{ color: C.textMuted }}>
                {typeof detail === "number" ? String(detail) : detail}
              </div>
            )}
            {item.current !== undefined && (
              <div className="mt-1 text-[12px] font-semibold" style={{ color: C.textMuted }}>
                Current: {item.current}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAiPlanScalar = (value: any) => {
    if (Array.isArray(value)) return renderAiPlanObjectList(value);
    if (value && typeof value === "object") {
      return renderAiPlanObjectList(
        Object.entries(value).map(([name, target]) => ({ name, target }))
      );
    }

    return (
      <p className="text-[13px] font-semibold" style={{ color: C.textMain }}>
        {String(value ?? "")}
      </p>
    );
  };

  const renderAiPlanSection = (title: string, children: React.ReactNode) => (
    <div
      className="rounded-2xl border bg-white p-4 shadow-sm"
      style={{ borderColor: C.primaryBord }}
    >
      <h4
        className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em]"
        style={{ color: C.primary }}
      >
        {title}
      </h4>
      {children}
    </div>
  );

  const handleCopyAiPrompt = async (
    type: "overview" | "detailed" | "script"
  ) => {
    setIsCopyingAiPrompt(type);
    try {
      if (type === "overview") {
        const headers = getAuthHeaders();

        // Fetch KPIs
        let kpis: any[] = [];
        try {
          const res = await fetch(`${BASE_URL}/kpis`, { headers });
          const json = await res.json();
          kpis = Array.isArray(json?.data?.kpis)
            ? json.data.kpis
            : Array.isArray(json?.data)
              ? json.data
              : Array.isArray(json)
                ? json
                : [];
        } catch (e) {
          console.error("KPI fetch error", e);
        }

        // Fetch SWOT
        let swotData = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
        try {
          const res = await fetch(
            `${BASE_URL}/extra_fields?include_grouped=true&q[group_name_in][]=business_plan_strengths&q[group_name_in][]=business_plan_weaknesses&q[group_name_in][]=business_plan_opportunities&q[group_name_in][]=business_plan_threats`,
            { headers }
          );
          const json = await res.json();
          swotData = {
            strengths: json?.grouped_data?.business_plan_strengths?.values || [],
            weaknesses: json?.grouped_data?.business_plan_weaknesses?.values || [],
            opportunities: json?.grouped_data?.business_plan_opportunities?.values || [],
            threats: json?.grouped_data?.business_plan_threats?.values || [],
          };
        } catch (e) {
          console.error("SWOT fetch error", e);
        }

        const payload = {
          purpose: "Empowering businesses to make smarter decisions with AI",
          core_values: ["Customer-First", "Data-Driven", "Ownership", "Innovation", "Transparency"],
          core_values_explanation: "We live these values in every decision we make",
          brand_promises: ["Actionable insights in 30 days", "Seamless implementation"],
          brand_promise_kpis: ["30-day ROI report", "< 2hr onboarding time"],
          bhag_selected: "Global Leader in AI-Driven Business Intelligence by 2035",
          bhag_initiatives: ["Expand to 10M businesses", "Launch Innovation Labs", "Build Global Footprint"],
          three_year_goals: "500 Crore revenue with 5000 enterprise clients",
          three_year_initiatives: [
            { "initiative": "Launch 5 new geographies", "owner": "CEO" },
            { "initiative": "Develop 2 new AI product lines", "owner": "CTO" },
            { "initiative": "Achieve SOC2 compliance", "owner": "COO" }
          ],
          one_year_goals: "100 Crore revenue with 1000 clients",
          one_year_initiatives: [
            { "initiative": "Close 500 enterprise deals", "owner": "Sales Head" },
            { "initiative": "Launch mobile app", "owner": "Product Head" },
            { "initiative": "Build partner ecosystem", "owner": "BD Head" }
          ],
          quarterly_goals: "35 Crore Revenue — Launch & Expand",
          quarterly_theme: "Growth Sprint Q1",
          quarterly_initiatives: [
            { "initiative": "SEA expansion — Bangkok office", "owner": "CEO" },
            { "initiative": "300 new client onboardings", "owner": "Sales Head" },
            { "initiative": "Celebration Summit", "owner": "HR Head" }
          ],
          quarterly_rewards: ["Team trip to Bali", "₹1L bonus pool"],
          target_segments: "Mid-market and enterprise B2B companies in APAC",
          people_drivers: {
            "employees": "High-ownership culture with quarterly OKRs",
            "customers": "NPS > 70 with dedicated CSM",
            "suppliers": "Strategic SaaS partnerships only"
          },
          process_drivers: ["Agile sprints", "Data-first decisions", "Weekly leadership sync", "Customer feedback loops"],
          critical_numbers: [
            { "name": "Net Promoter Score", "target": "70", "current": "52" },
            { "name": "Revenue Target", "target": "35", "current": "0" },
            { "name": "New Clients", "target": "300", "current": "8" },
            { "name": "Churn Rate", "target": "2", "current": "8" }
          ],
          strengths: ["Strong AI core", "Experienced team", "Existing client base", "Scalable platform"],
          weaknesses: ["Low brand awareness", "Limited sales team", "No physical presence in SEA"],
          opportunities: ["APAC market growth", "AI adoption surge", "Competitor consolidation", "Govt digital push"],
          threats: ["Big tech entering market", "Economic slowdown", "Talent attrition", "Data privacy regulations"]
        };

        const res = await fetch(`${BASE_URL}/extra_fields/generate_ai_plan_image`, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        let json;
        try {
          json = await res.json();
        } catch (e) {
          json = {};
        }

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || json?.error || "Failed to generate AI image");
        }

        // Attempt to find the newly generated image URL in the response
        const newImageUrl = 
          json?.image_url || 
          json?.url || 
          json?.data?.image_url || 
          json?.data?.url || 
          (typeof json?.data === 'string' && json.data.startsWith('http') ? json.data : null);

        if (newImageUrl && typeof newImageUrl === 'string') {
          try {
            const latestMedia = await fetchOverviewMediaFromApi().catch(() => null);
            const existingImages = latestMedia?.images || overviewImages || [];
            const existingUrls = existingImages.map((item: any) => item.url);
            
            if (!existingUrls.includes(newImageUrl)) {
              // Add the new image URL and save
              const updated = Array.from(new Set([...existingUrls, newImageUrl]));
              await saveOverviewImagesApi(updated);
              await refreshOverviewMediaWithFallback({ fallbackImages: updated });
            }
          } catch (e) {
            console.error("Failed to auto-save AI image to board", e);
            await loadOverviewMedia();
          }
        } else {
          // Fallback if URL wasn't found in a predictable field
          console.log("AI Image generation response:", json);
          await loadOverviewMedia();
        }

        toast.success("AI Image generated successfully!");
      } else {
        const plan = await buildFullPlanText();
        let prompt = "";
        if (type === "detailed") {
          prompt = `Create an interesting and impactful DETAILED infographic with all key metrics, goals, SWOT and KPIs for the business plan of my company in landscape mode (red, black & white colors) from the plan given below:\n\n${plan}`;
        } else if (type === "script") {
          prompt = `Create an engaging video script for explaining my business plan to my team in an impactful way\n\n${plan}`;
        }
        await navigator.clipboard.writeText(prompt);
        toast.success(
          type === "script"
            ? "Video script prompt copied! Paste in Gemini or ChatGPT."
            : "Infographic prompt copied! Paste in Gemini or ChatGPT."
        );
      }
    } catch (err) {
      console.error("AI prompt copy failed", err);
      toast.error("Failed to process request.");
    } finally {
      setIsCopyingAiPrompt(null);
    }
  };

  // ── Overview Media Handlers ──
  const refreshOverviewMediaWithFallback = async ({
    fallbackImages,
    fallbackVideos,
  }: {
    fallbackImages?: string[];
    fallbackVideos?: string[];
  }) => {
    try {
      const fetched = await fetchOverviewMediaFromApi();
      setOverviewImages(fetched.images);
      setOverviewVideos(fetched.videos);
    } catch (err: any) {
      setMediaFetchError(err.message || "Failed to load media.");
      if (fallbackImages) {
        const images = mergeOverviewMediaItems(overviewImages || [], fallbackImages);
        setOverviewImages(images);
      }
      if (fallbackVideos) {
        const videos = mergeOverviewMediaItems(overviewVideos || [], fallbackVideos);
        setOverviewVideos(videos);
      }
    }
  };

  const handleAddImage = async () => {
    const trimmed = normalizeImageUrl(newImageUrl.trim());
    if (!trimmed) return;
    setIsSavingImages(true);
    setMediaSaveError(null);
    try {
      const latestMedia = await fetchOverviewMediaFromApi().catch(() => null);
      const existingImages =
        latestMedia?.images ||
        (overviewImages || []).filter(
          (item) => !String(item.url || "").startsWith("data:image/")
        );
      const updated = getUniqueImageUrls([
        ...existingImages.map((item) => item.url),
        trimmed,
      ]);
      await saveOverviewImagesApi(updated);
      setNewImageUrl("");
      await refreshOverviewMediaWithFallback({ fallbackImages: updated });
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to save image.");
    } finally {
      setIsSavingImages(false);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const imageFileToJpegDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth || image.width;
          canvas.height = image.naturalHeight || image.height;
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error(`Failed to convert ${file.name} to JPEG`));
            return;
          }
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        image.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        image.src = String(reader.result || "");
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handleUploadOverviewImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    event.target.value = "";

    if (files.length === 0) {
      toast.error("Please select image files.");
      return;
    }

    const availableSlots = Math.max(12 - (overviewImages || []).length, 0);
    if (availableSlots === 0) {
      toast.error("You can add up to 12 images.");
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);
    setIsSavingImages(true);
    setMediaSaveError(null);
    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map(imageFileToJpegDataUrl)
      );
      const latestMedia = await fetchOverviewMediaFromApi().catch(() => null);
      const existingImages =
        latestMedia?.images ||
        (overviewImages || []).filter(
          (item) => !String(item.url || "").startsWith("data:image/")
        );
      const updated = getUniqueImageUrls([
        ...existingImages.map((item) => item.url),
        ...uploadedUrls,
      ]);
      await saveOverviewImagesApi(updated);
      await refreshOverviewMediaWithFallback({ fallbackImages: updated });
      toast.success(`${selectedFiles.length} image(s) uploaded`);
      if (files.length > selectedFiles.length) {
        toast.error("Some images were skipped because the limit is 12.");
      }
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to upload images.");
    } finally {
      setIsSavingImages(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    const media = (overviewImages || [])[index];
    setIsSavingImages(true);
    setMediaSaveError(null);
    try {
      if (media?.id) {
        await deleteExtraFieldFromApi(media.id);
      } else {
        const updated = (overviewImages || [])
          .filter((_, i) => i !== index)
          .map((item) => item.url);
        await saveOverviewImagesApi(updated);
      }
      setOverviewImages((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to delete image.");
    } finally {
      setIsSavingImages(false);
    }
  };

  const handleAddVideo = async () => {
    const trimmed = newVideoUrl.trim();
    if (!trimmed) return;
    setIsSavingVideos(true);
    setMediaSaveError(null);
    try {
      const updated = [
        ...(overviewVideos || []).map((item) => item.url),
        trimmed,
      ].filter((url, index, arr) => url && arr.indexOf(url) === index);
      await saveOverviewVideosApi(updated);
      setNewVideoUrl("");
      await refreshOverviewMediaWithFallback({ fallbackVideos: updated });
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to save video.");
    } finally {
      setIsSavingVideos(false);
    }
  };

  const handleUploadOverviewVideos = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("video/")
    );
    event.target.value = "";

    if (files.length === 0) {
      toast.error("Please select video files.");
      return;
    }

    const availableSlots = Math.max(12 - (overviewVideos || []).length, 0);
    if (availableSlots === 0) {
      toast.error("You can add up to 12 videos.");
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);
    setIsSavingVideos(true);
    setMediaSaveError(null);
    try {
      const uploadedUrls = await Promise.all(selectedFiles.map(fileToDataUrl));
      const updated = [
        ...(overviewVideos || []).map((item) => item.url),
        ...uploadedUrls,
      ].filter((url, index, arr) => url && arr.indexOf(url) === index);
      await saveOverviewVideosApi(updated);
      await refreshOverviewMediaWithFallback({ fallbackVideos: updated });
      toast.success(`${selectedFiles.length} video(s) uploaded`);
      if (files.length > selectedFiles.length) {
        toast.error("Some videos were skipped because the limit is 12.");
      }
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to upload videos.");
    } finally {
      setIsSavingVideos(false);
    }
  };

  const handleDeleteVideo = async (index: number) => {
    const media = (overviewVideos || [])[index];
    setIsSavingVideos(true);
    setMediaSaveError(null);
    try {
      if (media?.id) {
        await deleteExtraFieldFromApi(media.id);
      } else {
        const updated = (overviewVideos || [])
          .filter((_, i) => i !== index)
          .map((item) => item.url);
        await saveOverviewVideosApi(updated);
      }
      setOverviewVideos((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      setMediaSaveError(err.message || "Failed to delete video.");
    } finally {
      setIsSavingVideos(false);
    }
  };

  // ── Modal openers ──
  const openTopModal = (modalName: string) => {
    if (modalName === "purpose") {
      setTempPurposeText(purposeText);
      setTempPurposeVideoUrl(purposeVideoUrl);
      setPurposeSaveError(null);
    } else if (modalName === "core") {
      setTempCoreValues((coreValues || []).map((v) => ({ ...v })));
      setTempCoreVideoUrl(coreVideoUrl);
      setCoreSaveError(null);
      setPendingCoreDeleteIds([]);
    } else if (modalName === "brand") {
      setTempBrandPromises(
        (brandPromises || []).map((p) => ({ ...p, kpis: [...(p.kpis || [])] }))
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
        setPurposeText(trimmedText);
        setPurposeVideoUrl(trimmedVideo);
        setPurposeRecordId(resObj.recordId || purposeRecordId);
        setActiveTopModal(null);
      }
    } catch (err: any) {
      setPurposeSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingPurpose(false);
    }
  };

  const saveCoreValues = async () => {
    const filtered = (tempCoreValues || []).filter(
      (v) => v.value.trim() !== ""
    );
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
        setCoreValues(
          filtered.map((v, i) => ({ ...v, id: resObj.values[i]?.id ?? v.id }))
        );
        setCoreVideoUrl(tempCoreVideoUrl);
      } else {
        setCoreValues([]);
        setCoreVideoUrl(tempCoreVideoUrl);
      }
      setActiveTopModal(null);
    } catch (err: any) {
      setCoreSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingCore(false);
    }
  };

  const saveBrandPromises = async () => {
    const filtered = (tempBrandPromises || []).filter(
      (p) => p.text.trim() !== ""
    );
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
        await saveBrandPromisesToApi(filtered, tempBrandVideoUrl);
        setBrandPromises(
          filtered.map((p) => ({ ...p, kpis: [...(p.kpis || [])] }))
        );
        setBrandVideoUrl(tempBrandVideoUrl);
      } else {
        await saveBrandPromisesToApi([], tempBrandVideoUrl);
        setBrandPromises([]);
        setBrandVideoUrl(tempBrandVideoUrl);
      }
      setActiveTopModal(null);
    } catch (err: any) {
      setBrandSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSavingBrand(false);
    }
  };

  // ── Brand promise handlers ──
  const handleBrandPromiseChange = (index: number, value: string) => {
    const updated = [...(tempBrandPromises || [])];
    updated[index] = { ...updated[index], text: value };
    setTempBrandPromises(updated);
  };
  const handleDeleteBrandPromise = (index: number) => {
    const promise = tempBrandPromises[index];
    if (promise && promise.id !== null)
      setPendingDeleteIds((prev) => [...prev, promise.id as number]);
    setTempBrandPromises(
      (tempBrandPromises || []).filter((_, i) => i !== index)
    );
  };
  const handleAddBrandPromise = () =>
    setTempBrandPromises([
      ...(tempBrandPromises || []),
      { id: null, text: "", kpis: [] },
    ]);
  const handleAddKpiToBrandPromise = (promiseIndex: number, kpi: string) => {
    if (!kpi) return;
    const updated = [...(tempBrandPromises || [])];
    if (!updated[promiseIndex]) return;
    const current = updated[promiseIndex].kpis || [];
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
    const updated = [...(tempBrandPromises || [])];
    if (!updated[promiseIndex]) return;
    updated[promiseIndex] = {
      ...updated[promiseIndex],
      kpis: (updated[promiseIndex].kpis || []).filter((k) => k !== kpi),
    };
    setTempBrandPromises(updated);
  };

  // ── Brand Drag & Drop ──
  const onDragStartBrand = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    dragBrandItem.current = position;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEnterBrand = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.preventDefault();
    dragBrandOverItem.current = position;
    setDragBrandOverIdx(position);
  };
  const onDragEndBrand = () => {
    if (dragBrandItem.current !== null && dragBrandOverItem.current !== null) {
      const copy = [...(tempBrandPromises || [])];
      const item = copy[dragBrandItem.current];
      copy.splice(dragBrandItem.current, 1);
      copy.splice(dragBrandOverItem.current, 0, item);
      dragBrandItem.current = null;
      dragBrandOverItem.current = null;
      setDragBrandOverIdx(null);
      setTempBrandPromises(copy);
    }
  };

  // ── Core value handlers ──
  const handleCoreValueChange = (index: number, value: string) => {
    const updated = [...(tempCoreValues || [])];
    updated[index] = { ...updated[index], value };
    setTempCoreValues(updated);
  };
  const handleDeleteCoreValue = (index: number) => {
    const item = tempCoreValues[index];
    if (item && item.id !== null)
      setPendingCoreDeleteIds((prev) => [...prev, item.id as number]);
    setTempCoreValues((tempCoreValues || []).filter((_, i) => i !== index));
  };
  const handleAddCoreValue = () =>
    setTempCoreValues([...(tempCoreValues || []), { id: null, value: "" }]);

  // ── Core Drag & Drop ──
  const onDragStartCore = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    dragCoreItem.current = position;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEnterCore = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.preventDefault();
    dragCoreOverItem.current = position;
    setDragCoreOverIdx(position);
  };
  const onDragEndCore = () => {
    if (dragCoreItem.current !== null && dragCoreOverItem.current !== null) {
      const copy = [...(tempCoreValues || [])];
      const item = copy[dragCoreItem.current];
      copy.splice(dragCoreItem.current, 1);
      copy.splice(dragCoreOverItem.current, 0, item);
      dragCoreItem.current = null;
      dragCoreOverItem.current = null;
      setDragCoreOverIdx(null);
      setTempCoreValues(copy);
    }
  };

  const isSavingAny =
    (activeTopModal === "brand" && isSavingBrand) ||
    (activeTopModal === "purpose" && isSavingPurpose) ||
    (activeTopModal === "core" && isSavingCore);

  const tabs = [
    { key: "strategic", label: "Strategic Plan" },
    { key: "goals", label: "Goals" },
  ];

  const Shimmer = ({ w = "100%", h = 16 }: { w?: string; h?: number }) => (
    <div
      className="animate-pulse rounded-xl"
      style={{ width: w, height: h, background: "#e5e1d8" }}
    />
  );

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
      <span className="text-[13px] font-bold" style={{ color: C.primary }}>
        {label}
      </span>
    </button>
  );

  return (
    <div
      className="bp-wrap min-h-screen px-4 py-5 md:px-8 md:py-8 w-full mx-auto space-y-6"
      style={{ background: C.pageBg, color: C.textMain, fontFamily: C.font }}
    >
      <ThemeStyle />
      {/* ── Page Header ── */}
      <div
        className="bg-white border rounded-[16px] px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm mb-4"
        style={{ borderColor: C.primaryBord }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            {/* Target / Bullseye Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ color: "#8a8a8a" }}
            >
              Strategic overview and goals alignment
            </p>
          </div>
          <h1
            className="bp-heading text-[20px] font-bold tracking-tight leading-tight"
            style={{ color: C.primary, fontFamily: C.font }}
          >
            Business Plan
          </h1>
          <p
            className="text-[12px] font-medium"
            style={{ color: "#8a8a8a" }}
          >
            {getSelectedOrgName()}
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {/* Copy icon */}
          <button
            onClick={handleCopyPlan}
            disabled={isCopyingPlan}
            title="Copy Plan"
            className="flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-50"
            style={{ color: C.primary }}
          >
            {isCopyingPlan ? (
              <LoaderIcon />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>

          {/* Create with AI button - matched to reference image, original size retained */}
          <div
            className="relative group"
            style={{ filter: "drop-shadow(0 10px 18px rgba(218,119,86,0.13))" }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, #ff9a71 0%, #ffd7a7 42%, #c8c9ff 100%)",
                opacity: 0.95,
                transition: "opacity .15s, filter .15s",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: 18,
                background:
                  "radial-gradient(circle at 22% 50%, rgba(218,119,86,0.18), transparent 48%), radial-gradient(circle at 88% 80%, rgba(155,133,255,0.14), transparent 44%)",
                filter: "blur(10px)",
                opacity: 0.8,
                pointerEvents: "none",
              }}
            />
            <button
              onClick={openAiBuilder}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-[0.97]"
              style={{
                color: C.primary,
                fontFamily: C.font,
                background:
                  "linear-gradient(180deg, rgba(255,250,246,0.98) 0%, rgba(255,255,255,0.94) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 4px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: C.primary, flexShrink: 0 }}
                aria-hidden="true"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <path d="M20 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M22 5h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M4 17v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M5 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              Create with Ai
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div
        className="bg-white flex w-fit max-w-full rounded-full p-1.5 gap-1 overflow-x-auto shadow-sm mb-6 border"
        style={{ borderColor: "#f3f4f6" }}
      >
        {tabs.map((tab) => {
          const isActive = activeMainTab === tab.key;
          // Format label strictly as "Strategic plan" like the image
          const label = tab.key === "strategic" ? "Strategic plan" : tab.label;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveMainTab(tab.key)}
              className={`py-2 px-8 rounded-full text-[13px] font-bold transition-all duration-150 whitespace-nowrap`}
              style={{
                background: isActive ? C.primary : "transparent",
                color: isActive ? "#fff" : "#7b8393"
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {/* ── Tab Bar ── */}


      {/* ══ STRATEGIC PLAN ══ */}
      {activeMainTab === "strategic" && (
        <div className="space-y-6">
          {/* Our Business Plan + Media Section */}
          <div className="overflow-hidden rounded-[20px] border border-[#e8e3de] bg-white shadow-[0_10px_24px_rgba(26,26,26,0.05)]">
            {/* Compact Header */}
            <div className="flex items-center justify-between gap-4 border-b border-[#eee3dd] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#f7f7f7]">
                  <EyeIcon color="#ff6b4a" />
                </div>

                <div className="min-w-0">
                  <span className="block text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#070707]">
                    Our Business Plan
                  </span>
                  <p className="mt-0.5 text-[10px] font-semibold text-[#6b7280]">
                    Add images and explainer videos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <BtnIcon
                    title="Info"
                    onMouseEnter={() => {
                      if (infoBtnRef.current) {
                        const rect = infoBtnRef.current.getBoundingClientRect();
                        setInfoPos({
                          top: rect.bottom + window.scrollY + 10,
                          right: window.innerWidth - rect.right - window.scrollX,
                        });
                      }
                      setIsInfoHovered(true);
                    }}
                    onMouseLeave={() => setIsInfoHovered(false)}
                  >
                    <span ref={infoBtnRef}>
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
                    </span>
                  </BtnIcon>

                  {isInfoHovered &&
                    ReactDOM.createPortal(
                      <div
                        style={{
                          position: "absolute",
                          top: infoPos.top,
                          right: infoPos.right,
                          zIndex: 99999,
                          background: "#16102b",
                          color: "#fff",
                          borderRadius: 16,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                          padding: "20px",
                          width: 380,
                          fontFamily: "'Poppins', sans-serif",
                          pointerEvents: "none",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 16px 0",
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#e2baff",
                            textAlign: "center",
                          }}
                        >
                          How to Create Business Plan Infographics
                        </h4>
                        <ol
                          style={{
                            paddingLeft: 16,
                            margin: 0,
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "#d1d5db",
                            listStyleType: "decimal",
                          }}
                        >
                          <li style={{ marginBottom: 12 }}>
                            First, complete your business plan sections above
                            (Core Values, Purpose, Brand Promises, BHAG, Goals,
                            etc.)
                          </li>
                          <li style={{ marginBottom: 12 }}>
                            Click the{" "}
                            <strong style={{ color: "#fff" }}>'Copy Text'</strong>{" "}
                            button at the top of the page to copy your plan
                          </li>
                          <li style={{ marginBottom: 12 }}>
                            Go to{" "}
                            <strong style={{ color: "#fff" }}>
                              gemini.google.com
                            </strong>
                          </li>
                          <li style={{ marginBottom: 12 }}>
                            Use this prompt:
                            <div
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                padding: "10px",
                                borderRadius: 8,
                                marginTop: 6,
                                fontStyle: "italic",
                                border: "1px solid rgba(255,255,255,0.15)",
                              }}
                            >
                              "Create an infographic for the business plan of my
                              company in landscape mode (red, black & white
                              colors) from the plan given below: &lt;paste your
                              business plan here&gt;"
                            </div>
                          </li>
                          <li>
                            Download the generated infographic and add it here
                            using the image URL or upload feature
                          </li>
                        </ol>
                      </div>,
                      document.body
                    )}
                </div>

                <BtnIcon onClick={() => setShowAddContent(!showAddContent)}>
                  <ChevronIcon isExpanded={showAddContent} />
                </BtnIcon>
              </div>
            </div>

            {/* Image / Video Content - attached to header without gap */}
            {showAddContent && (
              <div className="px-4 pb-4 pt-3">
                <div className="mb-4 flex rounded-2xl border border-[#eee3dd] bg-[#f7f1ed] p-1">
                  {["Business Plan", "VisionBoard"].map((t) => {
                    const isActive = addContentTab === t;

                    return (
                      <button
                        key={t}
                        onClick={() => setAddContentTab(t)}
                        className={`flex-1 rounded-xl px-4 py-2 text-[13px] font-extrabold capitalize transition-all duration-200 ${isActive
                          ? "bg-[#DA7756] text-white shadow-[0_8px_16px_rgba(218,119,86,0.22)]"
                          : "text-[#6b7280] hover:bg-white hover:text-[#DA7756]"
                          }`}
                      >
                        {t === "Business Plan" ? "Business Plan" : "VisionBoard"}
                      </button>
                    );
                  })}
                </div>

                {mediaSaveError && (
                  <div className="bp-error-banner mb-4">{mediaSaveError}</div>
                )}

                {mediaFetchError && (
                  <div className="bp-error-banner mb-4 flex items-center justify-between">
                    <span>{mediaFetchError}</span>
                    <button
                      onClick={loadOverviewMedia}
                      className="underline ml-3 shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                )}

                   {addContentTab === "Business Plan" && (
                  <div>
                    {/* ── Strategic Essentials ── */}
                    <div className="rounded-[22px] border border-[#e8e3de] bg-white shadow-[0_10px_26px_rgba(26,26,26,0.045)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ebe6] px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#f7f7f7] text-[#ff6b4a]">
                            <svg
                              className="h-[18px] w-[18px]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </div>

                          <div>
                            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#070707]">
                              Strategic Essentials
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-[#6b7280]">
                              Values, purpose and promises that define your strategy.
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full border border-[#eee3dd] bg-[#fafafa] px-3 py-1 text-[11px] font-extrabold text-[#6b7280]">
                          3 essentials
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3 sm:p-5">
                        {/* Core Values */}
                        <div className="group flex min-h-[178px] flex-col rounded-[18px] border border-[#ece7e1] bg-[#fbfbfb] p-4 shadow-[0_8px_18px_rgba(26,26,26,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ddd6cf] hover:bg-white hover:shadow-[0_14px_28px_rgba(26,26,26,0.07)]">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff6b4a] shadow-sm ring-1 ring-[#f0ebe6]">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75 9 17.25 19.5 6.75"
                                  />
                                </svg>
                              </div>

                              <h3 className="bp-heading flex items-center gap-1.5 text-[14px] font-semibold">
                                Core Values
                                <span
                                  onMouseEnter={(e) => handleCardInfoEnter(e, "core")}
                                  onMouseLeave={() => setActiveCardInfo(null)}
                                  className="cursor-help"
                                >
                                  <InfoIcon />
                                </span>
                              </h3>
                            </div>

                            <button
                              onClick={() => openTopModal("core")}
                              className="rounded-xl p-2 text-[#9ca3af] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#DA7756] active:scale-95"
                              title="Edit core values"
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
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-semibold text-red-600">
                              ⚠ {coreFetchError}{" "}
                              <button onClick={loadCoreValues} className="underline">
                                Retry
                              </button>
                            </div>
                          ) : (coreValues || []).length === 0 && !coreVideoUrl ? (
                            <div className="flex flex-col gap-3">
                              {emptyAddBtn(() => openTopModal("core"), "Add Core Values")}
                            </div>
                          ) : (
                            <div className="flex h-full flex-col">
                              {coreVideoUrl && <VideoPreview url={coreVideoUrl} />}
                              {(coreValues || []).length === 0 ? (
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
                        <div className="group flex min-h-[178px] flex-col rounded-[18px] border border-[#ece7e1] bg-[#fbfbfb] p-4 shadow-[0_8px_18px_rgba(26,26,26,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ddd6cf] hover:bg-white hover:shadow-[0_14px_28px_rgba(26,26,26,0.07)]">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff6b4a] shadow-sm ring-1 ring-[#f0ebe6]">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </div>

                              <h3 className="bp-heading flex items-center gap-1.5 text-[14px] font-semibold">
                                Purpose
                                <span
                                  onMouseEnter={(e) => handleCardInfoEnter(e, "purpose")}
                                  onMouseLeave={() => setActiveCardInfo(null)}
                                  className="cursor-help"
                                >
                                  <InfoIcon />
                                </span>
                              </h3>
                            </div>

                            <button
                              onClick={() => openTopModal("purpose")}
                              className="rounded-xl p-2 text-[#9ca3af] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#DA7756] active:scale-95"
                              title="Edit purpose"
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
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-semibold text-red-600">
                              ⚠ {purposeFetchError}{" "}
                              <button onClick={loadPurpose} className="underline">
                                Retry
                              </button>
                            </div>
                          ) : !purposeText && !purposeVideoUrl ? (
                            emptyAddBtn(() => openTopModal("purpose"), "Add Purpose")
                          ) : (
                            <div className="flex h-full flex-col">
                              {purposeVideoUrl && <VideoPreview url={purposeVideoUrl} />}
                              {purposeText ? (
                                <p className="rounded-2xl bg-white p-3 text-[13px] font-semibold leading-relaxed text-[#DA7756] ring-1 ring-[#f0ebe6]">
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
                        <div className="group flex min-h-[178px] flex-col rounded-[18px] border border-[#ece7e1] bg-[#fbfbfb] p-4 shadow-[0_8px_18px_rgba(26,26,26,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ddd6cf] hover:bg-white hover:shadow-[0_14px_28px_rgba(26,26,26,0.07)]">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff6b4a] shadow-sm ring-1 ring-[#f0ebe6]">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.75.75 0 0 1 1.04 0l2.125 2.04 2.948-.415a.75.75 0 0 1 .816.816l-.415 2.948 2.04 2.125a.75.75 0 0 1 0 1.04l-2.04 2.125.415 2.948a.75.75 0 0 1-.816.816l-2.948-.415-2.125 2.04a.75.75 0 0 1-1.04 0l-2.125-2.04-2.948.415a.75.75 0 0 1-.816-.816l.415-2.948-2.04-2.125a.75.75 0 0 1 0-1.04l2.04-2.125-.415-2.948a.75.75 0 0 1 .816-.816l2.948.415 2.125-2.04Z"
                                  />
                                </svg>
                              </div>

                              <h3 className="bp-heading flex items-center gap-1.5 text-[14px] font-semibold">
                                Brand Promises
                                <span
                                  onMouseEnter={(e) => handleCardInfoEnter(e, "brand")}
                                  onMouseLeave={() => setActiveCardInfo(null)}
                                  className="cursor-help"
                                >
                                  <InfoIcon />
                                </span>
                              </h3>
                            </div>

                            <button
                              onClick={() => openTopModal("brand")}
                              className="rounded-xl p-2 text-[#9ca3af] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#DA7756] active:scale-95"
                              title="Edit brand promises"
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
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-semibold text-red-600">
                              ⚠ {brandFetchError}{" "}
                              <button onClick={loadBrandPromises} className="underline">
                                Retry
                              </button>
                            </div>
                          ) : (brandPromises || []).length === 0 && !brandVideoUrl ? (
                            emptyAddBtn(() => openTopModal("brand"), "Add Promise")
                          ) : (
                            <div className="flex h-full flex-col">
                              {brandVideoUrl && <VideoPreview url={brandVideoUrl} />}
                              {(brandPromises || []).length === 0 ? (
                                <div>
                                  {emptyAddBtn(
                                    () => openTopModal("brand"),
                                    "Add Promise"
                                  )}
                                </div>
                              ) : (
                                <ul className="space-y-2.5 text-[12px] text-[#6b7280]">
                                  {(brandPromises || []).map((p, idx) => (
                                    <li
                                      key={p.id ?? idx}
                                      className="flex items-start rounded-2xl bg-white p-3 ring-1 ring-[#f0ebe6]"
                                    >
                                      <span className="mr-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b4a]" />
                                      <div>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: (p.text || "").replace(
                                              /([^-]+)/,
                                              `<strong style="color:${C.textMain};font-weight:800;">$1</strong>`
                                            ),
                                          }}
                                        />
                                        {p.kpis && p.kpis.length > 0 ? (
                                          <p className="mt-0.5 text-[11px] text-gray-400">
                                            {p.kpis.join(", ")}
                                          </p>
                                        ) : (
                                          <p className="mt-0.5 text-[11px] italic text-gray-400">
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

                    {/* Render Active Tooltip for 3 Cards */}
                    {activeCardInfo &&
                      ReactDOM.createPortal(
                        <div
                          style={{
                            position: "absolute",
                            top: cardInfoCoords.top,
                            left: cardInfoCoords.left,
                            transform: cardInfoCoords.transform,
                            zIndex: 99999,
                            background: "#16102b",
                            color: "#fff",
                            borderRadius: 12,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                            padding: "16px",
                            width: 300,
                            textAlign: "center",
                            fontFamily: "'Poppins', sans-serif",
                            pointerEvents: "none",
                          }}
                        >
                          <h4
                            style={{
                              margin: "0 0 10px 0",
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
                            {activeCardInfo && TOOLTIP_CONTENT[activeCardInfo]
                              ? TOOLTIP_CONTENT[activeCardInfo].title
                              : ""}
                          </h4>
                          <p
                            style={{
                              margin: "0 0 10px 0",
                              fontSize: 12,
                              lineHeight: 1.5,
                              color: "#d1d5db",
                            }}
                          >
                            {activeCardInfo && TOOLTIP_CONTENT[activeCardInfo]
                              ? TOOLTIP_CONTENT[activeCardInfo].desc
                              : ""}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              fontStyle: "italic",
                              color: "#d1d5db",
                            }}
                          >
                            {activeCardInfo && TOOLTIP_CONTENT[activeCardInfo]
                              ? TOOLTIP_CONTENT[activeCardInfo].example
                              : ""}
                          </p>
                        </div>,
                        document.body
                      )}

                    {/* Sub-sections */}
                    <BhagSection />
                    <GoalsPage />
                    <SWOTAnalysis />
                    <CriticalNumbers />
                    <KeyProcessesSection />
                  </div>
                )}

                {addContentTab === "VisionBoard" && (
                  <div>
                    <div className="mb-3 flex gap-2 max-sm:flex-col">
                      <input
                        ref={overviewImageUploadRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleUploadOverviewImages}
                      />

                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddImage()}
                        placeholder="Paste image URL or Google Drive link..."
                        className="min-h-[40px] flex-1 rounded-xl border border-[#e5e7eb] bg-[#fffaf8] px-3 py-2 text-[13px] font-semibold text-[#1a1a1a] outline-none transition-all placeholder:text-[#a3a3a3] placeholder:font-medium focus:border-[#DA7756] focus:ring-4 focus:ring-[#DA7756]/15 disabled:opacity-60"
                        disabled={isSavingImages}
                      />

                      <button
                        onClick={handleAddImage}
                        disabled={isSavingImages || !newImageUrl.trim()}
                        className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#e8e3de] bg-[#fdf9f7] px-4 py-2 text-[13px] font-extrabold text-[#c9673f] transition-all duration-150 hover:border-[#d4cdc6] hover:bg-[#fff3ed] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSavingImages ? <LoaderIcon /> : "+ Add"}
                      </button>

                      <button
                        onClick={() => overviewImageUploadRef.current?.click()}
                        disabled={isSavingImages}
                        className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#e8e3de] bg-white px-4 py-2 text-[13px] font-extrabold text-[#c9673f] transition-all duration-150 hover:border-[#d4cdc6] hover:bg-[#fdf9f7] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSavingImages ? <LoaderIcon /> : "Upload"}
                      </button>
                    </div>

                    <p className="mb-4 text-[11px] font-bold text-[#6b7280]">
                      {(overviewImages || []).length}/12 images
                    </p>

                    {isFetchingMedia ? (
                      <div className="mb-5 h-[260px] w-full animate-pulse rounded-2xl bg-[#e5e1d8]" />
                    ) : (overviewImages || []).length === 0 ? (
                      <div className="mb-5 flex flex-col items-center rounded-[18px] border-2 border-dashed border-[#eadfd8] bg-gradient-to-br from-[#fffaf8] to-white px-5 py-8 text-center">
                        <ImagePlaceholder />
                        <p className="text-[13px] font-extrabold text-[#1a1a1a]">
                          No images added yet
                        </p>
                        <p className="mt-1 max-w-[360px] text-[11px] font-semibold leading-5 text-[#6b7280]">
                          Paste an image URL, upload an image, or generate an AI
                          infographic prompt.
                        </p>
                      </div>
                    ) : (
                      <InlineImageSlider
                        images={(overviewImages || []).map((item) => item.url)}
                        onDelete={handleDeleteImage}
                        isSaving={isSavingImages}
                      />
                    )}

                    <div className="mt-4 rounded-2xl border border-[#eee3dd] bg-[#fffaf8] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#DA7756]">
                            Generate with AI
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold text-[#6b7280]">
                            Copy ready-made prompt for infographic creation
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#c9673f] shadow-sm">
                          Prompt
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          onClick={() => setShowGenerateVisionBoardConfirm(true)}
                          disabled={isCopyingAiPrompt === "overview"}
                          className="group relative inline-flex min-h-[46px] items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#efd8cf] bg-gradient-to-br from-white to-[#fff3ed] px-4 py-3 text-[13px] font-extrabold text-[#c9673f] shadow-[0_10px_20px_rgba(218,119,86,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DA7756]/50 hover:shadow-[0_14px_26px_rgba(218,119,86,0.16)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                          <span className="relative z-10 flex items-center gap-2">
                            {isCopyingAiPrompt === "overview" ? (
                              <>
                                <LoaderIcon /> Generating...
                              </>
                            ) : (
                              <>
                                <span>✨</span>
                                <span>Generate Vision Board</span>
                              </>
                            )}
                          </span>
                        </button>

                        <button
                          onClick={() => handleCopyAiPrompt("detailed")}
                          disabled={isCopyingAiPrompt === "detailed"}
                          className="group relative inline-flex min-h-[46px] items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#efd8cf] bg-gradient-to-br from-white to-[#fff3ed] px-4 py-3 text-[13px] font-extrabold text-[#c9673f] shadow-[0_10px_20px_rgba(218,119,86,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DA7756]/50 hover:shadow-[0_14px_26px_rgba(218,119,86,0.16)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                          <span className="relative z-10 flex items-center gap-2">
                            {isCopyingAiPrompt === "detailed" ? (
                              <>
                                <LoaderIcon /> Copying...
                              </>
                            ) : (
                              <>
                                <span>🎨</span>
                                <span>Create Detailed Image</span>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

             
              </div>
            )}
          </div>


        </div>
      )}

      {activeMainTab === "goals" && <GoalsView />}

      {isAiBuilderOpen && (
        <Modal onClose={closeAiBuilder}>
          <div className="bp-modal-box" style={{ maxWidth: 760 }}>
            <div
              className="flex items-center justify-between gap-4 px-6 py-5 border-b"
              style={{ background: C.cardBg, borderColor: C.primaryBord }}
            >
              <div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: C.primary }}
                >
                  AI Plan Builder
                </div>
                <h2
                  className="bp-heading mt-1 text-[20px] font-semibold"
                  style={{ color: C.textMain }}
                >
                  Create Business Plan with A.I
                </h2>
              </div>
              <BtnIcon onClick={closeAiBuilder} title="Close">
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

            <div className="p-6 flex-1 overflow-y-auto bp-scroll">
              {aiBuilderStage === "discovery" && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h3 className="bp-heading text-lg font-bold" style={{ color: C.textMain }}>
                      Tell Us About Your Business
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: C.textMuted }}>
                      Provide your business details. The AI will use this to generate and enhance your business plan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Company Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={aiCompanyName}
                        onChange={(e) => setAiCompanyName(e.target.value)}
                        placeholder="Example: ABC Technologies Pvt. Ltd."
                        className="bp-input w-full"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Company Website</label>
                      <input
                        type="url"
                        value={aiCompanyWebsite}
                        onChange={(e) => setAiCompanyWebsite(e.target.value)}
                        placeholder="https://www.abc.com"
                        className="bp-input w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Industry Category <span className="text-red-500">*</span></label>
                      <select
                        value={aiIndustryCategory}
                        onChange={(e) => setAiIndustryCategory(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Industry</option>
                        {["Manufacturing", "SaaS", "Retail", "Healthcare", "Education", "Construction", "Logistics", "Financial Services", "Hospitality", "Consulting", "Other"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {aiIndustryCategory === "Other" && (
                      <div>
                        <label className="mb-1 block text-[13px] font-bold text-gray-700">Please specify your industry <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={aiIndustryOther}
                          onChange={(e) => setAiIndustryOther(e.target.value)}
                          className="bp-input w-full"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Business Stage <span className="text-red-500">*</span></label>
                      <select
                        value={aiBusinessStage}
                        onChange={(e) => setAiBusinessStage(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Stage</option>
                        {["Startup", "Early Stage", "Small Business", "Growth Stage", "Mid-Sized Company", "Enterprise"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Years in Operation <span className="text-red-500">*</span></label>
                      <select
                        value={aiYearsInOperation}
                        onChange={(e) => setAiYearsInOperation(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Years</option>
                        {["Less than 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "10+ Years"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Team Size <span className="text-red-500">*</span></label>
                      <select
                        value={aiTeamSize}
                        onChange={(e) => setAiTeamSize(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Size</option>
                        {["1–10", "11–50", "51–200", "201–500", "500+"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Annual Revenue Range <span className="text-red-500">*</span></label>
                      <select
                        value={aiAnnualRevenue}
                        onChange={(e) => setAiAnnualRevenue(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Revenue</option>
                        {["Pre-Revenue", "Less than ₹50 Lakhs", "₹50 Lakhs – ₹5 Crores", "₹5 Crores – ₹50 Crores", "₹50 Crores – ₹500 Crores", "₹500 Crores+"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[13px] font-bold text-gray-700">Current Geographic Reach <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-4">
                        {["Local", "Regional", "National", "International"].map(opt => (
                          <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={aiGeographicReach.includes(opt)}
                              onChange={(e) => {
                                if (e.target.checked) setAiGeographicReach([...aiGeographicReach, opt]);
                                else setAiGeographicReach(aiGeographicReach.filter(v => v !== opt));
                              }}
                              className="rounded border-gray-300 text-[#DA7756] focus:ring-[#DA7756]"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[13px] font-bold text-gray-700">Market Position <span className="text-red-500">*</span></label>
                      <select
                        value={aiMarketPosition}
                        onChange={(e) => setAiMarketPosition(e.target.value)}
                        className="bp-select w-full"
                      >
                        <option value="">Select Position</option>
                        {["Just Starting Out", "Small Local Business", "Growing Business", "Established Business", "Industry Leader"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {aiBuilderStage === "questions" && (
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span style={{ color: C.textMuted }}>
                        Question {aiQuestionIndex + 1} of {AI_PLAN_FIELDS.length}
                      </span>
                      <span style={{ color: C.primary }}>
                        {Math.round(
                          ((aiQuestionIndex + 1) / AI_PLAN_FIELDS.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${((aiQuestionIndex + 1) / AI_PLAN_FIELDS.length) * 100}%`,
                          background: C.primary,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                    style={{ borderColor: C.primaryBord }}
                  >
                    <label
                      className="mb-3 block text-[15px] font-semibold leading-snug"
                      style={{ color: C.textMain }}
                    >
                      {AI_PLAN_FIELDS[aiQuestionIndex].label}
                    </label>
                    <textarea
                      value={aiAnswers[aiQuestionIndex]}
                      onChange={(e) => updateAiAnswer(e.target.value)}
                      className="bp-input resize-y text-[12px]"
                      style={{ minHeight: 150 }}
                      placeholder={AI_PLAN_FIELDS[aiQuestionIndex].placeholder}
                      autoFocus
                    />
                    {aiAnswers[aiQuestionIndex]?.trim() && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleAiSuggest}
                          disabled={isSuggestingAi}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-150 active:scale-[0.97] border"
                          style={{
                            background: C.primaryTint,
                            borderColor: C.primaryBord,
                            color: C.primaryHov,
                            fontFamily: C.font,
                            opacity: isSuggestingAi ? 0.6 : 1,
                          }}
                        >
                          {isSuggestingAi ? (
                            <>
                              <LoaderIcon /> Re-writing...
                            </>
                          ) : (
                            "✨ Re-write with AI"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {aiBuilderStage === "building" && (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ background: C.primaryBg, color: C.primary }}
                  >
                    <LoaderIcon className="w-8 h-8" />
                  </div>
                  <h3 className="bp-heading text-xl font-semibold" style={{ color: C.textMain }}>
                    Building your AI plan
                  </h3>
                  <p
                    className="mt-2 max-w-md text-sm font-semibold"
                    style={{ color: C.textMuted }}
                  >
                    Creating a polished business plan from your answers.
                  </p>
                </div>
              )}

              {aiBuilderStage === "plan" && (
                <div
                  className="rounded-2xl border bg-white p-4"
                  style={{ borderColor: C.primaryBord }}
                >
                  <h3
                    className="bp-heading text-base font-semibold"
                    style={{ color: C.textMain }}
                  >
                    Generated Business Plan
                  </h3>
                  <p
                    className="mb-3 text-xs font-semibold"
                    style={{ color: C.textMuted }}
                  >
                    Review the plan before saving or downloading.
                  </p>
                  {hasStructuredAiPlan ? (
                    <div className="bp-scroll max-h-[430px] space-y-4 overflow-y-auto pr-1">
                      {aiPlanDisplay.purpose &&
                        renderAiPlanSection(
                          "Purpose",
                          <p className="text-[13px] font-semibold leading-relaxed" style={{ color: C.textMain }}>
                            {aiPlanDisplay.purpose}
                          </p>
                        )}

                      {(Array.isArray(aiPlanDisplay.core_values) ||
                        aiPlanDisplay.core_values_explanation) &&
                        renderAiPlanSection(
                          "Core Values",
                          <div className="space-y-3">
                            {Array.isArray(aiPlanDisplay.core_values) &&
                              renderAiPlanStringList(aiPlanDisplay.core_values)}
                            {aiPlanDisplay.core_values_explanation && (
                              <p className="text-[13px] font-semibold leading-relaxed" style={{ color: C.textMain }}>
                                {aiPlanDisplay.core_values_explanation}
                              </p>
                            )}
                          </div>
                        )}

                      {(Array.isArray(aiPlanDisplay.brand_promises) ||
                        Array.isArray(
                          aiPlanDisplay.brand_promise_kpis ||
                          aiPlanDisplay["brand Promise KPIs"]
                        )) &&
                        renderAiPlanSection(
                          "Brand Promises",
                          <div className="space-y-3">
                            {Array.isArray(aiPlanDisplay.brand_promises) &&
                              renderAiPlanStringList(aiPlanDisplay.brand_promises)}
                            {Array.isArray(
                              aiPlanDisplay.brand_promise_kpis ||
                              aiPlanDisplay["brand Promise KPIs"]
                            ) && (
                                <div>
                                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                    KPIs
                                  </p>
                                  {renderAiPlanStringList(
                                    aiPlanDisplay.brand_promise_kpis ||
                                    aiPlanDisplay["brand Promise KPIs"]
                                  )}
                                </div>
                              )}
                          </div>
                        )}

                      {(aiPlanDisplay.target_segments ||
                        aiPlanDisplay.bhag_selected) &&
                        renderAiPlanSection(
                          "Strategic Direction",
                          <div className="space-y-3">
                            {aiPlanDisplay.target_segments && (
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                  Target Segments
                                </p>
                                <p className="mt-1 text-[13px] font-semibold" style={{ color: C.textMain }}>
                                  {aiPlanDisplay.target_segments}
                                </p>
                              </div>
                            )}
                            {aiPlanDisplay.bhag_selected && (
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                  BHAG
                                </p>
                                <p className="mt-1 text-[13px] font-semibold" style={{ color: C.textMain }}>
                                  {aiPlanDisplay.bhag_selected}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                      {Array.isArray(aiPlanDisplay.bhag_alternatives) &&
                        aiPlanDisplay.bhag_alternatives.length > 0 &&
                        renderAiPlanSection(
                          "BHAG Alternatives",
                          renderAiPlanObjectList(aiPlanDisplay.bhag_alternatives)
                        )}

                      {Array.isArray(aiPlanDisplay.bhag_initiatives) &&
                        aiPlanDisplay.bhag_initiatives.length > 0 &&
                        renderAiPlanSection(
                          "BHAG Initiatives",
                          renderAiPlanObjectList(aiPlanDisplay.bhag_initiatives)
                        )}

                      {(aiPlanDisplay.three_year_goals ||
                        Array.isArray(aiPlanDisplay.three_year_initiatives)) &&
                        renderAiPlanSection(
                          "Three Year Plan",
                          <div className="space-y-3">
                            {aiPlanDisplay.three_year_goals && (
                              <p className="text-[13px] font-semibold" style={{ color: C.textMain }}>
                                {aiPlanDisplay.three_year_goals}
                              </p>
                            )}
                            {Array.isArray(aiPlanDisplay.three_year_initiatives) &&
                              renderAiPlanObjectList(aiPlanDisplay.three_year_initiatives)}
                          </div>
                        )}

                      {(aiPlanDisplay.one_year_goals ||
                        Array.isArray(aiPlanDisplay.one_year_initiatives)) &&
                        renderAiPlanSection(
                          "One Year Plan",
                          <div className="space-y-3">
                            {aiPlanDisplay.one_year_goals && (
                              <p className="text-[13px] font-semibold" style={{ color: C.textMain }}>
                                {aiPlanDisplay.one_year_goals}
                              </p>
                            )}
                            {Array.isArray(aiPlanDisplay.one_year_initiatives) &&
                              renderAiPlanObjectList(aiPlanDisplay.one_year_initiatives)}
                          </div>
                        )}

                      {(aiPlanDisplay.quarterly_goals ||
                        aiPlanDisplay.quarterly_theme ||
                        Array.isArray(aiPlanDisplay.quarterly_initiatives) ||
                        Array.isArray(aiPlanDisplay.quarterly_rewards)) &&
                        renderAiPlanSection(
                          "Quarterly Plan",
                          <div className="space-y-3">
                            {aiPlanDisplay.quarterly_goals && (
                              <div>
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                  Goals
                                </p>
                                {renderAiPlanScalar(aiPlanDisplay.quarterly_goals)}
                              </div>
                            )}
                            {aiPlanDisplay.quarterly_theme && (
                              <p className="text-[13px] font-semibold" style={{ color: C.textMain }}>
                                Theme: {aiPlanDisplay.quarterly_theme}
                              </p>
                            )}
                            {Array.isArray(aiPlanDisplay.quarterly_initiatives) &&
                              renderAiPlanObjectList(aiPlanDisplay.quarterly_initiatives)}
                            {Array.isArray(aiPlanDisplay.quarterly_rewards) && (
                              <div>
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                  Rewards
                                </p>
                                {aiPlanDisplay.quarterly_rewards.some(
                                  (item: any) => item && typeof item === "object"
                                )
                                  ? renderAiPlanObjectList(aiPlanDisplay.quarterly_rewards)
                                  : renderAiPlanStringList(aiPlanDisplay.quarterly_rewards)}
                              </div>
                            )}
                          </div>
                        )}
                          {(["strengths", "weaknesses", "opportunities", "threats"] as const).some(
                        (key) => Array.isArray(aiPlanDisplay[key]) && aiPlanDisplay[key].length > 0
                      ) &&
                        renderAiPlanSection(
                          "SWOT",
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {(["strengths", "weaknesses", "opportunities", "threats"] as const).map(
                              (key) =>
                                Array.isArray(aiPlanDisplay[key]) &&
                                aiPlanDisplay[key].length > 0 && (
                                  <div key={key}>
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.textMuted }}>
                                      {key}
                                    </p>
                                    {renderAiPlanStringList(aiPlanDisplay[key])}
                                  </div>
                                )
                            )}
                          </div>
                        )}

                      {Array.isArray(aiPlanDisplay.critical_numbers) &&
                        aiPlanDisplay.critical_numbers.length > 0 &&
                        renderAiPlanSection(
                          "Critical Numbers",
                          renderAiPlanObjectList(aiPlanDisplay.critical_numbers)
                        )}

                      {(aiPlanDisplay.people_drivers ||
                        Array.isArray(aiPlanDisplay.process_drivers)) &&
                        renderAiPlanSection(
                          "Drivers",
                          <div className="space-y-3">
                            {aiPlanDisplay.people_drivers &&
                              typeof aiPlanDisplay.people_drivers === "object" &&
                              !Array.isArray(aiPlanDisplay.people_drivers) &&
                              renderAiPlanObjectList(
                                Object.entries(aiPlanDisplay.people_drivers).map(
                                  ([name, target]) => ({ name, target })
                                )
                              )}
                            {Array.isArray(aiPlanDisplay.process_drivers) &&
                              renderAiPlanStringList(aiPlanDisplay.process_drivers)}
                          </div>
                        )}

                    
                    </div>
                  ) : (
                    <pre
                      className="bp-scroll max-h-[430px] whitespace-pre-wrap rounded-xl p-4 text-[12px] font-semibold leading-relaxed"
                      style={{
                        background: C.primaryBg,
                        color: C.textMain,
                        border: `1px solid ${C.primaryBord}`,
                      }}
                    >
                      {generatedAiPlan}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-3 border-t p-5"
              style={{ background: C.cardBg, borderColor: C.primaryBord }}
            >
              {aiBuilderStage === "discovery" ? (
                <>
                  <BtnOutline onClick={closeAiBuilder}>Cancel</BtnOutline>
                  <button
                    disabled={isSubmittingProfile}
                    onClick={async () => {
                      if (!aiCompanyName || !aiIndustryCategory || !aiBusinessStage || !aiYearsInOperation || !aiTeamSize || !aiAnnualRevenue || aiGeographicReach.length === 0 || !aiMarketPosition) {
                        toast.error("Please fill all required fields before proceeding.");
                        return;
                      }
                      if (aiIndustryCategory === "Other" && !aiIndustryOther) {
                        toast.error("Please specify your industry.");
                        return;
                      }
                      if (aiCompanyWebsite) {
                        try {
                          new URL(aiCompanyWebsite);
                        } catch (_) {
                          toast.error("Please enter a valid Company Website URL.");
                          return;
                        }
                      }
                      setIsSubmittingProfile(true);
                      try {
                        const baseUrl = (API_CONFIG.BASE_URL || "").replace(/\/$/, "");
                        const res = await fetch(`${baseUrl}/ai_assist/business_profile`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: getAuthHeader(),
                          },
                          body: JSON.stringify({
                            company_name: aiCompanyName,
                            company_website: aiCompanyWebsite,
                            industry_category: aiIndustryCategory === "Other" ? aiIndustryOther : aiIndustryCategory,
                            business_stage: aiBusinessStage,
                            years_in_operation: aiYearsInOperation,
                            team_size: aiTeamSize,
                            annual_revenue_range: aiAnnualRevenue,
                            geographic_reach: aiGeographicReach.join(", "),
                            market_position: aiMarketPosition,
                          }),
                        });
                        if (!res.ok) {
                          const errText = await res.text().catch(() => "");
                          throw new Error(errText || `Request failed (${res.status})`);
                        }
                      } catch (err: any) {
                        toast.error(err?.message || "Failed to submit business profile.");
                        setIsSubmittingProfile(false);
                        return;
                      }
                      setIsSubmittingProfile(false);
                      setAiBuilderStage("questions");
                    }}
                    className="px-6 py-2 text-[13px] font-semibold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "#1a1a1a", fontFamily: C.font }}
                  >
                    {isSubmittingProfile ? "Saving..." : "Next"}
                  </button>
                </>
              ) : aiBuilderStage === "questions" ? (
                <>
                  <BtnOutline
                    onClick={() =>
                      aiQuestionIndex === 0
                        ? setAiBuilderStage("discovery")
                        : setAiQuestionIndex((idx) => idx - 1)
                    }
                  >
                    Back
                  </BtnOutline>
                  <button
                    onClick={goToNextAiQuestion}
                    className="px-6 py-2 text-[13px] font-semibold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97]"
                    style={{ background: "#1a1a1a", fontFamily: C.font }}
                  >
                    {aiQuestionIndex === AI_PLAN_FIELDS.length - 1
                      ? "Build AI Plan"
                      : "Next"}
                  </button>
                </>
              ) : aiBuilderStage === "building" ? (
                <>
                  <BtnOutline onClick={closeAiBuilder}>Cancel</BtnOutline>
                  <div
                    className="flex items-center justify-center gap-2 text-sm font-semibold"
                    style={{ color: C.primary }}
                  >
                    <LoaderIcon /> Generating plan...
                  </div>
                </>
              ) : (
                <>
                  <BtnOutline onClick={downloadAiPlan}>Download</BtnOutline>
                  <div className="flex gap-3">
                    <BtnOutline onClick={closeAiBuilder}>Close</BtnOutline>
                    <button
                      onClick={saveAiPlan}
                      disabled={isSavingAiPlan}
                      className="px-6 py-2 text-[13px] font-semibold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97]"
                      style={{ background: "#1a1a1a", fontFamily: C.font }}
                    >
                      {isSavingAiPlan ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODALS ══ */}
      {activeTopModal && (
        <Modal onClose={() => setActiveTopModal(null)}>
          <div className="bp-modal-box">
            {/* Header */}
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
                  className="bp-heading font-bold text-[17px] m-0"
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

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto bp-scroll">
              {/* Purpose */}
              {activeTopModal === "purpose" && (
                <div className="space-y-5">
                  {purposeSaveError && (
                    <div className="bp-error-banner">{purposeSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-bold mb-1.5"
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
                      className="block text-[12px] font-bold mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempPurposeVideoUrl}
                      onChange={(e) => setTempPurposeVideoUrl(e.target.value)}
                      placeholder="Paste YouTube Video URL..."
                      className="bp-input"
                    />
                  </div>
                </div>
              )}

              {/* Core Values */}
              {activeTopModal === "core" && (
                <div className="space-y-5">
                  {coreSaveError && (
                    <div className="bp-error-banner">{coreSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-bold mb-3"
                      style={{ color: C.textMain }}
                    >
                      Core Values
                    </label>
                    <div className="space-y-2.5 mb-3">
                      {(tempCoreValues || []).map((item, idx) => (
                        <div
                          key={item.id ?? idx}
                          draggable
                          onDragStart={(e) => onDragStartCore(e, idx)}
                          onDragEnter={(e) => onDragEnterCore(e, idx)}
                          onDragEnd={onDragEndCore}
                          onDragOver={(e) => e.preventDefault()}
                          className={`flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm transition-all ${dragCoreOverIdx === idx ? "drag-over" : ""}`}
                          style={{ borderColor: C.borderLgt, cursor: "grab" }}
                        >
                          <div className="shrink-0 p-1 rounded text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              handleCoreValueChange(idx, e.target.value)
                            }
                            className="flex-1 outline-none text-[13px] font-semibold bg-transparent cursor-text"
                            style={{ color: C.textMain }}
                            placeholder="Add core value"
                            autoFocus={
                              idx === (tempCoreValues || []).length - 1 &&
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
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-2xl transition-colors border-2 border-dashed mb-5"
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
                      className="block text-[12px] font-bold mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempCoreVideoUrl}
                      onChange={(e) => setTempCoreVideoUrl(e.target.value)}
                      placeholder="Paste YouTube Video URL..."
                      className="bp-input"
                    />
                  </div>
                </div>
              )}

              {/* Brand Promises */}
              {activeTopModal === "brand" && (
                <div className="space-y-5">
                  {brandSaveError && (
                    <div className="bp-error-banner">{brandSaveError}</div>
                  )}
                  <div>
                    <label
                      className="block text-[12px] font-bold mb-1.5"
                      style={{ color: C.textMain }}
                    >
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={tempBrandVideoUrl}
                      onChange={(e) => setTempBrandVideoUrl(e.target.value)}
                      placeholder="Paste YouTube Video URL..."
                      className="bp-input"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[12px] font-bold mb-3"
                      style={{ color: C.textMain }}
                    >
                      Promises
                    </label>
                    <div className="space-y-2.5 mb-3">
                      {(tempBrandPromises || []).map((item, idx) => (
                        <div
                          key={item.id ?? idx}
                          draggable
                          onDragStart={(e) => onDragStartBrand(e, idx)}
                          onDragEnter={(e) => onDragEnterBrand(e, idx)}
                          onDragEnd={onDragEndBrand}
                          onDragOver={(e) => e.preventDefault()}
                          className={`flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm transition-all ${dragBrandOverIdx === idx ? "drag-over" : ""}`}
                          style={{ borderColor: C.borderLgt, cursor: "grab" }}
                        >
                          <div className="shrink-0 p-1 rounded text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) =>
                              handleBrandPromiseChange(idx, e.target.value)
                            }
                            className="flex-1 outline-none text-[13px] font-semibold bg-transparent cursor-text"
                            style={{ color: C.textMain }}
                            placeholder="Add promise"
                            autoFocus={
                              idx === (tempBrandPromises || []).length - 1 &&
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
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-2xl transition-colors border-2 border-dashed mb-5"
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
                      className="block text-[12px] font-bold mb-3"
                      style={{ color: C.textMain }}
                    >
                      Link KPIs to Promises{" "}
                      <span className="font-semibold text-gray-400">
                        (Max 3 per promise)
                      </span>
                    </label>
                    <div className="max-h-[280px] overflow-y-auto bp-scroll space-y-3 pr-1">
                      {(tempBrandPromises || [])
                        .filter((p) => p.text.trim() !== "")
                        .map((item, idx) => (
                          <div
                            key={item.id ?? idx}
                            className="border p-4 rounded-2xl bg-white shadow-sm"
                            style={{ borderColor: C.borderLgt }}
                          >
                            <div
                              className="text-[13px] font-bold mb-3 leading-snug"
                              style={{ color: C.textMain }}
                            >
                              {item.text}
                            </div>
                            {item.kpis && item.kpis.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {item.kpis.map((kpi) => (
                                  <span
                                    key={kpi}
                                    className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full text-white"
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
                            {!item.kpis || item.kpis.length < 3 ? (
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
                                {(availableKpis || []).map((kpi) => (
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
                      {(tempBrandPromises || []).filter(
                        (p) => p.text.trim() !== ""
                      ).length === 0 && (
                          <p className="text-[13px] text-gray-400 italic">
                            Add promises above to link KPIs.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
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
                className="px-6 py-2 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97] flex items-center gap-2 disabled:opacity-60"
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

      {/* Generate Vision Board Confirmation */}
      {showGenerateVisionBoardConfirm && (
        <Modal onClose={() => setShowGenerateVisionBoardConfirm(false)}>
          <div className="bp-modal-box" style={{ maxWidth: 480 }}>
            <div className="p-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: C.primaryBg, color: C.primary }}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className="mb-2 text-xl font-bold"
                style={{ color: C.textMain }}
              >
                Generate AI Image
              </h2>
              <p
                className="mb-6 text-[13px] font-semibold leading-relaxed"
                style={{ color: C.textMuted }}
              >
                An existing Business Plan has been found.<br />
                The AI image will be generated using the current Business Plan.<br /><br />
                Would you like to continue with the current plan or update the plan before generating the image?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowGenerateVisionBoardConfirm(false);
                    handleCopyAiPrompt("overview");
                  }}
                  className="w-full rounded-xl py-3 text-[13px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: C.primary }}
                >
                  Generate Image Using Current Plan
                </button>
                <button
                  onClick={() => {
                    setShowGenerateVisionBoardConfirm(false);
                    openAiBuilder();
                  }}
                  className="w-full rounded-xl border py-3 text-[13px] font-bold transition-all hover:bg-gray-50 active:scale-[0.98]"
                  style={{ borderColor: C.primaryBord, color: C.textMain }}
                >
                  Review / Edit Business Plan
                </button>
                <button
                  onClick={() => setShowGenerateVisionBoardConfirm(false)}
                  className="w-full rounded-xl py-2 text-[13px] font-bold text-gray-500 transition-all hover:text-gray-700 active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BusinessPlanAndGoles;
