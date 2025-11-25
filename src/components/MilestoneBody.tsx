import React, { useEffect, useRef } from "react";
import axios from "axios";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Compact styles with smaller bars and outside titles
const ganttStyles = `
    /* Compact row height */
    .gantt_task_row,
    .gantt_row {
        height: 36px !important;
    }
    
    .gantt_task_cell {
        height: 36px !important;
    }
    
    /* Small task bars - keep original colors */
    .gantt_task_line {
        border-radius: 4px !important;
        height: 16px !important;
        margin-top: 10px !important;
    }
    
    .milestone-task .gantt_task_line {
        height: 16px !important;
    }

    .milestone-task .gantt_task_progress_wrapper{
        background-color: #bc977c !important;
    }
    
    .sub-task .gantt_task_line {
        height: 16px !important;
    }

    .sub-task .gantt_task_progress_wrapper{
        background-color: #bc977c !important;
    }
    
    /* Remove text from inside bars */
    .gantt_task_content {
        width: max-content !important;
        font-size: 9px !important;
        background-color: transparent !important;
        margin-top: -19px !important;
        margin-left: 4px !important;
        height: 20px !important;
        text-align: left !important;
        color: #000 !important;
    }

    .gantt_task_progress_wrapper {
        background-color: #bc977c !important;
    }
    
    /* Show text outside bars (above) */
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
    
    /* Compact grid cells */
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
    
    /* Compact scale height */
    .gantt_scale_cell {
        font-size: 11px !important;
        height: 28px !important;
        line-height: 28px !important;
    }
    
    /* Today line */
    .gantt_marker {
        background-color: #ff0000 !important;
        opacity: 0.8 !important;
    }
`;

declare let gantt: any;

// Add styles to document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = ganttStyles;
    document.head.appendChild(styleSheet);
}

