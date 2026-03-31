import React, { useState, useEffect } from 'react';
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
const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const ChevronIcon = ({ isExpanded }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
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
    
    .st-scroll::-webkit-scrollbar { width: 6px; }
    .st-scroll::-webkit-scrollbar-track { background: transparent; }
    .st-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
    .st-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `}</style>
);

// ── Portal Modal ──
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

// ==========================================
// MAIN PARENT COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState('strategic');
  
  // State for the Add Content Dropdown
  const [showAddContent, setShowAddContent] = useState(false);
  const [addContentTab, setAddContentTab] = useState('images'); 
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  // Modals for Top 3 Cards
  const [activeTopModal, setActiveTopModal] = useState(null);
  
  // Purpose State
  const [purposeText, setPurposeText] = useState(
    "We are building the digital backbone of real estate, enhancing trust, transparency, and efficiency in the customer journey, turning every promise into a proud home while fostering innovation in the industry."
  );
  const [purposeVideoUrl, setPurposeVideoUrl] = useState("");
  
  const [tempPurposeText, setTempPurposeText] = useState('');
  const [tempPurposeVideoUrl, setTempPurposeVideoUrl] = useState('');
  
  // Core Values State
  const [coreValues, setCoreValues] = useState([
    'Innovation', 'Mindfulness', 'Performance', 'Accountability', 'Communication', 'Trust'
  ]);
  const [tempCoreValues, setTempCoreValues] = useState([]);
  const [coreVideoUrl, setCoreVideoUrl] = useState("");
  const [tempCoreVideoUrl, setTempCoreVideoUrl] = useState("");

  // Brand Promises State
  const [brandPromises, setBrandPromises] = useState([
    { id: 1, text: 'Trustworthy Transactions - 95% customer satisfaction', kpis: [] },
    { id: 2, text: 'Efficient Processes - 30% reduction in turnaround time', kpis: [] },
    { id: 3, text: 'Innovative Solutions - 3 new product features every quarter', kpis: [] },
  ]);
  const [tempBrandPromises, setTempBrandPromises] = useState([]);
  const [brandVideoUrl, setBrandVideoUrl] = useState("");
  const [tempBrandVideoUrl, setTempBrandVideoUrl] = useState("");

  // Open Modal Logic
  const openTopModal = (modalName) => {
    if (modalName === 'purpose') {
      setTempPurposeText(purposeText);
      setTempPurposeVideoUrl(purposeVideoUrl);
    } else if (modalName === 'core') {
      setTempCoreValues([...coreValues]);
      setTempCoreVideoUrl(coreVideoUrl);
    } else if (modalName === 'brand') {
      // Deep copy brand promises for temporary editing
      setTempBrandPromises(brandPromises.map(p => ({ ...p })));
      setTempBrandVideoUrl(brandVideoUrl);
    }
    setActiveTopModal(modalName);
  };

  // Save Purpose
  const saveTopPurpose = () => {
    setPurposeText(tempPurposeText);
    setPurposeVideoUrl(tempPurposeVideoUrl);
    setActiveTopModal(null);
  };

  // Save Core Values
  const saveCoreValues = () => {
    setCoreValues(tempCoreValues.filter(val => val.trim() !== ""));
    setCoreVideoUrl(tempCoreVideoUrl);
    setActiveTopModal(null);
  };

  // Save Brand Promises
  const saveBrandPromises = () => {
    setBrandPromises(tempBrandPromises.filter(val => val.text.trim() !== ""));
    setBrandVideoUrl(tempBrandVideoUrl);
    setActiveTopModal(null);
  };

  // Handlers for Core Values List
  const handleCoreValueChange = (index, value) => {
    const updated = [...tempCoreValues];
    updated[index] = value;
    setTempCoreValues(updated);
  };
  const handleDeleteCoreValue = (index) => {
    setTempCoreValues(tempCoreValues.filter((_, i) => i !== index));
  };
  const handleAddCoreValue = () => {
    setTempCoreValues([...tempCoreValues, ""]);
  };

  // Handlers for Brand Promises List
  const handleBrandPromiseChange = (index, value) => {
    const updated = [...tempBrandPromises];
    updated[index].text = value;
    setTempBrandPromises(updated);
  };
  const handleDeleteBrandPromise = (index) => {
    setTempBrandPromises(tempBrandPromises.filter((_, i) => i !== index));
  };
  const handleAddBrandPromise = () => {
    setTempBrandPromises([...tempBrandPromises, { id: Date.now(), text: '', kpis: [] }]);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans text-gray-800 max-w-[1400px] mx-auto">
      <ThemeStyle />
      <AdminViewEmulation/>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-wide mb-1" style={{ color: C.textMuted }}>Strategic overview and goals alignment</div>
          <h1 className="text-2xl font-black text-gray-900">Business plan for HAVEN INFOLINE PRIVATE LIMITED</h1>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button 
            className="px-5 py-2.5 bg-white border rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            style={{ borderColor: C.borderLgt, color: C.textMain }}
          >
            Copy Plan
          </button>
          <button 
            className="px-5 py-2.5 text-white rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            style={{ background: C.primary }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
            onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
          >
            ✨ Create with AI
          </button>
        </div>
      </div>

      {/* ── Main Navigation Tabs ── */}
      <div className="border-b mb-8 flex gap-6" style={{ borderColor: C.borderLgt }}>
        <button
          onClick={() => setActiveMainTab('strategic')}
          className="py-3 px-1 border-b-[3px] font-bold text-[14px] transition-colors"
          style={{
            borderColor: activeMainTab === 'strategic' ? C.primary : 'transparent',
            color: activeMainTab === 'strategic' ? C.primary : C.textMuted
          }}
        >
          Strategic Plan
        </button>
        <button
          onClick={() => setActiveMainTab('goals')}
          className="py-3 px-1 border-b-[3px] font-bold text-[14px] transition-colors"
          style={{
            borderColor: activeMainTab === 'goals' ? C.primary : 'transparent',
            color: activeMainTab === 'goals' ? C.primary : C.textMuted
          }}
        >
          Goals
        </button>
      </div>

      {/* ── STRATEGIC PLAN VIEW ── */}
      {activeMainTab === 'strategic' && (
        <div className="space-y-8">
          <section>
            
            {/* Header row with Add Content Button and Chevron */}
            <div className="flex items-center justify-between mb-5 bg-white p-4 border rounded-2xl shadow-sm transition-all" style={{ borderColor: C.borderLgt }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-bold text-[16px]" style={{ color: C.textMain }}>
                  <EyeIcon /> Our Business Plan
                </div>
                <button
                  onClick={() => setShowAddContent(!showAddContent)}
                  className="px-4 py-2 text-[12px] font-bold rounded-lg border transition-colors shadow-sm"
                  style={{
                    background: showAddContent ? C.primaryBg : '#fff',
                    borderColor: showAddContent ? C.primaryBord : C.borderLgt,
                    color: C.primary
                  }}
                  onMouseEnter={(e) => { if(!showAddContent) e.currentTarget.style.background = C.primaryBg; }}
                  onMouseLeave={(e) => { if(!showAddContent) e.currentTarget.style.background = '#fff'; }}
                >
                  Add Content
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><InfoIcon /></button>
                <button
                  onClick={() => setShowAddContent(!showAddContent)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronIcon isExpanded={showAddContent} />
                </button>
              </div>
            </div>

            {/* --- ADD CONTENT DROPDOWN SECTION --- */}
            {showAddContent && (
              <div className="mb-8 border border-dashed rounded-2xl overflow-hidden transition-all" style={{ borderColor: C.primaryBord, background: C.primaryBg }}>
                <div className="flex border-b bg-white/60" style={{ borderColor: C.primaryBord }}>
                  <button
                    onClick={() => setAddContentTab('images')}
                    className="flex-1 py-3.5 text-[13px] font-bold transition-colors"
                    style={{
                      background: addContentTab === 'images' ? C.primary : 'transparent',
                      color: addContentTab === 'images' ? '#fff' : C.textMain
                    }}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setAddContentTab('video')}
                    className="flex-1 py-3.5 text-[13px] font-bold transition-colors"
                    style={{
                      background: addContentTab === 'video' ? C.primary : 'transparent',
                      color: addContentTab === 'video' ? '#fff' : C.textMain
                    }}
                  >
                    Explainer Video
                  </button>
                </div>

                <div className="p-8 flex flex-col items-center justify-center text-center">
                  
                  {/* IMAGES TAB CONTENT */}
                  {addContentTab === 'images' && (
                    <>
                      {!showImageInput ? (
                        <div className="flex flex-col items-center">
                          <ImagePlaceholder />
                          <p className="text-[13px] font-bold mb-5" style={{ color: C.textMuted }}>No images added yet</p>
                          <button 
                            onClick={() => setShowImageInput(true)}
                            className="flex items-center px-5 py-2.5 text-white rounded-xl text-[13px] font-bold transition-colors shadow-sm"
                            style={{ background: C.primary }}
                            onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                            onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                          >
                            <GearIcon /> Add Images
                          </button>
                        </div>
                      ) : (
                        <div className="w-full max-w-2xl mx-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Images</span>
                            <button onClick={() => setShowImageInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <input 
                              type="text" 
                              placeholder="Paste image URL or Google Drive link..." 
                              className="st-input flex-1" 
                            />
                            <button className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors border" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>
                              + Add
                            </button>
                            <button className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors flex items-center gap-2 shadow-sm" style={{ background: C.primary }}>
                              <span>↑</span> Upload
                            </button>
                          </div>
                          <div className="flex justify-between text-[12px] mb-5 text-left font-bold" style={{ color: C.textMuted }}>
                            <span>0/12 images • Max 1 MB per image. <a href="#" style={{ color: C.primary }} className="hover:underline">Compress images here</a></span>
                          </div>
                          <div className="text-[12px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                          <div className="flex gap-3">
                            <button className="flex-1 py-2.5 bg-white border rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt, color: C.textMain }}>
                              ✨ Create Image (overview)
                            </button>
                            <button className="flex-1 py-2.5 bg-white border rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold hover:bg-gray-50 transition-colors" style={{ borderColor: C.borderLgt, color: C.textMain }}>
                              ✨ Create Image (detailed)
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* VIDEO TAB CONTENT */}
                  {addContentTab === 'video' && (
                    <>
                      {!showVideoInput ? (
                        <div className="flex flex-col items-center">
                          <VideoPlaceholder />
                          <p className="text-[13px] font-bold mb-5" style={{ color: C.textMuted }}>No explainer videos added yet</p>
                          <button 
                            onClick={() => setShowVideoInput(true)}
                            className="flex items-center px-5 py-2.5 text-white rounded-xl text-[13px] font-bold transition-colors shadow-sm"
                            style={{ background: C.primary }}
                            onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                            onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                          >
                            <GearIcon /> Add Videos
                          </button>
                        </div>
                      ) : (
                        <div className="w-full max-w-2xl mx-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Videos</span>
                            <button onClick={() => setShowVideoInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <input 
                              type="text" 
                              placeholder="Paste YouTube, Vimeo, or direct video URL..." 
                              className="st-input flex-1" 
                            />
                            <button className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors border" style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>
                              + Add
                            </button>
                          </div>
                          <div className="text-[12px] font-bold mb-5 text-left" style={{ color: C.textMuted }}>
                            0/12 videos added
                          </div>
                          <div className="text-[12px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                          <button className="w-full py-2.5 bg-white border rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm" style={{ borderColor: C.borderLgt, color: C.textMain }}>
                            <ScriptIcon /> Create Video Script
                          </button>
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            )}

            {/* ── 3 CARDS SECTION ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Core Values */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col h-full hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-5 relative group">
                  <h3 className="font-bold text-[16px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Core Values <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('core')} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"><EditIcon /></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {coreValues.map((val, idx) => (
                    <span key={idx} className="px-3 py-1.5 text-[12px] font-bold rounded-lg shadow-sm text-white" style={{ background: C.primary }}>
                      {val}
                    </span>
                  ))}
                  {coreValues.length === 0 && (
                    <span className="text-[13px] italic text-gray-400 font-medium">No core values added.</span>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: C.textMuted }}>
                  <strong className="font-black" style={{ color: C.primary }}>I</strong> - Innovation: We embrace innovative solutions to redefine real estate.{' '}
                  <strong className="font-black" style={{ color: C.primary }}>N</strong> - Nurturing: We foster a supportive...
                </p>
              </div>

              {/* Purpose */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col h-full hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-5 relative group">
                  <h3 className="font-bold text-[16px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Purpose <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('purpose')} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"><EditIcon /></div>
                </div>
                <p className="text-[14px] font-bold leading-relaxed" style={{ color: C.primary }}>
                  {purposeText}
                </p>
              </div>

              {/* Brand Promises */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col h-full hover:shadow-md transition-all" style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}>
                <div className="flex justify-between items-start mb-5 relative group">
                  <h3 className="font-bold text-[16px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                    Brand Promises <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('brand')} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"><EditIcon /></div>
                </div>
                <ul className="space-y-4 text-[13px]" style={{ color: C.textMuted }}>
                  {brandPromises.map((p) => (
                    <li key={p.id} className="flex items-start">
                      <span className="mr-2 mt-0.5 shrink-0 font-black" style={{ color: C.primary }}>•</span>
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: p.text.replace(
                              /([^-]+)/,
                              `<strong style="color: ${C.textMain}; font-weight: 800;">$1</strong>`
                            ),
                          }}
                        />
                        <p className="text-[11px] text-gray-400 italic mt-0.5">No KPIs linked</p>
                      </div>
                    </li>
                  ))}
                  {brandPromises.length === 0 && (
                     <li className="text-[13px] italic text-gray-400 font-medium">No brand promises added.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Sub-sections ── */}
          <BhagSection />
          <MediumTermSection />
          <ShortTermSection />
          <QuarterlySection />
          <CriticalNumbers />
          <KeyProcessesSection />
          <SWOTAnalysis />
        </div>
      )}

      {/* ── GOALS VIEW PLACEHOLDER ── */}
      {activeMainTab === 'goals' && <GoalsView />}

      {/* ── MODALS FOR TOP 3 CARDS ── */}
      {activeTopModal && (
        <Modal onClose={() => setActiveTopModal(null)}>
          <div className="st-modal-box" style={{ maxWidth: '580px' }}>
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b bg-white" style={{ borderColor: C.primaryBord }}>
              <div className="flex items-center gap-3">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>
                  Edit {activeTopModal === 'core' ? 'Core Values' : activeTopModal === 'purpose' ? 'Purpose' : 'Brand Promises'}
                </h2>
              </div>
              <button onClick={() => setActiveTopModal(null)} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto st-scroll bg-transparent">
              
              {/* EDIT PURPOSE */}
              {activeTopModal === 'purpose' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Explanation / Text</label>
                    <textarea
                      value={tempPurposeText}
                      onChange={(e) => setTempPurposeText(e.target.value)}
                      className="st-input min-h-[140px] font-bold resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-2" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempPurposeVideoUrl}
                      onChange={(e) => setTempPurposeVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="st-input font-medium"
                    />
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: C.textMuted }}>Supports YouTube, Vimeo, and direct video files (.mp4, etc.)</p>
                  </div>
                </div>
              )}

              {/* EDIT CORE VALUES */}
              {activeTopModal === 'core' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold mb-3" style={{ color: C.textMain }}>Core Values</label>
                    
                    <div className="space-y-3 mb-4">
                      {tempCoreValues.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 border rounded-xl p-2.5 bg-white focus-within:border-[#DA7756] transition-all shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="shrink-0 cursor-grab hover:bg-gray-50 p-1 rounded transition-colors text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleCoreValueChange(idx, e.target.value)}
                            className="flex-1 outline-none text-[13px] font-bold text-gray-800 bg-transparent placeholder-gray-400"
                            placeholder="Add core value"
                            autoFocus={idx === tempCoreValues.length - 1 && item === ""}
                          />
                          <button
                            onClick={() => handleDeleteCoreValue(idx)}
                            className="shrink-0 p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAddCoreValue}
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-xl transition-colors border-2 border-dashed mb-6"
                      style={{ borderColor: C.borderLgt, color: C.textMain }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempVideoUrl}
                      onChange={(e) => setTempVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="st-input font-medium"
                    />
                  </div>
                </div>
              )}

              {/* EDIT BRAND PROMISES */}
              {activeTopModal === 'brand' && (
                <div className="space-y-6">
                  {/* Video URL */}
                  <div>
                    <label className="block text-[13px] font-bold mb-2" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempBrandVideoUrl}
                      onChange={(e) => setTempBrandVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="st-input font-medium"
                    />
                  </div>

                  {/* Promises List */}
                  <div>
                    <label className="block text-[13px] font-bold mb-3" style={{ color: C.textMain }}>Promises</label>
                    <div className="space-y-3 mb-4">
                      {tempBrandPromises.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-3 border rounded-xl p-2.5 bg-white focus-within:border-[#DA7756] transition-all shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="shrink-0 cursor-grab hover:bg-gray-50 p-1 rounded transition-colors text-gray-300">
                            <GripIcon />
                          </div>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleBrandPromiseChange(idx, e.target.value)}
                            className="flex-1 outline-none text-[13px] font-bold text-gray-800 bg-transparent placeholder-gray-400"
                            placeholder="Add promise"
                            autoFocus={idx === tempBrandPromises.length - 1 && item.text === ""}
                          />
                          <button
                            onClick={() => handleDeleteBrandPromise(idx)}
                            className="shrink-0 p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddBrandPromise}
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-xl transition-colors border-2 border-dashed mb-6"
                      style={{ borderColor: C.borderLgt, color: C.textMain }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>

                  {/* Link KPIs */}
                  <div>
                    <label className="block text-[13px] font-bold mb-3" style={{ color: C.textMain }}>
                      Link KPIs to Promises (Max 3 per promise)
                    </label>
                    <div className="max-h-[300px] overflow-y-auto st-scroll space-y-4 pr-2">
                      {tempBrandPromises.filter(p => p.text.trim() !== '').map((item) => (
                        <div key={item.id} className="border p-4 rounded-xl bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="text-[13px] font-bold mb-3 text-gray-800 leading-snug">{item.text}</div>
                          <select className="st-select text-gray-500 mb-2">
                            <option>Link a KPI...</option>
                            <option>Customer Satisfaction Score</option>
                            <option>Revenue Growth</option>
                            <option>Project Completion Rate</option>
                          </select>
                          <div className="text-[11px] italic font-medium mt-1.5" style={{ color: C.textMuted }}>
                            No KPIs linked. Add up to 3.
                          </div>
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

            {/* Footer */}
            <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
              <button
                onClick={() => setActiveTopModal(null)}
                className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors"
                style={{ borderColor: C.borderLgt }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTopModal === 'purpose') saveTopPurpose();
                  else if (activeTopModal === 'core') saveCoreValues();
                  else if (activeTopModal === 'brand') saveBrandPromises();
                  else setActiveTopModal(null);
                }}
                className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm"
                style={{ background: '#171717' }} 
                onMouseEnter={(e) => e.currentTarget.style.background = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#171717'}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BusinessPlanAndGoles;