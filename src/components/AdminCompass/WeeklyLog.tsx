import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Search,
    RefreshCw,
    Layers,
    Eye,
    FileText,
    ArrowUpDown,
    Star,
    Loader2,
    X,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// ── Types ──────────────────────────────────────────────────────────────────────
interface WeeklyLogReport {
    week_of: string;
    user_id: number;
    name: string;
    email: string;
    department: string | null;
    department_id: number | null;
    score: number;
    rating: number;
    status: string;
    submitted_at: string | null;
    journal_id: number | null;
}

interface WeeklyLogData {
    week: string;
    week_of: string;
    week_range: string;
    year: number;
    config: Record<string, unknown>;
    submitted: number;
    total: number;
    reports: WeeklyLogReport[];
}

interface Department {
    id: number;
    department_name: string;
}

interface MeetingConfig {
    id: number;
    name: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getISOWeekStr(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getDateFromISOWeekStr(weekStr: string): Date {
    const [yearPart, weekPart] = weekStr.split('-W');
    const year = Number(yearPart);
    const week = Number(weekPart);
    if (!Number.isFinite(year) || !Number.isFinite(week)) return new Date();

    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dayOfWeek = simple.getUTCDay() || 7;
    if (dayOfWeek <= 4) {
        simple.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
    } else {
        simple.setUTCDate(simple.getUTCDate() + 8 - dayOfWeek);
    }
    return new Date(simple.getUTCFullYear(), simple.getUTCMonth(), simple.getUTCDate());
}

function generateWeekOptions(count = 14): Array<{ value: string; label: string }> {
    const options: Array<{ value: string; label: string }> = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const weekStr = getISOWeekStr(date);
        // Monday of that week
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        const monthShort = monday.toLocaleString('en-US', { month: 'short' });
        const weekNum = parseInt(weekStr.split('-W')[1], 10);
        options.push({ value: weekStr, label: `Wk ${weekNum}, ${monthShort} ${monday.getDate()}` });
    }
    return options;
}

const STATUS_STYLE: Record<string, string> = {
    submitted: 'bg-green-100 text-green-700 border-green-200',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
    missed:    'bg-red-100 text-red-700 border-red-200',
};

const getBaseUrl = () => {
    const rawBase = localStorage.getItem('baseUrl') || '';
    if (!rawBase) return '';
    return rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase.replace(/\/$/, '') : `https://${rawBase.replace(/\/$/, '')}`;
};

const isSubmittedReport = (entry: { status?: string; journal_id?: number | null }) =>
    entry.status === 'submitted' && !!entry.journal_id;

const formatReportValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value.title || value.text || value.name || JSON.stringify(value);
    return String(value ?? '-');
};

const renderDetailReviewValue = (value: any) => {
    if (Array.isArray(value)) {
        if (value.length === 0) return '-';
        return value.map(formatReportValue).join(', ');
    }
    if (value && typeof value === 'object') return JSON.stringify(value);
    return String(value ?? '-');
};

