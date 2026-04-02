import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// ── Design Tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
  textMain:    '#171717',
  textMuted:   '#737373',
  borderLgt:   '#ede8e5'
};

// ── Icons ──
const QuestionIcon = () => (
  <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 text-red-400 hover:text-red-600 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const EditIconWhite = () => (
  <svg className="w-4 h-4 text-white/80 hover:text-white cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} />
    <circle cx="12" cy="12" r="2" strokeWidth={2} />
  </svg>
);

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    .st-goal-slider, .st-modal-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 99px;
      outline: none;
      cursor: pointer;
    }
    .st-goal-slider::-webkit-slider-thumb, .st-modal-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${C.primary};
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      transition: transform 0.15s;
    }
    .st-modal-slider::-webkit-slider-thumb {
      width: 18px; height: 18px;
    }
    .st-goal-slider::-webkit-slider-thumb:hover, .st-modal-slider::-webkit-slider-thumb:hover { 
      transform: scale(1.2); 
    }
    .st-goal-slider::-moz-range-thumb, .st-modal-slider::-moz-range-thumb {
      width: 16px; height: 16px; border-radius: 50%;
      background: ${C.primary}; cursor: pointer; border: 2px solid white;
    }
    .st-modal-portal {
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
    .st-modal-box {
      background: ${C.primaryBg};
      border-radius: 20px;
      border: 1px solid ${C.primaryBord};
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      width: 100%;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      position: relative;
      overflow: hidden;
    }
    .st-input {
      width: 100%;
      border: 1px solid ${C.borderLgt};
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13px;
      color: ${C.textMain};
      background: #ffffff;
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      box-sizing: border-box;
    }
    .st-input:focus {
      border-color: ${C.primary};
      box-shadow: 0 0 0 3px rgba(218, 119, 86, 0.15);
    }
    .st-input::placeholder { color: #a3a3a3; }
    .st-select {
      width: 100%;
      border: 1px solid ${C.borderLgt};
      border-radius: 12px;
      padding: 10px 36px 10px 12px;
      font-size: 13px;
      color: ${C.textMain};
      background: #ffffff;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      box-sizing: border-box;
    }
    .st-select:focus {
      border-color: ${C.primary};
      box-shadow: 0 0 0 3px rgba(218, 119, 86, 0.15);
    }
  `}</style>
);

const sliderBg = (pct) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return ReactDOM.createPortal(
    <div className="st-modal-portal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body
  );
};

export const BhagSection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [bhagStatement, setBhagStatement] = useState(
    "Manage 10% of the Global Real Estate Ecosystem"
  );
  const [tempBhagStatement, setTempBhagStatement] = useState("");

  const [initiatives, setInitiatives] = useState([
    { id: 1, title: "Invest in global marketing strategies", progress: 59 },
    { id: 2, title: "Deepen partnerships with industry leaders", progress: 54 },
    { id: 3, title: "Enhance AI-driven solutions across platforms", progress: 67 },
    { id: 4, title: "Develop community engagement programs", progress: 68 },
    { id: 5, title: "Launch educational initiatives for real estate professionals", progress: 0 },
    { id: 6, title: "Expand product offerings for different stakeholders", progress: 0 },
  ]);

  const [tempGoal, setTempGoal] = useState(null);
  const [nextId, setNextId] = useState(7);

  const clampProgress = (val) => {
    const n = Math.round(Number(val));
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  };

  const handleCardSlider = (id, val) => {
    const clamped = clampProgress(val);
    setInitiatives((prev) =>
      prev.map((i) => (i.id === id ? { ...i, progress: clamped } : i))
    );
  };

  const closeModal = () => setActiveModal(null);

  // --- BHAG Modal ---
  const openBhagModal = () => {
    setTempBhagStatement(bhagStatement);
    setActiveModal("bhag_statement");
  };
  const saveBhagStatement = () => {
    setBhagStatement(tempBhagStatement);
    closeModal();
  };

  // --- Goal Modal ---
  const openGoalModal = (goal) => {
    setTempGoal({ ...goal });
    setEditingGoalId(goal.id);
    setActiveModal("goal_details");
  };
  const saveGoalDetails = () => {
    if (editingGoalId) {
      setInitiatives(initiatives.map((i) => (i.id === editingGoalId ? tempGoal : i)));
    } else {
      setInitiatives([...initiatives, { ...tempGoal, id: nextId }]);
      setNextId(n => n + 1);
    }
    closeModal();
  };
  const handleModalProgressChange = (val) => {
    const clamped = clampProgress(val);
    setTempGoal((prev) => ({ ...prev, progress: clamped }));
  };

  // --- Delete / Add ---
  const deleteInitiative = (id) => setInitiatives(initiatives.filter((i) => i.id !== id));
  const addInitiative = () => {
    setTempGoal({ title: "", progress: 0, description: "", targetValue: "100", unit: "%" });
    setEditingGoalId(null);
    setActiveModal("goal_details");
  };

  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
      <ThemeStyle />
      
      <div
        className="rounded-2xl overflow-hidden shadow-md mt-6"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #c26040 100%)` }}
      >
        <div className="p-6">

          {/* ── Header Row ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/20 shrink-0 shadow-sm border border-white/20">
                <TargetIcon />
              </div>
              <span className="text-[16px] font-bold text-white leading-tight drop-shadow-sm">
                Long Term - (BHAG - Big Hairy Audacious Goal)
              </span>
              <QuestionIcon />
            </div>
            <button
              onClick={openBhagModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 shadow-sm border border-white/20"
            >
              <EditIconWhite />
            </button>
          </div>

          {/* ── BHAG Statement ── */}
          <div className="mb-5 pl-[36px]">
            <p className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
              {bhagStatement}
            </p>
          </div>

          {/* ── Key Initiatives Label ── */}
          <div className="pl-[36px] mb-3">
            <span className="text-xs font-bold text-white/80 tracking-wide uppercase">
              Key Initiatives (BHAG)
            </span>
          </div>

          {/* ── Initiatives Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pl-0 md:pl-[36px]">
            {initiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="bg-white rounded-xl p-4 text-gray-800 shadow-sm group hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-1 w-3.5 h-3.5 rounded-full border-[3px] bg-white shrink-0" style={{ borderColor: C.primary }} />
                    <span className="text-[14px] font-bold leading-snug" style={{ color: C.textMain }}>
                      {initiative.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-lg border" style={{ borderColor: C.borderLgt }}>
                    <button onClick={() => openGoalModal(initiative)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors">
                      <EditIcon />
                    </button>
                    <button onClick={() => deleteInitiative(initiative.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0" max="100" step="1"
                    value={initiative.progress}
                    onChange={(e) => handleCardSlider(initiative.id, e.target.value)}
                    className="st-goal-slider"
                    style={{ background: sliderBg(initiative.progress) }}
                  />
                  <span className="text-xs font-bold w-9 text-right shrink-0 tabular-nums" style={{ color: C.textMuted }}>
                    {initiative.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Add New ── */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={addInitiative}
              className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ══ MODAL 1: Edit BHAG Statement ══ */}
        {activeModal === "bhag_statement" && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '520px' }}>
              <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderColor: C.primaryBord, background: '#fff' }}>
                <div className="flex items-center gap-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                  <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>Edit BHAG</h2>
                </div>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto" style={{ background: 'transparent' }}>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                    className="st-input"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>BHAG Statement <span style={{ color: C.primary }}>*</span></label>
                  <textarea
                    value={tempBhagStatement}
                    onChange={(e) => setTempBhagStatement(e.target.value)}
                    className="st-input min-h-[80px] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                  <div className="relative">
                    <input type="text" placeholder="dd-mm-yyyy" className="st-input" />
                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs">📅</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
                <button onClick={closeModal} className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt }}>Cancel</button>
                <button
                  onClick={saveBhagStatement}
                  className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  Save Vision
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ MODAL 2: Edit / Create Goal Details ══ */}
        {activeModal === "goal_details" && tempGoal && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '560px' }}>
              <div className="flex justify-between items-start px-6 py-5 border-b bg-white" style={{ borderColor: C.primaryBord }}>
                <div>
                  <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>
                    {editingGoalId ? 'Edit Goal Details' : 'Create New Initiative'}
                  </h2>
                </div>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors mt-0.5">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1" style={{ background: 'transparent' }}>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Goal Title <span style={{ color: C.primary }}>*</span></label>
                  <input
                    type="text"
                    value={tempGoal.title}
                    placeholder="e.g. Invest in global marketing strategies"
                    onChange={(e) => setTempGoal({ ...tempGoal, title: e.target.value })}
                    className="st-input font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>
                    Description {editingGoalId && '(shown on hover)'}
                  </label>
                  <textarea placeholder="Add detailed description about this goal..." className="st-input min-h-[60px] resize-y" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Value</label>
                    <input type="text" value={tempGoal.targetValue || '100'} onChange={(e) => setTempGoal({ ...tempGoal, targetValue: e.target.value })} className="st-input" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Unit</label>
                    <select value={tempGoal.unit || '%'} onChange={(e) => setTempGoal({ ...tempGoal, unit: e.target.value })} className="st-select">
                      <option>%</option>
                      <option>Days</option>
                    </select>
                  </div>
                </div>

                {editingGoalId && (
                  <div className="bg-white p-5 rounded-xl border shadow-sm mt-2" style={{ borderColor: C.borderLgt }}>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[13px] font-bold" style={{ color: C.textMain }}>Current Value / Progress</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min="0" max="100" step="1"
                          value={tempGoal.progress}
                          onChange={(e) => handleModalProgressChange(e.target.value)}
                          className="w-16 border bg-gray-50 rounded-lg text-center p-1.5 text-[13px] font-bold outline-none"
                          style={{ borderColor: C.borderLgt, color: C.textMain }}
                        />
                        <span className="text-[13px] font-bold" style={{ color: C.textMuted }}>%</span>
                      </div>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1"
                      value={tempGoal.progress}
                      onChange={(e) => handleModalProgressChange(e.target.value)}
                      className="st-modal-slider mb-2"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                    <div className="text-white font-bold text-center py-2.5 rounded-lg text-[14px] mt-4 shadow-sm" style={{ background: C.primary }}>
                      {tempGoal.progress.toFixed(1)}% Completed
                    </div>
                  </div>
                )}

                {editingGoalId && (
                  <div>
                    <h3 className="font-bold text-[14px] mb-3" style={{ color: C.textMain }}>Progress Updates</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-bold mb-1" style={{ color: C.textMain }}>Update Date</label>
                        <input type="text" defaultValue="30-03-2026" className="border-none p-0 text-[13px] outline-none w-full font-bold bg-transparent" style={{ color: C.textMuted }} readOnly />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Update Remarks</label>
                        <textarea placeholder="Add notes about this update..." className="st-input min-h-[60px]" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: C.borderLgt }}>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Owner</label>
                    <select className="st-select text-gray-500"><option>Select owner</option></select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                    <div className="relative">
                      <input type="text" placeholder="dd-mm-yyyy" className="st-input" />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">📅</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex justify-end gap-3 bg-white border-t" style={{ borderColor: C.primaryBord }}>
                <button onClick={closeModal} className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt }}>Cancel</button>
                <button
                  onClick={saveGoalDetails}
                  className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  {editingGoalId ? 'Save Changes' : 'Create Initiative'}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};