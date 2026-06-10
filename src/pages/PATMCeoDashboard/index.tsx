import { useState } from 'react';
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

export default function PATMCeoDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activePreset, setActivePreset] = useState('This Month');
  const [fromDate, setFromDate] = useState('2026-05-01');
  const [toDate, setToDate] = useState('2026-05-31');
  const [activeLabel, setActiveLabel] = useState('This Month · 01 May – 31 May 2026');
  const [aiOpen, setAiOpen] = useState(false);

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

        <KpiStrip />

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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'delivery' && <DeliveryTab />}
        {activeTab === 'team' && <TeamTab />}
      </div>

      <AiBot isOpen={aiOpen} onToggle={() => setAiOpen((o) => !o)} />
    </div>
  );
}
