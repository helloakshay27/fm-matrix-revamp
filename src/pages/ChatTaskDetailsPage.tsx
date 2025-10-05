import { ArrowLeft, Pencil, Trash2, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const ChatTaskDetailsPage = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState("Active")

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

            {/* Task Title and Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        T-0484 Asset List Page
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="appearance-none bg-[#C72030] text-white px-6 py-2 pr-10 rounded-lg font-medium cursor-pointer hover:bg-[#a01828] transition-colors focus:outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Pencil className="w-4 h-4" />
                            <span className="font-medium">Edit Task</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete Task</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span>Created By:</span>
                        <span className="text-gray-900 font-medium">Sadanand Gupta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Created On:</span>
                        <span className="text-gray-900 font-medium">20/09/2025 01:43 PM</span>
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
                    This is test task
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
                            <span className="text-gray-900">Tejas Chaudhari</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Priority:</span>
                            <span className="text-gray-900">Medium</span>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Start Date:</span>
                            <span className="text-gray-900">2025-09-20</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Observer:</span>
                            <span className="px-3 py-1 border-2 border-[#C72030] text-[#C72030] rounded-full text-sm font-medium">
                                Vinayak Mane
                            </span>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-gray-200">
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">End Date:</span>
                            <span className="text-gray-900">2025-09-22</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-600 min-w-[180px] font-medium">Duration:</span>
                            <span className="text-green-600 font-medium">0s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatTaskDetailsPage