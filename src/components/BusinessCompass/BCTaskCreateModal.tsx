import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CalendarIcon, X, Mic, MicOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { DurationPicker } from "@/components/DurationPicker";
import { TaskDatePicker } from "@/components/TaskDatePicker";
import { CustomCalender } from "@/components/CustomCalender";
import TasksOfDate from "@/components/TasksOfDate";
import { SpeechInput } from "@/components/SpeechInput";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { RecurringTaskModal } from "@/components/RecurringTaskModal";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const SlideTransition = forwardRef(function SlideTransition(
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
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatEffortDuration = (totalHours: number): string => {
  const h = Math.floor(totalHours);
  const m = Math.round((totalHours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const AttachmentsSelector = ({
  files,
  onFilesChange,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDropRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const getFileTypeInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext))
      return { icon: PictureAsPdfIcon, color: '#DC2626', bgColor: '#FEE2E2', type: 'PDF' };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext))
      return { icon: ImageIcon, color: '#2563EB', bgColor: '#DBEAFE', type: 'Image' };
    if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext))
      return { icon: AudioFileIcon, color: '#9333EA', bgColor: '#F3E8FF', type: 'Audio' };
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext))
      return { icon: VideoLibraryIcon, color: '#EA580C', bgColor: '#FFEDD5', type: 'Video' };
    if (['doc', 'docx', 'txt', 'rtf', 'xlsx', 'xls', 'csv', 'ppt', 'pptx'].includes(ext))
      return { icon: DescriptionIcon, color: '#16A34A', bgColor: '#DCFCE7', type: 'Document' };
    return { icon: AttachFileIcon, color: '#6B7280', bgColor: '#F3F4F6', type: 'File' };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateAndAddFiles = (filesToAdd: File[]) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    filesToAdd.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (${formatFileSize(file.size)})`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.dismiss();
      invalidFiles.forEach((fileName) => {
        toast.error(`${fileName} exceeds 10MB limit`);
      });
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
      toast.dismiss();
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []) as File[];
    if (droppedFiles.length > 0) {
      validateAndAddFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];
    if (selected.length > 0) {
      validateAndAddFiles(selected);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Attachments
        {files.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
            {files.length}
          </span>
        )}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      <div
        ref={dragDropRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer ${isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
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

      {files.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Files to upload ({files.length})
            </h3>
            {files.length > 1 && (
              <button
                type="button"
                onClick={() => onFilesChange([])}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, idx) => {
              const fileInfo = getFileTypeInfo(file.name);
              const IconComponent = fileInfo.icon;
              const isImage = file.type.startsWith("image/");

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
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <IconComponent sx={{ fontSize: 20, color: fileInfo.color }} />
                      )}
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
                      removeFile(idx);
                    }}
                    className="ml-3 flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{files.length}</span> file(s) ready to upload
              {' '}
              <span className="text-blue-600">
                ({formatFileSize(totalSize)})
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface BCTaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  baseUrl: string;
  token: string;
  prefilledDate?: { year: number; month: number; date: number };
  dateResetKey?: number;
}

const SimpleTaskForm = ({
  baseUrl,
  token,
  onClose,
  onSuccess,
  prefilledDate,
  dateResetKey,
}: {
  baseUrl: string;
  token: string;
  onClose: () => void;
  onSuccess?: () => void;
  prefilledDate?: { year: number; month: number; date: number };
  dateResetKey?: number;
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    responsiblePerson: "",
    responsiblePersonName: "",
    isRecurring: false,
    cronExpression: "",
    priority: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recurringData, setRecurringData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  /* ── dates ── */
  const [startDate, setStartDate] = useState<any>(() => {
    if (prefilledDate) return prefilledDate;
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth(), date: t.getDate() };
  });

  useEffect(() => {
    if (prefilledDate) {
      setStartDate(prefilledDate);
    } else {
      const t = new Date();
      setStartDate({ year: t.getFullYear(), month: t.getMonth(), date: t.getDate() });
    }
  }, [dateResetKey]);
  const [endDate, setEndDate] = useState<any>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerInterface, setShowDatePickerInterface] = useState(false);
  const [showStartDatePickerInterface, setShowStartDatePickerInterface] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const [showStartCalender, setShowStartCalender] = useState(false);
  const [calendarTaskHours] = useState([]);

  /* ── duration ── */
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [dateWiseHours, setDateWiseHours] = useState<any[]>([]);
  const [taskDuration, setTaskDuration] = useState<any>();
  const [shift] = useState<any[]>([]);

  /* ── collapsible refs ── */
  const collapsibleRef = useRef<HTMLDivElement>(null);
  const startCollapsibleRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLButtonElement>(null);
  const startDateRef = useRef<HTMLButtonElement>(null);

  /* ── quill ── */
  const quillRef = useRef<HTMLDivElement>(null);
  const quillEditorRef = useRef<Quill | null>(null);
  const [baseValue, setBaseValue] = useState("");
  const { isListening, activeId, transcript, supported, startListening, stopListening } =
    useSpeechToText();

  useEffect(() => {
    axios
      .get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers((res.data.users || []).filter((u: any) => u?.id)))
      .catch(() => { });
  }, []);

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
      quillEditorRef.current.on("text-change", () => {
        const html = quillEditorRef.current?.root.innerHTML;
        setFormData((prev) => ({ ...prev, description: html || "" }));
      });
    }
  }, []);

  useEffect(() => {
    if (isListening && transcript && activeId === "bc-simple-description") {
      const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
      if (quillEditorRef.current) {
        const formatted = newValue.startsWith("<") ? newValue : `<p>${newValue}</p>`;
        quillEditorRef.current.root.innerHTML = formatted;
        setFormData((prev) => ({ ...prev, description: formatted }));
      }
    }
  }, [isListening, transcript, activeId, baseValue]);

  /* ── collapsible animations ── */
  useEffect(() => {
    if (startCollapsibleRef.current) {
      startCollapsibleRef.current.style.height = showStartDatePicker ? "auto" : "0";
      startCollapsibleRef.current.style.opacity = showStartDatePicker ? "1" : "0";
    }
  }, [showStartDatePicker]);

  useEffect(() => {
    if (collapsibleRef.current) {
      collapsibleRef.current.style.height = showDatePicker ? "auto" : "0";
      collapsibleRef.current.style.opacity = showDatePicker ? "1" : "0";
    }
  }, [showDatePicker]);

  const handleSave = (data: any) => {
    setRecurringData(data);
    setFormData((prev) => ({ ...prev, isRecurring: true, cronExpression: data.cronExpression }));
    setIsModalOpen(false);
  };

  const responsibleUser = users.find((u) => u.id === formData.responsiblePerson);

  const fmt = (d: any) =>
    d ? `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.date).padStart(2, "0")}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskTitle?.trim()) { toast.error("Task title is required."); return; }
    if (!formData.responsiblePerson) { toast.error("Responsible person is required."); return; }
    if (!formData.priority) { toast.error("Priority is required."); return; }
    if (!formData.isRecurring && !endDate) { toast.error("Due date is required."); return; }

    setIsSubmitting(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("task[title]", formData.taskTitle);
      formDataPayload.append("task[description]", formData.description);
      formDataPayload.append("task[responsible_person_id]", formData.responsiblePerson);
      formDataPayload.append("task[role]", responsibleUser?.role_name || responsibleUser?.employee_type || "");
      formDataPayload.append("task[is_recurring]", String(formData.isRecurring));
      formDataPayload.append("task[start_date]", fmt(startDate) || "");
      formDataPayload.append("task[due_date]", fmt(endDate));
      formDataPayload.append("task[effort_duration]", formatEffortDuration(totalWorkingHours));
      formDataPayload.append("task[priority]", formData.priority.toLowerCase());
      formDataPayload.append("task[status]", "open");

      // Build task allocation times attributes
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
      taskAllocationTimesAttributes.forEach((item, index) => {
        if (item.id) {
          formDataPayload.append(`task[task_allocation_times_attributes][${index}][id]`, item.id);
        }
        formDataPayload.append(`task[task_allocation_times_attributes][${index}][date]`, item.date);
        formDataPayload.append(`task[task_allocation_times_attributes][${index}][hours]`, item.hours);
        formDataPayload.append(`task[task_allocation_times_attributes][${index}][minutes]`, item.minutes);
        formDataPayload.append(`task[task_allocation_times_attributes][${index}][_destroy]`, item._destroy);
      });

      files.forEach((file) => {
        formDataPayload.append("task[attachments][]", file);
      });
      await axios.post(`https://${baseUrl}/business_compass/tasks`, formDataPayload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Task created successfully.");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errors = err?.response?.data;
      if (errors && typeof errors === "object") {
        Object.keys(errors).forEach((k) => toast.error(`${k}: ${errors[k]}`));
      } else {
        toast.error("Failed to create task.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="pb-20 overflow-y-auto text-[12px]" onSubmit={handleSubmit}>
      <div id="addTask" className="pr-3 max-w-[95%] mx-auto">
        <div className="relative bg-white p-3 sm:p-4">

          {/* Task Title */}
          <div className="mb-1">
            <SpeechInput
              fullWidth
              label={<>Task Title<span className="text-red-500">*</span></>}
              name="taskTitle"
              placeholder="Enter Task Title"
              value={formData.taskTitle}
              onChange={(value: string) => {
                if (value.length <= 200) setFormData({ ...formData, taskTitle: value });
              }}
              variant="outlined"
              size="small"
              sx={fieldStyles}
              inputProps={{ maxLength: 200 }}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{formData.taskTitle?.length || 0}/200</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                Description<span className="text-red-500">*</span>
              </label>
              {supported && (
                <IconButton
                  size="small"
                  onClick={() => {
                    if (isListening && activeId === "bc-simple-description") {
                      stopListening();
                    } else {
                      const current = quillEditorRef.current?.root.innerHTML;
                      setBaseValue(current === "<p><br></p>" ? "" : current || "");
                      startListening("bc-simple-description");
                    }
                  }}
                  sx={{
                    color: isListening && activeId === "bc-simple-description" ? "#C72030" : "inherit",
                  }}
                >
                  {isListening && activeId === "bc-simple-description" ? (
                    <Mic size={18} />
                  ) : (
                    <MicOff size={18} />
                  )}
                </IconButton>
              )}
            </div>
            <div className="bc-description-toolbar-compact">
              <div
                ref={quillRef}
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  minHeight: "150px",
                }}
              />
            </div>
          </div>

          {/* Responsible Person + Role */}
          <div className="mb-3 mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>
                  Responsible Person<span className="text-red-500">*</span>
                </InputLabel>
                <Select
                  label="Responsible Person *"
                  value={formData.responsiblePerson}
                  onChange={(e) => {
                    const value = e.target.value;
                    const user = users.find((u: any) => u.id === value);
                    setFormData({
                      ...formData,
                      responsiblePerson: value,
                      responsiblePersonName: user?.full_name || user?.name || "",
                    });
                  }}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Person</em></MenuItem>
                  {users.filter(Boolean).map((u: any) => (
                    <MenuItem key={u.id} value={u.id}>{u.name || u.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                fullWidth
                label="Role"
                value={responsibleUser?.role || responsibleUser?.role_name || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
            </div>
          </div>

          {/* Recurring */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isRecurring}
                onChange={(e) => {
                  setFormData({ ...formData, isRecurring: e.target.checked });
                  if (e.target.checked) setIsModalOpen(true);
                }}
              />
            }
            label="Recurring Task"
          />

          {/* Dates */}
          <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">
                Target Date{!formData.isRecurring && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                ref={endDateRef}
                className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                onClick={() => {
                  if (showStartDatePicker) setShowStartDatePicker(false);
                  setShowDatePicker(true);
                  setShowDatePickerInterface(true);
                }}
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
                  <><CalendarIcon className="w-4 h-4" /> Select Target Date</>
                )}
              </button>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Start Date</label>
              <button
                type="button"
                ref={startDateRef}
                className="w-full border outline-none border-gray-300 px-3 py-2 text-[13px] flex items-center gap-2 text-gray-400 rounded"
                onClick={() => {
                  if (showDatePicker) setShowDatePicker(false);
                  setShowStartDatePicker(true);
                  setShowStartDatePickerInterface(true);
                }}
              >
                {startDate ? (
                  <div className="text-black flex items-center justify-between w-full">
                    <CalendarIcon className="w-4 h-4" />
                    <div>
                      Start Date : {startDate.date.toString().padStart(2, "0")}{" "}
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
                  <><CalendarIcon className="w-4 h-4" /> Select Start Date</>
                )}
              </button>
            </div>
          </div>

          {/* Duration */}
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

          {/* Start date collapsible */}
          <div
            ref={startCollapsibleRef}
            className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
            style={{ willChange: "height, opacity" }}
          >
            {showStartDatePickerInterface ? (
              showStartCalender ? (
                <CustomCalender
                  setShowCalender={setShowStartCalender}
                  onDateSelect={(date: any) => {
                    setStartDate(date);
                    setShowStartDatePickerInterface(false);
                  }}
                  selectedDate={startDate}
                  taskHoursData={calendarTaskHours}
                  ref={startDateRef}
                  maxDate={endDate}
                />
              ) : (
                <TaskDatePicker
                  selectedDate={startDate}
                  onDateSelect={(date: any) => {
                    setStartDate(date);
                    setShowStartDatePickerInterface(false);
                  }}
                  startDate={null}
                  setShowCalender={setShowStartCalender}
                  maxDate={endDate}
                  shift={{}}
                />
              )
            ) : (
              startDate && (
                <TasksOfDate
                  selectedDate={startDate}
                  onClose={() => { }}
                  tasks={[]}
                  selectedUser={formData.responsiblePerson}
                  userAvailability={[]}
                  shift={{}}
                />
              )
            )}
          </div>

          {/* Target date collapsible */}
          <div
            ref={collapsibleRef}
            className="overflow-hidden opacity-0 h-0 transition-all duration-300 ease-in-out"
            style={{ willChange: "height, opacity" }}
          >
            {showDatePickerInterface ? (
              showCalender ? (
                <CustomCalender
                  setShowCalender={setShowCalender}
                  onDateSelect={(date: any) => {
                    setEndDate(date);
                    setShowDatePickerInterface(false);
                  }}
                  selectedDate={endDate}
                  taskHoursData={calendarTaskHours}
                  ref={endDateRef}
                  minDate={startDate}
                />
              ) : (
                <TaskDatePicker
                  selectedDate={endDate}
                  onDateSelect={(date: any) => {
                    setEndDate(date);
                    setShowDatePickerInterface(false);
                  }}
                  startDate={startDate}
                  setShowCalender={setShowCalender}
                  shift={{}}
                />
              )
            ) : (
              endDate && (
                <TasksOfDate
                  selectedDate={endDate}
                  onClose={() => { }}
                  tasks={[]}
                  selectedUser={formData.responsiblePerson}
                  userAvailability={[]}
                  shift={{}}
                />
              )
            )}
          </div>

          {/* Priority */}
          <div className="mb-6 mt-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Priority<span className="text-red-500">*</span></InputLabel>
              <Select
                label="Priority *"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Priority</em></MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Attachments */}
          <AttachmentsSelector files={files} onFilesChange={setFiles} />
        </div>

        {/* Recurring Modal */}
        <RecurringTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData((prev) => ({ ...prev, isRecurring: false }));
          }}
          onSave={handleSave}
          initialData={recurringData}
        />

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white text-[12px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-[100px]"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2 w-max"
          >
            Cancel
          </button>
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
        @media (max-width: 640px) {
          .bc-description-toolbar-compact .ql-toolbar.ql-snow {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding: 3px 4px !important;
          }
          .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-formats {
            display: inline-flex !important;
            flex-shrink: 0 !important;
            margin-right: 3px !important;
          }
          .bc-description-toolbar-compact .ql-toolbar.ql-snow button {
            width: 16px !important;
            height: 16px !important;
            padding: 1px !important;
          }
        }
      `}</style>
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Main Modal wrapper
───────────────────────────────────────────────────────────────────────── */
const BCTaskCreateModal = ({
  isOpen,
  onClose,
  onSuccess,
  baseUrl,
  token,
  prefilledDate,
  dateResetKey,
}: BCTaskCreateModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: "100vw", md: "50vw" },
          maxWidth: "none",
          height: "100vh",
          maxHeight: "100vh",
          margin: 0,
          borderRadius: 0,
          position: "fixed",
          right: 0,
          top: 0,
        },
      }}
    >
      <DialogContent
        className="rounded-none bg-[#fff] text-sm"
        style={{ margin: 0, padding: 0, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
        sx={{ padding: "0 !important" }}
      >
        <div className="sticky top-0 bg-white z-10">
          <h3 className="text-[14px] font-medium text-center mt-8">Add Task</h3>
          <X
            className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
            onClick={onClose}
          />
          <hr className="border border-[#E95420] mt-4" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <SimpleTaskForm
            baseUrl={baseUrl}
            token={token}
            onClose={onClose}
            onSuccess={onSuccess}
            prefilledDate={prefilledDate}
            dateResetKey={dateResetKey}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BCTaskCreateModal;
