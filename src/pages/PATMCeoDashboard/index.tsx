import { useState, useEffect } from 'react';
import './PATMCeoDashboard.css';
import TopNav from './components/TopNav';
import DateRangeBar from './components/DateRangeBar';
import KpiStrip from './components/KpiStrip';
import StickyActionBar from './components/StickyActionBar';
import OverviewTab from './components/OverviewTab';
import DeliveryTab from './components/DeliveryTab';
import TeamTab from './components/TeamTab';
import AiBot from './components/AiBot';

type Tab = 'overview' | 'delivery' | 'team';

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function monthDateRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const from = `${y}-${m}-01`;
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  const to = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
  return { from, to };
}

function fmtMonthLabel(from: string, to: string) {
  const f = fmtDate(from);
  const t = fmtDate(to);
  return `This Month · ${f} – ${t}`;
}

export default function PATMCeoDashboard() {
  const { from, to } = monthDateRange();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activePreset, setActivePreset] = useState('This Month');
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [activeLabel, setActiveLabel] = useState(fmtMonthLabel(from, to));
  const [aiOpen, setAiOpen] = useState(false);
  const [quote, setQuote] = useState<{ greeting?: string; quotes?: string } | null>(null);

  // Fetch quote when AI modal opens
  useEffect(() => {
    let cancelled = false;
    const fetchQuote = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch('https://lockated-api.gophygital.work/patm_dashboard/patm_chatbot_quotes', {
          headers: {
            Authorization: token ? `Bearer ${token}` : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxODkwMzcsImVtYWlsIjoiYXRoYXJ2Lmthcm5la2FyQGxvY2thdGVkLmNvbSJ9.K9KDSk-Ltl8ptPWB3FDxlwnhP080pHWzmIi8tKZJ1dg'
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setQuote(data);
      } catch (e) {
        console.error('Failed to fetch quote', e);
      }
    };
    fetchQuote();
    return () => { cancelled = true; };
  }, []);

  function handlePreset(label: string, from: string, to: string) {
    setActivePreset(label);
    setFromDate(from);
    setToDate(to);
    const badge = from === to ? `${label} · ${fmtDate(from)}` : `${label} · ${fmtDate(from)} – ${fmtDate(to)}`;
    setActiveLabel(badge);
  }

  function handleApply() {
    if (!fromDate || !toDate) return;
    setActivePreset('');
    const badge = fromDate === toDate ? `Custom range · ${fmtDate(fromDate)}` : `Custom range · ${fmtDate(fromDate)} – ${fmtDate(toDate)}`;
    setActiveLabel(badge);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: '🏠 Overview' },
    { id: 'delivery', label: '📁 Delivery & Projects' },
    { id: 'team', label: '👥 Team Productivity' },
  ];

  return (
    <div className="patm-dashboard">
      <div className="wrap">
        <TopNav />

        <DateRangeBar
          activePreset={activePreset}
          fromDate={fromDate}
          toDate={toDate}
          activeLabel={activeLabel}
          onPreset={handlePreset}
          onFromChange={(v) => { setFromDate(v); setActivePreset(''); }}
          onToChange={(v) => { setToDate(v); setActivePreset(''); }}
          onApply={handleApply}
        />

        <KpiStrip fromDate={fromDate} toDate={toDate} />

        <StickyActionBar />

        {/* TABS */}
        <div className="tabs">
          {TABS.map((t) => (
            <div
              key={t.id}
              className={`tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'overview' && <OverviewTab fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'delivery' && <DeliveryTab fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'team' && <TeamTab fromDate={fromDate} toDate={toDate} />}
      </div>

      <AiBot isOpen={aiOpen} onToggle={() => setAiOpen((o) => !o)} externalQuote={quote} />
    </div>
  );
}
