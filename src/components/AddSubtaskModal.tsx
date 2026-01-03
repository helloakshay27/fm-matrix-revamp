import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import { CalendarIcon, X } from "lucide-react"
import { forwardRef, useEffect, useRef, useState } from "react";
import { DurationPicker } from "./DurationPicker";
import { CustomCalender } from "./CustomCalender";
import { TaskDatePicker } from "./TaskDatePicker";
import TasksOfDate from "./TasksOfDate";
import MuiMultiSelect from "./MuiMultiSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import { removeTagFromProject } from "@/store/slices/projectManagementSlice";
import { createProjectTask, fetchProjectTasksById, fetchTargetDateTasks, fetchUserAvailability } from "@/store/slices/projectTasksSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface SubTask {
    estimated_hour?: number;
}

interface ParentTask {
    estimated_hour?: number;
    sub_tasks_managements?: SubTask[];
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

// SubtaskForm Component (similar to TaskForm in ProjectTaskCreateModal)
const SubtaskForm = ({
    formData,
    setFormData,
    users,
    tags,
    prevTags,
    setPrevTags,
    dispatch,
    token,
    baseUrl,
    taskDuration,
    setTaskDuration,
    setDateWiseHours,
    totalWorkingHours,
    setTotalWorkingHours,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) => {
    const { data: userAvailabilityData } = useAppSelector((state) => state.fetchUserAvailability);
    const userAvailability = Array.isArray(userAvailabilityData) ? userAvailabilityData : [];

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const [shift, setShift] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [startDateTasks, setStartDateTasks] = useState([]);
    const [targetDateTasks, setTargetDateTasks] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [showStartCalender, setShowStartCalender] = useState(false);
    const [calendarTaskHours, setCalendarTaskHours] = useState([]);

    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);

    const fetchShifts = async (id) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/user_shifts.json?user_id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShift(response.data.user_shifts);
        } catch (error) {
            console.log(error);
        }
    }

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
                console.log(error);
            }
        };

        if (formData.responsiblePerson && startDate) {
            getStartDateTasks();
        }
    }, [formData.responsiblePerson, startDate]);

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
                console.log(error);
            }
        };
        if (formData.responsiblePerson && endDate) {
            getTargetDateTasks();
        }
    }, [formData.responsiblePerson, endDate]);

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

        setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    };

    return (
        <div className="p-4 bg-white relative">
            <div className="mb-1">
                <TextField
                    fullWidth
                    label="Subtask Title *"
                    name="title"
                    placeholder="Enter Subtask Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    sx={fieldStyles}
                />
            </div>

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

            <div className="grid grid-cols-1 gap-3 mb-3">
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
                                    (user: any) => user?.user_id === value || user?.id === value
                                );
                                setFormData({
                                    ...formData,
                                    responsiblePerson: value,
                                    responsiblePersonName:
                                        selectedUser?.user?.full_name || selectedUser?.full_name || "",
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
                            {users?.filter(Boolean).map((user: any) => (
                                <MenuItem key={user?.id} value={user?.id}>
                                    {user?.full_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                {/* <div>
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
                </div> */}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-xs text-gray-700 mb-1">Target Date *</label>
                    <button
                        type="button"
                        className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                        onClick={() => {
                            if (showStartDatePicker) {
                                setShowStartDatePicker(false);
                            }
                            setShowDatePicker(!showDatePicker);
                        }}
                        ref={endDateRef}
                    >
                        {endDate ? (
                            <div className="text-black flex items-center justify-between w-full">
                                <CalendarIcon className="w-4 h-4" />
                                <div>
                                    Target Date :{" "}
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
                <div>
                    <label className="block text-xs text-gray-700 mb-1">Start Date</label>
                    <button
                        type="button"
                        className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                        onClick={() => {
                            if (showDatePicker) {
                                setShowDatePicker(false);
                            }
                            setShowStartDatePicker(!showStartDatePicker);
                        }}
                        ref={startDateRef}
                    >
                        {startDate ? (
                            <div className="text-black flex items-center justify-between w-full">
                                <CalendarIcon className="w-4 h-4" />
                                <div>
                                    Start Date : {" "}
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
            </div>

            <div className="mb-4">
                <label className="block text-xs text-gray-700 mb-2">
                    Efforts Duration <span className="text-red-600">*</span>
                </label>
                <DurationPicker
                    dateWiseHours={[]}
                    onChange={setTaskDuration}
                    onDateWiseHoursChange={setDateWiseHours}
                    startDate={startDate}
                    endDate={endDate}
                    resposiblePerson={formData.responsiblePersonName}
                    totalWorkingHours={totalWorkingHours}
                    setTotalWorkingHours={setTotalWorkingHours}
                    shift={shift}
                />
            </div>

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
                            maxDate={endDate}
                            shift={shift}
                        />
                    ) : (
                        <TaskDatePicker
                            selectedDate={startDate}
                            onDateSelect={setStartDate}
                            startDate={null}
                            userAvailability={userAvailability}
                            setShowCalender={setShowStartCalender}
                            maxDate={endDate}
                            shift={shift}
                        />
                    )
                ) : (
                    <TasksOfDate
                        selectedDate={startDate}
                        onClose={() => { }}
                        tasks={startDateTasks}
                        selectedUser={formData.responsiblePerson}
                        userAvailability={userAvailability}
                        shift={shift}
                    />
                )}
            </div>

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
                            shift={shift}
                        />
                    ) : (
                        <TaskDatePicker
                            selectedDate={endDate}
                            onDateSelect={setEndDate}
                            startDate={startDate}
                            userAvailability={userAvailability}
                            setShowCalender={setShowCalender}
                            shift={shift}
                        />
                    )
                ) : (
                    <TasksOfDate
                        selectedDate={endDate}
                        onClose={() => { }}
                        tasks={targetDateTasks}
                        selectedUser={formData.responsiblePerson}
                        userAvailability={userAvailability}
                        shift={shift}
                    />
                )}
            </div>

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
    );
};

// Main AddSubtaskModal Component
const AddSubtaskModal = ({ openTaskModal, setOpenTaskModal, fetchData }: { openTaskModal: boolean, setOpenTaskModal: (value: boolean) => void, fetchData: () => void }) => {
    const { id: pid, mid, taskId } = useParams();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const dispatch = useAppDispatch();

    const { data: parentTask } = useAppSelector((state) => state.fetchProjectTasksById) as { data: ParentTask | undefined };

    const [tags, setTags] = useState([])
    const [users, setUsers] = useState([])
    const [taskDuration, setTaskDuration] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const [dateWiseHours, setDateWiseHours] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [prevTags, setPrevTags] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        responsiblePerson: "",
        responsiblePersonName: "",
        priority: "",
        tags: [],
    })

    const getTags = async () => {
        try {
            const response = await dispatch(fetchProjectsTags()).unwrap();
            setTags(response);
        } catch (error) {
            console.log(error)
        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const validUsers = (response.data.users || []).filter((user: any) => user && user.id);
            setUsers(validUsers);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUsers();
        getTags();
    }, [])

    useEffect(() => {
        const fetchParentTask = async () => {
            try {
                if (taskId) {
                    await dispatch(fetchProjectTasksById({ baseUrl, token, id: taskId })).unwrap();
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchParentTask();
    }, []);

    const handleCloseModal = () => {
        setOpenTaskModal(false);
    };

    const validateForm = () => {
        if (
            !formData.title ||
            !formData.responsiblePerson ||
            !endDate ||
            !formData.priority
        ) {
            toast.error("Fill all required fields");
            return false;
        }
        return true;
    }

    const validateSubtaskDuration = () => {
        if (!parentTask) {
            return true; // If parent task data not loaded, skip validation
        }

        const parentEstimatedHours = parentTask.estimated_hour || 0;

        // Calculate total estimated hours of existing subtasks
        const existingSubtasksHours = (parentTask.sub_tasks_managements || []).reduce(
            (sum, subtask) => sum + (subtask.estimated_hour || 0),
            0
        );

        // New subtask hours
        const newSubtaskHours = Number(totalWorkingHours) || 0;

        // Total hours if new subtask is created
        const totalSubtasksHours = existingSubtasksHours + newSubtaskHours;

        // Check if total exceeds parent task duration
        if (totalSubtasksHours > parentEstimatedHours) {
            const remainingHours = parentEstimatedHours - existingSubtasksHours;
            toast.error(
                `Your subtask duration exceeds task duration limit. Parent task duration: ${parentEstimatedHours}h, Existing subtasks: ${existingSubtasksHours}h, Remaining: ${Math.max(0, remainingHours)}h`
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return

        if (!validateSubtaskDuration()) return;

        setIsSubmitting(true)
        const formatedStartDate = `${startDate?.year}-${startDate?.month + 1}-${startDate?.date
            }`;
        const formatedEndDate = `${endDate?.year}-${endDate?.month + 1}-${endDate?.date
            }`;
        const payload = {
            task_management: {
                parent_id: taskId,
                title: formData.title,
                description: formData.description,
                responsible_person_id: formData.responsiblePerson,
                expected_start_date: formatedStartDate,
                target_date: formatedEndDate,
                estimated_hour: totalWorkingHours,
                priority: formData.priority,
                task_tag_ids: formData.tags.map((tag) => tag.value),
                task_allocation_times_attributes: dateWiseHours,
                project_management_id: pid
            }
        };
        try {
            await dispatch(createProjectTask({ baseUrl, token, data: payload })).unwrap();
            toast.success("Subtask created successfully");
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={openTaskModal}
            onClose={handleCloseModal}
            TransitionComponent={Transition}
            maxWidth={false}
        >
            <DialogContent
                className="w-1/2 h-full fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
                style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                sx={{
                    padding: "0 !important",
                    "& .MuiDialogContent-root": {
                        padding: "0 !important",
                        overflow: "auto",
                    }
                }}
            >
                <div className="sticky top-0 bg-white z-10">
                    <h3 className="text-[14px] font-medium text-center mt-8">Create Subtask</h3>
                    <X
                        className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
                        onClick={handleCloseModal}
                    />
                    <hr className="border border-[#E95420] mt-4" />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form
                        className="pb-12 h-full overflow-y-auto text-[12px]"
                        onSubmit={handleSubmit}
                    >
                        <div
                            id="addSubtask"
                            className="max-w-[95%] mx-auto h-full overflow-y-auto pr-3"
                        >
                            <SubtaskForm
                                formData={formData}
                                setFormData={setFormData}
                                users={users}
                                tags={tags}
                                prevTags={prevTags}
                                setPrevTags={setPrevTags}
                                dispatch={dispatch}
                                token={token}
                                baseUrl={baseUrl}
                                taskDuration={taskDuration}
                                setTaskDuration={setTaskDuration}
                                setDateWiseHours={setDateWiseHours}
                                totalWorkingHours={totalWorkingHours}
                                setTotalWorkingHours={setTotalWorkingHours}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                            />
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="flex items-center justify-center border-2 text-[red] border-[red] mt-4 px-4 py-2 w-[100px]"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddSubtaskModal