import React, { useEffect, useRef } from "react";

const GanttChart = () => {
    const ganttContainer = useRef(null);

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
        ];

        // Limit to 3 months from current date
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        gantt.config.start_date = startDate;
        gantt.config.end_date = endDate;

        // Formatter to display "23 Jan - 29 Jan"
        const weekDateFormatter = gantt.date.date_to_str("%d %M");

        // Custom scales
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
                    const day = gantt.date.date_to_str("%j")(date); // Day of the month
                    return day; // Show all days
                },
            },
        ];

        // Other Configs
        gantt.config.row_height = 40;
        gantt.config.scale_height = 60;
        gantt.config.grid_width = 500;
        gantt.config.show_task_cells = true;
        gantt.config.show_progress = true;

        // Task label inside bars
        gantt.templates.task_text = function (start, end, task) {
            return `${task.text} | ${gantt.templates.date_grid(start)} [${task.owner || "N/A"}]`;
        };

        // Custom class for styling
        gantt.templates.task_class = function (start, end, task) {
            if (task.type === gantt.config.types.milestone) {
                return "milestone-task";
            }
            return "custom-task";
        };

        // Initialize
        gantt.init(ganttContainer.current);

        // Sample data
        gantt.parse({
            data: [
                {
                    id: 1,
                    text: "Milestone 1",
                    start_date: "01-05-2025",
                    type: gantt.config.types.milestone,
                    duration: 13,
                    progress: 9,
                    open: true,
                    status: "Open",
                    owner: "Kshitij Rosai",
                },
                {
                    id: 2,
                    text: "Task 1",
                    start_date: "02-05-2025",
                    duration: 6,
                    parent: 1,
                    progress: 0,
                    status: "Open",
                    owner: "Akshay",
                },
                {
                    id: 3,
                    text: "Subtask of task 1",
                    start_date: "03-05-2025",
                    duration: 4,
                    parent: 2,
                    progress: 0,
                    status: "Open",
                },
                {
                    id: 4,
                    text: "Milestone 2",
                    start_date: "16-05-2025",
                    type: gantt.config.types.milestone,
                    duration: 8,
                    progress: 0,
                    status: "Open",
                    owner: "Kshitij Rosai",
                },
            ],
            links: [
                {
                    id: 1,
                    source: 1,  // Milestone 1 (source task)
                    target: 2,  // Task 1 (target task)
                    type: "0",  // Finish to Start (FS)
                },
                {
                    id: 2,
                    source: 2,  // Task 1 (source task)
                    target: 3,  // Subtask of Task 1 (target task)
                    type: "0",  // Finish to Start (FS)
                },
                {
                    id: 3,
                    source: 2,  // Task 1 (source task)
                    target: 4,  // Milestone 2 (target task)
                    type: "0",  // Finish to Start (FS)
                },
            ],
        });

        return () => {
            gantt.clearAll();
        };
    }, []);

    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div
                ref={ganttContainer}
                style={{ minWidth: "1200px", height: "600px" }} // Increase minWidth as needed
            />
        </div>
    );
};

export default GanttChart;
