import { Card, CardContent } from './ui/card'
import { Check, Pencil, ArrowRightLeft, Focus, GripVertical } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core';

interface PriorityTodoProps {
    selectedPriority?: string;
    todos?: any[];
    isLoading?: boolean;
    onTodoToggle?: (todoId: number | string) => void;
    onEditTodo?: (todo: any) => void;
    onConvertTodo?: (todo: any) => void;
    onFlagTodo?: (todo: any) => void;
}

const PRIORITY_CONFIG = {
    'P1': { title: 'Q1 - Urgent & Important', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
    'P2': { title: 'Q2 - Important, Not Urgent', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
    'P3': { title: 'Q3 - Urgent, Not Important', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700' },
    'P4': { title: 'Q4 - Not Urgent or Important', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700' },
};

const getPriorityBgColor = (priority?: string) => {
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

// Skeleton Loader Component
const TodoSkeleton = () => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border mb-2">
            <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-4 h-4 bg-gray-300 rounded" />
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>

            <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
    );
};

// Draggable Todo Item Component
const DraggablePriorityTodoItem = ({ todo, onTodoToggle, onEditTodo, onConvertTodo, onFlagTodo }: any) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `todo-${todo.id}`,
        data: { todoId: todo.id, priority: todo.priority, status: todo.status }
    });

    const isCompleted = todo.status === "completed";

    const getPriorityLabel = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'Q1';
            case 'P2':
                return 'Q2';
            case 'P3':
                return 'Q3';
            case 'P4':
                return 'Q4';
            default:
                return '';
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
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors group mb-2 ${todo.created_by ? 'pt-5' : ''} border ${getPriorityBgColor(todo.priority)} ${isDragging ? 'opacity-50 ring-2 ring-blue-400' : ''}`}
        >
            {
                todo.created_by && (
                    <div className="absolute top-0 right-3">
                        <span className="text-xs text-end text-muted-foreground">
                            Assigned By : {todo.created_by}
                        </span>
                    </div>
                )
            }
            <div className="flex items-center gap-1">
                <button
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors cursor-grab"
                    title="Drag todo"
                >
                    <GripVertical size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditTodo?.(todo);
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Edit todo"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onConvertTodo?.(todo);
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title="Convert to Task"
                    disabled={!!todo.task_management_id}
                >
                    <ArrowRightLeft size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFlagTodo?.(todo);
                    }}
                    disabled={isCompleted}
                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                    title={todo.is_flagged ? "Remove from focus" : "Add to focus"}
                >
                    <Focus
                        size={14}
                        color={todo.is_flagged ? "#fa0202" : "#4b5563"}
                    />
                </button>
            </div>

            <div
                {...listeners}
                {...attributes}
                className="flex flex-col flex-1 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">
                        {todo.title}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                            {todo.user}
                        </span>
                        {todo.target_date && (
                            <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                    Due: {todo.target_date}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTodoToggle?.(todo.id);
                        }}
                        className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
                    >
                        <Check
                            size={16}
                            className="text-primary opacity-0 group-hover:opacity-100"
                        />
                    </button>
                </div>
                <div className={`px-1 py-0.5 text-[8px] font-semibold absolute bottom-1 right-3 ${getPriorityTagColor()}`}>
                    {getPriorityLabel()}
                </div>
            </div>
        </div>
    );
};

const PriorityTodo = ({ selectedPriority, todos = [], isLoading = false, onTodoToggle, onEditTodo, onConvertTodo, onFlagTodo }: PriorityTodoProps) => {
    const config = selectedPriority && PRIORITY_CONFIG[selectedPriority as keyof typeof PRIORITY_CONFIG];

    const filteredTodos = selectedPriority
        ? todos.filter(todo => todo.priority === selectedPriority)
        : [];

    const completedTodos = filteredTodos.filter(t => t.status === 'completed');
    const openTodos = filteredTodos.filter(t => t.status !== 'completed');

    return (
        <Card className={`shadow-sm border mb-0 rounded-[10px] w-full h-full flex flex-col ${config?.borderColor || 'border-gray-200'}`}>
            <div className="flex items-center gap-3 p-4 border-b flex-shrink-0">
                <h4 className={`text-sm font-medium ${config?.textColor || 'text-gray-700'}`}>
                    {selectedPriority ? config?.title : 'Select a Priority'}
                </h4>
            </div>
            <CardContent className="p-3 flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <TodoSkeleton key={i} />
                        ))}
                    </div>
                ) : !selectedPriority ? (
                    <p className="text-xs text-gray-500 text-center py-8">Click on a quadrant to view todos</p>
                ) : filteredTodos.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-8">No todos for this priority</p>
                ) : (
                    <div className="space-y-3">
                        {/* Open Todos */}
                        {openTodos.length > 0 && (
                            <div>
                                <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Open</h5>
                                {openTodos.map((todo) => (
                                    <DraggablePriorityTodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onTodoToggle={onTodoToggle}
                                        onEditTodo={onEditTodo}
                                        onConvertTodo={onConvertTodo}
                                        onFlagTodo={onFlagTodo}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default PriorityTodo