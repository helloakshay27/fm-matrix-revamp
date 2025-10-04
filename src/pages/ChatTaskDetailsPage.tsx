import { ArrowLeft, CircleCheckBig } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ChatTaskDetailsPage = () => {
    const navigate = useNavigate()
    return (
        <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
                    Task Details
                </h1>
            </div>
            <div className="">
                <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <CircleCheckBig className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">TASK DETAILS</h3>
                    </div>
                    <div
                        className="grid grid-cols-3 gap-8 px-3"
                    >
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Task ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                123
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Create By</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title="Abhishek Kumar">
                                Abhishek Sharma
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Create On</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title="Abhishek Kumar">
                                12-12-2023
                            </span>
                        </div>

                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Responsible Person</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                Abhishek Kumar
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Priority</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                High
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Deadline</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                12-12-2023
                            </span>
                        </div>

                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Observer</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                Abhishek Sharma, Abhishek Kumar
                            </span>
                        </div>

                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Description</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt perferendis sint molestiae ullam delectus veritatis dolores in ut totam commodi ipsum iste, nemo dolor deleniti.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatTaskDetailsPage