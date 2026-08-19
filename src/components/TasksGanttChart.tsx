import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { useNavigate } from "react-router-dom";
import { useGanttTasks, useUpdateGanttTask } from "@/hooks/useGanttChart";

const ganttStyles = `
    .gantt_task_row,
    .gantt_row {
        height: 36px !important;
    }
    .gantt_task_cell {
        height: 36px !important;
    }
    .gantt_task_line {
        border-radius: 4px !important;
        height: 16px !important;
        margin-top: 10px !important;
    }
    .task-gantt-task .gantt_task_line {
        height: 16px !important;
    }
    .task-gantt-task .gantt_task_progress_wrapper {
        background-color: #bc977c !important;
    }
    .sub-task .gantt_task_line {
        height: 16px !important;
    }
    .sub-task .gantt_task_progress_wrapper {
        background-color: #bc977c !important;
    }
    .gantt_task_content {
        color: #000 !important;
        width: max-content !important;
        font-size: 9px !important;
        background-color: transparent !important;
        margin-top: -19px !important;
        margin-left: 4px !important;
        height: 20px !important;
        text-align: left !important;
    }
    .gantt_task_progress_wrapper {
        background-color: #bc977c !important;
    }
    .gantt_task_text {
        position: absolute !important;
        top: -18px !important;
        left: 0 !important;
        color: #333 !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
        pointer-events: none !important;
    }
    .gantt_grid_data .gantt_cell {
        border-right: 1px solid #e0e0e0 !important;
        font-size: 12px !important;
        padding: 4px 8px !important;
        line-height: 28px !important;
    }
    .gantt_grid_scale .gantt_grid_head_cell {
        background-color: #f8f9fa !important;
        border-right: 1px solid #e0e0e0 !important;
        font-size: 14px !important;
        padding: 4px 8px !important;
    }
    .gantt_scale_cell {
        font-size: 11px !important;
        height: 28px !important;
        line-height: 28px !important;
    }
    .gantt_marker {
        background-color: #ff0000 !important;
        opacity: 0.8 !important;
    }
    .gantt-progress-bar-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #666;
    }
    .gantt-progress-bar {
        overflow: hidden;
        border-radius: 10px;
        background-color: rgba(232, 232, 232, 1);
        height: 17px;
        width: 80px;
        position: relative;
    }
    .gantt-progress-bar-fill {
        background-color: #ffd844;
        height: 100%;
        overflow: hidden;
        border-radius: 10px;
        z-index: 1;
        font-weight: bold;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .gantt-progress-bar-label {
        z-index: 2;
        position: absolute;
        top: 0px;
        left: 0px;
        color: black;
        font-size: 10px;
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = ganttStyles;
    document.head.appendChild(styleSheet);
}

declare let gantt: any;

interface TasksGanttChartProps {
    projectId?: string;
    milestoneId?: string;
    taskType?: "all" | "my";
    filters?: Record<string, any>;
}

function formatDateDMY(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatEndDateDMY(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function calcDuration(startStr: string, endStr: string) {
    if (!startStr || !endStr) return 1;
    const [ds, ms, ys] = startStr.split("-");
    const [de, me, ye] = endStr.split("-");
    const start = new Date(`${ys}-${ms}-${ds}`);
    const end = new Date(`${ye}-${me}-${de}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
}

