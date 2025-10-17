
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Button, Paper, Stack, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import TailwindMultiSelect from '../components/TailwindMultiSelect';
import TailwindSingleSelect from '../components/TailwindSingleSelect';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';

const COLORS = {
    krcc: '#FFC107', // Yellow
    approval: '#D32F2F', // Red
    hsw: '#7E57C2', // Purple
    grid: '#E0E0E0',
};

type Option = { label: string; value: string };

const MsafeDashboardVI: React.FC = () => {
    // Drag & drop: order of sections
    type SectionKey =
        | 'onboarding-status'
        | 'onboarding-summary'
        | 'day1-hsw'
        | 'training-compliance'
        | 'training-summary'
        | 'training-ftpr'
        | 'new-joinee-trend'
        | 'new-joinee-summary'
        | 'lmc'
        | 'smt'
        | 'compliance-forecast'
        | 'compliance-forecast-summary'
        | 'driving'
        | 'driving-summary'
        | 'medical'
        | 'medical-summary';

    const [sectionOrder, setSectionOrder] = useState<SectionKey[]>([
        'onboarding-status',
        'onboarding-summary',
        'day1-hsw',
        'training-compliance',
        'training-summary',
        'training-ftpr',
        'new-joinee-trend',
        'new-joinee-summary',
        'lmc',
        'smt',
        'compliance-forecast',
        'compliance-forecast-summary',
        'driving',
        'driving-summary',
        'medical',
        'medical-summary',
    ]);

    // dnd-kit sensors
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    // Sortable wrapper
    const SortableItem: React.FC<{ id: SectionKey; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style: React.CSSProperties = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: 'grab',
            opacity: isDragging ? 0.9 : 1,
        };
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };
    // Filters state (editable UI state)
    const [cluster, setCluster] = useState<string[]>([]);
    const [circle, setCircle] = useState<string[]>([]);
    const [func, setFunc] = useState<string[]>([]);
    const [employeeType, setEmployeeType] = useState('');
    type NewJoineeDatum = { site: string; count: number };
    const [newJoineeData, setNewJoineeData] = useState<NewJoineeDatum[]>([]);
    const [newJoineeLoading, setNewJoineeLoading] = useState(false);
    const newJoineeChartRef = useRef<HTMLDivElement | null>(null);
    // New Joinee Y-axis: start at 0 and use "nice" integer ticks (with ~10% headroom)
    const newJoineeYAxis = useMemo(() => {
        const max = newJoineeData.reduce((m, d: any) => Math.max(m, Number(d?.count || 0)), 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [newJoineeData]);
    // Monthwise summary state (dynamic months × sites matrix)
    const [njSummaryLoading, setNjSummaryLoading] = useState(false);
    const [njSummaryMonths, setNjSummaryMonths] = useState<string[]>([]); // e.g., ['Aug-2025','Sep-2025','Oct-2025']
    const [njSummarySites, setNjSummarySites] = useState<string[]>([]);   // sites derived from response, not from chart
    const [njSummaryMatrix, setNjSummaryMatrix] = useState<Record<string, Record<string, number>>>({}); // site -> month -> value

    // Applied filter state: API calls only use these values (set on Apply)
    const [appliedCluster, setAppliedCluster] = useState<string[]>([]);
    const [appliedCircle, setAppliedCircle] = useState<string[]>([]);
    const [appliedFunc, setAppliedFunc] = useState<string[]>([]);
    const [appliedEmployeeType, setAppliedEmployeeType] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState<any>(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });
    const [appliedEndDate, setAppliedEndDate] = useState<any>(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });

    // Snapshot shape for passing filters to fetch functions
    type FiltersSnapshot = {
        cluster: string[];
        circle: string[];
        func: string[];
        employeeType: string;
        from: any;
        to: any;
    };

    const chartRef = useRef<HTMLDivElement | null>(null);
    const day1ChartRef = useRef<HTMLDivElement | null>(null);
    const trainingChartRef = useRef<HTMLDivElement | null>(null);
    // For aligning external 'Set Custom Date' heading with the date controls inside FiltersPanel
    const filtersAreaRef = useRef<HTMLDivElement | null>(null);
    const [dateLabelOffset, setDateLabelOffset] = useState<number>(0);
    const handleDateBlockRect = useCallback((rect: DOMRect) => {
        const containerRect = filtersAreaRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        const left = Math.max(0, rect.left - containerRect.left);
        setDateLabelOffset(left);
    }, []);

    const today = useMemo(() => new Date(), []);

    const weekdayLabel = useMemo(
        () =>
            today.toLocaleDateString(undefined, {
                weekday: 'long',
            }),
        [today]
    );

    const dateLabel = useMemo(
        () =>
            today.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [today]
    );

    // Cluster options loaded from API
    const [clusterOptions, setClusterOptions] = useState<Option[]>([]);
    const [circleOptions, setCircleOptions] = useState<Option[]>([]);
    const [functionOptions, setFunctionOptions] = useState<Option[]>([]);
    const didInitialApply = useRef(false);
    const employeeTypes: Option[] = [
        { label: 'Internal / External', value: 'both' },
        { label: 'Internal', value: 'internal' },
        { label: 'External', value: 'external' },
    ];

    // Fetch clusters from API using baseUrl and token stored in web storage (keep company_id=145)
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl') || '';
                const token =
                    localStorage.getItem('token') ||
                    '';

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token — cluster list will stay default.');
                    return;
                }

                const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
                const url = `https://${host}/msafe_dashboard/cluster_level_filter.json?access_token=${encodeURIComponent(token)}&company_id=145`;

                const controller = new AbortController();

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                const arr =
                    data?.clusters ||
                    (Array.isArray(data) ? data : []);

                const opts = arr
                    .map((x: any) => {
                        const name = x?.cluster_name?.trim?.();
                        if (!name) return null;
                        return { label: name, value: String(x?.id ?? name) };
                    })
                    .filter(Boolean)
                    .filter((v, i, self) => self.findIndex((s) => s.value === v.value) === i)
                    .sort((a, b) => a.label.localeCompare(b.label));

                setClusterOptions(opts);

                return () => controller.abort();
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Failed to load cluster options:', err);
            }
        };

        fetchClusters();
    }, []);

    // Fetch circles from API using baseUrl and token stored in web storage (keep company_id=145)
    useEffect(() => {
        const fetchCircles = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';
                if (!baseUrl || !token) return;
                const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
                const url = `https://${host}/msafe_dashboard/circle_level_filter.json?access_token=${encodeURIComponent(token)}&company_id=145`;
                const controller = new AbortController();
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const arr = data?.circles || (Array.isArray(data) ? data : []);
                const opts: Option[] = arr
                    .map((x: any) => {
                        const name = x?.circle_name?.trim?.();
                        if (!name) return null;
                        return { label: name, value: String(x?.id ?? name) };
                    })
                    .filter(Boolean) as Option[];
                const deduped = opts.filter((v, i, self) => self.findIndex((s) => s.value === v.value) === i);
                deduped.sort((a, b) => a.label.localeCompare(b.label));
                setCircleOptions(deduped);
                return () => controller.abort();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to load circle options:', err);
            }
        };
        fetchCircles();
    }, []);

    // Fetch functions from API using baseUrl and token stored in web storage (keep company_id=145)
    useEffect(() => {
        const fetchFunctions = async () => {
            try {
                const baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';
                if (!baseUrl || !token) return;
                const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
                // Note: endpoint is 'fuction_level_filter.json' as provided
                const url = `https://${host}/msafe_dashboard/fuction_level_filter.json?access_token=${encodeURIComponent(token)}&company_id=145`;
                const controller = new AbortController();
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const arr = data?.functions || (Array.isArray(data) ? data : []);
                const opts: Option[] = arr
                    .map((x: any) => {
                        const name = x?.function_name?.trim?.();
                        if (!name) return null;
                        return { label: name, value: String(x?.id ?? name) };
                    })
                    .filter(Boolean) as Option[];
                const deduped = opts.filter((v, i, self) => self.findIndex((s) => s.value === v.value) === i);
                deduped.sort((a, b) => a.label.localeCompare(b.label));
                setFunctionOptions(deduped);
                return () => controller.abort();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to load function options:', err);
            }
        };
        fetchFunctions();
    }, []);

    // New Joinee Trend (from API)

    const downloadNewJoineeChart = async () => {
        if (!newJoineeChartRef.current) return;
        const canvas = await html2canvas(newJoineeChartRef.current);
        const link = document.createElement('a');
        link.download = 'new-joinee-trend.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Fetch New Joinee Trend from API
    const fetchNewJoineeTrend = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setNewJoineeLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch New Joinee Trend');
                setNewJoineeLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/new_joinee_trend.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            const mapped: NewJoineeDatum[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || '-',
                count: Number(x?.new_joinees ?? 0),
            }));
            setNewJoineeData(mapped);
        } catch (err) {
            console.error('Failed to fetch New Joinee Trend:', err);
            setNewJoineeData([]);
        } finally {
            setNewJoineeLoading(false);
        }
    };

    // Helpers for month label as 'Mon-YYYY' like 'Sep-2025'
    const getMonthLabel = (dateLike: any) => {
        const d = dateLike ? new Date(dateLike) : new Date();
        if (Number.isNaN(d.getTime())) return '';
        const month = d.toLocaleString('en-US', { month: 'short' });
        return `${month}-${d.getFullYear()}`;
    };
    const addMonths = (dateLike: any, diff: number) => {
        const d = dateLike ? new Date(dateLike) : new Date();
        if (Number.isNaN(d.getTime())) return new Date();
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + diff);
        return nd;
    };

    // Fetch Monthwise summary: dynamic months and sites
    const fetchNewJoineeSummaryMonthwise = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setNjSummaryLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch New Joinee Summary');
                setNjSummaryLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/new_joinee_trend_monthwise.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const resp = json?.response || {};

            // Gather and sort month keys chronologically (e.g., 'Aug-2025')
            const monthKeys = Object.keys(resp || {});
            const parseMonthKey = (k: string) => {
                // Accept 'Aug-2025' or '2025-08' fallback
                if (/^\d{4}-\d{1,2}$/.test(k)) return new Date(`${k}-01`).getTime();
                const [mon, yr] = k.split('-');
                // Use en-US month name to date conversion
                const d = new Date(`${mon} 1, ${yr}`);
                return d.getTime();
            };
            const monthsSorted = [...monthKeys].sort((a, b) => parseMonthKey(a) - parseMonthKey(b));

            // Build matrix: site -> month -> value
            const siteSet = new Set<string>();
            const matrix: Record<string, Record<string, number>> = {};
            monthsSorted.forEach((m) => {
                const mdata = (resp as any)[m];
                if (!mdata) return;
                if (Array.isArray(mdata)) {
                    mdata.forEach((x: any) => {
                        const site = x?.cluster_name || x?.site || x?.name;
                        if (!site) return;
                        siteSet.add(site);
                        const val = Number(x?.new_joinees ?? x?.count ?? x?.value ?? 0);
                        matrix[site] = matrix[site] || {};
                        matrix[site][m] = val;
                    });
                } else if (typeof mdata === 'object') {
                    Object.entries(mdata as Record<string, any>).forEach(([siteKey, v]) => {
                        const site = String(siteKey);
                        const val = Number((v as any) ?? 0);
                        siteSet.add(site);
                        matrix[site] = matrix[site] || {};
                        matrix[site][m] = val;
                    });
                }
            });

            const sitesSorted = Array.from(siteSet).sort((a, b) => a.localeCompare(b));
            setNjSummaryMonths(monthsSorted);
            setNjSummarySites(sitesSorted);
            setNjSummaryMatrix(matrix);
        } catch (err) {
            console.error('Failed to fetch New Joinee Summary (monthwise):', err);
            setNjSummaryMonths([]);
            setNjSummarySites([]);
            setNjSummaryMatrix({});
        } finally {
            setNjSummaryLoading(false);
        }
    };


    useEffect(() => {
        if (didInitialApply.current) return;
        didInitialApply.current = true;
        // Initial load: apply current default date range (last 30 days to today) to all API calls
        const initialSnap: FiltersSnapshot = {
            cluster: [],
            circle: [],
            func: [],
            employeeType: '',
            from: new Date(appliedStartDate.getFullYear(), appliedStartDate.getMonth(), appliedStartDate.getDate()),
            to: new Date(appliedEndDate.getFullYear(), appliedEndDate.getMonth(), appliedEndDate.getDate()),
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        applyFilters(initialSnap);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Onboarding Status data (from API on Apply)
    type OnboardingDatum = { site: string; KRCC: number; Approval: number; HSW: number };
    const [onboardingData, setOnboardingData] = useState<OnboardingDatum[]>([]);
    const [onboardingLoading, setOnboardingLoading] = useState(false);

    // Onboarding Y-axis: start at 0 and use "nice" integer ticks up to the data max (with ~10% headroom)
    const onboardingYAxis = useMemo(() => {
        const max = onboardingData.reduce((m, d: any) => {
            const a = Number(d?.KRCC || 0);
            const b = Number(d?.Approval || 0);
            const c = Number(d?.HSW || 0);
            return Math.max(m, a, b, c);
        }, 0);

        // Add a little headroom above the max value
        let upper = Math.max(0, Math.ceil(max * 1.1));

        // For very small ranges, show every integer so 0 is included explicitly
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }

        // Compute a "nice" step (1, 2, 5 × 10^k) to keep ~8–10 ticks
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };

        const step = Math.max(1, Math.round(niceStep(upper, 9))); // aim for ~10 ticks
        upper = Math.ceil(upper / step) * step; // round up to a multiple of step
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        // Ensure 0 is always included as the first tick
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [onboardingData]);

    // Day 1 HSW Induction data (from API)
    type Day1HSWDatum = { site: string; Complaint: number; NonComplaint: number };
    const [day1HSWData, setDay1HSWData] = useState<Day1HSWDatum[]>([]);
    const [day1HSWLoading, setDay1HSWLoading] = useState(false);
    // Day 1 HSW Y-axis: start at 0 and use "nice" integer ticks up to max (with ~10% headroom)
    const day1HSWYAxis = useMemo(() => {
        const max = day1HSWData.reduce((m, d: any) => {
            const a = Number(d?.Complaint || 0);
            const b = Number(d?.NonComplaint || 0);
            return Math.max(m, a, b);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [day1HSWData]);

    // Training compliance data (from API)
    type TrainingDatum = {
        site: string;
        twoW: number;
        fourW: number;
        workAtHeight: number;
        electrical: number;
        ofc: number;
    };
    const [trainingData, setTrainingData] = useState<TrainingDatum[]>([]);
    const [trainingLoading, setTrainingLoading] = useState(false);
    // Training Y-axis: start at 0 and use "nice" integer ticks up to max (with ~10% headroom)
    const trainingYAxis = useMemo(() => {
        const max = trainingData.reduce((m, d: any) => {
            const a = Number(d?.twoW || 0);
            const b = Number(d?.fourW || 0);
            const c = Number(d?.workAtHeight || 0);
            const e = Number(d?.electrical || 0);
            const f = Number(d?.ofc || 0);
            return Math.max(m, a, b, c, e, f);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [trainingData]);

    // Global loading indicator across all sections
    // (moved below to after all loading states exist)

    // Format a Date-like value as YYYY-MM-DD in LOCAL time (avoid UTC off-by-one)
    const formatDate = (d: any): string => {
        if (!d) return '';
        try {
            const date = new Date(d);
            if (Number.isNaN(date.getTime())) return '';
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        } catch {
            return '';
        }
    };

    // Normalize to local midnight to keep day consistent across timezones
    const atLocalMidnight = (d: any): Date => {
        const date = new Date(d ?? new Date());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const buildIdsParam = (arr: string[]) => {
        const real = (arr || []).filter((v) => v !== 'all');
        return real.length ? real.join(',') : '';
    };

    const fetchOnboarding = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setOnboardingLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch onboarding status');
                setOnboardingLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }

            const url = `https://${host}/msafe_dashboard/onboarding_status.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            const mapped: OnboardingDatum[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || '-',
                Approval: Number(x?.approved_count ?? 0),
                KRCC: Number(x?.pending_count ?? 0),
                HSW: Number(x?.hsw_induction_count ?? 0),
            }));
            setOnboardingData(mapped);
        } catch (err) {
            console.error('Failed to fetch onboarding status:', err);
            setOnboardingData([]);
        } finally {
            setOnboardingLoading(false);
        }
    };

    const applyFilters = async (snap: FiltersSnapshot) => {
        // Guard against invalid range
        if (snap.from && snap.to && new Date(snap.to).getTime() < new Date(snap.from).getTime()) {
            toast.error('End date cannot be before start date');
            return;
        }
        // Set applied filters and trigger all fetches
        setAppliedCluster(snap.cluster || []);
        setAppliedCircle(snap.circle || []);
        setAppliedFunc(snap.func || []);
        setAppliedEmployeeType(snap.employeeType || '');
        setAppliedStartDate(snap.from ?? null);
        setAppliedEndDate(snap.to ?? null);
        const id = toast.loading('Applying filters…');
        try {
            await Promise.all([
                fetchOnboarding(true, snap),
                fetchDay1HSW(true, snap),
                fetchTrainingCompliance(true, snap),
                fetchNewJoineeTrend(true, snap),
                fetchNewJoineeSummaryMonthwise(true, snap),
                fetchMedicalFirstAid(true, snap),
                fetchSMT(true, snap),
                fetchLMC(true, snap),
                fetchDriving(true, snap),
                fetchComplianceForecast(true, snap),
                fetchFTPR(true, snap),
            ]);
            toast.success('Filters applied', { id });
        } catch (e) {
            toast.error('Failed to apply filters', { id });
        }
    };

    const fetchDay1HSW = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setDay1HSWLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch Day 1 HSW');
                setDay1HSWLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }

            const url = `https://${host}/msafe_dashboard/day_1_hsw_induction.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            const mapped: { site: string; Complaint: number; NonComplaint: number }[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || '-',
                Complaint: Number(x?.compliant_count ?? 0),
                NonComplaint: Number(x?.non_compliant_count ?? 0),
            }));
            setDay1HSWData(mapped);
        } catch (err) {
            console.error('Failed to fetch Day 1 HSW:', err);
            setDay1HSWData([]);
        } finally {
            setDay1HSWLoading(false);
        }
    };

    // Fetch Training compliance from API (percent values per site)
    const fetchTrainingCompliance = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setTrainingLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch Training compliance');
                setTrainingLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }

            const url = `https://${host}/msafe_dashboard/training_compliance.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            const mapped: TrainingDatum[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || '-',
                twoW: Number(x?.two_wheeler ?? 0),
                fourW: Number(x?.four_wheeler ?? 0),
                workAtHeight: Number(x?.work_at_height ?? 0),
                electrical: Number(x?.electrical ?? 0),
                ofc: Number(x?.ofc ?? 0),
            }));
            setTrainingData(mapped);
        } catch (err) {
            console.error('Failed to fetch Training compliance:', err);
            setTrainingData([]);
        } finally {
            setTrainingLoading(false);
        }
    };

    const downloadChart = async () => {
        if (!chartRef.current) return;
        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement('a');
        link.download = 'onboarding-status.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Generic function to download data from API as JSON
    const downloadDataFromAPI = async (endpoint: string, filename: string) => {
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                toast.error('Missing baseUrl or token — cannot download data');
                return;
            }

            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            
            // Use applied filters for the download
            const clusterParam = buildIdsParam(appliedCluster);
            const circleParam = buildIdsParam(appliedCircle);
            const functionParam = buildIdsParam(appliedFunc);
            if (clusterParam) params.set('cluster_id', clusterParam);
            if (circleParam) params.set('circle_id', circleParam);
            if (functionParam) params.set('function_id', functionParam);
            if (appliedEmployeeType) params.set('type', appliedEmployeeType);
            params.set('from_date', formatDate(appliedStartDate));
            params.set('to_date', formatDate(appliedEndDate));
            params.set('export', 'true');

            const url = `https://${host}/msafe_dashboard/${endpoint}?${params.toString()}`;
            
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            // Get the response as blob first to check content
            const blob = await res.blob();
            
            // Try to parse as JSON first
            const text = await blob.text();
            try {
                const json = JSON.parse(text);
                const dataStr = JSON.stringify(json, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url_blob = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url_blob;
                link.download = `${filename}-${formatDate(appliedStartDate)}-to-${formatDate(appliedEndDate)}.json`;
                link.click();
                URL.revokeObjectURL(url_blob);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                // If JSON parsing fails, download as Excel file
                const url_blob = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url_blob;
                link.download = `${filename}-${formatDate(appliedStartDate)}-to-${formatDate(appliedEndDate)}.xlsx`;
                link.click();
                URL.revokeObjectURL(url_blob);
            }
            
            toast.success(`${filename} data downloaded successfully`);
        } catch (err) {
            console.error(`Failed to download ${filename} data:`, err);
            toast.error('Failed to download data');
        }
    };

    // Download functions for different sections
    const downloadOnboardingData = () => downloadDataFromAPI('onboarding_status.json', 'onboarding-status');
    const downloadDay1HSWData = () => downloadDataFromAPI('day_1_hsw_induction.json', 'day1-hsw-induction');
    const downloadTrainingData = () => downloadDataFromAPI('training_compliance.json', 'training-compliance');
    const downloadNewJoineeData = () => downloadDataFromAPI('new_joinee_trend.json', 'new-joinee-trend');
    const downloadLMCData = () => downloadDataFromAPI('lmc_section.json', 'lmc-section');
    const downloadSMTData = () => downloadDataFromAPI('smt_section.json', 'smt-section');
    const downloadComplianceForecastData = () => downloadDataFromAPI('compliance_forecasting.json', 'compliance-forecasting');
    const downloadDrivingData = () => downloadDataFromAPI('driving_section.json', 'driving-section');
    const downloadMedicalData = () => downloadDataFromAPI('medical_checkup_and_first_aid.json', 'medical-first-aid');

    const downloadDay1Chart = async () => {
        if (!day1ChartRef.current) return;
        const canvas = await html2canvas(day1ChartRef.current);
        const link = document.createElement('a');
        link.download = 'day1-hsw-induction.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const downloadTrainingChart = async () => {
        if (!trainingChartRef.current) return;
        const canvas = await html2canvas(trainingChartRef.current);
        const link = document.createElement('a');
        link.download = 'training-compliance.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Day 1 HSW data is fetched from API

    // Static colors for Training compliance (% values per site)
    const TRAINING_COLORS = {
        twoW: '#F7B2A7',
        fourW: '#FFC107',
        workAtHeight: '#D32F2F',
        electrical: '#7E57C2',
        ofc: '#5E2750',
    } as const;

    // Reusable loading indicator with label
    const LoadingInline = ({ size = 24 }: { size?: number }) => (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <CircularProgress color="error" size={size} />
            <Typography variant="body2" color="text.secondary">Loading Data</Typography>
        </Stack>
    );

    // Derived: chart width and label formatter for percentages
    const trainingChartWidth = useMemo(
        () => Math.max(1400, trainingData.length * 110),
        [trainingData.length]
    );

    // Derived: Onboarding chart width for horizontal scroll to avoid x-axis overlap
    const onboardingChartWidth = useMemo(
        () => Math.max(1400, onboardingData.length * 110),
        [onboardingData.length]
    );

    const formatPercentLabel = (v: any) => {
        const n = Number(v);
        if (!n || n === 0) return '';
        return Number.isInteger(n) ? `${n}` : n.toFixed(2);
    };

    // Format big integers with thousands separators
    const formatInt = (v: any) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return '';
        return n.toLocaleString('en-IN');
    };

    // Formatter for table cells: show '-' for missing, '0' for zero, otherwise up to 2 decimals
    const formatPercentCell = (v: any) => {
        if (v === undefined || v === null || Number.isNaN(Number(v))) return '-';
        const n = Number(v);
        if (n === 0) return '0';
        return Number.isInteger(n) ? `${n}` : n.toFixed(2);
    };


    // Generic centered label factory with halo and optional vertical offset
    const makeCenteredLabel = (getText: (n: number) => string | null, yOffset = 6) => (props: any) => {
        const { x = 0, y = 0, width = 0, value } = props;
        const n = Number(value);
        if (!Number.isFinite(n)) return null;
        const text = getText(n);
        if (!text) return null;
        const cx = x + width / 2;
        return (
            <text
                x={cx}
                y={y - yOffset}
                fill="#111"
                fontSize={11}
                textAnchor="middle"
                stroke="#fff"
                strokeWidth={3}
                paintOrder="stroke"
            >
                {text}
            </text>
        );
    };

    // Centered label with min bar width guard to avoid overlap on dense charts
    const makeCountLabelGuarded = (minBarWidth = 12, yOffset = 6) => (props: any) => {
        const { x = 0, y = 0, width = 0, value } = props;
        const n = Number(value);
        if (!Number.isFinite(n) || n === 0) return null;
        if (width < minBarWidth) return null; // skip when bars are too narrow to fit text
        const cx = x + width / 2;
        const text = formatInt(n);
        const ly = Math.max(12, y - yOffset); // clamp to avoid clipping at the top
        return (
            <text
                x={cx}
                y={ly}
                fill="#111"
                fontSize={11}
                textAnchor="middle"
                stroke="#fff"
                strokeWidth={3}
                paintOrder="stroke"
            >
                {text}
            </text>
        );
    };


    // First Time Pass Rate (FTPR) chart data (from API, values normalized to 0–100)
    type FTPRItem = { site: string; twoW: number; fourW: number; workAtHeight: number; electrical: number; ofc: number };
    const [ftprData, setFtprData] = useState<FTPRItem[]>([]);
    const [ftprLoading, setFtprLoading] = useState(false);
    const ftprChartWidth = useMemo(() => Math.max(1600, ftprData.length * 130), [ftprData.length]);

    const ftprChartRef = useRef<HTMLDivElement | null>(null);
    const downloadFtprChart = async () => {
        if (!ftprChartRef.current) return;
        const canvas = await html2canvas(ftprChartRef.current);
        const link = document.createElement('a');
        link.download = 'training-first-time-pass-rate.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Fetch FTPR from API
    const fetchFTPR = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setFtprLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch FTPR');
                setFtprLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                if (src.from) params.set('from_date', formatDate(src.from));
                if (src.to) params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/first_time_pass_rate.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            let rows: FTPRItem[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || x?.site || '-',
                twoW: Number(x?.two_wheeler ?? 0),
                fourW: Number(x?.four_wheeler ?? 0),
                workAtHeight: Number(x?.work_at_height ?? 0),
                electrical: Number(x?.electrical ?? 0),
                ofc: Number(x?.ofc ?? 0),
            }));
            // Normalize values to 0..100 scale for display (if API returns 0..1, scale up)
            const rawMax = rows.reduce((m, d) => Math.max(m, d.twoW, d.fourW, d.workAtHeight, d.electrical, d.ofc), 0);
            if (rawMax <= 1.0001) {
                rows = rows.map((d) => ({
                    site: d.site,
                    twoW: d.twoW * 100,
                    fourW: d.fourW * 100,
                    workAtHeight: d.workAtHeight * 100,
                    electrical: d.electrical * 100,
                    ofc: d.ofc * 100,
                }));
            }
            rows.sort((a, b) => a.site.localeCompare(b.site));
            setFtprData(rows);
        } catch (err) {
            console.error('Failed to fetch FTPR:', err);
            setFtprData([]);
        } finally {
            setFtprLoading(false);
        }
    };


    // LMC data (from API)
    type LMCItem = { site: string; completed: number; due: number };
    const [lmcData, setLmcData] = useState<LMCItem[]>([]);
    const [lmcLoading, setLmcLoading] = useState(false);
    type SMTItem = { site: string; completed: number; due: number };
    const [smtData, setSmtData] = useState<SMTItem[]>([]);
    const [smtLoading, setSmtLoading] = useState(false);
    const lmcChartRef = useRef<HTMLDivElement | null>(null);
    const smtChartRef = useRef<HTMLDivElement | null>(null);
    // LMC Y-axis: start at 0 and use "nice" integer ticks (with ~10% headroom)
    const lmcYAxis = useMemo(() => {
        const max = lmcData.reduce((m, d: any) => {
            const a = Number(d?.completed || 0);
            const b = Number(d?.due || 0);
            return Math.max(m, a, b);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [lmcData]);

    // SMT Y-axis: start at 0 and use "nice" integer ticks (with ~10% headroom)
    const smtYAxis = useMemo(() => {
        const max = smtData.reduce((m, d: any) => {
            const a = Number(d?.completed || 0);
            const b = Number(d?.due || 0);
            return Math.max(m, a, b);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [smtData]);
    const downloadLmc = async () => {
        if (!lmcChartRef.current) return;
        const canvas = await html2canvas(lmcChartRef.current);
        const link = document.createElement('a');
        link.download = 'lmc.png';
        link.href = canvas.toDataURL();
        link.click();
    };
    // Fetch LMC from API
    const fetchLMC = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setLmcLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch LMC');
                setLmcLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/lmc_section.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const clusters = json?.clusters ?? {};
            let rows: LMCItem[] = [];
            if (Array.isArray(clusters)) {
                rows = clusters
                    .map((x: any) => {
                        const site = x?.cluster_name || x?.site || x?.center_name || '';
                        if (!site) return null;
                        return {
                            site,
                            completed: Number(x?.completed ?? 0),
                            due: Number(x?.due ?? 0),
                        } as LMCItem;
                    })
                    .filter(Boolean) as LMCItem[];
            } else if (clusters && typeof clusters === 'object') {
                rows = Object.entries(clusters as Record<string, any>)
                    .map(([siteKey, v]) => ({
                        site: String(siteKey),
                        completed: Number((v as any)?.completed ?? 0),
                        due: Number((v as any)?.due ?? 0),
                    })) as LMCItem[];
            }
            // Sort alphabetically for stable display
            rows.sort((a, b) => a.site.localeCompare(b.site));
            setLmcData(rows);
        } catch (err) {
            console.error('Failed to fetch LMC:', err);
            setLmcData([]);
        } finally {
            setLmcLoading(false);
        }
    };
    const downloadSmt = async () => {
        if (!smtChartRef.current) return;
        const canvas = await html2canvas(smtChartRef.current);
        const link = document.createElement('a');
        link.download = 'smt.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Fetch SMT data from API
    const fetchSMT = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setSmtLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch SMT');
                setSmtLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/smt_section.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const obj = json?.res || {};
            const rows: SMTItem[] = Object.keys(obj).map((k) => ({
                site: k,
                completed: Number(obj[k]?.completed ?? 0),
                due: Number(obj[k]?.due ?? 0),
            }));
            setSmtData(rows);
        } catch (err) {
            console.error('Failed to fetch SMT:', err);
            setSmtData([]);
        } finally {
            setSmtLoading(false);
        }
    };

    // Compliance Forcasting (API)
    const CF_COLORS = {
        twoW: '#FFC107', // Yellow
        fourW: '#D32F2F', // Red
        workAtHeight: '#1E40AF', // Dark Blue
        electrical: '#26A69A', // Teal
        ofc: '#F4A261', // OFC (orange)
        firstAid: '#8BC34A', // Green
    } as const;

    type CFItem = {
        site: string;
        twoW: number;
        fourW: number;
        workAtHeight: number;
        electrical: number;
        ofc: number;
        firstAid: number;
    };
    const [complianceForecastData, setComplianceForecastData] = useState<CFItem[]>([]);
    const [complianceForecastLoading, setComplianceForecastLoading] = useState(false);

    // Nice Y-axis for Compliance Forecasting (auto range from 0)
    const complianceForecastYAxis = useMemo(() => {
        const max = complianceForecastData.reduce((m, d) => {
            const a = Number(d?.twoW || 0);
            const b = Number(d?.fourW || 0);
            const c = Number(d?.workAtHeight || 0);
            const e = Number(d?.electrical || 0);
            const f = Number(d?.ofc || 0);
            const g = Number(d?.firstAid || 0);
            return Math.max(m, a, b, c, e, f, g);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))));
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [complianceForecastData]);

    // Derived width for Compliance Forcasting chart to enable comfortable horizontal scrolling
    const complianceForecastWidth = useMemo(
        () => Math.max(1600, complianceForecastData.length * 130),
        [complianceForecastData.length]
    );

    const complianceForecastRef = useRef<HTMLDivElement | null>(null);
    const downloadComplianceForecast = async () => {
        if (!complianceForecastRef.current) return;
        const canvas = await html2canvas(complianceForecastRef.current);
        const link = document.createElement('a');
        link.download = 'compliance-forcasting.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Fetch Compliance Forecasting from API
    const fetchComplianceForecast = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setComplianceForecastLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch Compliance Forecasting');
                setComplianceForecastLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/compliance_forecasting.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const arr = json?.clusters || [];
            const rows: CFItem[] = (Array.isArray(arr) ? arr : []).map((x: any) => ({
                site: x?.cluster_name || x?.site || '-',
                twoW: Number(x?.two_w ?? 0),
                fourW: Number(x?.four_w ?? 0),
                workAtHeight: Number(x?.work_at_height ?? 0),
                electrical: Number(x?.electrical ?? 0),
                ofc: Number(x?.ofc ?? 0),
                firstAid: Number(x?.first_aid ?? 0),
            }));
            // Stable alpha sort by site
            rows.sort((a, b) => a.site.localeCompare(b.site));
            setComplianceForecastData(rows);
        } catch (err) {
            console.error('Failed to fetch Compliance Forecasting:', err);
            setComplianceForecastData([]);
        } finally {
            setComplianceForecastLoading(false);
        }
    };

    // Driving (static from screenshot)
    const DRIVING_COLORS = {
        license: COLORS.krcc, // Yellow
        insurance: COLORS.approval, // Red
        puc: COLORS.hsw, // Purple
    } as const;
    type DrivingItem = { site: string; license: number; insurance: number; puc: number };
    const [drivingData, setDrivingData] = useState<DrivingItem[]>([]);
    const [drivingLoading, setDrivingLoading] = useState(false);
    // Driving Y-axis: start at 0 and use "nice" integer ticks (with ~10% headroom)
    const drivingYAxis = useMemo(() => {
        const max = drivingData.reduce((m, d: any) => {
            const a = Number(d?.license || 0);
            const b = Number(d?.insurance || 0);
            const c = Number(d?.puc || 0);
            return Math.max(m, a, b, c);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [drivingData]);

    const drivingChartRef = useRef<HTMLDivElement | null>(null);
    const downloadDrivingChart = async () => {
        if (!drivingChartRef.current) return;
        const canvas = await html2canvas(drivingChartRef.current);
        const link = document.createElement('a');
        link.download = 'driving.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Fetch Driving section from API
    const fetchDriving = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setDrivingLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch Driving');
                setDrivingLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/driving_section.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const obj = json?.res || json?.response || {};
            let rows: DrivingItem[] = [];
            if (Array.isArray(obj)) {
                rows = obj
                    .map((x: any) => {
                        const site = x?.cluster_name || x?.site || x?.center_name || '';
                        if (!site) return null;
                        return {
                            site,
                            license: Number(x?.driving_license ?? x?.license ?? 0),
                            insurance: Number(x?.insurance ?? 0),
                            puc: Number(x?.puc ?? 0),
                        } as DrivingItem;
                    })
                    .filter(Boolean) as DrivingItem[];
            } else if (obj && typeof obj === 'object') {
                rows = Object.entries(obj as Record<string, any>)
                    .map(([siteKey, v]) => ({
                        site: String(siteKey),
                        license: Number((v as any)?.driving_license ?? (v as any)?.license ?? 0),
                        insurance: Number((v as any)?.insurance ?? 0),
                        puc: Number((v as any)?.puc ?? 0),
                    }));
            }
            // Stable alpha sort by site
            rows.sort((a, b) => a.site.localeCompare(b.site));
            setDrivingData(rows);
        } catch (err) {
            console.error('Failed to fetch Driving:', err);
            setDrivingData([]);
        } finally {
            setDrivingLoading(false);
        }
    };

    // Fetch Medical Checkup & First Aid Training from API
    const fetchMedicalFirstAid = async (useFilters: boolean, filters?: FiltersSnapshot) => {
        setMedicalFirstAidLoading(true);
        try {
            const baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';
            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token — cannot fetch Medical/First Aid');
                setMedicalFirstAidLoading(false);
                return;
            }
            const host = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const params = new URLSearchParams();
            params.set('access_token', token);
            params.set('company_id', '145');
            if (useFilters) {
                const src = filters ?? {
                    cluster: appliedCluster,
                    circle: appliedCircle,
                    func: appliedFunc,
                    employeeType: appliedEmployeeType,
                    from: appliedStartDate,
                    to: appliedEndDate,
                };
                const clusterParam = buildIdsParam(src.cluster);
                const circleParam = buildIdsParam(src.circle);
                const functionParam = buildIdsParam(src.func);
                if (clusterParam) params.set('cluster_id', clusterParam);
                if (circleParam) params.set('circle_id', circleParam);
                if (functionParam) params.set('function_id', functionParam);
                if (src.employeeType) params.set('type', src.employeeType);
                params.set('from_date', formatDate(src.from));
                params.set('to_date', formatDate(src.to));
            }
            const url = `https://${host}/msafe_dashboard/medical_checkup_and_first_aid.json?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const clusters = json?.clusters ?? [];
            let rows: MedicalFAItem[] = [];
            if (Array.isArray(clusters)) {
                rows = clusters
                    .map((x: any) => {
                        const site = x?.cluster_name || x?.site || x?.center_name || '';
                        if (!site) return null;
                        return {
                            site,
                            medical: Number(
                                x?.medical_checkup ??
                                x?.medical ??
                                x?.medical_checkup_count ??
                                0
                            ),
                            firstAid: Number(
                                x?.first_aid_training ??
                                x?.firstAid ??
                                x?.first_aid_approved ??
                                0
                            ),
                        } as MedicalFAItem;
                    })
                    .filter(Boolean) as MedicalFAItem[];
            } else if (clusters && typeof clusters === 'object') {
                rows = Object.entries(clusters as Record<string, any>)
                    .map(([siteKey, v]) => {
                        const site = String(siteKey || '').trim();
                        if (!site) return null;
                        return {
                            site,
                            medical: Number(
                                (v as any)?.medical_checkup ??
                                (v as any)?.medical ??
                                (v as any)?.medical_checkup_count ??
                                0
                            ),
                            firstAid: Number(
                                (v as any)?.first_aid_training ??
                                (v as any)?.firstAid ??
                                (v as any)?.first_aid_approved ??
                                0
                            ),
                        } as MedicalFAItem;
                    })
                    .filter(Boolean) as MedicalFAItem[];
            }
            setMedicalFirstAidData(rows);
        } catch (err) {
            console.error('Failed to fetch Medical/First Aid:', err);
            setMedicalFirstAidData([]);
        } finally {
            setMedicalFirstAidLoading(false);
        }
    };

    // Medical Checkup & First Aid Training (from API)
    type MedicalFAItem = { site: string; medical: number; firstAid: number };
    const [medicalFirstAidData, setMedicalFirstAidData] = useState<MedicalFAItem[]>([]);
    const [medicalFirstAidLoading, setMedicalFirstAidLoading] = useState(false);
    const medicalFirstAidRef = useRef<HTMLDivElement | null>(null);
    // Medical Y-axis: start at 0 and use "nice" integer ticks (with ~10% headroom)
    const medicalYAxis = useMemo(() => {
        const max = medicalFirstAidData.reduce((m, d: any) => {
            const a = Number(d?.medical || 0);
            const b = Number(d?.firstAid || 0);
            return Math.max(m, a, b);
        }, 0);
        let upper = Math.max(0, Math.ceil(max * 1.1));
        if (upper <= 10) {
            const ticks = Array.from({ length: upper + 1 }, (_, i) => i);
            return { upper, ticks };
        }
        const niceStep = (range: number, maxTicks = 10) => {
            const rough = range / maxTicks;
            const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))))
            const r = rough / pow10;
            let stepBase = 1;
            if (r <= 1) stepBase = 1; else if (r <= 2) stepBase = 2; else if (r <= 5) stepBase = 5; else stepBase = 10;
            return stepBase * pow10;
        };
        const step = Math.max(1, Math.round(niceStep(upper, 9)));
        upper = Math.ceil(upper / step) * step;
        const count = Math.floor(upper / step) + 1;
        const ticks = Array.from({ length: count }, (_, i) => i * step);
        if (ticks[0] !== 0) ticks.unshift(0);
        return { upper, ticks };
    }, [medicalFirstAidData]);
    const downloadMedicalFirstAid = async () => {
        if (!medicalFirstAidRef.current) return;
        const canvas = await html2canvas(medicalFirstAidRef.current);
        const link = document.createElement('a');
        link.download = 'medical-checkup-first-aid.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const todayLabell = 'Tuesday';
    const todayDate = '2nd April, 2024';
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = userData.firstname || '';
    const lastName = userData.lastname || '';



    // Global loading indicator removed — only show per-section spinners

    // Drag & drop: move section when drag ends
    const handleDragEnd = (event: any) => {
        const { active, over } = event || {};
        if (!active || !over) return;
        if (active.id === over.id) return;
        setSectionOrder((items) => {
            const oldIndex = items.indexOf(active.id as any);
            const newIndex = items.indexOf(over.id as any);
            if (oldIndex === -1 || newIndex === -1) return items;
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    // Section components (reuse existing JSX)
    const SectionOnboardingStatus = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Onboarding Status
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadChart}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadOnboardingData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.krcc }} />
                    <Typography variant="body2">KRCC</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.approval }} />
                    <Typography variant="body2">Approved</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.hsw }} />
                    <Typography variant="body2">HSW Induction</Typography>
                </Stack>
            </Stack>

            <Box ref={chartRef} sx={{ width: '100%', height: 420, overflowX: 'auto' }}>
                {onboardingLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <Box sx={{ width: onboardingChartWidth, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={onboardingData} margin={{ top: 28, right: 24, left: 16, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="site"
                                    tickLine={false}
                                    axisLine={{ stroke: COLORS.grid }}
                                    interval={0}
                                    angle={0}
                                    tickMargin={12}
                                    dy={12}
                                    padding={{ left: 28, right: 28 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={{ stroke: COLORS.grid }}
                                    allowDecimals={false}
                                    domain={[0, onboardingYAxis.upper]}
                                    ticks={onboardingYAxis.ticks}
                                />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                                <Bar dataKey="KRCC" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="KRCC" content={makeCountLabelGuarded(18, 8)} />
                                </Bar>
                                <Bar dataKey="Approval" fill={COLORS.approval} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="Approval" content={makeCountLabelGuarded(18, 8)} />
                                </Bar>
                                <Bar dataKey="HSW" fill={COLORS.hsw} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="HSW" content={makeCountLabelGuarded(18, 8)} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        </Paper>
    );

    const SectionOnboardingSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                Onboarding Summary
            </Typography>
            <TableContainer component={Box} sx={{ overflowX: 'auto', borderRadius: 1 }}>
                <Table size="small" sx={{ minWidth: 1000 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700, position: 'sticky', left: 0, zIndex: 1 }} />
                            {onboardingData.map((d) => (
                                <TableCell key={d.site} align="center" sx={{ bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700 }}>
                                    {d.site}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            { label: 'Approval', key: 'Approval' as const },
                            { label: 'KRCC', key: 'KRCC' as const },
                            { label: 'HSW Induction', key: 'HSW' as const },
                        ].map((row) => (
                            <TableRow key={row.key}>
                                <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: '#fff', zIndex: 1 }}>
                                    {row.label}
                                </TableCell>
                                {onboardingData.map((d) => {
                                    const val = (d as any)[row.key];
                                    return (
                                        <TableCell key={`${row.key}-${d.site}`} align="center">
                                            {typeof val === 'number' ? val : '-'}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {onboardingLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <LoadingInline size={22} />
                </Box>
            )}
            {!onboardingLoading && onboardingData.length === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>No data. Choose filters and click Apply.</Typography>
            )}
        </Paper>
    );

    const SectionDay1HSW = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Day 1 HSW Induction
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadDay1Chart}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadDay1HSWData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.krcc }} />
                    <Typography variant="body2">Complaint</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.approval }} />
                    <Typography variant="body2">Non Complaint</Typography>
                </Stack>
            </Stack>
            <Box ref={day1ChartRef} sx={{ width: '100%', height: 420 }}>
                {day1HSWLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={day1HSWData} margin={{ top: 28, right: 12, left: 10, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="site"
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                interval={0}
                                angle={0}
                                dy={12}
                                tick={{ fontSize: 12 }}
                                tickMargin={12}
                                minTickGap={28}
                                padding={{ left: 28, right: 28 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                allowDecimals={false}
                                domain={[0, day1HSWYAxis.upper]}
                                ticks={day1HSWYAxis.ticks}
                            />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                            <Bar dataKey="Complaint" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="Complaint" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                            <Bar dataKey="NonComplaint" fill={COLORS.approval} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="NonComplaint" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Paper>
    );

    const SectionTraining = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Training compliance
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadTrainingChart}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadTrainingData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.twoW }} />
                    <Typography variant="body2">2W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.fourW }} />
                    <Typography variant="body2">4W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.workAtHeight }} />
                    <Typography variant="body2">Work at height</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.electrical }} />
                    <Typography variant="body2">Electrical</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.ofc }} />
                    <Typography variant="body2">OFC</Typography>
                </Stack>
            </Stack>
            <Box ref={trainingChartRef} sx={{ width: '100%', height: 520, overflowX: 'auto' }}>
                {trainingLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <Box sx={{ width: trainingChartWidth, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trainingData} margin={{ top: 44, right: 24, left: 24, bottom: 40 }} barCategoryGap="45%" barGap={12}>
                                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="site"
                                    tickLine={false}
                                    axisLine={{ stroke: COLORS.grid }}
                                    interval={0}
                                    minTickGap={28}
                                    tickMargin={10}
                                    angle={0}
                                    dy={12}
                                    padding={{ left: 28, right: 28 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={{ stroke: COLORS.grid }}
                                    allowDecimals={false}
                                    domain={[0, trainingYAxis.upper]}
                                    ticks={trainingYAxis.ticks}
                                />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(value: any) => [String(value), '']} />
                                <Bar dataKey="twoW" name="2W" fill={TRAINING_COLORS.twoW} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="twoW" content={makeCountLabelGuarded(18, 10)} />
                                </Bar>
                                <Bar dataKey="fourW" name="4W" fill={TRAINING_COLORS.fourW} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="fourW" content={makeCountLabelGuarded(18, 10)} />
                                </Bar>
                                <Bar dataKey="workAtHeight" name="Work at height" fill={TRAINING_COLORS.workAtHeight} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="workAtHeight" content={makeCountLabelGuarded(18, 10)} />
                                </Bar>
                                <Bar dataKey="electrical" name="Electrical" fill={TRAINING_COLORS.electrical} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="electrical" content={makeCountLabelGuarded(18, 10)} />
                                </Bar>
                                <Bar dataKey="ofc" name="OFC" fill={TRAINING_COLORS.ofc} barSize={20} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="ofc" content={makeCountLabelGuarded(18, 10)} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        </Paper>
    );

    const SectionTrainingSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                Training compliance Summary
            </Typography>
            <TableContainer component={Box} sx={{ overflowX: 'auto', borderRadius: 1 }}>
                <Table size="small" sx={{ minWidth: 1200 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700, position: 'sticky', left: 0, zIndex: 1 }} />
                            {trainingData.map((d) => (
                                <TableCell key={`th-${d.site}`} align="center" sx={{ bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700 }}>
                                    {d.site}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            { label: '2W', key: 'twoW' as const },
                            { label: '4W', key: 'fourW' as const },
                            { label: 'Work at height', key: 'workAtHeight' as const },
                            { label: 'Electrical', key: 'electrical' as const },
                            { label: 'OFC', key: 'ofc' as const },
                        ].map((row) => (
                            <TableRow key={row.key}>
                                <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: '#fff', zIndex: 1 }}>
                                    {row.label}
                                </TableCell>
                                {trainingData.map((d) => {
                                    const raw = (d as any)[row.key];
                                    const display = formatPercentCell(raw);
                                    return (
                                        <TableCell key={`${row.key}-${d.site}`} align="center">
                                            {display}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    const SectionFTPR = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Training- First Time Pass Rate
                </Typography>
                <IconButton aria-label="download" onClick={downloadFtprChart}>
                    <DownloadIcon />
                </IconButton>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.twoW }} />
                    <Typography variant="body2">2W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.fourW }} />
                    <Typography variant="body2">4W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.workAtHeight }} />
                    <Typography variant="body2">Work at height</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.electrical }} />
                    <Typography variant="body2">Electrical</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: TRAINING_COLORS.ofc }} />
                    <Typography variant="body2">OFC</Typography>
                </Stack>
            </Stack>
            <Box ref={ftprChartRef} sx={{ width: '100%', height: 460, overflowX: 'auto' }}>
                {ftprLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <Box sx={{ width: ftprChartWidth, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ftprData} margin={{ top: 24, right: 24, left: 24, bottom: 36 }} barCategoryGap="70%" barGap={16}>
                                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="site"
                                    tickLine={false}
                                    axisLine={{ stroke: COLORS.grid }}
                                    interval={0}
                                    minTickGap={28}
                                    tickMargin={10}
                                    dy={12}
                                    padding={{ left: 28, right: 28 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tickLine={false} axisLine={{ stroke: COLORS.grid }} domain={[0, 100]} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(value: any) => [`${Number(value).toFixed(0)}%`, '']} />
                                <Bar dataKey="twoW" name="2W" fill={TRAINING_COLORS.twoW} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="twoW" content={makeCenteredLabel((n) => (n < 4 ? null : `${n.toFixed(0)}%`), 12)} />
                                </Bar>
                                <Bar dataKey="fourW" name="4W" fill={TRAINING_COLORS.fourW} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="fourW" content={makeCenteredLabel((n) => (n < 4 ? null : `${n.toFixed(0)}%`), 10)} />
                                </Bar>
                                <Bar dataKey="workAtHeight" name="Work at height" fill={TRAINING_COLORS.workAtHeight} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="workAtHeight" content={makeCenteredLabel((n) => (n < 4 ? null : `${n.toFixed(0)}%`), 8)} />
                                </Bar>
                                <Bar dataKey="electrical" name="Electrical" fill={TRAINING_COLORS.electrical} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="electrical" content={makeCenteredLabel((n) => (n < 4 ? null : `${n.toFixed(0)}%`), 10)} />
                                </Bar>
                                <Bar dataKey="ofc" name="OFC" fill={TRAINING_COLORS.ofc} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="ofc" content={makeCenteredLabel((n) => (n < 4 ? null : `${n.toFixed(0)}%`), 12)} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        </Paper>
    );

    const SectionNewJoineeTrend = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    New Joinee Trend
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadNewJoineeChart}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadNewJoineeData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Box ref={newJoineeChartRef} sx={{ width: '100%', height: 420, overflowX: 'auto' }}>
                {newJoineeLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    (() => {
                        const newJoineeChartWidth = Math.max(1400, Math.max(1, newJoineeData.length) * 110);
                        return (
                            <Box sx={{ width: newJoineeChartWidth, height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={newJoineeData} margin={{ top: 28, right: 24, left: 16, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                                        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="site"
                                            tickLine={false}
                                            axisLine={{ stroke: COLORS.grid }}
                                            interval={0}
                                            minTickGap={28}
                                            angle={0}
                                            dy={12}
                                            tickMargin={12}
                                            padding={{ left: 28, right: 28 }}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={{ stroke: COLORS.grid }}
                                            allowDecimals={false}
                                            domain={[0, newJoineeYAxis.upper]}
                                            ticks={newJoineeYAxis.ticks}
                                        />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                                        <Bar dataKey="count" name="New Joinees" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                                            <LabelList dataKey="count" content={makeCountLabelGuarded(18, 8)} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        );
                    })()
                )}
            </Box>
            {!newJoineeLoading && newJoineeData.length === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>No data. Choose filters and click Apply.</Typography>
            )}
        </Paper>
    );

    const SectionNewJoineeSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                New Joinee Summary
            </Typography>
            <TableContainer component={Box} sx={{ position: 'relative', overflowX: 'auto', overflowY: 'auto', borderRadius: 1, maxHeight: 380 }}>
                <Table size="small" stickyHeader sx={{ minWidth: Math.max(600, 160 + njSummaryMonths.length * 120) }}>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700, fontSize: '0.975rem' } }}>
                            <TableCell sx={{ width: 160, position: 'sticky', left: 0, top: 0, bgcolor: '#EE0B0B', zIndex: 6, borderTopLeftRadius: 8, fontWeight: 700 }}>
                                Site
                            </TableCell>
                            {njSummaryMonths.length === 0 ? (
                                <TableCell align="center">-</TableCell>
                            ) : (
                                njSummaryMonths.map((m, idx) => (
                                    <TableCell
                                        key={`head-${m}`}
                                        align="center"
                                        sx={{ ...(idx === njSummaryMonths.length - 1 ? { borderTopRightRadius: 8 } : {}) }}
                                    >
                                        {m}
                                    </TableCell>
                                ))
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(() => {
                            const sites = njSummarySites;
                            if (njSummaryLoading) {
                                return (
                                    <TableRow>
                                        <TableCell colSpan={Math.max(2, 1 + njSummaryMonths.length)} align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                                                <LoadingInline size={22} />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            if (!sites.length) {
                                return (
                                    <TableRow>
                                        <TableCell colSpan={Math.max(2, 1 + njSummaryMonths.length)} align="center">No data</TableCell>
                                    </TableRow>
                                );
                            }
                            return sites.map((site) => (
                                <TableRow key={`nj-sum-${site}`} hover>
                                    <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: '#fff', zIndex: 1 }}>{site}</TableCell>
                                    {njSummaryMonths.map((m) => {
                                        const v = (njSummaryMatrix[site] && njSummaryMatrix[site][m]);
                                        const n = Number.isFinite(Number(v)) ? Number(v) : undefined;
                                        return (
                                            <TableCell key={`cell-${site}-${m}`} align="center">{n ?? '-'}</TableCell>
                                        );
                                    })}
                                </TableRow>
                            ));
                        })()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    const SectionLMC = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>LMC</Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadLmc}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadLMCData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.krcc }} />
                    <Typography variant="body2">LMC Completed</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.approval }} />
                    <Typography variant="body2">LMC Due</Typography>
                </Stack>
            </Stack>
            <Box ref={lmcChartRef} sx={{ width: '100%', height: 420 }}>
                {lmcLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lmcData} margin={{ top: 28, right: 12, left: 10, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="site"
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                interval={0}
                                angle={0}
                                dy={12}
                                tick={{ fontSize: 10 }}
                                tickMargin={12}
                                minTickGap={28}
                                padding={{ left: 28, right: 28 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                allowDecimals={false}
                                domain={[0, lmcYAxis.upper]}
                                ticks={lmcYAxis.ticks}
                            />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                            <Bar dataKey="completed" name="LMC Completed" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="completed" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                            <Bar dataKey="due" name="LMC Due" fill={COLORS.approval} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="due" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Paper>
    );

    const SectionSMT = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>SMT</Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadSmt}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadSMTData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.krcc }} />
                    <Typography variant="body2">SMT Completed</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.approval }} />
                    <Typography variant="body2">SMT Due</Typography>
                </Stack>
            </Stack>
            <Box ref={smtChartRef} sx={{ width: '100%', height: 420 }}>
                {smtLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={smtData} margin={{ top: 28, right: 12, left: 10, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="site"
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                interval={0}
                                angle={0}
                                dy={12}
                                tick={{ fontSize: 10 }}
                                tickMargin={12}
                                minTickGap={28}
                                padding={{ left: 28, right: 28 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={{ stroke: COLORS.grid }}
                                allowDecimals={false}
                                domain={[0, smtYAxis.upper]}
                                ticks={smtYAxis.ticks}
                            />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                            <Bar dataKey="completed" name="SMT Completed" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="completed" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                            <Bar dataKey="due" name="SMT Due" fill={COLORS.approval} barSize={20} radius={[3, 3, 0, 0]}>
                                <LabelList dataKey="due" content={makeCountLabelGuarded(18, 8)} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Paper>
    );

    const SectionComplianceForecast = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Compliance Forcasting
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadComplianceForecast}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadComplianceForecastData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.twoW }} />
                    <Typography variant="body2">2W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.fourW }} />
                    <Typography variant="body2">4W</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.workAtHeight }} />
                    <Typography variant="body2">Work at height</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.electrical }} />
                    <Typography variant="body2">Electrical</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.ofc }} />
                    <Typography variant="body2">OFC</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: CF_COLORS.firstAid }} />
                    <Typography variant="body2">First Aid Training</Typography>
                </Stack>
            </Stack>
            <Box sx={{ width: '100%', height: 500, overflowX: 'auto' }} ref={complianceForecastRef}>
                {complianceForecastLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    <Box sx={{ width: complianceForecastWidth, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={complianceForecastData} margin={{ top: 28, right: 24, left: 24, bottom: 36 }} barCategoryGap="70%" barGap={16}>
                                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                <XAxis dataKey="site" tickLine={false} axisLine={{ stroke: COLORS.grid }} interval={0} minTickGap={28} tickMargin={10} dy={12} padding={{ left: 28, right: 28 }} tick={{ fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={{ stroke: COLORS.grid }} allowDecimals={false} domain={[0, complianceForecastYAxis.upper]} ticks={complianceForecastYAxis.ticks} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(value: any) => [`${value}`, '']} />
                                <Bar dataKey="twoW" name="2W" fill={CF_COLORS.twoW} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="twoW" position="top" formatter={(v: any) => (v ? v : 0)} />
                                </Bar>
                                <Bar dataKey="fourW" name="4W" fill={CF_COLORS.fourW} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="fourW" position="top" formatter={(v: any) => (v ? v : 0)} />
                                </Bar>
                                <Bar dataKey="workAtHeight" name="Work at height" fill={CF_COLORS.workAtHeight} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="workAtHeight" position="top" formatter={(v: any) => (v ? (typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v) : 0)} />
                                </Bar>
                                <Bar dataKey="electrical" name="Electrical" fill={CF_COLORS.electrical} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="electrical" position="top" formatter={(v: any) => (v ? (Number.isInteger(v) ? v : v.toFixed(2)) : 0)} />
                                </Bar>
                                <Bar dataKey="ofc" name="OFC" fill={CF_COLORS.ofc} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="ofc" position="top" formatter={(v: any) => (v ? v : 0)} />
                                </Bar>
                                <Bar dataKey="firstAid" name="First Aid Training" fill={CF_COLORS.firstAid} barSize={16} radius={[3, 3, 0, 0]}>
                                    <LabelList dataKey="firstAid" position="top" formatter={(v: any) => (v ? (Number.isInteger(v) ? v : v.toFixed(2)) : 0)} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        </Paper>
    );

    const SectionComplianceForecastSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                Compliance Forecasting Summary
            </Typography>
            <TableContainer component={Box} sx={{ overflowX: 'auto', borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700 } }}>
                            <TableCell />
                            {['APT', 'BJO', 'COR', 'DEL', 'GUJ', 'KAR', 'KER', 'MAH', 'MPC', 'MUM', 'PUH', 'RAJ', 'TNC', 'TUP', 'VISSL', 'WBKA'].map((s) => (
                                <TableCell key={`cfh-${s}`} align="center">{s}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {([
                            { label: '2W', key: 'twoW' as const },
                            { label: '4W', key: 'fourW' as const },
                            { label: 'Work at height', key: 'workAtHeight' as const },
                            { label: 'Electrical', key: 'electrical' as const },
                            { label: 'OFC', key: 'ofc' as const },
                            { label: 'First Aid Training', key: 'firstAid' as const },
                        ] as const).map((r) => (
                            <TableRow key={`cfr-${r.key}`}>
                                <TableCell sx={{ fontWeight: 600 }}>{r.label}</TableCell>
                                {['APT', 'BJO', 'COR', 'DEL', 'GUJ', 'KAR', 'KER', 'MAH', 'MPC', 'MUM', 'PUH', 'RAJ', 'TNC', 'TUP', 'VISSL', 'WBKA'].map((s) => {
                                    const d = complianceForecastData.find((x) => x.site === s) as any;
                                    const v = d ? d[r.key] : undefined;
                                    let disp: any = '-';
                                    if (typeof v === 'number') disp = v === 0 ? '0' : (Number.isInteger(v) ? `${v}` : v.toFixed(2));
                                    return <TableCell key={`cf-${r.key}-${s}`} align="center">{disp}</TableCell>;
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    const SectionDriving = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Driving
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadDrivingChart}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadDrivingData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: DRIVING_COLORS.license }} />
                    <Typography variant="body2">Driving License</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: DRIVING_COLORS.insurance }} />
                    <Typography variant="body2">Insurance</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: DRIVING_COLORS.puc }} />
                    <Typography variant="body2">PUC</Typography>
                </Stack>
            </Stack>
            <Box ref={drivingChartRef} sx={{ width: '100%', height: 460, overflowX: 'auto' }}>
                {drivingLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <LoadingInline />
                    </Box>
                ) : (
                    (() => {
                        const drivingChartWidth = Math.max(1400, Math.max(1, drivingData.length) * 110);
                        return (
                            <Box sx={{ width: drivingChartWidth, height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={drivingData} margin={{ top: 28, right: 16, left: 10, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                                        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="site"
                                            tickLine={false}
                                            axisLine={{ stroke: COLORS.grid }}
                                            interval={0}
                                            angle={0}
                                            dy={12}
                                            tick={{ fontSize: 12 }}
                                            tickMargin={12}
                                            minTickGap={28}
                                            padding={{ left: 28, right: 28 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={{ stroke: COLORS.grid }}
                                            allowDecimals={false}
                                            domain={[0, drivingYAxis.upper]}
                                            ticks={drivingYAxis.ticks}
                                        />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                                        <Bar dataKey="license" name="Driving License" fill={DRIVING_COLORS.license} barSize={20} radius={[3, 3, 0, 0]}>
                                            <LabelList dataKey="license" content={makeCountLabelGuarded(18, 8)} />
                                        </Bar>
                                        <Bar dataKey="insurance" name="Insurance" fill={DRIVING_COLORS.insurance} barSize={20} radius={[3, 3, 0, 0]}>
                                            <LabelList dataKey="insurance" content={makeCountLabelGuarded(18, 8)} />
                                        </Bar>
                                        <Bar dataKey="puc" name="PUC" fill={DRIVING_COLORS.puc} barSize={20} radius={[3, 3, 0, 0]}>
                                            <LabelList dataKey="puc" content={makeCountLabelGuarded(18, 8)} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        );
                    })()
                )}
            </Box>
            {!drivingLoading && drivingData.length === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>No data. Choose filters and click Apply.</Typography>
            )}
        </Paper>
    );

    const SectionDrivingSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                Driving Summary
            </Typography>
            <TableContainer component={Box} sx={{ overflowX: 'auto', borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700 } }}>
                            <TableCell />
                            {drivingData.map((s) => (
                                <TableCell key={`drv-h-${s.site}`} align="center">{s.site}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {([
                            { label: 'Driving License', key: 'license' as const },
                            { label: 'Insurance', key: 'insurance' as const },
                            { label: 'PUC', key: 'puc' as const },
                        ] as const).map((r) => (
                            <TableRow key={`drv-r-${r.key}`}>
                                <TableCell sx={{ fontWeight: 600 }}>{r.label}</TableCell>
                                {drivingData.map((d) => (
                                    <TableCell key={`drv-${r.key}-${d.site}`} align="center">{`${(d as any)[r.key] ?? '-'}`}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    const SectionMedical = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750' }}>
                    Medical Checkup & First Aid Training
                </Typography>
                <Stack direction="row" spacing={1}>
                    {/* <IconButton aria-label="download chart" onClick={downloadMedicalFirstAid}>
                        <DownloadIcon />
                    </IconButton> */}
                    <IconButton aria-label="download data" onClick={downloadMedicalData}>
                        <DownloadIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ mb: 1, width: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.krcc }} />
                    <Typography variant="body2">Medical Checkup</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: COLORS.approval }} />
                    <Typography variant="body2">First Aid Training</Typography>
                </Stack>
            </Stack>
            <Box ref={medicalFirstAidRef} sx={{ width: '100%', height: 520 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={medicalFirstAidData} margin={{ top: 28, right: 12, left: 10, bottom: 80 }} barCategoryGap="55%" barGap={12}>
                        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="site"
                            tickLine={false}
                            axisLine={{ stroke: COLORS.grid }}
                            interval={0}
                            angle={0}
                            dy={12}
                            tick={{ fontSize: 12 }}
                            tickMargin={12}
                            minTickGap={28}
                            padding={{ left: 28, right: 28 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ stroke: COLORS.grid }}
                            allowDecimals={false}
                            domain={[0, medicalYAxis.upper]}
                            ticks={medicalYAxis.ticks}
                        />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                        <Bar dataKey="medical" name="Medical Checkup" fill={COLORS.krcc} barSize={20} radius={[3, 3, 0, 0]}>
                            <LabelList dataKey="medical" content={makeCountLabelGuarded(18, 8)} />
                        </Bar>
                        <Bar dataKey="firstAid" name="First Aid Training" fill={COLORS.approval} barSize={20} radius={[3, 3, 0, 0]}>
                            <LabelList dataKey="firstAid" content={makeCountLabelGuarded(18, 8)} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            {medicalFirstAidLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <LoadingInline size={22} />
                </Box>
            )}
            {!medicalFirstAidLoading && medicalFirstAidData.length === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>No data. Choose filters and click Apply.</Typography>
            )}
        </Paper>
    );

    const SectionMedicalSummary = () => (
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#5e2750', mb: 2 }}>
                Medical Checkup & First Aid Training Summary
            </Typography>
            <TableContainer component={Box} sx={{ overflowX: 'auto', borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: '#EE0B0B', color: '#fff', fontWeight: 700 } }}>
                            <TableCell />
                            {medicalFirstAidData.map((s) => (
                                <TableCell key={`mf-h-${s.site}`} align="center">{s.site}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {([
                            { label: 'Medical Checkup', key: 'medical' as const },
                            { label: 'First Aid Training', key: 'firstAid' as const },
                        ] as const).map((r) => (
                            <TableRow key={`mf-r-${r.key}`}>
                                <TableCell sx={{ fontWeight: 600 }}>{r.label}</TableCell>
                                {medicalFirstAidData.map((d) => (
                                    <TableCell key={`mf-${r.key}-${d.site}`} align="center">{`${(d as any)[r.key] ?? '-'}`}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {medicalFirstAidLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <LoadingInline size={22} />
                </Box>
            )}
            {!medicalFirstAidLoading && medicalFirstAidData.length === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>No data. Choose filters and click Apply.</Typography>
            )}
        </Paper>
    );

    // Memoize heavy section elements so dropdown state changes don't re-render charts/tables unnecessarily
    const sectionOnboardingStatusEl = useMemo(() => <SectionOnboardingStatus />, [onboardingLoading, onboardingData, onboardingChartWidth]);
    const sectionOnboardingSummaryEl = useMemo(() => <SectionOnboardingSummary />, [onboardingLoading, onboardingData]);
    const sectionDay1HSWEl = useMemo(() => <SectionDay1HSW />, [day1HSWLoading, day1HSWData]);
    const sectionTrainingEl = useMemo(() => <SectionTraining />, [trainingLoading, trainingData, trainingChartWidth]);
    const sectionTrainingSummaryEl = useMemo(() => <SectionTrainingSummary />, [trainingData]);
    const sectionFTPRel = useMemo(() => <SectionFTPR />, [ftprData, ftprChartWidth]);
    const sectionNewJoineeTrendEl = useMemo(() => <SectionNewJoineeTrend />, [newJoineeLoading, newJoineeData]);
    const sectionNewJoineeSummaryEl = useMemo(() => <SectionNewJoineeSummary />, [njSummaryLoading, njSummaryMonths, njSummarySites, njSummaryMatrix]);
    const sectionLMCEl = useMemo(() => <SectionLMC />, [lmcLoading, lmcData]);
    const sectionSMTEl = useMemo(() => <SectionSMT />, [smtLoading, smtData]);
    const sectionComplianceForecastEl = useMemo(() => <SectionComplianceForecast />, [complianceForecastData, complianceForecastWidth]);
    const sectionComplianceForecastSummaryEl = useMemo(() => <SectionComplianceForecastSummary />, [complianceForecastData]);
    const sectionDrivingEl = useMemo(() => <SectionDriving />, [drivingLoading, drivingData]);
    const sectionDrivingSummaryEl = useMemo(() => <SectionDrivingSummary />, [drivingData]);
    const sectionMedicalEl = useMemo(() => <SectionMedical />, [medicalFirstAidLoading, medicalFirstAidData]);
    const sectionMedicalSummaryEl = useMemo(() => <SectionMedicalSummary />, [medicalFirstAidData, medicalFirstAidLoading]);

    // Map keys to memoized elements for sortable rendering
    const renderSection = (key: SectionKey) => {
        switch (key) {
            case 'onboarding-status':
                return sectionOnboardingStatusEl;
            case 'onboarding-summary':
                return sectionOnboardingSummaryEl;
            case 'day1-hsw':
                return sectionDay1HSWEl;
            case 'training-compliance':
                return sectionTrainingEl;
            case 'training-summary':
                return sectionTrainingSummaryEl;
            case 'training-ftpr':
                return sectionFTPRel;
            case 'new-joinee-trend':
                return sectionNewJoineeTrendEl;
            case 'new-joinee-summary':
                return sectionNewJoineeSummaryEl;
            case 'lmc':
                return sectionLMCEl;
            case 'smt':
                return sectionSMTEl;
            case 'compliance-forecast':
                return sectionComplianceForecastEl;
            case 'compliance-forecast-summary':
                return sectionComplianceForecastSummaryEl;
            case 'driving':
                return sectionDrivingEl;
            case 'driving-summary':
                return sectionDrivingSummaryEl;
            case 'medical':
                return sectionMedicalEl;
            case 'medical-summary':
                return sectionMedicalSummaryEl;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ bgcolor: '#f6f9ff', minHeight: '100%', pt: '70px' }}>
            {/* Top Header */}
            {/* <Box
                sx={{
                    bgcolor: '#EE0B0B',
                    color: '#fff',
                    py: 1.25,
                    px: { xs: 2, md: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 70,
                }}
            >
                <Box className="d-flex align-items-center justify-content-between" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        component="a"
                        href="/"
                        className="logo d-flex align-items-center"
                        sx={{ width: 'auto', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                        <Box
                            component="img"
                            src="https://reports.lockated.com/vi-msafe/assets/img/Group%2034300.png"
                            alt="Logo"
                            sx={{ height: 40, width: 'auto' }}
                            onError={(e: any) => {
                                try { e.currentTarget.src = '/Vi Logo.svg'; } catch { }
                            }}
                        />
                    </Box>
                    <Typography component="p" sx={{ mb: 0, color: '#fff', ml: '20px', fontSize: '20px', fontWeight: 600, fontFamily: '"Open Sans", sans-serif' }}>
                        Vi my workspace Dashboard - Vi mSafe
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {todayLabel}
                    </Typography>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.3)' }}>

                    </Avatar>
                </Stack>
            </Box> */}

            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    width: '100%',
                    bgcolor: "#EE0B0B",
                    color: "#fff",
                    py: 1.25,
                    px: { xs: 2, md: 3 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 70,
                }}
            >
                {/* Left Section */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            width: "auto",
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                        }}
                    >
                        <Box
                            component="img"
                            src="https://reports.lockated.com/vi-msafe/assets/img/Group%2034300.png"
                            alt="Logo"
                            sx={{ height: 40, width: "auto" }}
                            onError={(e: any) => {
                                try {
                                    e.currentTarget.src = "/Vi Logo.svg";
                                } catch { }
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            mb: 0,
                            color: "#fff",
                            ml: 2.5,
                            fontSize: "20px",
                            fontWeight: 600,
                            fontFamily: '"Open Sans", sans-serif',
                        }}
                    >
                        Vi my workspace Dashboard - Vi mSafe
                    </Typography>
                </Box>

                {/* Right Section */}
                <Stack direction="row" alignItems="center" spacing={7}>
                    <Box sx={{ textAlign: "left" }}>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                        >
                            Welcome,
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "16px",
                            }}
                        >
                            {firstName} {lastName}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: "left" }}>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                        >
                            {weekdayLabel}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                opacity: 0.8,
                                fontWeight: 400,
                            }}
                        >
                            {dateLabel}
                        </Typography>
                    </Box>


                    {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            src="https://i.ibb.co/0cB3q3K/avatar.png"
                            alt="user"
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: "rgba(255,255,255,0.3)",
                                mr: 0.5,
                            }}
                        />
                        <ArrowDropDownIcon sx={{ color: "#fff" }} />
                    </Box> */}
                </Stack>
            </Box>

            {/* Show 'Set Custom Date' outside of the white filter Paper, aligned above the date fields */}
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, ml: `${dateLabelOffset}px` }}>
                Set Custom Date
            </Typography>

            <Box
                sx={{
                    p: { xs: 1.5, md: 3 },
                    pt: { xs: '15px', md: '15px' },
                }}
                ref={filtersAreaRef}
            >
                {/* Filters row - isolated to avoid parent re-renders on dropdown changes */}
                <FiltersPanel
                    clusterOptions={clusterOptions}
                    circleOptions={circleOptions}
                    functionOptions={functionOptions}
                    employeeTypes={employeeTypes}
                    initialFrom={appliedStartDate}
                    initialTo={appliedEndDate}
                    onApply={applyFilters}
                    reportDateBlockRect={handleDateBlockRect}
                />



                {/* Sortable sections */}
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={sectionOrder} strategy={rectSortingStrategy}>
                        {sectionOrder.map((key) => (
                            <SortableItem key={key} id={key}>
                                {renderSection(key)}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </Box>
        </Box>
    );
};

// Local child component that owns editable filter state so charts don't re-render while picking values
const FiltersPanel: React.FC<{
    clusterOptions: Option[];
    circleOptions: Option[];
    functionOptions: Option[];
    employeeTypes: Option[];
    initialFrom?: any;
    initialTo?: any;
    reportDateBlockRect?: (rect: DOMRect) => void;
    onApply: (snap: {
        cluster: string[];
        circle: string[];
        func: string[];
        employeeType: string;
        from: any;
        to: any;
    }) => void;
}> = React.memo(({ clusterOptions, circleOptions, functionOptions, employeeTypes, initialFrom, initialTo, onApply, reportDateBlockRect }) => {
    const [cluster, setCluster] = useState<string[]>([]);
    const [circle, setCircle] = useState<string[]>([]);
    const [func, setFunc] = useState<string[]>([]);
    const [employeeType, setEmployeeType] = useState('');
    const [startDate, setStartDate] = useState<any>(() => {
        if (initialFrom) return new Date(new Date(initialFrom).getFullYear(), new Date(initialFrom).getMonth(), new Date(initialFrom).getDate());
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });
    const [endDate, setEndDate] = useState<any>(() => {
        const base = initialTo ?? new Date();
        const b = new Date(base);
        return new Date(b.getFullYear(), b.getMonth(), b.getDate());
    });

    // Local helper to format date for <input type="date"> as YYYY-MM-DD in local time
    const toDateInputValue = (d: any) => {
        const date = new Date(d ?? new Date());
        if (Number.isNaN(date.getTime())) return '';
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Measure date block for aligning external heading
    const dateBlockRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!reportDateBlockRect) return;
        const send = () => {
            const r = dateBlockRef.current?.getBoundingClientRect();
            if (r) reportDateBlockRect(r);
        };
        // Initial measure and on resize
        send();
        window.addEventListener('resize', send);
        return () => window.removeEventListener('resize', send);
    }, [reportDateBlockRect]);

    return (
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
            <Stack
                direction="row"
                spacing={0}
                alignItems="flex-end"
                useFlexGap
                sx={{
                    flexWrap: 'nowrap',
                    gap: '12px',
                    width: '100%',
                }}
            >
                <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                    <TailwindMultiSelect
                        label="Cluster"
                        options={clusterOptions}
                        selected={cluster}
                        onChange={setCluster}
                        className="mt-[10px]"
                        placeholder="Select Cluster"
                        buttonClassName="w-full"
                    />
                </Box>

                <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                    <TailwindMultiSelect
                        label="Circle"
                        options={circleOptions}
                        selected={circle}
                        onChange={setCircle}
                        className="mt-[10px]"
                        placeholder="Select Circle"
                        buttonClassName="w-full"
                    />
                </Box>

                <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                    <TailwindMultiSelect
                        label="Function"
                        options={functionOptions}
                        selected={func}
                        onChange={setFunc}
                        className="mt-[10px]"
                        placeholder="Select Function"
                        buttonClassName="w-full"
                    />
                </Box>

                <Box sx={{ flex: '1 1 180px', minWidth: 180, maxWidth: 260 }}>
                    <TailwindSingleSelect
                        label="Employee Type"
                        options={employeeTypes}
                        value={employeeType}
                        onChange={(v) => setEmployeeType(v)}
                        className="mt-[10px]"
                        placeholder="Internal / External"
                        buttonClassName="w-full"
                    />
                </Box>

                {/* Vertical divider between Employee Type and Date block */}
                <Box
                    sx={{
                        width: '1px',
                        height: 40,
                        bgcolor: '#E5E7EB', // gray-200
                        mx: 1,
                        alignSelf: 'flex-end',
                        borderRadius: 0.5,
                        flexShrink: 0,
                    }}
                />

                {/* Date controls */}
                <Box sx={{ flex: '1 1 360px', minWidth: 280, maxWidth: 520, alignSelf: 'flex-end', mt: '10px' }} ref={dateBlockRef}>
                    <Stack direction="row" spacing={2} alignItems="flex-end">
                        <div style={{ flex: '1 1 160px' }}>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full h-10 rounded-[25px] border border-gray-300 bg-white px-3 py-0 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400"
                                value={toDateInputValue(startDate ?? new Date())}
                                onChange={(e) => {
                                    const next = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
                                    setStartDate(next);
                                    if (next && endDate && new Date(endDate).getTime() < next.getTime()) {
                                        setEndDate(next);
                                    }
                                }}
                            />
                        </div>
                        <div style={{ flex: '1 1 160px' }}>
                            <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full h-10 rounded-[25px] border border-gray-300 bg-white px-3 py-0 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400"
                                value={toDateInputValue(endDate ?? new Date())}
                                min={toDateInputValue(startDate ?? new Date())}
                                onChange={(e) => {
                                    const next = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
                                    if (next && startDate && next.getTime() < new Date(startDate).getTime()) {
                                        toast.error('End date cannot be before start date');
                                        setEndDate(startDate);
                                        return;
                                    }
                                    setEndDate(next);
                                }}
                            />
                        </div>
                    </Stack>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                        onApply({
                            cluster,
                            circle,
                            func,
                            employeeType,
                            from: startDate,
                            to: endDate,
                        })
                    }
                    sx={{ ml: 'auto', flexShrink: 0, whiteSpace: 'nowrap', mt: '10px', mb: '4px', backgroundColor: '#EE0B0B', fontSize: '0.85rem', fontWeight: 600, fontFamily: '"Open Sans", sans-serif', height: 40, px: 2.5, borderRadius: '25px' }}
                >
                    Apply
                </Button>
            </Stack>
        </Paper>
    );
});

export default MsafeDashboardVI;
