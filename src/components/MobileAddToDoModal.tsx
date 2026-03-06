import axios from 'axios';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface MobileAddToDoModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    getTodos: () => void;
    editingTodo?: any;
    isEditMode?: boolean;
}

const MobileAddToDoModal = ({
    isModalOpen,
    setIsModalOpen,
    getTodos,
    editingTodo = null,
    isEditMode = false,
}: MobileAddToDoModalProps) => {
    const baseURL = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    const [selectedResponsiblePerson, setSelectedResponsiblePerson] = useState(userId || '');
    const [priority, setPriority] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const priorityOptions = [
        { value: 'P1', label: 'Q1: Urgent & Important' },
        { value: 'P2', label: 'Q2: Important, Not Urgent' },
        { value: 'P3', label: 'Q3: Urgent, Not Important' },
        { value: 'P4', label: 'Q4: Not Urgent or Important' },
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

    // Initialize form with editing data if in edit mode
    useEffect(() => {
        if (isEditMode && editingTodo) {
            setTitle(editingTodo.title || '');
            setDate(editingTodo.target_date || '');
            setSelectedResponsiblePerson(editingTodo.user_id || '');
            setPriority(editingTodo.priority || '');
        } else {
            resetForm();
        }
    }, [isEditMode, editingTodo, userId]);

    const resetForm = () => {
        setTitle('');
        setDate('');
        setSelectedResponsiblePerson(userId || '');
        setPriority('');
        setShowUserDropdown(false);
        setShowPriorityDropdown(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!title.trim() || !date || !selectedResponsiblePerson || !priority) {
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
                await axios.put(`https://${baseURL}/todos/${editingTodo.id}.json`, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('To-Do updated successfully');
            } else {
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

    const selectedUserName = users.find(u => u.id === selectedResponsiblePerson)?.name || 'Select User';
    const selectedPriorityLabel = priorityOptions.find(p => p.value === priority)?.label || 'Select Priority';

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="w-full bg-white rounded-t-2xl p-4 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isEditMode ? 'Edit Todo' : 'Add Todo'}
                    </h3>
                    <button
                        onClick={closeModal}
                        className="p-1 hover:bg-gray-100 rounded transition"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter todo title"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/20 text-sm"
                            required
                        />
                    </div>

                    {/* Target Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Target Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/20 text-sm"
                            required
                        />
                    </div>

                    {/* Responsible Person Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Responsible Person</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUserDropdown(!showUserDropdown);
                                    setShowPriorityDropdown(false);
                                }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/20"
                            >
                                <span className="text-gray-900">{selectedUserName}</span>
                                <svg className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                            {showUserDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {users.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedResponsiblePerson(user.id);
                                                setShowUserDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${selectedResponsiblePerson === user.id ? 'bg-[#C72030]/10 text-[#C72030] font-medium' : ''
                                                }`}
                                        >
                                            <div>{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.department_name}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Priority Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Priority</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPriorityDropdown(!showPriorityDropdown);
                                    setShowUserDropdown(false);
                                }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/20"
                            >
                                <span className="text-gray-900">{selectedPriorityLabel}</span>
                                <svg className={`w-4 h-4 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                            {showPriorityDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                    {priorityOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setPriority(option.value);
                                                setShowPriorityDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${priority === option.value ? 'bg-[#C72030]/10 text-[#C72030] font-medium' : ''
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeModal}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Submitting...' : isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MobileAddToDoModal;
