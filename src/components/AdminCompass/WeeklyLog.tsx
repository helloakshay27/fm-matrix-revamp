import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    Check,
    ChevronDown,
    ChevronRight,
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
import { ReportExpandedView } from './WeeklyReviews/ReportExpandedView';

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
    meeting_journal_id?: number | null;
    checked_in_meeting?: boolean;
    report_data?: any;
}

interface WeeklyLogData {
    week: string;
    week_of: string;
    week_range: string;
    year: number;
    config: Record<string, unknown>;
    submitted: number;
    total: number;
    reports?: WeeklyLogReport[];
    grouped_by_department?: Array<{
        department: string;
        members: WeeklyLogReport[];
        count?: number;
    }>;
}

interface Department {
    id: number;
    department_name: string;
}

interface MeetingConfig {
    id: number;
    name: string;
}

interface SearchableSelectOption {
    value: string;
    label: string;
}

const SearchableSelect = ({
    value,
    onChange,
    options,
    placeholder = 'Search...',
}: {
    value: string;
    onChange: (value: string) => void;
    options: SearchableSelectOption[];
    placeholder?: string;
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((option) => option.value === value);
    const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase())
    );

    useEffect(() => {
        const handleOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    return (
        <div ref={ref} className="relative w-[150px]" style={{ zIndex: open ? 50 : 1 }}>
            <input
                type="text"
                value={open ? query : selected?.label || ''}
                placeholder={placeholder}
                readOnly={!open}
                onClick={() => {
                    setOpen(true);
                    setQuery('');
                }}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                }}
                className="h-8 w-full cursor-pointer rounded-xl border border-[#DA7756]/25 bg-white px-3 pr-8 text-sm font-medium text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#DA7756]/60 focus:ring-2 focus:ring-[#DA7756]/15"
            />
            <ChevronDown
                className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
            />
            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-center text-xs font-medium text-neutral-400">
                            No results found
                        </div>
                    ) : (
                        filtered.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                    setQuery('');
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                    option.value === value
                                        ? 'bg-[#fff3ee] text-[#DA7756]'
                                        : 'text-neutral-700 hover:bg-[#fff8f5] hover:text-[#DA7756]'
                                }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

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

const getWeeklyReportJournalId = (entry: { journal_id?: number | null }) =>
    entry.journal_id || null;

const isSubmittedReport = (entry: { status?: string; journal_id?: number | null; meeting_journal_id?: number | null }) =>
    !!entry.meeting_journal_id;

const getDisplayStatus = (entry: { status?: string; journal_id?: number | null; meeting_journal_id?: number | null }) =>
    isSubmittedReport(entry) ? 'submitted' : 'missed';

