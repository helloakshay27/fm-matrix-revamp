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
import { toast } from "sonner";

// ── Design Tokens ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#F6F4EE",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#ffffff",
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
  try { json = JSON.parse(rawText); } catch { json = []; }
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
  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
};

const deleteExtraFieldFromApi = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/extra_fields/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const rawText = await res.text();
    throw new Error(`Delete API error ${res.status}: ${rawText || res.statusText}`);
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
  try { json = JSON.parse(rawText); } catch { json = {}; }
  return parsePurposeRecord(json);
};

const savePurposeToApi = async (
  text: string,
  videoUrl: string,
  recordId: number | null
): Promise<{ purposeText: string; videoUrl: string; recordId: number | null }> => {
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
  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }
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
  try { json = JSON.parse(rawText); } catch { json = {}; }
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
  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }
  return parseCoreValuesRecord(json);
};

// ─────────────────────────────────────────────
//  Overview Media API helpers
// ─────────────────────────────────────────────
interface OverviewMedia {
  images: string[];
  videos: string[];
}

const fetchOverviewMediaFromApi = async (): Promise<OverviewMedia> => {
  const url = `${BASE_URL}/business_compass/overview_media`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }
  const parseUrlArray = (arr: any[]): string[] =>
    arr.map((item) => (typeof item === "string" ? item : (item?.url ?? ""))).filter(Boolean);
  return {
    images: Array.isArray(json?.images) ? parseUrlArray(json.images) : [],
    videos: Array.isArray(json?.videos) ? parseUrlArray(json.videos) : [],
  };
};

