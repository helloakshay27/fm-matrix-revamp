import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

// ── Design tokens ──
const C = {
  primary:    '#DA7756',
  primaryHov: '#c9674a',
  primaryBg:  '#fef6f4',
  primaryTint:'rgba(218,119,86,0.10)',
  primaryBord:'rgba(218,119,86,0.22)',
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

// ── Styles ──
const Styles = () => (
  <style>{`
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
    .kp-process-card .del-btn { opacity: 0; transition: opacity 0.15s; }
    .kp-process-card:hover .del-btn { opacity: 1; }
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
      transition: background 0.15s;
    }
    .kp-btn-primary:hover { background: ${C.primaryHov}; }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }) => {
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
const STATUS_CONFIG = {
  "to start": { bg: "#fef3c7", color: "#92400e" },
  "running":  { bg: "#dcfce7", color: "#166534" },
  "broken":   { bg: "#fee2e2", color: "#991b1b" },
  "complete": { bg: C.primaryTint, color: "#9a3412" },
};
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["to start"];
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

// ── Data ──
const INITIAL_PROCESSES = [
  { id: 1, name: "Product Development Process", status: "to start" },
  { id: 2, name: "Project Management Process",  status: "to start" },
  { id: 3, name: "Sales Closure Process",       status: "to start" },
  { id: 4, name: "Lead Generation Process",     status: "to start" },
];
const ALL_SOPS = [
  { id: 1, name: "sfgfdg",                       desc: "dvvfsd", owner: "Adhip Shetty", health: 70, priority: "medium priority", status: "running"  },
  { id: 2, name: "Accounts Operational Tracker", desc: "Sys",    owner: null,           health: 0,  priority: "medium priority", status: "broken"   },
  { id: 3, name: "Product Development Process",  desc: "",       owner: "Punit Jain",   health: 45, priority: "high priority",   status: "running"  },
  { id: 4, name: "Sales Closure Process",        desc: "",       owner: null,           health: 80, priority: "low priority",    status: "running"  },
  { id: 5, name: "Lead Generation Process",      desc: "",       owner: "Rahul Sharma", health: 30, priority: "medium priority", status: "to start" },
  { id: 6, name: "Project Management Process",   desc: "",       owner: null,           health: 60, priority: "medium priority", status: "running"  },
];
const DEPARTMENTS = ["Select","Sales","Marketing","Operations","Finance","HR","Tech","Customer Success"];
const STATUSES    = ["To Start","Running","Broken","Complete"];
const PRIORITIES  = ["Low","Medium","High"];
const USERS       = ["Select user","Punit Jain","Rahul Sharma","Adhip Shetty","Priya Singh","Amit Kumar"];
const EMPTY_FORM  = { name:"", description:"", department:"Select", status:"To Start", priority:"Medium", assignTo:"Select user", docUrl:"" };

const labelSt = { display:'block', fontSize:13, fontWeight:600, color:'#525252', marginBottom:6 };
const reqStar = <span style={{ color:'#dc2626' }}>*</span>;

export const KeyProcessesSection = () => {
  const [processes, setProcesses]     = useState(INITIAL_PROCESSES);
  const [activeModal, setActiveModal] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [nextId, setNextId]           = useState(10);
  const [selectIds, setSelectIds]     = useState(INITIAL_PROCESSES.map((p) => p.id));
  const [searchQuery, setSearchQuery] = useState("");

  const closeModal = () => { setActiveModal(null); setForm(EMPTY_FORM); setSearchQuery(""); };

  const handleCreateSop = () => {
    if (!form.name.trim()) return;
    const newP = { id: nextId, name: form.name, status: form.status.toLowerCase() };
    setProcesses((prev) => [...prev, newP]);
    setSelectIds((prev) => [...prev, nextId]);
    setNextId((n) => n + 1);
    closeModal();
  };

  const toggleSelect = (id) => setSelectIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSaveSelection = () => {
    const kept = ALL_SOPS.filter((s) => selectIds.includes(s.id)).map((s) => ({ id:s.id, name:s.name, status:s.status }));
    setProcesses(kept);
    closeModal();
  };

  const filteredSops   = ALL_SOPS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.owner||"").toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount  = selectIds.length;
  const isValidCount   = selectedCount >= 3 && selectedCount <= 6;
  const canCreate      = form.name.trim().length > 0;

  const ModalCloseBtn = ({ onClick }) => (
    <button onClick={onClick}
      style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#737373', display:'flex', alignItems:'center' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; }}>
      <CloseIcon />
    </button>
  );

  return (
    <>
      <Styles />

      {/* ── Main Section ── */}
      <div style={{ borderRadius:18, overflow:'hidden', boxShadow:'0 2px 10px rgba(218,119,86,0.10)', marginTop:24, border:`1px solid ${C.primaryBord}` }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:`linear-gradient(90deg, ${C.primary} 0%, ${C.primaryHov} 100%)` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#fff' }}>
            <DocIcon />
            <span style={{ fontWeight:700, fontSize:15 }}>Key Processes (SOPs)</span>
            <QuestionIcon />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {[
              { label:'Create New', icon:<PlusIcon />, modal:'create' },
              { label:'Select',     icon:<SelectIcon />, modal:'select' },
            ].map((btn, i) => (
              <span key={btn.modal} style={{ display:'flex', alignItems:'center', gap: i === 0 ? 16 : 0 }}>
                {i === 1 && <span style={{ width:1, height:16, background:'rgba(255,255,255,0.3)', marginRight:16 }} />}
                <button onClick={() => setActiveModal(btn.modal)}
                  style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.9)', background:'none', border:'none', fontSize:13, fontWeight:600, cursor:'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}>
                  {btn.icon} {btn.label}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Process Cards */}
        <div style={{ padding:20, background:C.primaryBg }}>
          {processes.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'#a3a3a3', fontSize:13 }}>
              No processes selected. Click "Select" to add some.
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {processes.map((p) => (
                <div key={p.id} className="kp-process-card">
                  <span style={{ fontSize:13, fontWeight:700, color:'#171717', lineHeight:1.4 }}>{p.name}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, marginLeft:8 }}>
                    <StatusBadge status={p.status} />
                    <button className="del-btn"
                      onClick={() => setProcesses((prev) => prev.filter((x) => x.id !== p.id))}
                      style={{ padding:'4px 6px', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#d4d4d4', display:'flex', alignItems:'center' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background='#fff5f5'; e.currentTarget.style.color='#dc2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#d4d4d4'; }}>
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL 1: Create New SOP ══ */}
      {activeModal === "create" && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth:480 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px 16px', borderBottom:`1px solid ${C.primaryBord}`, flexShrink:0 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:'#171717', margin:0 }}>Create New SOP</h2>
              <ModalCloseBtn onClick={closeModal} />
            </div>

            <div className="kp-modal-body" style={{ padding:'20px 28px', display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={labelSt}>System Name {reqStar}</label>
                <input type="text" placeholder="e.g., Customer Onboarding Process"
                  value={form.name} onChange={(e) => setForm({ ...form, name:e.target.value })}
                  className="kp-input" autoFocus />
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <textarea placeholder="What does this system do?"
                  value={form.description} onChange={(e) => setForm({ ...form, description:e.target.value })}
                  className="kp-textarea" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={labelSt}>Department {reqStar}</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department:e.target.value })} className="kp-select">
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Status {reqStar}</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status:e.target.value })} className="kp-select">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelSt}>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority:e.target.value })} className="kp-select">
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Assign to User</label>
                <select value={form.assignTo} onChange={(e) => setForm({ ...form, assignTo:e.target.value })} className="kp-select">
                  {USERS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Documentation URL</label>
                <input type="text" placeholder="https://..."
                  value={form.docUrl} onChange={(e) => setForm({ ...form, docUrl:e.target.value })}
                  className="kp-input" />
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'16px 28px', borderTop:`1px solid ${C.primaryBord}`, background:C.primaryBg, flexShrink:0, borderRadius:'0 0 20px 20px' }}>
              <button onClick={closeModal} className="kp-btn-ghost">Cancel</button>
              <button onClick={handleCreateSop} disabled={!canCreate}
                style={{ padding:'9px 20px', fontSize:13, fontWeight:700, color:'#fff', background: canCreate ? C.primary : '#e5b5a3', border:'none', borderRadius:12, cursor: canCreate ? 'pointer' : 'not-allowed', boxShadow: canCreate ? '0 2px 8px rgba(218,119,86,0.3)' : 'none' }}
                onMouseEnter={(e) => { if(canCreate) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={(e) => { if(canCreate) e.currentTarget.style.background = C.primary; }}>
                Create SOP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL 2: Select Key Processes ══ */}
      {activeModal === "select" && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth:660 }}>
            {/* Warm tinted header */}
            <div style={{ flexShrink:0, padding:'20px 28px 16px', background:C.primaryTint, borderBottom:`1px solid ${C.primaryBord}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#171717', margin:'0 0 4px' }}>Select Key Processes (3 to 6 Recommended)</h2>
                  <p style={{ fontSize:13, color:C.primary, fontWeight:600, margin:0 }}>Choose your most critical SOPs to display on your business plan</p>
                </div>
                <span style={{ marginLeft:16, flexShrink:0, marginTop:2 }}><ModalCloseBtn onClick={closeModal} /></span>
              </div>
            </div>

            {/* Search */}
            <div style={{ padding:'16px 28px 10px', flexShrink:0 }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}><SearchIcon /></span>
                <input type="text" placeholder="Search by name, owner, or status..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="kp-search" />
              </div>
            </div>

            {/* Count bar */}
            <div style={{ padding:'0 28px 12px', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:C.primaryTint, border:`1px solid ${C.primaryBord}` }}>
                <span style={{ fontSize:13, color:'#525252' }}>
                  <span style={{ fontWeight:700, color:'#171717' }}>{selectedCount} selected</span>{' · '}<span>{filteredSops.length} shown</span>
                </span>
                {isValidCount && (
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700, color:C.primary }}>
                    <svg style={{ width:13, height:13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Valid count
                  </span>
                )}
              </div>
            </div>

            {/* SOP list */}
            <div className="kp-modal-body" style={{ padding:'0 28px 12px', display:'flex', flexDirection:'column', gap:8 }}>
              {filteredSops.map((sop) => {
                const isSel = selectIds.includes(sop.id);
                return (
                  <div key={sop.id} className={`kp-list-item${isSel ? ' selected-item' : ''}`} onClick={() => toggleSelect(sop.id)}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <div className={`kp-checkbox${isSel ? ' checked' : ''}`} style={{ marginTop:2 }}>
                        {isSel && (
                          <svg style={{ width:11, height:11, color:'#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:'#171717' }}>{sop.name}</span>
                          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                            {sop.status === "running" ? <RunningIcon /> : sop.status === "broken" ? <BrokenIcon /> : null}
                            <StatusBadge status={sop.status} />
                          </div>
                        </div>
                        {sop.desc && <p style={{ fontSize:12, color:'#737373', margin:'2px 0 0' }}>{sop.desc}</p>}
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:6, flexWrap:'wrap' }}>
                          {sop.owner && <span style={{ fontSize:11, color:'#737373' }}><span style={{ color:'#d4d4d4' }}>•</span> Owner: {sop.owner}</span>}
                          <span style={{ fontSize:11, color:'#737373' }}><span style={{ color:'#d4d4d4' }}>•</span> Health: {sop.health}%</span>
                          <span style={{ fontSize:11, color:'#737373' }}><span style={{ color:'#d4d4d4' }}>•</span> {sop.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderTop:`1px solid ${C.primaryBord}`, background:C.primaryBg, flexShrink:0, borderRadius:'0 0 20px 20px' }}>
              <span style={{ fontSize:13, color:'#525252', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontWeight:700 }}>{selectedCount} of {ALL_SOPS.length} processes selected</span>
                {isValidCount && <span style={{ color:C.primary, fontWeight:800 }}>✓</span>}
              </span>
              <div style={{ display:'flex', gap:10 }}>
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