import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Slide, IconButton, InputAdornment } from '@mui/material';
import { X, Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { TransitionProps } from '@mui/material/transitions';
import { useSpeechToText } from '../../hooks/useSpeechToText';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const BC_API_BASE = `https://${localStorage.getItem('baseUrl')}`;

interface BCTodoCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const BCTodoCreateModal = ({ isOpen, onClose, onSuccess }: BCTodoCreateModalProps) => {
    const baseURL = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    const [selectedResponsiblePerson, setSelectedResponsiblePerson] = useState(userId || '');
    const [priority, setPriority] = useState('');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [baseValue, setBaseValue] = useState("");

    const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();

    const quillRef = useRef<HTMLDivElement>(null);
    const quillEditorRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (isListening && transcript) {
            if (activeId === "bc-todo-title") {
                const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
                setTitle(newValue);
            } else if (activeId === "bc-todo-description") {
                const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
                setDescription(newValue);
                if (quillEditorRef.current) {
                    const formattedValue = newValue.startsWith("<") ? newValue : `<p>${newValue}</p>`;
                    quillEditorRef.current.root.innerHTML = formattedValue;
                }
            }
        }
    }, [isListening, transcript, activeId, baseValue]);

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setDescription('');
            setDate(null);
            setSelectedResponsiblePerson(userId || '');
            setPriority('');
            setIsEditorReady(true);
        }
    }, [isOpen, userId]);

    useEffect(() => {
        if (!isOpen || !isEditorReady || !quillRef.current) return;

        if (quillEditorRef.current) {
            quillEditorRef.current.off('text-change');
            quillEditorRef.current = null;
            quillRef.current.innerHTML = "";
        }

        const quill = new Quill(quillRef.current, {
            theme: "snow",
            placeholder: "Type description...",
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

        quillEditorRef.current = quill;

        if (description) {
            quill.root.innerHTML = description;
        }

        quill.on("text-change", () => {
            setDescription(quill.root.innerHTML);
        });

    }, [isOpen, isEditorReady]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `https://${baseURL}/pms/users/get_escalate_to_users.json?type=Task`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const validUsers = (response.data.users || [])
                    .filter((user: any) => user && user.id)
                    .map((user: any) => ({
                        id: user.id,
                        name: user.name || user.full_name || "Unknown",
                        department_name: user.department_name,
                    }));
                setUsers(validUsers);
            } catch (error) {
                console.log("Error fetching users:", error);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, baseURL, token]);

    const closeModal = () => {
        onClose();
        setTitle('');
        setDescription('');
        setDate(null);
        setSelectedResponsiblePerson(userId || '');
        setPriority('');
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!title || !date || !selectedResponsiblePerson || !priority) {
                toast.error('Please fill in all fields');
                return;
            }

            setIsSubmitting(true);

            const payload = {
                todo: {
                    title,
                    description,
                    target_date: date,
                    responsible_person_id: selectedResponsiblePerson,
                    priority: priority,
                },
            };

            await axios.post(`${BC_API_BASE}/business_compass/todos`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('To-Do added successfully');
            closeModal();
            onSuccess?.();
        } catch (error) {
            console.log(error);
            toast.error('Failed to add To-Do');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeModal}
            maxWidth={false}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    width: '40%',
                    height: '100%',
                    maxHeight: '100%',
                    margin: 0,
                    borderRadius: 0,
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            }}
            TransitionProps={{
                timeout: {
                    enter: 500,
                    exit: 500,
                },
            }}
        >
            <DialogTitle className="relative py-6 !px-0">
                <h3 className="text-lg font-medium text-center">Add ToDo</h3>
                <X
                    className="absolute top-6 right-8 cursor-pointer"
                    onClick={closeModal}
                />
                <hr className="border border-[#E95420] mt-4" />
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: 0,
                    overflow: 'auto',
                }}
            >
                <form className="pt-2 pb-12" onSubmit={handleSubmit}>
                    <div className="max-w-[90%] mx-auto pr-3 space-y-4">
                        <TextField
                            fullWidth
                            label="Title"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            size="small"
                            variant="outlined"
                            InputProps={{
                                endAdornment: supported && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                if (isListening && activeId === "bc-todo-title") {
                                                    stopListening();
                                                } else {
                                                    setBaseValue(title);
                                                    startListening("bc-todo-title");
                                                }
                                            }}
                                            color={isListening && activeId === "bc-todo-title" ? "secondary" : "default"}
                                            sx={{ color: isListening && activeId === "bc-todo-title" ? "#C72030" : "inherit" }}
                                        >
                                            {isListening && activeId === "bc-todo-title" ? <Mic size={18} /> : <MicOff size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Description</label>
                                {supported && (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (isListening && activeId === "bc-todo-description") {
                                                stopListening();
                                            } else {
                                                setBaseValue(description);
                                                startListening("bc-todo-description");
                                            }
                                        }}
                                        color={isListening && activeId === "bc-todo-description" ? "secondary" : "default"}
                                        sx={{ color: isListening && activeId === "bc-todo-description" ? "#C72030" : "inherit" }}
                                    >
                                        {isListening && activeId === "bc-todo-description" ? <Mic size={18} /> : <MicOff size={18} />}
                                    </IconButton>
                                )}
                            </div>
                            <div className="bc-description-toolbar-compact">
                                <div
                                    ref={quillRef}
                                    style={{
                                        border: "1px solid rgba(0, 0, 0, 0.23)",
                                        borderRadius: "4px",
                                        minHeight: "200px",
                                    }}
                                />
                            </div>
                        </div>

                        <TextField
                            fullWidth
                            label="Target Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            size="small"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth required size="small">
                            <InputLabel>Responsible Person</InputLabel>
                            <Select
                                value={selectedResponsiblePerson}
                                onChange={(e) => setSelectedResponsiblePerson(e.target.value)}
                                label="Responsible Person"
                            >
                                <MenuItem value="">
                                    <em>Select a user</em>
                                </MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name} - <span className='text-gray-500 text-xs ml-2 italic'>{user?.department_name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required size="small">
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                label="Priority"
                            >
                                <MenuItem value="">
                                    <em>Select a priority</em>
                                </MenuItem>
                                {priorityOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="flex items-center justify-center gap-4 w-full py-3 bg-white mt-10">
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Add Todo'}
                            </Button>
                        </div>
                    </div>
                </form>
                <style>{`
                    @media (max-width: 640px) {
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow {
                            padding: 3px 4px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-formats {
                            margin-right: 3px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow button {
                            width: 16px !important;
                            height: 16px !important;
                            padding: 1px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow button svg {
                            width: 10px !important;
                            height: 10px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-picker {
                            height: 16px !important;
                            font-size: 9px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-picker.ql-header {
                            width: 62px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-picker-label {
                            padding-left: 3px !important;
                            padding-right: 10px !important;
                            line-height: 16px !important;
                        }
                        .bc-description-toolbar-compact .ql-toolbar.ql-snow .ql-picker-label svg {
                            width: 10px !important;
                            height: 10px !important;
                        }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
};

export default BCTodoCreateModal;