function fmtISO(date: Date) {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtEndISO(date: Date) {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TasksGanttChart: React.FC<TasksGanttChartProps> = ({
    projectId,
    milestoneId,
    taskType = "all",
    filters = {},
}) => {
    const ganttContainer = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = React.useState("week");
    const navigate = useNavigate();

    const { data: rawTasks = [] } = useGanttTasks({
        projectId,
        milestoneId,
        taskType,
        filters,
    });

    const updateMutation = useUpdateGanttTask();

    const rawTasksRef = useRef(rawTasks);
    rawTasksRef.current = rawTasks;
    const ganttReadyRef = useRef(false);

    function loadGanttData() {
        if (!ganttReadyRef.current || !ganttContainer.current) return;

        const tasks = rawTasksRef.current;
        if (!tasks.length) {
            gantt.clearAll();
            return;
        }

        const tasksData: any[] = [];
        const linksData: any[] = [];

        tasks.forEach((task: any) => {
            const taskGanttId = `task-${task.id}`;
            const startStr = formatDateDMY(task.expected_start_date || new Date().toISOString());
            const endStr = formatEndDateDMY(task.target_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

            tasksData.push({
                navigationid: task.id,
                id: taskGanttId,
                text: task.title || "Untitled Task",
                start_date: startStr,
                end_date: endStr,
                duration: calcDuration(startStr, endStr),
                progress: (task.completion_percent ?? 0) / 100,
                completionPercent: task.completion_percent ?? 0,
                totalSubTasks: task.total_sub_tasks ?? 0,
                completedSubTasks: task.completed_sub_tasks ?? 0,
                status: task.status || "open",
                owner: task.responsible_person?.name || task.responsible_person_name || "",
                parent: 0,
                type: "task",
                open: false,
            });

            if (Array.isArray(task.predecessor_task_ids)) {
                task.predecessor_task_ids.flat(Infinity).filter(Boolean).forEach((predId: any) => {
                    linksData.push({
                        id: `link-task-${task.id}-pred-${predId}`,
                        source: `task-${predId}`,
                        target: taskGanttId,
                        type: "0",
                    });
                });
            }

            if (Array.isArray(task.sub_tasks_managements)) {
                task.sub_tasks_managements.forEach((sub: any) => {
                    const subGanttId = `subtask-${sub.id}`;
                    const subStart = formatDateDMY(sub.expected_start_date || task.expected_start_date || new Date().toISOString());
                    const subEnd = formatEndDateDMY(sub.target_date || task.target_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

                    tasksData.push({
                        navigationid: sub.id,
                        parentTaskId: task.id,
                        id: subGanttId,
                        text: sub.title || "Untitled Subtask",
                        start_date: subStart,
                        end_date: subEnd,
                        duration: calcDuration(subStart, subEnd),
                        progress: sub.status?.toLowerCase() === "completed" ? 1.0 : 0.0,
                        status: sub.status || "open",
                        owner: sub.responsible_person?.name || "",
                        parent: taskGanttId,
                        type: "sub_task",
                    });
                });
            }
        });

        const validTasks = tasksData.filter((t) => t.id && t.text);
        gantt.clearAll();
        try {
            gantt.parse({ data: validTasks, links: linksData });
            gantt.render();
            setTimeout(() => gantt.render(), 100);
        } catch (err) {
            console.error("Error parsing gantt data:", err);
        }
    }

    // Navigate to task detail on eye icon click
    useEffect(() => {
        const handleNavigationClick = (e: MouseEvent) => {
            const btn = (e.target as Element).closest(".gantt-open-task");
            if (btn) {
                const itemId = btn.getAttribute("data-id");
                const itemType = btn.getAttribute("data-type");
                const parentTaskId = btn.getAttribute("data-parent-task");

                if (itemId && itemType) {
                    if (itemType === "task") {
                        if (projectId && milestoneId) {
                            navigate(`/vas/projects/${projectId}/milestones/${milestoneId}/tasks/${itemId}`);
                        } else {
                            navigate(`/vas/tasks/${itemId}`);
                        }
                    } else if (itemType === "sub_task" && parentTaskId) {
                        if (projectId && milestoneId) {
                            navigate(`/vas/projects/${projectId}/milestones/${milestoneId}/tasks/${parentTaskId}`);
                        } else {
                            navigate(`/vas/tasks/${parentTaskId}`);
                        }
                    }
                }
            }
        };

        const container = ganttContainer.current as HTMLElement | null;
        container?.addEventListener("click", handleNavigationClick);
        return () => container?.removeEventListener("click", handleNavigationClick);
    }, [navigate, projectId, milestoneId]);

    // Gantt initialization
    useEffect(() => {
        gantt.config.row_height = 36;
        gantt.config.task_height = 16;
        gantt.config.show_errors = false;

        gantt.config.columns = [
            {
                name: "actions",
                label: "Actions",
                tree: true,
                align: "center",
                width: 80,
                resize: true,
                template: function (task: any) {
                    const parentTaskId = task.type === "sub_task" ? task.parentTaskId : "";
                    return `
                        <span style="display:flex;align-items:center;justify-content:center;margin-top:8px;">
                            <button
                                class="gantt-open-task"
                                data-id="${task.navigationid}"
                                data-type="${task.type}"
                                data-parent-task="${parentTaskId}"
                                title="View Details"
                                style="background:none;border:none;cursor:pointer;color:#666;"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </span>
                    `;
                },
            },
            {
                name: "text",
                label: "ID",
                width: 90,
                resize: true,
                template: function (task: any) {
                    const prefix = task.type === "task" ? "T" : "S";
                    return `<span style="font-size:13px;" title="${task.text}">${prefix}-${task.navigationid}</span>`;
                },
            },
            {
                name: "text",
                label: "Task Title",
                width: 260,
                resize: true,
                template: function (task: any) {
                    const clean = task.text
                        .replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
                        .replace(/#\[(.*?)\]\(\d+\)/g, "#$1");
                    return `<span style="font-size:13px;" title="${clean}">${clean}</span>`;
                },
            },
            {
                name: "progress",
                label: "Progress",
                align: "center",
                width: 160,
                template: function (task: any) {
                    if (task.type === "task") {
                        const pct = task.completionPercent ?? 0;
                        return `
                            <div class="gantt-progress-bar-container">
                                <span>${task.completedSubTasks}</span>
                                <div class="gantt-progress-bar">
                                    <div class="gantt-progress-bar-fill" style="width:${pct}%"></div>
                                    <div class="gantt-progress-bar-label">${pct}%</div>
                                </div>
                                <span>${task.totalSubTasks}</span>
                            </div>
                        `;
                    }
                    return "";
                },
            },
            {
                name: "status",
                label: "Status",
                align: "center",
                width: 120,
                template: function (task: any) {
                    return (task.status || "")
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());
                },
            },
        ];

        const weekDateFormatter = gantt.date.date_to_str("%d %M");

        gantt.config.scale_offset_minimal = true;
        gantt.config.fit_tasks = false;
        gantt.config.show_chart = true;
        gantt.config.scroll_size = 20;
        gantt.config.smart_rendering = true;
        gantt.config.smart_scales = true;
        gantt.config.open_tree_initially = false;

        gantt.config.layout = {
            css: "gantt_container",
            cols: [
                {
                    width: 500,
                    min_width: 400,
                    rows: [{ view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" }],
                },
                { resizer: true, width: 1 },
                {
                    rows: [
                        { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                        { view: "scrollbar", id: "scrollHor" },
                    ],
                },
                { view: "scrollbar", id: "scrollVer" },
            ],
        };

        if (scale === "week") {
            gantt.config.scales = [
                { unit: "month", step: 1, format: "%F %Y" },
                {
                    unit: "week",
                    step: 1,
                    format: function (date: Date) {
                        const start = gantt.date.week_start(new Date(date));
                        const end = gantt.date.add(start, 6, "day");
                        return weekDateFormatter(start) + " - " + weekDateFormatter(end);
                    },
                },
                { unit: "day", step: 1, format: "%j" },
            ];
            gantt.config.scale_height = 90;
            gantt.config.min_column_width = 25;
        } else if (scale === "month") {
            gantt.config.scales = [
                { unit: "year", step: 1, format: "%Y" },
                { unit: "month", step: 1, format: "%F" },
                {
                    unit: "week",
                    step: 1,
                    format: function (date: Date) {
                        const start = gantt.date.week_start(new Date(date));
                        return start.getDate();
                    },
                },
            ];
            gantt.config.scale_height = 90;
            gantt.config.min_column_width = 40;
        } else if (scale === "year") {
            gantt.config.scales = [
                { unit: "year", step: 1, format: "%Y" },
                {
                    unit: "quarter",
                    step: 1,
                    format: function (date: Date) {
                        return "Q" + Math.floor((date.getMonth() + 3) / 3);
                    },
                },
                { unit: "month", step: 1, format: "%M" },
            ];
            gantt.config.scale_height = 90;
            gantt.config.min_column_width = 40;
        }

        const today = new Date();
        gantt.config.start_date = new Date(today.getFullYear() - 10, 0, 1);
        gantt.config.end_date = new Date(today.getFullYear() + 10, 11, 31);

        gantt.templates.task_class = function (_start: Date, _end: Date, task: any) {
            return task.type === "sub_task" ? "sub-task" : "task-gantt-task";
        };

        gantt.config.types.task = "task";
        gantt.config.types.sub_task = "sub_task";

        if (ganttContainer.current) {
            gantt.templates.task_text = function (start: Date, end: Date, task: any) {
                const endCopy = new Date(end);
                endCopy.setDate(endCopy.getDate() - 1);
                const month = endCopy.toLocaleString("en-US", { month: "short" });
                const year = endCopy.getFullYear();
                const dateStr = `${start.getDate()} - ${endCopy.getDate()} ${month} ${year}`;
                return `${dateStr} | ${task.owner || "Not assigned"}`;
            };
            gantt.templates.rightside_text = function () { return ""; };
            gantt.init(ganttContainer.current);
            ganttReadyRef.current = true;
            loadGanttData();
        } else {
            ganttReadyRef.current = false;
            return;
        }

        // Drag-to-update handler
        let isUpdating = false;
        let updateTimeout: ReturnType<typeof setTimeout> | null = null;

        const taskUpdateHandler = gantt.attachEvent(
            "onAfterTaskUpdate",
            function (taskId: string, task: any) {
                if (updateTimeout) clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    if (isUpdating) return;
                    isUpdating = true;

                    let entityId = "";
                    if (taskId.startsWith("task-")) {
                        entityId = taskId.split("-")[1];
                    } else if (taskId.startsWith("subtask-")) {
                        entityId = taskId.replace("subtask-", "");
                    } else {
                        isUpdating = false;
                        return;
                    }

                    const payload = {
                        task_management: {
                            title: task.text,
                            expected_start_date: fmtISO(task.start_date),
                            target_date: fmtEndISO(task.end_date),
                            status: task.status || "open",
                        },
                    };

                    updateMutation.mutate(
                        { id: entityId, data: payload },
                        { onSettled: () => { isUpdating = false; } }
                    );
                }, 1000);
            }
        );

        return () => {
            ganttReadyRef.current = false;
            if (taskUpdateHandler) gantt.detachEvent(taskUpdateHandler);
            if (updateTimeout) clearTimeout(updateTimeout);
            if (gantt?.clearAll) gantt.clearAll();
        };
    }, [scale]);

    // Load data into gantt when query result changes
    useEffect(() => {
        loadGanttData();
    }, [rawTasks]);

    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div className="flex justify-end mb-2 me-4">
                <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="week">Week View</option>
                    <option value="month">Month View</option>
                    <option value="year">Year View</option>
                </select>
            </div>
            <div
                ref={ganttContainer}
                style={{
                    minWidth: "1200px",
                    height: "600px",
                    position: "relative",
                    overflow: "hidden",
                }}
            />
        </div>
    );
};

export default TasksGanttChart;
