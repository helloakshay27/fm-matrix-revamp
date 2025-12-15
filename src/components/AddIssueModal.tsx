import { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { createIssue, fetchIssues } from '@/store/slices/issueSlice';
import { fetchMilestones } from '@/store/slices/projectMilestoneSlice';
import { fetchKanbanProjects } from '@/store/slices/projectManagementSlice';
import { fetchUserAvailability, fetchTargetDateTasks, fetchProjectTasks } from '@/store/slices/projectTasksSlice';
import { toast } from 'sonner';
import { CalendarIcon, X } from 'lucide-react';
import {
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Box,
    TextareaAutosize,
    Dialog,
    DialogContent,
    Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { TaskDatePicker } from '@/components/TaskDatePicker';
import TasksOfDate from '@/components/TasksOfDate';
import { CustomCalender } from '@/components/CustomCalender';
import { DurationPicker } from '@/components/DurationPicker';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const globalPriorityOptions = [
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Urgent' },
];

const Attachments = ({ attachments, setAttachments }) => {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (!selectedFiles?.length) return;

        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);
        setAttachments([...attachments, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);

        const updatedAttachments = [...attachments];
        updatedAttachments.splice(index, 1);
        setAttachments(updatedAttachments);
    };

    const isImage = (file) => file.type.startsWith('image/');
    const getFileUrl = (file) => URL.createObjectURL(file);

    return (
        <Box className="flex flex-col gap-2">
            <Box className="flex justify-between items-center border h-[45px] px-3 rounded-md">
                <span className="text-[14px] text-gray-500">
                    {files?.length === 0 && <i>No Documents Attached</i>}
                </span>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#C72030', textTransform: 'none' }}
                    onClick={handleAttachFile}
                >
                    Attach Files
                </Button>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </Box>
            {files?.length > 0 && (
                <Box className="flex flex-wrap gap-4 mt-2">
                    {files.map((file, index) => (
                        <Box key={index} className="relative w-[80px] h-[80px] border rounded-md">
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 text-lg flex items-center justify-center shadow-lg"
                                title="Remove"
                            >
                                ×
                            </button>
                            {isImage(file) ? (
                                <img
                                    src={getFileUrl(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Box className="text-xs text-gray-800 px-2 py-1 h-full flex items-center justify-center bg-gray-100">
                                    📄 {file.name}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

const AddIssueModal = ({ openDialog, handleCloseDialog }) => {
    const [title, setTitle] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newIssuesProjectId, setNewIssuesProjectId] = useState('');
    const [newIssuesMilestoneId, setNewIssuesMilestoneId] = useState('');
    const [newIssuesTaskId, setNewIssuesTaskId] = useState('');
    // Add state for subtask ID and subtask options
    const [newIssuesSubtaskId, setNewIssuesSubtaskId] = useState('');
    const [subtaskOptions, setSubtaskOptions] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [users, setUsers] = useState([])

    // Date picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showCalender, setShowCalender] = useState(false);
    const [showStartCalender, setShowStartCalender] = useState(false);
    const [startDateTasks, setStartDateTasks] = useState([]);
    const [targetDateTasks, setTargetDateTasks] = useState([]);
    const [calendarTaskHours, setCalendarTaskHours] = useState([]);
    const [issueDuration, setIssueDuration] = useState();
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const [dateWiseHours, setDateWiseHours] = useState([]);

    console.log(dateWiseHours);

    const isSubmittingRef = useRef(false);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const collapsibleRef = useRef(null);
    const startCollapsibleRef = useRef(null);

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const { data: userAvailability = [] } = useAppSelector(
        (state: any) => state.fetchUserAvailability || { data: [], loading: false }
    );

    const {
        data: projects = { project_managements: [] },
        loading: loadingProjects,
        error: projectsFetchError,
    } = useAppSelector(
        (state) => state.fetchKanbanProjects);

    const {
        data: milestone = [],
        loading: loadingMilestone,
        error: milestoneFetchError,
    } = useAppSelector(
        (state: any) => state.fetchMilestones || { data: [], loading: false, error: null }
    );

    const {
        data: tasks = [],
        loading: loadingTasks,
        error: tasksFetchError,
    } = useAppSelector(
        (state: any) => state.fetchProjectTasks || { data: [], loading: false, error: null }
    );

    const [projectOptions, setProjectOptions] = useState([]);
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    const [shift, setShift] = useState({});

    const dispatch = useAppDispatch();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await dispatch(fetchFMUsers()).unwrap();
                setUsers(response.users || []);
            } catch (error) {
                console.log(error)
            }
        }
        getUsers();
    }, []);

    const fetchShifts = useCallback(async (userId: string) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/user_shifts.json?user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShift(response.data.user_shifts || {});
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    }, [baseUrl, token]);

    // Expand/collapse calendar when showDatePicker changes
    useEffect(() => {
        const el = collapsibleRef.current;
        if (!el) return;

        if (showDatePicker) {
            el.style.height = 'auto';
            el.style.opacity = '1';
        } else {
            el.style.height = '0';
            el.style.opacity = '0';
        }
    }, [showDatePicker]);

    // Expand/collapse calendar when showStartDatePicker changes
    useEffect(() => {
        const el = startCollapsibleRef.current;
        if (!el) return;

        if (showStartDatePicker) {
            el.style.height = 'auto';
            el.style.opacity = '1';
        } else {
            el.style.height = '0';
            el.style.opacity = '0';
        }
    }, [showStartDatePicker]);

    // Set calendar task hours from user availability
    useEffect(() => {
        if (userAvailability.length > 0) {
            const formattedHours = userAvailability.map((dayData) => ({
                date: dayData.date,
                hours: dayData.allocated_hours,
            }));
            setCalendarTaskHours(formattedHours);
        }
    }, [userAvailability]);

    // Fetch tasks for start date
    // Fetch tasks for start date
    useEffect(() => {
        const getStartDateTasks = async () => {
            if (!startDate) return;

            const formattedStartDate = `${startDate.year}-${String(startDate.month + 1).padStart(
                2,
                '0'
            )}-${String(startDate.date).padStart(2, '0')}`;

            try {
                const response = await dispatch(
                    fetchTargetDateTasks({
                        baseUrl,
                        token,
                        id: responsiblePerson,
                        date: formattedStartDate,
                    }) as any
                );
                if (response?.payload) {
                    setStartDateTasks([...(response.payload.tasks || []), ...(response.payload.issues || [])]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (responsiblePerson && startDate) {
            getStartDateTasks();
        }
    }, [responsiblePerson, startDate, dispatch, baseUrl, token]);

    // Fetch tasks for end date
    useEffect(() => {
        const getTargetDateTasks = async () => {
            if (!endDate) return;

            const formattedEndDate = `${endDate.year}-${String(endDate.month + 1).padStart(
                2,
                '0'
            )}-${String(endDate.date).padStart(2, '0')}`;

            try {
                const response = await dispatch(
                    fetchTargetDateTasks({
                        baseUrl,
                        token,
                        id: responsiblePerson,
                        date: formattedEndDate,
                    }) as any
                );
                if (response?.payload) {
                    setTargetDateTasks([...(response.payload.tasks || []), ...(response.payload.issues || [])]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (responsiblePerson && endDate) {
            getTargetDateTasks();
        }
    }, [responsiblePerson, endDate, dispatch, baseUrl, token]);

    // Fetch issue types
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/issue_types.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const issueTypes = response.data.issue_types || response.data || [];
                setIssueTypeOptions(
                    issueTypes.map((i: any) => ({
                        value: i.id,
                        label: i.name,
                    }))
                );
            } catch (error) {
                console.error('Error fetching issue types:', error);
                toast.error('Failed to load issue types.');
            }
        };

        if (baseUrl && token) {
            fetchData();
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (!loadingMilestone && milestoneOptions?.length > 0 && !milestoneFetchError) {
            setNewIssuesTaskId('');
            setTaskOptions([]);
            // Clear subtask options and selection when milestone changes
            setNewIssuesSubtaskId('');
            setSubtaskOptions([]);
        }
    }, [loadingMilestone, milestoneFetchError, newIssuesMilestoneId, milestoneOptions]);

    useEffect(() => {
        if (!loadingTasks && !tasksFetchError && tasks.task_managements?.length > 0) {
            setTaskOptions(
                tasks.task_managements.map((t: any) => ({
                    value: t.id,
                    label: t.title,
                }))
            );
        }
    }, [tasks, loadingTasks, tasksFetchError]);



    useEffect(() => {
        if (newIssuesMilestoneId && milestoneOptions?.length > 0) {
            dispatch(fetchProjectTasks({ baseUrl, token, id: newIssuesMilestoneId }) as any);
        }
    }, [newIssuesMilestoneId])

    // New effect to handle subtask options when task is selected
    useEffect(() => {
        if (newIssuesTaskId) {
            let selectedTask = null;

            // Check if tasks is an array or object with task_managements property
            const tasksList = Array.isArray(tasks) ? tasks : (tasks?.task_managements || []);

            if (tasksList && tasksList.length > 0) {
                selectedTask = tasksList.find((t: any) => t.id === newIssuesTaskId);
            }

            if (
                selectedTask &&
                selectedTask.sub_tasks_managements &&
                Array.isArray(selectedTask.sub_tasks_managements) &&
                selectedTask.sub_tasks_managements.length > 0
            ) {
                setSubtaskOptions(
                    selectedTask.sub_tasks_managements.map((subtask: any) => ({
                        value: subtask.id,
                        label: subtask.title,
                    }))
                );
            } else {
                setSubtaskOptions([]);
            }
            // Reset subtask selection when task changes
            setNewIssuesSubtaskId('');
        } else {
            setSubtaskOptions([]);
            setNewIssuesSubtaskId('');
        }
    }, [newIssuesTaskId, tasks]);

    useEffect(() => {
        if (newIssuesProjectId && newIssuesProjectId !== '') {
            dispatch(fetchMilestones({ baseUrl, token, id: newIssuesProjectId }) as any);
            setNewIssuesMilestoneId('');
            setMilestoneOptions([]);
            setNewIssuesTaskId('');
            setTaskOptions([]);
            // Clear subtask options and selection when project changes
            setNewIssuesSubtaskId('');
            setSubtaskOptions([]);
        }
    }, [newIssuesProjectId, dispatch, baseUrl, token]);

    useEffect(() => {
        dispatch(fetchKanbanProjects({ baseUrl, token }) as any);
    }, [dispatch, baseUrl, token]);

    useEffect(() => {
        if (
            !loadingProjects &&
            projects &&
            (projects as any).project_managements &&
            Array.isArray((projects as any).project_managements) &&
            (projects as any).project_managements.length > 0
        ) {
            const projectList = (projects as any).project_managements.map((project: any) => ({
                value: project.id,
                label: project.title || project.name,
            }));
            setProjectOptions(projectList);
        }
    }, [projects, loadingProjects]);

    useEffect(() => {
        if (
            !loadingMilestone &&
            !milestoneFetchError &&
            milestone &&
            (Array.isArray(milestone) && milestone.length > 0)
        ) {
            setMilestoneOptions(
                milestone?.map((m: any) => ({
                    value: m.id,
                    label: m.title || m.name,
                }))
            );
        }
    }, [milestone, loadingMilestone, milestoneFetchError]);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            toast.dismiss();
            if (isSubmittingRef.current) return;

            if (!title.trim()) {
                toast.error('Title is required');
                return;
            }
            if (!responsiblePerson) {
                toast.error('Responsible Person is required');
                return;
            }
            // if (!type) {
            //     toast.error('Issue Type is required');
            //     return;
            // }
            if (!priority) {
                toast.error('Priority is required');
                return;
            }
            if (!endDate) {
                toast.error('End Date is required');
                return;
            }
            if (!comments.trim()) {
                toast.error('Comment is required');
                return;
            }

            setIsSubmitting(true);
            isSubmittingRef.current = true;
            const formData = new FormData();

            const formattedStartDate = startDate
                ? `${startDate.year}-${String(startDate.month + 1).padStart(2, '0')}-${String(
                    startDate.date
                ).padStart(2, '0')}`
                : '';

            const formattedEndDate = `${endDate.year}-${String(endDate.month + 1).padStart(
                2,
                '0'
            )}-${String(endDate.date).padStart(2, '0')}`;

            formData.append('issue[title]', title.trim());
            formData.append('issue[status]', 'open');
            formData.append('issue[responsible_person_id]', responsiblePerson);
            formData.append('issue[project_management_id]', newIssuesProjectId || '');
            formData.append('issue[milestone_id]', newIssuesMilestoneId || '');
            formData.append('issue[task_management_id]', newIssuesSubtaskId || newIssuesTaskId || '');
            formData.append('issue[description]', description || '');
            formData.append('issue[start_date]', formattedStartDate || '');
            formData.append('issue[end_date]', formattedEndDate || '');
            formData.append(
                'issue[priority]',
                String(globalPriorityOptions.find((option) => String(option.value) === String(priority))?.label || '')
            );
            formData.append('issue[created_by_id]', JSON.parse(localStorage.getItem('user') || '{}')?.id || '');
            formData.append('issue[issue_type]', String(type || ''));
            formData.append('issue[comment]', comments || '');
            formData.append('issue[estimated_hour]', String(totalWorkingHours || 0));
            // formData.append("issue[issue_allocation_times_attributes]", dateWiseHours);
            dateWiseHours.map((date: any) => {
                formData.append('issue[issue_allocation_times_attributes][][hours]', String(date.hours));
                formData.append('issue[issue_allocation_times_attributes][][minutes]', String(date.minutes));
                formData.append('issue[issue_allocation_times_attributes][][date]', date.date);
            });
            attachments.forEach((file: any) => {
                formData.append('issue[attachments][]', file);
            });

            try {
                await dispatch(createIssue({ baseUrl, token, data: formData }) as any);
                dispatch(fetchIssues({ baseUrl, token, id: newIssuesProjectId || '' }) as any);
                handleCloseDialog();
                toast.success('Issue created successfully!');
            } catch (error: any) {
                console.error('Error submitting Issue:', error);
                toast.error(`Issue creation failed: ${error.message || 'Unknown error'}`);
            } finally {
                setIsSubmitting(false);
                isSubmittingRef.current = false;
            }
        },
        [
            dispatch,
            title,
            responsiblePerson,
            endDate,
            startDate,
            priority,
            comments,
            type,
            newIssuesProjectId,
            newIssuesMilestoneId,
            newIssuesTaskId,
            newIssuesSubtaskId,
            attachments,
            handleCloseDialog,
            totalWorkingHours,
            dateWiseHours,
            baseUrl,
            token,
        ]
    );

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[35rem] fixed right-0 top-0 rounded-none bg-[#fff] text-sm"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <h3 className="text-[14px] font-medium text-center mt-8">New Issue</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={handleCloseDialog}
                />

                <hr className="border border-[#E95420] mt-4" />

                <form className="pt-2 pb-12" onSubmit={handleSubmit}>
                    <Box
                        id="addTask"
                        sx={{ height: 'calc(100vh - 110px)', overflowY: 'auto', pr: 1.5, fontSize: '12px', pl: 2, pt: 2 }}
                    >
                        {/* Title Field */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter Issue Title"
                                required
                                variant="outlined"
                            />
                        </Box>

                        {/* Project and Milestone */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Project</InputLabel>
                                <Select
                                    value={newIssuesProjectId}
                                    onChange={(e) => setNewIssuesProjectId(e.target.value)}
                                    label="Project"
                                >
                                    <MenuItem value="">
                                        <em>Select Project</em>
                                    </MenuItem>
                                    {projectOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Milestone</InputLabel>
                                <Select
                                    value={newIssuesMilestoneId}
                                    onChange={(e) => setNewIssuesMilestoneId(e.target.value)}
                                    label="Milestone"
                                >
                                    <MenuItem value="">
                                        <em>Select Milestone</em>
                                    </MenuItem>
                                    {milestoneOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Task and Subtask */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Task</InputLabel>
                                <Select
                                    value={newIssuesTaskId}
                                    onChange={(e) => setNewIssuesTaskId(e.target.value)}
                                    label="Task"
                                >
                                    <MenuItem value="">
                                        <em>Select Task</em>
                                    </MenuItem>
                                    {taskOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Subtask</InputLabel>
                                <Select
                                    value={newIssuesSubtaskId}
                                    onChange={(e) => setNewIssuesSubtaskId(e.target.value)}
                                    label="Subtask"
                                >
                                    <MenuItem value="">
                                        <em>Select Subtask</em>
                                    </MenuItem>
                                    {subtaskOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Description */}
                        <Box sx={{ mb: 2 }}>
                            <TextareaAutosize
                                minRows={4}
                                maxRows={6}
                                placeholder="Enter Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    fontFamily: 'Roboto, sans-serif',
                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                    borderRadius: '4px',
                                }}
                            />
                        </Box>

                        {/* Responsible Person */}
                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Responsible Person</InputLabel>
                                <Select
                                    value={responsiblePerson}
                                    onChange={(e) => {
                                        setResponsiblePerson(e.target.value);
                                        if (e.target.value) {
                                            dispatch(fetchUserAvailability({ baseUrl, token, id: e.target.value }) as any);
                                            fetchShifts(e.target.value);
                                        }
                                    }}
                                    label="Responsible Person"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Responsible Person</em>
                                    </MenuItem>
                                    {users &&
                                        users.map((user: any) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.full_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Dates Section */}
                        {/* <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '12px' }}>
                            <Box sx={{ flex: 1 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        if (showStartDatePicker) {
                                            setShowStartDatePicker(false);
                                        }
                                        setShowDatePicker(!showDatePicker);
                                    }}
                                    ref={endDateRef}
                                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                >
                                    {endDate ? (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>
                                                End Date : {endDate.date.toString().padStart(2, '0')}{' '}
                                                {monthNames[endDate.month]}
                                            </span>
                                            <X
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEndDate(null);
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <CalendarIcon className="w-4 h-4" /> Select End Date
                                        </Box>
                                    )}
                                </Button>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        if (showDatePicker) {
                                            setShowDatePicker(false);
                                        }
                                        setShowStartDatePicker(!showStartDatePicker);
                                    }}
                                    ref={startDateRef}
                                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                >
                                    {startDate ? (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>
                                                Start Date : {startDate?.date?.toString().padStart(2, '0')}{' '}
                                                {monthNames[startDate.month]}
                                            </span>
                                            <X
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setStartDate(null);
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <CalendarIcon className="w-4 h-4" /> Select Start Date
                                        </Box>
                                    )}
                                </Button>
                            </Box>
                        </Box> */}

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

                        {/* Efforts Duration */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ fontSize: '12px', mb: 1 }}>Efforts Duration</Box>
                            <DurationPicker
                                dateWiseHours={[]}
                                onChange={setIssueDuration}
                                onDateWiseHoursChange={setDateWiseHours}
                                startDate={startDate}
                                endDate={endDate}
                                resposiblePerson={
                                    responsiblePerson ? users.find((u) => u.id === responsiblePerson)?.full_name : ''
                                }
                                totalWorkingHours={totalWorkingHours}
                                setTotalWorkingHours={setTotalWorkingHours}
                                shift={shift}
                            />
                        </Box>

                        {/* Calendar and Date Pickers */}
                        <Box
                            ref={startCollapsibleRef}
                            sx={{ overflow: 'hidden', opacity: 0, height: 0, willChange: 'height, opacity' }}
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
                                    selectedUser={responsiblePerson}
                                    userAvailability={userAvailability}
                                />
                            )}
                        </Box>

                        <Box
                            ref={collapsibleRef}
                            sx={{ overflow: 'hidden', opacity: 0, height: 0, willChange: 'height, opacity' }}
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
                                    selectedUser={responsiblePerson}
                                    userAvailability={userAvailability}
                                />
                            )}
                        </Box>

                        {/* Type and Priority */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    label="Type"
                                >
                                    <MenuItem value="">
                                        <em>Select Type</em>
                                    </MenuItem>
                                    {issueTypeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small" required>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    label="Priority"
                                >
                                    <MenuItem value="">
                                        <em>Select Priority</em>
                                    </MenuItem>
                                    {globalPriorityOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Comment */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Comment"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter Comment"
                                required
                                variant="outlined"
                            />
                        </Box>

                        {/* Attachments */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ fontSize: '12px', mb: 1 }}>Attachments</Box>
                            <Attachments attachments={attachments} setAttachments={setAttachments} />
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 5, mb: 3 }}>
                            <Button
                                type="submit"
                                variant="outlined"
                                disabled={isSubmitting}
                                sx={{
                                    borderColor: '#C72030',
                                    color: '#C72030',
                                    px: 4,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: '#C72030',
                                        backgroundColor: 'rgba(199, 32, 48, 0.04)',
                                    },
                                }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddIssueModal;
