import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

const GanttChart1 = () => {
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
                    <a href="/tasks" title="Open in new tab">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14.875H11.5417C12.4257 14.875 13.2736 14.5238 13.8987 13.8987C14.5238 13.2736 14.875 12.4257 14.875 11.5417V9.45833M8 14.875H4.45833C3.57428 14.875 2.72643 14.5238 2.10131 13.8987C1.47619 13.2736 1.125 12.4257 1.125 11.5417V8M8 14.875V10.5C8 9.83696 7.73661 9.20107 7.26777 8.73223C6.79893 8.26339 6.16304 8 5.5 8H1.125M1.125 8V4.45833C1.125 3.57428 1.47619 2.72643 2.10131 2.10131C2.72643 1.47619 3.57428 1.125 4.45833 1.125H6.54167M9.45833 1.125H14.0417C14.2717 1.125 14.48 1.21833 14.6308 1.36917M14.6308 1.36917C14.7871 1.52541 14.875 1.73734 14.875 1.95833V6.54167M14.6308 1.36917L14.0417 1.95833L9.45833 6.54167" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </a>
                    <a href="/login/${task.id}" title="Login">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2624 0C6.78501 0 6.32718 0.189642 5.98961 0.527208C5.65204 0.864773 5.4624 1.32261 5.4624 1.8V3.3024C5.5584 3.36747 5.6496 3.44267 5.736 3.528L6.6624 4.4552V1.8C6.6624 1.64087 6.72562 1.48826 6.83814 1.37574C6.95066 1.26321 7.10327 1.2 7.2624 1.2H12.0624C12.2215 1.2 12.3741 1.26321 12.4867 1.37574C12.5992 1.48826 12.6624 1.64087 12.6624 1.8V14.2C12.6624 14.3591 12.5992 14.5117 12.4867 14.6243C12.3741 14.7368 12.2215 14.8 12.0624 14.8H7.2624C7.10327 14.8 6.95066 14.7368 6.83814 14.6243C6.72562 14.5117 6.6624 14.3591 6.6624 14.2V11.5448L5.736 12.4728C5.65067 12.5581 5.55947 12.6328 5.4624 12.6968V14.2C5.4624 14.6774 5.65204 15.1352 5.98961 15.4728C6.32718 15.8104 6.78501 16 7.2624 16H12.0624C12.5398 16 12.9976 15.8104 13.3352 15.4728C13.6728 15.1352 13.8624 14.6774 13.8624 14.2V1.8C13.8624 1.32261 13.6728 0.864773 13.3352 0.527208C12.9976 0.189642 12.5398 0 12.0624 0H7.2624Z" fill="black"/>
                    <path d="M4.0383 10.7759L6.2127 8.59988H1.4623C1.30317 8.59988 1.15056 8.53666 1.03804 8.42414C0.925519 8.31162 0.862305 8.15901 0.862305 7.99988C0.862305 7.84075 0.925519 7.68814 1.03804 7.57561C1.15056 7.46309 1.30317 7.39988 1.4623 7.39988H6.2127L4.0383 5.22388C3.93232 5.11014 3.87462 4.9597 3.87736 4.80426C3.88011 4.64882 3.94308 4.50051 4.05301 4.39058C4.16294 4.28065 4.31125 4.21768 4.46669 4.21494C4.62213 4.21219 4.77256 4.26989 4.8863 4.37588L8.0575 7.54868C8.12215 7.60496 8.17395 7.67448 8.2094 7.75253C8.24485 7.83057 8.26311 7.91532 8.26296 8.00104C8.26281 8.08676 8.24424 8.17144 8.20852 8.24936C8.1728 8.32728 8.12075 8.39662 8.0559 8.45268L4.8879 11.6239C4.83258 11.6812 4.7664 11.7269 4.69321 11.7584C4.62002 11.7899 4.5413 11.8065 4.46163 11.8072C4.38197 11.808 4.30295 11.7928 4.2292 11.7627C4.15545 11.7325 4.08844 11.688 4.03207 11.6317C3.97571 11.5754 3.93113 11.5084 3.90093 11.4347C3.87072 11.361 3.8555 11.282 3.85616 11.2023C3.85681 11.1227 3.87333 11.0439 3.90474 10.9707C3.93615 10.8975 3.98103 10.8313 4.0383 10.7759Z" fill="black"/>
                    </svg>
                    </a>
                    <a href="/delete/${task.id}" title="Delete">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64484 3.33333L4.3215 14.7067C4.33169 14.8762 4.40618 15.0354 4.52976 15.1518C4.65334 15.2683 4.8167 15.3332 4.9865 15.3333H11.0132C11.183 15.3332 11.3463 15.2683 11.4699 15.1518C11.5935 15.0354 11.668 14.8762 11.6782 14.7067L12.3548 3.33333H3.64484ZM13.3573 3.33333L12.6765 14.7658C12.6512 15.1899 12.465 15.5883 12.1558 15.8796C11.8467 16.1709 11.438 16.3332 11.0132 16.3333H4.9865C4.56171 16.3332 4.15298 16.1709 3.84383 15.8796C3.53468 15.5883 3.34845 15.1899 3.32317 14.7658L2.64234 3.33333H0.916504V2.75C0.916504 2.63949 0.960403 2.53351 1.03854 2.45537C1.11668 2.37723 1.22266 2.33333 1.33317 2.33333H14.6665C14.777 2.33333 14.883 2.37723 14.9611 2.45537C15.0393 2.53351 15.0832 2.63949 15.0832 2.75V3.33333H13.3573ZM9.6665 0.5C9.77701 0.5 9.88299 0.543899 9.96113 0.622039C10.0393 0.700179 10.0832 0.80616 10.0832 0.916667V1.5H5.9165V0.916667C5.9165 0.80616 5.9604 0.700179 6.03854 0.622039C6.11668 0.543899 6.22266 0.5 6.33317 0.5H9.6665ZM5.9165 5.5H6.9165L7.33317 13H6.33317L5.9165 5.5ZM9.08317 5.5H10.0832L9.6665 13H8.6665L9.08317 5.5Z" fill="black"/>
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
        gantt.config.grid_resize = true;       // 👈 Enables resizing grid panel
        gantt.config.autofit_columns = true;   // 👈 Auto-adjust columns
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

        // Your nested data
        const nestedData = {
            milestone: [
                {
                    id: "1",
                    text: "Milestone 1",
                    start_date: "01-05-2025",
                    duration: 13,
                    progress: 9,
                    open: true,
                    status: "Open",
                    owner: "Kshitij Rosai",
                    tasks: [
                        {
                            id: "1.1",
                            text: "Task 1.1",
                            start_date: "02-05-2025",
                            duration: 6,
                            progress: 0,
                            status: "Open",
                            owner: "Akshay",
                            subtasks: [
                                {
                                    id: "1.1.1",
                                    text: "Subtask 1.1.1",
                                    start_date: "03-05-2025",
                                    duration: 4,
                                    progress: 0,
                                    status: "Open",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "2",
                    text: "Milestone 2",
                    start_date: "16-05-2025",
                    duration: 8,
                    progress: 0,
                    status: "Open",
                    owner: "Kshitij Rosai",
                    tasks: [
                        {
                            id: "2.1",
                            text: "Task 2.1",
                            start_date: "17-05-2025",
                            duration: 5,
                            progress: 0,
                            status: "Open",
                            owner: "Akshay",
                            subtasks: [
                                {
                                    id: "2.1.1",
                                    text: "Subtask 2.1.1",
                                    start_date: "18-05-2025",
                                    duration: 3,
                                    progress: 0,
                                    status: "Open",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "3",
                    text: "Milestone 3",
                    start_date: "25-05-2025",
                    duration: 10,
                    progress: 0,
                    status: "Open",
                    owner: "Kshitij Rosai",
                    tasks: [
                        {
                            id: "3.1",
                            text: "Task 3.1",
                            start_date: "26-05-2025",
                            duration: 7,
                            progress: 0,
                            status: "Open",
                            owner: "Akshay",
                            subtasks: [
                                {
                                    id: "3.1.1",
                                    text: "Subtask 3.1.1",
                                    start_date: "27-05-2025",
                                    duration: 4,
                                    progress: 0,
                                    status: "Open",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "4",
                    text: "Milestone 4",
                    start_date: "05-06-2025",
                    duration: 12,
                    progress: 0,
                    status: "Open",
                    owner: "Kshitij Rosai",
                    tasks: [
                        {
                            id: "4.1",
                            text: "Task 4.1",
                            start_date: "06-06-2025",
                            duration: 8,
                            progress: 0,
                            status: "Open",
                            owner: "Akshay",
                            subtasks: [
                                {
                                    id: "4.1.1",
                                    text: "Subtask 4.1.1",
                                    start_date: "07-06-2025",
                                    duration: 5,
                                    progress: 0,
                                    status: "Open",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "5",
                    text: "Milestone 5",
                    start_date: "18-06-2025",
                    duration: 9,
                    progress: 0,
                    status: "Open",
                    owner: "Kshitij Rosai",
                    tasks: [
                        {
                            id: "5.1",
                            text: "Task 5.1",
                            start_date: "19-06-2025",
                            duration: 6,
                            progress: 0,
                            status: "Open",
                            owner: "Akshay",
                            subtasks: [
                                {
                                    id: "5.1.1",
                                    text: "Subtask 56.1.1",
                                    start_date: "20-06-2025",
                                    duration: 4,
                                    progress: 0,
                                    status: "Open",
                                },
                            ],
                        },
                    ],
                },
            ],
        };


        // Function to flatten nested structure
        function flattenNestedData(nestedData) {
            const flat = [];

            function processMilestone(milestone) {
                flat.push({
                    id: milestone.id,
                    text: milestone.text,
                    start_date: milestone.start_date,
                    type: milestone.type,
                    duration: milestone.duration,
                    progress: milestone.progress,
                    open: milestone.open,
                    status: milestone.status,
                    owner: milestone.owner,
                    parent: 0
                });

                if (milestone.tasks && milestone.tasks.length) {
                    milestone.tasks.forEach(task => processTask(task, milestone.id));
                }
            }

            function processTask(task, parentId) {
                flat.push({
                    id: task.id,
                    text: task.text,
                    start_date: task.start_date,
                    duration: task.duration,
                    progress: task.progress,
                    status: task.status,
                    owner: task.owner,
                    parent: parentId
                });

                if (task.subtasks && task.subtasks.length) {
                    task.subtasks.forEach(subtask => processSubtask(subtask, task.id));
                }
            }

            function processSubtask(subtask, parentId) {
                flat.push({
                    id: subtask.id,
                    text: subtask.text,
                    start_date: subtask.start_date,
                    duration: subtask.duration,
                    progress: subtask.progress,
                    status: subtask.status,
                    parent: parentId
                });
            }

            nestedData.milestone.forEach(milestone => processMilestone(milestone));

            return flat;
        }

        // Flatten your nested data
        const flatData = flattenNestedData(nestedData);

        console.log("Flat Data:", flatData);

        // Sample links — you can build your own based on dependencies
        const links = [
            // Milestone 1 links
            { id: 1, source: "1", target: "1.1", type: "0" },       // Milestone 1 -> Task 1.1
            { id: 2, source: "1.1", target: "2", type: "0" },   // Task 1.1 -> Subtask 1.1.1

            // Milestone 2 links
            { id: 3, source: "2", target: "2.1", type: "0" },       // Milestone 2 -> Task 2.1
            { id: 4, source: "2.1", target: "3", type: "0" },   // Task 2.1 -> Subtask 2.1.1

            // Milestone 3 links
            { id: 5, source: "3", target: "3.1", type: "0" },       // Milestone 3 -> Task 3.1
            { id: 6, source: "3.1", target: "4", type: "0" },   // Task 3.1 -> Subtask 3.1.1

            // Milestone 4 links
            { id: 7, source: "4", target: "4.1", type: "0" },       // Milestone 4 -> Task 4.1
            { id: 8, source: "4.1", target: "5", type: "0" },   // Task 4.1 -> Subtask 4.1.1

            // Milestone 5 links
            { id: 9, source: "5", target: "5.1", type: "0" },       // Milestone 5 -> Task 5.1
            { id: 10, source: "5.1", target: "6", type: "0" },  // Task 5.1 -> Subtask 5.1.1

            // Milestone 6 links
            { id: 11, source: "6", target: "6.1", type: "0" },      // Milestone 6 -> Task 6.1
            { id: 12, source: "6.1", target: "6.1.1", type: "0" }   // Task 6.1 -> Subtask 6.1.1
        ];


        // Now parse data to gantt
        gantt.parse({
            data: flatData,
            links: links
        });
        console.log("Link updated:", links);





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


        // Sample data


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

export default GanttChart1;
