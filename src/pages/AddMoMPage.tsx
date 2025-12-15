import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Switch,
    FormControlLabel,
    IconButton,
    Paper,
    Box,
    Checkbox
} from '@mui/material';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button as SButton } from '../components/ui/button'

import { AppDispatch, RootState } from '../store/store';
import { fetchFMUsers } from '../store/slices/fmUserSlice';
import { fetchProjectsTags } from '../store/slices/projectTagSlice';
import { createMoM } from '../store/slices/momSlice';
import MuiSelectField from '../components/MuiSelectField';
import { API_CONFIG } from '../config/apiConfig';
import { toast } from 'sonner';

// Define types for form data
interface Attendee {
    id: number;
    name?: string;
    email?: string;
    role?: string;
    organization?: string;
    // For internal attendees
    userId?: number | string;
    imp_mail?: boolean;
}

interface DiscussionPoint {
    id: number;
    description: string;
    raisedBy: string | number; // value (id or email)
    responsiblePerson: string | number; // userId
    endDate: string;
    isTask: boolean;
    tag: string | number; // tagId
}

interface FormData {
    title: string;
    date: string;
    time: string;
    meetingType: string;
    meetingMode: string;
    agendaItems: string;
    actionItems: string;
}

const AddMoMPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Redux Selectors
    const { data: fmUsersData } = useSelector((state: RootState) => state.fmUsers);
    const { projectTags: tagsData } = useSelector((state: RootState) => state.projectTags);

    // Local State
    const [formData, setFormData] = useState<FormData>({
        title: '',
        date: '',
        time: '',
        meetingType: '',
        meetingMode: '',
        agendaItems: '',
        actionItems: '',
    });

    const [isExternal, setIsExternal] = useState(false);
    const [internalAttendees, setInternalAttendees] = useState<Attendee[]>([{ id: Date.now() }]);
    const [externalAttendees, setExternalAttendees] = useState<Attendee[]>([{ id: Date.now() + 1 }]);
    const [points, setPoints] = useState<DiscussionPoint[]>([{
        id: Date.now(),
        description: '',
        raisedBy: '',
        responsiblePerson: '',
        endDate: '',
        isTask: false,
        tag: ''
    }]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const attachmentRef = useRef<HTMLInputElement>(null);

    // Fetch Data on Mount
    useEffect(() => {
        dispatch(fetchFMUsers());
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        if (token && baseUrl) {
            dispatch(fetchProjectsTags());
        }
    }, [dispatch]);

    // Derived Data
    const usersList = (fmUsersData as any)?.users || (fmUsersData as any)?.fm_users || [];
    const tagsList = Array.isArray(tagsData) ? tagsData : (tagsData as any)?.company_tags || [];

    const internalUserOptions = usersList.map((user: any) => ({
        label: `${user.full_name}`,
        value: user.id,
    }));

    const tagOptions = tagsList.map((tag: any) => ({
        label: tag.name,
        value: tag.id,
    }));

    const meetingTypeOptions = [
        { label: 'Internal', value: 'internal' },
        { label: 'Client', value: 'client' },
    ];

    const meetingModeOptions = [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
    ];

    // Handlers
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddAttendee = () => {
        if (isExternal) {
            setExternalAttendees(prev => [...prev, { id: Date.now() }]);
        } else {
            setInternalAttendees(prev => [...prev, { id: Date.now() }]);
        }
    };

    const handleRemoveAttendee = (index: number, isExt: boolean) => {
        if (isExt) {
            if (externalAttendees.length > 1) {
                setExternalAttendees(prev => prev.filter((_, i) => i !== index));
            } else {
                toast.error('At least one attendee is required');
            }
        } else {
            if (internalAttendees.length > 1) {
                setInternalAttendees(prev => prev.filter((_, i) => i !== index));
            } else {
                toast.error('At least one attendee is required');
            }
        }
    };

    const handleAttendeeChange = (index: number, field: keyof Attendee, value: any, isExt: boolean) => {
        if (isExt) {
            const updated = [...externalAttendees];
            updated[index] = { ...updated[index], [field]: value };
            setExternalAttendees(updated);
        } else {
            const updated = [...internalAttendees];
            updated[index] = { ...updated[index], [field]: value };
            setInternalAttendees(updated);
        }
    };

    const handleAddPoint = () => {
        setPoints(prev => [...prev, {
            id: Date.now(),
            description: '',
            raisedBy: '',
            responsiblePerson: '',
            endDate: '',
            isTask: false,
            tag: ''
        }]);
    };

    const handleRemovePoint = (index: number) => {
        if (points.length > 1) {
            setPoints(prev => prev.filter((_, i) => i !== index));
        } else {
            toast.error('At least one discussion point is required');
        }
    };

    const handlePointChange = (index: number, field: keyof DiscussionPoint, value: any) => {
        const updated = [...points];
        updated[index] = { ...updated[index], [field]: value };
        setPoints(updated);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...newFiles]);
        }
        if (attachmentRef.current) attachmentRef.current.value = '';
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const getRaisedByOptions = () => {
        const options: { label: string, value: string | number }[] = [];
        internalAttendees.forEach(att => {
            if (att.userId) {
                const u = usersList.find((user: any) => user.id === att.userId);
                if (u) {
                    options.push({ label: `${u.full_name}`, value: u.id });
                }
            }
        });
        externalAttendees.forEach(att => {
            if (att.name && att.email) {
                options.push({ label: att.name, value: att.email });
            }
        });
        return options.length > 0 ? options : [{ label: 'Select Attendees First', value: '' }];
    };

    const handleSubmit = async () => {
        if (!formData.title) return toast.error('Meeting Title is required');
        if (!formData.date) return toast.error('Meeting Date is required');

        // Helper to find Full User Object
        const findUser = (id: string | number) => usersList.find((u: any) => u.id === id);

        // Prepare Attendees
        // 1. Internal Attendees -> Map to unified structure
        const mappedInternal = internalAttendees
            .filter(a => a.userId)
            .map(a => {
                const u = findUser(a.userId!);
                return {
                    name: u ? `${u.firstname} ${u.lastname}` : 'Unknown',
                    email: u ? u.email : '',
                    organization: 'Internal', // Or get from user object if available
                    role: u ? u.role_name : '',
                    attendees_type: 'FmUser',
                    attendees_id: a.userId,
                    imp_mail: a.imp_mail || false
                };
            });

        // 2. External Attendees
        const mappedExternal = isExternal ? externalAttendees.filter(a => a.name && a.email).map(a => ({
            name: a.name,
            email: a.email,
            organization: a.organization || '',
            role: a.role || '',
            attendees_type: 'ExternalUser',
            attendees_id: null, // No ID for external usually
            imp_mail: a.imp_mail || false
        })) : [];

        const combinedUsers = [...mappedInternal, ...mappedExternal];

        const formDataPayload = new FormData();

        formDataPayload.append('mom_detail[title]', formData.title);
        formDataPayload.append('mom_detail[meeting_date]', formData.date);
        formDataPayload.append('mom_detail[meeting_time]', formData.time); // Added meeting_time as it was in form but missing in user snippet (user might have missed it or it's not needed, but safe to include)
        formDataPayload.append('mom_detail[meeting_type]', formData.meetingType);
        formDataPayload.append('mom_detail[meeting_mode]', formData.meetingMode);

        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                formDataPayload.append('mom_detail[created_by_id]', userObj.id);
            } catch (e) { console.error("Error parsing user from localstorage", e) }
        }

        combinedUsers.forEach((user: any, index) => {
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][name]`, user.name || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][email]`, user.email || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][organization]`, user.organization || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][imp_mail]`, user.imp_mail);
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][role]`, user.role || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][attendees_type]`, user.attendees_type);
            if (user.attendees_id) {
                formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][attendees_id]`, user.attendees_id);
            }
        });

        points.forEach((point, index) => {
            // Find responsible person object
            const respUser = findUser(point.responsiblePerson);
            // Find raised by label (It could be user ID or external email)
            // If it's a number, it's an internal user ID. If string, it's external email/name.
            let raisedByLabel = '';
            if (typeof point.raisedBy === 'number') {
                const u = findUser(point.raisedBy);
                raisedByLabel = u ? `${u.firstname} ${u.lastname}` : String(point.raisedBy);
            } else {
                // Try to find if the string value matches an internal user ID (unlikely given logic but safe)
                // or just use the label from options?
                // The point.raisedBy value for internal is ID. For external it's email.
                // The API expects 'raised_by' as a string (name?).
                // Let's rely on getRaisedByOptions to find the label if possible? No, referencing state directly is better.

                // Re-calculate the label logic essentially:
                const internalMatch = internalAttendees.find(a => a.userId === point.raisedBy);
                if (internalMatch && internalMatch.userId) {
                    const u = findUser(internalMatch.userId);
                    raisedByLabel = u ? `${u.firstname} ${u.lastname}` : '';
                } else {
                    // Must be external
                    const extMatch = externalAttendees.find(a => a.email === point.raisedBy);
                    raisedByLabel = extMatch ? extMatch.name || '' : String(point.raisedBy);
                }

                // Fallback if logic above is too complex or mapped differently:
                // The Select component stores 'value'.
                // We can try to look it up in 'raisedByOptions' but that is derived in render.
                // Simpler: Just check if it's in usersList for internal name, else external name.
                const u = findUser(point.raisedBy);
                if (u) raisedByLabel = `${u.firstname} ${u.lastname}`;
                else {
                    // Check external attendees by email
                    const ext = externalAttendees.find(e => e.email === point.raisedBy);
                    raisedByLabel = ext ? ext.name || '' : String(point.raisedBy);
                }
            }

            // Tag object
            const tagObj = tagsList.find((t: any) => t.id === point.tag);

            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][description]`, point.description || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][raised_by]`, raisedByLabel);

            if (respUser) {
                formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_id]`, respUser.id);
                formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_name]`, `${respUser.firstname} ${respUser.lastname}`);
                formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_type]`, respUser.user_type || 'FmUser'); // Fallback to FmUser
                formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_email]`, respUser.email);
            }

            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][target_date]`, point.endDate || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][status]`, 'open');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][save_task]`, point.isTask ? 'true' : 'false');

            if (tagObj) {
                formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][company_tag_id]`, tagObj.id);
            }
        });

        if (attachments.length > 0) {
            for (let i = 0; i < attachments.length; i++) {
                formDataPayload.append('attachments[]', attachments[i]);
            }
        }

        try {
            await dispatch(createMoM(formDataPayload)).unwrap();
            toast.success('Minute of Meeting Created Successfully');
            navigate(-1);
        } catch (error) {
            console.error('Failed to create MoM:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to create meeting minutes');
        }
    };

    const raisedByOptions = getRaisedByOptions();

    return (
        <div className="h-full overflow-y-auto bg-white p-6 font-sans">
            <SButton
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </SButton>

            <Paper elevation={0} className="my-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <div className='w-full'>
                            <Typography variant="subtitle2" className="mb-1">
                                Meeting Title <span className="text-red-500">*</span>
                            </Typography>
                            <TextField
                                placeholder="Enter meeting Title"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <Typography variant="subtitle2" className="mb-1">Meeting Type</Typography>
                                <MuiSelectField
                                    // label="Select Meeting Type"
                                    options={meetingTypeOptions}
                                    value={formData.meetingType}
                                    onChange={(e) => handleInputChange('meetingType', e.target.value as string)}
                                    fullWidth
                                />
                            </div>
                            <div className="flex-1">
                                <Typography variant="subtitle2" className="mb-1">
                                    Meeting Mode <span className="text-red-500">*</span>
                                </Typography>
                                <MuiSelectField
                                    // label="Select Meeting Mode"
                                    options={meetingModeOptions}
                                    value={formData.meetingMode}
                                    onChange={(e) => handleInputChange('meetingMode', e.target.value as string)}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                            <Typography variant="subtitle2" className="mb-1">
                                Meeting Date <span className="text-red-500">*</span>
                            </Typography>
                            <TextField
                                type="date"
                                placeholder="dd/mm/yyyy"
                                fullWidth
                                size="small"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                            />
                        </div>
                        <div className="flex-1">
                            <Typography variant="subtitle2" className="mb-1">
                                Meeting Time <span className="text-red-500">*</span>
                            </Typography>
                            <TextField
                                type="time"
                                fullWidth
                                size="small"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b border-dashed border-red-500 mb-8 opacity-50"></div>

                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">

                        <div className="flex items-center gap-3 pb-2">
                            <span className={`text-sm font-medium ${!isExternal ? 'text-black' : 'text-gray-500'}`}>Internal</span>
                            <Switch
                                checked={isExternal}
                                onChange={(e) => setIsExternal(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#C72030',
                                        '& + .MuiSwitch-track': { backgroundColor: '#C72030', opacity: 1 },
                                    },
                                    '& .MuiSwitch-track': { backgroundColor: '#9ca3af', opacity: 1 }
                                }}
                            />
                            <span className={`text-sm font-medium ${isExternal ? 'text-black' : 'text-gray-500'}`}>Client</span>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            {isExternal ? (
                                externalAttendees.map((attendee, index) => (
                                    <div key={attendee.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                        <div className="sm:col-span-3">
                                            <Typography variant="subtitle2" className="mb-1">External User Name <span className="text-red-500">*</span></Typography>
                                            <TextField
                                                placeholder="Name"
                                                fullWidth size="small"
                                                value={attendee.name || ''}
                                                onChange={(e) => handleAttendeeChange(index, 'name', e.target.value, true)}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <Typography variant="subtitle2" className="mb-1">Email ID <span className="text-red-500">*</span></Typography>
                                            <TextField
                                                placeholder="Email"
                                                type="email"
                                                fullWidth size="small"
                                                value={attendee.email || ''}
                                                onChange={(e) => handleAttendeeChange(index, 'email', e.target.value, true)}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Typography variant="subtitle2" className="mb-1">Role</Typography>
                                            <TextField
                                                placeholder="Role"
                                                fullWidth size="small"
                                                value={attendee.role || ''}
                                                onChange={(e) => handleAttendeeChange(index, 'role', e.target.value, true)}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <Typography variant="subtitle2" className="mb-1">Organization</Typography>
                                            <TextField
                                                placeholder="Organization"
                                                fullWidth size="small"
                                                value={attendee.organization || ''}
                                                onChange={(e) => handleAttendeeChange(index, 'organization', e.target.value, true)}
                                            />
                                        </div>
                                        <div className="sm:col-span-1 flex justify-center pb-1">
                                            <IconButton onClick={() => handleRemoveAttendee(index, true)} color="error" disabled={externalAttendees.length === 1}>
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                internalAttendees.map((attendee, index) => (
                                    <div key={attendee.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                        <div className="sm:col-span-6 lg:max-w-md">
                                            <Typography variant="subtitle2" className="mb-1">Select Internal User <span className="text-red-500">*</span></Typography>
                                            <MuiSelectField
                                                // label="User"
                                                options={internalUserOptions}
                                                value={attendee.userId || ''}
                                                onChange={(e) => handleAttendeeChange(index, 'userId', e.target.value, false)}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="sm:col-span-1 flex justify-start pb-1">
                                            <IconButton onClick={() => handleRemoveAttendee(index, false)} color="error" disabled={internalAttendees.length === 1}>
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="self-end pb-1">
                            <Button
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#C72030',
                                    color: '#C72030',
                                    '&:hover': { borderColor: '#A01020', bgcolor: 'rgba(199, 32, 48, 0.04)' }
                                }}
                                startIcon={<Plus size={18} />}
                                onClick={handleAddAttendee}
                            >
                                Add More
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-b border-dashed border-red-500 mb-8 opacity-50"></div>

                <div className="mb-8 space-y-10">
                    {points.map((point, index) => (
                        <div key={point.id} className="relative">

                            <div className="flex justify-between items-center mb-1">
                                <Typography variant="subtitle2" color="text.primary">
                                    Point {index + 1} <span className="text-red-500">*</span>
                                </Typography>
                                <IconButton
                                    onClick={() => handleRemovePoint(index)}
                                    color="error"
                                    size="small"
                                    disabled={points.length === 1}
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-6 flex gap-4">
                                    <div className="flex-1">
                                        <TextField
                                            multiline
                                            rows={6}
                                            fullWidth
                                            placeholder="Enter description here"
                                            value={point.description}
                                            onChange={(e) => handlePointChange(index, 'description', e.target.value)}
                                            variant="outlined"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    height: "auto !important",
                                                    padding: "16px !important",
                                                    display: "flex",
                                                    bgcolor: 'white'
                                                },
                                                "& .MuiInputBase-input": {
                                                    resize: "none !important",
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={point.isTask}
                                                    onChange={(e) => handlePointChange(index, 'isTask', e.target.checked)}
                                                    sx={{
                                                        color: '#9ca3af',
                                                        '&.Mui-checked': { color: '#C72030' },
                                                    }}
                                                />
                                            }
                                            label={<span className="text-sm font-medium text-gray-700">Convert to task</span>}
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                                    <div>
                                        <Typography variant="subtitle2" className="mb-1">
                                            Raised by <span className="text-red-500">*</span>
                                        </Typography>
                                        <MuiSelectField
                                            // label="Select Raised By"
                                            options={raisedByOptions}
                                            value={point.raisedBy}
                                            onChange={(e) => handlePointChange(index, 'raisedBy', e.target.value as string)}
                                            fullWidth
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="subtitle2" className="mb-1">
                                            Responsible Person <span className="text-red-500">*</span>
                                        </Typography>
                                        <MuiSelectField
                                            // label="Select..."
                                            options={internalUserOptions}
                                            value={point.responsiblePerson}
                                            onChange={(e) => handlePointChange(index, 'responsiblePerson', e.target.value as string)}
                                            fullWidth
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="subtitle2" className="mb-1">
                                            End Date <span className="text-red-500">*</span>
                                        </Typography>
                                        <TextField
                                            type="date"
                                            placeholder="dd/mm/yyyy"
                                            fullWidth
                                            size="small"
                                            value={point.endDate}
                                            onChange={(e) => handlePointChange(index, 'endDate', e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                                        />
                                    </div>

                                    <div>
                                        <Typography variant="subtitle2" className="mb-1">
                                            Tags <span className="text-red-500">*</span>
                                        </Typography>
                                        <MuiSelectField
                                            // label="Select..."
                                            options={tagOptions}
                                            value={point.tag}
                                            onChange={(e) => handlePointChange(index, 'tag', e.target.value as string)}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div>
                        <Button
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                borderColor: '#C72030',
                                color: '#C72030',
                                '&:hover': { borderColor: '#A01020', bgcolor: 'rgba(199, 32, 48, 0.04)' }
                            }}
                            startIcon={<Plus size={18} />}
                            onClick={handleAddPoint}
                        >
                            Add New Point
                        </Button>
                    </div>
                </div>

                <div className="border-b border-dashed border-red-500 mb-8 opacity-50"></div>

                <div className="mb-8">
                    <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                        {attachments.length} Document(s) Attached
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-4">
                        Drop or attach relevant documents here
                    </Typography>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {attachments.map((file, index) => (
                            <div key={index} className="w-40 border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-28 bg-gray-100 relative flex items-center justify-center">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                        </div>
                                    )}

                                    <button
                                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded transition-colors"
                                        onClick={() => handleRemoveAttachment(index)}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                <div className="p-2 text-center border-t border-gray-100">
                                    <Typography variant="caption" className="block truncate font-medium text-gray-700 text-xs" title={file.name}>
                                        {file.name}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderColor: '#C72030',
                            color: '#C72030',
                            fontWeight: 500,
                            padding: '6px 20px',
                            '&:hover': { borderColor: '#A01020', bgcolor: 'rgba(199, 32, 48, 0.04)' }
                        }}
                        onClick={() => attachmentRef.current?.click()}
                    >
                        Attach Files( Max 10 MB )
                    </Button>

                    <input
                        type="file"
                        multiple
                        hidden
                        ref={attachmentRef}
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-center mt-12 pb-12">
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: '#C72030',
                            '&:hover': { bgcolor: '#A01020' },
                            width: 200,
                            height: 48,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(199, 32, 48, 0.2)'
                        }}
                    >
                        Create Meeting
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default AddMoMPage;
