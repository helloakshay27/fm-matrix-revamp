import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskTable from "./Table";

const tasks = [
    {
        id: 23123,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 73123,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 63123,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23128,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23523,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23103,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23623,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23113,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23723,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 53123,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
    {
        id: 23122,
        title: "Demo Task",
        project: "demo project",
        type: "demo type",
        startDate: "01/01/2002",
        dueDate: "01/01/2002",
        assignedTo: "user",
        assignedBy: "admin",
        overdueBy: 1
    },
]

const TasksList = () => {
    return (
        <div className="m-3">
            <div className="overflow-x-auto ">
                <TaskTable />
            </div>
        </div>
    );
};

export default TasksList;