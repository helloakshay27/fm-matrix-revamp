import {
    History,
    RefreshCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeekPicker } from './WeekPicker';
import { useState } from 'react';

const MeetingHistory = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6 mt-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-[#DA7756]/15 bg-[#fef6f4] p-2">
                        <History className="w-5 h-5 text-[#DA7756]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#1a1a1a]">Weekly Meeting History</h2>
                        <p className="text-sm text-gray-500 font-medium">View and edit past weekly meeting reports</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm"
                            onClick={handlePreviousWeek}
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </Button>
                        <WeekPicker currentWeek={currentWeek} onWeekChange={setCurrentWeek} />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm"
                            onClick={handleNextWeek}
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </Button>
                    </div>

                    <Button variant="outline" className="h-9 px-4 !bg-white !border-gray-200 rounded-[8px] !text-gray-700 gap-2 font-bold shadow-sm">
                        <RefreshCw className="w-4 h-4 !text-gray-700" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Content Area - Empty State */}
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-2xl p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-[#DA7756]/35">
                    <History className="w-16 h-16" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-medium text-lg">No meetings found for Week 13, 2026</p>
            </div>
        </div>
    );
};

export default MeetingHistory;
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    History,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Users,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeekPicker } from './WeekPicker';

// ── Types ──────────────────────────────────────────────────────────────────────
interface MemberReport {
    journal_id: number | null;
    user_id: number;
    name: string;
    email: string;
    department: string | null;
    status: string;
    submitted_at: string | null;
    score: number | null;
    report_data: Record<string, unknown> | null;
}

interface WeekHistory {
    week: string;
    year: number;
    label: string;
    week_start_iso: string;
    submitted: number;
    missed: number;
    total: number;
    member_reports: MemberReport[];
}

interface HistoryConfig {
    id: number;
    name: string;
    meeting_time: string;
    day_of_week: number;
    duration_minutes: number;
    meeting_head: { id: number; name: string };
}

interface HistoryResponse {
    config: HistoryConfig;
    history: WeekHistory[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getISOWeek(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { week, year: d.getUTCFullYear() };
}

const STATUS_BADGE: Record<string, string> = {
    submitted: 'bg-green-100 text-green-700 border-green-200',
    missed:    'bg-red-100 text-red-700 border-red-200',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
};

// ── Week accordion card ────────────────────────────────────────────────────────
const WeekCard = ({ entry }: { entry: WeekHistory }) => {
    const [expanded, setExpanded] = useState(false);
    const submittedPct = entry.total > 0 ? Math.round((entry.submitted / entry.total) * 100) : 0;

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            {/* Week header row */}
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fef6f4]/60 transition-colors text-left"
            >
                {/* Week label */}
                <div className="min-w-[110px]">
                    <span className="text-sm font-bold text-[#DA7756]">{entry.week}, {entry.year}</span>
                    <p className="text-xs text-gray-400 font-medium">{entry.label}</p>
                </div>

                {/* Progress bar */}
                <div className="flex-1 space-y-1">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#DA7756] transition-all duration-500"
                            style={{ width: `${submittedPct}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400">{submittedPct}% submitted</p>
                </div>

                {/* Counts */}
                <div className="flex items-center gap-3 text-sm font-semibold shrink-0">
                    <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />{entry.submitted}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />{entry.missed}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />{entry.total}
                    </span>
                </div>

                {/* Chevron */}
                <div className="ml-2 text-gray-400 shrink-0">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded member list */}
            {expanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {entry.member_reports.map(member => {
                        const submittedDate = member.submitted_at
                            ? new Date(member.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : null;
                        const submittedTime = member.submitted_at
                            ? new Date(member.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : null;

                        return (
                            <div
                                key={member.user_id}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/60 transition-colors"
                            >
                                {/* Avatar initials */}
                                <div className="w-8 h-8 rounded-full bg-[#DA7756]/10 flex items-center justify-center shrink-0">
                                    <span className="text-[11px] font-bold text-[#DA7756]">
                                        {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </span>
                                </div>

                                {/* Name / email */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                                    <p className="text-[11px] text-gray-400 truncate">{member.email}</p>
                                </div>

                                {/* Department */}
                                {member.department && (
                                    <Badge variant="outline" className="rounded-[6px] border-[#DA7756]/20 bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-600 shrink-0">
                                        {member.department}
                                    </Badge>
                                )}

                                {/* Score */}
                                <span className="text-sm text-gray-400 font-medium w-12 text-center shrink-0">
                                    {member.score !== null ? member.score : '—'}
                                </span>

                                {/* Submitted at */}
                                <div className="w-28 shrink-0 text-right">
                                    {submittedDate ? (
                                        <>
                                            <p className="text-[11px] font-semibold text-gray-500">{submittedDate}</p>
                                            <p className="text-[10px] text-gray-400">{submittedTime}</p>
                                        </>
                                    ) : (
                                        <span className="text-[11px] text-gray-300">—</span>
                                    )}
                                </div>

                                {/* Status badge */}
                                <Badge
                                    variant="outline"
                                    className={`rounded-[6px] px-2 py-0.5 text-[10px] font-bold capitalize shrink-0 ${STATUS_BADGE[member.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                >
                                    {member.status}
                                </Badge>

                                {/* View */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={!member.journal_id}
                                    className="h-7 w-7 rounded-lg text-[#DA7756] hover:bg-[#fef6f4] disabled:opacity-25 shrink-0"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const MeetingHistory = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });
    const apiBase = () => `https://${localStorage.getItem('baseUrl')}`;

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const { week, year } = getISOWeek(currentWeek);
            const res = await axios.get(`${apiBase()}/user_journals/weekly_history`, {
                headers: getHeaders(),
                params: { week: `${year}-W${String(week).padStart(2, '0')}` },
            });
            setHistoryData(res.data?.data ?? res.data ?? null);
        } catch (err) {
            console.error('Failed to load meeting history', err);
            toast.error('Failed to load meeting history');
        } finally {
            setLoading(false);
        }
    }, [currentWeek]);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handlePrevWeek = () =>
        setCurrentWeek(d => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000));
    const handleNextWeek = () =>
        setCurrentWeek(d => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000));

    const history = historyData?.history ?? [];
    const config  = historyData?.config;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6 mt-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-[#DA7756]/15 bg-[#fef6f4] p-2">
                        <History className="w-5 h-5 text-[#DA7756]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#1a1a1a]">Weekly Meeting History</h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {config ? `${config.name} · ${config.meeting_head?.name}` : 'View past weekly meeting reports'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevWeek}
                            className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </Button>
                        <WeekPicker currentWeek={currentWeek} onWeekChange={setCurrentWeek} />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextWeek}
                            className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        onClick={fetchHistory}
                        disabled={loading}
                        className="h-9 px-4 !bg-white !border-gray-200 rounded-[8px] !text-gray-700 gap-2 font-bold shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 !text-gray-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="bg-[#F8F9FB] border border-gray-100 rounded-2xl p-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#DA7756] animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Loading history…</p>
                </div>
            ) : history.length === 0 ? (
                <div className="bg-[#F8F9FB] border border-gray-100 rounded-2xl p-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-[#DA7756]/35">
                        <History className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">
                        No meeting history found
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map(entry => (
                        <WeekCard key={`${entry.year}-${entry.week}`} entry={entry} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeetingHistory;