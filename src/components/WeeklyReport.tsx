import { set } from 'lodash';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";
import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import GoPhygital from "@/assets/pdf/Gophygital.svg";

// Clean final version
type StatCardProps = { value: number | string; label: string; percent?: string; subLabel?: string };
const StatCard: React.FC<StatCardProps> = ({ value, label, percent, subLabel }) => {
    const formatted = typeof value === 'number' ? value.toLocaleString() : value;
    return (
        <div className="bg-[#F6F4EE] rounded-sm p-8 sm:p-10 text-center print:p-6">
            <div className="text-[#C72030] font-extrabold leading-none text-4xl sm:text-5xl print:text-3xl">{formatted}</div>
            {percent && <div className="mt-2 text-black font-semibold text-base sm:text-lg print:text-sm">{percent}</div>}
            <div className="mt-2 text-black font-semibold text-base sm:text-lg print:text-sm">{label}</div>
            {subLabel && <div className="mt-1 text-black font-medium text-sm sm:text-base print:text-xs">{subLabel}</div>}
        </div>
    );
};

type TATPieCardProps = { title: string; achieved: number; breached: number; achievedPctOverride?: number; breachedPctOverride?: number };
const TATPieCard: React.FC<TATPieCardProps> = ({ title, achieved, breached, achievedPctOverride, breachedPctOverride }) => {
    const total = achieved + breached;
    const achPctCalc = total ? (achieved / total) * 100 : 0;
    const brcPctCalc = total ? (breached / total) * 100 : 0;
    const achPct = achievedPctOverride !== undefined ? achievedPctOverride : achPctCalc;
    const brcPct = breachedPctOverride !== undefined ? breachedPctOverride : brcPctCalc;
    const baseData = React.useMemo(
        () => [
        { name: 'Achieved', value: achieved, color: '#DBC2A9' },
        { name: 'Breached', value: breached, color: '#8B7355' }
        ],
        [achieved, breached]
    );
    // Detect print to enlarge only the circle, not the container height
    const [isPrinting, setIsPrinting] = React.useState(false);
    const [activeSlice, setActiveSlice] = React.useState<string | null>(null);
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const before = () => setIsPrinting(true);
        const after = () => setIsPrinting(false);
        window.addEventListener('beforeprint', before);
        window.addEventListener('afterprint', after);
        let mql: MediaQueryList | null = null;
        const onChange = (e: MediaQueryListEvent) => setIsPrinting(!!e.matches);
        try {
            mql = window.matchMedia('print');
            // @ts-ignore cross-browser
            if (mql.addEventListener) mql.addEventListener('change', onChange);
            else if (mql.addListener) mql.addListener(onChange);
        } catch { }
        return () => {
            window.removeEventListener('beforeprint', before);
            window.removeEventListener('afterprint', after);
            try {
                if (mql) {
                    // @ts-ignore cross-browser
                    if (mql.removeEventListener) mql.removeEventListener('change', onChange);
                    else if (mql.removeListener) mql.removeListener(onChange);
                }
            } catch { }
        };
    }, []);
    const RADIAN = Math.PI / 180;
    const outerRadiusValue = isPrinting ? 225 : 150;
    const innerRadiusValue = 0;
    const formatPercent = (p: number) => `${p.toFixed(2)}%`;
    const toggleSlice = React.useCallback((name: string) => {
        if (isPrinting) return;
        setActiveSlice(prev => (prev === name ? null : name));
    }, [isPrinting]);

    const pieData = React.useMemo(() => {
        if (!activeSlice) return baseData;
        const highlighted = baseData.find((item) => item.name === activeSlice);
        if (!highlighted) return baseData;
        const others = baseData.filter((item) => item.name !== activeSlice);
        return [...others, highlighted];
    }, [baseData, activeSlice]);

    const legendData = React.useMemo(
        () =>
            baseData.map((item) => ({
                ...item,
                pct: item.name === 'Achieved' ? achPct : brcPct,
            })),
        [baseData, achPct, brcPct]
    );

    const handlePieClick = (_: any, index: number) => {
        if (isPrinting) return;
        const segment = pieData[index];
        if (segment?.name) toggleSlice(segment.name);
    };

    const makeLegendHandlers = (name: string) => ({
        onClick: () => toggleSlice(name),
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSlice(name);
            }
        }
    });

    const renderInnerLabel = (labelProps: any) => {
        const { x, y, value, index } = labelProps;
        if (value == null || index == null) return null;
        const pct = total ? (Number(value) / total) * 100 : 0;
        return (
            <text
                x={x}
                y={y}
                fill="#FFFFFF"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isPrinting ? 10 : 12}
                fontWeight={500}
                letterSpacing="0.05em"
                fontFamily="'Inter','Segoe UI',sans-serif"
                pointerEvents="none"
            >
                {`${pct.toFixed(2)}%`}
            </text>
        );
    };

    return (
        <div className="w-full no-break tat-pie-card">
            <h3 className="text-black font-semibold text-base sm:text-lg mb-1 print:mb-1">{title}</h3>
            <div className="bg-[#F6F4EE] rounded-sm px-6 sm:px-8 py-4 sm:py-5 print:px-5 print:py-3">
                <div className="w-full h-[260px] sm:h-[320px] print:h-[320px] tat-pie-container" style={{ overflow: 'visible' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={isPrinting ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 12, right: 12, bottom: 12, left: 12 }}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={innerRadiusValue}
                                outerRadius={outerRadiusValue}
                                stroke="#FFFFFF"
                                paddingAngle={0}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ cx, cy, midAngle, percent, index }) => {
                                    const radius = outerRadiusValue + 24;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    const alignRight = x > cx;
                                    const item = pieData[index];
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="#374151"
                                            textAnchor={alignRight ? 'start' : 'end'}
                                            dominantBaseline="middle"
                                            fontSize={12}
                                            fontWeight={600}
                                        >
                                            {`${item.name} ${item.value.toLocaleString()} (${formatPercent(percent * 100)})`}
                                        </text>
                                    );
                                }}
                                onClick={handlePieClick}
                            >
                                {pieData.map((d, i) => (
                                    <Cell
                                        key={i}
                                        fill={d.color}
                                        stroke={!isPrinting && activeSlice === d.name ? '#4B351F' : '#FFFFFF'}
                                        strokeWidth={!isPrinting && activeSlice === d.name ? 4 : 2}
                                        style={{ cursor: isPrinting ? 'default' : 'pointer', outline: 'none' }}
                                    />
                                ))}
                                <LabelList position="inside" content={renderInnerLabel} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-2 print:mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base print:text-[12px]">
                    {legendData.map((legend) => {
                        const handlers = makeLegendHandlers(legend.name);
                        const isActive = !isPrinting && activeSlice === legend.name;
                        return (
                            <div
                                key={legend.name}
                                className={`legend-pill flex items-center gap-2 px-3 py-1 rounded-md transition ${
                                    isActive ? 'bg-white/70 font-semibold text-[#4B351F]' : 'text-black'
                                } ${isPrinting ? '' : 'cursor-pointer'}`}
                                role={isPrinting ? undefined : 'button'}
                                tabIndex={isPrinting ? -1 : 0}
                                {...(!isPrinting ? handlers : {})}
                            >
                                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: legend.color }} />
                                <span className="text-black font-medium">{legend.name}:</span>
                                <span className="text-black/80">
                                    {legend.value.toLocaleString()} ({legend.pct.toFixed(2)}%)
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

type WeeklyReportProps = { title?: string };
const WeeklyReport: React.FC<WeeklyReportProps> = ({ title = 'Weekly Report' }) => {
    const sectionBox = 'bg-white border border-gray-300 w-[95%] mx-auto p-5 mb-10 print:w-[95%] print:mx-auto print:p-2 print:mb-4 no-break';
    
    const location = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    
    // Get dates from URL params or use default (last 7 days)
    const startDate = params.get('start_date') || '';
    const endDate = params.get('end_date') || '';
    
    // Dynamic 7-day window label (start = today - 6 days, end = today)
    const weekRangeLabel = React.useMemo(() => {
        let end: Date;
        let start: Date;
        
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            end = new Date();
            start = new Date(end);
            start.setDate(end.getDate() - 6);
        }
        
        const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return `${fmt(start)} - ${fmt(end)}`;
    }, [startDate, endDate]);

    // Date range label for cover page (format: From: DD Mon YYYY to DD Mon YYYY) - full date range
    const dateRangeLabel = React.useMemo(() => {
        let end: Date;
        let start: Date;
        
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            end = new Date();
            start = new Date(end);
            start.setDate(end.getDate() - 6);
        }
        
        try {
            const fmt = (d: Date) => {
                const day = d.getDate();
                const month = d.toLocaleString('en-US', { month: 'short' });
                const year = d.getFullYear();
                return `${day} ${month} ${year}`;
            };
            return `From: ${fmt(start)} to ${fmt(end)}`;
        } catch {
            const dayStart = start.getDate();
            const monthStart = start.toLocaleString('en-US', { month: 'short' });
            const yearStart = start.getFullYear();
            const dayEnd = end.getDate();
            const monthEnd = end.toLocaleString('en-US', { month: 'short' });
            const yearEnd = end.getFullYear();
            return `From: ${dayStart} ${monthStart} ${yearStart} to ${dayEnd} ${monthEnd} ${yearEnd}`;
        }
    }, [startDate, endDate]);

    // Site label from localStorage - same as AllContent
    const siteLabel = React.useMemo(() => {
        if (typeof window === 'undefined') return '';
        return (
            localStorage.getItem('selectedSiteName') ||
            localStorage.getItem('selectedSite') ||
            localStorage.getItem('site_name') ||
            ''
        );
    }, []);

    const logoElement = React.useMemo(() => {
        if (typeof window === 'undefined') {
            return <DEFAULT_LOGO_CODE />;
        }

        const hostname = window.location.hostname.toLowerCase();

        if (hostname.includes('oig.gophygital.work')) {
            return <OIG_LOGO_CODE />;
        }

        if (hostname.includes('vi-web.gophygital.work')) {
            return <VI_LOGO_CODE />;
        }

        return <DEFAULT_LOGO_CODE />;
    }, []);

    // === State: Category Wise Ticket (Top-5) dynamic data ===
    type TopCategory = {
        category_id: number;
        category_name: string;
        current_week_count: number;
        percentage_of_total: number;      // % of total tickets this week
        percentage_change?: number;       // % increase/decrease from last week
        last_week_count?: number;
        trend?: string;                   // optional text 'increase'/'decrease'
        trend_icon?: string;              // e.g. 'up-arrow' | 'down-arrow'
    };
    const [topCategories, setTopCategories] = React.useState<TopCategory[]>([]);
    const [topCatLoading, setTopCatLoading] = React.useState(false);
    const [topCatError, setTopCatError] = React.useState<string | null>(null);

    // === State: Weekly Complaints Summary (Help Desk Management) ===
    interface WeeklySummary {
        total: number;
        total_percentage?: number; // backend supplied percentage (likely 100)
        open: number;
        open_percentage?: number;  // backend supplied percentage (can be 0)
        closed: number;
        closed_percentage?: number; // backend supplied percentage (can be 0)
        reactive: number;
        preventive: number;
    }
    const [weeklySummary, setWeeklySummary] = React.useState<WeeklySummary | null>(null);
    const [weeklySummaryLoading, setWeeklySummaryLoading] = React.useState(false);
    const [weeklySummaryError, setWeeklySummaryError] = React.useState<string | null>(null);

    // === State: Priority Wise Open Tickets (Section 2) ===
    interface PriorityWise {
        high: number;   // P1
        medium: number; // P2 + P3
        low: number;    // P4 + P5
        total: number;  // total_complaints (or sum of above)
        open: number;   // open_count
        raw?: any;      // raw parsed for debugging
    }
    const [priorityWise, setPriorityWise] = React.useState<PriorityWise | null>(null);
    const [priorityLoading, setPriorityLoading] = React.useState(false);
    const [priorityError, setPriorityError] = React.useState<string | null>(null);

    // Flexible parser to adapt to slightly different backend shapes
    const parseTopCategories = React.useCallback((parsed: any): TopCategory[] => {
        // Potential locations (added category_data nesting based on actual response)
        const candidates: any[] = [
            parsed?.category_data?.category_analysis?.top_categories,
            parsed?.category_data?.category_analysis,
            parsed?.category_data?.top_categories,
            parsed?.category_data,
            parsed?.category_analysis?.top_categories,
            parsed?.category_analysis, // maybe array already
            parsed?.top_categories,
            parsed?.data,
            parsed?.result,
            parsed?.items
        ].filter(Boolean);
        let arr: any = candidates.find(c => Array.isArray(c));
        if (!arr) return [];
        return (arr as any[]).map((r, idx) => {
            const currentCount = r.current_week_count ?? r.current_week ?? r.count ?? r.total ?? 0;
            const lastWeek = r.last_week_count ?? r.previous_week_count ?? r.prev_week ?? 0;
            const pctOfTotal = r.percentage_of_total ?? r.percent_of_total ?? r.pct_of_total ?? r.category_percentage ?? r.percentage ?? 0;
            let pctChange = r.percentage_change ?? r.week_change_pct ?? r.change_percentage ?? r.wow_change;
            if (pctChange === undefined) {
                if (lastWeek > 0) {
                    pctChange = ((currentCount - lastWeek) / lastWeek) * 100;
                } else {
                    pctChange = 0; // avoid divide by zero; backend didn't supply change
                }
            }
            const numPctChange = Number(pctChange) || 0;
            return {
                category_id: Number(r.category_id ?? r.id ?? idx),
                category_name: r.category_name || r.name || r.category || `Category ${idx + 1}`,
                current_week_count: Number(currentCount) || 0,
                percentage_of_total: Number(pctOfTotal) || 0,
                percentage_change: numPctChange,
                last_week_count: Number(lastWeek) || undefined,
                trend: r.trend || (numPctChange > 0 ? 'up' : numPctChange < 0 ? 'down' : ''),
                trend_icon: r.trend_icon || ''
            } as TopCategory;
        });
    }, []);

    // Fetch Top-5 Category Wise Tickets from API and log it (runs when creds/siteId available)
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport] token missing in localStorage');
            return;
        }
        // Build URL; omit site_id if empty to let backend default (if supported)
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/category_wise_tickets_top5${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Top-5 Category Wise Tickets:', { url, siteId });
        setTopCatLoading(true);
        setTopCatError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async (res) => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport] API error', status, parsed);
                setTopCatError(`API ${status}`);
                setTopCategories([]);
                return;
            }
            console.log('[WeeklyReport][category_wise_tickets_top5] raw parsed:', parsed);
            const list = parseTopCategories(parsed).slice(0, 5);
            if (!list.length) {
                console.warn('[WeeklyReport] No top category data extracted. Keys:', Object.keys(parsed || {}));
            }
            setTopCategories(list);
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport] Fetch failed', err);
            setTopCatError('Network error');
            setTopCategories([]);
        }).finally(() => setTopCatLoading(false));
        return () => controller.abort();
    }, [parseTopCategories]);

    // Fetch Weekly Complaints Summary (Help Desk Management) and map to state
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport] (weekly_complaints_summary) baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport] (weekly_complaints_summary) token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/weekly_complaints_summary${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Weekly Complaints Summary:', { url, siteId });
        setWeeklySummaryLoading(true);
        setWeeklySummaryError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async (res) => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport][weekly_complaints_summary] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][weekly_complaints_summary] API error', status, parsed);
                setWeeklySummaryError(`API ${status}`);
                setWeeklySummary(null);
                return;
            }
            console.log('[WeeklyReport][weekly_complaints_summary] raw response:', parsed);
            // New expected shape: weekly_complaints_data.summary_metrics.{total_tickets, open_tickets, closed_tickets, reactive_tickets, proactive_tickets}
            const metrics = parsed?.weekly_complaints_data?.summary_metrics;
            if (metrics) {
                const total = Number(metrics?.total_tickets?.count ?? 0);
                const total_percentage = metrics?.total_tickets?.percentage;
                const open = Number(metrics?.open_tickets?.count ?? 0);
                const open_percentage = metrics?.open_tickets?.percentage;
                const closed = Number(metrics?.closed_tickets?.count ?? 0);
                const closed_percentage = metrics?.closed_tickets?.percentage;
                const reactive = Number(metrics?.reactive_tickets?.count ?? 0);
                const preventive = Number(metrics?.proactive_tickets?.count ?? 0); // proactive == preventive
                setWeeklySummary({ total, total_percentage, open, open_percentage, closed, closed_percentage, reactive, preventive });
                console.log('[WeeklyReport][weekly_complaints_summary] mapped summary (metrics shape):', { total, total_percentage, open, open_percentage, closed, closed_percentage, reactive, preventive });
                return;
            }
            // Fallback flexible extraction (older logic) if new shape not present
            const root = parsed?.complaints_summary || parsed?.data || parsed?.summary || parsed;
            const pick = (candidates: string[]): number => {
                for (const k of candidates) {
                    const val = root?.[k];
                    if (val !== undefined && val !== null && !isNaN(Number(val))) return Number(val);
                }
                const token = candidates[0]?.split('_')[0];
                if (token && root && typeof root === 'object') {
                    for (const key of Object.keys(root)) {
                        if (key.toLowerCase().includes(token.toLowerCase())) {
                            const val = root[key];
                            if (val !== undefined && val !== null && !isNaN(Number(val))) return Number(val);
                        }
                    }
                }
                return 0;
            };
            const total = pick(['total_complaints_current_week', 'total_tickets', 'total_complaints', 'total']);
            const open = pick(['open_complaints', 'open_tickets', 'open']);
            const closed = pick(['closed_complaints', 'closed_tickets', 'closed']);
            const reactive = pick(['reactive_complaints', 'reactive_tickets', 'reactive']);
            const preventive = pick(['preventive_complaints', 'preventive_tickets', 'preventive']);
            // Derive percentages if not supplied explicitly
            const total_percentage = total ? 100 : undefined;
            const open_percentage = (total || total === 0) && total > 0 ? (open / total) * 100 : undefined;
            const closed_percentage = (total || total === 0) && total > 0 ? (closed / total) * 100 : undefined;
            setWeeklySummary({ total, total_percentage, open, open_percentage, closed, closed_percentage, reactive, preventive });
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][weekly_complaints_summary] Fetch failed', err);
            setWeeklySummaryError('Network error');
            setWeeklySummary(null);
        }).finally(() => setWeeklySummaryLoading(false));
        return () => controller.abort();
    }, []);

    // Fetch Priority Wise Open Tickets (Section 2) - log response only for now
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport] (priority_wise_open_tickets) baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport] (priority_wise_open_tickets) token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/priority_wise_open_tickets${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Priority Wise Open Tickets:', { url, siteId });
        setPriorityLoading(true);
        setPriorityError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        })
            .then(async (res) => {
                const status = res.status;
                let bodyText = '';
                try { bodyText = await res.text(); } catch { /* ignore */ }
                let parsed: any = {};
                try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                    console.error('[WeeklyReport][priority_wise_open_tickets] JSON parse failed', e, bodyText?.slice(0, 400));
                }
                if (!res.ok) {
                    console.error('[WeeklyReport][priority_wise_open_tickets] API error', status, parsed);
                    setPriorityError(`API ${status}`);
                    return;
                }
                console.log('[WeeklyReport][priority_wise_open_tickets] raw response:', parsed);
                // Expected flat shape: { total_complaints, open_count, p1, p2, p3, p4, p5 }
                const obj = parsed?.data || parsed; // allow nesting under data
                const p1 = Number(obj?.p1 ?? 0);
                const p2 = Number(obj?.p2 ?? 0);
                const p3 = Number(obj?.p3 ?? 0);
                const p4 = Number(obj?.p4 ?? 0);
                const p5 = Number(obj?.p5 ?? 0);
                const high = p1;
                const medium = p2 + p3;
                const low = p4 + p5;
                const total = Number(obj?.total_complaints ?? (high + medium + low));
                const open = Number(obj?.open_count ?? total);
                setPriorityWise({ high, medium, low, total, open, raw: obj });
                console.log('[WeeklyReport][priority_wise_open_tickets] mapped:', { high, medium, low, total, open });
            })
            .catch(err => {
                if (err?.name === 'AbortError') return;
                console.error('[WeeklyReport][priority_wise_open_tickets] Fetch failed', err);
                setPriorityError('Network error');
            })
            .finally(() => setPriorityLoading(false));
        return () => controller.abort();
    }, []);

    // Fetch Tickets Ageing Matrix - log response only (Section: Tickets Ageing Matrix)
    interface AgeingPriorityRow { priority: string; buckets: Record<string, number>; total: number; }
    const [ageingRows, setAgeingRows] = React.useState<AgeingPriorityRow[]>([]);
    const [ageingLoading, setAgeingLoading] = React.useState(false);
    const [ageingError, setAgeingError] = React.useState<string | null>(null);
    const [averageDays, setAverageDays] = React.useState<number | null>(null);

    // === State: TAT Achievement (Response & Resolution) ===
    interface TATMetrics { title: string; achieved: number; breached: number; total: number; achievedPct?: number; breachedPct?: number; raw?: any; }
    const [tatResponse, setTatResponse] = React.useState<TATMetrics | null>(null);
    const [tatResolution, setTatResolution] = React.useState<TATMetrics | null>(null);
    const [tatLoading, setTatLoading] = React.useState(false);
    const [tatError, setTatError] = React.useState<string | null>(null);

    // === State: TAT Achievement Category-Wise (Top 5) ===
    interface CategoryTATRow {
        category_id: number;
        category_name: string;
        total: number;
        achieved: number;
        breached: number;
        achievedPct: number; // percentage values as provided
        breachedPct: number;
        performance_rating?: string;
        raw?: any;
    }
    const [categoryTatRows, setCategoryTatRows] = React.useState<CategoryTATRow[]>([]);
    const [categoryTatLoading, setCategoryTatLoading] = React.useState(false);
    const [categoryTatError, setCategoryTatError] = React.useState<string | null>(null);

    // Customer Feedback sections removed as requested

    // === State: Asset Management Analysis (log response first only) ===

    interface AssetMgmtDataType {
        critical_assets: {
            total: number;
            in_use: { count: number; percentage: number };
            breakdown: { count: number; percentage: number };
        };
        non_critical_assets: {
            total: number;
            in_use: { count: number; percentage: number };
            breakdown: { count: number; percentage: number };
        };
        // Add other fields if needed
    }

    const [assetMgmtData, setAssetMgmtData] = React.useState<AssetMgmtDataType | null>(null);
    const [assetMgmtLoading, setAssetMgmtLoading] = React.useState(false);
    const [assetMgmtError, setAssetMgmtError] = React.useState<string | null>(null);

    // === State: Checklist Status Analysis (Task Status & Overdue Top 5) ===
    interface ChecklistStatusSummaryRow { status: string; technical: number; nonTechnical: number; total: number; raw?: any; }
    const [checklistStatusRows, setChecklistStatusRows] = React.useState<ChecklistStatusSummaryRow[]>([]);
    // Overdue categories (Category-Wise Overdue Status Top 5) extended shape per API sample
    interface OverdueCategoryRow {
        custom_form_id: number;
        form_name: string;
        overdue_count: number;
        overdue_percentage?: number;
        severity_level?: string;
        total_tasks?: number;
        raw?: any;
    }
    const [overdueCategoryRows, setOverdueCategoryRows] = React.useState<OverdueCategoryRow[]>([]);
    const [checklistStatusLoading, setChecklistStatusLoading] = React.useState(false);
    const [checklistStatusError, setChecklistStatusError] = React.useState<string | null>(null);


    React.useEffect(() => {

        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        // Dynamic date range: use URL params or default to last 7 days
        const formatDate = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`; // YYYY-MM-DD
        };
        let endDateObj: Date;
        let startDateObj: Date;
        
        if (startDate && endDate) {
            startDateObj = new Date(startDate);
            endDateObj = new Date(endDate);
        } else {
            endDateObj = new Date();
            startDateObj = new Date(endDateObj); // clone
            startDateObj.setDate(endDateObj.getDate() - 6); // last 7 calendar days inclusive
        }
        
        const fromDate = formatDate(startDateObj);
        const toDate = formatDate(endDateObj);
        const url = `https://${rawBase}/pms/admin/complaints/ticket_ageing_matrix.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&access_token=${token}`;
        console.log('[WeeklyReport] Ageing Matrix date range', { fromDate, toDate, url });
        console.log('[WeeklyReport] Fetching Tickets Ageing Matrix (matrix / T1..T5 format):', url);
        const controller = new AbortController();
        setAgeingLoading(true);
        setAgeingError(null);
        fetch(url, { method: 'GET', signal: controller.signal })
            .then(async res => {
                const status = res.status;
                let txt = '';
                try { txt = await res.text(); } catch { /* ignore */ }
                let parsed: any = {};
                try { parsed = txt ? JSON.parse(txt) : {}; } catch (e) {
                    console.error('[WeeklyReport][tickets_ageing_matrix][matrix] JSON parse failed', e, txt?.slice(0, 400));
                }
                if (!res.ok) {
                    console.error('[WeeklyReport][tickets_ageing_matrix][matrix] API error', status, parsed);
                    setAgeingError(`API ${status}`);
                    setAgeingRows([]);
                    return;
                }
                console.log('[WeeklyReport][tickets_ageing_matrix][matrix] raw response:', parsed);
                // New shape: { success:1, average_days:2, response: { matrix: { P1: {T1:105,T2:0,...}, P2: {...} } } }
                const matrix = parsed?.response?.matrix;
                if (matrix && typeof matrix === 'object') {
                    const bucketKeys = ['T1', 'T2', 'T3', 'T4', 'T5'];
                    const rows: AgeingPriorityRow[] = Object.keys(matrix).map(pr => {
                        const obj = matrix[pr] || {};
                        const buckets: Record<string, number> = {};
                        bucketKeys.forEach(k => { buckets[k] = Number(obj[k] ?? 0); });
                        const total = bucketKeys.reduce((sum, k) => sum + (buckets[k] || 0), 0);
                        return { priority: pr, buckets, total };
                    });
                    rows.sort((a, b) => a.priority.localeCompare(b.priority, undefined, { numeric: true }));
                    setAgeingRows(rows);
                } else {
                    console.warn('[WeeklyReport] tickets_ageing_matrix: matrix not found in response');
                    setAgeingRows([]);
                }
                if (parsed?.average_days !== undefined) setAverageDays(Number(parsed.average_days));
            })
            .catch(err => {
                if (err?.name === 'AbortError') return;
                console.error('[WeeklyReport][tickets_ageing_matrix][matrix] Fetch failed', err);
                setAgeingError('Network error');
                setAgeingRows([]);
            })
            .finally(() => setAgeingLoading(false));
        return () => controller.abort();
    }, [startDate, endDate]);

    // Fetch Asset Management Analysis (log response only first as requested)
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][asset_management_analysis] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][asset_management_analysis] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/asset_management_analysis${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        setAssetMgmtLoading(true);
        setAssetMgmtError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async res => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport][asset_management_analysis] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][asset_management_analysis] API error', status, parsed);
                setAssetMgmtError(`API ${status}`);
                // setAssetMgmtData();
                console.log("Asset Management Analysis:", parsed.asset_data?.asset_analysis || parsed?.asset_analysis || parsed?.asset_data?.analysis || {});
                return;
            }
            console.log('Asset Management Analysis Rahul:', parsed.asset_data?.asset_analysis?.asset_status_matrix || parsed?.asset_analysis || parsed?.asset_data?.analysis || {});
            setAssetMgmtData(parsed.asset_data?.asset_analysis?.asset_status_matrix); // Placeholder until mapping is defined
            const analysis = parsed?.asset_data?.asset_analysis || parsed?.asset_analysis || parsed?.asset_data?.analysis || {};
            const crit = parsed?.asset_data?.critical_assets || parsed?.critical_assets || analysis?.critical_assets || {};
            const nonCrit = parsed?.asset_data?.non_critical_assets || parsed?.non_critical_assets || analysis?.non_critical_assets || {};
            if (!crit?.total && !crit?.in_use && !crit?.breakdown) {
                console.warn('[WeeklyReport][asset_management_analysis] critical assets structure unexpected. Keys:', Object.keys(parsed || {}));
            }

        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][asset_management_analysis] Fetch failed', err);
            setAssetMgmtError('Network error');
            setAssetMgmtData(null);
        }).finally(() => setAssetMgmtLoading(false));
        return () => controller.abort();
    }, []);

    // Fetch Checklist Status Analysis (Task Status & Category-Wise Overdue) - log only first
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][checklist_status_analysis] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][checklist_status_analysis] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/checklist_status_analysis${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Checklist Status Analysis:', { url, siteId });
        setChecklistStatusLoading(true);
        setChecklistStatusError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async res => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport][checklist_status_analysis] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][checklist_status_analysis] API error', status, parsed?.checklist_data.checklist_analysis.category_overdue_analysis);
                setChecklistStatusError(`API ${status}`);
                setChecklistStatusRows([]);
                setOverdueCategoryRows([]);
                return;
            }
            console.log('[WeeklyReport][checklist_status_analysis] raw response:', parsed);

            // --- Task Status Breakdown Mapping ---
            const statusesRaw = parsed?.checklist_data?.checklist_analysis?.task_status_breakdown?.statuses
                || parsed?.checklist_data?.task_status_breakdown?.statuses
                || parsed?.task_status_breakdown?.statuses
                || [];
            console.log('[WeeklyReport][checklist_status_analysis] raw task statuses:', statusesRaw);
            if (Array.isArray(statusesRaw)) {
                const mappedStatuses = statusesRaw.map((s: any, idx: number) => {
                    const cat = s.category_breakdown || s.category_breakdown_counts || {};
                    const technical = Number(cat?.technical?.count ?? cat?.technical ?? 0);
                    const nonTechnical = Number(cat?.non_technical?.count ?? cat?.non_technical ?? 0);
                    // Only sum the two visible columns so the Total column = Technical + Non-Technical exactly.
                    const total = technical + nonTechnical;
                    // Detect hidden/extra keys (e.g. total, others) that may have caused earlier mismatches (API count 7 while 6+0 shown)
                    const extraKeys = Object.keys(cat).filter(k => !['technical', 'non_technical'].includes(k));
                    if (extraKeys.length) {
                        console.warn('[WeeklyReport][checklist_status_analysis] ignoring extra category keys for total calculation', { status: s.status || s.name, extraKeys, breakdown: cat, apiCount: s.count, displayedTotal: total });
                    } else if (s.count !== undefined && Number(s.count) !== total) {
                        console.warn('[WeeklyReport][checklist_status_analysis] API count differs from displayed total', { status: s.status || s.name, apiCount: s.count, displayedTotal: total, breakdown: cat });
                    }
                    return {
                        status: String(s.status || s.name || `Status ${idx + 1}`),
                        technical,
                        nonTechnical,
                        total,
                        raw: s
                    } as ChecklistStatusSummaryRow; // reuse existing row type
                });
                setChecklistStatusRows(mappedStatuses);
                console.log('[WeeklyReport][checklist_status_analysis] mapped taskStatusRows:', mappedStatuses);
            } else {
                console.warn('[WeeklyReport][checklist_status_analysis] statuses array not found');
                setChecklistStatusRows([]);
            }

            const overdueRaw = parsed?.checklist_data?.checklist_analysis?.category_overdue_analysis?.categories
                || parsed?.checklist_data?.category_overdue_analysis?.categories
                || parsed?.category_overdue_analysis?.categories
                || parsed?.categories;

            console.log('[WeeklyReport][checklist_status_analysis] raw overdue categories:', overdueRaw);

            if (Array.isArray(overdueRaw)) {
                const mapped: OverdueCategoryRow[] = overdueRaw.map((c: any, idx: number) => ({
                    custom_form_id: Number(c.custom_form_id ?? c.form_id ?? idx),
                    form_name: c.form_name || c.name || `Form ${idx + 1}`,
                    overdue_count: Number(c.overdue_count ?? 0),
                    overdue_percentage: c.overdue_percentage !== undefined ? Number(c.overdue_percentage) : undefined,
                    severity_level: c.severity_level || c.severity || undefined,
                    total_tasks: c.total_tasks !== undefined ? Number(c.total_tasks) : undefined,
                    raw: c
                }));
                // Sort descending by overdue_count, take top 5
                const top5 = mapped.sort((a, b) => b.overdue_count - a.overdue_count).slice(0, 5);
                setOverdueCategoryRows(top5);
                console.log('[WeeklyReport][checklist_status_analysis] mapped overdueCategoryRows:', top5);
            } else {
                console.warn('[WeeklyReport][checklist_status_analysis] overdue categories array not found');
                setOverdueCategoryRows([]);
            }
            // NOTE: Removed previous placeholder line that cleared checklistStatusRows so mapped Task Status data remains visible.
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][checklist_status_analysis] Fetch failed', err);
            setChecklistStatusError('Network error');
            setChecklistStatusRows([]);
            setOverdueCategoryRows([]);
        }).finally(() => setChecklistStatusLoading(false));
        return () => controller.abort();
    }, []);

    // Customer Feedback analysis effect removed

    // Customer Feedback weekly trend effect removed

    // Fetch TAT Achievement Analysis (log only first as requested)
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][tat_achievement_analysis] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][tat_achievement_analysis] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/tat_achievement_analysis?site_id=${siteId}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching TAT Achievement Analysis:', { url, siteId });
        setTatLoading(true);
        setTatError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async res => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport][tat_achievement_analysis] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][tat_achievement_analysis] API error', status, parsed);
                setTatError(`API ${status}`);
                return;
            }
            console.log('[WeeklyReport][tat_achievement_analysis] raw response:', parsed);
            // Expected shape: tat_data.tat_analysis.{response_tat:{within_tat,breached_tat,total_tickets,achievement_percentage,breach_percentage}, resolution_tat:{...}}
            const analysis = parsed?.tat_data?.tat_analysis || parsed?.tat_analysis || parsed;
            const resp = analysis?.response_tat;
            const resol = analysis?.resolution_tat;
            if (resp) {
                setTatResponse({
                    title: resp.title || 'Response TAT Overall',
                    achieved: Number(resp.within_tat ?? resp.achieved ?? 0),
                    breached: Number(resp.breached_tat ?? resp.breached ?? 0),
                    total: Number(resp.total_tickets ?? (Number(resp.within_tat ?? 0) + Number(resp.breached_tat ?? 0))),
                    achievedPct: resp.achievement_percentage ?? resp.achieved_pct,
                    breachedPct: resp.breach_percentage ?? resp.breached_pct,
                    raw: resp
                });
            }
            if (resol) {
                setTatResolution({
                    title: resol.title || 'Resolution TAT Overall',
                    achieved: Number(resol.within_tat ?? resol.achieved ?? 0),
                    breached: Number(resol.breached_tat ?? resol.breached ?? 0),
                    total: Number(resol.total_tickets ?? (Number(resol.within_tat ?? 0) + Number(resol.breached_tat ?? 0))),
                    achievedPct: resol.achievement_percentage ?? resol.achieved_pct,
                    breachedPct: resol.breach_percentage ?? resol.breached_pct,
                    raw: resol
                });
            }
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][tat_achievement_analysis] Fetch failed', err);
            setTatError('Network error');
        }).finally(() => setTatLoading(false));
        return () => controller.abort();
    }, []);

    // Fetch TAT Achievement Category-Wise (Top 5 Categories) - log only first
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][tat_achievement_category_wise] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][tat_achievement_category_wise] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/tat_achievement_category_wise?site_id=${siteId}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching TAT Achievement Category-Wise (Top 5):', { url, siteId });
        setCategoryTatLoading(true);
        setCategoryTatError(null);
        fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            signal: controller.signal
        }).then(async res => {
            const status = res.status;
            let bodyText = '';
            try { bodyText = await res.text(); } catch { /* ignore */ }
            let parsed: any = {};
            try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) {
                console.error('[WeeklyReport][tat_achievement_category_wise] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][tat_achievement_category_wise] API error', status, parsed);
                setCategoryTatError(`API ${status}`);
                return;
            }
            console.log('[WeeklyReport][tat_achievement_category_wise] raw response:', parsed);
            // Expected shape: category_tat_data.category_tat_analysis.categories[]
            const categories = parsed?.category_tat_data?.category_tat_analysis?.categories || parsed?.category_tat_analysis?.categories || parsed?.categories;
            if (Array.isArray(categories)) {
                const rows: CategoryTATRow[] = categories.map((c: any, idx: number) => {
                    const rt = c?.resolution_tat || {};
                    return {
                        category_id: Number(c.category_id ?? idx),
                        category_name: c.category_name || `Category ${idx + 1}`,
                        total: Number(c.total_tickets ?? rt.total_tickets ?? 0),
                        achieved: Number(rt.achieved ?? rt.within_tat ?? 0),
                        breached: Number(rt.breached ?? rt.breached_tat ?? 0),
                        achievedPct: Number(rt.achieved_percentage ?? rt.achievement_percentage ?? 0),
                        breachedPct: Number(rt.breached_percentage ?? rt.breach_percentage ?? 0),
                        performance_rating: c.performance_rating,
                        raw: c
                    } as CategoryTATRow;
                })
                    // Sort by total descending (top ticket volume) then slice top 5
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5);
                setCategoryTatRows(rows);
            } else {
                setCategoryTatRows([]);
            }
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][tat_achievement_category_wise] Fetch failed', err);
            setCategoryTatError('Network error');
            setCategoryTatRows([]);
        }).finally(() => setCategoryTatLoading(false));
        return () => controller.abort();
    }, []);


    // --- Global loader: show until ALL individual API loaders have finished (success or error) ---
    const overallLoading = topCatLoading || weeklySummaryLoading || priorityLoading || ageingLoading || tatLoading || categoryTatLoading || assetMgmtLoading || checklistStatusLoading;

    // Detect auto print trigger via query param (?auto=1 / true / yes)
    const auto = React.useMemo(() => {
        if (typeof window === 'undefined') return false;
        try {
            const p = new URLSearchParams(window.location.search);
            const v = (p.get('auto') || '').toLowerCase();
            return ['1', 'true', 'yes', 'y'].includes(v);
        } catch { return false; }
    }, []);

    const [autoTriggered, setAutoTriggered] = React.useState(false);

    // Simplified auto-print (polling) closely mirroring monthly report behavior
    React.useEffect(() => {
        if (!auto || autoTriggered) return;
        const w = window;
        let printed = false;
        let interval: number | undefined;
        const handleAfter = () => {
            try { w.close(); } catch { /* ignore */ }
            w.removeEventListener('afterprint', handleAfter as any);
        };
        w.addEventListener('afterprint', handleAfter as any);

        const attempt = () => {
            if (printed) return;
            if (overallLoading) return; // wait until data done
            printed = true;
            setAutoTriggered(true);
            // short delay to allow last paint similar to monthly implementation
            setTimeout(() => {
                try { w.focus(); w.print(); } catch { /* ignore */ }
            }, 300);
            if (interval) clearInterval(interval);
        };
        // Try every 400ms until loading complete
        interval = window.setInterval(attempt, 400);
        // Safety timeout (10s) to force attempt even if loading flag stuck false/true mismatch
        const failSafe = window.setTimeout(() => { if (!printed) attempt(); }, 10000);
        return () => { if (interval) clearInterval(interval); clearTimeout(failSafe); };
    }, [auto, overallLoading, autoTriggered]);

    if (overallLoading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-16 print:hidden">
                <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full border-4 border-[#C72030]/20 border-t-[#C72030] animate-spin" />
                    <h1 className="mt-8 text-xl font-extrabold text-black">{title}</h1>
                    <p className="mt-3 text-sm text-black/70 font-medium">Loading Weekly Report…</p>
                </div>
            </div>
        );
    }


    return (
        <div className="w-full print-exact">
            {/* readiness marker so external logic (or tests) can detect when page content mounted */}
            <div data-component="weekly-report" data-loading={overallLoading ? 'true' : 'false'} style={{ display: 'none' }} />
            <style>{`
.tat-pie-card,
.tat-pie-card:focus,
.tat-pie-card:focus-visible,
.tat-pie-card:focus-within,
.tat-pie-card .legend-pill,
.tat-pie-card .legend-pill:focus,
.tat-pie-card .legend-pill:focus-visible,
.tat-pie-card .legend-pill:focus-within,
.tat-pie-card .recharts-sector,
.tat-pie-card .recharts-sector:focus,
.tat-pie-card .recharts-sector:focus-visible {
    outline: none !important;
    box-shadow: none !important;
}
`}</style>
              <style>{`
        @media print {
          @page {
              size: A4;
              margin: 4mm 0 1mm 0;
          }

          html,
          body {
              font-size: 18px;
              
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
          }

          .print-page {
              page-break-before: always;
              break-before: page;
          }

          .page-break {
              break-before: page;
          }

          .print-small li {
              font-size: 0.75rem;
              line-height: 1.25rem;
          }

          .print-removespace {
              padding-top: 12px !important;
          }

          .print-footer-bar {
              break-inside: avoid;
              page-break-inside: avoid;
          }

          h3 {
              font-size: 0.85rem;
              line-height: 1rem;
          }

          .print-avoid-break {
              break-inside: avoid;
              page-break-inside: avoid;
          }

          .print-avoid-break * {
              break-inside: avoid;
              page-break-inside: avoid;
          }

          .clip-triangle-tr {
              clip-path: polygon(0 0, 100% 0, 100% 100%);
          }

          .clip-triangle-bl {
              clip-path: polygon(0 100%, 0 0, 100% 100%);
          }

          img {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
          }

          .print-bg-force {
              background-color: #bf0c0c !important;
              color: white !important;
          }

          .rotate-header-print {
              writing-mode: vertical-rl;
              transform: rotate(180deg);
              white-space: nowrap;
              text-align: center;
          }

          .print-th-vertical {
              width: 28px !important;
              min-width: 28px !important;
              max-width: 28px !important;
              padding: 2px !important;
          }

          .print-th-site {
              width: 90px !important;
              min-width: 90px !important;
              max-width: 120px !important;
          }

          .print-td-narrow {
              width: 28px !important;
              min-width: 28px !important;
              max-width: 28px !important;
              padding: 2px !important;
              font-size: 9px !important;
          }

          .print-keep-together {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .print-avoid-before {
              break-before: avoid !important;
              page-break-before: avoid !important;
          }

          .print-avoid-after {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .print-tight {
              margin-top: 0 !important;
              margin-bottom: 8px !important;
              padding-top: 8px !important;
              padding-bottom: 8px !important;
          }

          /* Fix date range overflow in print */
          .date-range-text {
              white-space: nowrap !important;
              overflow: visible !important;
              width: 100% !important;
              max-width: 100% !important;
              font-size: 0.85rem !important;
          }

          .date-range-text > span:first-of-type {
              left: 239px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .date-range-text > span:last-of-type {
              left: 279px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .date-range-text span span {
              white-space: nowrap !important;
              display: inline-block !important;
          }

          /* Fix WEEKLY text overflow in print */
          .weekly-text {
              white-space: nowrap !important;
               overflow: visible !important;
              width: 100% !important;
              max-width: 100% !important;
          }

          .weekly-text > span:first-of-type {
              left: 70px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .weekly-text > span:last-of-type {
              left: 120px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .weekly-text span span {
              white-space: nowrap !important;
              display: inline-block !important;
          }

          /* Fix REPORT text overflow in print */
          .report-text {
              white-space: nowrap !important;
              overflow: visible !important;
              width: 100% !important;
              max-width: 100% !important;
          }

          .report-text > span:first-of-type {
              left: 140px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .report-text > span:last-of-type {
              left: 181px !important;
              max-width: none !important;
              overflow: visible !important;
          }

          .report-text span span {
              white-space: nowrap !important;
              display: inline-block !important;
          }

          /* Keep Tickets Ageing Matrix header and table together on same page */
          .ageing-matrix-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .ageing-matrix-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .ageing-matrix-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .ageing-matrix-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .ageing-matrix-table-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .ageing-matrix-table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .ageing-matrix-table thead {
              display: table-header-group !important;
          }

          .ageing-matrix-table tbody {
              display: table-row-group !important;
          }

          .ageing-matrix-table tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* Keep TAT Achievement section together on same page */
          .tat-achievement-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-achievement-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-achievement-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .tat-achievement-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .tat-achievement-pie-cards {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .resolution-tat-pie-card-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-pie-card {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* Keep Task Status section together on same page */
          .task-status-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .task-status-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .task-status-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .task-status-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .task-status-table-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .task-status-table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .task-status-table thead {
              display: table-header-group !important;
          }

          .task-status-table tbody {
              display: table-row-group !important;
          }

          .task-status-table tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* Keep TAT Achievement Category-Wise section together on same page */
          .tat-category-wise-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-category-wise-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-category-wise-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .tat-category-wise-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .tat-category-wise-table-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-category-wise-table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-category-wise-table thead {
              display: table-header-group !important;
          }

          .tat-category-wise-table tbody {
              display: table-row-group !important;
          }

          .tat-category-wise-table tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* Keep Category-Wise Overdue Status section together on same page */
          .overdue-status-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .overdue-status-container {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .overdue-status-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .overdue-status-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .overdue-status-table-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .overdue-status-table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .overdue-status-table thead {
              display: table-header-group !important;
          }

          .overdue-status-table tbody {
              display: table-row-group !important;
          }

          .overdue-status-table tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* General rules to keep all sections together in print */
          section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          /* Keep all table sections together */
          section table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          section table thead {
              display: table-header-group !important;
          }

          section table tbody {
              display: table-row-group !important;
          }

          section h2 {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          /* Ensure all section containers stay together */
          section > div {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .tat-pie-container .recharts-wrapper {
              overflow: visible !important;
          }

          .tat-pie-container svg {
              transform: scale(1.25);
              transform-origin: center center;
          }

          /* Specific rules for remaining sections */
          .help-desk-section,
          .priority-wise-section,
          .category-wise-section,
          .asset-management-section {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .help-desk-header,
          .priority-wise-header,
          .category-wise-header,
          .asset-management-header {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .help-desk-border,
          .priority-wise-border,
          .category-wise-border,
          .asset-management-border {
              break-after: avoid !important;
              page-break-after: avoid !important;
          }

          .priority-wise-table,
          .category-wise-table,
          .asset-management-table {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }

          .priority-wise-table-wrapper,
          .category-wise-table-wrapper,
          .asset-management-table-wrapper {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ✅ Main Layout */}
      <Box
        sx={{
          fontFamily: "sans-serif",
          bgcolor: "white",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Header Image */}
        <div className="relative h-[750px] w-full print:h-[600px] print:overflow-hidden">
            <img
                src="/weekly_report png.png"
                alt="Meeting Room"
                className="w-full h-full object-cover print:h-[600px] print:object-cover"
            />


          {/* Logo top-right */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 24,
              backgroundColor: "white",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1.5,
              py: 0.5,
              "& svg": {
                height: "40px",
                width: "auto",
                display: "block",
              },
              "@media print": {
                "& svg": {
                  height: "32px",
                },
              },
            }}
          >
            {logoElement}
          </Box>

          {/* Site Label */}
          <Typography
            sx={{
              position: "absolute",
              bottom: 16,
              right: 0,
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              minWidth: 250,
              textAlign: "right",
              paddingRight: 3,
              '@media print': {
                right: 0,
                paddingRight: 2,
                fontSize: 16,
              },
            }}
          >
            <span style={{ fontWeight: 700 }}>Site</span> : <span style={{ fontWeight: 700 }}>{siteLabel || 'N/A'}</span>
          </Typography>
        </div>

        {/* Main Content Section */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: { xs: 6, md: 10 },
            px: { xs: 2, md: 6 },
          }}
        >
          {/* Red Box */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "10%", md: "25%" },
              top: { xs: "-30px", md: "-100px" },
              width: { xs: "40%", md: "320px" },
              height: { xs: "400px", md: "450px" },
              bgcolor: "#bf0c0c",
              zIndex: 2,
            }}
          />

          {/* White Box */}
          <Box
            sx={{
              position: "relative",
              border: "1px solid #bf0c0c",
              bgcolor: "white",
              zIndex: 1,
              width: { xs: "70%", md: "50%" },
              height: { xs: "380px", md: "400px" },
            }}
          />

          {/* WEEKLY REPORT Text - Single div with complete words, split at box boundary */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "10%", md: "25%" },
              top: { xs: "80px", md: "100px" },
              width: { xs: "80%", md: "calc(320px + 50%)" },
              zIndex: 10,
            }}
          >
            {/* WEEKLY - Single word, split by color - TOP */}
            <div
              className="weekly-text"
              style={{
                marginTop: "20px",
                paddingLeft: "40px",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
                fontWeight: 700,
                letterSpacing: "2px",
                fontSize: "3rem",
                fontFamily: "sans-serif",
                position: "relative",
                display: "block",
              }}
            >
              {/* White text (shows on red box) - shows WEEKL part */}
              <span
                style={{
                  color: "white",
                  position: "relative",
                  display: "inline-block",
                  zIndex: 11,
                  left: "103px",
                }}
              >
                <span
                  style={{
                    clipPath: "polygon(0 0, 83% 0, 83% 100%, 0 100%)",
                    WebkitClipPath: "polygon(0 0, 83% 0, 83% 100%, 0 100%)",
                  }}
                >
                  WEEKLY
                </span>
              </span>
              {/* Red text overlay (shows on white box) - shows Y part */}
              <span
                style={{
                  color: "#bf0c0c",
                  position: "absolute",
                  left: "140px",
                  top: 0,
                  zIndex: 12,
                  clipPath: "polygon(83% 0, 100% 0, 100% 100%, 83% 100%)",
                  WebkitClipPath: "polygon(83% 0, 100% 0, 100% 100%, 83% 100%)",
                }}
              >
                WEEKLY
              </span>
            </div>

            {/* REPORT - Single word, split by color - BELOW */}
            <div
              className="report-text"
              style={{
                marginTop: "20px",
                paddingLeft: "40px",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
                fontWeight: 600,
                letterSpacing: "2px",
                fontSize: "3.75rem",
                fontFamily: "sans-serif",
                position: "relative",
                display: "block",
              }}
            >
              {/* White text (shows on red box) - shows REP part */}
              <span
                style={{
                  color: "white",
                  position: "relative",
                  display: "inline-block",
                  left: "150px",
                  zIndex: 12,
                }}
              >
                <span
                  style={{
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                    WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                  }}
                >
                  REPORT
                </span>
              </span>
              {/* Red text overlay (shows on white box) - shows ORT part */}
              <span
                style={{
                  color: "#bf0c0c",
                  position: "absolute",
                  left: "190px",
                  top: 0,
                  zIndex: 12,
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                  WebkitClipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                }}
              >
                REPORT
              </span>
            </div>

            {/* Date Range - Split by color like WEEKLY and REPORT */}
            <div
              className="date-range-text"
              style={{
                marginTop: "20px",
                paddingLeft: "40px",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
                fontWeight: 300,
                fontSize: "1rem",
                position: "relative",
                display: "block",
              }}
            >
              {/* White text (shows on red box) - left part */}
              <span
                style={{
                  color: "black",
                  position: "relative",
                  display: "inline-block",
                  left: "298px",
                  zIndex: 12,
                }}
              >
                <span
                  style={{
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                    WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                  }}
                >
                  {dateRangeLabel}
                </span>
              </span>
              {/* Red text overlay (shows on white box) - right part */}
              <span
                style={{
                  color: "black",
                  position: "absolute",
                  left: "337px",
                  top: 0,
                  zIndex: 12,
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                  WebkitClipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                }}
              >
                {dateRangeLabel}
              </span>
            </div>
          </Box>
        </Box>
        <div className="w-full flex items-center justify-center py-6 print:py-3 first-page-logo">
        <img
          src={GoPhygital}
          alt="GoPhygital"
          className="h-10 print:h-5"
        />
      </div>
      </Box>

      {/* GoPhygital logo footer under the cover layout (both view & print) */}
   
            {/* Wrap sections 1–3 together to keep them on a single page in PDF */}
            <div className="no-break first-page-group">
                {/* <header className="w-full bg-[#F6F4EE] flex flex-col items-center justify-center text-center py-6 sm:py-8 mb-6 
    print:flex print:flex-col print:items-center print:justify-center print:text-center 
    print:pt-0 print:mt-0 print:pb-4 print:mb-4">
                    <h1 className="text-center text-black font-extrabold text-3xl sm:text-4xl print:text-2xl">
                        {title}
                    </h1>
                    <p className="mt-2 text-center text-black font-medium text-base sm:text-lg print:text-sm">
                        {weekRangeLabel}
                    </p>
                </header> */}
            
   





                {/* 1. Help Desk Management */}
                <section className={`${sectionBox} help-desk-section`}>
                    <div className="px-1 sm:px-2 help-desk-container">
                        <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg help-desk-header">1. Help Desk Management</h2>
                        <div className="border-t border-dashed border-gray-300 my-3 help-desk-border" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(() => {
                                const loading = weeklySummaryLoading;
                                const err = weeklySummaryError;
                                if (loading) {
                                    return (
                                        <>
                                            <StatCard value="…" label="Total Tickets" />
                                            <StatCard value="…" label="Open Tickets" />
                                            <StatCard value="…" label="Closed Tickets" />
                                        </>
                                    );
                                }
                                if (err) {
                                    return (
                                        <>
                                            <StatCard value="-" label="Total Tickets" subLabel={err} />
                                            <StatCard value="-" label="Open Tickets" />
                                            <StatCard value="-" label="Closed Tickets" />
                                        </>
                                    );
                                }
                                const total = weeklySummary?.total ?? 0;
                                const totalPct = weeklySummary?.total_percentage;
                                const open = weeklySummary?.open ?? 0;
                                const openPct = weeklySummary?.open_percentage;
                                const closed = weeklySummary?.closed ?? 0;
                                const closedPct = weeklySummary?.closed_percentage;
                                const fmtPct = (v?: number) => (v === 0 || v ? `(${Math.round(v)}%)` : undefined);
                                return (
                                    <>
                                        <StatCard value={total} percent={fmtPct(totalPct)} label="Total Tickets" />
                                        <StatCard value={open} percent={fmtPct(openPct)} label="Open Tickets" />
                                        <StatCard value={closed} percent={fmtPct(closedPct)} label="Closed Tickets" />
                                    </>
                                );
                            })()}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {(() => {
                                const reactive = weeklySummary?.reactive ?? 0;
                                const preventive = weeklySummary?.preventive ?? 0;
                                if (weeklySummaryLoading) {
                                    return (<><StatCard value="…" label="Reactive Tickets" subLabel="(User Generated)" /><StatCard value="…" label="Preventive Tickets" subLabel="(Team Generated)" /></>);
                                }
                                if (weeklySummaryError) {
                                    return (<><StatCard value="-" label="Reactive Tickets" subLabel="(User Generated)" /><StatCard value="-" label="Preventive Tickets" subLabel="(Team Generated)" /></>);
                                }
                                return (<>
                                    <StatCard value={reactive} label="Reactive Tickets" subLabel="(User Generated)" />
                                    <StatCard value={preventive} label="Preventive Tickets" subLabel="(Team Generated)" />
                                </>);
                            })()}
                        </div>
                    </div>
                </section>

                {/* 2. Priority Wise Tickets */}
                <section className={`${sectionBox} priority-wise-section`}>
                    <div className="px-1 sm:px-2 priority-wise-container">
                        <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg priority-wise-header">2. Priority Wise Tickets</h2>
                        <div className="border-t border-dashed border-gray-300 my-3 priority-wise-border" />
                        <div className="overflow-x-auto priority-wise-table-wrapper">
                            <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 priority-wise-table">
                                <thead>
                                    <tr>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/2">Priority</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-1/2">Open Tickets</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priorityLoading && (
                                        <tr><td colSpan={2} className="p-4 print:p-2 text-center text-gray-500">Loading...</td></tr>
                                    )}
                                    {!priorityLoading && priorityError && (
                                        <tr><td colSpan={2} className="p-4 print:p-2 text-center text-red-600">{priorityError}</td></tr>
                                    )}
                                    {!priorityLoading && !priorityError && (
                                        <>
                                            <tr className="border-b border-gray-200"><td className="p-4 print:p-2 text-black">High (P1)</td><td className="p-4 print:p-2 text-center text-black">{priorityWise ? priorityWise.high : 0}</td></tr>
                                            <tr className="border-b border-gray-200"><td className="p-4 print:p-2 text-black">Medium (P2, P3)</td><td className="p-4 print:p-2 text-center text-black">{priorityWise ? priorityWise.medium : 0}</td></tr>
                                            <tr><td className="p-4 print:p-2 text-black">Low (P4, P5)</td><td className="p-4 print:p-2 text-center text-black">{priorityWise ? priorityWise.low : 0}</td></tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 3. Category Wise Ticket (Top-5) */}
                <section className={`${sectionBox} category-wise-section`}>
                    <div className="px-1 sm:px-2 category-wise-container">
                        <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg category-wise-header">3. Category Wise Ticket (Top-5)</h2>
                        <div className="border-t border-dashed border-gray-300 my-3 category-wise-border" />
                        <div className="overflow-x-auto category-wise-table-wrapper">
                            <table className="w-full table-fixed border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 category-wise-table">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="align-middle bg-[#ECE6DE] w-1/4 text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left">Category</th>
                                        <th colSpan={3} className="bg-[#ECE6DE] w-3/4 text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                    </tr>
                                    <tr>
                                        <th className="bg-[#ECE6DE] w-1/4 text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Count</th>
                                        <th className="bg-[#ECE6DE] w-1/4 text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">% out of total</th>
                                        <th className="bg-[#ECE6DE] w-1/4 text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">% inc./dec. from last week</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCatLoading && (
                                        <tr><td colSpan={4} className="p-4 print:p-2 text-center text-sm text-gray-500">Loading...</td></tr>
                                    )}
                                    {!topCatLoading && topCatError && (
                                        <tr><td colSpan={4} className="p-4 print:p-2 text-center text-sm text-red-600">{topCatError}</td></tr>
                                    )}
                                    {!topCatLoading && !topCatError && topCategories.length === 0 && (
                                        <tr><td colSpan={4} className="p-4 print:p-2 text-center text-sm text-gray-500">No data</td></tr>
                                    )}
                                    {topCategories.map((row, i) => {
                                        const arrowUp = (row.trend_icon || row.trend || '').toLowerCase().includes('up');
                                        const arrowDown = (row.trend_icon || row.trend || '').toLowerCase().includes('down');
                                        const arrowSymbol = arrowUp ? '▲' : arrowDown ? '▼' : '';
                                        const arrowColor = arrowDown ? 'text-[#C72030]' : arrowUp ? 'text-green-600' : 'text-gray-400';
                                        return (
                                            <tr key={row.category_id} className={i !== topCategories.length - 1 ? 'border-b border-gray-200' : ''}>
                                                <td className="p-4 print:p-2 text-black border-r border-gray-300 break-words whitespace-normal">{row.category_name}</td>
                                                <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{String(row.current_week_count ?? 0).padStart(2, '0')}</td>
                                                <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{(row.percentage_of_total ?? 0).toFixed(2)}%</td>
                                                <td className="p-4 print:p-2 text-center text-black break-words whitespace-normal">
                                                    <span>{(row.percentage_change ?? 0).toFixed(2)}%</span>
                                                    {arrowSymbol && <span className={`ml-2 ${arrowColor}`}>{arrowSymbol}</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Tickets Ageing Matrix */}
            <section className={`${sectionBox} ageing-matrix-section`}>
                <div className="px-1 sm:px-2 ageing-matrix-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg ageing-matrix-header">Tickets Ageing Matrix</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 ageing-matrix-border" />
                    <div className="overflow-x-auto ageing-matrix-table-wrapper">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 ageing-matrix-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/6">Priority</th>
                                    <th colSpan={5} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">No. of Days</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">0-10</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">11-20</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">21-30</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">31-40</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">40 +</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ageingLoading && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-gray-500">Loading...</td></tr>
                                )}
                                {!ageingLoading && ageingError && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-red-600">{ageingError}</td></tr>
                                )}
                                {!ageingLoading && !ageingError && ageingRows.length === 0 && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-gray-500">No data</td></tr>
                                )}
                                {!ageingLoading && !ageingError && ageingRows.map((row, i) => {
                                    // Map display ranges to API keys (T1..T5)
                                    const displayBuckets: { label: string; key: string }[] = [
                                        { label: '0-10', key: 'T1' },
                                        { label: '11-20', key: 'T2' },
                                        { label: '21-30', key: 'T3' },
                                        { label: '31-40', key: 'T4' },
                                        { label: '40+', key: 'T5' }
                                    ];
                                    return (
                                        <tr key={row.priority} className={i !== ageingRows.length - 1 ? 'border-b border-gray-200' : ''}>
                                            <td className="p-4 print:p-2 text-black border-r border-gray-300 w-1/6">{row.priority}</td>
                                            {displayBuckets.map((bk, j) => {
                                                const v = row.buckets[bk.key] ?? 0;
                                                return <td key={bk.key} className={`p-4 print:p-2 text-center text-black ${j < displayBuckets.length - 1 ? 'border-r border-gray-300' : ''}`}>{v}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className={sectionBox}>
                <div className="mb-6 print:mb-3">
                    <StatCard value={averageDays !== null ? `${averageDays} Days` : '…'} label="Average Time Taken To Resolve A Ticket" />
                </div>
            </div>


            {/* TAT Achievement (Response & Resolution) */}
            <section className={`${sectionBox} tat-achievement-section`}>
                <div className="px-1 sm:px-2 tat-achievement-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg tat-achievement-header">TAT Achievement (Response & Resolution)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 tat-achievement-border" />
                    {tatLoading && (
                        <div className="grid grid-cols-1 gap-8">
                            <TATPieCard title="Response TAT Overall" achieved={0} breached={0} achievedPctOverride={0} breachedPctOverride={0} />
                            <TATPieCard title="Resolution TAT Overall" achieved={0} breached={0} achievedPctOverride={0} breachedPctOverride={0} />
                        </div>
                    )}
                    {!tatLoading && tatError && (
                        <div className="text-center text-red-600 text-sm">{tatError}</div>
                    )}
                    {!tatLoading && !tatError && (
                        <div className="grid grid-cols-1 gap-8 print:gap-4 tat-achievement-pie-cards">
                            <TATPieCard
                                title={tatResponse?.title || 'Response TAT Overall'}
                                achieved={tatResponse?.achieved ?? 0}
                                breached={tatResponse?.breached ?? 0}
                                achievedPctOverride={tatResponse?.achievedPct}
                                breachedPctOverride={tatResponse?.breachedPct}
                            />
                            <div className="resolution-tat-pie-card-wrapper">
                                <TATPieCard
                                    title={tatResolution?.title || 'Resolution TAT Overall'}
                                    achieved={tatResolution?.achieved ?? 0}
                                    breached={tatResolution?.breached ?? 0}
                                    achievedPctOverride={tatResolution?.achievedPct}
                                    breachedPctOverride={tatResolution?.breachedPct}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* TAT Achievement Category-Wise */}
            <section className={`${sectionBox} tat-category-wise-section`}>
                <div className="px-1 sm:px-2 tat-category-wise-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg tat-category-wise-header">TAT Achievement Category-Wise (Top 5 Categories)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 tat-category-wise-border" />
                    <div className="overflow-x-auto tat-category-wise-table-wrapper">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 tat-category-wise-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-[28%]">Category</th>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[10%]">Total</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[24%]">Resolution TAT</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-[24%]">Resolution TAT %</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breached</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved %</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breached %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryTatLoading && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-gray-500">Loading...</td></tr>
                                )}
                                {!categoryTatLoading && categoryTatError && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-red-600">{categoryTatError}</td></tr>
                                )}
                                {!categoryTatLoading && !categoryTatError && categoryTatRows.length === 0 && (
                                    <tr><td colSpan={6} className="p-4 print:p-2 text-center text-gray-500">No data</td></tr>
                                )}
                                {!categoryTatLoading && !categoryTatError && categoryTatRows.map((row, i) => (
                                    <tr key={row.category_id} className={i !== categoryTatRows.length - 1 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black border-r border-gray-300 align-top break-words whitespace-normal">{row.category_name}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.total.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.achieved.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.breached.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.achievedPct.toFixed(2)}%</td>
                                        <td className="p-4 print:p-2 text-center text-black">{row.breachedPct.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Customer Experience Feedback and Customer Feedback sections removed */}

            {/* 4. Asset Management */}
            <section className={`${sectionBox} asset-management-section`}>
                <div className="px-1 sm:px-2 asset-management-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg asset-management-header">4. Asset Management</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 asset-management-border" />
                    <div className="overflow-x-auto asset-management-table-wrapper">
                        {assetMgmtLoading && (
                            <div className="p-6 text-center text-gray-500 text-sm">Loading asset management data...</div>
                        )}
                        {!assetMgmtLoading && assetMgmtError && (
                            <div className="p-6 text-center text-red-600 text-sm">{assetMgmtError}</div>
                        )}
                        {!assetMgmtLoading && !assetMgmtError && !assetMgmtData && (
                            <div className="p-6 text-center text-gray-500 text-sm">No data</div>
                        )}
                        {!assetMgmtLoading && !assetMgmtError && assetMgmtData && (
                            <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 asset-management-table">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w>[16%]">Metric</th>
                                        <th colSpan={3} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[42%]">Critical</th>
                                        <th colSpan={3} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-[42%]">Non-Critical</th>
                                    </tr>
                                    <tr>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Total</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breakdown</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Total</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                        <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breakdown</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-4 print:p-2 text-black font-medium">Count</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.critical_assets.total}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.critical_assets.in_use.count}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.critical_assets.breakdown.count}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.non_critical_assets.total}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.non_critical_assets.in_use.count}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{assetMgmtData.non_critical_assets.breakdown.count}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-4 print:p-2 text-black font-medium">%</td>
                                        {(() => {
                                            const critInUse = Number(assetMgmtData.critical_assets.in_use.percentage || 0);
                                            const critBreakdown = Number(assetMgmtData.critical_assets.breakdown.percentage || 0);
                                            const nonCritInUse = Number(assetMgmtData.non_critical_assets.in_use.percentage || 0);
                                            const nonCritBreakdown = Number(assetMgmtData.non_critical_assets.breakdown.percentage || 0);
                                            const critTotal = (critInUse + critBreakdown).toFixed(2);
                                            const nonCritTotal = (nonCritInUse + nonCritBreakdown).toFixed(2);
                                            return (
                                                <>
                                                    <td className="p-4 print:p-2 text-center text-black">{critTotal}%</td>
                                                    <td className="p-4 print:p-2 text-center text-black">{critInUse.toFixed(2)}%</td>
                                                    <td className="p-4 print:p-2 text-center text-black">{critBreakdown.toFixed(2)}%</td>
                                                    <td className="p-4 print:p-2 text-center text-black">{nonCritTotal}%</td>
                                                    <td className="p-4 print:p-2 text-center text-black">{nonCritInUse.toFixed(2)}%</td>
                                                    <td className="p-4 print:p-2 text-center text-black">{nonCritBreakdown.toFixed(2)}%</td>
                                                </>
                                            );
                                        })()}
                                    </tr>

                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Raw logged to console; health % (Critical: {assetMgmtData?.critical.healthPct}%, Non-Critical: {assetMgmtData?.nonCritical.healthPct}%) */}
                </div>
            </section>

            {/* 5. Task Status (dynamic) */}
            <section className={`${sectionBox} task-status-section`}>
                <div className="px-1 sm:px-2 task-status-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg task-status-header">5. Task Status</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 task-status-border" />
                    <div className="overflow-x-auto task-status-table-wrapper">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 task-status-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/3">Task Status</th>
                                    <th colSpan={3} className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Non-Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-bold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklistStatusLoading && (
                                    <tr><td colSpan={4} className="p-4 print:p-2 text-center text-gray-500">Loading...</td></tr>
                                )}
                                {!checklistStatusLoading && checklistStatusError && (
                                    <tr><td colSpan={4} className="p-4 print:p-2 text-center text-red-600">{checklistStatusError}</td></tr>
                                )}
                                {!checklistStatusLoading && !checklistStatusError && checklistStatusRows.length === 0 && (
                                    <tr><td colSpan={4} className="p-4 print:p-2 text-center text-gray-500">No data</td></tr>
                                )}
                                {!checklistStatusLoading && !checklistStatusError && checklistStatusRows.map((row, i) => (
                                    <tr key={row.status} className={i !== checklistStatusRows.length - 1 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black">{row.status}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{row.technical}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{row.nonTechnical}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{row.total}</td>
                                    </tr>
                                ))}
                                {/* Total Row */}
                                {!checklistStatusLoading && !checklistStatusError && checklistStatusRows.length > 0 && (() => {
                                    const totals = checklistStatusRows.reduce((acc, r) => {
                                        acc.technical += Number(r.technical || 0);
                                        acc.nonTechnical += Number(r.nonTechnical || 0);
                                        acc.total += Number(r.total || 0);
                                        return acc;
                                    }, { technical: 0, nonTechnical: 0, total: 0 });
                                    return (
                                        <tr className="border-t border-gray-300 font-semibold">
                                            <td className="p-4 print:p-2 text-black">Total</td>
                                            <td className="p-4 print:p-2 text-center text-black">{totals.technical}</td>
                                            <td className="p-4 print:p-2 text-center text-black">{totals.nonTechnical}</td>
                                            <td className="p-4 print:p-2 text-center text-black">{totals.total}</td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Category-Wise Overdue Status (Top 5) - dynamic */}
            <section className={`${sectionBox} overdue-status-section`}>
                <div className="px-1 sm:px-2 overdue-status-container">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg overdue-status-header">Category-Wise Overdue Status (Top 5)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3 overdue-status-border" />
                    <div className="overflow-x-auto overdue-status-table-wrapper">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0 overdue-status-table">
                            <thead>
                                <tr>
                                    <th className="bg-[#ECE6DE] font-bold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-left w-3/4">Category Of Checklist (PPM)</th>
                                    <th className="bg-[#ECE6DE] font-bold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-center w-1/4">Overdue Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklistStatusLoading && (
                                    <tr><td colSpan={2} className="p-4 print:p-2 text-center text-gray-500">Loading...</td></tr>
                                )}
                                {!checklistStatusLoading && checklistStatusError && (
                                    <tr><td colSpan={2} className="p-4 print:p-2 text-center text-red-600">{checklistStatusError}</td></tr>
                                )}
                                {!checklistStatusLoading && !checklistStatusError && overdueCategoryRows.length === 0 && (
                                    <tr><td colSpan={2} className="p-4 print:p-2 text-center text-gray-500">No data</td></tr>
                                )}
                                {!checklistStatusLoading && !checklistStatusError && overdueCategoryRows.map((row, i) => (
                                    <tr key={row.custom_form_id} className={i !== overdueCategoryRows.length - 1 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-5 sm:p-6 print:p-3 text-black align-top">
                                            <div className="font-medium break-words whitespace-normal">{row.form_name}</div>
                                            {(row.severity_level || row.overdue_percentage !== undefined) && (
                                                <div className="mt-1 text-xs sm:text-[11px] text-black/70 flex flex-wrap gap-2">
                                                    {/* {row.severity_level && <span className="inline-block px-2 py-[2px] rounded-sm bg-[#F6F4EE] border border-gray-300">{row.severity_level}</span>} */}
                                                    {/* {row.overdue_percentage !== undefined && <span>{row.overdue_percentage.toFixed(2)}%</span>}
                                                    {row.total_tasks !== undefined && <span>Total: {row.total_tasks}</span>} */}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5 sm:p-6 print:p-3 text-center text-black font-medium">{row.overdue_count}</td>
                                    </tr>
                                ))}
                                {/* Total row */}
                                {!checklistStatusLoading && !checklistStatusError && overdueCategoryRows.length > 0 && (() => {
                                    const totalOverdue = overdueCategoryRows.reduce((sum, r) => sum + Number(r.overdue_count || 0), 0);
                                    return (
                                        <tr className="border-t border-gray-300 font-semibold">
                                            <td className="p-5 sm:p-6 print:p-3 text-black">Total</td>
                                            <td className="p-5 sm:p-6 print:p-3 text-center text-black">{totalOverdue}</td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WeeklyReport;