import { useState, useEffect } from 'react';
import { AlertTriangle, CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { getWeek } from 'date-fns';
import { WeekSelector } from './WeeklyReviews/WeekSelector';
import { MeetingNotes } from './WeeklyReviews/MeetingNotes';
import { MemberReportCard } from './WeeklyReviews/MemberReportCard';
import { toast } from 'sonner';

const getBaseUrl = () => {
    const rawBase = localStorage.getItem('baseUrl') || '';
    if (!rawBase) return '';
    return rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase.replace(/\/$/, '') : `https://${rawBase.replace(/\/$/, '')}`;
};

const getReportItemText = (item: any): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') return item.title || item.text || item.name || '';
    return String(item ?? '');
};

const pushUnique = (arr: any[], item: any, keyFields: string[]) => {
    const exists = arr.some((current) => keyFields.every((key) => current[key] === item[key]));
    if (!exists) arr.push(item);
};

const getItemTitle = (item: any): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (typeof item === 'object') return String(item.title || item.name || item.text || '');
    return String(item);
};

const getItemStatus = (item: any): string => {
    if (!item || typeof item !== 'object') return 'open';
    return item.status || 'open';
};

const getItemType = (item: any): string => {
    if (!item || typeof item !== 'object') return 'task';
    return String(item.type || 'task').toLowerCase();
};

const normalizeReportList = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.items)) return value.items;
    return [];
};

const normalizeWeeklyReportData = (reportData: any) => {
    const rd = reportData && typeof reportData === 'object' ? reportData : {};
    return {
        achievements: normalizeReportList(rd.achievements || rd.accomplishments),
        tasks_issues: normalizeReportList(rd.tasks_issues),
        upcoming_week_plan: normalizeReportList(rd.upcoming_week_plan || rd.tasks),
        remarks: normalizeReportList(rd.remarks),
        past_kpis: normalizeReportList(rd.past_kpis),
        kpi: rd.kpi || '',
        kpis: rd.kpis && typeof rd.kpis === 'object' ? rd.kpis : {},
        sections: rd.sections && typeof rd.sections === 'object' ? rd.sections : {},
        details: rd.details && typeof rd.details === 'object' ? rd.details : {},
        total_score: rd.total_score ?? null,
        is_absent: rd.details?.is_absent ?? rd.sections?.is_absent ?? rd.is_absent ?? false,
        self_rating: rd.details?.self_rating ?? rd.sections?.self_rating ?? rd.self_rating ?? null,
    };
};

const normalizeWeekPlan = (plan: any[] = []) => {
    const byDay: Record<string, string[]> = {};
    const flat: Array<{ day: string; title: string; status: string; starred: boolean }> = [];

    plan.forEach((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return;

        Object.entries(entry).forEach(([day, values]: [string, any]) => {
            const list = Array.isArray(values) ? values : [];
            const titles = list.map(getReportItemText).filter(Boolean);
            if (titles.length > 0) byDay[day] = titles;

            list.forEach((item: any) => {
                const title = getReportItemText(item);
                if (!title) return;
                flat.push({
                    day,
                    title,
                    status: getItemStatus(item),
                    starred: !!item?.starred || !!item?.is_starred,
                });
            });
        });
    });

    return { byDay, flat };
};

const mapPlanItemForPayload = (item: any) => ({
    day: item.day,
    title: item.title || item.text || '',
    text: item.text || item.title || '',
    status: item.status || 'open',
    starred: !!item.starred || !!item.is_starred,
    member: item.member,
    user_id: item.user_id,
});

const stripMissedMembersPrefix = (text: string): string => {
    const markdownHeaderMatch = text.match(/^\*\*Team Members Who Missed Report \(\d+\):\*\*\n(?:- .+\n)*\n?/);
    if (markdownHeaderMatch) return text.slice(markdownHeaderMatch[0].length);

    const plainHeaderMatch = text.match(/^Team Members who failed to submit Reports \(\d+\):\n(?:.*\n)*?\nKey Discussion Points:\n\n?/);
    if (plainHeaderMatch) return text.slice(plainHeaderMatch[0].length);

    return text;
};

interface WeeklyMeetingData {
    config: {
        id: number;
        name: string;
        meeting_time: string;
        day_of_week: number;
        duration_minutes: number;
        meeting_head: {
            id: number;
            name: string;
        };
    };
    week: string;
    week_label: string;
    year: number;
    submitted: number;
    missed: number;
    total_members: number;
    missed_members: Array<{
        id: number;
        name: string;
    }>;
    member_reports: Array<{
        user_id: number;
        name: string;
        email: string;
        department: string | null;
        status: string;
        journal_id: number | null;
        meeting_journal_id?: number | null;
        checked_in_meeting?: boolean;
        report_data: any;
        weekly_report: any;
    }>;
}

interface WeeklyReviewsProps {
    initialWeekDate?: Date;
    onWeekDateChange?: (date: Date) => void;
    selectedMeetingId?: string;
    onSelectedMeetingChange?: (meetingId: string) => void;
    onMeetingSaved?: () => void;
}

