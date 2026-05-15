import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { CalendarIcon, X, Mic, MicOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import {
  fetchKanbanProjects,
  fetchProjectById,
  fetchProjects,
  removeTagFromProject,
  removeUserFromProject,
} from "@/store/slices/projectManagementSlice";
import {
  fetchMilestoneById,
  fetchMilestones,
} from "@/store/slices/projectMilestoneSlice";
import {
  createProjectTask,
  editProjectTask,
  fetchProjectTasks,
  fetchTargetDateTasks,
  fetchUserAvailability,
  resetUserAvailability,
} from "@/store/slices/projectTasksSlice";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { DurationPicker } from "./DurationPicker";
import { CustomCalender } from "./CustomCalender";
import { TaskDatePicker } from "./TaskDatePicker";
import TasksOfDate from "./TasksOfDate";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";
import MuiMultiSelect from "./MuiMultiSelect";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { RecurringTaskModal } from "./RecurringTaskModal";
import { AddTagModal } from "./AddTagModal";
import { SpeechInput } from "./SpeechInput";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
  setIsModalOpen,
  setIsTagModalOpen,
  isConversion,
  attachments,
  setAttachments
}) => {
  const { data: userAvailabilityData } = useAppSelector(
    (state) => state.fetchUserAvailability
  );
  const userAvailability = Array.isArray(userAvailabilityData)
    ? userAvailabilityData
    : [];

  // Helper function to get file type icon and color
  const getFileTypeInfo = useCallback((fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    if (['pdf'].includes(ext)) {
      return { icon: PictureAsPdfIcon, color: '#DC2626', bgColor: '#FEE2E2', type: 'PDF' };
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return { icon: ImageIcon, color: '#2563EB', bgColor: '#DBEAFE', type: 'Image' };
    }
    if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext)) {
      return { icon: AudioFileIcon, color: '#9333EA', bgColor: '#F3E8FF', type: 'Audio' };
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
      return { icon: VideoLibraryIcon, color: '#EA580C', bgColor: '#FFEDD5', type: 'Video' };
    }
    if (['doc', 'docx', 'txt', 'rtf', 'xlsx', 'xls', 'csv', 'ppt', 'pptx'].includes(ext)) {
      return { icon: DescriptionIcon, color: '#16A34A', bgColor: '#DCFCE7', type: 'Document' };
    }
    return { icon: AttachFileIcon, color: '#6B7280', bgColor: '#F3F4F6', type: 'File' };
  }, []);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };
  const baseUrl = localStorage.getItem("baseUrl");

  const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
  const [baseValue, setBaseValue] = useState("");
  const quillRef = useRef<HTMLDivElement>(null);
  const quillEditorRef = useRef<Quill | null>(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDropRef = useRef<HTMLDivElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const [shift, setShift] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDatePickerInterface, setShowDatePickerInterface] = useState(false);
  const [showStartDatePickerInterface, setShowStartDatePickerInterface] = useState(false);
  const [startDateTasks, setStartDateTasks] = useState([]);
  const [targetDateTasks, setTargetDateTasks] = useState([]);
  const [showCalender, setShowCalender] = useState(false);
  const [rosterData, setRosterData] = useState(null);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [showStartCalender, setShowStartCalender] = useState(false);
  const [calendarTaskHours, setCalendarTaskHours] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
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
      const response = await dispatch(
        fetchKanbanProjects({ baseUrl, token })
      ).unwrap();
      setProjects(response.project_managements);
    } catch (error) {
      console.log(error);
    }
  };

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
    if (formData.responsiblePerson) {
      fetchShifts(formData.responsiblePerson);
      fetchUserAvailability({ baseUrl, token, id: formData.responsiblePerson });
    }
  }, [formData.responsiblePerson]);

  const fetchRosterData = async (userId) => {
    setLoadingRoster(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/user_roasters/${userId}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRosterData(response.data);
    } catch (error) {
      console.log('Error fetching roster:', error);
      // If roster not found, set to null to use default Monday-Friday
      setRosterData(null);
    } finally {
      setLoadingRoster(false);
    }
  };

  // Validate file sizes - max 10MB per file
  const validateAndAddFiles = (filesToAdd: File[]) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    filesToAdd.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (${formatFileSize(file.size)})`);
      } else {
        validFiles.push(file);
      }
    });

    // Show error for oversized files
    if (invalidFiles.length > 0) {
      toast.dismiss();
      invalidFiles.forEach((fileName) => {
        toast.error(`${fileName} exceeds 10MB limit`);
      });
    }

    // Add valid files
    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
      toast.dismiss();
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files || []) as File[];
    if (files.length > 0) {
      validateAndAddFiles(files);
    }
  };

  // Function to check if a date should be disabled based on roster
  const isDateDisabledByRoster = (year, month, date) => {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dateObj = new Date(year, month, date);
    const dayOfWeek = dateObj.getDay();

    // Convert to roster day format (1 = Monday, 7 = Sunday)
    const rosterDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Default: Monday-Saturday if no roster data
    if (!rosterData || !rosterData.no_of_days || rosterData.no_of_days.length === 0) {
      // Disable only Sunday (Sunday = 0)
      return dayOfWeek === 0;
    }

    // Get week number of the month (1-5)
    const dayOfMonth = date;
    const weekNumber = Math.ceil(dayOfMonth / 7);

    const rosterSchedule = rosterData.no_of_days[0];
    const workingDays = rosterSchedule[weekNumber.toString()] || [];

    // If this day of week is not in the working days array, disable it
    return !workingDays.includes(rosterDay.toString());
  };

  // Handle STT for Description
  useEffect(() => {
    if (isListening && transcript && activeId === "task-description") {
      const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
      if (quillEditorRef.current) {
        const formattedValue = newValue.startsWith("<") ? newValue : `<p>${newValue}</p>`;
        quillEditorRef.current.root.innerHTML = formattedValue;
        setFormData(prev => ({
          ...prev,
          description: formattedValue,
        }));
      }
    }
  }, [isListening, transcript, activeId, baseValue, setFormData]);

  // Initialize Quill Editor
  useEffect(() => {
    if (quillRef.current && !quillEditorRef.current) {
      // Clear previous instance if it exists
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
      }

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

      // Set initial description if exists
      if (formData.description) {
        quillEditorRef.current.root.innerHTML = formData.description;
      }

      // Handle text changes
      quillEditorRef.current.on("text-change", () => {
        const htmlContent = quillEditorRef.current?.root.innerHTML;
        setFormData((prev) => ({
          ...prev,
          description: htmlContent || "",
        }));
      });
    }
  }, [formData.description, setFormData]);

  useEffect(() => {
    getProjects();
  }, []);

  // Set start date to today by default
  useEffect(() => {
    if (!startDate && !isEdit) {
      const today = new Date();
      setStartDate({
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
      });
    }
  }, []);

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
      {project &&
        milestone &&
        !Array.isArray(project) &&
        !Array.isArray(milestone) &&
        project.title &&
        milestone.title ? (
        <div className="flex items-center justify-between gap-3 mb-4 mt-4">
          <div className="w-full">
            <TextField
              fullWidth
              label="Project *"
              value={project.title}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
              disabled
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
              disabled
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
                value={formData.project || ""}
                onChange={handleChange}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Project</em>
                </MenuItem>
                {projects && projects.length > 0 ? (
                  projects?.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Projects Available</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Milestone</InputLabel>
              <Select
                label="Milestone"
                name="milestone"
                value={formData.milestone || ""}
                onChange={handleChange}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Milestone</em>
                </MenuItem>
                {milestones.map((milestone) => (
                  <MenuItem key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      )}

      <div className="mb-1">
        <SpeechInput
          fullWidth
          label={
            <>
              Task Title<span className="text-red-500">*</span>
            </>
          }
          name="taskTitle"
          placeholder="Enter Task Title"
          value={formData.taskTitle}
          onChange={(value) => setFormData({ ...formData, taskTitle: value })}
          disabled={isReadOnly}
          variant="outlined"
          size="small"
          sx={fieldStyles}
        />
      </div>

      <div className="mb-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">
            Description<span className="text-red-500">*</span>
          </label>
          {supported && (
            <IconButton
              size="small"
              onClick={() => {
                if (isListening && activeId === "task-description") {
                  stopListening();
                } else {
                  const currentText = quillEditorRef.current
                    ? quillEditorRef.current.root.innerHTML
                    : formData.description;
                  setBaseValue(currentText === "<p><br></p>" ? "" : currentText);
                  startListening("task-description");
                }
              }}
              color={isListening && activeId === "task-description" ? "secondary" : "default"}
              sx={{ color: isListening && activeId === "task-description" ? "#C72030" : "inherit" }}
              disabled={isReadOnly}
            >
              {isListening && activeId === "task-description" ? (
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
            opacity: isReadOnly ? 0.5 : 1,
            pointerEvents: isReadOnly ? "none" : "auto",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 mt-6">
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>
              Responsible Person<span className="text-red-500">*</span>
            </InputLabel>
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
                    selectedUser?.name ||
                    "",
                });
                if (!isReadOnly && value) {
                  dispatch(
                    fetchUserAvailability({ baseUrl, token, id: value })
                  );
                  fetchShifts(value);
                  // Fetch roster data using user_roaster_id if available
                  if (selectedUser?.user_roaster_id) {
                    fetchRosterData(selectedUser.user_roaster_id);
                  } else {
                    // If no roster ID, set to null to use default working days
                    setRosterData(null);
                  }
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
                  {user.name ? user.name : user?.full_name}
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
              users?.find(
                (user: any) => user?.id === formData.responsiblePerson
              )?.role || users?.find(
                (user: any) => user?.id === formData.responsiblePerson
              )?.role_name || ""
            }
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={fieldStyles}
          />
        </div>
      </div>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isRecurring}
            onChange={(e) => {
              setFormData({ ...formData, isRecurring: e.target.checked });
              if (e.target.checked) {
                setIsModalOpen(true);
              }
            }}
          />
        }
        label="Recurring Task"
      />

      <div className="grid grid-cols-2 gap-3 my-3">
        <div>
          <label className="block text-xs text-gray-700 mb-1">
            Target Date<span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
            onClick={() => {
              if (showStartDatePicker) {
                setShowStartDatePicker(false);
              }
              setShowDatePicker(true);
              setShowDatePickerInterface(true);
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
                    setShowDatePickerInterface(false);
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
              setShowStartDatePicker(true);
              setShowStartDatePickerInterface(true);
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
                    setShowStartDatePickerInterface(false);
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
          isConversion={isConversion}
          isDateDisabled={isDateDisabledByRoster}
        />
      </div>

      <div
        ref={startCollapsibleRef}
        className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
        style={{ willChange: "height, opacity" }}
      >
        {showStartDatePickerInterface ? (
          showStartCalender ? (
            <CustomCalender
              setShowCalender={setShowStartCalender}
              onDateSelect={(date) => {
                setStartDate(date);
                setShowStartDatePickerInterface(false);
              }}
              selectedDate={startDate}
              taskHoursData={calendarTaskHours}
              ref={startDateRef}
              maxDate={endDate}
              shift={shift}
              isDateDisabled={isDateDisabledByRoster}
            />
          ) : (
            <TaskDatePicker
              selectedDate={startDate}
              onDateSelect={(date) => {
                setStartDate(date);
                setShowStartDatePickerInterface(false);
              }}
              startDate={null}
              userAvailability={userAvailability}
              setShowCalender={setShowStartCalender}
              maxDate={endDate}
              shift={shift}
              isDateDisabled={isDateDisabledByRoster}
            />
          )
        ) : (
          startDate && (
            <TasksOfDate
              selectedDate={startDate}
              onClose={() => { }}
              tasks={startDateTasks}
              selectedUser={formData.responsiblePerson}
              userAvailability={userAvailability}
              shift={shift}
            />
          )
        )}
      </div>

      <div
        ref={collapsibleRef}
        className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
        style={{ willChange: "height, opacity" }}
      >
        {showDatePickerInterface ? (
          showCalender ? (
            <CustomCalender
              setShowCalender={setShowCalender}
              onDateSelect={(date) => {
                setEndDate(date);
                setShowDatePickerInterface(false);
              }}
              selectedDate={endDate}
              taskHoursData={calendarTaskHours}
              ref={endDateRef}
              maxDate={endDate}
              shift={shift}
              isDateDisabled={isDateDisabledByRoster}
            />
          ) : (
            <TaskDatePicker
              selectedDate={endDate}
              onDateSelect={(date) => {
                setEndDate(date);
                setShowDatePickerInterface(false);
              }}
              startDate={startDate}
              userAvailability={userAvailability}
              setShowCalender={setShowCalender}
              maxDate={endDate}
              shift={shift}
              isDateDisabled={isDateDisabledByRoster}
            />
          )
        ) : (
          endDate && (
            <TasksOfDate
              selectedDate={endDate}
              onClose={() => { }}
              tasks={targetDateTasks}
              selectedUser={formData.responsiblePerson}
              userAvailability={userAvailability}
              shift={shift}
            />
          )
        )}
      </div>

      <div className="mb-6 mt-2">
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>
            Priority<span className="text-red-500">*</span>
          </InputLabel>
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
          label={
            <>
              Observer<span className="text-red-500">*</span>
            </>
          }
          options={users
            ?.filter(Boolean)
            .filter((user: any) => user?.id !== formData.responsiblePerson)
            .map((user: any) => ({
              label: user.name || user?.full_name || "Unknown",
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
        <div
          className="text-[12px] text-[red] text-right cursor-pointer mb-2"
          onClick={() => setIsTagModalOpen(true)}
        >
          <i>Create new tag</i>
        </div>
        <MuiMultiSelect
          label={
            <>
              Tags<span className="text-red-500">*</span>
            </>
          }
          options={tags.map((tag) => ({
            value: tag.id,
            label: tag.name,
            id: tag.id,
          }))}
          value={formData.tags}
          onChange={(values) => handleMultiSelectChange("tags", values)}
          placeholder="Select Tags"
          disabled={isReadOnly}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Attachments
          {attachments.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
              {attachments.length}
            </span>
          )}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []) as File[];
            if (files.length > 0) {
              validateAndAddFiles(files);
            }
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          disabled={isReadOnly}
          className="hidden"
          accept="*/*"
        />

        {/* Drag and Drop Area */}
        <div
          ref={dragDropRef}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isReadOnly && fileInputRef.current?.click()}
          className={`relative p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <CloudUploadIcon
              sx={{
                fontSize: 40,
                color: isDragActive ? '#3B82F6' : '#9CA3AF',
                transition: 'all 0.3s ease',
              }}
            />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Support: PDF, Images, Videos, Audio, Documents (Max size per file: 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {attachments.length > 0 && (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Files to upload ({attachments.length})
              </h3>
              {attachments.length > 1 && (
                <button
                  type="button"
                  onClick={() => setAttachments([])}
                  disabled={isReadOnly}
                  className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attachments.map((file, idx) => {
                const fileInfo = getFileTypeInfo(file.name);
                const IconComponent = fileInfo.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => {
                      const url = URL.createObjectURL(file);
                      window.open(url, "_blank");
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: fileInfo.bgColor }}
                      >
                        <IconComponent sx={{ fontSize: 20, color: fileInfo.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <span
                            className="px-2 py-0.5 text-xs font-semibold rounded-full text-white flex-shrink-0"
                            style={{ backgroundColor: fileInfo.color }}
                          >
                            {fileInfo.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachments(attachments.filter((_, i) => i !== idx));
                      }}
                      disabled={isReadOnly}
                      className="ml-3 flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove file"
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{attachments.length}</span> file(s) ready to upload
                {' '}
                <span className="text-blue-600">
                  ({formatFileSize(attachments.reduce((sum, f) => sum + f.size, 0))})
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectTaskCreateModal = ({
  isEdit,
  onCloseModal,
  className = "max-w-[95%] mx-auto",
  prefillData,
  opportunityId,
  onSuccess,
  isConversion = false,
}: any) => {
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const { id, mid, tid } = useParams();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.createProjectTask);
  const { data: task } = useAppSelector((state) => state.fetchProjectTasksById);
  const { data: project } = useAppSelector((state) => state.fetchProjectById);
  const { data: milestone } = useAppSelector(
    (state) => state.fetchMilestoneById
  );
  const { loading: editLoading } = useAppSelector(
    (state) => state.editProjectTask
  );
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskDuration, setTaskDuration] = useState();
  const [nextId, setNextId] = useState(1);
  const [savedTasks, setSavedTasks] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [dateWiseHours, setDateWiseHours] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [recurringData, setRecurringData] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [endDate, setEndDate] = useState(() => {
    const targetDate = prefillData?.target_date;
    if (!targetDate) return null;

    if (typeof targetDate === "string") {
      // Handle YYYY-MM-DD format manually to avoid timezone issues
      const parts = targetDate.split("-");
      if (parts.length === 3) {
        return {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10) - 1,
          date: parseInt(parts[2], 10),
        };
      }

      const date = new Date(targetDate);
      return {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
    return targetDate;
  });
  const [members, setMembers] = useState([]);
  const selectedTags = (prefillData?.tags || [])?.map((tag: any) => ({
    value: tag.company_tag_id,
    label: tag.company_tag.name || "Unknown Tag",
    id: tag.company_tag_id,
  }));
  const [formData, setFormData] = useState({
    project: "",
    milestone: "",
    taskTitle:
      prefillData?.title
        ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
        .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
    description:
      prefillData?.description
        ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
        .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
    responsiblePerson: prefillData?.responsible_person?.id || "",
    responsiblePersonName: prefillData?.responsible_person?.name || "",
    department: "",
    priority: "",
    observer: [],
    tags: selectedTags || [],
    isRecurring: false
  });

  const [prevTags, setPrevTags] = useState([]);
  const [prevObservers, setPrevObservers] = useState([]);

  const getTags = async () => {
    try {
      const response = await dispatch(fetchProjectsTags({ active: true })).unwrap();
      setTags(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filter out any undefined/null users and map roles
      const validUsers = (response.data.users || [])
        .filter((user: any) => user && user.id)
        .map((user: any) => ({
          ...user,
          role:
            user.user_type === "pms_occupant"
              ? "occupant"
              : user.user_type === "pms_admin"
                ? user.employee_type || "admin"
                : user.employee_type || "",
        }));
      setUsers(validUsers);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

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
    if (project && typeof project === "object" && "project_team" in project) {
      const projectWithTeam = project as any;
      const members = [];

      projectWithTeam?.project_team?.project_team_members?.forEach(
        (member: any) => {
          if (member?.user) {
            members.push(member.user);
          }
        }
      );

      if (projectWithTeam?.project_team?.team_lead) {
        members.push(projectWithTeam.project_team.team_lead);
      }

      setMembers(members);
    }
  }, [project]);

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
        isRecurring: false,
      });
      setStartDate({
        date: new Date(taskData.expected_start_date).getDate(),
        month: new Date(taskData.expected_start_date).getMonth(),
        year: new Date(taskData.expected_start_date).getFullYear(),
      });
      setEndDate({
        date: new Date(taskData.target_date).getDate(),
        month: new Date(taskData.target_date).getMonth(),
        year: new Date(taskData.target_date).getFullYear(),
      });

      setPrevTags(mappedTags);
      setPrevObservers(mappedObservers);
    }
  }, [isEdit, task, id, mid, getTagName]);

  const createTaskPayload = (data) => {
    const formatedEndDate = `${endDate?.year}-${endDate?.month + 1}-${endDate?.date
      }`;
    const formatedStartDate = `${startDate?.year}-${startDate?.month + 1}-${startDate?.date
      }`;

    const formDatatoSend = new FormData();

    formDatatoSend.append("task_management[title]", data.taskTitle);
    formDatatoSend.append("task_management[description]", data.description);
    formDatatoSend.append("task_management[responsible_person_id]", data.responsiblePerson);
    formDatatoSend.append("task_management[priority]", data.priority);
    data.observer.forEach((observer) => {
      formDatatoSend.append(
        "task_management[observer_ids][]",
        observer.value
      );
    });
    data.tags.forEach((tag) => {
      formDatatoSend.append(
        "task_management[task_tag_ids][]",
        tag.value
      );
    });
    formDatatoSend.append("task_management[expected_start_date]", formatedStartDate);
    formDatatoSend.append("task_management[target_date]", formatedEndDate);
    formDatatoSend.append("task_management[allocation_date]", formatedEndDate);
    formDatatoSend.append("task_management[project_management_id]", id || formData.project);
    formDatatoSend.append("task_management[milestone_id]", mid || formData.milestone);
    formDatatoSend.append("task_management[active]", "true");
    formDatatoSend.append("task_management[estimated_hour]", totalWorkingHours.toString());

    // Build task allocation times attributes with proper structure
    let taskAllocationTimesAttributes: any[] = [];
    if (Array.isArray(dateWiseHours) && dateWiseHours.length > 0) {
      taskAllocationTimesAttributes = dateWiseHours.map((item) => ({
        date: item.date,
        hours: item.hours,
        minutes: item.minutes || 0,
        id: item.id || null,
        _destroy: false,
      }));
    }

    // Append allocation times
    taskAllocationTimesAttributes.forEach((item, index) => {
      if (item.id) {
        formDatatoSend.append(`task_management[task_allocation_times_attributes][${index}][id]`, item.id);
      }
      formDatatoSend.append(`task_management[task_allocation_times_attributes][${index}][date]`, item.date);
      formDatatoSend.append(`task_management[task_allocation_times_attributes][${index}][hours]`, item.hours);
      formDatatoSend.append(`task_management[task_allocation_times_attributes][${index}][minutes]`, item.minutes);
      formDatatoSend.append(`task_management[task_allocation_times_attributes][${index}][_destroy]`, item._destroy);
    });

    if (opportunityId) {
      formDatatoSend.append("task_management[opportunity_id]", opportunityId);
    }
    if (data.isRecurring) {
      formDatatoSend.append("task_management[is_recurring]", data.isRecurring);
    }
    if (data.isRecurring && data.cronExpression) {
      formDatatoSend.append("task_management[cron_expression]", data.cronExpression);
    }

    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formDatatoSend.append("task_management[attachments][]", file);
      });
    }

    return formDatatoSend;

    // return {
    //   task_management: {
    //     title: data.taskTitle,
    //     description: data.description,
    //     responsible_person_id: data.responsiblePerson,
    //     priority: data.priority,
    //     observer_ids: data.observer.map((observer) => observer.value),
    //     task_tag_ids: data.tags.map((tag) => tag.value),
    //     expected_start_date: formatedStartDate,
    //     target_date: formatedEndDate,
    //     allocation_date: formatedEndDate,
    //     project_management_id: id || formData.project,
    //     milestone_id: mid || formData.milestone,
    //     active: true,
    //     estimated_hour: totalWorkingHours,
    //     task_allocation_times_attributes: dateWiseHours,
    //     ...(opportunityId && { opportunity_id: opportunityId }),
    //     ...(data.isRecurring && { is_recurring: data.isRecurring }),
    //     ...(data.isRecurring && data.cronExpression && { cron_expression: data.cronExpression }),
    //   },
    // };
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
    // Reset user availability data when modal closes
    dispatch(resetUserAvailability());

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
      await dispatch(
        createProjectTask({ baseUrl, token, data: payload })
      ).unwrap();
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
        isRecurring: false,
      });
      setPrevTags([]);
      setPrevObservers([]);
      setIsDelete(false);
      setNextId(nextId + 1);
      setAttachments([]);
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
      const response = await dispatch(
        createProjectTask({ baseUrl, token, data: payload })
      ).unwrap();
      const taskId = response?.id;

      if (onSuccess && taskId) {
        onSuccess(taskId);
      }
      toast.dismiss();
      toast.success("Task created successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      const errors = error.response.data;

      Object.keys(errors).forEach((key) => {
        toast.error(`${key} ${errors[key][0]}`);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (data) => {
    setRecurringData(data);
    // Store cron expression in formData and keep recurring task checked
    setFormData(prev => ({
      ...prev,
      isRecurring: true,
      cronExpression: data.cronExpression
    }));
    // Close the modal (checkbox remains checked)
    setIsModalOpen(false);
  };

  return (
    <form
      className="pb-20 overflow-y-auto text-[12px]"
      onSubmit={(e) => handleSubmit(e, tid)}
    >
      <div id="addTask" className={`pr-3 ${className}`}>
        {savedTasks.map((task) => (
          <TaskForm
            key={task.id}
            formData={task.formData}
            setFormData={() => { }}
            isReadOnly={true}
            project={project}
            milestone={milestone}
            users={members.length > 0 ? members : users}
            // users={users}
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
            setIsModalOpen={setIsModalOpen}
            setIsTagModalOpen={setIsTagModalOpen}
            isConversion={isConversion}
            attachments={[]}
            setAttachments={() => { }}
          />
        ))}

        {!isDelete && (
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            isReadOnly={false}
            project={project}
            milestone={milestone}
            users={members.length > 0 ? members : users}
            // users={users}
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
            setIsModalOpen={setIsModalOpen}
            setIsTagModalOpen={setIsTagModalOpen}
            isConversion={isConversion}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        )}

        <RecurringTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Uncheck the recurring task checkbox when modal is closed without saving
            setFormData({ ...formData, isRecurring: false });
          }}
          onSave={handleSave}
          initialData={recurringData}
        />

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

      <style>{`
        .ql-toolbar {
          border-top: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
          border-radius: 4px 4px 0 0;
          background-color: #fafafa;
          margin-bottom: 0 !important;
        }

        .ql-container {
          border-bottom: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-radius: 0 0 4px 4px;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          margin-top: 0 !important;
        }

        .ql-editor {
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.5;
        }

        .ql-editor.ql-blank::before {
          color: rgba(0, 0, 0, 0.6);
          font-style: normal;
        }

        .ql-toolbar button:hover {
          color: #01569E;
        }

        .ql-toolbar button.ql-active {
          color: #01569E;
        }
      `}</style>
      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagCreated={() => getTags()}
      />
    </form>
  );
};

export default ProjectTaskCreateModal;
