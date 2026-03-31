import React, { useState } from 'react';
import { BhagSection } from '../AdminCompass/AdminCompassComponent/BhagSection';

// --- Icons ---
const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ChevronIcon = ({ isExpanded }) => (
  <svg
    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ImagePlaceholder = () => (
  <svg className="w-12 h-12 text-purple-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoPlaceholder = () => (
  <svg className="w-12 h-12 text-purple-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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

// ==========================================
// MAIN PARENT COMPONENT
// ==========================================
const BusinessPlanAndGoles = () => {
  const [activeMainTab, setActiveMainTab] = useState('strategic');
  const [showAddContent, setShowAddContent] = useState(false);
  const [addContentTab, setAddContentTab] = useState('images'); // 'images' | 'video'
  
  // Specific toggles for showing the actual input fields inside the media tabs
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  // Modals for Top 3 Cards
  const [activeTopModal, setActiveTopModal] = useState(null);
  const [purposeText, setPurposeText] = useState(
    "We are building the digital backbone of real estate, enhancing trust, transparency, and efficiency in the customer journey, turning every promise into a proud home while fostering innovation in the industry."
  );
  const [tempPurposeText, setTempPurposeText] = useState('');
  const [coreValues] = useState([
    'Innovation', 'Mindfulness', 'Performance', 'Accountability', 'Communication', 'Trust',
  ]);
  const [brandPromises] = useState([
    { id: 1, text: 'Trustworthy Transactions - 95% customer satisfaction' },
    { id: 2, text: 'Efficient Processes - 30% reduction in turnaround time' },
    { id: 3, text: 'Innovative Solutions - 3 new product features every quarter' },
  ]);

  const openTopModal = (modalName) => {
    if (modalName === 'purpose') setTempPurposeText(purposeText);
    setActiveTopModal(modalName);
  };

  const saveTopPurpose = () => {
    setPurposeText(tempPurposeText);
    setActiveTopModal(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 md:p-8 font-sans text-gray-800 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">Strategic overview and goals alignment</div>
          <h1 className="text-2xl font-bold text-gray-900">Business plan for HAVEN INFOLINE PRIVATE LI</h1>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            Copy Plan
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700">
            ✨ Create with AI
          </button>
        </div>
      </div>

      {/* ── Main Navigation Tabs ── */}
      <div className="border-b border-gray-200 mb-6 flex space-x-6">
        <button
          onClick={() => setActiveMainTab('strategic')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeMainTab === 'strategic'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Strategic Plan
        </button>
        <button
          onClick={() => setActiveMainTab('goals')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeMainTab === 'goals'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Goals
        </button>
      </div>

      {/* ── STRATEGIC PLAN VIEW ── */}
      {activeMainTab === 'strategic' && (
        <div className="space-y-8">
          <section>
            {/* Header row with Add Content Button and Chevron */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-purple-800 font-semibold text-[15px]">
                  <EyeIcon /> Our Business Plan
                </div>
                <button
                  onClick={() => setShowAddContent(!showAddContent)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                    showAddContent
                      ? 'bg-orange-50 border-orange-200 text-orange-600'
                      : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Add Content
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-gray-100 rounded-full"><InfoIcon /></button>
                <button
                  onClick={() => setShowAddContent(!showAddContent)}
                  className="p-1.5 hover:bg-gray-200 rounded-md"
                >
                  <ChevronIcon isExpanded={showAddContent} />
                </button>
              </div>
            </div>

            {/* --- ADD CONTENT DROPDOWN SECTION --- */}
            {showAddContent && (
              <div className="mb-6 border border-dashed border-purple-300 rounded-lg bg-purple-50/20 overflow-hidden">
                <div className="flex border-b border-purple-100 bg-white/60">
                  <button
                    onClick={() => setAddContentTab('images')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                      addContentTab === 'images' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setAddContentTab('video')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                      addContentTab === 'video' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'
                    }`}
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
                          <p className="text-purple-400 text-sm mb-4">No images added yet</p>
                          <button 
                            onClick={() => setShowImageInput(true)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            <GearIcon /> Add Images
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">Add Images</span>
                            <button onClick={() => setShowImageInput(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <input 
                              type="text" 
                              placeholder="Paste image URL or Google Drive link..." 
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white" 
                            />
                            <button className="px-5 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors">
                              + Add
                            </button>
                            <button className="px-5 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                              <span>↑</span> Upload
                            </button>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mb-4 text-left">
                            <span>0/12 images • Max 1 MB per image. <a href="#" className="text-purple-600 hover:underline">Compress images here</a></span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2 font-medium text-left">Generate with AI:</div>
                          <div className="flex gap-3">
                            <button className="flex-1 py-2 bg-white border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                              ✨ Create Image (overview)
                            </button>
                            <button className="flex-1 py-2 bg-white border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
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
                          <p className="text-purple-400 text-sm mb-4">No explainer videos added yet</p>
                          <button 
                            onClick={() => setShowVideoInput(true)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            <GearIcon /> Add Videos
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">Add Videos</span>
                            <button onClick={() => setShowVideoInput(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <input 
                              type="text" 
                              placeholder="Paste YouTube, Vimeo, or direct video URL..." 
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white" 
                            />
                            <button className="px-5 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors">
                              + Add
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mb-4 text-left">
                            0/12 videos added
                          </div>
                          <div className="text-xs text-gray-500 mb-2 font-medium text-left">Generate with AI:</div>
                          <button className="w-full py-2 bg-white border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                            <ScriptIcon /> Create Video Script
                          </button>
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            )}

            {/* ── 3 CARDS SECTION (ALWAYS VISIBLE) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Core Values */}
              <div className="bg-white border-t-[5px] border-t-red-600 rounded-b-lg shadow-sm border-x border-b border-gray-200 p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 relative group">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-1">
                    Core Values <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('core')}><EditIcon /></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coreValues.map((val) => (
                    <span key={val} className="px-2.5 py-1 bg-[#d32f2f] text-white text-xs font-semibold rounded-md shadow-sm">
                      {val}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-red-600 font-bold">I</strong> - Innovation: We embrace innovative solutions to redefine real estate.{' '}
                  <strong className="text-red-600 font-bold">N</strong> - Nurturing: We foster a supportive...
                </p>
              </div>

              {/* Purpose */}
              <div className="bg-white border-t-[5px] border-t-[#2196f3] rounded-b-lg shadow-sm border-x border-b border-gray-200 p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 relative group">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-1">
                    Purpose <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('purpose')}><EditIcon /></div>
                </div>
                <p className="text-[15px] text-[#1565c0] font-semibold leading-relaxed">{purposeText}</p>
              </div>

              {/* Brand Promises */}
              <div className="bg-white border-t-[5px] border-t-[#9c27b0] rounded-b-lg shadow-sm border-x border-b border-gray-200 p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 relative group">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-1">
                    Brand Promises <InfoIcon />
                  </h3>
                  <div onClick={() => openTopModal('brand')}><EditIcon /></div>
                </div>
                <ul className="space-y-4 text-sm text-gray-700">
                  {brandPromises.map((p) => (
                    <li key={p.id} className="flex items-start">
                      <span className="text-[#9c27b0] mr-2 mt-1 shrink-0 font-bold">•</span>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: p.text.replace(
                            /([^-]+)/,
                            '<strong class="text-gray-800 font-semibold">$1</strong>'
                          ),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── BHAG Section ── */}
          <BhagSection/>
        </div>
      )}

      {/* ── GOALS VIEW PLACEHOLDER ── */}
      {activeMainTab === 'goals' && (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
          Goals Kanban Board goes here...
        </div>
      )}

      {/* ── MODALS FOR TOP 3 CARDS ── */}
      {activeTopModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg text-gray-800">
                Edit {activeTopModal === 'core' ? 'Core Values' : activeTopModal === 'purpose' ? 'Purpose' : 'Brand Promises'}
              </h2>
              <button onClick={() => setActiveTopModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5">
              {activeTopModal === 'purpose' ? (
                <textarea
                  value={tempPurposeText}
                  onChange={(e) => setTempPurposeText(e.target.value)}
                  className="w-full border rounded-md p-3 text-sm min-h-[140px] outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-500">Edit fields for {activeTopModal}...</p>
              )}
            </div>
            <div className="border-t p-4 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setActiveTopModal(null)}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border rounded-md shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={activeTopModal === 'purpose' ? saveTopPurpose : () => setActiveTopModal(null)}
                className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanAndGoles;