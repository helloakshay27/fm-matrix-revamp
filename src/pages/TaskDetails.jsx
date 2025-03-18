import { ChevronDown, ChevronDownCircle, LucideShoppingBag, MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"

const TaskDetails = () => {
    return (
        <div className="m-4">
            <Link to=''>Task Management</Link> {">"} <span className="text-[#E95420]">Task Details</span>

            <div className="p-7">
                <h2 className="text-[30px]"><span className="text-[#006BA4]">#XXXX</span> Design Task Management Web Screens</h2>

                <div className="flex items-center justify-between my-3">
                    <div className="flex items-center gap-3 divide-x divide-gray-400 text-[#323232]">
                        <span>By Kshitij Rasal</span>
                        <span className="pl-3 flex items-center gap-3"> <LucideShoppingBag color="#E95420" size={18} />Internal Products</span>
                        <span className="pl-3 flex items-center gap-3 cursor-pointer">Open <ChevronDown /></span>
                    </div>
                    <MoreHorizontal color="#E95420" className="cursor-pointer" />
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div className="font-[600] text-[16px] flex items-center gap-4">
                        <ChevronDownCircle color="#E95420" size={30} /> Description
                    </div>
                    <p className="ms-12 mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit explicabo ad facilis ratione consectetur repellat laboriosam, velit est, nesciunt officia earum aperiam dolorum, error illo assumenda dolore iure pariatur vel molestias nostrum eum quaerat eaque corporis? Aut minus fugit fugiat eveniet, cumque non, esse asperiores eos iure ipsa reiciendis nobis?</p>
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div className="font-[600] text-[16px] flex items-center gap-4">
                        <ChevronDownCircle color="#E95420" size={30} /> Task Information
                    </div>

                    <div className="mt-3 w-2/3">
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Priority :
                                </div>
                                <div className="text-left text-[14px]">
                                    High
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right">
                                    Observers :
                                </div>
                                <div className="text-left flex items-center gap-1">
                                    <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                        AK
                                    </span>
                                    <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                        AK
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskDetails