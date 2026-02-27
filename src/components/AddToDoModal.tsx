import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const AddToDoModal = ({ isModalOpen, setIsModalOpen, getTodos, editingTodo = null, isEditMode = false }) => {
    const baseURL = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedResponsiblePerson, setSelectedResponsiblePerson] = useState('');
    const [priority, setPriority] = useState('');

    const priorityOptions = [
        { value: 'P1', label: 'P1: Urgent & Important' },
        { value: 'P2', label: 'P2: Important, Not Urgent' },
        { value: 'P3', label: 'P3: Urgent, Not Important' },
        { value: 'P4', label: 'P4: Not Urgent or Important' },
    ];

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

    // Initialize form with editing data if in edit mode
    useEffect(() => {
        if (isEditMode && editingTodo) {
            setTitle(editingTodo.title || '');
            setDate(editingTodo.target_date || null);
            setSelectedResponsiblePerson(editingTodo.user_id || '');
            setPriority(editingTodo.priority || '');
        } else {
            setTitle('');
            setDate(null);
            setSelectedResponsiblePerson('');
            setPriority('');
        }
    }, [isEditMode, editingTodo]);

    const closeModal = () => {
        setIsModalOpen();
        setTitle('');
        setDate(null);
        setSelectedResponsiblePerson('');
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
            PaperProps={{
                sx: {
                    width: '35%',
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
                        />
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
                                        {user.name}
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
