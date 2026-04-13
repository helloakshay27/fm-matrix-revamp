import { Trophy, Target, Plus } from 'lucide-react';

interface WinsAndPrioritiesProps {
    report: any;
}

export const WinsAndPriorities = ({ report }: WinsAndPrioritiesProps) => {
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
        const tasks = report.weekly_report?.report_data?.tasks;

        if (!tasks || tasks.length === 0) {
            return (
                <li className="flex items-center gap-2">
                    <span className="text-gray-300">-</span>
                    <span className="text-gray-400">No tasks recorded</span>
                </li>
            );
        }

        // Check if tasks is in the new day-keyed format: [{ mon: [...], tue: [...] }]
        if (Array.isArray(tasks) && tasks.length > 0 && typeof tasks[0] === 'object' && !Array.isArray(tasks[0])) {
            const dayKeyedObject = tasks[0];
            return Object.entries(dayKeyedObject)
                .map(([dayKey, dayTasks]: [string, any]) => {
                    const day = dayKey.toLowerCase();
                    if (!Array.isArray(dayTasks)) return null;
                    return dayTasks.map((task, idx) => (
                        <li key={`${day}-${idx}`} className="flex items-center gap-2">
                            <span className={dayColors[day]}>{dayLabels[day]} -</span>
                            <span className="text-gray-600">{task}</span>
                        </li>
                    ));
                })
                .flat()
                .filter(Boolean);
        } else if (Array.isArray(tasks)) {
            // Legacy flat array format
            const dayColorKeys = Object.keys(dayColors);
            const dayLabelKeys = Object.keys(dayLabels);
            return tasks.map((task, idx) => (
                <li key={idx} className="flex items-center gap-2">
                    <span className={dayColors[dayColorKeys[idx % dayColorKeys.length]]}>
                        {dayLabels[dayLabelKeys[idx % dayLabelKeys.length]]} -
                    </span>
                    <span className="text-gray-600">{task}</span>
                </li>
            ));
        }

        return null;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#DA7756] font-bold" style={{ fontSize: '12px' }}>
                    <Trophy className="w-4 h-4" />
                    Wins & Priorities (7)
                    <span className="ml-0.5">
                        {/* Count can be dynamically calculated if needed */}
                    </span>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-[8px] font-bold hover:bg-blue-700 transition-colors" style={{ fontSize: '12px' }}>
                    <Plus className="w-3.5 h-3.5" />
                    Add Task for {report.name}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Top Wins */}
                <div className="border border-green-100 bg-white rounded-2xl p-4 shadow-sm min-h-[150px]">
                    <div className="flex items-center gap-2 text-green-600 font-bold mb-3" style={{ fontSize: '12px' }}>
                        <Trophy className="w-3.5 h-3.5" />
                        Top Wins
                    </div>
                    <ul className="space-y-2 text-gray-600 font-medium" style={{ fontSize: '12px' }}>
                        {report.weekly_report?.report_data?.achievements && report.weekly_report.report_data.achievements.length > 0 ? (
                            report.weekly_report.report_data.achievements.map((achievement: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    {achievement}
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

                {/* Next Week's Priorities */}
                <div className="border border-blue-100 bg-white rounded-2xl p-4 shadow-sm min-h-[150px]">
                    <div className="flex items-center gap-2 text-blue-600 font-bold mb-3" style={{ fontSize: '12px' }}>
                        <Target className="w-3.5 h-3.5" />
                        Next Week's Priorities
                    </div>
                    <ul className="space-y-2 font-bold" style={{ fontSize: '12px' }}>
                        {renderPriorities()}
                    </ul>
                </div>
            </div>
        </div>
    );
};
