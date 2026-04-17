import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Check, X, TrendingUp, TriangleAlert,
  Plus, Trash2, GripVertical, Info, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Design tokens — from BusinessPlanAndGoles ──
const C = {
  primary:           '#DA7756',
  primaryHov:        '#c9673f',
  primaryBg:         '#fdf9f7',
  primaryTint:       'rgba(218,119,86,0.06)',
  primaryBord:       '#e8e3de',
  primaryBordStrong: '#d4cdc6',
  pageBg:            '#f6f4ee',
  cardBg:            '#ffffff',
  tealBg:            '#9EC8BA',
  textMain:          '#1a1a1a',
  textMuted:         '#6b7280',
  borderLgt:         '#ebebeb',
  font:              "'Poppins', sans-serif",
};

// ── API Helpers ──
const getBaseUrl = () => {
  const raw = (localStorage.getItem('baseUrl') || '').replace(/\/$/, '');
  if (!raw) return '';
  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
};

const BASE_URL = getBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

const GROUP_NAMES: Record<string, string> = {
  strengths:     'business_plan_strengths',
  weaknesses:    'business_plan_weaknesses',
  opportunities: 'business_plan_opportunities',
  threats:       'business_plan_threats',
};

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    .swot-wrap * { font-family: 'Poppins', sans-serif !important; }

    @keyframes swot-spin { to { transform: rotate(360deg); } }
    @keyframes swot-shimmer {
      0%  { background-position: 200% 0; }
      100%{ background-position: -200% 0; }
    }

    .swot-modal-portal {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.40);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    }
    .swot-modal-box {
      background: #f6f4ee;
      border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.20);
      box-shadow: 0 30px 80px rgba(0,0,0,0.20);
      width: 100%; max-width: 520px;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
    }
    .swot-input {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      outline: none; box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .swot-input:focus {
      border-color: #DA7756;
      box-shadow: 0 0 0 3px rgba(218,119,86,0.15);
    }
    .swot-input::placeholder { color: #a3a3a3; font-weight: 500; }
    .swot-scroll::-webkit-scrollbar { width: 6px; }
    .swot-scroll::-webkit-scrollbar-track { background: transparent; }
    .swot-scroll::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .swot-scroll::-webkit-scrollbar-thumb:hover { background: #DA7756; }

    .swot-card-lift { transition: box-shadow .2s, transform .2s; }
    .swot-card-lift:hover {
      box-shadow: 0 8px 32px rgba(218,119,86,0.12) !important;
      transform: translateY(-1px);
    }
    
    .drag-over { border: 2px dashed ${C.primary} !important; opacity: 0.5; }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div
      className="swot-modal-portal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body,
  );
};

// ── Quadrant config ──
const CONFIG: Record<string, any> = {
  strengths: {
    title:    'Strengths',
    bg:       '#ffffff',
    border:   '#e8e3de',
    accent:   '#DA7756',
    titleClr: '#DA7756',
    itemClr:  '#1a1a1a',
    dotClr:   '#DA7756',
    ItemIcon: Check,
  },
  weaknesses: {
    title:    'Weaknesses',
    bg:       '#ffffff',
    border:   '#e8e3de',
    accent:   '#c9673f',
    titleClr: '#c9673f',
    itemClr:  '#1a1a1a',
    dotClr:   '#c9673f',
    ItemIcon: X,
  },
  opportunities: {
    title:    'Opportunities',
    bg:       '#ffffff',
    border:   '#e8e3de',
    accent:   '#9EC8BA',
    titleClr: '#3d8c78',
    itemClr:  '#1a1a1a',
    dotClr:   '#9EC8BA',
    ItemIcon: TrendingUp,
  },
  threats: {
    title:    'Threats',
    bg:       '#ffffff',
    border:   '#e8e3de',
    accent:   '#d4cdc6',
    titleClr: '#6b7280',
    itemClr:  '#1a1a1a',
    dotClr:   '#d4cdc6',
    ItemIcon: TriangleAlert,
  },
};

// ── Loader spinner ──
const Loader = () => (
  <svg
    style={{ width: 15, height: 15, animation: 'swot-spin 0.8s linear infinite', flexShrink: 0 }}
    fill="none" viewBox="0 0 24 24"
  >
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Skeleton row ──
const SkeletonList = () => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
    {[70, 90, 55].map((w, n) => (
      <li
        key={n}
        style={{
          height: 13, borderRadius: 6,
          background: 'linear-gradient(90deg,rgba(0,0,0,0.06) 25%,rgba(0,0,0,0.03) 50%,rgba(0,0,0,0.06) 75%)',
          backgroundSize: '200% 100%',
          animation: 'swot-shimmer 1.4s infinite',
          width: `${w}%`,
        }}
      />
    ))}
  </ul>
);

// ── Icon button shared ──
const BtnIcon = ({ children, onClick, title = '' }: any) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 30, height: 30, borderRadius: 10,
      background: '#fff', border: `1px solid ${C.primaryBord}`,
      color: '#9ca3af', cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      transition: 'all .15s',
      fontFamily: C.font,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.color = C.primary; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#9ca3af'; }}
  >
    {children}
  </button>
);

