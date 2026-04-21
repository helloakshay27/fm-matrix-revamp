import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Calendar, ChartColumn, Loader2, RefreshCw, TrendingUp, Users, CheckCircle2, XCircle } from 'lucide-react'
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
}

const PERIOD_OPTIONS = [
    { value: 'last_4_weeks',  label: 'Last 4 Weeks' },
    { value: 'last_8_weeks',  label: 'Last 8 Weeks' },
    { value: 'last_12_weeks', label: 'Last 12 Weeks' },
    { value: 'last_6_months', label: 'Last 6 Months' },
]

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
const WeeklyMeetingReports = () => {
    const [meetingId, setMeetingId]   = useState('all')
    const [period, setPeriod]         = useState('last_12_weeks')
    const [meetings, setMeetings]     = useState<MeetingConfig[]>([])
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [loading, setLoading]       = useState(false)

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    })
    const apiBase = () => `https://${localStorage.getItem('baseUrl')}`

    // Fetch meeting configs for the dropdown
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await axios.get(`${apiBase()}/weekly_meeting_configs`, { headers: getHeaders() })
                const raw = res.data
                let list: MeetingConfig[] = []
                if (Array.isArray(raw))              list = raw
                else if (Array.isArray(raw?.data))   list = raw.data
                else if (raw?.data?.id)              list = [raw.data]
                setMeetings(list)
                // Auto-select first meeting if available
                if (list.length > 0) {
                    setMeetingId(prev => prev === 'all' ? String(list[0].id) : prev)
                }
            } catch (err) {
                console.error('Failed to load meetings', err)
            }
        }
        fetchMeetings()
    }, [])

    // Fetch report data whenever filters change
    const fetchReport = useCallback(async () => {
        setLoading(true)
        try {
            const params: Record<string, string> = { period }
            if (meetingId !== 'all') params.meeting_id = meetingId

            const res = await axios.get(`${apiBase()}/user_journals/weekly_meeting_report`, {
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

    const trend      = reportData?.weekly_trend ?? []
    const maxSubmitted = Math.max(...trend.map(t => t.submitted), 1)

    return (
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">

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
                <div className="flex items-center gap-2">
                    {/* Meeting selector */}
                    <Select value={meetingId} onValueChange={setMeetingId}>
                        <SelectTrigger className="w-[190px] h-9 rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm">
                            <SelectValue placeholder="Select Meeting" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DA7756]/20">
                            <SelectItem value="all">All Meetings</SelectItem>
                            {meetings.map(m => (
                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Period selector */}
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[150px] h-9 rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm">
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
                        onClick={fetchReport}
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
                        <table className="w-full text-sm">
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
                </>
            )}
        </div>
    )
}

export default WeeklyMeetingReports
