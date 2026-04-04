import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

// ── Design tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
};

// ── API ──
export const BASE_URL = "https://fm-uat-api.lockated.com";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Icons ──
const DocIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const QuestionIcon = () => (
  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const SelectIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const SearchIcon = () => (
  <svg style={{ width: 16, height: 16, color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const RunningIcon = () => (
  <svg style={{ width: 16, height: 16, color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BrokenIcon = () => (
  <svg style={{ width: 16, height: 16, color: '#f87171' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const LoaderIcon = () => (
  <svg style={{ width: 16, height: 16, animation: 'kp-spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ── Styles ──
const Styles = () => (
  <style>{`
    @keyframes kp-spin { to { transform: rotate(360deg); } }
    @keyframes kp-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .kp-skeleton {
      background: linear-gradient(90deg,rgba(218,119,86,0.08) 25%,rgba(218,119,86,0.04) 50%,rgba(218,119,86,0.08) 75%);
      background-size: 200% 100%; animation: kp-shimmer 1.4s infinite; border-radius: 8px;
    }
    .kp-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; background: rgba(0,0,0,0.45); backdrop-filter: blur(3px);
    }
    .kp-modal {
      background: ${C.primaryBg}; border-radius: 20px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      width: 100%; position: relative;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
      border: 1px solid ${C.primaryBord};
    }
    .kp-modal-body { overflow-y: auto; flex: 1; }
    .kp-input {
      width: 100%; border: 1px solid #e5e5e5; border-radius: 12px;
      padding: 10px 14px; font-size: 14px; color: #171717;
      background: #fff; box-sizing: border-box; transition: border-color 0.15s;
    }
    .kp-input:focus { outline: none; border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .kp-input::placeholder { color: #a3a3a3; }
    .kp-textarea {
      width: 100%; border: 1px solid #e5e5e5; border-radius: 12px;
      padding: 10px 14px; font-size: 14px; color: #171717;
      background: #fff; box-sizing: border-box; resize: vertical; min-height: 90px;
      font-family: inherit;
    }
    .kp-textarea:focus { outline: none; border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .kp-textarea::placeholder { color: #a3a3a3; }
    .kp-select {
      width: 100%; border: 1px solid #e5e5e5; border-radius: 12px;
      padding: 10px 36px 10px 14px; font-size: 14px; color: #171717;
      background: #fff; appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center;
      background-size: 16px; cursor: pointer; box-sizing: border-box;
    }
    .kp-select:focus { outline: none; border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .kp-search {
      width: 100%; border: 1.5px solid #e5e5e5; border-radius: 12px;
      padding: 10px 12px 10px 38px; font-size: 14px; color: #171717;
      background: #fff; box-sizing: border-box; transition: border-color 0.15s;
    }
    .kp-search:focus { outline: none; border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .kp-search::placeholder { color: #a3a3a3; }
    .kp-checkbox {
      width: 18px; height: 18px; border: 1.5px solid #d4d4d4;
      border-radius: 5px; background: #fff; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .kp-checkbox.checked { background: ${C.primary}; border-color: ${C.primary}; }
    .kp-list-item {
      border: 1px solid #ede8e5; border-radius: 12px;
      padding: 12px 14px; cursor: pointer; background: #fff;
      transition: border-color 0.15s, background 0.15s;
    }
    .kp-list-item:hover { background: ${C.primaryBg}; border-color: ${C.primaryBord}; }
    .kp-list-item.selected-item { border-color: ${C.primary}; background: ${C.primaryBg}; }
    .kp-process-card {
      background: #fff; border-radius: 12px;
      border: 1px solid #ede8e5; border-left: 4px solid ${C.primary};
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px;
      box-shadow: 0 1px 3px rgba(218,119,86,0.07);
      transition: box-shadow 0.15s;
    }
    .kp-process-card:hover { box-shadow: 0 4px 12px rgba(218,119,86,0.13); }
    .kp-process-card .card-actions { opacity: 0; transition: opacity 0.15s; }
    .kp-process-card:hover .card-actions { opacity: 1; }
    .kp-btn-ghost {
      padding: 9px 16px; font-size: 13px; font-weight: 600;
      color: #374151; background: #fff; border: 1px solid #e5e5e5;
      border-radius: 12px; cursor: pointer; transition: background 0.15s;
    }
    .kp-btn-ghost:hover { background: #f5f5f5; }
    .kp-btn-primary {
      padding: 9px 20px; font-size: 13px; font-weight: 700;
      color: #fff; background: ${C.primary}; border: none;
      border-radius: 12px; cursor: pointer;
      box-shadow: 0 2px 8px rgba(218,119,86,0.3);
      transition: background 0.15s; display: flex; align-items: center; gap: 6px;
    }
    .kp-btn-primary:hover { background: ${C.primaryHov}; }
    .kp-btn-primary:disabled { background: #e5b5a3; cursor: not-allowed; box-shadow: none; }
    .kp-error-banner {
      background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;
      border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return ReactDOM.createPortal(
    <div className="kp-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body
  );
};

// ── Status badge ──
const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  "to start": { bg: "#fef3c7", color: "#92400e" },
  "running":  { bg: "#dcfce7", color: "#166534" },
  "broken":   { bg: "#fee2e2", color: "#991b1b" },
  "complete": { bg: C.primaryTint, color: "#9a3412" },
};
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG["to start"];
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

// ── Types ──
interface SopItem {
  id: number;
  name: string;          // system_name from API
  status: string;
  description?: string;
  owner?: string | null;
  health?: number;
  priority?: string;
  documentation_url?: string;
  department_id?: number | null;
  assignee_id?: number | null;
}

const EMPTY_FORM = {
  name: '', description: '', department_id: '', status: 'To Start',
  priority: 'Medium', assignee_id: '', health_score: 0, documentation_url: '',
};

const STATUSES   = ["To Start", "Running", "Broken", "Complete"];
const PRIORITIES = ["Low", "Medium", "High"];

const labelSt: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#525252', marginBottom: 6 };
const reqStar = <span style={{ color: '#dc2626' }}>*</span>;

const ModalCloseBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}
    style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
    onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; }}>
    <CloseIcon />
  </button>
);

// ══════════════════════════════════════════════════════════
export const KeyProcessesSection = () => {
  // displayed cards (subset of allSops chosen by user)
  const [displayedSops, setDisplayedSops] = useState<SopItem[]>([]);
  // full list from API (used in Select modal)
  const [allSops, setAllSops]             = useState<SopItem[]>([]);

  const [isFetching, setIsFetching]   = useState(true);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [isSaving, setIsSaving]       = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingSop, setEditingSop]   = useState<SopItem | null>(null);   // for PUT
  const [form, setForm]               = useState<any>(EMPTY_FORM);
  const [selectIds, setSelectIds]     = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ────────────────────────────────────────────────────────
  // GET /system_sops
  // ────────────────────────────────────────────────────────
  const fetchSops = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const url = `${BASE_URL}/system_sops`;
      console.log('[KeyProcesses] GET', url);

      const res = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
      console.log('[KeyProcesses] status:', res.status);

      const rawText = await res.text();
      console.log('[KeyProcesses] raw (first 400):', rawText.slice(0, 400));

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      let json: any;
      try { json = JSON.parse(rawText); } catch { json = []; }

      // support { data: [...] } or plain array
      const records: any[] = Array.isArray(json) ? json : json.data || json.system_sops || [];

      const mapped: SopItem[] = records.map((r: any) => ({
        id:               r.id,
        name:             r.system_name || r.name || '',
        status:           (r.status || 'to start').toLowerCase(),
        description:      r.description || '',
        owner:            r.assignee?.name || r.owner || null,
        health:           r.health_score ?? 0,
        priority:         r.priority || 'medium priority',
        documentation_url: r.documentation_url || '',
        department_id:    r.department_id || null,
        assignee_id:      r.assignee_id || null,
      }));

      setAllSops(mapped);
      // show first 6 by default (or all if ≤6)
      const initial = mapped.slice(0, 6);
      setDisplayedSops(initial);
      setSelectIds(initial.map((s) => s.id));
    } catch (err: any) {
      console.error('[KeyProcesses] fetch error:', err);
      setFetchError(err.message || 'Failed to load SOPs.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { fetchSops(); }, [fetchSops]);

  // ────────────────────────────────────────────────────────
  // POST /system_sops — Create
  // ────────────────────────────────────────────────────────
  const createSop = async () => {
    if (!form.name.trim()) { setSaveError('System name is required.'); return; }
    setIsSaving(true); setSaveError(null);
    try {
      const payload = {
        system_sop: {
          system_name:       form.name.trim(),
          description:       form.description || '',
          department_id:     form.department_id ? Number(form.department_id) : null,
          status:            form.status,
          priority:          form.priority,
          assignee_id:       form.assignee_id ? Number(form.assignee_id) : null,
          health_score:      Number(form.health_score) || 0,
          documentation_url: form.documentation_url || '',
          kpis:              [],
        },
      };
      console.log('[KeyProcesses] POST create', payload);

      const res = await fetch(`${BASE_URL}/system_sops`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
      });
      if (!res.ok) { const t = await res.text(); throw new Error(`API error ${res.status}: ${t || res.statusText}`); }

      closeModal();
      fetchSops();      // refresh list
    } catch (err: any) {
      setSaveError(err.message || 'Failed to create SOP.');
    } finally {
      setIsSaving(false);
    }
  };

  // ────────────────────────────────────────────────────────
  // PUT /system_sops/:id — Update
  // ────────────────────────────────────────────────────────
  const updateSop = async () => {
    if (!editingSop || !form.name.trim()) { setSaveError('System name is required.'); return; }
    setIsSaving(true); setSaveError(null);
    try {
      const payload = {
        system_sop: {
          system_name:       form.name.trim(),
          description:       form.description || '',
          status:            form.status,
          priority:          form.priority,
          health_score:      Number(form.health_score) || 0,
          documentation_url: form.documentation_url || '',
          kpis:              [],
        },
      };
      console.log('[KeyProcesses] PUT update', editingSop.id, payload);

      const res = await fetch(`${BASE_URL}/system_sops/${editingSop.id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload),
      });
      if (!res.ok) { const t = await res.text(); throw new Error(`API error ${res.status}: ${t || res.statusText}`); }

      closeModal();
      fetchSops();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update SOP.');
    } finally {
      setIsSaving(false);
    }
  };

  // ────────────────────────────────────────────────────────
  // DELETE /system_sops/:id
  // ────────────────────────────────────────────────────────
  const deleteSop = async (id: number) => {
    if (!window.confirm('Delete this SOP?')) return;
    try {
      console.log('[KeyProcesses] DELETE', id);
      const res = await fetch(`${BASE_URL}/system_sops/${id}`, {
        method: 'DELETE', headers: getAuthHeaders(),
      });
      if (!res.ok) { const t = await res.text(); throw new Error(`API error ${res.status}: ${t}`); }
      // remove from both lists optimistically
      setDisplayedSops((prev) => prev.filter((s) => s.id !== id));
      setAllSops((prev) => prev.filter((s) => s.id !== id));
      setSelectIds((prev) => prev.filter((x) => x !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // ────────────────────────────────────────────────────────
  // Modal helpers
  // ────────────────────────────────────────────────────────
  const closeModal = () => {
    setActiveModal(null); setForm(EMPTY_FORM);
    setEditingSop(null); setSaveError(null); setSearchQuery('');
  };

  const openCreate = () => {
    setEditingSop(null); setForm(EMPTY_FORM); setSaveError(null);
    setActiveModal('create');
  };

  const openEdit = (sop: SopItem) => {
    setEditingSop(sop);
    setForm({
      name:              sop.name,
      description:       sop.description || '',
      status:            sop.status.charAt(0).toUpperCase() + sop.status.slice(1),
      priority:          sop.priority?.replace(' priority', '') || 'Medium',
      health_score:      sop.health ?? 0,
      documentation_url: sop.documentation_url || '',
      department_id:     sop.department_id || '',
      assignee_id:       sop.assignee_id || '',
    });
    setSaveError(null);
    setActiveModal('edit');
  };

  const openSelect = () => {
    setSelectIds(displayedSops.map((s) => s.id));
    setSearchQuery(''); setSaveError(null);
    setActiveModal('select');
  };

  const toggleSelect = (id: number) =>
    setSelectIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSaveSelection = () => {
    const kept = allSops.filter((s) => selectIds.includes(s.id));
    setDisplayedSops(kept);
    closeModal();
  };

  // ── Derived ──
  const filteredSops  = allSops.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.owner || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount = selectIds.length;
  const isValidCount  = selectedCount >= 3 && selectedCount <= 6;

  // ────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────
  return (
    <>
      <Styles />

      <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 10px rgba(218,119,86,0.10)', marginTop: 24, border: `1px solid ${C.primaryBord}` }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: `linear-gradient(90deg, ${C.primary} 0%, ${C.primaryHov} 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
            <DocIcon />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Key Processes (SOPs)</span>
            <QuestionIcon />
            {isFetching && <LoaderIcon />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={openCreate}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}>
              <PlusIcon /> Create New
            </button>
            <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
            <button onClick={openSelect}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}>
              <SelectIcon /> Select
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20, background: C.primaryBg }}>

          {/* Fetch error */}
          {fetchError && (
            <div className="kp-error-banner" style={{ marginBottom: 16 }}>
              <span>⚠ {fetchError}</span>
              <button onClick={fetchSops} style={{ fontSize: 11, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', textDecoration: 'underline' }}>Retry</button>
            </div>
          )}

          {/* Skeleton */}
          {isFetching ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="kp-skeleton" style={{ height: 56, borderRadius: 12 }} />
              ))}
            </div>
          ) : displayedSops.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#a3a3a3', fontSize: 13 }}>
              No processes selected. Click "Select" to add some.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {displayedSops.map((p) => (
                <div key={p.id} className="kp-process-card">
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#171717', lineHeight: 1.4 }}>{p.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                    <StatusBadge status={p.status} />
                    {/* Edit + Delete — shown on hover via .card-actions */}
                    <div className="card-actions" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => openEdit(p)}
                        style={{ padding: '4px 6px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#d4d4d4', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d4d4'; }}>
                        <EditIcon />
                      </button>
                      <button onClick={() => deleteSop(p.id)}
                        style={{ padding: '4px 6px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#d4d4d4', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d4d4'; }}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL: Create / Edit SOP ══ */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 16px', borderBottom: `1px solid ${C.primaryBord}`, flexShrink: 0 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#171717', margin: 0 }}>
                {activeModal === 'edit' ? 'Edit SOP' : 'Create New SOP'}
              </h2>
              <ModalCloseBtn onClick={closeModal} />
            </div>

            <div className="kp-modal-body" style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {saveError && <div className="kp-error-banner">{saveError}</div>}

              <div>
                <label style={labelSt}>System Name {reqStar}</label>
                <input type="text" placeholder="e.g., Customer Onboarding Process"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="kp-input" autoFocus />
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <textarea placeholder="What does this system do?"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="kp-textarea" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelSt}>Status {reqStar}</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="kp-select">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="kp-select">
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelSt}>Health Score (0-100)</label>
                  <input type="number" min="0" max="100"
                    value={form.health_score} onChange={(e) => setForm({ ...form, health_score: e.target.value })}
                    className="kp-input" />
                </div>
                <div>
                  <label style={labelSt}>Department ID</label>
                  <input type="number" placeholder="e.g. 1"
                    value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                    className="kp-input" />
                </div>
              </div>
              <div>
                <label style={labelSt}>Assignee ID</label>
                <input type="number" placeholder="e.g. 123"
                  value={form.assignee_id} onChange={(e) => setForm({ ...form, assignee_id: e.target.value })}
                  className="kp-input" />
              </div>
              <div>
                <label style={labelSt}>Documentation URL</label>
                <input type="text" placeholder="https://..."
                  value={form.documentation_url} onChange={(e) => setForm({ ...form, documentation_url: e.target.value })}
                  className="kp-input" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px', borderTop: `1px solid ${C.primaryBord}`, background: C.primaryBg, flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <button onClick={closeModal} className="kp-btn-ghost">Cancel</button>
              <button
                onClick={activeModal === 'edit' ? updateSop : createSop}
                disabled={isSaving || !form.name.trim()}
                className="kp-btn-primary"
              >
                {isSaving && <LoaderIcon />}
                {isSaving ? 'Saving...' : activeModal === 'edit' ? 'Save Changes' : 'Create SOP'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL: Select Key Processes ══ */}
      {activeModal === 'select' && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth: 660 }}>
            {/* Header */}
            <div style={{ flexShrink: 0, padding: '20px 28px 16px', background: C.primaryTint, borderBottom: `1px solid ${C.primaryBord}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#171717', margin: '0 0 4px' }}>Select Key Processes (3 to 6 Recommended)</h2>
                  <p style={{ fontSize: 13, color: C.primary, fontWeight: 600, margin: 0 }}>Choose your most critical SOPs to display on your business plan</p>
                </div>
                <span style={{ marginLeft: 16, flexShrink: 0, marginTop: 2 }}><ModalCloseBtn onClick={closeModal} /></span>
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: '16px 28px 10px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><SearchIcon /></span>
                <input type="text" placeholder="Search by name, owner, or status..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="kp-search" />
              </div>
            </div>

            {/* Count bar */}
            <div style={{ padding: '0 28px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: C.primaryTint, border: `1px solid ${C.primaryBord}` }}>
                <span style={{ fontSize: 13, color: '#525252' }}>
                  <span style={{ fontWeight: 700, color: '#171717' }}>{selectedCount} selected</span>
                  {' · '}
                  <span>{filteredSops.length} shown</span>
                </span>
                {isValidCount && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: C.primary }}>
                    <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Valid count
                  </span>
                )}
              </div>
            </div>

            {/* List */}
            <div className="kp-modal-body" style={{ padding: '0 28px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isFetching ? (
                [1, 2, 3].map((n) => <div key={n} className="kp-skeleton" style={{ height: 72, borderRadius: 12 }} />)
              ) : filteredSops.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#a3a3a3', fontSize: 13, padding: '24px 0' }}>No SOPs found.</p>
              ) : (
                filteredSops.map((sop) => {
                  const isSel = selectIds.includes(sop.id);
                  return (
                    <div key={sop.id} className={`kp-list-item${isSel ? ' selected-item' : ''}`} onClick={() => toggleSelect(sop.id)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div className={`kp-checkbox${isSel ? ' checked' : ''}`} style={{ marginTop: 2 }}>
                          {isSel && (
                            <svg style={{ width: 11, height: 11, color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{sop.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              {sop.status === 'running' ? <RunningIcon /> : sop.status === 'broken' ? <BrokenIcon /> : null}
                              <StatusBadge status={sop.status} />
                            </div>
                          </div>
                          {sop.description && <p style={{ fontSize: 12, color: '#737373', margin: '2px 0 0' }}>{sop.description}</p>}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                            {sop.owner && <span style={{ fontSize: 11, color: '#737373' }}><span style={{ color: '#d4d4d4' }}>•</span> Owner: {sop.owner}</span>}
                            <span style={{ fontSize: 11, color: '#737373' }}><span style={{ color: '#d4d4d4' }}>•</span> Health: {sop.health}%</span>
                            {sop.priority && <span style={{ fontSize: 11, color: '#737373' }}><span style={{ color: '#d4d4d4' }}>•</span> {sop.priority}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderTop: `1px solid ${C.primaryBord}`, background: C.primaryBg, flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <span style={{ fontSize: 13, color: '#525252', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700 }}>{selectedCount} of {allSops.length} processes selected</span>
                {isValidCount && <span style={{ color: C.primary, fontWeight: 800 }}>✓</span>}
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setSelectIds([])} className="kp-btn-ghost">Reset</button>
                <button onClick={closeModal} className="kp-btn-ghost">Cancel</button>
                <button onClick={handleSaveSelection} className="kp-btn-primary">Save Selection</button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};