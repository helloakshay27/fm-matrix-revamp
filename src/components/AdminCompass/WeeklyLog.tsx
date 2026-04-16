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

// ── Component ──────────────────────────────────────────────────────────────────
const WeeklyLog = () => {
    const weekOptions = generateWeekOptions(14);
    const currentWeek = getISOWeekStr(new Date());

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

    // ── API helpers ──
    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });
    const baseUrl = () => `https://${localStorage.getItem('baseUrl')}`;

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
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">

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
            <div className="overflow-hidden rounded-2xl border border-[#DA7756]/18 shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-[#fef6f4]">
                        <TableRow className="hover:bg-transparent border-none h-12">
                            {['Week Of', 'User', 'Score', 'Department', 'Rating', 'Status', 'Submitted At'].map(col => (
                                <TableHead key={col} className="text-[13px] font-bold text-neutral-500">
                                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
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
                                        <TableCell className="text-sm font-bold text-gray-900">{entry.week_of}</TableCell>

                                        {/* User */}
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-bold text-gray-900">{entry.name}</div>
                                                <div className="text-[11px] font-medium text-neutral-400">{entry.email}</div>
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={!entry.journal_id}
                                                title={entry.journal_id ? 'View report' : 'No report submitted'}
                                                className="h-8 w-8 rounded-xl text-[#DA7756] hover:bg-[#fef6f4] hover:text-[#c9673f] disabled:opacity-30"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default WeeklyLog;
