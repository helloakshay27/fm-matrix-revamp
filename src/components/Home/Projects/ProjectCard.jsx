import { Briefcase, CalendarDays, Timer, User2 } from "lucide-react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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
                        {/* {project.duration}d : {project.duration}h :{" "}
                        {project.duration}m */}
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

            {/* <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-16 font-light text-gray-600 shrink-0">
                        Milestone
                    </div>
                    <div className="w-4 text-center">{project?.milestones || 2}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-3">
                        <div
                            className="absolute top-0 left-0 h-3 rounded-full bg-blue-500"
                            style={{ width: `${project?.milestones || 50}%` }}
                        ></div>
                        <div className="absolute w-full text-[8px] text-center text-black font-medium">
                            {project?.milestones || 50}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project?.milestones || 4}</div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-16 font-light text-gray-600 shrink-0">Tasks</div>
                    <div className="w-4 text-center">{project?.tasks}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-3">
                        <div
                            className="absolute top-0 left-0 h-3 rounded-full bg-green-500"
                            style={{ width: `${project?.tasks}%` }}
                        ></div>
                        <div className="absolute w-full text-[8px] text-center text-black font-medium">
                            {project?.tasks}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project?.tasks}</div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-16 font-light text-gray-600 shrink-0">Issues</div>
                    <div className="w-4 text-center">{project?.issues}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-3">
                        <div
                            className="absolute top-0 left-0 h-3 rounded-full bg-red-500"
                            style={{ width: `${project?.issues}%` }}
                        ></div>
                        <div className="absolute w-full text-[8px] text-center text-black font-medium">
                            {project?.issues}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project?.issues}</div>
                </div>
            </div> */}

            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-between">
                <div className="text-gray-600 text-xs">Members</div>
                <div className="flex items-center">
                    {/* {project.project_members.map((member, index) => (
                        <div
                            key={index}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 ${index !== 0 ? "-ml-2" : ""
                                }`}
                            style={{ backgroundColor: getRandomColor() }}
                        >
                            {member.user.firstdemo.charAt(0)}
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
