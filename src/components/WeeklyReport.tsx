import { set } from 'lodash';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
    const data = [
        { name: 'Achieved', value: achieved, color: '#D9D3C4' },
        { name: 'Breached', value: breached, color: '#C4B89D' }
    ];
    return (
        <div className="w-full">
            <h3 className="text-black font-semibold text-base sm:text-lg mb-2">{title}</h3>
            <div className="bg-[#F6F4EE] rounded-sm px-6 sm:px-8 py-5 sm:py-6">
                <div className="w-full h-[300px] sm:h-[360px] print:h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 8, right: 40, bottom: 8, left: 40 }}>
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={110} stroke="#FFFFFF" paddingAngle={0}>
                                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base">
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#D9D3C4' }} /> <span className="text-black font-medium">Achieved:</span> <span className="text-black/80">{achieved.toLocaleString()} ({achPct.toFixed(2)}%)</span></div>
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#C4B89D' }} /> <span className="text-black font-medium">Breached:</span> <span className="text-black/80">{breached.toLocaleString()} ({brcPct.toFixed(2)}%)</span></div>
                </div>
            </div>
        </div>
    );
};

type WeeklyReportProps = { title?: string };
const WeeklyReport: React.FC<WeeklyReportProps> = ({ title = 'Weekly Report' }) => {
    const sectionBox = 'bg-white border border-gray-300 w-[95%] mx-auto p-5 mb-10 print:w-[95%] print:mx-auto print:p-2 print:mb-4 no-break';

    // Dynamic 7-day window label (start = today - 6 days, end = today)
    const weekRangeLabel = React.useMemo(() => {
        const end = new Date();
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return `${fmt(start)} - ${fmt(end)}`;
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

    // === State: Customer Feedback Analysis (dynamic rendering) ===
    interface CustomerFeedbackRating { key: string; label: string; count: number; percentage: number; rating_value: number; color: string; raw?: any; }
    const [customerFeedbackRatings, setCustomerFeedbackRatings] = React.useState<CustomerFeedbackRating[]>([]);
    const [customerFeedbackLoading, setCustomerFeedbackLoading] = React.useState(false);
    const [customerFeedbackError, setCustomerFeedbackError] = React.useState<string | null>(null);

    // Fixed original color palette for Customer Experience Feedback (do not use API colors for box backgrounds)
    const customerFeedbackColorPalette: Record<string, string> = {
        great: '#EDE7DB',      // Excellent
        good: '#D9D3C4',       // Good
        okay: '#C4B89D',       // Average
        bad: '#C1A593',        // Bad
        terrible: '#D5DBDB'    // Poor
    };

    // === State: Customer Feedback Weekly Trend (stacked bar) ===
    interface WeeklyTrendRow {
        day: string;              // e.g. Mon, Tue
        date: string;             // original date dd-mm-yyyy
        Excellent: number;
        Good: number;
        Average: number;
        Bad: number;
        Poor: number;
        total: number;            // total_feedback
        satisfaction: number;     // daily_satisfaction_score
    }
    const [weeklyTrendRows, setWeeklyTrendRows] = React.useState<WeeklyTrendRow[]>([]);
    const [weeklyTrendLoading, setWeeklyTrendLoading] = React.useState(false);
    const [weeklyTrendError, setWeeklyTrendError] = React.useState<string | null>(null);

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
        // Dynamic date range: start = today - 6 days, end = today (7 day window)
        const formatDate = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`; // YYYY-MM-DD
        };
        const endDateObj = new Date();
        const startDateObj = new Date(endDateObj); // clone
        startDateObj.setDate(endDateObj.getDate() - 6); // last 7 calendar days inclusive
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
    }, []);

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

    // Fetch Customer Feedback Analysis (log first then map to ratings)
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][customer_feedback_analysis] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][customer_feedback_analysis] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/customer_feedback_analysis${siteId ? `?site_id=${siteId}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Customer Feedback Analysis:', { url, siteId });
        setCustomerFeedbackLoading(true);
        setCustomerFeedbackError(null);
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
                console.error('[WeeklyReport][customer_feedback_analysis] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][customer_feedback_analysis] API error', status, parsed);
                setCustomerFeedbackError(`API ${status}`);
                return;
            }
            console.log('[WeeklyReport][customer_feedback_analysis] raw response:', parsed);
            const analysis = parsed?.feedback_data?.feedback_analysis || parsed?.customer_feedback_data?.analysis || parsed?.analysis || parsed;
            const ratingObj = analysis?.feedback_by_rating || analysis?.ratings || {};
            // Mapping backend keys to display labels consistent with original static UI
            const labelMap: Record<string, string> = {
                great: 'Excellent',
                good: 'Good',
                okay: 'Average',
                bad: 'Bad',
                terrible: 'Poor'
            };
            const order = ['great', 'good', 'okay', 'bad', 'terrible'];
            const collected: CustomerFeedbackRating[] = order.map(k => {
                const r = ratingObj?.[k] || {};
                return {
                    key: k,
                    label: labelMap[k] || k,
                    count: Number(r.count ?? 0),
                    percentage: Number(r.percentage ?? 0),
                    rating_value: Number(r.rating_value ?? 0),
                    color: r.color || '#EDE7DB',
                    raw: r
                } as CustomerFeedbackRating;
            });
            // If percentages are zero or all zero, compute manually
            // const totalCount = collected.reduce((s, r) => s + r.count, 0);
            // const allZeroPct = collected.every(r => !r.percentage);
            // if (totalCount > 0 && allZeroPct) {
            //     collected.forEach(r => { r.percentage = (r.count / totalCount) * 100; });
            // }
            setCustomerFeedbackRatings(collected);
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][customer_feedback_analysis] Fetch failed', err);
            setCustomerFeedbackError('Network error');
        }).finally(() => setCustomerFeedbackLoading(false));
        return () => controller.abort();
    }, []);

    // Fetch Customer Feedback Weekly Trend (log response only first)
    React.useEffect(() => {
        const rawBase = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const siteId = localStorage.getItem('selectedSiteId') || '';
        if (!rawBase || !token) {
            if (!rawBase) console.warn('[WeeklyReport][customer_feedback_weekly_trend] baseUrl missing in localStorage');
            if (!token) console.warn('[WeeklyReport][customer_feedback_weekly_trend] token missing in localStorage');
            return;
        }
        const base = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
        const url = `${base.replace(/\/$/, '')}/api/pms/reports/customer_feedback_weekly_trend${siteId ? `?site_id=${encodeURIComponent(siteId)}` : ''}`;
        const controller = new AbortController();
        console.log('[WeeklyReport] Fetching Customer Feedback Weekly Trend:', { url, siteId });
        setWeeklyTrendLoading(true);
        setWeeklyTrendError(null);
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
                console.error('[WeeklyReport][customer_feedback_weekly_trend] JSON parse failed', e, bodyText?.slice(0, 400));
            }
            if (!res.ok) {
                console.error('[WeeklyReport][customer_feedback_weekly_trend] API error', status, parsed);
                setWeeklyTrendError(`API ${status}`);
                setWeeklyTrendRows([]);
                return;
            }
            console.log('[WeeklyReport][customer_feedback_weekly_trend] raw response:', parsed);
            // Map daily_trends -> weeklyTrendRows
            const daily = parsed?.feedback_trend_data?.feedback_weekly_trend?.daily_trends || parsed?.daily_trends;
            if (Array.isArray(daily)) {
                const mapped: WeeklyTrendRow[] = daily.map((d: any) => ({
                    day: d.day_name || d.day || '',
                    date: d.date || '',
                    Excellent: Number(d.feedback_breakdown?.excellent ?? 0),
                    Good: Number(d.feedback_breakdown?.good ?? 0),
                    Average: Number(d.feedback_breakdown?.average ?? 0),
                    Bad: Number(d.feedback_breakdown?.bad ?? 0),
                    Poor: Number(d.feedback_breakdown?.poor ?? 0),
                    total: Number(d.total_feedback ?? 0),
                    satisfaction: Number(d.daily_satisfaction_score ?? 0)
                }));
                setWeeklyTrendRows(mapped);
                console.log('[WeeklyReport][customer_feedback_weekly_trend] mapped weeklyTrendRows:', mapped);
            } else {
                console.warn('[WeeklyReport][customer_feedback_weekly_trend] daily_trends not array');
                setWeeklyTrendRows([]);
            }
        }).catch(err => {
            if (err?.name === 'AbortError') return;
            console.error('[WeeklyReport][customer_feedback_weekly_trend] Fetch failed', err);
            setWeeklyTrendError('Network error');
            setWeeklyTrendRows([]);
        }).finally(() => setWeeklyTrendLoading(false));
        return () => controller.abort();
    }, []);

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
    const overallLoading = topCatLoading || weeklySummaryLoading || priorityLoading || ageingLoading || tatLoading || categoryTatLoading || customerFeedbackLoading || weeklyTrendLoading || assetMgmtLoading || checklistStatusLoading;

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
            <style>{`@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .no-break { break-inside: avoid !important; page-break-inside: avoid !important; } }`}</style>
            <header className="w-full bg-[#F6F4EE] py-6 sm:py-8 mb-6 print:py-4 print:mb-4">
                <h1 className="text-center text-black font-extrabold text-3xl sm:text-4xl print:text-2xl">{title}</h1>
                <p className="mt-2 text-center text-black font-medium text-base sm:text-lg print:text-sm">{weekRangeLabel}</p>
            </header>

            {/* 1. Help Desk Management */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">1. Help Desk Management</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
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
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">2. Priority Wise Tickets</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/2">Priority</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-1/2">Open Tickets</th>
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
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">3. Category Wise Ticket (Top-5)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left">Category</th>
                                    <th colSpan={3} className="bg-[#ECE6DE] w-3/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Count</th>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">% out of total</th>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">% inc./dec. from last week</th>
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

            {/* Tickets Ageing Matrix */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Tickets Ageing Matrix</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/6">Priority</th>
                                    <th colSpan={5} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">No. of Days</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">0-10</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">11-20</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">21-30</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">31-40</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">40 +</th>
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
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">TAT Achievement (Response & Resolution)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    {tatLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <TATPieCard title="Response TAT Overall" achieved={0} breached={0} achievedPctOverride={0} breachedPctOverride={0} />
                            <TATPieCard title="Resolution TAT Overall" achieved={0} breached={0} achievedPctOverride={0} breachedPctOverride={0} />
                        </div>
                    )}
                    {!tatLoading && tatError && (
                        <div className="text-center text-red-600 text-sm">{tatError}</div>
                    )}
                    {!tatLoading && !tatError && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <TATPieCard
                                title={tatResponse?.title || 'Response TAT Overall'}
                                achieved={tatResponse?.achieved ?? 0}
                                breached={tatResponse?.breached ?? 0}
                                achievedPctOverride={tatResponse?.achievedPct}
                                breachedPctOverride={tatResponse?.breachedPct}
                            />
                            <TATPieCard
                                title={tatResolution?.title || 'Resolution TAT Overall'}
                                achieved={tatResolution?.achieved ?? 0}
                                breached={tatResolution?.breached ?? 0}
                                achievedPctOverride={tatResolution?.achievedPct}
                                breachedPctOverride={tatResolution?.breachedPct}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* TAT Achievement Category-Wise */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">TAT Achievement Category-Wise (Top 5 Categories)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-[28%]">Category</th>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[10%]">Total</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[24%]">Resolution TAT</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-[24%]">Resolution TAT %</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breached</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved %</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breached %</th>
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

            {/* Customer Experience Feedback (Dynamic) */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Customer Experience Feedback</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="border border-gray-300 rounded-sm overflow-hidden">
                        {customerFeedbackLoading && (
                            <div className="p-6 text-center text-gray-500 text-sm">Loading feedback...</div>
                        )}
                        {!customerFeedbackLoading && customerFeedbackError && (
                            <div className="p-6 text-center text-red-600 text-sm">{customerFeedbackError}</div>
                        )}
                        {!customerFeedbackLoading && !customerFeedbackError && customerFeedbackRatings.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">No feedback data</div>
                        )}
                        {!customerFeedbackLoading && !customerFeedbackError && customerFeedbackRatings.length > 0 && (
                            <>
                                <div className="grid grid-cols-5">
                                    {customerFeedbackRatings.map(r => (
                                        <div key={r.key} className="p-3 sm:p-4 print:p-2 text-center font-semibold text-black border-b border-gray-300">{r.label}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-5">
                                    {customerFeedbackRatings.map((r, idx) => (
                                        <div key={r.key} className={`p-6 sm:p-8 print:p-4 text-center ${idx ? 'border-l-2 border-white' : ''}`} style={{ background: customerFeedbackColorPalette[r.key] || '#EDE7DB' }}>
                                            <div className="text-3xl sm:text-4xl font-extrabold text-black">{r.count.toLocaleString()}</div>
                                            <div className="mt-2 text-sm sm:text-base text-black/80">{r.percentage}%</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Customer Feedback */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Customer Feedback</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    {(() => {
                        const palette: Record<string, string> = { Excellent: '#EDE7DB', Good: '#D9D3C4', Average: '#C4B89D', Bad: '#C1A593', Poor: '#D5DBDB' };
                        const categories = Object.keys(palette);
                        if (weeklyTrendLoading) {
                            return <div className="bg-[#F6F4EE] rounded-sm p-6 sm:p-8 text-center text-gray-500 text-sm">Loading weekly trend...</div>;
                        }
                        if (weeklyTrendError) {
                            return <div className="bg-[#F6F4EE] rounded-sm p-6 sm:p-8 text-center text-red-600 text-sm">{weeklyTrendError}</div>;
                        }
                        const allZero = weeklyTrendRows.length > 0 && weeklyTrendRows.every(r => (r.total === 0));
                        return (
                            <div className="bg-[#F6F4EE] rounded-sm p-6 sm:p-8">
                                <h3 className="text-black font-semibold text-base sm:text-lg mb-4 flex items-center gap-4">Weekly Trend {allZero && <span className="text-xs sm:text-sm text-gray-500 font-normal">(No feedback data for this period)</span>}</h3>
                                <div className="w-full h-72 sm:h-80 print:h-64 relative">
                                    {weeklyTrendRows.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">No data</div>
                                    )}
                                    {weeklyTrendRows.length > 0 && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyTrendRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                                                <CartesianGrid stroke="#DDD" strokeDasharray="3 3" />
                                                <XAxis dataKey="day" stroke="#000" fontSize={12} />
                                                <YAxis stroke="#000" fontSize={12} allowDecimals={false} />
                                                <Tooltip cursor={{ fill: '#00000008' }} wrapperStyle={{ fontSize: '12px' }} />
                                                {categories.map(cat => (
                                                    <Bar key={cat} dataKey={cat} stackId="fb" fill={palette[cat]} radius={[4, 4, 0, 0]} />
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm print:text-[10px]">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center gap-2">
                                            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: palette[cat] }} />
                                            <span className="text-black font-medium">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* 4. Asset Management */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">4. Asset Management</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
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
                            <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-[16%]">Metric</th>
                                        <th colSpan={3} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[42%]">Critical</th>
                                        <th colSpan={3} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-[42%]">Non-Critical</th>
                                    </tr>
                                    <tr>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Total</th>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breakdown</th>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Total</th>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                        <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breakdown</th>
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
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">5. Task Status</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/3">Task Status</th>
                                    <th colSpan={3} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Non-Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total</th>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Category-Wise Overdue Status (Top 5) - dynamic */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Category-Wise Overdue Status (Top 5)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="bg-[#ECE6DE] font-semibold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-left w-3/4">Category Of Checklist (PPM)</th>
                                    <th className="bg-[#ECE6DE] font-semibold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-center w-1/4">Overdue Count</th>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WeeklyReport;