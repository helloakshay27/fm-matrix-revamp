import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjectTasksById } from "@/store/slices/projectTasksSlice";
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertTriangle, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const STATUS_COLORS = {
    "open": { bg: "bg-red-100", text: "text-red-800", label: "Open" },
    "in_progress": { bg: "bg-blue-100", text: "text-blue-800", label: "In Progress" },
    "on_hold": { bg: "bg-yellow-100", text: "text-yellow-800", label: "On Hold" },
    "overdue": { bg: "bg-orange-100", text: "text-orange-800", label: "Overdue" },
    "completed": { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
};

const PRIORITY_COLORS = {
    "High": { bg: "bg-red-100", text: "text-red-800" },
    "Medium": { bg: "bg-yellow-100", text: "text-yellow-800" },
    "Low": { bg: "bg-green-100", text: "text-green-800" },
};

const ProjectTaskDetailsPage = () => {
    const { tid } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [task, setTask] = useState({
        id: "",
        title: "",
        description: "",
        status: "open",
        priority: "Medium",
        responsible_person_id: "",
        responsible_person_name: "",
        expected_start_date: "",
        target_date: "",
        allocation_date: "",
        estimated_hour: 0,
        project_title: "",
        milestone_title: "",
        observers: [],
        task_tags: [],
    });

    useEffect(() => {
        const getTaskDetails = async () => {
            try {
                const response = await dispatch(fetchProjectTasksById({ baseUrl, token, id: tid })).unwrap();
                setTask(response);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch task details");
            }
        };

        if (tid) {
            getTaskDetails();
        }
    }, [tid, dispatch, baseUrl, token]);

    function formatToDDMMYYYY(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const statusInfo = STATUS_COLORS[task.status?.toLowerCase()] || STATUS_COLORS["open"];
    const priorityInfo = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS["Medium"];

    return (
        <div className="p-6 mx-auto">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Task-{task.id}</h1>
                    <p className="text-gray-600 mt-1">{task.title}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Edit functionality coming soon")}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Delete functionality coming soon")}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${statusInfo.bg} ${statusInfo.text}`}>
                                {statusInfo.label}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Current Status</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={`px-3 py-1 text-sm rounded-md font-medium w-max cursor-pointer ${priorityInfo.bg} ${priorityInfo.text}`}>
                                {task.priority}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Priority Level</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="space-y-6">
                {/* Task Overview Card */}
                <Card className="shadow-sm border border-border">
                    <div className="flex items-center gap-3 p-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Task Overview</h3>
                    </div>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Task ID</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.id || "-"}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Task Title</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.title || "-"}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Project</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.project_title || "-"}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Milestone</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.milestone_title || "-"}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Responsible Person</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.responsible_person_name || "-"}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Priority</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className={`font-medium px-2 py-1 rounded text-sm ${priorityInfo.bg} ${priorityInfo.text}`}>{task.priority || "-"}</span>
                            </div>
                        </div>
                        {task.description && (
                            <>
                                <div className="border-t border-border mt-4 pt-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Description</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{task.description}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Timeline Card */}
                <Card className="shadow-sm border border-border">
                    <div className="flex items-center gap-3 p-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <Clock className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Timeline & Duration</h3>
                    </div>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Start Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{formatToDDMMYYYY(task.expected_start_date)}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Target Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{formatToDDMMYYYY(task.target_date)}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Allocation Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{formatToDDMMYYYY(task.allocation_date)}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Estimated Hours</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.estimated_hour || 0} hours</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Observers Card */}
                {task.observers && task.observers.length > 0 && (
                    <Card className="shadow-sm border border-border">
                        <div className="flex items-center gap-3 p-6">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <Users className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Observers</h3>
                        </div>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {task.observers.map((observer, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Observer {index + 1}</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">{observer?.user_name || "Unknown"}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tags Card */}
                {task.task_tags && task.task_tags.length > 0 && (
                    <Card className="shadow-sm border border-border">
                        <div className="flex items-center gap-3 p-6">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <Tag className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Tags</h3>
                        </div>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {task.task_tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-[13px] rounded-full"
                                    >
                                        {tag?.company_tag?.name || tag.name || "Unknown"}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectTaskDetailsPage;
