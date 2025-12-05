import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { CalendarIcon, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import { fetchProjectById, fetchProjects, removeTagFromProject, removeUserFromProject } from "@/store/slices/projectManagementSlice";
import { fetchMilestoneById, fetchMilestones } from "@/store/slices/projectMilestoneSlice";
import { createProjectTask, editProjectTask, fetchProjectTasks, fetchTargetDateTasks, fetchUserAvailability } from "@/store/slices/projectTasksSlice";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DurationPicker } from "./DurationPicker";
import { CustomCalender } from "./CustomCalender";
import { TaskDatePicker } from "./TaskDatePicker";
import TasksOfDate from "./TasksOfDate";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";
import MuiMultiSelect from "./MuiMultiSelect";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const TaskForm = ({
    formData,
    setFormData,
    isReadOnly = false,
    project,
    milestone,
    users,
    tags,
    prevTags,
    setPrevTags,
    prevObservers,
    setPrevObservers,
    isEdit,
    dispatch,
    token,
    allUsers,
    hasSavedTasks,
    setIsDelete,
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
    const baseUrl = localStorage.getItem("baseUrl");

    console.log(users)

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
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([])
    const [milestones, setMilestones] = useState([]);

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

    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);

    const getProjects = async () => {
        try {
            const response = await dispatch(fetchProjects({ baseUrl, token })).unwrap();
            setProjects(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchShifts = async (id) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/shifts/get_shifts.json?user_id=${id}`, {
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
        getProjects();
    }, [])

    useEffect(() => {
        const getMilestones = async () => {
            if (!selectedProject) return;

            try {
                const response = await dispatch(
                    fetchMilestones({ baseUrl, token, id: selectedProject })
                ).unwrap();
                setMilestones(response);
            } catch (error) {
                console.log(error);
            }
        }

        getMilestones();
    }, [selectedProject])

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
        if (name === "project") {
            setFormData({ ...formData, project: value });
            setSelectedProject(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        if (name === "tags") {
            const removed = prevTags.find(
                (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
            );

            if (removed && isEdit) {
                dispatch(removeTagFromProject({ baseUrl, token, id: removed.id }));
            }

            setPrevTags(selectedOptions);
        }

        if (name === "observer") {
            const removed = prevObservers.find(
                (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
            );

            if (removed && isEdit) {
                dispatch(removeUserFromProject({ baseUrl, token, id: removed.id }));
            }

            setPrevObservers(selectedOptions);
        }

        setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    };

    return (
        <div className="p-4 bg-white relative">
            {!isReadOnly && hasSavedTasks && (
                <DeleteOutlinedIcon
                    onClick={() => {
                        setFormData({
                            project: formData.project,
                            milestone: formData.milestone,
                            taskTitle: "",
                            description: "",
                            responsiblePerson: "",
                            department: "",
                            priority: "",
                            duration: "",
                            expected_start_date: null,
                            target_date: null,
                            observer: [],
                            tags: [],
                        });
                        setIsDelete(true);
                    }}
                    className="absolute top-3 right-3 text-red-600 cursor-pointer"
                />
            )}
            {(project &&
                milestone &&
                !Array.isArray(project) &&
                !Array.isArray(milestone) &&
                project.title &&
                milestone.title) ? (
                <div className="flex items-center justify-between gap-3 mb-4 mt-4">
                    <div className="w-full">
                        <TextField
                            fullWidth
                            label="Project *"
                            value={project.title}
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
                            value={milestone.title}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            size="small"
                            sx={fieldStyles}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel shrink>Project</InputLabel>
                            <Select
                                label="Project*"
                                name="project"
                                value={formData.project}
                                onChange={handleChange}
                                displayEmpty
                                sx={fieldStyles}
                            >
                                <MenuItem value="">
                                    <em>Select Project</em>
                                </MenuItem>
                                {
                                    projects.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                            {project.title}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel shrink>Milestone</InputLabel>
                            <Select
                                label="Milestone"
                                name="milestone"
                                value={formData.milestone}
                                onChange={handleChange}
                                displayEmpty
                                sx={fieldStyles}
                            >
                                <MenuItem value="">
                                    <em>Select Milestone</em>
                                </MenuItem>
                                {
                                    milestones.map((milestone) => (
                                        <MenuItem key={milestone.id} value={milestone.id}>
                                            {milestone.title}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
            )}

            <div className="mb-1">
                <TextField
                    fullWidth
                    label="Task Title *"
                    name="taskTitle"
                    placeholder="Enter Task Title"
                    value={formData.taskTitle}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
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
                                    (user: any) => user?.user_id === value || user?.id === value
                                );
                                setFormData({
                                    ...formData,
                                    responsiblePerson: value,
                                    responsiblePersonName:
                                        selectedUser?.user?.full_name || selectedUser?.full_name || "",
                                });
                                if (!isReadOnly && value) {
                                    dispatch(fetchUserAvailability({ baseUrl, token, id: value }));
                                    fetchShifts(value);
                                }
                            }}
                            displayEmpty
                            disabled={isReadOnly}
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
                <div>
                    <TextField
                        fullWidth
                        label="Role"
                        value={
                            allUsers.find((user) => user.id === formData.responsiblePerson)
                                ?.lock_role?.display_name || ""
                        }
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        size="small"
                        sx={fieldStyles}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
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
            </div>

            <div className="mb-4">
                <label className="block text-xs text-gray-700 mb-2">
                    Duration <span className="text-red-600">*</span>
                </label>
                <DurationPicker
                    value={taskDuration}
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

            <div className="mb-6 mt-2">
                <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Priority</InputLabel>
                    <Select
                        label="Priority *"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        displayEmpty
                        disabled={isReadOnly}
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
                    label="Observer"
                    options={users?.filter(Boolean).map((user: any) => ({
                        label: user?.full_name || "Unknown",
                        value: user?.id || user?.id,
                        id: user?.id || user?.id,
                    }))}
                    value={formData.observer}
                    placeholder="Select Observer"
                    onChange={(values) => handleMultiSelectChange("observer", values)}
                    disabled={isReadOnly}
                />
            </div>

            <div className="mb-6">
                <MuiMultiSelect
                    label="Tags"
                    options={tags.map((tag) => ({ value: tag.id, label: tag.name, id: tag.id }))}
                    value={formData.tags}
                    onChange={(values) => handleMultiSelectChange("tags", values)}
                    placeholder="Select Tags"
                    disabled={isReadOnly}
                />
            </div>
        </div>
    );
};

const ProjectTaskCreateModal = ({ isEdit, onCloseModal }) => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const { id, mid, tid } = useParams();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.createProjectTask);
    const { data: task } = useAppSelector((state) => state.fetchProjectTasksById);
    const { data: project } = useAppSelector(
        (state) => state.fetchProjectById
    );
    const { data: milestone } = useAppSelector(
        (state) => state.fetchMilestoneById
    );
    const {
        loading: editLoading,
    } = useAppSelector((state) => state.editProjectTask);

    const [tags, setTags] = useState([])
    const [users, setUsers] = useState([])
    const [taskDuration, setTaskDuration] = useState();
    const [nextId, setNextId] = useState(1);
    const [savedTasks, setSavedTasks] = useState([]);
    const [isDelete, setIsDelete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const [dateWiseHours, setDateWiseHours] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [members, setMembers] = useState([])
    const [formData, setFormData] = useState({
        project: "",
        milestone: "",
        taskTitle: "",
        description: "",
        responsiblePerson: "",
        responsiblePersonName: "",
        department: "",
        priority: "",
        observer: [],
        tags: [],
    });

    const [prevTags, setPrevTags] = useState([]);
    const [prevObservers, setPrevObservers] = useState([]);

    const getTags = async () => {
        try {
            const response = await dispatch(fetchProjectsTags({ baseUrl, token })).unwrap();
            setTags(response);
        } catch (error) {
            console.log(error)
        }
    }

    const getUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            // Filter out any undefined/null users
            const validUsers = (response.users || []).filter((user: any) => user && user.id);
            setUsers(validUsers);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    useEffect(() => {
        getUsers();
        getTags();
        dispatch(fetchProjectById({ baseUrl, token, id }));
        dispatch(fetchMilestoneById({ baseUrl, token, id: mid }));
    }, [dispatch, id, mid, token]);

    const getTagName = useCallback(
        (id) => tags.find((t) => t.id === id)?.name || "",
        [tags]
    );

    useEffect(() => {
        if (project && typeof project === 'object' && 'project_team' in project) {
            const projectWithTeam = project as any;
            const members = []

            projectWithTeam?.project_team?.project_team_members?.map((member: any) => {
                members.push(member.user)
            })
            members.push(projectWithTeam?.project_team?.team_lead)

            setMembers(members)
        }
    }, [project])

    console.log(members)

    useEffect(() => {
        if (isEdit && task) {
            const taskData = task as any;
            const mappedTags =
                taskData.task_tags?.map((tag: any) => ({
                    value: tag?.company_tag?.id,
                    label: getTagName(tag?.company_tag?.id),
                    id: tag.id,
                })) || [];

            const mappedObservers =
                taskData.observers?.map((observer: any) => ({
                    value: observer?.user_id,
                    label: observer?.user_name,
                    id: observer.id,
                })) || [];

            setFormData({
                project: id,
                milestone: mid,
                taskTitle: taskData.title || "",
                description: taskData.description || "",
                responsiblePerson: taskData.responsible_person_id || "",
                responsiblePersonName: "",
                department: "",
                priority: taskData.priority || "",
                observer: mappedObservers,
                tags: mappedTags,
            });
            setStartDate({
                date: new Date(taskData.expected_start_date).getDate(),
                month: new Date(taskData.expected_start_date).getMonth(),
                year: new Date(taskData.expected_start_date).getFullYear(),
            })
            setEndDate({
                date: new Date(taskData.target_date).getDate(),
                month: new Date(taskData.target_date).getMonth(),
                year: new Date(taskData.target_date).getFullYear(),
            })

            setPrevTags(mappedTags);
            setPrevObservers(mappedObservers);
        }
    }, [isEdit, task, id, mid, getTagName]);

    const createTaskPayload = (data) => {
        const formatedEndDate = `${endDate.year}-${endDate.month + 1}-${endDate.date
            }`;
        const formatedStartDate = `${startDate.year}-${startDate.month + 1}-${startDate.date
            }`;
        return {
            title: data.taskTitle,
            description: data.description,
            responsible_person_id: data.responsiblePerson,
            priority: data.priority,
            observer_ids: data.observer.map((observer) => observer.value),
            task_tag_ids: data.tags.map((tag) => tag.value),
            expected_start_date: formatedStartDate,
            target_date: formatedEndDate,
            allocation_date: formatedEndDate,
            project_management_id: id || formData.project,
            milestone_id: mid || formData.milestone,
            active: true,
            estimated_hour: totalWorkingHours,
            task_allocation_times_attributes: dateWiseHours,
        };
    };

    const isFormEmpty = () => {
        return (
            !formData.taskTitle &&
            !formData.responsiblePerson &&
            !formData.priority &&
            !startDate &&
            !endDate &&
            formData.observer.length === 0 &&
            formData.tags.length === 0
        );
    };

    const handleCancel = () => {
        if (savedTasks.length === 0) {
            if (onCloseModal) {
                onCloseModal();
            } else {
                console.log("Modal closed (onCloseModal not provided)");
            }
        } else {
            window.location.reload();
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (isDelete) {
            setIsDelete(false);
            return;
        }

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

        const payload = createTaskPayload(formData);

        try {
            await dispatch(createProjectTask({ baseUrl, token, data: payload })).unwrap();
            toast.dismiss();
            toast.success("Task created successfully.");
            setSavedTasks([...savedTasks, { id: nextId, formData }]);
            setFormData({
                project: id,
                milestone: mid,
                taskTitle: "",
                description: "",
                responsiblePerson: "",
                responsiblePersonName: "",
                department: "",
                priority: "",
                observer: [],
                tags: [],
            });
            setPrevTags([]);
            setPrevObservers([]);
            setIsDelete(false);
            setNextId(nextId + 1);
            dispatch(fetchProjectTasks({ baseUrl, token, id: mid ? mid : "" }));
        } catch (error) {
            console.error("Error creating task:", error);
            toast.dismiss();
            toast.error("Error creating task.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e, editId) => {
        e.preventDefault();

        if (isDelete && isFormEmpty()) {
            window.location.reload();
            return;
        }

        if (
            !isDelete &&
            (!formData.taskTitle ||
                !formData.responsiblePerson ||
                !formData.priority ||
                !formData.observer.length ||
                !formData.tags.length)
        ) {
            toast.dismiss();
            toast.error("Please fill all required fields.");
            return;
        }

        setIsSubmitting(true);

        const payload = createTaskPayload(formData);

        try {
            const resultAction = isEdit
                ? await dispatch(editProjectTask({ baseUrl, token, id: editId, data: payload }))
                : await dispatch(createProjectTask({ baseUrl, token, data: payload }));

            if (
                (isEdit && editProjectTask.fulfilled.match(resultAction)) ||
                (!isEdit && createProjectTask.fulfilled.match(resultAction))
            ) {
                toast.dismiss();
                toast.success(
                    isEdit ? "Task updated successfully." : "Task created successfully."
                );
                window.location.reload();
            } else {
                toast.error(isEdit ? "Task update failed." : "Task creation failed.");
            }
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} task:`, error);
            toast.error(`Error ${isEdit ? "updating" : "creating"} task.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className="pb-20 overflow-y-auto text-[12px]"
            onSubmit={(e) => handleSubmit(e, tid)}
        >
            <div
                id="addTask"
                className="max-w-[95%] mx-auto pr-3"
            >
                {savedTasks.map((task) => (
                    <TaskForm
                        key={task.id}
                        formData={task.formData}
                        setFormData={() => { }}
                        isReadOnly={true}
                        project={project}
                        milestone={milestone}
                        // users={members.length > 0 ? members : users}
                        users={users}
                        tags={tags}
                        prevTags={prevTags}
                        setPrevTags={setPrevTags}
                        prevObservers={prevObservers}
                        setPrevObservers={setPrevObservers}
                        isEdit={isEdit}
                        dispatch={dispatch}
                        token={token}
                        allUsers={users}
                        hasSavedTasks={savedTasks.length > 0}
                        setIsDelete={setIsDelete}
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
                ))}

                {!isDelete && (
                    <TaskForm
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={false}
                        project={project}
                        milestone={milestone}
                        // users={members.length > 0 ? members : users}
                        users={users}
                        tags={tags}
                        prevTags={prevTags}
                        setPrevTags={setPrevTags}
                        prevObservers={prevObservers}
                        setPrevObservers={setPrevObservers}
                        isEdit={isEdit}
                        dispatch={dispatch}
                        token={token}
                        allUsers={users}
                        hasSavedTasks={savedTasks.length > 0}
                        setIsDelete={setIsDelete}
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
                )}

                <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white text-[12px]">
                    <button
                        type="submit"
                        className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-[100px]"
                        disabled={isSubmitting}
                    >
                        {loading || editLoading
                            ? "Processing..."
                            : isEdit
                                ? "Update"
                                : "Create"}
                    </button>

                    {!isEdit &&
                        (isFormEmpty() ? (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2 w-max"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-max"
                                onClick={handleAddTask}
                                disabled={isSubmitting}
                            >
                                Save & Add New
                            </button>
                        ))}
                </div>
            </div>
        </form>
    );
};

export default ProjectTaskCreateModal;
