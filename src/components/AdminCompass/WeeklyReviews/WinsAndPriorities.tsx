import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Target, Plus, X } from 'lucide-react';
import ProjectTaskCreateModal from '@/components/ProjectTaskCreateModal';

interface WinsAndPrioritiesProps {
    report: any;
}

const getReportItemText = (item: unknown): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
        const value = item as Record<string, unknown>;
        if (typeof value.title === 'string') return value.title;
        if (typeof value.text === 'string') return value.text;
        if (typeof value.name === 'string') return value.name;
    }
    return String(item ?? '');
};

const countDayPlans = (plans: unknown): number => {
    if (!Array.isArray(plans)) return 0;
    return plans.reduce((count, item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return count + 1;
        return count + Object.values(item).reduce((total: number, dayItems) => total + (Array.isArray(dayItems) ? dayItems.length : 0), 0);
    }, 0);
};

export const WinsAndPriorities = ({ report }: WinsAndPrioritiesProps) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const reportData = report.weekly_report?.report_data || report.report_data || {};
    const achievements = Array.isArray(reportData.achievements) ? reportData.achievements : [];
    const plans = reportData.upcoming_week_plan || reportData.tasks || [];

    const dayColors: Record<string, string> = {
        mon: 'text-blue-600',
        tue: 'text-green-600',
        wed: 'text-purple-600',
        thu: 'text-red-500',
        fri: 'text-yellow-600',
        sat: 'text-pink-600',
        sun: 'text-indigo-600',
    };

    const dayLabels: Record<string, string> = {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
    };

    const renderPriorities = () => {
        if (!Array.isArray(plans) || plans.length === 0) {
            return (
                <li className="flex items-center gap-2">
                    <span className="text-gray-300">-</span>
                    <span className="text-gray-400">No tasks recorded</span>
                </li>
            );
        }

        if (plans.length > 0 && typeof plans[0] === 'object' && !Array.isArray(plans[0])) {
            return Object.entries(plans[0])
                .map(([dayKey, dayTasks]: [string, any]) => {
                    const day = dayKey.toLowerCase();
                    if (!Array.isArray(dayTasks) || dayTasks.length === 0) return null;
                    return dayTasks.map((task, idx) => (
                        <li key={`${day}-${idx}`} className="flex items-start gap-2 min-w-0">
                            <span className={`${dayColors[day] || 'text-gray-500'} shrink-0`}>{dayLabels[day] || dayKey} -</span>
                            <span className="text-gray-600 break-words min-w-0">{getReportItemText(task)}</span>
                        </li>
                    ));
                })
                .flat()
                .filter(Boolean);
        }

        const dayColorKeys = Object.keys(dayColors);
        const dayLabelKeys = Object.keys(dayLabels);
        return plans.map((task, idx) => (
            <li key={idx} className="flex items-start gap-2 min-w-0">
                <span className={`${dayColors[dayColorKeys[idx % dayColorKeys.length]]} shrink-0`}>
                    {dayLabels[dayLabelKeys[idx % dayLabelKeys.length]]} -
                </span>
                <span className="text-gray-600 break-words min-w-0">{getReportItemText(task)}</span>
            </li>
        ));
    };

    return (
        <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#DA7756] font-bold" style={{ fontSize: '12px' }}>
                    <Trophy className="w-4 h-4" />
                    Wins & Priorities ({achievements.length + countDayPlans(plans)})
                </div>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-[8px] font-bold hover:bg-blue-700 transition-colors"
                    style={{ fontSize: '12px' }}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Task for {report.name}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
                <div className="border border-green-100 bg-white rounded-2xl p-4 shadow-sm min-h-[150px] min-w-0">
                    <div className="flex items-center gap-2 text-green-600 font-bold mb-3" style={{ fontSize: '12px' }}>
                        <Trophy className="w-3.5 h-3.5" />
                        Top Wins
                    </div>
                    <ul className="space-y-2 text-gray-600 font-medium" style={{ fontSize: '12px' }}>
                        {achievements.length > 0 ? (
                            achievements.map((achievement: unknown, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 min-w-0">
                                    <span className="text-green-500 shrink-0">✓</span>
                                    <span className="break-words min-w-0">{getReportItemText(achievement)}</span>
                                </li>
                            ))
                        ) : (
                            <li className="flex items-start gap-2">
                                <span className="text-gray-300">-</span>
                                No achievements recorded
                            </li>
                        )}
                    </ul>
                </div>

                <div className="border border-blue-100 bg-white rounded-2xl p-4 shadow-sm min-h-[150px] min-w-0">
                    <div className="flex items-center gap-2 text-blue-600 font-bold mb-3" style={{ fontSize: '12px' }}>
                        <Target className="w-3.5 h-3.5" />
                        Next Week's Priorities
                    </div>
                    <ul className="space-y-2 font-bold" style={{ fontSize: '12px' }}>
                        {renderPriorities()}
                    </ul>
                </div>
            </div>

            {isTaskModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex">
                        <div
                            className="flex-1 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsTaskModalOpen(false)}
                        />
                        <div
                            className="relative flex flex-col bg-white shadow-2xl"
                            style={{ width: 'min(760px, 95vw)' }}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
                                <h2 className="text-base font-bold text-neutral-900">Add Tasks</h2>
                                <button
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-neutral-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="h-[3px] bg-[#C72030] w-full shrink-0" />
                            <div className="flex-1 overflow-y-auto">
                                <ProjectTaskCreateModal
                                    isEdit={false}
                                    onCloseModal={() => setIsTaskModalOpen(false)}
                                    className="max-w-full mx-0"
                                    prefillData={null}
                                    opportunityId={null}
                                    onSuccess={() => setIsTaskModalOpen(false)}
                                    isConversion={false}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};
