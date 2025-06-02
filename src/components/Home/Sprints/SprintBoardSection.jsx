/* eslint-disable react/jsx-key */
import Boards from "../Boards";
import ProjectCard from "../Projects/ProjectCard";
import { sprintTitle } from "../../../data/Data";
import { CalendarDays, GripHorizontal, Play, Timer, User } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useDeepCompareEffect from "use-deep-compare-effect";
import { changeProjectStatus, fetchProjects } from "../../../redux/slices/projectSlice";
import { fetchSpirints } from "../../../redux/slices/spirintSlice";

const SprintBoardSection = ({ selectedProject }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
    const sprintState = useSelector((state) => state.fetchSpirints?.fetchSpirints || []);
    const [projects, setProjects] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [countdown, setCountdown] = useState("00d:00h:00m:00s");

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchSpirints());
    }, [dispatch]);

    useEffect(() => {
        if (id && sprintState.length) {
            const sprint = sprintState.find((s) => {
                const sprintId = s.id != null ? String(s.id) : '';
                return sprintId === id;
            });
            setSelectedSprint(sprint || null);
        } else {
            setSelectedSprint(null);
        }
    }, [id, sprintState]);

    const calculateCountdown = useCallback(() => {
        if (!selectedSprint?.end_date) {
            setCountdown("00d:00h:00m:00s");
            return;
        }

        const endDate = new Date(selectedSprint.end_date);
        const now = new Date();
        const timeDiff = endDate - now;

        if (timeDiff <= 0) {
            setCountdown("00d:00h:00m:00s");
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setCountdown(
            `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`
        );
    }, [selectedSprint]);

    useEffect(() => {
        calculateCountdown();
        const interval = setInterval(() => {
            calculateCountdown();
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateCountdown]);

    useDeepCompareEffect(() => {
        if (selectedProject === "Kalpataru customer app : Post sales") {
            setProjects([]);
        } else if (selectedProject === "Project Management Revamp") {
            setProjects(projectState);
        } else {
            setProjects(projectState);
        }
    }, [projectState, selectedProject]);

    const handleProjectStatusChange = useCallback(
        async ({ id, status }) => {
            const actualProjectId = id.replace("P-", "");
            const apiCompatibleValue = status.toLowerCase().replace(/\s+/g, "_");
            try {
                await dispatch(
                    changeProjectStatus({
                        id: actualProjectId,
                        payload: { status: apiCompatibleValue },
                    })
                ).unwrap();
                dispatch(fetchProjects());
            } catch (err) {
                console.error(`Failed to update project status for ID ${actualProjectId}:`, err);
            }
        },
        [dispatch]
    );

    const handleDrop = useCallback(
        (item, newStatus) => {
            const { type, id } = item;
            if (type === "PROJECT") {
                const apiStatus = newStatus === "open" ? "active" : newStatus;
                handleProjectStatusChange({ id, status: apiStatus });
            }
        },
        [handleProjectStatusChange]
    );

    const getColor = (index) => {
        const colors = ["#F9C863", "#B4EB77", "#B7E0D4", "#B3B3FF", "#D1A1FF", "#D9B1FF", "#FF9FBF"];
        return colors[index % colors.length];
    };

    const contributors = selectedSprint?.contributors || ["S", "A", "B", "M", "K", "D", "CB"];



    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {/* Active section */}
            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar" style={{ minWidth: "300px" }}>
                <div className="bg-[#DEE6E8] rounded-md px-3 py-4 flex flex-col gap-5 h-full">
                    <div className="w-full relative">
                        <h3
                            className="text-white py-2 px-4 rounded-md text-xs absolute top-0 left-0 z-10"
                            style={{ backgroundColor: "#88D760" }}
                        >
                            Active
                        </h3>
                        <div className="absolute top-2 right-2">
                            <Play size={15} fill="#000" className="cursor-pointer" />
                        </div>
                    </div>

                    {selectedSprint ? (
                        <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                            <div className="flex justify-center items-center">
                                <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                            </div>
                            <p>
                                <span className="text-[#62bbec] font-medium">
                                    S-{selectedSprint.id}
                                </span>{" "}
                                {selectedSprint.name}
                            </p>
                            <div className="flex items-center gap-2 text-[#B00020]">
                                <CalendarDays size={14} />
                                <span className="text-black">
                                    {selectedSprint.start_date} to {selectedSprint.end_date}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#D32F2F]">
                                <User size={14} />
                                <span className="text-black">Rahul</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#029464]">
                                <Timer size={14} />
                                <span className="text-[11px]">
                                    {countdown}
                                </span>
                            </div>
                            <div className="border-t border-gray-300 my-4"></div>
                            <div className="flex justify-between items-center">
                                <p className="text-[xs] mb-1">Contributors</p>
                                <div className="flex -space-x-2">
                                    {contributors.map((char, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                                            style={{ backgroundColor: getColor(i) }}
                                        >
                                            {char}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                            <div className="flex justify-center items-center">
                                <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                            </div>
                            <p>
                                <span className="text-[#62bbec] font-medium">No Sprint Selected</span>
                            </p>
                            <div className="border-t border-gray-300 my-4"></div>
                            <div className="flex justify-between items-center">
                                <p className="text-[xs] mb-1">Contributors</p>
                                <div className="flex -space-x-2">
                                    {["S", "A", "B", "M", "K", "D", "CB"].map((char, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                                            style={{ backgroundColor: getColor(i) }}
                                        >
                                            {char}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full h-full rounded-md bg-white flex items-center justify-center text-center px-8 text-gray-400 text-sm">
                        Drag from respective statuses
                        <br />
                        and drop your projects here.
                    </div>
                </div>
            </div>

            {sprintTitle.map((sprint) => {
                const filteredProjects = projects.filter((project) => {
                    const sprintStatus = sprint.title.toLowerCase().replace(" ", "_");
                    return sprintStatus === "open" ? project.status === "active" : project.status === sprintStatus;
                });

                return (
                    <Boards
                        key={sprint.id}
                        add={sprint.add}
                        color={sprint.color}
                        count={filteredProjects.length}
                        title={sprint.title}
                        className="flex items-start justify-start"
                        onDrop={handleDrop}
                    >
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    id={`project-${project.id}`}
                                    className="relative w-full"
                                >
                                    <ProjectCard project={project} />
                                </div>
                            ))
                        ) : (
                            <img src="/draganddrop.svg" alt="svg" className="w-full" />
                        )}
                    </Boards>
                );
            })}
        </div>
    );
};

export default SprintBoardSection;