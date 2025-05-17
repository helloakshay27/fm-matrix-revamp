import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

const TaskFilterModal = ({ isModalOpen, setIsModalOpen }) => {
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
                className="bg-white py-6 rounded-lg shadow-lg w-1/4 relative h-full right-0"
            >
                <h3 className="text-lg font-medium text-center">Filter Task</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={closeModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <form className="py-6 h-full">
                    <div
                        id="addTask"
                        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3 pb-12"
                    >
                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Type
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Type</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Project
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Assign To
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Assigned By
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Product Tags
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Client Tags
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Observers
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none"
                                >
                                    <option value="">Select Project</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                    ▼
                                </div>
                            </div>
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
    )
}

export default TaskFilterModal