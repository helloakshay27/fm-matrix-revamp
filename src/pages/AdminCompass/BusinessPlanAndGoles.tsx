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

// ── Design Tokens (matching DailyMeeting exactly) ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
  primaryBordStrong: 'rgba(218,119,86,0.35)',
  pageBg:      '#ffffff',
  textMain:    '#1a1a1a',
  textMuted:   '#6b7280',
  borderLgt:   '#e5e7eb',
  cardBg:      '#fff',
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

const ChevronIcon = ({ isExpanded }) => (
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

// ── Shared Button Components (matching DailyMeeting) ──
const BtnPrimary = ({ children, onClick, className = '', icon: Icon }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-150 active:scale-[0.97] ${className}`}
    style={{ background: C.primary }}
    onMouseEnter={e => e.currentTarget.style.background = C.primaryHov}
    onMouseLeave={e => e.currentTarget.style.background = C.primary}
  >
    {Icon && <Icon className="w-4 h-4" />}{children}
  </button>
);

const BtnOutline = ({ children, onClick, className = '' }) => (
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

const BtnIcon = ({ children, onClick, title = '' }) => (
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

// ── SectionCard (matching DailyMeeting) ──
const SectionCard = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl border p-5 shadow-sm ${className}`}
    style={{ background: 'rgba(218,119,86,0.05)', borderColor: 'rgba(218,119,86,0.18)' }}
  >
    {children}
  </div>
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
  `}</style>
);

// ── Portal Modal ──
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div className="bp-modal-portal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState('strategic');
  const [showAddContent, setShowAddContent] = useState(false);
  const [addContentTab, setAddContentTab] = useState('images');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [activeTopModal, setActiveTopModal] = useState(null);

  const [purposeText, setPurposeText] = useState(
    'We are building the digital backbone of real estate, enhancing trust, transparency, and efficiency in the customer journey, turning every promise into a proud home while fostering innovation in the industry.'
  );
  const [purposeVideoUrl, setPurposeVideoUrl] = useState('');
  const [tempPurposeText, setTempPurposeText] = useState('');
  const [tempPurposeVideoUrl, setTempPurposeVideoUrl] = useState('');

  const [coreValues, setCoreValues] = useState(['Innovation','Mindfulness','Performance','Accountability','Communication','Trust']);
  const [tempCoreValues, setTempCoreValues] = useState([]);
  const [coreVideoUrl, setCoreVideoUrl] = useState('');
  const [tempCoreVideoUrl, setTempCoreVideoUrl] = useState('');

  const [brandPromises, setBrandPromises] = useState([
    { id: 1, text: 'Trustworthy Transactions - 95% customer satisfaction', kpis: [] },
    { id: 2, text: 'Efficient Processes - 30% reduction in turnaround time', kpis: [] },
    { id: 3, text: 'Innovative Solutions - 3 new product features every quarter', kpis: [] },
  ]);
  const [tempBrandPromises, setTempBrandPromises] = useState([]);
  const [brandVideoUrl, setBrandVideoUrl] = useState('');
  const [tempBrandVideoUrl, setTempBrandVideoUrl] = useState('');

  const openTopModal = (modalName) => {
    if (modalName === 'purpose') {
      setTempPurposeText(purposeText);
      setTempPurposeVideoUrl(purposeVideoUrl);
    } else if (modalName === 'core') {
      setTempCoreValues([...coreValues]);
      setTempCoreVideoUrl(coreVideoUrl);
    } else if (modalName === 'brand') {
      setTempBrandPromises(brandPromises.map(p => ({ ...p })));
      setTempBrandVideoUrl(brandVideoUrl);
    }
    setActiveTopModal(modalName);
  };

  const saveTopPurpose = () => {
    setPurposeText(tempPurposeText);
    setPurposeVideoUrl(tempPurposeVideoUrl);
    setActiveTopModal(null);
  };

  const saveCoreValues = () => {
    setCoreValues(tempCoreValues.filter(v => v.trim() !== ''));
    setCoreVideoUrl(tempCoreVideoUrl);
    setActiveTopModal(null);
  };

  const saveBrandPromises = () => {
    setBrandPromises(tempBrandPromises.filter(v => v.text.trim() !== ''));
    setBrandVideoUrl(tempBrandVideoUrl);
    setActiveTopModal(null);
  };

  const handleCoreValueChange = (index, value) => {
    const updated = [...tempCoreValues];
    updated[index] = value;
    setTempCoreValues(updated);
  };
  const handleDeleteCoreValue = (index) => setTempCoreValues(tempCoreValues.filter((_, i) => i !== index));
  const handleAddCoreValue = () => setTempCoreValues([...tempCoreValues, '']);

  const handleBrandPromiseChange = (index, value) => {
    const updated = [...tempBrandPromises];
    updated[index].text = value;
    setTempBrandPromises(updated);
  };
  const handleDeleteBrandPromise = (index) => setTempBrandPromises(tempBrandPromises.filter((_, i) => i !== index));
  const handleAddBrandPromise = () => setTempBrandPromises([...tempBrandPromises, { id: Date.now(), text: '', kpis: [] }]);

  const tabs = [
    { key: 'strategic', label: 'Strategic Plan' },
    { key: 'goals',     label: 'Goals' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-[1400px] mx-auto" style={{ background: '#fafafa', color: C.textMain }}>
      <ThemeStyle />
      <AdminViewEmulation />

      {/* ── Page Header ── */}
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

      {/* ── Tab Bar (pill style matching DailyMeeting) ── */}
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
                color: isActive ? C.primary : 'rgba(255,255,255,0.8)',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── STRATEGIC PLAN VIEW ── */}
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
                  background: showAddContent ? C.primaryBg : '#fff',
                  borderColor: showAddContent ? C.primaryBordStrong : C.primaryBord,
                  color: C.primary,
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
              {/* Tabs */}
              <div className="flex border-b" style={{ borderColor: C.primaryBord, background: 'rgba(255,255,255,0.6)' }}>
                {['images', 'video'].map(t => (
                  <button
                    key={t}
                    onClick={() => setAddContentTab(t)}
                    className="flex-1 py-3 text-[13px] font-bold transition-colors capitalize"
                    style={{
                      background: addContentTab === t ? C.primary : 'transparent',
                      color: addContentTab === t ? '#fff' : C.textMain,
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
                      <BtnPrimary onClick={() => setShowImageInput(true)}>
                        <GearIcon /> Add Images
                      </BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Images</span>
                        <button onClick={() => setShowImageInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input type="text" placeholder="Paste image URL or Google Drive link..." className="bp-input flex-1" />
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold border transition-all active:scale-[0.97]"
                          style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>+ Add</button>
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold text-white shadow-sm transition-all active:scale-[0.97]"
                          style={{ background: C.primary }}>↑ Upload</button>
                      </div>
                      <div className="text-[11px] mb-5 text-left font-semibold" style={{ color: C.textMuted }}>
                        0/12 images • Max 1 MB per image.{' '}
                        <a href="#" style={{ color: C.primary }} className="hover:underline">Compress images here</a>
                      </div>
                      <div className="text-[11px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
                          style={{ borderColor: C.borderLgt, color: C.textMain }}>✨ Create Image (overview)</button>
                        <button className="flex-1 py-2.5 bg-white border rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
                          style={{ borderColor: C.borderLgt, color: C.textMain }}>✨ Create Image (detailed)</button>
                      </div>
                    </div>
                  )
                )}
                {addContentTab === 'video' && (
                  !showVideoInput ? (
                    <div className="flex flex-col items-center">
                      <VideoPlaceholder />
                      <p className="text-[13px] font-bold mb-5" style={{ color: C.textMuted }}>No explainer videos added yet</p>
                      <BtnPrimary onClick={() => setShowVideoInput(true)}>
                        <GearIcon /> Add Videos
                      </BtnPrimary>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[15px]" style={{ color: C.textMain }}>Add Videos</span>
                        <button onClick={() => setShowVideoInput(false)} className="text-gray-400 hover:text-gray-700 font-bold text-lg transition-colors">✕</button>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input type="text" placeholder="Paste YouTube, Vimeo, or direct video URL..." className="bp-input flex-1" />
                        <button className="px-4 py-2 rounded-xl text-[13px] font-bold border transition-all active:scale-[0.97]"
                          style={{ background: C.primaryTint, color: C.primaryHov, borderColor: C.primaryBord }}>+ Add</button>
                      </div>
                      <div className="text-[11px] font-bold mb-5 text-left" style={{ color: C.textMuted }}>0/12 videos added</div>
                      <div className="text-[11px] mb-2 font-bold text-left" style={{ color: C.textMuted }}>Generate with AI:</div>
                      <button className="w-full py-2.5 bg-white border rounded-xl flex items-center justify-center text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        style={{ borderColor: C.borderLgt, color: C.textMain }}><ScriptIcon /> Create Video Script</button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ── 3 Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Core Values */}
            <div
              className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all"
              style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                  Core Values <InfoIcon />
                </h3>
                <button
                  onClick={() => openTopModal('core')}
                  className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.primary}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <EditIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {coreValues.map((val, idx) => (
                  <span key={idx} className="px-3 py-1.5 text-[11px] font-bold rounded-xl shadow-sm text-white" style={{ background: C.primary }}>
                    {val}
                  </span>
                ))}
                {coreValues.length === 0 && <span className="text-[13px] italic text-gray-400">No core values added.</span>}
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: C.textMuted }}>
                <strong className="font-black" style={{ color: C.primary }}>I</strong> - Innovation: We embrace innovative solutions to redefine real estate.{' '}
                <strong className="font-black" style={{ color: C.primary }}>N</strong> - Nurturing: We foster a supportive...
              </p>
            </div>

            {/* Purpose */}
            <div
              className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all"
              style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                  Purpose <InfoIcon />
                </h3>
                <button
                  onClick={() => openTopModal('purpose')}
                  className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.primary}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <EditIcon />
                </button>
              </div>
              <p className="text-[13px] font-bold leading-relaxed" style={{ color: C.primary }}>
                {purposeText}
              </p>
            </div>

            {/* Brand Promises */}
            <div
              className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-all"
              style={{ borderTop: `4px solid ${C.primary}`, borderColor: C.borderLgt }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[14px] flex items-center gap-1.5" style={{ color: C.textMain }}>
                  Brand Promises <InfoIcon />
                </h3>
                <button
                  onClick={() => openTopModal('brand')}
                  className="p-1.5 rounded-xl transition-colors hover:bg-[#f3f4f6]"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.primary}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <EditIcon />
                </button>
              </div>
              <ul className="space-y-3 text-[12px]" style={{ color: C.textMuted }}>
                {brandPromises.map(p => (
                  <li key={p.id} className="flex items-start">
                    <span className="mr-2 mt-0.5 shrink-0 font-black" style={{ color: C.primary }}>•</span>
                    <div>
                      <div dangerouslySetInnerHTML={{
                        __html: p.text.replace(/([^-]+)/, `<strong style="color:${C.textMain};font-weight:800;">$1</strong>`),
                      }} />
                      <p className="text-[11px] text-gray-400 italic mt-0.5">No KPIs linked</p>
                    </div>
                  </li>
                ))}
                {brandPromises.length === 0 && <li className="text-[13px] italic text-gray-400">No brand promises added.</li>}
              </ul>
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

      {/* Goals View */}
      {activeMainTab === 'goals' && <GoalsView />}

      {/* ── MODALS ── */}
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

              {/* Purpose */}
              {activeTopModal === 'purpose' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Explanation / Text</label>
                    <textarea
                      value={tempPurposeText}
                      onChange={e => setTempPurposeText(e.target.value)}
                      className="bp-input font-bold resize-y"
                      style={{ minHeight: 140 }}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempPurposeVideoUrl}
                      onChange={e => setTempPurposeVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: C.textMuted }}>
                      Supports YouTube, Vimeo, and direct video files (.mp4, etc.)
                    </p>
                  </div>
                </div>
              )}

              {/* Core Values */}
              {activeTopModal === 'core' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>Core Values</label>
                    <div className="space-y-2.5 mb-3">
                      {tempCoreValues.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border rounded-xl p-2.5 bg-white shadow-sm transition-all"
                          style={{ borderColor: C.borderLgt }}
                          onFocus={e => e.currentTarget.style.borderColor = C.primary}
                          onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                        >
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300"><GripIcon /></div>
                          <input
                            type="text"
                            value={item}
                            onChange={e => handleCoreValueChange(idx, e.target.value)}
                            className="flex-1 outline-none text-[13px] font-bold bg-transparent"
                            style={{ color: C.textMain }}
                            placeholder="Add core value"
                            autoFocus={idx === tempCoreValues.length - 1 && item === ''}
                          />
                          <button
                            onClick={() => handleDeleteCoreValue(idx)}
                            className="shrink-0 p-1.5 rounded-xl transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddCoreValue}
                      className="w-full py-3 flex justify-center items-center gap-2 text-[13px] font-bold rounded-xl transition-colors border-2 border-dashed mb-5"
                      style={{ borderColor: C.borderLgt, color: C.textMain }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <PlusIcon /> Add Item
                    </button>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempCoreVideoUrl}
                      onChange={e => setTempCoreVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                  </div>
                </div>
              )}

              {/* Brand Promises */}
              {activeTopModal === 'brand' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: C.textMain }}>Video URL (Optional)</label>
                    <input
                      type="text"
                      value={tempBrandVideoUrl}
                      onChange={e => setTempBrandVideoUrl(e.target.value)}
                      placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                      className="bp-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>Promises</label>
                    <div className="space-y-2.5 mb-3">
                      {tempBrandPromises.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 border rounded-xl p-2.5 bg-white shadow-sm transition-all"
                          style={{ borderColor: C.borderLgt }}
                        >
                          <div className="shrink-0 p-1 rounded cursor-grab text-gray-300"><GripIcon /></div>
                          <input
                            type="text"
                            value={item.text}
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
                  <div>
                    <label className="block text-[12px] font-bold mb-3" style={{ color: C.textMain }}>
                      Link KPIs to Promises (Max 3 per promise)
                    </label>
                    <div className="max-h-[280px] overflow-y-auto bp-scroll space-y-3 pr-1">
                      {tempBrandPromises.filter(p => p.text.trim() !== '').map(item => (
                        <div key={item.id} className="border p-4 rounded-xl bg-white shadow-sm" style={{ borderColor: C.borderLgt }}>
                          <div className="text-[13px] font-bold mb-3 leading-snug" style={{ color: C.textMain }}>{item.text}</div>
                          <select className="bp-select text-gray-500 mb-2">
                            <option>Link a KPI...</option>
                            <option>Customer Satisfaction Score</option>
                            <option>Revenue Growth</option>
                            <option>Project Completion Rate</option>
                          </select>
                          <div className="text-[11px] italic font-medium mt-1" style={{ color: C.textMuted }}>No KPIs linked. Add up to 3.</div>
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
              <BtnOutline onClick={() => setActiveTopModal(null)}>Cancel</BtnOutline>
              <button
                onClick={() => {
                  if (activeTopModal === 'purpose') saveTopPurpose();
                  else if (activeTopModal === 'core') saveCoreValues();
                  else if (activeTopModal === 'brand') saveBrandPromises();
                  else setActiveTopModal(null);
                }}
                className="px-6 py-2 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm active:scale-[0.97]"
                style={{ background: '#1a1a1a' }}
                onMouseEnter={e => e.currentTarget.style.background = '#000'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
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