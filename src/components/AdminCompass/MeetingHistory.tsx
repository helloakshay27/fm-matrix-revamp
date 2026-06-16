import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportExpandedView } from './WeeklyReviews/ReportExpandedView';

// ── Types ──────────────────────────────────────────────────────────────────────
interface MemberReport {
    journal_id: number | null;
    meeting_journal_id?: number | null;
    weekly_report?: { id?: number | null; status?: string | null } | null;
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
    config?: HistoryConfig;
    meeting_key?: string;
}

interface HistoryConfig {
    id: number;
    name: string;
    meeting_time: string;
    day_of_week: number;
    duration_minutes: number;
    meeting_head?: { id: number; name: string };
    meeting_heads?: Array<{ id: number; name: string }>;
}

interface HistoryResponse {
    config?: HistoryConfig;
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

const getISOWeekKey = (date: Date) => {
    const { week, year } = getISOWeek(date);
    return `${year}-W${String(week).padStart(2, '0')}`;
};

const formatDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getBaseUrl = () => {
    const rawBase = localStorage.getItem('baseUrl') || '';
    if (!rawBase) return '';
    return rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase.replace(/\/$/, '') : `https://${rawBase.replace(/\/$/, '')}`;
};

const getMemberDetailJournalId = (member: MemberReport) =>
    member.journal_id || member.weekly_report?.id || null;

const parseMeetingConfigs = (raw: any): HistoryConfig[] => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (raw?.data && typeof raw.data === 'object') return [raw.data];
    return [];
};

const getMeetingHeadLabel = (config?: HistoryConfig) =>
    config?.meeting_head?.name || config?.meeting_heads?.map((head) => head.name).filter(Boolean).join(', ') || '';

const isMeetingSubmitted = (entry: WeekHistory) =>
    entry.member_reports.some((member) => !!member.meeting_journal_id);

const isSubmittedMember = (member: MemberReport, _meetingSubmitted = true) =>
    !!member.meeting_journal_id;

const getDisplayStatus = (member: MemberReport, meetingSubmitted = true) =>
    isSubmittedMember(member, meetingSubmitted) ? 'submitted' : 'missed';

