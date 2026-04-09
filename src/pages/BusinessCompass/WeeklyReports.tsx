import React from 'react';
import {
    Calendar,
    Info,
    TrendingUp,
    Trophy,
    Plus,
    Upload,
    CheckSquare,
    AlertTriangle,
    X,
    Star,
    Target,
    MessageSquare,
    Activity,
    Send,
    Zap,
    Smile,
    Users,
    User,
    ChevronUp,
    ChevronDown,
    BarChart3,
} from 'lucide-react';
import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { AdminViewEmulation } from '@/components/AdminViewEmulation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { AddTaskOrIssueDialog } from '@/components/BusinessCompass/AddTaskOrIssueDialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import { getUser } from '@/utils/auth';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { subDays } from 'date-fns';

/**
 * Page shell + surfaces match `SystemAndSOP.tsx`:
 * `min-h-[calc(100vh-5rem)] bg-[#f6f4ee]`, `max-w-6xl`, cards `rounded-2xl border border-[#DA7756]/20`.
 */
const accentEmphasis = '#DA7756';
const cardChrome =
    'overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm';
const sectionHeader =
    'border-b border-neutral-200/40 bg-white/60 px-4 py-4 sm:px-5';
const btnPrimary =
    'bg-[#DA7756] font-semibold text-white shadow-sm transition-colors hover:bg-[#c9673f]';
const btnOutline =
    'border border-[#DA7756]/25 bg-white text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/45';
const btnIcon =
    'inline-flex items-center justify-center rounded-lg border border-[#DA7756]/20 bg-white text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/40';
const badgePoints =
    'border-0 bg-[#DA7756] px-3 py-1 text-xs text-white hover:bg-[#DA7756]';

type RemarkChipId = 'breakthrough' | 'breakdown' | 'employee' | 'client' | 'empFeedback';

/** Remarks card border/bg + chip styles (native buttons — shadcn outline was overriding bg) */
const REMARK_CHIP_META: Record<
    RemarkChipId,
    { label: string; border: string; bg: string; chipActive: string; chipInactive: string }
> = {
    breakthrough: {
        label: 'Breakthrough',
        border: 'border-[#DA7756]',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#DA7756]/90',
    },
    breakdown: {
        label: 'One Breakdown',
        border: 'border-[#DA7756]',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#c9673f]',
    },
    employee: {
        label: 'One Employee',
        border: 'border-[#DA7756]',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#c9673f]',
    },
    client: {
        label: 'One Client Feedback',
        border: 'border-[#DA7756]/70',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#DA7756]/90',
    },
    empFeedback: {
        label: 'Employee Feedback',
        border: 'border-[#DA7756]/60',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#DA7756] bg-[#DA7756] text-white shadow-sm hover:bg-[#c9673f]',
    },
};

const WeeklyReports = () => {
    const [addTaskOpen, setAddTaskOpen] = React.useState(false);
    const achievementFileInputRef = React.useRef<HTMLInputElement>(null);
    const [achievementUploads, setAchievementUploads] = React.useState<{ name: string; size: number }[]>(
        []
    );

    const handleAchievementFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const currentCount = selectedFileNames.length;
        
        if (currentCount + newFiles.length > 5) {
            toast.error(`You can only upload a maximum of 5 files. You already have ${currentCount} selected.`);
            e.target.value = '';
            return;
        }

        const newNames = newFiles.map(f => f.name);
        setSelectedFileNames(prev => [...prev, ...newNames]);
        setUploadedFilesCount(prev => prev + newFiles.length);
        toast.success(`Added ${newFiles.length} file(s)`);
        e.target.value = ''; // Reset input to allow selecting same file again if removed
    };

    const [wins, setWins] = React.useState<string[]>([]);
    const [dayPlans, setDayPlans] = React.useState<Record<string, string[]>>({});
    const [remarksText, setRemarksText] = React.useState('');
    const [remarksList, setRemarksList] = React.useState<{type: RemarkChipId | null, text: string}[]>([]);
    const [activeRemarkChip, setActiveRemarkChip] = React.useState<RemarkChipId | null>(null);
    const [remarksInteracted, setRemarksInteracted] = React.useState(false);
    const remarksTextareaRef = React.useRef<HTMLTextAreaElement>(null);

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
    const [history, setHistory] = React.useState<any[]>([]);
    const [editingId, setEditingId] = React.useState<number | null>(null);
    const [showDailyWinsDialog, setShowDailyWinsDialog] = React.useState(false);
    const [dailyReports, setDailyReports] = React.useState<any[]>([]);
    const [isLoadingDailyReports, setIsLoadingDailyReports] = React.useState(false);
    const [selectedDailyWins, setSelectedDailyWins] = React.useState<string[]>([]);
    const [uploadedFilesCount, setUploadedFilesCount] = React.useState(0);
    const [selectedFileNames, setSelectedFileNames] = React.useState<string[]>([]);
    const currentUser = getUser();

    const refDate = React.useMemo(() => new Date(), []);
    const weekStart = React.useMemo(
        () => startOfWeek(refDate, { weekStartsOn: 1 }),
        [refDate]
    );
    const weekEnd = React.useMemo(
        () => endOfWeek(refDate, { weekStartsOn: 1 }),
        [refDate]
    );
    const monthTitle = format(refDate, 'MMM yyyy');
    const weekRangeLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
    const weekNumLabel = String(getISOWeek(refDate));
    const submitRangeLabel = `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM')}`;

    const upcomingDays = React.useMemo(() => {
        const start = new Date(weekEnd);
        start.setDate(start.getDate() + 1);
        const labels: { key: string; short: string; color: string; canAdd: boolean }[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const key = format(d, 'EEE d MMM');
            const colors = [
                'bg-white/80',
                'bg-[#f6f4ee]',
                'bg-white/80',
                'bg-[#f6f4ee]',
                'bg-white/80',
                'bg-[#f6f4ee]',
                'bg-white/80',
            ];
            const canAdd = i < 5;
            labels.push({
                key,
                short: format(d, 'EEE d MMM'),
                color: colors[i] ?? 'bg-slate-50',
                canAdd,
            });
        }
        return labels;
    }, [weekEnd]);

    const populateForm = React.useCallback((item: any) => {
        setEditingId(item.id);
        
        const remarksData = item.report_data?.remarks;
        if (Array.isArray(remarksData)) {
            setRemarksList(remarksData);
            setRemarksText('');
        } else if (remarksData) {
            setRemarksList([{ type: item.report_data.remark_type as RemarkChipId | null, text: remarksData }]);
            setRemarksText('');
        } else {
            setRemarksList([]);
            setRemarksText(item.description || item.report_data?.big_win || '');
        }

        if (item.report_data?.remark_type) {
            setActiveRemarkChip(item.report_data.remark_type as RemarkChipId);
        }
        
        // Handle wins/achievements (new and legacy)
        const achievements = item.report_data?.achievements 
            || item.report_data?.accomplishments?.items?.map((i: any) => i.title)
            || item.report_data?.accomplishments?.map((i: any) => i.title)
            || [];
        setWins(achievements);

        // Handle tasks/plans (new and legacy)
        const tasks = item.report_data?.tasks 
            || item.report_data?.week_plan?.map((i: any) => i.title)
            || item.report_data?.tasks_issues?.map((i: any) => i.title)
            || item.report_data?.tomorrow_plan?.map((i: any) => i.title)
            || [];
        
        const firstDay = upcomingDays.find(d => d.canAdd)?.key;
        if (firstDay && tasks.length > 0) {
            setDayPlans({ [firstDay]: tasks });
        }
        toast.message('Report data loaded');
    }, [upcomingDays]);

    const fetchHistory = React.useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            // Using the specific query parameter for weekly reports
            const response = await apiClient.get(`${ENDPOINTS.USER_JOURNALS}?q[:journal_type]=weekly`);
            const items = response.data || [];
            setHistory(items);

            // Auto-check if current week has a report
            const currentWeekStart = format(weekStart, 'yyyy-MM-dd');
            const existing = items.find((i: any) => i.start_date === currentWeekStart);
            if (existing) {
                populateForm(existing);
            }
        } catch (error) {
            console.error('Failed to fetch weekly reports history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [weekStart, populateForm]);

    React.useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleAddWin = () => {
        setWins([...wins, '']);
    };

    const handleRemoveWin = (index: number) => {
        setWins(wins.filter((_, i) => i !== index));
    };

    const handleWinChange = (index: number, value: string) => {
        const newWins = [...wins];
        newWins[index] = value;
        setWins(newWins);
    };

    const handleCarryForward = () => {
        if (history.length === 0) {
            toast.error('No previous reports found to carry forward');
            return;
        }
        // Get the latest report that isn't the current one we might be editing
        const latest = history.find(item => item.id !== editingId);
        if (latest) {
            const tasks = latest.report_data?.tasks 
                || latest.report_data?.week_plan?.map((i: any) => i.title)
                || latest.report_data?.tasks_issues?.map((i: any) => i.title)
                || [];
            
            if (tasks.length === 0) {
                toast.info('No uncompleted tasks found in previous report');
                return;
            }

            const firstDay = upcomingDays.find(d => d.canAdd)?.key;
            if (firstDay) {
                setDayPlans(prev => ({
                    ...prev,
                    [firstDay]: [...(prev[firstDay] || []), ...tasks]
                }));
                toast.success(`Carried forward ${tasks.length} tasks`);
            }
        }
    };

    const handleImportDailyWins = async () => {
        setIsLoadingDailyReports(true);
        setShowDailyWinsDialog(true);
        try {
            const response = await apiClient.get(`${ENDPOINTS.USER_JOURNALS}?q[:journal_type]=daily`);
            const allDaily = response.data || [];
            
            // Filter reports from the current selected week
            const filtered = allDaily.filter((report: any) => {
                const reportDate = new Date(report.start_date || report.created_at);
                return reportDate >= weekStart && reportDate <= weekEnd;
            });

            setDailyReports(filtered);
        } catch (error) {
            console.error('Failed to fetch daily reports:', error);
            toast.error('Failed to load daily reports');
        } finally {
            setIsLoadingDailyReports(false);
        }
    };

    const confirmImportDailyWins = () => {
        if (selectedDailyWins.length === 0) {
            toast.info('No wins selected');
            return;
        }
        setWins(prev => [...prev, ...selectedDailyWins]);
        toast.success(`Imported ${selectedDailyWins.length} daily wins`);
        setShowDailyWinsDialog(false);
        setSelectedDailyWins([]);
    };

    const handleAddPlan = (day: string) => {
        setDayPlans((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), ''],
        }));
    };

    const handleRemovePlan = (day: string, index: number) => {
        setDayPlans((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index),
        }));
    };

    const handlePlanChange = (day: string, index: number, value: string) => {
        const newPlans = [...(dayPlans[day] || [])];
        newPlans[index] = value;
        setDayPlans((prev) => ({
            ...prev,
            [day]: newPlans,
        }));
    };

    const handleRemarkChipClick = (id: RemarkChipId) => {
        setActiveRemarkChip((prev) => (prev === id ? null : id));
        setRemarksInteracted(true);
    };

    const handleRemarksAreaActivate = () => {
        setRemarksInteracted(true);
    };

    const handleAddRemark = () => {
        if (!remarksText.trim()) {
            toast.error('Please enter a remark');
            return;
        }
        setRemarksList((prev) => [...prev, { type: activeRemarkChip, text: remarksText.trim() }]);
        setRemarksText('');
    };

    const handleRemoveRemark = (index: number) => {
        setRemarksList((prev) => prev.filter((_, i) => i !== index));
    };

    /** Focuses the remarks textarea. */
    const handleFocusRemarks = () => {
        setRemarksInteracted(true);
        window.requestAnimationFrame(() => {
            remarksTextareaRef.current?.focus();
        });
    };

    const remarkVisual = activeRemarkChip
        ? REMARK_CHIP_META[activeRemarkChip]
        : remarksInteracted
            ? {
                border: 'border-[#DA7756]',
                bg: 'bg-[#fef6f4]/90',
            }
            : {
                border: 'border-[#DA7756]/25',
                bg: 'bg-white',
            };

    const handleSubmit = async () => {
        if (!currentUser?.id) {
            toast.error('User session not found. Please log in again.');
            return;
        }

        setIsSubmitting(true);
        try {
            const finalRemarksList = [...remarksList];
            if (remarksText.trim()) {
                finalRemarksList.push({ type: activeRemarkChip, text: remarksText.trim() });
            }

            const combinedDescription = finalRemarksList.map(r => r.text).join('\n');

            const payload = {
                user_journal: {
                    user_id: currentUser.id,
                    journal_type: 'weekly',
                    start_date: format(weekStart, 'yyyy-MM-dd'),
                    end_date: format(weekEnd, 'yyyy-MM-dd'),
                    week_number: getISOWeek(weekStart),
                    year: weekStart.getFullYear(),
                    status: 'submitted',
                    description: combinedDescription,
                    self_rating: 0,
                    is_absent: false,
                    report_data: {
                        kpi: 'weekly value',
                        achievements: wins.filter(w => w.trim() !== ''),
                        tasks: Object.values(dayPlans).flat().filter(t => t.trim() !== ''),
                        past_kpis: [], // Placeholder for now
                        total_score: 0,
                        remarks: finalRemarksList,
                        remark_type: activeRemarkChip,
                        sections: {
                            daily_scores: [0, 0, 0, 0, 0],
                            bonus: 0,
                            self_rating: 0,
                            is_absent: false
                        },
                        details: {
                            self_rating: 0,
                            is_absent: false
                        }
                    }
                }
            };

            const response = editingId 
                ? await apiClient.put(`/user_journals/${editingId}.json`, payload)
                : await apiClient.post(ENDPOINTS.USER_JOURNALS, payload);

            toast.success(editingId ? 'Weekly report updated successfully' : 'Weekly report submitted successfully');
            fetchHistory();
        } catch (error: any) {
            console.error('Failed to submit weekly report:', error);
            toast.error(error.response?.data?.message || 'Failed to submit weekly report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = React.useCallback((item: any) => {
        populateForm(item);
        const tabsList = document.querySelector('[role="tablist"]');
        const submitTab = tabsList?.querySelector('[value="submit"]') as HTMLElement;
        submitTab?.click();
    }, [populateForm]);

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
            <AddTaskOrIssueDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
            <div className="mx-auto max-w-7xl space-y-6 font-poppins text-[#1a1a1a]">
                {/* Page title */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                        Weekly Report
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 sm:text-base">
                        Track your weekly KPI performance and insights
                    </p>
                </div>

                <Tabs defaultValue="submit" className="w-full">
                    <TabsList className="inline-flex h-auto w-full justify-start rounded-2xl bg-[#DA7756] p-1 sm:w-auto">
                        <TabsTrigger
                            value="submit"
                            className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm data-[state=inactive]:text-white/80"
                        >
                            Submit Review
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm data-[state=inactive]:text-white/80"
                        >
                            Review History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="submit" className="mt-6 space-y-6">
                        {/* Week selector — same tinted card treatment as SystemAndSOP filter strip */}
                        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <Calendar className="h-5 w-5 shrink-0 text-[#DA7756]" />
                                <span className="text-lg font-semibold text-neutral-900">
                                    {monthTitle}
                                </span>
                            </div>
                            <div className="mb-4 rounded-xl bg-[#DA7756] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm">
                                Filling Report For Week #{weekNumLabel}, {weekRangeLabel}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="border border-[#DA7756]/30 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-800">
                                    W{weekNumLabel} {weekRangeLabel}
                                </Badge>
                                <Badge className="border-0 bg-[#DA7756] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                    Current
                                </Badge>
                            </div>
                        </Card>

                        {/* Past Weeks KPIs */}
                        <Card className={cn('overflow-hidden', cardChrome)}>
                            <div className={cn('flex items-start justify-between', sectionHeader)}>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-[#DA7756]" />
                                        <h3 className="font-bold text-neutral-900">Past Weeks KPIs</h3>
                                    </div>
                                    <p className="text-xs text-neutral-600">
                                        Enter actual values and track your key metrics.
                                    </p>
                                </div>
                                <Badge className={badgePoints}>0/20 pts</Badge>
                            </div>
                            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                                <p className="text-lg text-neutral-400">
                                    No KPIs assigned for this period.
                                </p>
                            </div>
                        </Card>

                        {/* Achievements */}
                        <Card className={cn('overflow-hidden', cardChrome)}>
                            <div className={cn('flex items-center justify-between', sectionHeader)}>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-[#DA7756]" />
                                    <h3 className="font-bold text-neutral-900">Your Achievements</h3>
                                </div>
                                <Badge className={badgePoints}>0/15 pts</Badge>
                            </div>
                            <div className="space-y-4 p-6">
                                {wins.map((win, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                                    >
                                        <Checkbox 
                                            className="mt-1 rounded border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                                            defaultChecked 
                                        />
                                        <Star className="mt-1 h-4 w-4 cursor-pointer text-neutral-300 hover:text-yellow-400 transition-colors" />
                                        <Textarea
                                            value={win}
                                            onChange={(e) => handleWinChange(index, e.target.value)}
                                            placeholder="Describe your win…"
                                            className="min-h-[40px] flex-1 resize-none border-none bg-transparent p-0 text-sm text-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveWin(index)}
                                            className="rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleImportDailyWins}
                                        className="h-12 flex-1 rounded-xl border-2 border-dashed border-blue-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4 text-neutral-400" />
                                        Import Daily Wins (last week&apos;s)
                                    </button>
                                    <Button
                                        type="button"
                                        onClick={handleAddWin}
                                        className={cn('h-12 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Win
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleCarryForward}
                                    className={cn('h-12 w-full rounded-xl bg-[#e65100] hover:bg-[#d84315] text-white font-bold tracking-wide')}
                                >
                                    Carry Forward Uncompleted
                                </Button>
                                <div className="space-y-4 pt-4 border-t border-neutral-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium">
                                            <Info className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Limits: Images 2MB, Others 5MB</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold text-neutral-400">{uploadedFilesCount}/5</span>
                                            <input
                                                ref={achievementFileInputRef}
                                                type="file"
                                                className="sr-only"
                                                id="weekly-achievement-files"
                                                multiple
                                                accept="image/*,.pdf,.doc,.docx,application/pdf"
                                                onChange={handleAchievementFiles}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => achievementFileInputRef.current?.click()}
                                                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 flex items-center gap-2 text-xs"
                                            >
                                                <Upload className="h-3.5 w-3.5" />
                                                File Upload
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {selectedFileNames.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFileNames.map((name, i) => (
                                                <Badge key={i} variant="secondary" className="bg-neutral-100 text-[10px] text-neutral-600 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                    <span className="truncate max-w-[150px]">{name}</span>
                                                    <X 
                                                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                        onClick={() => {
                                                            const next = selectedFileNames.filter((_, idx) => idx !== i);
                                                            setSelectedFileNames(next);
                                                            setUploadedFilesCount(next.length);
                                                        }}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Tasks & Issues */}
                        <Card className={cn('overflow-hidden', cardChrome)}>
                            <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', sectionHeader)}>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 shrink-0 text-[#DA7756]" />
                                        <h3 className="font-bold text-neutral-900">Tasks & Issues</h3>
                                        <Badge className="border-0 bg-neutral-200 px-2 py-0 text-[10px] font-bold uppercase text-neutral-700">
                                            Optional
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="border-0 bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                                            Closed: 0
                                        </Badge>
                                        <Badge className="border-0 bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800">
                                            Open: 0
                                        </Badge>
                                        <Badge className="border-0 bg-red-100 px-3 py-1 text-[10px] font-bold text-red-800">
                                            Overdue: 0
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    className={cn('shrink-0 rounded-xl', btnPrimary)}
                                    onClick={() => setAddTaskOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-4 px-6 py-14 text-center">
                                <CheckSquare className="h-12 w-12 text-neutral-200" />
                                <p className="text-lg text-neutral-400">No open tasks or issues.</p>
                            </div>
                        </Card>

                        {/* Deep work */}
                        <div className="flex items-start gap-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]" />
                            <p className="text-sm text-neutral-800">
                                <span className="font-bold">Deep Work Blocks:</span> Protect your
                                &quot;Prime Time&quot;! Have you blocked 90-min chunks for high-level
                                analysis?
                            </p>
                        </div>

                        {/* Plan for coming week */}
                        <Card className={cn('overflow-hidden', cardChrome)}>
                            <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between', sectionHeader)}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Target className="h-5 w-5 text-[#DA7756]" />
                                    <h3 className="font-bold text-neutral-900">Plan for Coming Week</h3>
                                    <Badge className="border-0 bg-neutral-200 px-2 py-0 text-[10px] font-bold uppercase text-neutral-700">
                                        Optional
                                    </Badge>
                                    <Info className="h-4 w-4 cursor-help text-neutral-400" />
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge className={badgePoints}>0/20 pts</Badge>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className={cn('rounded-lg text-xs font-bold', btnOutline)}
                                    >
                                        Important & Not Urgent
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 p-4">
                                {upcomingDays.map((day) => (
                                    <div key={day.key} className="space-y-2">
                                        <div
                                            className={cn(
                                                'flex items-center justify-between rounded-xl border border-[#DA7756]/15 p-3',
                                                day.color
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'text-sm font-bold',
                                                    day.canAdd ? 'text-[#DA7756]' : 'text-neutral-400'
                                                )}
                                            >
                                                {day.short}
                                            </span>
                                            {day.canAdd ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddPlan(day.key)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#DA7756]/25 bg-white px-2.5 py-1.5 text-xs font-bold text-[#DA7756] shadow-sm transition-colors hover:bg-[#fef6f4] hover:border-[#DA7756]/45"
                                                >
                                                    <Plus className="h-3 w-3" /> Add
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-neutral-400">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                        {dayPlans[day.key]?.map((plan, index) => (
                                            <div
                                                key={index}
                                                className="ml-2 flex items-start gap-3 rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm"
                                            >
                                                <Star className="mt-1 h-4 w-4 cursor-pointer text-[#DA7756]/35 hover:text-[#DA7756]" />
                                                <Textarea
                                                    value={plan}
                                                    onChange={(e) =>
                                                        handlePlanChange(day.key, index, e.target.value)
                                                    }
                                                    placeholder="What's your strategic priority?"
                                                    className="min-h-[60px] flex-1 resize-none rounded-md border border-neutral-200 p-3 text-sm focus-visible:ring-1 focus-visible:ring-[#DA7756]/40"
                                                />
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePlan(day.key, index)}
                                                        className="rounded-md p-1 text-[#DA7756]/55 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <div className="flex flex-col gap-1 text-[#DA7756]/45">
                                                        <ChevronUp className="h-4 w-4 cursor-pointer hover:text-[#DA7756]" />
                                                        <ChevronDown className="h-4 w-4 cursor-pointer hover:text-[#DA7756]" />
                                                    </div>
                                                    <Calendar className="h-4 w-4 cursor-pointer text-[#DA7756]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Remarks — border/background changes on chip click or focus */}
                        <Card
                            role="region"
                            aria-label="Remarks"
                            onMouseDown={handleRemarksAreaActivate}
                            className={cn(
                                'overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-sm transition-colors duration-200',
                                remarkVisual.border,
                                remarkVisual.bg
                            )}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare
                                        className="h-5 w-5 shrink-0"
                                        style={{ color: accentEmphasis }}
                                    />
                                    <h3 className="font-bold text-neutral-900">Remarks</h3>
                                </div>
                                <Badge
                                    className="border-0 px-3 py-1 text-xs font-bold text-white"
                                    style={{ backgroundColor: accentEmphasis }}
                                >
                                    0/25 pts
                                </Badge>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(REMARK_CHIP_META) as RemarkChipId[]).map((id) => {
                                        const meta = REMARK_CHIP_META[id];
                                        const isActive = activeRemarkChip === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() => handleRemarkChipClick(id)}
                                                className={cn(
                                                    'inline-flex h-9 items-center rounded-lg border px-3 text-[11px] font-bold transition-colors',
                                                    'active:scale-[0.98] active:brightness-95',
                                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/35 focus-visible:ring-offset-2',
                                                    isActive ? meta.chipActive : meta.chipInactive
                                                )}
                                            >
                                                {id === 'breakthrough' && (
                                                    <Activity
                                                        className={cn(
                                                            'mr-1.5 h-3.5 w-3.5 shrink-0',
                                                            isActive ? 'text-white' : 'text-neutral-500'
                                                        )}
                                                    />
                                                )}
                                                {id === 'breakdown' && (
                                                    <TrendingUp
                                                        className={cn(
                                                            'mr-1.5 h-3.5 w-3.5 shrink-0',
                                                            isActive ? 'text-white' : 'text-neutral-500'
                                                        )}
                                                    />
                                                )}
                                                {id === 'employee' && (
                                                    <User
                                                        className={cn(
                                                            'mr-1.5 h-3.5 w-3.5 shrink-0',
                                                            isActive ? 'text-white' : 'text-neutral-500'
                                                        )}
                                                    />
                                                )}
                                                {id === 'client' && (
                                                    <Users
                                                        className={cn(
                                                            'mr-1.5 h-3.5 w-3.5 shrink-0',
                                                            isActive ? 'text-white' : 'text-neutral-500'
                                                        )}
                                                    />
                                                )}
                                                {id === 'empFeedback' && (
                                                    <Smile
                                                        className={cn(
                                                            'mr-1.5 h-3.5 w-3.5 shrink-0',
                                                            isActive ? 'text-white' : 'text-neutral-500'
                                                        )}
                                                    />
                                                )}
                                                {meta.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Textarea
                                    ref={remarksTextareaRef}
                                    value={remarksText}
                                    onChange={(e) => setRemarksText(e.target.value)}
                                    onFocus={handleRemarksAreaActivate}
                                    placeholder={activeRemarkChip ? `Add ${REMARK_CHIP_META[activeRemarkChip].label}...` : "Enter at least one breakthrough, one breakdown, one employee and one client feedback…"}
                                    className="min-h-[120px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddRemark}
                                    className="h-10 w-full rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] transition-colors"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add {activeRemarkChip ? REMARK_CHIP_META[activeRemarkChip].label : 'Remark'}
                                </Button>
                                
                                {remarksList.length > 0 && (
                                    <div className="mt-6 space-y-3 border-t border-dashed border-neutral-200 pt-6">
                                        {remarksList.map((remark, index) => {
                                            const isBreakdown = remark.type === 'breakdown';
                                            const isBreakthrough = remark.type === 'breakthrough';
                                            
                                            // Provide specific icons and fallback colors if remark type doesn't have a special match
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={cn(
                                                        "relative flex items-start gap-3 rounded-xl border p-4 shadow-sm",
                                                        isBreakdown ? "bg-red-50 border-red-200 text-red-900" :
                                                        isBreakthrough ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
                                                        "bg-white border-neutral-200 text-neutral-800"
                                                    )}
                                                >
                                                    {remark.type === 'breakdown' ? <TrendingUp className="h-4 w-4 text-red-500 mt-0.5" /> :
                                                     remark.type === 'breakthrough' ? <Activity className="h-4 w-4 text-emerald-500 mt-0.5" /> :
                                                     remark.type === 'employee' ? <User className="h-4 w-4 text-blue-500 mt-0.5" /> :
                                                     remark.type === 'client' ? <Users className="h-4 w-4 text-purple-500 mt-0.5" /> :
                                                     remark.type === 'empFeedback' ? <Smile className="h-4 w-4 text-orange-500 mt-0.5" /> :
                                                     <MessageSquare className="h-4 w-4 text-neutral-500 mt-0.5" />
                                                    }
                                                    
                                                    <div className="flex-1 space-y-1">
                                                        {remark.type && (
                                                            <p className="text-xs font-bold">
                                                                {REMARK_CHIP_META[remark.type as RemarkChipId]?.label || remark.type}
                                                            </p>
                                                        )}
                                                        <p className="text-sm whitespace-pre-wrap">{remark.text}</p>
                                                    </div>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRemark(index)}
                                                        className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Automated score — separate card */}
                        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-[#DA7756]" />
                                    <h4 className="text-base font-bold text-neutral-900">
                                        Automated Weekly Score
                                    </h4>
                                </div>
                                <span className="text-2xl font-black text-[#DA7756]">0/100</span>
                            </div>
                            <p className="mb-4 text-[11px] italic text-neutral-500">
                                Based on KPIs, achievements, tasks, planning, and feedback.
                            </p>
                            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                {[
                                    { label: 'Weekly KPI', score: '0/20' },
                                    { label: 'Daily KPI', score: '0/10' },
                                    { label: 'KPIs', score: '0/20' },
                                    { label: 'Daily Win', score: '0/15' },
                                    { label: 'Planning', score: '0/20' },
                                    { label: 'Remarks', score: '0/25' },
                                    { label: 'Tasks', score: '0/10' },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-md border border-neutral-100 bg-white p-2"
                                    >
                                        <p className="text-[9px] text-neutral-400">{stat.label}</p>
                                        <p className="text-xs font-bold text-neutral-900">{stat.score}</p>
                                    </div>
                                ))}
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="details" className="border-none">
                                    <AccordionTrigger className="py-2 text-xs font-bold text-neutral-700 hover:no-underline">
                                        Detailed Score Calculation{' '}
                                        <span className="ml-2 text-[10px] font-normal text-neutral-400">
                                            (Click here to expand)
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="mt-1 rounded-md bg-white/80 p-3 text-[11px] text-neutral-600">
                                        The score combines completed KPIs, recorded achievements, planning
                                        entries, remarks, and task completion.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Card>

                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="h-12 w-full rounded-xl bg-[#DA7756] text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#c9673f] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {editingId ? 'Updating...' : 'Submitting...'}
                                </span>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {editingId ? 'Update Review' : `Submit for ${submitRangeLabel}`}
                                </>
                            )}
                        </Button>

                        <div className="flex flex-col gap-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-[#DA7756] p-2 shadow-sm">
                                    <Star className="h-4 w-4 fill-white text-white" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-neutral-900">
                                            Bonus Opportunity!
                                        </span>
                                        <Badge className="border-0 bg-[#DA7756] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#DA7756]">
                                            + 05 pts
                                        </Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-neutral-600">
                                        Submit within the week window to earn bonus points.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-neutral-500">
                            <button
                                type="button"
                                className="underline decoration-dotted underline-offset-2 hover:text-[#DA7756]"
                            >
                                How is the Automated Weekly Score Calculated?
                            </button>
                        </p>
                    </TabsContent>

                    <TabsContent value="history" className="mt-6 space-y-6">
                        {isLoadingHistory ? (
                            Array(3).fill(0).map((_, i) => (
                                <Card key={i} className="p-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-60" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-32 rounded-xl" />
                                        <Skeleton className="h-32 rounded-xl" />
                                    </div>
                                </Card>
                            ))
                        ) : history.length > 0 ? (
                            history.map((item) => {
                                const reportData = item.report_data || {};
                                const weekNum = item.start_date ? getISOWeek(new Date(item.start_date)) : '??';
                                const weekLabel = item.start_date && item.end_date 
                                    ? `${format(new Date(item.start_date), 'MMM d')}-${format(new Date(item.end_date), 'd')}`
                                    : 'Unknown Date';
                                
                                const achievements = reportData.achievements 
                                    || reportData.accomplishments?.items?.map((i: any) => i.title)
                                    || reportData.accomplishments?.map((i: any) => i.title)
                                    || [];
                                
                                const tasks = reportData.tasks 
                                    || reportData.week_plan?.map((i: any) => i.title)
                                    || reportData.tasks_issues?.map((i: any) => i.title)
                                    || reportData.tomorrow_plan?.map((i: any) => i.title)
                                    || [];
                                
                                const stats = [
                                    { label: 'Weekly KPIs:', value: '0/20' },
                                    { label: 'Daily KPIs:', value: '0/10' },
                                    { label: 'Starred Wins:', value: `0/${achievements.length || 6}` },
                                    { label: 'Tasks/Issues:', value: '0/10' },
                                    { label: 'Planned:', value: `${tasks.length}/20` },
                                    { label: 'Remarks:', value: reportData.remarks ? '1/14' : '0/14' },
                                    { label: 'SOPs:', value: '0/20' },
                                ];

                                const dayColors: Record<string, string> = {
                                    'Mon': 'bg-[#e0e7ff] text-[#4338ca]',
                                    'Tue': 'bg-[#dcfce7] text-[#15803d]',
                                    'Wed': 'bg-[#fef9c3] text-[#a16207]',
                                    'Thu': 'bg-[#f3e8ff] text-[#7e22ce]',
                                    'Fri': 'bg-[#ffedd5] text-[#c2410c]',
                                };

                                return (
                                    <Card key={item.id} className="overflow-hidden border border-[#DA7756]/20 bg-white shadow-md rounded-2xl">
                                        {/* History Card Header */}
                                        <div className="bg-[#f8fafc] border-b border-neutral-100 p-6">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-neutral-900">
                                                            Wk# {weekNum}, {weekLabel}
                                                        </h3>
                                                        {/* <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-neutral-400 hover:text-[#DA7756]"
                                                            onClick={() => handleViewDetails(item)}
                                                        >
                                                            <Plus className="h-4 w-4 rotate-45" />
                                                        </Button> */}
                                                    </div>
                                                    <p className="text-sm text-neutral-500">
                                                        {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'User Report'} (ID: {currentUser?.id || item.user_id})
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-white" />
                                                            {reportData.total_score || 0}/100
                                                        </Badge>
                                                        <Badge variant="outline" className="text-neutral-500 border-neutral-200">
                                                            0.0%
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-[11px] text-neutral-600 font-medium">
                                                        {stats.map((s, idx) => (
                                                            <div key={idx} className="flex justify-between gap-4">
                                                                <span>{s.label}</span>
                                                                <span className="font-bold text-neutral-900 tracking-wider">{s.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="mt-2 text-[#4f46e5] border-[#4f46e5]/20 hover:bg-[#4f46e5]/5 rounded-lg h-8 px-4 font-semibold text-xs transition-colors"
                                                        onClick={() => handleViewDetails(item)}
                                                    >
                                                        <Zap className="mr-2 h-3.5 w-3.5 fill-[#4f46e5]" />
                                                        Edit
                                                    </Button> */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* History Card Body */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Top Wins Box */}
                                                <div className="rounded-xl border border-emerald-500/20 bg-white overflow-hidden flex flex-col">
                                                    <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-2">
                                                        <Trophy className="h-5 w-5 text-emerald-500" />
                                                        <h4 className="font-bold text-emerald-600">Top Wins</h4>
                                                    </div>
                                                    <div className="p-4 space-y-3 flex-1 min-h-[200px]">
                                                        {achievements.length > 0 ? achievements.map((w: string, i: number) => (
                                                            <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 font-medium">
                                                                <div className="mt-1 h-4 w-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                                </div>
                                                                <span>{w}</span>
                                                            </div>
                                                        )) : (
                                                            <p className="text-sm text-neutral-400 italic">No wins recorded</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Next Week's Priorities Box */}
                                                <div className="rounded-xl border border-indigo-500/20 bg-white overflow-hidden">
                                                    <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-2">
                                                        <Target className="h-5 w-5 text-indigo-500" />
                                                        <h4 className="font-bold text-indigo-600">Next Week's Priorities</h4>
                                                    </div>
                                                    <div className="p-4 space-y-3">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                                                            <div key={day} className="space-y-2">
                                                                <div className={cn("px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider", dayColors[day])}>
                                                                    {day}
                                                                </div>
                                                                <div className="pl-2 space-y-1.5">
                                                                    {/* This is a simple mapping for display; in a real scenario we'd match the day */}
                                                                    {day === 'Mon' && tasks.slice(0, 2).map((t: string, i: number) => (
                                                                        <div key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                                                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                                            {t}
                                                                        </div>
                                                                    ))}
                                                                    {day !== 'Mon' && <div className="h-4" />}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tasks & Issues area */}
                                            <div className="mt-6 space-y-4">
                                                <div className="flex items-center gap-2 text-orange-600">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    <h4 className="font-bold">Tasks & Issues</h4>
                                                </div>
                                                {reportData.tasks_issues?.length > 0 ? reportData.tasks_issues.map((ti: any, i: number) => (
                                                    <div key={i} className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <X className="h-4 w-4 text-neutral-400" />
                                                            <span className="font-bold text-neutral-800">{ti.title}</span>
                                                            <div className="flex gap-2">
                                                                <Badge className="bg-white text-neutral-700 border-neutral-200 text-[10px] font-bold uppercase h-6">Task</Badge>
                                                                <Badge className="bg-white text-neutral-700 border-neutral-200 text-[10px] font-bold uppercase h-6">{ti.status || 'open'}</Badge>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-[#b45309] hover:bg-[#b45309] text-white text-[10px] font-bold uppercase h-6 px-3">
                                                            {ti.priority || 'medium'}
                                                        </Badge>
                                                    </div>
                                                )) : (
                                                    <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 text-sm text-neutral-500 italic">
                                                        No issues recorded
                                                    </div>
                                                )}
                                            </div>

                                            {/* Other Comments */}
                                            <div className="mt-6 pt-6 border-t border-neutral-100">
                                                <div className="flex items-center gap-2 text-neutral-500 mb-2">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <h4 className="text-sm font-bold">Other Comments</h4>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-neutral-700">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                                                    <p><span className="font-bold uppercase text-[10px] text-neutral-500 mr-2">REMARK:</span>{reportData.remarks || 'No overall comments'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                                <div className="mb-4 rounded-full bg-neutral-50 p-4">
                                    <BarChart3 className="h-8 w-8 text-neutral-300" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900">No review history found</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    You haven&apos;t submitted any weekly reports yet.
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={showDailyWinsDialog} onOpenChange={setShowDailyWinsDialog}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden font-poppins">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-bold text-neutral-900">
                            Select Daily Wins from Past Week
                        </DialogTitle>
                        <p className="text-sm text-neutral-500 mt-1">
                            Choose accomplishments from your daily reports ({format(subDays(weekStart, 7), 'MMM d')} to {format(subDays(weekEnd, 7), 'MMM d')}) to add to this week&apos;s achievements.
                        </p>
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto p-6 pt-2 space-y-6">
                        {isLoadingDailyReports ? (
                            <div className="space-y-4 py-4">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : dailyReports.length > 0 ? (
                            dailyReports.map((report: any) => {
                                const reportDate = new Date(report.start_date || report.created_at);
                                const reportWins = report.report_data?.achievements 
                                    || report.report_data?.accomplishments?.items?.map((i: any) => i.title || i)
                                    || (Array.isArray(report.report_data?.accomplishments) ? report.report_data.accomplishments.map((i: any) => i.title || i) : [])
                                    || [];
                                
                                return reportWins.length > 0 ? (
                                    <div key={report.id} className="space-y-3">
                                        <h4 className="text-sm font-bold text-neutral-700">
                                            {format(reportDate, 'EEE, MMM d')}
                                        </h4>
                                        <div className="space-y-2">
                                            {reportWins.map((win: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-1">
                                                    <Checkbox 
                                                        id={`win-${report.id}-${i}`}
                                                        checked={selectedDailyWins.includes(win)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedDailyWins(prev => [...prev, win]);
                                                            } else {
                                                                setSelectedDailyWins(prev => prev.filter(w => w !== win));
                                                            }
                                                        }}
                                                        className="rounded border-neutral-300"
                                                    />
                                                    <label 
                                                        htmlFor={`win-${report.id}-${i}`}
                                                        className="text-sm text-neutral-700 cursor-pointer"
                                                    >
                                                        {win}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-px bg-neutral-100 mt-4 mx-[-24px]" />
                                    </div>
                                ) : null;
                            })
                        ) : (
                            <div className="py-8 text-center text-neutral-500 text-sm italic">
                                No daily reports with wins found for the past week.
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-6 pt-2 gap-3 sm:justify-end">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDailyWinsDialog(false)}
                            className="rounded-xl border-neutral-200 text-neutral-700 font-bold px-6"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmImportDailyWins}
                            disabled={selectedDailyWins.length === 0}
                            className="rounded-xl bg-neutral-400 hover:bg-neutral-500 text-white font-bold px-6"
                        >
                            Add Selected
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WeeklyReports;
