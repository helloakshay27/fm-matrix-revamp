import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

const AddSprintModal = ({ isModalOpen, setIsModalOpen }) => {
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

        reset();
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
            >
                <h3 className="text-lg font-medium text-center">New Sprint</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={closeModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <form className="pt-6 pb-12 h-full">
                    <div
                        id="addTask"
                        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
                    >

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Project
                            </label>
                            <input
                                type="text"
                                placeholder="Latest VI my workspace app Playstore and app store"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Sprint Title <span>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Internal Product Implementation_Sprint 1"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>

                        <div className="flex items-start gap-4 mt-4">
                            <div className="w-1/2 space-y-2">
                                <label className="block ms-2">Duration<span>*</span></label>
                                <select className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm">
                                    <option value="">Select Duration</option>
                                    <option value="owner1">Owner 1</option>
                                    <option value="owner2">Owner 2</option>
                                    <option value="owner3">Owner 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mt-4">
                            <div className="w-1/2 space-y-2">
                                <label className="block ms-2">Project Start Date<span className="text-red-600">*</span></label>
                                <input type="date" className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm" />
                            </div>

                            <div className="w-1/2 space-y-2">
                                <label className="block ms-2">Project End Date</label>
                                <input type="date" className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm" />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Sprint Goal
                            </label>
                            <input
                                type="text"
                                placeholder="CK Editor Add"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 fixed w-full bottom-0 py-3 bg-white border">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center border border-[#E95420] px-4 py-2 rounded-full w-52"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSprintModal