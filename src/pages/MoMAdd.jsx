import { Plus } from "lucide-react";

const MoMAdd = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="font-medium m-4">New Minutes Of Meeting</h3>

            <hr className="border border-gray-200" />

            <div className="py-4 px-6 w-full">
                <div className="flex items-start gap-10 mb-6">
                    <div className="flex flex-col w-[40%] space-y-4">
                        <div className="space-y-2 w-full">
                            <label className="text-[12px]">Meeting Title</label>
                            <input
                                type="text"
                                className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                placeholder="Enter meeting Title"
                            />
                        </div>
                        <div className="flex icon-link justify-between gap-8">
                            <div className="space-y-2 w-full">
                                <label className="text-[12px]">Meeting Type</label>
                                <input
                                    type="text"
                                    className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                    placeholder="Meeting Type"
                                />
                            </div>
                            <div className="space-y-2 w-full">
                                <label className="text-[12px]">Meeting Mode</label>
                                <input
                                    type="text"
                                    className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                    placeholder="Meeting Mode"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px]">Meeting Date</label>
                        <input
                            type="date"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Meeting Mode"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px]">Meeting Time</label>
                        <input
                            type="time"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Meeting Mode"
                        />
                    </div>
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="flex items-end gap-5 mt-6">
                    <div className="flex items-center">
                        <span className="mr-2 text-[12px]">Internal</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" value="" />
                            <div className="group peer bg-black rounded-full duration-300 w-10 h-5 ring-2 ring-black after:duration-300 after:bg-white peer-checked:after:bg-white peer-checked:ring-black after:rounded-full after:absolute after:h-5 after:w-5 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-5 peer-hover:after:scale-95"></div>
                        </label>
                        <span className="ml-2 text-[12px]">External</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px]">External User</label>
                        <input
                            type="text"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Enter External User Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px]">Email ID</label>
                        <input
                            type="text"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Enter External User Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px]">Role</label>
                        <input
                            type="text"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Enter External User Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px]">Organization</label>
                        <input
                            type="text"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Enter External User Name"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-3 mb-6">
                    <button className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-32 bg-white border border-[#C72030]">
                        <Plus size={18} />{" "}
                        Add More
                    </button>
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="flex mt-6 justify-between gap-4">
                    <div className="space-y-2 w-1/2">
                        <label className="text-[12px]">Point 1</label>
                        <div className="flex items-center gap-4 w-full">
                            <textarea
                                rows={6}
                                type="text"
                                className="w-[70%] border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                placeholder="Enter description here"
                            />
                            <div className="flex items-center w-max gap-2">
                                <input type="checkbox" />
                                <label className="text-[12px]">Convert to task</label>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <label className="text-[12px]">Resigned by</label>
                            <input
                                type="text"
                                className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                placeholder="Select User"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px]">End Date</label>
                            <input
                                type="date"
                                className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                                placeholder="Select end date"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px]">Responsible Person</label>
                        <input
                            type="text"
                            className="w-full border outline-none border-gray-300  py-2 px-3 text-[12px] placeholder-shown:text-transparent"
                            placeholder="Select responsible person"
                        />
                    </div>
                </div>
                <button className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-40 bg-white border border-[#C72030] mt-4 mb-6">
                    <Plus size={18} />{" "}
                    Add New Point
                </button>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="my-6">
                    <h3 className="text-[14px]">No Documents Attached</h3>
                    <span className="text-[#C2C2C2] text-[12px]">Drop or attach relevant documents here</span>

                    <button className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-40 bg-white border border-[#C72030] mt-4 mb-6">
                        Attach Files
                    </button>
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="mt-6 flex justify-center">
                    <button className="text-[12px] flex items-center justify-center gap-2 text-white px-3 py-2 w-40 bg-red border">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoMAdd;