const saveOverviewImagesApi = async (images: string[]): Promise<void> => {
  const payload = { extra_field: { group_name: "business_plan_overview", images } };
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

const saveOverviewVideosApi = async (videos: string[]): Promise<void> => {
  const payload = { extra_field: { group_name: "business_plan_overview", videos } };
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
const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EyeIcon = ({ color }: { color?: string }) => (
  <svg className="w-4 h-4" style={{ color: color || C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const GripIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h2v2H8V9zm0 4h2v2H8v-2zm6-4h2v2h-2V9zm0 4h2v2h-2v-2z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);
const ImagePlaceholder = () => (
  <svg className="w-12 h-12 mx-auto mb-2" style={{ color: C.primary, opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const VideoPlaceholder = () => (
  <svg className="w-12 h-12 mx-auto mb-2" style={{ color: C.primary, opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ─────────────────────────────────
//  Inline Image Slider
// ─────────────────────────────────
const InlineImageSlider = ({
  images, onDelete, isSaving,
}: {
  images: string[];
  onDelete: (idx: number) => void;
  isSaving: boolean;
}) => {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (current >= images.length && images.length > 0) setCurrent(images.length - 1);
  }, [images.length, current]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent((p) => (p > 0 ? p - 1 : images.length - 1));
      if (e.key === "ArrowRight") setCurrent((p) => (p < images.length - 1 ? p + 1 : 0));
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, images.length]);

  if (images.length === 0) return null;

  const prev = () => setCurrent((p) => (p > 0 ? p - 1 : images.length - 1));
  const next = () => setCurrent((p) => (p < images.length - 1 ? p + 1 : 0));

  const sliderBox = (
    <div style={{ position: "relative", width: "100%", borderRadius: fullscreen ? 0 : 16, overflow: "hidden", background: "#111", paddingTop: fullscreen ? undefined : "56.25%", height: fullscreen ? "100%" : undefined }}>
      <img key={current} src={images[current]} alt={`slide-${current}`} style={{ width: "100%", height: "100%", objectFit: "contain" as const, position: fullscreen ? "static" : "absolute", top: fullscreen ? undefined : 0, left: fullscreen ? undefined : 0, display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8, zIndex: 10 }}>
        <button onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit fullscreen" : "Fullscreen"} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.20)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", transition: "background .15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.38)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}>
          {fullscreen ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0h5m-5 0v5M15 9l5-5m0 0h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5M15 15l5 5m0 0h-5m5 0v-5" /></svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5-5M20 16v4m0 0h-4m4 0l-5-5" /></svg>
          )}
        </button>
        <button onClick={() => onDelete(current)} disabled={isSaving} title="Delete image" style={{ width: 36, height: 36, borderRadius: "50%", background: "#ef4444", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 900, transition: "background .15s", opacity: isSaving ? 0.5 : 1, fontFamily: "'Poppins',sans-serif" }} onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "#dc2626"; }} onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}>
          {isSaving ? (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: "bp-spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} style={{ opacity: 0.25 }} /><path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>) : "✕"}
        </button>
      </div>
      {images.length > 1 && (
        <button onClick={prev} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.20)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 10, transition: "background .15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.38)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      {images.length > 1 && (
        <button onClick={next} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.20)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 10, transition: "background .15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.38)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 10 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 22 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", background: i === current ? "#DA7756" : "rgba(255,255,255,0.50)", transition: "all .2s", padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return ReactDOM.createPortal(
      <div style={{ position: "fixed", inset: 0, zIndex: 999999, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}>
        <div style={{ width: "100vw", height: "100vh" }}>{sliderBox}</div>
        <style>{`@keyframes bp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      </div>,
      document.body
    );
  }

  return (
    <div className="mb-5">
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
    return (<a href={url} target="_blank" rel="noreferrer" className="text-[12px] text-blue-500 underline mt-3 block break-all">{url}</a>);
  }
  return (
    <div className="mb-4 relative w-full">
      <div className="rounded-xl overflow-hidden shadow-sm border w-full relative" style={{ paddingTop: "56.25%", borderColor: C.borderLgt }}>
        <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0`} title="Video Preview" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </div>
  );
};

// ─────────────────────────────────
//  Inline Video Player
// ─────────────────────────────────
const InlineVideoPlayer: React.FC<{
  videos: string[];
  onDelete: (idx: number) => void;
  isSaving: boolean;
}> = ({ videos, onDelete, isSaving }) => {
  const [current, setCurrent] = useState(0);
  const safeIdx = (videos || []).length > 0 ? Math.min(current, (videos || []).length - 1) : 0;

  useEffect(() => {
    if (safeIdx !== current) setCurrent(safeIdx);
  }, [safeIdx, current]);

  if (!videos || videos.length === 0) return null;

  const url = videos[safeIdx] ?? "";
  const getYouTubeId = (u: string): string | null => {
    if (!u || typeof u !== "string") return null;
    const m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/#\s]{11})/);
    return m ? m[1] : null;
  };
  const videoId = getYouTubeId(url);
  const prev = () => setCurrent((p) => (p > 0 ? p - 1 : videos.length - 1));
  const next = () => setCurrent((p) => (p < videos.length - 1 ? p + 1 : 0));

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#111" }}>
        {videoId ? (
          <iframe key={`yt-${safeIdx}-${videoId}`} src={`https://www.youtube.com/embed/${videoId}?rel=0`} title={`video-${safeIdx}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", display: "block" }} />
        ) : (
          <video key={`vid-${safeIdx}-${url}`} src={url} controls style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" as const, display: "block" }} />
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
        {videos.length > 1 && (
          <button onClick={prev} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#374151" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {videos.length > 1 && (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {videos.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} style={{ width: i === safeIdx ? 18 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", padding: 0, background: i === safeIdx ? "#DA7756" : "#d1d5db", transition: "all .2s" }} />))}
          </div>
        )}
        {videos.length > 1 && (
          <button onClick={next} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#374151" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
        <p style={{ flex: 1, minWidth: 0, margin: 0, fontSize: 11, fontWeight: 600, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>
          {safeIdx + 1}/{videos.length} — {url}
        </p>
        <button onClick={() => onDelete(safeIdx)} disabled={isSaving} title="Delete video" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#ef4444", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: isSaving ? "not-allowed" : "pointer", color: "#fff", fontSize: 13, fontWeight: 900, opacity: isSaving ? 0.5 : 1, fontFamily: "'Poppins',sans-serif" }}>
          {isSaving ? (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: "bp-spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} opacity={0.25} /><path fill="currentColor" opacity={0.75} d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>) : "✕"}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────
//  Shared Buttons
// ─────────────────────────────────
const BtnPrimary = ({ children, onClick, className = "" }: any) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all duration-150 active:scale-[0.97] ${className}`} style={{ background: C.primary, fontFamily: C.font }} onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHov)} onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}>
    {children}
  </button>
);

const BtnOutline = ({ children, onClick, className = "", disabled = false }: any) => (
  <button onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition-all duration-150 active:scale-[0.97] border ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`} style={{ borderColor: C.primaryBord, color: C.primary, fontFamily: C.font }} onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.borderColor = C.primaryBordStrong; } }} onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = C.primaryBord; } }}>
    {children}
  </button>
);

const BtnIcon = ({ children, onClick, title = "", onMouseEnter, onMouseLeave }: any) => (
  <button onClick={onClick} title={title} onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.color = C.primary; if (onMouseEnter) onMouseEnter(e); }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#9ca3af"; if (onMouseLeave) onMouseLeave(e); }} className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-sm transition-all duration-150 active:scale-[0.95] border" style={{ borderColor: C.primaryBord, color: "#9ca3af", position: "relative" }}>
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
    .bp-card-lift { transition: box-shadow .2s, transform .2s; }
    .bp-card-lift:hover { box-shadow: 0 8px 32px rgba(218,119,86,0.12); transform: translateY(-1px); }
    .bp-tab-active { background: #fff !important; color: #DA7756 !important; box-shadow: 0 1px 4px rgba(0,0,0,0.10); }
    .bp-tab-inactive { background: transparent !important; color: rgba(255,255,255,0.80) !important; }
    .bp-tab-inactive:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
    .drag-over { border: 2px dashed ${C.primary} !important; opacity: 0.5; }
    .bp-heading-coral { color: #DA7756 !important; }
    @keyframes bp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  `}</style>
);

// ─────────────────────────────────
//  Portal Modal Component
// ─────────────────────────────────
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return ReactDOM.createPortal(
    <div className="bp-modal-portal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
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

const TOOLTIP_CONTENT: Record<string, { title: string; desc: string; example: string }> = {
  core: {
    title: "Core Values - Your Foundation",
    desc: "The 3-5 non-negotiable principles that guide every business decision. These should be actionable, not just words on a wall.",
    example: 'Example: For a family restaurant in Mumbai - "Fresh ingredients daily", "Treat guests like family", "Never compromise on taste"',
  },
  purpose: {
    title: 'Purpose - Your "Why"',
    desc: "Why does your business exist beyond making money? This inspires your team and attracts customers who share your values.",
    example: 'Example: A textile manufacturer in Surat might say "To preserve traditional Indian craftsmanship while empowering rural artisans"',
  },
  brand: {
    title: "Brand Promises - Your Commitments",
    desc: "What can customers ALWAYS count on from you? Make these specific and measurable promises that differentiate you from competitors.",
    example: 'Example: An IT services company in Bangalore - "24-hour response time", "English + Hindi support", "Fixed-price projects (no surprises)"',
  },
};

// ─────────────────────────────────
//  CoreValuesInlineCard
// ─────────────────────────────────
const CoreValuesInlineCard: React.FC<{ values: CoreValueRecord[] }> = ({ values }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(values || []).map((v, idx) => (
          <span key={v.id ?? idx} className="px-4 py-1.5 text-[11px] font-black rounded-full shadow-sm text-white tracking-tight" style={{ background: C.primary }}>
            {v.value}
          </span>
        ))}
      </div>
    </div>
  );
};

// ==========================================
//  MAIN COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState("strategic");
  const [showAddContent, setShowAddContent] = useState(true);
  const [addContentTab, setAddContentTab] = useState("images");
  const [activeTopModal, setActiveTopModal] = useState<string | null>(null);

  // Info hover state for main header
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [infoPos, setInfoPos] = useState({ top: 0, right: 0 });
  const infoBtnRef = useRef<HTMLButtonElement>(null);

  // Info hover state for 3 cards
  const [activeCardInfo, setActiveCardInfo] = useState<"core" | "purpose" | "brand" | null>(null);
  const [cardInfoCoords, setCardInfoCoords] = useState({ top: 0, left: 0, transform: "translateX(-50%)" });

  const handleCardInfoEnter = (e: React.MouseEvent, type: "core" | "purpose" | "brand") => {
    const rect = e.currentTarget.getBoundingClientRect();
    let left = rect.left + window.scrollX + rect.width / 2;
    let transform = "translateX(-50%)";
    if (type === "core") { left = rect.left + window.scrollX; transform = "translateX(0%)"; }
    else if (type === "brand") { left = rect.right + window.scrollX; transform = "translateX(-100%)"; }
    setCardInfoCoords({ top: rect.bottom + window.scrollY + 10, left, transform });
    setActiveCardInfo(type);
  };

  const [isCopyingPlan, setIsCopyingPlan] = useState(false);
  const [isCopyingAiPrompt, setIsCopyingAiPrompt] = useState<"overview" | "detailed" | "script" | null>(null);

  // KPIs
  const [availableKpis, setAvailableKpis] = useState<KPI[]>([]);
  const [isFetchingKpis, setIsFetchingKpis] = useState(false);

  // Purpose
  const [purposeText, setPurposeText] = useState("");
  const [purposeVideoUrl, setPurposeVideoUrl] = useState("");
  const [purposeRecordId, setPurposeRecordId] = useState<number | null>(null);
  const [isFetchingPurpose, setIsFetchingPurpose] = useState(true);
  const [purposeFetchError, setPurposeFetchError] = useState<string | null>(null);
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
  const [tempBrandPromises, setTempBrandPromises] = useState<BrandPromise[]>([]);
  const [tempBrandVideoUrl, setTempBrandVideoUrl] = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [brandSaveError, setBrandSaveError] = useState<string | null>(null);

  // Delete Trackers
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [pendingCoreDeleteIds, setPendingCoreDeleteIds] = useState<number[]>([]);

  // Drag and Drop
  const dragCoreItem = useRef<number | null>(null);
  const dragCoreOverItem = useRef<number | null>(null);
  const [dragCoreOverIdx, setDragCoreOverIdx] = useState<number | null>(null);
  const dragBrandItem = useRef<number | null>(null);
  const dragBrandOverItem = useRef<number | null>(null);
  const [dragBrandOverIdx, setDragBrandOverIdx] = useState<number | null>(null);

  // Overview Media
  const [overviewImages, setOverviewImages] = useState<string[]>([]);
  const [overviewVideos, setOverviewVideos] = useState<string[]>([]);
  const [isFetchingMedia, setIsFetchingMedia] = useState(false);
  const [mediaFetchError, setMediaFetchError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [isSavingVideos, setIsSavingVideos] = useState(false);
  const [mediaSaveError, setMediaSaveError] = useState<string | null>(null);

  // ── Fetches ──
  const loadBrandPromises = useCallback(async () => {
    setIsFetchingBrand(true); setBrandFetchError(null);
    try { const { promises, videoUrl } = await fetchBrandPromisesFromApi(); setBrandPromises(promises); setBrandVideoUrl(videoUrl); }
    catch (err: any) { setBrandFetchError(err.message || "Failed to load brand promises."); }
    finally { setIsFetchingBrand(false); }
  }, []);

  const loadPurpose = useCallback(async () => {
    setIsFetchingPurpose(true); setPurposeFetchError(null);
    try { const { purposeText: text, videoUrl, recordId } = await fetchPurposeFromApi(); setPurposeText(text); setPurposeVideoUrl(videoUrl); setPurposeRecordId(recordId); }
    catch (err: any) { setPurposeFetchError(err.message || "Failed to load purpose."); }
    finally { setIsFetchingPurpose(false); }
  }, []);

  const loadCoreValues = useCallback(async () => {
    setIsFetchingCore(true); setCoreFetchError(null);
    try { const { values, videoUrl } = await fetchCoreValuesFromApi(); setCoreValues(values); setCoreVideoUrl(videoUrl); }
    catch (err: any) { setCoreFetchError(err.message || "Failed to load core values."); }
    finally { setIsFetchingCore(false); }
  }, []);

  const loadKpis = useCallback(async () => {
    setIsFetchingKpis(true);
    try {
      const res = await fetch(`${BASE_URL}/kpis`, { method: "GET", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch KPIs");
      const json = await res.json();
      let list: any[] = [];
      if (json?.data?.kpis && Array.isArray(json.data.kpis)) list = json.data.kpis;
      else if (Array.isArray(json?.data)) list = json.data;
      else if (Array.isArray(json)) list = json;
      setAvailableKpis(list.filter((item) => item?.id && (item?.name || item?.title)).map((item) => ({ id: item.id, name: item.name || item.title || "Unnamed KPI" })));
    } catch (e) { console.error(e); }
    finally { setIsFetchingKpis(false); }
  }, []);

  const loadOverviewMedia = useCallback(async () => {
    setIsFetchingMedia(true); setMediaFetchError(null);
    try { const data = await fetchOverviewMediaFromApi(); setOverviewImages(data.images); setOverviewVideos(data.videos); }
    catch (err: any) { setMediaFetchError(err.message || "Failed to load media."); }
    finally { setIsFetchingMedia(false); }
  }, []);

  useEffect(() => {
    loadBrandPromises(); loadPurpose(); loadCoreValues(); loadKpis(); loadOverviewMedia();
  }, [loadBrandPromises, loadPurpose, loadCoreValues, loadKpis, loadOverviewMedia]);

  // ─────────────────────────────────────────────
  //  Shared DOM Extraction helper
  // ─────────────────────────────────────────────
  const extractSectionFromDOM = (headingRegex: RegExp, defaultTitle: string) => {
    const allElements = Array.from(document.querySelectorAll("h2, h3, h4, p, span, div.text-lg, div.font-bold"));
    const header = allElements.find((el) => headingRegex.test((el as HTMLElement).innerText || "") && el.children.length === 0);
    if (!header) return `--- ${defaultTitle} ---\n(No data found)\n\n`;
    const container = header.closest(".border, .shadow-sm, section, .p-5, .p-6") || header.parentElement;
    if (!container) return `--- ${defaultTitle} ---\n(No data found)\n\n`;
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("button, input, select, textarea, svg, img, a, .bp-modal-portal").forEach((el) => el.remove());
    clone.querySelectorAll("div, p, li, h1, h2, h3, h4").forEach((el) => el.appendChild(document.createTextNode("\n")));
    clone.querySelectorAll("span, strong, b").forEach((el) => el.appendChild(document.createTextNode(" ")));
    const rawText = clone.textContent || "";
    const lines = rawText.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter((line) => line.length > 0);
    let formattedText = `--- ${defaultTitle} ---\n`;
    lines.forEach((line, idx) => {
      if (idx === 0 && headingRegex.test(line)) return;
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes("revenue:") || lowerLine.includes("profit:") || line.includes("Target:")) {
        formattedText += `  • ${line}\n`;
      } else if (lowerLine.includes("initiatives")) {
        formattedText += `\n  [ ${line.toUpperCase()} ]\n`;
      } else if (line.startsWith("•") || line.startsWith("📅") || line.match(/^\d+%$/)) {
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
      kpis = Array.isArray(json?.data?.kpis) ? json.data.kpis
        : Array.isArray(json?.data) ? json.data
        : Array.isArray(json) ? json : [];
    } catch (e) { console.error("KPI fetch error", e); }

    // Fetch SOPs
    let sops: any[] = [];
    try {
      const res = await fetch(`${BASE_URL}/system_sops`, { headers });
      const json = await res.json();
      sops = Array.isArray(json?.data?.system_sops) ? json.data.system_sops
        : Array.isArray(json?.data) ? json.data
        : Array.isArray(json) ? json : [];
    } catch (e) { console.error("SOP fetch error", e); }

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
        opportunities: json?.grouped_data?.business_plan_opportunities?.values || [],
        threats: json?.grouped_data?.business_plan_threats?.values || [],
      };
    } catch (e) { console.error("SWOT fetch error", e); }

    // Build text
    const d = new Date();
    const dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    let text = `BUSINESS PLAN\nHAVEN INFOLINE PRIVATE LIMITED\nGenerated on: ${dateStr}\n${"=".repeat(60)}\n\n`;

    text += `PURPOSE\n${"=".repeat(60)}\n`;
    text += purposeText ? `${purposeText}\n\n` : `(No purpose defined)\n\n`;

    text += `CORE VALUES\n${"=".repeat(60)}\n`;
    coreValues.length
      ? coreValues.forEach((v, i) => { text += `${i + 1}. ${v.value}\n`; })
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
    text += extractSectionFromDOM(/BHAG|Big Hairy Audacious/i, "BHAG (BIG HAIRY AUDACIOUS GOAL)");
    text += extractSectionFromDOM(/Medium Term|3.*Year|5.*Year/i, "MEDIUM TERM PLAN (3-5 YEARS)");
    text += extractSectionFromDOM(/Short Term|1.*Year|Annual/i, "SHORT TERM GOALS (THIS YEAR)");
    text += extractSectionFromDOM(/Quarterly|Rocks|90.*Day/i, "IMMEDIATE GOALS (THIS QUARTER)");

    // KPIs
    text += `CRITICAL NUMBERS\n${"=".repeat(60)}\n`;
    kpis.length
      ? kpis.forEach((kpi: any, i: number) => {
          text += `${i + 1}. ${kpi.name || kpi.title || "Unnamed"}\n`;
          text += `   Current: ${kpi.current_value || 0} / Target: ${kpi.target_value || 0} ${kpi.unit || "#"}\n`;
          text += `   Frequency: ${kpi.frequency || "N/A"}\n`;
          const owner = kpi.owner || kpi.assignee?.name || kpi.assignee?.full_name || kpi.assignee?.email;
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
          const owner = sop.owner || sop.assignee?.name || sop.assignee?.full_name || sop.assignee?.email;
          if (owner) text += `   Owner: ${owner}\n`;
        })
      : (text += `(No SOPs)\n`);
    text += `\n`;

    // SWOT
    text += `SWOT ANALYSIS\n${"=".repeat(60)}\n\n`;
    (["strengths", "weaknesses", "opportunities", "threats"] as const).forEach((key) => {
      text += `${key.charAt(0).toUpperCase() + key.slice(1)}:\n`;
      swotData[key].length
        ? swotData[key].forEach((item, i) => { text += `  ${i + 1}. ${item}\n`; })
        : (text += `  (No items)\n`);
      text += `\n`;
    });

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
  const handleCopyAiPrompt = async (type: "overview" | "detailed" | "script") => {
    setIsCopyingAiPrompt(type);
    try {
      const plan = await buildFullPlanText();
      let prompt = "";
      if (type === "overview") {
        prompt = `Create an interesting and impactful infographic using less text for the business plan of my company in landscape mode (red, black & white colors) from the plan given below:\n\n${plan}`;
      } else if (type === "detailed") {
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
    } catch (err) {
      console.error("AI prompt copy failed", err);
      toast.error("Failed to copy prompt.");
    } finally {
      setIsCopyingAiPrompt(null);
    }
  };

  // ── Overview Media Handlers ──
  const handleAddImage = async () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setIsSavingImages(true); setMediaSaveError(null);
    try { const updated = [...(overviewImages || []), trimmed]; await saveOverviewImagesApi(updated); setOverviewImages(updated); setNewImageUrl(""); }
    catch (err: any) { setMediaSaveError(err.message || "Failed to save image."); }
    finally { setIsSavingImages(false); }
  };

  const handleDeleteImage = async (index: number) => {
    const updated = (overviewImages || []).filter((_, i) => i !== index);
    setIsSavingImages(true); setMediaSaveError(null);
    try { await saveOverviewImagesApi(updated); setOverviewImages(updated); }
    catch (err: any) { setMediaSaveError(err.message || "Failed to delete image."); }
    finally { setIsSavingImages(false); }
  };

  const handleAddVideo = async () => {
    const trimmed = newVideoUrl.trim();
    if (!trimmed) return;
    setIsSavingVideos(true); setMediaSaveError(null);
    try { const updated = [...(overviewVideos || []), trimmed]; await saveOverviewVideosApi(updated); setOverviewVideos(updated); setNewVideoUrl(""); }
    catch (err: any) { setMediaSaveError(err.message || "Failed to save video."); }
    finally { setIsSavingVideos(false); }
  };

  const handleDeleteVideo = async (index: number) => {
    const updated = (overviewVideos || []).filter((_, i) => i !== index);
    setIsSavingVideos(true); setMediaSaveError(null);
    try { await saveOverviewVideosApi(updated); setOverviewVideos(updated); }
    catch (err: any) { setMediaSaveError(err.message || "Failed to delete video."); }
    finally { setIsSavingVideos(false); }
  };

  // ── Modal openers ──
  const openTopModal = (modalName: string) => {
    if (modalName === "purpose") { setTempPurposeText(purposeText); setTempPurposeVideoUrl(purposeVideoUrl); setPurposeSaveError(null); }
    else if (modalName === "core") { setTempCoreValues((coreValues || []).map((v) => ({ ...v }))); setTempCoreVideoUrl(coreVideoUrl); setCoreSaveError(null); setPendingCoreDeleteIds([]); }
    else if (modalName === "brand") { setTempBrandPromises((brandPromises || []).map((p) => ({ ...p, kpis: [...(p.kpis || [])] }))); setTempBrandVideoUrl(brandVideoUrl); setBrandSaveError(null); setPendingDeleteIds([]); }
    setActiveTopModal(modalName);
  };

  // ── Save handlers ──
  const saveTopPurpose = async () => {
    setIsSavingPurpose(true); setPurposeSaveError(null);
    try {
      const trimmedText = tempPurposeText.trim();
      const trimmedVideo = tempPurposeVideoUrl.trim();
      if (!trimmedText && !trimmedVideo && purposeRecordId) {
        await deleteExtraFieldFromApi(purposeRecordId);
        setPurposeText(""); setPurposeVideoUrl(""); setPurposeRecordId(null); setActiveTopModal(null);
      } else {
        const resObj = await savePurposeToApi(trimmedText, trimmedVideo, purposeRecordId);
        setPurposeText(trimmedText); setPurposeVideoUrl(trimmedVideo); setPurposeRecordId(resObj.recordId || purposeRecordId);
        setActiveTopModal(null);
      }
    } catch (err: any) { setPurposeSaveError(err.message || "Failed to save. Please try again."); }
    finally { setIsSavingPurpose(false); }
  };

  const saveCoreValues = async () => {
    const filtered = (tempCoreValues || []).filter((v) => v.value.trim() !== "");
    setIsSavingCore(true); setCoreSaveError(null);
    try {
      for (const id of pendingCoreDeleteIds) { try { await deleteExtraFieldFromApi(id); } catch (e) { console.error(e); } }
      setPendingCoreDeleteIds([]);
      if (filtered.length > 0 || tempCoreVideoUrl.trim() !== "") {
        const resObj = await saveCoreValuesToApi(filtered.map((v) => v.value), tempCoreVideoUrl);
        setCoreValues(filtered.map((v, i) => ({ ...v, id: resObj.values[i]?.id ?? v.id })));
        setCoreVideoUrl(tempCoreVideoUrl);
      } else { setCoreValues([]); setCoreVideoUrl(tempCoreVideoUrl); }
      setActiveTopModal(null);
    } catch (err: any) { setCoreSaveError(err.message || "Failed to save. Please try again."); }
    finally { setIsSavingCore(false); }
  };

  const saveBrandPromises = async () => {
    const filtered = (tempBrandPromises || []).filter((p) => p.text.trim() !== "");
    setIsSavingBrand(true); setBrandSaveError(null);
    try {
      for (const id of pendingDeleteIds) { try { await deleteExtraFieldFromApi(id); } catch (e) { console.error(e); } }
      setPendingDeleteIds([]);
      if (filtered.length > 0 || tempBrandVideoUrl.trim() !== "") {
        await saveBrandPromisesToApi(filtered, tempBrandVideoUrl);
        setBrandPromises(filtered.map((p) => ({ ...p, kpis: [...(p.kpis || [])] })));
        setBrandVideoUrl(tempBrandVideoUrl);
      } else {
        await saveBrandPromisesToApi([], tempBrandVideoUrl);
        setBrandPromises([]); setBrandVideoUrl(tempBrandVideoUrl);
      }
      setActiveTopModal(null);
    } catch (err: any) { setBrandSaveError(err.message || "Failed to save. Please try again."); }
    finally { setIsSavingBrand(false); }
  };

  // ── Brand promise handlers ──
  const handleBrandPromiseChange = (index: number, value: string) => { const updated = [...(tempBrandPromises || [])]; updated[index] = { ...updated[index], text: value }; setTempBrandPromises(updated); };
  const handleDeleteBrandPromise = (index: number) => { const promise = tempBrandPromises[index]; if (promise && promise.id !== null) setPendingDeleteIds((prev) => [...prev, promise.id as number]); setTempBrandPromises((tempBrandPromises || []).filter((_, i) => i !== index)); };
  const handleAddBrandPromise = () => setTempBrandPromises([...(tempBrandPromises || []), { id: null, text: "", kpis: [] }]);
  const handleAddKpiToBrandPromise = (promiseIndex: number, kpi: string) => { if (!kpi) return; const updated = [...(tempBrandPromises || [])]; if (!updated[promiseIndex]) return; const current = updated[promiseIndex].kpis || []; if (current.length >= 3 || current.includes(kpi)) return; updated[promiseIndex] = { ...updated[promiseIndex], kpis: [...current, kpi] }; setTempBrandPromises(updated); };
  const handleRemoveKpiFromBrandPromise = (promiseIndex: number, kpi: string) => { const updated = [...(tempBrandPromises || [])]; if (!updated[promiseIndex]) return; updated[promiseIndex] = { ...updated[promiseIndex], kpis: (updated[promiseIndex].kpis || []).filter((k) => k !== kpi) }; setTempBrandPromises(updated); };

  // ── Brand Drag & Drop ──
  const onDragStartBrand = (e: React.DragEvent<HTMLDivElement>, position: number) => { dragBrandItem.current = position; e.dataTransfer.effectAllowed = "move"; };
  const onDragEnterBrand = (e: React.DragEvent<HTMLDivElement>, position: number) => { e.preventDefault(); dragBrandOverItem.current = position; setDragBrandOverIdx(position); };
  const onDragEndBrand = () => { if (dragBrandItem.current !== null && dragBrandOverItem.current !== null) { const copy = [...(tempBrandPromises || [])]; const item = copy[dragBrandItem.current]; copy.splice(dragBrandItem.current, 1); copy.splice(dragBrandOverItem.current, 0, item); dragBrandItem.current = null; dragBrandOverItem.current = null; setDragBrandOverIdx(null); setTempBrandPromises(copy); } };

  // ── Core value handlers ──
  const handleCoreValueChange = (index: number, value: string) => { const updated = [...(tempCoreValues || [])]; updated[index] = { ...updated[index], value }; setTempCoreValues(updated); };
  const handleDeleteCoreValue = (index: number) => { const item = tempCoreValues[index]; if (item && item.id !== null) setPendingCoreDeleteIds((prev) => [...prev, item.id as number]); setTempCoreValues((tempCoreValues || []).filter((_, i) => i !== index)); };
  const handleAddCoreValue = () => setTempCoreValues([...(tempCoreValues || []), { id: null, value: "" }]);

  // ── Core Drag & Drop ──
  const onDragStartCore = (e: React.DragEvent<HTMLDivElement>, position: number) => { dragCoreItem.current = position; e.dataTransfer.effectAllowed = "move"; };
  const onDragEnterCore = (e: React.DragEvent<HTMLDivElement>, position: number) => { e.preventDefault(); dragCoreOverItem.current = position; setDragCoreOverIdx(position); };
  const onDragEndCore = () => { if (dragCoreItem.current !== null && dragCoreOverItem.current !== null) { const copy = [...(tempCoreValues || [])]; const item = copy[dragCoreItem.current]; copy.splice(dragCoreItem.current, 1); copy.splice(dragCoreOverItem.current, 0, item); dragCoreItem.current = null; dragCoreOverItem.current = null; setDragCoreOverIdx(null); setTempCoreValues(copy); } };

  const isSavingAny = (activeTopModal === "brand" && isSavingBrand) || (activeTopModal === "purpose" && isSavingPurpose) || (activeTopModal === "core" && isSavingCore);

  const tabs = [
    { key: "strategic", label: "Strategic Plan" },
    { key: "goals", label: "Goals" },
  ];

  const Shimmer = ({ w = "100%", h = 16 }: { w?: string; h?: number }) => (
    <div className="animate-pulse rounded-xl" style={{ width: w, height: h, background: "#e5e1d8" }} />
  );

  const emptyAddBtn = (onClick: () => void, label: string) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full py-6 rounded-2xl border-2 border-dashed transition-all" style={{ borderColor: C.primaryBord, background: C.primaryTint }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryBg; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.primaryBord; e.currentTarget.style.background = C.primaryTint; }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ background: "rgba(218,119,86,0.18)" }}><PlusIcon /></div>
      <span className="text-[13px] font-black" style={{ color: C.primary }}>{label}</span>
    </button>
  );

  return (
    <div className="bp-wrap min-h-screen px-4 md:px-8 w-full mx-auto space-y-6" style={{ background: "white", color: C.textMain, fontFamily: C.font }}>
      <ThemeStyle />

      {/* ── Page Header ── */}
      <div className="overflow-hidden rounded-2xl border shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: C.primaryBord, borderColor: C.primaryBord }}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: C.textMuted }}>Strategic overview and goals alignment</p>
          <h1 className="text-2xl font-black tracking-tight bp-heading-coral" style={{ color: "#DA7756" }}>Business Plan</h1>
          <p className="text-sm font-semibold mt-1" style={{ color: C.textMuted }}>HAVEN INFOLINE PRIVATE LIMITED</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <BtnOutline onClick={handleCopyPlan} disabled={isCopyingPlan}>
            {isCopyingPlan ? <><LoaderIcon /> Copying...</> : "Copy Plan"}
          </BtnOutline>
          <BtnPrimary>✨ Create with AI</BtnPrimary>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex w-fit rounded-2xl p-1 gap-1 overflow-x-auto" style={{ background: C.primary }}>
        {tabs.map((tab) => {
          const isActive = activeMainTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveMainTab(tab.key)} className={`py-2 px-4 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap ${isActive ? "bp-tab-active" : "bp-tab-inactive"}`}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══ STRATEGIC PLAN ══ */}
      {activeMainTab === "strategic" && (
        <div className="space-y-6">
          {/* Our Business Plan header */}
          <div className="rounded-[8px] p-5 flex items-center justify-between relative" style={{ background: C.primaryBord }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: C.primary }}><EyeIcon color="white" /></div>
              <span className="text-[12px] font-black tracking-[0.15em] text-[#070707] uppercase">Our Business Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ position: "relative" }}>
                <BtnIcon
                  title="Info"
                  onMouseEnter={() => {
                    if (infoBtnRef.current) {
                      const rect = infoBtnRef.current.getBoundingClientRect();
                      setInfoPos({ top: rect.bottom + window.scrollY + 10, right: window.innerWidth - rect.right - window.scrollX });
                    }
                    setIsInfoHovered(true);
                  }}
                  onMouseLeave={() => setIsInfoHovered(false)}
                >
                  <span ref={infoBtnRef}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </BtnIcon>

                {isInfoHovered && ReactDOM.createPortal(
                  <div style={{ position: "absolute", top: infoPos.top, right: infoPos.right, zIndex: 99999, background: "#16102b", color: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", padding: "20px", width: 380, fontFamily: "'Poppins', sans-serif", pointerEvents: "none" }}>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 800, color: "#e2baff", textAlign: "center" }}>How to Create Business Plan Infographics</h4>
                    <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, lineHeight: 1.6, color: "#d1d5db", listStyleType: "decimal" }}>
                      <li style={{ marginBottom: 12 }}>First, complete your business plan sections above (Core Values, Purpose, Brand Promises, BHAG, Goals, etc.)</li>
                      <li style={{ marginBottom: 12 }}>Click the <strong style={{ color: "#fff" }}>'Copy Text'</strong> button at the top of the page to copy your plan</li>
                      <li style={{ marginBottom: 12 }}>Go to <strong style={{ color: "#fff" }}>gemini.google.com</strong></li>
                      <li style={{ marginBottom: 12 }}>
                        Use this prompt:
                        <div style={{ background: "rgba(255,255,255,0.08)", padding: "10px", borderRadius: 8, marginTop: 6, fontStyle: "italic", border: "1px solid rgba(255,255,255,0.15)" }}>
                          "Create an infographic for the business plan of my company in landscape mode (red, black & white colors) from the plan given below: &lt;paste your business plan here&gt;"
                        </div>
                      </li>
                      <li>Download the generated infographic and add it here using the image URL or upload feature</li>
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

          {/* Add Content Dropdown */}
          {showAddContent && (
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.primaryBordStrong, background: C.cardBg }}>
              <div className="flex border-b" style={{ borderColor: C.primaryBord }}>
                {["images", "video"].map((t) => (
                  <button key={t} onClick={() => setAddContentTab(t)} className="flex-1 py-3 text-[13px] font-black transition-colors capitalize" style={{ background: addContentTab === t ? C.primary : "transparent", color: addContentTab === t ? "#fff" : C.textMuted }}>
                    {t === "images" ? "Images" : "Explainer Video"}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {mediaSaveError && <div className="bp-error-banner mb-4">{mediaSaveError}</div>}
                {mediaFetchError && (
                  <div className="bp-error-banner mb-4 flex items-center justify-between">
                    <span>{mediaFetchError}</span>
                    <button onClick={loadOverviewMedia} className="underline ml-3 shrink-0">Retry</button>
                  </div>
                )}

                {addContentTab === "images" && (
                  <div>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddImage()} placeholder="Paste image URL or Google Drive link..." className="bp-input flex-1" disabled={isSavingImages} />
                      <button onClick={handleAddImage} disabled={isSavingImages || !newImageUrl.trim()} className="px-4 py-2 rounded-xl text-[13px] font-black border transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-1.5" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>
                        {isSavingImages ? <LoaderIcon /> : "+ Add"}
                      </button>
                    </div>
                    <p className="text-[11px] mb-4 font-semibold" style={{ color: C.textMuted }}>
                      {(overviewImages || []).length}/12 images 
                    </p>
                    {isFetchingMedia ? (
                      <div className="w-full rounded-2xl animate-pulse mb-5" style={{ height: 340, background: "#e5e1d8" }} />
                    ) : (overviewImages || []).length === 0 ? (
                      <div className="flex flex-col items-center py-10 mb-5 rounded-2xl border-2 border-dashed" style={{ borderColor: C.primaryBord }}>
                        <ImagePlaceholder />
                        <p className="text-[13px] font-black" style={{ color: C.textMuted }}>No images added yet</p>
                      </div>
                    ) : (
                      <InlineImageSlider images={overviewImages} onDelete={handleDeleteImage} isSaving={isSavingImages} />
                    )}
                    <p className="text-[11px] mb-2 font-black mt-2" style={{ color: C.textMuted }}>Generate with AI:</p>
                    <div className="flex gap-3">
                      {/* ── Create Image (overview) ── */}
                      <button
                        onClick={() => handleCopyAiPrompt("overview")}
                        disabled={isCopyingAiPrompt === "overview"}
                        className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-1.5"
                        style={{ borderColor: C.borderLgt }}
                      >
                        {isCopyingAiPrompt === "overview" ? <><LoaderIcon /> Copying...</> : "✨ Create Image (overview)"}
                      </button>
                      {/* ── Create Image (detailed) ── */}
                      <button
                        onClick={() => handleCopyAiPrompt("detailed")}
                        disabled={isCopyingAiPrompt === "detailed"}
                        className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-1.5"
                        style={{ borderColor: C.borderLgt }}
                      >
                        {isCopyingAiPrompt === "detailed" ? <><LoaderIcon /> Copying...</> : "✨ Create Image (detailed)"}
                      </button>
                    </div>
                  </div>
                )}

                {addContentTab === "video" && (
                  <div>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddVideo()} placeholder="Paste YouTube, Vimeo, or direct video URL..." className="bp-input flex-1" disabled={isSavingVideos} />
                      <button onClick={handleAddVideo} disabled={isSavingVideos || !newVideoUrl.trim()} className="px-4 py-2 rounded-xl text-[13px] font-black border transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-1.5" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>
                        {isSavingVideos ? <LoaderIcon /> : "+ Add"}
                      </button>
                    </div>
                    <p className="text-[11px] font-black mb-4" style={{ color: C.textMuted }}>{(overviewVideos || []).length}/12 videos added</p>
                    {isFetchingMedia ? (
                      <div className="w-full rounded-2xl animate-pulse mb-5" style={{ height: 340, background: "#e5e1d8" }} />
                    ) : (overviewVideos || []).length === 0 ? (
                      <div className="flex flex-col items-center py-10 mb-5 rounded-2xl border-2 border-dashed" style={{ borderColor: C.primaryBord }}>
                        <VideoPlaceholder />
                        <p className="text-[13px] font-black" style={{ color: C.textMuted }}>No explainer videos added yet</p>
                      </div>
                    ) : (
                      <InlineVideoPlayer videos={overviewVideos} onDelete={handleDeleteVideo} isSaving={isSavingVideos} />
                    )}
                    <p className="text-[11px] mb-2 font-black mt-2" style={{ color: C.textMuted }}>Generate with AI:</p>
                    {/* ── Create Video Script ── */}
                    <button
                      onClick={() => handleCopyAiPrompt("script")}
                      disabled={isCopyingAiPrompt === "script"}
                      className="w-full py-2.5 bg-white border rounded-xl flex items-center justify-center text-[13px] font-black hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60 gap-1.5"
                      style={{ borderColor: C.borderLgt }}
                    >
                      {isCopyingAiPrompt === "script" ? <><LoaderIcon /> Copying...</> : "📄 Create Video Script"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 3 Cards ── */}
          <div className="rounded-[8px] p-6" style={{ background: C.primaryBord }}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black mb-5">Strategic Essentials</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Core Values */}
              <div className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col" style={{ background: C.cardBg, borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Core Values
                    <span onMouseEnter={(e) => handleCardInfoEnter(e, "core")} onMouseLeave={() => setActiveCardInfo(null)} style={{ cursor: "help" }}><InfoIcon /></span>
                  </h3>
                  <button onClick={() => openTopModal("core")} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: "#9ca3af" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}><EditIcon /></button>
                </div>
                {isFetchingCore ? (
                  <div className="flex flex-wrap gap-2">{[1, 2, 3, 4].map((n) => (<Shimmer key={n} w="80px" h={28} />))}</div>
                ) : coreFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">⚠ {coreFetchError} <button onClick={loadCoreValues} className="underline">Retry</button></div>
                ) : (coreValues || []).length === 0 && !coreVideoUrl ? (
                  <div className="flex flex-col gap-3">{emptyAddBtn(() => openTopModal("core"), "Add Core Values")}</div>
                ) : (
                  <div className="flex flex-col h-full">
                    {coreVideoUrl && <VideoPreview url={coreVideoUrl} />}
                    {(coreValues || []).length === 0 ? <div>{emptyAddBtn(() => openTopModal("core"), "Add Core Values")}</div> : <div><CoreValuesInlineCard values={coreValues} /></div>}
                  </div>
                )}
              </div>

              {/* Purpose */}
              <div className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col" style={{ background: C.cardBg, borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Purpose
                    <span onMouseEnter={(e) => handleCardInfoEnter(e, "purpose")} onMouseLeave={() => setActiveCardInfo(null)} style={{ cursor: "help" }}><InfoIcon /></span>
                  </h3>
                  <button onClick={() => openTopModal("purpose")} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: "#9ca3af" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}><EditIcon /></button>
                </div>
                {isFetchingPurpose ? (
                  <div className="space-y-2">{[1, 2, 3].map((n) => (<Shimmer key={n} w={n === 3 ? "50%" : "95%"} h={12} />))}</div>
                ) : purposeFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">⚠ {purposeFetchError} <button onClick={loadPurpose} className="underline">Retry</button></div>
                ) : !purposeText && !purposeVideoUrl ? (
                  emptyAddBtn(() => openTopModal("purpose"), "Add Purpose")
                ) : (
                  <div className="flex flex-col h-full">
                    {purposeVideoUrl && <VideoPreview url={purposeVideoUrl} />}
                    {purposeText ? (<p className="text-[13px] font-black leading-relaxed" style={{ color: C.primary }}>{purposeText}</p>) : (<div>{emptyAddBtn(() => openTopModal("purpose"), "Add Purpose")}</div>)}
                  </div>
                )}
              </div>

              {/* Brand Promises */}
              <div className="bp-card-lift rounded-2xl shadow-sm border p-5 flex flex-col" style={{ background: C.cardBg, borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Brand Promises
                    <span onMouseEnter={(e) => handleCardInfoEnter(e, "brand")} onMouseLeave={() => setActiveCardInfo(null)} style={{ cursor: "help" }}><InfoIcon /></span>
                  </h3>
                  <button onClick={() => openTopModal("brand")} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: "#9ca3af" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}><EditIcon /></button>
                </div>
                {isFetchingBrand ? (
                  <div className="space-y-2">{[1, 2, 3].map((n) => (<Shimmer key={n} w={n === 3 ? "60%" : "90%"} h={14} />))}</div>
                ) : brandFetchError ? (
                  <div className="text-[12px] text-red-500 font-semibold">⚠ {brandFetchError} <button onClick={loadBrandPromises} className="underline">Retry</button></div>
                ) : (brandPromises || []).length === 0 && !brandVideoUrl ? (
                  emptyAddBtn(() => openTopModal("brand"), "Add Promise")
                ) : (
                  <div className="flex flex-col h-full">
                    {brandVideoUrl && <VideoPreview url={brandVideoUrl} />}
                    {(brandPromises || []).length === 0 ? (
                      <div>{emptyAddBtn(() => openTopModal("brand"), "Add Promise")}</div>
                    ) : (
                      <ul className="space-y-3 text-[12px]" style={{ color: C.textMuted }}>
                        {(brandPromises || []).map((p, idx) => (
                          <li key={p.id ?? idx} className="flex items-start">
                            <span className="mr-2 mt-0.5 shrink-0 font-black" style={{ color: C.primary }}>•</span>
                            <div>
                              <div dangerouslySetInnerHTML={{ __html: (p.text || "").replace(/([^-]+)/, `<strong style="color:${C.textMain};font-weight:800;">$1</strong>`) }} />
                              {p.kpis && p.kpis.length > 0 ? (
                                <p className="text-[11px] text-gray-400 mt-0.5">{p.kpis.join(", ")}</p>
                              ) : (
                                <p className="text-[11px] text-gray-400 italic mt-0.5">No KPIs linked</p>
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
          {activeCardInfo && ReactDOM.createPortal(
            <div style={{ position: "absolute", top: cardInfoCoords.top, left: cardInfoCoords.left, transform: cardInfoCoords.transform, zIndex: 99999, background: "#16102b", color: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", padding: "16px", width: 300, textAlign: "center", fontFamily: "'Poppins', sans-serif", pointerEvents: "none" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: 13, fontWeight: 800 }}>{activeCardInfo && TOOLTIP_CONTENT[activeCardInfo] ? TOOLTIP_CONTENT[activeCardInfo].title : ""}</h4>
              <p style={{ margin: "0 0 10px 0", fontSize: 12, lineHeight: 1.5, color: "#d1d5db" }}>{activeCardInfo && TOOLTIP_CONTENT[activeCardInfo] ? TOOLTIP_CONTENT[activeCardInfo].desc : ""}</p>
              <p style={{ margin: 0, fontSize: 11, fontStyle: "italic", color: "#d1d5db" }}>{activeCardInfo && TOOLTIP_CONTENT[activeCardInfo] ? TOOLTIP_CONTENT[activeCardInfo].example : ""}</p>
            </div>,
            document.body
          )}

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

      {/* ══ MODALS ══ */}
      {activeTopModal && (
        <Modal onClose={() => setActiveTopModal(null)}>
          <div className="bp-modal-box">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b" style={{ background: C.cardBg, borderColor: C.primaryBord }}>
              <div className="flex items-center gap-3">
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.primary, flexShrink: 0, display: "inline-block" }} />
                <h2 className="font-black text-[17px] m-0" style={{ color: C.textMain }}>
                  Edit {activeTopModal === "core" ? "Core Values" : activeTopModal === "purpose" ? "Purpose" : "Brand Promises"}
                </h2>
              </div>
              <BtnIcon onClick={() => setActiveTopModal(null)}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </BtnIcon>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto bp-scroll">
              {/* Purpose */}
              {activeTopModal === "purpose" && (
                <div className="space-y-5">
                  {purposeSaveError && <div className="bp-error-banner">{purposeSaveError}</div>}
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{ color: C.textMain }}>Explanation / Text <span style={{ color: C.primary }}>*</span></label>
                    <textarea value={tempPurposeText} onChange={(e) => setTempPurposeText(e.target.value)} className="bp-input resize-y" style={{ minHeight: 140 }} placeholder="Describe your company purpose..." />
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempPurposeVideoUrl} onChange={(e) => setTempPurposeVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                    <p className="text-[11px] mt-1.5 font-semibold" style={{ color: C.textMuted }}>Supports YouTube, Vimeo, and direct video files (.mp4, etc.)</p>
                  </div>
                </div>
              )}

              {/* Core Values */}
              {activeTopModal === "core" && (
                <div className="space-y-5">
                  {coreSaveError && <div className="bp-error-banner">{coreSaveError}</div>}
                  <div>
                    <label className="block text-[12px] font-black mb-3" style={{ color: C.textMain }}>Core Values</label>
                    <div className="space-y-2.5 mb-3">
                      {(tempCoreValues || []).map((item, idx) => (
                        <div key={item.id ?? idx} draggable onDragStart={(e) => onDragStartCore(e, idx)} onDragEnter={(e) => onDragEnterCore(e, idx)} onDragEnd={onDragEndCore} onDragOver={(e) => e.preventDefault()} className={`flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm transition-all ${dragCoreOverIdx === idx ? "drag-over" : ""}`} style={{ borderColor: C.borderLgt, cursor: "grab" }}>
                          <div className="shrink-0 p-1 rounded text-gray-300"><GripIcon /></div>
                          <input type="text" value={item.value} onChange={(e) => handleCoreValueChange(idx, e.target.value)} className="flex-1 outline-none text-[13px] font-black bg-transparent cursor-text" style={{ color: C.textMain }} placeholder="Add core value" autoFocus={idx === (tempCoreValues || []).length - 1 && item.value === ""} />
                          <button onClick={() => handleDeleteCoreValue(idx)} className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"><TrashIcon /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddCoreValue} className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-black rounded-2xl transition-colors border-2 border-dashed mb-5" style={{ borderColor: C.borderLgt, color: C.primary }} onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <PlusIcon /> Add Item
                    </button>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempCoreVideoUrl} onChange={(e) => setTempCoreVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                  </div>
                </div>
              )}

              {/* Brand Promises */}
              {activeTopModal === "brand" && (
                <div className="space-y-5">
                  {brandSaveError && <div className="bp-error-banner">{brandSaveError}</div>}
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempBrandVideoUrl} onChange={(e) => setTempBrandVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-3" style={{ color: C.textMain }}>Promises</label>
                    <div className="space-y-2.5 mb-3">
                      {(tempBrandPromises || []).map((item, idx) => (
                        <div key={item.id ?? idx} draggable onDragStart={(e) => onDragStartBrand(e, idx)} onDragEnter={(e) => onDragEnterBrand(e, idx)} onDragEnd={onDragEndBrand} onDragOver={(e) => e.preventDefault()} className={`flex items-center gap-3 border rounded-2xl p-2.5 bg-white shadow-sm transition-all ${dragBrandOverIdx === idx ? "drag-over" : ""}`} style={{ borderColor: C.borderLgt, cursor: "grab" }}>
                          <div className="shrink-0 p-1 rounded text-gray-300"><GripIcon /></div>
                          <input type="text" value={item.text} onChange={(e) => handleBrandPromiseChange(idx, e.target.value)} className="flex-1 outline-none text-[13px] font-black bg-transparent cursor-text" style={{ color: C.textMain }} placeholder="Add promise" autoFocus={idx === (tempBrandPromises || []).length - 1 && item.text === ""} />
                          <button onClick={() => handleDeleteBrandPromise(idx)} className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"><TrashIcon /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddBrandPromise} className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-black rounded-2xl transition-colors border-2 border-dashed mb-5" style={{ borderColor: C.borderLgt, color: C.primary }} onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryBg)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <PlusIcon /> Add Item
                    </button>
                  </div>

                  {/* KPI Linking */}
                  <div>
                    <label className="block text-[12px] font-black mb-3" style={{ color: C.textMain }}>Link KPIs to Promises <span className="font-semibold text-gray-400">(Max 3 per promise)</span></label>
                    <div className="max-h-[280px] overflow-y-auto bp-scroll space-y-3 pr-1">
                      {(tempBrandPromises || []).filter((p) => p.text.trim() !== "").map((item, idx) => (
                        <div key={item.id ?? idx} className="border p-4 rounded-2xl bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="text-[13px] font-black mb-3 leading-snug" style={{ color: C.textMain }}>{item.text}</div>
                          {item.kpis && item.kpis.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.kpis.map((kpi) => (
                                <span key={kpi} className="flex items-center gap-1 px-3 py-1 text-[11px] font-black rounded-full text-white" style={{ background: C.primary }}>
                                  {kpi}
                                  <button onClick={() => handleRemoveKpiFromBrandPromise(idx, kpi)} className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity">✕</button>
                                </span>
                              ))}
                            </div>
                          )}
                          {!item.kpis || item.kpis.length < 3 ? (
                            <select className="bp-select text-gray-500" value="" onChange={(e) => handleAddKpiToBrandPromise(idx, e.target.value)} disabled={isFetchingKpis}>
                              <option value="">{isFetchingKpis ? "Loading KPIs..." : "Link a KPI..."}</option>
                              {(availableKpis || []).map((kpi) => (<option key={kpi.id} value={kpi.name}>{kpi.name}</option>))}
                            </select>
                          ) : (
                            <div className="text-[11px] italic font-semibold mt-1" style={{ color: C.textMuted }}>Max 3 KPIs reached.</div>
                          )}
                        </div>
                      ))}
                      {(tempBrandPromises || []).filter((p) => p.text.trim() !== "").length === 0 && (
                        <p className="text-[13px] text-gray-400 italic">Add promises above to link KPIs.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 flex justify-end gap-3 border-t" style={{ background: C.cardBg, borderColor: C.primaryBord }}>
              <BtnOutline onClick={() => setActiveTopModal(null)}>Cancel</BtnOutline>
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
                onMouseEnter={(e) => { if (!isSavingAny) e.currentTarget.style.background = "#000"; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
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