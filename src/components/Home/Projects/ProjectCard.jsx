import { useEffect, useMemo, useState } from "react";
import { Briefcase, CalendarDays, Timer, User2 } from "lucide-react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "PROJECT",
        item: { type: "PROJECT", id: project.id, fromStatus: project.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        if (!project?.end_date) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(project.end_date);
            const diff = end - now;

            if (diff <= 0) {
                setCountdown("Expired");
                clearInterval(interval);
            } else {
                setCountdown(formatCountdown(diff));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [project.end_date]);

    const memberColors = useMemo(() => {
        const colors = {};
        project.project_members.forEach((member) => {
            const id = member.user.id || member.user.firstname; // Use unique ID if available
            colors[id] = getRandomColor();
        });
        return colors;
    }, [project.project_members]);

    return (
        <div
            ref={dragRef}
            style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
            className="w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 rounded-sm"
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
                    <span className="text-[10px] truncate">{project.resource_type}</span>
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

            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-between">
                <div className="text-gray-600 text-xs">Members</div>
                <div className="flex items-center">
                    {project.project_members.map((member, index) => {
                        const id = member.user.id || member.user.firstname;
                        return (
                            <div
                                key={index}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 ${index !== 0 ? "-ml-2" : ""
                                    }`}
                                style={{ backgroundColor: memberColors[id] }}
                            >
                                {member.user.firstname.charAt(0)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
