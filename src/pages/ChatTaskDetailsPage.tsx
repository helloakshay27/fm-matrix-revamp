// import { ArrowLeft, Pencil, Trash2, ChevronDown } from "lucide-react"
// import { useNavigate, useParams } from "react-router-dom"
// import { useEffect, useState } from "react"
// import { toast } from "sonner";
// import { useAppDispatch } from "@/store/hooks";
// import { fetchChannelTaskDetails, updateChatTask } from "@/store/slices/channelSlice";
// import { format } from "date-fns";

// const ChatTaskDetailsPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate()
//     const dispatch = useAppDispatch();
//     const token = localStorage.getItem("token");
//     const baseUrl = localStorage.getItem("baseUrl");

//     const [status, setStatus] = useState("Open")
//     const [task, setTask] = useState({
//         id: "",
//         title: "",
//         created_by: { name: "" },
//         created_at: "",
//         description: "",
//         responsible_person: { name: "" },
//         priority: "",
//         expected_start_date: "",
//         target_date: "",
//         observers: [],
//         status: ""
//     })

//     const fetchData = async () => {
//         try {
//             const response = await dispatch(fetchChannelTaskDetails({ baseUrl, token, id })).unwrap();
//             setTask(response);
//             setStatus(response.status || "Open");
//         } catch (error) {
//             console.log(error)
//             toast.error(error)
//         }
//     }

//     const handleStatusChange = async (newStatus) => {
//         try {
//             setStatus(newStatus);
//             await dispatch(updateChatTask({ baseUrl, token, id, data: { status: newStatus } })).unwrap();
//             toast.success("Task status updated successfully");
//             fetchData();
//         } catch (error) {
//             toast.error(error || "Failed to update status");
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [id]);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-1 hover:text-gray-800 transition-colors"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                     <span>Back</span>
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//                 <div className="flex items-center justify-between">
//                     <h1 className="text-2xl font-semibold text-gray-900">
//                         T-{task?.id} {task?.title}
//                     </h1>
//                     <div className="flex items-center gap-3">
//                         <div className="relative">
//                             <select
//                                 value={status}
//                                 onChange={(e) => handleStatusChange(e.target.value)}
//                                 className="appearance-none bg-[#C72030] text-white px-6 py-2 pr-10 rounded-lg font-medium cursor-pointer hover:bg-[#a01828] transition-colors focus:outline-none"
//                             >
//                                 <option value="open">Open</option>
//                                 <option value="in_progress">In Progress</option>
//                                 <option value="on_hold">On Hold</option>
//                                 <option value="overdue">Overdue</option>
//                                 <option value="completed">Completed</option>
//                             </select>
//                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
//                         </div>
//                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                             <Pencil className="w-4 h-4" />
//                             <span className="font-medium">Edit Task</span>
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                             <Trash2 className="w-4 h-4" />
//                             <span className="font-medium">Delete Task</span>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
//                     <div className="flex items-center gap-2">
//                         <span>Created By:</span>
//                         <span className="text-gray-900 font-medium">{task?.created_by?.name}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <span>Created On:</span>
//                         <span className="text-gray-900 font-medium">
//                             {task?.created_at && format(task?.created_at, "dd/MM/yyyy hh:mm a")}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Description Section */}
//             <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//                 <div className="flex items-center gap-3 mb-4">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#C72030]">
//                         <div className="w-2 h-2 rounded-full bg-[#C72030]"></div>
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900">Description</h2>
//                 </div>
//                 <p className="text-gray-700 ml-13 pl-1">
//                     {task?.description}
//                 </p>
//             </div>

//             {/* Details Section */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#C72030]">
//                         <div className="w-2 h-2 rounded-full bg-[#C72030]"></div>
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900">Details</h2>
//                 </div>

//                 <div className="space-y-6 ml-13 pl-1">
//                     {/* Row 1 */}
//                     <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">Responsible Person:</span>
//                             <span className="text-gray-900">{task?.responsible_person?.name}</span>
//                         </div>
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">Priority:</span>
//                             <span className="text-gray-900">{task?.priority}</span>
//                         </div>
//                     </div>

//                     {/* Row 2 */}
//                     <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">Start Date:</span>
//                             <span className="text-gray-900">{task?.expected_start_date && format(task?.expected_start_date, "dd/MM/yyyy")}</span>
//                         </div>
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">Observer:</span>
//                             {
//                                 task?.observers && task?.observers.map((observer, index) => (
//                                     <span key={index} className="px-3 py-1 border-2 border-[#C72030] text-[#C72030] rounded-full text-sm font-medium">
//                                         {observer.user_name}
//                                     </span>
//                                 ))
//                             }
//                         </div>
//                     </div>

//                     {/* Row 3 */}
//                     <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">End Date:</span>
//                             <span className="text-gray-900">{task?.target_date && format(task?.target_date, "dd/MM/yyyy")}</span>
//                         </div>
//                         <div className="flex items-start">
//                             <span className="text-gray-600 min-w-[180px] font-medium">Duration:</span>
//                             <span className="text-green-600 font-medium">0s</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatTaskDetailsPage





import { ArrowLeft, Pencil, Trash2, ChevronDown } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { deleteChatTask, fetchChannelTaskDetails, updateChatTask } from "@/store/slices/channelSlice";
import { format } from "date-fns";
import CreateChatTask from "@/components/CreateChatTask";

const ChatTaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        T-{task?.id} {task?.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="appearance-none bg-[#C72030] text-white px-6 py-2 pr-10 rounded-lg font-medium cursor-pointer hover:bg-[#a01828] transition-colors focus:outline-none"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="on_hold">On Hold</option>
                                <option value="overdue">Overdue</option>
                                <option value="completed">Completed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </div>
                        <button
                            onClick={() => setOpenEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="font-medium">Edit Task</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={handleDeleteTask}>
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete Task</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
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
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#C72030]">
                        <div className="w-2 h-2 rounded-full bg-[#C72030]"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                </div>
                <p className="text-gray-700 ml-13 pl-1">
                    {task?.description}
                </p>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#C72030]">
                        <div className="w-2 h-2 rounded-full bg-[#C72030]"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Details</h2>
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
                            <span className="text-green-600 font-medium">0s</span>
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