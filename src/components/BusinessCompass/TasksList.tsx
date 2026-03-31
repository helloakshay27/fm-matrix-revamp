import { useState } from 'react';
import {
    Filter,
    Columns,
    List,
    Calendar,
    User,
    GripVertical,
    Edit3,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
    id: string;
    title: string;
    user: string;
    userColor?: string;
    dueDate: string;
    dueColor?: string;
    createdDate: string;
    creator: string;
    progress: number;
    priority: 'H' | 'C' | 'M';
    priorityColor: string;
    status: 'open' | 'in-progress' | 'stuck' | 'closed';
    closedInfo?: {
        email: string;
        date: string;
    };
}

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Review the steps for review management shared by...',
        user: 'Mahendra Lungare',
        userColor: 'text-red-500',
        dueDate: 'Mar 30',
        dueColor: 'text-red-500',
        createdDate: 'Mar 29, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'H',
        priorityColor: 'bg-[#F97316]',
        status: 'open',
    },
    {
        id: '2',
        title: 'Take updates on Rule engine from Nikhat',
        user: 'Kshitij Rasal',
        userColor: 'text-[#0ea5e9]',
        dueDate: 'Mar 30',
        dueColor: 'text-[#0ea5e9]',
        createdDate: 'Mar 29, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'H',
        priorityColor: 'bg-[#F97316]',
        status: 'open',
    },
    {
        id: '3',
        title: 'Runwal and Rustomjee payment reminders',
        user: 'Kshitij Rasal',
        userColor: 'text-[#0ea5e9]',
        dueDate: 'Mar 30',
        dueColor: 'text-red-500',
        createdDate: 'Mar 29, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'C',
        priorityColor: 'bg-[#EF4444]',
        status: 'open',
    },
    {
        id: '4',
        title: 'Testing of the modules : Runwal post possesion',
        user: 'Kshitij Rasal',
        userColor: 'text-[#0ea5e9]',
        dueDate: 'Mar 30',
        dueColor: 'text-[#0ea5e9]',
        createdDate: 'Mar 29, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'H',
        priorityColor: 'bg-[#F97316]',
        status: 'open',
    },
    {
        id: '5',
        title: 'Kalpataru VAPT call at 11',
        user: 'Mahendra Lungare',
        dueDate: 'Mar 26',
        createdDate: 'Mar 27, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'C',
        priorityColor: 'bg-[#94A3B8]',
        status: 'closed',
        closedInfo: {
            email: 'kshitij.rasal@lockated.com',
            date: 'Mar 29'
        }
    },
    {
        id: '6',
        title: 'Share the encrypted IPA for Kalpataru since older one is...',
        user: 'Bilal Shaikh',
        dueDate: 'Mar 26',
        createdDate: 'Mar 25, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'C',
        priorityColor: 'bg-[#94A3B8]',
        status: 'closed',
        closedInfo: {
            email: 'kshitij.rasal@lockated.com',
            date: 'Mar 27'
        }
    },
    {
        id: '7',
        title: 'Assign walkthru screens task to Jahnvi',
        user: 'Kshitij Rasal',
        dueDate: 'Mar 26',
        createdDate: 'Mar 25, 2026',
        creator: 'Kshitij Rasal',
        progress: 0,
        priority: 'M',
        priorityColor: 'bg-[#94A3B8]',
        status: 'closed',
        closedInfo: {
            email: 'kshitij.rasal@lockated.com',
            date: 'Mar 27'
        }
    }
];

