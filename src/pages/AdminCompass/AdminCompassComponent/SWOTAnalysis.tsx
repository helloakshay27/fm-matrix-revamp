import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Check, X, TrendingUp, TriangleAlert,
  Plus, Trash2, GripVertical, Info, ExternalLink,
} from 'lucide-react';

// ── Design tokens ──
const C = {
  primary:    '#DA7756',
  primaryHov: '#c9674a',
  primaryBg:  '#fef6f4',
  primaryTint:'rgba(218,119,86,0.10)',
  primaryBord:'rgba(218,119,86,0.22)',
};

// ── Portal Modal ──
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div
      style={{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Quadrant config — warm palette unified around DA7756 ──
const CONFIG = {
  strengths: {
    title:     'Strengths',
    bg:        C.primaryBg,
    border:    C.primaryBord,
    accent:    C.primary,
    titleClr:  C.primary,
    itemClr:   '#9a3412',
    ItemIcon:  Check,
  },
  weaknesses: {
    title:     'Weaknesses',
    bg:        '#fef6f6',
    border:    '#fbd5d5',
    accent:    '#dc2626',
    titleClr:  '#9b1c1c',
    itemClr:   '#9b1c1c',
    ItemIcon:  X,
  },
  opportunities: {
    title:     'Opportunities',
    bg:        '#fef9f5',
    border:    'rgba(218,119,86,0.18)',
    accent:    C.primaryHov,
    titleClr:  C.primaryHov,
    itemClr:   '#7c3012',
    ItemIcon:  TrendingUp,
  },
  threats: {
    title:     'Threats',
    bg:        '#fffaf5',
    border:    '#fed7aa',
    accent:    '#ea580c',
    titleClr:  '#c2410c',
    itemClr:   '#c2410c',
    ItemIcon:  TriangleAlert,
  },
};

export default function SWOTAnalysis() {
  const [data, setData] = useState({
    strengths:     ['Strong domain knowledge','Innovative solutions','Experienced team','Established partnerships','Unique service offerings'],
    weaknesses:    ['Limited brand visibility','Resource constraints','Disorganized processes','High dependency on key personnel','Lack of standardized procedures'],
    opportunities: ['Growing demand for digital solutions','Expansion into emerging markets','Partnership with tech firms','Rise of remote working spaces','Increased investment in real estate'],
    threats:       ['Economic downturns','Intense competition','Rapid technological changes','Regulatory challenges','Market saturation'],
  });

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [tempItems, setTempItems]       = useState([]);
  const [isSaving, setIsSaving]         = useState(false);

  const openEditModal = (cat) => { setEditCategory(cat); setTempItems([...data[cat]]); setIsModalOpen(true); };
  const closeModal    = () => setIsModalOpen(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setData((prev) => ({ ...prev, [editCategory]: tempItems.filter((i) => i.trim() !== '') }));
      setIsSaving(false);
      setIsModalOpen(false);
    }, 600);
  };

  const handleItemChange  = (idx, val) => { const n = [...tempItems]; n[idx] = val; setTempItems(n); };
  const handleDeleteItem  = (idx) => setTempItems(tempItems.filter((_, i) => i !== idx));

  const conf = editCategory ? CONFIG[editCategory] : null;

  return (
    <div style={{ padding:'24px 0', fontFamily:'sans-serif' }}>

      {/* ── Section header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(218,119,86,0.3)', flexShrink:0 }}>
          <svg style={{ width:18, height:18, color:'#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 style={{ fontSize:18, fontWeight:800, color:'#171717', margin:0 }}>SWOT Analysis</h1>
        <Info size={15} style={{ color:'#a3a3a3', flexShrink:0 }} />
      </div>

      {/* ── SWOT 2×2 Grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {Object.entries(CONFIG).map(([key, cf]) => (
          <div
            key={key}
            style={{
              padding:'18px 20px', borderRadius:16,
              background:cf.bg, border:`1px solid ${cf.border}`,
              borderTop:`4px solid ${cf.accent}`,
              boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
              transition:'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:cf.titleClr, margin:0 }}>{cf.title}</h3>
              <button
                onClick={() => openEditModal(key)}
                title={`Edit ${cf.title}`}
                style={{ padding:'5px 7px', borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:cf.titleClr, display:'flex', alignItems:'center', opacity:0.65, transition:'opacity 0.15s, background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity='1'; e.currentTarget.style.background='rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity='0.65'; e.currentTarget.style.background='transparent'; }}
              >
                <ExternalLink size={15} />
              </button>
            </div>
            <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:9 }}>
              {data[key].map((item, idx) => (
                <li key={idx} style={{ display:'flex', alignItems:'flex-start', gap:9, fontSize:13, color:cf.itemClr }}>
                  <cf.ItemIcon size={13} strokeWidth={2.5} style={{ marginTop:2, flexShrink:0, color:cf.accent, opacity:0.85 }} />
                  <span style={{ lineHeight:1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Edit Modal ── */}
      {isModalOpen && editCategory && conf && (
        <Modal onClose={closeModal}>
          <div style={{
            background: C.primaryBg, borderRadius:20,
            boxShadow:'0 30px 80px rgba(0,0,0,0.25)',
            width:'100%', maxWidth:520,
            display:'flex', flexDirection:'column',
            maxHeight:'90vh', overflow:'hidden',
            border:`1px solid ${C.primaryBord}`,
          }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 28px 16px', borderBottom:`1px solid ${C.primaryBord}`, flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:conf.accent, display:'inline-block', flexShrink:0 }} />
                <h2 style={{ fontSize:19, fontWeight:800, color:'#171717', margin:0 }}>Edit {conf.title}</h2>
              </div>
              <button onClick={closeModal}
                style={{ padding:6, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', color:'#737373', display:'flex', alignItems:'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.background=C.primaryTint; e.currentTarget.style.color=C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#737373'; }}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding:'16px 28px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              {tempItems.map((item, idx) => (
                <div key={idx}
                  style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #ede8e5', borderRadius:12, padding:'8px 12px', background:'#fff', transition:'border-color 0.15s' }}
                  onFocusCapture={(e) => e.currentTarget.style.borderColor = C.primary}
                  onBlurCapture={(e)  => e.currentTarget.style.borderColor = '#ede8e5'}
                >
                  <GripVertical size={15} style={{ color:'#d4d4d4', cursor:'grab', flexShrink:0 }} />
                  <input type="text" value={item} onChange={(e) => handleItemChange(idx, e.target.value)}
                    placeholder="Add new item..."
                    style={{ flex:1, outline:'none', border:'none', fontSize:13, color:'#171717', background:'transparent' }} />
                  <button onClick={() => handleDeleteItem(idx)}
                    style={{ padding:'3px 5px', borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'#d4d4d4', display:'flex', alignItems:'center', flexShrink:0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background='#fff5f5'; e.currentTarget.style.color='#dc2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#d4d4d4'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Item button */}
              <button
                onClick={() => setTempItems([...tempItems, ''])}
                style={{ width:'100%', padding:'10px 0', marginTop:4, display:'flex', justifyContent:'center', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:C.primary, background:'transparent', border:`1.5px dashed ${C.primaryBord}`, borderRadius:12, cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = C.primaryTint}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Footer */}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'16px 28px', borderTop:`1px solid ${C.primaryBord}`, background:C.primaryBg, flexShrink:0, borderRadius:'0 0 20px 20px' }}>
              <button onClick={closeModal}
                style={{ padding:'10px 20px', fontSize:13, fontWeight:600, color:'#374151', background:'#fff', border:'1px solid #e5e5e5', borderRadius:12, cursor:'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background='#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving}
                style={{ padding:'10px 22px', fontSize:13, fontWeight:700, color:'#fff', background: isSaving ? '#e5b5a3' : C.primary, border:'none', borderRadius:12, cursor: isSaving ? 'not-allowed' : 'pointer', minWidth:120, boxShadow: isSaving ? 'none' : '0 2px 8px rgba(218,119,86,0.3)', transition:'background 0.15s' }}
                onMouseEnter={(e) => { if(!isSaving) e.currentTarget.style.background=C.primaryHov; }}
                onMouseLeave={(e) => { if(!isSaving) e.currentTarget.style.background=C.primary; }}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}