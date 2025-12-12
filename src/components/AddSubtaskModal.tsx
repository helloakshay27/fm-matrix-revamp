import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, Slide } from "@mui/material"
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
import { createProjectTask, fetchUserAvailability } from "@/store/slices/projectTasksSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

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

const AddSubtaskModal = ({ openTaskModal, setOpenTaskModal, fetchData }) => {
    const { id: pid, mid, taskId } = useParams();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const dispatch = useAppDispatch();

    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const { data: tags = [] } = useAppSelector((state) => state.fetchProjectsTags);
    const { data: userAvailabilityData } = useAppSelector((state) => state.fetchUserAvailability);
    const userAvailability = Array.isArray(userAvailabilityData) ? userAvailabilityData : [];

    const [shift, setShift] = useState([])
    const [users, setUsers] = useState([])
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [totalWorkingHours, setTotalWorkingHours] = useState("")
    const [showStartCalender, setShowStartCalender] = useState(false);
    const [calendarTaskHours, setCalendarTaskHours] = useState([]);
    const [dateWiseHours, setDateWiseHours] = useState("")
    const [startDateTasks, setStartDateTasks] = useState([]);
    const [targetDateTasks, setTargetDateTasks] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [taskDuration, setTaskDuration] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [prevTags, setPrevTags] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        responsiblePerson: "",
        responsiblePersonName: "",
        duration: "",
        priority: "",
        tags: [],
    })

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
        const getUsers = async () => {
            try {
                await dispatch(fetchProjectsTags({ baseUrl, token })).unwrap();
                const response = await dispatch(fetchFMUsers()).unwrap();
                const validUsers = (response.users || []).filter((user: any) => user && user.id);
                setUsers(validUsers);
            } catch (error) {
                console.log(error)
            }
        }

        getUsers()
    }, [])

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCloseModal = () => {
        setOpenTaskModal(false);
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

    const handleSubmit = async (e, id) => {
        e.preventDefault();
        console.log(formData)

        if (!validateForm()) return

        setIsSubmitting(true)
        const formatedStartDate = `${startDate.year}-${startDate.month + 1}-${startDate.date
            }`;
        const formatedEndDate = `${endDate.year}-${endDate.month + 1}-${endDate.date
            }`;
        const payload = {
            parent_id: id,
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
        };
        if (payload.task_tag_ids.length === 0) {
            payload.task_tag_ids = null
        }
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
                        onSubmit={(e) => handleSubmit(e, taskId)}
                    >
                        <div
                            id="addTask"
                            className="max-w-[95%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
                        >
                            <div className="p-4 bg-white relative">
                                <div className="flex items-start gap-4 mt-3">
                                    <div className="w-full flex flex-col justify-between">
                                        <label className="block mb-2">
                                            Subtask Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter Task Title"
                                            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px]"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 h-[100px]">
                                    <label className="block">Description</label>
                                    <textarea
                                        name="description"
                                        rows={5}
                                        placeholder="Enter Description"
                                        className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[80px] overflow-y-auto resize-none"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mt-8 space-y-2 w-full">
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

                                <div className="flex justify-between mt-3 gap-2 text-[12px]">
                                    <div className="space-y-2 w-full">
                                        <label className="block">
                                            Target Date <span className="text-red-600">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px] flex items-center gap-3 text-gray-400"
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
                                                        Target : {endDate.date.toString().padStart(2, "0")}{" "}
                                                        {monthNames[endDate.month]}
                                                    </div>
                                                    <X className="w-4 h-4" onClick={() => setEndDate(null)} />
                                                </div>
                                            ) : (
                                                <>
                                                    <CalendarIcon className="w-4 h-4" /> Select Target Date
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <label className="block">Start Date</label>
                                        <button
                                            type="button"
                                            className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px] flex items-center gap-3 text-gray-400"
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
                                                        Start Date : {startDate.date.toString().padStart(2, "0")}{" "}
                                                        {monthNames[startDate.month]}
                                                    </div>
                                                    <X className="w-4 h-4" onClick={() => setStartDate(null)} />
                                                </div>
                                            ) : (
                                                <>
                                                    <CalendarIcon className="w-4 h-4" /> Select Start Date
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 gap-2 text-[12px]">
                                    <div className="space-y-2 w-full">
                                        <label className="block">
                                            Efforts Duration <span className="text-red-600">*</span>
                                        </label>
                                        <DurationPicker
                                            onChange={setTaskDuration}
                                            onDateWiseHoursChange={setDateWiseHours}
                                            startDate={startDate}
                                            endDate={endDate}
                                            dateWiseHours={dateWiseHours}
                                            resposiblePerson={formData.responsiblePersonName}
                                            totalWorkingHours={totalWorkingHours}
                                            setTotalWorkingHours={setTotalWorkingHours}
                                            shift={shift}
                                        />
                                    </div>
                                </div>

                                <div
                                    ref={startCollapsibleRef}
                                    className="overflow-hidden opacity-0 h-0"
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
                                            userAvailability={userAvailability}
                                            selectedUser={formData.responsiblePerson}
                                        />
                                    )}
                                </div>

                                <div
                                    ref={collapsibleRef}
                                    className="overflow-hidden opacity-0 h-0"
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
                                            userAvailability={userAvailability}
                                            selectedUser={formData.responsiblePerson}
                                        />
                                    )}
                                </div>

                                <div className="flex gap-2 text-[12px] mt-6">
                                    <div className="space-y-2 w-full">
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Priority</InputLabel>
                                            <Select
                                                label="Priority *"
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
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
                                </div>

                                <div className="flex items-start gap-4 mt-6">
                                    <div className="flex flex-col justify-between w-full">
                                        <MuiMultiSelect
                                            label="Tags"
                                            options={Array.isArray(tags) ? tags.map((tag) => ({ value: tag.id, label: tag.name, id: tag.id })) : []}
                                            value={formData.tags}
                                            onChange={(values) => handleMultiSelectChange("tags", values)}
                                            placeholder="Select Tags"
                                        />
                                    </div>
                                </div>
                            </div>
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