const WeeklyReviews = ({ initialWeekDate, onWeekDateChange, selectedMeetingId: externalSelectedMeetingId, onSelectedMeetingChange, onMeetingSaved }: WeeklyReviewsProps = {}) => {
    const [selectedMeeting, setSelectedMeetingState] = useState(externalSelectedMeetingId || '');
    const [meetingConfigs, setMeetingConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [weeklyDataLoading, setWeeklyDataLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(() => initialWeekDate || new Date());
    const [weeklyData, setWeeklyData] = useState<WeeklyMeetingData | null>(null);
    const [meetingNotes, setMeetingNotes] = useState('');
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Daily');
    const [selectedPriorityDays, setSelectedPriorityDays] = useState<Record<number, string>>({});
    const [showDayDropdown, setShowDayDropdown] = useState<string | null>(null);
    const [priorityInputs, setPriorityInputs] = useState<Record<number, string>>({});
    const [priorityLoading, setPriorityLoading] = useState<Record<number, boolean>>({});
    const [ratingsData, setRatingsData] = useState<Record<number, any>>({});
    const [ratingsLoading, setRatingsLoading] = useState<Record<number, boolean>>({});
    const [feedbackInputs, setFeedbackInputs] = useState<Record<number, string>>({});
    const [feedbackScores, setFeedbackScores] = useState<Record<number, number>>({});
    const [feedbackLoading, setFeedbackLoading] = useState<Record<number, boolean>>({});
    const [saveMeetingLoading, setSaveMeetingLoading] = useState(false);
    const [selectedReports, setSelectedReports] = useState<any[]>([]);
    const [submittedMeetingJournalOverride, setSubmittedMeetingJournalOverride] = useState<any>(null);

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const isCheckedInMeeting = (report: any) => report?.checked_in_meeting === true;
    const getReportSelectionKey = (report: any) => report?.journal_id || report?.user_id;

    const handleUserCheck = (report: any, isChecked: boolean) => {
        const reportKey = getReportSelectionKey(report);
        if (!reportKey) return;
        setSelectedReports(prev =>
            isChecked
                ? [...prev, reportKey]
                : prev.filter((id) => String(id) !== String(reportKey))
        );
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    useEffect(() => {
        if (!initialWeekDate) return;
        setCurrentWeek((current) =>
            getWeekString(current) === getWeekString(initialWeekDate)
                ? current
                : initialWeekDate
        );
    }, [initialWeekDate]);

    useEffect(() => {
        if (!externalSelectedMeetingId) return;
        setSelectedMeetingState((current) =>
            current === externalSelectedMeetingId ? current : externalSelectedMeetingId
        );
    }, [externalSelectedMeetingId]);

    const setSelectedMeeting = (meetingId: string) => {
        setSelectedMeetingState(meetingId);
        if (meetingId) onSelectedMeetingChange?.(String(meetingId));
    };

    useEffect(() => {
        if (selectedMeeting || meetingConfigs.length === 0) return;
        const defaultMeeting = meetingConfigs.find((config: any) => config.is_default && config.active !== false);
        const firstActiveMeeting = meetingConfigs.find((config: any) => config.active !== false);
        const nextMeeting = defaultMeeting || firstActiveMeeting || meetingConfigs[0];
        if (nextMeeting?.id !== undefined && nextMeeting?.id !== null) {
            setSelectedMeeting(String(nextMeeting.id));
        }
    }, [meetingConfigs, selectedMeeting]);

    useEffect(() => {
        onWeekDateChange?.(currentWeek);
    }, [currentWeek, onWeekDateChange]);

    useEffect(() => {
        if (!weeklyData) return;
        const checkedInIds = (weeklyData.member_reports || [])
            .filter((report: any) => report.checked_in_meeting === true)
            .map((report: any) => getReportSelectionKey(report))
            .filter(Boolean);

        setSelectedReports(checkedInIds);
    }, [weeklyData]);

    const getSelectedReportRows = () => {
        if (!weeklyData?.member_reports) return [];
        const selectedKeys = new Set(selectedReports.map((id) => String(id)));
        return weeklyData.member_reports.filter((report) => report.weekly_report !== null && selectedKeys.has(String(getReportSelectionKey(report))));
    };

    const getSubmittedWeeklyReports = (data = weeklyData) =>
        data?.member_reports?.filter((report: any) => report.weekly_report !== null) || [];

    const getMissedWeeklyMembers = (data = weeklyData) =>
        data?.member_reports
            ?.filter((report: any) => report.weekly_report === null)
            .map((report: any) => ({
                id: report.user_id,
                name: report.name,
            })) || [];

    // Helper function to extract KPI summary from selected member reports
    const extractKpiSummary = (reports = getSelectedReportRows()) => {
        if (!reports.length) return {};

        const kpiMap: Record<string, { total: number; achieved: number; names: string[] }> = {};

        reports.forEach((report) => {
            const kpiData = report.report_data?.kpi || report.weekly_report?.report_data?.kpi;
            if (kpiData && typeof kpiData === 'string') {
                if (!kpiMap[kpiData]) {
                    kpiMap[kpiData] = { total: 0, achieved: 0, names: [] };
                }
                kpiMap[kpiData].total++;
                kpiMap[kpiData].names.push(report.name);
            }
        });

        return kpiMap;
    };

    // Helper function to extract open issues and tasks
    const extractOpenIssues = (reports = getSelectedReportRows()) => {
        if (!reports.length) return [];

        const issues: Array<{ issue: string; assignee: string; status: string }> = [];

        reports.forEach((report) => {
            const reportData = normalizeWeeklyReportData(report.weekly_report?.report_data || report.report_data || {});

            reportData.tasks_issues.forEach((item: any) => {
                const title = getItemTitle(item);
                if (title && getItemType(item) === 'issue') {
                    issues.push({
                        issue: title,
                        assignee: report.name,
                        status: getItemStatus(item)
                    });
                }
            });

            reportData.remarks.forEach((remark: any) => {
                const title = getItemTitle(remark);
                if (title) {
                    issues.push({
                        issue: title,
                        assignee: report.name,
                        status: getItemStatus(remark)
                    });
                }
            });
        });

        return issues;
    };

    const buildCombinedData = (reports = getSelectedReportRows()) => {
        const allAccomplishments: any[] = [];
        const allTasksIssues: any[] = [];
        const allUpcomingWeekPlan: any[] = [];
        const allRemarks: any[] = [];
        const allPastKpis: any[] = [];
        let combinedSelfRating = 0;
        let ratingCount = 0;
        const combinedKpis = {
            score: 0,
            tasks: 0,
            issues: 0,
            planning: 0,
            timing: 0,
            sop_health: 0,
            daily_kpi_achievement: 0,
            weekly_kpi_achievement: 0,
            remarks: 0,
        };

        reports.forEach((report) => {
            const reportData = normalizeWeeklyReportData(report.weekly_report?.report_data || report.report_data || {});
            const weekPlan = normalizeWeekPlan(reportData.upcoming_week_plan);

            reportData.achievements.forEach((item: any) => {
                const title = getItemTitle(item);
                if (!title) return;
                pushUnique(allAccomplishments, {
                    title,
                    text: title,
                    member: report.name,
                    user_id: report.user_id,
                    is_starred: !!item?.is_starred || !!item?.starred,
                }, ['title', 'user_id']);
            });

            reportData.tasks_issues.forEach((item: any) => {
                const title = getItemTitle(item);
                if (!title) return;
                pushUnique(allTasksIssues, {
                    type: getItemType(item),
                    title,
                    text: title,
                    status: getItemStatus(item),
                    member: report.name,
                    user_id: report.user_id,
                }, ['type', 'title', 'user_id']);
            });

            weekPlan.flat.forEach((item) => {
                pushUnique(allUpcomingWeekPlan, {
                    ...item,
                    member: report.name,
                    user_id: report.user_id,
                }, ['day', 'title', 'user_id']);
            });

            reportData.remarks.forEach((item: any) => {
                const title = getItemTitle(item);
                if (!title) return;
                pushUnique(allRemarks, {
                    title,
                    text: title,
                    type: typeof item === 'object' && item ? Object.keys(item)[0] || 'remark' : 'remark',
                    member: report.name,
                    user_id: report.user_id,
                }, ['title', 'user_id']);
            });

            reportData.past_kpis.forEach((item: any) => {
                pushUnique(allPastKpis, {
                    ...item,
                    member: report.name,
                    user_id: report.user_id,
                }, ['kpi_id', 'user_id']);
            });

            if (reportData.self_rating !== null && reportData.self_rating !== undefined) {
                combinedSelfRating += Number(reportData.self_rating) || 0;
                ratingCount++;
            }

            const sections = reportData.sections || {};
            combinedKpis.score += Number(reportData.total_score) || 0;
            combinedKpis.tasks += Number(sections.tasks_issues) || 0;
            combinedKpis.issues += reportData.tasks_issues.filter((item: any) => getItemType(item) === 'issue').length;
            combinedKpis.planning += Number(sections.planning) || 0;
            combinedKpis.timing += Number(sections.timing) || 0;
            combinedKpis.sop_health += Number(sections.sop_health) || 0;
            combinedKpis.daily_kpi_achievement += Number(sections.daily_kpi_achievement) || 0;
            combinedKpis.weekly_kpi_achievement += Number(sections.weekly_kpi_achievement) || 0;
            combinedKpis.remarks += Number(sections.remarks) || 0;
        });

        return {
            allAccomplishments,
            allTasksIssues,
            allUpcomingWeekPlan,
            allRemarks,
            allPastKpis,
            avgSelfRating: ratingCount > 0 ? Math.round(combinedSelfRating / ratingCount) : 0,
            combinedKpis,
        };
    };

    // Helper function to extract goals progress
    const extractGoalsProgress = (reports = getSelectedReportRows()) => {
        if (!reports.length) return [];

        const goalsMap: Record<string, { progress: number; status: string }> = {};

        reports.forEach((report) => {
            const sections = report.report_data?.sections || report.weekly_report?.report_data?.sections || {};
            if (sections.goals && Array.isArray(sections.goals)) {
                sections.goals.forEach((goal: any) => {
                    const goalName = goal.name || goal.title;
                    if (goalName) {
                        if (!goalsMap[goalName]) {
                            goalsMap[goalName] = { progress: goal.progress || 0, status: goal.status || 'on_track' };
                        }
                    }
                });
            }
        });

        return Object.entries(goalsMap).map(([name, data]) => ({
            goal: name,
            ...data
        }));
    };

    // Helper function to build detailed reviews
    const buildDetailedReviews = (reports = getSelectedReportRows()) => {
        if (!reports.length) return [];

        return reports
            .map((report) => {
                const reportData = normalizeWeeklyReportData(report.weekly_report?.report_data || report.report_data || {});
                const sections = reportData.sections || {};
                const weekPlan = normalizeWeekPlan(reportData.upcoming_week_plan);

                // Extract priorities by day
                const prioritiesByDay = weekPlan.byDay;

                // Get KPI data
                const kpiList = [];
                if (reportData.kpi) {
                    kpiList.push(reportData.kpi);
                }

                return {
                    user_id: report.user_id,
                    name: report.name,
                    email: report.email,
                    journal_id: report.journal_id,
                    weekly_report_id: report.weekly_report?.id,
                    status: report.weekly_report?.status || report.status,
                    submitted_at: report.weekly_report?.submitted_at || report.submitted_at,
                    department: report.department,
                    attendance: sections.is_absent ? '✗ Absent' : '✓ Present',
                    selfRating: reportData.self_rating,
                    kpis: kpiList,
                    sections,
                    details: reportData.details,
                    total_score: reportData.total_score,
                    achievements: reportData.achievements.map(getReportItemText).filter((text: string) => text.trim()),
                    accomplishments: reportData.achievements.map((item: any) => ({
                        title: getItemTitle(item),
                        done: !!item?.done || !!item?.completed,
                        is_starred: !!item?.is_starred || !!item?.starred,
                    })).filter((item: any) => item.title),
                    tasks_issues: reportData.tasks_issues.map((item: any) => ({
                        type: getItemType(item),
                        title: getItemTitle(item),
                        status: getItemStatus(item),
                    })).filter((item: any) => item.title),
                    priorities: prioritiesByDay,
                    upcoming_week_plan: prioritiesByDay,
                    upcoming_week_plan_items: weekPlan.flat,
                    weeklyNotes: reportData.remarks || [],
                    remarks: reportData.remarks.map((item: any) => ({
                        title: getItemTitle(item),
                        type: typeof item === 'object' && item ? Object.keys(item)[0] || 'remark' : 'remark',
                    })).filter((item: any) => item.title),
                    past_kpis: reportData.past_kpis,
                };
            });
    };

    const buildMeetingNotesObject = (selectedReviews: any[], missedMembers: any[], notesText: string) => ({
        missed_report_members: missedMembers.map((member: any) => member.name || member).filter(Boolean),
        key_discussion_points: stripMissedMembersPrefix(notesText).trim(),
        detailed_reports: selectedReviews.map((review: any) => ({
            user_id: review.user_id,
            name: review.name,
            attendance: review.attendance,
            self_rating: `${review.selfRating || 'N/A'}/10`,
            kpis: review.kpis,
            accomplishments: review.accomplishments?.length
                ? review.accomplishments
                : review.achievements.map((text: string) => ({ text, done: true })),
            tasks_issues: review.tasks_issues || [],
            remarks: review.remarks || [],
            upcoming_week_plan: review.priorities,
        })),
    });

    const getMeetingJournalId = (report: any) => report?.meeting_journal_id || report?.journal_id || null;

    const normalizeMeetingJournal = (report: any) => report
        ? {
            ...report,
            journal_id: getMeetingJournalId(report),
        }
        : null;

    const getSubmittedMeetingReport = (reports: any[] = []) =>
        normalizeMeetingJournal(
            reports.find((report: any) => getMeetingJournalId(report) && report.report_data?.meeting_notes)
            || reports.find((report: any) => getMeetingJournalId(report) && report.checked_in_meeting === true)
            || reports.find((report: any) => getMeetingJournalId(report))
            || null
        );

    const getSubmittedMeetingJournal = () => {
        const reports = weeklyData?.member_reports || [];
        return getSubmittedMeetingReport(reports) || submittedMeetingJournalOverride;
    };

    const fetchJournalDetails = async (journalId: number, token: string) => {
        const detailResponse = await axios.get(`${getBaseUrl()}/user_journals/${journalId}.json`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return detailResponse.data?.data ?? detailResponse.data ?? {};
    };

    const findSubmittedMeetingJournalFromDetails = async (reports: any[], token: string) => {
        const candidateIds = [...new Set(
            reports
                .flatMap((report: any) => [report?.meeting_journal_id, report?.journal_id])
                .filter((id: any) => Number.isFinite(Number(id)))
        )];

        for (const journalId of candidateIds) {
            try {
                const detail = await fetchJournalDetails(Number(journalId), token);
                if (detail?.report_data?.meeting_notes) {
                    return {
                        journal_id: Number(journalId),
                        report_data: detail.report_data,
                    };
                }
            } catch (detailError) {
                console.error('Error checking weekly meeting journal details:', detailError);
            }
        }

        return null;
    };

    // Helper function to generate comprehensive meeting notes
    const generateDynamicPayload = () => {
        if (!weeklyData) return null;

        const selectedReports = getSelectedReportRows();
        const selectedUserIds = selectedReports.map((report) => report.user_id).filter(Boolean);
        const submittedReportRows = getSubmittedWeeklyReports();
        const missedWeeklyMembers = getMissedWeeklyMembers();
        const selectedKeys = new Set(selectedReports.map((report: any) => String(getReportSelectionKey(report))));
        const allSubmittedSelected = submittedReportRows.length > 0 && submittedReportRows.every((report: any) => selectedKeys.has(String(getReportSelectionKey(report))));
        const kpiSummary = extractKpiSummary(selectedReports);
        const openIssues = extractOpenIssues(selectedReports);
        const goalsProgress = extractGoalsProgress(selectedReports);
        const detailedReviews = buildDetailedReviews(selectedReports);
        const {
            allAccomplishments,
            allTasksIssues,
            allUpcomingWeekPlan,
            allRemarks,
            allPastKpis,
            avgSelfRating,
            combinedKpis,
        } = buildCombinedData(selectedReports);

        if (detailedReviews.length === 0) {
            toast.error('Please select at least one submitted report before saving meeting notes');
            return null;
        }

        // Build comprehensive notes
        let dynamicNotes = '';

        // Team Members who failed to submit
        dynamicNotes += `Team Members who failed to submit Reports (${missedWeeklyMembers.length}):\n\n`;
        if (missedWeeklyMembers.length > 0) {
            missedWeeklyMembers.forEach((member) => {
                dynamicNotes += `${member.name}\n`;
            });
        }
        dynamicNotes += '\n';

        // Key Discussion Points & KPI Summary
        dynamicNotes += `Key Discussion Points:\n\n`;
        dynamicNotes += `KPI SUMMARY\n`;
        Object.entries(kpiSummary).forEach(([kpi, data]: any) => {
            const percentage = Math.round((data.achieved / data.total) * 100) || 0;
            dynamicNotes += `${kpi}: ${percentage}% average achievement\n`;
            data.names.forEach((name: string) => {
                dynamicNotes += `  ${name}: ${data.achieved}/${data.total} (${percentage}%)\n`;
            });
        });
        dynamicNotes += '\n';

        // Open Issues & Tasks
        if (openIssues.length > 0) {
            dynamicNotes += `OPEN ISSUES & TASKS\n`;
            dynamicNotes += `High Priority Issues (${openIssues.length}):\n\n`;
            openIssues.forEach((issue, index) => {
                dynamicNotes += `${index + 1}. ${issue.issue} (${issue.assignee}) - ${issue.status}\n`;
            });
            dynamicNotes += '\n';
        }

        // Goals Progress
        if (goalsProgress.length > 0) {
            dynamicNotes += `GOALS PROGRESS\n`;
            goalsProgress.forEach((goal) => {
                dynamicNotes += `${goal.goal}: ${goal.progress}% (${goal.status})\n`;
            });
            dynamicNotes += '\n';
        }

        // Detailed Reviews
        if (detailedReviews.length > 0) {
            dynamicNotes += `DETAILED REVIEWS\n\n`;
            detailedReviews.forEach((review) => {
                dynamicNotes += `${review.name}\n`;
                dynamicNotes += `Attendance: ${review.attendance}\n`;
                dynamicNotes += `Self Rating: ${review.selfRating || 'N/A'}/10\n`;

                if (review.kpis.length > 0) {
                    dynamicNotes += `KPIs:\n`;
                    review.kpis.forEach((kpi) => {
                        dynamicNotes += `  - ${kpi}\n`;
                    });
                }

                if (review.achievements.length > 0) {
                    dynamicNotes += `Top Wins:\n`;
                    review.achievements.forEach((achievement) => {
                        dynamicNotes += `  ✓ ${achievement}\n`;
                    });
                }

                if (Object.keys(review.priorities).length > 0) {
                    dynamicNotes += `Next Week Priorities:\n`;
                    Object.entries(review.priorities).forEach(([day, priorities]: any) => {
                        if (Array.isArray(priorities) && priorities.length > 0) {
                            dynamicNotes += ` ${day}:\n`;
                            priorities.forEach((p: string) => {
                                dynamicNotes += `   - ${p}\n`;
                            });
                        }
                    });
                }

                dynamicNotes += '\n';
            });
        }

        const meetingNotesObj = buildMeetingNotesObject(detailedReviews, missedWeeklyMembers, meetingNotes);

        return {
            meeting_id: selectedMeeting,
            meeting_config_id: Number(selectedMeeting),
            meeting_config_type: 'WeeklyMeetingConfig',
            week: getWeekString(currentWeek),
            week_number: weeklyData.week.replace('W', ''),
            year: weeklyData.year,
            user_ids: selectedUserIds,
            member_ids: selectedUserIds,
            report_data: {
                meeting_notes: meetingNotesObj,
                accomplishments: allAccomplishments.map((item: any) => ({
                    title: item.title || item.text || '',
                    text: item.text || item.title || '',
                    member: item.member,
                    user_id: item.user_id,
                    is_starred: !!item.is_starred || !!item.starred,
                })),
                tasks_issues: allTasksIssues.map((item: any) => ({
                    type: getItemType(item),
                    title: item.title || item.text || '',
                    text: item.text || item.title || '',
                    status: item.status || 'open',
                    member: item.member,
                    user_id: item.user_id,
                })),
                upcoming_week_plan: allUpcomingWeekPlan.map(mapPlanItemForPayload),
                tomorrow_plan: allUpcomingWeekPlan.map(mapPlanItemForPayload),
                kpi_summary: kpiSummary,
                open_issues: openIssues,
                goals_progress: goalsProgress,
                detailed_reviews: detailedReviews,
                all_tasks_issues: allTasksIssues,
                all_accomplishments: allAccomplishments,
                all_upcoming_week_plan: allUpcomingWeekPlan,
                all_remarks: allRemarks,
                all_past_kpis: allPastKpis,
                total_submitted: submittedReportRows.length,
                total_missed: missedWeeklyMembers.length,
                total_members: weeklyData.total_members,
                selected_member_count: detailedReviews.length,
                mark_all_attended: allSubmittedSelected,
                average_self_rating: avgSelfRating,
                combined_kpis: combinedKpis,
                generated_notes: dynamicNotes,
                selected_user_ids: selectedUserIds,
            }
        };
    };

    const handleSaveMeeting = async () => {
        try {
            setSaveMeetingLoading(true);
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                toast.error('Missing authentication details');
                return;
            }

            const submittedMeetingJournal = getSubmittedMeetingJournal();

            if (submittedMeetingJournal?.journal_id) {
                const existingReportData = submittedMeetingJournal.report_data || {};
                const existingMeetingNotes = existingReportData.meeting_notes || {};

                await axios.patch(
                    `${baseUrl}/user_journals/${submittedMeetingJournal.journal_id}.json`,
                    {
                        report_data: {
                            ...existingReportData,
                            meeting_notes: {
                                ...existingMeetingNotes,
                                key_discussion_points: stripMissedMembersPrefix(meetingNotes).trim(),
                            },
                        },
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                toast.success('Meeting notes updated successfully');
                onMeetingSaved?.();
                return;
            }

            const dynamicPayload = generateDynamicPayload();

            if (!dynamicPayload) {
                console.warn('Unable to generate payload - no weekly data available');
                return;
            }

            const response = await axios.post(
                `${baseUrl}/user_journals/submit_weekly_meeting.json`,
                dynamicPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Meeting saved successfully:', response.data);
            const savedMeetingJournal = response.data?.data ?? response.data;
            if (savedMeetingJournal?.id) {
                setSubmittedMeetingJournalOverride({
                    ...savedMeetingJournal,
                    journal_id: savedMeetingJournal.id,
                    report_data: savedMeetingJournal.report_data || dynamicPayload.report_data,
                });
            }
            toast.success('Meeting notes saved successfully');
            onMeetingSaved?.();
        } catch (error: any) {
            console.error('Error saving meeting:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to save meeting notes';
            toast.error(errorMsg);
        } finally {
            setSaveMeetingLoading(false);
        }
    };

    const getSelectedPriorityDay = (userId: number) => selectedPriorityDays[userId] || 'Mon';

    const createPriorityItem = (text: string) => ({
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
        text,
        starred: false,
    });

    const handleAddPriority = async (report: any, priorityText: string, day: string) => {
        if (!priorityText.trim()) {
            console.warn('Priority text is empty');
            return;
        }

        const weeklyReportId = report?.weekly_report?.id;
        const loadingKey = report?.user_id;

        if (!weeklyReportId || !loadingKey) {
            toast.error('Priority can be added only after weekly report is submitted');
            return;
        }

        try {
            setPriorityLoading(prev => ({ ...prev, [loadingKey]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            // Get existing report_data or initialize empty
            const existingReportData = report.weekly_report?.report_data || report.report_data || {};

            // Get existing tasks or initialize empty array
            const existingTasks = existingReportData.upcoming_week_plan || existingReportData.tasks || [];

            // Merge new priority with existing tasks
            const dayKey = day.toLowerCase();
            let mergedTasks: any[];

            if (Array.isArray(existingTasks) && existingTasks.length > 0 && typeof existingTasks[0] === 'object' && !Array.isArray(existingTasks[0])) {
                // Tasks are in day-keyed format: [{ mon: [...], tue: [...], ... }]
                const dayKeyedObject = existingTasks[0];
                const updatedDayObject = {
                    ...dayKeyedObject,
                    [dayKey]: [...(dayKeyedObject[dayKey] || []), createPriorityItem(priorityText)]
                };
                mergedTasks = [updatedDayObject];
            } else {
                // Initialize new day-keyed format
                mergedTasks = [{
                    [dayKey]: [createPriorityItem(priorityText)]
                }];
            }

            // Create complete merged payload with all existing data
            const payload = {
                user_id: report.user_id,
                name: report.name,
                email: report.email,
                department: report.department,
                status: report.status,
                journal_id: report.journal_id,
                report_data: {
                    ...existingReportData,
                    upcoming_week_plan: mergedTasks,
                    tasks: existingReportData.tasks || [],
                    kpi: existingReportData.kpi || '',
                    achievements: existingReportData.achievements || [],
                    remarks: existingReportData.remarks || [],
                    remark_type: existingReportData.remark_type || 'remark',
                    past_kpis: existingReportData.past_kpis || [],
                    total_score: existingReportData.total_score || 0,
                    sections: existingReportData.sections || {
                        daily_scores: [0, 0, 0, 0, 0],
                        bonus: 0,
                        self_rating: 0,
                        is_absent: false
                    },
                    details: existingReportData.details || {
                        self_rating: 0,
                        is_absent: false
                    }
                }
            };

            await axios.put(
                `${baseUrl}/user_journals/${weeklyReportId}.json`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Clear the input after successful submit
            setPriorityInputs(prev => ({ ...prev, [loadingKey]: '' }));
            console.log('Priority added successfully');

            // Refresh the weekly data
            if (selectedMeeting) {
                const weekString = getWeekString(currentWeek);
                const response = await axios.get(
                    `${baseUrl}/user_journals/weekly_meeting?meeting_id=${selectedMeeting}&week=${weekString}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setWeeklyData(response.data.data);
            }
        } catch (error) {
            console.error('Error adding priority:', error);
        } finally {
            setPriorityLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const fetchRatings = async (userId: number) => {
        try {
            setRatingsLoading(prev => ({ ...prev, [userId]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            const loggedInUserId = localStorage.getItem('userId') || '';
            const response = await axios.get(
                `${baseUrl}/ratings?resource_type=User&resource_id=${userId}&rating_from_id=${loggedInUserId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setRatingsData(prev => ({ ...prev, [userId]: response.data }));
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setRatingsLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleSubmitFeedback = async (userId: number, journalId: number) => {
        const feedbackText = feedbackInputs[userId]?.trim();
        const score = feedbackScores[userId];

        if (!feedbackText) {
            console.warn('Feedback text is empty');
            return;
        }

        if (!score) {
            console.warn('Please select a rating');
            return;
        }

        try {
            setFeedbackLoading(prev => ({ ...prev, [userId]: true }));
            const baseUrl = getBaseUrl();
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            await axios.post(
                `${baseUrl}/ratings`,
                {
                    resource_type: 'User',
                    resource_id: userId,
                    rating_from_id: localStorage.getItem('userId') || '',
                    score: score,
                    reviews: feedbackText,
                    positive_opening: '',
                    constructive_feedback: '',
                    positive_closing: ''
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Feedback submitted successfully');
            // Clear inputs after successful submission
            setFeedbackInputs(prev => ({ ...prev, [userId]: '' }));
            setFeedbackScores(prev => ({ ...prev, [userId]: 0 }));
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setFeedbackLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Helper function to get week string in format YYYY-Www
    const getWeekString = (date: Date): string => {
        const year = date.getFullYear();
        const week = String(getWeek(date)).padStart(2, '0');
        return `${year}-W${week}`;
    };

    // Helper function to get week range (Monday to Sunday)
    const getWeekRange = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);
        return { monday, sunday };
    };

    // Fetch meeting configs
    useEffect(() => {
        const fetchWeeklyMeetings = async () => {
            try {
                setLoading(true)
                const baseUrl = getBaseUrl()
                const token = localStorage.getItem('token')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `${baseUrl}/weekly_meeting_configs`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data
                const configs = Array.isArray(data) ? data : data.data || []
                setMeetingConfigs(configs)

                if (configs.length > 0) {
                    const defaultMeeting = configs.find((config: any) => config.is_default && config.active !== false);
                    const firstActiveMeeting = configs.find((config: any) => config.active !== false);
                    const nextMeeting = defaultMeeting || firstActiveMeeting || configs[0];
                    setSelectedMeetingState((current) => {
                        if (current) return current;
                        const nextMeetingId = String(nextMeeting.id);
                        onSelectedMeetingChange?.(nextMeetingId);
                        return nextMeetingId;
                    });
                }
            } catch (error) {
                console.error('Error fetching weekly meetings:', error)
                // Don't show error toast on initial load
            } finally {
                setLoading(false)
            }
        }

        fetchWeeklyMeetings();
    }, []);

    // Fetch weekly meeting data when meeting or week changes
    useEffect(() => {
        const fetchWeeklyData = async () => {
            if (!selectedMeeting) {
                setWeeklyData(null);
                return;
            }

            try {
                setWeeklyDataLoading(true);
                setSubmittedMeetingJournalOverride(null);
                setSelectedReports([]);
                const baseUrl = getBaseUrl();
                const token = localStorage.getItem('token');

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage');
                    return;
                }

                const weekString = getWeekString(currentWeek);
                const response = await axios.get(
                    `${baseUrl}/user_journals/weekly_meeting?meeting_id=${selectedMeeting}&week=${weekString}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const nextWeeklyData = response.data.data;
                setWeeklyData(nextWeeklyData);

                let submittedMeetingReport = getSubmittedMeetingReport(nextWeeklyData?.member_reports || []);
                let savedNotes = submittedMeetingReport?.report_data?.meeting_notes?.key_discussion_points || '';

                if (!savedNotes) {
                    const detailMeetingReport = await findSubmittedMeetingJournalFromDetails(nextWeeklyData?.member_reports || [], token);
                    if (detailMeetingReport) {
                        submittedMeetingReport = detailMeetingReport;
                        setSubmittedMeetingJournalOverride(detailMeetingReport);
                        savedNotes = detailMeetingReport.report_data?.meeting_notes?.key_discussion_points || '';
                    }
                }

                const missedWeeklyMembers = getMissedWeeklyMembers(nextWeeklyData);
                const noteText = savedNotes
                    ? stripMissedMembersPrefix(savedNotes).trim()
                    : `**Team Members Who Missed Report (${missedWeeklyMembers.length}):**\n` +
                    missedWeeklyMembers.map((m: any) => `- ${m.name}`).join("\n") +
                    `\n\n**Key Discussion Points:**\n`;
                setMeetingNotes(submittedMeetingReport ? stripMissedMembersPrefix(noteText).trim() : noteText);
            } catch (error) {
                console.error('Error fetching weekly data:', error);
                setWeeklyData(null);
            } finally {
                setWeeklyDataLoading(false);
            }
        };

        fetchWeeklyData();
    }, [selectedMeeting, currentWeek]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if click is outside the priority dropdown button and menu
            if (!target.closest('[data-priority-dropdown]')) {
                setShowDayDropdown(null);
            }
        };

        if (showDayDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showDayDropdown]);

    const submittedReports = getSubmittedWeeklyReports();
    const missedMembers = getMissedWeeklyMembers();
    const submittedMeetingJournal = getSubmittedMeetingJournal();
    const isSubmittedMeeting = !!submittedMeetingJournal?.journal_id;
    const visibleReportIds = submittedReports.map((report: any) => String(getReportSelectionKey(report)));
    const selectedReportKeys = selectedReports.map((id) => String(id));
    const areAllVisibleReportsSelected =
        visibleReportIds.length > 0 &&
        visibleReportIds.every((id: string) => selectedReportKeys.includes(id));

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedReports(submittedReports.map((report: any) => getReportSelectionKey(report)).filter(Boolean));
            return;
        }

        const checkedInIds = submittedReports
            .filter((report: any) => report.checked_in_meeting === true)
            .map((report: any) => getReportSelectionKey(report))
            .filter(Boolean);
        setSelectedReports(checkedInIds);
    };

    return (
        <div className="space-y-6 mt-6 max-w-full overflow-x-hidden">
            {/* Week Selector and Stats */}
            <WeekSelector
                currentWeek={currentWeek}
                selectedMeeting={selectedMeeting}
                meetingConfigs={meetingConfigs}
                loading={loading}
                weeklyData={weeklyData}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onWeekChange={setCurrentWeek}
                onMeetingChange={setSelectedMeeting}
            />

            {/* Main Content */}
            <div className="border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden bg-white max-w-full">
                <div className="p-4 border-b border-[rgba(218,119,86,0.1)] flex justify-between items-start flex-wrap gap-3 bg-[#fff8f5]">
                    <div>
                        <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-[rgba(218,119,86,0.22)] shadow-sm">
                                <CalendarIcon className="w-4 h-4 text-[#CE7A5A]" />
                            </div>
                            Weekly Reports
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            {weeklyData?.week ? `Week ${weeklyData.week.replace('W', '')}, ${weeklyData.year}` : 'Select a meeting'} {weeklyData?.week_label && `(${weeklyData.week_label})`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-3">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#CE7A5A] text-white shadow-sm">
                            Total: {weeklyData?.total_members || 0}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white text-emerald-700 border border-emerald-200 shadow-sm">
                            Submitted: {submittedReports.length}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white text-[#b91c1c] border border-red-200 shadow-sm">
                            Missed: {missedMembers.length}
                        </span>
                    </div>
                </div>

                {weeklyDataLoading ? (
                    <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                        Loading reviews...
                    </div>
                ) : submittedReports.length === 0 && missedMembers.length === 0 ? (
                    <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                        No reports found for this selection.
                    </div>
                ) : submittedReports.length > 0 ? (
                    <div className="p-4 bg-[#f8fafc]">
                        <MeetingNotes
                            meetingNotes={meetingNotes}
                            markAllAttended={areAllVisibleReportsSelected}
                            isSubmittedMeeting={isSubmittedMeeting}
                            saveMeetingLoading={saveMeetingLoading}
                            onMeetingNotesChange={setMeetingNotes}
                            onMarkAllAttendedChange={handleSelectAll}
                            onSaveMeeting={handleSaveMeeting}
                            onClearNotes={() => setMeetingNotes('')}
                        />

                        <div className="grid gap-4 max-h-[640px] overflow-y-auto overflow-x-hidden min-w-0 mt-6 pr-1">
                            {submittedReports.map((report: any) => (
                                <MemberReportCard
                                    key={report.user_id}
                                    report={report}
                                    isExpanded={expandedUserId === report.user_id}
                                    isChecked={isCheckedInMeeting(report) || selectedReportKeys.includes(String(getReportSelectionKey(report)))}
                                    isAttendanceLocked={isSubmittedMeeting || isCheckedInMeeting(report)}
                                    activeTab={activeTab}
                                    priorityText={priorityInputs[report.user_id] || ''}
                                    selectedPriorityDay={getSelectedPriorityDay(report.user_id)}
                                    showDayDropdown={showDayDropdown}
                                    priorityLoading={priorityLoading}
                                    feedbackText={feedbackInputs[report.user_id] || ''}
                                    feedbackScore={feedbackScores[report.user_id] || 0}
                                    feedbackLoading={feedbackLoading}
                                    ratingsData={ratingsData}
                                    ratingsLoading={ratingsLoading}
                                    daysOfWeek={daysOfWeek}
                                    onExpand={() => setExpandedUserId(expandedUserId === report.user_id ? null : report.user_id)}
                                    onUserCheck={(isChecked) => handleUserCheck(report, isChecked)}
                                    onPriorityChange={(text) => setPriorityInputs(prev => ({ ...prev, [report.user_id]: text }))}
                                    onPriorityDaySelect={(day) => {
                                        setSelectedPriorityDays(prev => ({ ...prev, [report.user_id]: day }));
                                        setShowDayDropdown(null);
                                    }}
                                    onTogglePriorityDropdown={() => setShowDayDropdown(showDayDropdown === `priority-${report.user_id}` ? null : `priority-${report.user_id}`)}
                                    onAddPriority={() => handleAddPriority(report, priorityInputs[report.user_id] || '', getSelectedPriorityDay(report.user_id))}
                                    onFeedbackChange={(text) => setFeedbackInputs(prev => ({ ...prev, [report.user_id]: text }))}
                                    onFeedbackScoreChange={(score) => setFeedbackScores(prev => ({ ...prev, [report.user_id]: score }))}
                                    onSubmitFeedback={() => handleSubmitFeedback(report.user_id, report?.weekly_report?.id)}
                                    onTabChange={setActiveTab}
                                    onFetchRatings={fetchRatings}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                        No submitted weekly reports for this selection.
                    </div>
                )}
            </div>

            {missedMembers.length > 0 && (
                <div className="bg-[#fff7f7] border border-red-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
                        <AlertTriangle className="w-4 h-4" />
                        Team Members Who Failed to Submit ({missedMembers.length}):
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {missedMembers.map((member: any, index: number) => (
                            <div
                                key={member.id ?? index}
                                className="flex items-center gap-2 bg-white border border-red-100 px-3 py-1.5 rounded-full shadow-sm"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-[12px] font-bold text-gray-700">
                                    {member.name || member}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyReviews;
