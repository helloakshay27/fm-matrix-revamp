import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Check, X, TrendingUp, TriangleAlert,
  Plus, Trash2, GripVertical, Info, ExternalLink,
} from 'lucide-react';

// ── Design tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
};

// ── API Helpers ──
const BASE_URL = 'https://fm-uat-api.lockated.com';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

// group_name for each quadrant
const GROUP_NAMES: Record<string, string> = {
  strengths:     'business_plan_strengths',
  weaknesses:    'business_plan_weaknesses',
  opportunities: 'business_plan_opportunities',
  threats:       'business_plan_threats',
};

// ── Portal Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Quadrant config ──
const CONFIG: Record<string, any> = {
  strengths: {
    title:    'Strengths',
    bg:       C.primaryBg,
    border:   C.primaryBord,
    accent:   C.primary,
    titleClr: C.primary,
    itemClr:  '#9a3412',
    ItemIcon: Check,
  },
  weaknesses: {
    title:    'Weaknesses',
    bg:       '#fef6f6',
    border:   '#fbd5d5',
    accent:   '#dc2626',
    titleClr: '#9b1c1c',
    itemClr:  '#9b1c1c',
    ItemIcon: X,
  },
  opportunities: {
    title:    'Opportunities',
    bg:       '#fef9f5',
    border:   'rgba(218,119,86,0.18)',
    accent:   C.primaryHov,
    titleClr: C.primaryHov,
    itemClr:  '#7c3012',
    ItemIcon: TrendingUp,
  },
  threats: {
    title:    'Threats',
    bg:       '#fffaf5',
    border:   '#fed7aa',
    accent:   '#ea580c',
    titleClr: '#c2410c',
    itemClr:  '#c2410c',
    ItemIcon: TriangleAlert,
  },
};

