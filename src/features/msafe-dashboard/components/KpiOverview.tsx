import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ClipboardCheck,
  MapPin,
  Download,
} from 'lucide-react';
import type { AccordionKey } from '../data/constants';
import { ADMIN_KPIS } from '../data/mockData';
import { InfoButton } from './InfoButton';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';
import { Skeleton } from '@/components/ui/skeleton';

type KpiValueType = 'count' | 'percent';

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

async function fetchMsafeTrainingJson(endpoint: string, signal?: AbortSignal): Promise<unknown> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
  const params = new URLSearchParams({ company_id: companyId });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_tranning_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
type KpiApiValue = { value: string; sub?: string };

const KPI_FIELD_MAP: Record<string, { valueKeys: string[]; valueType: KpiValueType; subKeys?: string[] }> = {
  users: { valueKeys: ['total_users', 'users', 'user_count'], valueType: 'count' },
  'krcc-filled': { valueKeys: ['krcc_filled', 'krcc_filled_count'], valueType: 'count' },
  'krcc-approved': {
    valueKeys: ['krcc_approved', 'krcc_approved_count'],
    valueType: 'count',
    subKeys: ['krcc_approved_percentage', 'krcc_approved_percent'],
  },
  'train-cat': {
    valueKeys: ['category_wise_training_completed', 'train_category_percentage', 'category_wise_completion'],
    valueType: 'percent',
  },
  'train-user': {
    valueKeys: ['user_wise_training_completion', 'user_wise_training_completed'],
    valueType: 'count',
    subKeys: ['user_wise_training_completion_percentage', 'user_wise_training_completed_percentage'],
  },
  'train-int': {
    valueKeys: ['training_pass_rate_internal', 'train_pass_rate_internal', 'internal_pass_rate'],
    valueType: 'percent',
  },
  'train-ext': {
    valueKeys: ['training_pass_rate_external', 'train_pass_rate_external', 'external_pass_rate'],
    valueType: 'percent',
  },
  lmc: { valueKeys: ['lmc_today', 'lmc'], valueType: 'count' },
  smt: { valueKeys: ['smt_visits_this_month', 'smt'], valueType: 'count' },
};

function unwrapKpiRecord(data: unknown): Record<string, unknown> {
  const record = data as Record<string, unknown>;
  if (record && typeof record === 'object' && !Array.isArray(record)) {
    for (const key of ['kpi', 'kpis', 'data', 'overview']) {
      const nested = record[key];
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as Record<string, unknown>;
    }
    return record;
  }
  return {};
}

function pickValue(record: Record<string, unknown>, keys: string[], valueType: KpiValueType): string | null {
  for (const key of keys) {
    const v = record[key];
    if (v === null || v === undefined) continue;
    if (typeof v === 'number') {
      return valueType === 'percent' ? `${v}%` : v.toLocaleString('en-IN');
    }
    if (typeof v === 'string' && v.trim()) {
      const s = v.trim();
      return valueType === 'percent' && !s.includes('%') ? `${s}%` : s;
    }
  }
  return null;
}

function pickPercentageSub(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = record[key];
    if (v === null || v === undefined) continue;
    if (typeof v === 'number') return `(${v}%)`;
    if (typeof v === 'string' && v.trim()) {
      const s = v.trim();
      return `(${s.includes('%') ? s : `${s}%`})`;
    }
  }
  return undefined;
}

const ICONS: Record<string, ReactNode> = {
  users: <Users size={16} />,
  'krcc-filled': <FileText size={16} />,
  'krcc-approved': <CheckCircle2 size={16} />,
  'train-cat': <GraduationCap size={16} />,
  'train-user': <UserCheck size={16} />,
  'train-int': <ShieldCheck size={16} />,
  'train-ext': <ShieldCheck size={16} />,
  lmc: <ClipboardCheck size={16} />,
  smt: <MapPin size={16} />,
};

const HINT: Record<string, string> = {
  users: 'Users',
  krcc: 'KRCC',
  training: 'Training',
  lmc: 'LMC',
  smt: 'SMT',
};

export function KpiOverview() {
  const { openAcc, toggleAccordion, showToast } = useMsafeDashboard();
  const [kpiApiData, setKpiApiData] = useState<Record<string, KpiApiValue>>({});
  const [kpiLoading, setKpiLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await fetchMsafeTrainingJson('kpi.json', controller.signal);
        const record = unwrapKpiRecord(data);
        const next: Record<string, KpiApiValue> = {};
        for (const [id, map] of Object.entries(KPI_FIELD_MAP)) {
          const value = pickValue(record, map.valueKeys, map.valueType);
          if (!value) continue;
          const sub = map.subKeys ? pickPercentageSub(record, map.subKeys) : undefined;
          next[id] = { value, sub };
        }
        if (!controller.signal.aborted) setKpiApiData(next);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('Failed to load KPI overview:', err);
      } finally {
        if (!controller.signal.aborted) setKpiLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const valueFor = (id: string) => {
    const api = kpiApiData[id];
    if (!api) return '—';
    if (api.sub) {
      return (
        <>
          {api.value} <span className="kpi-val-sub">{api.sub}</span>
        </>
      );
    }
    return api.value;
  };

  return (
    <div className="sec" id="sec-overview">
      <div className="sec-hd">
        <div className="sec-lbl">Overview — Compliance Snapshot</div>
        <div className="sec-line" />
      </div>
      <div className="flow-hint">
        Click any KPI to expand its full section below · numbers follow the M-Safe user journey, left to right
      </div>

      <div className="kpi-grid flow-kpi-grid">
        {ADMIN_KPIS.map((k) => {
          const active = openAcc === k.group;
          const style: CSSProperties = {};
          if (k.color) (style as Record<string, string>)['--kpi-c'] = k.color;
          if (k.tint) (style as Record<string, string>)['--kpi-tint'] = k.tint;
          return (
            <div
              key={k.id}
              className={`kpi flow-kpi ${active ? 'kpi-active' : ''}`}
              style={style}
              data-group={k.group}
              onClick={() => toggleAccordion(k.group as AccordionKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleAccordion(k.group as AccordionKey);
              }}
            >
              <button
                type="button"
                className="kpi-dl-btn"
                title="Download Excel"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Excel export started · ${k.download}`);
                }}
              >
                <Download size={14} />
              </button>
              <div className="kpi-top">
                <div className="kpi-lbl">
                  {k.label}
                  <InfoButton infoKey={k.infoKey} />
                </div>
                <div className="kpi-ico">{ICONS[k.id]}</div>
              </div>
              <div className="kpi-val">
                {kpiLoading ? <Skeleton className="h-6 w-20" /> : valueFor(k.id)}
              </div>
              <div className="kpi-flow-arrow">↓ tap to view {HINT[k.group]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