const ReportDetailsModal = ({ entry, onClose }: { entry: WeeklyLogReport; onClose: () => void }) => {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!entry.journal_id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${getBaseUrl()}/user_journals/${entry.journal_id}.json`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setDetails(res.data?.data ?? res.data ?? null);
            } catch (err) {
                console.error('Failed to load weekly report details', err);
                toast.error('Failed to load report details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [entry.journal_id]);

    const reportData = details?.report_data || details?.weekly_report?.report_data || details?.journal?.report_data || {};
    const achievements = Array.isArray(reportData.achievements) ? reportData.achievements : [];
    const plans = reportData.upcoming_week_plan || reportData.tasks || [];
    const remarks = Array.isArray(reportData.remarks) ? reportData.remarks : [];
    const detailedReviews = Array.isArray(reportData.detailed_reviews) ? reportData.detailed_reviews : [];
    const kpiSummary = reportData.kpi_summary && typeof reportData.kpi_summary === 'object' ? reportData.kpi_summary : {};

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 px-4 pb-6 pt-20 sm:pt-8">
            <div className="w-full max-w-3xl max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{entry.name}</h3>
                        <p className="text-xs text-gray-500">{entry.email}</p>
                    </div>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-9rem)] overflow-y-auto p-5 space-y-4">
                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-500">
                            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#DA7756]" />
                            Loading report...
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-[11px] font-bold text-gray-400">Score</p>
                                    <p className="text-sm font-bold text-gray-800">{reportData.total_score ?? entry.score ?? '-'}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-[11px] font-bold text-gray-400">Department</p>
                                    <p className="text-sm font-bold text-gray-800">{entry.department || 'No Dept.'}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-[11px] font-bold text-gray-400">Submitted</p>
                                    <p className="text-sm font-bold text-gray-800">{entry.submitted_at ? new Date(entry.submitted_at).toLocaleString() : '-'}</p>
                                </div>
                            </div>

                            <section className="rounded-xl border border-gray-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-gray-800">Meeting Summary</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    <div><span className="font-bold text-gray-500">Total:</span> {reportData.total_members ?? '-'}</div>
                                    <div><span className="font-bold text-gray-500">Submitted:</span> {reportData.total_submitted ?? '-'}</div>
                                    <div><span className="font-bold text-gray-500">Missed:</span> {reportData.total_missed ?? '-'}</div>
                                </div>
                            </section>

                            <section className="rounded-xl border border-indigo-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-indigo-700">KPI Summary</h4>
                                {Object.keys(kpiSummary).length > 0 ? (
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {Object.entries(kpiSummary).map(([name, data]: [string, any]) => (
                                            <div key={name} className="rounded-lg bg-gray-50 p-3">
                                                <p className="font-bold break-words">{name}</p>
                                                <p className="text-xs text-gray-500">Achieved: {data?.achieved ?? 0}/{data?.total ?? 0}</p>
                                                {Array.isArray(data?.names) && <p className="text-xs text-gray-500 break-words">Members: {data.names.join(', ')}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400">No KPI summary recorded</p>}
                            </section>

                            <section className="rounded-xl border border-purple-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-purple-700">Detailed Reviews</h4>
                                {detailedReviews.length > 0 ? (
                                    <div className="space-y-3">
                                        {detailedReviews.map((review: any, idx: number) => (
                                            <div key={idx} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                                <p className="font-bold text-gray-900 break-words">{review.name || `Member ${idx + 1}`}</p>
                                                {Object.entries(review).filter(([key]) => key !== 'name').map(([key, value]) => (
                                                    <p key={key} className="break-words">
                                                        <span className="font-bold capitalize text-gray-500">{key.replace(/_/g, ' ')}:</span> {renderDetailReviewValue(value)}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400">No detailed reviews recorded</p>}
                            </section>

                            <section className="rounded-xl border border-green-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-green-700">Top Wins</h4>
                                {achievements.length > 0 ? (
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {achievements.map((item: any, idx: number) => <li key={idx} className="break-words">• {formatReportValue(item)}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-gray-400">No achievements recorded</p>}
                            </section>

                            <section className="rounded-xl border border-blue-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-blue-700">Next Week Plan</h4>
                                {Array.isArray(plans) && plans.length > 0 ? (
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {plans.map((plan: any, idx: number) => (
                                            <div key={idx}>
                                                {plan && typeof plan === 'object' && !Array.isArray(plan)
                                                    ? Object.entries(plan).map(([day, items]: [string, any]) => (
                                                        <div key={day} className="mb-2">
                                                            <p className="font-bold uppercase text-gray-500">{day}</p>
                                                            {(Array.isArray(items) ? items : []).map((item, itemIdx) => (
                                                                <p key={itemIdx} className="break-words">• {formatReportValue(item)}</p>
                                                            ))}
                                                        </div>
                                                    ))
                                                    : <p className="break-words">• {formatReportValue(plan)}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400">No plan recorded</p>}
                            </section>

                            <section className="rounded-xl border border-orange-100 p-4">
                                <h4 className="mb-3 text-sm font-bold text-orange-700">Remarks</h4>
                                {remarks.length > 0 ? (
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {remarks.map((item: any, idx: number) => <li key={idx} className="break-words">• {formatReportValue(item)}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-gray-400">No remarks recorded</p>}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Component ──────────────────────────────────────────────────────────────────
interface WeeklyLogProps {
    initialWeekDate?: Date;
    onWeekDateChange?: (date: Date) => void;
}

const WeeklyLog = ({ initialWeekDate, onWeekDateChange }: WeeklyLogProps = {}) => {
    const weekOptions = generateWeekOptions(14);
    const currentWeek = getISOWeekStr(initialWeekDate || new Date());

    // Filter state
    const [search, setSearch]             = useState('');
    const [meetingId, setMeetingId]       = useState('all');
    const [departmentId, setDeptId]       = useState('all');
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);
    const [groupByDept, setGroupByDept]   = useState(false);

    const debouncedSearch = useDebounce(search, 600);

    // Data state
    const [logData, setLogData]           = useState<WeeklyLogData | null>(null);
    const [departments, setDepartments]   = useState<Department[]>([]);
    const [meetings, setMeetings]         = useState<MeetingConfig[]>([]);
    const [loading, setLoading]           = useState(false);
    const [selectedReport, setSelectedReport] = useState<WeeklyLogReport | null>(null);

    useEffect(() => {
        if (!initialWeekDate) return;
        const incomingWeek = getISOWeekStr(initialWeekDate);
        setSelectedWeek((current) =>
            current === incomingWeek ? current : incomingWeek
        );
    }, [initialWeekDate]);

    useEffect(() => {
        onWeekDateChange?.(getDateFromISOWeekStr(selectedWeek));
    }, [selectedWeek, onWeekDateChange]);

    // ── API helpers ──
    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });
    const baseUrl = getBaseUrl;

    // Fetch departments on mount
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${baseUrl()}/pms/departments.json`, { headers: getHeaders() });
                const depts = res.data?.departments ?? res.data ?? [];
                setDepartments(Array.isArray(depts) ? depts : []);
            } catch (err) {
                console.error('Failed to load departments', err);
            }
        };
        fetchDepts();
    }, []);

    // Fetch meeting configs on mount
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await axios.get(`${baseUrl()}/weekly_meeting_configs`, { headers: getHeaders() });
                const raw = res.data;
                // Handle array response or { data: [...] } or { data: { id, name } } (single)
                let list: MeetingConfig[] = [];
                if (Array.isArray(raw)) {
                    list = raw;
                } else if (Array.isArray(raw?.data)) {
                    list = raw.data;
                } else if (raw?.data && typeof raw.data === 'object') {
                    list = [raw.data];
                }
                setMeetings(list);
                if (list.length > 0) {
                    const defaultMeeting = list.find((meeting: any) => meeting.is_default && meeting.active !== false);
                    const firstActiveMeeting = list.find((meeting: any) => meeting.active !== false);
                    const nextMeeting = defaultMeeting || firstActiveMeeting || list[0];
                    setMeetingId((current) => current === 'all' ? String(nextMeeting.id) : current);
                }
            } catch (err) {
                console.error('Failed to load meetings', err);
            }
        };
        fetchMeetings();
    }, []);

    // Fetch weekly log whenever filters change
    const fetchLog = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { week: selectedWeek };
            if (meetingId !== 'all')      params.meeting_id    = meetingId;
            if (departmentId !== 'all')   params.department_id = departmentId;
            if (debouncedSearch.trim())   params.search        = debouncedSearch.trim();
            if (groupByDept)              params.group_by_dept = 'true';

            const res = await axios.get(`${baseUrl()}/user_journals/weekly_log`, {
                headers: getHeaders(),
                params,
            });
            setLogData(res.data?.data ?? res.data ?? null);
        } catch (err) {
            console.error('Failed to load weekly log', err);
            toast.error('Failed to load weekly log');
        } finally {
            setLoading(false);
        }
    }, [selectedWeek, meetingId, departmentId, debouncedSearch, groupByDept]);

    useEffect(() => { fetchLog(); }, [fetchLog]);

    const reports = logData?.reports ?? [];

    return (
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-4 sm:p-6 shadow-sm max-w-full overflow-x-hidden">

            {/* ── Header + Filter bar ── */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 min-w-fit">
                    <div className="rounded-xl border border-[#DA7756]/15 bg-[#FAECE7] p-2">
                        <FileText className="w-5 h-5 text-[#DA7756]" />
                    </div>
                    <h2 className="text-sm font-bold text-[#1a1a1a] leading-tight">
                        Weekly Review<br />Log
                    </h2>
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-2 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DA7756]/50" />
                        <Input
                            placeholder="Search by user, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="h-8 rounded-xl border border-[#DA7756]/25 bg-white pl-10 placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Department */}
                    <Select value={departmentId} onValueChange={setDeptId}>
                        <SelectTrigger className="w-[150px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map(d => (
                                <SelectItem key={d.id} value={String(d.id)}>
                                    {d.department_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Meeting */}
                    <Select value={meetingId} onValueChange={setMeetingId}>
                        <SelectTrigger className="w-[150px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Meeting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Meetings</SelectItem>
                            {meetings.map(m => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Week */}
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                        <SelectTrigger className="w-[175px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Select Week" />
                        </SelectTrigger>
                        <SelectContent>
                            {weekOptions.map(w => (
                                <SelectItem key={w.value} value={w.value}>
                                    {w.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Group by dept toggle */}
                    <Button
                        variant="outline"
                        onClick={() => setGroupByDept(prev => !prev)}
                        className={`h-8 gap-2 rounded-xl border px-4 transition-colors ${
                            groupByDept
                                ? 'border-[#DA7756] bg-[#DA7756] text-white hover:bg-[#c9673f] hover:border-[#c9673f]'
                                : 'border-[#DA7756]/25 bg-white text-neutral-700 hover:bg-[#fef6f4]'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        Group
                    </Button>

                    {/* Refresh */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchLog}
                        disabled={loading}
                        className="h-8 w-8 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* ── Summary bar ── */}
            {logData && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    <span className="font-semibold text-neutral-700">{logData.week_of}</span>
                    <span className="text-neutral-300">|</span>
                    <span>{logData.week_range}</span>
                    <div className="ml-auto flex items-center gap-3">
                        <span>
                            Submitted:{' '}
                            <span className="font-bold text-green-600">{logData.submitted}</span>
                        </span>
                        <span>/</span>
                        <span>
                            Total:{' '}
                            <span className="font-bold text-neutral-700">{logData.total}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className="max-w-full overflow-x-hidden rounded-2xl border border-[#DA7756]/18 shadow-sm bg-white">
                <Table className="w-full table-fixed">
                    <TableHeader className="bg-[#fef6f4]">
                        <TableRow className="hover:bg-transparent border-none h-12">
                            {['Week Of', 'User', 'Score', 'Department', 'Rating', 'Status', 'Submitted At'].map(col => (
                                <TableHead key={col} className="text-[13px] font-bold text-neutral-500">
                                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors min-w-0">
                                        {col} <ArrowUpDown className="w-3.5 h-3.5" />
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="text-[13px] font-bold text-neutral-500 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-14 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#DA7756] mx-auto mb-2" />
                                    <p className="text-sm text-neutral-400">Loading…</p>
                                </TableCell>
                            </TableRow>
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-14 text-center text-sm text-neutral-400">
                                    No records found for the selected filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((entry, idx) => {
                                const submittedDate = entry.submitted_at
                                    ? new Date(entry.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : null;
                                const submittedTime = entry.submitted_at
                                    ? new Date(entry.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                                    : null;

                                return (
                                    <TableRow key={`${entry.user_id}-${idx}`} className="h-16 border-[#f3e6df] hover:bg-[#fef6f4]/50">
                                        {/* Week Of */}
                                        <TableCell className="text-sm font-bold text-gray-900 break-words">{entry.week_of}</TableCell>

                                        {/* User */}
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-bold text-gray-900 break-words">{entry.name}</div>
                                                <div className="text-[11px] font-medium text-neutral-400 break-words">{entry.email}</div>
                                            </div>
                                        </TableCell>

                                        {/* Score */}
                                        <TableCell className="text-sm font-medium text-neutral-400">
                                            {entry.score ? entry.score.toFixed(1) : '-'}
                                        </TableCell>

                                        {/* Department */}
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-[8px] border-[#DA7756]/20 bg-white px-3 py-1 text-[11px] font-bold text-neutral-700">
                                                {entry.department || 'No Dept.'}
                                            </Badge>
                                        </TableCell>

                                        {/* Rating */}
                                        <TableCell>
                                            {entry.rating > 0 ? (
                                                <Badge className="flex w-fit items-center gap-1.5 rounded-[8px] bg-[#DA7756] px-2.5 text-white shadow-sm hover:bg-[#DA7756]">
                                                    <Star className="w-3.5 h-3.5 fill-white" />
                                                    <span className="text-[11px] font-bold">{entry.rating}/10</span>
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-neutral-400">-</span>
                                            )}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`rounded-[8px] px-3 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[entry.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                            >
                                                {entry.status}
                                            </Badge>
                                        </TableCell>

                                        {/* Submitted At */}
                                        <TableCell>
                                            {submittedDate ? (
                                                <div className="space-y-0.5">
                                                    <div className="text-[11px] font-bold text-neutral-500">{submittedDate}</div>
                                                    <div className="text-[11px] font-medium text-neutral-400">{submittedTime}</div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-neutral-400">-</span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            {isSubmittedReport(entry) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSelectedReport(entry)}
                                                    title="View report"
                                                    className="h-8 w-8 rounded-xl text-[#DA7756] hover:bg-[#fef6f4] hover:text-[#c9673f]"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedReport && (
                <ReportDetailsModal
                    entry={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
};

export default WeeklyLog;
