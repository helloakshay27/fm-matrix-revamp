import {
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    MenuList,
    IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CalendarIcon, X, Mic, MicOff } from "lucide-react";
import Quill from "quill";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DurationPicker } from "./DurationPicker";
import { CustomCalender } from "./CustomCalender";
import { TaskDatePicker } from "./TaskDatePicker";
import TasksOfDate from "./TasksOfDate";
import MuiMultiSelect from "./MuiMultiSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import {
    removeTagFromProject,
    fetchProjectById,
    fetchKanbanProjects,
} from "@/store/slices/projectManagementSlice";
import {
    createProjectTask,
    fetchProjectTasksById,
    fetchTargetDateTasks,
    fetchUserAvailability,
} from "@/store/slices/projectTasksSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import {
    fetchMilestoneById,
    fetchMilestones,
} from "@/store/slices/projectMilestoneSlice";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface SubTask {
    estimated_hour?: number;
}

interface ParentTask {
    estimated_hour?: number;
    sub_tasks_managements?: SubTask[];
    project_management_id?: number | string;
    project_milestone_id?: number | string;
    project_milestone?: {
        id: number | string;
        name: string;
    };
    project_management?: {
        id: number | string;
        title: string;
    };
}

// Virtualized wrapper for task rendering
const VirtualizedTaskMenuContent = ({
    tasks,
    renderItem,
}: {
    tasks: any[];
    renderItem: (task: any) => React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 35,
        measureElement: (el) => el?.getBoundingClientRect().height,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    if (!tasks.length || tasks.length < 10) {
        return <>{tasks.map((task) => renderItem(task))}</>;
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: "300px",
                overflow: "auto",
                scrollbarWidth: "thin",
            }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualItems.map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        data-index={virtualItem.index}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        {renderItem(tasks[virtualItem.index])}
                    </div>
                ))}
            </div>
        </div>
    );
};

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
    isInlineMode = false,
    isSubSubtask = false,
    subTasks = [],
    selectedParentTaskId,
    setSelectedParentTaskId,
}) => {
    const { data: userAvailabilityData } = useAppSelector(
        (state) => state.fetchUserAvailability
    );
    const userAvailability = Array.isArray(userAvailabilityData)
        ? userAvailabilityData
        : [];

    const {
        isListening,
        activeId,
        transcript,
        supported,
        startListening,
        stopListening,
    } = useSpeechToText();
    const [baseValue, setBaseValue] = useState("");
    const quillRef = useRef<HTMLDivElement>(null);
    const quillEditorRef = useRef<Quill | null>(null);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const [shift, setShift] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [startDateTasks, setStartDateTasks] = useState([]);
    const [targetDateTasks, setTargetDateTasks] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [showStartCalender, setShowStartCalender] = useState(false);
    const [calendarTaskHours, setCalendarTaskHours] = useState([]);

    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);

    // Handle STT for Description
    useEffect(() => {
        if (isListening && transcript && activeId === "subtask-description") {
            const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
            if (quillEditorRef.current) {
                const formattedValue = newValue.startsWith("<")
                    ? newValue
                    : `<p>${newValue}</p>`;
                quillEditorRef.current.root.innerHTML = formattedValue;
                setFormData((prev) => ({
                    ...prev,
                    description: formattedValue,
                }));
            }
        }
    }, [isListening, transcript, activeId, baseValue, setFormData]);

    // Initialize Quill Editor
    useEffect(() => {
        if (quillRef.current && !quillEditorRef.current) {
            quillEditorRef.current = new Quill(quillRef.current, {
                theme: "snow",
                placeholder: "Enter Description...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });

            // Handle text changes
            quillEditorRef.current.on("text-change", () => {
                const htmlContent = quillEditorRef.current?.root.innerHTML;
                setFormData((prev) => ({
                    ...prev,
                    description: htmlContent || "",
                }));
            });
        }
    }, [setFormData]);

    // Update Quill editor when description changes
    useEffect(() => {
        if (quillEditorRef.current && formData.description) {
            const currentContent = quillEditorRef.current.root.innerHTML;
            if (currentContent !== formData.description) {
                quillEditorRef.current.root.innerHTML = formData.description;
            }
        }
    }, [formData.description]);

    const fetchShifts = async (id) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/user_shifts.json?user_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShift(response.data.user_shifts);
        } catch (error) {
            console.log(error);
        }
    };

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
                startCollapsibleRef.current.style.height = "auto";
                startCollapsibleRef.current.style.opacity = "1";
            } else {
                startCollapsibleRef.current.style.height = "0";
                startCollapsibleRef.current.style.opacity = "0";
            }
        }
    }, [showStartDatePicker]);

    useEffect(() => {
        if (collapsibleRef.current) {
            if (showDatePicker) {
                collapsibleRef.current.style.height = "auto";
                collapsibleRef.current.style.opacity = "1";
            } else {
                collapsibleRef.current.style.height = "0";
                collapsibleRef.current.style.opacity = "0";
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
        <div className={`${isInlineMode ? "p-0" : "p-4"} bg-white relative`}>
            {
                isSubSubtask && (
                    <div className="mb-4">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel shrink>Subtask *</InputLabel>
                            <Select
                                label="Subtask *"
                                name="subtask"
                                value={selectedParentTaskId}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedParentTaskId(value);
                                }}
                                displayEmpty
                                sx={fieldStyles}
                            >
                                <MenuItem value="">
                                    <em>Select Subtask</em>
                                </MenuItem>
                                {subTasks?.map((subtask: any) => (
                                    <MenuItem key={subtask?.id} value={subtask?.id}>
                                        {subtask?.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                )
            }
            <div className="mb-1">
                <TextField
                    fullWidth
                    label={isSubSubtask ? "Sub-Subtask Title *" : "Subtask Title *"}
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
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Description</label>
                    {supported && (
                        <IconButton
                            size="small"
                            onClick={() => {
                                if (isListening && activeId === "subtask-description") {
                                    stopListening();
                                } else {
                                    const currentText = quillEditorRef.current
                                        ? quillEditorRef.current.root.innerHTML
                                        : formData.description;
                                    setBaseValue(
                                        currentText === "<p><br></p>" ? "" : currentText
                                    );
                                    startListening("subtask-description");
                                }
                            }}
                            color={
                                isListening && activeId === "subtask-description"
                                    ? "secondary"
                                    : "default"
                            }
                            sx={{
                                color:
                                    isListening && activeId === "subtask-description"
                                        ? "#C72030"
                                        : "inherit",
                            }}
                        >
                            {isListening && activeId === "subtask-description" ? (
                                <Mic size={18} />
                            ) : (
                                <MicOff size={18} />
                            )}
                        </IconButton>
                    )}
                </div>
                <div
                    ref={quillRef}
                    style={{
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        borderRadius: "4px",
                        minHeight: "150px",
                    }}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 mb-3 mt-6">
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
                                        selectedUser?.user?.full_name ||
                                        selectedUser?.full_name ||
                                        "",
                                });
                                if (value) {
                                    dispatch(
                                        fetchUserAvailability({ baseUrl, token, id: value })
                                    );
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
                    <label className="block text-xs text-gray-700 mb-1">
                        Target Date *
                    </label>
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
                                    Target Date : {endDate.date.toString().padStart(2, "0")}{" "}
                                    {monthNames[endDate.month]}
                                </div>
                                <X
                                    className="w-4 h-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEndDate(null);
                                    }}
                                />
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
                                    Start Date : {startDate?.date?.toString().padStart(2, "0")}{" "}
                                    {monthNames[startDate.month]}
                                </div>
                                <X
                                    className="w-4 h-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setStartDate(null);
                                    }}
                                />
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
                    options={tags.map((tag) => ({
                        value: tag.id,
                        label: tag.name,
                        id: tag.id,
                    }))}
                    value={formData.tags}
                    onChange={(values) => handleMultiSelectChange("tags", values)}
                    placeholder="Select Tags"
                />
            </div>

            <style>{`
                .ql-toolbar {
                    background-color: #fafafa;
                    border: 1px solid rgba(0, 0, 0, 0.23);
                    border-bottom: none;
                    border-radius: 4px 4px 0 0;
                }
                .ql-toolbar button {
                    color: #01569E;
                }
                .ql-toolbar button:hover {
                    color: #C72030;
                    background-color: rgba(199, 32, 48, 0.1);
                }
                .ql-toolbar button.ql-active {
                    color: #C72030;
                    background-color: rgba(199, 32, 48, 0.1);
                }
                .ql-container {
                    font-family: inherit;
                    border: 1px solid rgba(0, 0, 0, 0.23);
                    border-top: none;
                    border-radius: 0 0 4px 4px;
                }
                .ql-editor {
                    min-height: 150px;
                    padding: 10px;
                    font-size: 14px;
                }
                .ql-editor.ql-blank::before {
                    color: rgba(0, 0, 0, 0.4);
                }
            `}</style>
        </div>
    );
};

// Main AddSubtaskModal Component
const AddSubtaskModal = ({
    openTaskModal,
    setOpenTaskModal,
    fetchData,
    parentTaskId: propParentTaskId,
    prefillData: propPrefillData,
    availableTasks: propAvailableTasks,
    isInlineMode = false,
    isSubSubtask = false,
    setIsSubSubtask,
    subTasks = [],
}: {
    openTaskModal: boolean | string;
    setOpenTaskModal: (value: boolean | string) => void;
    fetchData: () => void;
    parentTaskId?: number;
    prefillData?: any;
    availableTasks?: any[];
    isInlineMode?: boolean;
    isSubSubtask?: boolean;
    setIsSubSubtask?: (value: boolean) => void;
    subTasks?: any[];
}) => {
    const { id: pid, mid, taskId: urlTaskId } = useParams();
    const initialParentTaskId = propParentTaskId || urlTaskId;
    const [selectedParentTaskId, setSelectedParentTaskId] = useState<
        number | null
    >(initialParentTaskId ? Number(initialParentTaskId) : null);
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const dispatch = useAppDispatch();

    const { data: parentTask } = useAppSelector(
        (state) => state.fetchProjectTasksById
    ) as { data: ParentTask | undefined };
    const { data: project } = useAppSelector((state) => state.fetchProjectById);
    const { data: milestone } = useAppSelector(
        (state) => state.fetchMilestoneById
    );

    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [availableTasks, setAvailableTasks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [taskDuration, setTaskDuration] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const [dateWiseHours, setDateWiseHours] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [prevTags, setPrevTags] = useState([]);
    const [formData, setFormData] = useState({
        title: propPrefillData?.title || "",
        description: propPrefillData?.description || "",
        responsiblePerson: propPrefillData?.responsiblePerson || "",
        responsiblePersonName: "",
        priority: "",
        tags: propPrefillData?.tags || [],
    });

    const getTags = async () => {
        try {
            const response = await dispatch(fetchProjectsTags({ active: true })).unwrap();
            setTags(response);
        } catch (error) {
            console.log(error);
        }
    };

    const getProjects = async () => {
        try {
            const response = await dispatch(
                fetchKanbanProjects({ baseUrl, token })
            ).unwrap();
            setProjects(response.project_managements);
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const validUsers = (response.data.users || []).filter(
                (user: any) => user && user.id
            );
            setUsers(validUsers);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
        getTags();
        getProjects();
    }, []);

    useEffect(() => {
        const fetchParentTask = async () => {
            try {
                if (selectedParentTaskId) {
                    const taskData = await dispatch(
                        fetchProjectTasksById({
                            baseUrl,
                            token,
                            id: String(selectedParentTaskId),
                        })
                    ).unwrap();

                    // Fetch project and milestone data
                    if (taskData?.project_management_id) {
                        dispatch(
                            fetchProjectById({
                                baseUrl,
                                token,
                                id: String(taskData.project_management_id),
                            })
                        );
                        setSelectedProject(String(taskData.project_management_id));
                    }
                    if (taskData?.project_milestone_id) {
                        dispatch(
                            fetchMilestoneById({
                                baseUrl,
                                token,
                                id: String(taskData.project_milestone_id),
                            })
                        );
                        setSelectedMilestone(String(taskData.project_milestone_id));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchParentTask();
    }, [selectedParentTaskId]);

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
        };

        getMilestones();
    }, [selectedProject]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (!selectedMilestone) {
                    queryParams.append(
                        "q[responsible_person_id_eq]",
                        JSON.parse(localStorage.getItem("user"))?.id
                    );
                }
                if (selectedMilestone) {
                    queryParams.append("q[milestone_id_eq]", selectedMilestone);
                }
                const response = await axios.get(
                    `https://${baseUrl}/task_managements/kanban.json?${queryParams.toString()}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const tasks = response.data || [];
                setAvailableTasks(tasks);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch tasks");
            }
        };

        fetchTasks();
    }, [selectedMilestone]);

    const handleCloseModal = () => {
        setOpenTaskModal(false);
        if (isSubSubtask && setIsSubSubtask) {
            setIsSubSubtask(false);
        }
        // Clear form
        setFormData({
            title: "",
            description: "",
            responsiblePerson: "",
            responsiblePersonName: "",
            priority: "",
            tags: [],
        });
        setTotalWorkingHours(0);
        setDateWiseHours([]);
        setStartDate(null);
        setEndDate(null);
        setSelectedProject("");
        setSelectedMilestone("");
        setTaskDuration(null);
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
    };

    const validateSubtaskDuration = () => {
        if (!parentTask) {
            return true; // If parent task data not loaded, skip validation
        }

        const parentEstimatedHours = parentTask.estimated_hour || 0;

        // Calculate total estimated hours of existing subtasks
        const existingSubtasksHours = (
            parentTask.sub_tasks_managements || []
        ).reduce((sum, subtask) => sum + (subtask.estimated_hour || 0), 0);

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

        if (!validateForm()) return;

        if (!validateSubtaskDuration()) return;

        setIsSubmitting(true);
        const formatedStartDate = `${startDate?.year}-${startDate?.month + 1}-${startDate?.date
            }`;
        const formatedEndDate = `${endDate?.year}-${endDate?.month + 1}-${endDate?.date
            }`;
        const payload = {
            task_management: {
                parent_id: selectedParentTaskId,
                title: formData.title,
                description: formData.description,
                responsible_person_id: formData.responsiblePerson,
                expected_start_date: formatedStartDate,
                target_date: formatedEndDate,
                estimated_hour: totalWorkingHours,
                priority: formData.priority,
                task_tag_ids: formData.tags.map((tag) => tag.value),
                task_allocation_times_attributes: dateWiseHours,
                ...(pid && { project_management_id: pid }),
            },
        };
        try {
            await dispatch(
                createProjectTask({ baseUrl, token, data: payload })
            ).unwrap();
            toast.success("Subtask created successfully");
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInlineMode) {
        return (
            <form
                className="pb-6 overflow-y-auto text-[12px] px-4"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between gap-3 mb-4 mt-4">
                    <div className="flex-1">
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Project</InputLabel>
                            <Select
                                label="Project"
                                value={selectedProject || ""}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Project</em>
                                </MenuItem>
                                {projects.map((proj) => (
                                    <MenuItem key={proj.id} value={proj.id}>
                                        {proj.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex-1">
                        <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled={!selectedProject}
                        >
                            <InputLabel>Milestone</InputLabel>
                            <Select
                                label="Milestone"
                                value={selectedMilestone || ""}
                                onChange={(e) => setSelectedMilestone(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Milestone</em>
                                </MenuItem>
                                {milestones.map((mile) => (
                                    <MenuItem key={mile.id} value={mile.id}>
                                        {mile.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="mb-4">
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel shrink>Task</InputLabel>
                        <Select
                            label="Task"
                            value={selectedParentTaskId || ""}
                            onChange={(e) => setSelectedParentTaskId(Number(e.target.value))}
                            displayEmpty
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: "auto",
                                        overflow: "visible",
                                    },
                                },
                            }}
                        >
                            <VirtualizedTaskMenuContent
                                tasks={availableTasks}
                                renderItem={(task) => (
                                    <MenuItem key={task.id} value={task.id}>
                                        {task.title}
                                    </MenuItem>
                                )}
                            />
                        </Select>
                    </FormControl>
                </div>

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
                    isInlineMode={true}
                    selectedParentTaskId={selectedParentTaskId}
                    setSelectedParentTaskId={setSelectedParentTaskId}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => setOpenTaskModal(false)}
                        className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center border-2 text-white bg-[#C72030] border-[#C72030] px-4 py-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Subtask"}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <Dialog
            open={typeof openTaskModal === "boolean" ? openTaskModal : true}
            onClose={handleCloseModal}
            TransitionComponent={Transition}
            maxWidth={false}
        >
            <DialogContent
                className="w-1/2 h-full fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
                style={{
                    margin: 0,
                    maxHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
                sx={{
                    padding: "0 !important",
                    "& .MuiDialogContent-root": {
                        padding: "0 !important",
                        overflow: "auto",
                    },
                }}
            >
                <div className="sticky top-0 bg-white z-10">
                    <h3 className="text-[14px] font-medium text-center mt-8">
                        {isSubSubtask ? "Create Sub-Subtask" : "Create Subtask"}
                    </h3>
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
                                isSubSubtask={isSubSubtask}
                                subTasks={subTasks}
                                selectedParentTaskId={selectedParentTaskId}
                                setSelectedParentTaskId={setSelectedParentTaskId}
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
    );
};

export default AddSubtaskModal;
