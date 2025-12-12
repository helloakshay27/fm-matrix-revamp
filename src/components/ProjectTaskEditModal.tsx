import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { CalendarIcon, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import { fetchProjectById, removeTagFromProject, removeUserFromProject } from "@/store/slices/projectManagementSlice";
import { fetchMilestoneById } from "@/store/slices/projectMilestoneSlice";
import { editProjectTask, fetchProjectTasksById, fetchTargetDateTasks, fetchUserAvailability } from "@/store/slices/projectTasksSlice";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DurationPicker } from "./DurationPicker";
import { CustomCalender } from "./CustomCalender";
import { TaskDatePicker } from "./TaskDatePicker";
import TasksOfDate from "./TasksOfDate";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import MuiMultiSelect from "./MuiMultiSelect";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const ProjectTaskEditModal = ({ taskId, onCloseModal }) => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const dispatch = useAppDispatch();

    const { data: task } = useAppSelector((state) => state.fetchProjectTasksById);
    const { data: project } = useAppSelector((state) => state.fetchProjectById);
    const { data: milestone } = useAppSelector((state) => state.fetchMilestoneById);
    const { loading: editLoading } = useAppSelector((state) => state.editProjectTask);
    const { data: userAvailabilityData } = useAppSelector((state) => state.fetchUserAvailability);

    const userAvailability = useMemo(
        () => (Array.isArray(userAvailabilityData) ? userAvailabilityData : []),
        [userAvailabilityData]
    );

    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [taskDuration, setTaskDuration] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const [dateWiseHours, setDateWiseHours] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [shift, setShift] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [startDateTasks, setStartDateTasks] = useState([]);
    const [targetDateTasks, setTargetDateTasks] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [showStartCalender, setShowStartCalender] = useState(false);
    const [calendarTaskHours, setCalendarTaskHours] = useState([]);

    const [formData, setFormData] = useState({
        taskTitle: "",
        description: "",
        responsiblePerson: "",
        responsiblePersonName: "",
        priority: "",
        observer: [],
        tags: [],
    });

    const [prevTags, setPrevTags] = useState([]);
    const [prevObservers, setPrevObservers] = useState([]);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const getTags = useCallback(async () => {
        try {
            const response = await dispatch(fetchProjectsTags({ baseUrl, token })).unwrap();
            setTags(response);
        } catch (error) {
            console.error(error);
        }
    }, [baseUrl, dispatch, token]);

    const getUsers = useCallback(async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            const validUsers = (response.users || []).filter((user: { id?: string | number }) => user && user.id);
            setUsers(validUsers);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        }
    }, [dispatch]);

    const fetchShifts = useCallback(async (id: string | number) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/user_shifts.json?user_id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShift(response.data.user_shifts);
        } catch (error) {
            console.error(error);
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (taskId) {
            dispatch(fetchProjectTasksById({ baseUrl, token, id: taskId }));
        }
        getUsers();
        getTags();
    }, [taskId, baseUrl, token, dispatch, getUsers, getTags]);

    useEffect(() => {
        if (Array.isArray(userAvailability) && userAvailability.length > 0) {
            const formattedHours = userAvailability.map((dayData) => ({
                date: dayData.date,
                hours: dayData.allocated_hours,
            }));
            setCalendarTaskHours(formattedHours);
        }
    }, [userAvailability]);

    useEffect(() => {
        if (startCollapsibleRef.current) {
            if (showStartDatePicker) {
                startCollapsibleRef.current.style.height = 'auto';
                startCollapsibleRef.current.style.opacity = '1';
            } else {
                startCollapsibleRef.current.style.height = '0';
                startCollapsibleRef.current.style.opacity = '0';
            }
        }
    }, [showStartDatePicker]);

    useEffect(() => {
        if (collapsibleRef.current) {
            if (showDatePicker) {
                collapsibleRef.current.style.height = 'auto';
                collapsibleRef.current.style.opacity = '1';
            } else {
                collapsibleRef.current.style.height = '0';
                collapsibleRef.current.style.opacity = '0';
            }
        }
    }, [showDatePicker]);

    const getTagName = useCallback(
        (id) => tags.find((t) => t.id === id)?.name || "",
        [tags]
    );

    useEffect(() => {
        if (task) {
            const taskData = task as {
                project_management_id?: string;
                milestone_id?: string;
                title?: string;
                description?: string;
                responsible_person_id?: string;
                responsible_person?: {
                    name?: string;
                };
                priority?: string;
                expected_start_date?: string;
                target_date?: string;
                estimated_hour?: number;
                task_tags?: Array<{ company_tag?: { id: string }; id: string }>;
                observers?: Array<{ user_id: string; user_name: string; id: string }>;
            };

            // Fetch project and milestone details
            if (taskData.project_management_id) {
                dispatch(fetchProjectById({ baseUrl, token, id: taskData.project_management_id }));
            }
            if (taskData.milestone_id) {
                dispatch(fetchMilestoneById({ baseUrl, token, id: taskData.milestone_id }));
            }

            const mappedTags =
                taskData.task_tags?.map((tag: { company_tag?: { id: string }; id: string }) => ({
                    value: tag?.company_tag?.id,
                    label: getTagName(tag?.company_tag?.id || ""),
                    id: tag.id,
                })) || [];

            const mappedObservers =
                taskData.observers?.map((observer: { user_id: string; user_name: string; id: string }) => ({
                    value: observer?.user_id,
                    label: observer?.user_name,
                    id: observer.id,
                })) || [];

            setFormData({
                taskTitle: taskData.title || "",
                description: taskData.description || "",
                responsiblePerson: taskData.responsible_person_id || "",
                responsiblePersonName: taskData.responsible_person?.name || "",
                priority: taskData.priority || "",
                observer: mappedObservers,
                tags: mappedTags,
            });

            if (taskData.expected_start_date) {
                setStartDate({
                    date: new Date(taskData.expected_start_date).getDate(),
                    month: new Date(taskData.expected_start_date).getMonth(),
                    year: new Date(taskData.expected_start_date).getFullYear(),
                });
            }

            if (taskData.target_date) {
                setEndDate({
                    date: new Date(taskData.target_date).getDate(),
                    month: new Date(taskData.target_date).getMonth(),
                    year: new Date(taskData.target_date).getFullYear(),
                });
            }

            if (taskData.estimated_hour) {
                setTotalWorkingHours(taskData.estimated_hour);
            }

            if (Array.isArray(taskData.task_allocation_times) && taskData.task_allocation_times.length > 0) {
                setDateWiseHours(taskData.task_allocation_times);
            }

            setPrevTags(mappedTags);
            setPrevObservers(mappedObservers);

            // Fetch user availability for responsible person
            if (taskData.responsible_person_id) {
                dispatch(fetchUserAvailability({ baseUrl, token, id: taskData.responsible_person_id }));
                fetchShifts(taskData.responsible_person_id);
            }
        }
    }, [task, getTagName, baseUrl, token, dispatch, fetchShifts]);

    useEffect(() => {
        const getStartDateTasks = async () => {
            if (!startDate) return;

            const formattedStartDate = `${startDate.year}-${String(
                startDate.month + 1
            ).padStart(2, "0")}-${String(startDate.date).padStart(2, "0")}`;

            try {
                const response = await dispatch(
                    fetchTargetDateTasks({
                        baseUrl,
                        token,
                        id: formData.responsiblePerson,
                        date: formattedStartDate,
                    })
                ).unwrap();
                setStartDateTasks([...response.tasks, ...response.issues]);
            } catch (error) {
                console.error(error);
            }
        };

        if (formData.responsiblePerson && startDate) {
            getStartDateTasks();
        }
    }, [formData.responsiblePerson, startDate, baseUrl, dispatch, token]);

    useEffect(() => {
        const getTargetDateTasks = async () => {
            const formattedEndDate = `${endDate.year}-${String(
                endDate.month + 1
            ).padStart(2, "0")}-${String(endDate.date).padStart(2, "0")}`;
            try {
                const response = await dispatch(
                    fetchTargetDateTasks({
                        baseUrl,
                        token,
                        id: formData.responsiblePerson,
                        date: formattedEndDate,
                    })
                ).unwrap();
                setTargetDateTasks([...response.tasks, ...response.issues]);
            } catch (error) {
                console.error(error);
            }
        };
        if (formData.responsiblePerson && endDate) {
            getTargetDateTasks();
        }
    }, [formData.responsiblePerson, endDate, baseUrl, dispatch, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        if (name === "tags") {
            const removed = prevTags.find(
                (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
            );

            if (removed) {
                dispatch(removeTagFromProject({ baseUrl, token, id: removed.id }));
            }

            setPrevTags(selectedOptions);
        }

        if (name === "observer") {
            const removed = prevObservers.find(
                (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
            );

            if (removed) {
                dispatch(removeUserFromProject({ baseUrl, token, id: removed.id }));
            }

            setPrevObservers(selectedOptions);
        }

        setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.taskTitle ||
            !formData.responsiblePerson ||
            !formData.priority ||
            !formData.observer.length ||
            !formData.tags.length
        ) {
            toast.dismiss();
            toast.error("Please fill all required fields.");
            return;
        }

        setIsSubmitting(true);

        const formatedEndDate = `${endDate.year}-${endDate.month + 1}-${endDate.date}`;
        const formatedStartDate = `${startDate.year}-${startDate.month + 1}-${startDate.date}`;

        const payload = {
            title: formData.taskTitle,
            description: formData.description,
            responsible_person_id: formData.responsiblePerson,
            priority: formData.priority,
            observer_ids: formData.observer.map((observer) => observer.value),
            task_tag_ids: formData.tags.map((tag) => tag.value),
            expected_start_date: formatedStartDate,
            target_date: formatedEndDate,
            allocation_date: formatedEndDate,
            active: true,
            estimated_hour: totalWorkingHours,
            task_allocation_times_attributes: dateWiseHours,
        };

        try {
            await dispatch(editProjectTask({ baseUrl, token, id: taskId, data: payload })).unwrap();
            toast.dismiss();
            toast.success("Task updated successfully.");
            if (onCloseModal) {
                onCloseModal();
            }
        } catch (error) {
            console.error("Error updating task:", error);
            toast.dismiss();
            toast.error("Error updating task.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="pb-20 overflow-y-auto text-[12px]" onSubmit={handleSubmit}>
            <div className="max-w-[95%] mx-auto pr-3">
                <div className="p-4 bg-white relative">
                    {/* Project and Milestone (Read-only) */}
                    {project && milestone && (
                        <div className="flex items-center justify-between gap-3 mb-4 mt-4">
                            <div className="w-full">
                                <TextField
                                    fullWidth
                                    label="Project *"
                                    value={typeof project === 'object' && 'title' in project ? project.title : ""}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                    size="small"
                                    sx={fieldStyles}
                                />
                            </div>
                            <div className="w-full">
                                <TextField
                                    fullWidth
                                    label="Milestone *"
                                    value={typeof milestone === 'object' && 'title' in milestone ? milestone.title : ""}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                    size="small"
                                    sx={fieldStyles}
                                />
                            </div>
                        </div>
                    )}

                    {/* Task Title */}
                    <div className="mb-1">
                        <TextField
                            fullWidth
                            label="Task Title *"
                            name="taskTitle"
                            placeholder="Enter Task Title"
                            value={formData.taskTitle}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            sx={fieldStyles}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-1">
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            placeholder="Enter Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    height: "auto !important",
                                    padding: "2px !important",
                                    display: "flex",
                                },
                                "& .MuiInputBase-input[aria-hidden='true']": {
                                    flex: 0,
                                    width: 0,
                                    height: 0,
                                    padding: "0 !important",
                                    margin: 0,
                                    display: "none",
                                },
                                "& .MuiInputBase-input": {
                                    resize: "none !important",
                                },
                            }}
                        />
                    </div>

                    {/* Responsible Person and Role */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>Responsible Person *</InputLabel>
                                <Select
                                    label="Responsible Person *"
                                    name="responsiblePerson"
                                    value={formData.responsiblePerson}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const selectedUser = users?.find(
                                            (user: { id?: string | number; full_name?: string }) => user?.id === value
                                        );
                                        setFormData({
                                            ...formData,
                                            responsiblePerson: value,
                                            responsiblePersonName: selectedUser?.full_name || "",
                                        });
                                        if (value) {
                                            dispatch(fetchUserAvailability({ baseUrl, token, id: value }));
                                            fetchShifts(value);
                                        }
                                    }}
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select Person</em>
                                    </MenuItem>
                                    {users?.filter(Boolean).map((user: { id?: string | number; full_name?: string }) => (
                                        <MenuItem key={user?.id} value={user?.id}>
                                            {user?.full_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                fullWidth
                                label="Role"
                                value={
                                    users.find((user) => user.id === formData.responsiblePerson)
                                        ?.lock_role?.display_name || ""
                                }
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                                size="small"
                                sx={fieldStyles}
                            />
                        </div>
                    </div>

                    {/* Start Date and Target Date */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs text-gray-700 mb-1">Start Date</label>
                            <button
                                type="button"
                                className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                                onClick={() => {
                                    if (showDatePicker) setShowDatePicker(false);
                                    setShowStartDatePicker(!showStartDatePicker);
                                }}
                                ref={startDateRef}
                            >
                                {startDate ? (
                                    <div className="text-black flex items-center justify-between w-full">
                                        <CalendarIcon className="w-4 h-4" />
                                        <div>
                                            {startDate?.date?.toString().padStart(2, "0")}{" "}
                                            {monthNames[startDate.month]}
                                        </div>
                                        <X className="w-4 h-4" onClick={(e) => { e.preventDefault(); setStartDate(null); }} />
                                    </div>
                                ) : (
                                    <>
                                        <CalendarIcon className="w-4 h-4" /> Select Start Date
                                    </>
                                )}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700 mb-1">Target Date *</label>
                            <button
                                type="button"
                                className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                                onClick={() => {
                                    if (showStartDatePicker) setShowStartDatePicker(false);
                                    setShowDatePicker(!showDatePicker);
                                }}
                                ref={endDateRef}
                            >
                                {endDate ? (
                                    <div className="text-black flex items-center justify-between w-full">
                                        <CalendarIcon className="w-4 h-4" />
                                        <div>
                                            {endDate.date.toString().padStart(2, "0")}{" "}
                                            {monthNames[endDate.month]}
                                        </div>
                                        <X className="w-4 h-4" onClick={(e) => { e.preventDefault(); setEndDate(null); }} />
                                    </div>
                                ) : (
                                    <>
                                        <CalendarIcon className="w-4 h-4" /> Select Target Date
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-700 mb-2">
                            Duration <span className="text-red-600">*</span>
                        </label>
                        <DurationPicker
                            // value={taskDuration}
                            onChange={setTaskDuration}
                            onDateWiseHoursChange={setDateWiseHours}
                            startDate={startDate}
                            endDate={endDate}
                            resposiblePerson={formData.responsiblePersonName}
                            dateWiseHours={dateWiseHours}
                            totalWorkingHours={totalWorkingHours}
                            setTotalWorkingHours={setTotalWorkingHours}
                            shift={shift}
                        />
                    </div>

                    {/* Start Date Collapsible */}
                    <div
                        ref={startCollapsibleRef}
                        className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
                        style={{ willChange: "height, opacity" }}
                    >
                        {!startDate ? (
                            showStartCalender ? (
                                <CustomCalender
                                    setShowCalender={setShowStartCalender}
                                    onDateSelect={setStartDate}
                                    selectedDate={startDate}
                                    taskHoursData={calendarTaskHours}
                                    ref={startDateRef}
                                />
                            ) : (
                                <TaskDatePicker
                                    selectedDate={startDate}
                                    onDateSelect={setStartDate}
                                    startDate={null}
                                    userAvailability={userAvailability}
                                    setShowCalender={setShowStartCalender}
                                />
                            )
                        ) : (
                            <TasksOfDate
                                selectedDate={startDate}
                                onClose={() => { }}
                                tasks={startDateTasks}
                                selectedUser={formData.responsiblePerson}
                                userAvailability={userAvailability}
                            />
                        )}
                    </div>

                    {/* End Date Collapsible */}
                    <div
                        ref={collapsibleRef}
                        className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
                        style={{ willChange: "height, opacity" }}
                    >
                        {!endDate ? (
                            showCalender ? (
                                <CustomCalender
                                    setShowCalender={setShowCalender}
                                    onDateSelect={setEndDate}
                                    selectedDate={endDate}
                                    taskHoursData={calendarTaskHours}
                                    ref={endDateRef}
                                />
                            ) : (
                                <TaskDatePicker
                                    selectedDate={endDate}
                                    onDateSelect={setEndDate}
                                    startDate={startDate}
                                    userAvailability={userAvailability}
                                    setShowCalender={setShowCalender}
                                />
                            )
                        ) : (
                            <TasksOfDate
                                selectedDate={endDate}
                                onClose={() => { }}
                                tasks={targetDateTasks}
                                selectedUser={formData.responsiblePerson}
                                userAvailability={userAvailability}
                            />
                        )}
                    </div>

                    {/* Priority */}
                    <div className="mb-6 mt-2">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel shrink>Priority</InputLabel>
                            <Select
                                label="Priority *"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                displayEmpty
                                sx={fieldStyles}
                            >
                                <MenuItem value="">
                                    <em>Select Priority</em>
                                </MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Observer */}
                    <div className="mb-6">
                        <MuiMultiSelect
                            label="Observer"
                            options={users?.filter(Boolean).map((user: { id?: string | number; full_name?: string }) => ({
                                label: user?.full_name || "Unknown",
                                value: user?.id || user?.id,
                                id: user?.id || user?.id,
                            }))}
                            value={formData.observer}
                            placeholder="Select Observer"
                            onChange={(values) => handleMultiSelectChange("observer", values)}
                        />
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <MuiMultiSelect
                            label="Tags"
                            options={tags.map((tag) => ({ value: tag.id, label: tag.name, id: tag.id }))}
                            value={formData.tags}
                            onChange={(values) => handleMultiSelectChange("tags", values)}
                            placeholder="Select Tags"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white text-[12px]">
                    <button
                        type="submit"
                        className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-[100px]"
                        disabled={isSubmitting || editLoading}
                    >
                        {editLoading || isSubmitting ? "Updating..." : "Update"}
                    </button>
                    <button
                        type="button"
                        onClick={onCloseModal}
                        className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2 w-max"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProjectTaskEditModal;
