import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { BhagSection } from './AdminCompassComponent/BhagSection';
import { MediumTermSection } from './AdminCompassComponent/MediumTermSection';
import { ShortTermSection } from './AdminCompassComponent/ShortTermSection';
import { QuarterlySection } from './AdminCompassComponent/QuarterlySection';
import { CriticalNumbers } from './AdminCompassComponent/CriticalNumbers';
import { KeyProcessesSection } from './AdminCompassComponent/KeyProcessesSection';
import SWOTAnalysis from './AdminCompassComponent/SWOTAnalysis';
import { GoalsView } from './AdminCompassComponent/GoalsView';
import { AdminViewEmulation } from '@/components/AdminViewEmulation';

// ── Design Tokens ──
const C = {
  primary:           '#DA7756',
  primaryHov:        '#c9674a',
  primaryBg:         '#fef6f4',
  primaryTint:       'rgba(218,119,86,0.10)',
  primaryBord:       'rgba(218,119,86,0.22)',
  primaryBordStrong: 'rgba(218,119,86,0.35)',
  pageBg:            '#ffffff',
  textMain:          '#1a1a1a',
  textMuted:         '#6b7280',
  borderLgt:         '#e5e7eb',
  cardBg:            '#fff',
};

// ── Shared: base URL + auth (reuse BhagSection pattern) ──
const BASE_URL = 'https://fm-uat-api.lockated.com';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Brand Promises API helpers ──

/**
 * Normalises any API response shape into { promises, videoUrl }.
 * Handles:
 *   - Array of records:           [ { group_name, values, ... } ]
 *   - Wrapped array:              { extra_fields: [ ... ] }
 *   - Single object (POST echo):  { extra_field: { group_name, values, ... } }
 *   - Flat single record:         { group_name, values, ... }
 */
const parseBrandPromisesRecord = (json: any): { promises: BrandPromise[]; videoUrl: string } => {
  // ── Shape 1 (GET): { success, data: [{id, field_name, field_value, ...}], grouped_data: { business_plan_brand_promises: { values, video_url, promise_kpis } } }
  if (json?.grouped_data?.business_plan_brand_promises) {
    const group     = json.grouped_data.business_plan_brand_promises;
    const values: string[]                      = group.values ?? [];
    const videoUrl: string                      = group.video_url ?? '';
    const promiseKpis: Record<string, string[]> = group.promise_kpis ?? {};
    // data[] holds one row per value with the real DB id
    const rows: any[]                           = Array.isArray(json.data) ? json.data : [];

    const promises: BrandPromise[] = values.map((text: string, idx: number) => ({
      id:   rows[idx]?.id ?? null,
      text,
      kpis: promiseKpis[`item_${idx + 1}`] ?? [],
    }));
    return { promises, videoUrl };
  }

  // ── Shape 2 (POST echo): { extra_field: { group_name, values, video_url, promise_kpis } }
  if (json?.extra_field) {
    const record                                = json.extra_field;
    const values: string[]                      = record.values ?? [];
    const videoUrl: string                      = record.video_url ?? '';
    const promiseKpis: Record<string, string[]> = record.promise_kpis ?? {};
    const promises: BrandPromise[] = values.map((text: string, idx: number) => ({
      id:   null,   // POST echo doesn't carry DB ids — background re-fetch will populate
      text,
      kpis: promiseKpis[`item_${idx + 1}`] ?? [],
    }));
    return { promises, videoUrl };
  }

  // ── Shape 3: plain array of records ──
  if (Array.isArray(json)) {
    const record = json.find((r: any) => r.group_name === 'business_plan_brand_promises') ?? json[0];
    if (!record) return { promises: [], videoUrl: '' };
    const values: string[]                      = record.values ?? (record.value ? [record.value] : []);
    const videoUrl: string                      = record.video_url ?? '';
    const promiseKpis: Record<string, string[]> = record.promise_kpis ?? {};
    const efv: any[]                            = record.extra_field_values ?? [];
    const promises: BrandPromise[] = values.map((text: string, idx: number) => ({
      id:   efv[idx]?.id ?? null,
      text,
      kpis: promiseKpis[`item_${idx + 1}`] ?? [],
    }));
    return { promises, videoUrl };
  }

  return { promises: [], videoUrl: '' };
};

/**
 * GET  /extra_fields?q[group_name_in][]=business_plan_brand_promises&include_grouped=true
 */
