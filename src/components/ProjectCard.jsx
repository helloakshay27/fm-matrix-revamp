import { Briefcase, CalendarDays, Timer, User2 } from "lucide-react"

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const ProjectCard = ({ project }) => {
    return (
        <div className="w-full h-max bg-white p-2 shadow-xl text-sm flex flex-col space-y-3 mb-2 rounded-sm">
            <p className="mb-4">
                <span className="text-blue-500">{project.id}</span> {project.title}
            </p>

            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <Timer className="text-[#029464]" size={15} />{" "}
                    <span className="text-[11px] text-[#029464]">{project.duration.days} d : {project.duration.hours} h : {project.duration.minutes} m</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="text-[#C72030]" size={15} />{" "}
                    <span className="text-[11px]">{project.client}</span>
                </div>
                <div className="flex items-start gap-2">
                    <User2 className="text-[#C72030]" size={15} />{" "}
                    <span className="text-[11px]">{project.manager}</span>
                </div>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030]" size={15} />{" "}
                        <span className="text-[11px]">{project.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030]" size={15} />{" "}
                        <span className="text-[11px]">{project.endDate}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                {/* Milestones */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Milestone</div>
                    <div className="w-4 text-center">{project.milestones.completed}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-blue-500"
                            style={{ width: `${project.milestones.progress}%` }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.milestones.progress}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.milestones.total}</div>
                </div>

                {/* Tasks */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Tasks</div>
                    <div className="w-4 text-center">{project.tasks.completed}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-green-500"
                            style={{ width: `${project.tasks.progress}%` }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.tasks.progress}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.tasks.total}</div>
                </div>

                {/* Issues */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Issues</div>
                    <div className="w-4 text-center">{project.issues.resolved}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-red-500"
                            style={{ width: `${project.issues.progress}%` }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.issues.progress}%
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.issues.total}</div>
                </div>
            </div>


            <hr className="border border-gray-200" />

            <div className="flex items-center justify-between">
                <div className="text-gray-600 text-sm">Members</div>
                <div className="flex items-center">
                    {project.members.map((member, index) => (
                        <div
                            key={member.initials}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-800 ${index !== 0 ? "-ml-3" : ""
                                }`}
                            style={{ backgroundColor: getRandomColor() }}
                        >
                            {member.initials}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard