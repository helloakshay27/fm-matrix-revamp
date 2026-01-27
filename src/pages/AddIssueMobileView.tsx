import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

interface FormData {
    title: string;
    description: string;
    priority: string;
    status: string;
    issueType: string;
    assignedTo: string;
    projectId: string;
    milestoneId: string;
    taskId: string;
    startDate: string;
    dueDate: string;
    comments: string;
    estimatedHours: string;
    tags: string[];
}

const AddIssueMobileView = () => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";
    const token = localStorage.getItem("token");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        priority: '',
        status: 'open',
        issueType: '',
        assignedTo: '',
        projectId: '',
        milestoneId: '',
        taskId: '',
        startDate: '',
        dueDate: '',
        comments: '',
        estimatedHours: '',
        tags: [],
    });

    const [attachments, setAttachments] = useState<File[]>([]);
    const [users, setUsers] = useState<{ id: string; full_name: string }[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [issueTypes, setIssueTypes] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUsers(response.data.users || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        if (token && baseUrl) fetchUsers();
    }, [baseUrl, token]);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const userId = localStorage.getItem("user_id")

                if (!userId) {
                    console.warn('User ID not found');
                    return;
                }

                const response = await axios.get(
                    `https://${baseUrl}/project_managements/project_kanban.json?q[project_team_project_team_members_user_id_or_owner_id_or_created_by_id_eq]=${userId}&token=${token}`
                );
                setProjects(response.data?.project_managements || response.data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        if (token && baseUrl) fetchProjects();
    }, [baseUrl, token]);

    // Fetch issue types
    useEffect(() => {
        const fetchIssueTypes = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/issue_types.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIssueTypes(response.data.issue_types || response.data || []);
            } catch (error) {
                console.error('Error fetching issue types:', error);
            }
        };
        if (token && baseUrl) fetchIssueTypes();
    }, [baseUrl, token]);

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/company_tags.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAvailableTags(response.data || []);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        if (token && baseUrl) fetchTags();
    }, [baseUrl, token]);

    // Fetch milestones when project changes
    useEffect(() => {
        const fetchMilestones = async () => {
            if (!formData.projectId) {
                setMilestones([]);
                setFormData(prev => ({ ...prev, milestoneId: '', taskId: '' }));
                return;
            }

            try {
                const response = await axios.get(
                    `https://${baseUrl}/milestones.json?q[project_management_id_eq]=${formData.projectId}&token=${token}`
                );
                setMilestones(response.data?.milestones || response.data || []);
            } catch (error) {
                console.error('Error fetching milestones:', error);
            }
        };
        fetchMilestones();
    }, [formData.projectId, baseUrl, token]);

    // Fetch tasks when milestone changes
    useEffect(() => {
        const fetchTasks = async () => {
            if (!formData.milestoneId) {
                setTasks([]);
                setFormData(prev => ({ ...prev, taskId: '' }));
                return;
            }

            try {
                const response = await axios.get(
                    `https://${baseUrl}/task_managements.json?q[milestone_id_eq]=${formData.milestoneId}&token=${token}`
                );
                setTasks(response.data?.task_managements || response.data || []);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [formData.milestoneId, baseUrl, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagChange = (tagId: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setAttachments(prev => [...prev, ...selectedFiles]);
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.assignedTo) {
            toast.error('Assigned To is required');
            return;
        }
        if (!formData.priority) {
            toast.error('Priority is required');
            return;
        }
        if (!formData.dueDate) {
            toast.error('Due Date is required');
            return;
        }

        setSubmitting(true);
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('issue[title]', formData.title.trim());
            formDataToSend.append('issue[description]', formData.description);
            formDataToSend.append('issue[status]', formData.status);
            formDataToSend.append('issue[priority]', formData.priority);
            formDataToSend.append('issue[issue_type]', formData.issueType);
            formDataToSend.append('issue[responsible_person_id]', formData.assignedTo);
            formDataToSend.append('issue[project_management_id]', formData.projectId || '');
            formDataToSend.append('issue[milestone_id]', formData.milestoneId || '');
            formDataToSend.append('issue[task_management_id]', formData.taskId || '');
            formDataToSend.append('issue[start_date]', formData.startDate);
            formDataToSend.append('issue[end_date]', formData.dueDate);
            formDataToSend.append('issue[comment]', formData.comments);
            formDataToSend.append('issue[estimated_hour]', formData.estimatedHours || '0');
            formDataToSend.append('issue[created_by_id]', localStorage.getItem('user_id') || '');

            // Add tags
            formData.tags.forEach(tagId => {
                formDataToSend.append('issue[task_tag_ids][]', tagId);
            });

            // Add attachments
            attachments.forEach(file => {
                formDataToSend.append('issue[attachments][]', file);
            });

            const response = await axios.post(
                `https://${baseUrl}/issues.json?token=${token}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success('Issue created successfully!');
                navigate('/mobile-issues');
            }
        } catch (error) {
            console.error('Error creating issue:', error);
            toast.error('Failed to create issue');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Add Issue</h1>
                    <div className="w-6"></div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-4 pb-20">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter issue title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter issue description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Project Select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Project
                        </label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Milestone Select */}
                    {formData.projectId && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Milestone
                            </label>
                            <select
                                name="milestoneId"
                                value={formData.milestoneId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Select Milestone</option>
                                {milestones.map(milestone => (
                                    <option key={milestone.id} value={milestone.id}>
                                        {milestone.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Task Select */}
                    {formData.milestoneId && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Task
                            </label>
                            <select
                                name="taskId"
                                value={formData.taskId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Select Task</option>
                                {tasks.map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Assigned To */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Assigned To <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Issue Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Issue Type
                        </label>
                        <select
                            name="issueType"
                            value={formData.issueType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Type</option>
                            {issueTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        >
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Tags */}
                    {availableTags.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Tags
                            </label>
                            <div className="space-y-2">
                                {availableTags.map(tag => (
                                    <label key={tag.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.tags.includes(String(tag.id))}
                                            onChange={() => handleTagChange(String(tag.id))}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Attachments
                        </label>
                        <button
                            type="button"
                            onClick={handleAttachFile}
                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Click to attach files
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Display attached files */}
                        {attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-sm text-gray-600">{attachments.length} file(s) attached</p>
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-xs text-gray-700 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            {submitting ? 'Creating...' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIssueMobileView;
