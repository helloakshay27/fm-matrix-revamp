import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { taskSchema } from '../schemas/taskSchema.js'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import gsap from "gsap";

const AddTaskModal = ({ isModalOpen, setIsModalOpen }) => {
    const addTaskModalRef = useRef(null);

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            specialInitiative: false,
            project: "",
            taskTitle: "",
            description: "",
            assignTo: "",
            startDate: "",
            dueDate: "",
            priority: "low",
            tags: "",
            observer: "",
            attachments: null,
        }
    })

    useEffect(() => {
        if (!isModalOpen) {
            reset();
        }
    }, [isModalOpen, reset]);

    useGSAP(() => {
        gsap.fromTo(
            addTaskModalRef.current,
            {
                scale: 0,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
            }
        );
    }, [isModalOpen]);

    const onSubmit = (data) => {
        const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        const updatedTasks = [...existingTasks, data];

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        reset();
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 py-3">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-3/4 relative h-full"
            >
                <h3 className="text-lg font-medium text-center">New Task</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={() => {
                        setIsModalOpen(false);
                    }}
                />

                <hr className="border border-[#E95420] my-4" />

                <div id="addTask" className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto">
                    <form className="py-6 h-full mr-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex items-center gap-3 mt-6 mb-14">
                            <Controller
                                name="specialInitiative"
                                control={control}
                                render={({ field }) => (
                                    <input type="checkbox" {...field} className="w-5 h-5" />
                                )}
                            />
                            <label>Special Initiative</label>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Project <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register("project")}
                                type="text"
                                placeholder="Project Name"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                            {errors.project && <p className="text-red-500 text-sm">{errors.project.message}</p>}
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Task Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register("taskTitle")}
                                type="text"
                                placeholder="Enter Title"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                            {errors.taskTitle && <p className="text-red-500 text-sm">{errors.taskTitle.message}</p>}
                        </div>

                        <div className="flex items-start gap-6 mt-4">
                            <div className="w-1/2 space-y-2">
                                <label className="block ms-2">Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={11}
                                    placeholder="Enter Description"
                                    className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            <div className="w-1/2 flex flex-col justify-between gap-1">
                                <div className="space-y-2">
                                    <label className="block ms-2">
                                        Assign To <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("assignTo")}
                                        type="text"
                                        placeholder="Select Responsible Person"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                    {errors.assignTo && <p className="text-red-500 text-sm">{errors.assignTo.message}</p>}
                                </div>

                                <div className="space-y-2 mt-4">
                                    <label className="block ms-2">
                                        Start Date <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("startDate")}
                                        type="date"
                                        placeholder="Enter Start Date"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
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
                                        {...register("dueDate")}
                                        type="date"
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                    {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-5">
                            <div className="w-1/4 space-y-2">
                                <label className="block ms-2">
                                    Priority
                                </label>
                                <div className="relative">
                                    <Controller
                                        name="priority"
                                        control={control}
                                        render={({ field }) => (
                                            <select {...field} className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm appearance-none">
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        )}
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/4 space-y-2">
                                <label className="block ms-2">
                                    Tags
                                </label>
                                <input
                                    {...register("tags")}
                                    type="text"
                                    placeholder="Enter Tags"
                                    className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                />
                                {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Observer
                            </label>
                            <input
                                {...register("observer")}
                                type="text"
                                placeholder="Select Observer"
                                className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                            />
                            {errors.observer && <p className="text-red-500 text-sm">{errors.observer.message}</p>}
                        </div>

                        <div className="my-14 space-y-2">
                            <label className="block ms-2">
                                Attachments
                            </label>
                            <Controller
                                name="attachments"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        multiple
                                        {...field}
                                        className="w-full border outline-none border-gray-300 rounded-md py-3 px-4 text-sm"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button type="submit" className="flex items-center justify-center bg-[#E95420] text-white px-4 py-2 rounded-full w-52">
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;