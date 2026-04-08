import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

// ── Design Tokens — BusinessCompassDashboard theme ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9673f',
  primaryBg:   '#f6f4ee',
  primaryTint: 'rgba(218,119,86,0.06)',
  primaryBord: '#e8e3de',
  tealBg:      '#9EC8BA',
  cardBg:      '#ffffff',
  textMain:    '#1a1a1a',
  textMuted:   '#6b7280',
  borderLgt:   '#ebebeb',
  font:        "'Poppins', sans-serif",
};

const EditIcon  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const InfoIcon  = () => <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const NoteIcon  = () => <svg className="w-4 h-4" style={{color:C.primary}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>;
const CalendarIcon  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const ChevronLeft   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>;
const ChevronRight  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>;
const LoaderIcon = ({className='w-4 h-4'}:{className?:string}) => <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>;
const TargetLargeIcon = () => (
  <svg className="w-14 h-14 mx-auto mb-3" style={{color:C.primary}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    .quarterly-wrap, .quarterly-wrap * { font-family: 'Poppins', sans-serif !important; }
    .st-goal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-goal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-goal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .st-modal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-modal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-modal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .quarterly-modal-portal { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.42); backdrop-filter:blur(4px); }
    .q-modal-box { background:${C.primaryBg}; border-radius:20px; border:1px solid ${C.primaryBord}; box-shadow:0 30px 80px rgba(0,0,0,0.20); width:100%; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
    .q-input { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .q-input:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .q-input::placeholder { color:#a3a3a3; }
    .q-select { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 36px 10px 12px; font-size:13px; color:${C.textMain}; background:#fff; appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; background-size:16px; cursor:pointer; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .q-select:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .q-error-banner { background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; border-radius:12px; padding:10px 14px; font-size:13px; font-weight:600; }
    .st-skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.2) 25%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.2) 75%); background-size:200% 100%; animation:st-shimmer 1.4s infinite; border-radius:8px; }
    @keyframes st-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .st-dp-wrap { position:relative; }
    .st-dp-input-btn { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .st-dp-input-btn:focus, .st-dp-input-btn.open { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-dp-input-btn .placeholder { color:#a3a3a3; }
    .st-dp-calendar { position:absolute; top:calc(100% + 6px); left:0; z-index:99999; background:#fff; border:1px solid ${C.borderLgt}; border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.12); padding:16px; width:280px; animation:dp-in .15s ease; font-family:'Poppins',sans-serif; }
    @keyframes dp-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .st-dp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .st-dp-nav { background:none; border:none; padding:6px; border-radius:8px; cursor:pointer; color:${C.textMuted}; display:flex; align-items:center; }
    .st-dp-nav:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-month-year { font-size:14px; font-weight:700; color:${C.textMain}; cursor:pointer; padding:4px 8px; border-radius:8px; }
    .st-dp-month-year:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .st-dp-dow { text-align:center; font-size:11px; font-weight:700; color:${C.textMuted}; padding:4px 0 8px; }
    .st-dp-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; border-radius:8px; cursor:pointer; color:${C.textMain}; border:none; background:none; transition:background .1s,color .1s; }
    .st-dp-day:hover:not(.empty):not(.selected) { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-day.today:not(.selected) { color:${C.primary}; font-weight:800; }
    .st-dp-day.selected { background:${C.primary}; color:#fff; font-weight:700; }
    .st-dp-day.empty { cursor:default; }
    .st-dp-months,.st-dp-years { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; padding:4px 0; }
    .st-dp-mitem,.st-dp-yitem { text-align:center; padding:8px 4px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; color:${C.textMain}; transition:background .1s; }
    .st-dp-mitem:hover,.st-dp-yitem:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-mitem.active,.st-dp-yitem.active { background:${C.primary}; color:#fff; }
    .st-dp-clear { margin-top:10px; padding-top:10px; border-top:1px solid ${C.borderLgt}; text-align:center; }
    .st-dp-clear button { font-size:12px; font-weight:600; color:${C.textMuted}; background:none; border:none; cursor:pointer; padding:4px 12px; border-radius:8px; }
    .st-dp-clear button:hover { background:#f3f4f6; color:${C.textMain}; }
  `}</style>
);

const sliderBg = (pct: number) => `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

const getBaseUrl = () => {
  const raw = (localStorage.getItem('baseUrl') || '').replace(/\/$/, '');
  if (!raw) return '';
  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
};

export const BASE_URL = getBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token') || '';
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) };
};

const formatDateForApi = (s: string): string => {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const p = s.split('-');
  if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
  return s;
};
const apiDateToDisplay = (s: string): string => {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const [y,m,d] = s.split('-'); return `${d}-${m}-${y}`; }
  return s;
};
const parseDDMMYYYY = (s: string): Date | null => {
  if (!s) return null;
  const [d,m,y] = s.split('-').map(Number);
  if (!d||!m||!y) return null;
  const dt = new Date(y,m-1,d);
  return isNaN(dt.getTime()) ? null : dt;
};
const toDDMMYYYY = (dt: Date): string =>
  `${String(dt.getDate()).padStart(2,'0')}-${String(dt.getMonth()+1).padStart(2,'0')}-${dt.getFullYear()}`;
const clampProgress = (val: any) => { const n=Math.round(Number(val)); return isNaN(n)?0:Math.min(100,Math.max(0,n)); };

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT=['Su','Mo','Tu','We','Th','Fr','Sa'];

const DatePicker: React.FC<{value:string;onChange:(v:string)=>void;placeholder?:string}> = ({value,onChange,placeholder='Select date'}) => {
  const today=new Date(); const parsed=parseDDMMYYYY(value);
  const [open,setOpen]=useState(false); const [view,setView]=useState<'days'|'months'|'years'>('days');
  const [cursor,setCursor]=useState<Date>(parsed||new Date(today.getFullYear(),today.getMonth(),1));
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[]);
  const openPicker=()=>{setCursor(parsed?new Date(parsed.getFullYear(),parsed.getMonth(),1):new Date(today.getFullYear(),today.getMonth(),1));setView('days');setOpen(true);};
  const selectDay=(day:number)=>{onChange(toDDMMYYYY(new Date(cursor.getFullYear(),cursor.getMonth(),day)));setOpen(false);};
  const daysInMonth=new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
  const firstDow=new Date(cursor.getFullYear(),cursor.getMonth(),1).getDay();
  const years=Array.from({length:21},(_,i)=>cursor.getFullYear()-10+i);
  const displayValue=parsed?toDDMMYYYY(parsed):'';
  return (
    <div className="st-dp-wrap" ref={ref}>
      <button type="button" className={`st-dp-input-btn${open?' open':''}`} onClick={()=>open?setOpen(false):openPicker()}>
        <span className={displayValue?'':'placeholder'} style={{fontSize:13}}>{displayValue||placeholder}</span>
        <span style={{color:C.primary,display:'flex',alignItems:'center'}}><CalendarIcon/></span>
      </button>
      {open&&(<div className="st-dp-calendar">
        {view==='days'&&(<><div className="st-dp-header"><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1))}><ChevronLeft/></button><span className="st-dp-month-year" onClick={()=>setView('months')}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1))}><ChevronRight/></button></div><div className="st-dp-grid">{DAYS_SHORT.map(d=><div key={d} className="st-dp-dow">{d}</div>)}{Array.from({length:firstDow}).map((_,i)=><div key={`e${i}`} className="st-dp-day empty"/>)}{Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{const isToday=day===today.getDate()&&cursor.getMonth()===today.getMonth()&&cursor.getFullYear()===today.getFullYear();const isSelected=parsed&&day===parsed.getDate()&&cursor.getMonth()===parsed.getMonth()&&cursor.getFullYear()===parsed.getFullYear();return <button key={day} type="button" className={`st-dp-day${isToday?' today':''}${isSelected?' selected':''}`} onClick={()=>selectDay(day)}>{day}</button>;})}</div>{value&&<div className="st-dp-clear"><button onClick={()=>{onChange('');setOpen(false);}}>Clear</button></div>}</>)}
        {view==='months'&&(<><div className="st-dp-header"><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear()-1,cursor.getMonth(),1))}><ChevronLeft/></button><span className="st-dp-month-year" onClick={()=>setView('years')}>{cursor.getFullYear()}</span><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear()+1,cursor.getMonth(),1))}><ChevronRight/></button></div><div className="st-dp-months">{MONTHS.map((m,i)=><div key={m} className={`st-dp-mitem${cursor.getMonth()===i?' active':''}`} onClick={()=>{setCursor(new Date(cursor.getFullYear(),i,1));setView('days');}}>{m.slice(0,3)}</div>)}</div></>)}
        {view==='years'&&(<><div className="st-dp-header"><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear()-12,cursor.getMonth(),1))}><ChevronLeft/></button><span className="st-dp-month-year">{years[0]} – {years[years.length-1]}</span><button className="st-dp-nav" onClick={()=>setCursor(new Date(cursor.getFullYear()+12,cursor.getMonth(),1))}><ChevronRight/></button></div><div className="st-dp-years">{years.map(y=><div key={y} className={`st-dp-yitem${cursor.getFullYear()===y?' active':''}`} onClick={()=>{setCursor(new Date(y,cursor.getMonth(),1));setView('months');}}>{y}</div>)}</div></>)}
      </div>)}
    </div>
  );
};