const fetchBrandPromisesFromApi = async (): Promise<{ promises: BrandPromise[]; videoUrl: string }> => {
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_brand_promises&include_grouped=true`;
  console.log('[BrandPromises] GET', url);

  const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  console.log('[BrandPromises] GET status:', res.status);

  const rawText = await res.text();
  console.log('[BrandPromises] GET raw (first 600):', rawText.slice(0, 600));

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);

  let json: any;
  try { json = JSON.parse(rawText); } catch { json = []; }

  return parseBrandPromisesRecord(json);
};

/**
 * POST  /extra_fields/bulk_upsert
 * Saves all promises + video_url + promise_kpis in one shot.
 */
const saveBrandPromisesToApi = async (
  promises: { text: string; kpis: string[] }[],
  videoUrl: string,
): Promise<{ promises: BrandPromise[]; videoUrl: string }> => {
  const promiseKpis: Record<string, string[]> = {};
  promises.forEach((p, idx) => {
    promiseKpis[`item_${idx + 1}`] = p.kpis;
  });

  const payload = {
    extra_field: {
      group_name:   'business_plan_brand_promises',
      values:       promises.map((p) => p.text),
      video_url:    videoUrl,
      promise_kpis: promiseKpis,
    },
  };

  console.log('[BrandPromises] POST bulk_upsert payload:', JSON.stringify(payload, null, 2));

  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });

  const rawText = await res.text();
  console.log('[BrandPromises] POST response:', rawText.slice(0, 600));

  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);

  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }

  // Try to use what the server echoed back; fall back to what we sent
  const parsed = parseBrandPromisesRecord(json);
  if (parsed.promises.length === 0 && promises.length > 0) {
    return {
      promises: promises.map((p) => ({ id: null, text: p.text, kpis: p.kpis })),
      videoUrl,
    };
  }
  return parsed;
};

/**
 * DELETE  /extra_fields/:id
 * Deletes a single extra_field record by its server-side id.
 */
const deleteBrandPromiseFromApi = async (id: number) => {
  console.log('[BrandPromises] DELETE /extra_fields/' + id);

  const res = await fetch(`${BASE_URL}/extra_fields/${id}`, {
    method:  'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
  // 204 No Content is success
  return true;
};

// ── Purpose API helpers ──

/**
 * Parses GET /extra_fields?q[group_name_in][]=business_plan_purpose response.
 * Same grouped_data shape as brand promises.
 */
const parsePurposeRecord = (json: any): { purposeText: string; videoUrl: string; recordId: number | null } => {
  // Shape 1 (GET): { success, data: [{id, ...}], grouped_data: { business_plan_purpose: { values, video_url } } }
  if (json?.grouped_data?.business_plan_purpose) {
    const group   = json.grouped_data.business_plan_purpose;
    const values: string[] = group.values ?? [];
    const videoUrl: string = group.video_url ?? '';
    const rows: any[]      = Array.isArray(json.data) ? json.data : [];
    return {
      purposeText: values[0] ?? '',
      videoUrl,
      recordId: rows[0]?.id ?? null,
    };
  }
  // Shape 2 (POST echo): { extra_field: { group_name, values, video_url } }
  if (json?.extra_field) {
    const record = json.extra_field;
    return {
      purposeText: (record.values ?? [])[0] ?? '',
      videoUrl:    record.video_url ?? '',
      recordId:    null,
    };
  }
  return { purposeText: '', videoUrl: '', recordId: null };
};

const fetchPurposeFromApi = async (): Promise<{ purposeText: string; videoUrl: string; recordId: number | null }> => {
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_purpose&include_grouped=true`;
  console.log('[Purpose] GET', url);
  const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  const rawText = await res.text();
  console.log('[Purpose] GET status:', res.status, 'raw:', rawText.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }
  return parsePurposeRecord(json);
};

const savePurposeToApi = async (text: string, videoUrl: string): Promise<void> => {
  const payload = {
    extra_field: {
      group_name: 'business_plan_purpose',
      values:     [text],
      video_url:  videoUrl,
    },
  };
  console.log('[Purpose] POST bulk_upsert', JSON.stringify(payload));
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });
  const rawText = await res.text();
  console.log('[Purpose] POST response:', rawText.slice(0, 400));
  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
};

const deletePurposeFromApi = async (id: number): Promise<void> => {
  console.log('[Purpose] DELETE /extra_fields/' + id);
  const res = await fetch(`${BASE_URL}/extra_fields/${id}`, {
    method:  'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
};

// ── Core Values API helpers ──

interface CoreValueRecord {
  id:    number | null;
  value: string;
}

const parseCoreValuesRecord = (json: any): { values: CoreValueRecord[]; videoUrl: string } => {
  // Shape 1 (GET): { success, data: [{id, field_value, ...}], grouped_data: { business_plan_core_values: { values, video_url } } }
  if (json?.grouped_data?.business_plan_core_values) {
    const group    = json.grouped_data.business_plan_core_values;
    const vals: string[] = group.values ?? [];
    const videoUrl: string = group.video_url ?? '';
    const rows: any[] = Array.isArray(json.data) ? json.data : [];
    return {
      values: vals.map((v: string, idx: number) => ({ id: rows[idx]?.id ?? null, value: v })),
      videoUrl,
    };
  }
  // Shape 2 (POST echo): { extra_field: { group_name, values, video_url } }
  if (json?.extra_field) {
    const record = json.extra_field;
    const vals: string[] = record.values ?? [];
    return {
      values:   vals.map((v: string) => ({ id: null, value: v })),
      videoUrl: record.video_url ?? '',
    };
  }
  return { values: [], videoUrl: '' };
};

const fetchCoreValuesFromApi = async (): Promise<{ values: CoreValueRecord[]; videoUrl: string }> => {
  const url = `${BASE_URL}/extra_fields?q[group_name_in][]=business_plan_core_values&include_grouped=true`;
  console.log('[CoreValues] GET', url);
  const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  const rawText = await res.text();
  console.log('[CoreValues] GET status:', res.status, 'raw:', rawText.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  let json: any;
  try { json = JSON.parse(rawText); } catch { json = {}; }
  return parseCoreValuesRecord(json);
};

const saveCoreValuesToApi = async (values: string[], videoUrl: string): Promise<void> => {
  const payload = {
    extra_field: {
      group_name: 'business_plan_core_values',
      values,
      video_url: videoUrl,
    },
  };
  console.log('[CoreValues] POST bulk_upsert', JSON.stringify(payload));
  const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });
  const rawText = await res.text();
  console.log('[CoreValues] POST response:', rawText.slice(0, 400));
  if (!res.ok) throw new Error(`API error ${res.status}: ${rawText || res.statusText}`);
};

const deleteCoreValueFromApi = async (id: number): Promise<void> => {
  console.log('[CoreValues] DELETE /extra_fields/' + id);
  const res = await fetch(`${BASE_URL}/extra_fields/${id}`, {
    method:  'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
};

// ── Icons ──
const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
    style={{ color: C.textMuted }}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
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
const GearIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ScriptIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const LoaderIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Shared Buttons ──
const BtnPrimary = ({ children, onClick, className = '', icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 active:scale-[0.97] ${className}`}
    style={{ background: C.primary }}
    onMouseEnter={e => (e.currentTarget.style.background = C.primaryHov)}
    onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
  >
    {Icon && <Icon className="w-4 h-4" />}{children}
  </button>
);
const BtnOutline = ({ children, onClick, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white shadow-sm transition-all duration-150 active:scale-[0.97] border ${className}`}
    style={{ borderColor: C.primaryBord, color: C.textMain }}
    onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.borderColor = C.primaryBordStrong; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.primaryBord; }}
  >
    {children}
  </button>
);
const BtnIcon = ({ children, onClick, title = '' }: any) => (
  <button
    onClick={onClick}
    title={title}
    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-sm transition-all duration-150 active:scale-[0.95] border"
    style={{ borderColor: C.primaryBord, color: '#6b7280' }}
    onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.color = C.primary; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6b7280'; }}
  >
    {children}
  </button>
);

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    .bp-modal-portal {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.42);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
    }
    .bp-modal-box {
      background: #fef6f4;
      border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.22);
      box-shadow: 0 30px 80px rgba(0,0,0,0.22);
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
      background: #fef6f4;
      transition: border-color .15s, box-shadow .15s;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
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
      background: #fef6f4;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }
    .bp-select:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-scroll::-webkit-scrollbar { width: 6px; }
    .bp-scroll::-webkit-scrollbar-track { background: transparent; }
    .bp-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
    .bp-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    .bp-error-banner {
      background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;
      border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600;
    }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div className="bp-modal-portal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body,
  );
};

