import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskTable from "./Task/Table";

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
    const navigate = useNavigate();
    const [taskStatusMap, setTaskStatusMap] = useState(() => {
        return tasks.reduce((acc, task) => {
            acc[task.id] = "Open"; // Default status
            return acc;
        }, {});
    });

    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});

    const toggleDropdown = (taskId) => {
        setOpenDropdown(openDropdown === taskId ? null : taskId);
    };

    const handleStatusChange = (taskId, status) => {
        setTaskStatusMap((prev) => ({
            ...prev,
            [taskId]: status,
        }));
        setOpenDropdown(null);
    };

    return (
        <div className="m-3">
            <div className="overflow-x-auto ">
            <TaskTable />
                
            </div>
        </div>
    );
};

export default TasksList;


{/* <table className="min-w-full border-collapse">
        //             <thead>
        //                 <tr className="border-b border-gray-200">
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Action
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Id
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Task Title
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Project
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Type
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Start Date
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Due Date
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Assigned To
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
        //                         Assigned By
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r w-60">
        //                         Status
        //                     </th>
        //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        //                         Overdue By
        //                     </th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {tasks.map((task, index) => {
        //                     return (
        //                         <tr className="border-b border-gray-200">
        //                             <td className="px-6 py-4 whitespace-nowrap border-r flex items-center justify-center">
        //                                 <button className="text-gray-600 hover:text-gray-900">
        //                                     <Eye size={20} onClick={() => navigate(`/task/${task.id}`)} />
        //                                 </button>
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
        //                                 {task.id}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap border-r">
        //                                 <div className="flex items-center">
        //                                     <span className="text-sm font-medium text-gray-900 bg-gray-200 py-0 px-1">+</span>
        //                                     <span className="ml-2 text-sm text-gray-900">
        //                                         {task.title}
        //                                     </span>
        //                                 </div>
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
        //                                 {task.project}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
        //                                 {task.type}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
        //                                 {task.startDate}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
        //                                 {task.dueDate}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
        //                                 {task.assignedTo}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
        //                                 {task.assignedBy}
        //                             </td>
        //                             <td className="px-6 py-4 relative text-sm text-gray-900 border-r">
        //                                 {/* Status Button */}
        //                                 <button
        //                                     className="flex items-center justify-between px-3 py-1 bg-gray-100 rounded-md text-sm text-[#E95420] w-32"
        //                                     onClick={() => toggleDropdown(task.id)}
        //                                 >
        //                                     {taskStatusMap[task.id]} <span className="ml-1">&#9662;</span>
        //                                 </button>

        //                                 {/* Dropdown Menu */}
        //                                 {openDropdown === task.id && (
        //                                     <ul
        //                                         ref={(el) => (dropdownRefs.current[task.id] = el)}
        //                                         className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-32 bg-white border border-gray-300 shadow-lg rounded-md z-10 
        //                                         ${index > tasks.length - 3 ? "bottom-full mb-1" : "top-full mt-1"}`}
        //                                     >
        //                                         {["Open", "In Progress", "Completed", "On Hold"].map((status) => (
        //                                             <li key={status}>
        //                                                 <button
        //                                                     className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        //                                                     onClick={() => handleStatusChange(task.id, status)}
        //                                                 >
        //                                                     {status}
        //                                                 </button>
        //                                             </li>
        //                                         ))}
        //                                     </ul>
        //                                 )}
        //                             </td>
        //                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        //                                 {task.overdueBy}
        //                             </td>
        //                         </tr>
        //                     )
        //                 }
        //                 )}
        //             </tbody>
        //         </table> */}
