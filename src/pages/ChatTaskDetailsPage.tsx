import { ArrowLeft, Pencil, Trash2, ChevronDown, NotepadText } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { deleteChatTask, fetchChannelTaskDetails, updateChatTask } from "@/store/slices/channelSlice";
import { format } from "date-fns";
import CreateChatTask from "@/components/CreateChatTask";
import { Button } from "@/components/ui/button";

const ChatTaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [countdown, setCountdown] = useState("00:00:00:00");
    const [status, setStatus] = useState("Open")
    const [openEditModal, setOpenEditModal] = useState(false)
    const [task, setTask] = useState({
        id: "",
        title: "",
        created_by: { name: "" },
        created_at: "",
        description: "",
        responsible_person: { name: "", id: "" },
        priority: "",
        expected_start_date: "",
        target_date: "",
        estimated_hours: "",
        estimated_min: "",
        observers: [],
        status: "",
        focus_mode: false
    })

    useEffect(() => {
        if (!task?.target_date) return;

        const updateCountdown = () => {
            const targetTime = new Date(task.target_date as string);
            targetTime.setHours(23, 59, 59, 999);

            const now = new Date();
            const diff = targetTime.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown("00:00:00:00");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        };

        updateCountdown(); // run immediately
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [task?.target_date]);

    const fetchData = async () => {
        try {
            const response = await dispatch(fetchChannelTaskDetails({ baseUrl, token, id })).unwrap();
            setTask(response);
            setStatus(response.status || "Open");
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    const handleStatusChange = async (newStatus) => {
        try {
            setStatus(newStatus);
            await dispatch(updateChatTask({ baseUrl, token, id, data: { status: newStatus } })).unwrap();
            toast.success("Task status updated successfully");
            fetchData();
        } catch (error) {
            toast.error(error || "Failed to update status");
        }
    };

    const handleEditTask = async (data) => {
        try {
            await dispatch(updateChatTask({ baseUrl, token, id, data: data.task_management })).unwrap();
            toast.success("Task updated successfully");
            fetchData();
        } catch (error) {
            toast.error(error || "Failed to update task");
        }
    };

    const handleDeleteTask = async () => {
        try {
            await dispatch(deleteChatTask({ baseUrl, token, id })).unwrap();
            toast.success("Task deleted successfully");
            navigate(-1);
        } catch (error) {
            toast.error(error || "Failed to delete task");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">
                        T-{task?.id} {task?.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="appearance-none bg-[#F2EEE9] text-[#C72030] px-6 py-[6px] pr-10 rounded-lg font-medium cursor-pointer transition-colors focus:outline-none"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="on_hold">On Hold</option>
                                <option value="overdue">Overdue</option>
                                <option value="completed">Completed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C72030] pointer-events-none" />
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 bg-purple-600 text-white"
                            onClick={() => setOpenEditModal(true)}
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="font-medium">Edit Task</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 bg-purple-600 text-white"
                            onClick={handleDeleteTask}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete Task</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span>Created By:</span>
                        <span className="text-gray-900 font-medium">{task?.created_by?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Created On:</span>
                        <span className="text-gray-900 font-medium">
                            {task?.created_at && format(task?.created_at, "dd/MM/yyyy hh:mm a")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white shadow-sm border-2 p-6 mb-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <NotepadText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">DESCRIPTION</h3>
                </div>
                <p className="text-gray-700 ml-13 pl-1">
                    {task?.description}
                </p>
            </div>

            {/* Details Section */}
            <div className="bg-white shadow-sm border-2 p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <NotepadText className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">DETAILS</h3>
                </div>

                <div className="space-y-6 ml-13 pl-1">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Responsible Person:</span>
                            <span className="text-gray-900">{task?.responsible_person?.name}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Priority:</span>
                            <span className="text-gray-900">{task?.priority}</span>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Start Date:</span>
                            <span className="text-gray-900">{task?.expected_start_date && format(task?.expected_start_date, "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Observer:</span>
                            {
                                task?.observers && task?.observers.map((observer, index) => (
                                    <span key={index} className="px-3 py-1 border-2 border-[#C72030] text-[#C72030] rounded-full text-sm font-medium">
                                        {observer.user_name}
                                    </span>
                                ))
                            }
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">End Date:</span>
                            <span className="text-gray-900">{task?.target_date && format(task?.target_date, "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Duration:</span>
                            <span
                                className={`font-medium ${countdown === "00:00:00:00" ? "text-red-600" : "text-green-600"
                                    }`}
                            >
                                {countdown}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <CreateChatTask
                openTaskModal={openEditModal}
                setOpenTaskModal={setOpenEditModal}
                onCreateTask={handleEditTask}
                fetchTasks={fetchData}
                editMode={true}
                existingTask={task}
            />
        </div>
    )
}

export default ChatTaskDetailsPage