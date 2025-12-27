import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    TextField,
    Slide,
    IconButton,
    InputAdornment
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { X, Upload, Trash2 } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { fetchFMUsers } from '../store/slices/fmUserSlice';
import MuiSelectField from './MuiSelectField';
import { toast } from 'sonner';
import axios from 'axios';
import { getFullUrl } from '../config/apiConfig';
import { Mention, MentionsInput } from 'react-mentions';
import MuiMultiSelect from './MuiMultiSelect';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface AddOpportunityModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({ open, onClose, onSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: fmUsersData } = useSelector((state: RootState) => state.fmUsers);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [tags, setTags] = useState([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prevTags, setPrevTags] = useState([]);

    console.log(responsiblePerson)

    // Mention state
    const [mentionUsers, setMentionUsers] = useState<any[]>([]);
    const [mentionTags, setMentionTags] = useState<any[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch mention users
    const fetchMentionUsers = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Asset`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMentionUsers(response.data.users || []);
        } catch (error) {
            console.log('Error fetching mention users:', error);
        }
    };

    // Fetch mention tags
    const fetchMentionTags = async () => {
        try {
            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMentionTags(response.data || []);
        } catch (error) {
            console.log('Error fetching mention tags:', error);
        }
    };

    // Fetch users and mentions on mount
    useEffect(() => {
        if (open) {
            dispatch(fetchFMUsers());
            fetchMentionUsers();
            fetchMentionTags();
        }
    }, [dispatch, open]);

    // Derived User Options
    const usersList = (fmUsersData as any)?.users || (fmUsersData as any)?.fm_users || [];
    const userOptions = mentionUsers.map((user: any) => ({
        label: `${user.full_name}`,
        value: user.id,
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleMultiSelectChange = (field: string, values: any) => {
        if (field === "tags") {
            setTags(values);
        }
    };

    const handleSubmit = async () => {
        if (!title) return toast.error('Title is required');
        if (!responsiblePerson) return toast.error('Responsible Person is required');

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('opportunity[title]', title);
            formData.append('opportunity[description]', description);
            formData.append('opportunity[responsible_person_id]', responsiblePerson);
            formData.append('opportunity[status]', 'open'); // Default status

            // Append tags
            tags.forEach((tagId: any) => {
                formData.append('opportunity[tag_ids][]', tagId.value);
            });

            // Append attachments
            attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });

            const token = localStorage.getItem('token');
            await axios.post(getFullUrl('/opportunities.json'), formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Content-Type is set automatically for FormData
                }
            });

            toast.success('Opportunity created successfully');
            if (onSuccess) onSuccess();
            onClose();

            // Reset form
            setTitle('');
            setDescription('');
            setResponsiblePerson('');
            setTags([]);
            setAttachments([]);

        } catch (error: any) {
            console.error('Error creating opportunity:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to create opportunity');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prepare mention data
    const mentionData = mentionUsers.length > 0
        ? mentionUsers.map((user: any) => ({
            id: user.id?.toString() || user.user_id?.toString(),
            display: user.full_name || user.name || 'Unknown User',
        }))
        : [];

    const tagData = mentionTags.length > 0
        ? mentionTags.map((tag: any) => ({
            id: tag.id?.toString(),
            display: tag.name,
        }))
        : [];

    // Mention styles
    const mentionStyles = {
        control: {
            fontSize: 14,
            backgroundColor: 'white',
            minHeight: 40,
        },
        highlighter: {
            overflow: 'hidden',
        },
        input: {
            margin: 0,
            padding: '8px 14px',
            outline: 'none',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
        },
        suggestions: {
            list: {
                backgroundColor: 'white',
                border: '1px solid #ccc',
                fontSize: 14,
                zIndex: 100,
                maxHeight: '150px',
                overflowY: 'auto' as const,
                borderRadius: '4px',
            },
            item: {
                padding: '5px 10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
            },
            itemFocused: {
                backgroundColor: '#01569E',
                color: 'white',
                fontWeight: 'bold',
            },
        },
    };

    const descriptionMentionStyles = {
        control: {
            fontSize: 14,
            backgroundColor: 'white',
            minHeight: 100,
        },
        highlighter: {
            overflow: 'hidden',
            padding: '8px 14px',
            border: '1px solid transparent',
        },
        input: {
            margin: 0,
            padding: '8px 14px',
            outline: 'none',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            minHeight: 100,
        },
        suggestions: {
            list: {
                backgroundColor: 'white',
                border: '1px solid #ccc',
                fontSize: 14,
                zIndex: 100,
                maxHeight: '150px',
                overflowY: 'auto' as const,
                borderRadius: '4px',
            },
            item: {
                padding: '5px 10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
            },
            itemFocused: {
                backgroundColor: '#01569E',
                color: 'white',
                fontWeight: 'bold',
            },
        },
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            fullScreen // Using fullScreen but limiting width with CSS as per example
            PaperProps={{
                style: {
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    height: '100%',
                    width: '35rem', // Fixed width side panel
                    margin: 0,
                    borderRadius: 0,
                    maxWidth: '100%'
                }
            }}
        >
            <DialogContent className="!p-0 flex flex-col h-full bg-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <Typography variant="h6" className="font-semibold text-center flex-1">
                        Add Opportunities
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </div>

                <div className="border-b border-[#E95420] w-full" />

                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-3">

                    {/* Title */}
                    <div>
                        <Typography variant="subtitle2" className="mb-2 font-medium">
                            Title <span className="text-red-500">*</span>
                        </Typography>
                        <MentionsInput
                            value={title}
                            onChange={(e, newValue) => setTitle(newValue)}
                            placeholder="Type @ to mention users. Type # to mention tags"
                            style={mentionStyles}
                            className="mentions-title"
                        >
                            <Mention
                                trigger="@"
                                data={mentionData}
                                markup="@[__display__](__id__)"
                                displayTransform={(id, display) => `@${display} `}
                                appendSpaceOnAdd
                            />
                            <Mention
                                trigger="#"
                                data={tagData}
                                markup="#[__display__](__id__)"
                                displayTransform={(id, display) => `#${display} `}
                                appendSpaceOnAdd
                            />
                        </MentionsInput>
                    </div>

                    {/* Description */}
                    <div>
                        <Typography variant="subtitle2" className="font-medium">
                            Description
                        </Typography>
                        <MentionsInput
                            value={description}
                            onChange={(e, newValue) => setDescription(newValue)}
                            placeholder="Type @ to mention users. Type # to mention tags"
                            style={descriptionMentionStyles}
                            className="mentions-description"
                        >
                            <Mention
                                trigger="@"
                                data={mentionData}
                                markup="@[__display__](__id__)"
                                displayTransform={(id, display) => `@${display} `}
                                appendSpaceOnAdd
                            />
                            <Mention
                                trigger="#"
                                data={tagData}
                                markup="#[__display__](__id__)"
                                displayTransform={(id, display) => `#${display} `}
                                appendSpaceOnAdd
                            />
                        </MentionsInput>
                    </div>

                    {/* Responsible Person */}
                    <div>
                        <Typography variant="subtitle2" className="mb-2 font-medium">
                            Responsible Person <span className="text-red-500">*</span>
                        </Typography>
                        <MuiSelectField
                            options={userOptions}
                            value={responsiblePerson}
                            onChange={(e) => setResponsiblePerson(e.target.value as string)}
                            fullWidth
                        />
                    </div>

                    <div>
                        <MuiMultiSelect
                            label="Tags"
                            options={mentionTags.map((tag) => ({ value: tag.id, label: tag.name, id: tag.id }))}
                            value={tags}
                            onChange={(values) => handleMultiSelectChange("tags", values)}
                            placeholder="Select Tags"
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <Typography variant="subtitle2" className="mb-2 font-medium">
                            Attachments
                        </Typography>
                        <div className="border rounded-md p-3 flex items-center justify-between bg-white">
                            <span className="text-gray-500 text-sm italic">
                                {attachments.length === 0 ? 'No Documents Attached' : `${attachments.length} file(s) attached`}
                            </span>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => fileInputRef.current?.click()}
                                sx={{ textTransform: 'none', bgcolor: '#C72030', '&:hover': { bgcolor: '#A01020' } }}
                            >
                                Attach Files
                            </Button>
                            <input
                                type="file"
                                hidden
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* File List */}
                        {attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border text-sm">
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                        <Trash2
                                            size={14}
                                            className="cursor-pointer text-gray-500 hover:text-red-500"
                                            onClick={() => handleRemoveAttachment(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex justify-center">
                    <Button
                        variant="outlined"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{
                            color: 'black',
                            borderColor: 'black',
                            borderRadius: 0,
                            minWidth: '120px',
                            textTransform: 'none',
                            borderWidth: '1px',
                            '&:hover': {
                                borderWidth: '1px',
                                borderColor: 'black',
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddOpportunityModal;
