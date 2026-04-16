import { useState, useEffect } from 'react';
import { AlertTriangle, CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { getWeek } from 'date-fns';
import { WeekSelector } from './WeeklyReviews/WeekSelector';
import { MeetingNotes } from './WeeklyReviews/MeetingNotes';
import { MemberReportCard } from './WeeklyReviews/MemberReportCard';
import { toast } from 'sonner';

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
        report_data: any;
        weekly_report: any;
    }>;
}

const WeeklyReviews = () => {
    const [selectedMeeting, setSelectedMeeting] = useState('');
    const [meetingConfigs, setMeetingConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [weeklyDataLoading, setWeeklyDataLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [weeklyData, setWeeklyData] = useState<WeeklyMeetingData | null>(null);
    const [meetingNotes, setMeetingNotes] = useState('');
    const [markAllAttended, setMarkAllAttended] = useState(false);
    const [aiSummary, setAiSummary] = useState(false);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Daily');
    const [selectedPriorityDay, setSelectedPriorityDay] = useState<string>('Mon');
    const [showDayDropdown, setShowDayDropdown] = useState<string | null>(null);
    const [priorityInputs, setPriorityInputs] = useState<Record<number, string>>({});
    const [priorityLoading, setPriorityLoading] = useState<Record<number, boolean>>({});
    const [ratingsData, setRatingsData] = useState<Record<number, any>>({});
    const [ratingsLoading, setRatingsLoading] = useState<Record<number, boolean>>({});
    const [feedbackInputs, setFeedbackInputs] = useState<Record<number, string>>({});
    const [feedbackScores, setFeedbackScores] = useState<Record<number, number>>({});
    const [feedbackLoading, setFeedbackLoading] = useState<Record<number, boolean>>({});
    const [saveMeetingLoading, setSaveMeetingLoading] = useState(false);
    const [checkedUsers, setCheckedUsers] = useState<Record<number, boolean>>({});

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleUserCheck = (userId: number, isChecked: boolean) => {
        setCheckedUsers(prev => ({ ...prev, [userId]: isChecked }));
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    // Helper function to extract KPI summary from member reports
    const extractKpiSummary = () => {
        if (!weeklyData?.member_reports) return {};

        const kpiMap: Record<string, { total: number; achieved: number; names: string[] }> = {};

        weeklyData.member_reports.forEach((report) => {
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
    const extractOpenIssues = () => {
        if (!weeklyData?.member_reports) return [];

        const issues: Array<{ issue: string; assignee: string; status: string }> = [];

        weeklyData.member_reports.forEach((report) => {
            const remarks = report.report_data?.remarks || report.weekly_report?.report_data?.remarks || [];
            if (Array.isArray(remarks)) {
                remarks.forEach((remark: any) => {
                    if (typeof remark === 'string' && remark.trim()) {
                        issues.push({
                            issue: remark,
                            assignee: report.name,
                            status: 'open'
                        });
                    }
                });
            }
        });

        return issues;
    };

    // Helper function to extract goals progress
    const extractGoalsProgress = () => {
        if (!weeklyData?.member_reports) return [];

        const goalsMap: Record<string, { progress: number; status: string }> = {};

        weeklyData.member_reports.forEach((report) => {
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
    const buildDetailedReviews = () => {
        if (!weeklyData?.member_reports) return [];

        return weeklyData.member_reports
            .filter(report => report.weekly_report !== null && checkedUsers[report.user_id])
            .map((report) => {
                const reportData = report.report_data || report.weekly_report?.report_data || {};
                const sections = reportData.sections || {};
                const tasks = reportData.tasks || [];
                const achievements = reportData.achievements || [];

                // Extract priorities by day
                const prioritiesByDay: Record<string, string[]> = {};
                if (Array.isArray(tasks) && tasks.length > 0 && typeof tasks[0] === 'object') {
                    Object.assign(prioritiesByDay, tasks[0]);
                }

                // Get KPI data
                const kpiList = [];
                if (reportData.kpi) {
                    kpiList.push(reportData.kpi);
                }

                return {
                    name: report.name,
                    email: report.email,
                    department: report.department,
                    attendance: sections.is_absent ? '✗ Absent' : '✓ Present',
                    selfRating: sections.self_rating || reportData.details?.self_rating || null,
                    kpis: kpiList,
                    achievements: achievements.filter((a: any) => a && a.trim && a.trim()),
                    priorities: prioritiesByDay,
                    weeklyNotes: reportData.remarks || []
                };
            });
    };

    // Helper function to generate comprehensive meeting notes
    const generateDynamicPayload = () => {
        if (!weeklyData) return null;

        const kpiSummary = extractKpiSummary();
        const openIssues = extractOpenIssues();
        const goalsProgress = extractGoalsProgress();
        const detailedReviews = buildDetailedReviews();

        // Build comprehensive notes
        let dynamicNotes = '';

        // Team Members who failed to submit
        dynamicNotes += `Team Members who failed to submit Reports (${weeklyData.missed}):\n\n`;
        if (weeklyData.missed_members && weeklyData.missed_members.length > 0) {
            weeklyData.missed_members.forEach((member) => {
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

        return {
            meeting_id: selectedMeeting,
            week: getWeekString(currentWeek),
            week_number: weeklyData.week.replace('W', ''),
            year: weeklyData.year,
            notes: dynamicNotes,
            report_data: {
                kpi_summary: kpiSummary,
                open_issues: openIssues,
                goals_progress: goalsProgress,
                detailed_reviews: detailedReviews,
                total_submitted: weeklyData.submitted,
                total_missed: weeklyData.missed,
                total_members: weeklyData.total_members
            }
        };
    };

    const handleSaveMeeting = async () => {
        try {
            setSaveMeetingLoading(true);
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                toast.error('Missing authentication details');
                return;
            }

            const dynamicPayload = generateDynamicPayload();

            if (!dynamicPayload) {
                console.warn('Unable to generate payload - no weekly data available');
                toast.error('Unable to generate meeting payload');
                return;
            }

            await axios.post(
                `https://${baseUrl}/user_journals/submit_weekly_meeting.json`,
                dynamicPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Meeting notes saved successfully');
        } catch (error) {
            console.error('Error saving meeting:', error);
            toast.error('Failed to save meeting notes');
        } finally {
            setSaveMeetingLoading(false);
        }
    };

    const handleAddPriority = async (userId: number, priorityText: string, day: string) => {
        if (!priorityText.trim()) {
            console.warn('Priority text is empty');
            return;
        }

        try {
            setPriorityLoading(prev => ({ ...prev, [userId]: true }));
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            // Find the report to get existing data
            const report = weeklyData?.member_reports?.find(r => r?.weekly_report?.id === userId);
            if (!report) {
                console.warn('Report not found');
                return;
            }

            // Get existing report_data or initialize empty
            const existingReportData = report.weekly_report?.report_data || report.report_data || {};

            // Get existing tasks or initialize empty array
            const existingTasks = existingReportData.tasks || [];

            // Merge new priority with existing tasks
            const dayKey = day.toLowerCase();
            let mergedTasks: any[];

            if (Array.isArray(existingTasks) && existingTasks.length > 0 && typeof existingTasks[0] === 'object' && !Array.isArray(existingTasks[0])) {
                // Tasks are in day-keyed format: [{ mon: [...], tue: [...], ... }]
                const dayKeyedObject = existingTasks[0];
                const updatedDayObject = {
                    ...dayKeyedObject,
                    [dayKey]: [...(dayKeyedObject[dayKey] || []), priorityText]
                };
                mergedTasks = [updatedDayObject];
            } else {
                // Initialize new day-keyed format
                mergedTasks = [{
                    [dayKey]: [priorityText]
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
                    tasks: mergedTasks,
                    kpi: existingReportData.kpi || 'weekly value',
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
                `https://${baseUrl}/user_journals/${userId}.json`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Clear the input after successful submit
            setPriorityInputs(prev => ({ ...prev, [userId]: '' }));
            console.log('Priority added successfully');

            // Refresh the weekly data
            if (selectedMeeting) {
                const weekString = getWeekString(currentWeek);
                const response = await axios.get(
                    `https://${baseUrl}/user_journals/weekly_meeting?meeting_id=${selectedMeeting}&week=${weekString}`,
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
            setPriorityLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const fetchRatings = async (userId: number) => {
        try {
            setRatingsLoading(prev => ({ ...prev, [userId]: true }));
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            const response = await axios.get(
                `https://${baseUrl}/ratings.json?resource_id=${userId}&resource_type=User`,
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
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            await axios.post(
                `https://${baseUrl}/ratings`,
                {
                    resource_type: 'User',
                    resource_id: userId,
                    score: score,
                    reviews: feedbackText
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
                const baseUrl = localStorage.getItem('baseUrl')
                const token = localStorage.getItem('token')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `https://${baseUrl}/weekly_meeting_configs`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data
                setMeetingConfigs(Array.isArray(data) ? data : data.data || [])
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
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage');
                    return;
                }

                const weekString = getWeekString(currentWeek);
                const response = await axios.get(
                    `https://${baseUrl}/user_journals/weekly_meeting?meeting_id=${selectedMeeting}&week=${weekString}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setWeeklyData(response.data.data);

                const noteText =
                    `**Team Members Who Missed Report (${response.data?.data?.missed_members?.length}):**\n` +
                    response.data?.data?.missed_members?.map((m: any) => `- ${m.name}`).join("\n") +
                    `\n\n**Key Discussion Points:**\n`;
                setMeetingNotes(noteText);
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

    return (
        <div className="space-y-6 mt-6">
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
            <div className="space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#DA7756]" />
                    <h2 className="text-lg font-bold text-[#1a1a1a]">
                        Team Reviews - {weeklyData?.week ? `Week ${weeklyData.week.replace('W', '')}, ${weeklyData.year}` : 'Select a meeting'} {weeklyData?.week_label && `(${weeklyData.week_label})`}
                    </h2>
                </div>

                {/* Missed Reports */}
                <div className="space-y-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#DA7756]">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Missed Reports ({weeklyData?.missed || 0}):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {weeklyData?.missed_members && weeklyData.missed_members.length > 0 ? (
                            weeklyData.missed_members.map((member: any) => (
                                <div key={member.id} className="rounded-[6px] bg-[#DA7756] text-xs text-white px-3 py-1">
                                    {member.name}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500">No missed reports</p>
                        )}
                    </div>
                </div>

                {/* Meeting Notes */}
                <MeetingNotes
                    meetingNotes={meetingNotes}
                    markAllAttended={markAllAttended}
                    aiSummary={aiSummary}
                    saveMeetingLoading={saveMeetingLoading}
                    onMeetingNotesChange={setMeetingNotes}
                    onMarkAllAttendedChange={setMarkAllAttended}
                    onAiSummaryChange={setAiSummary}
                    onSaveMeeting={handleSaveMeeting}
                    onClearNotes={() => setMeetingNotes('')}
                />

                {/* === MEMBER REPORTS SECTION === */}
                {weeklyDataLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-[#fef6f4] py-16 text-center border border-[#DA7756]/15">
                        <p className="text-neutral-700 font-bold text-lg">Loading reviews...</p>
                    </div>
                ) : weeklyData?.member_reports && weeklyData.member_reports.length > 0 ? (
                    <div className="space-y-3">
                        {weeklyData.submitted > 0 && (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                <p className="text-sm font-bold text-green-700">{weeklyData.submitted} report(s) submitted</p>
                            </div>
                        )}
                        <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                            {weeklyData.member_reports
                                .filter((report: any) => report.weekly_report !== null)
                                .map((report: any) => (
                                    <MemberReportCard
                                        key={report.user_id}
                                        report={report}
                                        isExpanded={expandedUserId === report.user_id}
                                        isChecked={checkedUsers[report.user_id] || false}
                                        activeTab={activeTab}
                                        priorityText={priorityInputs[report.user_id] || ''}
                                        selectedPriorityDay={selectedPriorityDay}
                                        showDayDropdown={showDayDropdown}
                                        priorityLoading={priorityLoading}
                                        feedbackText={feedbackInputs[report.user_id] || ''}
                                        feedbackScore={feedbackScores[report.user_id] || 0}
                                        feedbackLoading={feedbackLoading}
                                        ratingsData={ratingsData}
                                        ratingsLoading={ratingsLoading}
                                        daysOfWeek={daysOfWeek}
                                        onExpand={() => setExpandedUserId(expandedUserId === report.user_id ? null : report.user_id)}
                                        onUserCheck={(isChecked) => handleUserCheck(report.user_id, isChecked)}
                                        onPriorityChange={(text) => setPriorityInputs(prev => ({ ...prev, [report.user_id]: text }))}
                                        onPriorityDaySelect={(day) => {
                                            setSelectedPriorityDay(day);
                                            setShowDayDropdown(null);
                                        }}
                                        onTogglePriorityDropdown={() => setShowDayDropdown(showDayDropdown === `priority-${report.user_id}` ? null : `priority-${report.user_id}`)}
                                        onAddPriority={() => handleAddPriority(report?.weekly_report?.id, priorityInputs[report.user_id] || '', selectedPriorityDay)}
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
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-[#fef6f4] py-16 text-center border border-[#DA7756]/15">
                        <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-6">
                            <CalendarIcon className="w-12 h-12 text-[#DA7756]/30" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-neutral-700 font-bold text-lg">No reviews submitted for this week</p>
                            {weeklyData && (
                                <p className="text-neutral-500 font-medium text-sm">
                                    {weeklyData.total_members} team members - {weeklyData.missed} pending
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyReviews;
