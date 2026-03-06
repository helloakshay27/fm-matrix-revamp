import { Card, CardContent } from './ui/card'
import { Check, Pencil, Focus, Play, Pause } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core';

interface MobilePriorityTodoProps {
    selectedPriority?: string;
    todos?: any[];
    isLoading?: boolean;
    onTodoToggle?: (todoId: number | string) => void;
    onEditTodo?: (todo: any) => void;
    onFlagTodo?: (todo: any) => void;
    onPlayTask?: (taskId: number) => void;
    onPauseTask?: (taskId: number) => void;
}

const PRIORITY_CONFIG = {
    'P1': { title: 'Q1 - Urgent & Important', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', dotColor: 'bg-red-500' },
    'P2': { title: 'Q2 - Important, Not Urgent', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', dotColor: 'bg-green-500' },
    'P3': { title: 'Q3 - Urgent, Not Important', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700', dotColor: 'bg-yellow-500' },
    'P4': { title: 'Q4 - Not Urgent or Important', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700', dotColor: 'bg-gray-400' },
};

// Skeleton Loader Component
const MobileTodoSkeleton = () => {
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 animate-pulse mb-1.5">
            <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="flex flex-col flex-1 gap-1.5">
                <div className="h-3 bg-gray-300 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="w-3 h-3 bg-gray-300 rounded flex-shrink-0" />
        </div>
    );
};

// Mobile Draggable Todo Item Component
const MobileDraggablePriorityTodoItem = ({
    todo,
    onTodoToggle,
    onEditTodo,
    onFlagTodo,
    onPlayTask,
    onPauseTask
}: any) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `todo-${todo.id}`,
        data: { todoId: todo.id, priority: todo.priority, status: todo.status }
    });

    const isCompleted = todo.status === "completed";
    const isTaskStarted = todo.task_management?.is_started || false;

    const getPriorityBgColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'border-l-4 border-l-red-500';
            case 'P2':
                return 'border-l-4 border-l-green-500';
            case 'P3':
                return 'border-l-4 border-l-yellow-500';
            case 'P4':
                return 'border-l-4 border-l-gray-400';
            default:
                return 'border-l-4 border-l-gray-300';
        }
    };

    const getPriorityLabel = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1': return 'Q1';
            case 'P2': return 'Q2';
            case 'P3': return 'Q3';
            case 'P4': return 'Q4';
            default: return '';
        }
    };

    const getPriorityTagColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'bg-red-100 text-red-700';
            case 'P2':
                return 'bg-green-100 text-green-700';
            case 'P3':
                return 'bg-yellow-100 text-yellow-700';
            case 'P4':
                return 'bg-gray-200 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative flex items-center gap-2 p-2 rounded-lg transition-colors group mb-1 border text-xs ${getPriorityBgColor()} ${isDragging ? 'opacity-50 ring-2 ring-blue-400' : ''}`}
        >
            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditTodo?.(todo);
                    }}
                    className="p-0.5 text-gray-600 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <Pencil size={12} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFlagTodo?.(todo);
                    }}
                    disabled={isCompleted}
                    className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                    title={todo.is_flagged ? "Unflag" : "Flag"}
                >
                    <Focus
                        size={12}
                        color={todo.is_flagged ? "#fa0202" : "#4b5563"}
                    />
                </button>
            </div>

            <div
                {...listeners}
                {...attributes}
                className="flex flex-col flex-1 min-w-0 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-1 truncate">
                    <span className="truncate text-xs">{todo.title}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    {todo.user} {todo.target_date && `• Due: ${todo.target_date}`}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {todo.task_management_id &&
                    (isTaskStarted ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPauseTask?.(todo.task_management_id);
                            }}
                            disabled={isCompleted}
                            className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                            title="Pause"
                        >
                            <Pause size={14} className="text-orange-500" />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPlayTask?.(todo.task_management_id);
                            }}
                            disabled={isCompleted}
                            className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                            title="Play"
                        >
                            <Play size={14} className="text-green-500" />
                        </button>
                    ))}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTodoToggle?.(todo.id);
                    }}
                    className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
                    title="Toggle"
                >
                    <Check
                        size={12}
                        className="text-primary opacity-0 group-hover:opacity-100"
                    />
                </button>
            </div>
        </div>
    );
};

const MobilePriorityTodo = ({
    selectedPriority,
    todos = [],
    isLoading = false,
    onTodoToggle,
    onEditTodo,
    onFlagTodo,
    onPlayTask,
    onPauseTask
}: MobilePriorityTodoProps) => {
    const config = selectedPriority && PRIORITY_CONFIG[selectedPriority as keyof typeof PRIORITY_CONFIG];

    const filteredTodos = selectedPriority
        ? todos.filter(todo => todo.priority === selectedPriority)
        : [];

    const openTodos = filteredTodos.filter(t => t.status !== 'completed');

    return (
        <Card className={`shadow-sm border rounded-lg w-full flex flex-col bg-white ${config?.borderColor || 'border-gray-200'}`}>
            {/* Header */}
            <div className={`flex items-center gap-2 p-2.5 border-b bg-gradient-to-r ${config?.bgColor || 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full ${config?.dotColor || 'bg-gray-400'}`}></div>
                <h4 className={`text-xs font-semibold ${config?.textColor || 'text-gray-700'}`}>
                    {selectedPriority ? config?.title : 'Select Priority'}
                </h4>
            </div>

            {/* Content */}
            <CardContent className="p-2 flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="space-y-1.5">
                        {[1, 2, 3].map((i) => (
                            <MobileTodoSkeleton key={i} />
                        ))}
                    </div>
                ) : !selectedPriority ? (
                    <p className="text-xs text-gray-500 text-center py-6">Click on a quadrant to view todos</p>
                ) : openTodos.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">No todos for this priority</p>
                ) : (
                    <div className="space-y-0">
                        {openTodos.map((todo) => (
                            <MobileDraggablePriorityTodoItem
                                key={todo.id}
                                todo={todo}
                                onTodoToggle={onTodoToggle}
                                onEditTodo={onEditTodo}
                                onFlagTodo={onFlagTodo}
                                onPlayTask={onPlayTask}
                                onPauseTask={onPauseTask}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MobilePriorityTodo;
