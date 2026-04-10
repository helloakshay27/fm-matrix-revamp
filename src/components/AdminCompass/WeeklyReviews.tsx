import { useState, useEffect } from 'react';
import { AlertTriangle, CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { getWeek } from 'date-fns';
import { WeekSelector } from './WeeklyReviews/WeekSelector';
import { MeetingNotes } from './WeeklyReviews/MeetingNotes';
import { MemberReportCard } from './WeeklyReviews/MemberReportCard';

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

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    const handleSaveMeeting = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                console.warn('Missing baseUrl or token in localStorage');
                return;
            }

            await axios.post(
                `https://${baseUrl}/user_journals/save_meeting`,
                {
                    meeting_id: selectedMeeting,
                    week: getWeekString(currentWeek),
                    notes: meetingNotes,
                    mark_all_attended: markAllAttended,
                    ai_summary: aiSummary,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Meeting saved successfully');
        } catch (error) {
            console.error('Error saving meeting:', error);
        }
    };

    const handleAddToCalendar = () => {
        // TODO: Implement calendar integration
        console.log('Add to calendar clicked');
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