// ── Types ──
interface BrandPromise {
  id:   number | null;  // server-side extra_field_values id (null if not yet persisted)
  text: string;
  kpis: string[];
}

// ── CoreValuesInlineCard: chips + truncated description + hover tooltip ──
const CV_STATIC_DESC = [
  { letter: 'I', label: 'Innovation',  desc: 'We embrace innovative solutions to redefine real estate.' },
  { letter: 'N', label: 'Nurturing',   desc: 'We foster a supportive environment for growth.' },
  { letter: 'A', label: 'Agility',     desc: 'We adapt swiftly to industry changes.' },
  { letter: 'R', label: 'Resilience',  desc: 'We persist through challenges and setbacks.' },
  { letter: 'E', label: 'Empowerment', desc: 'We empower our teams to take initiative and lead.' },
];

const CV_FULL_TEXT = CV_STATIC_DESC.map(d => `${d.letter} - ${d.label}: ${d.desc}`).join(' ');
const TRUNCATED    = CV_FULL_TEXT.length > 80 ? CV_FULL_TEXT.slice(0, 80).trimEnd() + '...' : CV_FULL_TEXT;

const CoreValuesInlineCard: React.FC<{ values: CoreValueRecord[] }> = ({ values }) => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0 });
  const wrapRef               = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    setHovered(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {values.map((v, idx) => (
          <span key={v.id ?? idx} className="px-3 py-1.5 text-[11px] font-bold rounded-xl shadow-sm text-white" style={{ background: C.primary }}>
            {v.value}
          </span>
        ))}
      </div>
      <div ref={wrapRef} className="cursor-default" onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
        <p className="text-[12px] leading-relaxed select-none" style={{ color: C.textMuted }}>
          {TRUNCATED}{' '}
          <span className="font-bold" style={{ color: C.primary }}>Read more</span>
        </p>
        {hovered && ReactDOM.createPortal(
          <div style={{
            position: 'absolute', top: pos.top, left: pos.left, zIndex: 99999,
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)', padding: '16px 18px',
            width: 340, fontSize: 13, lineHeight: 1.6, color: C.textMuted, pointerEvents: 'none',
          }}>
            {CV_STATIC_DESC.map(d => (
              <p key={d.letter} style={{ margin: '0 0 6px' }}>
                <strong style={{ color: C.primary, fontWeight: 800 }}>{d.letter}</strong>
                {' - '}{d.label}: {d.desc}
              </p>
            ))}
          </div>,
          document.body,
        )}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab]   = useState('strategic');
  const [showAddContent, setShowAddContent] = useState(false);
  const [addContentTab, setAddContentTab]   = useState('images');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [activeTopModal, setActiveTopModal] = useState<string | null>(null);

  // ── Purpose (API-backed) ──
  const [purposeText, setPurposeText]           = useState('');
  const [purposeVideoUrl, setPurposeVideoUrl]   = useState('');
  const [purposeRecordId, setPurposeRecordId]   = useState<number | null>(null);
  const [isFetchingPurpose, setIsFetchingPurpose] = useState(true);
  const [purposeFetchError, setPurposeFetchError] = useState<string | null>(null);
  const [isSavingPurpose, setIsSavingPurpose]   = useState(false);
  const [purposeSaveError, setPurposeSaveError] = useState<string | null>(null);
  const [tempPurposeText, setTempPurposeText]   = useState('');
  const [tempPurposeVideoUrl, setTempPurposeVideoUrl] = useState('');

  // ── Core Values (API-backed) ──
  const [coreValues, setCoreValues]               = useState<CoreValueRecord[]>([]);
  const [coreVideoUrl, setCoreVideoUrl]           = useState('');
  const [isFetchingCore, setIsFetchingCore]       = useState(true);
  const [coreFetchError, setCoreFetchError]       = useState<string | null>(null);
  const [isSavingCore, setIsSavingCore]           = useState(false);
  const [coreSaveError, setCoreSaveError]         = useState<string | null>(null);
  // temp state for modal
  const [tempCoreValues, setTempCoreValues]       = useState<CoreValueRecord[]>([]);
  const [tempCoreVideoUrl, setTempCoreVideoUrl]   = useState('');
  const [pendingCoreDeleteIds, setPendingCoreDeleteIds] = useState<number[]>([]);

  // ── Brand Promises (API-backed) ──
  const [brandPromises, setBrandPromises]       = useState<BrandPromise[]>([]);
  const [brandVideoUrl, setBrandVideoUrl]       = useState('');
  const [isFetchingBrand, setIsFetchingBrand]   = useState(true);
  const [brandFetchError, setBrandFetchError]   = useState<string | null>(null);

  // Modal temp state for brand
  const [tempBrandPromises, setTempBrandPromises] = useState<BrandPromise[]>([]);
  const [tempBrandVideoUrl, setTempBrandVideoUrl] = useState('');
  const [isSavingBrand, setIsSavingBrand]         = useState(false);
  const [brandSaveError, setBrandSaveError]       = useState<string | null>(null);
  // Track which promise ids to DELETE on save (removed inside modal)
  const [pendingDeleteIds, setPendingDeleteIds]   = useState<number[]>([]);

  // ── Fetch Brand Promises on mount ──
  const loadBrandPromises = useCallback(async () => {
    setIsFetchingBrand(true);
    setBrandFetchError(null);
    try {
      const { promises, videoUrl } = await fetchBrandPromisesFromApi();
      setBrandPromises(promises);
      setBrandVideoUrl(videoUrl);
    } catch (err: any) {
      console.error('[BrandPromises] fetch error:', err);
      setBrandFetchError(err.message || 'Failed to load brand promises.');
    } finally {
      setIsFetchingBrand(false);
    }
  }, []);

  useEffect(() => { loadBrandPromises(); }, [loadBrandPromises]);

  // ── Fetch Purpose on mount ──
  const loadPurpose = useCallback(async () => {
    setIsFetchingPurpose(true);
    setPurposeFetchError(null);
    try {
      const { purposeText: text, videoUrl, recordId } = await fetchPurposeFromApi();
      setPurposeText(text);
      setPurposeVideoUrl(videoUrl);
      setPurposeRecordId(recordId);
    } catch (err: any) {
      console.error('[Purpose] fetch error:', err);
      setPurposeFetchError(err.message || 'Failed to load purpose.');
    } finally {
      setIsFetchingPurpose(false);
    }
  }, []);

  useEffect(() => { loadPurpose(); }, [loadPurpose]);

  // ── Fetch Core Values on mount ──
  const loadCoreValues = useCallback(async () => {
    setIsFetchingCore(true);
    setCoreFetchError(null);
    try {
      const { values, videoUrl } = await fetchCoreValuesFromApi();
      setCoreValues(values);
      setCoreVideoUrl(videoUrl);
    } catch (err: any) {
      console.error('[CoreValues] fetch error:', err);
      setCoreFetchError(err.message || 'Failed to load core values.');
    } finally {
      setIsFetchingCore(false);
    }
  }, []);

  useEffect(() => { loadCoreValues(); }, [loadCoreValues]);

  // ── Modal openers ──
  const openTopModal = (modalName: string) => {
    if (modalName === 'purpose') {
      setTempPurposeText(purposeText);
      setTempPurposeVideoUrl(purposeVideoUrl);
      setPurposeSaveError(null);
    } else if (modalName === 'core') {
      setTempCoreValues(coreValues.map(v => ({ ...v })));
      setTempCoreVideoUrl(coreVideoUrl);
      setPendingCoreDeleteIds([]);
      setCoreSaveError(null);
    } else if (modalName === 'brand') {
      // Deep-copy current promises into temp state
      setTempBrandPromises(brandPromises.map(p => ({ ...p, kpis: [...p.kpis] })));
      setTempBrandVideoUrl(brandVideoUrl);
      setPendingDeleteIds([]);
      setBrandSaveError(null);
    }
    setActiveTopModal(modalName);
  };

  // ── Purpose save (API) ──
  const saveTopPurpose = async () => {
    setIsSavingPurpose(true);
    setPurposeSaveError(null);
    try {
      // Always DELETE existing record first if it exists
      if (purposeRecordId !== null) {
        await deletePurposeFromApi(purposeRecordId);
        setPurposeRecordId(null);
      }
      // Only POST if there's actual text — empty = just delete (clear)
      if (tempPurposeText.trim()) {
        await savePurposeToApi(tempPurposeText.trim(), tempPurposeVideoUrl.trim());
      }

      // Optimistic update
      setPurposeText(tempPurposeText.trim());
      setPurposeVideoUrl(tempPurposeVideoUrl.trim());
      setActiveTopModal(null);

      // Background re-fetch to sync fresh record id
      fetchPurposeFromApi()
        .then(({ purposeText: text, videoUrl, recordId }) => {
          setPurposeText(text);
          setPurposeVideoUrl(videoUrl);
          setPurposeRecordId(recordId);
        })
        .catch(e => console.warn('[Purpose] background sync failed:', e));
    } catch (err: any) {
      console.error('[Purpose] save error:', err);
      setPurposeSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSavingPurpose(false);
    }
  };

  // ── Core Values save (API) ──
  const saveCoreValues = async () => {
    const filtered = tempCoreValues.filter(v => v.value.trim() !== '');
    setIsSavingCore(true);
    setCoreSaveError(null);
    try {
      // 1. DELETE removed values first
      if (pendingCoreDeleteIds.length > 0) {
        console.log('[CoreValues] deleting ids:', pendingCoreDeleteIds);
        await Promise.all(pendingCoreDeleteIds.map(id => deleteCoreValueFromApi(id)));
      }
      // 2. POST remaining (empty = clear all)
      if (filtered.length > 0) {
        await saveCoreValuesToApi(filtered.map(v => v.value), tempCoreVideoUrl);
      }
      // 3. Optimistic update
      setCoreValues(filtered);
      setCoreVideoUrl(tempCoreVideoUrl);
      setActiveTopModal(null);
      // 4. Background re-fetch to sync fresh ids
      fetchCoreValuesFromApi()
        .then(({ values, videoUrl }) => {
          setCoreValues(values);
          setCoreVideoUrl(videoUrl);
        })
        .catch(e => console.warn('[CoreValues] background sync failed:', e));
    } catch (err: any) {
      console.error('[CoreValues] save error:', err);
      setCoreSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSavingCore(false);
    }
  };

  // ── Brand Promises: save ──
  // Strategy: DELETE removed records first (by their DB id), then POST the remaining
  // ones via bulk_upsert. This order ensures the server never re-creates deleted rows.
  const saveBrandPromises = async () => {
    const filtered = tempBrandPromises.filter(p => p.text.trim() !== '');

    setIsSavingBrand(true);
    setBrandSaveError(null);
    try {
      // 1. DELETE removed promises first (so bulk_upsert doesn't re-create them)
      if (pendingDeleteIds.length > 0) {
        console.log('[BrandPromises] deleting ids:', pendingDeleteIds);
        await Promise.all(pendingDeleteIds.map(id => deleteBrandPromiseFromApi(id)));
      }

      // 2. POST remaining promises (empty array = clear all)
      if (filtered.length > 0) {
        await saveBrandPromisesToApi(filtered, tempBrandVideoUrl);
      }

      // 3. Optimistic UI update immediately from temp state
      setBrandPromises(filtered.map(p => ({ ...p })));
      setBrandVideoUrl(tempBrandVideoUrl);
      setActiveTopModal(null);

      // 4. Background re-fetch to get fresh server ids
      fetchBrandPromisesFromApi()
        .then(({ promises, videoUrl }) => {
          setBrandPromises(promises);
          setBrandVideoUrl(videoUrl);
        })
        .catch(e => console.warn('[BrandPromises] background sync failed:', e));

    } catch (err: any) {
      console.error('[BrandPromises] save error:', err);
      setBrandSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSavingBrand(false);
    }
  };

  // ── Brand promise modal handlers ──
  const handleBrandPromiseChange = (index: number, value: string) => {
    const updated = [...tempBrandPromises];
    updated[index] = { ...updated[index], text: value };
    setTempBrandPromises(updated);
  };

  const handleDeleteBrandPromise = (index: number) => {
    const promise = tempBrandPromises[index];
    // If it has a server id, queue for DELETE on save
    if (promise.id !== null) {
      setPendingDeleteIds(prev => [...prev, promise.id as number]);
    }
    setTempBrandPromises(tempBrandPromises.filter((_, i) => i !== index));
  };

  const handleAddBrandPromise = () => {
    setTempBrandPromises([...tempBrandPromises, { id: null, text: '', kpis: [] }]);
  };

  // Add/remove a KPI for a promise inside the modal
  const handleAddKpiToBrandPromise = (promiseIndex: number, kpi: string) => {
    if (!kpi) return;
    const updated = [...tempBrandPromises];
    const current = updated[promiseIndex].kpis;
    if (current.length >= 3 || current.includes(kpi)) return;
    updated[promiseIndex] = { ...updated[promiseIndex], kpis: [...current, kpi] };
    setTempBrandPromises(updated);
  };

  const handleRemoveKpiFromBrandPromise = (promiseIndex: number, kpi: string) => {
    const updated = [...tempBrandPromises];
    updated[promiseIndex] = {
      ...updated[promiseIndex],
      kpis: updated[promiseIndex].kpis.filter(k => k !== kpi),
    };
    setTempBrandPromises(updated);
  };

  // ── Core value helpers ──
  const handleCoreValueChange = (index: number, value: string) => {
    const updated = [...tempCoreValues];
    updated[index] = { ...updated[index], value };
    setTempCoreValues(updated);
  };
  const handleDeleteCoreValue = (index: number) => {
    const item = tempCoreValues[index];
    if (item.id !== null) setPendingCoreDeleteIds(prev => [...prev, item.id as number]);
    setTempCoreValues(tempCoreValues.filter((_, i) => i !== index));
  };
  const handleAddCoreValue = () =>
    setTempCoreValues([...tempCoreValues, { id: null, value: '' }]);

  const tabs = [
    { key: 'strategic', label: 'Strategic Plan' },
    { key: 'goals', label: 'Goals' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-[1400px] mx-auto" style={{ background: '#fafafa', color: C.textMain }}>
      <ThemeStyle />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: C.textMuted }}>
            Strategic overview and goals alignment
          </div>
          <h1 className="text-2xl font-black" style={{ color: '#111' }}>
            Business plan for HAVEN INFOLINE PRIVATE LIMITED
          </h1>
        </div>
        <div className="flex gap-3">
          <BtnOutline>Copy Plan</BtnOutline>
          <BtnPrimary>✨ Create with AI</BtnPrimary>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="flex rounded-2xl p-1 gap-1 mb-8 overflow-x-auto"
        style={{ background: C.primary }}
      >
        {tabs.map(tab => {
          const isActive = activeMainTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveMainTab(tab.key)}
              className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap"
              style={{
                background: isActive ? '#fff' : 'transparent',
                color:      isActive ? C.primary : 'rgba(255,255,255,0.8)',
                boxShadow:  isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* STRATEGIC PLAN VIEW */}
      {activeMainTab === 'strategic' && (
        <div className="space-y-6">

          {/* Business Plan header row */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl border shadow-sm bg-white"
            style={{ borderColor: C.borderLgt }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-bold text-[14px]" style={{ color: C.textMain }}>
                <EyeIcon /> Our Business Plan
              </div>
              <button
                onClick={() => setShowAddContent(!showAddContent)}
                className="px-4 py-1.5 text-[12px] font-bold rounded-xl border transition-all shadow-sm active:scale-[0.97]"
                style={{
                  background:  showAddContent ? C.primaryBg : '#fff',
                  borderColor: showAddContent ? C.primaryBordStrong : C.primaryBord,
                  color:       C.primary,
                }}
              >
                Add Content
              </button>
            </div>
            <div className="flex items-center gap-2">
              <BtnIcon title="Info">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </BtnIcon>
              <BtnIcon onClick={() => setShowAddContent(!showAddContent)}>
                <ChevronIcon isExpanded={showAddContent} />
              </BtnIcon>
            </div>
          </div>

          {/* Add Content Dropdown */}
          {showAddContent && (
            <div
              className="rounded-2xl overflow-hidden border border-dashed"
              style={{ borderColor: C.primaryBordStrong, background: C.primaryBg }}
            >
              <div className="flex border-b" style={{ borderColor: C.primaryBord, background: 'rgba(255,255,255,0.6)' }}>
                {['images', 'video'].map(t => (
                  <button
                    key={t}
                    onClick={() => setAddContentTab(t)}
                    className="flex-1 py-3 text-[13px] font-bold transition-colors capitalize"
                    style={{
                      background: addContentTab === t ? C.primary : 'transparent',
                      color:      addContentTab === t ? '#fff' : C.textMain,
                    }}
                  >
                    {t === 'images' ? 'Images' : 'Explainer Video'}
                  </button>
                ))}
              </div>
              <div className="p-10 flex flex-col items-center text-center">
                {addContentTab === 'images' && (
                  !showImageInput ? (
                    <div className="flex flex-col items-center">
                      <ImagePlaceholder />
                      <p className="text-[13px] font-bold mb-5" style={{ color: C.textMuted }}>No images added yet</p>
                      <BtnPrimary onClick={() => setShowImageInput(true)}><GearIcon /> Add Images</BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Images</span>
                        <button onClick={() => setShowImageInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input type="text" placeholder="Paste image URL or Google Drive link..." className="bp-input flex-1" />
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold border transition-all active:scale-[0.97]" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>+ Add</button>
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold text-white shadow-sm transition-all active:scale-[0.97]" style={{ background: C.primary }}>↑ Upload</button>
                      </div>
                      <div className="text-[11px] mb-5 text-left font-semibold" style={{ color: C.textMuted }}>
                        0/12 images • Max 1 MB per image.{' '}
                        <a href="#" style={{ color: C.primary }} className="hover:underline">Compress images here</a>
                      </div>
                      <div className="text-[11px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm" style={{ borderColor: C.borderLgt, color: C.textMain }}>✨ Create Image (overview)</button>
                        <button className="flex-1 py--2.5 bg-white border rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm" style={{ borderColor: C.borderLgt, color: C.textMain }}>✨ Create Image (detailed)</button>
                      </div>
                    </div>
                  )
                )}
                {addContentTab === 'video' && (
                  !showVideoInput ? (
                    <div className="flex flex-col items-center">
                      <VideoPlaceholder />
                      <p className="text-[13px] font-bold mb-5" style={{ color: C.textMuted }}>No explainer videos added yet</p>
                      <BtnPrimary onClick={() => setShowVideoInput(true)}><GearIcon /> Add Videos</BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Videos</span>
                        <button onClick={() => setShowVideoInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input type="text" placeholder="Paste YouTube, Vimeo, or direct video URL..." className="bp-input flex-1" />
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold border transition-all active:scale-[0.97]" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>+ Add</button>
                      </div>
                      <div className="text-[11px] font-bold mb-5 text-left" style={{ color: C.textMuted }}>0/12 videos added</div>
                      <div className="text-[11px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                      <button className="w-full py-2.5 bg-white border rounded-xl flex items-center justify-center text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm" style={{ borderColor: C.borderLgt, color: C.textMain }}><ScriptIcon /> Create Video Script</button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Core Values */}
            <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>Core Values <InfoIcon /></h3>
                <button onClick={() => openTopModal('core')} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: '#9ca3af' }} onMouseEnter={e => e.currentTarget.style.color = C.primary} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}><EditIcon /></button>
              </div>
              {isFetchingCore ? (
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="h-7 w-20 rounded-xl animate-pulse" style={{ background: '#f3f4f6' }} />
                  ))}
                </div>
              ) : coreFetchError ? (
                <div className="text-[12px] text-red-500 font-semibold">
                  ⚠ {coreFetchError}{' '}
                  <button onClick={loadCoreValues} className="underline hover:no-underline">Retry</button>
                </div>
              ) : coreValues.length === 0 ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => openTopModal('core')}
                    className="flex flex-col items-center justify-center w-full py-4 rounded-xl border-2 border-dashed transition-all"
                    style={{ borderColor: 'rgba(218,119,86,0.30)', background: 'rgba(218,119,86,0.03)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryBg; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(218,119,86,0.30)'; e.currentTarget.style.background = 'rgba(218,119,86,0.03)'; }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ background: C.primaryTint }}>
                      <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-bold" style={{ color: C.primary }}>Add Core Values</span>
                  </button>
                  {/* Truncated description */}
                  <p className="text-[12px] leading-relaxed" style={{ color: C.textMuted }}>
                    {TRUNCATED}{' '}
                    <span className="font-bold" style={{ color: C.primary }}>Read more</span>
                  </p>
                </div>
              ) : (
                <CoreValuesInlineCard values={coreValues} />
              )}
            </div>

            {/* Purpose */}
            <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>Purpose <InfoIcon /></h3>
                <button onClick={() => openTopModal('purpose')} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: '#9ca3af' }} onMouseEnter={e => e.currentTarget.style.color = C.primary} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}><EditIcon /></button>
              </div>
              {isFetchingPurpose ? (
                <div className="space-y-2">
                  {[1,2,3].map(n => (
                    <div key={n} className="h-3 rounded-lg animate-pulse" style={{ background: '#f3f4f6', width: n === 3 ? '50%' : '95%' }} />
                  ))}
                </div>
              ) : purposeFetchError ? (
                <div className="text-[12px] text-red-500 font-semibold">
                  ⚠ {purposeFetchError}{' '}
                  <button onClick={loadPurpose} className="underline hover:no-underline">Retry</button>
                </div>
              ) : purposeText ? (
                <p className="text-[13px] font-bold leading-relaxed" style={{ color: C.primary }}>{purposeText}</p>
              ) : (
                <button
                  onClick={() => openTopModal('purpose')}
                  className="flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed transition-all"
                  style={{ borderColor: 'rgba(218,119,86,0.30)', background: 'rgba(218,119,86,0.03)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryBg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(218,119,86,0.30)'; e.currentTarget.style.background = 'rgba(218,119,86,0.03)'; }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ background: C.primaryTint }}>
                    <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: C.primary }}>Add Purpose</span>
                </button>
              )}
            </div>

            {/* Brand Promises */}
            <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>Brand Promises <InfoIcon /></h3>
                <button onClick={() => openTopModal('brand')} className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]" style={{ color: '#9ca3af' }} onMouseEnter={e => e.currentTarget.style.color = C.primary} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}><EditIcon /></button>
              </div>

              {/* Loading / error / data */}
              {isFetchingBrand ? (
                <div className="space-y-2">
                  {[1,2,3].map(n => (
                    <div key={n} className="h-4 rounded-lg animate-pulse" style={{ background: '#f3f4f6', width: n === 3 ? '60%' : '90%' }} />
                  ))}
                </div>
              ) : brandFetchError ? (
                <div className="text-[12px] text-red-500 font-semibold">
                  ⚠ {brandFetchError}{' '}
                  <button onClick={loadBrandPromises} className="underline hover:no-underline">Retry</button>
                </div>
              ) : brandPromises.length === 0 ? (
                /* Empty state — clickable to open modal */
                <button
                  onClick={() => openTopModal('brand')}
                  className="flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed transition-all group"
                  style={{ borderColor: 'rgba(218,119,86,0.30)', background: 'rgba(218,119,86,0.03)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryBg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(218,119,86,0.30)'; e.currentTarget.style.background = 'rgba(218,119,86,0.03)'; }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors"
                    style={{ background: C.primaryTint }}
                  >
                    <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: C.primary }}>Add Promise</span>
                </button>
              ) : (
                <ul className="space-y-3 text-[12px]" style={{ color: C.textMuted }}>
                  {brandPromises.map((p, idx) => (
                    <li key={p.id ?? idx} className="flex items-start">
                      <span className="mr-2 mt-0.5 shrink-0 font-black" style={{ color: C.primary }}>•</span>
                      <div>
                        <div dangerouslySetInnerHTML={{
                          __html: p.text.replace(/([^-]+)/, `<strong style="color:${C.textMain};font-weight:800;">$1</strong>`),
                        }} />
                        {p.kpis.length > 0
                          ? <p className="text-[11px] text-gray-400 mt-0.5">{p.kpis.join(', ')}</p>
                          : <p className="text-[11px] text-gray-400 italic mt-0.5">No KPIs linked</p>
                        }
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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

      {activeMainTab === 'goals' && <GoalsView />}

      {/* MODALS */}
      {activeTopModal && (
        <Modal onClose={() => setActiveTopModal(null)}>
          <div className="bp-modal-box">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b bg-white" style={{ borderColor: C.primaryBord }}>
              <div className="flex items-center gap-3">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, flexShrink: 0, display: 'inline-block' }} />
                <h2 className="font-bold text-[17px] m-0" style={{ color: C.textMain }}>
                  Edit {activeTopModal === 'core' ? 'Core Values' : activeTopModal === 'purpose' ? 'Purpose' : 'Brand Promises'}
                </h2>
              </div>
              <BtnIcon onClick={() => setActiveTopModal(null)}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </BtnIcon>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto bp-scroll">

              {/* ── Purpose ── */}
              {activeTopModal === 'purpose' && (
                <div className="space-y-5">
                  {purposeSaveError && <div className="bp-error-banner">{purposeSaveError}</div>}
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Explanation / Text <span style={{ color: C.primary }}>*</span></label>
                    <textarea value={tempPurposeText} onChange={e => setTempPurposeText(e.target.value)} className="bp-input font-bold resize-y" style={{ minHeight: 140 }} placeholder="Describe your company purpose..." />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempPurposeVideoUrl} onChange={e => setTempPurposeVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: C.textMuted }}>Supports YouTube, Vimeo, and direct video files (.mp4, etc.)</p>
                  </div>
                </div>
              )}

              {/* ── Core Values ── */}
              {activeTopModal === 'core' && (
                <div className="space-y-5">
                  {coreSaveError && <div className="bp-error-banner">{coreSaveError}</div>}
                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>Core Values</label>
                    <div className="space-y-2.5 mb-3">
                      {tempCoreValues.map((item, idx) => (
                        <div key={item.id ?? idx} className="flex items-center gap-3 border rounded-xl p-2.5 bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300"><GripIcon /></div>
                          <input
                            type="text" value={item.value}
                            onChange={e => handleCoreValueChange(idx, e.target.value)}
                            className="flex-1 outline-none text-[13px] font-bold bg-transparent"
                            style={{ color: C.textMain }}
                            placeholder="Add core value"
                            autoFocus={idx === tempCoreValues.length - 1 && item.value === ''}
                          />
                          <button onClick={() => handleDeleteCoreValue(idx)} className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"><TrashIcon /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddCoreValue} className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-xl transition-colors border-2 border-dashed mb-5" style={{ borderColor: C.borderLgt, color: C.textMain }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <PlusIcon /> Add Item
                    </button>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempCoreVideoUrl} onChange={e => setTempCoreVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                  </div>
                </div>
              )}

              {/* ── Brand Promises ── */}
              {activeTopModal === 'brand' && (
                <div className="space-y-5">
                  {/* Error banner */}
                  {brandSaveError && <div className="bp-error-banner">{brandSaveError}</div>}

                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input type="text" value={tempBrandVideoUrl} onChange={e => setTempBrandVideoUrl(e.target.value)} placeholder="Paste YouTube, Vimeo, or Direct Video URL..." className="bp-input" />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>Promises</label>
                    <div className="space-y-2.5 mb-3">
                      {tempBrandPromises.map((item, idx) => (
                        <div key={item.id ?? idx} className="flex items-center gap-3 border rounded-xl p-2.5 bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300"><GripIcon /></div>
                          <input
                            type="text" value={item.text}
                            onChange={e => handleBrandPromiseChange(idx, e.target.value)}
                            className="flex-1 outline-none text-[13px] font-bold bg-transparent"
                            style={{ color: C.textMain }}
                            placeholder="Add promise"
                            autoFocus={idx === tempBrandPromises.length - 1 && item.text === ''}
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
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-xl transition-colors border-2 border-dashed mb-5"
                      style={{ borderColor: C.borderLgt, color: C.textMain }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>

                  {/* KPI Linking */}
                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>
                      Link KPIs to Promises (Max 3 per promise)
                    </label>
                    <div className="max-h-[280px] overflow-y-auto bp-scroll space-y-3 pr-1">
                      {tempBrandPromises.filter(p => p.text.trim() !== '').map((item, idx) => (
                        <div key={item.id ?? idx} className="border p-4 rounded-xl bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="text-[13px] font-bold mb-3 leading-snug" style={{ color: C.textMain }}>{item.text}</div>

                          {/* Linked KPI chips */}
                          {item.kpis.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.kpis.map(kpi => (
                                <span
                                  key={kpi}
                                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg text-white"
                                  style={{ background: C.primary }}
                                >
                                  {kpi}
                                  <button
                                    onClick={() => handleRemoveKpiFromBrandPromise(idx, kpi)}
                                    className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                                  >✕</button>
                                </span>
                              ))}
                            </div>
                          )}

                          {item.kpis.length < 3 ? (
                            <select
                              className="bp-select text-gray-500"
                              value=""
                              onChange={e => handleAddKpiToBrandPromise(idx, e.target.value)}
                            >
                              <option value="">Link a KPI...</option>
                              <option value="Customer Satisfaction Score">Customer Satisfaction Score</option>
                              <option value="Revenue Growth">Revenue Growth</option>
                              <option value="Project Completion Rate">Project Completion Rate</option>
                              <option value="Invoices Raised">Invoices Raised</option>
                              <option value="AI Task Completion Rate">AI Task Completion Rate</option>
                              <option value="Lead Conversion Rate">Lead Conversion Rate</option>
                              <option value="Monthly Revenue">Monthly Revenue</option>
                              <option value="New Partnerships Formed">New Partnerships Formed</option>
                            </select>
                          ) : (
                            <div className="text-[11px] italic font-medium mt-1" style={{ color: C.textMuted }}>Max 3 KPIs reached.</div>
                          )}
                        </div>
                      ))}
                      {tempBrandPromises.filter(p => p.text.trim() !== '').length === 0 && (
                        <p className="text-[13px] text-gray-400 italic">Add promises above to link KPIs.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
              <BtnOutline onClick={() => setActiveTopModal(null)} >Cancel</BtnOutline>
              <button
                disabled={
                  (activeTopModal === 'brand'   && isSavingBrand)   ||
                  (activeTopModal === 'purpose' && isSavingPurpose) ||
                  (activeTopModal === 'core'    && isSavingCore)
                }
                onClick={() => {
                  if (activeTopModal === 'purpose')     saveTopPurpose();
                  else if (activeTopModal === 'core')   saveCoreValues();
                  else if (activeTopModal === 'brand')  saveBrandPromises();
                  else setActiveTopModal(null);
                }}
                className="px-6 py-2 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97] flex items-center gap-2 disabled:opacity-60"
                style={{ background: '#1a1a1a' }}
                onMouseEnter={e => {
                  const saving = (activeTopModal === 'brand' && isSavingBrand) || (activeTopModal === 'purpose' && isSavingPurpose) || (activeTopModal === 'core' && isSavingCore);
                  if (!saving) e.currentTarget.style.background = '#000';
                }}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
              >
                {((activeTopModal === 'brand' && isSavingBrand) || (activeTopModal === 'purpose' && isSavingPurpose) || (activeTopModal === 'core' && isSavingCore)) && <LoaderIcon />}
                {((activeTopModal === 'brand' && isSavingBrand) || (activeTopModal === 'purpose' && isSavingPurpose) || (activeTopModal === 'core' && isSavingCore)) ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BusinessPlanAndGoles;