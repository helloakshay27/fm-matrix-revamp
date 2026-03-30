import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

// ── Design tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
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

// ── Global modal styles ──
const ModalStyle = () => (
  <style>{`
    .kpi-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
    }
    .kpi-modal-box {
      background: ${C.primaryBg};
      border-radius: 20px;
      border: 1px solid ${C.primaryBord};
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 520px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }
    .kpi-input {
      width: 100%;
      border: 1px solid #ede8e5;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13px;
      color: #171717;
      background: #ffffff;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .kpi-input:focus {
      outline: none;
      border-color: ${C.primary};
      box-shadow: 0 0 0 3px rgba(218, 119, 86, 0.15);
    }
    .kpi-input::placeholder { color: #a3a3a3; }
    .kpi-select {
      width: 100%;
      border: 1px solid #ede8e5;
      border-radius: 12px;
      padding: 10px 36px 10px 12px;
      font-size: 13px;
      color: #171717;
      background: #ffffff;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .kpi-select:focus {
      outline: none;
      border-color: ${C.primary};
      box-shadow: 0 0 0 3px rgba(218, 119, 86, 0.15);
    }
    .kpi-checkbox {
      width: 18px;
      height: 18px;
      accent-color: ${C.primary};
      cursor: pointer;
      flex-shrink: 0;
    }
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="kpi-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Static data ──
const INITIAL_KPIS = [
  { id: 1, name: "Invoices Raised",             frequency: "monthly", owner: "Punit Jain", selected: true  },
  { id: 2, name: "Invoices Raised",             frequency: "monthly", owner: null,         selected: false },
  { id: 3, name: "AI Task Completion Rate",     frequency: "weekly",  owner: null,         selected: true  },
  { id: 4, name: "Customer Satisfaction Score", frequency: "weekly",  owner: null,         selected: true  },
  { id: 5, name: "Lead Conversion Rate",        frequency: "weekly",  owner: null,         selected: true  },
  { id: 6, name: "Monthly Revenue",             frequency: "weekly",  owner: null,         selected: true  },
  { id: 7, name: "New Partnerships Formed",     frequency: "weekly",  owner: null,         selected: true  },
  { id: 8, name: "Project Completion Rate",     frequency: "weekly",  owner: null,         selected: true  },
];

const UNITS       = ["Select unit", "%", "₹", "$", "Count", "Hours", "Days", "Score"];
const DEPARTMENTS = ["Select", "Sales", "Marketing", "Operations", "Finance", "HR", "Tech", "Customer Success"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
const USERS       = ["Select user", "Punit Jain", "Rahul Sharma", "Priya Singh", "Amit Kumar", "Neha Gupta"];

const EMPTY_FORM = {
  name: "", unit: "Select unit", targetValue: "",
  department: "Select", frequency: "Weekly", assignTo: "Select user",
};

export const CriticalNumbers = () => {
  const [showSelectPanel, setShowSelectPanel] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [kpis, setKpis]     = useState(INITIAL_KPIS);
  const [nextId, setNextId] = useState(9);
  const [form, setForm]     = useState(EMPTY_FORM);

  const selectedCount = kpis.filter((k) => k.selected).length;

  const toggleKpi = (id) =>
    setKpis((prev) => prev.map((k) => (k.id === id ? { ...k, selected: !k.selected } : k)));

  const closeCreateModal = () => { setForm(EMPTY_FORM); setShowCreateModal(false); };

  const handleCreateKpi = () => {
    if (!form.name.trim()) return;
    setKpis((prev) => [
      ...prev,
      {
        id: nextId,
        name: form.name,
        frequency: form.frequency.toLowerCase(),
        owner: form.assignTo !== "Select user" ? form.assignTo : null,
        selected: true,
      },
    ]);
    setNextId((n) => n + 1);
    closeCreateModal();
  };

  const canCreate = form.name.trim().length > 0;

  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
      <ModalStyle />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, background: C.primary, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 2px 8px rgba(218,119,86,0.3)', flexShrink: 0 
          }}>
            <TrendIcon />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', margin: 0 }}>
            Critical Numbers (KPIs)
          </h1>
          <QuestionIcon />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: C.primary }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.primaryHov}
            onMouseLeave={(e) => e.currentTarget.style.color = C.primary}
          >
            <PlusIcon /> Create New
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => setShowSelectPanel((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <EditIcon /> Select KPIs
          </button>
        </div>
      </div>

      {/* ── KPI Selection Panel ── */}
      {showSelectPanel && (
        <div style={{ 
          background: C.primaryBg, border: `1px solid ${C.primaryBord}`, 
          borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' 
        }}>
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Select KPIs to display as Critical Numbers (3-5 recommended):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {kpis.map((kpi) => (
              <label
                key={kpi.id}
                className="flex items-start gap-3 p-3.5 bg-white rounded-xl cursor-pointer transition-all hover:shadow-sm"
                style={{ border: `1.5px solid ${kpi.selected ? C.primary : "#ede8e5"}` }}
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
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                      {kpi.frequency}
                    </span>
                    {kpi.owner && (
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {kpi.owner}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.primaryBord }}>
            <span className="text-sm text-gray-500 font-medium">
              Selected: <span className="font-bold text-gray-800">{selectedCount} KPIs</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSelectPanel(false)}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSelectPanel(false)}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 700, color: '#fff', background: C.primary, border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px rgba(218,119,86,0.3)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Create New KPI Modal ══ */}
      {showCreateModal && (
        <Modal onClose={closeCreateModal}>
          <div className="kpi-modal-box">

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 16px', borderBottom: `1px solid ${C.primaryBord}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, display: 'inline-block', flexShrink: 0 }} />
                <h2 style={{ fontSize: 19, fontWeight: 800, color: '#171717', margin: 0 }}>Create New KPI</h2>
              </div>
              <button 
                onClick={closeCreateModal}
                style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* KPI Name */}
              <div>
                <label className="block text-[13px] font-bold text-[#171717] mb-1.5">
                  KPI Name <span style={{ color: C.primary }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Revenue, Calls Made"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="kpi-input"
                  autoFocus
                />
              </div>

              {/* Unit + Target Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="kpi-select">
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Target Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 1000"
                    value={form.targetValue}
                    onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
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
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="kpi-select">
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">
                    Frequency <span style={{ color: C.primary }}>*</span>
                  </label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="kpi-select">
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Assign to User */}
              <div>
                <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Assign to User</label>
                <select value={form.assignTo} onChange={(e) => setForm({ ...form, assignTo: e.target.value })} className="kpi-select">
                  {USERS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px', borderTop: `1px solid ${C.primaryBord}`, background: C.primaryBg, flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <button 
                onClick={closeCreateModal}
                style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, color: '#374151', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKpi}
                disabled={!canCreate}
                style={{ 
                  padding: '10px 22px', fontSize: 13, fontWeight: 700, color: '#fff', 
                  background: canCreate ? C.primary : '#e5b5a3', border: 'none', borderRadius: 12, 
                  cursor: canCreate ? 'pointer' : 'not-allowed', 
                  boxShadow: canCreate ? '0 2px 8px rgba(218,119,86,0.3)' : 'none', 
                  transition: 'background 0.15s' 
                }}
                onMouseEnter={(e) => { if(canCreate) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={(e) => { if(canCreate) e.currentTarget.style.background = C.primary; }}
              >
                Create KPI
              </button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
};