const PRIORITY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ReportDetailsModal = ({ entry, onClose }: { entry: WeeklyLogReport; onClose: () => void }) => {
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

    const detailJournalId = getWeeklyReportJournalId(entry);

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

    const reportData = details?.report_data || details?.weekly_report?.report_data || details?.journal?.report_data || {};

    // Shape the entry like a Weekly-tab member report so ReportExpandedView renders identically.
    const report = {
        ...(details || {}),
        user_id: entry.user_id,
        name: entry.name,
        email: entry.email,
        department: entry.department,
        status: entry.status,
        journal_id: entry.journal_id,
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
        const userId = entry.user_id;
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
        const userId = entry.user_id;
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
                user_id: entry.user_id,
                name: entry.name,
                email: entry.email,
                department: entry.department,
                status: entry.status,
                journal_id: entry.journal_id,
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
                        <h3 className="text-base font-bold text-gray-900">{entry.name}</h3>
                        <p className="text-xs text-gray-500">{entry.email}</p>
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
                                        prev === `priority-${entry.user_id}` ? null : `priority-${entry.user_id}`
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

// ── Component ──────────────────────────────────────────────────────────────────
interface WeeklyLogProps {
    initialWeekDate?: Date;
    onWeekDateChange?: (date: Date) => void;
    selectedMeetingId?: string;
    onSelectedMeetingChange?: (meetingId: string) => void;
}

const WeeklyLog = ({ initialWeekDate, onWeekDateChange, selectedMeetingId: externalSelectedMeetingId, onSelectedMeetingChange }: WeeklyLogProps = {}) => {
    const weekOptions = generateWeekOptions(14);
    const currentWeek = getISOWeekStr(initialWeekDate || new Date());

    // Filter state
    const [search, setSearch]             = useState('');
    const [meetingId, setMeetingIdState]  = useState(externalSelectedMeetingId || '');
    const [departmentId, setDeptId]       = useState('all');
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);
    const [groupByDept, setGroupByDept]   = useState(false);
    const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

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
                const res = await axios.get(`${baseUrl()}/weekly_meeting_configs.json`, { headers: getHeaders() });
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
                    setMeetingIdState((current) => {
                        if (current) return current;
                        const nextMeetingId = String(nextMeeting.id);
                        onSelectedMeetingChange?.(nextMeetingId);
                        return nextMeetingId;
                    });
                }
            } catch (err) {
                console.error('Failed to load meetings', err);
            }
        };
        fetchMeetings();
    }, []);

    // Fetch weekly log whenever filters change
    const fetchLog = useCallback(async () => {
        if (!meetingId) {
            setLogData(null);
            return;
        }
        setLoading(true);
        try {
            const params: Record<string, string> = { week: selectedWeek, meeting_id: meetingId };
            if (departmentId !== 'all')   params.department_id = departmentId;
            if (debouncedSearch.trim())   params.search        = debouncedSearch.trim();
            if (groupByDept)              params.group_by_dept = 'true';

            const res = await axios.get(`${baseUrl()}/user_journals/weekly_log.json`, {
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

    const reports = logData?.reports ?? logData?.grouped_by_department?.flatMap((group) => group.members || []) ?? [];
    const fallbackDepartmentGroups = reports.reduce<Array<{ department: string; reports: WeeklyLogReport[]; count?: number }>>((groups, report) => {
        const department = report.department || 'No Dept.';
        const existing = groups.find((group) => group.department === department);
        if (existing) {
            existing.reports.push(report);
        } else {
            groups.push({ department, reports: [report] });
        }
        return groups;
    }, []);
    const departmentGroups = (logData?.grouped_by_department || []).length > 0
        ? (logData?.grouped_by_department || []).map((group) => ({
            department: group.department || 'No Dept.',
            reports: group.members || [],
            count: group.count,
        }))
        : fallbackDepartmentGroups;
    const meetingSubmittedReports = reports.filter(isSubmittedReport);
    const meetingSubmittedCount = meetingSubmittedReports.length;
    const meetingTotalCount = logData?.total ?? reports.length;
    const meetingMissedCount = Math.max(meetingTotalCount - meetingSubmittedCount, 0);
    const departmentOptions = [
        { value: 'all', label: 'All Departments' },
        ...departments.map((department) => ({
            value: String(department.id),
            label: department.department_name,
        })),
    ];

    useEffect(() => {
        if (!groupByDept) return;
        setExpandedDepartments(new Set(departmentGroups.map((group) => group.department)));
    }, [groupByDept, reports.length]);

    const toggleDepartmentExpansion = (department: string) => {
        setExpandedDepartments((current) => {
            const next = new Set(current);
            if (next.has(department)) next.delete(department);
            else next.add(department);
            return next;
        });
    };

    const renderReportRow = (entry: WeeklyLogReport, idx: number) => {
        const isMeetingSubmitted = isSubmittedReport(entry);
        const displayStatus = getDisplayStatus(entry);
        const submittedDate = isMeetingSubmitted && entry.submitted_at
            ? new Date(entry.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null;
        const submittedTime = isMeetingSubmitted && entry.submitted_at
            ? new Date(entry.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : null;

        return (
            <TableRow key={`${entry.user_id}-${idx}`} className="h-16 border-[#f3e6df] hover:bg-[#fef6f4]/50">
                <TableCell className="text-sm font-bold text-gray-900 break-words">{entry.week_of}</TableCell>
                <TableCell>
                    <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900 break-words">{entry.name}</div>
                        <div className="text-[11px] font-medium text-neutral-400 break-words">{entry.email}</div>
                    </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-neutral-400">
                    {isMeetingSubmitted && entry.score ? entry.score.toFixed(1) : '-'}
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="rounded-[8px] border-[#DA7756]/20 bg-white px-3 py-1 text-[11px] font-bold text-neutral-700">
                        {entry.department || 'No Dept.'}
                    </Badge>
                </TableCell>
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
                <TableCell>
                    <Badge
                        variant="outline"
                        className={`rounded-[8px] px-3 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[displayStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                    >
                        {displayStatus}
                    </Badge>
                </TableCell>
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
    };

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
                    <SearchableSelect
                        value={departmentId}
                        onChange={setDeptId}
                        options={departmentOptions}
                        placeholder="Search department..."
                    />

                    {/* Meeting */}
                    <Select value={meetingId} onValueChange={setMeetingId}>
                        <SelectTrigger className="w-[150px] h-8 rounded-xl border border-[#DA7756]/25 bg-white">
                            <SelectValue placeholder="Meeting" />
                        </SelectTrigger>
                        <SelectContent side="bottom" align="start" avoidCollisions={false} className="max-h-60 overflow-y-auto">
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
                        <SelectContent side="bottom" align="start" avoidCollisions={false} className="max-h-60 overflow-y-auto">
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
                            <span className="font-bold text-green-600">{meetingSubmittedCount}</span>
                        </span>
                        <span>/</span>
                        <span>
                            Total:{' '}
                            <span className="font-bold text-neutral-700">{meetingTotalCount}</span>
                        </span>
                        <span>/</span>
                        <span>
                            Missed:{' '}
                            <span className="font-bold text-red-500">{meetingMissedCount}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {groupByDept && (
                <div className="space-y-3">
                    {loading ? (
                        <div className="rounded-2xl border border-[#DA7756]/18 bg-white py-14 text-center shadow-sm">
                            <Loader2 className="w-6 h-6 animate-spin text-[#DA7756] mx-auto mb-2" />
                            <p className="text-sm text-neutral-400">Loading...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="rounded-2xl border border-[#DA7756]/18 bg-white py-14 text-center text-sm text-neutral-400 shadow-sm">
                            No records found for the selected filters.
                        </div>
                    ) : (
                        departmentGroups.map((group) => {
                            const submittedCount = group.reports.filter(isSubmittedReport).length;
                            const missedCount = Math.max(group.reports.length - submittedCount, 0);
                            const isExpanded = expandedDepartments.has(group.department);

                            return (
                                <div key={group.department} className="overflow-hidden rounded-2xl border border-[#DA7756]/18 bg-white shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => toggleDepartmentExpansion(group.department)}
                                        className="flex w-full items-center gap-3 bg-[#DA7756]/5 px-5 py-4 text-left transition-colors hover:bg-[#DA7756]/10"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4 shrink-0 text-[#DA7756]" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 shrink-0 text-[#DA7756]" />
                                        )}
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#DA7756]/20 bg-white">
                                            <FileText className="h-4 w-4 text-[#DA7756]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-[#1a1a1a]">{group.department}</p>
                                            <p className="text-[11px] font-semibold text-neutral-400">{group.count ?? group.reports.length} members</p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 text-xs font-bold">
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-700">Submitted {submittedCount}</span>
                                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-600">Missed {missedCount}</span>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-[#f3e6df] p-3">
                                            <div className="max-w-full overflow-x-auto rounded-xl border border-[#DA7756]/12">
                                                <Table className="w-full min-w-[980px] table-fixed">
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
                                                        {group.reports.map((entry, idx) => renderReportRow(entry, idx))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {!groupByDept && (
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
                                const isMeetingSubmitted = isSubmittedReport(entry);
                                const displayStatus = getDisplayStatus(entry);
                                const submittedDate = isMeetingSubmitted && entry.submitted_at
                                    ? new Date(entry.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : null;
                                const submittedTime = isMeetingSubmitted && entry.submitted_at
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
                                            {isMeetingSubmitted && entry.score ? entry.score.toFixed(1) : '-'}
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
                                                className={`rounded-[8px] px-3 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[displayStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                            >
                                                {displayStatus}
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
            )}

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
