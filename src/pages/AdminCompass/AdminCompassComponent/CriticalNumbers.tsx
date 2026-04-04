import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

// ── Design tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
};

const BASE_URL = 'https://fm-uat-api.lockated.com';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Types ──
interface Kpi {
  id:            number;
  name:          string;
  description?:  string;
  category?:     string;
  unit?:         string;
  frequency:     string;
  target_value?: number | null;
  current_value?: number | null;
  department_id?: number | null;
  assignee_id?:  number | null;
  // local UI state
  selected:      boolean;
  owner?:        string | null;
}

interface KpiFormState {
  name:        string;
  unit:        string;
  frequency:   string;
  target_value: string;
  department:  string;
  assign_to:   string;
}

const EMPTY_FORM: KpiFormState = {
  name: '', unit: 'Select unit',
  frequency: 'Monthly', target_value: '',
  department: 'Select', assign_to: 'Select user',
};

// ── API helpers ──
const fetchKpisFromApi = async (): Promise<Kpi[]> => {
  const res = await fetch(`${BASE_URL}/kpis`, { method: 'GET', headers: getAuthHeaders() });
  const raw = await res.text();
  console.log('[KPIs] GET status:', res.status, 'raw:', raw.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
  let json: any;
  try { json = JSON.parse(raw); } catch { json = []; }
  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.kpis)
        ? json.data.kpis
        : json.kpis ?? [];
  console.log('[KPIs] GET list count:', list.length, 'ids:', list.map((k:any) => k.id));
  return list.map((k: any) => ({
    id:            k.id,
    name:          k.name ?? '',
    description:   k.description ?? '',
    category:      k.category ?? '',
    unit:          k.unit ?? '',
    frequency:     k.frequency ?? 'monthly',
    target_value:  k.target_value ?? null,
    current_value: k.current_value ?? null,
    department_id: k.department_id ?? null,
    assignee_id:   k.assignee_id ?? null,
    owner:         k.assignee?.name ?? k.owner ?? null,
    selected:      true, // all fetched KPIs shown as selected by default
  }));
};

