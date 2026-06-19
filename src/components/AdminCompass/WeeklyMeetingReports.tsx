import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { getWeek } from 'date-fns'
import {
    Calendar,
    ChartColumn,
    Loader2,
    RefreshCw,
    TrendingUp,
    Users,
    CheckCircle2,
    XCircle,
    BarChart3,
    Trophy,
    CheckSquare,
    Zap,
    Target,
    MessageSquare,
    Award,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'

// ── Types ──────────────────────────────────────────────────────────────────────
interface WeeklyTrendItem {
    week: string
    label: string
    submitted: number
}

interface ReportConfig {
    id: number
    name: string
    meeting_time: string
    day_of_week: number
    duration_minutes: number
    meeting_head: { id: number; name: string }
}

interface ReportData {
    config: ReportConfig
    submission_rate: number
    total_submitted: number
    total_expected: number
    weekly_trend: WeeklyTrendItem[]
}

interface MeetingConfig {
    id: number
    name: string
    is_default?: boolean
    active?: boolean
}

const pickDefaultMeeting = (list: MeetingConfig[]) => {
    const defaultMeeting = list.find((meeting) => meeting.is_default && meeting.active !== false)
    const firstActiveMeeting = list.find((meeting) => meeting.active !== false)
    return defaultMeeting || firstActiveMeeting || list[0]
}

const PERIOD_OPTIONS = [
    { value: 'last_4_weeks',  label: 'Last 4 Weeks' },
    { value: 'last_8_weeks',  label: 'Last 8 Weeks' },
    { value: 'last_12_weeks', label: 'Last 12 Weeks' },
    { value: 'last_6_months', label: 'Last 6 Months' },
]

// How many weeks of reports to aggregate scores over, per period.
const PERIOD_WEEKS: Record<string, number> = {
    last_4_weeks: 4,
    last_8_weeks: 8,
    last_12_weeks: 12,
    last_6_months: 26,
}

// ── Score breakdown (mirrors WeeklyReports.tsx points system, total = 100) ──────
const SCORE_CATEGORIES = [
    { key: 'weekly_kpi',   label: 'Weekly KPI',   max: 20, icon: BarChart3 },
    { key: 'daily_kpi',    label: 'Daily KPI',    max: 10, icon: TrendingUp },
    { key: 'achievements', label: 'Achievements', max: 6,  icon: Trophy },
    { key: 'tasks',        label: 'Tasks',        max: 10, icon: CheckSquare },
    { key: 'sop',          label: 'SOPs',         max: 20, icon: Zap },
    { key: 'planning',     label: 'Planning',     max: 20, icon: Target },
    { key: 'remarks',      label: 'Remarks',      max: 14, icon: MessageSquare },
] as const

type ScoreKey = (typeof SCORE_CATEGORIES)[number]['key']

interface ScoreSummary {
    averages: Record<ScoreKey, number>
    total: number
    reportCount: number
}

const toNumber = (value: any) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const getReportData = (report: any) => report?.weekly_report?.report_data || report?.report_data || {}

const isSubmittedReport = (report: any) => {
    const status = report?.weekly_report?.status || report?.status
    return status === 'submitted' || report?.weekly_report != null
}

// Mirrors WeeklyReports.tsx "Weekly KPI Achievement (Max 20 points)".
const calculateWeeklyKpiScore = (pastKpis: any[]) => {
    if (!Array.isArray(pastKpis) || pastKpis.length === 0) return null
    const percentages = pastKpis.map((kpi) => {
        const actual = toNumber(kpi?.actual_value ?? kpi?.actual ?? kpi?.value)
        const target = toNumber(kpi?.target_value ?? kpi?.target ?? kpi?.goal)
        if (target === 0) return actual > 0 ? 100 : 0
        return Math.min((actual / target) * 100, 100)
    })
    const average = percentages.reduce((sum, value) => sum + value, 0) / percentages.length
    return Math.round(((20 * average) / 100) * 10) / 10
}

const REMARK_BONUS_TYPES = ['breakthrough', 'breakdown', 'clientFeedback', 'employeeFeedback']

const getRemarkType = (remark: any): string => {
    if (!remark || typeof remark === 'string') return 'remark'
    if (typeof remark === 'object') {
        if (remark.type) return String(remark.type)
        return Object.keys(remark)[0] || 'remark'
    }
    return 'remark'
}

// Mirrors WeeklyReports.tsx "Remarks Logged (Max 14 points)".
const calculateRemarksScore = (remarks: any) => {
    if (!Array.isArray(remarks) || remarks.length === 0) return null
    const score = remarks.reduce(
        (sum, remark) => sum + (REMARK_BONUS_TYPES.includes(getRemarkType(remark)) ? 3 : 1),
        0,
    )
    return Math.min(score, 14)
}

// Mirrors WeeklyReports.tsx "Tasks & Issues (Max 10 points)".
const calculateTasksScore = (items: any) => {
    if (!Array.isArray(items) || items.length === 0) return null
    const statusOf = (item: any) => String(item?.status || '').toLowerCase()
    const closed = items.filter((i) => ['completed', 'complete', 'closed', 'done'].includes(statusOf(i))).length
    const open = items.filter((i) => ['open', 'reopen', 'reopened', 'pending'].includes(statusOf(i))).length
    const overdue = items.filter((i) => ['overdue', 'overdued'].includes(statusOf(i))).length
    const positive = closed * 2
    const openPenalty = Math.max(open * -0.5, -3)
    const overduePenalty = Math.max(overdue * -2, -5)
    return Math.min(Math.max(positive + openPenalty + overduePenalty, 0), 10)
}

// Per-report category scores, preferring the saved section value and falling back
// to a value derived from the logged items (matching WeeklyReports.tsx).
const getReportScores = (report: any): Record<ScoreKey, number> => {
    const reportData = getReportData(report)
    const sections = reportData.sections || {}

    const tasks = sections.tasks_issues_todos ?? sections.tasks_issues ?? calculateTasksScore(reportData.tasks_issues)
    const remarks = sections.remarks ?? calculateRemarksScore(reportData.remarks)
    const weeklyKpi = sections.weekly_kpi_achievement ?? calculateWeeklyKpiScore(Array.isArray(reportData.past_kpis) ? reportData.past_kpis : [])

    return {
        weekly_kpi: toNumber(weeklyKpi),
        daily_kpi: toNumber(sections.daily_kpi_achievement),
        achievements: toNumber(sections.starred_achievements),
        tasks: toNumber(tasks),
        sop: toNumber(sections.sop_health),
        planning: toNumber(sections.planning),
        remarks: toNumber(remarks),
    }
}

const getReportTotal = (report: any, scores: Record<ScoreKey, number>) => {
    const reportData = getReportData(report)
    if (reportData.total_score !== undefined && reportData.total_score !== null) {
        return toNumber(reportData.total_score)
    }
    const sum = SCORE_CATEGORIES.reduce((acc, category) => acc + scores[category.key], 0)
    return Math.min(sum, 100)
}

const buildScoreSummary = (reports: any[]): ScoreSummary | null => {
    const submitted = reports.filter(isSubmittedReport)
    if (submitted.length === 0) return null

    const totals = SCORE_CATEGORIES.reduce((acc, category) => {
        acc[category.key] = 0
        return acc
    }, {} as Record<ScoreKey, number>)
    let overall = 0

    submitted.forEach((report) => {
        const scores = getReportScores(report)
        SCORE_CATEGORIES.forEach((category) => {
            totals[category.key] += scores[category.key]
        })
        overall += getReportTotal(report, scores)
    })

    const averages = SCORE_CATEGORIES.reduce((acc, category) => {
        acc[category.key] = Math.round((totals[category.key] / submitted.length) * 10) / 10
        return acc
    }, {} as Record<ScoreKey, number>)

    return {
        averages,
        total: Math.round((overall / submitted.length) * 10) / 10,
        reportCount: submitted.length,
    }
}

const getWeekString = (date: Date): string => {
    const year = date.getFullYear()
    const week = String(getWeek(date)).padStart(2, '0')
    return `${year}-W${week}`
}

// Week strings for the last N weeks (current week first), matching the API's `week` param.
const getRecentWeekStrings = (weeks: number): string[] => {
    const result: string[] = []
    const base = new Date()
    for (let i = 0; i < weeks; i += 1) {
        result.push(getWeekString(new Date(base.getTime() - i * 7 * 24 * 60 * 60 * 1000)))
    }
    return result
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
            <p className="font-bold text-gray-700 mb-1">{label}</p>
            <p className="text-[#DA7756] font-semibold">
                Submitted: <span className="text-gray-800">{payload[0].value}</span>
            </p>
        </div>
    )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface WeeklyMeetingReportsProps {
    selectedMeetingId?: string;
    onSelectedMeetingChange?: (meetingId: string) => void;
}

const WeeklyMeetingReports = ({ selectedMeetingId: externalSelectedMeetingId, onSelectedMeetingChange }: WeeklyMeetingReportsProps = {}) => {
    const [meetingId, setMeetingIdState]   = useState(externalSelectedMeetingId || '')
    const [period, setPeriod]         = useState('last_12_weeks')
    const [meetings, setMeetings]     = useState<MeetingConfig[]>([])
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [loading, setLoading]       = useState(false)
    const [scoreSummary, setScoreSummary] = useState<ScoreSummary | null>(null)
    const [scoreLoading, setScoreLoading] = useState(false)

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    })
    const apiBase = () => `https://${localStorage.getItem('baseUrl')}`

    useEffect(() => {
        if (!externalSelectedMeetingId) return;
        setMeetingIdState((current) =>
            current === externalSelectedMeetingId ? current : externalSelectedMeetingId
        );
    }, [externalSelectedMeetingId]);

    const setMeetingId = (nextMeetingId: string) => {
        setMeetingIdState(nextMeetingId);
        if (nextMeetingId) onSelectedMeetingChange?.(String(nextMeetingId));
    };

    // Fetch meeting configs for the dropdown
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await axios.get(`${apiBase()}/weekly_meeting_configs.json`, { headers: getHeaders() })
                const raw = res.data
                let list: MeetingConfig[] = []
                if (Array.isArray(raw))              list = raw
                else if (Array.isArray(raw?.data))   list = raw.data
                else if (raw?.data?.id)              list = [raw.data]
                setMeetings(list)
                if (list.length > 0) {
                    const nextMeeting = pickDefaultMeeting(list)
                    setMeetingIdState(prev => {
                        if (prev) return prev
                        const nextMeetingId = String(nextMeeting.id)
                        onSelectedMeetingChange?.(nextMeetingId)
                        return nextMeetingId
                    })
                }
            } catch (err) {
                console.error('Failed to load meetings', err)
            }
        }
        fetchMeetings()
    }, [])

    // Fetch report data whenever filters change
    const fetchReport = useCallback(async () => {
        if (!meetingId) {
            setReportData(null)
            return
        }
        setLoading(true)
        try {
            const params: Record<string, string> = { period, meeting_id: meetingId }

            const res = await axios.get(`${apiBase()}/user_journals/weekly_meeting_report.json`, {
                headers: getHeaders(),
                params,
            })
            setReportData(res.data?.data ?? res.data ?? null)
        } catch (err) {
            console.error('Failed to load report', err)
            toast.error('Failed to load meeting report')
        } finally {
            setLoading(false)
        }
    }, [meetingId, period])

    useEffect(() => { fetchReport() }, [fetchReport])

    // Aggregate per-category scores from individual weekly reports across the period.
    const fetchScoreSummary = useCallback(async () => {
        if (!meetingId) {
            setScoreSummary(null)
            return
        }
        setScoreLoading(true)
        try {
            const weeks = getRecentWeekStrings(PERIOD_WEEKS[period] ?? 12)
            const responses = await Promise.all(
                weeks.map((week) =>
                    axios
                        .get(`${apiBase()}/user_journals/weekly_meeting.json`, {
                            headers: getHeaders(),
                            params: { meeting_id: meetingId, week },
                        })
                        .then((res) => res.data?.data ?? res.data ?? null)
                        .catch(() => null),
                ),
            )

            const allReports = responses.flatMap((data: any) =>
                Array.isArray(data?.member_reports) ? data.member_reports : [],
            )
            setScoreSummary(buildScoreSummary(allReports))
        } catch (err) {
            console.error('Failed to load score breakdown', err)
            setScoreSummary(null)
        } finally {
            setScoreLoading(false)
        }
    }, [meetingId, period])

    useEffect(() => { fetchScoreSummary() }, [fetchScoreSummary])

    const trend      = reportData?.weekly_trend ?? []
    const maxSubmitted = Math.max(...trend.map(t => t.submitted), 1)

    return (
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-4 shadow-sm sm:p-6">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Weekly Meeting Reports & Analytics</h2>
                    <p className="text-neutral-500 text-sm mt-1">
                        {reportData?.config
                            ? `${reportData.config.name} · ${reportData.config.meeting_head?.name}`
                            : 'Comprehensive insights for weekly meetings'}
                    </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                    {/* Meeting selector */}
                    <Select value={meetingId} onValueChange={setMeetingId}>
                        <SelectTrigger className="h-9 w-full rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm sm:w-[190px]">
                            <SelectValue placeholder="Select Meeting" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DA7756]/20">
                            {meetings.map(m => (
                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Period selector */}
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-9 w-full rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm sm:w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DA7756]/20">
                            {PERIOD_OPTIONS.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Refresh */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => { fetchReport(); fetchScoreSummary(); }}
                        disabled={loading}
                        className="h-9 w-9 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4] shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="w-8 h-8 text-[#DA7756] animate-spin" />
                    <p className="text-sm text-neutral-400">Loading report…</p>
                </div>

            ) : !reportData ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-[#DA7756]/15 bg-[#fef6f4] py-20 text-center">
                    <div className="rounded-2xl bg-white p-4 border border-[#DA7756]/15">
                        <Calendar className="w-12 h-12 text-[#DA7756]/30" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[#1a1a1a] font-bold text-lg">No report data found</h3>
                        <p className="text-neutral-500 text-sm">Select a meeting and period to view analytics</p>
                    </div>
                </div>

            ) : (
                <>
                    {/* ── Stat cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Submission rate */}
                        <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-5 shadow-sm flex items-center gap-4">
                            <div className="rounded-xl bg-[#FAECE7] p-3">
                                <TrendingUp className="w-5 h-5 text-[#DA7756]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Submission Rate</p>
                                <p className="text-2xl font-bold text-[#DA7756]">{reportData.submission_rate.toFixed(1)}%</p>
                            </div>
                        </div>

                        {/* Total submitted */}
                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm flex items-center gap-4">
                            <div className="rounded-xl bg-green-50 p-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Total Submitted</p>
                                <p className="text-2xl font-bold text-green-600">{reportData.total_submitted}</p>
                            </div>
                        </div>

                        {/* Total expected */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4">
                            <div className="rounded-xl bg-gray-50 p-3">
                                <Users className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Total Expected</p>
                                <p className="text-2xl font-bold text-gray-700">{reportData.total_expected}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Average score breakdown ── */}
                    <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-2 mb-5">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-[#FAECE7] p-1.5">
                                    <Award className="w-4 h-4 text-[#DA7756]" />
                                </div>
                                <h3 className="text-sm font-bold text-neutral-700">Average Score Breakdown</h3>
                            </div>
                            {scoreSummary && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-neutral-400">
                                        Avg of {scoreSummary.reportCount} report{scoreSummary.reportCount === 1 ? '' : 's'}
                                    </span>
                                    <span className="rounded-full bg-[#DA7756] px-3 py-1 text-sm font-bold text-white">
                                        {scoreSummary.total}/100
                                    </span>
                                </div>
                            )}
                        </div>

                        {scoreLoading ? (
                            <div className="flex items-center justify-center h-32 gap-2 text-sm text-neutral-400">
                                <Loader2 className="w-4 h-4 animate-spin" /> Calculating scores…
                            </div>
                        ) : !scoreSummary ? (
                            <div className="flex items-center justify-center h-32 text-sm text-neutral-400">
                                No submitted reports to score in this period
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {SCORE_CATEGORIES.map((category) => {
                                    const value = scoreSummary.averages[category.key]
                                    const pct = category.max > 0 ? Math.min((value / category.max) * 100, 100) : 0
                                    const Icon = category.icon
                                    return (
                                        <div
                                            key={category.key}
                                            className="rounded-xl border border-[#DA7756]/10 bg-[#fffaf8] p-4"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                                                    <Icon className="w-3.5 h-3.5 text-[#DA7756]" />
                                                    {category.label}
                                                </span>
                                                <span className="text-sm font-bold text-[#DA7756]">
                                                    {value}<span className="text-neutral-400 font-semibold">/{category.max}</span>
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-[#EDE5DF] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-[#DA7756] transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Weekly trend chart ── */}
                    <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="rounded-lg bg-[#FAECE7] p-1.5">
                                <ChartColumn className="w-4 h-4 text-[#DA7756]" />
                            </div>
                            <h3 className="text-sm font-bold text-neutral-700">Weekly Submission Trend</h3>
                        </div>

                        {trend.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
                                No trend data available
                            </div>
                        ) : (
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={trend}
                                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece8" />
                                        <XAxis
                                            dataKey="label"
                                            fontSize={11}
                                            tick={{ fill: '#9ca3af' }}
                                            axisLine={false}
                                            tickLine={false}
                                            padding={{ left: 20, right: 20 }}
                                        />
                                        <YAxis
                                            width={32}
                                            allowDecimals={false}
                                            fontSize={11}
                                            tick={{ fill: '#9ca3af' }}
                                            axisLine={false}
                                            tickLine={false}
                                            domain={[0, maxSubmitted + 1]}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ fill: 'rgba(218,119,86,0.06)' }}
                                        />
                                        <Bar dataKey="submitted" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                            {trend.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.submitted > 0 ? '#DA7756' : '#EDE5DF'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-sm bg-[#DA7756]" />
                                Has submissions
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-sm bg-[#EDE5DF]" />
                                No submissions
                            </span>
                        </div>
                    </div>

                    {/* ── Per-week table ── */}
                    <div className="rounded-2xl border border-[#DA7756]/15 bg-white overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h3 className="text-sm font-bold text-neutral-700">Weekly Breakdown</h3>
                        </div>
                        <div className="space-y-3 p-3 sm:hidden">
                            {trend.map((row, idx) => {
                                const hasSubmissions = row.submitted > 0

                                return (
                                    <div
                                        key={`${row.week}-${idx}`}
                                        className="rounded-xl border border-[#DA7756]/10 bg-[#fffaf8] p-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-[#DA7756]">{row.week}</p>
                                                <p className="mt-1 break-words text-xs font-medium text-neutral-500">
                                                    {row.label}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                    hasSubmissions
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-600'
                                                }`}
                                            >
                                                {hasSubmissions ? (
                                                    <CheckCircle2 className="h-3 w-3" />
                                                ) : (
                                                    <XCircle className="h-3 w-3" />
                                                )}
                                                {hasSubmissions ? 'Submitted' : 'Missed'}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
                                            <span className="text-xs font-semibold text-neutral-500">Submitted</span>
                                            <span className="text-sm font-bold text-neutral-800">{row.submitted}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full min-w-[620px] text-sm">
                            <thead className="bg-[#fef6f4]">
                                <tr>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Week</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Period Start</th>
                                    <th className="text-right px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Submitted</th>
                                    <th className="text-right px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {trend.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#fef6f4]/40 transition-colors">
                                        <td className="px-5 py-3 font-bold text-[#DA7756]">{row.week}</td>
                                        <td className="px-5 py-3 text-neutral-500">{row.label}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-700">{row.submitted}</td>
                                        <td className="px-5 py-3 text-right">
                                            {row.submitted > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                                                    <CheckCircle2 className="w-3 h-3" /> Submitted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                                                    <XCircle className="w-3 h-3" /> Missed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default WeeklyMeetingReports