const PRIORITY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MemberReportModal = ({ member, onClose }: { member: MemberReport; onClose: () => void }) => {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Interactive state for the shared expanded view (same UI as the Weekly tab).
    const [activeTab, setActiveTab] = useState('Daily');
    const [priorityText, setPriorityText] = useState('');
    const [selectedPriorityDay, setSelectedPriorityDay] = useState('Mon');
    const [showDayDropdown, setShowDayDropdown] = useState<string | null>(null);
    const [priorityLoading, setPriorityLoading] = useState<Record<number, boolean>>({});
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackScore, setFeedbackScore] = useState(0);
    const [feedbackLoading, setFeedbackLoading] = useState<Record<number, boolean>>({});
    const [ratingsData, setRatingsData] = useState<Record<number, any>>({});
    const [ratingsLoading, setRatingsLoading] = useState<Record<number, boolean>>({});

    const detailJournalId = getMemberDetailJournalId(member);

    const fetchDetails = useCallback(async () => {
        if (!detailJournalId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${getBaseUrl()}/user_journals/${detailJournalId}.json`, {
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
    }, [detailJournalId]);

    useEffect(() => { fetchDetails(); }, [fetchDetails]);

    const reportData = details?.report_data || details?.weekly_report?.report_data || details?.journal?.report_data || member.report_data || {};

    // Shape the member like a Weekly-tab member report so ReportExpandedView renders identically.
    const report = {
        ...(details || {}),
        user_id: member.user_id,
        name: member.name,
        email: member.email,
        department: member.department,
        status: member.status,
        journal_id: member.journal_id,
        report_data: reportData,
        weekly_report: { id: detailJournalId, report_data: reportData },
    };

    const fetchRatings = async (userId: number) => {
        try {
            setRatingsLoading((prev) => ({ ...prev, [userId]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');
            if (!baseUrl || !token) return;
            const loggedInUserId = localStorage.getItem('userId') || '';
            const res = await axios.get(
                `${baseUrl}/ratings.json?resource_type=User&resource_id=${userId}&rating_from_id=${loggedInUserId}`,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            setRatingsData((prev) => ({ ...prev, [userId]: res.data }));
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setRatingsLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleSubmitFeedback = async () => {
        const userId = member.user_id;
        const text = feedbackText.trim();
        if (!text) { toast.error('Please enter feedback'); return; }
        if (!feedbackScore) { toast.error('Please select a rating'); return; }
        try {
            setFeedbackLoading((prev) => ({ ...prev, [userId]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');
            if (!baseUrl || !token) return;
            await axios.post(
                `${baseUrl}/ratings.json`,
                {
                    resource_type: 'User',
                    resource_id: userId,
                    rating_from_id: localStorage.getItem('userId') || '',
                    score: feedbackScore,
                    reviews: text,
                    positive_opening: '',
                    constructive_feedback: '',
                    positive_closing: '',
                },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            toast.success('Feedback submitted');
            setFeedbackText('');
            setFeedbackScore(0);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback');
        } finally {
            setFeedbackLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleAddPriority = async () => {
        const text = priorityText.trim();
        if (!text) return;
        const userId = member.user_id;
        if (!detailJournalId) {
            toast.error('Priority can be added only after weekly report is submitted');
            return;
        }
        try {
            setPriorityLoading((prev) => ({ ...prev, [userId]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');
            if (!baseUrl || !token) return;

            const existingTasks = reportData.upcoming_week_plan || reportData.tasks || [];
            const dayKey = selectedPriorityDay.toLowerCase();
            const priorityItem = {
                id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
                text,
                starred: false,
            };
            let mergedTasks: any[];
            if (Array.isArray(existingTasks) && existingTasks.length > 0 && typeof existingTasks[0] === 'object' && !Array.isArray(existingTasks[0])) {
                const dayKeyedObject = existingTasks[0];
                mergedTasks = [{ ...dayKeyedObject, [dayKey]: [...(dayKeyedObject[dayKey] || []), priorityItem] }];
            } else {
                mergedTasks = [{ [dayKey]: [priorityItem] }];
            }

            const payload = {
                user_id: member.user_id,
                name: member.name,
                email: member.email,
                department: member.department,
                status: member.status,
                journal_id: member.journal_id,
                report_data: {
                    ...reportData,
                    upcoming_week_plan: mergedTasks,
                    tasks: reportData.tasks || [],
                    kpi: reportData.kpi || '',
                    achievements: reportData.achievements || [],
                    remarks: reportData.remarks || [],
                    remark_type: reportData.remark_type || 'remark',
                    past_kpis: reportData.past_kpis || [],
                    total_score: reportData.total_score || 0,
                    sections: reportData.sections || { daily_scores: [0, 0, 0, 0, 0], bonus: 0, self_rating: 0, is_absent: false },
                    details: reportData.details || { self_rating: 0, is_absent: false },
                },
            };

            await axios.put(`${baseUrl}/user_journals/${detailJournalId}.json`, payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            setPriorityText('');
            toast.success('Priority added');
            fetchDetails();
        } catch (error) {
            console.error('Error adding priority:', error);
            toast.error('Failed to add priority');
        } finally {
            setPriorityLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[900] grid place-items-center overflow-hidden bg-black/40 px-4 py-8">
            <div
                className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                style={{ maxHeight: '88vh' }}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
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
                                    <p className="text-sm font-bold text-gray-800">{reportData.total_score ?? member.score ?? '-'}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-[11px] font-bold text-gray-400">Department</p>
                                    <p className="text-sm font-bold text-gray-800">{member.department || 'No Dept.'}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-[11px] font-bold text-gray-400">Submitted</p>
                                    <p className="text-sm font-bold text-gray-800">{member.submitted_at ? new Date(member.submitted_at).toLocaleString() : '-'}</p>
                                </div>
                            </div>

                            <ReportExpandedView
                                report={report}
                                activeTab={activeTab}
                                priorityText={priorityText}
                                selectedPriorityDay={selectedPriorityDay}
                                showDayDropdown={showDayDropdown}
                                priorityLoading={priorityLoading}
                                daysOfWeek={PRIORITY_DAYS}
                                feedbackText={feedbackText}
                                feedbackScore={feedbackScore}
                                feedbackLoading={feedbackLoading}
                                ratingsData={ratingsData}
                                ratingsLoading={ratingsLoading}
                                onPriorityChange={setPriorityText}
                                onPriorityDaySelect={setSelectedPriorityDay}
                                onTogglePriorityDropdown={() =>
                                    setShowDayDropdown((prev) =>
                                        prev === `priority-${member.user_id}` ? null : `priority-${member.user_id}`
                                    )
                                }
                                onAddPriority={handleAddPriority}
                                onFeedbackChange={setFeedbackText}
                                onFeedbackScoreChange={setFeedbackScore}
                                onSubmitFeedback={handleSubmitFeedback}
                                onTabChange={setActiveTab}
                                onFetchRatings={fetchRatings}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// ── Week accordion card ────────────────────────────────────────────────────────
const WeekCard = ({ entry }: { entry: WeekHistory }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberReport | null>(null);
    const meetingSubmitted = isMeetingSubmitted(entry);
    const meetingSubmittedCount = meetingSubmitted
        ? entry.member_reports.filter((member) => isSubmittedMember(member, meetingSubmitted)).length
        : 0;
    const meetingMissedCount = Math.max(entry.total - meetingSubmittedCount, 0);
    const submittedPct = entry.total > 0 ? Math.round((meetingSubmittedCount / entry.total) * 100) : 0;

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white max-w-full">
            {/* Week header row */}
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-[#fef6f4]/60 transition-colors text-left"
            >
                {/* Week label */}
                <div className="min-w-[110px]">
                    <span className="text-sm font-bold text-[#DA7756]">{entry.week}, {entry.year}</span>
                    <p className="text-xs text-gray-400 font-medium">{entry.label}</p>
                    {entry.config?.name && (
                        <p className="mt-1 text-[11px] font-semibold text-gray-600">{entry.config.name}</p>
                    )}
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
                        <CheckCircle2 className="w-4 h-4" />{meetingSubmittedCount}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />{meetingMissedCount}
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
                        const memberSubmitted = isSubmittedMember(member, meetingSubmitted);
                        const displayStatus = getDisplayStatus(member, meetingSubmitted);
                        const submittedDate = memberSubmitted && member.submitted_at
                            ? new Date(member.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : null;
                        const submittedTime = memberSubmitted && member.submitted_at
                            ? new Date(member.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : null;

                        return (
                            <div
                                key={member.user_id}
                                className="flex flex-wrap items-center gap-4 px-5 py-3 hover:bg-gray-50/60 transition-colors"
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
                                    {memberSubmitted && member.score !== null ? member.score : '—'}
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
                                    className={`rounded-[6px] px-2 py-0.5 text-[10px] font-bold capitalize shrink-0 ${STATUS_BADGE[displayStatus] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                >
                                    {displayStatus}
                                </Badge>

                                {/* View */}
                                {memberSubmitted && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedMember(member)}
                                        className="h-7 w-7 rounded-lg text-[#DA7756] hover:bg-[#fef6f4] shrink-0"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedMember && (
                <MemberReportModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
interface MeetingHistoryProps {
    initialWeekDate?: Date;
    onWeekDateChange?: (date: Date) => void;
}

const MeetingHistory = ({ initialWeekDate, onWeekDateChange }: MeetingHistoryProps = {}) => {
    const [currentWeek, setCurrentWeek] = useState(() => initialWeekDate || new Date());
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialWeekDate) return;
        setCurrentWeek((current) =>
            getISOWeekKey(current) === getISOWeekKey(initialWeekDate)
                ? current
                : initialWeekDate
        );
    }, [initialWeekDate]);

    useEffect(() => {
        onWeekDateChange?.(currentWeek);
    }, [currentWeek, onWeekDateChange]);

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });
    const apiBase = getBaseUrl;

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const { week, year } = getISOWeek(currentWeek);
            const weekParam = `${year}-W${String(week).padStart(2, '0')}`;
            const meetingsRes = await axios.get(`${apiBase()}/weekly_meeting_configs.json`, { headers: getHeaders() });
            const meetingConfigs = parseMeetingConfigs(meetingsRes.data);

            if (meetingConfigs.length === 0) {
                const res = await axios.get(`${apiBase()}/user_journals/weekly_history.json`, {
                    headers: getHeaders(),
                    params: { week: weekParam },
                });
                setHistoryData(res.data?.data ?? res.data ?? null);
                return;
            }

            const responses = await Promise.all(
                meetingConfigs.map(async (meetingConfig) => {
                    try {
                        const res = await axios.get(`${apiBase()}/user_journals/weekly_history.json`, {
                            headers: getHeaders(),
                            params: {
                                week: weekParam,
                                meeting_id: String(meetingConfig.id),
                                meeting_config_id: String(meetingConfig.id),
                            },
                        });
                        const data: HistoryResponse = res.data?.data ?? res.data ?? { history: [] };
                        const config = data.config || meetingConfig;
                        return (data.history ?? []).map((entry) => ({
                            ...entry,
                            config,
                            meeting_key: `${config.id}-${entry.year}-${entry.week}`,
                        }));
                    } catch (historyError) {
                        console.error('Failed to load meeting history for config', meetingConfig.id, historyError);
                        return [];
                    }
                })
            );

            setHistoryData({
                history: responses.flat(),
            });
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

    const selectedWeekMeta = getISOWeek(currentWeek);
    const selectedWeekLabel = `W${String(selectedWeekMeta.week).padStart(2, '0')}`;
    const history = (historyData?.history ?? []).filter((entry) =>
        entry.year === selectedWeekMeta.year && entry.week === selectedWeekLabel
    );
    const rawConfig = historyData?.config;
    const meetingHeadLabel = getMeetingHeadLabel(rawConfig);
    const config = rawConfig
        ? {
            ...rawConfig,
            meeting_head: rawConfig.meeting_head?.name ? rawConfig.meeting_head : { id: 0, name: meetingHeadLabel },
        }
        : undefined;
    const historySubtitle = config
        ? [config.name, meetingHeadLabel].filter(Boolean).join(' · ')
        : 'All weekly meetings';

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm space-y-6 mt-6 max-w-full overflow-x-hidden">
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
                        <input
                            type="date"
                            value={formatDateInputValue(currentWeek)}
                            onChange={(event) => {
                                if (!event.target.value) return;
                                setCurrentWeek(new Date(`${event.target.value}T00:00:00`));
                            }}
                            className="h-9 rounded-[8px] border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm outline-none focus:border-[#DA7756]/60 focus:ring-2 focus:ring-[#DA7756]/15"
                        />
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
                        <WeekCard key={entry.meeting_key || `${entry.config?.id || 'meeting'}-${entry.year}-${entry.week}`} entry={entry} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeetingHistory;