const createKpiInApi = async (form: KpiFormState): Promise<Kpi> => {
  const payload = {
    kpi: {
      name:        form.name.trim(),
      unit:        form.unit !== 'Select unit' ? form.unit : undefined,
      frequency:   form.frequency.toLowerCase(),
      target_value: form.target_value ? parseFloat(form.target_value) : undefined,
      department:  form.department !== 'Select' ? form.department : undefined,
      assign_to:   form.assign_to !== 'Select user' ? form.assign_to : undefined,
    },
  };
  console.log('[KPIs] POST payload:', JSON.stringify(payload));
  const res = await fetch(`${BASE_URL}/kpis`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  const raw = await res.text();
  console.log('[KPIs] POST response:', raw.slice(0, 400));
  if (!res.ok) throw new Error(`API error ${res.status}: ${raw || res.statusText}`);
  let json: any;
  try { json = JSON.parse(raw); } catch { json = {}; }
  // Handle { success, data: { kpi: {...} } } OR { kpi: {...} } OR bare object
  const k = json.data?.kpi ?? json.data ?? json.kpi ?? json;
  console.log('[KPIs] POST parsed kpi id:', k?.id);
  return {
    id:            k.id,
    name:          k.name ?? form.name,
    description:   k.description ?? '',
    category:      k.category ?? '',
    unit:          k.unit ?? '',
    frequency:     k.frequency ?? form.frequency.toLowerCase(),
    target_value:  k.target_value ?? null,
    current_value: k.current_value ?? null,
    department_id: k.department_id ?? null,
    assignee_id:   k.assignee_id ?? null,
    owner:         k.assignee?.name ?? null,
    selected:      true,
  };
};

const updateKpiInApi = async (id: number, patch: Partial<{ current_value: number; target_value: number; frequency: string }>) => {
  const payload = { kpi: patch };
  console.log('[KPIs] PUT /kpis/' + id, 'type:', typeof id, JSON.stringify(payload));
  const res = await fetch(`${BASE_URL}/kpis/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  const raw = await res.text();
  console.log('[KPIs] PUT response:', raw.slice(0, 300));
  if (!res.ok) throw new Error(`PUT error ${res.status}: ${raw || res.statusText}`);
};

const deleteKpiFromApi = async (id: number) => {
  console.log('[KPIs] DELETE /kpis/' + id);
  const res = await fetch(`${BASE_URL}/kpis/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
};

// ── Icons ──
const TrendIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const QuestionIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const LoaderIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Styles ──
const ModalStyle = () => (
  <style>{`
    .kpi-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
    }
    .kpi-modal-box {
      background: ${C.primaryBg}; border-radius: 20px;
      border: 1px solid ${C.primaryBord};
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      width: 100%; max-width: 520px;
      display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;
    }
    .kpi-input {
      width: 100%; border: 1px solid #ede8e5; border-radius: 12px;
      padding: 10px 12px; font-size: 13px; color: #171717;
      background: #ffffff; transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box; outline: none; font-family: inherit;
    }
    .kpi-input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kpi-input::placeholder { color: #a3a3a3; }
    .kpi-select {
      width: 100%; border: 1px solid #ede8e5; border-radius: 12px;
      padding: 10px 36px 10px 12px; font-size: 13px; color: #171717;
      background: #ffffff; appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      cursor: pointer; outline: none; box-sizing: border-box;
    }
    .kpi-select:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kpi-checkbox { width: 18px; height: 18px; accent-color: ${C.primary}; cursor: pointer; flex-shrink: 0; }
    .kpi-error { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div className="kpi-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body,
  );
};

const UNITS       = ['Select unit', '%', '₹', '$', 'Count', 'Hours', 'Days', 'Score'];
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const DEPARTMENTS = ['Select', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Tech', 'Customer Success'];
const USERS       = ['Select user', 'Punit Jain', 'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta'];

// ══════════════════════════════════════════════════════════
export const CriticalNumbers = () => {
  const [kpis, setKpis]                   = useState<Kpi[]>([]);
  const [isFetching, setIsFetching]       = useState(true);
  const [fetchError, setFetchError]       = useState<string | null>(null);

  const [showSelectPanel, setShowSelectPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKpi, setEditingKpi]           = useState<Kpi | null>(null);

  const [form, setForm]           = useState<KpiFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // DELETE state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Fetch on mount ──
  const loadKpis = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const data = await fetchKpisFromApi();
      setKpis(data);
    } catch (err: any) {
      console.error('[KPIs] fetch error:', err);
      setFetchError(err.message || 'Failed to load KPIs.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { loadKpis(); }, [loadKpis]);

  const selectedCount = kpis.filter(k => k.selected).length;

  const toggleKpi = (id: number) =>
    setKpis(prev => prev.map(k => k.id === id ? { ...k, selected: !k.selected } : k));

  // ── Open create modal ──
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setShowCreateModal(true);
  };

  // ── Open edit modal ──
  const openEdit = (kpi: Kpi) => {
    setForm({
      name:         kpi.name,
      unit:         kpi.unit ?? 'Select unit',
      frequency:    kpi.frequency ? (kpi.frequency.charAt(0).toUpperCase() + kpi.frequency.slice(1)) : 'Monthly',
      target_value: kpi.target_value != null ? String(kpi.target_value) : '',
      department:   'Select',
      assign_to:    kpi.owner ?? 'Select user',
    });
    setEditingKpi(kpi);
    setSaveError(null);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setShowCreateModal(false);
  };

  // ── Create ──
  const handleCreate = async () => {
    if (!form.name.trim()) { setSaveError('KPI Name is required.'); return; }
    setIsSaving(true); setSaveError(null);
    try {
      const created = await createKpiInApi(form);
      setKpis(prev => [...prev, created]);
      closeModal();
      // Re-fetch to get authoritative server id (in case POST echo had wrong/missing id)
      fetchKpisFromApi()
        .then(data => setKpis(data))
        .catch(e => console.warn('[KPIs] post-create sync failed:', e));
    } catch (err: any) {
      setSaveError(err.message || 'Failed to create KPI.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Update (PUT) ──
  const handleUpdate = async () => {
    if (!editingKpi) return;
    if (!form.name.trim()) { setSaveError('KPI Name is required.'); return; }
    setIsSaving(true); setSaveError(null);
    try {
      const patch = {
        target_value: form.target_value ? parseFloat(form.target_value) : undefined,
        frequency:    form.frequency.toLowerCase(),
      };
      await updateKpiInApi(editingKpi.id, patch);
      // Optimistic update
      setKpis(prev => prev.map(k => k.id === editingKpi.id ? {
        ...k,
        name:         form.name,
        unit:         form.unit !== 'Select unit' ? form.unit : k.unit,
        frequency:    form.frequency.toLowerCase(),
        target_value: form.target_value ? parseFloat(form.target_value) : k.target_value,
        owner:        form.assign_to !== 'Select user' ? form.assign_to : k.owner,
      } : k));
      closeModal();
      // Background re-fetch to sync
      fetchKpisFromApi()
        .then(data => setKpis(data))
        .catch(e => console.warn('[KPIs] background sync failed:', e));
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update KPI.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteKpiFromApi(id);
      setKpis(prev => prev.filter(k => k.id !== id));
    } catch (err: any) {
      console.error('[KPIs] delete error:', err);
      setFetchError(err.message || 'Failed to delete KPI.');
    } finally {
      setDeletingId(null);
    }
  };

  const canSave = form.name.trim().length > 0;

  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
      <ModalStyle />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(218,119,86,0.3)', flexShrink: 0,
          }}>
            <TrendIcon />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', margin: 0 }}>
            Critical Numbers (KPIs)
          </h1>
          <QuestionIcon />
          {isFetching && <LoaderIcon />}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: C.primary }}
            onMouseEnter={e => e.currentTarget.style.color = C.primaryHov}
            onMouseLeave={e => e.currentTarget.style.color = C.primary}
          >
            <PlusIcon /> Create New
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => setShowSelectPanel(v => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <EditIcon /> Select KPIs
          </button>
        </div>
      </div>

      {/* ── Fetch error ── */}
      {fetchError && (
        <div className="kpi-error flex items-center justify-between mb-4">
          <span>⚠ {fetchError}</span>
          <button onClick={loadKpis} className="underline text-sm font-semibold ml-4">Retry</button>
        </div>
      )}

      {/* ── KPI Selection Panel ── */}
      {showSelectPanel && (
        <div style={{
          background: C.primaryBg, border: `1px solid ${C.primaryBord}`,
          borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: 16,
        }}>
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Select KPIs to display as Critical Numbers (3–5 recommended):
          </p>

          {isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {[1,2,3,4].map(n => (
                <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: '#f3f4f6' }} />
              ))}
            </div>
          ) : kpis.length === 0 ? (
            <p className="text-sm text-gray-400 italic mb-5">No KPIs found. Create one above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {kpis.map(kpi => (
                <label
                  key={kpi.id}
                  className="flex items-start gap-3 p-3.5 bg-white rounded-xl cursor-pointer transition-all hover:shadow-sm"
                  style={{ border: `1.5px solid ${kpi.selected ? C.primary : '#ede8e5'}` }}
                >
                  <input
                    type="checkbox"
                    checked={kpi.selected}
                    onChange={() => toggleKpi(kpi.id)}
                    className="kpi-checkbox mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#171717] leading-tight">{kpi.name}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{kpi.frequency}</span>
                      {kpi.unit && <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{kpi.unit}</span>}
                      {kpi.owner && <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{kpi.owner}</span>}
                    </div>
                  </div>
                  {/* Edit + Delete inline */}
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    <button
                      onClick={e => { e.preventDefault(); openEdit(kpi); }}
                      className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); handleDelete(kpi.id); }}
                      disabled={deletingId === kpi.id}
                      className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === kpi.id ? <LoaderIcon /> : <TrashIcon />}
                    </button>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.primaryBord }}>
            <span className="text-sm text-gray-500 font-medium">
              Selected: <span className="font-bold text-gray-800">{selectedCount} KPIs</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSelectPanel(false)}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSelectPanel(false)}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 700, color: '#fff', background: C.primary, border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px rgba(218,119,86,0.3)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.primaryHov}
                onMouseLeave={e => e.currentTarget.style.background = C.primary}
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI Cards (selected ones) ── */}
      {!showSelectPanel && !isFetching && kpis.filter(k => k.selected).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.filter(k => k.selected).map(kpi => (
            <div
              key={kpi.id}
              className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all group"
              style={{ borderColor: '#ede8e5' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[13px] font-bold text-[#171717] leading-snug flex-1 pr-2">{kpi.name}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(kpi)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(kpi.id)}
                    disabled={deletingId === kpi.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === kpi.id ? <LoaderIcon /> : <TrashIcon />}
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black" style={{ color: C.primary }}>
                    {kpi.current_value ?? '—'}{kpi.unit && kpi.unit !== 'Select unit' ? ` ${kpi.unit}` : ''}
                  </p>
                  {kpi.target_value != null && (
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Target: {kpi.target_value}{kpi.unit && kpi.unit !== 'Select unit' ? ` ${kpi.unit}` : ''}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg capitalize">
                  {kpi.frequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!showSelectPanel && !isFetching && kpis.filter(k => k.selected).length === 0 && !fetchError && (
        <button
          onClick={openCreate}
          className="flex flex-col items-center justify-center w-full py-10 rounded-2xl border-2 border-dashed transition-all"
          style={{ borderColor: 'rgba(218,119,86,0.30)', background: 'rgba(218,119,86,0.03)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryBg; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(218,119,86,0.30)'; e.currentTarget.style.background = 'rgba(218,119,86,0.03)'; }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: C.primaryTint }}>
            <PlusIcon />
          </div>
          <span className="text-[13px] font-bold" style={{ color: C.primary }}>Create First KPI</span>
        </button>
      )}

      {/* ══ Create / Edit Modal ══ */}
      {showCreateModal && (
        <Modal onClose={closeModal}>
          <div className="kpi-modal-box">

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 16px', borderBottom: `1px solid ${C.primaryBord}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, display: 'inline-block', flexShrink: 0 }} />
                <h2 style={{ fontSize: 19, fontWeight: 800, color: '#171717', margin: 0 }}>
                  {editingKpi ? 'Edit KPI' : 'Create New KPI'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {saveError && <div className="kpi-error">{saveError}</div>}

              {/* KPI Name */}
              <div>
                <label className="block text-[13px] font-bold text-[#171717] mb-1.5">
                  KPI Name <span style={{ color: C.primary }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Revenue, Calls Made"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="kpi-input"
                  autoFocus
                />
              </div>

              {/* Unit + Target Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Unit</label>
                  <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="kpi-select">
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Target Value</label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    value={form.target_value}
                    onChange={e => setForm({ ...form, target_value: e.target.value })}
                    className="kpi-input"
                  />
                </div>
              </div>

              {/* Department + Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">
                    Department <span style={{ color: C.primary }}>*</span>
                  </label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="kpi-select">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">
                    Frequency <span style={{ color: C.primary }}>*</span>
                  </label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="kpi-select">
                    {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Assign to User */}
              <div>
                <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Assign to User</label>
                <select value={form.assign_to} onChange={e => setForm({ ...form, assign_to: e.target.value })} className="kpi-select">
                  {USERS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px', borderTop: `1px solid ${C.primaryBord}`, background: C.primaryBg, flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <button
                onClick={closeModal}
                style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={editingKpi ? handleUpdate : handleCreate}
                disabled={!canSave || isSaving}
                style={{
                  padding: '10px 22px', fontSize: 13, fontWeight: 700, color: '#fff',
                  background: canSave && !isSaving ? C.primary : '#e5b5a3',
                  border: 'none', borderRadius: 12,
                  cursor: canSave && !isSaving ? 'pointer' : 'not-allowed',
                  boxShadow: canSave ? '0 2px 8px rgba(218,119,86,0.3)' : 'none',
                  transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (canSave && !isSaving) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={e => { if (canSave && !isSaving) e.currentTarget.style.background = C.primary; }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving ? 'Saving...' : editingKpi ? 'Save Changes' : 'Create KPI'}
              </button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
};