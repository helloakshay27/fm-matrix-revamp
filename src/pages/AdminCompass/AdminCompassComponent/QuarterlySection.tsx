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
const InfoIcon = () => <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EditIcon = () => <svg className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4 text-red-400 hover:text-red-600 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const NoteIcon = () => (
  <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const TargetIconLarge = () => (
  <svg className="w-10 h-10 mx-auto mb-2 opacity-80" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
  </svg>
);
const TrendIcon = () => (
  <svg className="w-4 h-4" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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

const sliderBg = (value) =>
  `linear-gradient(to right, ${C.primary} ${value}%, #e5e7eb ${value}%)`;

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return ReactDOM.createPortal(
    <div className="st-modal-portal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body
  );
};

export const QuarterlySection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  
  const [strategicGoal, setStrategicGoal] = useState({
    title: "Achieve ₹100Cr Revenue",
    type: "Quarterly",
    targetDate: "",
    revenue: "",
    profit: ""
  });
  const [tempStrategic, setTempStrategic] = useState(null);

  const [goals, setGoals] = useState([
    { id: 1, title: "Hire B2B Enterprise Sales Business Head", progress: 52, tag: "quarterly", owner: "Located HR Team", date: "Mar 31, 2026", unit: 'Days' },
    { id: 2, title: "Assess AI implementation across functions", progress: 0, tag: "quarterly", owner: "", date: "", unit: '%' },
    { id: 3, title: "Standardize KPIs across departments", progress: 0, tag: "quarterly", owner: "", date: "", unit: '%' },
    { id: 4, title: "Initiate community outreach programs", progress: 0, tag: "quarterly", owner: "", date: "", unit: '%' },
    { id: 5, title: "Conduct quarterly performance review meetings", progress: 0, tag: "quarterly", owner: "", date: "", unit: '%' },
    { id: 6, title: "Launch new marketing campaign for lead generation", progress: 0, tag: "quarterly", owner: "", date: "", unit: '%' },
  ]);

  const [tempGoal, setTempGoal] = useState(null);
  const [linkedInitiatives, setLinkedInitiatives] = useState([1]); 

  const clamp = (val) => {
    const n = Math.round(Number(val));
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  };

  const closeModal = () => setActiveModal(null);

  const openStrategicModal = () => {
    setTempStrategic(strategicGoal || { title: "", type: "Quarterly", targetDate: "", revenue: "", profit: "" });
    setActiveModal('edit_strategic');
  };

  const saveStrategic = () => {
    if (tempStrategic?.title?.trim()) setStrategicGoal(tempStrategic);
    closeModal();
  };

  const openEditGoalModal = (goal) => {
    setTempGoal({ ...goal });
    setActiveModal('edit_goal');
  };

  const openCreateGoalModal = () => {
    setTempGoal({ title: '', progress: 0, description: '', targetValue: '1000000', owner: '', unit: 'Select unit', period: 'This Quarter' });
    setActiveModal('create_goal');
  };

  const saveGoal = () => {
    if (activeModal === 'create_goal') {
      const newGoal = { ...tempGoal, id: Date.now(), progress: 0, tag: "quarterly" };
      setGoals([...goals, newGoal]);
    } else {
      setGoals(goals.map(g => g.id === tempGoal.id ? tempGoal : g));
    }
    closeModal();
  };

  const confirmDeleteGoal = (id) => {
    setGoalToDelete(id);
    setActiveModal('confirm_delete');
  };

  const executeDeleteGoal = () => {
    setGoals(goals.filter(g => g.id !== goalToDelete));
    setGoalToDelete(null);
    closeModal();
  };

  const updateProgressDirectly = (id, newProgress) => {
    const clamped = clamp(newProgress);
    setGoals(goals.map(g => g.id === id ? { ...g, progress: clamped } : g));
  };

  const toggleInitiativeLink = (id) => {
    if (linkedInitiatives.includes(id)) {
      setLinkedInitiatives(linkedInitiatives.filter(linkId => linkId !== id));
    } else {
      setLinkedInitiatives([...linkedInitiatives, id]);
    }
  };

  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
      <ThemeStyle />
      
      <div className="rounded-2xl overflow-hidden shadow-sm mt-6 border bg-white" style={{ borderColor: C.borderLgt }}>
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: C.borderLgt, background: '#fafafa' }}>
          <NoteIcon />
          <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: C.textMain }}>
            Immediate goals (This Quarter) <InfoIcon />
          </h2>
        </div>

        <div className="p-6">
          
          {/* Set Quarterly Priorities */}
          {!strategicGoal ? (
            <div className="text-center mb-10 border-b pb-8 mt-4" style={{ borderColor: C.borderLgt }}>
              <TargetIconLarge />
              <h3 className="text-xl font-bold mb-1" style={{ color: C.textMain }}>Set Your Quarterly Priorities</h3>
              <p className="text-sm mb-5" style={{ color: C.textMuted }}>What are your top 3-5 priorities this quarter?</p>
              <button 
                onClick={openStrategicModal}
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center justify-center mx-auto gap-2 text-white"
                style={{ background: C.primary }}
                onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
              >
                + Add Quarterly Rock
              </button>
            </div>
          ) : (
            <div 
              className="bg-white rounded-xl p-5 mb-8 flex justify-between items-center group transition-all"
              style={{ border: `1.5px solid ${C.primaryBord}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            >
              <h3 className="font-bold text-[16px]" style={{ color: C.textMain }}>{strategicGoal.title}</h3>
              <div className="flex gap-2">
                <div onClick={openStrategicModal} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors" title="Edit">
                  <EditIcon />
                </div>
                <div onClick={() => setStrategicGoal(null)} className="p-1.5 hover:bg-red-50 rounded-md cursor-pointer transition-colors" title="Delete">
                  <TrashIcon />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-5">
            <TrendIcon />
            <h4 className="text-[14px] font-bold" style={{ color: C.textMain }}>Quarterly Initiatives</h4>
          </div>

          {/* Operational Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {goals.map(goal => (
              <div 
                key={goal.id} 
                className="bg-white rounded-xl p-4 transition-all group hover:shadow-md"
                style={{ border: `1px solid ${C.borderLgt}` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-bold text-[14px] leading-snug pr-4 block" style={{ color: C.textMain }}>{goal.title}</span>
                    {(goal.owner || goal.date) && (
                      <div className="text-xs mt-1 flex items-center gap-1 font-medium" style={{ color: C.textMuted }}>
                         <span style={{ color: C.primary }}>•</span> {goal.owner} &nbsp;📅 {goal.date}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-lg border" style={{ borderColor: C.borderLgt }}>
                    <div onClick={() => openEditGoalModal(goal)} className="p-1 hover:bg-gray-200 rounded cursor-pointer"><EditIcon /></div>
                    <div onClick={() => confirmDeleteGoal(goal.id)} className="p-1 hover:bg-red-50 rounded cursor-pointer"><TrashIcon /></div>
                  </div>
                </div>

                {/* Interactive Slider on the Card */}
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" max="100" step="1"
                    value={goal.progress}
                    onChange={(e) => updateProgressDirectly(goal.id, e.target.value)}
                    className="st-goal-slider"
                    style={{ background: sliderBg(goal.progress) }}
                  />
                  <span className="text-xs font-bold w-9 text-right shrink-0 tabular-nums" style={{ color: C.textMuted }}>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Operational Goal Button */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={openCreateGoalModal}
              className="text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
              style={{ color: C.primary, background: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.primaryTint}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* --- MODALS --- */}

        {/* Delete Confirmation Modal */}
        {activeModal === 'confirm_delete' && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '380px' }}>
              <div className="p-6 text-center font-bold text-[15px]" style={{ color: C.textMain }}>
                Are you sure you want to delete this goal?
              </div>
              <div className="p-4 flex justify-center gap-3 bg-white border-t" style={{ borderColor: C.borderLgt }}>
                <button onClick={executeDeleteGoal} className="px-6 py-2 font-bold text-white rounded-xl shadow-sm text-[13px] transition-colors" style={{ background: '#dc2626' }}>Delete</button>
                <button onClick={closeModal} className="px-6 py-2 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-[13px] transition-colors">Cancel</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit Strategic Goal Modal */}
        {activeModal === 'edit_strategic' && tempStrategic && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '680px' }}>
              
              <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderColor: C.primaryBord, background: '#fff' }}>
                <div className="flex items-center gap-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                  <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>Edit Strategic Goal</h2>
                </div>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-5 flex-1" style={{ background: 'transparent' }}>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Goal Title <span style={{ color: C.primary }}>*</span></label>
                  <input type="text" value={tempStrategic.title} placeholder="e.g., Achieve ₹100Cr Revenue" onChange={e => setTempStrategic({...tempStrategic, title: e.target.value})} className="st-input font-medium" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Goal Type</label>
                    <select className="st-select">
                      <option>Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                    <div className="relative">
                      <input type="text" placeholder="dd-mm-yyyy" className="st-input" />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-xs">📅</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Revenue Target (₹Cr)</label>
                    <input type="text" className="st-input" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Profit Target (₹Cr)</label>
                    <input type="text" className="st-input" />
                  </div>
                </div>

                <div className="rounded-xl bg-white overflow-hidden" style={{ border: `1px solid ${C.borderLgt}` }}>
                  <div className="p-3.5 border-b bg-gray-50/50" style={{ borderColor: C.borderLgt }}>
                    <h3 className="font-bold text-[14px]" style={{ color: C.textMain }}>Key Initiatives (Link Operational Goals)</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: C.textMuted }}>Select operational goals that are key initiatives for this strategic goal</p>
                  </div>
                  <div className="p-2 max-h-48 overflow-y-auto space-y-1">
                    {[
                      { id: 1, title: 'Hire B2B Enterprise Sales Business Head', tag: 'quarterly', owner: "Located HR Team" },
                      { id: 2, title: 'Implement AI across business functions', tag: 'long_term' },
                      { id: 3, title: 'Assess AI implementation across functions', tag: 'quarterly' },
                      { id: 4, title: 'Deepen partnerships with industry leaders', tag: 'bhag' },
                      { id: 5, title: 'Launch service verticals including interiors and brokerage', tag: 'long_term' }
                    ].map(g => (
                      <label key={g.id} className="flex items-start gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={linkedInitiatives.includes(g.id)}
                          onChange={() => toggleInitiativeLink(g.id)}
                          className="mt-0.5 w-4 h-4 cursor-pointer rounded"
                          style={{ accentColor: C.primary }}
                        />
                        <div>
                          <div className="text-[13px] font-bold leading-tight" style={{ color: C.textMain }}>{g.title}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wide bg-gray-100 text-gray-500">{g.tag}</span>
                             {g.owner && <span className="text-[10px] font-medium text-gray-400">{g.owner}</span>}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
                <button onClick={closeModal} className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt }}>Cancel</button>
                <button 
                  onClick={saveStrategic} 
                  className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  Update Vision
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit/Create Operational Goal Modal */}
        {(activeModal === 'edit_goal' || activeModal === 'create_goal') && tempGoal && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '560px' }}>
              
              <div className="flex justify-between items-start px-6 py-5 border-b bg-white" style={{ borderColor: C.primaryBord }}>
                <div>
                  <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>
                    {activeModal === 'create_goal' ? 'Create New Operational Goal' : 'Edit Goal Details'}
                  </h2>
                  {activeModal === 'create_goal' && (
                    <p className="text-[12px] mt-1" style={{ color: C.textMuted }}>Set a measurable target that contributes to your strategic objectives</p>
                  )}
                </div>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors mt-0.5">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-5 flex-1" style={{ background: 'transparent' }}>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Goal Title <span style={{ color: C.primary }}>*</span></label>
                  <input type="text" value={tempGoal.title} placeholder="e.g. Increase Revenue by 20%" onChange={(e) => setTempGoal({...tempGoal, title: e.target.value})} className="st-input font-bold" />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Description {activeModal === 'edit_goal' && '(shown on hover)'}</label>
                  <textarea placeholder="Add detailed description about this goal..." className="st-input min-h-[60px] resize-y"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Value</label>
                    <input type="text" value={tempGoal.targetValue || "1"} onChange={(e) => setTempGoal({...tempGoal, targetValue: e.target.value})} className="st-input" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Unit</label>
                    <select value={tempGoal.unit} onChange={(e) => setTempGoal({...tempGoal, unit: e.target.value})} className="st-select">
                      <option>Select unit</option>
                      <option>Days</option>
                      <option>%</option>
                    </select>
                  </div>
                </div>

                {/* Progress Area for Editing */}
                {activeModal === 'edit_goal' && (
                  <div className="bg-white p-5 rounded-xl border shadow-sm mt-2" style={{ borderColor: C.borderLgt }}>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[13px] font-bold" style={{ color: C.textMain }}>Current Value / Progress</label>
                       <div className="flex items-center gap-2">
                          <input type="number" value={(tempGoal.progress / 100).toFixed(2)} readOnly className="w-16 border bg-gray-50 rounded-lg text-center p-1.5 text-[13px] font-bold outline-none" style={{ borderColor: C.borderLgt, color: C.textMain }} />
                          <span className="text-[13px] font-bold" style={{ color: C.textMuted }}>{tempGoal.unit}</span>
                       </div>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="1"
                      value={tempGoal.progress} onChange={(e) => setTempGoal({...tempGoal, progress: clamp(e.target.value)})}
                      className="st-modal-slider mb-2" 
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                    <div className="text-white font-bold text-center py-2.5 rounded-lg text-[14px] mt-4 shadow-sm" style={{ background: C.primary }}>
                      {tempGoal.progress.toFixed(1)}% Completed
                    </div>
                  </div>
                )}

                {activeModal === 'edit_goal' && (
                  <div>
                    <h3 className="font-bold text-[14px] mb-3" style={{ color: C.textMain }}>Progress Updates</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-bold mb-1" style={{ color: C.textMain }}>Update Date</label>
                        <input type="text" defaultValue="30-03-2026" className="border-none p-0 text-[13px] outline-none w-full font-bold bg-transparent" style={{ color: C.textMuted }} readOnly />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Update Remarks</label>
                        <textarea placeholder="Add notes about this update..." className="st-input min-h-[60px]"></textarea>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: C.borderLgt }}>
                  {activeModal === 'create_goal' ? (
                    <>
                       <div>
                          <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                          <div className="relative">
                            <input type="text" placeholder="dd-mm-yyyy" className="st-input" />
                            <span className="absolute right-3 top-2.5 text-gray-400 text-xs">📅</span>
                          </div>
                       </div>
                       <div>
                          <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Owner</label>
                          <select className="st-select text-gray-500"><option>Select owner</option></select>
                       </div>
                       <div>
                          <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Unit</label>
                          <select className="st-select"><option>Select unit</option></select>
                       </div>
                       <div>
                          <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Period</label>
                          <select className="st-select"><option>This Quarter</option></select>
                       </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Period</label>
                        <select className="st-select"><option>This Quarter</option></select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Status</label>
                        <select className="st-select"><option>On Track</option></select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Owner</label>
                        <select className="st-select text-gray-500"><option>Jyoti</option></select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                        <div className="relative">
                          <input type="text" defaultValue="31-03-2026" className="st-input" />
                          <span className="absolute right-3 top-2.5 text-gray-400 text-xs">📅</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-5 flex justify-end gap-3 bg-white border-t" style={{ borderColor: C.primaryBord }}>
                <button onClick={closeModal} className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt }}>Cancel</button>
                <button 
                  onClick={saveGoal} 
                  className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  {activeModal === 'create_goal' ? 'Create Goal' : 'Save Changes'}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};