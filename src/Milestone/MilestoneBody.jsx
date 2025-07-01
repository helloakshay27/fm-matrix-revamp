import React, { useEffect, useRef } from "react";
import axios from "axios";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { useParams } from "react-router-dom";
import { baseURL } from './../../apiDomain'

const GanttChart = () => {
    const { id } = useParams()
    const ganttContainer = useRef(null);
    const [scale, setScale] = React.useState("week");


    useEffect(() => {
        // Columns
        gantt.config.columns = [
            {
                name: "text",
                label: "Milestone / Task Title",
                tree: true,
                width: 250,
                resize: true,
            },
            {
                name: "progress",
                label: "%",
                align: "center",
                width: 70,
                template: function (task) {
                    return Math.round(task.progress) + " %";
                },
            },
            {
                name: "status",
                label: "Status",
                align: "center",
                width: 100,
                template: function (task) {
                    return task.status || "Open";
                },
            },
            {
                name: "actions",
                label: "Actions",
                align: "center",
                width: 130,
                resize: true,
                template: function (task) {
                    // Use Tailwind classes for flex and gap
                    return `
                <span class="flex items-center justify-center gap-3 mt-2 text-gray-500">
                    <a href="milestones/${task.navigationid}/tasks" title="Open in new tab">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14.875H11.5417C12.4257 14.875 13.2736 14.5238 13.8987 13.8987C14.5238 13.2736 14.875 12.4257 14.875 11.5417V9.45833M8 14.875H4.45833C3.57428 14.875 2.72643 14.5238 2.10131 13.8987C1.47619 13.2736 1.125 12.4257 1.125 11.5417V8M8 14.875V10.5C8 9.83696 7.73661 9.20107 7.26777 8.73223C6.79893 8.26339 6.16304 8 5.5 8H1.125M1.125 8V4.45833C1.125 3.57428 1.47619 2.72643 2.10131 2.10131C2.72643 1.47619 3.57428 1.125 4.45833 1.125H6.54167M9.45833 1.125H14.0417C14.2717 1.125 14.48 1.21833 14.6308 1.36917M14.6308 1.36917C14.7871 1.52541 14.875 1.73734 14.875 1.95833V6.54167M14.6308 1.36917L14.0417 1.95833L9.45833 6.54167" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </a>

                </span>
            `;
                },
            },
        ];

        // Limit to 3 months from current date
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

        gantt.config.start_date = startDate;
        gantt.config.end_date = endDate;

        // Formatter to display "23 Jan - 29 Jan"
        const weekDateFormatter = gantt.date.date_to_str("%d %M");

        if (scale === "week") {
            gantt.config.scales = [
                {
                    unit: "week",
                    step: 1,
                    format: function (date) {
                        const start = gantt.date.week_start(new Date(date));
                        const end = gantt.date.add(start, 7, "day");
                        return `${weekDateFormatter(start)} - ${weekDateFormatter(end)} , ${start.getFullYear()}`;
                    },
                },
                {
                    unit: "day",
                    step: 1,
                    format: function (date) {
                        return gantt.date.date_to_str("%j")(date);
                    },
                },
            ];
        } else if (scale === "month") {
            gantt.config.scales = [
                {
                    unit: "month",
                    step: 1,
                    format: "%F, %Y",
                },
                {
                    unit: "week",
                    step: 1,
                    format: function (date) {
                        const start = gantt.date.week_start(new Date(date));
                        const end = gantt.date.add(start, 7, "day");
                        return `${weekDateFormatter(start)} - ${weekDateFormatter(end)}`;
                    },
                },
            ];
        } else if (scale === "year") {
            gantt.config.scales = [
                {
                    unit: "year",
                    step: 1,
                    format: "%Y",
                },
                {
                    unit: "month",
                    step: 1,
                    format: "%M",
                },
            ];
        }

        gantt.config.row_height = 40;
        gantt.config.scale_height = 60;
        gantt.config.grid_width = 500;
        gantt.config.show_task_cells = true;
        gantt.config.show_progress = true;
        gantt.config.grid_resize = true;
        gantt.config.autofit_columns = true;

        // gantt.templates.task_text = function (start, end, task) {
        //     return `| ${}]`;
        // };

        gantt.templates.task_class = function (start, end, task) {
            if (task.type === gantt.config.types.milestone) {
                return "milestone-task";
            }
            return "custom-task";
        };

        gantt.init(ganttContainer.current);

        // Fetch data
        const fetchMilestones = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/milestones.json?q[project_management_id_eq]=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const rawData = response.data;



                console.log("Fetched milestones:", rawData);
                // Map milestones and their tasks to Gantt format
                const tasksData = [];
                const linksData = [];

                const taskIds = new Set();

                function formatDateDMYFromISO(dateStr) {
                    if (!dateStr) return "";
                    const date = new Date(dateStr);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }

                function calculateDuration(startStr, endStr) {
                    const startParts = startStr.split("-");
                    const endParts = endStr.split("-");
                    const start = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
                    const end = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);
                    if (!start || !end) return 1;
                    const diffTime = end.getTime() - start.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    return diffDays > 0 ? diffDays : 1;
                }

                rawData.forEach((item) => {
                    const milestoneId = `milestone-${item.id}`;
                    const formattedStart = item.start_date ? formatDateDMYFromISO(item.start_date) : "";
                    const formattedEnd = item.end_date ? formatDateDMYFromISO(item.end_date) : "";

                    tasksData.push({
                        navigationid: item.id,
                        id: milestoneId,
                        text: item.title,
                        start_date: formattedStart,
                        end_date: formattedEnd,
                        duration: (formattedStart && formattedEnd)
                            ? calculateDuration(formattedStart, formattedEnd)
                            : 1,
                        progress: 0.0,
                        status: "Open",
                        depends: item.depends_on_id ? `milestone-${item.depends_on_id}` : null,
                        type: "milestone",
                        owner: item.owner_id,
                        parent: 0,
                    });

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

                            const formattedStartTask = task.started_at
                                ? formatDateDMYFromISO(task.started_at)
                                : "";

                            const formattedEndTask = task.target_date
                                ? formatDateDMYFromISO(task.target_date)
                                : "";

                            const taskDuration = (formattedStartTask && formattedEndTask)
                                ? calculateDuration(formattedStartTask, formattedEndTask)
                                : (task.estimated_hour
                                    ? task.estimated_hour + (task.estimated_min ? task.estimated_min / 60 : 0)
                                    : 1);

                            tasksData.push({
                                id: uniqueTaskId,
                                text: task.title,
                                start_date: formattedStartTask,
                                end_date: formattedEndTask,
                                duration: taskDuration,
                                progress: 0.0,
                                status: task.status || "Open",
                                owner: task.responsible_person ? task.responsible_person.name : "",
                                parent: milestoneId,
                                type: "task",
                            });

                            // ✅ Handle sub_tasks_managements
                            if (Array.isArray(task.sub_tasks_managements)) {
                                task.sub_tasks_managements.forEach((subTask) => {
                                    const subTaskId = `subtask-${subTask.id}`;
                                    const formattedStartSubTask = subTask.started_at
                                        ? formatDateDMYFromISO(subTask.started_at)
                                        : "";

                                    const formattedEndSubTask = subTask.target_date
                                        ? formatDateDMYFromISO(subTask.target_date)
                                        : "";

                                    const subTaskDuration = (formattedStartSubTask && formattedEndSubTask)
                                        ? calculateDuration(formattedStartSubTask, formattedEndSubTask)
                                        : (subTask.estimated_hour
                                            ? subTask.estimated_hour + (subTask.estimated_min ? subTask.estimated_min / 60 : 0)
                                            : 1);

                                    tasksData.push({
                                        id: subTaskId,
                                        text: subTask.title,
                                        start_date: formattedStartSubTask,
                                        end_date: formattedEndSubTask,
                                        duration: subTaskDuration,
                                        progress: 0.0,
                                        status: subTask.status || "Open",
                                        owner: subTask.responsible_person ? subTask.responsible_person.name : "",
                                        parent: uniqueTaskId, // 📌 parent is the task
                                        type: "sub_task",
                                    });
                                });
                            }
                        });
                    }

                });



                console.log("Parsed tasks data:", tasksData);
                const tasks = {
                    data: tasksData,
                    links: linksData,
                };

                gantt.clearAll();
                gantt.parse(tasks);
            } catch (error) {
                console.error("Error loading milestones:", error);
            }
        };

        fetchMilestones();

        gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
            console.log("Task updated:", task);
            console.log("Updated duration:", task.duration);

            //   axios.put(`https://reqres.in/api/tasks/${id}`, {
            //     task_id: id,
            //     text: task.text,
            //     duration: task.duration,
            //     start_date: task.start_date,
            //     progress: task.progress,
            //   })
            //   .then(response => {
            //     console.log('Mock API PUT response:', response.data);
            //   })
            //   .catch(error => {
            //     console.error('Error sending mock API PUT request:', error);
            //   });
        });


        gantt.attachEvent("onAfterLinkAdd", function (id, links) {
            console.log("Link updated:", links);

            // axios.put(`https://reqres.in/api/links/${id}`, {
            //     link_id: id,
            //     source: links.source,
            //     target: links.target,
            //     type: links.type
            // })
            //     .then(response => {
            //         console.log('Mock API PUT response for link:', response.data);
            //     })
            //     .catch(error => {
            //         console.error('Error sending mock API PUT request for link:', error);
            //     });
        });


        return () => {
            gantt.clearAll();
        };
    }, [scale]);

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
                style={{ minWidth: "1200px", height: "600px" }}
            />
        </div>
    );
};

export default GanttChart;