// ── Loader spinner ──
const Loader = () => (
  <svg style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Skeleton row ──
const SkeletonList = () => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
    {[1, 2, 3].map((n) => (
      <li key={n} style={{ height: 14, borderRadius: 6, background: 'linear-gradient(90deg,rgba(0,0,0,0.06) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.06) 75%)', backgroundSize: '200% 100%', animation: 'st-shimmer 1.4s infinite', width: `${60 + n * 10}%` }} />
    ))}
    <style>{`@keyframes st-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </ul>
);

// ══════════════════════════════════════════════════════════
export default function SWOTAnalysis() {
  const [data, setData] = useState<Record<string, string[]>>({
    strengths:     [],
    weaknesses:    [],
    opportunities: [],
    threats:       [],
  });

  // per-quadrant fetch state
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    strengths: true, weaknesses: true, opportunities: true, threats: true,
  });
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({
    strengths: null, weaknesses: null, opportunities: null, threats: null,
  });

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [tempItems, setTempItems]       = useState<string[]>([]);
  const [isSaving, setIsSaving]         = useState(false);
  const [saveError, setSaveError]       = useState<string | null>(null);

  // ────────────────────────────────────────────────────────
  // GET — fetch one quadrant
  // ────────────────────────────────────────────────────────
  const fetchQuadrant = useCallback(async (key: string) => {
    const groupName = GROUP_NAMES[key];
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    setErrorMap((prev) => ({ ...prev, [key]: null }));
    try {
      const url = `${BASE_URL}/extra_fields?include_grouped=true&q[group_name_in][]=${groupName}`;
      console.log(`[SWOT] GET ${key}`, url);

      const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
      console.log(`[SWOT] ${key} status:`, res.status);

      const rawText = await res.text();
      console.log(`[SWOT] ${key} raw (first 300):`, rawText.slice(0, 300));

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      let json: any;
      try { json = JSON.parse(rawText); } catch { json = {}; }

      // Response shape: { success, data, grouped_data: { [groupName]: { values: [] } } }
      const values: string[] =
        json?.grouped_data?.[groupName]?.values ||
        json?.extra_fields?.[groupName]?.values ||
        [];

      setData((prev) => ({ ...prev, [key]: values }));
    } catch (err: any) {
      console.error(`[SWOT] ${key} error:`, err);
      setErrorMap((prev) => ({ ...prev, [key]: err.message || 'Failed to load.' }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  // fetch all 4 on mount
  useEffect(() => {
    Object.keys(GROUP_NAMES).forEach((key) => fetchQuadrant(key));
  }, [fetchQuadrant]);

  // ────────────────────────────────────────────────────────
  // POST — bulk_upsert for one quadrant
  // ────────────────────────────────────────────────────────
  const postQuadrant = async (key: string, values: string[]) => {
    const payload = {
      extra_field: {
        group_name: GROUP_NAMES[key],
        values: values.filter((v) => v.trim() !== ''),
      },
    };
    console.log(`[SWOT] POST ${key}`, payload);

    const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
      method:  'POST',
      headers: getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`API error ${res.status}: ${t || res.statusText}`);
    }
    return res.json();
  };

  // ────────────────────────────────────────────────────────
  // Modal handlers
  // ────────────────────────────────────────────────────────
  const openEditModal = (cat: string) => {
    setEditCategory(cat);
    setTempItems([...data[cat]]);
    setSaveError(null);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setSaveError(null); };

  const handleSave = async () => {
    if (!editCategory) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const filtered = tempItems.filter((i) => i.trim() !== '');
      await postQuadrant(editCategory, filtered);
      setData((prev) => ({ ...prev, [editCategory]: filtered }));
      setIsModalOpen(false);
      // refresh from server to confirm
      fetchQuadrant(editCategory);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleItemChange = (idx: number, val: string) => {
    const n = [...tempItems]; n[idx] = val; setTempItems(n);
  };
  const handleDeleteItem = (idx: number) => setTempItems(tempItems.filter((_, i) => i !== idx));

  const conf = editCategory ? CONFIG[editCategory] : null;

  // ────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>

      {/* ── Section header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(218,119,86,0.3)', flexShrink: 0 }}>
          <svg style={{ width: 18, height: 18, color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', margin: 0 }}>SWOT Analysis</h1>
        <Info size={15} style={{ color: '#a3a3a3', flexShrink: 0 }} />
      </div>

      {/* ── SWOT 2×2 Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {Object.entries(CONFIG).map(([key, cf]) => {
          const isLoading = loadingMap[key];
          const error     = errorMap[key];
          return (
            <div
              key={key}
              style={{
                padding: '18px 20px', borderRadius: 16,
                background: cf.bg, border: `1px solid ${cf.border}`,
                borderTop: `4px solid ${cf.accent}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)')}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: cf.titleClr, margin: 0 }}>{cf.title}</h3>
                  {isLoading && <Loader />}
                </div>
                <button
                  onClick={() => openEditModal(key)}
                  title={`Edit ${cf.title}`}
                  style={{ padding: '5px 7px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: cf.titleClr, display: 'flex', alignItems: 'center', opacity: 0.65, transition: 'opacity 0.15s, background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <ExternalLink size={15} />
                </button>
              </div>

              {/* Error state */}
              {error && (
                <div style={{ fontSize: 12, color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span>⚠ {error}</span>
                  <button onClick={() => fetchQuadrant(key)} style={{ fontSize: 11, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', textDecoration: 'underline' }}>Retry</button>
                </div>
              )}

              {/* Items / skeleton */}
              {isLoading ? <SkeletonList /> : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {data[key].length === 0 && !error && (
                    <li style={{ fontSize: 12, color: '#a3a3a3', fontStyle: 'italic' }}>No items yet — click edit to add.</li>
                  )}
                  {data[key].map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: cf.itemClr }}>
                      <cf.ItemIcon size={13} strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0, color: cf.accent, opacity: 0.85 }} />
                      <span style={{ lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Edit Modal ── */}
      {isModalOpen && editCategory && conf && (
        <Modal onClose={closeModal}>
          <div style={{
            background: C.primaryBg, borderRadius: 20,
            boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: 520,
            display: 'flex', flexDirection: 'column',
            maxHeight: '90vh', overflow: 'hidden',
            border: `1px solid ${C.primaryBord}`,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 16px', borderBottom: `1px solid ${C.primaryBord}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: conf.accent, display: 'inline-block', flexShrink: 0 }} />
                <h2 style={{ fontSize: 19, fontWeight: 800, color: '#171717', margin: 0 }}>Edit {conf.title}</h2>
              </div>
              <button
                onClick={closeModal}
                style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Save error */}
              {saveError && (
                <div style={{ fontSize: 13, fontWeight: 600, color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 4 }}>
                  ⚠ {saveError}
                </div>
              )}

              {tempItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #ede8e5', borderRadius: 12, padding: '8px 12px', background: '#fff', transition: 'border-color 0.15s' }}
                  onFocusCapture={(e) => (e.currentTarget.style.borderColor = C.primary)}
                  onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#ede8e5')}
                >
                  <GripVertical size={15} style={{ color: '#d4d4d4', cursor: 'grab', flexShrink: 0 }} />
                  <input
                    type="text" value={item}
                    onChange={(e) => handleItemChange(idx, e.target.value)}
                    placeholder="Add new item..."
                    style={{ flex: 1, outline: 'none', border: 'none', fontSize: 13, color: '#171717', background: 'transparent' }}
                  />
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    style={{ padding: '3px 5px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#d4d4d4', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d4d4'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Item */}
              <button
                onClick={() => setTempItems([...tempItems, ''])}
                style={{ width: '100%', padding: '10px 0', marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: C.primary, background: 'transparent', border: `1.5px dashed ${C.primaryBord}`, borderRadius: 12, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryTint)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px', borderTop: `1px solid ${C.primaryBord}`, background: C.primaryBg, flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <button
                onClick={closeModal}
                style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                Cancel
              </button>
              <button
                onClick={handleSave} disabled={isSaving}
                style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700, color: '#fff', background: isSaving ? '#e5b5a3' : C.primary, border: 'none', borderRadius: 12, cursor: isSaving ? 'not-allowed' : 'pointer', minWidth: 120, boxShadow: isSaving ? 'none' : '0 2px 8px rgba(218,119,86,0.3)', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.background = C.primary; }}
              >
                {isSaving && <Loader />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}