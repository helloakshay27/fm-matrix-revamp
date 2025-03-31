import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

const AddTaskModal = ({ isModalOpen, setIsModalOpen }) => {
    const addTaskModalRef = useRef(null);

    useEffect(() => {
        if (!isModalOpen) {
        }
    }, [isModalOpen]);

    useGSAP(() => {
        if (isModalOpen) {
            gsap.fromTo(
                addTaskModalRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            );
        }
    }, [isModalOpen]);

    const closeModal = () => {
        gsap.to(addTaskModalRef.current, {
            x: "100%",
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => setIsModalOpen(false),
        });
    };

    const onSubmit = (data) => {
        const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        const updatedTasks = [...existingTasks, data];

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
            >
                <h3 className="text-lg font-medium text-center">New Task</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={closeModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <form className="py-6 h-full">
                    <div
                        id="addTask"
                        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
                    >
                        <div className="flex items-center gap-3 mt-6 mb-14">
                            <input type="checkbox" className="w-5 h-5" />
                            <label>Special Initiative</label>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Project <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Project Name"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Task Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="flex items-start gap-6 mt-4">
                            <div className="w-1/2 space-y-2">
                                <label className="block ms-2">Description</label>
                                <textarea
                                    rows={11}
                                    placeholder="Enter Description"
                                    className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                />
                            </div>

                            <div className="w-1/2 flex flex-col justify-between gap-1">
                                <div className="space-y-2">
                                    <label className="block ms-2">
                                        Assign To <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Select Responsible Person"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                </div>

                                <div className="space-y-2 mt-4">
                                    <label className="block ms-2">
                                        Start Date <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter Start Date"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block ms-2">
                                            Due Date <span className="text-red-600">*</span>
                                        </label>
                                        <label className="block ms-2 text-[#E95420] text-sm mr-1">
                                            Enter Duration
                                        </label>
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-5">
                            <div className="w-1/4 space-y-2">
                                <label className="block ms-2">Priority</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/4 space-y-2">
                                <label className="block ms-2">Tags</label>
                                <input
                                    type="text"
                                    placeholder="Enter Tags"
                                    className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">Observer</label>
                            <input
                                type="text"
                                placeholder="Select Observer"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="my-14 space-y-2">
                            <label className="block ms-2">Attachments</label>
                            <input
                                type="file"
                                multiple
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 fixed w-full bottom-0 py-3 bg-white border">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
