import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Slide, IconButton, InputAdornment } from '@mui/material';
import { X, Mic, MicOff } from 'lucide-react';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { TransitionProps } from '@mui/material/transitions';
import { useSpeechToText } from '../hooks/useSpeechToText';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddToDoModal = ({ isModalOpen, setIsModalOpen, getTodos, editingTodo = null, isEditMode = false, prefillData }) => {
    console.log(prefillData)
    const baseURL = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(() => {
        return prefillData?.start_date ? prefillData.start_date : null;
    });

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

    // Handle STT for Title and Description
    useEffect(() => {
        if (isListening && transcript) {
            if (activeId === "todo-title") {
                const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
                setTitle(newValue);
            } else if (activeId === "todo-description") {
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
        { value: 'P1', label: 'Q1: Urgent & Important' },
        { value: 'P2', label: 'Q2: Important, Not Urgent' },
        { value: 'P3', label: 'Q3: Urgent, Not Important' },
        { value: 'P4', label: 'Q4: Not Urgent or Important' },
    ];

    useEffect(() => {
        if (isModalOpen) {
            if (isEditMode && editingTodo) {
                setTitle(editingTodo.title || '');
                setDescription(editingTodo.description || '');
                setDate(editingTodo.target_date || null);
                setSelectedResponsiblePerson(editingTodo.user_id || '');
                setPriority(editingTodo.priority || '');
            } else {
                setTitle('');
                setDescription('');
                setDate(null);
                setSelectedResponsiblePerson(userId || '');
                setPriority('');
            }

            setIsEditorReady(true);
        }
    }, [isModalOpen, isEditMode, editingTodo, userId]);

    useEffect(() => {
        if (!isModalOpen || !isEditorReady || !quillRef.current) return;

        // 🔥 destroy previous instance properly
        if (quillEditorRef.current) {
            quillEditorRef.current.off('text-change');
            quillEditorRef.current = null;
            quillRef.current.innerHTML = ""; // VERY IMPORTANT
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

        // ✅ set initial content AFTER init
        if (description) {
            quill.root.innerHTML = description;
        }

        // ✅ update state on change
        quill.on("text-change", () => {
            setDescription(quill.root.innerHTML);
        });

    }, [isModalOpen, isEditorReady]);

    // Fetch users on mount
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

        if (isModalOpen) {
            fetchUsers();
        }
    }, [isModalOpen, baseURL, token]);

    const closeModal = () => {
        setIsModalOpen();
        setTitle('');
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
                    user_id: selectedResponsiblePerson,
                    priority: priority,
                    status: isEditMode ? editingTodo.status : 'open',
                },
            };

            if (isEditMode && editingTodo) {
                // Update existing todo
                await axios.put(`https://${baseURL}/todos/${editingTodo.id}.json`, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('To-Do updated successfully');
            } else {
                // Create new todo
                await axios.post(`https://${baseURL}/todos.json`, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('To-Do added successfully');
            }
            closeModal();
            getTodos();
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? 'Failed to update To-Do' : 'Failed to add To-Do');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={isModalOpen}
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
                <h3 className="text-lg font-medium text-center">{isEditMode ? 'Edit ToDo' : 'Add ToDo'}</h3>
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
                                                if (isListening && activeId === "todo-title") {
                                                    stopListening();
                                                } else {
                                                    setBaseValue(title);
                                                    startListening("todo-title");
                                                }
                                            }}
                                            color={isListening && activeId === "todo-title" ? "secondary" : "default"}
                                            sx={{ color: isListening && activeId === "todo-title" ? "#C72030" : "inherit" }}
                                        >
                                            {isListening && activeId === "todo-title" ? <Mic size={18} /> : <MicOff size={18} />}
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
                                            if (isListening && activeId === "todo-description") {
                                                stopListening();
                                            } else {
                                                setBaseValue(description);
                                                startListening("todo-description");
                                            }
                                        }}
                                        color={isListening && activeId === "todo-description" ? "secondary" : "default"}
                                        sx={{ color: isListening && activeId === "todo-description" ? "#C72030" : "inherit" }}
                                    >
                                        {isListening && activeId === "todo-description" ? <Mic size={18} /> : <MicOff size={18} />}
                                    </IconButton>
                                )}
                            </div>
                            <div
                                ref={quillRef}
                                style={{
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderRadius: "4px",
                                    minHeight: "200px",
                                }}
                            />
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
                                {isSubmitting ? 'Submitting...' : isEditMode ? 'Update' : 'Add Todo'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToDoModal;