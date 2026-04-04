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

/**
 * Page shell + surfaces match `SystemAndSOP.tsx`:
 * `min-h-[calc(100vh-5rem)] bg-[#f6f4ee]`, `max-w-6xl`, cards `rounded-2xl border border-[#DA7756]/20`.
 */
const accentEmphasis = '#C72030';
const cardChrome =
    'overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm';
const sectionHeader =
    'border-b border-neutral-200/40 bg-white/60 px-4 py-4 sm:px-5';
const btnPrimary =
    'bg-[#DA7756] font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85';
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
        border: 'border-[#c55a42]',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#c55a42] bg-[#c55a42] text-white shadow-sm hover:bg-[#c55a42]/90',
    },
    employee: {
        label: 'One Employee',
        border: 'border-[#b84a32]',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#b84a32] bg-[#b84a32] text-white shadow-sm hover:bg-[#b84a32]/90',
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
        border: 'border-[#C72030]/50',
        bg: 'bg-[#fef6f4]',
        chipInactive:
            'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        chipActive:
            'border-[#C72030] bg-[#C72030] text-white shadow-sm hover:bg-[#C72030]/90',
    },
};

const WeeklyReports = () => {
    const [addTaskOpen, setAddTaskOpen] = React.useState(false);
    const achievementFileInputRef = React.useRef<HTMLInputElement>(null);
    const [achievementUploads, setAchievementUploads] = React.useState<{ name: string; size: number }[]>(
        []
    );

    const handleAchievementFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files;
        if (!list?.length) return;
        const added: { name: string; size: number }[] = [];
        for (let i = 0; i < list.length; i++) {
            const f = list[i];
            const isImage = f.type.startsWith('image/');
            const maxBytes = isImage ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
            if (f.size > maxBytes) {
                toast.error(
                    `${f.name} is too large (max ${isImage ? '2MB' : '5MB'} for ${isImage ? 'images' : 'other files'})`
                );
                continue;
            }
            added.push({ name: f.name, size: f.size });
        }
        if (!added.length) {
            e.target.value = '';
            return;
        }
        setAchievementUploads((prev) => {
            const merged = [...prev, ...added];
            const next = merged.slice(0, 5);
            if (merged.length > next.length) {
                toast.message('Maximum 5 files — extra files were not added');
            }
            return next;
        });
        toast.success(added.length === 1 ? `Added ${added[0].name}` : `Added ${added.length} file(s)`);
        e.target.value = '';
    };

    const [wins, setWins] = React.useState<string[]>([]);
    const [dayPlans, setDayPlans] = React.useState<Record<string, string[]>>({});
    const [remarksText, setRemarksText] = React.useState('');
    const [activeRemarkChip, setActiveRemarkChip] = React.useState<RemarkChipId | null>(null);
    const [remarksInteracted, setRemarksInteracted] = React.useState(false);
    const remarksTextareaRef = React.useRef<HTMLTextAreaElement>(null);

    const refDate = React.useMemo(() => new Date(), []);
    const weekStart = React.useMemo(
        () => startOfWeek(refDate, { weekStartsOn: 0 }),
        [refDate]
    );
    const weekEnd = React.useMemo(
        () => endOfWeek(refDate, { weekStartsOn: 0 }),
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
            const canAdd = i > 0 && i < 6;
            labels.push({
                key,
                short: format(d, 'EEE d MMM'),
                color: colors[i] ?? 'bg-slate-50',
                canAdd,
            });
        }
        return labels;
    }, [weekEnd]);

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

    /** Selects the Employee Feedback chip and focuses remarks (button had no handler before). */
    const handleAddEmployeeFeedback = () => {
        setActiveRemarkChip('empFeedback');
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

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
            <AddTaskOrIssueDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
            <div className="mx-auto max-w-7xl space-y-6 font-poppins text-[#1a1a1a]">
                {/* Same layout as BusinessCompassDailyReport: full-width Admin panel first */}
                <AdminViewEmulation />

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
                    <TabsList className="inline-flex h-auto w-full justify-start rounded-full bg-neutral-200/70 p-1 sm:w-auto">
                        <TabsTrigger
                            value="submit"
                            className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600"
                        >
                            Submit Review
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600"
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
                                        <BarChart3 className="h-5 w-5 text-[#C72030]" />
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
                                    <Trophy className="h-5 w-5 text-[#C72030]" />
                                    <h3 className="font-bold text-neutral-900">Your Achievements</h3>
                                </div>
                                <Badge className={badgePoints}>0/15 pts</Badge>
                            </div>
                            <div className="space-y-4 p-6">
                                {wins.map((win, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex items-start gap-3 rounded-lg border border-neutral-100 bg-[#fafafa] p-4"
                                    >
                                        <Checkbox className="mt-1 rounded border-[#DA7756] data-[state=checked]:bg-[#DA7756]" />
                                        <Star className="mt-1 h-4 w-4 cursor-pointer text-neutral-300 hover:text-amber-400" />
                                        <Textarea
                                            value={win}
                                            onChange={(e) => handleWinChange(index, e.target.value)}
                                            placeholder="Describe your win…"
                                            className="min-h-[60px] flex-1 resize-none border-none bg-transparent p-0 text-sm text-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveWin(index)}
                                            className="p-1 text-red-400 hover:text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Select defaultValue="none">
                                        <SelectTrigger className="h-12 flex-1 rounded-xl border-dashed border-2 border-[#DA7756]/40 bg-white text-[#DA7756] hover:bg-[#f6f4ee]">
                                            <SelectValue placeholder="Import Daily Wins…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Import Daily Wins…</SelectItem>
                                            <SelectItem value="last">Last week&apos;s wins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        onClick={handleAddWin}
                                        className={cn('h-12 flex-1 rounded-xl', btnPrimary)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Win
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    className="h-12 w-full rounded-xl bg-[#C72030] font-bold uppercase tracking-wide text-white hover:bg-[#C72030]/90"
                                >
                                    Carry Forward Uncompleted
                                </Button>
                                <div className="rounded-xl border-2 border-dashed border-neutral-300/80 bg-white/50 px-6 py-8 text-center">
                                    <input
                                        ref={achievementFileInputRef}
                                        type="file"
                                        className="sr-only"
                                        id="weekly-achievement-files"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx,application/pdf"
                                        onChange={handleAchievementFiles}
                                    />
                                    <Upload className="mx-auto mb-2 h-8 w-8 text-[#DA7756]/70" aria-hidden />
                                    <p className="mb-1 text-xs text-neutral-500">
                                        Images up to 2MB · Other files up to 5MB
                                    </p>
                                    <p className="mb-3 text-xs font-medium text-neutral-600">
                                        {achievementUploads.length}/5 files attached
                                    </p>
                                    {achievementUploads.length > 0 && (
                                        <ul className="mb-3 max-h-24 space-y-1 overflow-y-auto text-left text-xs text-neutral-700">
                                            {achievementUploads.map((f, i) => (
                                                <li
                                                    key={`${f.name}-${f.size}-${i}`}
                                                    className="truncate"
                                                >
                                                    {f.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <Button
                                        type="button"
                                        size="sm"
                                        className={cn('rounded-lg', btnPrimary)}
                                        onClick={() => achievementFileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        File Upload
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Tasks & Issues */}
                        <Card className={cn('overflow-hidden', cardChrome)}>
                            <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', sectionHeader)}>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 shrink-0 text-[#C72030]" />
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
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#C72030]" />
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
                                    <Target className="h-5 w-5 text-[#C72030]" />
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
                                        className="rounded-lg border-[#DA7756]/30 text-xs font-bold text-[#DA7756] hover:bg-white/80"
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
                                                'flex items-center justify-between rounded-lg border border-neutral-100 p-3',
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
                                                    className="flex items-center gap-1 text-xs font-bold text-[#DA7756] hover:underline"
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
                                                className="ml-2 flex items-start gap-3 rounded-lg border border-neutral-100 bg-white p-4"
                                            >
                                                <Star className="mt-1 h-4 w-4 cursor-pointer text-neutral-300 hover:text-amber-400" />
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
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <div className="flex flex-col gap-1 text-neutral-400">
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
                                    placeholder="Enter at least one breakthrough, one breakdown, one employee and one client feedback…"
                                    className="min-h-[120px] rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-inner outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                                />
                                <Button
                                    type="button"
                                    className={cn('w-full rounded-xl', btnPrimary)}
                                    onClick={handleAddEmployeeFeedback}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Employee Feedback
                                </Button>
                            </div>
                        </Card>

                        {/* Automated score — separate card */}
                        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-[#C72030]" />
                                    <h4 className="text-base font-bold text-neutral-900">
                                        Automated Weekly Score
                                    </h4>
                                </div>
                                <span className="text-2xl font-black text-[#C72030]">0/100</span>
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
                            className={cn('h-12 w-full rounded-xl text-base shadow-lg', btnPrimary)}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Submit for {submitRangeLabel}
                        </Button>

                        <div className="flex flex-col gap-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-[#DA7756] p-2">
                                    <Star className="h-4 w-4 fill-white text-white" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-neutral-900">
                                            Bonus Opportunity!
                                        </span>
                                        <Badge className="border-0 bg-[#C72030] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#C72030]">
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

                    <TabsContent value="history" className="mt-6">
                        <Card className="rounded-2xl border border-[#DA7756]/20 bg-white p-12 text-center text-neutral-500 shadow-sm">
                            No review history found.
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default WeeklyReports;
