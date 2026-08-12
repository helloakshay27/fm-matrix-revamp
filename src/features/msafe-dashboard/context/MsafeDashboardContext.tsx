import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AccordionKey, ModuleView, Persona } from '../data/constants';

export type DrillState = { id: string; title: string; crumb: string } | null;
export type ToastItem = { id: number; message: string };
export type AppliedFilters = {
  circle: string;
  functions: string[];
  zone: string;
  empType: string;
  startDate: string;
  endDate: string;
};

export const DEFAULT_FILTERS: AppliedFilters = {
  circle: 'Maharashtra & Goa',
  functions: [],
  zone: 'All Zones',
  empType: 'Internal / External',
  startDate: '2026-07-01',
  endDate: '2026-07-31',
};

type Ctx = {
  persona: Persona;
  setPersona: (p: Persona) => void;
  module: ModuleView;
  setModule: (m: ModuleView) => void;
  openAcc: AccordionKey;
  toggleAccordion: (key: AccordionKey) => void;
  pageTitle: string;
  setPageTitle: (t: string) => void;
  scopeText: string;
  setScopeText: (t: string) => void;
  kpiUsers: string;
  setKpiUsers: (v: string) => void;
  kpiLmc: string;
  setKpiLmc: (v: string) => void;
  kpiSmt: string;
  setKpiSmt: (v: string) => void;
  circle: string;
  setCircle: (c: string) => void;
  functions: string[];
  setFunctions: (f: string[]) => void;
  zone: string;
  setZone: (z: string) => void;
  empType: string;
  setEmpType: (e: string) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  /** Snapshot of circle/functions/zone/empType/startDate/endDate taken at the last "Apply" click.
   *  API-fetching sections should key their fetches off this, not the live dropdown state, so
   *  data only refreshes once the user explicitly applies filters. */
  appliedFilters: AppliedFilters;
  drill: DrillState;
  openDrill: (id: string, title?: string) => void;
  closeDrill: () => void;
  toasts: ToastItem[];
  showToast: (message: string) => void;
  selectedAnalytics: string[];
  setSelectedAnalytics: (ids: string[]) => void;
  analyticsOpen: boolean;
  setAnalyticsOpen: (v: boolean) => void;
};

const MsafeDashboardContext = createContext<Ctx | null>(null);

export function MsafeDashboardProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>('admin');
  const [module, setModule] = useState<ModuleView>('msafe');
  const [openAcc, setOpenAcc] = useState<AccordionKey>(null);
  const [pageTitle, setPageTitle] = useState('M-Safe · All-India View');
  const [scopeText, setScopeText] = useState('27,438 registered users across 22 circles');
  const [kpiUsers, setKpiUsers] = useState('27,438');
  const [kpiLmc, setKpiLmc] = useState('1,284');
  const [kpiSmt, setKpiSmt] = useState('438');
  const [circle, setCircle] = useState(DEFAULT_FILTERS.circle);
  const [functions, setFunctions] = useState<string[]>(DEFAULT_FILTERS.functions);
  const [zone, setZone] = useState(DEFAULT_FILTERS.zone);
  const [empType, setEmpType] = useState(DEFAULT_FILTERS.empType);
  const [startDate, setStartDate] = useState(DEFAULT_FILTERS.startDate);
  const [endDate, setEndDate] = useState(DEFAULT_FILTERS.endDate);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [drill, setDrill] = useState<DrillState>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([]);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    if (p === 'admin') {
      setPageTitle('M-Safe · Pan India View');
      setScopeText('27,438 registered users across 22 circles');
      setKpiUsers('27,438');
      setKpiLmc('1,284');
      setKpiSmt('438');
    } else {
      setPageTitle('M-Safe · Maharashtra & Goa Circle');
      setScopeText('2,148 registered users · 12 clusters · 84 work locations');
      setKpiUsers('2,148');
      setKpiLmc('112');
      setKpiSmt('38');
    }
  }, []);

  // HTML v6 behavior: sections stay mounted; KPI click highlights + smooth-scrolls
  const toggleAccordion = useCallback((key: AccordionKey) => {
    if (!key) return;
    setOpenAcc(key);
    const idMap: Record<Exclude<AccordionKey, null>, string> = {
      users: 'acc-users',
      krcc: 'acc-krcc',
      training: 'acc-training',
      lmc: 'acc-lmc',
      smt: 'acc-smt',
    };
    window.requestAnimationFrame(() => {
      document.getElementById(idMap[key])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    window.setTimeout(() => setOpenAcc(null), 1600);
  }, []);

  const openDrill = useCallback((id: string, title?: string) => {
    setDrill({
      id,
      title: title || '',
      crumb: 'M-Safe',
    });
  }, []);

  const closeDrill = useCallback(() => setDrill(null), []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ circle, functions, zone, empType, startDate, endDate });
    setPageTitle(`M-Safe · ${circle} Circle`);
    showToast(`Filters applied · dashboard refreshed for ${circle}`);
  }, [circle, functions, zone, empType, startDate, endDate, showToast]);

  const resetFilters = useCallback(() => {
    setCircle(DEFAULT_FILTERS.circle);
    setFunctions(DEFAULT_FILTERS.functions);
    setZone(DEFAULT_FILTERS.zone);
    setEmpType(DEFAULT_FILTERS.empType);
    setStartDate(DEFAULT_FILTERS.startDate);
    setEndDate(DEFAULT_FILTERS.endDate);
    setAppliedFilters(DEFAULT_FILTERS);
    setPageTitle('M-Safe · Maharashtra & Goa Circle');
    showToast('Filters reset');
  }, [showToast]);

  const value = useMemo(
    () => ({
      persona,
      setPersona,
      module,
      setModule,
      openAcc,
      toggleAccordion,
      pageTitle,
      setPageTitle,
      scopeText,
      setScopeText,
      kpiUsers,
      setKpiUsers,
      kpiLmc,
      setKpiLmc,
      kpiSmt,
      setKpiSmt,
      circle,
      setCircle,
      functions,
      setFunctions,
      zone,
      setZone,
      empType,
      setEmpType,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      applyFilters,
      resetFilters,
      appliedFilters,
      drill,
      openDrill,
      closeDrill,
      toasts,
      showToast,
      selectedAnalytics,
      setSelectedAnalytics,
      analyticsOpen,
      setAnalyticsOpen,
    }),
    [
      persona,
      setPersona,
      module,
      openAcc,
      toggleAccordion,
      pageTitle,
      scopeText,
      kpiUsers,
      kpiLmc,
      kpiSmt,
      circle,
      functions,
      zone,
      empType,
      startDate,
      endDate,
      applyFilters,
      appliedFilters,
      resetFilters,
      drill,
      openDrill,
      closeDrill,
      toasts,
      showToast,
      selectedAnalytics,
      analyticsOpen,
    ],
  );

  return <MsafeDashboardContext.Provider value={value}>{children}</MsafeDashboardContext.Provider>;
}

export function useMsafeDashboard() {
  const ctx = useContext(MsafeDashboardContext);
  if (!ctx) throw new Error('useMsafeDashboard must be used within MsafeDashboardProvider');
  return ctx;
}