// ══════════════════════════════════════════════════════════
export default function SWOTAnalysis() {
  const [data, setData] = useState<Record<string, string[]>>({
    strengths:     [],
    weaknesses:    [],
    opportunities: [],
    threats:       [],
  });
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

  // For Drag and Drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // ── GET ──
  const fetchQuadrant = useCallback(async (key: string) => {
    const groupName = GROUP_NAMES[key];
    setLoadingMap(prev => ({ ...prev, [key]: true }));
    setErrorMap(prev => ({ ...prev, [key]: null }));
    try {
      const url = `${BASE_URL}/extra_fields?include_grouped=true&q[group_name_in][]=${groupName}`;
      const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
      const rawText = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      let json: any;
      try { json = JSON.parse(rawText); } catch { json = {}; }
      const values: string[] =
        json?.grouped_data?.[groupName]?.values ||
        json?.extra_fields?.[groupName]?.values ||
        [];
      setData(prev => ({ ...prev, [key]: values }));
    } catch (err: any) {
      setErrorMap(prev => ({ ...prev, [key]: err.message || 'Failed to load.' }));
    } finally {
      setLoadingMap(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  useEffect(() => {
    Object.keys(GROUP_NAMES).forEach(key => fetchQuadrant(key));
  }, [fetchQuadrant]);

  // ── POST ──
  const postQuadrant = async (key: string, values: string[]) => {
    const payload = {
      extra_field: {
        group_name: GROUP_NAMES[key],
        values: values.filter(v => v.trim() !== ''),
      },
    };
    const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`API error ${res.status}: ${t || res.statusText}`);
    }
    return res.json();
  };

  // ── Modal handlers ──
  const openEditModal = (cat: string) => {
    setEditCategory(cat);
    setTempItems([...data[cat]]);
    setSaveError(null);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setSaveError(null); };

  const handleSave = async () => {
    if (!editCategory) return;
    setIsSaving(true); setSaveError(null);
    try {
      const filtered = tempItems.filter(i => i.trim() !== '');
      await postQuadrant(editCategory, filtered);
      setData(prev => ({ ...prev, [editCategory]: filtered }));
      setIsModalOpen(false);
      fetchQuadrant(editCategory);
      toast.success(`${CONFIG[editCategory].title} saved successfully!`);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
      toast.error(err.message || 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleItemChange = (idx: number, val: string) => { const n = [...tempItems]; n[idx] = val; setTempItems(n); };
  const handleDeleteItem = (idx: number) => setTempItems(tempItems.filter((_, i) => i !== idx));

  // ── Drag and Drop Logic ──
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    // For firefox to work
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    dragOverItem.current = position;
    setDragOverIdx(position);
  };

  const onDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyListItems = [...tempItems];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setDragOverIdx(null);
      setTempItems(copyListItems);
    }
  };

  const conf = editCategory ? CONFIG[editCategory] : null;

  // ── Render ──
  return (
    <div className="swot-wrap" style={{ padding: '24px 0', fontFamily: C.font }}>
      <ThemeStyle />

      {/* ── Section header ── */}
      <div
        style={{
          borderRadius: 8, padding: '18px 20px',
          background: C.tealBg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg style={{ width: 18, height: 18, color: '#1a1a1a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 12, fontWeight: 900, color: '#070707', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: C.font }}>
            SWOT Analysis
          </h1>
        </div>
        <Info size={15} style={{ color: '#1a1a1a', opacity: 0.5, flexShrink: 0 }} />
      </div>

      {/* ── SWOT 2×2 Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {Object.entries(CONFIG).map(([key, cf]) => {
          const isLoading = loadingMap[key];
          const error     = errorMap[key];
          return (
            <div
              key={key}
              className="swot-card-lift"
              style={{
                padding: '18px 20px',
                borderRadius: 16,
                background: cf.bg,
                border: `1px solid ${cf.border}`,
                borderTop: `4px solid ${cf.accent}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{
                    fontSize: 13, fontWeight: 800, color: cf.titleClr,
                    margin: 0, fontFamily: C.font, letterSpacing: '0.01em',
                  }}>
                    {cf.title}
                  </h3>
                  {isLoading && <Loader />}
                </div>
                <BtnIcon onClick={() => openEditModal(key)} title={`Edit ${cf.title}`}>
                  <ExternalLink size={13} />
                </BtnIcon>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  fontSize: 12, fontWeight: 600, color: '#991b1b',
                  background: '#fee2e2', border: '1px solid #fca5a5',
                  borderRadius: 10, padding: '8px 12px', marginBottom: 10,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                  fontFamily: C.font,
                }}>
                  <span>⚠ {error}</span>
                  <button
                    onClick={() => fetchQuadrant(key)}
                    style={{ fontSize: 11, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', textDecoration: 'underline', fontFamily: C.font }}
                  >Retry</button>
                </div>
              )}

              {/* Items / skeleton */}
              {isLoading ? <SkeletonList /> : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {data[key].length === 0 && !error && (
                    <li style={{ fontSize: 12, color: '#a3a3a3', fontStyle: 'italic', fontFamily: C.font }}>
                      No items yet — click edit to add.
                    </li>
                  )}
                  {data[key].map((item, idx) => (
                    <li
                      key={idx}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: cf.itemClr, fontFamily: C.font, fontWeight: 500 }}
                    >
                      <cf.ItemIcon
                        size={13} strokeWidth={2.5}
                        style={{ marginTop: 2, flexShrink: 0, color: cf.dotClr, opacity: 0.9 }}
                      />
                      <span style={{ lineHeight: 1.55 }}>{item}</span>
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
          <div className="swot-modal-box">

            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 28px 16px',
              borderBottom: `1px solid ${C.primaryBord}`,
              background: C.cardBg, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: conf.accent, display: 'inline-block', flexShrink: 0,
                }} />
                <h2 style={{ fontSize: 17, fontWeight: 900, color: C.textMain, margin: 0, fontFamily: C.font }}>
                  Edit {conf.title}
                </h2>
              </div>
              <BtnIcon onClick={closeModal}>
                <X size={14} />
              </BtnIcon>
            </div>

            {/* Body */}
            <div
              className="swot-scroll"
              style={{ padding: '16px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {saveError && (
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#991b1b',
                  background: '#fee2e2', border: '1px solid #fca5a5',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 4,
                  fontFamily: C.font,
                }}>
                  ⚠ {saveError}
                </div>
              )}

              {tempItems.map((item, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragEnter={(e) => onDragEnter(e, idx)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={dragOverIdx === idx ? 'drag-over' : ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    border: `1px solid ${C.borderLgt}`, borderRadius: 14,
                    padding: '8px 12px', background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'border-color .15s, opacity 0.2s',
                    cursor: 'grab' // Indicates draggability
                  }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = C.primary}
                  onBlurCapture={e => e.currentTarget.style.borderColor = C.borderLgt}
                >
                  <GripVertical size={15} style={{ color: '#d4cdc6', flexShrink: 0 }} />
                  <input
                    type="text" value={item}
                    onChange={e => handleItemChange(idx, e.target.value)}
                    placeholder="Add new item..."
                    className="swot-input"
                    style={{ flex: 1, border: 'none', padding: 0, background: 'transparent', boxShadow: 'none', fontSize: 13, fontWeight: 600, cursor: 'text' }}
                  />
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    style={{
                      padding: '3px 5px', borderRadius: 8, border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      color: '#d4d4d4', display: 'flex', alignItems: 'center', flexShrink: 0,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d4d4'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Item */}
              <button
                onClick={() => setTempItems([...tempItems, ''])}
                style={{
                  width: '100%', padding: '10px 0', marginTop: 4,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 800, color: C.primary,
                  background: 'transparent',
                  border: `1.5px dashed ${C.primaryBord}`,
                  borderRadius: 14, cursor: 'pointer',
                  transition: 'background .15s',
                  fontFamily: C.font,
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.primaryTint}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              padding: '16px 28px',
              borderTop: `1px solid ${C.primaryBord}`,
              background: C.cardBg, flexShrink: 0,
              borderRadius: '0 0 20px 20px',
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 700,
                  color: C.textMain, background: '#fff',
                  border: `1px solid ${C.primaryBord}`,
                  borderRadius: 12, cursor: 'pointer', fontFamily: C.font,
                  transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.primaryBg}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: '10px 22px', fontSize: 13, fontWeight: 900,
                  color: '#fff',
                  background: isSaving ? '#e5b5a3' : '#1a1a1a',
                  border: 'none', borderRadius: 12,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  minWidth: 130,
                  boxShadow: isSaving ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'background .15s',
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  fontFamily: C.font,
                }}
                onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = '#000'; }}
                onMouseLeave={e => { if (!isSaving) e.currentTarget.style.background = '#1a1a1a'; }}
              >
                {isSaving && (
                  <svg style={{ width: 15, height: 15, animation: 'swot-spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}