const TaskCard = ({ task }: { task: Task }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-2 relative group hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
            {/* Left accent border */}
            <div className={cn(
                "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                task.status === 'open' ? "bg-blue-400" : "bg-gray-300"
            )} />

            <div className="flex gap-2 pl-2">
                <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <h4 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">
                        {task.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] font-medium">
                        <div className={cn("flex items-center gap-1.5", task.userColor || "text-gray-500")}>
                            <User className="w-3 h-3" />
                            {task.user}
                        </div>
                        <div className={cn("flex items-center gap-1.5", task.dueColor || "text-gray-400")}>
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                        </div>
                    </div>

                    <div className="text-[10px] text-gray-400 space-y-0.5">
                        <p>Created: {task.createdDate}</p>
                        <p>C: {task.creator}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">Progress</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 rounded-full"
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-gray-400">{task.progress}%</span>
                        </div>
                        <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                            task.priorityColor
                        )}>
                            {task.priority}
                        </div>
                    </div>
                </div>
            </div>

            {task.closedInfo && (
                <div className="mt-1 pt-2 border-t border-gray-50 bg-gray-50/50 rounded-b-lg px-2 py-1.5 space-y-1">
                    <p className="text-[10px] font-bold text-gray-500">Task closed</p>
                    <div className="flex items-center justify-between text-[9px] text-gray-400">
                        <span className="truncate max-w-[120px]">{task.closedInfo.email}</span>
                        <span>• {task.closedInfo.date}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskListItem = ({ task }: { task: Task }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative group hover:shadow-md transition-all">
            {/* Left accent border */}
            <div className={cn(
                "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                task.status === 'open' ? "bg-blue-400" :
                    task.status === 'stuck' ? "bg-orange-400" :
                        task.status === 'closed' ? "bg-gray-300" : "bg-blue-400"
            )} />

            <div className="flex items-start gap-4">
                <Checkbox className="mt-1 border-gray-300 rounded-[4px]" />

                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0",
                                task.priorityColor
                            )}>
                                {task.priority}
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 leading-snug">
                                {task.title}
                            </h4>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="bg-slate-700 text-white hover:bg-slate-800 text-[10px] px-2 py-0.5 rounded-[4px] uppercase font-bold">
                                {task.status}
                            </Badge>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium">
                        <div className={cn("flex items-center gap-1.5", task.userColor || "text-gray-500")}>
                            <User className="w-3.5 h-3.5" />
                            {task.user}
                        </div>
                        <div className={cn("flex items-center gap-1.5", task.dueColor || "text-gray-400")}>
                            <Calendar className="w-3.5 h-3.5" />
                            {task.dueDate} <span className="ml-0.5">0</span>
                        </div>
                    </div>

                    <div className="text-[10px] text-gray-400 flex gap-4">
                        <p>Created: {task.createdDate}</p>
                        {task.creator && <p>C: {task.creator}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <span className="text-[10px] text-gray-400 font-medium">Progress</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-400 rounded-full"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{task.progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TasksList = () => {
    const [taskType, setTaskType] = useState<'both' | 'tasks' | 'issues'>('both');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [scope, setScope] = useState<'self' | 'all'>('self');

    const columns = [
        { id: 'open', title: 'Open', count: 36, bgColor: 'bg-white', borderColor: 'border-gray-100' },
        { id: 'in-progress', title: 'In Progress', count: 0, bgColor: 'bg-[#F0F7FF]', borderColor: 'border-[#DBEAFE]' },
        { id: 'stuck', title: 'Stuck', count: 0, bgColor: 'bg-[#FFF7ED]', borderColor: 'border-[#FFEDD5]' },
        { id: 'closed', title: 'Closed', count: 15, bgColor: 'bg-[#F1F5F9]', borderColor: 'border-gray-200' },
    ];

    return (
        <div className="space-y-6 mt-6">
            {/* Filter Bar */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Type Filter */}
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Tabs value={taskType} onValueChange={(v) => setTaskType(v as any)} className="bg-primary rounded-[10px] border border-gray-100 flex items-center justify-center h-9 w-[240px]">
                        <TabsList className="bg-transparent gap-1 py-2 h-6 w-full">
                            <TabsTrigger
                                value="both"
                                className="rounded-[8px] px-4 h-6 w-full text-center transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                            >
                                Both
                            </TabsTrigger>
                            <TabsTrigger
                                value="tasks"
                                className="rounded-[8px] px-4 h-6 w-full text-center transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                            >
                                Tasks
                            </TabsTrigger>
                            <TabsTrigger
                                value="issues"
                                className="rounded-[8px] px-4 h-6 w-full text-center transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
                            >
                                Issues
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Dropdown Filters */}
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        <Select defaultValue="all-priorities">
                            <SelectTrigger className="w-[160px] h-9 bg-white border-gray-200 rounded-[10px]">
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-priorities">All Priorities</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all-users">
                            <SelectTrigger className="w-[160px] h-9 bg-white border-gray-200 rounded-[10px]">
                                <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-users">All Users</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all-departments">
                            <SelectTrigger className="w-[180px] h-9 bg-white border-gray-200 rounded-[10px]">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-departments">All Departments</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all-items">
                            <SelectTrigger className="w-[160px] h-9 bg-white border-gray-200 rounded-[10px]">
                                <SelectValue placeholder="All Items" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-items">All Items</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className='bg-gray-200' />

                <div className="flex items-center justify-between">
                    {/* Scope Toggle */}
                    <div className="bg-primary p-1 rounded-[10px] flex items-center">
                        <button
                            onClick={() => setScope('self')}
                            className={cn(
                                "px-4 py-1 rounded-[8px] text-xs font-bold transition-all",
                                scope === 'self' ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Self
                        </button>
                        <button
                            onClick={() => setScope('all')}
                            className={cn(
                                "px-4 py-1 rounded-[8px] text-xs font-bold transition-all",
                                scope === 'all' ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            All
                        </button>
                    </div>

                    {/* View Switcher */}
                    <div className="bg-primary p-1 rounded-[10px] flex items-center">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1 rounded-[6px] text-xs font-bold transition-all",
                                viewMode === 'kanban' ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Columns className="w-3.5 h-3.5" />
                            Kanban
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1 rounded-[6px] text-xs font-bold transition-all",
                                viewMode === 'list' ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <List className="w-3.5 h-3.5" />
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={cn(
                                "rounded-2xl border p-3 flex flex-col gap-3 shadow-sm",
                                column.bgColor,
                                column.borderColor
                            )}
                        >
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-bold text-[#1a1a1a] text-lg">{column.title}</h3>
                                <div className="bg-white/80 border border-gray-100 rounded-md px-2 py-0.5 text-[11px] font-bold text-gray-600 shadow-sm">
                                    {column.count}
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                                {mockTasks
                                    .filter((task) => task.status === column.id)
                                    .map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                {mockTasks.filter((task) => task.status === column.id).length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-gray-300 text-xs font-medium">
                                        No items
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {mockTasks.map((task) => (
                        <TaskListItem key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksList;