interface Initiative { id?:number; title:string; progress:number; description?:string; targetValue?:string; currentValue?:string; unit?:string; period?:string; targetDate?:string; ownerName?:string; ownerId?:string|number; status?:string; updateRemarks?:string; }

interface StrategicGoalData {
  title: string;
  goalType: string;
  targetDate: string;
  revenueTarget: string;
  profitTarget: string;
}

const Modal=({children,onClose}:{children:React.ReactNode;onClose:()=>void})=>{
  useEffect(()=>{document.body.style.overflow='hidden';return()=>{document.body.style.overflow='';}},[]);
  return ReactDOM.createPortal(<div className="quarterly-modal-portal" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>{children}</div>,document.body);
};

// ══════════════════════════════════════════════════════════
export const QuarterlySection = () => {
  const [activeModal,setActiveModal]   = useState<string|null>(null);
  const [editingGoalId,setEditingGoalId] = useState<number|null>(null);
  
  const [strategicGoal, setStrategicGoal] = useState<StrategicGoalData>({title:'', goalType:'Short-term (Quarterly)', targetDate:'', revenueTarget:'', profitTarget:''});
  const [tempStrategic, setTempStrategic] = useState<StrategicGoalData | null>(null);
  const [linkedStrategicInitiatives, setLinkedStrategicInitiatives] = useState<number[]>([]);

  const [initiatives,setInitiatives]   = useState<Initiative[]>([]);
  const [tempGoal,setTempGoal]         = useState<Initiative|null>(null);
  const [tempGoalDate,setTempGoalDate] = useState('');
  const [isFetching,setIsFetching]     = useState(true);
  const [fetchError,setFetchError]     = useState<string|null>(null);
  const [isSaving,setIsSaving]         = useState(false);
  const [saveError,setSaveError]       = useState<string|null>(null);

  const fetchStrategicGoal = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/extra_fields?group_name=quarterly_strategic`,{method:'GET',headers:getAuthHeaders()});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = Array.isArray(json)?json[0]:json;
      
      if (data && data.values && data.values[0]) {
        try {
          const parsed = JSON.parse(data.values[0]);
          setStrategicGoal({
            title: parsed.title || '',
            goalType: parsed.goalType || 'Short-term (Quarterly)',
            targetDate: data.target_date || parsed.targetDate || '',
            revenueTarget: parsed.revenueTarget || '',
            profitTarget: parsed.profitTarget || ''
          });
          if(parsed.linkedInitiatives) setLinkedStrategicInitiatives(parsed.linkedInitiatives);
        } catch(e) {
          setStrategicGoal({title: data.values[0]||'', goalType:'Short-term (Quarterly)', targetDate:data.target_date||'', revenueTarget:'', profitTarget:''});
        }
      } else {
        setStrategicGoal({title:'', goalType:'Short-term (Quarterly)', targetDate:'', revenueTarget:'', profitTarget:''});
      }
    } catch (err) { console.error('[QuarterlySection] fetchStrategicGoal:', err); }
  },[]);

  const fetchQuarterlyGoals = useCallback(async () => {
    setIsFetching(true); setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/goals`,{method:'GET',headers:getAuthHeaders()});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const records = Array.isArray(json)?json:(json.goals||json.data||[]);
      const quarterly = records.filter((g:any)=>g.period==='this_quarter'||(g.period&&g.period.toLowerCase().includes('quarter')));
      setInitiatives(quarterly.map((g:any,idx:number)=>({
        id:g.id??idx+1, title:g.title||g.name||'Untitled',
        progress:clampProgress(g.progress_percentage??g.progress??0),
        description:g.description||'', targetValue:String(g.target_value??'1'), currentValue:String(g.current_value??'0'),
        unit:g.unit||'days', period:g.period||'this_quarter', targetDate:g.target_date||'',
        ownerName:g.owner_name||'', ownerId:g.owner_id||'', status:g.status||'On Track', updateRemarks:g.update_remarks||'',
      })));
    } catch (err:any) { setFetchError(err.message||'Failed to load quarterly goals'); }
    finally { setIsFetching(false); }
  },[]);

  useEffect(()=>{ fetchStrategicGoal(); fetchQuarterlyGoals(); },[fetchStrategicGoal,fetchQuarterlyGoals]);

  const handleCardSlider = async (id:number, val:string) => {
    const clamped=clampProgress(val);
    setInitiatives(prev=>prev.map(i=>i.id===id?{...i,progress:clamped}:i));
    try {
      const res=await fetch(`${BASE_URL}/goals/${id}`,{method:'PATCH',headers:getAuthHeaders(),body:JSON.stringify({goal:{progress_percentage:clamped,current_value:clamped}})});
      if (!res.ok) fetchQuarterlyGoals();
    } catch { fetchQuarterlyGoals(); }
  };

  const closeModal=()=>{setActiveModal(null);setSaveError(null);setTempGoal(null);setTempGoalDate('');setEditingGoalId(null);setTempStrategic(null);};
  
  const openStrategicModal=()=>{
    setTempStrategic({
      title: strategicGoal.title, 
      goalType: strategicGoal.goalType,
      targetDate: apiDateToDisplay(strategicGoal.targetDate),
      revenueTarget: strategicGoal.revenueTarget,
      profitTarget: strategicGoal.profitTarget
    });
    setActiveModal('edit_strategic');
  };
  
  const openCreateGoalModal=()=>{setTempGoal({title:'',progress:0,description:'',targetValue:'1',currentValue:'0',unit:'days',period:'this_quarter',status:'On Track',ownerId:'',updateRemarks:''});setTempGoalDate('');setEditingGoalId(null);setActiveModal('create_goal');};
  const openEditGoalModal=(goal:Initiative)=>{setTempGoal({...goal});setTempGoalDate(apiDateToDisplay(goal.targetDate||''));setEditingGoalId(goal.id??null);setActiveModal('edit_goal');};

  const saveStrategicGoal=async()=>{
    if (!tempStrategic) return;
    if (!tempStrategic.title.trim()){setSaveError('Goal Title cannot be empty.');return;}
    setIsSaving(true);setSaveError(null);
    try {
      const jsonStr = JSON.stringify({
        title: tempStrategic.title.trim(),
        goalType: tempStrategic.goalType,
        targetDate: tempStrategic.targetDate.trim() ? formatDateForApi(tempStrategic.targetDate.trim()) : '',
        revenueTarget: tempStrategic.revenueTarget,
        profitTarget: tempStrategic.profitTarget,
        linkedInitiatives: linkedStrategicInitiatives
      });

      const payload:any={extra_field:{group_name:'quarterly_strategic',values:[jsonStr]}};
      if (tempStrategic.targetDate.trim()) payload.extra_field.target_date=formatDateForApi(tempStrategic.targetDate.trim());
      
      const res=await fetch(`${BASE_URL}/extra_fields/bulk_upsert`,{method:'POST',headers:getAuthHeaders(),body:JSON.stringify(payload)});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      
      setStrategicGoal({
        title: tempStrategic.title.trim(),
        goalType: tempStrategic.goalType,
        targetDate: formatDateForApi(tempStrategic.targetDate.trim()),
        revenueTarget: tempStrategic.revenueTarget,
        profitTarget: tempStrategic.profitTarget
      });
      closeModal();
    } catch (err:any){setSaveError(err.message||'Failed to save');}
    finally{setIsSaving(false);}
  };

  const saveGoalDetails=async()=>{
    if (!tempGoal) return;
    if (!tempGoal.title.trim()){setSaveError('Goal title cannot be empty.');return;}
    setIsSaving(true);setSaveError(null);
    const payload={goal:{title:tempGoal.title.trim(),description:tempGoal.description||'',target_value:Number(tempGoal.targetValue)||1,current_value:Number(tempGoal.currentValue)||0,progress_percentage:clampProgress(tempGoal.progress),unit:tempGoal.unit||'days',period:'this_quarter',status:tempGoal.status||'On Track',owner_id:tempGoal.ownerId?Number(tempGoal.ownerId):undefined,target_date:tempGoalDate?formatDateForApi(tempGoalDate):'',update_remarks:tempGoal.updateRemarks||''}};
    try {
      const res=editingGoalId
        ?await fetch(`${BASE_URL}/goals/${editingGoalId}`,{method:'PUT',headers:getAuthHeaders(),body:JSON.stringify(payload)})
        :await fetch(`${BASE_URL}/goals`,{method:'POST',headers:getAuthHeaders(),body:JSON.stringify(payload)});
      if (!res.ok) throw new Error(`API error ${res.status}`);
      closeModal();fetchQuarterlyGoals();
    } catch (err:any){setSaveError(err.message||'Error saving goal.');}
    finally{setIsSaving(false);}
  };

  const deleteGoal=async(id:number)=>{
    if (!window.confirm('Delete this initiative?')) return;
    try {
      const res=await fetch(`${BASE_URL}/goals/${id}`,{method:'DELETE',headers:getAuthHeaders()});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchQuarterlyGoals();
    } catch (err:any){alert('Failed to delete: '+err.message);}
  };

  const handleModalProgressChange=(val:string)=>{
    const c=clampProgress(val);
    setTempGoal((prev:any)=>({...prev,progress:c,currentValue:String(c)}));
  };

  const toggleStrategicLink = (id: number) => {
    setLinkedStrategicInitiatives(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const modalBtnBase = {border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:C.font};

  return (
    <div className="quarterly-wrap" style={{padding:'24px 0',fontFamily:C.font}}>
      <ThemeStyle/>

      <div className="rounded-2xl overflow-hidden shadow-sm mt-6" style={{background:"white"}}>
        <div className="p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/30 shrink-0 shadow-sm">
                <NoteIcon/>
              </div>
              <span className="text-[12px] font-black tracking-[0.15em] text-[#070707] uppercase">Immediate Goals — This Quarter</span>
              <InfoIcon/>
            </div>
          </div>

          {/* ── Strategic Priorities Block (Filled vs Empty State) ── */}
          <div className="mb-8">
            {isFetching ? (
               <div className="st-skeleton h-24 w-full rounded-xl"/>
            ) : strategicGoal.title ? (
              <div className="bg-white rounded-xl p-5 flex justify-between items-center group transition-all" style={{ border: `1px solid ${C.borderLgt}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div>
                  <h3 className="font-bold text-[16px] m-0" style={{ color: C.textMain }}>{strategicGoal.title}</h3>
                  {(strategicGoal.revenueTarget || strategicGoal.profitTarget) && (
                    <div className="text-[12px] mt-1.5 flex gap-3" style={{color: C.textMuted}}>
                      {strategicGoal.revenueTarget && <span>Revenue: ₹{strategicGoal.revenueTarget}Cr</span>}
                      {strategicGoal.profitTarget && <span>Profit: ₹{strategicGoal.profitTarget}Cr</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={openStrategicModal} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-500 border" style={{borderColor: C.borderLgt}} title="Edit Priority">
                    <EditIcon />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 rounded-2xl mb-4" style={{ border: `2px dashed ${C.primaryBord}`, backgroundColor: '#fffaf9' }}>
                <TargetLargeIcon />
                <h3 className="text-[16px] font-bold mb-1" style={{ color: C.textMain }}>Set Your Quarterly Priorities</h3>
                <p className="text-[13px] mb-5" style={{ color: C.textMuted }}>What are your top 3-5 priorities this quarter?</p>
                <button
                  onClick={openStrategicModal}
                  className="px-5 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm flex items-center justify-center mx-auto gap-2 text-white"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  + Add Quarterly Rock
                </button>
              </div>
            )}
          </div>

          {fetchError&&(
            <div className="mb-4 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span>⚠ {fetchError}</span>
              <button onClick={fetchQuarterlyGoals} className="text-xs underline">Retry</button>
            </div>
          )}

          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{color:'#070707'}}>Quarterly Initiatives</span>
            {isFetching&&<LoaderIcon className="w-3.5 h-3.5" style={{color:C.textMuted}}/>}
          </div>

          {/* Cards */}
          {isFetching?(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              {[1,2,3,4].map(n=><div key={n} className="bg-white/30 rounded-2xl p-4"><div className="st-skeleton h-4 w-3/4 mb-3"/><div className="st-skeleton h-2 w-full mt-4"/></div>)}
            </div>
          ):(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              {initiatives.length===0&&!fetchError&&<p className="col-span-2 text-sm italic py-2" style={{color:C.textMuted}}>No quarterly initiatives found. Add one below.</p>}
              {initiatives.map(initiative=>(
                <div key={initiative.id} className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="mt-1 w-3.5 h-3.5 rounded-full border-[3px] bg-white shrink-0" style={{borderColor:C.primary}}/>
                      <span className="text-[14px] font-black leading-snug" style={{color:C.textMain}}>{initiative.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-xl border" style={{borderColor:C.borderLgt}}>
                      <button onClick={()=>openEditGoalModal(initiative)} className="p-1 rounded-lg transition-colors" style={{color:'#9ca3af'}} onMouseEnter={e=>e.currentTarget.style.color=C.primary} onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}><EditIcon/></button>
                      <button onClick={()=>deleteGoal(initiative.id as number)} className="p-1 rounded-lg transition-colors" style={{color:'#9ca3af'}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}><TrashIcon/></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" step="1" value={initiative.progress} onChange={e=>handleCardSlider(initiative.id as number,e.target.value)} className="st-goal-slider" style={{background:sliderBg(initiative.progress)}}/>
                    <span className="text-xs font-black w-9 text-right shrink-0 tabular-nums" style={{color:C.textMuted}}>{initiative.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button onClick={openCreateGoalModal} className="text-sm font-black px-5 py-2.5 rounded-xl transition-colors border" style={{color:C.primary,background:'rgba(255,255,255,0.5)',borderColor:'rgba(255,255,255,0.5)'}} onMouseEnter={e=>e.currentTarget.style.background='#fff'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.5)'}>
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ── Modal 1: Edit Strategic Goal ── */}
        {activeModal==='edit_strategic'&&tempStrategic&&(
          <Modal onClose={closeModal}>
            <div className="q-modal-box" style={{maxWidth:600}}>
              <div className="flex justify-between items-center px-6 py-5 border-b bg-white" style={{borderColor:C.primaryBord}}>
                <h2 className="font-black text-[17px] m-0" style={{color:C.textMain}}>Edit Strategic Goal</h2>
                <div className="flex items-center gap-3">
                  <button onClick={saveStrategicGoal} disabled={isSaving} style={{...modalBtnBase,color:'#fff',background:C.primary,padding:'6px 14px',opacity:isSaving?0.7:1}}>
                    {isSaving?'Updating...':'Update'}
                  </button>
                  <button onClick={closeModal} className="p-1 rounded-xl hover:bg-black/5 transition-colors" style={{color:'#9ca3af'}}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto" style={{maxHeight:'65vh'}}>
                {saveError&&<div className="q-error-banner">{saveError}</div>}
                
                <div>
                  <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Goal Title</label>
                  <input type="text" value={tempStrategic.title} onChange={e=>setTempStrategic({...tempStrategic,title:e.target.value})} placeholder="e.g., Achieve ₹100Cr Revenue" className="q-input"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Goal Type</label>
                    <select value={tempStrategic.goalType} onChange={e=>setTempStrategic({...tempStrategic,goalType:e.target.value})} className="q-select">
                      <option>Long-term (3-5 years)</option>
                      <option>Medium-term (1-3 years)</option>
                      <option>Short-term (Quarterly)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Target Date</label>
                    <DatePicker value={tempStrategic.targetDate} onChange={v=>setTempStrategic({...tempStrategic,targetDate:v})} placeholder="dd-mm-yyyy"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Revenue Target (₹Cr)</label>
                    <input type="number" step="any" value={tempStrategic.revenueTarget} onChange={e=>setTempStrategic({...tempStrategic,revenueTarget:e.target.value})} className="q-input"/>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Profit Target (₹Cr)</label>
                    <input type="number" step="any" value={tempStrategic.profitTarget} onChange={e=>setTempStrategic({...tempStrategic,profitTarget:e.target.value})} className="q-input"/>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Key Initiatives (Link Operational Goals)</label>
                  <p className="text-[11px] mb-2" style={{color:C.textMuted}}>Select operational goals that are key initiatives for this strategic goal</p>
                  
                  {initiatives.length > 0 ? (
                    <div className="border rounded-xl p-2 max-h-40 overflow-y-auto space-y-1" style={{borderColor: C.borderLgt}}>
                      {initiatives.map(init => (
                        <label key={init.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input type="checkbox" checked={linkedStrategicInitiatives.includes(init.id as number)} onChange={()=>toggleStrategicLink(init.id as number)} className="mt-0.5 w-4 h-4 cursor-pointer rounded" style={{accentColor:C.primary}}/>
                          <div className="text-[13px] font-medium leading-tight" style={{color:C.textMain}}>{init.title}</div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm italic py-2" style={{color:C.textMuted}}>No operational goals available to link.</div>
                  )}
                </div>

              </div>
              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{borderColor:C.primaryBord}}>
                <button onClick={closeModal} disabled={isSaving} style={{...modalBtnBase,color:C.textMain,background:'#fff',border:`1px solid ${C.borderLgt}`}}>Cancel</button>
                <button onClick={saveStrategicGoal} disabled={isSaving} style={{...modalBtnBase,color:'#fff',background:C.primary,opacity:isSaving?0.7:1}} onMouseEnter={e=>{if(!isSaving)e.currentTarget.style.background=C.primaryHov;}} onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                  {isSaving&&<LoaderIcon className="w-4 h-4 inline mr-2"/>}{isSaving?'Updating...':'Update'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ── Modal 2: Create / Edit Quarterly Goal ── */}
        {(activeModal==='create_goal'||activeModal==='edit_goal')&&tempGoal&&(
          <Modal onClose={closeModal}>
            <div className="q-modal-box" style={{maxWidth:640}}>
              <div className="flex justify-between items-center px-6 py-5 border-b bg-white" style={{borderColor:C.primaryBord}}>
                <div>
                  <h2 className="font-black text-[17px] m-0" style={{color:C.textMain}}>{activeModal==='create_goal'?'Create Quarterly Initiative':'Edit Initiative'}</h2>
                  <p className="text-[12px] mt-1" style={{color:C.textMuted}}>Set a measurable target for this quarter</p>
                </div>
                <button onClick={closeModal} className="p-1 rounded-xl hover:bg-black/5 transition-colors" style={{color:'#9ca3af'}}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {saveError&&<div className="q-error-banner">{saveError}</div>}
                <div>
                  <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Goal Title <span style={{color:C.primary}}>*</span></label>
                  <input type="text" value={tempGoal.title} onChange={e=>setTempGoal({...tempGoal,title:e.target.value})} placeholder="e.g. Increase MRR by 30%" className="q-input font-black"/>
                </div>
                <div>
                  <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Description</label>
                  <textarea value={tempGoal.description} onChange={e=>setTempGoal({...tempGoal,description:e.target.value})} placeholder="Add detailed description..." className="q-input" style={{minHeight:80,resize:'vertical'}}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Target Value</label>
                    <input type="number" step="any" value={tempGoal.targetValue} onChange={e=>setTempGoal({...tempGoal,targetValue:e.target.value})} className="q-input"/>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Target Date</label>
                    <DatePicker value={tempGoalDate} onChange={setTempGoalDate} placeholder="dd-mm-yyyy"/>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Unit</label>
                    <select value={tempGoal.unit} onChange={e=>setTempGoal({...tempGoal,unit:e.target.value})} className="q-select">
                      <option value="days">Days</option><option value="%">%</option><option value="Amount">Amount</option><option value="count">Count</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Owner ID</label>
                    <input type="number" value={tempGoal.ownerId||''} onChange={e=>setTempGoal({...tempGoal,ownerId:e.target.value})} className="q-input"/>
                  </div>
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Status</label>
                    <select value={tempGoal.status} onChange={e=>setTempGoal({...tempGoal,status:e.target.value})} className="q-select">
                      <option>On Track</option><option>Behind</option><option>At Risk</option>
                    </select>
                  </div>
                </div>
                {activeModal==='edit_goal'&&(
                  <div style={{background:C.primaryBg,borderRadius:12,padding:'16px 18px',border:`1px solid ${C.primaryBord}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <label style={{fontSize:13,fontWeight:700,color:C.textMain}}>Current Progress</label>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <input type="number" min="0" max="100" step="1" value={tempGoal.progress} onChange={e=>handleModalProgressChange(e.target.value)} style={{width:56,border:`1px solid ${C.borderLgt}`,borderRadius:8,textAlign:'center',padding:'4px 6px',fontSize:13,fontWeight:800,outline:'none',color:C.textMain,fontFamily:C.font}}/>
                        <span style={{fontSize:13,fontWeight:700,color:C.textMuted}}>%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" step="1" value={tempGoal.progress} onChange={e=>handleModalProgressChange(e.target.value)} className="st-modal-slider" style={{background:sliderBg(tempGoal.progress)}}/>
                  </div>
                )}
                {activeModal==='edit_goal'&&(
                  <div>
                    <label className="block text-[12px] font-black mb-1.5" style={{color:C.textMain}}>Update Remarks</label>
                    <textarea value={tempGoal.updateRemarks} onChange={e=>setTempGoal({...tempGoal,updateRemarks:e.target.value})} placeholder="Add notes..." className="q-input" style={{minHeight:60,resize:'vertical'}}/>
                  </div>
                )}
              </div>
              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{borderColor:C.primaryBord}}>
                <button onClick={closeModal} disabled={isSaving} style={{...modalBtnBase,color:C.textMain,background:'#fff',border:`1px solid ${C.borderLgt}`}}>Cancel</button>
                <button onClick={saveGoalDetails} disabled={isSaving} style={{...modalBtnBase,color:'#fff',background:C.primary,display:'flex',alignItems:'center',gap:8,opacity:isSaving?0.7:1}} onMouseEnter={e=>{if(!isSaving)e.currentTarget.style.background=C.primaryHov;}} onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                  {isSaving&&<LoaderIcon/>}{isSaving?'Saving...':(activeModal==='create_goal'?'Create Goal':'Save Changes')}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};