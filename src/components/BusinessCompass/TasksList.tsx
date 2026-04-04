import { useCallback, useEffect, useMemo, useState, useRef, memo, type CSSProperties } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    closestCorners,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchKanbanTasksOfProject, fetchProjectTasks } from '@/store/slices/projectTasksSlice';

type TaskStatus = 'open' | 'in-progress' | 'stuck' | 'closed';

const COLUMN_IDS: TaskStatus[] = ['open', 'in-progress', 'stuck', 'closed'];

function isTaskStatus(id: string): id is TaskStatus {
    return COLUMN_IDS.includes(id as TaskStatus);
}

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
    status: TaskStatus;
    closedInfo?: {
        email: string;
        date: string;
    };
}

const TaskCard = ({ task }: { task: Task }) => {
    return (
        <div className="relative flex cursor-grab flex-col gap-2 rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-3 shadow-sm transition-all group hover:border-[#DA7756]/25 hover:shadow-md active:cursor-grabbing">
            {/* Left accent border */}
            <div className={cn(
                "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                task.status === 'open' ? "bg-[#DA7756]" : "bg-neutral-400"
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
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#DA7756]/15">
                                <div
                                    className="h-full rounded-full bg-[#DA7756]/80"
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
                <div className="mt-1 rounded-b-lg border-t border-[#DA7756]/10 bg-[#f6f4ee]/80 px-2 py-1.5 pt-2 space-y-1">
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

const DraggableTaskCard = memo(({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        // Only pass necessary ID to reduce drag payload
        data: { type: 'TASK', taskId: task.id },
    });

    const style: CSSProperties = useMemo(() => ({
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
    }), [transform, isDragging]);

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TaskCard task={task} />
        </div>
    );
});

function KanbanColumnBody({
    columnId,
    tasks,
    emptySlot,
    isDragging,
}: {
    columnId: TaskStatus;
    tasks: Task[];
    emptySlot: React.ReactNode;
    isDragging?: boolean;
}) {
    const parentRef = useRef<HTMLDivElement>(null);
    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: { type: 'COLUMN', columnId },
    });

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 160, // approximate height of TaskCard
        overscan: 5,
    });

    const setRefs = useCallback((node: HTMLDivElement | null) => {
        parentRef.current = node;
        setNodeRef(node);
    }, [setNodeRef]);

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
        <div
            ref={setRefs}
            className={cn(
                'flex max-h-[500px] flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden rounded-xl border-2 border-transparent p-1 pr-1 transition-colors no-scrollbar',
                isOver && 'border-[#DA7756]/40 bg-[#DA7756]/[0.04]'
            )}
        >
            {tasks.length > 0 ? (
                <div
                    style={{
                        height: `${totalSize}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* 
                      Optimization: During drag, we could render a simplified list or 
                      keep virtualization but ensure it doesn't conflict with dnd-kit.
                      The requirement says "temporarily disable virtualization during drag".
                    */}
                    {isDragging ? (
                        <div className="flex flex-col gap-3">
                            {tasks.map((task) => (
                                <DraggableTaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        virtualItems.map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                    paddingBottom: '12px', // gap-3 equivalent
                                }}
                            >
                                <DraggableTaskCard task={tasks[virtualItem.index]} />
                            </div>
                        ))
                    )}
                </div>
            ) : (
                emptySlot
            )}
        </div>
    );
}

const TaskListItem = memo(({ task }: { task: Task }) => {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#DA7756]/15 bg-[#fef6f4] p-4 shadow-sm relative group transition-all hover:border-[#DA7756]/25 hover:shadow-md">
            {/* Left accent border */}
            <div className={cn(
                "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                task.status === 'open' ? "bg-[#DA7756]" :
                    task.status === 'stuck' ? "bg-[#C72030]" :
                        task.status === 'closed' ? "bg-neutral-400" : "bg-[#DA7756]"
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
                            <button className="p-1 rounded transition-colors text-gray-400 hover:bg-[#f6f4ee]">
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
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#DA7756]/15">
                            <div
                                className="h-full rounded-full bg-[#DA7756]/80"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{task.progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const VirtualizedTaskList = ({ tasks }: { tasks: Task[] }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 140, // approximate height of TaskListItem
        overscan: 5,
    });

    return (
        <div
            ref={parentRef}
            className="h-[600px] overflow-y-auto custom-scrollbar pr-2"
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualItem.start}px)`,
                            paddingBottom: '16px', // space-y-4 equivalent
                        }}
                    >
                        <TaskListItem task={tasks[virtualItem.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const TasksList = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id

    const [taskType, setTaskType] = useState<'both' | 'tasks' | 'issues'>('both');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [scope, setScope] = useState<'self' | 'all'>('self');

    // Normalized state for O(1) access and updates
    const [tasksData, setTasksData] = useState<{
        byId: Record<string, Task>;
        columns: Record<TaskStatus, string[]>;
    }>({
        byId: {},
        columns: {
            open: [],
            'in-progress': [],
            stuck: [],
            closed: [],
        },
    });

    const [activeDragId, setActiveDragId] = useState<string | null>(null);

    const { data: tasksList, loading, error } = useAppSelector(state => state.fetchKanbanTasksOfProject)

    // Normalize data on fetch
    useEffect(() => {
        if (!tasksList) return;

        // Handle case where data might be nested in response.data
        const actualTasks = Array.isArray(tasksList)
            ? tasksList
            : (tasksList as any).data && Array.isArray((tasksList as any).data)
                ? (tasksList as any).data
                : [];

        if (actualTasks.length === 0) return;

        const byId: Record<string, Task> = {};
        const columns: Record<TaskStatus, string[]> = {
            open: [],
            'in-progress': [],
            stuck: [],
            closed: [],
        };

        const formatDate = (dateString?: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };

        const formatDateFull = (dateString?: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };

        actualTasks.forEach((task: any) => {
            const taskId = String(task.id);

            // Map Priority and Colors (matching mockData logic)
            let priority: 'H' | 'C' | 'M' = 'M';
            let priorityColor = 'bg-[#94A3B8]';

            const taskPriority = String(task.priority || '').toUpperCase();
            if (taskPriority === 'HIGH' || taskPriority === 'H') {
                priority = 'H';
                priorityColor = 'bg-[#F97316]';
            } else if (taskPriority === 'CRITICAL' || taskPriority === 'C') {
                priority = 'C';
                priorityColor = 'bg-[#EF4444]';
            } else if (taskPriority === 'MEDIUM' || taskPriority === 'M') {
                priority = 'M';
                priorityColor = 'bg-[#94A3B8]';
            }

            // Map Status
            const taskStatus = isTaskStatus(task.status) ? task.status : 'open';

            byId[taskId] = {
                id: taskId,
                title: task.title || task.name || 'No Title',
                user: task.responsible_person_name || task.responsible_person?.name || 'Unassigned',
                userColor: task.user_color || (priority === 'H' ? 'text-red-500' : 'text-[#0ea5e9]'),
                dueDate: formatDate(task.target_date || task.due_date) || 'Mar 30',
                dueColor: task.due_color || (priority === 'H' ? 'text-red-500' : 'text-[#0ea5e9]'),
                createdDate: formatDateFull(task.created_at) || 'Mar 29, 2026',
                creator: task.created_by_name || task.created_by?.name || 'System',
                progress: task.percentage_completed || task.progress || 0,
                priority,
                priorityColor,
                status: taskStatus,
                closedInfo: taskStatus === 'closed' ? {
                    email: task.closed_by_email || task.closed_by?.email || '',
                    date: formatDate(task.closed_at) || formatDate(task.updated_at) || ''
                } : undefined
            };

            if (columns[taskStatus]) {
                columns[taskStatus].push(taskId);
            }
        });

        setTasksData({ byId, columns });
    }, [tasksList]);

    useEffect(() => {
        dispatch(fetchKanbanTasksOfProject({ baseUrl, token, responsible_person_id: currentUserId }))
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const data = event.active.data.current as { taskId?: string } | undefined;
        setActiveDragId(data?.taskId ?? null);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        let newStatus: TaskStatus | null = null;

        if (isTaskStatus(overId)) {
            newStatus = overId;
        } else {
            // Check if dropped over another task
            const overTask = tasksData.byId[overId];
            if (overTask && overTask.id !== activeId) {
                newStatus = overTask.status;
            }
        }

        if (newStatus && tasksData.byId[activeId].status !== newStatus) {
            setTasksData(prev => {
                const oldStatus = prev.byId[activeId].status;
                const updatedTask = { ...prev.byId[activeId], status: newStatus! };

                return {
                    byId: { ...prev.byId, [activeId]: updatedTask },
                    columns: {
                        ...prev.columns,
                        [oldStatus]: prev.columns[oldStatus].filter(id => id !== activeId),
                        // Prepend the dropped task ID to the beginning of the column array to show it at the top
                        [newStatus!]: [activeId, ...prev.columns[newStatus!]],
                    }
                };
            });
        }
    }, [tasksData]);

    const handleDragCancel = useCallback(() => {
        setActiveDragId(null);
    }, []);

    // Derived tasks list for List view
    const allTasks = useMemo(() => Object.values(tasksData.byId), [tasksData.byId]);

    const activeDragTask = useMemo(() =>
        activeDragId ? tasksData.byId[activeDragId] : null
        , [activeDragId, tasksData.byId]);

    const columns = useMemo(
        () => [
            {
                id: 'open' as const,
                title: 'Open',
                bgColor: 'bg-[#eef4fa]/80',
                borderColor: 'border-[#dbeafe]/90',
            },
            {
                id: 'in-progress' as const,
                title: 'In Progress',
                bgColor: 'bg-[#F0F7FF]',
                borderColor: 'border-[#DBEAFE]',
            },
            { id: 'stuck' as const, title: 'Stuck', bgColor: 'bg-[#FFF7ED]', borderColor: 'border-[#FFEDD5]' },
            { id: 'closed' as const, title: 'Closed', bgColor: 'bg-[#f6f4ee]/90', borderColor: 'border-[#DA7756]/20' },
        ],
        []
    );

    // Precompute column-wise tasks to avoid O(N) filtering inside render
    const tasksByColumn = useMemo(() => {
        const result: Record<TaskStatus, Task[]> = {
            open: [],
            'in-progress': [],
            stuck: [],
            closed: [],
        };

        Object.entries(tasksData.columns).forEach(([status, ids]) => {
            result[status as TaskStatus] = ids
                .map(id => tasksData.byId[id])
                .filter(Boolean);
        });

        return result;
    }, [tasksData]);

    return (
        <div className="space-y-6">
            {/* Single surface: toolbar + content (avoids stacked white boxes) */}
            <div className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                <div className="space-y-4 border-b border-[#DA7756]/15 bg-[#f6f4ee]/80 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Type Filter */}
                        <Filter className="h-4 w-4 text-neutral-400" />
                        <Tabs
                            value={taskType}
                            onValueChange={(v) => setTaskType(v as any)}
                            className="flex h-9 w-[240px] items-center justify-center rounded-full bg-neutral-200/70 p-0.5"
                        >
                            <TabsList className="h-6 w-full gap-0.5 bg-transparent py-0">
                                <TabsTrigger
                                    value="both"
                                    className="h-6 w-full rounded-full px-3 text-center text-xs font-medium text-neutral-600 transition-all data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
                                >
                                    Both
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tasks"
                                    className="h-6 w-full rounded-full px-3 text-center text-xs font-medium text-neutral-600 transition-all data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
                                >
                                    Tasks
                                </TabsTrigger>
                                <TabsTrigger
                                    value="issues"
                                    className="h-6 w-full rounded-full px-3 text-center text-xs font-medium text-neutral-600 transition-all data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
                                >
                                    Issues
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Dropdown Filters */}
                        <div className="flex flex-1 flex-wrap items-center gap-3">
                            <Select defaultValue="all-priorities">
                                <SelectTrigger className="h-9 w-[160px] rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all-users">
                                <SelectTrigger className="h-9 w-[160px] rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                    <SelectValue placeholder="All Users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-users">All Users</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all-departments">
                                <SelectTrigger className="h-9 w-[180px] rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-departments">All Departments</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="all-items">
                                <SelectTrigger className="h-9 w-[160px] rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] shadow-sm">
                                    <SelectValue placeholder="All Items" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-items">All Items</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="bg-neutral-200/80" />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Scope Toggle */}
                        <div className="inline-flex items-center rounded-full bg-neutral-200/70 p-1">
                            <button
                                type="button"
                                onClick={() => setScope('self')}
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                                    scope === 'self'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                Self
                            </button>
                            <button
                                type="button"
                                onClick={() => setScope('all')}
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                                    scope === 'all'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                All
                            </button>
                        </div>

                        {/* View Switcher */}
                        <div className="inline-flex items-center rounded-full bg-neutral-200/70 p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode('kanban')}
                                className={cn(
                                    'flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                                    viewMode === 'kanban'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                <Columns className="h-3.5 w-3.5" />
                                Kanban
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                                    viewMode === 'list'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                <List className="h-3.5 w-3.5" />
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content View — sits inside same frame on page tint */}
                <div className="bg-[#f6f4ee]/70 p-4 sm:p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-neutral-400">
                            Loading tasks...
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-20 text-red-500">
                            Error: {error}
                        </div>
                    ) : viewMode === 'kanban' ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                        >
                            <div className="grid min-h-[500px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {columns.map((column) => {
                                    const columnTasks = tasksByColumn[column.id];
                                    const count = columnTasks.length;
                                    return (
                                        <div
                                            key={column.id}
                                            className={cn(
                                                'flex flex-col gap-3 rounded-2xl border p-3 shadow-sm',
                                                column.bgColor,
                                                column.borderColor
                                            )}
                                        >
                                            <div className="flex items-center justify-between px-1">
                                                <h3 className="text-lg font-bold text-[#1a1a1a]">{column.title}</h3>
                                                <div className="rounded-md border border-[#DA7756]/20 bg-[#fef6f4] px-2 py-0.5 text-[11px] font-bold text-neutral-600 shadow-sm">
                                                    {count}
                                                </div>
                                            </div>

                                            <KanbanColumnBody
                                                columnId={column.id}
                                                tasks={columnTasks}
                                                isDragging={!!activeDragId}
                                                emptySlot={
                                                    count === 0 ? (
                                                        <div className="pointer-events-none flex flex-1 flex-col items-center justify-center py-16 text-center text-xs font-medium text-gray-300">
                                                            No items
                                                        </div>
                                                    ) : null
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <DragOverlay dropAnimation={null}>
                                {activeDragTask ? (
                                    <div className="w-[min(100vw-2rem,320px)] cursor-grabbing opacity-95 shadow-xl">
                                        <TaskCard task={activeDragTask} />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <VirtualizedTaskList tasks={allTasks} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TasksList;
