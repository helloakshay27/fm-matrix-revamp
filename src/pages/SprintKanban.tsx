import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useParams } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';
import { debounce } from 'lodash';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import {
    CalendarDays,
    ChevronDown,
    Circle,
    CircleCheck,
    GripHorizontal,
    Play,
    Search,
    Square,
    Timer,
    User,
    X,
} from 'lucide-react';
import {
    fetchSprintById,
    fetchSprints,
    updateSprint,
} from '@/store/slices/sprintSlice';
import {
    updateTaskStatus,
    fetchKanbanTasksOfProject,
} from '@/store/slices/projectTasksSlice';
import { fetchKanbanProjects } from '@/store/slices/projectManagementSlice';
import KanbanBoard from '@/components/KanbanBoard';
import TaskCard from '@/components/TaskCard';
import SubtaskCard from '@/components/SubtaskCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const getColor = (index: number) => {
    const colors = [
        '#F9C863',
        '#B4EB77',
        '#B7E0D4',
        '#B3B3FF',
        '#D1A1FF',
        '#D9B1FF',
        '#FF9FBF',
    ];
    return colors[index % colors.length];
};

interface SprintKanbanProps {
    selectedProject?: any;
}

type KanbanColumnItem =
    | { type: 'task'; data: any }
    | { type: 'subtask'; data: any };


const SprintBoardSkeleton = () => (
    <div className="flex flex-col gap-4 h-full">
        {/* Sprint info block */}
        <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
            <div className="flex justify-center">
                <Skeleton className="h-3 w-6 rounded" />
            </div>
            <Skeleton className="h-3 w-4/5 rounded" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
            </div>
            <div className="border-t border-gray-200 my-3" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 rounded" />
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-6 w-6 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
        {/* Task cards */}
        <div className="flex flex-col gap-3 px-1">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-2 shadow-md flex flex-col gap-2">
                    <Skeleton className="h-3 w-4/5 rounded" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((j) => (
                                <Skeleton key={j} className="h-3 w-3 rounded" />
                            ))}
                        </div>
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-3 w-10 rounded" />
                            <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const KanbanColumnSkeleton = () => (
    <div className="flex flex-col gap-3 p-1">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[8px] p-3 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-3 w-10 rounded" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
                <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-16 rounded ml-auto" />
                </div>
            </div>
        ))}
    </div>
);

const KanbanColumn: React.FC<{
    card: { id: number; title: string; color: string; add: boolean };
    filteredTasks: any[];
    filteredSubtasks: any[];
    subCardVisibility: Record<number, boolean>;
    toggleSubCard: (id: number) => void;
    handleDrop: (item: any, status: string) => void;
    loading?: boolean;
}> = ({ card, filteredTasks, filteredSubtasks, subCardVisibility, toggleSubCard, handleDrop, loading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardStatus = card.title.toLowerCase().replace(' ', '_');

    const allItems: KanbanColumnItem[] = useMemo(
        () => [
            ...filteredTasks.map((task) => ({ type: 'task' as const, data: task })),
            ...filteredSubtasks.map((subtask) => ({ type: 'subtask' as const, data: subtask })),
        ],
        [filteredTasks, filteredSubtasks]
    );

    const virtualizer = useVirtualizer({
        count: allItems.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 90,
        overscan: 5,
        measureElement: (el) => el.getBoundingClientRect().height,
    });

    return (
        <KanbanBoard
            add={card.add}
            color={card.color}
            count={filteredTasks.length + filteredSubtasks.length}
            title={card.title}
            onDrop={(item: any) => handleDrop(item, cardStatus)}
            scrollRef={scrollRef}
        >
            {loading ? (
                <KanbanColumnSkeleton />
            ) : allItems.length > 0 ? (
                <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const item = allItems[virtualItem.index];
                        return (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={virtualizer.measureElement}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                {item.type === 'task' ? (
                                    <div
                                        className="w-full my-2"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                'application/reactflow',
                                                JSON.stringify({ type: 'TASK', id: item.data.id })
                                            );
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        style={{ cursor: 'move' }}
                                    >
                                        <TaskCard
                                            task={item.data}
                                            toggleSubCard={() => toggleSubCard(item.data.id)}
                                        />
                                        {(item.data.sub_tasks_managements || []).filter((st: any) =>
                                            cardStatus === 'open' ? st.status === 'open' : st.status === cardStatus
                                        ).length > 0 && subCardVisibility[item.data.id] && (
                                                <div className="ml-5 mt-1">
                                                    {(item.data.sub_tasks_managements || [])
                                                        .filter((st: any) =>
                                                            cardStatus === 'open' ? st.status === 'open' : st.status === cardStatus
                                                        )
                                                        .map((subtask: any) => (
                                                            <div
                                                                key={`subtask-${subtask.id}`}
                                                                className="mb-2"
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData(
                                                                        'application/reactflow',
                                                                        JSON.stringify({ type: 'SUBTASK', id: subtask.id, fromTaskId: item.data.id })
                                                                    );
                                                                    e.dataTransfer.effectAllowed = 'move';
                                                                }}
                                                                style={{ cursor: 'move' }}
                                                            >
                                                                <SubtaskCard subtask={subtask} isVisible />
                                                                <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                                                    Subcard of Task-{item.data.id}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <div
                                        className="mb-2"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                'application/reactflow',
                                                JSON.stringify({ type: 'SUBTASK', id: item.data.id, fromTaskId: item.data.parentTaskId })
                                            );
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        style={{ cursor: 'move' }}
                                    >
                                        <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                            Subcard of Task-{item.data.parentTaskId}
                                        </div>
                                        <SubtaskCard subtask={item.data} isVisible />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <svg width="235" height="290" viewBox="0 0 264 290" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="121.359" height="69" rx="2" fill="#F9F9F9" />
                    <rect y="84" width="121.359" height="69" rx="2" fill="#F9F9F9" />
                    <rect x="140.777" width="121.359" height="69" rx="2" fill="#F9F9F9" />
                    <rect x="0.483462" y="0.516965" width="120.363" height="67.9978" rx="1.5" transform="matrix(0.999406 0.034457 -0.0324812 0.999472 142.061 84.9836)" stroke="#8C8C8C" strokeDasharray="2 2" />
                    <rect width="121.456" height="68.9481" rx="2" transform="matrix(0.986032 0.166554 -0.157236 0.987561 141.907 85)" fill="#F9F9F9" />
                    <path d="M203.883 136C181.877 168.667 123.883 214.4 67.9609 136" stroke="#8C8C8C" />
                    <path d="M204.369 133.5C205.42 133.5 206.297 134.381 206.297 135.5C206.297 136.619 205.42 137.5 204.369 137.5C203.319 137.5 202.442 136.618 202.442 135.5C202.442 134.382 203.319 133.5 204.369 133.5Z" fill="#8C8C8C" stroke="#8C8C8C" />
                </svg>
            )}
        </KanbanBoard>
    );
};

const sprintTitle = [
    {
        id: 1,
        title: 'Open',
        color: '#C85E68',
        add: false,
    },
    {
        id: 2,
        title: 'In Progress',
        color: '#EDAE01',
        add: false,
    },
    {
        id: 3,
        title: 'Overdue',
        color: '#BB0000',
        add: false,
    },
    {
        id: 4,
        title: 'On Hold',
        color: '#027A94',
        add: false,
    },
];

const SprintKanban: React.FC<SprintKanbanProps> = ({ selectedProject: initialSelectedProject }) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl') || '';

    const { data: sprint, loading: sprintLoading } = useAppSelector(
        (state: any) => state.fetchSprintById
    );

    const fetchProjectsData = useAppSelector(
        (state: any) => state.fetchKanbanProjects
    );

    const [selectedSprint, setSelectedSprint] = useState(null);
    const [tasksOfSelectedProject, setTasksOfSelectedProject] = useState([]);
    const [sprintBoardTasks, setSprintBoardTasks] = useState([]);
    const [countdown, setCountdown] = useState('00d:00h:00m:00s');
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCreatedByDropdownOpen, setIsCreatedByDropdownOpen] = useState(false);
    const [isAssignedToDropdownOpen, setIsAssignedToDropdownOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedCreatedBy, setSelectedCreatedBy] = useState<any>('All');
    const [selectedAssignedTo, setSelectedAssignedTo] = useState<any>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [createdBySearchTerm, setCreatedBySearchTerm] = useState('');
    const [assignedToSearchTerm, setAssignedToSearchTerm] = useState('');
    const [hasFetchedInitial, setHasFetchedInitial] = useState(false);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [escalateUsers, setEscalateUsers] = useState<any[]>([]);
    const dropdownRef = useRef(null);
    const createdByDropdownRef = useRef(null);
    const assignedToDropdownRef = useRef(null);

    const contributors =
        selectedSprint?.contributors || ['S', 'A', 'B', 'M', 'K', 'D', 'CB'];

    // Fetch escalate users on component mount
    useEffect(() => {
        const fetchEscalateUsers = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data?.users) {
                    setEscalateUsers(response.data.users);
                }
            } catch (error) {
                console.error('Failed to fetch escalate users:', error);
            }
        };

        if (baseUrl && token) {
            fetchEscalateUsers();
        }
    }, [baseUrl, token]);

    // Fetch projects on component mount
    useEffect(() => {
        if (!fetchProjectsData?.data?.project_managements?.length) {
            dispatch(fetchKanbanProjects({ token, baseUrl }) as any);
        }
    }, [dispatch, token, baseUrl]);

    // Auto-select first project on initial load
    useEffect(() => {
        if (!hasFetchedInitial && fetchProjectsData?.data?.project_managements?.length > 0) {
            const firstProject = fetchProjectsData.data.project_managements[0];
            setSelectedProject(firstProject);
            setHasFetchedInitial(true);
        }
    }, [fetchProjectsData, hasFetchedInitial]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (!createdByDropdownRef.current?.contains(e.target as Node)) {
                setIsCreatedByDropdownOpen(false);
            }
            if (!assignedToDropdownRef.current?.contains(e.target as Node)) {
                setIsAssignedToDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (sprint) {
            setSelectedSprint(sprint);
            setSprintBoardTasks([
                ...(sprint?.sprint_task_managements ?? []).map((t: any) => ({ ...t, _boardType: 'task' })),
                ...(sprint?.sprint_issues ?? []).map((i: any) => ({ ...i, _boardType: 'issue' })),
            ]);
        }
    }, [sprint]);

    const toggleSubCard = useCallback((taskId: number) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    }, []);

    useEffect(() => {
        if (id && token) {
            dispatch(fetchSprintById({ baseUrl, token, id }) as any);
        }
    }, [dispatch, id, token]);

    useEffect(() => {
        const getTasks = async () => {
            setTasksLoading(true);
            try {
                const response = await dispatch(
                    fetchKanbanTasksOfProject({
                        baseUrl,
                        token,
                        id: selectedProject?.id,
                        created_by_id: selectedCreatedBy?.id,
                        responsible_person_id: selectedAssignedTo?.id,
                    }) as any
                ).unwrap();
                setTasksOfSelectedProject(response);
            } catch (error) {
                console.log(error);
            } finally {
                setTasksLoading(false);
            }
        };

        if (selectedProject) {
            getTasks();
        }
    }, [selectedProject, selectedCreatedBy, selectedAssignedTo, dispatch, token, baseUrl]);

    const debouncedUpdateTaskField = useCallback(
        debounce(
            async (
                taskId: number,
                fieldName: string,
                newValue: any,
                isSubtask = false,
                parentTaskId = null
            ) => {
                try {
                    await dispatch(
                        updateTaskStatus({
                            baseUrl,
                            token,
                            id: String(taskId),
                            data: { [fieldName]: newValue },
                        }) as any
                    ).unwrap();
                } catch (error) {
                    console.error(`Task update failed for ${taskId}:`, error);
                    if (selectedProject?.id) {
                        dispatch(
                            fetchKanbanTasksOfProject({
                                baseUrl,
                                token,
                                id: selectedProject.id,
                            }) as any
                        );
                    }
                }
            },
            300
        ),
        [dispatch, selectedProject, token]
    );

    const updateTaskDataField = useCallback(
        (taskId: number, fieldName: string, newValue: any) => {
            let changed = false;

            setSprintBoardTasks((prev) => {
                const updated = prev.map((task: any) => {
                    if (task.id === taskId) {
                        if (task[fieldName] === newValue) return task;
                        console.log(
                            `Updating sprint task ${taskId} with ${fieldName}: ${newValue}`
                        );
                        changed = true;
                        return { ...task, [fieldName]: newValue };
                    }
                    if (task.sub_tasks_managements) {
                        const updatedSubtasks = task.sub_tasks_managements.map(
                            (subtask: any) => {
                                if (subtask.id === taskId && subtask[fieldName] !== newValue) {
                                    console.log(
                                        `Updating sprint subtask ${taskId} with ${fieldName}: ${newValue}`
                                    );
                                    changed = true;
                                    return { ...subtask, [fieldName]: newValue };
                                }
                                return subtask;
                            }
                        );
                        if (changed) {
                            return { ...task, sub_tasks_managements: updatedSubtasks };
                        }
                    }
                    return task;
                });
                return changed ? updated : prev;
            });

            setTasksOfSelectedProject((prev) => {
                const updated = prev.map((task: any) => {
                    if (task.id === taskId) {
                        if (task[fieldName] === newValue) return task;
                        console.log(`Updating task ${taskId} with ${fieldName}: ${newValue}`);
                        changed = true;
                        return { ...task, [fieldName]: newValue };
                    }
                    if (task.sub_tasks_managements) {
                        const updatedSubtasks = task.sub_tasks_managements.map(
                            (subtask: any) => {
                                if (subtask.id === taskId && subtask[fieldName] !== newValue) {
                                    console.log(
                                        `Updating subtask ${taskId} with ${fieldName}: ${newValue}`
                                    );
                                    changed = true;
                                    return { ...subtask, [fieldName]: newValue };
                                }
                                return subtask;
                            }
                        );
                        if (changed) {
                            return { ...task, sub_tasks_managements: updatedSubtasks };
                        }
                    }
                    return task;
                });
                if (!changed) {
                    console.warn(`No task or subtask found with id ${taskId}`);
                }
                return changed ? updated : prev;
            });
        },
        []
    );

    const handleDrop = useCallback(
        async (item: any, newStatus: string) => {
            const { type, id: taskId, fromTaskId } = item;

            if (type === 'TASK' || type === 'SUBTASK') {
                updateTaskDataField(taskId, 'status', newStatus);
            }

            if (newStatus === 'sprint' && (type === 'TASK' || type === 'SUBTASK')) {
                let taskToAdd = tasksOfSelectedProject.find(
                    (task: any) => task.id === taskId
                );
                if (!taskToAdd && type === 'SUBTASK') {
                    taskToAdd = tasksOfSelectedProject
                        .flatMap((task: any) => task.sub_tasks_managements || [])
                        .find((subtask: any) => subtask.id === taskId);
                }
                if (taskToAdd) {
                    setSprintBoardTasks((prev) => {
                        if (!prev.some((task: any) => task.id === taskId)) {
                            return [{ ...taskToAdd, status: 'sprint' }, ...prev];
                        }
                        return prev;
                    });
                    setTasksOfSelectedProject((prev) =>
                        prev
                            .filter((task: any) => task.id !== taskId)
                            .map((task: any) => ({
                                ...task,
                                sub_tasks_managements: (
                                    task.sub_tasks_managements || []
                                ).filter((subtask: any) => subtask.id !== taskId),
                            }))
                    );
                }
            } else if (
                newStatus !== 'sprint' &&
                (type === 'TASK' || type === 'SUBTASK')
            ) {
                let taskToRemove = sprintBoardTasks.find(
                    (task: any) => task.id === taskId
                );
                if (!taskToRemove && type === 'SUBTASK') {
                    taskToRemove = sprintBoardTasks
                        .flatMap((task: any) => task.sub_tasks_managements || [])
                        .find((subtask: any) => subtask.id === taskId);
                }
                if (taskToRemove) {
                    setTasksOfSelectedProject((prev) => [
                        ...prev,
                        { ...taskToRemove, status: newStatus },
                    ]);
                    setSprintBoardTasks((prev) =>
                        prev
                            .filter((task: any) => task.id !== taskId)
                            .map((task: any) => ({
                                ...task,
                                sub_tasks_managements: (
                                    task.sub_tasks_managements || []
                                ).filter((subtask: any) => subtask.id !== taskId),
                            }))
                    );
                }
            }

            if (newStatus !== 'sprint') {
                debouncedUpdateTaskField(
                    taskId,
                    'status',
                    newStatus,
                    type === 'SUBTASK',
                    fromTaskId
                );
            }

            const sprintTaskIds = sprintBoardTasks
                .map((task: any) => task.id)
                .filter((taskId) => !item || taskId !== item.id);

            if (newStatus === 'sprint' && (type === 'TASK' || type === 'SUBTASK')) {
                if (!sprintTaskIds.includes(taskId)) {
                    sprintTaskIds.push(taskId);
                }
            }

            if (
                (type === 'TASK' || type === 'SUBTASK') &&
                sprintTaskIds.length > 0 &&
                selectedProject?.id
            ) {
                const payload = {
                    sprint: {
                        project_id: selectedProject.id,
                    },
                    task_ids: sprintTaskIds,
                };

                try {
                    await dispatch(updateSprint({ baseUrl, token, id, data: payload }) as any).unwrap();
                } catch (error) {
                    console.error('Failed to update sprint:', error);
                }
            }
        },
        [
            tasksOfSelectedProject,
            sprintBoardTasks,
            debouncedUpdateTaskField,
            selectedSprint,
            id,
            dispatch,
            selectedProject,
            token,
        ]
    );

    const handleIconClick = useCallback(
        debounce(async (newStatus: string) => {
            if (!id || !token) {
                return;
            }
            const payload = { status: newStatus };
            try {
                await dispatch(updateSprint({ baseUrl, token, id, data: payload }) as any).unwrap();
                setSelectedSprint((prev: any) => ({
                    ...prev,
                    status: newStatus,
                }));
                if (newStatus === 'stopped' || newStatus === 'completed') {
                    setCountdown('00d:00h:00m:00s');
                }
            } catch (error) {
                console.error('Failed to update sprint status:', error);
                dispatch(fetchSprints({ baseUrl, token }) as any);
            }
        }, 300),
        [id, dispatch, token]
    );

    const handlePlayClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmStart = () => {
        setIsModalOpen(false);
        handleIconClick('started');
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleProjectSelect = (project: any) => {
        if (project?.id && selectedProject?.id === project.id) {
            setIsDropdownOpen(false);
            return;
        }
        setSelectedProject(project);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    const filteredProjects = fetchProjectsData?.data?.project_managements?.filter((project: any) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Use escalate users from API for creators and assignees
    const creators = escalateUsers;
    const assignees = escalateUsers;

    const filteredCreators = creators.filter((person: any) =>
        person.full_name?.toLowerCase().includes(createdBySearchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(createdBySearchTerm.toLowerCase())
    );

    const filteredAssignees = assignees.filter((person: any) =>
        person.full_name?.toLowerCase().includes(assignedToSearchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(assignedToSearchTerm.toLowerCase())
    );

    const handleCreatedBySelect = (person: any) => {
        setSelectedCreatedBy(person);
        setIsCreatedByDropdownOpen(false);
        setCreatedBySearchTerm('');
    };

    const handleAssignedToSelect = (person: any) => {
        setSelectedAssignedTo(person);
        setIsAssignedToDropdownOpen(false);
        setAssignedToSearchTerm('');
    };

    const handleResetFilters = () => {
        const firstProject = fetchProjectsData?.data?.project_managements?.[0] ?? null;
        setSelectedProject(firstProject);
        setSelectedCreatedBy('All');
        setSelectedAssignedTo('All');
        setSearchTerm('');
        setCreatedBySearchTerm('');
        setAssignedToSearchTerm('');
    };


    const { setNodeRef, isOver } = useDroppable({
        id: 'sprint-board-dropzone',
        data: {
            type: 'SPRINT_BOARD',
        },
    });

    return (
        <div className="relative">
            {isModalOpen && (
                <ConfirmationModal
                    handleCancel={handleCancel}
                    handleConfirmStart={handleConfirmStart}
                />
            )}

            {/* Project Selector Dropdown */}
            <div className="flex items-center justify-end mx-4 mt-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="w-[18rem] relative" ref={dropdownRef}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex justify-between select-none items-center w-full border px-4 py-2 cursor-pointer text-sm bg-white rounded-md"
                        >
                            <span>
                                {selectedProject?.title || 'Select project'}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-20 mt-2 max-h-60 overflow-y-auto">
                                <div className="flex items-center border px-3 py-2 sticky top-0 bg-white z-30">
                                    <Search className="w-4 h-4 text-red-600 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search project..."
                                        className="w-full text-sm outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <ul className="text-sm divide-y">
                                    {filteredProjects?.length ? (
                                        filteredProjects.map((project: any) => (
                                            <li
                                                key={project.id}
                                                className={`cursor-pointer px-3 py-2 transition-colors ${selectedProject?.id === project.id
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                                onClick={() => handleProjectSelect(project)}
                                            >
                                                {project.title}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-3 py-2 text-gray-500">No projects found</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Created By Dropdown */}
                    <div className="w-[18rem] relative" ref={createdByDropdownRef}>
                        <div
                            onClick={() => setIsCreatedByDropdownOpen(!isCreatedByDropdownOpen)}
                            className="flex justify-between select-none items-center w-full border px-4 py-2 cursor-pointer text-sm bg-white rounded-md"
                        >
                            <span>
                                {selectedCreatedBy === 'All'
                                    ? 'Select Created By'
                                    : selectedCreatedBy?.full_name || 'Select creator'}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        {isCreatedByDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-20 mt-2 max-h-60 overflow-y-auto">
                                <div className="flex items-center border px-3 py-2 sticky top-0 bg-white z-30">
                                    <Search className="w-4 h-4 text-red-600 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search creator..."
                                        className="w-full text-sm outline-none"
                                        value={createdBySearchTerm}
                                        onChange={(e) => setCreatedBySearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <ul className="text-sm divide-y">
                                    <li
                                        className={`cursor-pointer px-3 py-2 transition-colors ${selectedCreatedBy === 'All'
                                            ? 'bg-red-50 text-red-600'
                                            : 'hover:bg-red-50 hover:text-red-600'
                                            }`}
                                        onClick={() => {
                                            setSelectedCreatedBy('All');
                                            setIsCreatedByDropdownOpen(false);
                                            setCreatedBySearchTerm('');
                                        }}
                                    >
                                        All Created By
                                    </li>
                                    {filteredCreators?.length ? (
                                        filteredCreators.map((person: any) => (
                                            <li
                                                key={person.id}
                                                className={`cursor-pointer px-3 py-2 transition-colors ${selectedCreatedBy?.id === person.id
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                                onClick={() => handleCreatedBySelect(person)}
                                            >
                                                {person.full_name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-3 py-2 text-gray-500">No creators found</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Assigned To Dropdown */}
                    <div className="w-[18rem] relative" ref={assignedToDropdownRef}>
                        <div
                            onClick={() => setIsAssignedToDropdownOpen(!isAssignedToDropdownOpen)}
                            className="flex justify-between select-none items-center w-full border px-4 py-2 cursor-pointer text-sm bg-white rounded-md"
                        >
                            <span>
                                {selectedAssignedTo === 'All'
                                    ? 'Select Assigned To'
                                    : selectedAssignedTo?.full_name || 'Select assignee'}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        {isAssignedToDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-20 mt-2 max-h-60 overflow-y-auto">
                                <div className="flex items-center border px-3 py-2 sticky top-0 bg-white z-30">
                                    <Search className="w-4 h-4 text-red-600 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search assignee..."
                                        className="w-full text-sm outline-none"
                                        value={assignedToSearchTerm}
                                        onChange={(e) => setAssignedToSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <ul className="text-sm divide-y">
                                    <li
                                        className={`cursor-pointer px-3 py-2 transition-colors ${selectedAssignedTo === 'All'
                                            ? 'bg-red-50 text-red-600'
                                            : 'hover:bg-red-50 hover:text-red-600'
                                            }`}
                                        onClick={() => {
                                            setSelectedAssignedTo('All');
                                            setIsAssignedToDropdownOpen(false);
                                            setAssignedToSearchTerm('');
                                        }}
                                    >
                                        All Assigned To
                                    </li>
                                    {filteredAssignees?.length ? (
                                        filteredAssignees.map((person: any) => (
                                            <li
                                                key={person.id}
                                                className={`cursor-pointer px-3 py-2 transition-colors ${selectedAssignedTo?.id === person.id
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                                onClick={() => handleAssignedToSelect(person)}
                                            >
                                                {person.full_name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-3 py-2 text-gray-500">No assignees found</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-md hover:bg-red-200 transition-colors border border-red-300"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <div
                className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
                style={{ height: '75vh' }}
            >
                <div
                    className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar"
                    style={{ minWidth: '300px' }}
                >
                    <div className="bg-[#DEE6E8] rounded-[5px] px-3 py-4 flex flex-col gap-5 h-full">
                        <div className="w-full relative">
                            <h3
                                className="text-white py-2 px-4 rounded-md text-xs absolute top-0 left-0 z-10"
                                style={{
                                    backgroundColor: selectedSprint?.status === 'completed' ? 'green' : '#88D760',
                                }}
                            >
                                {selectedSprint?.status === 'completed' ? 'Completed' : 'Active'}
                            </h3>
                            <div className="absolute top-2 right-2 flex gap-2">
                                {selectedSprint && (
                                    <>
                                        {selectedSprint?.status === 'completed' ? (
                                            <CircleCheck size={15} color="green" />
                                        ) : (selectedSprint?.status === 'stopped' || selectedSprint?.status === 'open') ? (
                                            <button onClick={handlePlayClick} title="Start">
                                                <Play size={15} fill="#000" className="cursor-pointer" />
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleIconClick('stopped')} title="Stop">
                                                    <Square size={15} fill="#000" className="cursor-pointer" />
                                                </button>
                                                <button onClick={() => handleIconClick('completed')} title="Complete">
                                                    <Circle size={15} className="cursor-pointer" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {sprintLoading ? (
                            <SprintBoardSkeleton />
                        ) : selectedSprint ? (
                            <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                                <div className="flex justify-center items-center">
                                    <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                                </div>
                                <p>
                                    <span className="text-[#62bbec] font-medium">S-{selectedSprint?.id}</span>{' '}
                                    {selectedSprint?.name}
                                </p>
                                <div className="flex items-center gap-2 text-[#B00020]">
                                    <CalendarDays size={14} />
                                    <span className="text-black">
                                        {selectedSprint?.start_date} to {selectedSprint?.end_date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[#D32F2F]">
                                    <User size={14} />
                                    <span className="text-black">{sprint?.sprint_owner_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#029464]">
                                    <Timer size={14} />
                                    <span className="text-[11px]">{countdown}</span>
                                </div>
                                <div className="border-t border-gray-300 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[xs] mb-1">Contributors</p>
                                    <div className="flex -space-x-2">
                                        {contributors.map((char, i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                                                style={{ backgroundColor: getColor(i) }}
                                            >
                                                {char}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                                <div className="flex justify-center items-center">
                                    <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                                </div>
                                <p>
                                    <span className="text-[#62bbec] font-medium">No Sprint Selected</span>
                                </p>
                                <div className="border-t border-gray-300 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[xs] mb-1">Contributors</p>
                                    <div className="flex -space-x-2">
                                        {['S', 'A', 'B', 'M', 'K', 'D', 'CB'].map((char, i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                                                style={{ backgroundColor: getColor(i) }}
                                            >
                                                {char}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            ref={setNodeRef}
                            className={`w-full h-max bg-white p-3 shadow-xl space-y-2 mb-2 rounded-md flex flex-col items-center justify-start text-center px-2 text-gray-500 text-sm overflow-y-auto no-scrollbar
                              ${isOver && (selectedSprint?.status === 'stopped' || !selectedSprint?.status)
                                    ? 'ring-2 ring-blue-400'
                                    : ''
                                }`}
                            style={{ minHeight: 120 }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (selectedSprint?.status === 'stopped' || !selectedSprint?.status) {
                                    try {
                                        const raw = e.dataTransfer.getData('application/reactflow');
                                        if (raw) {
                                            const data = JSON.parse(raw);
                                            console.log('Dropping to sprint board:', data);
                                            handleDrop(data, 'sprint');
                                        }
                                    } catch (error) {
                                        console.error('Failed to handle drop:', error);
                                    }
                                }
                            }}
                        >
                            {sprintBoardTasks?.length === 0 &&
                                (!(selectedSprint?.sprint_task_managements?.length) && !(selectedSprint?.sprint_issues?.length)) ? (
                                <span className="text-gray-500 mt-3">
                                    Drag from respective statuses
                                    <br />
                                    and drop your Task here.
                                </span>
                            ) : (
                                <>
                                    {sprintBoardTasks?.map((item: any) => {
                                        if (item._boardType === 'issue') {
                                            const issueAsTask = {
                                                id: item.id,
                                                title: item.title,
                                                status: item.status,
                                                target_date: item.end_date,
                                                project_management_title: item.project_management_name,
                                                milestone_title: item.milestone_name,
                                                responsible_person: item.responsible_person?.name || item.responsible_person_name,
                                            };
                                            return (
                                                <div key={`issue-${item.id}`} className="w-full my-2">
                                                    <TaskCard task={issueAsTask} type="issue" />
                                                </div>
                                            );
                                        }

                                        const taskId = `task-${item.id}`;
                                        const taskData = item?.task_management || item;
                                        const visibleSubtasks = (item.sub_tasks_managements || []).filter(
                                            (subtask: any) => subtask.status === 'sprint'
                                        );
                                        return (
                                            <div key={`task-${item.id}`} id={taskId} className="w-full my-2">
                                                <TaskCard task={taskData} toggleSubCard={() => toggleSubCard(item.id)} />
                                                {visibleSubtasks.length > 0 && subCardVisibility[item?.id] && (
                                                    <div className="ml-5 mt-1">
                                                        {visibleSubtasks.map((subtask: any) => (
                                                            <div
                                                                key={`subtask-${subtask.id}`}
                                                                id={`subtask-${subtask.id}`}
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData(
                                                                        'application/reactflow',
                                                                        JSON.stringify({
                                                                            type: 'SUBTASK',
                                                                            id: subtask.id,
                                                                            fromTaskId: item.id,
                                                                        })
                                                                    );
                                                                    e.dataTransfer.effectAllowed = 'move';
                                                                }}
                                                                className="mb-2 cursor-move relative"
                                                                style={{ pointerEvents: 'auto' }}
                                                            >
                                                                <SubtaskCard subtask={subtask} isVisible={true} />
                                                                <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                                                    Subcard of Task-{item.id}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Columns */}
                {sprintTitle.map((card: any) => {
                    const sprintTaskIds =
                        sprint?.sprint_tasks?.map(
                            (sprintTask: any) => sprintTask.task_id
                        ) || [];
                    const cardStatus = card.title.toLowerCase().replace(' ', '_');
                    const filteredTasks = tasksOfSelectedProject.filter((task: any) => {
                        const notInSprint = !sprintTaskIds.includes(task.id);
                        const matchesStatus =
                            cardStatus === 'open'
                                ? task?.status === 'open'
                                : task?.status === cardStatus;
                        return notInSprint && matchesStatus;
                    });

                    const filteredSubtasks = tasksOfSelectedProject
                        .flatMap((task: any) =>
                            (task.sub_tasks_managements || []).map((subtask: any) => ({
                                ...subtask,
                                parentTaskId: task.id,
                                parentTaskStatus: task.status,
                            }))
                        )
                        .filter(
                            (subtask: any) =>
                                (cardStatus === 'open'
                                    ? subtask?.status === 'open'
                                    : subtask?.status === cardStatus) &&
                                subtask?.status !== subtask?.parentTaskStatus &&
                                !sprintTaskIds.includes(subtask?.id)
                        );

                    return (
                        <KanbanColumn
                            key={card.id}
                            card={card}
                            filteredTasks={filteredTasks}
                            filteredSubtasks={filteredSubtasks}
                            subCardVisibility={subCardVisibility}
                            toggleSubCard={toggleSubCard}
                            handleDrop={handleDrop}
                            loading={tasksLoading}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const ConfirmationModal = ({
    handleCancel,
    handleConfirmStart,
}: {
    handleCancel: () => void;
    handleConfirmStart: () => void;
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px]">
                <div className="flex justify-end p-4">
                    <button onClick={handleCancel} className="p-1 hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="text-center px-8 pb-6">
                    <p className="text-sm text-black">
                        Are you sure you want to start this sprint. <br />
                        You cannot add or remove tasks from sprint bucket later.
                    </p>
                </div>
                <div className="bg-gray-200 py-4 flex justify-center gap-4">
                    <button
                        onClick={handleConfirmStart}
                        className="border border-red-500 text-black px-6 py-2 hover:bg-red-50"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCancel}
                        className="border border-red-500 text-black px-6 py-2 hover:bg-red-50"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SprintKanban;
