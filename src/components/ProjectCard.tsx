import { useEffect, useMemo, useState } from "react";
import { Briefcase, CalendarDays, Timer, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const ProjectCard = ({ project }) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [countdown, setCountdown] = useState("");

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `project-${project.id}`,
        data: {
            type: "PROJECT",
            projectId: project.id,
            project: project,
        },
    });

    // useEffect(() => {
    //     if (!project?.end_date || project.status === "completed") {
    //         setCountdown("Completed");
    //         return;
    //     }

    //     const interval = setInterval(() => {
    //         const now = new Date();
    //         const end = new Date(project.end_date);
    //         const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);

    //         const diff = endMidnight - now;

    //         if (diff <= 0 && project.status !== "completed") {
    //             setCountdown("Overdue");
    //             dispatch(changeTaskStatus({ token, id: task.id, payload: { status: "overdue" } }));
    //             clearInterval(interval);
    //         } else {
    //             const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
    //             const displayDiff = endOfDay - now;
    //             setCountdown(formatCountdown(displayDiff));
    //         }
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [project.end_date, project.status, project.id, token, dispatch]);

    const memberColors = useMemo(() => {
        const colors = {};
        project.project_members.forEach((member) => {
            if (member.user) {
                const id = member.user.id || member.user.firstname; // Use unique ID if available
                colors[id] = getRandomColor();
            }
        });
        return colors;
    }, [project.project_members]);

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                opacity: isDragging ? 0.4 : 1,
                cursor: isDragging ? "grabbing" : "grab",
                transform: CSS.Translate.toString(transform),
            }}
            className={`w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 rounded-sm transition-all duration-200 ${isDragging ? "scale-105 shadow-2xl border-2 border-blue-400" : ""
                }`}
        >
            <p className="mb-2 truncate cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                <span className="text-blue-500">{project.id}</span> {project.title}
            </p>

            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <Timer className="text-[#029464] flex-shrink-0" size={14} />
                    <span className="text-[10px] text-[#029464] truncate">
                        {countdown}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="text-[#C72030] flex-shrink-0" size={14} />
                    <span className="text-[10px] truncate">{project.project_type_name}</span>
                </div>
                <div className="flex items-start gap-2">
                    <User2 className="text-[#C72030] flex-shrink-0" size={14} />
                    <span className="text-[10px] truncate">{project.project_owner_name}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030] flex-shrink-0" size={14} />
                        <span className="text-[10px]">{project.start_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030] flex-shrink-0" size={14} />
                        <span className="text-[10px]">{project.end_date}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                {/* Milestones */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Milestone</div>
                    <div className="w-4 text-center">{project.completed_milestone_count}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-blue-500"
                            style={{
                                width: `${project.total_milestone_count > 0
                                    ? (project.completed_milestone_count / project.total_milestone_count) * 100
                                    : 0
                                    }%`,
                            }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.total_milestone_count > 0
                                ? Math.round(
                                    (project.completed_milestone_count / project.total_milestone_count) * 100
                                ) + "%"
                                : "0%"}
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.total_milestone_count}</div>
                </div>

                {/* Tasks */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Tasks</div>
                    <div className="w-4 text-center">{project.completed_task_management_count}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-green-500"
                            style={{
                                width: `${project.total_task_management_count > 0
                                    ? (project.completed_task_management_count / project.total_task_management_count) *
                                    100
                                    : 0
                                    }%`,
                            }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.total_task_management_count > 0
                                ? Math.round(
                                    (project.completed_task_management_count / project.total_task_management_count) * 100
                                ) + "%"
                                : "0%"}
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.total_task_management_count}</div>
                </div>

                {/* Issues */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Issues</div>
                    <div className="w-4 text-center">{project.completed_issues_count}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-red-500"
                            style={{
                                width: `${project.total_issues_count > 0
                                    ? (project.completed_issues_count / project.total_issues_count) * 100
                                    : 0
                                    }%`,
                            }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.total_issues_count > 0
                                ? Math.round((project.completed_issues_count / project.total_issues_count) * 100) + "%"
                                : "0%"}
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.total_issues_count}</div>
                </div>
            </div>


            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-between">
                <div className="text-gray-600 text-xs">Members</div>
                <div className="flex items-center">
                    {project.project_members.map((member, index) => {
                        if (!member.user) return null;
                        const id = member.user.id || member.user.firstname;
                        return (
                            <div
                                key={index}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 ${index !== 0 ? "-ml-2" : ""
                                    }`}
                                style={{ backgroundColor: memberColors[id] }}
                            >
                                {member.user.firstname ? member.user.firstname.charAt(0) : ""}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