const GanttChart = () => {
    const { id } = useParams();
    const baseUrl = localStorage.getItem('baseUrl')
    const ganttContainer = useRef(null);
    const [scale, setScale] = React.useState("week");
    const navigate = useNavigate();

    // Helper function to calculate progress for milestones or tasks
    const calculateProgress = (entityId, tasksData, entityType) => {
        const childType = entityType === "milestone" ? "task" : "sub_task";
        const children = tasksData.filter(task => task.parent === entityId && task.type === childType);

        if (children.length === 0) {
            // If no children, check the entity's own status (for tasks without subtasks)
            if (entityType === "task") {
                const taskItself = tasksData.find(t => t.id === entityId);
                if (taskItself && taskItself.status?.toLowerCase() === "completed") {
                    return { total: 1, completed: 1, percentage: 100 };
                }
                return { total: 1, completed: 0, percentage: 0 };
            }
            return { total: 0, completed: 0, percentage: 0 };
        }

        let totalTasks = 0;
        let completedTasks = 0;

        if (entityType === "milestone") {
            children.forEach(task => {
                const subTasks = tasksData.filter(st => st.parent === task.id && st.type === "sub_task");
                if (subTasks.length > 0) {
                    totalTasks += subTasks.length;
                    completedTasks += subTasks.filter(st => st.status?.toLowerCase() === "completed").length;
                } else {
                    totalTasks += 1;
                    if (task.status?.toLowerCase() === "completed") completedTasks += 1;
                }
            });
        } else if (entityType === "task") {
            totalTasks = children.length;
            completedTasks = children.filter(st => st.status?.toLowerCase() === "completed").length;
        }

        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
            total: totalTasks,
            completed: completedTasks,
            percentage: Math.round(percentage * 100) / 100
        };
    };

    // Helper function to determine milestone status based on tasks
    const calculateMilestoneStatus = (milestoneId, tasksData) => {
        const tasks = tasksData.filter(task => task.parent === milestoneId && task.type === "task");

        if (tasks.length === 0) {
            return tasksData.find(task => task.type === "milestone" && task.id === milestoneId)?.status;
        }

        const statuses = tasks.map(task => task.status?.toLowerCase() || "open");

        if (statuses.some(status => status === "on_hold" || status === "hold")) {
            return "on_hold";
        }

        if (statuses.every(status => status === "completed")) {
            return "completed";
        }

        if (statuses.some(status => status === "in_progress" || status === "progress")) {
            return "in_progress";
        }

        return "open";
    };

    // Combined handler for all navigation clicks
    useEffect(() => {
        const handleNavigationClick = (e) => {
            const btn = e.target.closest(".gantt-open-task");
            if (btn) {
                const itemId = btn.getAttribute("data-id");
                const itemType = btn.getAttribute("data-type");
                const milestoneId = btn.getAttribute("data-milestone-id");

                if (itemId && itemType) {
                    console.log(`Navigating to ${itemType}:`, itemId);
                    if (itemType === "milestone") {
                        navigate(`${itemId}/tasks`);
                    } else if (itemType === "task" || itemType === "sub_task") {
                        navigate(`${milestoneId}/tasks/${itemId}`);
                    }
                }
            }
        };

        const container = ganttContainer.current;
        container?.addEventListener("click", handleNavigationClick);

        return () => {
            container?.removeEventListener("click", handleNavigationClick);
        };
    }, [navigate]);

    // Delete button handler with confirmation
    useEffect(() => {
        const handleDeleteClick = (e) => {
            const btn = e.target.closest(".gantt-delete-task");
            if (btn) {
                const taskId = btn.getAttribute("data-id");
                const itemType = btn.getAttribute("data-type");

                if (taskId) {
                    const entityDisplayName = itemType === "milestone" ? "Milestone" :
                        itemType === "task" ? "Task" : "Subtask";

                    if (window.confirm(`Are you sure you want to delete this ${entityDisplayName}?`)) {
                        let entityType = '';
                        let entityId = '';

                        if (taskId.startsWith('milestone-')) {
                            entityType = 'milestone';
                            entityId = taskId.replace('milestone-', '');
                        } else if (taskId.startsWith('task-')) {
                            entityType = 'task';
                            entityId = taskId.split('-')[1];
                        } else if (taskId.startsWith('subtask-')) {
                            entityType = 'subtask';
                            entityId = taskId.replace('subtask-', '');
                        }

                        const apiEndpoint = entityType === 'milestone'
                            ? `https://${baseUrl}/milestones/${entityId}.json`
                            : `https://${baseUrl}/task_managements/${entityId}.json`;

                        axios.delete(apiEndpoint, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        })
                            .then(response => {
                                console.log(`${entityType} deleted successfully:`, response.data);
                                toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully!`);
                                gantt.deleteTask(taskId);
                            })
                            .catch(error => {
                                console.error(`Error deleting ${entityType}:`, error);
                                toast.error(`Failed to delete ${entityType}. Please try again.`);
                            });
                    }
                }
            }
        };

        const container = ganttContainer.current;
        container?.addEventListener("click", handleDeleteClick);

        return () => {
            container?.removeEventListener("click", handleDeleteClick);
        };
    }, []);

    useEffect(() => {
        const handleMilestoneViewClick = (e) => {
            const btn = e.target.closest(".gantt-milestone-link");
            if (btn) {
                const itemId = btn.getAttribute("data-id");
                if (itemId) {
                    navigate(`${itemId}`);
                }
            }
        };

        const container = ganttContainer.current;
        container?.addEventListener("click", handleMilestoneViewClick);

        return () => {
            container?.removeEventListener("click", handleMilestoneViewClick);
        };
    }, [navigate]);

    useEffect(() => {
        console.log("Gantt useEffect started, scale:", scale);

        // Configure compact row height
        gantt.config.row_height = 36;
        gantt.config.task_height = 16;

        // Columns
        gantt.config.columns = [
            {
                name: "text",
                label: "Milestone / Task Title",
                tree: true,
                width: 250,
                resize: true,
                template: function (task) {
                    if (task.type === "milestone") {
                        return `<span class="gantt-milestone-link" data-id="${task.navigationid}" style="cursor: pointer; font-size: 14px;" title="${task.text}">${task.text}</span>`;
                    }
                    return `<span style="cursor: pointer; font-size: 14px;" title="${task.text}">${task.text}</span>`;
                },
            },
            {
                name: "progress",
                label: "Progress",
                align: "center",
                width: 100,
                template: function (task) {
                    if (task.type === "milestone" || task.type === "task") {
                        return `${Math.round(task.progress * 100)}%`;
                    }
                    return "";
                },
            },
            {
                name: "status",
                label: "Status",
                align: "center",
                width: 100,
                template: function (task) {
                    console.log(task)
                    const status = task.status;
                    return status?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                },
            },
            {
                name: "actions",
                label: "Actions",
                align: "center",
                width: 130,
                resize: true,
                template: function (task) {
                    const navType = task.type === "milestone" ? "milestone" : task.type;
                    const titleText = task.type === "milestone" ? "View Tasks" : "View Details";

                    let milestoneId = "";
                    if (task.type === "task" || task.type === "sub_task") {
                        let parentId = task.parent;
                        while (parentId && !parentId.toString().startsWith('milestone-')) {
                            const parentTask = gantt.getTask(parentId);
                            parentId = parentTask ? parentTask.parent : null;
                        }
                        if (parentId && parentId.toString().startsWith('milestone-')) {
                            milestoneId = parentId.toString().replace('milestone-', '');
                        }
                    }

                    return `
                        <span class="flex items-center justify-center gap-3 mt-2 text-gray-500">
                            <button 
                                class="gantt-open-task" 
                                data-id="${task.navigationid}" 
                                data-type="${navType}"
                                data-milestone-id="${milestoneId}"
                                title="${titleText}"
                                style="background: none; border: none; cursor: pointer;"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 14.875H11.5417C12.4257 14.875 13.2736 14.5238 13.8987 13.8987C14.5238 13.2736 14.875 12.4257 14.875 11.5417V9.45833M8 14.875H4.45833C3.57428 14.875 2.72643 14.5238 2.10131 13.8987C1.47619 13.2736 1.125 12.4257 1.125 11.5417V8M8 14.875V10.5C8 9.83696 7.73661 9.20107 7.26777 8.73223C6.79893 8.26339 6.16304 8 5.5 8H1.125M1.125 8V4.45833C1.125 3.57428 1.47619 2.72643 2.10131 2.10131C2.72643 1.47619 3.57428 1.125 4.45833 1.125H6.54167M9.45833 1.125H14.0417C14.2717 1.125 14.48 1.21833 14.6308 1.36917M14.6308 1.36917C14.7871 1.52541 14.875 1.73734 14.875 1.95833V6.54167M14.6308 1.36917L14.0417 1.95833L9.45833 6.54167" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </span>
                    `;
                },
            },
        ];

        // <button 
        //                         class="gantt-delete-task" 
        //                         data-id="${task.id}" 
        //                         data-type="${navType}"
        //                         title="Delete"
        //                         style="background: none; border: none; cursor: pointer;"
        //                     >
        //                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                         <path fill-rule="evenodd" clip-rule="evenodd" d="M5.64484 5.33333L6.3215 16.7067C6.33169 16.8762 6.40618 17.0354 6.52976 17.1518C6.65334 17.2683 6.8167 17.3332 6.9865 17.3333H13.0132C13.183 17.3332 13.3463 17.2683 13.4699 17.1518C13.5935 17.0354 13.668 16.8762 13.6782 16.7067L14.3548 5.33333H5.64484ZM15.3573 5.33333L14.6765 16.7658C14.6512 17.1899 14.465 17.5883 14.1558 17.8796C13.8467 18.1709 13.438 18.3332 13.0132 18.3333H6.9865C6.56171 18.3332 6.15298 18.1709 5.84383 17.8796C5.53468 17.5883 5.34845 17.1899 5.32317 16.7658L4.64234 5.33333H2.9165V4.75C2.9165 4.63949 2.9604 4.53351 3.03854 4.45537C3.11668 4.37723 3.22266 4.33333 3.33317 4.33333H16.6665C16.777 4.33333 16.883 4.37723 16.9611 4.45537C17.0393 4.53351 17.0832 4.63949 17.0832 4.75V5.33333H15.3573ZM11.6665 2.5C11.777 2.5 11.883 2.5439 11.9611 2.62204C12.0393 2.70018 12.0832 2.80616 12.0832 2.91667V3.5H7.9165V2.91667C7.9165 2.80616 7.9604 2.70018 8.03854 2.62204C8.11668 2.5439 8.22266 2.5 8.33317 2.5H11.6665ZM7.9165 7.5H8.9165L9.33317 15H8.33317L7.9165 7.5ZM11.0832 7.5H12.0832L11.6665 15H10.6665L11.0832 7.5Z" fill="black"/>
        //                         </svg>
        //                     </button>

        const weekDateFormatter = gantt.date.date_to_str("%d %M");

        gantt.config.scale_offset_minimal = true;
        gantt.config.fit_tasks = false;
        gantt.config.show_chart = true;
        gantt.config.scroll_size = 20;
        gantt.config.smart_rendering = true;
        gantt.config.smart_scales = true;

        gantt.config.layout = {
            css: "gantt_container",
            cols: [
                {
                    width: 500,            // Initial width of the left grid
                    min_width: 400,        // Optional: prevent collapsing too much
                    rows: [
                        { view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" }
                    ]
                },
                { resizer: true, width: 1 }, // 👈 enables draggable separator
                {
                    rows: [
                        { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                        { view: "scrollbar", id: "scrollHor" }
                    ]
                },
                { view: "scrollbar", id: "scrollVer" }
            ]
        };

        if (scale === "week") {
            gantt.config.scales = [
                { unit: "month", step: 1, format: "%F %Y" },
                {
                    unit: "week",
                    step: 1,
                    format: function (date) {
                        const start = gantt.date.week_start(new Date(date));
                        const end = gantt.date.add(start, 6, "day");
                        return weekDateFormatter(start) + " - " + weekDateFormatter(end);
                    }
                },
                { unit: "day", step: 1, format: "%j" }
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
                    format: function (date) {
                        const start = gantt.date.week_start(new Date(date));
                        return start.getDate();
                    }
                }
            ];
            gantt.config.scale_height = 90;
            gantt.config.min_column_width = 40;
        } else if (scale === "year") {
            gantt.config.scales = [
                { unit: "year", step: 1, format: "%Y" },
                {
                    unit: "quarter", step: 1, format: function (date) {
                        var quarterNum = Math.floor((date.getMonth() + 3) / 3);
                        return "Q" + quarterNum;
                    }
                },
                { unit: "month", step: 1, format: "%M" }
            ];
            gantt.config.scale_height = 90;
            gantt.config.min_column_width = 40;
        }

        const setDateRange = () => {
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 10, 0, 1);
            const maxDate = new Date(today.getFullYear() + 10, 11, 31);

            gantt.config.start_date = minDate;
            gantt.config.end_date = maxDate;
        };

        setDateRange();

        gantt.templates.task_class = function (start, end, task) {
            if (task.type === "milestone") {
                return "milestone-task";
            } else if (task.type === "sub_task") {
                return "sub-task";
            }
            return "custom-task";
        };

        gantt.config.types.milestone = "milestone";
        gantt.config.types.task = "task";
        gantt.config.types.sub_task = "sub_task";

        if (ganttContainer.current) {
            // Show task text outside bars (above them)
            gantt.templates.task_text = function (start, end, task) {
                function formatDateRange(start, end) {
                    const startDate = new Date(start);
                    const endDate = new Date(end);
                    // Subtract 1 day from end date since we added 1 day for display purposes in Gantt
                    endDate.setDate(endDate.getDate() - 1);

                    const month = endDate.toLocaleString("en-US", { month: "short" }); // "Nov"
                    const year = endDate.getFullYear();

                    return `${startDate.getDate()} - ${endDate.getDate()} ${month} ${year}`;
                }
                return `${formatDateRange(start, end)} | ${task.owner ? task.owner : "Not assigned"}`;
            };
            gantt.templates.rightside_text = function (start, end, task) {
                return "";
            };

            gantt.init(ganttContainer.current);
        } else {
            console.error("Gantt container not found!");
            return;
        }

        const fetchMilestones = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/milestones.json?q[project_management_id_eq]=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const rawData = response.data;
                console.log("Fetched milestones:", rawData);

                const tasksData = [];
                const linksData = [];
                const taskIds = new Set();
                const navigationIdToGanttIds = {};
                const pendingPredecessors = [];

                function formatDateDMYFromISO(dateStr) {
                    if (!dateStr) return "";
                    const date = new Date(dateStr);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }

                function formatEndDateDMYFromISO(dateStr) {
                    if (!dateStr) return "";
                    const date = new Date(dateStr);
                    // Add 1 day to include the end date in the Gantt display
                    // Gantt's end_date is exclusive, so we need to add 1 day to make it inclusive
                    date.setDate(date.getDate() + 1);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }

                function calculateDuration(startStr, endStr) {
                    if (!startStr || !endStr) return 1;
                    const startParts = startStr.split("-");
                    const endParts = endStr.split("-");
                    const start = new Date(
                        `${startParts[2]}-${startParts[1]}-${startParts[0]}`
                    );
                    const end = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);
                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
                    const diffTime = end.getTime() - start.getTime();
                    // Since end date is already adjusted by +1 day, we just calculate the difference
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 ? diffDays : 1;
                }

                rawData.forEach((item) => {
                    const milestoneId = `milestone-${item.id}`;
                    const formattedStart = item.start_date
                        ? formatDateDMYFromISO(item.start_date)
                        : formatDateDMYFromISO(new Date().toISOString());
                    const formattedEnd = item.end_date
                        ? formatEndDateDMYFromISO(item.end_date)
                        : formatEndDateDMYFromISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
                    tasksData.push({
                        navigationid: item.id,
                        id: milestoneId,
                        text: item.title || "Untitled Milestone",
                        start_date: formattedStart,
                        end_date: formattedEnd,
                        duration: formattedStart && formattedEnd
                            ? calculateDuration(formattedStart, formattedEnd)
                            : 1,
                        progress: 0.0,
                        totalTasks: 0,
                        completedTasks: 0,
                        status: item.status,
                        depends: item.depends_on_id
                            ? `milestone-${item.depends_on_id}`
                            : null,
                        type: "milestone",
                        owner: item.owner_name,
                        parent: 0,
                        open: true,
                    });

                    console.log(tasksData)

                    if (item.id) {
                        navigationIdToGanttIds[item.id] = navigationIdToGanttIds[item.id] || [];
                        navigationIdToGanttIds[item.id].push(milestoneId);
                    }

                    if (item.depends_on_id) {
                        linksData.push({
                            id: `link-milestone-${item.id}`,
                            source: `milestone-${item.depends_on_id}`,
                            target: milestoneId,
                            type: "0",
                        });
                    }

                    if (Array.isArray(item.task_managements)) {
                        item.task_managements.forEach((task) => {
                            const taskId = `task-${task.id}`;
                            let uniqueTaskId = taskId;

                            if (taskIds.has(taskId)) {
                                uniqueTaskId = `task-${task.id}-milestone-${item.id}`;
                            }
                            taskIds.add(uniqueTaskId);

                            const formattedStartTask = task.expected_start_date
                                ? formatDateDMYFromISO(task.expected_start_date)
                                : formattedStart;

                            const formattedEndTask = task.target_date
                                ? formatEndDateDMYFromISO(task.target_date)
                                : formattedEnd;

                            const taskDuration = formattedStartTask && formattedEndTask
                                ? calculateDuration(formattedStartTask, formattedEndTask)
                                : task.estimated_hour
                                    ? task.estimated_hour + (task.estimated_min ? task.estimated_min / 60 : 0)
                                    : 1;

                            tasksData.push({
                                navigationid: task.id,
                                id: uniqueTaskId,
                                text: task.title || "Untitled Task",
                                start_date: formattedStartTask,
                                end_date: formattedEndTask,
                                duration: taskDuration,
                                progress: 0.0,
                                totalTasks: 0,
                                completedTasks: 0,
                                status: task.status || "Open",
                                owner: task.responsible_person
                                    ? task.responsible_person.name
                                    : "",
                                parent: milestoneId,
                                type: "task",
                            });

                            if (task.id) {
                                navigationIdToGanttIds[task.id] = navigationIdToGanttIds[task.id] || [];
                                navigationIdToGanttIds[task.id].push(uniqueTaskId);
                            }

                            if (task.predecessor_task) {
                                try {
                                    const preds = Array.isArray(task.predecessor_task)
                                        ? task.predecessor_task.flat(Infinity).filter(p => p != null)
                                        : [];

                                    preds.forEach(pred => {
                                        pendingPredecessors.push({
                                            predecessorNavId: pred,
                                            targetGanttId: uniqueTaskId,
                                            targetMilestoneId: item.id,
                                        });
                                    });
                                } catch (e) {
                                    console.warn('Failed to parse predecessor_task for task', task.id, e);
                                }
                            }

                            if (Array.isArray(task.sub_tasks_managements)) {
                                task.sub_tasks_managements.forEach((subTask) => {
                                    const subTaskId = `subtask-${subTask.id}`;
                                    const formattedStartSubTask = subTask.expected_start_date
                                        ? formatDateDMYFromISO(subTask.expected_start_date)
                                        : formattedStartTask;

                                    const formattedEndSubTask = subTask.target_date
                                        ? formatEndDateDMYFromISO(subTask.target_date)
                                        : formattedEndTask;

                                    const subTaskDuration = formattedStartSubTask && formattedEndSubTask
                                        ? calculateDuration(formattedStartSubTask, formattedEndSubTask)
                                        : subTask.estimated_hour
                                            ? subTask.estimated_hour + (subTask.estimated_min ? subTask.estimated_min / 60 : 0)
                                            : 1;

                                    tasksData.push({
                                        navigationid: subTask.id,
                                        id: subTaskId,
                                        text: subTask.title || "Untitled Sub-task",
                                        start_date: formattedStartSubTask,
                                        end_date: formattedEndSubTask,
                                        duration: subTaskDuration,
                                        progress: subTask.status?.toLowerCase() === "completed" ? 1.0 : 0.0,
                                        status: subTask.status || "Open",
                                        owner: subTask.responsible_person
                                            ? subTask.responsible_person.name
                                            : "",
                                        parent: uniqueTaskId,
                                        type: "sub_task",
                                    });

                                    if (subTask.id) {
                                        navigationIdToGanttIds[subTask.id] = navigationIdToGanttIds[subTask.id] || [];
                                        navigationIdToGanttIds[subTask.id].push(subTaskId);
                                    }

                                    if (subTask.predecessor_task) {
                                        try {
                                            const preds = Array.isArray(subTask.predecessor_task)
                                                ? subTask.predecessor_task.flat(Infinity).filter(p => p != null)
                                                : [];

                                            preds.forEach(pred => {
                                                pendingPredecessors.push({
                                                    predecessorNavId: pred,
                                                    targetGanttId: subTaskId,
                                                    targetMilestoneId: item.id,
                                                });
                                            });
                                        } catch (e) {
                                            console.warn('Failed to parse predecessor_task for subtask', subTask.id, e);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                pendingPredecessors.forEach(pred => {
                    const possibleSources = navigationIdToGanttIds[pred.predecessorNavId] || [];

                    if (possibleSources.length === 0) {
                        console.warn('Predecessor not found for', pred.predecessorNavId, 'target', pred.targetGanttId);
                        return;
                    }

                    let sourceGanttId = possibleSources.find(id => {
                        return pred.targetMilestoneId && id.toString().includes(`milestone-${pred.targetMilestoneId}`);
                    });

                    if (!sourceGanttId) {
                        sourceGanttId = possibleSources[0];
                    }

                    linksData.push({
                        id: `link-${pred.targetGanttId}-${sourceGanttId}`,
                        source: pred.targetGanttId,
                        target: sourceGanttId,
                        type: "0",
                    });
                });

                const milestonesToUpdate = [];

                tasksData.forEach(task => {
                    if (task.type === "milestone") {
                        const progressData = calculateProgress(task.id, tasksData, "milestone");
                        task.progress = progressData.percentage / 100;
                        task.totalTasks = progressData.total;
                        task.completedTasks = progressData.completed;

                        const calculatedStatus = calculateMilestoneStatus(task.id, tasksData);
                        const originalStatus = task.status;
                        task.status = calculatedStatus;

                        if (originalStatus !== calculatedStatus) {
                            milestonesToUpdate.push({
                                id: task.navigationid,
                                oldStatus: originalStatus,
                                newStatus: calculatedStatus
                            });
                        }

                        console.log(`Milestone ${task.text}: ${progressData.completed}/${progressData.total} = ${progressData.percentage}%, Status: ${calculatedStatus}`);
                    } else if (task.type === "task") {
                        const progressData = calculateProgress(task.id, tasksData, "task");
                        task.progress = progressData.percentage / 100;
                        task.totalTasks = progressData.total;
                        task.completedTasks = progressData.completed;
                        console.log(`Task ${task.text}: ${progressData.completed}/${progressData.total} = ${progressData.percentage}%`);
                    }
                });

                milestonesToUpdate.forEach(milestone => {
                    const payload = {
                        milestone: {
                            status: milestone.newStatus,
                        }
                    };

                    console.log(`Updating milestone ${milestone.id} status from ${milestone.oldStatus} to ${milestone.newStatus}`);

                    axios.put(
                        `https://${baseUrl}/milestones/${milestone.id}.json`,
                        payload,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    )
                        .then(response => {
                            console.log(`Milestone ${milestone.id} status updated successfully:`, response.data);
                        })
                        .catch(error => {
                            console.error(`Error updating milestone ${milestone.id} status:`, error);
                        });
                });

                console.log("Parsed tasks data:", tasksData);
                console.log("Links data:", linksData);

                gantt.clearAll();

                const validTasks = tasksData.filter(task => {
                    if (!task.id || !task.text) {
                        console.warn("Invalid task found:", task);
                        return false;
                    }
                    return true;
                });

                console.log("Valid tasks to render:", validTasks.length);

                try {
                    gantt.parse({
                        data: validTasks,
                        links: linksData,
                    });

                    gantt.render();

                    setTimeout(() => {
                        gantt.render();
                    }, 100);

                    console.log("Gantt chart rendered successfully");
                } catch (error) {
                    console.error("Error parsing gantt data:", error);
                    console.log("Failed data:", { data: validTasks, links: linksData });
                }
            } catch (error) {
                console.error("Error loading milestones:", error);
            }
        };

        fetchMilestones();

        let updateTimeout = null;
        let isUpdating = false;

        function formatDateToISO(date) {
            if (!date) return null;
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function formatEndDateToISO(date) {
            if (!date) return null;
            const d = new Date(date);
            // Subtract 1 day since we added 1 day for display purposes
            d.setDate(d.getDate() - 1);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function updateParentMilestoneStatus(milestoneId) {
            const allTasks = [];
            gantt.eachTask((task) => {
                allTasks.push(task);
            });

            const newStatus = calculateMilestoneStatus(milestoneId, allTasks);
            const milestone = gantt.getTask(milestoneId);

            if (milestone && milestone.status !== newStatus) {
                console.log(`Updating milestone ${milestoneId} status from ${milestone.status} to ${newStatus}`);

                milestone.status = newStatus;
                gantt.updateTask(milestoneId);

                const entityId = milestoneId.replace('milestone-', '');
                const payload = {
                    milestone: {
                        status: newStatus,
                    }
                };

                axios.put(
                    `https://${baseUrl}/milestones/${entityId}.json`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                    .then(response => {
                        console.log('Milestone status updated successfully:', response.data);
                        toast.success(`Milestone status updated to ${newStatus}!`);
                    })
                    .catch(error => {
                        console.error('Error updating milestone status:', error);
                        toast.error('Failed to update milestone status.');
                    });
            }
        }

        function handleTaskUpdate(taskId, task) {
            if (isUpdating) {
                console.log("Update already in progress, skipping...");
                return;
            }

            let entityType = '';
            let entityId = '';

            if (taskId.startsWith('milestone-')) {
                entityType = 'milestone';
                entityId = taskId.replace('milestone-', '');
            } else if (taskId.startsWith('task-')) {
                entityType = 'task';
                entityId = taskId.split('-')[1];
            } else if (taskId.startsWith('subtask-')) {
                entityType = 'subtask';
                entityId = taskId.replace('subtask-', '');
            }

            if (entityType === 'milestone') {
                isUpdating = true;

                const payload = {
                    milestone: {
                        title: task.text,
                        start_date: formatDateToISO(task.start_date),
                        end_date: formatEndDateToISO(task.end_date),
                        duration: task.duration,
                        project_management_id: parseInt(id),
                        status: task.status,
                    }
                };

                if (task.owner) {
                    payload.milestone.owner_id = task.owner;
                }

                if (task.depends && task.depends.startsWith('milestone-')) {
                    payload.milestone.depends_on_id = parseInt(task.depends.replace('milestone-', ''));
                }

                console.log('Sending milestone update:', payload);

                axios.put(
                    `https://${baseUrl}/milestones/${entityId}.json`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                    .then(response => {
                        console.log('Milestone updated successfully:', response.data);
                        toast.success('Milestone updated successfully!');
                    })
                    .catch(error => {
                        console.error('Error updating milestone:', error);
                        console.error('Error response:', error.response?.data);
                        toast.error('Failed to update milestone. Please try again.');
                        setTimeout(() => {
                            fetchMilestones();
                        }, 1000);
                    })
                    .finally(() => {
                        isUpdating = false;
                    });
            }
            else if (entityType === 'task' || entityType === 'subtask') {
                isUpdating = true;

                const payload = {
                    task_management: {
                        title: task.text,
                        started_at: formatDateToISO(task.start_date),
                        target_date: formatEndDateToISO(task.end_date),
                        status: task.status || 'Open',
                    }
                };

                axios.put(
                    `https://${baseUrl}/task_managements/${entityId}.json`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                    .then(response => {
                        console.log(`${entityType} updated successfully:`, response.data);
                        toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated successfully!`);

                        if (entityType === 'task' && task.parent && task.parent.startsWith('milestone-')) {
                            updateParentMilestoneStatus(task.parent);
                        }
                    })
                    .catch(error => {
                        console.error(`Error updating ${entityType}:`, error);
                        toast.error(`Failed to update ${entityType}. Please try again.`);
                        setTimeout(() => {
                            fetchMilestones();
                        }, 1000);
                    })
                    .finally(() => {
                        isUpdating = false;
                    });
            }
        }

        const taskUpdateHandler = gantt.attachEvent("onAfterTaskUpdate", function (taskId, task) {
            console.log("Task update event triggered for:", taskId);

            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            updateTimeout = setTimeout(() => {
                console.log("Processing update for task:", taskId);
                handleTaskUpdate(taskId, task);
            }, 1000);
        });

        gantt.attachEvent("onAfterLinkAdd", function (id, link) {
            console.log("Link added:", link);

            const sourceId = link.source;
            const targetId = link.target;

            if (targetId.startsWith('milestone-')) {
                const milestoneId = targetId.replace('milestone-', '');
                const dependsOnId = sourceId.startsWith('milestone-')
                    ? parseInt(sourceId.replace('milestone-', ''))
                    : null;

                if (dependsOnId) {
                    const payload = {
                        milestone: {
                            depends_on_id: dependsOnId
                        }
                    };

                    axios.put(
                        `https://${baseUrl}/milestones/${milestoneId}.json`,
                        payload,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    )
                        .then(response => {
                            console.log('Dependency updated successfully:', response.data);
                            toast.success('Dependency added successfully!');
                        })
                        .catch(error => {
                            console.error('Error updating dependency:', error);
                            toast.error('Failed to add dependency. Please try again.');
                            gantt.deleteLink(id);
                        });
                }
            }
        });

        const linkDeleteHandler = gantt.attachEvent("onAfterLinkDelete", function (id, link) {
            console.log("Link deleted:", link);

            const targetId = link.target;

            if (targetId.startsWith('milestone-')) {
                const milestoneId = targetId.replace('milestone-', '');

                const payload = {
                    milestone: {
                        depends_on_id: null
                    }
                };

                axios.put(
                    `https://${baseUrl}/milestones/${milestoneId}.json`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                    .then(response => {
                        console.log('Dependency removed successfully:', response.data);
                        toast.success('Dependency removed successfully!');
                    })
                    .catch(error => {
                        console.error('Error removing dependency:', error);
                        toast.error('Failed to remove dependency.');
                        setTimeout(() => {
                            fetchMilestones();
                        }, 1000);
                    });
            }
        });

        return () => {
            console.log("Cleaning up gantt");

            if (taskUpdateHandler) {
                gantt.detachEvent(taskUpdateHandler);
            }
            if (linkDeleteHandler) {
                gantt.detachEvent(linkDeleteHandler);
            }

            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            if (gantt && gantt.clearAll) {
                gantt.clearAll();
            }
        };
    }, [scale, id, calculateMilestoneStatus]);

    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div className="flex justify-end mb-2 me-4">
                <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="border rounded p-1"
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
                    overflow: "hidden"
                }}
            />
        </div>
    );
};

export default GanttChart;